import { Movie } from '../types.ts';
import { getMovieOverride } from './streamFixService.ts';

export const CODESPECTERS_API_KEY = 
  (import.meta as any).env?.VITE_CODESPECTERS_API_KEY || 
  (import.meta as any).env?.VITE_STREAMING_API_KEY || 
  (import.meta as any).env?.VITE_NEXUS_API_KEY || 
  "nx_f3ccddc8595f92a260f141adc7a7ec50";

/**
 * Known TMDb ID dictionary for reliable resolution of popular movies & shows.
 * Exact and longer keys take precedence to prevent sequel/prequel ID mismatch.
 */
export const KNOWN_TMDB_MAP: Record<string, number> = {
  // Blockbuster sequels and titles with common prefixes
  'spider-man: across the spider-verse': 569094,
  'spider-man: into the spider-verse': 324857,
  'spider-man: no way home': 634649,
  'spider-man: homecoming': 315635,
  'spider-man: far from home': 429617,
  'the amazing spider-man 2': 102382,
  'the amazing spider-man': 1930,
  'spider-man 3': 559,
  'spider-man 2': 558,
  'spider-man': 557,

  'deadpool & wolverine': 533535,
  'deadpool 2': 383498,
  'deadpool': 293660,

  'avengers: endgame': 299534,
  'avengers: infinity war': 299536,
  'avengers: age of ultron': 99861,
  'the avengers': 24428,

  'the dark knight rises': 49026,
  'the dark knight': 155,
  'batman begins': 272,
  'the batman': 414906,

  'dune: part two': 693134,
  'dune': 438631,

  'iron man 3': 68721,
  'iron man 2': 10138,
  'iron man': 1726,

  'avatar: the way of water': 76600,
  'avatar': 19995,

  'gladiator ii': 558449,
  'gladiator': 98,

  'john wick: chapter 4': 603692,
  'john wick: chapter 3 - parabellum': 458156,
  'john wick: chapter 2': 324552,
  'john wick': 245891,

  'top gun: maverick': 361743,
  'top gun': 744,

  'alien: romulus': 945961,
  'alien: covenant': 126889,
  'alien': 348,

  'inside out 2': 1022789,
  'inside out': 150540,

  'moana 2': 1241982,
  'moana': 277834,

  'twisters': 718821,
  'twister': 664,

  'blade runner 2049': 335984,
  'blade runner': 78,

  'the lord of the rings: the return of the king': 122,
  'the lord of the rings: the two towers': 121,
  'the lord of the rings: the fellowship of the ring': 120,

  'the godfather part ii': 240,
  'the godfather': 238,

  'resident evil: welcome to raccoon city': 460458,
  'resident evil: the final chapter': 173897,
  'resident evil: retribution': 93837,
  'resident evil: afterlife': 35791,
  'resident evil: extinction': 77,
  'resident evil: apocalypse': 1577,
  'resident evil': 1576,

  // Standalone blockbusters
  'oppenheimer': 872585,
  'barbie': 346698,
  'interstellar': 157336,
  'inception': 27205,
  'the matrix': 603,
  'fight club': 550,
  'the shawshank redemption': 278,
  'pulp fiction': 680,
  'forrest gump': 13,
  'titanic': 597,
  'parasite': 496243,
  'the wild robot': 1184918,
  'beetlejuice beetlejuice': 917496,
  'wicked': 402431,
  'jurassic world': 135397,
  'jurassic park': 329,

  // TV Series
  'breaking bad': 1396,
  'better call saul': 60059,
  'stranger things': 66732,
  'house of the dragon': 94997,
  'game of thrones': 1399,
  'the boys': 76479,
  'fallout': 106379,
  'shogun': 126308,
  'shōgun': 126308,
  'loki': 84958,
  'the last of us': 100088,
  'wednesday': 119051,
  'squid game': 93405,
  'the bear': 136283,
  'arcane': 94605,
  'peaky blinders': 60574,
  'money heist': 71446,
  'vikings': 44217,
  'the witcher': 71912,
  'friends': 1668,
  'the office': 2316,
  'sherlock': 19885,
  'narcos': 63351,
  'dark': 70523,
  'black mirror': 42009,
  'westworld': 63247,
  'fargo': 57243,
  'dexter': 1405,
  'prison break': 2288,
  'supernatural': 1622,

  // Indian Cinema Blockbusters (strictly mapped to prevent mismatch)
  'rrr': 579974,
  'jawan': 872906,
  'animal': 781732,
  'dangal': 360814,
  'k.g.f: chapter 2': 587412,
  'kgf chapter 2': 587412,
  'k.g.f: chapter 1': 564147,
  'kgf chapter 1': 564147,
  'baahubali 2: the conclusion': 350312,
  'bahubali 2': 350312,
  'baahubali: the beginning': 256040,
  'bahubali': 256040,
  'kalki 2898 ad': 801688,
  'kalki 2898-ad': 801688,
  'stree 2': 1112426,
  'stree': 534444,
  'pushpa: the rise': 690957,
  'pushpa the rise': 690957,
  'pushpa 2 - the rule': 857598,
  'pushpa 2': 857598,
  'pathaan': 864692,
  'dunki': 960876,
  '3 idiots': 20453,
  'sholay': 12259,
  'lagaan': 19666,
  'bajrangi bhaijaan': 348892,
  'dilwale dulhania le jayenge': 19404,
  'salaar: part 1 - ceasefire': 770906,
  'salaar': 770906,
  'vikram': 743563,
  'leo': 949229,
  'jailer': 937020,
  'kantara': 858485
};

