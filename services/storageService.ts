
import { upload } from '@vercel/blob';
import { Movie } from '../types.ts';
import { api } from './apiService.ts';

/**
 * Global Admin & Storage Service
 */

export const saveVideoToCloud = async (
  movieMetadata: Partial<Movie>, 
  videoFile: File, 
  thumbnailFile: File
): Promise<Movie> => {
  try {
    // 1. Upload Video directly to Vercel Blob (Client Method for files > 4.5MB)
    const videoBlob = await upload(videoFile.name, videoFile, {
      access: 'public',
      handleUploadUrl: '/api/upload', 
    });

    // 2. Upload Thumbnail
    const thumbnailBlob = await upload(thumbnailFile.name, thumbnailFile, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });

    // 3. Save to Postgres
    const finalMetadata = {
      ...movieMetadata,
      videoUrl: videoBlob.url,
      thumbnail: thumbnailBlob.url,
    };

    return await api.post('/movies', finalMetadata);
  } catch (error: any) {
    console.error("Vercel Cloud Error:", error);
    throw new Error(error.message || "Upload failed. Check your Vercel Blob token.");
  }
};

export const deleteMovieFromCloud = async (movieId: string): Promise<void> => {
  try {
    await api.post(`/movies/delete`, { id: movieId });
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Failed to delete movie from database.");
  }
};

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  try {
    return await api.get('/movies');
  } catch (error) {
    console.error("Cloud Sync Error:", error);
    return [];
  }
};
