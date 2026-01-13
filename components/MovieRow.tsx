
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Share2, Check, Eye } from 'lucide-react';
import { Movie } from '../types.ts';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const formatViews = (views: number) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick }) => {
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

  if (movies.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-xl md:text-2xl font-bold px-4 md:px-12 text-gray-100">{title}</h3>
      <div className="group relative flex items-center">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 p-2 bg-black/50 h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-125 md:px-4"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div 
          ref={rowRef}
          className="row-container flex space-x-2 md:space-x-4 overflow-x-auto px-4 md:px-12 scroll-smooth"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="relative flex-none w-40 h-24 md:w-64 md:h-36 cursor-pointer transition duration-300 hover:scale-110 hover:z-20 rounded-md overflow-hidden bg-zinc-900 group/card"
            >
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
              
              <button 
                onClick={(e) => handleShare(e, movie)}
                className="absolute top-2 right-2 z-30 p-1.5 bg-black/60 rounded-full border border-white/10 opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-600 hover:border-red-600"
              >
                {copiedId === movie.id ? <Check className="w-3 h-3 md:w-4 md:h-4 text-white" /> : <Share2 className="w-3 h-3 md:w-4 md:h-4 text-white" />}
              </button>

              <div className="absolute top-2 left-2 z-30 flex items-center bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white opacity-0 group-hover/card:opacity-100 transition-opacity">
                <Eye className="w-3 h-3 mr-1 text-red-500" />
                <span className="tabular-nums transition-all duration-300">
                  {formatViews(movie.views)}
                </span>
              </div>

              {copiedId === movie.id && (
                <div className="absolute top-10 right-2 z-40 bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg animate-in fade-in slide-in-from-top-1 uppercase tracking-tighter">
                  Copied!
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-2 md:p-4">
                 <p className="text-xs md:text-sm font-bold text-white truncate pr-6">{movie.title}</p>
                 <div className="flex items-center space-x-2 text-[8px] md:text-[10px] text-green-400 font-bold mt-1">
                    <span>{movie.rating}</span>
                    <span>{movie.year}</span>
                    {movie.isUserUploaded && <span className="text-orange-500 border border-orange-500/30 px-1 rounded-sm uppercase tracking-tighter text-[7px] md:text-[8px]">Realtime User Content</span>}
                 </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 p-2 bg-black/50 h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-125 md:px-4"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
