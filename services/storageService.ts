
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
 * Increments movie views in Supabase using the RPC function.
 */
export const incrementMovieView = async (movieId: string) => {
  // Simple check to see if it's a UUID (Supabase default) or a numeric string (INITIAL_MOVIES)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(movieId);
  
  // We only increment views for cloud-stored movies (UUIDs)
  if (!isUuid) {
    console.debug("Skipping view increment for local static movie.");
    return;
  }

  try {
    // 1. Try to use the RPC function (recommended)
    const { error: rpcError } = await supabase.rpc('increment_views', { movie_id: movieId });
    
    if (rpcError) {
      console.warn("RPC increment_views failed, attempting manual fallback:", rpcError.message);
      
      // 2. Fallback: Manual update if RPC is not set up
      const { data: current, error: fetchError } = await supabase
        .from('movies')
        .select('views')
        .eq('id', movieId)
        .single();
        
      if (!fetchError && current) {
        const nextViews = (Number(current.views) || 0) + 1;
        await supabase
          .from('movies')
          .update({ views: nextViews })
          .eq('id', movieId);
      } else {
        console.error("Manual fallback also failed:", fetchError);
      }
    } else {
      console.log("View successfully incremented for:", movieId);
    }
  } catch (err) {
    console.error("Critical failure during view increment:", err);
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
