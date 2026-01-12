
import { Movie } from '../types.ts';
import { supabase } from './supabaseClient.ts';
import { s3Client, BUCKET_NAME, PUBLIC_URL_BASE } from './s3Client.ts';
import { Upload } from "@aws-sdk/lib-storage";

/**
 * Handles Large File Uploads via Multi-part S3 Upload
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

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      videoUrl: data.video_url,
      genre: data.genre,
      year: data.year,
      rating: data.rating,
      views: data.views || 0,
      isUserUploaded: data.is_user_uploaded,
      uploaderId: data.uploader_id,
      uploaderName: data.uploader_name
    };
  } catch (error: any) {
    console.error("S3/R2 Upload Failure:", error);
    throw error;
  }
};

export const incrementMovieView = async (movieId: string) => {
  // Use Postgres function or direct increment if available
  // Conceptually: UPDATE movies SET views = views + 1 WHERE id = movieId
  try {
    const { data: current } = await supabase.from('movies').select('views').eq('id', movieId).single();
    if (current) {
      await supabase.from('movies').update({ views: (current.views || 0) + 1 }).eq('id', movieId);
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

  if (error) return [];

  return (data || []).map((item: any) => ({
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
  }));
};