import React, { useState, useEffect, useMemo } from 'react';
import { X, Play, Share2, Check, Eye, TrendingUp, PlayCircle } from 'lucide-react';
import { Movie } from '../types.ts';
import AdBanner from './AdBanner.tsx';

interface MovieDetailsProps {
  movie: Movie;
  allMovies: Movie[];
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onMovieSelect: (movie: Movie) => void;
}

const formatViews = (views: number) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, allMovies, onClose, onPlay, onMovieSelect }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const modal = document.querySelector('.modal-scroll-container');
    if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movie.id]);

  const suggestions = useMemo(() => {
    return allMovies
      .filter(m => m.id !== movie.id)
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);
  }, [allMovies, movie.id]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?v=${movie.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto modal-scroll-container">
      <div className="relative bg-[#141414] w-full max-w-3xl min-h-screen md:min-h-0 md:rounded-2xl overflow-hidden shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] bg-black/60 hover:bg-red-600 p-2 rounded-full transition-all active:scale-90 shadow-lg"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* 1. Video Thumbnail with Central Play Button */}
        <div className="relative aspect-video group">
          <img 
            src={movie.thumbnail} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />
          
          <div className="absolute inset-0 flex items-center justify-center">
             <button 
              onClick={() => onPlay(movie)}
              className="bg-red-600 text-white w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(229,9,20,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white/20"
             >
                <Play className="w-8 h-8 md:w-12 md:h-12 fill-white ml-1 md:ml-2" />
             </button>
          </div>
        </div>

        {/* 2. Content Details & Actions */}
        <div className="p-5 md:p-8 space-y-5 md:space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">
              {movie.title}
            </h2>
            <div className="flex items-center space-x-3 md:space-x-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span>{movie.year}</span>
              <span>•</span>
              <span className="text-green-500">{movie.rating}</span>
              <span>•</span>
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" /> {formatViews(movie.views)}
              </span>
            </div>
          </div>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-4">
            {movie.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={() => onPlay(movie)}
              className="flex-1 bg-white text-black py-3 md:py-4 rounded-xl flex items-center justify-center font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-lg text-xs md:text-sm"
            >
              <PlayCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 fill-black" />
              Watch Now
            </button>
            
            <button 
              onClick={handleShare}
              className={`flex-1 py-3 md:py-4 rounded-xl flex items-center justify-center font-black uppercase tracking-widest transition-all active:scale-95 border-2 text-xs md:text-sm ${copied ? 'bg-green-600 border-green-600 text-white' : 'bg-transparent border-white/10 text-white hover:bg-white/5'}`}
            >
              {copied ? <Check className="w-5 h-5 md:w-6 md:h-6 mr-2" /> : <Share2 className="w-5 h-5 md:w-6 md:h-6 mr-2" />}
              {copied ? 'Link Copied' : 'Share Link'}
            </button>
          </div>

          <div className="py-2 overflow-hidden">
            <AdBanner />
          </div>

          <div className="pt-6 md:pt-8 border-t border-white/5 space-y-4">
            <div className="flex items-center space-x-2 text-gray-100">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h3 className="text-base md:text-lg font-black uppercase tracking-tighter">Recommended</h3>
            </div>
            
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
              {suggestions.map((sug) => (
                <div 
                  key={sug.id}
                  onClick={() => onMovieSelect(sug)}
                  className="group cursor-pointer space-y-1.5"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-white/5 shadow-md">
                    <img 
                      src={sug.thumbnail} 
                      alt={sug.title} 
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-110 group-hover:brightness-75" 
                    />
                  </div>
                  <h4 className="text-[9px] md:text-xs font-bold text-gray-300 truncate group-hover:text-red-500 transition-colors uppercase italic">
                    {sug.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;