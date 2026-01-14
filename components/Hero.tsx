import React from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types.ts';

interface HeroProps {
  movie: Movie;
  onInfoClick: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onInfoClick, onPlay }) => {
  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      <img 
        src={movie.thumbnail} 
        alt={movie.title} 
        className="w-full h-full object-cover brightness-[0.6] md:brightness-75 transition-all duration-700"
      />
      <div className="absolute inset-0 netflix-gradient" />
      
      <div className="absolute bottom-16 md:bottom-24 left-4 md:left-12 max-w-2xl space-y-3 md:space-y-4 pr-4">
        <h2 className="text-3xl md:text-7xl font-black tracking-tighter uppercase italic drop-shadow-2xl">
          {movie.title}
        </h2>
        <p className="text-sm md:text-xl text-gray-200 drop-shadow-lg line-clamp-2 md:line-clamp-3 max-w-lg font-medium">
          {movie.description}
        </p>
        
        <div className="flex space-x-3 md:space-x-4 pt-2 md:pt-4">
          <button 
            onClick={() => onPlay(movie)}
            className="bg-white text-black px-5 md:px-8 py-2 md:py-3 rounded-lg flex items-center font-black text-sm md:text-lg hover:bg-gray-200 transition active:scale-95 shadow-lg"
          >
            <Play className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2 fill-black" /> Play
          </button>
          <button 
            onClick={() => onInfoClick(movie)}
            className="bg-gray-500/50 backdrop-blur-md text-white px-5 md:px-8 py-2 md:py-3 rounded-lg flex items-center font-black text-sm md:text-lg hover:bg-gray-500/70 transition active:scale-95 shadow-lg"
          >
            <Info className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" /> Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;