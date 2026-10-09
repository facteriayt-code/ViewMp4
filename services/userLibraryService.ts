import { Movie } from '../types.ts';

const SAVED_MOVIES_KEY = 'gemini_saved_movies';
const LIKED_MOVIES_KEY = 'gemini_liked_movies';
const LEGACY_WATCHLIST_KEY = 'gemini_watchlist';

// Helper to safely read from localStorage
const readList = (key: string): Movie[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error(`Failed to read ${key} from storage:`, e);
    return [];
  }
};

const writeList = (key: string, list: Movie[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error(`Failed to write ${key} to storage:`, e);
  }
};

// Broadcast updates to other components
const dispatchEvent = (eventName: string, data: any) => {
  try {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  } catch {
    // ignore
  }
};

export const getSavedMovies = (): Movie[] => {
  return readList(SAVED_MOVIES_KEY);
};

export const getLikedMovies = (): Movie[] => {
  return readList(LIKED_MOVIES_KEY);
};

export const isMovieSaved = (movieId: string): boolean => {
  if (!movieId) return false;
  const list = getSavedMovies();
  if (list.some(m => m.id === movieId)) return true;
  // Also check legacy watchlist string array
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_WATCHLIST_KEY) || '[]');
    if (Array.isArray(legacy) && legacy.includes(movieId)) return true;
  } catch {
    // ignore
  }
  return false;
};

export const isMovieLiked = (movieId: string): boolean => {
  if (!movieId) return false;
  const list = getLikedMovies();
  return list.some(m => m.id === movieId);
};

export const toggleSaveMovie = (movie: Movie): boolean => {
  if (!movie || !movie.id) return false;
  const current = getSavedMovies();
  const exists = current.some(m => m.id === movie.id);
  let updated: Movie[];

  if (exists) {
    updated = current.filter(m => m.id !== movie.id);
  } else {
    // Save clean movie object
    const movieToSave: Movie = {
      id: movie.id,
      title: movie.title,
      description: movie.description || '',
      thumbnail: movie.thumbnail || movie.backdrop || '',
      backdrop: movie.backdrop || movie.thumbnail || '',
      genre: movie.genre || 'Action',
      year: movie.year || 2024,
      rating: movie.rating || 'PG-13',
      views: movie.views || 0,
      isTv: Boolean(movie.isTv),
      userRating: movie.userRating,
      videoUrl: movie.videoUrl
    };
    updated = [movieToSave, ...current];
  }

  writeList(SAVED_MOVIES_KEY, updated);

  // Sync legacy watchlist array of IDs
  try {
    const legacyIds = updated.map(m => m.id);
    localStorage.setItem(LEGACY_WATCHLIST_KEY, JSON.stringify(legacyIds));
  } catch {
    // ignore
  }

  dispatchEvent('gemini_saved_movies_updated', { movie, isSaved: !exists, list: updated });
  return !exists;
};

export const toggleLikeMovie = (movie: Movie): boolean => {
  if (!movie || !movie.id) return false;
  const current = getLikedMovies();
  const exists = current.some(m => m.id === movie.id);
  let updated: Movie[];

  if (exists) {
    updated = current.filter(m => m.id !== movie.id);
  } else {
    const movieToLike: Movie = {
      id: movie.id,
      title: movie.title,
      description: movie.description || '',
      thumbnail: movie.thumbnail || movie.backdrop || '',
      backdrop: movie.backdrop || movie.thumbnail || '',
      genre: movie.genre || 'Action',
      year: movie.year || 2024,
      rating: movie.rating || 'PG-13',
      views: movie.views || 0,
      isTv: Boolean(movie.isTv),
      userRating: movie.userRating,
      videoUrl: movie.videoUrl
    };
    updated = [movieToLike, ...current];
  }

  writeList(LIKED_MOVIES_KEY, updated);
  dispatchEvent('gemini_liked_movies_updated', { movie, isLiked: !exists, list: updated });
  return !exists;
};

export const removeSavedMovie = (movieId: string) => {
  const current = getSavedMovies();
  const updated = current.filter(m => m.id !== movieId);
  writeList(SAVED_MOVIES_KEY, updated);
  try {
    const legacyIds = updated.map(m => m.id);
    localStorage.setItem(LEGACY_WATCHLIST_KEY, JSON.stringify(legacyIds));
  } catch {
    // ignore
  }
  dispatchEvent('gemini_saved_movies_updated', { movieId, isSaved: false, list: updated });
};

export const removeLikedMovie = (movieId: string) => {
  const current = getLikedMovies();
  const updated = current.filter(m => m.id !== movieId);
  writeList(LIKED_MOVIES_KEY, updated);
  dispatchEvent('gemini_liked_movies_updated', { movieId, isLiked: false, list: updated });
};
