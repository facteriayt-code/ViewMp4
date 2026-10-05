import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Maximize, Minimize, RotateCw, ExternalLink, ShieldCheck, Film, Sparkles, Tv, Play } from 'lucide-react';
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

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-between select-none overflow-hidden animate-in fade-in duration-300"
    >
      {/* 1. Sleek Top Bar with Back, Title, Server Selectors, and Controls */}
      <header className="w-full bg-gradient-to-b from-black via-black/80 to-transparent px-4 md:px-8 py-3.5 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 backdrop-blur-md">
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

          <div className="truncate max-w-[160px] sm:max-w-xs md:max-w-md">
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

        {/* Right: Player Utilities */}
        <div className="flex items-center space-x-2">
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
                Connecting to 4K Ultra HD broadcast server...
              </span>
            </div>
          </div>
        )}

        {/* Stream Source: Either CodeSpecters Iframe or Direct Video */}
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
            Broadcasting via CodeSpecters NexStream
          </span>
          <span className="text-gray-600 hidden sm:inline">·</span>
          <span className="text-gray-400 hidden sm:inline">
            Official Key: <code className="text-gray-300 font-mono">nx_f3ccdd...ec50</code>
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
            <span>External Player</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default VideoPlayer;