// Sort known title keys from longest to shortest so specific sequels match before generic titles
const SORTED_KNOWN_KEYS = Object.keys(KNOWN_TMDB_MAP).sort((a, b) => b.length - a.length);

/**
 * Known IMDb IDs for top titles to assist servers that prefer IMDb 'tt...' parameter
 */
export const KNOWN_IMDB_MAP: Record<string, string> = {
  'breaking bad': 'tt0903747',
  'stranger things': 'tt4574334',
  'house of the dragon': 'tt11198330',
  'game of thrones': 'tt0944947',
  'the boys': 'tt1190634',
  'fallout': 'tt12637874',
  'shogun': 'tt2788316',
  'shōgun': 'tt2788316',
  'loki': 'tt9140554',
  'the last of us': 'tt3581920',
  'wednesday': 'tt13443470',
  'squid game': 'tt10919420',
  'arcane': 'tt11126994',
  'dark': 'tt5753856',
  'deadpool & wolverine': 'tt6263850',
  'avengers: endgame': 'tt4154796',
  'the dark knight': 'tt0468569',
  'interstellar': 'tt0816692',
  'dune: part two': 'tt15239678',
  'oppenheimer': 'tt15398776',
  'gladiator': 'tt0172495',
  'fight club': 'tt0137523',
  'the matrix': 'tt0133093',
  'inception': 'tt1375666',
  'the shawshank redemption': 'tt0111161',
  'pulp fiction': 'tt0110912',
  'iron man': 'tt0371746',
  'titanic': 'tt0120338'
};

/**
 * Extracts a valid numeric TMDb ID from a Movie object with strict matching
 * to prevent sequel/prequel or incorrect ID mismatch.
 */
