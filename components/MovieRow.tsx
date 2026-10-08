import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, Check, Eye, Play, AlertTriangle, ExternalLink } from 'lucide-react';
import { Movie } from '../types.ts';
import { ReportIssueModal } from './ReportIssueModal.tsx';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  isTop10?: boolean;
  sourceUrl?: string;
}

const formatViews = (views: number) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick, onPlay, isTop10, sourceUrl }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCategory, setCopiedCategory] = useState(false);
  const [reportingMovie, setReportingMovie] = useState<Movie | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      // We scroll by clientWidth minus a bit of padding to keep context
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
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
    <div id={`row-${title.replace(/\s+/g, '-').toLowerCase()}`} className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 group/row">
      <div className="flex items-center px-4 sm:px-8 md:px-12 lg:px-16 justify-between gap-4">
        <div className="flex items-center space-x-3 min-w-0">
          <h3 className="font-royal text-base sm:text-2xl md:text-3xl text-white tracking-wider uppercase flex items-center gap-2 whitespace-nowrap">
            <span>{title}</span>
          </h3>
          <button 
            onClick={handleShareCategory}
            className={`shrink-0 flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 shadow-md ${
              copiedCategory 
                ? 'bg-emerald-600 border-emerald-500 scale-105 shadow-emerald-500/20' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
            title="Share Category"
          >
            {copiedCategory ? (
              <Check className="w-3 h-3 text-white" />
            ) : (
              <Share2 className="w-3 h-3 text-gray-400" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
              {copiedCategory ? 'Copied' : 'Share'}
            </span>
          </button>
        </div>
        
        <div className="hidden md:flex items-center space-x-1 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 shrink-0">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scroll</span>
           <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      <div className="group relative flex items-center">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 z-30 p-2 bg-[#0f1014]/90 backdrop-blur-md h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-105 md:px-3 text-white border-r border-white/10"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div 
          ref={rowRef}
          className="row-container flex items-start space-x-3 sm:space-x-4 md:space-x-5 overflow-x-auto px-4 sm:px-8 md:px-12 lg:px-16 scroll-smooth py-3 no-scrollbar scroll-snap-x-mandatory"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {movies.map((movie, idx) => (
            <div 
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="relative flex-none flex items-start cursor-pointer scroll-snap-align-start group/card"
            >
              {isTop10 && (
                <div className="w-10 sm:w-14 md:w-16 flex items-end justify-end shrink-0 z-10 pointer-events-none -mr-3 sm:-mr-5 md:-mr-6 select-none h-[195px] sm:h-[240px] md:h-[278px] lg:h-[300px] pb-1">
                  <span 
                    className="font-royal font-black tracking-tighter leading-none select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)]"
                    style={{
                      fontSize: 'clamp(5rem, 8vw, 8rem)',
                      WebkitTextStroke: '2px rgba(255,255,255,0.45)',
                      color: '#07090e',
                      lineHeight: '0.75',
                      letterSpacing: '-0.08em'
                    }}
                  >
                    {movie.rank || (idx + 1)}
                  </span>
                </div>
              )}

              {/* Exact Bingr.one 2:3 Poster Card Size across All Rows */}
              <div className="w-[130px] sm:w-[160px] md:w-[185px] lg:w-[200px] flex flex-col shrink-0">
                <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-[#1a1c24] ring-1 ring-white/5 transition-all duration-300 group-hover/card:ring-white/20 group-hover/card:-translate-y-2 shadow-lg">
                  <img 
                    src={movie.thumbnail || movie.poster || movie.backdrop} 
                    alt={movie.title} 
                    className="w-full h-full object-cover object-center brightness-[0.92] group-hover/card:brightness-75 transition-all duration-500 pointer-events-none"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (movie.backdrop && target.src !== movie.backdrop) {
                        target.src = movie.backdrop;
                      } else if (movie.poster && target.src !== movie.poster) {
                        target.src = movie.poster;
                      } else {
                        target.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop";
                      }
                    }}
                  />
                  
                  {/* Card Actions Overlay (Report & Share) */}
                  <div className="absolute top-2 right-2 z-30 flex items-center space-x-1 opacity-0 group-hover/card:opacity-100 transition-all duration-200">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportingMovie(movie);
                      }}
                      className="p-1.5 bg-black/75 backdrop-blur-md rounded-md border border-white/10 hover:bg-amber-600 text-amber-300 hover:text-white transition shadow-lg"
                      title="Report stream or wrong title"
                    >
                      <AlertTriangle className="w-3 h-3" />
                    </button>

                    <button 
                      type="button"
                      onClick={(e) => handleShareMovie(e, movie)}
                      className="p-1.5 bg-black/75 backdrop-blur-md rounded-md border border-white/10 hover:bg-red-600 transition shadow-lg text-white"
                      title="Share link"
                    >
                      {copiedId === movie.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Rating & Quality Badges */}
                  <div className="absolute top-2 left-2 z-30 flex items-center gap-1">
                    <div className="flex items-center bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-300 border border-amber-400/20">
                      <span>★ {typeof movie.userRating === 'number' ? movie.userRating.toFixed(1) : '8.0'}</span>
                    </div>
                    <div className="bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-300 border border-white/10 hidden sm:block">
                      <span>{movie.isTv ? 'SERIES' : 'HD'}</span>
                    </div>
                  </div>

                  {/* Direct Action on Hover - Opens Movie Details */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMovieClick(movie);
                      }}
                      className="pointer-events-auto bg-[#E50914] hover:bg-[#b80710] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition"
                      title={`View details for ${movie.title}`}
                    >
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Bingr Title & Metadata below card */}
                <div className="mt-2 truncate text-[13px] sm:text-[14px] font-semibold text-white/90 tracking-tight">
                  {movie.title}
                </div>
                <div className="flex items-center mt-0.5 text-[11px] font-medium text-white/50 gap-1.5 truncate">
                  <span>{movie.year || '2026'}</span>
                  <span className="text-white/30">•</span>
                  <span className="truncate">{movie.genre?.split(',')[0] || (movie.isTv ? 'Series' : 'Movie')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 z-30 p-2 bg-[#0f1014]/90 backdrop-blur-md h-full opacity-0 group-hover:opacity-100 transition duration-300 hover:scale-105 md:px-3 text-white border-l border-white/10"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-snap-x-mandatory {
          scroll-snap-type: x mandatory;
        }
        .scroll-snap-align-start {
          scroll-snap-align: start;
        }
      `}</style>
      {/* Instant Stream Fix & Report Modal */}
      {reportingMovie && (
        <ReportIssueModal
          isOpen={!!reportingMovie}
          movie={reportingMovie}
          onClose={() => setReportingMovie(null)}
          onPlayFixed={(fixedMovie) => {
            onPlay(fixedMovie);
            setReportingMovie(null);
          }}
        />
      )}
    </div>
  );
};

export default MovieRow;