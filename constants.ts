import { Movie } from './types.ts';
import tmdbCatalogData from './tmdb_catalog.json';

export const INITIAL_MOVIES: Movie[] = tmdbCatalogData as Movie[];

export const CATEGORIES = [
  'Trending Now',
  'Sci-Fi Masterpieces',
  'Action & Adventure',
  'Blockbusters & Hits',
  'Your Uploads'
];
