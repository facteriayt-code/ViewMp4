
import { Movie } from './types.ts';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Interstellar',
    description: 'When mankind is on the brink of extinction, a group of astronauts travel through a wormhole in search of a new home for humanity.',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop',
    genre: 'Sci-Fi',
    year: 2014,
    rating: 'PG-13',
    views: 1254300
  },
  {
    id: '2',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop',
    genre: 'Action',
    year: 2008,
    rating: 'PG-13',
    views: 4500200
  },
  {
    id: '3',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2054&auto=format&fit=crop',
    genre: 'Sci-Fi',
    year: 2010,
    rating: 'PG-13',
    views: 3200150
  },
  {
    id: '4',
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop',
    genre: 'Action',
    year: 1999,
    rating: 'R',
    views: 8900400
  },
  {
    id: '5',
    title: 'Avatar',
    description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2068&auto=format&fit=crop',
    genre: 'Adventure',
    year: 2009,
    rating: 'PG-13',
    views: 5600780
  },
  {
    id: '6',
    title: 'Blade Runner 2049',
    description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
    thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
    genre: 'Sci-Fi',
    year: 2017,
    rating: 'R',
    views: 1890320
  }
];

export const CATEGORIES = [
  'Trending Now',
  'Sci-Fi Masterpieces',
  'Action & Adventure',
  'Your Uploads'
];