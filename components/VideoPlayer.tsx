import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ArrowLeft, Maximize, Minimize, RotateCw, ExternalLink, 
  ShieldCheck, Film, Sparkles, Tv, Play, ChevronLeft, ChevronRight, Layers, HelpCircle,
  AlertTriangle, RefreshCw
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
  
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);

  const [servers, setServers] = useState<StreamServer[]>(() => 
    getMovieStreamServers(movie, 1, 1)
  );
  
  // Hindi server is prioritized FIRST by default ('cinesrc-hindi' or servers[0])
  const [activeServerId, setActiveServerId] = useState<string>(() => 
    servers[0]?.id || 'cinesrc-hindi'
  );
  
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showGuidePopover, setShowGuidePopover] = useState<boolean>(false);
  const [failoverNotice, setFailoverNotice] = useState<string | null>(null);

  const tmdbId = getMovieTmdbId(movie);
  const isSeries = isTvOrSeries(movie);
  const failoverTimeoutRef = useRef<number | null>(null);

  // Update servers when movie, season or episode changes
  useEffect(() => {
    const list = getMovieStreamServers(movie, season, episode);
    setServers(list);
    
    // Always default to the first server (Hindi priority) when opening a movie
    setActiveServerId(list[0]?.id || 'cinesrc-hindi');
    
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

  // Smart Auto-Failover: "first of all hindi server should connect if that is not connected try another"
  const handleAutoFailover = (reason?: string) => {
    if (servers.length <= 1) return;
    const nextIdx = (activeServerIndex + 1) % servers.length;
    const target = servers[nextIdx];
    
    const message = reason || `${activeServer.name} did not connect. Trying ${target.name}...`;
    setFailoverNotice(message);
    setActiveServerId(target.id);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);

    // Auto-clear notice after 5 seconds
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
        // If still in loading state after 10 seconds, automatically try the next server
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
    } else if (season > 1) {
      setSeason(prev => prev - 1);
      setEpisode(10);
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

        {/* Center: Server Switcher (Prioritizes Hindi First) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
          {servers.map((s, idx) => {
            const isActive = s.id === activeServer.id;
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
                    ? s.isHindi 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black border border-amber-300 ring-2 ring-amber-400/40 scale-105' 
                      : 'bg-red-600 text-white shadow-red-600/40 border border-red-500 ring-2 ring-red-500/30 scale-105' 
                    : s.isHindi 
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10'
                }`}
                title={s.description}
              >
                {s.isHindi ? (
                  <span className="text-[9px] font-black bg-black/40 text-amber-200 px-1 py-0.2 rounded uppercase">
                    🇮🇳 {idx === 0 ? 'Hindi 1st' : 'Hindi'}
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

        {/* Right: Server Guide, Reload, Fullscreen, Close */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Guide Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowGuidePopover(!showGuidePopover)}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/15 transition shadow-sm"
              title="Player servers & Hindi audio guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Servers & Hindi</span>
            </button>

            {showGuidePopover && (
              <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:mt-2 sm:w-84 bg-zinc-950/98 border border-white/15 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5 font-black text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Hindi & Multi-Audio Player Guide</span>
                  </div>
                  <button 
                    onClick={() => setShowGuidePopover(false)} 
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-[11px] text-gray-300 leading-relaxed">
                  <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-200">
                    <span className="font-bold block mb-0.5">🇮🇳 Hindi Server 1st Priority Active:</span>
                    The player automatically connects to the Hindi / Multi-Audio CineSrc & Filmu servers first. If a server is unavailable or buffering, automatic failover seamlessly switches to the next available server.
                  </div>

                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-amber-300 font-bold block mb-0.5">CineSrc (cinesrc.st):</span>
                    Ultra-fast 4K streaming server with multi-audio and Hindi track availability.
                  </div>

                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-cyan-300 font-bold block mb-0.5">CodeSpecters (nx_ API Key):</span>
                    Direct streaming verified through your CodeSpecters API key.
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

      {/* Optional TV Series Episode Navigation Bar */}
      {(isSeries || activeServer.isTv) && (
        <div className="w-full bg-black/95 border-b border-white/10 px-3 sm:px-6 py-1.5 sm:py-2 flex flex-wrap items-center justify-between gap-2 z-40 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Episode:</span>
            
            {/* Season Selector */}
            <div className="flex items-center space-x-1">
              <span className="text-gray-400 text-xs font-semibold">Season</span>
              <select
                value={season}
                onChange={(e) => {
                  setSeason(Number(e.target.value));
                  setEpisode(1);
                  setIsLoading(true);
                }}
                className="bg-zinc-800 border border-white/20 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-red-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sNum => (
                  <option key={sNum} value={sNum}>Season {sNum}</option>
                ))}
              </select>
            </div>

            {/* Quick Episode Chips */}
            <div className="hidden sm:flex items-center space-x-1 ml-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(epNum => (
                <button
                  key={epNum}
                  onClick={() => {
                    setEpisode(epNum);
                    setIsLoading(true);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    episode === epNum 
                      ? 'bg-red-600 text-white' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
                  }`}
                >
                  Ep {epNum}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevEpisode}
              disabled={season === 1 && episode === 1}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none rounded text-xs font-semibold text-gray-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 text-xs">
              S{season}:E{episode}
            </span>

            <button
              onClick={handleNextEpisode}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-semibold text-gray-200"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Streaming Canvas Area */}
      <main className="w-full flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {/* Loading Spinner with Auto-Failover Information */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm pointer-events-auto p-4 space-y-3.5">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-amber-500/30" />
              {activeServer.isHindi && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-amber-300">
                  🇮🇳
                </span>
              )}
            </div>

            <div className="text-center space-y-1 max-w-sm">
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] text-white block">
                Connecting to {activeServer.name}
              </span>
              <span className="text-[11px] text-amber-300/90 font-medium block">
                {activeServer.isHindi ? 'Priority 1: Hindi / Multi-Audio Server' : 'Connecting stream source...'}
              </span>
              <span className="text-[10px] text-gray-400 block pt-0.5">
                Auto-failover active: If not connected within seconds, next server will launch automatically.
              </span>
            </div>

            {/* Quick 1-Tap Manual Failover Button */}
            <button
              type="button"
              onClick={() => handleAutoFailover(`Skipped ${activeServer.name}. Trying ${nextServer.name}...`)}
              className="mt-2 flex items-center space-x-1.5 px-4 py-2 bg-white/10 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold transition-all active:scale-95 shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
              <span>Not playing? Try Next Server ({nextServer.name}) ➔</span>
            </button>
          </div>
        )}

        {/* Stream Source: Standard Unsandboxed Iframe to avoid "Sandbox detected" rejection */}
        {activeServer.type === 'iframe' ? (
          <iframe
            key={`${activeServer.id}-${iframeKey}-${season}-${episode}`}
            src={activeServer.url}
            title={movie.title}
            className="w-full h-full border-0 select-auto"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
            onLoad={() => setIsLoading(false)}
            onError={() => handleAutoFailover(`${activeServer.name} failed to load. Switching to next server...`)}
          />
        ) : (
          <video
            key={`${activeServer.id}-${iframeKey}`}
            src={activeServer.url}
            poster={movie.backdrop || movie.thumbnail}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
            onCanPlay={() => setIsLoading(false)}
          />
        )}
      </main>

      {/* 3. Subtle Footer with Streaming Info & Failover Trigger */}
      <footer className="w-full bg-gradient-to-t from-black via-black/90 to-transparent px-3 sm:px-6 py-2 z-40 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] text-gray-400 border-t border-white/5 gap-2">
        <div className="flex items-center space-x-2 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />
          <span className="font-semibold text-gray-300 truncate">
            {activeServer.name}
          </span>
          <span className="text-gray-600 hidden sm:inline">·</span>
          <span className="text-gray-400 hidden md:inline truncate">
            {activeServer.description}
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {/* Quick Failover Link in Footer */}
          <button
            type="button"
            onClick={() => handleAutoFailover(`Manually switched to ${nextServer.name}`)}
            className="flex items-center space-x-1 text-amber-300 hover:text-amber-200 transition font-bold"
            title="Try the next server if current is not playing"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Try Another Server</span>
          </button>

          <span className="text-gray-600 hidden sm:inline">|</span>

          <a
            href={activeServer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-400 hover:text-white transition"
          >
            <span>External Window</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default VideoPlayer;
