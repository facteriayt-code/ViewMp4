import { Movie } from '../types.ts';
import { db, storage, auth } from '../firebase.ts';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp, increment } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// High-quality fallback if everything else fails
const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const saveVideoToCloud = async (
  movieMetadata: Partial<Movie>, 
  videoFile?: File | null, 
  thumbnailFile?: File | null,
  onProgress?: (progress: number) => void
): Promise<Movie> => {
  
  const uploadFile = async (folder: string, file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress && folder === 'videos') {
            onProgress(progress);
          }
        },
        (error) => {
          console.error(`Storage Error [${folder}]:`, error);
          reject(new Error(`Cloud Storage Failure (${folder}): ${error.message}`));
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
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
      finalVideoUrl = await uploadFile('videos', videoFile);
    }

    if (!finalVideoUrl) throw new Error("A valid video source is required for deployment.");

    // 3. Update or Insert Database Record in Firestore
    if (movieMetadata.id) {
      const movieRef = doc(db, 'movies', movieMetadata.id);
      try {
        await updateDoc(movieRef, {
          title: movieMetadata.title,
          description: movieMetadata.description,
          genre: movieMetadata.genre,
          thumbnail: finalThumbnailUrl,
          video_url: finalVideoUrl,
          updated_at: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `movies/${movieMetadata.id}`);
      }
      
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

    try {
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
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'movies');
      throw error; // unreachable but for TS
    }
  } catch (error: any) {
    console.error("Cloud Operation Error:", error);
    throw error;
  }
};

export const deleteVideoFromCloud = async (movieId: string): Promise<void> => {
  const movieRef = doc(db, 'movies', movieId);
  try {
    await deleteDoc(movieRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `movies/${movieId}`);
  }
};

export const incrementMovieView = async (movieId: string) => {
  try {
    const movieRef = doc(db, 'movies', movieId);
    await updateDoc(movieRef, {
      views: increment(1)
    });
  } catch (err) {
    // Silently fail view increments or log them
    console.warn("View increment failed", err);
  }
};

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  try {
    const q = query(collection(db, 'movies'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as any)).map(mapDbToMovie);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'movies');
    return []; // unreachable but for TS
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
