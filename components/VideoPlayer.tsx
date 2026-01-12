import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, Info, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { Movie } from '../types.ts';
import { incrementMovieView } from '../services/storageService.ts';

// Declare types for global libraries included in index.html
declare var videojs: any;

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // 1. Initialize Video.js
    const player = videojs(videoRef.current, {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      poster: movie.thumbnail,
      sources: movie.videoUrl ? [{
        src: movie.videoUrl,
        type: 'video/mp4'
      }] : []
    });

    playerRef.current = player;

    // 2. Setup IMA with your VAST Tag
    try {
      if (player.ima) {
        player.ima({
          adTagUrl: 'https://youradexchange.com/video/select.php?r=10801026',
          showCountdown: true,
          debug: false
        });
      }
    } catch (e) {
      console.warn("IMA Plugin initialization failed. Pre-rolls may not play.", e);
    }

    // 3. Increment views when movie starts
    player.on('play', () => {
      if (movie.id) incrementMovieView(movie.id);
    });

    player.on('error', () => {
      setError("Unable to load video stream.");
    });

    // 4. Handle auto-close/cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [movie]);

  const toggleMute = () => {
    if (playerRef.current) {
      const newMuted = !isMuted;
      playerRef.current.muted(newMuted);
      setIsMuted(newMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden">
      {/* Top Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-30 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <button 
          onClick={onClose}
          className="flex items-center text-white hover:text-gray-300 transition-colors group pointer-events-auto"
        >
          <ArrowLeft className="w-8 h-8 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xl font-bold hidden md:inline tracking-tight">Back to Browsing</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-bold truncate max-w-xs md:max-w-md">
            {movie.title}
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded font-black text-white uppercase tracking-widest">Live</span>
            <p className="text-xs md:text-sm text-gray-400">VAST Enabled Stream</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors pointer-events-auto"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-black relative group">
        {error ? (
          <div className="text-center space-y-6 animate-in zoom-in duration-300 px-6">
            <div className="w-20 h-20 bg-red-600/10 border-2 border-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Playback Error</h3>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
              We encountered an issue streaming "{movie.title}". Please verify the source URL or your network connection.
            </p>
            <button 
              onClick={onClose} 
              className="bg-white text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:bg-gray-200 transition active:scale-95"
            >
              Close Player
            </button>
          </div>
        ) : (
          <div data-vjs-player className="w-full h-full">
            <video 
              ref={videoRef} 
              className="video-js vjs-big-play-centered vjs-theme-netflix" 
              playsInline
            />
          </div>
        )}

        {/* Custom Mute Control Layer */}
        {!error && (
          <button 
            onClick={toggleMute}
            className="absolute bottom-10 left-10 z-[210] p-4 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 text-white transition-all active:scale-95 opacity-0 group-hover:opacity-100"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        )}
      </div>

      <style>{`
        /* Hide native UI parts during ads if needed */
        .vjs-ad-playing .vjs-control-bar {
          display: none !important;
        }
        .vjs-ima-ad-container {
          z-index: 205 !important;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;