export function getMovieTmdbId(movie: Movie): number {
  if (!movie) return 533535;

  const titleLower = (movie.title || '').toLowerCase().trim();
  const cleanTitle = titleLower.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

  // SPECIAL PROTECTION: TV Show "Dark" must ALWAYS resolve to 70523 (TV Series)
  // and NEVER to The Dark Knight (155) or The Dark Knight Rises (49026)
  if (cleanTitle === 'dark' || movie.id === 'tmdb_70523') {
    return 70523;
  }

  // 0. Check verified user report fix override first
  if (movie.id) {
    const override = getMovieOverride(movie.id);
    if (override && override.tmdbId && !isNaN(Number(override.tmdbId)) && Number(override.tmdbId) > 0) {
      // Prevent corrupted override mapping Dark to Batman / Dark Knight
      if (cleanTitle === 'dark' && (Number(override.tmdbId) === 155 || Number(override.tmdbId) === 49026)) {
        return 70523;
      }
      return Number(override.tmdbId);
    }
  }

  // 1. Direct numeric tmdbId if provided
  if (movie.tmdbId && !isNaN(Number(movie.tmdbId)) && Number(movie.tmdbId) > 0) {
    return Number(movie.tmdbId);
  }

  // 2. Direct numeric watchmodeId (in our dataset watchmodeId holds TMDb ID)
  if (movie.watchmodeId && !isNaN(Number(movie.watchmodeId)) && Number(movie.watchmodeId) > 0) {
    return Number(movie.watchmodeId);
  }

  // 3. Direct format tmdb_12345 on movie.id
  if (movie.id && String(movie.id).startsWith('tmdb_')) {
    const rawNum = parseInt(String(movie.id).replace('tmdb_', ''), 10);
    if (!isNaN(rawNum) && rawNum > 0) return rawNum;
  }

  // 4. Exact match in KNOWN_TMDB_MAP
  if (KNOWN_TMDB_MAP[titleLower]) {
    return KNOWN_TMDB_MAP[titleLower];
  }

  // 5. Clean normalized title exact match in KNOWN_TMDB_MAP (strict equality to prevent mismatches)
  for (const key of SORTED_KNOWN_KEYS) {
    const cleanKey = key.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanTitle === cleanKey) {
      return KNOWN_TMDB_MAP[key];
    }
  }

  // 6. Numeric digits from id if valid length (e.g. "597", "tmdb-597")
  if (movie.id) {
    const digits = String(movie.id).replace(/\D/g, '');
    if (digits && digits.length >= 2 && digits.length <= 9) {
      const parsed = parseInt(digits, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  // Fallback to Deadpool & Wolverine (533535) if no ID could be resolved
  return 533535;
}

/**
 * Resolves IMDb ID (with tt prefix) if available for mirrors that require it
 */
export function getMovieImdbId(movie: Movie): string | null {
  if (movie.imdbId && movie.imdbId.startsWith('tt')) {
    return movie.imdbId;
  }
  const titleLower = (movie.title || '').toLowerCase().trim();
  const cleanTitle = titleLower.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

  if (KNOWN_IMDB_MAP[titleLower]) {
    return KNOWN_IMDB_MAP[titleLower];
  }
  for (const [key, imdb] of Object.entries(KNOWN_IMDB_MAP)) {
    const cleanKey = key.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanTitle === cleanKey) {
      return imdb;
    }
  }
  return null;
}

export interface MovieVerificationStatus {
  isAlreadyCorrect: boolean;
  verifiedTitle: string;
  verifiedTmdbId: number;
  reason: string;
}

/**
 * Checks whether a movie's metadata and stream mapping are already confirmed correct.
 * For movies that are already correct:
 * - We do NOT change their TMDb ID or stream mapping.
 * - We show the user that it is already correct.
 * - If the user selects "not correct", we do NOT change it, and show "we will fix soon".
 */
export function checkMovieVerification(movie: Movie): MovieVerificationStatus {
  if (!movie) {
    return { isAlreadyCorrect: false, verifiedTitle: '', verifiedTmdbId: 0, reason: '' };
  }

  const titleLower = (movie.title || '').toLowerCase().trim();
  const cleanTitle = titleLower.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const tmdbId = getMovieTmdbId(movie);

  // TV Series "Dark" is permanently verified as TMDb 70523 (never The Dark Knight 155)
  if (cleanTitle === 'dark' || movie.id === 'tmdb_70523') {
    return {
      isAlreadyCorrect: true,
      verifiedTitle: 'Dark',
      verifiedTmdbId: 70523,
      reason: 'Official Netflix sci-fi TV series (2017) with verified multi-season streaming'
    };
  }

  // 1. Direct match in KNOWN_TMDB_MAP
  if (KNOWN_TMDB_MAP[titleLower] && KNOWN_TMDB_MAP[titleLower] === tmdbId) {
    return {
      isAlreadyCorrect: true,
      verifiedTitle: movie.title,
      verifiedTmdbId: tmdbId,
      reason: 'Official verified title in blockbuster cinema registry'
    };
  }

  for (const key of SORTED_KNOWN_KEYS) {
    const cleanKey = key.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanTitle === cleanKey && KNOWN_TMDB_MAP[key] === tmdbId) {
      return {
        isAlreadyCorrect: true,
        verifiedTitle: movie.title,
        verifiedTmdbId: tmdbId,
        reason: 'Official verified title in blockbuster cinema registry'
      };
    }
  }

  // 2. Direct format tmdb_12345 with matching valid tmdbId and confirmed release year
  if (movie.id && String(movie.id).startsWith('tmdb_')) {
    const rawId = parseInt(String(movie.id).replace('tmdb_', ''), 10);
    if (rawId === tmdbId && tmdbId > 0 && movie.year && movie.year >= 1970) {
      return {
        isAlreadyCorrect: true,
        verifiedTitle: movie.title,
        verifiedTmdbId: tmdbId,
        reason: 'Direct verified TMDb catalog mapping with confirmed release year'
      };
    }
  }

  // 3. Verified platform title or explicitly marked verified
  if ((movie as any).isVerified || (movie as any).verified) {
    return {
      isAlreadyCorrect: true,
      verifiedTitle: movie.title,
      verifiedTmdbId: tmdbId,
      reason: 'Studio verified metadata with authentic streaming sources'
    };
  }

  // 4. Identical valid watchmodeId and tmdbId
  if (movie.watchmodeId && movie.tmdbId && Number(movie.watchmodeId) === Number(movie.tmdbId) && Number(movie.tmdbId) > 0) {
    return {
      isAlreadyCorrect: true,
      verifiedTitle: movie.title,
      verifiedTmdbId: tmdbId,
      reason: 'Cross-verified database match between TMDb and provider'
    };
  }

  return {
    isAlreadyCorrect: false,
    verifiedTitle: movie.title,
    verifiedTmdbId: tmdbId,
    reason: ''
  };
}

