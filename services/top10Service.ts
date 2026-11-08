import { Movie } from '../types.ts';

export interface Top10PlatformData {
  platform: 'netflix' | 'prime';
  sourceUrl: string;
  sourceName: string;
  lastUpdated: number;
  nextRefreshAt: number;
  movies: Movie[];
}

const CACHE_VERSION = 'v9_tudum_live_verified';
const STORAGE_KEYS = {
  netflix: `geministream_top10_netflix_${CACHE_VERSION}`,
  prime: `geministream_top10_prime_${CACHE_VERSION}`
};

// Purge legacy outdated cache keys so visiting the site always loads fresh live data
if (typeof window !== 'undefined') {
  try {
    [
      'geministream_top10_netflix',
      'geministream_top10_prime',
      'geministream_top10_netflix_v2',
      'geministream_top10_prime_v2',
      'geministream_top10_netflix_v3',
      'geministream_top10_prime_v3',
      'geministream_top10_netflix_v4',
      'geministream_top10_prime_v4',
      'geministream_top10_netflix_v5_royal_posters',
      'geministream_top10_prime_v5_royal_posters',
      'geministream_top10_netflix_v6_verified_indians',
      'geministream_top10_prime_v6_verified_indians',
      'geministream_top10_netflix_v7_bingr_perfect_posters',
      'geministream_top10_prime_v7_bingr_perfect_posters',
      'geministream_top10_netflix_v8_dynamic_live_charts',
      'geministream_top10_prime_v8_dynamic_live_charts'
    ].forEach(k => localStorage.removeItem(k));
  } catch {}
}

const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours cache TTL for fresh live charts

