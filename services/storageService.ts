
import { upload } from '@vercel/blob';
import { Movie } from '../types.ts';
import { api } from './apiService.ts';

/**
 * Global Storage Service
 * Uses Vercel Blob for large files (direct browser upload)
 * Uses Postgres (via apiService) for metadata
 */

export const saveVideoToCloud = async (
  movieMetadata: Partial<Movie>, 
  videoFile: File, 
  thumbnailFile: File
): Promise<Movie> => {
  try {
    // 1. Upload Video directly to Vercel Blob
    // This calls your /api/upload endpoint (from your snippet) to get a token
    const videoBlob = await upload(videoFile.name, videoFile, {
      access: 'public',
      handleUploadUrl: '/api/upload', // Matches your Vercel route
    });

    // 2. Upload Thumbnail directly to Vercel Blob
    const thumbnailBlob = await upload(thumbnailFile.name, thumbnailFile, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });

    // 3. Save full metadata (including URLs) to your Postgres database
    const finalMetadata = {
      ...movieMetadata,
      videoUrl: videoBlob.url,
      thumbnail: thumbnailBlob.url,
    };

    const savedMovie = await api.post('/movies', finalMetadata);
    return savedMovie;
  } catch (error: any) {
    console.error("Vercel Cloud Error:", error);
    throw new Error(error.message || "Cloud publication failed. Ensure Vercel Blob and Postgres are configured.");
  }
};

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  try {
    // Fetches the global list of movies from Postgres
    return await api.get('/movies');
  } catch (error) {
    console.error("Cloud Sync Error:", error);
    return [];
  }
};