/**
 * Checks if a movie/title represents a TV Series.
 * Strictly respects movie.isTv to prevent movies from getting TV endpoints.
 */
export function isTvOrSeries(movie: Movie): boolean {
  if (!movie) return false;

  const titleLower = (movie.title || '').toLowerCase().trim();
  const cleanTitle = titleLower.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

  // TV Series "Dark" is always TV
  if (cleanTitle === 'dark' || movie.id === 'tmdb_70523') {
    return true;
  }

  // 1. Explicit boolean on isTv property
  if (movie.isTv !== undefined) {
    return Boolean(movie.isTv);
  }

  // 2. Initial season / episode explicitly set
  if (movie.initialSeason !== undefined || movie.initialEpisode !== undefined) {
    return true;
  }

  const genreLower = (movie.genre || '').toLowerCase().trim();
  if (genreLower.includes('tv') || genreLower.includes('series') || genreLower.includes('show')) {
    return true;
  }

  // 3. Exact match only with known TV titles (never use loose .includes() to avoid classifying movies like The Dark Knight as TV)
  const tvTitles = [
    'house of the dragon',
    'game of thrones',
    'breaking bad',
    'better call saul',
    'stranger things',
    'the last of us',
    'the boys',
    'shogun',
    'shōgun',
    'fallout',
    'loki',
    'squid game',
    'wednesday',
    'the bear',
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
    'solo leveling',
    'ted lasso',
    'severance',
    'slow horses',
    'silo',
    'foundation',
    'for all mankind',
    'the morning show',
    'presumed innocent',
    'masters of the air',
    'reacher',
    'invincible',
    'the lord of the rings: the rings of power',
    'the mandalorian',
    'wandavision',
    'andor',
    'ahsoka',
    'x-men 97',
    'the sopranos',
    'the wire',
    'euphoria',
    'true detective',
    'chernobyl',
    'the penguin',
    'the white lotus',
    'only murders in the building',
    'the handmaids tale'
  ];

  if (tvTitles.some(t => {
    const cleanT = t.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    return titleLower === t || cleanTitle === cleanT;
  })) {
    return true;
  }

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
  isVidSrc?: boolean;
  isTv?: boolean;
  isAnime?: boolean;
}