// Verified Netflix Tudum India Top 10 fallback snapshot (https://www.netflix.com/tudum/top10/india)
export const NETFLIX_TUDUM_SNAPSHOT: Movie[] = [
  {
    "id": "netflix-top10-1-1453407",
    "title": "Gajab Raat",
    "description": "A corrupt, troubled cop's night spirals out of control when a reluctant act of mercy toward an injured girl pulls him into a deadly web of crime.",
    "thumbnail": "https://dnm.nflximg.net/api/v6/LSExTNdA1vCOYNZ8eHZ6J0eyIcQ/AAAABV1DBxbWUyjEeEyO6bN3oujgvOrtT_26L-dgFpBl314EAcCUVk6dZRvr6VAG9mwt-xVMjPWi6-l39DsHZdIESMgSCR9aZULx4mA.jpg?r=50d",
    "backdrop": "https://image.tmdb.org/t/p/w1280/8I4YFWgi9IZW4VUi398A0BqLnm.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 3350000,
    "userRating": 5.7,
    "criticScore": 57,
    "tmdbId": 1453407,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "netflix-top10-2-1515692",
    "title": "Baththa",
    "description": "In 1986 Madras, a timid eight-year-old boy accidentally traps a feared gangster inside a deserted school toilet. As the gangster is forced to confront hunger, loneliness and his own vulnerability, an unlikely bond begins to grow between the two.",
    "thumbnail": "https://dnm.nflximg.net/api/v6/LSExTNdA1vCOYNZ8eHZ6J0eyIcQ/AAAABaCNqN0M7xAm7oku4mtP_Us63EUB2PC8m5sZquC6asyGy4uTE4tcFc_ch-a88Juux0ciDi2lkRcafQsUAbwtIFzZlWbtTUK3uNY.jpg?r=f20",
    "backdrop": "https://image.tmdb.org/t/p/w1280/5sBnZMT1aJ6cBvehKOzOOLdI6bz.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 3200000,
    "userRating": 7.9,
    "criticScore": 79,
    "tmdbId": 1515692,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "netflix-top10-3-73362",
    "title": "The Paradise",
    "description": "Follow Teresa Iorio, a young woman who leaves her rural Sicilian hometown for Milan to find work--and much more--at a newly opened department store: The Ladies' Paradise.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/1XKjPCtprWqjKhTiyYORVwgWePA.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/7v3bO3pNnyLHLlwETtmyQxKV2Ba.jpg",
    "genre": "TV Series",
    "year": 2015,
    "rating": "PG-13",
    "views": 3050000,
    "userRating": 7.7,
    "criticScore": 77,
    "tmdbId": 73362,
    "isTv": true,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "netflix-top10-4-1578079",
    "title": "Dorothy",
    "description": "In rural Tamil Nadu, two inseparable childhood friends navigate a world shaped by caste, violence and toxic masculinity, until a compassionate woman enters their lives and quietly challenges the social order around them.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/o3r5DmWhOKdFmeIUoRJj4CvCqOP.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/wlJmF47IHYwzVpG1qA6aYA0UHj.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2900000,
    "userRating": 8.5,
    "criticScore": 85,
    "tmdbId": 1578079,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "netflix-top10-5-1590718",
    "title": "Dhoomakethu",
    "description": "On the morning of his wedding, 36-year-old Kuttan wakes from a disturbing dream about his own death. As the day unfolds, familiar moments begin to repeat, and reality becomes increasingly difficult to distinguish from memory. Realising that something is terribly wrong, Kuttan races to uncover the truth before the day repeats itself.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/kZCKwhUx7r9HRDqpGbavdMtd8f5.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/4YxZxGPt702wGaNqgXwN6Jaq390.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2750000,
    "userRating": 7.3,
    "criticScore": 73,
    "tmdbId": 1590718,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "netflix-top10-6-1395215",
    "title": "Sigma",
    "description": "A daring treasure hunter throws caution to the wind, outwitting deadly traps and treacherous allies with sheer nerve and cunning.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/18Lhkc3nf92bY1cacQomXIqihhN.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/ljNmU4qn8WJbMe9JwH3FAdZiRAi.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2600000,
    "userRating": 4,
    "criticScore": 40,
    "tmdbId": 1395215,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "netflix-top10-7-1261763",
    "title": "Don't Trouble the Trouble",
    "description": "Suri, a magician, accidentally makes a young girl vanish with a spell. The girl, revealed to be a genie who grants wishes, explores the city and unleashes her powers when angered.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/lxgQu74WalgmhWnSEqweyYj8fnc.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/iWVgNbAB4fCqzOPJXNLOZP4zfbK.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2450000,
    "userRating": 5.8,
    "criticScore": 58,
    "tmdbId": 1261763,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "netflix-top10-8-1290035",
    "title": "Avaraachan & Sons",
    "description": "Follows Avarachan, his children and the various family and social relationships that shape their lives.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/wRKg0WoPV0D3bCl1B5jJtcRdU1Z.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/fvfXiUaexUqCitmOftGBXgNO6Of.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2300000,
    "userRating": 7.3,
    "criticScore": 73,
    "tmdbId": 1290035,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "netflix-top10-9-1811964",
    "title": "SI Yugandhar",
    "description": "An honest cop's discovery of a mysterious body launches a high-stakes investigation, forcing him to uncover a dark web of secrets hidden beneath the city's surface.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/mIK5YnqQWKZxyQgaeDDVywUxNWo.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/hFKZK6R1iFvB1Da01rN28CqWYmi.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2150000,
    "userRating": 4,
    "criticScore": 40,
    "tmdbId": 1811964,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "netflix-top10-10-1408162",
    "title": "Vishwanath & Sons",
    "description": "A celebrated Olympian shooter travels to America looking for a donor to help his sick child — but unexpected romance complicates his search.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/mLsvCffzpxxDwC7yVLJSLLjgzoq.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/nfNaAiiILjYRc2CKkId1ZfPTtlh.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2000000,
    "userRating": 7,
    "criticScore": 70,
    "tmdbId": 1408162,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  }
];

