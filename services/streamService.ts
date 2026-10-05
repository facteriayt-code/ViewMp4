import { Movie } from '../types.ts';

export const CODESPECTERS_API_KEY = 
  (import.meta as any).env?.VITE_CODESPECTERS_API_KEY || 
  (import.meta as any).env?.VITE_STREAMING_API_KEY || 
  (import.meta as any).env?.VITE_NEXUS_API_KEY || 
  "nx_f3ccddc8595f92a260f141adc7a7ec50";

/**
 * Known TMDb ID dictionary for reliable resolution of popular movies & shows
 */
const KNOWN_TMDB_MAP: Record<string, number> = {
  // Movies from user prompts & popular blockbusters
  'iron man': 1726,
  'titanic': 597,
  'house of the dragon': 94997,
  'game of thrones': 1399,
  'breaking bad': 1396,
  'stranger things': 66732,
  'the last of us': 100088,
  'the boys': 76479,
  'shogun': 126308,
  'fallout': 106379,
  'loki': 88396,
  'squid game': 93405,
  'wednesday': 119051,
  'the bear': 136283,
  'inception': 27205,
  'interstellar': 157336,
  'avatar': 19995,
  'avatar: the way of water': 76600,
  'the dark knight': 155,
  'the dark knight rises': 49026,
  'batman begins': 272,
  'the matrix': 603,
  'gladiator': 98,
  'gladiator ii': 558449,
  'pulp fiction': 680,
  'the shawshank redemption': 278,
  'oppenheimer': 872585,
  'barbie': 346698,
  'dune': 438631,
  'dune: part two': 693134,
  'fight club': 550,
  'spider-man': 557,
  'spider-man: no way home': 634649,
  'spider-man: across the spider-verse': 569094,
  'deadpool': 293660,
  'deadpool 2': 383498,
  'deadpool & wolverine': 533535,
  'avengers: endgame': 299534,
  'avengers: infinity war': 299536,
  'the avengers': 24428,
  'jurassic park': 329,
  'jurassic world': 135397,
  'alien: romulus': 945961,
  'the wild robot': 1184918,
  'john wick': 245891,
  'john wick: chapter 4': 603692,
  'top gun: maverick': 361743,
  'inside out 2': 1022789,
  'moana 2': 1241982,
  'twisters': 718821,
  'beetlejuice beetlejuice': 917496,
  'wicked': 402431
};

/**
 * AniList IDs for popular anime titles
 */
const KNOWN_ANILIST_MAP: Record<string, number> = {
  'one piece': 21,
  'demon slayer': 101922,
  'kimetsu no yaiba': 101922,
  'attack on titan': 16498,
  'shingeki no kyojin': 16498,
  'jujutsu kaisen': 113415,
  'naruto': 20,
  'naruto shippuden': 1735,
  'death note': 1535,
  'chainsaw man': 127230,
  'bleach': 269,
  'dragon ball z': 813,
  'dragon ball super': 21175,
  'hunter x hunter': 11061,
  'my hero academia': 21459,
  'fullmetal alchemist: brotherhood': 5114,
  'spy x family': 140960,
  'solo leveling': 151807,
  'spirited away': 199,
  'your name': 21519,
  'suzume': 145946
};

/**
 * Extracts a valid numeric TMDb ID from a Movie object
 */
