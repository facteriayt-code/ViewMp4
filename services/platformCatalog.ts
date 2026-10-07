import { Movie } from '../types.ts';

export type PlatformId = 'netflix' | 'prime' | 'disney' | 'appletv' | 'max' | 'hulu';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  brandColor: string;
  accentBg: string;
  glowColor: string;
  headerBg: string;
  bodyBg: string;
  heroBadge: string;
  top10Title: string;
  ctaPlayText: string;
  ctaInfoText: string;
  navLinks: string[];
  brandTiles?: { name: string; tag: string; gradient: string }[];
  categoryRows: { title: string; filter: (movie: Movie) => boolean }[];
  filterMovies: (movies: Movie[]) => Movie[];
}

/**
 * Strict verification of whether a movie or show is officially available on a given platform.
 * As requested: only titles with verified streaming sources for Netflix are included in the Netflix replica,
 * and identically for all other platform replicas (Prime Video, Disney+, Apple TV+, Max, Hulu).
 */
export function isMovieOnPlatform(movie: Movie, platformId: PlatformId): boolean {
  if (!movie) return false;

  // Strict check on verified streamingSources
  if (Array.isArray(movie.streamingSources) && movie.streamingSources.length > 0) {
    const hasSource = movie.streamingSources.some(s => {
      const name = (s.name || '').toLowerCase().trim();
      switch (platformId) {
        case 'netflix':
          return name.includes('netflix');
        case 'prime':
          return name.includes('prime') || name.includes('amazon');
        case 'disney':
          return name.includes('disney');
        case 'appletv':
          return name.includes('apple');
        case 'max':
          return name.includes('max') || name.includes('hbo');
        case 'hulu':
          return name.includes('hulu');
        default:
          return false;
      }
    });
    if (hasSource) return true;
  }

  return false;
}

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    shortName: 'Netflix',
    tagline: 'Stream Netflix Originals, Exclusive Blockbusters & Series',
    description: 'Unlimited movies, TV shows, and award-winning Netflix Originals in 4K HDR.',
    brandColor: '#E50914',
    accentBg: 'bg-[#E50914]',
    glowColor: 'rgba(229, 9, 20, 0.4)',
    headerBg: 'bg-[#141414]/90',
    bodyBg: 'bg-[#141414]',
    heroBadge: 'TOP 10 IN MOVIES TODAY',
    top10Title: 'Top 10 on Netflix India Today (Netflix Tudum)',
    ctaPlayText: 'Play',
    ctaInfoText: 'More Info',
    navLinks: ['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List', 'Browse by Languages'],
    categoryRows: [
      {
        title: 'Trending on Netflix',
        filter: (m) => m.views > 3000000
      },
      {
        title: 'Critically Acclaimed Thrillers & Sci-Fi',
        filter: (m) => /sci-fi|action|thriller|crime/i.test(`${m.genre} ${m.title}`)
      },
      {
        title: 'Blockbuster Cinema Favorites',
        filter: (m) => (m.criticScore || 80) >= 80
      },
      {
        title: 'Bingeworthy Hits & Series',
        filter: (m) => Boolean(m.isTv) || /drama|adventure|mystery|tv/i.test(`${m.genre} ${m.title}`)
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter(m => isMovieOnPlatform(m, 'netflix'));
    }
  },

  prime: {
    id: 'prime',
    name: 'Prime Video',
    shortName: 'Prime Video',
    tagline: 'Watch Exclusives, Blockbusters & Award Winners Included with Prime',
    description: 'Enjoy Amazon Originals, cinematic blockbusters, and popular TV with Prime membership.',
    brandColor: '#00A8E1',
    accentBg: 'bg-[#00A8E1]',
    glowColor: 'rgba(0, 168, 225, 0.4)',
    headerBg: 'bg-[#0F172A]/90',
    bodyBg: 'bg-[#0D1826]',
    heroBadge: 'INCLUDED WITH PRIME',
    top10Title: 'Top 10 on Prime Video India Today (FlixPatrol)',
    ctaPlayText: 'Watch with Prime',
    ctaInfoText: 'Add to Watchlist',
    navLinks: ['Home', 'Store', 'Live TV', 'Categories', 'My Stuff'],
    categoryRows: [
      {
        title: 'Amazon Originals & TV Series',
        filter: (m) => Boolean(m.isTv) || /tv|series|show/i.test(`${m.genre}`)
      },
      {
        title: 'Top Movies Included with Prime',
        filter: (m) => !m.isTv && !/tv|series|show/i.test(`${m.genre}`)
      },
      {
        title: 'Action-Packed Blockbusters',
        filter: (m) => /action|adventure|thriller|boys|reacher/i.test(`${m.genre} ${m.title}`)
      },
      {
        title: 'Prime Sci-Fi & Fantasy Showcase',
        filter: (m) => /sci-fi|fantasy|cosmic|fallout|boys|invincible|rings|lord/i.test(`${m.genre} ${m.title}`)
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter(m => isMovieOnPlatform(m, 'prime'));
    }
  },

  disney: {
    id: 'disney',
    name: 'Disney+',
    shortName: 'Disney+',
    tagline: 'The Greatest Stories from Disney, Pixar, Marvel, Star Wars & Nat Geo',
    description: 'Stream epic superhero adventures, animated classics, and galactic sagas in 4K Dolby Vision.',
    brandColor: '#113CCF',
    accentBg: 'bg-[#113CCF]',
    glowColor: 'rgba(17, 60, 207, 0.4)',
    headerBg: 'bg-[#040714]/90',
    bodyBg: 'bg-[#040714]',
    heroBadge: 'STREAMING NOW ON DISNEY+',
    top10Title: 'Trending on Disney+ Today',
    ctaPlayText: 'Stream Now',
    ctaInfoText: 'Add to Watchlist',
    navLinks: ['Home', 'Search', 'Watchlist', 'Originals', 'Movies', 'Series'],
    brandTiles: [
      { name: 'DISNEY', tag: 'Classics & Magic', gradient: 'from-blue-900 to-indigo-950' },
      { name: 'PIXAR', tag: 'Animation Epics', gradient: 'from-cyan-900 to-blue-950' },
      { name: 'MARVEL', tag: 'Cinematic Universe', gradient: 'from-red-900 to-red-950' },
      { name: 'STAR WARS', tag: 'The Galactic Saga', gradient: 'from-amber-900 to-zinc-950' },
      { name: 'NAT GEO', tag: 'Earth Explorations', gradient: 'from-yellow-900 to-zinc-950' }
    ],
    categoryRows: [
      {
        title: 'Marvel & Superhero Sagas',
        filter: (m) => /avenger|iron man|spider|deadpool|loki|wanda|x-men|hero/i.test(`${m.title} ${m.genre}`)
      },
      {
        title: 'Cosmic & Galactic Worlds',
        filter: (m) => /avatar|star wars|mandalorian|andor|ahsoka|interstellar|space|alien|cosmic/i.test(`${m.title} ${m.genre}`)
      },
      {
        title: 'Animation & Family Blockbusters',
        filter: (m) => /animation|adventure|family|inside out|frozen|lion king|coco|encanto|moana/i.test(`${m.genre} ${m.title}`)
      },
      {
        title: 'Popular on Disney+',
        filter: (m) => m.views > 2000000 || (m.userRating || 0) >= 7.5
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter(m => isMovieOnPlatform(m, 'disney'));
    }
  },

  appletv: {
    id: 'appletv',
    name: 'Apple TV+',
    shortName: ' tv+',
    tagline: 'All Apple Originals · Premium Award-Winning Cinema',
    description: 'Visionary original films, groundbreaking documentaries, and gripping dramas.',
    brandColor: '#FFFFFF',
    accentBg: 'bg-white',
    glowColor: 'rgba(255, 255, 255, 0.25)',
    headerBg: 'bg-black/90',
    bodyBg: 'bg-[#000000]',
    heroBadge: 'AN APPLE ORIGINAL FILM',
    top10Title: 'Most Popular on Apple TV+',
    ctaPlayText: 'Play Movie',
    ctaInfoText: 'Add to Up Next',
    navLinks: ['Stream Now', 'Apple TV+', 'MLS Season Pass', 'Library'],
    categoryRows: [
      {
        title: 'Apple Original Feature Films',
        filter: (m) => !m.isTv || /drama|sci-fi|history/i.test(`${m.genre}`)
      },
      {
        title: 'Award-Winning Masterpieces',
        filter: (m) => (m.criticScore || 80) >= 75
      },
      {
        title: 'Prestige Sci-Fi & Thrillers',
        filter: (m) => /sci-fi|thriller|mystery|severance|silo|foundation|slow horses/i.test(`${m.genre} ${m.title}`)
      },
      {
        title: 'Explore All on Apple TV+',
        filter: () => true
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter(m => isMovieOnPlatform(m, 'appletv'));
    }
  },

  max: {
    id: 'max',
    name: 'Max',
    shortName: 'Max',
    tagline: 'The One to Watch · HBO Originals, Warner Bros. & DC Universe',
    description: 'Iconic Warner Bros. blockbusters, DC Comics epics, and acclaimed HBO series.',
    brandColor: '#002BE7',
    accentBg: 'bg-[#002BE7]',
    glowColor: 'rgba(123, 44, 191, 0.45)',
    headerBg: 'bg-[#0D061A]/90',
    bodyBg: 'bg-[#0D061A]',
    heroBadge: 'STREAM ON MAX',
    top10Title: 'Top 10 on Max',
    ctaPlayText: 'Watch on Max',
    ctaInfoText: 'Add to My List',
    navLinks: ['Home', 'Series', 'Movies', 'HBO', 'DC', 'Discovery'],
    categoryRows: [
      {
        title: 'Warner Bros. & HBO Hits',
        filter: (m) => /dark knight|batman|inception|matrix|dune|gladiator|house|game/i.test(`${m.title} ${m.genre}`)
      },
      {
        title: 'DC Universe & Action Spectacles',
        filter: (m) => /action|adventure|thriller/i.test(m.genre)
      },
      {
        title: 'Critically Acclaimed Dramas & Series',
        filter: (m) => (m.criticScore || 80) >= 80 || Boolean(m.isTv)
      },
      {
        title: 'Trending on Max',
        filter: (m) => m.views > 2000000
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter(m => isMovieOnPlatform(m, 'max'));
    }
  },

  hulu: {
    id: 'hulu',
    name: 'Hulu',
    shortName: 'hulu',
    tagline: 'All The TV You Love · Originals & Hit Blockbusters',
    description: 'Stream edge-of-your-seat thrillers, bold original movies, and pop culture sensations.',
    brandColor: '#1CE783',
    accentBg: 'bg-[#1CE783]',
    glowColor: 'rgba(28, 231, 131, 0.4)',
    headerBg: 'bg-[#0B1511]/90',
    bodyBg: 'bg-[#0B1511]',
    heroBadge: 'HULU ORIGINAL & EXCLUSIVE',
    top10Title: 'Binge-Worthy Hits on Hulu',
    ctaPlayText: 'Watch Now',
    ctaInfoText: 'Add to My Stuff',
    navLinks: ['Home', 'TV', 'Movies', 'Hubs', 'My Stuff'],
    categoryRows: [
      {
        title: 'Hulu Action & Sci-Fi Thrillers',
        filter: (m) => /alien|deadpool|spider|resident evil|predator|horror|thriller/i.test(`${m.title} ${m.genre}`)
      },
      {
        title: 'Critically Acclaimed Hits',
        filter: (m) => (m.criticScore || 80) >= 78
      },
      {
        title: 'Popular Crowd Pleasers',
        filter: (m) => m.views > 2200000
      },
      {
        title: 'Full Hulu Library',
        filter: () => true
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter(m => isMovieOnPlatform(m, 'hulu'));
    }
  }
};
