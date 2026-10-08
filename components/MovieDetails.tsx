import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, Play, Share2, Check, ArrowLeft, Star, Bookmark, Volume2, VolumeX,
  AlertTriangle, ExternalLink, Sparkles, Film, Clock, Tv, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Movie, User } from '../types.ts';
import { isTvOrSeries } from '../services/streamService.ts';
import { fetchTmdbFullMovieDetails, TmdbFullMovieDetails } from '../services/watchmodeService.ts';
import { ReportIssueModal } from './ReportIssueModal.tsx';

interface MovieDetailsProps {
  movie: Movie;
  allMovies: Movie[];
  user: User | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onMovieSelect: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ 
  movie, 
  allMovies, 
  user: _user, 
  onClose, 
  onPlay, 
  onMovieSelect, 
  onEdit: _onEdit 
}) => {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [details, setDetails] = useState<TmdbFullMovieDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const isTv = isTvOrSeries(movie) || !!movie.isTv;
  const [selectedSeason, setSelectedSeason] = useState<number>(movie.initialSeason || 1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(movie.initialEpisode || 1);

  const castScrollRef = useRef<HTMLDivElement>(null);
  const recsScrollRef = useRef<HTMLDivElement>(null);

  // Check watchlist storage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gemini_watchlist') || '[]');
      setIsBookmarked(saved.includes(movie.id));
    } catch {
      setIsBookmarked(false);
    }
  }, [movie.id]);

  const toggleBookmark = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('gemini_watchlist') || '[]');
      let updated: string[];
      if (saved.includes(movie.id)) {
        updated = saved.filter(id => id !== movie.id);
        setIsBookmarked(false);
      } else {
        updated = [...saved, movie.id];
        setIsBookmarked(true);
      }
      localStorage.setItem('gemini_watchlist', JSON.stringify(updated));
    } catch (err) {
      console.error("Watchlist error:", err);
    }
  };

  // Reset and fetch full TMDb details on movie change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const modal = document.querySelector('.bingr-movie-page');
    if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });

    setSelectedSeason(movie.initialSeason || 1);
    setSelectedEpisode(movie.initialEpisode || 1);
    setIsPlayingTrailer(false);

    let isMounted = true;
    setIsLoadingDetails(true);

    fetchTmdbFullMovieDetails(movie)
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setIsLoadingDetails(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingDetails(false);
      });

    return () => {
      isMounted = false;
    };
  }, [movie.id, movie.title]);

  // Recommendations: TMDb recommendations first, followed by catalog items
  const recommendations = useMemo(() => {
    if (details?.recommendations && details.recommendations.length > 0) {
      return details.recommendations;
    }
    return allMovies
      .filter(m => m.id !== movie.id)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 12);
  }, [details?.recommendations, allMovies, movie.id]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?v=${movie.id}&autoplay=true`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handlePlayAction = (seasonNum?: number, episodeNum?: number) => {
    const finalSeason = seasonNum ?? selectedSeason;
    const finalEpisode = episodeNum ?? selectedEpisode;
    onPlay({
      ...movie,
      initialSeason: finalSeason,
      initialEpisode: finalEpisode,
      isTv
    });
  };

  const scrollCast = (dir: 'left' | 'right') => {
    if (castScrollRef.current) {
      const offset = castScrollRef.current.clientWidth * 0.75;
      castScrollRef.current.scrollBy({ left: dir === 'left' ? -offset : offset, behavior: 'smooth' });
    }
  };

  const scrollRecs = (dir: 'left' | 'right') => {
    if (recsScrollRef.current) {
      const offset = recsScrollRef.current.clientWidth * 0.75;
      recsScrollRef.current.scrollBy({ left: dir === 'left' ? -offset : offset, behavior: 'smooth' });
    }
  };

  // Formatted metadata
  const ratingValue = details?.certification ? details.certification : (movie.rating || 'PG-13');
  const userRating = typeof movie.userRating === 'number' && movie.userRating > 0 ? movie.userRating.toFixed(1) : '8.4';
  const runtimeDisplay = details?.runtimeFormatted || '2h 12m';
  const releaseYear = movie.year || (details?.releaseDate ? new Date(details.releaseDate).getFullYear() : '2024');

  // Genres formatted with pipe divider
  const genresList = movie.genre 
    ? movie.genre.split(/[,/|]/).map(g => g.trim()).filter(Boolean)
    : ['Action', 'Adventure', 'Sci-Fi'];

  // Synthetic TV episodes if TV series
  const seasonsCount = details?.seasons?.length || (isTv ? 3 : 1);
  const currentSeasonEpisodes = useMemo(() => {
    if (!isTv) return [];
    const count = 8;
    return Array.from({ length: count }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      duration: '48m',
      overview: `A high-stakes development unfolds as secrets come to light in chapter ${i + 1} of season ${selectedSeason}.`,
      thumbnail: movie.backdrop || movie.thumbnail
    }));
  }, [isTv, selectedSeason, movie.backdrop, movie.thumbnail]);

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white font-sans overflow-y-auto bingr-movie-page selection:bg-white/30 animate-movie-entrance">
      
      {/* ── 1. Sticky Transparent Glass Header (Bingr Style) ── */}
      <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/[0.08] px-4 md:px-12 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <button 
            type="button"
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition active:scale-95 border border-white/15 shrink-0"
            title="Return to Catalog"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2 truncate">
            <span className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[200px] sm:max-w-md">
              {movie.title}
            </span>
            <span className="text-gray-400 text-xs hidden sm:inline">
              ({releaseYear})
            </span>
          </div>
        </div>

        {/* Top-Right Quick Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handlePlayAction()}
            className="flex items-center space-x-1.5 bg-[#f9f9f9] hover:bg-white text-black px-4 sm:px-5 py-1.5 rounded-full font-black text-xs transition active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.4)] group"
          >
            <Play className="w-3.5 h-3.5 fill-black group-hover:scale-110 transition-transform" />
            <span>Watch Now</span>
          </button>

          <button
            type="button"
            onClick={toggleBookmark}
            className={`p-2 rounded-full border transition active:scale-95 ${
              isBookmarked ? 'bg-red-600 border-red-500 text-white' : 'bg-white/10 border-white/15 text-gray-300 hover:text-white hover:bg-white/20'
            }`}
            title={isBookmarked ? "In Watchlist" : "Add to Watchlist"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className={`p-2 rounded-full border transition active:scale-95 ${
              copied ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/10 border-white/15 text-gray-300 hover:text-white hover:bg-white/20'
            }`}
            title="Share Link"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition active:scale-90"
            title="Report or Fix Stream Server"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-red-600 text-gray-300 hover:text-white border border-white/15 transition active:scale-90"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── 2. Cinematic Hero Backdrop (Exact bingr.one h-[70vh] lg:h-[85vh] min-h-[500px]) ── */}
      <div className="relative w-full h-[70vh] lg:h-[85vh] min-h-[500px] overflow-hidden bg-black">
        {/* Background Video Trailer OR Backdrop Image */}
        {isPlayingTrailer && details?.trailerKey ? (
          <div className="absolute inset-0 w-full h-full pointer-events-auto">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${details.trailerKey}?autoplay=1&mute=${isMuted ? '1' : '0'}&controls=0&loop=1&playlist=${details.trailerKey}&modestbranding=1&rel=0`}
              title="Official Trailer"
              className="w-full h-full object-cover scale-125 pointer-events-none brightness-[0.7]"
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : (
          <img 
            src={movie.backdrop || movie.thumbnail} 
            alt={movie.title}
            className="w-full h-full object-cover object-center brightness-[0.65] md:brightness-[0.75] scale-105 transition-all duration-1000"
            onError={(e) => {
              const target = e.currentTarget;
              if (movie.thumbnail && target.src !== movie.thumbnail) {
                target.src = movie.thumbnail;
              }
            }}
          />
        )}

        {/* Multi-layer Cinematic Vignettes (Fade to pure black at bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 md:via-black/50 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Left Bottom Content Overlay (Exact bingr.one hero structure) */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 pb-12 md:pl-[80px] lg:pl-[120px] md:pb-20 pointer-events-none">
          <div className="max-w-2xl pointer-events-auto animate-in slide-in-from-bottom-8 fade-in duration-700">
            
            {/* Title Logo (if available) or Large Cinematic Text */}
            <div className="mb-4">
              {details?.logo ? (
                <img 
                  src={details.logo} 
                  alt={movie.title} 
                  className="max-h-[60px] md:max-h-[110px] w-auto object-contain drop-shadow-2xl mb-4" 
                />
              ) : (
                <h1 className="text-3xl md:text-6xl font-bold tracking-tight drop-shadow-lg text-white">
                  {movie.title}
                </h1>
              )}
            </div>

            {/* Metadata Line (Rating, Year, Certification, Runtime) */}
            <div className="flex items-center flex-wrap gap-2 text-[14px] md:text-[15px] font-medium text-white/90 mb-4">
              <span className="flex items-center text-white font-semibold">
                <Star className="w-3.5 h-3.5 fill-white text-white mr-1.5 mt-[1px]" />
                {userRating}
                <span className="ml-2 mr-0 text-white/40">•</span>
              </span>

              <span>{releaseYear}</span>
              <span className="text-white/40">•</span>

              <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold border border-white/15">
                {ratingValue}
              </span>

              <span className="text-white/40">•</span>
              <span>{runtimeDisplay}</span>

              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                4K Ultra HD
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md hidden sm:inline">
                Dolby Vision
              </span>
            </div>

            {/* Synopsis Paragraph */}
            <p className="text-[15px] md:text-[16px] text-white/70 leading-relaxed mb-6 line-clamp-3 md:line-clamp-4 font-normal max-w-xl">
              {movie.description}
            </p>

            {/* Genres separated with pipes | */}
            <div className="flex items-center flex-wrap gap-2 text-[14px] md:text-[15px] font-semibold text-white/90 mb-6">
              {genresList.map((g, idx) => (
                <span key={idx} className="flex items-center">
                  {idx > 0 && <span className="mx-2 text-white/30 font-normal">|</span>}
                  <span>{g}</span>
                </span>
              ))}
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-4 mt-2 md:mt-6">
              {/* Circular Watch Now Button */}
              <button
                type="button"
                onClick={() => handlePlayAction()}
                className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full bg-[#f9f9f9] text-black flex items-center justify-center hover:bg-white transition-all duration-300 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] focus:outline-none"
                title="Start streaming immediately"
              >
                <Play className="translate-x-[2px] w-5 h-5 md:w-6 md:h-6 fill-black" />
              </button>

              <div className="flex flex-col mr-2">
                <span className="text-white font-bold text-[17px] leading-tight">Watch Now</span>
                <span className="text-white/50 text-[13px] font-medium tracking-wide uppercase">
                  {isTv ? 'TV Series' : 'Movie'}
                </span>
              </div>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={toggleBookmark}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 ${
                  isBookmarked ? 'bg-red-600 border-red-500 text-white' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md'
                }`}
                title={isBookmarked ? "In Watchlist" : "Add to Watchlist"}
              >
                <Bookmark className={`w-4 h-4 md:w-5 md:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 ${
                  copied ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md'
                }`}
                title="Share link"
              >
                {copied ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Share2 className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Right Audio Mute & Trailer Play Toggle */}
        <div className="absolute right-6 bottom-10 md:right-12 md:bottom-20 z-20 flex items-center gap-3 pointer-events-auto">
          {isPlayingTrailer && (
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 active:scale-95"
              title={isMuted ? "Unmute Trailer" : "Mute Trailer"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          {details?.trailerKey && (
            <button
              type="button"
              onClick={() => setIsPlayingTrailer(!isPlayingTrailer)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 active:scale-95"
              title={isPlayingTrailer ? "Stop Trailer" : "Watch Trailer Preview"}
            >
              <Film className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Main Content Body (Exact bingr.one sections) ── */}
      <main className="relative z-10 px-4 md:px-16 lg:px-20 pt-8 pb-32 space-y-12 bg-black">
        
        {/* TV Series Seasons & Episodes (if applicable) */}
        {isTv && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Episodes</span>
              </h3>

              {/* Season Tabs Selector */}
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
                {Array.from({ length: seasonsCount }, (_, i) => i + 1).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSeason(s)}
                    className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedSeason === s
                        ? 'bg-white text-black shadow-lg scale-105'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    Season {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentSeasonEpisodes.map((ep) => (
                <div
                  key={ep.number}
                  onClick={() => handlePlayAction(selectedSeason, ep.number)}
                  className="group/ep relative rounded-xl overflow-hidden bg-[#12141c] border border-white/10 hover:border-white/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                    <img 
                      src={ep.thumbnail} 
                      alt={ep.title} 
                      className="w-full h-full object-cover group-hover/ep:scale-105 transition-transform duration-500 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Play Badge */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/ep:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white/80 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                      {ep.duration}
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <h4 className="text-sm font-bold text-white group-hover/ep:text-red-400 transition-colors truncate">
                      {ep.number}. {ep.title}
                    </h4>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {ep.overview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Characters & Cast Section ("Characters" / "Actors") */}
        {details?.cast && details.cast.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Cast & Characters</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  onClick={() => scrollCast('left')}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => scrollCast('right')}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div 
              ref={castScrollRef}
              className="flex space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
            >
              {details.cast.map((actor) => (
                <div 
                  key={actor.id} 
                  className="flex-none w-28 sm:w-32 flex flex-col items-center text-center group/cast"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-zinc-900 border border-white/10 group-hover/cast:border-white/40 transition-all duration-300 mb-2 shadow-lg">
                    {actor.profilePath ? (
                      <img 
                        src={actor.profilePath} 
                        alt={actor.name} 
                        className="w-full h-full object-cover group-hover/cast:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40 font-bold text-lg">
                        {actor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover/cast:text-red-400 transition-colors truncate w-full">
                    {actor.character}
                  </span>
                  <span className="text-[11px] text-white/50 truncate w-full">
                    {actor.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Collection Banner (if part of a franchise collection) */}
        {details?.collection && (
          <section className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl p-6 sm:p-8 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-6">
            {details.collection.backdropPath && (
              <img 
                src={details.collection.backdropPath} 
                alt={details.collection.name} 
                className="absolute inset-0 w-full h-full object-cover brightness-[0.25] pointer-events-none" 
              />
            )}
            <div className="relative z-10 space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-600/20 px-2.5 py-0.5 rounded-full border border-red-500/30">
                Franchise Universe
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white">
                Part of the {details.collection.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl">
                Explore every chapter and sequel in this cinematic universe in 4K multi-audio stream quality.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => handlePlayAction()}
              className="relative z-10 shrink-0 bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-xl"
            >
              Stream Full Saga
            </button>
          </section>
        )}

        {/* ── 4. "Keep Streaming" Section (Recommendation Row) ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Keep Streaming</span>
            </h3>

            <div className="flex items-center space-x-2">
              <button 
                type="button" 
                onClick={() => scrollRecs('left')}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={() => scrollRecs('right')}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={recsScrollRef}
            className="flex items-end space-x-3.5 sm:space-x-4 md:space-x-5 overflow-x-auto no-scrollbar scroll-smooth py-2"
          >
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onMovieSelect(rec)}
                className="group/card relative w-[130px] sm:w-[160px] md:w-[185px] lg:w-[200px] shrink-0 cursor-pointer flex flex-col"
              >
                <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-[#1a1c24] ring-1 ring-white/5 transition-all duration-300 group-hover/card:ring-white/20 group-hover/card:-translate-y-2 shadow-lg">
                  <img 
                    src={rec.thumbnail || rec.poster || rec.backdrop} 
                    alt={rec.title} 
                    className="w-full h-full object-cover object-center brightness-[0.92] group-hover/card:brightness-75 transition-all duration-500 pointer-events-none"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (rec.backdrop && target.src !== rec.backdrop) {
                        target.src = rec.backdrop;
                      }
                    }}
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-2 left-2 z-20 flex items-center bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-300 border border-amber-400/20">
                    <span>★ {typeof rec.userRating === 'number' ? rec.userRating.toFixed(1) : '8.0'}</span>
                  </div>

                  {/* Direct Play on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                    <div className="pointer-events-auto bg-[#E50914] hover:bg-[#b80710] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="mt-2 truncate text-[13px] sm:text-[14px] font-semibold text-white/90 tracking-tight">
                  {rec.title}
                </div>
                <div className="flex items-center mt-0.5 text-[11px] font-medium text-white/50 gap-1.5 truncate">
                  <span>{rec.year || '2026'}</span>
                  <span className="text-white/30">•</span>
                  <span className="truncate">{rec.genre?.split(',')[0] || (rec.isTv ? 'Series' : 'Movie')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. Production Details & Official Streaming Providers ── */}
        <section className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <h4 className="text-lg font-bold text-white tracking-tight">
            Movie Specifications & Streaming Availability
          </h4>

          {/* Streaming Platforms */}
          {movie.streamingSources && movie.streamingSources.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Official Watch Providers
              </span>
              <div className="flex flex-wrap gap-2">
                {movie.streamingSources.map((source, idx) => (
                  <a
                    key={`${source.source_id}-${idx}`}
                    href={source.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition active:scale-95"
                  >
                    <span>{source.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Grid of specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs border-t border-white/[0.06]">
            <div>
              <span className="text-gray-400 block mb-1">Director</span>
              <span className="text-white font-semibold">{details?.director || 'Acclaimed Filmmaker'}</span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1">Release Date</span>
              <span className="text-white font-semibold">{details?.releaseDate || `${releaseYear}`}</span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1">Status</span>
              <span className="text-white font-semibold">{details?.status || 'Released'}</span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1">Language</span>
              <span className="text-white font-semibold">{details?.originalLanguage || 'ENGLISH'}</span>
            </div>

            {details?.productionCompanies && details.productionCompanies.length > 0 && (
              <div className="col-span-2 sm:col-span-4 pt-2">
                <span className="text-gray-400 block mb-1">Production Companies</span>
                <span className="text-white font-semibold">{details.productionCompanies.join(' · ')}</span>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Stream Report & Switch Modal */}
      {showReportModal && (
        <ReportIssueModal
          isOpen={showReportModal}
          movie={movie}
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

export default MovieDetails;
