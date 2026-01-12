
import { Movie } from '../types.ts';
import { api } from './apiService.ts';

/**
 * Handles Global Cloud Storage via Vercel Blob & Postgres
 */

export const saveVideoToCloud = async (
  movieMetadata: Partial<Movie>, 
  videoFile: File, 
  thumbnailFile: File
): Promise<Movie> => {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('thumbnail', thumbnailFile);
  formData.append('metadata', JSON.stringify(movieMetadata));

  try {
    // This calls your Vercel API which uploads to Vercel Blob
    const savedMovie = await api.upload('/movies/upload', formData);
    return savedMovie;
  } catch (error: any) {
    console.error("Cloud Upload Error:", error);
    throw new Error("Cloud storage failed. Ensure your Vercel environment is configured.");
  }
};

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  try {
    // Fetches the global list of movies stored in your database
    const movies = await api.get('/movies');
    return movies;
  } catch (error) {
    console.error("Cloud Fetch Error:", error);
    // Return empty array if API doesn't exist yet to prevent crash
    return [];
  }
};
