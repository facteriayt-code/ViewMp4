import { Movie } from '../types.ts';
import { supabase } from './supabaseClient.ts';

/**
 * FULL DATABASE & STORAGE SETUP (Run this in Supabase SQL Editor):
 * 
 * -- 1. Create the movies table
 * create table if not exists public.movies (
 *   id uuid default gen_random_uuid() primary key,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   title text not null,
 *   description text,
 *   thumbnail text,
 *   video_url text,
 *   genre text,
 *   year integer,
 *   rating text default 'NR',
 *   views bigint default 0,
 *   is_user_uploaded boolean default true,
 *   uploader_id uuid references auth.users(id) on delete cascade,
 *   uploader_name text
 * );
 * 
 * -- 2. Enable Row Level Security
 * alter table public.movies enable row level security;
 * 
 * -- 3. Create Table Policies
 * create policy "Allow public read access" on public.movies for select using (true);
 * create policy "Allow individual insert" on public.movies for insert with check (auth.uid() = uploader_id);
 * create policy "Allow individual update" on public.movies for update using (auth.uid() = uploader_id);
 * create policy "Allow individual delete" on public.movies for delete using (auth.uid() = uploader_id);
 * 
 * -- 4. Create the view increment function
 * create or replace function public.increment_views(movie_id uuid)
 * returns void as $$
 * begin
 *   update public.movies set views = views + 1 where id = movie_id;
 * end;
 * $$ language plpgsql security definer;
 * 
 * -- 5. Storage Bucket Setup (Public Buckets)
 * insert into storage.buckets (id, name, public) values ('videos', 'videos', true), ('thumbnails', 'thumbnails', true)
 * on conflict (id) do update set public = true;
 * 
 * -- 6. Storage Policies
 * create policy "Public Access" on storage.objects for select using (bucket_id in ('videos', 'thumbnails'));
 * create policy "Authenticated Manage" on storage.objects for all using (bucket_id in ('videos', 'thumbnails') AND auth.role() = 'authenticated');
 */

export const saveVideoToCloud = async (
  movieMetadata: Partial<Movie>, 
  videoFile?: File | null, 
  thumbnailFile?: File | null,
  onProgress?: (progress: number) => void
): Promise<Movie> => {
  
  const uploadFile = async (bucket: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error(`Storage Error [${bucket}]:`, error);
      if (error.message.includes('row-level security') || error.message.includes('403') || error.message.includes('Policy')) {
        throw new Error(`STORAGE_RLS_ERROR: ${bucket}. Ensure bucket is Public and Policies are set.`);
      }
      throw new Error(`Storage Error (${bucket}): ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  try {
    let finalThumbnailUrl = movieMetadata.thumbnail;
    let finalVideoUrl = movieMetadata.videoUrl;

    if (thumbnailFile) {
      finalThumbnailUrl = await uploadFile('thumbnails', thumbnailFile);
    }
    
    if (videoFile) {
      if (onProgress) onProgress(10);
      finalVideoUrl = await uploadFile('videos', videoFile);
      if (onProgress) onProgress(80);
    }

    if (!finalVideoUrl) throw new Error("Missing video source.");

    // Update existing movie
    if (movieMetadata.id) {
       const { data, error: updateError } = await supabase
        .from('movies')
        .update({
          title: movieMetadata.title,
          description: movieMetadata.description,
          genre: movieMetadata.genre,
          thumbnail: finalThumbnailUrl,
          video_url: finalVideoUrl
        })
        .eq('id', movieMetadata.id)
        .eq('uploader_id', movieMetadata.uploaderId)
        .select();
        
      if (updateError) {
        if (updateError.code === '42501') throw new Error("DATABASE_RLS_ERROR: UPDATE permission denied.");
        throw updateError;
      }
      if (!data || data.length === 0) throw new Error("DATABASE_RLS_ERROR: Update failed (check ownership).");
      
      return mapDbToMovie(data[0]);
    }

    // Insert new movie
    const payload = {
      title: movieMetadata.title || 'Untitled',
      description: movieMetadata.description || '',
      thumbnail: finalThumbnailUrl,
      video_url: finalVideoUrl,
      genre: movieMetadata.genre || 'Viral',
      year: movieMetadata.year || new Date().getFullYear(),
      rating: movieMetadata.rating || 'NR',
      views: 0,
      is_user_uploaded: true,
      uploader_id: movieMetadata.uploaderId,
      uploader_name: movieMetadata.uploaderName || 'Anonymous'
    };

    const { data, error: dbError } = await supabase
      .from('movies')
      .insert([payload])
      .select();

    if (dbError) {
       if (dbError.code === '42501') throw new Error("DATABASE_RLS_ERROR: INSERT permission denied.");
       throw dbError;
    }
    if (!data || data.length === 0) throw new Error("DATABASE_RLS_ERROR: Insert failed.");
    
    return mapDbToMovie(data[0]);
  } catch (error: any) {
    console.error("Upload Operation Error:", error);
    throw error;
  }
};

export const deleteVideoFromCloud = async (movieId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { error } = await supabase
    .from('movies')
    .delete()
    .eq('id', movieId)
    .eq('uploader_id', user.id);

  if (error) throw new Error(`DATABASE_RLS_ERROR: DELETE`);
};

export const incrementMovieView = async (movieId: string) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(movieId);
  if (!isUuid) return;
  try {
    await supabase.rpc('increment_views', { movie_id: movieId });
  } catch (err) {}
};

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });
  return (data || []).map(mapDbToMovie);
};

const mapDbToMovie = (item: any): Movie => ({
  id: item.id,
  title: item.title,
  description: item.description,
  thumbnail: item.thumbnail,
  videoUrl: item.video_url,
  genre: item.genre,
  year: item.year,
  rating: item.rating,
  views: Number(item.views) || 0,
  isUserUploaded: item.is_user_uploaded,
  uploaderId: item.uploader_id,
  uploaderName: item.uploader_name
});