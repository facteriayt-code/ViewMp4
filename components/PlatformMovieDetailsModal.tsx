import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Plus, Check, X, Star, Share2, 
  Sparkles, Clock, Tv, ThumbsUp, Heart, CheckCircle2, Volume2, Film
} from 'lucide-react';
import { Movie } from '../types.ts';
import { PlatformId, PLATFORMS } from '../services/platformCatalog.ts';
import { isTvOrSeries } from '../services/streamService.ts';
import { fetchSeasonEpisodes, TvEpisode, getUniqueEpisodeThumbnail } from '../services/watchmodeService.ts';
import { isMovieSaved, isMovieLiked, toggleSaveMovie, toggleLikeMovie } from '../services/userLibraryService.ts';

interface PlatformMovieDetailsModalProps {
  movie: Movie;
  platformId: PlatformId;
  allMovies: Movie[];
  onClose: () => void;
  onPlay: (movie: Movie, season?: number, episode?: number) => void;
  onSelectMovie: (movie: Movie) => void;
}

export const PlatformMovieDetailsModal: React.FC<PlatformMovieDetailsModalProps> = ({
  movie,
  platformId,
  allMovies,
  onClose,
  onPlay,
  onSelectMovie
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isTv = isTvOrSeries(movie) || !!movie.isTv;
  const [selectedSeason, setSelectedSeason] = useState<number>(movie.initialSeason || 1);
  const [episodes, setEpisodes] = useState<TvEpisode[]>(() => {
    if (!isTv) return [];
    return Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      duration: `${45 + (i * 3) % 15}m`,
      overview: `A high-stakes development unfolds as secrets come to light in season ${selectedSeason}, episode ${i + 1}.`,
      thumbnail: getUniqueEpisodeThumbnail(movie.title, selectedSeason, i + 1)
    }));
  });
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  // Sync saved and liked state with userLibraryService
  useEffect(() => {
    setIsSaved(isMovieSaved(movie.id));
    setIsLiked(isMovieLiked(movie.id));

    const handleSaved = () => setIsSaved(isMovieSaved(movie.id));
    const handleLiked = () => setIsLiked(isMovieLiked(movie.id));

    window.addEventListener('gemini_saved_movies_updated', handleSaved);
    window.addEventListener('gemini_liked_movies_updated', handleLiked);

    return () => {
      window.removeEventListener('gemini_saved_movies_updated', handleSaved);
      window.removeEventListener('gemini_liked_movies_updated', handleLiked);
    };
  }, [movie.id]);

  const handleToggleSave = () => {
    const newState = toggleSaveMovie(movie);
    setIsSaved(newState);
  };

  const handleToggleLike = () => {
    const newState = toggleLikeMovie(movie);
    setIsLiked(newState);
  };

  // Fetch verified TV episodes for this season with distinct thumbnails
  useEffect(() => {
    if (!isTv) return;
    let isCurrent = true;
    setIsLoadingEpisodes(true);
    fetchSeasonEpisodes(movie, selectedSeason).then(res => {
      if (isCurrent) {
        if (res.length > 0) {
          setEpisodes(res);
        }
        setIsLoadingEpisodes(false);
      }
    });
    return () => { isCurrent = false; };
  }, [movie, isTv, selectedSeason]);

  // Reset scroll on movie change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [movie.id]);

  // Handle ESC key and lock body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleShare = async () => {
    const url = `${window.location.origin}?v=${movie.id}&platform=${platformId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Filter recommendations matching this platform
  const recommendations = allMovies
    .filter(m => m.id !== movie.id)
    .slice(0, 6);

  const releaseYear = movie.year || 2024;
  const ratingText = movie.rating || (isTv ? 'TV-MA' : 'PG-13');
  const matchPercentage = Math.min(99, Math.max(86, Math.round((movie.userRating || 8.0) * 10 + (movie.title.length % 8))));
  const platformConfig = PLATFORMS[platformId] || PLATFORMS.netflix;

  // ─────────────────────────────────────────────────────────────
  // 1. NETFLIX REPLICA MOVIE DETAIL MODAL
  // ─────────────────────────────────────────────────────────────
  if (platformId === 'netflix') {
    return (
      <div 
        className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 select-none"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#181818] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-white/10 text-white flex flex-col my-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button (Netflix round dark circle) */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#181818]/90 hover:bg-[#282828] border border-white/20 text-white flex items-center justify-center transition active:scale-90 shadow-xl"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div ref={scrollContainerRef} className="overflow-y-auto flex-1 no-scrollbar overscroll-contain">
            {/* Netflix Hero Banner Header: Compact & Perfectly Proportionate */}
            <div className="relative w-full h-56 sm:h-64 md:h-72 bg-black shrink-0 overflow-hidden">
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/80 via-transparent to-transparent" />

              {/* Top Netflix Original Ribbon */}
              <div className="absolute top-3.5 left-4 sm:left-6 z-10 flex items-center space-x-2">
                <span className="font-royal text-red-600 font-black text-2xl tracking-tighter">N</span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-gray-200">
                  {isTv ? 'SERIES' : 'FILM'}
                </span>
              </div>

              {/* Title & Quick Actions on Hero Banner */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 space-y-2 sm:space-y-3 z-10">
                <h1 className="font-royal text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white drop-shadow-xl tracking-tight leading-none truncate">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onPlay(movie, selectedSeason, 1)}
                    className="px-5 sm:px-7 py-2 sm:py-2.5 bg-white hover:bg-gray-200 text-black font-black text-xs sm:text-sm rounded-md flex items-center transition active:scale-95 shadow-xl"
                  >
                    <Play className="w-4 h-4 fill-black mr-1.5" />
                    <span>Play</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition active:scale-90 ${
                      isSaved ? 'bg-red-600 border-red-500 text-white' : 'border-white/40 hover:border-white bg-black/40 text-white'
                    }`}
                    title={isSaved ? 'Saved in Account Info' : 'Add to My List'}
                  >
                    {isSaved ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleLike}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition active:scale-90 ${
                      isLiked ? 'bg-red-600 border-red-500 text-white' : 'border-white/40 hover:border-white bg-black/40 text-white'
                    }`}
                    title={isLiked ? 'Liked (Saved in Account Info)' : 'Rate this title'}
                  >
                    <ThumbsUp className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isLiked ? 'fill-white' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/40 hover:border-white bg-black/40 text-white flex items-center justify-center transition active:scale-90"
                    title="Share title link"
                  >
                    <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                  {copied && (
                    <span className="text-xs text-green-400 font-bold animate-in fade-in">Link copied!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Netflix Metadata & Synopsis Immediately Visible */}
            <div className="p-4 sm:p-6 space-y-6 bg-[#181818]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Left 2 cols: Badges & Description */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-semibold">
                    <span className="text-emerald-400 font-black text-sm">
                      {matchPercentage}% Match
                    </span>
                    <span className="text-gray-400 font-normal">
                      {releaseYear}
                    </span>
                    <span className="border border-white/40 px-1.5 py-0.5 text-[10px] text-gray-200 uppercase font-bold rounded">
                      {ratingText}
                    </span>
                    <span className="text-gray-400 font-normal">
                      {isTv ? `${selectedSeason} Seasons` : '2h 14m'}
                    </span>
                    <span className="border border-white/20 text-gray-300 px-1.5 py-0.5 text-[10px] rounded uppercase font-bold">
                      Ultra HD 4K
                    </span>
                    <span className="border border-white/20 text-gray-300 px-1.5 py-0.5 text-[10px] rounded uppercase font-bold">
                      Spatial Audio
                    </span>
                  </div>

                  <p className="text-gray-200 text-sm leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                {/* Right col: Cast, Genres, Mood tags */}
                <div className="space-y-2.5 text-xs text-gray-400 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-gray-500 font-medium">Genre: </span>
                    <span className="text-gray-200 font-semibold">{movie.genre || 'Action, Drama'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Audio: </span>
                    <span className="text-gray-200">English [Original], Dolby Atmos 5.1</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Subtitles: </span>
                    <span className="text-gray-200">English, Spanish, French, German</span>
                  </div>
                </div>
              </div>

              {/* TV Episodes Section if Series */}
              {isTv && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-royal text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Tv className="w-4 h-4 text-red-500" />
                      <span>Episodes (Season {selectedSeason})</span>
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">
                      {episodes.length} Episodes available
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {episodes.map(ep => (
                      <div
                        key={ep.number}
                        onClick={() => onPlay(movie, selectedSeason, ep.number)}
                        className="flex flex-col sm:flex-row sm:items-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <span className="text-sm font-bold text-gray-400 w-5 text-center shrink-0">
                            {ep.number}
                          </span>
                          <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                            <img
                              src={ep.thumbnail}
                              alt={ep.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Play className="w-6 h-6 fill-white text-white drop-shadow-md" />
                            </div>
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-gray-300 font-mono">
                              {ep.duration}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 sm:mt-0 sm:ml-4 min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition truncate">
                              {ep.title}
                            </h4>
                          </div>
                          <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-2 mt-1">
                            {ep.overview}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations Section: More Like This */}
              {recommendations.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h3 className="font-royal text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                    More Like This
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
                    {recommendations.map(rec => (
                      <div
                        key={rec.id}
                        onClick={() => onSelectMovie(rec)}
                        className="group/rec cursor-pointer space-y-1.5"
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/10 shadow-md">
                          <img
                            src={rec.thumbnail || rec.backdrop}
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover/rec:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/rec:opacity-100 transition flex items-center justify-center">
                            <Play className="w-6 h-6 fill-white text-white drop-shadow-md" />
                          </div>
                        </div>
                        <h4 className="text-xs font-bold text-gray-200 group-hover/rec:text-white truncate">
                          {rec.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. AMAZON PRIME VIDEO REPLICA MOVIE DETAIL MODAL
  // ─────────────────────────────────────────────────────────────
  if (platformId === 'prime') {
    return (
      <div 
        className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 font-sans select-none"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#0b121e] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-[#00a8e1]/30 text-white flex flex-col my-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0b121e]/90 hover:bg-[#00a8e1]/30 border border-white/20 text-white flex items-center justify-center transition active:scale-90 shadow-xl"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div ref={scrollContainerRef} className="overflow-y-auto flex-1 no-scrollbar overscroll-contain">
            {/* Prime Hero Backdrop with Cyan Lighting */}
            <div className="relative w-full h-56 sm:h-64 md:h-72 bg-black shrink-0 overflow-hidden">
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b121e] via-[#0b121e]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b121e]/90 via-transparent to-transparent" />

              {/* Prime Badge */}
              <div className="absolute top-3.5 left-4 sm:left-6 z-10 flex items-center space-x-2">
                <span className="bg-[#00a8e1] text-black text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                  prime
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-200 uppercase tracking-widest">
                  Included with Prime
                </span>
              </div>

              {/* Title & Prime Actions */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 space-y-2 sm:space-y-3 z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg tracking-tight truncate">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onPlay(movie, selectedSeason, 1)}
                    className="px-5 sm:px-7 py-2 sm:py-2.5 bg-[#00a8e1] hover:bg-[#0092c4] text-black font-black text-xs sm:text-sm rounded-md flex items-center transition active:scale-95 shadow-xl shadow-[#00a8e1]/30"
                  >
                    <Play className="w-4 h-4 fill-black mr-1.5" />
                    <span>Watch with Prime</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold rounded-md flex items-center transition active:scale-95 border ${
                      isSaved ? 'bg-[#00a8e1] border-[#00a8e1] text-black' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    }`}
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5 mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
                    <span>{isSaved ? 'In Watchlist' : 'Watchlist'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleLike}
                    className={`p-2 sm:p-2.5 rounded-md transition active:scale-90 border ${
                      isLiked ? 'bg-[#00a8e1] border-[#00a8e1] text-black' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    }`}
                    title={isLiked ? 'Liked (Saved in Account Info)' : 'Like this title'}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-black' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition active:scale-90 border border-white/20"
                    title="Share title"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prime Details Body Immediately Visible */}
            <div className="p-4 sm:p-6 space-y-6 bg-[#0b121e]">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-gray-300">
                <span className="font-bold text-[#00a8e1]">{matchPercentage}% Match</span>
                <span className="text-gray-400">{releaseYear}</span>
                <span className="border border-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-200">{ratingText}</span>
                <span className="text-gray-400">{isTv ? `${selectedSeason} Seasons` : '2h 15m'}</span>
                <span className="border border-[#00a8e1]/40 text-[#00a8e1] px-1.5 py-0.5 rounded text-[10px] font-bold">UHD</span>
                <span className="border border-gray-700 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-300">HDR</span>
              </div>

              <p className="text-gray-200 text-sm leading-relaxed max-w-3xl">
                {movie.description}
              </p>

              {/* TV Episodes with Prime Styling */}
              {isTv && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                      <span className="text-[#00a8e1]">Season {selectedSeason}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-xs text-gray-400 font-normal">{episodes.length} Episodes</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {episodes.map(ep => (
                      <div
                        key={ep.number}
                        onClick={() => onPlay(movie, selectedSeason, ep.number)}
                        className="flex p-3 rounded-lg bg-[#121c2d] hover:bg-[#19273f] border border-[#00a8e1]/20 transition cursor-pointer group"
                      >
                        <div className="relative w-28 aspect-video rounded overflow-hidden shrink-0 bg-black mr-3">
                          <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <Play className="w-5 h-5 fill-white text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#00a8e1] transition truncate">
                            {ep.number}. {ep.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono">{ep.duration}</span>
                          <p className="text-[11px] text-gray-300 line-clamp-2 mt-1">{ep.overview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. DISNEY+ REPLICA MOVIE DETAIL MODAL
  // ─────────────────────────────────────────────────────────────
  if (platformId === 'disney') {
    return (
      <div 
        className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 select-none"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#0f101e] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-[#113ccf]/40 text-white flex flex-col my-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0f101e]/90 hover:bg-[#113ccf]/40 border border-white/20 text-white flex items-center justify-center transition active:scale-90 shadow-xl"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div ref={scrollContainerRef} className="overflow-y-auto flex-1 no-scrollbar overscroll-contain">
            <div className="relative w-full h-56 sm:h-64 md:h-72 bg-black shrink-0 overflow-hidden">
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f101e] via-[#0f101e]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f101e]/90 via-transparent to-transparent" />

              <div className="absolute top-3.5 left-4 sm:left-6 z-10 flex items-center space-x-1.5">
                <span className="font-serif font-black tracking-widest text-cyan-400 text-xs sm:text-sm uppercase">Disney+ Original</span>
              </div>

              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 space-y-2 sm:space-y-3 z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-xl tracking-tight uppercase truncate">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-0.5">
                  <button
                    type="button"
                    onClick={() => onPlay(movie, selectedSeason, 1)}
                    className="px-6 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-[#0063e5] to-[#0483ee] hover:from-[#0483ee] hover:to-[#0063e5] text-white font-black text-xs sm:text-sm rounded-lg flex items-center transition active:scale-95 shadow-xl shadow-blue-600/30"
                  >
                    <Play className="w-4 h-4 fill-white mr-1.5" />
                    <span>Watch Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition active:scale-90 ${
                      isSaved ? 'bg-cyan-600 border-cyan-400 text-white' : 'border-white/40 hover:border-white bg-black/40 text-white'
                    }`}
                    title={isSaved ? 'Saved in Account Info' : 'Add to Watchlist'}
                  >
                    {isSaved ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleLike}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition active:scale-90 ${
                      isLiked ? 'bg-cyan-600 border-cyan-400 text-white' : 'border-white/40 hover:border-white bg-black/40 text-white'
                    }`}
                    title={isLiked ? 'Liked (Saved in Account Info)' : 'Like'}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/40 hover:border-white bg-black/40 text-white flex items-center justify-center transition active:scale-90"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6 bg-[#0f101e]">
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-300">
                <span className="border border-white/30 px-1.5 py-0.5 rounded text-[10px] font-bold">{ratingText}</span>
                <span>{releaseYear}</span>
                <span>{isTv ? `${selectedSeason} Seasons` : '2h 18m'}</span>
                <span className="border border-cyan-400/40 text-cyan-300 px-1.5 py-0.5 rounded text-[10px] font-bold">IMAX Enhanced</span>
                <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Dolby Vision</span>
              </div>

              <p className="text-gray-200 text-sm leading-relaxed max-w-3xl">
                {movie.description}
              </p>

              {isTv && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">Episodes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {episodes.map(ep => (
                      <div
                        key={ep.number}
                        onClick={() => onPlay(movie, selectedSeason, ep.number)}
                        className="flex p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition cursor-pointer group"
                      >
                        <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-900 mr-3">
                          <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <Play className="w-5 h-5 fill-white text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition truncate">
                            {ep.number}. {ep.title}
                          </h4>
                          <span className="text-[10px] text-gray-400">{ep.duration}</span>
                          <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{ep.overview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. APPLE TV+, MAX, HULU REPLICA MOVIE DETAIL MODAL
  // ─────────────────────────────────────────────────────────────
  const isApple = platformId === 'appletv';
  const isMax = platformId === 'max';
  const isHulu = platformId === 'hulu';

  const brandAccentBg = isApple 
    ? 'bg-white hover:bg-gray-200 text-black' 
    : isMax 
      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white' 
      : 'bg-[#1ce783] hover:bg-[#18cc74] text-black font-black';

  const brandPillBadge = isApple 
    ? 'Apple Original' 
    : isMax 
      ? 'Max Original' 
      : 'Hulu Original';

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 font-sans select-none"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] border border-white/10 text-white flex flex-col my-auto animate-in zoom-in-95 duration-200 ${
          isApple ? 'bg-[#161617]' : isMax ? 'bg-[#0d081f]' : 'bg-[#0b0c0e]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/75 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-90 shadow-xl"
          title="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div ref={scrollContainerRef} className="overflow-y-auto flex-1 no-scrollbar overscroll-contain">
          <div className="relative w-full h-56 sm:h-64 md:h-72 bg-black shrink-0 overflow-hidden">
            <img
              src={movie.backdrop || movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-transparent" />

            <div className="absolute top-3.5 left-4 sm:left-6 z-10">
              <span className="bg-white/15 backdrop-blur-md text-white border border-white/25 text-[10px] font-bold uppercase px-3 py-0.5 rounded-full tracking-wider">
                {brandPillBadge}
              </span>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 space-y-2 sm:space-y-3 z-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg tracking-tight truncate">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-0.5">
                <button
                  type="button"
                  onClick={() => onPlay(movie, selectedSeason, 1)}
                  className={`px-6 sm:px-8 py-2 sm:py-2.5 font-black text-xs sm:text-sm rounded-full flex items-center transition active:scale-95 shadow-xl ${brandAccentBg}`}
                >
                  <Play className="w-4 h-4 fill-current mr-1.5" />
                  <span>Stream Now</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition active:scale-90 ${
                    isSaved ? 'bg-red-600 border-red-500 text-white' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                  title={isSaved ? 'Saved in Account Info' : 'Watchlist'}
                >
                  {isSaved ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition active:scale-90 ${
                    isLiked ? 'bg-red-600 border-red-500 text-white' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                  title={isLiked ? 'Liked (Saved in Account Info)' : 'Like'}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-90"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-300">
              <span className="border border-white/30 px-1.5 py-0.5 rounded text-[10px] font-bold">{ratingText}</span>
              <span>{releaseYear}</span>
              <span>{isTv ? `${selectedSeason} Seasons` : '2h 15m'}</span>
              <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">4K Dolby Vision</span>
              <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Dolby Atmos</span>
            </div>

            <p className="text-gray-200 text-sm leading-relaxed max-w-3xl">
              {movie.description}
            </p>

            {isTv && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-base sm:text-lg font-bold text-white">Episodes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {episodes.map(ep => (
                    <div
                      key={ep.number}
                      onClick={() => onPlay(movie, selectedSeason, ep.number)}
                      className="flex items-center p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 transition cursor-pointer group"
                    >
                      <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-900 mr-3">
                        <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Play className="w-5 h-5 fill-white text-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white transition truncate">
                          {ep.number}. {ep.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono">{ep.duration}</span>
                        <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">{ep.overview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformMovieDetailsModal;
