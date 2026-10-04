// TMDb (The Movie Database) Cinema API Service
import { Movie, StreamingSource } from '../types.ts';

export interface WatchmodeSearchResult {
  id: number;
  name: string;
  title?: string;
  type: string;
  year?: number;
  imageUrl?: string | null;
  imdb_id?: string;
  tmdb_id?: number;
}

export type TmdbSearchResult = WatchmodeSearchResult;

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

export type TmdbDetailsResponse = WatchmodeDetailsResponse;

export interface WatchmodeStatus {
  connected: boolean;
  provider?: string;
  quota: string | number;
  quotaUsed: number;
  quotaRemaining: number;
  apiKeyPreview: string;
}

export type TmdbStatus = WatchmodeStatus;

export const getWatchmodePopular = async (): Promise<WatchmodeSearchResult[]> => {
  try {
    const res = await fetch('/api/tmdb/popular');
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? (data.titles || []).map((t: any) => ({
      id: t.id,
      name: t.title || t.name,
      title: t.title || t.name,
      type: t.type || 'movie',
      year: t.year,
      imageUrl: t.poster || t.imageUrl || null,
      imdb_id: t.imdb_id,
      tmdb_id: t.id
    })) : [];
  } catch (err) {
    console.error('TMDb popular error:', err);
    return [];
  }
};

export const getWatchmodeStatus = async (): Promise<WatchmodeStatus | null> => {
  try {
    const res = await fetch('/api/tmdb/status');
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data : null;
  } catch (err) {
    console.error('TMDb status error:', err);
    return null;
  }
};

export const searchWatchmode = async (query: string): Promise<WatchmodeSearchResult[]> => {
  if (!query || query.trim().length === 0) return [];
  try {
    const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query.trim())}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? (data.results || []) : [];
  } catch (err) {
    console.error('TMDb search error:', err);
    return [];
  }
};

export const getWatchmodeDetails = async (id: number): Promise<WatchmodeDetailsResponse | null> => {
  try {
    const res = await fetch(`/api/tmdb/details/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.movie : null;
  } catch (err) {
    console.error('TMDb details error:', err);
    return null;
  }
};

export const importMovieFromWatchmode = async (
  watchmodeId: number,
  customVideoUrl?: string
): Promise<Movie | null> => {
  try {
    const res = await fetch('/api/tmdb/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tmdbId: watchmodeId, customVideoUrl }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to import movie from TMDb');
    }
    const data = await res.json();
    return data.movie || null;
  } catch (err: any) {
    console.error('TMDb import error:', err);
    throw err;
  }
};

export const syncBlockbustersFromWatchmode = async (): Promise<Movie[]> => {
  try {
    const res = await fetch('/api/tmdb/sync-blockbusters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.movies || [];
  } catch (err) {
    console.error('TMDb sync blockbusters error:', err);
    return [];
  }
};

// Clean aliases for TMDb
export const searchTmdb = searchWatchmode;
export const getTmdbDetails = getWatchmodeDetails;
export const importMovieFromTmdb = importMovieFromWatchmode;
export const syncBlockbustersFromTmdb = syncBlockbustersFromWatchmode;
export const getTmdbStatus = getWatchmodeStatus;
export const getTmdbPopular = getWatchmodePopular;
