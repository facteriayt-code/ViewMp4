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
    top10Title: 'Top 10 Movies on Netflix Today',
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
        title: 'Bingeworthy Hits & Dramas',
        filter: (m) => /drama|adventure|mystery/i.test(`${m.genre} ${m.title}`)
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter((m, idx) => {
        if (m.streamingSources?.some(s => s.name.toLowerCase().includes('netflix'))) return true;
        const t = m.title.toLowerCase();
        const g = (m.genre || '').toLowerCase();
        return /inception|dark knight|matrix|spider|interstellar|resident evil|unabomber|runner|digger|pulp fiction|shawshank|blade runner|gladiator|dune|fight club/i.test(`${t} ${g}`) || idx % 2 === 0;
      });
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
    top10Title: 'Top 10 on Prime Video Today',
    ctaPlayText: 'Watch with Prime',
    ctaInfoText: 'Add to Watchlist',
    navLinks: ['Home', 'Store', 'Live TV', 'Categories', 'My Stuff'],
    categoryRows: [
      {
        title: 'Amazon Originals & Exclusives',
        filter: (m) => /action|adventure|sci-fi/i.test(`${m.genre}`)
      },
      {
        title: 'Top Movies Included with Prime',
        filter: (m) => m.views > 2500000
      },
      {
        title: 'Action-Packed Blockbusters',
        filter: (m) => /action|adventure|thriller/i.test(m.genre)
      },
      {
        title: 'Prime Sci-Fi & Fantasy Showcase',
        filter: (m) => /sci-fi|fantasy|cosmic/i.test(`${m.genre} ${m.title}`)
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter((m, idx) => {
        if (m.streamingSources?.some(s => s.name.toLowerCase().includes('prime') || s.name.toLowerCase().includes('amazon'))) return true;
        const t = m.title.toLowerCase();
        const g = (m.genre || '').toLowerCase();
        return /top gun|gladiator|john wick|jurassic|oppenheimer|rings|fellowship|fast|titanic|back to the future|interstellar|avatar/i.test(`${t} ${g}`) || idx % 2 === 1;
      });
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
        filter: (m) => /avenger|iron man|spider|deadpool|hero/i.test(`${m.title} ${m.genre}`)
      },
      {
        title: 'Cosmic & Galactic Worlds',
        filter: (m) => /avatar|star wars|interstellar|space|alien/i.test(`${m.title} ${m.genre}`)
      },
      {
        title: 'Animation & Family Blockbusters',
        filter: (m) => /animation|adventure|family/i.test(`${m.genre} ${m.title}`)
      },
      {
        title: 'Popular on Disney+',
        filter: (m) => m.views > 2000000
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter((m) => {
        if (m.streamingSources?.some(s => s.name.toLowerCase().includes('disney'))) return true;
        const t = m.title.toLowerCase();
        const g = (m.genre || '').toLowerCase();
        return /avatar|avenger|iron man|spider|deadpool|star wars|alien|wild robot|flow|animation|family|adventure|sci-fi/i.test(`${t} ${g}`);
      });
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
        filter: (m) => /drama|sci-fi|history/i.test(`${m.genre}`)
      },
      {
        title: 'Award-Winning Masterpieces',
        filter: (m) => (m.criticScore || 80) >= 82
      },
      {
        title: 'Prestige Sci-Fi & Thrillers',
        filter: (m) => /sci-fi|thriller|mystery/i.test(m.genre)
      },
      {
        title: 'Explore All on Apple TV+',
        filter: () => true
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter((m, idx) => {
        if (m.streamingSources?.some(s => s.name.toLowerCase().includes('apple'))) return true;
        const t = m.title.toLowerCase();
        const g = (m.genre || '').toLowerCase();
        return /oppenheimer|interstellar|dune|blade runner|matrix|inception|history|drama|sci-fi/i.test(`${t} ${g}`) || idx % 2 === 0;
      });
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
        title: 'Warner Bros. Box Office Hits',
        filter: (m) => /dark knight|batman|inception|matrix|dune|gladiator/i.test(`${m.title} ${m.genre}`)
      },
      {
        title: 'DC Universe & Action Spectacles',
        filter: (m) => /action|adventure|thriller/i.test(m.genre)
      },
      {
        title: 'Critically Acclaimed Dramas',
        filter: (m) => (m.criticScore || 80) >= 80
      },
      {
        title: 'Trending on Max',
        filter: (m) => m.views > 2000000
      }
    ],
    filterMovies: (allMovies: Movie[]) => {
      return allMovies.filter((m, idx) => {
        if (m.streamingSources?.some(s => s.name.toLowerCase().includes('max') || s.name.toLowerCase().includes('hbo'))) return true;
        const t = m.title.toLowerCase();
        const g = (m.genre || '').toLowerCase();
        return /dune|dark knight|batman|inception|matrix|oppenheimer|rings|fellowship|gladiator|action|thriller/i.test(`${t} ${g}`) || idx % 2 === 1;
      });
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
      return allMovies.filter((m, idx) => {
        if (m.streamingSources?.some(s => s.name.toLowerCase().includes('hulu'))) return true;
        const t = m.title.toLowerCase();
        const g = (m.genre || '').toLowerCase();
        return /alien|fight club|deadpool|spider|resident evil|horror|thriller|comedy|dune/i.test(`${t} ${g}`) || idx % 2 === 0;
      });
    }
  }
};
