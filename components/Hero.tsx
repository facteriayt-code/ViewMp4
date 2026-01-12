
import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types.ts';

interface HeroProps {
  movie: Movie;
  onInfoClick: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onInfoClick }) => {
  return (
    <div className="relative h-[85vh] w-full">
      <img 
        src={movie.thumbnail} 
        alt={movie.title} 
        className="w-full h-full object-cover brightness-75"
      />
      <div className="absolute inset-0 netflix-gradient" />
      
      <div className="absolute bottom-24 left-4 md:left-12 max-w-2xl space-y-4">
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight">{movie.title}</h2>
        <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg line-clamp-3">
          {movie.description}
        </p>
        
        <div className="flex space-x-4 pt-4">
          <button className="bg-white text-black px-8 py-3 rounded flex items-center font-bold text-lg hover:bg-gray-200 transition">
            <Play className="w-6 h-6 mr-2 fill-black" /> Play
          </button>
          <button 
            onClick={() => onInfoClick(movie)}
            className="bg-gray-500/50 text-white px-8 py-3 rounded flex items-center font-bold text-lg hover:bg-gray-500/70 transition"
          >
            <Info className="w-6 h-6 mr-2" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
