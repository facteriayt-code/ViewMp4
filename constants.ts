import { Movie } from './types.ts';
import tmdbCatalogData from './tmdb_catalog.json';
import curatedMoviesData from './curated_movies.json';
import curatedTvShowsData from './curated_tv_shows.json';

const rawCatalog = tmdbCatalogData as Movie[];
const curatedMovies = curatedMoviesData as Movie[];
const curatedTv = curatedTvShowsData as Movie[];

// Helper to filter out DVD featurettes, workout videos, fan films, and podcast commentaries
const isJunkOrUnstreamable = (title: string = ''): boolean => {
  return /making of|assembled|behind the scenes|featurette|fan film|trailer|workout|parody|audio commentary|podcast|darla|insanity|und ein stein|forbidden journey|ralph bakshi|the novices|cavegirl|youngest sister|a place called silence/i.test(title);
};

const seenIds = new Set<string>();
const seenTitles = new Set<string>();
const combinedMovies: Movie[] = [];

// 1. Add top verified blockbusters (Oppenheimer, Deadpool, Avengers, Gladiator, Interstellar, etc.)
for (const m of curatedMovies) {
  const normTitle = (m.title || '').toLowerCase().trim();
  if (!seenIds.has(m.id) && !seenTitles.has(normTitle)) {
    seenIds.add(m.id);
    seenTitles.add(normTitle);
    combinedMovies.push({ ...m, isTv: false });
  }
}

// 2. Add top verified TV series (Breaking Bad, Stranger Things, House of the Dragon, Game of Thrones, The Boys, etc.)
for (const t of curatedTv) {
  const normTitle = (t.title || '').toLowerCase().trim();
  if (!seenIds.has(t.id) && !seenTitles.has(normTitle)) {
    seenIds.add(t.id);
    seenTitles.add(normTitle);
    combinedMovies.push({ ...t, isTv: true });
  }
}

// 3. Add released movies (year <= 2024) from tmdbCatalogData
for (const m of rawCatalog) {
  const normTitle = (m.title || '').toLowerCase().trim();
  if (
    m.year && 
    m.year <= 2024 && 
    !isJunkOrUnstreamable(m.title) && 
    m.thumbnail && 
    m.thumbnail.startsWith('http') && 
    !seenIds.has(m.id) && 
    !seenTitles.has(normTitle)
  ) {
    seenIds.add(m.id);
    seenTitles.add(normTitle);
    combinedMovies.push(m);
  }
}

// 4. Upcoming / future titles placed at the very end
for (const m of rawCatalog) {
  const normTitle = (m.title || '').toLowerCase().trim();
  if (
    (!m.year || m.year > 2024) && 
    !isJunkOrUnstreamable(m.title) && 
    !seenIds.has(m.id) && 
    !seenTitles.has(normTitle)
  ) {
    seenIds.add(m.id);
    seenTitles.add(normTitle);
    combinedMovies.push(m);
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
