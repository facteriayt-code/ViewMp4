import React, { useState, useEffect } from 'react';
import { 
  Play, Plus, Check, X, ArrowLeft, Star, Volume2, VolumeX, Share2, 
  Sparkles, Clock, Tv, ThumbsUp, ChevronDown, CheckCircle2
} from 'lucide-react';
import { Movie } from '../types.ts';
import { PlatformId, PLATFORMS } from '../services/platformCatalog.ts';
import { isTvOrSeries } from '../services/streamService.ts';
import { fetchSeasonEpisodes, TvEpisode, getUniqueEpisodeThumbnail } from '../services/watchmodeService.ts';

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
  const [isAddedToList, setIsAddedToList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const isTv = isTvOrSeries(movie) || !!movie.isTv;
  const [selectedSeason, setSelectedSeason] = useState<number>(movie.initialSeason || 1);
  const [episodes, setEpisodes] = useState<TvEpisode[]>(() => {
    if (!isTv) return [];
    return Array.from({ length: 8 }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
      duration: `${45 + (i * 3) % 15}m`,
      overview: `A thrilling chapter unfolds with high stakes in season ${selectedSeason}, episode ${i + 1}.`,
      thumbnail: getUniqueEpisodeThumbnail(movie.title, selectedSeason, i + 1)
    }));
  });
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  // Load watchlist state
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`watchlist_${platformId}`) || '[]');
      setIsAddedToList(saved.includes(movie.id));
    } catch {
      setIsAddedToList(false);
    }
  }, [movie.id, platformId]);

  const toggleWatchlist = () => {
    try {
      const key = `watchlist_${platformId}`;
      const saved: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      let updated: string[];
      if (saved.includes(movie.id)) {
        updated = saved.filter(id => id !== movie.id);
        setIsAddedToList(false);
      } else {
        updated = [...saved, movie.id];
        setIsAddedToList(true);
      }
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
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

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
  const matchPercentage = Math.min(99, Math.max(85, Math.round((movie.userRating || 8.0) * 10 + (movie.title.length % 8))));

  // ─────────────────────────────────────────────────────────────
  // 1. NETFLIX REPLICA MOVIE DETAIL MODAL
  // ─────────────────────────────────────────────────────────────
  if (platformId === 'netflix') {
    return (
      <div 
        className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-4xl bg-[#181818] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-auto text-white select-none animate-in zoom-in-95 duration-200 max-h-[96vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button (Netflix round dark circle) */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-[#181818]/80 hover:bg-[#181818] border border-white/20 text-white flex items-center justify-center transition active:scale-90"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 no-scrollbar">
            {/* Netflix Hero Banner Header with Preview Image */}
            <div className="relative aspect-video w-full max-h-[440px] bg-black">
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/80 via-transparent to-transparent" />

              {/* Top Netflix Original Ribbon */}
              <div className="absolute top-4 left-4 sm:left-8 z-10 flex items-center space-x-2">
                <span className="font-royal text-red-600 font-black text-2xl tracking-tighter">N</span>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-200">
                  {isTv ? 'SERIES' : 'FILM'}
                </span>
              </div>

              {/* Title & Quick Actions on Hero Banner */}
              <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 space-y-3 z-10">
                <h1 className="font-royal text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white drop-shadow-xl tracking-tight leading-none">
                  {movie.title}
                </h1>

                <div className="flex items-center space-x-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onPlay(movie, selectedSeason, 1)}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white hover:bg-gray-200 text-black font-black text-sm sm:text-base rounded-md flex items-center transition active:scale-95 shadow-xl"
                  >
                    <Play className="w-5 h-5 fill-black mr-2" />
                    <span>Play</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleWatchlist}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/40 hover:border-white bg-black/40 text-white flex items-center justify-center transition active:scale-90"
                    title={isAddedToList ? 'Remove from My List' : 'Add to My List'}
                  >
                    {isAddedToList ? <Check className="w-5 h-5 text-green-400" /> : <Plus className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/40 hover:border-white bg-black/40 flex items-center justify-center transition active:scale-90 ${
                      isLiked ? 'text-red-500 border-red-500' : 'text-white'
                    }`}
                    title="Rate this title"
                  >
                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/40 hover:border-white bg-black/40 text-white flex items-center justify-center transition active:scale-90"
                    title="Share title link"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  {copied && (
                    <span className="text-xs text-green-400 font-bold animate-in fade-in">Link copied!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Netflix Metadata & Synopsis Two-Column Body */}
            <div className="p-4 sm:p-8 space-y-8 bg-[#181818]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left 2 cols: Badges & Description */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
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

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                {/* Right col: Cast, Genres, Mood tags */}
                <div className="space-y-3 text-xs text-gray-400">
                  <div>
                    <span className="text-gray-500">Cast: </span>
                    <span className="text-gray-200">Top Hollywood Ensemble, Award-winning cast</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Genres: </span>
                    <span className="text-gray-200">{movie.genre || 'Action, Thriller, Blockbuster'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">This show is: </span>
                    <span className="text-gray-200">Suspenseful, Gritty, Mind-Bending</span>
                  </div>
                </div>
              </div>

              {/* Netflix TV Series Episodes Section with Season Dropdown */}
              {isTv && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-black text-white">Episodes</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 font-semibold">Season:</span>
                      <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        className="bg-black/60 border border-white/20 text-white rounded-md px-3 py-1 text-xs font-bold focus:outline-none focus:border-red-600"
                      >
                        {[1, 2, 3].map(s => (
                          <option key={s} value={s} className="bg-zinc-900 text-white">
                            Season {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {isLoadingEpisodes ? (
                    <div className="py-8 text-center text-gray-500 text-xs">Loading season episodes...</div>
                  ) : (
                    <div className="space-y-3">
                      {episodes.map((ep) => (
                        <div
                          key={ep.number}
                          onClick={() => onPlay(movie, selectedSeason, ep.number)}
                          className="flex items-center p-3 sm:p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition cursor-pointer group border border-transparent hover:border-white/15"
                        >
                          <span className="w-8 text-base font-black text-gray-400 group-hover:text-white shrink-0">
                            {ep.number}
                          </span>

                          <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-900 mr-3 sm:mr-4 border border-white/10">
                            <img
                              src={ep.thumbnail}
                              alt={ep.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                              <Play className="w-6 h-6 fill-white text-white" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-white group-hover:text-red-500 transition truncate">
                                {ep.title}
                              </h4>
                              <span className="text-xs text-gray-400 shrink-0 ml-2">{ep.duration}</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                              {ep.overview}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* More Like This (Netflix 3-column cards) */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-lg sm:text-xl font-black text-white">More Like This</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => onSelectMovie(rec)}
                      className="group cursor-pointer rounded-lg overflow-hidden bg-[#242424] border border-white/5 hover:border-white/20 transition flex flex-col"
                    >
                      <div className="relative aspect-video w-full bg-zinc-900">
                        <img
                          src={rec.backdrop || rec.thumbnail}
                          alt={rec.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2 right-2 text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded">
                          {rec.year || 2024}
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-emerald-400 font-bold">96% Match</span>
                          <span className="text-[10px] text-gray-400 border border-white/20 px-1 rounded">HD</span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-red-500 transition truncate">
                          {rec.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
        className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 font-sans"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-4xl bg-[#0b121e] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-[#00a8e1]/20 my-auto text-white select-none animate-in zoom-in-95 duration-200 max-h-[96vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-[#0b121e]/80 hover:bg-[#00a8e1]/30 border border-white/20 text-white flex items-center justify-center transition active:scale-90"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 no-scrollbar">
            {/* Prime Hero Backdrop with Cyan Lighting */}
            <div className="relative aspect-video w-full max-h-[420px] bg-black">
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b121e] via-[#0b121e]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b121e]/90 via-transparent to-transparent" />

              {/* Prime Badge */}
              <div className="absolute top-4 left-4 sm:left-8 z-10 flex items-center space-x-2">
                <span className="bg-[#00a8e1] text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider">
                  prime
                </span>
                <span className="text-[11px] font-bold text-gray-200 uppercase tracking-widest">
                  Included with Prime
                </span>
              </div>

              {/* Title & Prime Actions */}
              <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 space-y-3 z-10">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onPlay(movie, selectedSeason, 1)}
                    className="px-6 sm:px-8 py-3 bg-[#00a8e1] hover:bg-[#0092c4] text-black font-black text-sm rounded-md flex items-center transition active:scale-95 shadow-xl shadow-[#00a8e1]/30"
                  >
                    <Play className="w-5 h-5 fill-black mr-2" />
                    <span>Watch with Prime</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleWatchlist}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-md flex items-center transition active:scale-95 border border-white/20"
                  >
                    {isAddedToList ? <Check className="w-4 h-4 mr-1.5 text-[#00a8e1]" /> : <Plus className="w-4 h-4 mr-1.5" />}
                    <span>{isAddedToList ? 'In Watchlist' : 'Watchlist'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-md transition active:scale-90 border border-white/20"
                    title="Share title"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prime Details & X-Ray Row */}
            <div className="p-4 sm:p-8 space-y-6 bg-[#0b121e]">
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
                <span className="bg-amber-400 text-black px-2 py-0.5 rounded font-black text-[11px]">
                  IMDb 8.5
                </span>
                <span>{releaseYear}</span>
                <span className="border border-white/30 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                  {ratingText}
                </span>
                <span>{isTv ? `${selectedSeason} Seasons` : '2h 18m'}</span>
                <span className="bg-[#00a8e1]/20 text-[#00a8e1] border border-[#00a8e1]/30 px-2 py-0.5 rounded font-bold text-[10px]">
                  UHD · HDR
                </span>
                <span className="text-gray-400">Audio: English [Original], Hindi, Español</span>
              </div>

              {/* Prime X-Ray Feature Callout */}
              <div className="p-3 bg-[#0f1b2d] rounded-xl border border-[#00a8e1]/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-[#00a8e1] tracking-wider uppercase">X-Ray</span>
                  <span className="text-xs text-gray-300">Includes In-Scene Cast, Music trivia & Bonus Content</span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Prime Exclusive</span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
                {movie.description}
              </p>

              {/* Prime Episodes Section */}
              {isTv && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Episodes</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Season:</span>
                      <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        className="bg-[#0f1b2d] border border-[#00a8e1]/30 text-white rounded px-3 py-1 text-xs font-bold focus:outline-none"
                      >
                        {[1, 2, 3].map(s => (
                          <option key={s} value={s} className="bg-zinc-900 text-white">
                            Season {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {episodes.map(ep => (
                      <div
                        key={ep.number}
                        onClick={() => onPlay(movie, selectedSeason, ep.number)}
                        className="flex items-center p-3 rounded-xl bg-[#0f1b2d]/60 hover:bg-[#0f1b2d] border border-white/5 hover:border-[#00a8e1]/30 transition cursor-pointer group"
                      >
                        <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-900 mr-4">
                          <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <Play className="w-6 h-6 fill-[#00a8e1] text-[#00a8e1]" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white group-hover:text-[#00a8e1] transition truncate">
                              {ep.number}. {ep.title}
                            </h4>
                            <span className="text-xs text-gray-400">{ep.duration}</span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1">{ep.overview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prime Customers Also Watched */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-base font-bold text-white">Customers Also Watched</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recommendations.slice(0, 4).map(rec => (
                    <div
                      key={rec.id}
                      onClick={() => onSelectMovie(rec)}
                      className="group cursor-pointer rounded-lg overflow-hidden bg-[#0f1b2d] border border-white/5 hover:border-[#00a8e1]/40 transition"
                    >
                      <div className="aspect-video w-full bg-zinc-900 relative">
                        <img src={rec.backdrop || rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-[#00a8e1] transition">
                          {rec.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
        className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-4xl bg-[#040714] rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-blue-500/20 my-auto text-white select-none animate-in zoom-in-95 duration-200 max-h-[96vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-90"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 no-scrollbar">
            <div className="relative aspect-video w-full max-h-[420px] bg-black">
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-[#040714]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#040714]/90 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 sm:left-8 z-10">
                <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                  Disney+ Exclusive
                </span>
              </div>

              <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 space-y-3 z-10">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-xl tracking-tight uppercase">
                  {movie.title}
                </h1>

                <div className="flex items-center space-x-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onPlay(movie, selectedSeason, 1)}
                    className="px-7 sm:px-9 py-3 bg-white hover:bg-gray-200 text-black font-black text-sm uppercase tracking-wider rounded-md flex items-center transition active:scale-95 shadow-xl"
                  >
                    <Play className="w-5 h-5 fill-black mr-2" />
                    <span>Play</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleWatchlist}
                    className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white flex items-center justify-center transition active:scale-90"
                    title={isAddedToList ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    {isAddedToList ? <Check className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white flex items-center justify-center transition active:scale-90"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-6 bg-[#040714]">
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
                <span className="border border-white/30 px-1.5 py-0.5 rounded text-[10px] font-bold">{ratingText}</span>
                <span>{releaseYear}</span>
                <span>{isTv ? `${selectedSeason} Seasons` : '2h 10m'}</span>
                <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">4K Ultra HD</span>
                <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">IMAX Enhanced</span>
                <span className="text-blue-400 font-bold">Dolby Vision</span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
                {movie.description}
              </p>

              {isTv && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Episodes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {episodes.map(ep => (
                      <div
                        key={ep.number}
                        onClick={() => onPlay(movie, selectedSeason, ep.number)}
                        className="flex items-center p-3 rounded-xl bg-white/[0.04] hover:bg-blue-600/15 border border-white/10 hover:border-blue-500/40 transition cursor-pointer group"
                      >
                        <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-zinc-900 mr-3">
                          <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <Play className="w-5 h-5 fill-white text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition truncate">
                            {ep.number}. {ep.title}
                          </h4>
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
  }

  // ─────────────────────────────────────────────────────────────
  // 4. APPLE TV+, MAX & HULU REPLICA DETAIL MODAL (Tailored Themes)
  // ─────────────────────────────────────────────────────────────
  const isApple = platformId === 'appletv';
  const isMax = platformId === 'max';
  const isHulu = platformId === 'hulu';

  const brandAccentBg = isApple 
    ? 'bg-white hover:bg-gray-200 text-black' 
    : isMax 
      ? 'bg-[#7b2cbf] hover:bg-[#6821a3] text-white shadow-[#7b2cbf]/40' 
      : 'bg-[#1ce783] hover:bg-[#16bf6b] text-black shadow-[#1ce783]/30';

  const brandPillBadge = isApple 
    ? 'Apple Original' 
    : isMax 
      ? 'Max Original' 
      : 'Hulu Original';

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 font-sans"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-4xl rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-auto text-white select-none animate-in zoom-in-95 duration-200 max-h-[96vh] flex flex-col ${
          isApple ? 'bg-[#161617]/95 backdrop-blur-3xl' : isMax ? 'bg-[#0d081f]' : 'bg-[#0b0c0e]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-90"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 no-scrollbar">
          <div className="relative aspect-video w-full max-h-[420px] bg-black">
            <img
              src={movie.backdrop || movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 sm:left-8 z-10">
              <span className="bg-white/15 backdrop-blur-md text-white border border-white/25 text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider">
                {brandPillBadge}
              </span>
            </div>

            <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 space-y-3 z-10">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight">
                {movie.title}
              </h1>

              <div className="flex items-center space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => onPlay(movie, selectedSeason, 1)}
                  className={`px-7 sm:px-9 py-3 font-black text-sm rounded-full flex items-center transition active:scale-95 shadow-xl ${brandAccentBg}`}
                >
                  <Play className="w-5 h-5 fill-current mr-2" />
                  <span>Stream Now</span>
                </button>

                <button
                  type="button"
                  onClick={toggleWatchlist}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-90"
                  title="Watchlist"
                >
                  {isAddedToList ? <Check className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-90"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
              <span className="border border-white/30 px-1.5 py-0.5 rounded text-[10px] font-bold">{ratingText}</span>
              <span>{releaseYear}</span>
              <span>{isTv ? `${selectedSeason} Seasons` : '2h 15m'}</span>
              <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">4K Dolby Vision</span>
              <span className="border border-white/20 px-1.5 py-0.5 rounded text-[10px] font-bold">Dolby Atmos</span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
              {movie.description}
            </p>

            {isTv && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-lg font-bold text-white">Episodes</h3>
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
