import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Maximize, Minimize, RotateCw, ExternalLink, ShieldCheck, Film, Sparkles, Tv, Play, ShieldAlert, Check, Info } from 'lucide-react';
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

  // Ad-Shield State: 'strict' blocks all popups/redirects by omitting allow-popups and allow-top-navigation
  const [adShieldMode, setAdShieldMode] = useState<'strict' | 'permissive'>('strict');
  const [showShieldPopover, setShowShieldPopover] = useState(false);
  const [blockedPopupNotice, setBlockedPopupNotice] = useState(true);

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

  // Sandbox policy:
  // In 'strict' mode, allow-popups and allow-top-navigation are OMITTED.
  // This blocks window.open() popup tabs and ad network clickjack redirects, while keeping video playback and HLS streaming active.
  const sandboxPolicy = adShieldMode === 'strict'
    ? "allow-scripts allow-same-origin allow-forms allow-presentation"
    : "allow-scripts allow-same-origin allow-forms allow-presentation allow-popups";

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-between select-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* 1. Sleek Top Bar with Back, Title, Server Selectors, Ad-Shield and Controls */}
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
              <span className="text-green-400 font-bold">4K Ultra HD</span>
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
                ) : (
                  <Play className="w-3 h-3 text-green-400" />
                )}
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Ad-Shield Toggle, Reload, Fullscreen, Close */}
        <div className="flex items-center space-x-2">
          {/* Ad-Shield Protection Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowShieldPopover(!showShieldPopover)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-[10px] md:text-xs font-black border transition-all active:scale-95 shadow-md ${
                adShieldMode === 'strict'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30 ring-1 ring-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
              }`}
              title="Configure Ad Blocking & Popup Shield"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Ad-Shield:</span>
              <span>{adShieldMode === 'strict' ? 'Strict (Blocked)' : 'Permissive'}</span>
            </button>

            {/* Ad-Shield Popover Modal */}
            {showShieldPopover && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-zinc-950/95 border border-white/15 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center space-x-1.5 font-black text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Ad-Shield Protection</span>
                  </div>
                  <button 
                    onClick={() => setShowShieldPopover(false)} 
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Third-party embed providers (CodeSpecters/Adsterra) often attempt to open popups and redirects. Ad-Shield enforces browser-level sandbox policies to restrict them.
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAdShieldMode('strict');
                      setIframeKey(k => k + 1);
                      setShowShieldPopover(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-start justify-between transition ${
                      adShieldMode === 'strict'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="font-black text-emerald-400 flex items-center space-x-1">
                        <span>Strict Mode (Recommended)</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Blocks all popup tabs (<code className="text-gray-300">window.open</code>) and site redirects. Video plays smoothly.
                      </div>
                    </div>
                    {adShieldMode === 'strict' && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdShieldMode('permissive');
                      setIframeKey(k => k + 1);
                      setShowShieldPopover(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-start justify-between transition ${
                      adShieldMode === 'permissive'
                        ? 'bg-amber-500/20 border-amber-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="font-black text-amber-400">Permissive Mode</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Allows popups if an external server player requires new tabs.
                      </div>
                    </div>
                    {adShieldMode === 'permissive' && <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
                  </button>
                </div>

                <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 text-[10px] text-gray-400 space-y-1">
                  <div className="font-bold text-gray-300 flex items-center space-x-1">
                    <Info className="w-3 h-3 text-cyan-400" />
                    <span>Pro Tip: Full Network Ad-Blocking</span>
                  </div>
                  <p>
                    For 100% ad-free experience, using an extension like <strong>uBlock Origin</strong> or <strong>Brave Shields</strong> blocks the ad scripts entirely at the network level.
                  </p>
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
                Loading CodeSpecters NexStream
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Connecting to 4K Ultra HD broadcast with Ad-Shield active...
              </span>
            </div>
          </div>
        )}

        {/* Stream Source: CodeSpecters Iframe with HTML5 Sandbox Shield */}
        {activeServer.type === 'iframe' ? (
          <iframe
            key={`${activeServer.id}-${iframeKey}-${adShieldMode}`}
            src={activeServer.url}
            title={movie.title}
            className="w-full h-full border-0 select-auto"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox={sandboxPolicy}
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

      {/* 3. Subtle Footer with Streaming Info & Ad-Shield Verification */}
      <footer className="w-full bg-gradient-to-t from-black via-black/90 to-transparent px-4 md:px-8 py-2.5 z-40 flex items-center justify-between text-[11px] text-gray-400 border-t border-white/5">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-gray-300">
            Ad-Shield Active
          </span>
          <span className="text-gray-600 hidden sm:inline">·</span>
          <span className="text-gray-400 hidden sm:inline">
            Popup tabs & clickjacking redirects restricted by sandbox
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-gray-500 hidden md:inline">Press ESC to exit</span>
          <a
            href={`https://api.codespecters.com/embed/movie/${tmdbId}?apikey=${CODESPECTERS_API_KEY}`}
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
