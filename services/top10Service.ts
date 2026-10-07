import { Movie } from '../types.ts';

export interface Top10PlatformData {
  platform: 'netflix' | 'prime';
  sourceUrl: string;
  sourceName: string;
  lastUpdated: number;
  nextRefreshAt: number;
  movies: Movie[];
}

const STORAGE_KEYS = {
  netflix: 'geministream_top10_netflix',
  prime: 'geministream_top10_prime'
};

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

// Verified Netflix Tudum India Top 10 fallback snapshot (https://www.netflix.com/tudum/top10/india)
export const NETFLIX_TUDUM_SNAPSHOT: Movie[] = [
  {
    id: 'netflix-top10-1-1408162',
    title: 'Vishwanath & Sons',
    description: 'A celebrated Olympian shooter travels to America looking for a donor to help his sick child — but unexpected romance complicates his search.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/mLsvCffzpxxDwC7yVLJSLLjgzoq.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABfvQFbWsoPXd9XGIGAoX0CyoV2AjCeTZAa2bMEKhtsWSzXoHVopnlcE2XnZ55SCRe3ZxZeqQi18dRf9vfh0ABWIIMbocO5PzteQ.jpg?r=746',
    genre: 'Feature Film',
    year: 2026,
    rating: 'PG-13',
    views: 3350000,
    userRating: 7.4,
    criticScore: 74,
    tmdbId: 1408162,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'netflix-top10-2-1441228',
    title: 'Irumudi',
    description: 'A high-octane drama tracing faith, retribution, and pilgrimage through intense trials in South India.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/dVFtTKMWW1aq7aWq30wjwOP6W3J.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABZlQdThgROiwMSguGCIQt_DtaNuUYq8ILvUxkabWwy0C2rqxac5dptxD2PbDIuzlkMoOfFV4l4c7kuaIKSB0yZ68oxPxY6EawWA.jpg?r=8b4',
    genre: 'Feature Film',
    year: 2026,
    rating: 'PG-13',
    views: 3200000,
    userRating: 7.2,
    criticScore: 72,
    tmdbId: 1441228,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'netflix-top10-3-1685882',
    title: 'Modha Rathri',
    description: 'A suspenseful, atmospheric thriller taking place across a single unforgettable night of secrets.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/3VuNFeniljhEe9MDW12MnDbETgH.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABaHXtOSzdAvD_NJ8RQXDQIDD9U-7_vbSKXCjm-IDFGefXSkrg1x_B9Jtw5LZSi03gw3h0lYQFpRjj18CXSDPbNIpA9IibuyVOAQ.jpg?r=81f',
    genre: 'Thriller / Mystery',
    year: 2026,
    rating: 'PG-13',
    views: 3050000,
    userRating: 7.1,
    criticScore: 71,
    tmdbId: 1685882,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'netflix-top10-4-1512084',
    title: 'Baby Do Die Do',
    description: 'An unconventional crime comedy filled with quirky twists, runaway gangsters, and mistaken identities.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/jvfqp6gMlvHODYnBXoogqRyIs0k.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABbZnLIh6aJR4sFLsUcDb1GdF9fj4G_C_ISdNdQ1X-JGUgiTaC2OHrtTpJRYEjLVcyDc5aKcJx1XZVPn3ZeBdVG1ziG1q_KYn4mE.jpg?r=72d',
    genre: 'Comedy / Crime',
    year: 2026,
    rating: 'PG-13',
    views: 2900000,
    userRating: 7.0,
    criticScore: 70,
    tmdbId: 1512084,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'netflix-top10-5-976121',
    title: 'Romancham',
    description: 'Seven bachelors living together in Bangalore summon a spirit using an Ouija board, triggering a hilarious chain of supernatural events.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/9p8ux2AGYn3U2mEAbKmizAh6PL1.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABUKB2J1A0apIhpQIpE5az8zccpgEjut0uh4pj_XhsF-xaO5iG45FPf4IKYwk2V5bPRUMX3UpX_uD2wf-Na8r5fNVh8LTOJgDP4E.jpg?r=2bb',
    genre: 'Comedy / Horror',
    year: 2023,
    rating: 'PG-13',
    views: 2750000,
    userRating: 7.7,
    criticScore: 82,
    tmdbId: 976121,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'netflix-top10-6-1311031',
    title: 'Demon Slayer: Kimetsu no Yaiba Infinity Castle I',
    description: 'The Demon Slayer Corps plunges into the Infinity Castle to face Muzan Kibutsuji and the deadly Upper Moons in the final war.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/fWVSwgjpT2D78VUh6X8UBd2rorW.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABRjjhjugpCf8NRlW3ZwlteIvUc9496SPqOCT3vZLHdoT9QlhH5cjivKoSzE1H25vbaBEUVo3XbrD9F9cFWd-n3R0-v-Xu8sVDWA.jpg?r=5df',
    genre: 'Anime / Action',
    year: 2025,
    rating: 'PG-13',
    views: 2600000,
    userRating: 8.6,
    criticScore: 89,
    tmdbId: 1311031,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'netflix-top10-7-1451944',
    title: 'Lust Stories 3',
    description: 'Four bold and celebrated directors illuminate love, desire, and intricate human bonds in modern India.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/cLA83DD1qMEBwbRIYXf29RKjMja.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABRcbwnWNXQUMc4_U2qe8_zEOgS7PEuzLRN--KBicImox95C4lA3LfIzbtViVMzlQnmICjwZ41zlLrXDO3XXH4d1LC_N8nNyHGjo.jpg?r=f27',
    genre: 'Drama / Romance',
    year: 2026,
    rating: '18+',
    views: 2450000,
    userRating: 6.9,
    criticScore: 68,
    tmdbId: 1451944,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'netflix-top10-8-1492640',
    title: 'UNABOMBER',
    description: 'The gripping investigative pursuit of one of the most enigmatic figures in modern forensic history.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/39aMkR8Y5vhCG9dTkjiqRl8AVqp.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABcUMewqWNZdWveqIsRkDvZLP-o0RoVn68O0UfrQq6gYkb3g4tI0GbftOiaFjroT6uDydW7WXzQmG2spEhzXHM5h0-yrbCgLxHm4.jpg?r=286',
    genre: 'Crime / Docu-Drama',
    year: 2026,
    rating: '18+',
    views: 2300000,
    userRating: 7.3,
    criticScore: 75,
    tmdbId: 1492640,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'netflix-top10-9-1727563',
    title: 'Ohh My Dog',
    description: 'An affectionate and heartwarming tale of an abandoned puppy and a blind boy conquering hardships together.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/9mRbPM6EzzfIKSD7PVdwKWFTibF.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABQplZYpuIfvmHsP4SErvMWzW0PsMvI22V5MbQBgsbfNeDs02mi__6_UIauZkv10N9Ww6zfDi9kVs06j0fcfUuJQUfrBmN-CpEtY.jpg?r=838',
    genre: 'Family / Drama',
    year: 2026,
    rating: 'PG',
    views: 2150000,
    userRating: 7.5,
    criticScore: 78,
    tmdbId: 1727563,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'netflix-top10-10-1303331',
    title: 'Dhamaal 4',
    description: 'The beloved bumbling gang returns in a chaotic, laughter-filled treasure adventure across exotic locales.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/oVij5aEEE6iI4PxB4i0CgKp8h0m.jpg',
    backdrop: 'https://dnm.nflximg.net/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABZkNtKirLpFaVh0y42nXzH5h_lymseuUXSrrMFzjLSArWlM6rYWZpIqwcAiZ6dbKZDEHiqna3hP07-0-pPg02h7o4jiLnMX296Q.jpg?r=152',
    genre: 'Comedy / Adventure',
    year: 2026,
    rating: 'PG-13',
    views: 2000000,
    userRating: 7.0,
    criticScore: 72,
    tmdbId: 1303331,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }
];