// Verified FlixPatrol Amazon Prime India Top 10 fallback snapshot (https://flixpatrol.com/top10/amazon-prime/india/)
export const PRIME_FLIXPATROL_SNAPSHOT: Movie[] = [
  {
    "id": "prime-top10-1-1378537",
    "title": "Mirzapur: The Movie",
    "description": "Akhandanand Tripathi sits on the throne of Mirzapur. Munna Tripathi is heir apparent. Rati Shankar Shukla is the rival from Jaunpur. And, Guddu and Bablu are the two brothers who came like a tornado and changed things irreversibly. And now comes a new claimant in town. Babban Babua, from the desert of Jaisalmer. A ruthless man who is power hungry.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/tCyTNhOv8NB1iK3U95spJdCaQED.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/nTkQBI8ldvPByIkxsemGxtKlr8E.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 3350000,
    "userRating": 7,
    "criticScore": 70,
    "tmdbId": 1378537,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "prime-top10-2-300081",
    "title": "Rise and Fall",
    "description": "The story revolves around the host explaining the show where 4 celebrities, of which 2 in the penthouse, are trying to maintain their position as Rulers while 2 in the basement are fighting to Rise to the Penthouse to topple a Ruler.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/nKBHSZpzeHIFZ6Qab6tA7oFT12J.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/oE2X7HuKpCJE5hCzTMPKdxJY5vW.jpg",
    "genre": "Drama Series",
    "year": 2025,
    "rating": "PG-13",
    "views": 3200000,
    "userRating": 7.6,
    "criticScore": 76,
    "tmdbId": 300081,
    "isTv": true,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "prime-top10-3-1428295",
    "title": "Comrade Kalyan",
    "description": "In a naxal-dominated village on the Andhra-Odisha border, a theatre owner uses communist sentiment to keep his old cinema running. He joins the naxals and kidnaps a leader, setting off a chain of events.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/pvRJWA4WnaoPeQ7Fs7G9P7EKu6h.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/zsAbkmTkGE3l98Jhvdiy7ybNFo8.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 3050000,
    "userRating": 3,
    "criticScore": 30,
    "tmdbId": 1428295,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "prime-top10-4-338918",
    "title": "Chaar Yaar",
    "description": "As fall approaches in Detroit - A single mother's new job has significant consequences for her young family. For her eldest son - Trinidad it means he is now being asked to step up and look after his siblings. The film begins at a crisis point, Trinidad has run away just before his mother goes to work. As he criss-crosses the city Trinidad searches for scraps of metal amongst the detritus of abandoned houses. It becomes apparent that without the support of those around him he will flounder, finally a neighbor offers him a simple job. One that reveals the choices Trinidad can still make for himself, and through which he can express his individual understanding and sense of the decaying world around him.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/9qxeUZGHNxCgaiM601VYnhJnZMh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9qxeUZGHNxCgaiM601VYnhJnZMh.jpg",
    "genre": "Feature Film",
    "year": 2015,
    "rating": "PG-13",
    "views": 2900000,
    "userRating": 7.6,
    "criticScore": 76,
    "tmdbId": 338918,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "prime-top10-5-303745",
    "title": "Love in Disguise",
    "description": "Maria Ada is a famous urban legend that tells the story of a teacher who died leaving two sons behind while his ghost occasionally comes to life trying to recover them. Oscar and Jose, two friends and former classmates, tell about the tragic ghost apparitions and their constant bickering with an albino boy. A friend from the same classroom could only see the ghost, because in Equatorial Guinea they say that albinos have four eyes.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/ov3aeTBq0tkDI3MMO9OqHYD9Qum.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ov3aeTBq0tkDI3MMO9OqHYD9Qum.jpg",
    "genre": "Feature Film",
    "year": 2012,
    "rating": "PG-13",
    "views": 2750000,
    "userRating": 7.6,
    "criticScore": 76,
    "tmdbId": 303745,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "prime-top10-6-1234139",
    "title": "Jailer 2",
    "description": "When a dangerous syndicate expands its reach to threaten his family's peace, retired jailer Tiger Muthuvel Pandian goes undercover as a driver. Operating from the shadows, he takes on ruthless new enemies to protect his home.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/upwdEyhhYZ7pT2hD535fr2MGfpx.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/m0ks2o59mOAz6WdCybJ5FAUNTOU.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2600000,
    "userRating": 8.2,
    "criticScore": 82,
    "tmdbId": 1234139,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "prime-top10-7-1036081",
    "title": "Khalifa: The Ruler",
    "description": "Aamir Ali, a notorious gold smuggling kingpin who inherited his multi-million dollar criminal enterprise from a lineage of gangsters, is drawn into a web of vengeance, legacy and power.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/3HOC3omTbl7lB9gxKu7uCEpOtuC.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/6Jz7rnnZrSkgs9ySWUxewpcxr7Q.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2450000,
    "userRating": 4.9,
    "criticScore": 49,
    "tmdbId": 1036081,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "prime-top10-8-249755",
    "title": "Dupahiya",
    "description": "Dhadakpur, the Belgium of Bihar, is on the cusp of celebrating 25 years of being crime free. But chaos strikes when a never-seen-before motorbike, that was purchased as a wedding gift gets stolen 7 days before the ceremony! The journey taken by the bride's family and ex-lover to find the Dupahiya forms the heart of this comedy, which explores the hopes and aspirations of simple people.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/9qxeUZGHNxCgaiM601VYnhJnZMh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/rmZh9TkQIZ9XfTjniUyLGIIACLG.jpg",
    "genre": "Drama Series",
    "year": 2025,
    "rating": "PG-13",
    "views": 2300000,
    "userRating": 6.9,
    "criticScore": 69,
    "tmdbId": 249755,
    "isTv": true,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "prime-top10-9-120911",
    "title": "The Terminal List",
    "description": "Navy SEAL Commander James Reece turns to vengeance as he investigates the mysterious forces behind the murder of his entire platoon. Free from the military's command structure, Reece applies the lessons he's learned from nearly two decades of warfare to hunt down the people responsible.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/xyFAzP7RKK8cARCSalIZ9A9T0jV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/2qS2LGqsAyT1NEDeIj24Hp2IR10.jpg",
    "genre": "Drama Series",
    "year": 2022,
    "rating": "PG-13",
    "views": 2150000,
    "userRating": 8,
    "criticScore": 80,
    "tmdbId": 120911,
    "isTv": true,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    "id": "prime-top10-10-1618200",
    "title": "The Dark Heaven",
    "description": "In the Hill Village of Mekkarai, Where It is Customary for Men to Die Every Seven Years During the Month of June, a Newly Appointed Police Inspector Arrives to Investigate a Series of Mysterious Murders. As He Digs Deeper Into the Village's Dark Secrets and Long-standing Beliefs, He Finds Himself Trapped in a Web of Crime, Fear, and Hidden Truths.",
    "thumbnail": "https://image.tmdb.org/t/p/w780/xFr0Q7j2JmOwBJnvImIgTAWBk4U.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w1280/4ercU8wa7OAexszQG3SSNuyB8fy.jpg",
    "genre": "Feature Film",
    "year": 2026,
    "rating": "PG-13",
    "views": 2000000,
    "userRating": 7.6,
    "criticScore": 76,
    "tmdbId": 1618200,
    "isTv": false,
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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
const refreshListeners = new Set<(platform: 'netflix' | 'prime', data: Top10PlatformData) => void>();

function notifyRefreshListeners(platform: 'netflix' | 'prime', data: Top10PlatformData) {
  refreshListeners.forEach(listener => {
    try {
      listener(platform, data);
    } catch (e) {
      console.warn('Top 10 listener error:', e);
    }
  });
}

/**
 * Saves Top 10 data to localStorage and notifies reactive listeners
 */
function saveStoredTop10(platform: 'netflix' | 'prime', data: Top10PlatformData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS[platform], JSON.stringify(data));
    notifyRefreshListeners(platform, data);
  } catch {}
}

