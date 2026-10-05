import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Maximize, Minimize, RotateCw, ExternalLink, ShieldCheck, Film, Sparkles, Tv, Play, Info, AlertCircle, Layers } from 'lucide-react';
import { Movie } from '../types.ts';
import { incrementMovieView } from '../services/storageService.ts';
import { getMovieStreamServers, getMovieTmdbId, StreamServer, CODESPECTERS_API_KEY } from '../services/streamService.ts';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [servers, setServers] = useState<StreamServer[]>(() => getMovieStreamServers(movie));
  const [activeServerId, setActiveServerId] = useState<string>('codespecters-primary');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdInfoPopover, setShowAdInfoPopover] = useState(false);

  const tmdbId = getMovieTmdbId(movie);

  useEffect(() => {
    const list = getMovieStreamServers(movie);
    setServers(list);
    setActiveServerId(list[0]?.id || 'codespecters-primary');
    setIframeKey(prev => prev + 1);
    setIsLoading(true);

    if (movie.id) {
      incrementMovieView(movie.id);
    }
  }, [movie]);

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
      // Prevents aggressive third-party ad scripts from quietly navigating the user away
      e.preventDefault();
      return (e.returnValue = '');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-between select-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* 1. Sleek Top Bar with Back, Title, Server Selectors, and Controls */}
      <header className="w-full bg-gradient-to-b from-black via-black/85 to-transparent px-4 md:px-8 py-3.5 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 backdrop-blur-md">
        {/* Left: Back Button & Movie Metadata */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <button 
            type="button"
            onClick={onClose} 
            className="flex items-center space-x-1.5 bg-white/10 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-full text-xs md:text-sm transition-all active:scale-95 shadow-md"
            title="Return to library"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="truncate max-w-[150px] sm:max-w-xs md:max-w-md">
            <div className="flex items-center space-x-2">
              <h1 className="text-sm md:text-lg font-black text-white tracking-tight uppercase truncate">
                {movie.title}
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/40 hidden md:inline">
                TMDb {tmdbId}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] md:text-xs text-gray-400 font-medium">
              <span>{movie.year}</span>
              <span aria-hidden="true">·</span>
              <span>{movie.genre}</span>
              <span aria-hidden="true">·</span>
              <span className="text-green-400 font-bold">{activeServer.quality}</span>
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
                className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm whitespace-nowrap active:scale-95 ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-red-600/40 border border-red-500 ring-2 ring-red-500/30' 
                    : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                {s.id.includes('codespecters') ? (
                  <Sparkles className="w-3 h-3 text-amber-300" />
                ) : s.id.includes('trailer') ? (
                  <Film className="w-3 h-3 text-blue-400" />
                ) : s.id.includes('autoembed') ? (
                  <Layers className="w-3 h-3 text-cyan-400" />
                ) : (
                  <Play className="w-3 h-3 text-green-400" />
                )}
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Ad Tips, Reload, Fullscreen, Close */}
        <div className="flex items-center space-x-2">
          {/* Ad Tips Info Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAdInfoPopover(!showAdInfoPopover)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[10px] md:text-xs font-bold bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/15 transition shadow-sm"
              title="Information on blocking stream ads"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Ad Guide</span>
            </button>

            {/* Ad Tips Popover */}
            {showAdInfoPopover && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-zinc-950/95 border border-white/15 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5 font-black text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>How to Block Stream Ads</span>
                  </div>
                  <button 
                    onClick={() => setShowAdInfoPopover(false)} 
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Third-party streaming servers detect and reject HTML sandbox tags (showing <em>"sandbox detected"</em>).
                </p>

                <div className="p-2.5 bg-black/50 rounded-xl border border-white/10 space-y-2 text-[11px]">
                  <div className="font-bold text-emerald-400 flex items-center space-x-1">
                    <span>Best Solutions for Zero Ads:</span>
                  </div>
                  <ul className="space-y-1.5 text-gray-300">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Browser Ad-Blocker:</strong> Install <strong>uBlock Origin</strong> or use <strong>Brave Browser</strong> to block all popups and ad scripts before they run.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Switch Server:</strong> Try <strong>AutoEmbed 4K</strong> in the server bar above for a cleaner streaming mirror.</span>
                    </li>
                  </ul>
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
            <RotateCw className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
            title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 md:w-5 md:h-5" /> : <Maximize className="w-4 h-4 md:w-5 md:h-5" />}
          </button>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-full bg-white/10 hover:bg-red-600 text-gray-300 hover:text-white transition"
            title="Close Player"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </header>

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
            key={`${activeServer.id}-${iframeKey}`}
            src={activeServer.url}
            title={movie.title}
            className="w-full h-full border-0 select-auto"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
      <footer className="w-full bg-gradient-to-t from-black via-black/90 to-transparent px-4 md:px-8 py-2.5 z-40 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5">
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
            className="flex items-center space-x-1 hover:text-white transition"
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