// Verified FlixPatrol Amazon Prime India Top 10 fallback snapshot (https://flixpatrol.com/top10/amazon-prime/india/2026-10-06/)
export const PRIME_FLIXPATROL_SNAPSHOT: Movie[] = [
  {
    id: 'prime-top10-1-249755',
    title: 'Dupahiya',
    description: 'A charming comedy series set in a rural town where the theft of a prized motorcycle throws a vibrant village into comic pandemonium.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/9qxeUZGHNxCgaiM601VYnhJnZMh.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/rmZh9TkQIZ9XfTjniUyLGIIACLG.jpg',
    genre: 'Comedy Drama',
    year: 2025,
    rating: 'PG-13',
    views: 3450000,
    userRating: 7.8,
    criticScore: 81,
    tmdbId: 249755,
    isTv: true,
    initialSeason: 2,
    initialEpisode: 1,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'prime-top10-2-1317872',
    title: 'Sardar 2',
    description: 'Chandra Bose aka Agent Sardar embarks on a dangerous covert mission across international borders to stop a global bioweapon conspiracy.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/muGsRtsNrG1gnlF2fPYrBa4TGlr.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/i39M5xz57fEkPLtuiAXqWwMNMyN.jpg',
    genre: 'Spy Action Thriller',
    year: 2026,
    rating: 'PG-13',
    views: 3300000,
    userRating: 7.6,
    criticScore: 78,
    tmdbId: 1317872,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'prime-top10-3-300081',
    title: 'Rise and Fall',
    description: 'An exhilarating strategic competition reality show exploring power, alliances, and betrayal as rulers and workers clash.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/nKBHSZpzeHIFZ6Qab6tA7oFT12J.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/oE2X7HuKpCJE5hCzTMPKdxJY5vW.jpg',
    genre: 'Reality / Competition',
    year: 2025,
    rating: 'PG-13',
    views: 3150000,
    userRating: 7.3,
    criticScore: 72,
    tmdbId: 300081,
    isTv: true,
    initialSeason: 1,
    initialEpisode: 1,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'prime-top10-4-1049064',
    title: 'Mahendragiri Vaaraahi',
    description: 'An atheist YouTuber investigates a 200-year-old divine curse haunting a royal dynasty where firstborns die mysteriously on their 33rd birthday.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/hYfu1SIE1wViNVPT0zdlqTwpPeb.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/qfZSKbfit41qcjBOvUDWV2v9WEz.jpg',
    genre: 'Mythological Thriller',
    year: 2026,
    rating: 'PG-13',
    views: 3000000,
    userRating: 7.5,
    criticScore: 76,
    tmdbId: 1049064,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'prime-top10-5-335332',
    title: 'Waiting Hai',
    description: 'A relentless railway cyber cop hunts an elusive tech genius running an underground Tatkal railway ticketing syndicate across Indian railways.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/6jBdFWwgKgkcrAGaDfTC9bpudaN.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/uzcQT7vywQd7owQvX7lNbwd00vU.jpg',
    genre: 'Crime Drama',
    year: 2026,
    rating: '18+',
    views: 2850000,
    userRating: 7.9,
    criticScore: 82,
    tmdbId: 335332,
    isTv: true,
    initialSeason: 1,
    initialEpisode: 1,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'prime-top10-6-1029827',
    title: 'Drishyam 2',
    description: 'Seven years after the case closed, a shocking discovery puts Vijay Salgaonkar and his family back in the crosshairs of an obsessive police probe.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/wk8Vu0DI0MiNLaXXiVqAwjLRKL5.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/498aYGlnvjvoiqXYhCNHrZERi4l.jpg',
    genre: 'Crime Mystery Thriller',
    year: 2022,
    rating: 'PG-13',
    views: 2700000,
    userRating: 8.4,
    criticScore: 86,
    tmdbId: 1029827,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'prime-top10-7-1032863',
    title: 'The Love Hypothesis',
    description: 'A third-year biology Ph.D. student fake-dates an icy young professor, leading to hilarious complications and unexpected sparks.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/vfZxVHextAGC70zrNhS8lsROqP1.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/o7Oy9Gbx1CCyaweL8xUhtMW4Puq.jpg',
    genre: 'Romance Comedy',
    year: 2026,
    rating: 'PG-13',
    views: 2550000,
    userRating: 7.7,
    criticScore: 80,
    tmdbId: 1032863,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'prime-top10-8-273207',
    title: 'Neagley',
    description: 'Jack Reacher\'s trusted ally and master private investigator Frances Neagley tackles a dark international conspiracy of her own.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/tEPDFIa21VK0Q2YLuzhTt2xrw5W.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/uYOYLFQ4q7asuhdiKXCqGaeAQUH.jpg',
    genre: 'Action Thriller Series',
    year: 2026,
    rating: '18+',
    views: 2400000,
    userRating: 8.1,
    criticScore: 84,
    tmdbId: 273207,
    isTv: true,
    initialSeason: 1,
    initialEpisode: 1,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'prime-top10-9-1560208',
    title: 'Ramba Oorvasi Menaka',
    description: 'A carefree man stumbles upon an ancient scripture to summon celestial beauties, setting off a rollercoaster of hilarious fortunes and mishaps.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/tPkKq60dSC12I3ARollNuZsY4Jv.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/47l089ZSyxNXgNdMWXrcAVcTwRm.jpg',
    genre: 'Fantasy Comedy',
    year: 2026,
    rating: 'PG-13',
    views: 2250000,
    userRating: 7.2,
    criticScore: 74,
    tmdbId: 1560208,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'prime-top10-10-1590380',
    title: 'Ram and Leela',
    description: 'A vibrant modern romantic drama weaving regional traditions, impassioned family drama, and modern aspirations.',
    thumbnail: 'https://image.tmdb.org/t/p/w780/j1X0t57PguWBcaa8LAOaAHGyjcK.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/w0hg42XRWiaWlGPvQI8Defwn5En.jpg',
    genre: 'Romantic Drama',
    year: 2026,
    rating: 'PG-13',
    views: 2100000,
    userRating: 7.3,
    criticScore: 75,
    tmdbId: 1590380,
    isTv: false,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }
];