export function getMovieTmdbId(movie: Movie): number {
  // 1. Direct watchmodeId (if present and numeric)
  if (movie.watchmodeId && !isNaN(Number(movie.watchmodeId)) && Number(movie.watchmodeId) > 0) {
    return Number(movie.watchmodeId);
  }

  // 2. Exact match in known titles map
  const titleLower = (movie.title || '').toLowerCase().trim();
  for (const [key, id] of Object.entries(KNOWN_TMDB_MAP)) {
    if (titleLower === key || titleLower.includes(key) || key.includes(titleLower)) {
      return id;
    }
  }

  // 3. Numeric digits from id (e.g. "tmdb_597", "597", "tmdb-597")
  if (movie.id) {
    const digits = String(movie.id).replace(/\D/g, '');
    if (digits && digits.length >= 2 && digits.length <= 9) {
      const parsed = parseInt(digits, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  // Fallback to Titanic (597) if no ID could be resolved
  return 597;
}

/**
 * Checks if the title or genre is Anime and retrieves an AniList ID if available
 */
export function getAnimeAnilistId(movie: Movie): number | null {
  const titleLower = (movie.title || '').toLowerCase().trim();
  const genreLower = (movie.genre || '').toLowerCase();

  for (const [key, id] of Object.entries(KNOWN_ANILIST_MAP)) {
    if (titleLower.includes(key) || key.includes(titleLower)) {
      return id;
    }
  }

  if (genreLower.includes('anime')) {
    // If it's anime but not in the map, try TMDb id as fallback
    return getMovieTmdbId(movie);
  }

  return null;
}

/**
 * Checks if a movie/title represents a TV Series
 */
export function isTvOrSeries(movie: Movie): boolean {
  const titleLower = (movie.title || '').toLowerCase();
  const genreLower = (movie.genre || '').toLowerCase();

  const tvTitles = [
    'house of the dragon',
    'game of thrones',
    'breaking bad',
    'stranger things',
    'the last of us',
    'the boys',
    'shogun',
    'fallout',
    'loki',
    'squid game',
    'wednesday',
    'the bear',
    'better call saul',
    'arcane',
    'succession'
  ];

  if (tvTitles.some(t => titleLower.includes(t))) return true;
  if (genreLower.includes('tv') || genreLower.includes('series') || titleLower.includes('season')) return true;

  return false;
}

export interface StreamServer {
  id: string;
  name: string;
  badge: string;
  url: string;
  type: 'iframe' | 'video';
  quality: string;
  description: string;
  isFilmu?: boolean;
  isTv?: boolean;
  isAnime?: boolean;
}

/**
 * Generates stream servers for a movie or TV show, including Filmu and CodeSpecters
 */
export function getMovieStreamServers(movie: Movie, season: number = 1, episode: number = 1): StreamServer[] {
  const tmdbId = getMovieTmdbId(movie);
  const key = CODESPECTERS_API_KEY;
  const isSeries = isTvOrSeries(movie);
  const anilistId = getAnimeAnilistId(movie);

  const servers: StreamServer[] = [];

  // Server 1: Filmu Cinema All-in-One Player (Requested player - handles servers, quality, subtitles)
  const filmuUrl = isSeries 
    ? `https://embed.filmu.in/tv/${tmdbId}/${season}/${episode}`
    : `https://embed.filmu.in/movie/${tmdbId}`;

  servers.push({
    id: 'filmu-primary',
    name: 'Filmu Player',
    badge: 'Multi-Server & Subs',
    url: filmuUrl,
    type: 'iframe',
    quality: '4K Ultra HD',
    description: 'All-in-one player with internal server switcher, subtitles & quality selection',
    isFilmu: true,
    isTv: isSeries
  });

  // Server 2: CodeSpecters NexStream (Your Official API Key)
  servers.push({
    id: 'codespecters-primary',
    name: 'CodeSpecters (API Key)',
    badge: 'nx_ Verified',
    url: `https://api.codespecters.com/embed/movie/${tmdbId}?apikey=${key}`,
    type: 'iframe',
    quality: '4K Ultra HD',
    description: 'Direct stream with your official nx_ API key'
  });

  // Server 3: Filmu TV & Episodes (Direct season & episode player)
  servers.push({
    id: 'filmu-tv',
    name: 'Filmu TV & Episodes',
    badge: `S${season}:E${episode}`,
    url: `https://embed.filmu.in/tv/${tmdbId}/${season}/${episode}`,
    type: 'iframe',
    quality: '1080p Full HD',
    description: `Full TV episodes player with multi-audio and subtitle tracks (Season ${season}, Ep ${episode})`,
    isFilmu: true,
    isTv: true
  });

  // Server 4: Filmu Anime Player (if anime)
  if (anilistId) {
    servers.push({
      id: 'filmu-anime',
      name: 'Filmu Anime',
      badge: 'Sub & Dub',
      url: `https://embed.filmu.in/anime/${anilistId}`,
      type: 'iframe',
      quality: '1080p HD',
      description: 'Dedicated AniList anime player with Japanese/English sub & dub tracks',
      isFilmu: true,
      isAnime: true
    });
  }

  // Server 5: AutoEmbed Fast Mirror (Ultra-fast backup)
  servers.push({
    id: 'autoembed-server',
    name: 'AutoEmbed 4K',
    badge: 'High Speed',
    url: `https://player.autoembed.cc/embed/movie/${tmdbId}`,
    type: 'iframe',
    quality: '1080p / 4K',
    description: 'Ultra fast streaming mirror with low ad density'
  });

  // Server 6: CodeSpecters TV Embed (Series episodes with API key)
  servers.push({
    id: 'codespecters-tv',
    name: 'NexStream TV',
    badge: 'Direct TV',
    url: `https://api.codespecters.com/embed/tv/${tmdbId}/${season}/${episode}?apikey=${key}`,
    type: 'iframe',
    quality: 'HD 1080p',
    description: 'Multi-episode TV & series streaming via CodeSpecters'
  });

  // Server 7: Direct User Upload / MP4 (if available)
  if (movie.videoUrl && movie.videoUrl.startsWith('http')) {
    servers.push({
      id: 'direct-video',
      name: 'Direct Cloud Stream',
      badge: 'Original File',
      url: movie.videoUrl,
      type: 'video',
      quality: 'Original MP4',
      description: 'Zero ads, direct uploaded file'
    });
  }

  // Server 8: Official Trailer Embed (if available)
  if (movie.trailer && movie.trailer.startsWith('http')) {
    let trailerEmbed = movie.trailer;
    if (trailerEmbed.includes('youtube.com/watch?v=')) {
      const vid = trailerEmbed.split('watch?v=')[1]?.split('&')[0];
      trailerEmbed = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0`;
    } else if (trailerEmbed.includes('youtu.be/')) {
      const vid = trailerEmbed.split('youtu.be/')[1]?.split('?')[0];
      trailerEmbed = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0`;
    }

    servers.push({
      id: 'trailer-stream',
      name: 'Official 4K Trailer',
      badge: 'Cinema Preview',
      url: trailerEmbed,
      type: 'iframe',
      quality: '4K HDR',
      description: 'Official studio trailer in 4K'
    });
  }

  return servers;
}
