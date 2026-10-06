import React, { useRef, useState } from 'react';
import { Play, Info, X, ChevronLeft, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { Movie, ContinueWatchingItem } from '../types.ts';
import { ReportIssueModal } from './ReportIssueModal.tsx';

interface ContinueWatchingRowProps {
  userName?: string;
  items: ContinueWatchingItem[];
  onPlay: (movie: Movie, season?: number, episode?: number) => void;
  onSelectMovie: (movie: Movie) => void;
  onRemove: (movieId: string) => void;
}

export const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  userName = 'You',
  items,
  onPlay,
  onSelectMovie,
  onRemove
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [reportingItem, setReportingItem] = useState<ContinueWatchingItem | null>(null);

  if (!items || items.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const target = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      rowRef.current.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  const onScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  return (
    <section className="relative px-4 md:px-12 py-3 group">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-5 bg-red-600 rounded-full inline-block" />
          <h2 className="text-base sm:text-xl font-black tracking-tight text-white flex items-center space-x-2">
            <span>Continue Watching for {userName}</span>
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-600/10 border border-red-600/20 px-2 py-0.5 rounded-full ml-2 hidden sm:inline">
            Resume Playback
          </span>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {items.length} in progress
        </span>
      </div>

      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-1 md:left-6 top-[55%] -translate-y-1/2 z-30 bg-black/80 hover:bg-red-600 text-white p-2 sm:p-2.5 rounded-full shadow-2xl transition-all duration-200 border border-white/20 active:scale-95"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {showRightArrow && items.length > 3 && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-1 md:right-6 top-[55%] -translate-y-1/2 z-30 bg-black/80 hover:bg-red-600 text-white p-2 sm:p-2.5 rounded-full shadow-2xl transition-all duration-200 border border-white/20 active:scale-95"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Horizontal Carousel */}
      <div
        ref={rowRef}
        onScroll={onScroll}
        className="flex space-x-3.5 sm:space-x-5 overflow-x-auto no-scrollbar py-2 scroll-smooth"
      >
        {items.map((item) => {
          const { movie, progress, season, episode } = item;
          const isSeries = movie.isTv || !!season;

          return (
            <div
              key={movie.id}
              className="relative shrink-0 w-56 sm:w-64 md:w-72 bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-red-600/60 shadow-xl transition-all duration-300 hover:scale-[1.03] group/card cursor-pointer flex flex-col"
              onClick={() => onPlay(movie, season, episode)}
            >
              {/* Media Backdrop / Thumbnail (16:9 cinematic aspect) */}
              <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                <img
                  src={movie.backdrop || movie.thumbnail}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/20 to-transparent" />

                {/* Action Buttons on top right */}
                <div className="absolute top-2 right-2 z-20 flex items-center space-x-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReportingItem(item);
                    }}
                    className="bg-black/70 hover:bg-amber-600 text-amber-300 hover:text-white p-1 rounded-full backdrop-blur-md border border-white/15 transition-colors shadow-lg active:scale-90"
                    title="Report if this movie is not playing or wrong movie"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(movie.id);
                    }}
                    className="bg-black/70 hover:bg-red-600 text-gray-300 hover:text-white p-1 rounded-full backdrop-blur-md border border-white/15 transition-colors shadow-lg active:scale-90"
                    title="Remove from Continue Watching"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Centered Play Button (Revealed on hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity z-10 bg-black/40 backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl transform scale-90 group-hover/card:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* TV Series Season & Episode Tag */}
                {isSeries && season && episode && (
                  <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md border border-white/20 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">
                    S{season}:E{episode}
                  </div>
                )}

                {/* Bottom Red Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-700/80">
                  <div
                    className="h-full bg-red-600 transition-all duration-300 shadow-[0_0_8px_rgba(229,9,20,0.8)]"
                    style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
                  />
                </div>
              </div>

              {/* Card Meta & Control Footer */}
              <div className="p-3 flex items-center justify-between gap-2 bg-zinc-950">
                <div className="truncate flex-1">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate group-hover/card:text-red-400 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5 font-medium truncate">
                    <span className="text-red-500 font-bold">{progress}% completed</span>
                    <span>•</span>
                    <span className="truncate">{movie.year}</span>
                    {movie.rating && (
                      <>
                        <span>•</span>
                        <span className="border border-white/20 px-1 rounded text-[9px]">
                          {movie.rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Info Modal Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMovie(movie);
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition shrink-0 border border-white/10"
                  title="View details"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instant Stream Fix & Report Modal for Continue Watching */}
      {reportingItem && (
        <ReportIssueModal
          isOpen={!!reportingItem}
          movie={reportingItem.movie}
          season={reportingItem.season}
          episode={reportingItem.episode}
          onClose={() => setReportingItem(null)}
          onFixApplied={() => {
            // Fix applied
          }}
          onPlayFixed={(fixedMovie) => {
            setReportingItem(null);
            onPlay(fixedMovie, reportingItem.season, reportingItem.episode);
          }}
        />
      )}
    </section>
  );
};
