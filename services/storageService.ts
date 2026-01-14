import { Movie } from '../types.ts';
import { supabase } from './supabaseClient.ts';

/**
 * Handles Video and Thumbnail saving. Supports both raw file uploads and direct URLs.
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
      if (error.message.includes('row-level security')) {
        throw new Error(`Permission Denied: You must enable 'INSERT' and 'UPDATE' RLS policies for the '${bucket}' bucket in Supabase Storage.`);
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

    // 1. Handle File Uploads
    if (thumbnailFile) {
      finalThumbnailUrl = await uploadFile('thumbnails', thumbnailFile);
    }
    
    if (videoFile) {
      if (onProgress) onProgress(30);
      finalVideoUrl = await uploadFile('videos', videoFile);
      if (onProgress) onProgress(80);
    }

    if (!finalVideoUrl) {
      throw new Error("A video source (file or link) is required.");
    }

    // Fallback for missing thumbnail
    if (!finalThumbnailUrl) {
      finalThumbnailUrl = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop';
    }

    // Determine if we are updating or inserting
    if (movieMetadata.id) {
       // Pre-verify that we have an uploaderId to match against
       if (!movieMetadata.uploaderId) {
         throw new Error("Authentication context missing. Re-login and try again.");
       }

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
        .eq('uploader_id', movieMetadata.uploaderId) // Ensure user owns the record
        .select();
        
      if (updateError) throw updateError;
      
      // If data is empty, the .eq('uploader_id') or RLS policy likely blocked the update
      if (!data || data.length === 0) {
        throw new Error(
          "Update failed. This usually means your Supabase 'UPDATE' policy for the 'movies' table is missing or restricted. " +
          "Ensure RLS is set to: 'USING (auth.uid() = uploader_id)'."
        );
      }
      
      if (onProgress) onProgress(100);
      return mapDbToMovie(data[0]);
    }

    // Logic for new insertion
    const payload = {
      title: movieMetadata.title || 'Untitled Video',
      description: movieMetadata.description || '',
      thumbnail: finalThumbnailUrl,
      video_url: finalVideoUrl,
      genre: movieMetadata.genre || 'General',
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

    if (dbError) throw dbError;
    if (!data || data.length === 0) {
      throw new Error("Failed to retrieve the created movie record. Check your Supabase 'INSERT' RLS policies.");
    }
    
    if (onProgress) onProgress(100);
    return mapDbToMovie(data[0]);
  } catch (error: any) {
    console.error("Supabase Operation Failed:", error);
    throw error;
  }
};

/**
 * Deletes a video from the database.
 */
export const deleteVideoFromCloud = async (movieId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to delete content.");

  const { error } = await supabase
    .from('movies')
    .delete()
    .eq('id', movieId)
    .eq('uploader_id', user.id); // Extra safety check

  if (error) {
    console.error("Delete Error:", error);
    throw new Error(`Failed to delete: ${error.message}. Ensure your 'DELETE' RLS policy is enabled.`);
  }
};

/**
 * Increments movie views in Supabase.
 */
export const incrementMovieView = async (movieId: string) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(movieId);
  
  if (!isUuid) return;

  try {
    const { error: rpcError } = await supabase.rpc('increment_views', { movie_id: movieId });
    if (!rpcError) return;

    const { data: current, error: fetchError } = await supabase
      .from('movies')
      .select('views')
      .eq('id', movieId);
      
    if (!fetchError && current && current.length > 0) {
      const nextViews = (Number(current[0].views) || 0) + 1;
      await supabase
        .from('movies')
        .update({ views: nextViews })
        .eq('id', movieId);
    }
  } catch (err) {
    console.error("View increment system error:", err);
  }
};

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
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