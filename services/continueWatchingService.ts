import { Movie, ContinueWatchingItem } from '../types.ts';

const STORAGE_KEY = 'geministream_continue_watching';
const EVENT_KEY = 'geministream_continue_watching_updated';

// Realistic starter items to populate Continue Watching on first visit
const DEFAULT_STARTER_ITEMS = [
  {
    movieId: 'tmdb_66732', // Stranger Things (Netflix)
    progress: 42,
    season: 1,
    episode: 2
  },
  {
    movieId: 'tmdb_872906', // Jawan (Netflix Indian Blockbuster)
    progress: 58,
    season: undefined,
    episode: undefined
  },
  {
    movieId: 'tmdb_533535', // Deadpool & Wolverine (Disney+)
    progress: 68,
    season: undefined,
    episode: undefined
  },
  {
    movieId: 'tmdb_76479', // The Boys (Prime Video)
    progress: 74,
    season: 1,
    episode: 3
  },
  {
    movieId: 'tmdb_1396', // Breaking Bad
    progress: 81,
    season: 1,
    episode: 1
  }
];

export const getContinueWatchingList = (fallbackMovies: Movie[] = []): ContinueWatchingItem[] => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: ContinueWatchingItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(item => item && item.movie && item.movie.id);
      }
    }

    // First visit: Seed with initial titles from fallbackMovies if available
    if (fallbackMovies.length > 0) {
      const seeded: ContinueWatchingItem[] = [];
      for (const starter of DEFAULT_STARTER_ITEMS) {
        const found = fallbackMovies.find(m => 
          m.id === starter.movieId || 
          m.watchmodeId === parseInt(starter.movieId.replace('tmdb_', ''), 10) ||
          m.tmdbId === parseInt(starter.movieId.replace('tmdb_', ''), 10)
        );
        if (found) {
          seeded.push({
            movie: found,
            progress: starter.progress,
            lastWatchedAt: Date.now() - Math.floor(Math.random() * 86400000),
            season: starter.season,
            episode: starter.episode
          });
        }
      }
      if (seeded.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        return seeded;
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
