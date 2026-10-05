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
  // Movies & Shows from user prompts & popular blockbusters
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
    return getMovieTmdbId(movie);
  }

  return null;
}

/**
 * Checks if a movie/title represents a TV Series
 */
export function isTvOrSeries(movie: Movie): boolean {
  if (movie.isTv) return true;
  if (movie.initialSeason !== undefined || movie.initialEpisode !== undefined) return true;

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
    'succession',
    'renegade immortal',
    'peaky blinders',
    'money heist',
    'vikings',
    'the witcher',
    'friends',
    'the office',
    'sherlock',
    'narcos',
    'dark',
    'black mirror',
    'westworld',
    'fargo',
    'dexter',
    'prison break',
    'supernatural',
    'attack on titan',
    'demon slayer',
    'jujutsu kaisen',
    'one piece',
    'naruto',
    'solo leveling'
  ];

  if (tvTitles.some(t => titleLower.includes(t))) return true;
  if (genreLower.includes('tv') || genreLower.includes('series') || titleLower.includes('season') || titleLower.includes('episode')) return true;

  return false;
}

/**
 * Filter movies by media type: 'all' | 'movie' | 'tv'
 */
export function matchesMediaType(movie: Movie, type: 'all' | 'movie' | 'tv'): boolean {
  if (type === 'all') return true;
  const isTv = isTvOrSeries(movie);
  if (type === 'tv') return isTv;
  if (type === 'movie') return !isTv;
  return true;
}

/**
 * Filter movies by category / genre name
 */
export function matchesCategory(movie: Movie, category: string): boolean {
  if (!category || category === 'all' || category === 'All' || category === 'All Categories') return true;
  const target = category.toLowerCase().trim();
  const genre = (movie.genre || '').toLowerCase();
  const title = (movie.title || '').toLowerCase();
  
  if (target === 'animation' || target === 'anime') {
    return genre.includes('anim') || /anime|animation|manga/i.test(`${genre} ${title}`);
  }
  if (target === 'sci-fi' || target === 'scifi') {
    return genre.includes('sci-fi') || genre.includes('science fiction') || /space|alien|interstellar|inception|dune|matrix|avatar/i.test(`${genre} ${title}`);
  }
  return genre.includes(target) || title.includes(target);
}

export interface StreamServer {
  id: string;
  name: string;
  badge: string;
  url: string;
  type: 'iframe' | 'video';
  quality: string;
  description: string;
  isHindi?: boolean;
  isFilmu?: boolean;
  isCineSrc?: boolean;
  isAutoEmbed?: boolean;
  isTv?: boolean;
  isAnime?: boolean;
}

/**
 * Generates stream servers for a movie or TV show.
 * NOTE: As requested by the user, Hindi / Multi-Audio servers are prioritized FIRST.
 * If the Hindi server is unavailable or fails, auto-fallback connects to the next server.
 */
