
import { Movie } from '../types.ts';
import { supabase } from './supabaseClient.ts';

/**
 * Handles Global Cloud Storage via Supabase Storage & Database
 */

export const saveVideoToCloud = async (
  movieMetadata: Partial<Movie>, 
  videoFile: File, 
  thumbnailFile: File
): Promise<Movie> => {
  const fileExtVideo = videoFile.name.split('.').pop();
  const fileExtThumb = thumbnailFile.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}`;
  
  const videoPath = `uploads/${fileName}.${fileExtVideo}`;
  const thumbPath = `uploads/${fileName}.${fileExtThumb}`;

  // 1. Upload Video to 'media' bucket
  const { error: videoError } = await supabase.storage
    .from('media')
    .upload(videoPath, videoFile);

  if (videoError) throw new Error(`Video upload failed: ${videoError.message}`);

  // 2. Upload Thumbnail to 'media' bucket
  const { error: thumbError } = await supabase.storage
    .from('media')
    .upload(thumbPath, thumbnailFile);

  if (thumbError) throw new Error(`Thumbnail upload failed: ${thumbError.message}`);

  // 3. Get Public URLs
  const { data: { publicUrl: videoUrl } } = supabase.storage.from('media').getPublicUrl(videoPath);
  const { data: { publicUrl: thumbnailUrl } } = supabase.storage.from('media').getPublicUrl(thumbPath);

  // 4. Insert Metadata into 'movies' table
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
      is_user_uploaded: true,
      uploader_id: movieMetadata.uploaderId,
      uploader_name: movieMetadata.uploaderName
    }])
    .select()
    .single();

  if (dbError) throw new Error(`Database error: ${dbError.message}`);

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail,
    videoUrl: data.video_url,
    genre: data.genre,
    year: data.year,
    rating: data.rating,
    isUserUploaded: data.is_user_uploaded,
    uploaderId: data.uploader_id,
    uploaderName: data.uploader_name
  };
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

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    thumbnail: item.thumbnail,
    videoUrl: item.video_url,
    genre: item.genre,
    year: item.year,
    rating: item.rating,
    isUserUploaded: item.is_user_uploaded,
    uploaderId: item.uploader_id,
    uploaderName: item.uploader_name
  }));
};
