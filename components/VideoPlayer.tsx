import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ArrowLeft, Maximize, Minimize, RotateCw, ExternalLink, 
  ShieldCheck, Film, Sparkles, Tv, Play, ChevronLeft, ChevronRight, Layers, HelpCircle,
  AlertTriangle, RefreshCw, Check, Wrench
} from 'lucide-react';
import { Movie } from '../types.ts';
import { incrementMovieView } from '../services/storageService.ts';
import { saveContinueWatching } from '../services/continueWatchingService.ts';
import { 
  getMovieStreamServers, 
  getMovieTmdbId, 
  isTvOrSeries,
  StreamServer 
} from '../services/streamService.ts';
import { ReportIssueModal } from './ReportIssueModal.tsx';
import { StreamFixResult } from '../services/streamFixService.ts';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [season, setSeason] = useState<number>(movie.initialSeason || 1);
  const [episode, setEpisode] = useState<number>(movie.initialEpisode || 1);

  // Check if detected as series or user toggled series mode
  const detectedIsSeries = isTvOrSeries(movie) || !!movie.isTv || !!movie.initialSeason;
  const [forceSeriesMode, setForceSeriesMode] = useState<boolean>(detectedIsSeries);

  const [servers, setServers] = useState<StreamServer[]>(() => 
    getMovieStreamServers(movie, movie.initialSeason || 1, movie.initialEpisode || 1)
  );
  
  // Default to first server in list (Filmy priority for foreign films, AutoEmbed for Indian films)
  const [activeServerId, setActiveServerId] = useState<string>(() => {
    const list = getMovieStreamServers(movie, movie.initialSeason || 1, movie.initialEpisode || 1);
    return list[0]?.id || 'filmu-primary';
  });

  const lastMovieIdRef = useRef<string>(movie.id);
  
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showGuidePopover, setShowGuidePopover] = useState<boolean>(false);
  const [showEpisodesModal, setShowEpisodesModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [failoverNotice, setFailoverNotice] = useState<string | null>(null);

  const tmdbId = getMovieTmdbId(movie);
  const isSeries = detectedIsSeries || forceSeriesMode;

  const handleFixApplied = (result: StreamFixResult) => {
    // Instantly re-fetch stream servers with the new fix applied
    const updatedList = getMovieStreamServers(movie, season, episode);
    setServers(updatedList);
    setActiveServerId(result.preferredServerId);
    setIframeKey(k => k + 1);
    setIsLoading(true);
    setFailoverNotice(`Stream Fixed! Switched to ${result.preferredServerName}`);
    setTimeout(() => setFailoverNotice(null), 5000);
  };

  // Update servers when movie, season or episode changes
  useEffect(() => {
    const list = getMovieStreamServers(movie, season, episode);
    setServers(list);
    
    // When switching to a different movie, always prioritize the top server
    // (Filmy Server for foreign films, AutoEmbed for Indian films)
    if (lastMovieIdRef.current !== movie.id) {
      lastMovieIdRef.current = movie.id;
      setActiveServerId(list[0]?.id || 'filmu-primary');
    } else {
      // If same movie (e.g. season or episode changed), preserve user's server if still valid
      setActiveServerId(prev => {
        const exists = list.some(s => s.id === prev);
        return exists ? prev : (list[0]?.id || 'filmu-primary');
      });
    }
    
    setIframeKey(k => k + 1);
    setIsLoading(true);

    if (movie.id) {
      incrementMovieView(movie.id);
      saveContinueWatching(movie, 25, isSeries ? season : undefined, isSeries ? episode : undefined);
    }
  }, [movie, season, episode, isSeries]);

  // Track progress while watching
  useEffect(() => {
    let currentProgress = 25;
    const progressTimer = setInterval(() => {
      currentProgress = Math.min(95, currentProgress + 10);
      saveContinueWatching(movie, currentProgress, isSeries ? season : undefined, isSeries ? episode : undefined);
    }, 15000);
    return () => clearInterval(progressTimer);
  }, [movie, season, episode, isSeries]);

  // Fast auto-clear for loading state so the iframe is never obscured
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeServerId, iframeKey]);

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];
  const activeServerIndex = servers.findIndex(s => s.id === activeServer.id);
  const nextServer = servers[(activeServerIndex + 1) % servers.length];

  const handleSelectServer = (serverId: string) => {
    if (serverId !== activeServerId) {
      setActiveServerId(serverId);
      setIframeKey(k => k + 1);
      setIsLoading(true);
      setFailoverNotice(null);
    }
  };

  const handleNextServer = () => {
    if (servers.length <= 1) return;
    const nextIdx = (activeServerIndex + 1) % servers.length;
    const target = servers[nextIdx];
    handleSelectServer(target.id);
    setFailoverNotice(`Switched to ${target.name}`);
    setTimeout(() => setFailoverNotice(null), 4000);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(k => k + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(console.error);
      setIsFullscreen(false);
    }
  };

  // Keyboard controls (Esc to close, F to fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          onClose();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrevEpisode = () => {
    if (episode > 1) {
      setEpisode(prev => prev - 1);
    } else if (season > 1) {
      setSeason(prev => prev - 1);
      setEpisode(1);
    }
  };

  const handleNextEpisode = () => {
    setEpisode(prev => prev + 1);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-between select-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* Toast Alert for server switches */}
      {failoverNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[80] bg-amber-500 text-black px-4 py-1.5 rounded-full font-black text-xs shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 border border-amber-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-black fill-black" />
          <span>{failoverNotice}</span>
        </div>
      )}

      {/* 1. Sleek Top Bar with Back, Title, Server Selectors, and Controls */}
      <header className="w-full bg-zinc-950/95 px-2.5 sm:px-6 py-2 sm:py-2.5 z-50 flex flex-wrap items-center justify-between gap-1.5 sm:gap-3 border-b border-white/10 backdrop-blur-md">
        {/* Left: Back Button & Movie Metadata */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="flex items-center space-x-1 bg-white/10 hover:bg-red-600 text-white font-bold px-2.5 py-1.5 rounded-full text-xs sm:text-sm transition-all active:scale-95 shadow-md"
            title="Return to library"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="truncate max-w-[110px] xs:max-w-[150px] sm:max-w-xs md:max-w-md">
            <div className="flex items-center space-x-1.5">
              <h1 className="text-xs sm:text-base font-black text-white tracking-tight uppercase truncate">
                {movie.title}
              </h1>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-600/30 text-red-400 border border-red-500/40 hidden md:inline">
                ID: {tmdbId}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs text-gray-400 font-medium truncate">
              <span>{movie.year}</span>
              <span>·</span>
              <span className="truncate">{movie.genre}</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">{activeServer.quality}</span>
            </div>
          </div>
        </div>

        {/* Center: Server Switcher Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
          {servers.map((s) => {
            const isActive = s.id === activeServer.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectServer(s.id)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm whitespace-nowrap active:scale-95 shrink-0 ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-red-600/40 border border-red-400 ring-2 ring-red-500/40 scale-105' 
                    : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10'
                }`}
                title={s.description}
              >
                {s.id.includes('autoembed') ? (
                  <Layers className="w-3 h-3 text-emerald-400" />
                ) : s.id.includes('twoembed') ? (
                  <Play className="w-3 h-3 text-fuchsia-400" />
                ) : s.id.includes('vidsrc') ? (
                  <Film className="w-3 h-3 text-indigo-400" />
                ) : s.id.includes('filmu') ? (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                ) : s.id.includes('cinesrc') ? (
                  <Play className="w-3 h-3 text-cyan-400" />
                ) : s.id.includes('codespecters') ? (
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                ) : (
                  <Film className="w-3 h-3 text-gray-300" />
                )}
                <span>{s.name}</span>
                {s.badge && (
                  <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded uppercase font-bold hidden sm:inline ${
                    isActive ? 'bg-black/40 text-white' : 'bg-black/30 text-gray-400'
                  }`}>
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Next Server, Episodes, Guide, Fullscreen, Close */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          {/* Quick Switch Server Button */}
          <button
            type="button"
            onClick={handleNextServer}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition shadow-sm active:scale-95"
            title="Try next stream server if current is slow or buffering"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden xs:inline">Next Server</span>
          </button>

          {/* Instant Stream Fix / Report Button */}
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 transition shadow-sm active:scale-95"
            title="Report if this movie is not playing or wrong movie, and fix immediately"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden xs:inline">Report / Fix</span>
          </button>

          {/* TV Episodes Toggle */}
          <button
            type="button"
            onClick={() => {
              setForceSeriesMode(true);
              setShowEpisodesModal(true);
            }}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border transition ${
              isSeries 
                ? 'bg-purple-600/30 border-purple-500/50 text-purple-200 hover:bg-purple-600/50' 
                : 'bg-white/10 border-white/15 text-gray-300 hover:text-white'
            }`}
            title="Select Season & Episode"
          >
            <Tv className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xs:inline">Episodes</span>
            {isSeries && (
              <span className="text-[9px] font-mono bg-purple-900/60 px-1 rounded text-purple-200">
                S{season}:E{episode}
              </span>
            )}
          </button>

          {/* Guide Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowGuidePopover(!showGuidePopover)}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
              title="Stream server info"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </button>

            {showGuidePopover && (
              <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:mt-2 sm:w-84 bg-zinc-950/98 border border-white/15 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5 font-black text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Stream Servers Available</span>
                  </div>
                  <button 
                    onClick={() => setShowGuidePopover(false)} 
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-[11px] text-gray-300 leading-relaxed">
                  <div className="p-2 bg-red-600/10 rounded-xl border border-red-500/30 text-red-200">
                    <span className="font-bold block mb-0.5 text-red-300">⭐ Filmy Server (1st Priority):</span>
                    Multi-audio stream with Hindi audio, subtitles, and instant server switcher.
                  </div>

                  <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-200">
                    <span className="text-emerald-300 font-bold block mb-0.5">⚡ AutoEmbed Mirror (player.autoembed.co):</span>
                    Fast verified 4K mirror with instant playback for movies and TV episodes.
                  </div>

                  <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-200">
                    <span className="text-amber-300 font-bold block mb-0.5">🇮🇳 CineSrc 4K:</span>
                    Fast 4K playback mirror with multi-audio and episodic TV support.
                  </div>

                  <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-200">
                    <span className="text-indigo-300 font-bold block mb-0.5">🌐 VidSrc Ultra:</span>
                    Ultra-reliable global backup player with zero buffering.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reload Stream */}
          <button
            type="button"
            onClick={handleReload}
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
            title="Reload stream"
          >
            <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
            title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Close Player */}
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-red-600 text-gray-300 hover:text-white transition"
            title="Close Player"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </header>

      {/* TV Series Season & Episode Sub-bar */}
      {isSeries && (
        <div className="w-full bg-zinc-950/95 border-b border-white/10 px-2.5 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 z-40 text-xs shadow-md">
          {/* Left: Season & Episode dropdowns directly on bar */}
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar py-0.5">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px] hidden xs:inline">
              Select:
            </span>
            
            {/* Season Selector Dropdown */}
            <div className="flex items-center space-x-1 shrink-0">
              <span className="text-gray-400 text-[11px] font-semibold">Season</span>
              <select
                value={season}
                onChange={(e) => {
                  setSeason(Number(e.target.value));
                  setEpisode(1);
                }}
                className="bg-zinc-800 border border-white/20 rounded-lg px-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(sNum => (
                  <option key={sNum} value={sNum}>Season {sNum}</option>
                ))}
              </select>
            </div>

            {/* Episode Selector Dropdown */}
            <div className="flex items-center space-x-1 shrink-0">
              <span className="text-gray-400 text-[11px] font-semibold">Episode</span>
              <select
                value={episode}
                onChange={(e) => {
                  setEpisode(Number(e.target.value));
                }}
                className="bg-zinc-800 border border-white/20 rounded-lg px-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {Array.from({ length: 35 }, (_, i) => i + 1).map(epNum => (
                  <option key={epNum} value={epNum}>Episode {epNum}</option>
                ))}
              </select>
            </div>

            {/* "Select Episode" Grid Button */}
            <button
              type="button"
              onClick={() => setShowEpisodesModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-lg font-bold text-[11px] transition shrink-0 active:scale-95"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Episode Grid</span>
            </button>
          </div>

          {/* Right: Prev & Next Episode Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={handlePrevEpisode}
              disabled={season === 1 && episode === 1}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none rounded-lg text-xs font-semibold text-gray-200 transition"
              title="Previous Episode"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30 text-xs shadow-inner">
              S{season}:E{episode}
            </span>

            <button
              onClick={handleNextEpisode}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold text-gray-200 transition"
              title="Next Episode"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Episode Selection Modal */}
      {showEpisodesModal && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#181818] border border-white/15 w-full sm:max-w-2xl max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/90">
              <div className="flex items-center space-x-2">
                <div className="bg-red-600/20 p-2 rounded-xl border border-red-500/30">
                  <Tv className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white uppercase tracking-tight">
                    Select Episode • {movie.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Currently streaming Season {season}, Episode {episode}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEpisodesModal(false)}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Season Selector Tabs */}
            <div className="p-3 sm:p-4 border-b border-white/5 bg-zinc-950/60 overflow-x-auto no-scrollbar">
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sNum => (
                  <button
                    key={sNum}
                    onClick={() => {
                      setSeason(sNum);
                      setEpisode(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      season === sNum 
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                        : 'bg-zinc-800/80 hover:bg-zinc-700 text-gray-300'
                    }`}
                  >
                    Season {sNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Season {season} Episodes
                </span>
                <span className="text-[11px] text-amber-400 font-bold">
                  Tap any episode to watch instantly
                </span>
              </div>

              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {Array.from({ length: 24 }, (_, i) => i + 1).map(epNum => {
                  const isCurrent = episode === epNum;
                  return (
                    <button
                      key={epNum}
                      onClick={() => {
                        setEpisode(epNum);
                        setShowEpisodesModal(false);
                      }}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 active:scale-95 group ${
                        isCurrent 
                          ? 'bg-gradient-to-b from-red-600 to-red-700 border-red-400 text-white shadow-lg ring-2 ring-red-400/40' 
                          : 'bg-zinc-800/60 hover:bg-zinc-700/80 border-white/10 text-gray-200 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        {isCurrent ? (
                          <Check className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Play className="w-3 h-3 text-red-500 group-hover:scale-110 transition" />
                        )}
                        <span className="text-xs font-black">
                          Ep {epNum}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium">
                        S{season}:E{epNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-zinc-900 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Playing on: <strong className="text-white">{activeServer.name}</strong>
              </span>
              <button
                onClick={() => setShowEpisodesModal(false)}
                className="px-4 py-1.5 bg-white text-black font-bold rounded-xl text-xs hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Streaming Canvas Area */}
      <main className="w-full flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {/* Subtle, Non-blocking Loading Banner (Never blocks user interactions or clicks) */}
        {isLoading && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 flex items-center space-x-2 text-xs font-bold text-gray-200 animate-in fade-in duration-200 shadow-xl">
            <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading {activeServer.name}...</span>
          </div>
        )}

        {/* Video Player Render - Standard Iframe with full permissions */}
        {activeServer.type === 'video' ? (
          <video 
            key={`${activeServer.url}-${iframeKey}`}
            src={activeServer.url}
            controls
            autoPlay
            playsInline
            onLoadedData={() => setIsLoading(false)}
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe 
            key={`${activeServer.url}-${iframeKey}`}
            src={activeServer.url}
            title={activeServer.name}
            className="w-full h-full border-0 absolute inset-0 z-10"
            allowFullScreen
            referrerPolicy="origin"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; display-capture; clipboard-write;"
            onLoad={() => setIsLoading(false)}
          />
        )}
      </main>

      {/* 3. Bottom Information Bar */}
      <footer className="w-full bg-zinc-950/95 px-3 sm:px-6 py-2 z-40 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-gray-400 border-t border-white/5">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-gray-200">
            {activeServer.name}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-emerald-400 font-semibold">{activeServer.quality}</span>
          {isSeries && (
            <>
              <span className="text-gray-500">•</span>
              <span className="text-amber-400 font-mono font-bold">
                S{season}:E{episode}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="text-red-400 hover:text-red-300 font-bold bg-red-600/10 hover:bg-red-600/20 px-2.5 py-1 rounded-full border border-red-500/20 flex items-center space-x-1 transition active:scale-95"
            title="Report if this movie is not playing or wrong movie"
          >
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>Report / Fix Stream</span>
          </button>

          <button
            type="button"
            onClick={handleNextServer}
            className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center space-x-1"
          >
            <span>Not playing? Switch server</span>
          </button>

          <a 
            href={activeServer.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white flex items-center space-x-1 text-gray-300 underline underline-offset-2"
            title="Open direct embed in a new browser tab"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>

      {/* Instant Stream Fix & Report Modal */}
      <ReportIssueModal
        isOpen={showReportModal}
        movie={movie}
        currentServerId={activeServer.id}
        currentServerName={activeServer.name}
        season={season}
        episode={episode}
        onClose={() => setShowReportModal(false)}
        onFixApplied={handleFixApplied}
      />
    </div>
  );
};

export default VideoPlayer;
