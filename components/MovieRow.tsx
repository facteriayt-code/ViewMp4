import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, Check, Eye, Link } from 'lucide-react';
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
    const shareUrl = `${window.location.origin}?v=${movie.id}&autoplay=true`;
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
    <div id={`row-${title.replace(/\s+/g, '-').toLowerCase()}`} className="space-y-4 mb-10 group/row">
      <div className="flex items-center px-4 md:px-12 justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter italic">
            {title}
          </h3>
          <button 
            onClick={handleShareCategory}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-500 shadow-xl ${
              copiedCategory 
                ? 'bg-green-600 border-green-500 scale-105 shadow-green-500/20' 
                : 'bg-red-600/10 border-red-600/40 hover:bg-red-600 hover:border-red-500 shadow-red-600/10'
            }`}
            title="Share Entire Category"
          >
            {copiedCategory ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-white" />
            )}
            <span className={`text-[10px] font-black uppercase tracking-widest text-white`}>
              {copiedCategory ? 'Copied' : 'Share'}
            </span>
          </button>
        </div>
        
        <div className="hidden md:flex items-center space-x-1 opacity-0 group-hover/row:opacity-100 transition-opacity duration-500">
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Explore all</span>
           <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      <div className="group relative flex items-center">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 z-30 p-2 bg-black/70 h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-110 md:px-4"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div 
          ref={rowRef}
          className="row-container flex space-x-2 md:space-x-5 overflow-x-auto px-4 md:px-12 scroll-smooth py-4"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="relative flex-none w-48 h-28 md:w-80 md:h-44 cursor-pointer transition-all duration-500 hover:scale-105 hover:z-20 rounded-2xl overflow-hidden bg-zinc-900 group/card shadow-2xl hover:shadow-red-600/30 border border-white/5"
            >
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover brightness-[0.9] group-hover/card:brightness-75 transition-all duration-500"
              />
              
              <div className="absolute top-2 right-2 z-30 flex flex-col space-y-2 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-all duration-300 translate-y-2 group-hover/card:translate-y-0">
                <button 
                  onClick={(e) => handleShareMovie(e, movie)}
                  className="p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 hover:bg-red-600 transition-colors shadow-lg"
                >
                  {copiedId === movie.id ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
                </button>
              </div>

              <div className="absolute top-3 left-3 z-30 flex items-center bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-white border border-white/5">
                <Eye className="w-3.5 h-3.5 mr-1 text-red-500 fill-red-500" />
                <span>{formatViews(movie.views)}</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 md:p-6 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-all duration-300 transform translate-y-4 group-hover/card:translate-y-0">
                 <p className="text-xs md:text-lg font-black text-white truncate pr-8 uppercase italic leading-tight tracking-tight">{movie.title}</p>
                 <div className="flex items-center space-x-2 text-[8px] md:text-[11px] text-green-400 font-black mt-1 uppercase tracking-widest">
                    <span className="border border-green-500/30 px-1 rounded-sm">{movie.rating}</span>
                    <span className="text-gray-500">•</span>
                    <span>{movie.year}</span>
                    {movie.isUserUploaded && <span className="bg-red-600 text-white px-2 py-0.5 rounded-sm text-[8px] md:text-[10px] ml-auto">UGC</span>}
                 </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 z-30 p-2 bg-black/70 h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-110 md:px-4"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;