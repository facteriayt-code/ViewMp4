import { Movie } from '../types.ts';

const SAVED_MOVIES_KEY = 'gemini_saved_movies';
const LIKED_MOVIES_KEY = 'gemini_liked_movies';
const LEGACY_WATCHLIST_KEY = 'gemini_watchlist';

// In-memory cache for instantaneous O(1) checks during card rendering
let cachedSavedMovies: Movie[] | null = null;
let cachedLikedMovies: Movie[] | null = null;
let cachedSavedIds = new Set<string>();
let cachedLikedIds = new Set<string>();

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

// Initialize caches
const ensureSavedCache = () => {
  if (cachedSavedMovies === null) {
    cachedSavedMovies = readList(SAVED_MOVIES_KEY);
    cachedSavedIds = new Set(cachedSavedMovies.map(m => m.id));
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_WATCHLIST_KEY) || '[]');
      if (Array.isArray(legacy)) {
        legacy.forEach(id => cachedSavedIds.add(id));
      }
    } catch {
      // ignore
    }
  }
};

const ensureLikedCache = () => {
  if (cachedLikedMovies === null) {
    cachedLikedMovies = readList(LIKED_MOVIES_KEY);
    cachedLikedIds = new Set(cachedLikedMovies.map(m => m.id));
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
  ensureSavedCache();
  return cachedSavedMovies || [];
};

export const getLikedMovies = (): Movie[] => {
  ensureLikedCache();
  return cachedLikedMovies || [];
};

export const getSavedMovieIdSet = (): Set<string> => {
  ensureSavedCache();
  return cachedSavedIds;
};

export const getLikedMovieIdSet = (): Set<string> => {
  ensureLikedCache();
  return cachedLikedIds;
};

export const isMovieSaved = (movieId: string): boolean => {
  if (!movieId) return false;
  ensureSavedCache();
  return cachedSavedIds.has(movieId);
};

export const isMovieLiked = (movieId: string): boolean => {
  if (!movieId) return false;
  ensureLikedCache();
  return cachedLikedIds.has(movieId);
};

export const toggleSaveMovie = (movie: Movie): boolean => {
  if (!movie || !movie.id) return false;
  ensureSavedCache();
  const current = cachedSavedMovies || [];
  const exists = cachedSavedIds.has(movie.id);
  let updated: Movie[];

  if (exists) {
    updated = current.filter(m => m.id !== movie.id);
    cachedSavedIds.delete(movie.id);
  } else {
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
    cachedSavedIds.add(movie.id);
  }

  cachedSavedMovies = updated;
  writeList(SAVED_MOVIES_KEY, updated);

  try {
    const legacyIds = Array.from(cachedSavedIds);
    localStorage.setItem(LEGACY_WATCHLIST_KEY, JSON.stringify(legacyIds));
  } catch {
    // ignore
  }

  dispatchEvent('gemini_saved_movies_updated', { movie, isSaved: !exists, list: updated });
  return !exists;
};

export const toggleLikeMovie = (movie: Movie): boolean => {
  if (!movie || !movie.id) return false;
  ensureLikedCache();
  const current = cachedLikedMovies || [];
  const exists = cachedLikedIds.has(movie.id);
  let updated: Movie[];

  if (exists) {
    updated = current.filter(m => m.id !== movie.id);
    cachedLikedIds.delete(movie.id);
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
    cachedLikedIds.add(movie.id);
  }

  cachedLikedMovies = updated;
  writeList(LIKED_MOVIES_KEY, updated);
  dispatchEvent('gemini_liked_movies_updated', { movie, isLiked: !exists, list: updated });
  return !exists;
};

export const removeSavedMovie = (movieId: string) => {
  ensureSavedCache();
  const current = cachedSavedMovies || [];
  const updated = current.filter(m => m.id !== movieId);
  cachedSavedIds.delete(movieId);
  cachedSavedMovies = updated;
  writeList(SAVED_MOVIES_KEY, updated);
  try {
    const legacyIds = Array.from(cachedSavedIds);
    localStorage.setItem(LEGACY_WATCHLIST_KEY, JSON.stringify(legacyIds));
  } catch {
    // ignore
  }
  dispatchEvent('gemini_saved_movies_updated', { movieId, isSaved: false, list: updated });
};

export const removeLikedMovie = (movieId: string) => {
  ensureLikedCache();
  const current = cachedLikedMovies || [];
  const updated = current.filter(m => m.id !== movieId);
  cachedLikedIds.delete(movieId);
  cachedLikedMovies = updated;
  writeList(LIKED_MOVIES_KEY, updated);
  dispatchEvent('gemini_liked_movies_updated', { movieId, isLiked: false, list: updated });
};
