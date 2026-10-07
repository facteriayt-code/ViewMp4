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
      <div className="flex items-center px-4 md:px-12 justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="font-cinema text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-wider flex items-center gap-2">
            <span>{title}</span>
          </h3>
          {isTop10 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Refreshes in 24h</span>
            </span>
          )}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-300 hover:text-white underline inline-flex items-center gap-1 transition bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-full border border-white/10"
              title={`Source: ${sourceUrl}`}
            >
              <span>Source: {sourceUrl.includes('netflix.com') ? 'Netflix Tudum' : 'FlixPatrol'}</span>
              <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
            </a>
          )}
          <button 
            onClick={handleShareCategory}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 shadow-md ${
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
        
        <div className="hidden md:flex items-center space-x-1 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
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
          className={`row-container flex ${isTop10 ? 'items-end space-x-3 md:space-x-5' : 'items-center space-x-3 md:space-x-4'} overflow-x-auto px-4 md:px-12 scroll-smooth py-3 no-scrollbar scroll-snap-x-mandatory`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {movies.map((movie, idx) => (
            <div 
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className={`relative flex-none ${isTop10 ? 'flex items-end' : 'flex items-center'} cursor-pointer transition-transform duration-300 hover:scale-[1.03] hover:z-20 scroll-snap-align-start group/card`}
            >
              {isTop10 && (
                <div className="w-12 sm:w-16 md:w-20 flex items-end justify-end shrink-0 z-10 pointer-events-none -mr-3 sm:-mr-5 md:-mr-7 select-none">
                  <span 
                    className="font-black tracking-tighter leading-none select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]"
                    style={{
                      fontSize: 'clamp(5rem, 8vw, 8rem)',
                      WebkitTextStroke: '2.5px rgba(255,255,255,0.45)',
                      color: '#0a0a0a',
                      lineHeight: '0.8',
                      letterSpacing: '-0.07em'
                    }}
                  >
                    {movie.rank || (idx + 1)}
                  </span>
                </div>
              )}

              <div className={`${isTop10 ? 'w-32 sm:w-36 md:w-44 aspect-[2/3]' : 'w-44 sm:w-52 md:w-64 aspect-[16/10]'} rounded-xl overflow-hidden bg-[#12141c] shadow-xl hover:shadow-2xl border border-white/[0.08] group-hover/card:border-white/30 relative shrink-0 transition-all duration-300`}>
              <img 
                src={movie.thumbnail || movie.poster || movie.backdrop} 
                alt={movie.title} 
                className="w-full h-full object-cover brightness-[0.9] group-hover/card:brightness-75 group-hover/card:scale-105 transition-all duration-500 pointer-events-none"
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
              <div className="absolute top-2 right-2 z-30 flex items-center space-x-1.5 opacity-0 group-hover/card:opacity-100 transition-all duration-200">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportingMovie(movie);
                  }}
                  className="p-1.5 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 hover:bg-amber-600 text-amber-300 hover:text-white transition shadow-lg"
                  title="Report stream or wrong title"
                >
                  <AlertTriangle className="w-3 h-3" />
                </button>

                <button 
                  type="button"
                  onClick={(e) => handleShareMovie(e, movie)}
                  className="p-1.5 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 hover:bg-red-600 transition shadow-lg text-white"
                  title="Share link"
                >
                  {copiedId === movie.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                </button>
              </div>

              {/* Rating & Quality Badges */}
              <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5">
                <div className="flex items-center bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-bold text-amber-300 border border-amber-400/20">
                  <span>★ {typeof movie.userRating === 'number' ? movie.userRating.toFixed(1) : '8.0'}</span>
                </div>
                <div className="bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-bold text-gray-300 border border-white/10 hidden sm:block">
                  <span>{movie.isTv ? 'SERIES' : 'HD'}</span>
                </div>
              </div>

              {/* Direct Play Button on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(movie);
                  }}
                  className="pointer-events-auto bg-[#E50914] hover:bg-[#b80710] text-white w-11 h-11 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition"
                  title={`Watch ${movie.title} now`}
                >
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </button>
              </div>

              {/* Bottom Card Title Info */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-all duration-300">
                 <p className="text-xs sm:text-sm font-bold text-white truncate leading-tight">{movie.title}</p>
                 <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-medium mt-0.5">
                    <span className="text-gray-300">{movie.year || '2026'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{movie.genre}</span>
                 </div>
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