import { Movie } from '../types.ts';
import { supabase } from './supabaseClient.ts';
import { s3Client, BUCKET_NAME, PUBLIC_URL_BASE } from './s3Client.ts';
import { Upload } from "@aws-sdk/lib-storage";

/**
 * Handles Large File Uploads via Multi-part S3 Upload
 * Stores metadata in the user's provided Supabase instance.
 */
export const saveVideoToCloud = async (
  movieMetadata: Partial<Movie>, 
  videoFile: File, 
  thumbnailFile: File,
  onProgress?: (progress: number) => void
): Promise<Movie> => {
  
  const performUpload = async (file: File, key: string) => {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: file.type,
      },
      queueSize: 4, 
      partSize: 1024 * 1024 * 5, // 5MB chunks
      leavePartsOnError: false,
    });

    upload.on("httpUploadProgress", (progress) => {
      if (onProgress && key.startsWith('videos/')) {
        const percentage = Math.round((progress.loaded! / progress.total!) * 100);
        onProgress(percentage);
      }
    });

    await upload.done();
    return `${PUBLIC_URL_BASE}/${key}`;
  };

  try {
    const timestamp = Date.now();
    const videoKey = `videos/${timestamp}-${videoFile.name.replace(/\s+/g, '_')}`;
    const thumbKey = `thumbnails/${timestamp}-${thumbnailFile.name.replace(/\s+/g, '_')}`;

    const [videoUrl, thumbnailUrl] = await Promise.all([
      performUpload(videoFile, videoKey),
      performUpload(thumbnailFile, thumbKey)
    ]);

    const { data, error: dbError } = await supabase
      .from('movies')
      .insert([{
        title: movieMetadata.title,
        description: movieMetadata.description,
        thumbnail: thumbnailUrl,
        video_url: videoUrl,
        genre: movieMetadata.genre,
        year: movieMetadata.year,
        rating: movieMetadata.rating,
        views: 0,
        is_user_uploaded: true,
        uploader_id: movieMetadata.uploaderId,
        uploader_name: movieMetadata.uploaderName
      }])
      .select()
      .single();

    if (dbError) throw new Error(`DB Error: ${dbError.message}`);

    return mapDbToMovie(data);
  } catch (error: any) {
    console.error("S3/R2 Upload Failure:", error);
    throw error;
  }
};

/**
 * Increments movie views in Supabase.
 * Only works for movies stored in the database.
 */
export const incrementMovieView = async (movieId: string) => {
  // Simple regex to check if it's likely a UUID from Supabase vs a string '1' from INITIAL_MOVIES
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(movieId);
  if (!isUuid) return;

  try {
    const { error: rpcError } = await supabase.rpc('increment_views', { movie_id: movieId });
    
    if (rpcError) {
      // Fallback: Manual increment if RPC function hasn't been created yet
      const { data: current } = await supabase.from('movies').select('views').eq('id', movieId).single();
      if (current) {
        await supabase.from('movies').update({ views: (current.views || 0) + 1 }).eq('id', movieId);
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
  views: item.views || 0,
  isUserUploaded: item.is_user_uploaded,
  uploaderId: item.uploader_id,
  uploaderName: item.uploader_name
});