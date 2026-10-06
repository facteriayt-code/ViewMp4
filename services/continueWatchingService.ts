import { Movie, ContinueWatchingItem } from '../types.ts';

// Strict User Watched Tracking Key
const STORAGE_KEY = 'geministream_user_continue_watching_v2';
const LEGACY_STORAGE_KEY = 'geministream_continue_watching';
const EVENT_KEY = 'geministream_continue_watching_updated';

/**
 * Gets continue watching list based strictly on what the user actually watched.
 * Never generates random or fake starter items.
 */
export const getContinueWatchingList = (): ContinueWatchingItem[] => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return [];
  }
  try {
    // Clean up legacy random seeded storage if it exists
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: ContinueWatchingItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter(item => item && item.movie && item.movie.id && item.lastWatchedAt)
          .sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
      }
    }
  } catch (err) {
    console.error("Failed to load continue watching list:", err);
  }
  return [];
};

export const saveContinueWatching = (
  movie: Movie, 
  progressPercent: number = 25, 
  season?: number, 
  episode?: number
): void => {
  if (!movie || !movie.id) return;
  try {
    const current = getContinueWatchingList();
    const existingIndex = current.findIndex(item => item.movie.id === movie.id);

    let progress = Math.min(100, Math.max(5, progressPercent));
    if (existingIndex >= 0) {
      // Retain or increment progress
      progress = Math.max(current[existingIndex].progress, progress);
    }

    const updatedItem: ContinueWatchingItem = {
      movie: {
        ...movie,
        initialSeason: season ?? movie.initialSeason,
        initialEpisode: episode ?? movie.initialEpisode
      },
      progress,
      lastWatchedAt: Date.now(),
      season: season ?? movie.initialSeason,
      episode: episode ?? movie.initialEpisode
    };

    const remaining = current.filter(item => item.movie.id !== movie.id);
    const newList = [updatedItem, ...remaining].slice(0, 20);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: newList }));
  } catch (err) {
    console.error("Failed to save continue watching item:", err);
  }
};

export const removeContinueWatching = (movieId: string): void => {
  try {
    const current = getContinueWatchingList();
    const newList = current.filter(item => item.movie.id !== movieId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: newList }));
  } catch (err) {
    console.error("Failed to remove continue watching item:", err);
  }
};

export const clearContinueWatching = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: [] }));
  } catch (err) {}
};

export const subscribeToContinueWatching = (callback: (items: ContinueWatchingItem[]) => void): (() => void) => {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<ContinueWatchingItem[]>;
    if (custom.detail) {
      callback(custom.detail);
    } else {
      callback(getContinueWatchingList());
    }
  };
  window.addEventListener(EVENT_KEY, handler);
  return () => window.removeEventListener(EVENT_KEY, handler);
};
