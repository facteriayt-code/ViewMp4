import { Movie } from '../types.ts';
import { supabase } from './supabaseClient.ts';

// High-quality fallback if everything else fails
const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop';

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
      throw new Error(`Cloud Storage Failure (${bucket}): ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  try {
    // 1. Resolve Thumbnail URL
    let finalThumbnailUrl = movieMetadata.thumbnail;

    // If a new thumbnail file was provided (manual OR auto-extracted first-frame)
    if (thumbnailFile) {
      finalThumbnailUrl = await uploadFile('thumbnails', thumbnailFile);
    }
    
    // Safety check: ensure finalThumbnailUrl is NEVER null or empty string to avoid DB constraint violation
    // This is critical to fix the "null value in column 'thumbnail'" error.
    if (!finalThumbnailUrl || finalThumbnailUrl.trim() === "") {
      finalThumbnailUrl = DEFAULT_THUMBNAIL;
    }

    // 2. Resolve Video URL
    let finalVideoUrl = movieMetadata.videoUrl;
    if (videoFile) {
      if (onProgress) onProgress(10);
      finalVideoUrl = await uploadFile('videos', videoFile);
      if (onProgress) onProgress(80);
    }

    if (!finalVideoUrl) throw new Error("A valid video source is required for deployment.");

    // 3. Update or Insert Database Record
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
        
      if (updateError) throw updateError;
      if (!data || data.length === 0) throw new Error("The update signal was not received by the server.");
      
      return mapDbToMovie(data[0]);
    }

    const payload = {
      title: movieMetadata.title || 'Untitled Broadcast',
      description: movieMetadata.description || 'No data provided.',
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
      console.error("Database Insert Error:", dbError);
      throw new Error(`Metadata Deployment Failed: ${dbError.message}`);
    }
    
    if (!data || data.length === 0) throw new Error("Metadata was rejected by the cloud server.");
    
    return mapDbToMovie(data[0]);
  } catch (error: any) {
    console.error("Cloud Operation Error:", error);
    throw error;
  }
};

export const deleteVideoFromCloud = async (movieId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required.");

  const { error } = await supabase
    .from('movies')
    .delete()
    .eq('id', movieId)
    .eq('uploader_id', user.id);

  if (error) throw new Error(`DATABASE_ERROR: DELETE`);
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