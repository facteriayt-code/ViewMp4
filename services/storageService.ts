
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
    const payload = {
      title: movieMetadata.title || 'Untitled Video',
      description: movieMetadata.description || '',
      thumbnail: thumbnailUrl,
      video_url: videoUrl,
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
      .select()
      .single();

    if (dbError) {
      console.error("Database Insert Error details:", dbError);
      throw new Error(`Database Error: ${dbError.message}`);
    }

    return mapDbToMovie(data);
  } catch (error: any) {
    console.error("Supabase Operation Failed:", error);
    throw error;
  }
};

/**
 * Increments movie views in Supabase.
 * It first tries the optimized RPC function, then falls back to a direct update.
 */
export const incrementMovieView = async (movieId: string) => {
  // Regex to check if ID is a valid UUID (Supabase generated)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(movieId);
  
  if (!isUuid) {
    console.debug("Local movie detected. Skipping cloud view increment.");
    return;
  }

  try {
    // Attempt 1: Using RPC (Atomic increment on server)
    const { error: rpcError } = await supabase.rpc('increment_views', { movie_id: movieId });
    
    if (!rpcError) {
      console.log("View successfully counted (RPC)");
      return;
    }

    // Attempt 2: Direct update fallback if RPC fails
    console.warn("RPC failed, trying direct increment fallback...");
    const { data: current, error: fetchError } = await supabase
      .from('movies')
      .select('views')
      .eq('id', movieId)
      .single();
      
    if (!fetchError && current) {
      const nextViews = (Number(current.views) || 0) + 1;
      const { error: updateError } = await supabase
        .from('movies')
        .update({ views: nextViews })
        .eq('id', movieId);
        
      if (updateError) {
        console.error("Direct view update failed:", updateError.message);
      } else {
        console.log("View counted via Direct Update");
      }
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