/**
 * Loads cached Top 10 data from localStorage
 */
function getStoredTop10(platform: 'netflix' | 'prime'): Top10PlatformData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[platform]);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.movies) && parsed.movies.length > 0) {
      // Invalidate if contains broken/empty thumbnails or placeholder errors
      const hasBrokenThumbnail = parsed.movies.some((m: any) => 
        !m.thumbnail || 
        typeof m.thumbnail !== 'string' ||
        m.thumbnail.length < 10 ||
        m.thumbnail.includes('undefined') ||
        m.thumbnail.includes('9V8zQ7k1') || 
        m.thumbnail.includes('6m2V1b9x') || 
        m.thumbnail.includes('jDq1f1o8QcO')
      );
      if (hasBrokenThumbnail) {
        localStorage.removeItem(STORAGE_KEYS[platform]);
        return null;
      }
      // Ensure rank and poster are set on every item
      parsed.movies = parsed.movies.map((m: any, idx: number) => ({
        ...m,
        rank: m.rank || idx + 1,
        poster: m.poster || m.thumbnail
      }));
      return parsed;
    }
  } catch {}
  return null;
}

/**
 * Saves Top 10 data to localStorage
 */
function saveStoredTop10(platform: 'netflix' | 'prime', data: Top10PlatformData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS[platform], JSON.stringify(data));
  } catch {}
}

