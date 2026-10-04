// Watchmode Cinema API Service
import { Movie, StreamingSource } from '../types.ts';

export interface WatchmodeSearchResult {
  id: number;
  name: string;
  type: string;
  year?: number;
  imdb_id?: string;
  tmdb_id?: number;
}

export interface WatchmodeDetailsResponse {
  watchmodeId: number;
  title: string;
  description: string;
  thumbnail: string;
  backdrop: string;
  year: number;
  rating: string;
  userRating?: number;
  criticScore?: number;
  genres: string[];
  genre: string;
  runtimeMinutes?: number;
  trailer?: string;
  trailerThumbnail?: string;
  imdbId?: string;
  tmdbId?: number;
  streamingSources: StreamingSource[];
}

export interface WatchmodeStatus {
  connected: boolean;
  quota: number;
  quotaUsed: number;
  quotaRemaining: number;
  apiKeyPreview: string;
}

export const getWatchmodeStatus = async (): Promise<WatchmodeStatus | null> => {
  try {
    const res = await fetch('/api/watchmode/status');
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.error('Watchmode status error:', err);
    return null;
  }
};

export const searchWatchmode = async (query: string): Promise<WatchmodeSearchResult[]> => {
  if (!query || query.trim().length === 0) return [];
  try {
    const res = await fetch(`/api/watchmode/search?query=${encodeURIComponent(query.trim())}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? (data.results || []) : [];
  } catch (err) {
    console.error('Watchmode search error:', err);
    return [];
  }
};

export const getWatchmodeDetails = async (id: number): Promise<WatchmodeDetailsResponse | null> => {
  try {
    const res = await fetch(`/api/watchmode/details/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.movie : null;
  } catch (err) {
    console.error('Watchmode details error:', err);
    return null;
  }
};

export const importMovieFromWatchmode = async (
  watchmodeId: number,
  customVideoUrl?: string
): Promise<Movie | null> => {
  try {
    const res = await fetch('/api/watchmode/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ watchmodeId, customVideoUrl }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to import movie from Watchmode');
    }
    const data = await res.json();
    return data.movie || null;
  } catch (err: any) {
    console.error('Watchmode import error:', err);
    throw err;
  }
};

export const syncBlockbustersFromWatchmode = async (): Promise<Movie[]> => {
  try {
    const res = await fetch('/api/watchmode/sync-blockbusters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.movies || [];
  } catch (err) {
    console.error('Watchmode sync blockbusters error:', err);
    return [];
  }
};
