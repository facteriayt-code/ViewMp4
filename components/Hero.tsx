import React, { useState, useEffect } from 'react';
import { Play, Info, AlertTriangle, ChevronLeft, ChevronRight, Sparkles, Bookmark, Heart } from 'lucide-react';
import { Movie } from '../types.ts';
import { ReportIssueModal } from './ReportIssueModal.tsx';
import { isMovieSaved, isMovieLiked, toggleSaveMovie, toggleLikeMovie } from '../services/userLibraryService.ts';

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
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsSaved(isMovieSaved(activeMovie.id));
    setIsLiked(isMovieLiked(activeMovie.id));

    const handleSaved = () => setIsSaved(isMovieSaved(activeMovie.id));
    const handleLiked = () => setIsLiked(isMovieLiked(activeMovie.id));
    window.addEventListener('gemini_saved_movies_updated', handleSaved);
    window.addEventListener('gemini_liked_movies_updated', handleLiked);
    return () => {
      window.removeEventListener('gemini_saved_movies_updated', handleSaved);
      window.removeEventListener('gemini_liked_movies_updated', handleLiked);
    };
  }, [activeMovie.id]);

  const handleToggleSave = () => {
    toggleSaveMovie(activeMovie);
  };

  const handleToggleLike = () => {
    toggleLikeMovie(activeMovie);
  };

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
    <div className="relative min-h-[580px] sm:min-h-[640px] md:min-h-[700px] h-[82vh] lg:h-[88vh] w-full overflow-hidden bg-[#090b10]">
      {/* Background Backdrop with Ambient Cinema Lighting */}
      {activeMovie.backdrop ? (
        <img 
          key={`backdrop-${activeMovie.id}`}
          src={activeMovie.backdrop} 
          alt={activeMovie.title} 
          className="w-full h-full object-cover object-center md:object-[center_20%] brightness-[0.52] md:brightness-[0.65] transition-opacity duration-700 animate-in fade-in"
          onError={(e) => {
            if (activeMovie.thumbnail && e.currentTarget.src !== activeMovie.thumbnail) {
              e.currentTarget.src = activeMovie.thumbnail;
              e.currentTarget.className = "w-full h-full object-cover blur-2xl opacity-40 brightness-50";
            }
          }}
        />
      ) : (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-zinc-950 via-[#0d1117] to-zinc-950">
          <img 
            key={`ambient-${activeMovie.id}`}
            src={activeMovie.thumbnail || activeMovie.poster} 
            alt={activeMovie.title} 
            className="w-full h-full object-cover blur-3xl opacity-35 scale-110 brightness-50"
          />
        </div>
      )}

      {/* Atmospheric Royal Lighting Aura */}
      <div className="absolute -left-20 bottom-10 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-24 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Bingr Cinematic Multi-layer Vignette - seamlessly blends under navigation bar */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090b10]/95 via-[#090b10]/60 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#090b10] via-[#090b10]/60 to-transparent pointer-events-none z-10" />
      
      {/* Content Overlay - Perfectly balanced layout with movie metadata and native 2:3 vertical poster */}
      <div className="absolute inset-0 z-20 flex items-end justify-between px-4 sm:px-8 md:px-12 lg:px-16 pb-8 sm:pb-12 md:pb-16 pointer-events-none">
        {/* Left Column: Metadata & CTAs */}
        <div className="max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-4 pr-2 sm:pr-4 pointer-events-auto">
          {/* Spotlight & Quality Badges (Royal & Cinematic Style) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-semibold text-gray-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/30 to-amber-500/25 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Spotlight #{currentIndex + 1}</span>
              {playlist.length > 1 && (
                <div className="flex items-center ml-1 space-x-1 pl-1.5 border-l border-amber-400/30">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-0.5 hover:text-white transition active:scale-90"
                    title="Previous spotlight title"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-0.5 hover:text-white transition active:scale-90"
                    title="Next spotlight title"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

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

          {/* Mobile-only compact poster badge (never misplaced, 100% exact 2:3 aspect ratio) */}
          <div className="flex sm:hidden items-center space-x-3 pt-1">
            <div 
              onClick={() => onInfoClick(activeMovie)}
              className="w-16 aspect-[2/3] rounded-xl overflow-hidden border border-white/25 shadow-xl bg-zinc-900 shrink-0 cursor-pointer active:scale-95 transition-transform"
            >
              <img
                src={activeMovie.thumbnail || activeMovie.poster || activeMovie.backdrop}
                alt={activeMovie.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Spotlight Selection</span>
              <p className="text-xs text-gray-300 line-clamp-2">{activeMovie.genre} · {activeMovie.year}</p>
            </div>
          </div>

          {/* Display Title in Royal Cinematic Typography */}
          <h1 
            onClick={() => onInfoClick(activeMovie)}
            className="font-royal text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wider uppercase text-white leading-[0.98] drop-shadow-[0_15px_35px_rgba(0,0,0,0.98)] font-black cursor-pointer hover:text-amber-200 transition-colors"
          >
            {activeMovie.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-200/90 drop-shadow-lg line-clamp-2 md:line-clamp-3 max-w-xl font-normal leading-relaxed">
            {activeMovie.description}
          </p>
          
          {/* Action Buttons - Clicking first opens the movie detail page */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 pt-2">
            <button 
              type="button"
              onClick={() => onInfoClick(activeMovie)}
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
              onClick={handleToggleSave}
              className={`p-3.5 rounded-full border transition-all active:scale-95 shadow-lg ${
                isSaved 
                  ? 'bg-red-600 border-red-500 text-white shadow-red-600/30' 
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-gray-300 hover:text-white'
              }`}
              title={isSaved ? "Saved in Account Info" : "Save Movie to Watchlist"}
            >
              <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button 
              type="button"
              onClick={handleToggleLike}
              className={`p-3.5 rounded-full border transition-all active:scale-95 shadow-lg ${
                isLiked 
                  ? 'bg-red-600 border-red-500 text-white shadow-red-600/30' 
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-gray-300 hover:text-white'
              }`}
              title={isLiked ? "Liked (Saved in Account Info)" : "Like this title"}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
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

        {/* Right Column: Perfectly Fitted 2:3 Vertical Movie Poster Showcase (Visible across sm, md, lg, xl) */}
        <div className="hidden sm:flex flex-col items-center shrink-0 pl-4 sm:pl-6 pointer-events-auto mb-1 self-end">
          <div 
            onClick={() => onInfoClick(activeMovie)}
            className="group/spotlight-poster relative cursor-pointer select-none transition-all duration-300 hover:scale-105"
            title={`View details for ${activeMovie.title}`}
          >
            {/* Ambient backlight glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600/30 via-amber-500/30 to-purple-600/20 rounded-3xl blur-2xl opacity-75 group-hover/spotlight-poster:opacity-100 transition-opacity" />

            {/* Poster Frame: 100% exact 2:3 aspect ratio, never cropped or distorted */}
            <div className="relative w-36 sm:w-44 md:w-48 lg:w-56 aspect-[2/3] rounded-2xl overflow-hidden border border-white/20 bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
              <img
                key={`poster-${activeMovie.id}`}
                src={activeMovie.thumbnail || activeMovie.poster || activeMovie.backdrop}
                alt={activeMovie.title}
                className="w-full h-full object-cover object-center group-hover/spotlight-poster:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/spotlight-poster:opacity-100 transition-opacity flex items-end justify-center p-3">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Details</span>
                </span>
              </div>
            </div>
          </div>

          {/* Clean Under-Poster Carousel Switcher (Non-overlapping) */}
          {playlist.length > 1 && (
            <div className="mt-2.5 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
              <button 
                type="button"
                onClick={handlePrev} 
                className="p-1 text-gray-400 hover:text-white transition active:scale-90"
                title="Previous Spotlight Title"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-gray-300">
                0{currentIndex + 1} / 0{playlist.length}
              </span>
              <button 
                type="button"
                onClick={handleNext} 
                className="p-1 text-gray-400 hover:text-white transition active:scale-90"
                title="Next Spotlight Title"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Side Nav Chevrons (Positioned high at top-1/3 so they never overlap details or report buttons) */}
      {playlist.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="hidden md:flex absolute left-4 top-1/3 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15 hover:border-amber-400/50 backdrop-blur-md transition-all active:scale-90 hover:scale-110 shadow-2xl group"
            title="Previous Featured Title"
            aria-label="Previous Spotlight Title"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="hidden md:flex absolute right-4 top-1/3 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15 hover:border-amber-400/50 backdrop-blur-md transition-all active:scale-90 hover:scale-110 shadow-2xl group"
            title="Next Featured Title"
            aria-label="Next Spotlight Title"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Top-Right Spotlight Pagination Pill (Safe from Details & Report buttons) */}
      {playlist.length > 1 && (
        <div className="absolute top-20 sm:top-24 md:top-28 right-4 sm:right-8 md:right-12 lg:right-16 z-30 flex items-center space-x-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-full shadow-2xl">
          <div className="flex items-center text-xs font-mono font-bold text-gray-300 tracking-wider">
            <span className="text-white">0{currentIndex + 1}</span>
            <span className="mx-1 text-gray-600">/</span>
            <span>0{playlist.length}</span>
          </div>

          <div className="h-3 w-px bg-white/20 mx-0.5" />

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {playlist.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? 'w-5 bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>
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