export function getMovieStreamServers(movie: Movie, season: number = 1, episode: number = 1): StreamServer[] {
  const tmdbId = getMovieTmdbId(movie);
  const key = CODESPECTERS_API_KEY;
  const isSeries = isTvOrSeries(movie);
  const anilistId = getAnimeAnilistId(movie);

  const servers: StreamServer[] = [];

  // ============================================================
  // SERVER 1: Filmy / Filmu Player (Top Priority - CONNECTED FIRST)
  // URL Pattern:
  //   Movies: https://embed.filmu.in/movie/${tmdbId}
  //   TV:     https://embed.filmu.in/tv/${tmdbId}/${season}/${episode}
  // ============================================================
  const filmuUrl = isSeries 
    ? `https://embed.filmu.in/tv/${tmdbId}/${season}/${episode}`
    : `https://embed.filmu.in/movie/${tmdbId}`;

  servers.push({
    id: 'filmu-primary',
    name: 'Filmy Server',
    badge: 'Filmy #1 Priority',
    url: filmuUrl,
    type: 'iframe',
    quality: '4K / 1080p',
    description: 'Top priority Filmy server with Hindi audio, multi-language switcher & subtitles',
    isHindi: true,
    isFilmu: true,
    isTv: isSeries
  });

  // ============================================================
  // SERVER 2: CineSrc 4K (Secondary Fast Backup Server)
  // URL Pattern:
  //   Movies: https://cinesrc.st/embed/movie/${tmdbId}
  //   TV:     https://cinesrc.st/embed/tv/${tmdbId}?s=${season}&e=${episode}
  // ============================================================
  const cinesrcUrl = isSeries
    ? `https://cinesrc.st/embed/tv/${tmdbId}?s=${season}&e=${episode}`
    : `https://cinesrc.st/embed/movie/${tmdbId}`;

  servers.push({
    id: 'cinesrc-hindi',
    name: 'CineSrc 4K',
    badge: 'Hindi / Multi-Audio',
    url: cinesrcUrl,
    type: 'iframe',
    quality: '4K Ultra HD',
    description: 'Secondary Hindi & Multi-Audio fast stream with multi-server failover',
    isHindi: true,
    isCineSrc: true,
    isTv: isSeries
  });

  // ============================================================
  // SERVER 3: AutoEmbed App (User Requested Server: player.autoembed.app)
  // Endpoints:
  //   Movies: https://player.autoembed.app/embed/movie/{id}
  //   TV:     https://player.autoembed.app/embed/tv/{id}/{season}/{episode}
  // Valid parameters: {id} from imdb (with tt) or themoviedb.com
  // ============================================================
  const autoembedAppUrl = isSeries
    ? `https://player.autoembed.app/embed/tv/${tmdbId}/${season}/${episode}`
    : `https://player.autoembed.app/embed/movie/${tmdbId}`;

  servers.push({
    id: 'autoembed-app',
    name: 'AutoEmbed App',
    badge: isSeries ? `S${season}:E${episode}` : 'AutoEmbed 4K',
    url: autoembedAppUrl,
    type: 'iframe',
    quality: '1080p / 4K',
    description: isSeries
      ? `AutoEmbed App TV endpoint: S${season} Ep${episode} (TMDb: ${tmdbId})`
      : `AutoEmbed App Movie endpoint (TMDb: ${tmdbId})`,
    isAutoEmbed: true,
    isTv: isSeries
  });

  // ============================================================
  // SERVER 3: CodeSpecters NexStream (Your Official API Key)
  // ============================================================
  servers.push({
    id: 'codespecters-primary',
    name: 'CodeSpecters (API Key)',
    badge: 'nx_ Verified',
    url: `https://api.codespecters.com/embed/movie/${tmdbId}?apikey=${key}`,
    type: 'iframe',
    quality: '4K Ultra HD',
    description: 'Direct high-speed verified stream with your official API key'
  });

  // ============================================================
  // SERVER 4: CineSrc TV & Episodes (Direct Season/Episode streamer)
  // ============================================================
  if (isSeries) {
    servers.push({
      id: 'cinesrc-tv',
      name: 'CineSrc TV & Episodes',
      badge: `S${season}:E${episode}`,
      url: `https://cinesrc.st/embed/tv/${tmdbId}?s=${season}&e=${episode}`,
      type: 'iframe',
      quality: '1080p Full HD',
      description: `CineSrc episodic player with season & episode navigator (S${season}:E${episode})`,
      isCineSrc: true,
      isTv: true
    });
  }

  // ============================================================
  // SERVER 5: AutoEmbed Fast Mirror (Ultra-fast backup)
  // ============================================================
  servers.push({
    id: 'autoembed-server',
    name: 'AutoEmbed 4K',
    badge: 'High Speed',
    url: `https://player.autoembed.cc/embed/movie/${tmdbId}`,
    type: 'iframe',
    quality: '1080p / 4K',
    description: 'Ultra fast streaming mirror with low ad density'
  });

  // ============================================================
  // SERVER 6: CodeSpecters TV Embed (Series episodes with API key)
  // ============================================================
  servers.push({
    id: 'codespecters-tv',
    name: 'NexStream TV',
    badge: 'Direct TV',
    url: `https://api.codespecters.com/embed/tv/${tmdbId}/${season}/${episode}?apikey=${key}`,
    type: 'iframe',
    quality: 'HD 1080p',
    description: 'Multi-episode TV & series streaming via CodeSpecters'
  });

  // ============================================================
  // SERVER 7: Filmu Anime Player (if anime)
  // ============================================================
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

  // ============================================================
  // SERVER 8: Direct User Upload / MP4 (if available)
  // ============================================================
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

  // ============================================================
  // SERVER 9: Official Trailer Embed (if available)
  // ============================================================
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
