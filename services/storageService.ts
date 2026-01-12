
import { Movie } from '../types.ts';
import { supabase } from './supabaseClient.ts';

/**
 * Handles Video and Thumbnail uploads using Supabase Storage.
 */
export const saveVideoToCloud = async (
  movieMetadata: Partial<Movie>, 
  videoFile: File, 
  thumbnailFile: File,
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
        throw new Error(`Permission Denied: You must enable 'INSERT' RLS policies for the '${bucket}' bucket in Supabase Storage.`);
      }
      throw new Error(`Storage Error (${bucket}): ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  try {
    // 1. Upload Thumbnail
    const thumbnailUrl = await uploadFile('thumbnails', thumbnailFile);
    
    // 2. Upload Video
    if (onProgress) onProgress(50);
    const videoUrl = await uploadFile('videos', videoFile);
    if (onProgress) onProgress(100);

    // 3. Insert metadata into 'movies' table
    // Ensure all keys match the Snake Case columns in Supabase
    const payload = {
      title: movieMetadata.title,
      description: movieMetadata.description || '',
      thumbnail: thumbnailUrl,
      video_url: videoUrl,
      genre: movieMetadata.genre,
      year: movieMetadata.year || new Date().getFullYear(),
      rating: movieMetadata.rating || 'NR',
      views: 0,
      is_user_uploaded: true,
      uploader_id: movieMetadata.uploaderId,
      uploader_name: movieMetadata.uploaderName
    };

    const { data, error: dbError } = await supabase
      .from('movies')
      .insert([payload])
      .select()
      .single();

    if (dbError) {
      console.error("Database Insert Error details:", dbError);
      if (dbError.message.includes('column')) {
         throw new Error(`Database Schema Error: The column '${dbError.message.split("'")[1]}' is missing. Please run the SQL setup script in your Supabase dashboard.`);
      }
      if (dbError.message.includes('schema cache')) {
         throw new Error("Supabase Schema Cache error: You just updated the database! Please wait 30 seconds and refresh the page.");
      }
      throw new Error(`Database Error: ${dbError.message}`);
    }

    return mapDbToMovie(data);
  } catch (error: any) {
    console.error("Supabase Operation Failed:", error);
    throw error;
  }
};

/**
 * Increments movie views in Supabase using the RPC function.
 */
export const incrementMovieView = async (movieId: string) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(movieId);
  if (!isUuid) return;

  try {
    const { error: rpcError } = await supabase.rpc('increment_views', { movie_id: movieId });
    
    if (rpcError) {
      // Fallback manual update if RPC is missing
      const { data: current } = await supabase.from('movies').select('views').eq('id', movieId).single();
      if (current) {
        await supabase.from('movies').update({ views: (Number(current.views) || 0) + 1 }).eq('id', movieId);
      }
    }
  } catch (err) {
    console.error("Failed to increment view:", err);
  }
};

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Fetch Error:", error);
    return [];
  }

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
