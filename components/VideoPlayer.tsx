import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ArrowLeft, Maximize, Minimize, RotateCw, ExternalLink, 
  ShieldCheck, Film, Sparkles, Tv, Play, ChevronLeft, ChevronRight, Layers, HelpCircle
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
  // Default to Filmu All-in-One player (which provides internal servers & subtitles) or CodeSpecters
  const [activeServerId, setActiveServerId] = useState<string>('filmu-primary');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showGuidePopover, setShowGuidePopover] = useState<boolean>(false);

  const tmdbId = getMovieTmdbId(movie);
  const isSeries = isTvOrSeries(movie);

  // Update servers when movie, season or episode changes
  useEffect(() => {
    const list = getMovieStreamServers(movie, season, episode);
    setServers(list);
    
    // If the currently selected server is still in the list, keep it; otherwise default to filmu-primary
    if (!list.some(s => s.id === activeServerId)) {
      setActiveServerId(list[0]?.id || 'filmu-primary');
    }
    
    setIframeKey(prev => prev + 1);
    setIsLoading(true);

    if (movie.id) {
      incrementMovieView(movie.id);
    }
  }, [movie, season, episode]);

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];

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
      setEpisode(10); // jump to end of previous season
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
      {/* 1. Sleek Top Bar with Back, Title, Server Selectors, and Controls */}
      <header className="w-full bg-gradient-to-b from-black via-zinc-950/95 to-transparent px-3 sm:px-6 py-3 z-50 flex flex-wrap items-center justify-between gap-2 sm:gap-4 border-b border-white/10 backdrop-blur-md">
        {/* Left: Back Button & Movie Metadata */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button 
            type="button"
            onClick={onClose} 
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all active:scale-95 shadow-md"
            title="Return to library"
          >
            <ArrowLeft className="w-4 h-4 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="truncate max-w-[130px] sm:max-w-xs md:max-w-md">
            <div className="flex items-center space-x-2">
              <h1 className="text-xs sm:text-base font-black text-white tracking-tight uppercase truncate">
                {movie.title}
              </h1>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/40 hidden md:inline">
                TMDb {tmdbId}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-gray-400 font-medium">
              <span>{movie.year}</span>
              <span aria-hidden="true">·</span>
              <span>{movie.genre}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-bold">{activeServer.quality}</span>
            </div>
          </div>
        </div>

        {/* Center: Server Switcher */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {servers.map((s) => {
            const isActive = s.id === activeServer.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (s.id !== activeServer.id) {
                    setActiveServerId(s.id);
                    setIsLoading(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm whitespace-nowrap active:scale-95 ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-red-600/40 border border-red-500 ring-2 ring-red-500/30 scale-105' 
                    : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10'
                }`}
                title={s.description}
              >
                {s.id.includes('filmu') ? (
                  <Sparkles className="w-3 h-3 text-amber-300" />
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
                  <span className="text-[9px] bg-black/40 text-amber-200 px-1.5 py-0.2 rounded uppercase font-bold hidden sm:inline">
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Server Guide, Reload, Fullscreen, Close */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Guide Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowGuidePopover(!showGuidePopover)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/15 transition shadow-sm"
              title="Player and server information"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Servers & Ads</span>
            </button>

            {showGuidePopover && (
              <div className="absolute right-0 mt-2 w-72 sm:w-84 bg-zinc-950/95 border border-white/15 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5 font-black text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Player & Servers Guide</span>
                  </div>
                  <button 
                    onClick={() => setShowGuidePopover(false)} 
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-[11px] text-gray-300 leading-relaxed">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-amber-300 font-bold block mb-0.5">Filmu Player (embed.filmu.in):</span>
                    Handles automatic server fallback, video quality selection (1080p/4K), multi-language subtitle tracks, and audio built directly into the player interface.
                  </div>

                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-cyan-300 font-bold block mb-0.5">CodeSpecters (nx_ API Key):</span>
                    Direct high-speed streaming server unlocked using your provided API key credentials.
                  </div>

                  <div className="p-2 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-emerald-200">
                    <span className="font-bold block mb-0.5">Ad Blocking & Sandbox Note:</span>
                    Streaming servers reject HTML sandbox attributes (triggering <em>"sandbox detected"</em>). The player is loaded in unsandboxed mode with full autoplay and picture-in-picture. To block third-party popups, use <strong>uBlock Origin</strong> or <strong>Brave Browser</strong>.
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleReload}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
            title="Reload video stream"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
            title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-full bg-white/10 hover:bg-red-600 text-gray-300 hover:text-white transition"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Optional TV Series Episode Navigation Bar */}
      {(isSeries || activeServer.isTv) && (
        <div className="w-full bg-black/90 border-b border-white/10 px-4 py-2 flex items-center justify-between z-40 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Episode Control:</span>
            
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
              className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none rounded text-xs font-semibold text-gray-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev Ep</span>
            </button>

            <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              S{season}:E{episode}
            </span>

            <button
              onClick={handleNextEpisode}
              className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-semibold text-gray-200"
            >
              <span>Next Ep</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Streaming Canvas Area */}
      <main className="w-full flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none space-y-3">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin shadow-lg shadow-red-600/30" />
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white block">
                Loading {activeServer.name}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Connecting to stream server...
              </span>
            </div>
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
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={() => setIsLoading(false)}
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

      {/* 3. Subtle Footer with Streaming Info & Source Verification */}
      <footer className="w-full bg-gradient-to-t from-black via-black/90 to-transparent px-3 sm:px-6 py-2.5 z-40 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="font-semibold text-gray-300">
            Playing on {activeServer.name}
          </span>
          <span className="text-gray-600 hidden sm:inline">·</span>
          <span className="text-gray-400 hidden sm:inline">
            {activeServer.description}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-gray-500 hidden md:inline">Press ESC to exit</span>
          <a
            href={activeServer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-400 hover:text-white transition"
          >
            <span>Open in External Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default VideoPlayer;
