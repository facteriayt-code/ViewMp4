import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, Check, Eye } from 'lucide-react';
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
  const [copiedCategory, setCopiedCategory] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleShareMovie = async (e: React.MouseEvent, movie: Movie) => {
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

  const handleShareCategory = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?cat=${encodeURIComponent(title)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedCategory(true);
      setTimeout(() => setCopiedCategory(false), 2000);
    } catch (err) {
      console.error('Failed to copy category link:', err);
    }
  };

  if (movies.length === 0) return null;

  return (
    <div id={`row-${title.replace(/\s+/g, '-').toLowerCase()}`} className="space-y-4 mb-8 group/row">
      <div className="flex items-center px-4 md:px-12 space-x-3">
        <h3 className="text-xl md:text-2xl font-black text-gray-100 uppercase tracking-tighter italic">
          {title}
        </h3>
        <button 
          onClick={handleShareCategory}
          className={`p-1.5 rounded-full border transition-all duration-300 opacity-0 group-hover/row:opacity-100 ${copiedCategory ? 'bg-green-600 border-green-500 scale-110' : 'bg-white/5 border-white/10 hover:bg-red-600 hover:border-red-500'}`}
          title="Share Category"
        >
          {copiedCategory ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5 text-gray-400 group-hover/row:text-white" />}
        </button>
        {copiedCategory && (
          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
            Link Copied
          </span>
        )}
      </div>

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
                className="w-full h-full object-cover brightness-[0.9] group-hover/card:brightness-75 transition-all duration-300"
              />
              
              <button 
                onClick={(e) => handleShareMovie(e, movie)}
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