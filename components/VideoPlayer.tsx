import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ArrowLeft, Maximize, Minimize, RotateCw, ExternalLink, 
  ShieldCheck, Film, Sparkles, Tv, Play, ChevronLeft, ChevronRight, Layers, HelpCircle,
  AlertTriangle, RefreshCw, Check
} from 'lucide-react';
import { Movie } from '../types.ts';
import { incrementMovieView } from '../services/storageService.ts';
import { 
  getMovieStreamServers, 
  getMovieTmdbId, 
  isTvOrSeries,
  StreamServer 
} from '../services/streamService.ts';

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
  
  // Filmy server is prioritized FIRST by default ('filmu-primary')
  const [activeServerId, setActiveServerId] = useState<string>(() => {
    const list = getMovieStreamServers(movie, movie.initialSeason || 1, movie.initialEpisode || 1);
    const filmy = list.find(s => s.id === 'filmu-primary');
    return filmy ? filmy.id : (list[0]?.id || 'filmu-primary');
  });
  
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showGuidePopover, setShowGuidePopover] = useState<boolean>(false);
  const [showEpisodesModal, setShowEpisodesModal] = useState<boolean>(false);
  const [failoverNotice, setFailoverNotice] = useState<string | null>(null);

  const tmdbId = getMovieTmdbId(movie);
  const isSeries = detectedIsSeries || forceSeriesMode;
  const failoverTimeoutRef = useRef<number | null>(null);

  // Update servers when movie, season or episode changes
  useEffect(() => {
    const list = getMovieStreamServers(movie, season, episode);
    setServers(list);
    
    // Always prioritize Filmy server
    const preferredFilmy = list.find(s => s.id === 'filmu-primary');
    setActiveServerId(preferredFilmy ? preferredFilmy.id : (list[0]?.id || 'filmu-primary'));
    
    setIframeKey(prev => prev + 1);
    setIsLoading(true);
    setFailoverNotice(null);

    if (movie.id) {
      incrementMovieView(movie.id);
    }
  }, [movie, season, episode]);

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];
  const activeServerIndex = servers.findIndex(s => s.id === activeServer.id);
  const nextServer = servers[(activeServerIndex + 1) % servers.length];

  // Smart Auto-Failover: If current server fails or is unavailable, try next server
  const handleAutoFailover = (reason?: string) => {
    if (servers.length <= 1) return;
    const nextIdx = (activeServerIndex + 1) % servers.length;
    const target = servers[nextIdx];
    
    const message = reason || `${activeServer.name} did not connect. Trying ${target.name}...`;
    setFailoverNotice(message);
    setActiveServerId(target.id);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);

    setTimeout(() => {
      setFailoverNotice(null);
    }, 5000);
  };

  // 10-Second Watchdog Timer for automatic server failover
  useEffect(() => {
    if (failoverTimeoutRef.current) {
      window.clearTimeout(failoverTimeoutRef.current);
    }

    if (isLoading) {
      failoverTimeoutRef.current = window.setTimeout(() => {
        handleAutoFailover(`${activeServer.name} connection timed out. Automatically trying ${nextServer.name}...`);
      }, 10000);
    }

    return () => {
      if (failoverTimeoutRef.current) {
        window.clearTimeout(failoverTimeoutRef.current);
      }
    };
  }, [isLoading, activeServerId]);

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
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

  // Prevent unwanted tab hijacking / redirect attempts
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = '');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handlePrevEpisode = () => {
    if (episode > 1) {
      setEpisode(prev => prev - 1);
      setIsLoading(true);
    } else if (season > 1) {
      setSeason(prev => prev - 1);
      setEpisode(1);
      setIsLoading(true);
    }
  };

  const handleNextEpisode = () => {
    setEpisode(prev => prev + 1);
    setIsLoading(true);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-between select-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* Failover Toast Alert */}
      {failoverNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[80] bg-amber-500/90 text-black px-4 py-2 rounded-full font-black text-xs shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 border border-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0 text-black fill-black" />
          <span>{failoverNotice}</span>
        </div>
      )}

      {/* 1. Sleek Top Bar with Back, Title, Server Selectors, and Controls */}
      <header className="w-full bg-gradient-to-b from-black via-zinc-950/95 to-transparent px-2.5 sm:px-6 py-2 sm:py-3 z-50 flex flex-wrap items-center justify-between gap-1.5 sm:gap-3 border-b border-white/10 backdrop-blur-md">
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
                TMDb {tmdbId}
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

        {/* Center: Server Switcher (Prioritizes Filmy Server First) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
          {servers.map((s) => {
            const isActive = s.id === activeServer.id;
            const isFilmy = s.id === 'filmu-primary' || s.isFilmu;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (s.id !== activeServer.id) {
                    setActiveServerId(s.id);
                    setIsLoading(true);
                    setFailoverNotice(null);
                  }
                }}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm whitespace-nowrap active:scale-95 shrink-0 ${
                  isActive 
                    ? isFilmy
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border border-amber-300 ring-2 ring-red-500/50 scale-105 shadow-lg'
                      : s.isHindi 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black border border-amber-300 ring-2 ring-amber-400/40 scale-105' 
                        : 'bg-red-600 text-white shadow-red-600/40 border border-red-500 ring-2 ring-red-500/30 scale-105' 
                    : isFilmy
                      ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 font-bold'
                      : s.isHindi 
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10'
                }`}
                title={s.description}
              >
                {isFilmy ? (
                  <span className="text-[9px] font-black bg-black/40 text-amber-200 px-1 py-0.2 rounded uppercase">
                    ⭐ Filmy #1
                  </span>
                ) : s.isHindi ? (
                  <span className="text-[9px] font-black bg-black/40 text-amber-200 px-1 py-0.2 rounded uppercase">
                    🇮🇳 Hindi 4K
                  </span>
                ) : s.id.includes('codespecters') ? (
                  <ShieldCheck className="w-3 h-3 text-cyan-300" />
                ) : s.id.includes('trailer') ? (
                  <Film className="w-3 h-3 text-blue-400" />
                ) : s.id.includes('autoembed') ? (
                  <Layers className="w-3 h-3 text-emerald-400" />
                ) : s.id.includes('tv') ? (
                  <Tv className="w-3 h-3 text-purple-400" />
                ) : (
                  <Play className="w-3 h-3 text-green-400" />
                )}
                <span>{s.name}</span>
                {isActive && s.badge && (
                  <span className="text-[8px] sm:text-[9px] bg-black/30 px-1.5 py-0.2 rounded uppercase font-bold hidden sm:inline">
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Episodes Toggle, Server Guide, Reload, Fullscreen, Close */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Option to toggle TV Episodes bar for any show */}
          <button
            type="button"
            onClick={() => {
              setForceSeriesMode(!forceSeriesMode);
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
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/15 transition shadow-sm"
              title="Player servers & Hindi audio guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Servers</span>
            </button>

            {showGuidePopover && (
              <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:mt-2 sm:w-84 bg-zinc-950/98 border border-white/15 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5 font-black text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Prioritized Servers Guide</span>
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
                    <span className="font-bold block mb-0.5 text-red-300">⭐ Filmy Server (1st Priority Active):</span>
                    Automatically connects to Filmy server (`embed.filmu.in`) first with multi-audio, Hindi audio, and instant subtitle selection.
                  </div>

                  <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-200">
                    <span className="text-amber-300 font-bold block mb-0.5">🇮🇳 CineSrc 4K (2nd Priority):</span>
                    High-speed backup server with multi-audio and Hindi support.
                  </div>

                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-cyan-300 font-bold block mb-0.5">CodeSpecters (nx_ Key):</span>
                    Direct stream verified through official CodeSpecters API key.
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleReload}
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
            title="Reload video stream"
          >
            <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
            title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

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

      {/* TV Series Season & Episode Bar */}
      {isSeries && (
        <div className="w-full bg-zinc-950/95 border-b border-white/10 px-2.5 sm:px-6 py-1.5 sm:py-2 flex flex-wrap items-center justify-between gap-2 z-40 text-xs shadow-md">
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
                  setIsLoading(true);
                }}
                className="bg-zinc-800 border border-white/20 rounded-lg px-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(sNum => (
                  <option key={sNum} value={sNum}>Season {sNum}</option>
                ))}
              </select>
            </div>

            {/* Episode Selector Dropdown (Accessible on all devices including smartphones) */}
            <div className="flex items-center space-x-1 shrink-0">
              <span className="text-gray-400 text-[11px] font-semibold">Episode</span>
              <select
                value={episode}
                onChange={(e) => {
                  setEpisode(Number(e.target.value));
                  setIsLoading(true);
                }}
                className="bg-zinc-800 border border-white/20 rounded-lg px-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map(epNum => (
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

      {/* Episode Selection Modal / Drawer */}
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
                      setIsLoading(true);
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
                        setIsLoading(true);
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
        {/* Loading Spinner with Auto-Failover Information */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm pointer-events-auto p-4 space-y-3.5">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-red-500 border-t-amber-400 rounded-full animate-spin shadow-lg shadow-red-500/30" />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-amber-300">
                ⭐
              </span>
            </div>

            <div className="text-center space-y-1 max-w-sm">
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] text-white block">
                Connecting to {activeServer.name}...
              </span>
              <p className="text-[11px] text-gray-400">
                {activeServer.id === 'filmu-primary' 
                  ? 'Priority Filmy Server active • Auto-detecting multi-audio & subtitles' 
                  : 'Fast streaming mirror active • Auto failover enabled'}
              </p>
              {isSeries && (
                <span className="inline-block bg-purple-600/30 text-purple-200 border border-purple-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full mt-1">
                  Season {season} • Episode {episode}
                </span>
              )}
            </div>

            {/* Quick Skip Server button if buffering */}
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => handleAutoFailover(`User skipped ${activeServer.name}`)}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 border border-white/10"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try Next Server ({nextServer.name})</span>
              </button>
            </div>
          </div>
        )}

        {/* Video Player Render - Standard Iframe (No sandbox blocker) */}
        {activeServer.type === 'video' ? (
          <video 
            key={`${activeServer.url}-${iframeKey}`}
            src={activeServer.url}
            controls
            autoPlay
            playsInline
            onLoadedData={() => setIsLoading(false)}
            onError={() => handleAutoFailover("Video file failed to play")}
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe 
            key={`${activeServer.url}-${iframeKey}`}
            src={activeServer.url}
            title={activeServer.name}
            className="w-full h-full border-0 absolute inset-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            onLoad={() => {
              // Mark ready after embed loaded
              setTimeout(() => setIsLoading(false), 1200);
            }}
          />
        )}
      </main>

      {/* 3. Bottom Information Bar */}
      <footer className="w-full bg-gradient-to-t from-black via-zinc-950/95 to-transparent px-3 sm:px-6 py-2 z-40 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-gray-400 border-t border-white/5">
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
          {/* Ad-Blocker Suggestion */}
          <span className="hidden md:inline text-gray-500">
            Tip: Use Brave or uBlock to block external ad popups seamlessly
          </span>

          <a 
            href={activeServer.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white flex items-center space-x-1 text-gray-400 underline underline-offset-2"
          >
            <span>Direct Server Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default VideoPlayer;