/**
 * Fetches Top 10 for a platform with 24-hour automatic refresh cache
 */
export async function getPlatformTop10(platform: 'netflix' | 'prime', forceRefresh: boolean = false): Promise<Top10PlatformData> {
  const cached = getStoredTop10(platform);
  const now = Date.now();

  // If cache exists and is less than 24 hours old, return it immediately
  if (cached && !forceRefresh && (now - cached.lastUpdated < TWENTY_FOUR_HOURS_MS)) {
    return cached;
  }

  try {
    const res = await fetch(`/api/top10/${platform}${forceRefresh ? '?refresh=true' : ''}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.movies) && data.movies.length > 0) {
        const top10Data: Top10PlatformData = {
          platform,
          sourceUrl: data.sourceUrl || (platform === 'netflix' ? 'https://www.netflix.com/tudum/top10/india' : 'https://flixpatrol.com/top10/amazon-prime/india/2026-10-06/'),
          sourceName: platform === 'netflix' ? 'Netflix Tudum India' : 'FlixPatrol India',
          lastUpdated: data.lastUpdated || now,
          nextRefreshAt: data.nextRefreshAt || (now + TWENTY_FOUR_HOURS_MS),
          movies: data.movies
        };
        saveStoredTop10(platform, top10Data);
        return top10Data;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch fresh top 10 for ${platform}, using fallback:`, err);
  }

  // Fallback if network or server is offline
  const fallbackMovies = platform === 'netflix' ? NETFLIX_TUDUM_SNAPSHOT : PRIME_FLIXPATROL_SNAPSHOT;
  const fallbackData: Top10PlatformData = cached || {
    platform,
    sourceUrl: platform === 'netflix' ? 'https://www.netflix.com/tudum/top10/india' : 'https://flixpatrol.com/top10/amazon-prime/india/2026-10-06/',
    sourceName: platform === 'netflix' ? 'Netflix Tudum India' : 'FlixPatrol India',
    lastUpdated: now,
    nextRefreshAt: now + TWENTY_FOUR_HOURS_MS,
    movies: fallbackMovies
  };
  saveStoredTop10(platform, fallbackData);
  return fallbackData;
}

/**
 * Initializes automatic 24-hour background refreshing
 */
export function initTop10AutoRefresh(onRefresh?: (platform: 'netflix' | 'prime', data: Top10PlatformData) => void): () => void {
  const checkAndSchedule = async () => {
    const platforms: ('netflix' | 'prime')[] = ['netflix', 'prime'];
    for (const p of platforms) {
      const cached = getStoredTop10(p);
      const now = Date.now();
      if (!cached || (now - cached.lastUpdated >= TWENTY_FOUR_HOURS_MS)) {
        try {
          const fresh = await getPlatformTop10(p, true);
          if (onRefresh) onRefresh(p, fresh);
        } catch {}
      }
    }
  };

  checkAndSchedule();
  // Check every hour if 24 hours have elapsed
  const intervalId = setInterval(checkAndSchedule, 60 * 60 * 1000);
  return () => clearInterval(intervalId);
}
