
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
 * Optimized for the 'increment_views' SQL function.
 */
export const incrementMovieView = async (movieId: string) => {
  // Check if it's a valid UUID (Supabase ID) or a local ID (like '1', '2')
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(movieId);
  if (!isUuid) return;

  try {
    // Attempt RPC call first (Atomic increment)
    const { error: rpcError } = await supabase.rpc('increment_views', { movie_id: movieId });
    
    if (rpcError) {
      console.warn("RPC failed, falling back to manual update. Make sure to run the SQL setup script.", rpcError);
      // Fallback: Manual increment
      const { data: current } = await supabase
        .from('movies')
        .select('views')
        .eq('id', movieId)
        .single();
        
      if (current) {
        await supabase
          .from('movies')
          .update({ views: (Number(current.views) || 0) + 1 })
          .eq('id', movieId);
      }
    }
  } catch (err) {
    console.error("View tracking error:", err);
  }
};

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDbToMovie);
  } catch (err) {
    console.error("Fetch Cloud Videos Error:", err);
    return [];
  }
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
