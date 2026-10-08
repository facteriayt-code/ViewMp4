import React, { useState, useEffect } from 'react';
import { Play, Info, AlertTriangle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Movie } from '../types.ts';
import { ReportIssueModal } from './ReportIssueModal.tsx';

interface HeroProps {
  movie: Movie;
  featuredMovies?: Movie[];
  onInfoClick: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, featuredMovies, onInfoClick, onPlay }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playlist = (featuredMovies && featuredMovies.length > 0) ? featuredMovies.slice(0, 6) : [movie];
  const activeMovie = playlist[currentIndex] || movie;

  // Auto-advance spotlight every 9 seconds
  useEffect(() => {
    if (playlist.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [playlist.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  return (
    <div className="relative min-h-[580px] sm:min-h-[640px] md:min-h-[720px] h-[82vh] lg:h-[88vh] w-full overflow-hidden bg-[#090b10]">
      {/* Background Backdrop with Smooth Crossfade Effect */}
      <img 
        key={activeMovie.id}
        src={activeMovie.backdrop || activeMovie.thumbnail} 
        alt={activeMovie.title} 
        className="w-full h-full object-cover brightness-[0.62] md:brightness-[0.74] scale-105 transition-all duration-1000 animate-in fade-in"
        onError={(e) => {
          if (activeMovie.thumbnail && e.currentTarget.src !== activeMovie.thumbnail) {
            e.currentTarget.src = activeMovie.thumbnail;
          }
        }}
      />

      {/* Atmospheric Royal Lighting Aura */}
      <div className="absolute -left-20 bottom-10 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-24 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Bingr Cinematic Multi-layer Vignette - seamlessly blends under navigation bar */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090b10]/95 via-[#090b10]/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#090b10] via-[#090b10]/60 to-transparent pointer-events-none z-10" />
      
      {/* Content Overlay - Horizontally aligned with Navbar logo and container */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-4 sm:left-8 md:left-12 lg:left-16 max-w-3xl space-y-3 sm:space-y-4 pr-4 z-20">
        {/* Spotlight & Quality Badges (Royal & Cinematic Style) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-semibold text-gray-300">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/30 to-amber-500/25 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Spotlight #{currentIndex + 1}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-amber-300 font-extrabold bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/30 text-[11px] backdrop-blur-md shadow-sm">
            ★ {typeof activeMovie.userRating === 'number' ? activeMovie.userRating.toFixed(1) : '8.6'} IMDb
          </span>

          <span className="text-gray-200 font-medium px-2.5 py-1 bg-white/10 rounded-full border border-white/15 text-[11px] backdrop-blur-md">
            {activeMovie.year || '2026'}
          </span>

          <span className="border border-white/20 px-2.5 py-1 rounded-full text-[10px] text-gray-200 font-bold bg-black/50 backdrop-blur-md">
            {activeMovie.rating || 'PG-13'}
          </span>

          <span className="border border-emerald-500/40 px-2.5 py-1 rounded-full text-[10px] text-emerald-400 font-bold bg-emerald-500/15 backdrop-blur-md">
            4K ULTRA HD
          </span>

          <span className="border border-cyan-500/40 px-2.5 py-1 rounded-full text-[10px] text-cyan-300 font-bold bg-cyan-500/15 hidden sm:inline backdrop-blur-md">
            DOLBY CINEMA
          </span>

          <span aria-hidden="true" className="text-gray-500 hidden sm:inline">·</span>
          <span className="text-gray-300 hidden sm:inline tracking-wide">{activeMovie.genre}</span>
        </div>

        {/* Display Title in Royal Cinematic Typography */}
        <h1 className="font-royal text-3xl sm:text-5xl md:text-7xl lg:text-8xl tracking-wider uppercase text-white leading-[0.95] drop-shadow-[0_15px_35px_rgba(0,0,0,0.98)] font-black">
          {activeMovie.title}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-gray-200/90 drop-shadow-lg line-clamp-2 md:line-clamp-3 max-w-xl font-normal leading-relaxed">
          {activeMovie.description}
        </p>
        
        {/* Play and Details Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 pt-2">
          <button 
            type="button"
            onClick={() => onPlay(activeMovie)}
            className="bg-gradient-to-r from-white via-zinc-100 to-amber-100 hover:from-white hover:to-white text-black px-7 sm:px-9 py-3.5 rounded-full flex items-center font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(255,255,255,0.45)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] hover:scale-105 active:scale-95 transition-all group"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-black group-hover:scale-110 transition-transform" /> 
            <span>Watch Now</span>
          </button>

          <button 
            type="button"
            onClick={() => onInfoClick(activeMovie)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white px-6 sm:px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 flex items-center font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-gray-300" /> 
            <span>Details</span>
          </button>

          <button 
            type="button"
            onClick={() => setShowReportModal(true)}
            className="bg-black/50 hover:bg-amber-600/20 text-gray-400 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 backdrop-blur-md px-4 py-3.5 rounded-full flex items-center font-medium text-xs sm:text-sm transition-all active:scale-95 shadow-lg"
            title="Report playback or metadata issue"
          >
            <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400/80 mr-1" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* Royal Carousel Controls (Right Side / Pagination) */}
      {playlist.length > 1 && (
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 right-4 sm:right-8 md:right-12 lg:right-16 z-20 flex items-center space-x-3.5">
          <div className="hidden sm:flex items-center text-xs font-mono font-bold text-gray-400 mr-2 tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-white">0{currentIndex + 1}</span>
            <span className="mx-1 text-gray-600">/</span>
            <span>0{playlist.length}</span>
          </div>

          <button
            type="button"
            onClick={handlePrev}
            className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 hover:border-amber-400/40 backdrop-blur-md transition-all active:scale-90 shadow-xl"
            title="Previous Featured Title"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {playlist.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? 'w-6 bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 hover:border-amber-400/40 backdrop-blur-md transition-all active:scale-90 shadow-xl"
            title="Next Featured Title"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Instant Stream Fix & Report Modal for Hero */}
      {showReportModal && (
        <ReportIssueModal
          isOpen={showReportModal}
          movie={activeMovie}
          onClose={() => setShowReportModal(false)}
          onPlayFixed={(fixedMovie) => {
            setShowReportModal(false);
            onPlay(fixedMovie);
          }}
        />
      )}
    </div>
  );
};

export default Hero;