/**
 * Determines whether a title is of Indian origin (Bollywood, Tollywood, regional cinema, Hindi/Tamil/Telugu/etc.)
 * Accurately prevents false positives on Hollywood/Western movies (e.g. War, Animal, Star Wars, Dark Knight).
 */
export function isIndianContent(movie: Movie): boolean {
  if (!movie) return false;

  const anyMovie = movie as any;
  // 1. Language code check
  const lang = String(anyMovie.original_language || anyMovie.language || '').toLowerCase().trim();
  if (['hi', 'ta', 'te', 'ml', 'kn', 'pa', 'bn', 'mr', 'gu', 'ur', 'or'].includes(lang)) {
    return true;
  }

  // 2. Country check
  if (Array.isArray(anyMovie.origin_country) && anyMovie.origin_country.some((c: string) => String(c).toUpperCase() === 'IN')) {
    return true;
  }
  if (anyMovie.country && String(anyMovie.country).toUpperCase() === 'IN') {
    return true;
  }

  // 3. Indian genres (avoid generic single English words)
  const genreLower = (movie.genre || '').toLowerCase();
  if (/\b(bollywood|tollywood|kollywood|mollywood|sandalwood|hindi cinema|indian cinema)\b/i.test(genreLower)) {
    return true;
  }

  // 4. Normalized title match against known Indian titles
  const cleanTitle = (movie.title || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const EXACT_INDIAN_TITLES = new Set([
    'rrr', 'jawan', 'pathaan', 'animal', 'dangal', 'pk', '3 idiots', 'sholay', 'lagaan',
    'baahubali the beginning', 'baahubali 2 the conclusion', 'bahubali', 'bahubali 2',
    'k g f chapter 1', 'k g f chapter 2', 'kgf', 'kgf 1', 'kgf 2', 'kalki 2898 ad',
    'stree', 'stree 2', 'salaar', 'pushpa', 'pushpa the rise', 'pushpa 2', 'pushpa 2 the rule',
    'dunki', 'brahmastra', 'brahmastra part one shiva', 'kabir singh', 'bajrangi bhaijaan',
    'chennai express', 'om shanti om', 'dilwale dulhania le jayenge', 'drishyam', 'drishyam 2',
    'kantara', 'vikram', 'jailer', 'chhaava', 'devara', 'devara part 1', 'leo', 'master',
    'tiger 3', 'tiger zinda hai', 'ek tha tiger', 'fighter', 'bhool bhulaiyaa 2',
    'bhool bhulaiyaa 3', 'singham', 'singham again', 'gadar 2', 'sooryavanshi', 'simmba'
  ]);

  if (EXACT_INDIAN_TITLES.has(cleanTitle)) {
    return true;
  }

  // Title starting with specific multi-word Indian franchises
  const INDIAN_TITLE_PREFIXES = [
    'baahubali', 'k g f', 'kgf', 'pushpa', 'stree', 'drishyam', 'bhool bhulaiyaa',
    'singham', 'kalki 2898', 'dilwale dulhania', 'chennai express', 'bajrangi bhaijaan'
  ];
  if (INDIAN_TITLE_PREFIXES.some(prefix => cleanTitle.startsWith(prefix))) {
    return true;
  }

  // 5. Explicit Indian stars or industry terms in description (NO single words like "war" or "animal")
  const text = `${movie.description || ''} ${genreLower}`.toLowerCase();
  const indianKeywords = /\b(bollywood|tollywood|kollywood|mollywood|hindi film|hindi movie|tamil film|tamil movie|telugu film|telugu movie|malayalam cinema|kannada cinema|indian cinema|shah rukh khan|salman khan|aamir khan|deepika padukone|ranbir kapoor|amitabh bachchan|hrithik roshan|allu arjun|ram charan|rajinikanth|kamal haasan|prabhas|thalapathy vijay|ajith kumar|junior ntr|jr ntr|sanjay dutt|ranveer singh)\b/i;
  if (indianKeywords.test(text)) {
    return true;
  }

  // 6. Known Indian TMDb IDs
  const INDIAN_TMDB_IDS = new Set<number>([
    19404,  // Dilwale Dulhania Le Jayenge
    579974, // RRR
    564147, // K.G.F: Chapter 1
    587412, // K.G.F: Chapter 2
    256040, // Bāhubali: The Beginning
    350312, // Bāhubali 2: The Conclusion
    872906, // Jawan
    864692, // Pathaan
    360814, // Dangal
    20453,  // 3 Idiots
    12259,  // Sholay
    19666,  // Lagaan
    297222, // PK
    348892, // Bajrangi Bhaijaan
    581388, // Kabir Singh
    781732, // Animal
    770906, // Salaar
    801688, // Kalki 2898 AD
    1112426,// Stree 2
    493529, // Brahmāstra
    690957, // Pushpa: The Rise
    857598, // Pushpa 2: The Rule
    960876, // Dunki
    849869, // Tiger 3
    850165, // Fighter
    949229, // Leo
    671039, // Master
    743563, // Vikram
    937020, // Jailer
    858485  // Kantara
  ]);

  const id = movie.watchmodeId || movie.tmdbId;
  if (id && INDIAN_TMDB_IDS.has(Number(id))) {
    return true;
  }

  return false;
}

/**
 * Generates stream servers for a movie or TV show.
 * 
 * Order logic per user specification:
 * - Foreign films: Filmy Server (embed.filmu.in) prioritized as Server #1
 * - Indian films: AutoEmbed Server (player.autoembed.co) prioritized as Server #1
 */
export function getMovieStreamServers(movie: Movie, season: number = 1, episode: number = 1): StreamServer[] {
  const tmdbId = getMovieTmdbId(movie);
  const imdbId = getMovieImdbId(movie);
  const key = CODESPECTERS_API_KEY;
  const isSeries = isTvOrSeries(movie);
  const isIndian = isIndianContent(movie);

  const autoembedId = imdbId || tmdbId;
  const autoembedPlayerUrl = isSeries
    ? `https://player.autoembed.co/embed/tv/${autoembedId}/${season}/${episode}`
    : `https://player.autoembed.co/embed/movie/${autoembedId}`;

  const autoembedServer: StreamServer = {
    id: 'autoembed-mirror',
    name: 'AutoEmbed 4K VIP',
    badge: isIndian ? 'Indian Priority (Fast)' : '4K Ultra HD',
    url: autoembedPlayerUrl,
    type: 'iframe',
    quality: '1080p / 4K',
    description: isIndian
      ? 'AutoEmbed VIP - Prioritized top server for Indian & regional titles'
      : (isSeries 
          ? `AutoEmbed VIP Player (Season ${season} Episode ${episode})`
          : 'Ultra-fast 4K streaming player with instant playback and multi-source failover'),
    isAutoEmbed: true,
    isTv: isSeries
  };

  const filmuUrl = isSeries 
    ? `https://embed.filmu.in/tv/${tmdbId}/${season}/${episode}`
    : `https://embed.filmu.in/movie/${tmdbId}`;

  const filmuServer: StreamServer = {
    id: 'filmu-primary',
    name: 'Filmy Server',
    badge: !isIndian ? 'Foreign Priority (Filmy)' : 'Hindi / Multi-Audio',
    url: filmuUrl,
    type: 'iframe',
    quality: '4K / 1080p',
    description: !isIndian
      ? 'Top priority Filmy server for foreign/international cinema with multi-language audio & subtitles'
      : 'Filmy Server with Hindi/multi-language audio switcher & subtitles',
    isHindi: true,
    isFilmu: true,
    isTv: isSeries
  };

  const cinesrcUrl = isSeries
    ? `https://cinesrc.st/embed/tv/${tmdbId}?s=${season}&e=${episode}`
    : `https://cinesrc.st/embed/movie/${tmdbId}`;

  const cinesrcServer: StreamServer = {
    id: 'cinesrc-hindi',
    name: 'CineSrc 4K',
    badge: 'Cinema 4K',
    url: cinesrcUrl,
    type: 'iframe',
    quality: '4K Ultra HD',
    description: 'Fast 4K playback with multi-server audio selector and cinema resolution',
    isHindi: true,
    isCineSrc: true,
    isTv: isSeries
  };

  const vidsrcMirrorUrl = isSeries
    ? `https://vidsrc.pm/embed/tv/${tmdbId}/${season}/${episode}`
    : `https://vidsrc.pm/embed/movie/${tmdbId}`;

  const vidsrcServer: StreamServer = {
    id: 'vidsrc-mirror',
    name: 'VidSrc Pro',
    badge: 'Instant Play',
    url: vidsrcMirrorUrl,
    type: 'iframe',
    quality: '1080p Full HD',
    description: 'High availability secondary mirror for seamless playback',
    isVidSrc: true,
    isTv: isSeries
  };

  const twoEmbedUrl = isSeries
    ? `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`
    : `https://www.2embed.cc/embed/${tmdbId}`;

  const twoEmbedServer: StreamServer = {
    id: 'twoembed-mirror',
    name: '2Embed 4K',
    badge: 'Dual Stream',
    url: twoEmbedUrl,
    type: 'iframe',
    quality: '1080p Full HD',
    description: 'Direct multi-source player with fast stream failover',
    isTv: isSeries
  };

  const autoembedCoUrl = isSeries
    ? `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`
    : `https://autoembed.co/movie/tmdb/${tmdbId}`;

  const autoembedPortalServer: StreamServer = {
    id: 'autoembed-co',
    name: 'AutoEmbed Portal',
    badge: 'Portal Mirror',
    url: autoembedCoUrl,
    type: 'iframe',
    quality: '1080p HD',
    description: 'AutoEmbed portal mirror with internal server selector',
    isAutoEmbed: true,
    isTv: isSeries
  };

  const codespectersUrl = isSeries
    ? `https://api.codespecters.com/embed/tv/${tmdbId}/${season}/${episode}?apikey=${key}`
    : `https://api.codespecters.com/embed/movie/${tmdbId}?apikey=${key}`;

  const codespectersServer: StreamServer = {
    id: 'codespecters-primary',
    name: 'CodeSpecters (nx_ Key)',
    badge: 'Verified API',
    url: codespectersUrl,
    type: 'iframe',
    quality: '4K Ultra HD',
    description: 'Direct high-speed verified stream with your official API key',
    isTv: isSeries
  };

  // User specification:
  // For TV Series: prioritize autoembedServer (#1) and vidsrcServer (#2) as they contain full seasons/episodes
  // For foreign films prioritize filmu server (#1)
  // For Indian films prioritize autoembed server (#1)
  const orderedServers: StreamServer[] = isSeries
    ? [autoembedServer, vidsrcServer, cinesrcServer, filmuServer, twoEmbedServer, autoembedPortalServer, codespectersServer]
    : (isIndian
        ? [autoembedServer, filmuServer, cinesrcServer, vidsrcServer, twoEmbedServer, autoembedPortalServer, codespectersServer]
        : [filmuServer, autoembedServer, cinesrcServer, vidsrcServer, twoEmbedServer, autoembedPortalServer, codespectersServer]);

  const servers: StreamServer[] = [...orderedServers];

  // If user reported an issue and streamFixService fixed it with a preferred server, prioritize it immediately
  if (movie.id) {
    const override = getMovieOverride(movie.id);
    if (override && override.preferredServer) {
      const preferredIdx = servers.findIndex(s => s.id === override.preferredServer);
      if (preferredIdx > 0) {
        const [promoted] = servers.splice(preferredIdx, 1);
        servers.unshift({
          ...promoted,
          badge: 'Fixed & Verified (Fast)'
        });
      }
    }
  }

  // ============================================================
  // SERVER 9: Direct User Upload / MP4 (if available)
  // ============================================================
  if (movie.videoUrl && movie.videoUrl.startsWith('http')) {
    servers.push({
      id: 'direct-video',
      name: 'Direct Video Stream',
      badge: 'MP4 / UGC',
      url: movie.videoUrl,
      type: 'video',
      quality: 'Original MP4',
      description: 'Zero ads, direct uploaded video stream'
    });
  }

  // ============================================================
  // SERVER 10: Official Trailer Embed (if available)
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
