import { Movie } from '../types.ts';
import { supabase } from './supabaseClient.ts';
import { db } from '../firebase.ts';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp, increment } from 'firebase/firestore';

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

    // 3. Update or Insert Database Record in Firestore
    if (movieMetadata.id) {
      const movieRef = doc(db, 'movies', movieMetadata.id);
      await updateDoc(movieRef, {
        title: movieMetadata.title,
        description: movieMetadata.description,
        genre: movieMetadata.genre,
        thumbnail: finalThumbnailUrl,
        video_url: finalVideoUrl,
        updated_at: serverTimestamp()
      });
      
      return {
        ...movieMetadata,
        thumbnail: finalThumbnailUrl,
        videoUrl: finalVideoUrl
      } as Movie;
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
      uploader_name: movieMetadata.uploaderName || 'Anonymous',
      created_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'movies'), payload);
    
    return {
      id: docRef.id,
      title: payload.title,
      description: payload.description,
      thumbnail: payload.thumbnail,
      videoUrl: payload.video_url,
      genre: payload.genre,
      year: payload.year,
      rating: payload.rating,
      views: payload.views,
      isUserUploaded: payload.is_user_uploaded,
      uploaderId: payload.uploader_id,
      uploaderName: payload.uploader_name
    };
  } catch (error: any) {
    console.error("Cloud Operation Error:", error);
    throw error;
  }
};

export const deleteVideoFromCloud = async (movieId: string): Promise<void> => {
  const movieRef = doc(db, 'movies', movieId);
  await deleteDoc(movieRef);
};

export const incrementMovieView = async (movieId: string) => {
  try {
    const movieRef = doc(db, 'movies', movieId);
    await updateDoc(movieRef, {
      views: increment(1)
    });
  } catch (err) {}
};

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  const q = query(collection(db, 'movies'), orderBy('created_at', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as any)).map(mapDbToMovie);
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
