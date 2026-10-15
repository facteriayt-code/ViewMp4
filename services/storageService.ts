import { Movie } from '../types.ts';
import { supabase } from './supabaseClient.ts';

// High-quality fallback if everything else fails
const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop';

export const fileToDataUrl = (file: File, maxWidth = 1280, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof window === 'undefined' || !window.document) {
        return resolve(reader.result as string);
      }
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
            return;
          }
        } catch {
          // fallback to raw data URL
        }
        resolve(reader.result as string);
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
      try {
        finalThumbnailUrl = await uploadFile('thumbnails', thumbnailFile);
      } catch (thumbErr) {
        console.warn("Storage upload for thumbnails bucket failed, using high-res data URL fallback:", thumbErr);
        finalThumbnailUrl = await fileToDataUrl(thumbnailFile);
      }
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
    console.warn("Cloud storage upload failed, falling back to local playable broadcast:", error);
    // Graceful fallback: construct playable local movie so the user's video can still play immediately
    const fallbackVideoUrl = videoFile ? URL.createObjectURL(videoFile) : (movieMetadata.videoUrl || '');
    let fallbackThumbUrl = movieMetadata.thumbnail;
    if (thumbnailFile) {
      try {
        fallbackThumbUrl = await fileToDataUrl(thumbnailFile);
      } catch {
        fallbackThumbUrl = URL.createObjectURL(thumbnailFile);
      }
    }
    if (!fallbackThumbUrl || fallbackThumbUrl.trim() === '') {
      fallbackThumbUrl = DEFAULT_THUMBNAIL;
    }

    if (!fallbackVideoUrl) {
      throw error;
    }

    const localMovie: Movie = {
      id: movieMetadata.id || `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: movieMetadata.title || 'Untitled Broadcast',
      description: movieMetadata.description || 'Uploaded video broadcast.',
      thumbnail: fallbackThumbUrl,
      videoUrl: fallbackVideoUrl,
      genre: movieMetadata.genre || 'Viral',
      year: movieMetadata.year || new Date().getFullYear(),
      rating: movieMetadata.rating || 'NR',
      views: 1,
      isUserUploaded: true,
      uploaderId: movieMetadata.uploaderId,
      uploaderName: movieMetadata.uploaderName || 'You'
    };

    try {
      fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: localMovie.title,
          description: localMovie.description,
          thumbnail: localMovie.thumbnail,
          videoUrl: localMovie.videoUrl,
          genre: localMovie.genre,
          uploaderId: localMovie.uploaderId,
          uploaderName: localMovie.uploaderName
        })
      }).catch(() => {});
    } catch {}

    return localMovie;
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

let cachedCloudMovies: Movie[] | null = null;
let cachedCloudMoviesTime = 0;
const CLOUD_MOVIES_CACHE_TTL = 90 * 1000; // 90 seconds

export const getAllVideosFromCloud = async (): Promise<Movie[]> => {
  const now = Date.now();
  if (cachedCloudMovies && (now - cachedCloudMoviesTime < CLOUD_MOVIES_CACHE_TTL)) {
    return cachedCloudMovies;
  }

  try {
    const res = await fetch('/api/movies');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.movies) && data.movies.length > 0) {
        const mapped = data.movies.map((item: any) => ({
          id: item.id || `m_${Math.random().toString(36).substring(2, 9)}`,
          title: item.title,
          description: item.description,
          thumbnail: item.thumbnail,
          videoUrl: item.video_url || item.videoUrl,
          genre: item.genre || 'Action',
          year: item.year || new Date().getFullYear(),
          rating: item.rating || 'PG-13',
          views: Number(item.views) || 0,
          isUserUploaded: item.is_user_uploaded ?? item.isUserUploaded ?? true,
          uploaderId: item.uploader_id || item.uploaderId,
          uploaderName: item.uploader_name || item.uploaderName,
          watchmodeId: item.watchmode_id || item.watchmodeId,
          backdrop: item.backdrop,
          trailer: item.trailer,
          userRating: item.user_rating || item.userRating,
          criticScore: item.critic_score || item.criticScore,
          streamingSources: item.streaming_sources || item.streamingSources
        }));
        cachedCloudMovies = mapped;
        cachedCloudMoviesTime = Date.now();
        return mapped;
      }
    }
  } catch (err) {
    console.warn("API movies fetch fallback to Supabase:", err);
  }

  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });
    return (data || []).map(mapDbToMovie);
  } catch (supErr) {
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