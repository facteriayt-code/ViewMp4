/**
 * Service for 8Stream / Multi-Audio Stream API
 *
 * Flow:
 * 1. GET /api/v1/mediaInfo?id={imdbId}
 *    -> Returns playlist (array of language tracks: Hindi, English, Bengali, Tamil, Telugu) and decryption key
 * 2. GET /api/v1/getSeasonList?id={imdbId}
 *    -> Returns TV series seasons, episodes, and languages
 * 3. POST /api/v1/getStream with { file, key }
 *    -> Returns direct HLS (.m3u8) video stream link
 */

export interface StreamTrack {
  title: string;
  id: string;
  file: string;
  episode?: string;
  folder?: any[];
}

export interface MediaInfoData {
  playlist: StreamTrack[];
  key: string;
}

export interface MediaInfoResponse {
  success: boolean;
  data?: MediaInfoData;
  message?: string;
}

export interface SeasonInfo {
  season: string;
  totalEpisodes: number;
  lang: string[];
}

export interface SeasonListResponse {
  success: boolean;
  data?: {
    seasons: SeasonInfo[];
    type: 'tv' | 'movie';
  };
  message?: string;
}

export interface StreamLinkResponse {
  success: boolean;
  data?: {
    link: string;
  };
  message?: string;
}

const STORAGE_KEY_BASE_URL = 'stream_api_custom_base_url';

export function getStreamApiBaseUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_BASE_URL);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  return '';
}

export function setStreamApiBaseUrl(url: string): void {
  try {
    if (!url) {
      localStorage.removeItem(STORAGE_KEY_BASE_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_BASE_URL, url.trim().replace(/\/+$/, ''));
    }
  } catch {}
}

/**
 * Helper to build endpoint URLs, routing through local Express proxy or custom base URL
 */
function buildApiUrl(endpoint: string, queryParams: Record<string, string> = {}): string {
  const customBase = getStreamApiBaseUrl();
  let base = '';
  if (customBase) {
    base = customBase;
    if (!base.endsWith('/api/v1') && !endpoint.startsWith('/api/v1')) {
      base = `${base}/api/v1`;
    }
  } else {
    base = '/api/v1';
  }

  const cleanEndpoint = endpoint.replace(/^\/api\/v1/, '').replace(/^\//, '');
  const url = new URL(`${base}/${cleanEndpoint}`, window.location.origin);
  Object.entries(queryParams).forEach(([k, v]) => {
    url.searchParams.set(k, v);
  });
  return url.toString();
}

// In-memory cache for media info, season lists, and resolved stream links
const mediaInfoCache = new Map<string, { data: MediaInfoResponse; expiresAt: number }>();
const seasonListCache = new Map<string, { data: SeasonListResponse; expiresAt: number }>();
const streamLinkCache = new Map<string, { data: StreamLinkResponse; expiresAt: number }>();
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

/**
 * 1. Fetch Media Info & Track Playlist (Cached)
 */
export async function fetchMediaInfo(imdbId: string): Promise<MediaInfoResponse> {
  const cleanId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  
  const cached = mediaInfoCache.get(cleanId);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const targetUrl = buildApiUrl('mediaInfo', { id: cleanId });

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`MediaInfo request failed with status: ${response.status}`);
    }
    const data: MediaInfoResponse = await response.json();
    if (data.success && data.data?.playlist) {
      mediaInfoCache.set(cleanId, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    }
    return data;
  } catch (error: any) {
    console.warn(`[StreamAPI] mediaInfo error for ${cleanId}:`, error.message);
    return {
      success: false,
      message: error.message || 'Failed to fetch media info',
    };
  }
}

/**
 * 2. Fetch TV Series Seasons & Language Info (Cached)
 */
export async function fetchSeasonList(imdbId: string): Promise<SeasonListResponse> {
  const cleanId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;

  const cached = seasonListCache.get(cleanId);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const targetUrl = buildApiUrl('getSeasonList', { id: cleanId });

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`SeasonList request failed with status: ${response.status}`);
    }
    const data: SeasonListResponse = await response.json();
    if (data.success) {
      seasonListCache.set(cleanId, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    }
    return data;
  } catch (error: any) {
    console.warn(`[StreamAPI] getSeasonList error for ${cleanId}:`, error.message);
    return {
      success: false,
      message: error.message || 'Failed to fetch season list',
    };
  }
}

/**
 * 3. Fetch Direct Stream Link via POST { file, key } (Cached)
 */
export async function fetchStreamLink(file: string, key: string): Promise<StreamLinkResponse> {
  const cacheKey = `${file.slice(0, 32)}_${key.slice(0, 16)}`;
  const cached = streamLinkCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const targetUrl = buildApiUrl('getStream');

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ file, key }),
    });

    if (!response.ok) {
      throw new Error(`getStream request failed with status: ${response.status}`);
    }

    const data: StreamLinkResponse = await response.json();
    if (data.success && data.data?.link) {
      streamLinkCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    }
    return data;
  } catch (error: any) {
    console.warn('[StreamAPI] getStream error:', error.message);
    return {
      success: false,
      message: error.message || 'Failed to resolve stream link',
    };
  }
}

/**
 * High-level helper: Resolves stream link by preferred language track
 */
export async function resolveStreamForLanguage(
  imdbId: string,
  preferredLanguage: string = 'Hindi',
  seasonNumber?: number,
  episodeNumber?: number
): Promise<{
  link: string;
  activeLanguage: string;
  allTracks: StreamTrack[];
  key: string;
} | null> {
  const infoRes = await fetchMediaInfo(imdbId);
  if (!infoRes.success || !infoRes.data?.playlist || !infoRes.data.key) {
    return null;
  }

  const { playlist, key } = infoRes.data;
  let targetTracks: StreamTrack[] = playlist;

  // TV series navigation if season/episode specified and playlist is hierarchical
  if (seasonNumber !== undefined && Array.isArray(playlist) && playlist[0]?.title?.includes('Season')) {
    const seasonStr = `Season ${seasonNumber}`;
    const seasonFolder = playlist.find((s) => s.title === seasonStr || s.id === String(seasonNumber));
    if (seasonFolder && Array.isArray(seasonFolder.folder)) {
      const epFolder = seasonFolder.folder.find(
        (ep) => ep.episode === String(episodeNumber) || ep.title?.includes(`Episode ${episodeNumber}`)
      );
      if (epFolder && Array.isArray(epFolder.folder)) {
        targetTracks = epFolder.folder;
      }
    }
  }

  if (!targetTracks || targetTracks.length === 0) {
    return null;
  }

  // Find preferred language track (e.g. "Hindi"), fallback to first track
  const langLower = preferredLanguage.toLowerCase();
  const matchedTrack =
    targetTracks.find((t) => t.title?.toLowerCase().includes(langLower)) ||
    targetTracks[0];

  if (!matchedTrack || !matchedTrack.file) {
    return null;
  }

  const streamRes = await fetchStreamLink(matchedTrack.file, key);
  if (!streamRes.success || !streamRes.data?.link) {
    return null;
  }

  return {
    link: streamRes.data.link,
    activeLanguage: matchedTrack.title || preferredLanguage,
    allTracks: targetTracks,
    key,
  };
}
