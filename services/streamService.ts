import { Movie } from '../types.ts';

export const CODESPECTERS_API_KEY = 
  (import.meta as any).env?.VITE_CODESPECTERS_API_KEY || 
  (import.meta as any).env?.VITE_STREAMING_API_KEY || 
  (import.meta as any).env?.VITE_NEXUS_API_KEY || 
  "nx_f3ccddc8595f92a260f141adc7a7ec50";

/**
 * Extracts a valid numeric TMDb ID from a Movie object
 */
export function getMovieTmdbId(movie: Movie): number {
  // 1. Direct watchmodeId (if present and numeric)
  if (movie.watchmodeId && !isNaN(Number(movie.watchmodeId)) && Number(movie.watchmodeId) > 0) {
    return Number(movie.watchmodeId);
  }

  // 2. Numeric digits from id (e.g. "tmdb_597", "597", "tmdb-597")
  if (movie.id) {
    const digits = String(movie.id).replace(/\D/g, '');
    if (digits && digits.length >= 2 && digits.length <= 9) {
      const parsed = parseInt(digits, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  // 3. Known popular movie titles lookup as reliable fallback
  const titleLower = (movie.title || '').toLowerCase().trim();
  const knownTmdbMap: Record<string, number> = {
    'titanic': 597,
    'inception': 27205,
    'interstellar': 157336,
    'avatar': 19995,
    'avatar: the way of water': 76600,
    'the dark knight': 155,
    'the matrix': 603,
    'gladiator': 98,
    'pulp fiction': 680,
    'the shawshank redemption': 278,
    'oppenheimer': 872585,
    'dune': 438631,
    'dune: part two': 693134,
    'fight club': 550,
    'spider-man': 557,
    'spider-man: no way home': 634649,
    'deadpool': 293660,
    'deadpool & wolverine': 533535,
    'avengers: endgame': 299534,
    'the avengers': 24428,
    'jurassic park': 329,
    'alien: romulus': 945961,
    'the wild robot': 1184918,
    'john wick': 245891,
    'top gun: maverick': 361743
  };

  for (const [key, id] of Object.entries(knownTmdbMap)) {
    if (titleLower.includes(key) || key.includes(titleLower)) {
      return id;
    }
  }

  // Fallback to Titanic (597) if no ID could be resolved
  return 597;
}

export interface StreamServer {
  id: string;
  name: string;
  badge: string;
  url: string;
  type: 'iframe' | 'video';
  quality: string;
}

/**
 * Generates stream servers for a movie using CodeSpecters NexStream API
 */
export function getMovieStreamServers(movie: Movie): StreamServer[] {
  const tmdbId = getMovieTmdbId(movie);
  const key = CODESPECTERS_API_KEY;

  const servers: StreamServer[] = [];

  // Primary Server: CodeSpecters NexStream Movie Embed
  servers.push({
    id: 'codespecters-primary',
    name: 'CodeSpecters NexStream',
    badge: '4K Ultra HD · Fast',
    url: `https://api.codespecters.com/embed/movie/${tmdbId}?apikey=${key}`,
    type: 'iframe',
    quality: '4K / 1080p'
  });

  // Server 2: CodeSpecters TV Embed (in case it is an episodic release)
  servers.push({
    id: 'codespecters-tv',
    name: 'NexStream TV & Episodes',
    badge: 'Multi-Audio · Subtitles',
    url: `https://api.codespecters.com/embed/tv/${tmdbId}/1/1?apikey=${key}`,
    type: 'iframe',
    quality: 'HD 1080p'
  });

  // Server 3: Direct User Upload / MP4 (if available)
  if (movie.videoUrl && movie.videoUrl.startsWith('http')) {
    servers.push({
      id: 'direct-video',
      name: 'Direct Cloud Stream',
      badge: 'Original File',
      url: movie.videoUrl,
      type: 'video',
      quality: 'Original MP4'
    });
  }

  // Server 4: Official Trailer Embed (if available)
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
      quality: '4K HDR'
    });
  }

  return servers;
}
