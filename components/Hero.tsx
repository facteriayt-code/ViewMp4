import React from 'react';
import { Play, Info, Tv } from 'lucide-react';
import { Movie } from '../types.ts';
import { PlatformId } from '../services/platformCatalog.ts';
import { NetflixNIcon } from './PlatformLogos.tsx';

interface HeroProps {
  movie: Movie;
  onInfoClick: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  onSelectPlatform?: (platform: PlatformId) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onInfoClick, onPlay, onSelectPlatform }) => {
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
          <span aria-hidden="true">·</span>
          <span className="text-amber-400">★ {movie.rating.toFixed(1)}</span>
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

        {/* Quick Launch Streaming Replica Strip directly in Hero */}
        {onSelectPlatform && (
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mr-1">
              <Tv className="w-3.5 h-3.5 text-red-500" />
              <span>Or Open Studio Replica:</span>
            </span>
            {[
              { id: 'netflix' as PlatformId, name: 'Netflix', color: '#E50914', border: 'border-red-600/40 hover:bg-red-600/20' },
              { id: 'prime' as PlatformId, name: 'Prime Video', color: '#00A8E1', border: 'border-cyan-500/40 hover:bg-cyan-500/20' },
              { id: 'disney' as PlatformId, name: 'Disney+', color: '#113CCF', border: 'border-blue-600/40 hover:bg-blue-600/20' },
              { id: 'appletv' as PlatformId, name: 'Apple TV+', color: '#FFFFFF', border: 'border-white/40 hover:bg-white/20' },
              { id: 'max' as PlatformId, name: 'Max', color: '#7B2CBF', border: 'border-purple-600/40 hover:bg-purple-600/20' },
              { id: 'hulu' as PlatformId, name: 'Hulu', color: '#1CE783', border: 'border-emerald-500/40 hover:bg-emerald-500/20' },
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPlatform(p.id)}
                className={`px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border text-[11px] font-bold text-white transition active:scale-95 flex items-center space-x-1.5 ${p.border}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
