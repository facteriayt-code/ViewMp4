import { Movie } from './types.ts';
import tmdbCatalogData from './tmdb_catalog.json';
import curatedMoviesData from './curated_movies.json';
import curatedTvShowsData from './curated_tv_shows.json';
import verifiedPlatformMoviesData from './verified_platform_movies.json';

const rawCatalog = tmdbCatalogData as Movie[];
const curatedMovies = curatedMoviesData as Movie[];
const curatedTv = curatedTvShowsData as Movie[];
const verifiedPlatformMovies = verifiedPlatformMoviesData as Movie[];

// Helper to filter out DVD featurettes, workout videos, fan films, and podcast commentaries
const isJunkOrUnstreamable = (title: string = ''): boolean => {
  return /making of|assembled|behind the scenes|featurette|fan film|trailer|workout|parody|audio commentary|podcast|darla|insanity|und ein stein|forbidden journey|ralph bakshi|the novices|cavegirl|youngest sister|a place called silence|test reel|legend side story|chinese|母女/i.test(title);
};

const seenIds = new Set<string>();
const seenTitles = new Set<string>();
const combinedMovies: Movie[] = [];

// 1. Add verified platform titles (Netflix, Prime, Disney+, Apple TV+, Max, Hulu)
for (const vp of verifiedPlatformMovies) {
  const normTitle = (vp.title || '').toLowerCase().trim();
  if (!seenIds.has(vp.id) && !seenTitles.has(normTitle)) {
    seenIds.add(vp.id);
    seenTitles.add(normTitle);
    combinedMovies.push(vp);
  }
}

// 2. Add top verified blockbusters (Oppenheimer, Deadpool, Avengers, Gladiator, Interstellar, etc.)
for (const m of curatedMovies) {
  const normTitle = (m.title || '').toLowerCase().trim();
  if (!seenIds.has(m.id) && !seenTitles.has(normTitle)) {
    seenIds.add(m.id);
    seenTitles.add(normTitle);
    combinedMovies.push({ ...m, isTv: false });
  }
}

// 3. Add top verified TV series (Breaking Bad, Stranger Things, House of the Dragon, Game of Thrones, The Boys, etc.)
for (const t of curatedTv) {
  const normTitle = (t.title || '').toLowerCase().trim();
  if (!seenIds.has(t.id) && !seenTitles.has(normTitle)) {
    seenIds.add(t.id);
    seenTitles.add(normTitle);
    combinedMovies.push({ ...t, isTv: true });
  }
}

// 4. Add verified released movies (year <= 2024, views >= 1,000,000) from tmdbCatalogData
// Note: strip fake auto-generated streamingSources from raw catalog so platform replicas strictly contain verified platform titles
for (const m of rawCatalog) {
  const normTitle = (m.title || '').toLowerCase().trim();
  if (
    m.year && 
    m.year <= 2024 && 
    m.year >= 1970 &&
    !isJunkOrUnstreamable(m.title) && 
    m.thumbnail && 
    m.thumbnail.startsWith('http') && 
    (m.views || 0) >= 1000000 &&
    !seenIds.has(m.id) && 
    !seenTitles.has(normTitle)
  ) {
    seenIds.add(m.id);
    seenTitles.add(normTitle);
    combinedMovies.push({ ...m, streamingSources: [] });
  }
}

export const INITIAL_MOVIES: Movie[] = combinedMovies;

export const CATEGORIES = [
  'Trending Now',
  'TV Series & Binge Shows',
  'Sci-Fi Masterpieces',
  'Action & Adventure',
  'Blockbusters & Hits',
  'Your Uploads'
];
