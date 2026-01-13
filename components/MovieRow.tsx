
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Share2, Check, Eye, Play } from 'lucide-react';
import { Movie } from '../types.ts';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

const formatViews = (views: number) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick, onPlay }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleShare = async (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?v=${movie.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(movie.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handlePlayClick = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    onPlay(movie);
  };

  if (movies.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-xl md:text-2xl font-black px-4 md:px-12 text-gray-100 uppercase tracking-tighter italic">{title}</h3>
      <div className="group relative flex items-center">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 z-30 p-2 bg-black/70 h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-125 md:px-4"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div 
          ref={rowRef}
          className="row-container flex space-x-2 md:space-x-4 overflow-x-auto px-4 md:px-12 scroll-smooth py-4"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="relative flex-none w-44 h-28 md:w-72 md:h-40 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20 rounded-xl overflow-hidden bg-zinc-900 group/card shadow-xl hover:shadow-red-600/30 border border-white/5"
            >
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover brightness-[0.9] group-hover/card:brightness-50 transition-all duration-300"
              />
              
              {/* PLAY BUTTON - ALWAYS VISIBLE ON MOBILE */}
              <button 
                onClick={(e) => handlePlayClick(e, movie)}
                className="absolute inset-0 m-auto w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/card:opacity-100 scale-95 md:scale-50 md:group-hover/card:scale-100 transition-all duration-300 shadow-[0_0_30px_rgba(229,9,20,0.6)] z-40 hover:scale-110 active:scale-90 border-2 border-white/30"
              >
                <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
              </button>

              <button 
                onClick={(e) => handleShare(e, movie)}
                className="absolute top-2 right-2 z-30 p-2 bg-black/60 rounded-full border border-white/10 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity hover:bg-red-600"
              >
                {copiedId === movie.id ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
              </button>

              <div className="absolute top-2 left-2 z-30 flex items-center bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-black text-white opacity-100 md:opacity-0 md:group-hover/card:opacity-100">
                <Eye className="w-3 h-3 mr-1 text-red-500" />
                <span>{formatViews(movie.views)}</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 md:p-5 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity">
                 <p className="text-xs md:text-base font-black text-white truncate pr-8 uppercase italic leading-none">{movie.title}</p>
                 <div className="flex items-center space-x-2 text-[8px] md:text-[11px] text-green-400 font-black mt-1 uppercase tracking-widest">
                    <span>{movie.rating}</span>
                    <span className="text-gray-500">•</span>
                    <span>{movie.year}</span>
                    {movie.isUserUploaded && <span className="bg-red-600 text-white px-1.5 rounded-sm text-[7px] md:text-[9px]">Community</span>}
                 </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 z-30 p-2 bg-black/70 h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-125 md:px-4"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
