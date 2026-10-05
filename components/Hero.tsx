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
        src={movie.backdrop || movie.thumbnail} 
        alt={movie.title} 
        className="w-full h-full object-cover brightness-[0.6] md:brightness-75 transition-all duration-700"
      />
      <div className="absolute inset-0 netflix-gradient" />
      
      <div className="absolute bottom-12 md:bottom-20 left-4 md:left-12 max-w-3xl space-y-3 md:space-y-4 pr-4">
        {/* Category & Rating Badges */}
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
          <span className="text-red-500 font-black tracking-widest uppercase">GEMINISTREAM EXCLUSIVE</span>
          <span aria-hidden="true">·</span>
          <span>{movie.genre}</span>
          <span aria-hidden="true">·</span>
          <span>{movie.year}</span>
          {movie.rating && (
            <>
              <span aria-hidden="true">·</span>
              <span className="border border-white/20 px-1 py-0.5 rounded text-[10px] text-gray-200">
                {movie.rating}
              </span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span className="text-amber-400">
            ★ {typeof movie.userRating === 'number' ? movie.userRating.toFixed(1) : '8.6'}
          </span>
        </div>

        <h2 className="text-3xl md:text-7xl font-black tracking-tighter uppercase italic drop-shadow-2xl text-white">
          {movie.title}
        </h2>
        <p className="text-sm md:text-xl text-gray-200 drop-shadow-lg line-clamp-2 md:line-clamp-3 max-w-xl font-medium leading-relaxed">
          {movie.description}
        </p>
        
        {/* Play and Info CTA */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button 
            type="button"
            onClick={() => onPlay(movie)}
            className="bg-white text-black px-5 md:px-8 py-2 md:py-3 rounded-xl flex items-center font-black text-sm md:text-lg hover:bg-gray-200 transition active:scale-95 shadow-xl"
          >
            <Play className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2 fill-black" /> Play Now
          </button>
          <button 
            type="button"
            onClick={() => onInfoClick(movie)}
            className="bg-gray-500/50 backdrop-blur-md text-white px-5 md:px-8 py-2 md:py-3 rounded-xl flex items-center font-black text-sm md:text-lg hover:bg-gray-500/70 transition active:scale-95 shadow-xl"
          >
            <Info className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-2" /> More Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