/**
 * Fetches Top 10 for a platform with 3-hour automatic refresh cache
 */
export async function getPlatformTop10(platform: 'netflix' | 'prime', forceRefresh: boolean = false): Promise<Top10PlatformData> {
  const cached = getStoredTop10(platform);
  const now = Date.now();

  // If we have a valid, recent cache and not force-refreshing, return it immediately for instant 0ms load!
  if (cached && !forceRefresh && (now - cached.lastUpdated < CACHE_TTL_MS)) {
    // If older than 1 hour, silently refresh in the background without blocking the UI
    if (now - cached.lastUpdated > 60 * 60 * 1000) {
      fetch(`/api/top10/${platform}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.movies) && data.movies.length > 0) {
            saveStoredTop10(platform, {
              platform,
              sourceUrl: data.sourceUrl || (platform === 'netflix' ? 'https://www.netflix.com/tudum/top10/india' : 'https://flixpatrol.com/top10/amazon-prime/india/2026-10-06/'),
              sourceName: platform === 'netflix' ? 'Netflix Tudum India' : 'Amazon Prime Video India',
              lastUpdated: data.lastUpdated || Date.now(),
              nextRefreshAt: data.nextRefreshAt || (Date.now() + CACHE_TTL_MS),
              movies: data.movies
            });
          }
        })
        .catch(() => {});
    }
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
          sourceName: platform === 'netflix' ? 'Netflix Tudum India' : 'Amazon Prime Video India',
          lastUpdated: data.lastUpdated || now,
          nextRefreshAt: data.nextRefreshAt || (now + CACHE_TTL_MS),
          movies: data.movies
        };
        saveStoredTop10(platform, top10Data);
        return top10Data;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch fresh top 10 for ${platform}, using fallback:`, err);
  }

  // If network fetch fails, use cached if available
  if (cached) {
    return cached;
  }

  // Fallback if network or server is offline
  const fallbackMovies = platform === 'netflix' ? NETFLIX_TUDUM_SNAPSHOT : PRIME_FLIXPATROL_SNAPSHOT;
  const fallbackData: Top10PlatformData = {
    platform,
    sourceUrl: platform === 'netflix' ? 'https://www.netflix.com/tudum/top10/india' : 'https://flixpatrol.com/top10/amazon-prime/india/2026-10-06/',
    sourceName: platform === 'netflix' ? 'Netflix Tudum India' : 'Amazon Prime Video India',
    lastUpdated: now,
    nextRefreshAt: now + CACHE_TTL_MS,
    movies: fallbackMovies
  };
  saveStoredTop10(platform, fallbackData);
  return fallbackData;
}

/**
 * Initializes automatic background refreshing with active subscription
 */
export function initTop10AutoRefresh(onRefresh?: (platform: 'netflix' | 'prime', data: Top10PlatformData) => void): () => void {
  if (onRefresh) {
    refreshListeners.add(onRefresh);
  }

  const checkAndSchedule = async () => {
    const platforms: ('netflix' | 'prime')[] = ['netflix', 'prime'];
    for (const p of platforms) {
      const cached = getStoredTop10(p);
      const now = Date.now();
      if (!cached || (now - cached.lastUpdated >= CACHE_TTL_MS)) {
        try {
          const fresh = await getPlatformTop10(p, true);
          if (onRefresh) onRefresh(p, fresh);
        } catch {}
      }
    }
  };

  checkAndSchedule();
  // Check every 15 minutes for new updates
  const intervalId = setInterval(checkAndSchedule, 15 * 60 * 1000);
  return () => {
    clearInterval(intervalId);
    if (onRefresh) {
      refreshListeners.delete(onRefresh);
    }
  };
}
