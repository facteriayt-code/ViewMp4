import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, Volume2, VolumeX, AlertCircle } from 'lucide-react';
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
  const [isAdPlaying, setIsAdPlaying] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // 1. Initialize Video.js with the ID 'my-video' as required for the VAST script logic
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

    // 2. Plug in the IMA logic exactly as requested in the script snippet
    const imaOptions = {
      id: 'my-video',
      adTagUrl: 'https://youradexchange.com/video/select.php?r=10801106',
      showCountdown: true,
      debug: false
    };

    try {
      if (player.ima) {
        player.ima(imaOptions);

        // Standard requirement: Initialize the ad display container on a user gesture (play)
        const initAdContainer = () => {
          player.ima.initializeAdDisplayContainer();
          player.ima.requestAds();
          player.off('play', initAdContainer);
        };
        
        player.on('play', initAdContainer);

        // Tracking ad state for UI feedback
        player.on('ads-ad-started', () => {
          setIsAdPlaying(true);
        });

        player.on('ads-ad-ended', () => {
          setIsAdPlaying(false);
        });

        player.on('ads-error', (event: any) => {
          console.warn('IMA Ads Error:', event.adsManagerLoadedEvent?.getError());
          setIsAdPlaying(false); // Resume content if ad fails
        });
      }
    } catch (e) {
      console.error("IMA Plugin initialization failed. Check if libraries are loaded.", e);
    }

    // 3. Increment views when movie starts
    player.on('play', () => {
      if (movie.id) incrementMovieView(movie.id);
    });

    player.on('error', () => {
      setError("Unable to load video stream.");
    });

    // 4. Cleanup
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
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-[220] bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <button 
          onClick={onClose}
          className="flex items-center text-white hover:text-gray-300 transition-colors group pointer-events-auto"
        >
          <ArrowLeft className="w-8 h-8 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xl font-bold hidden md:inline tracking-tight">Back</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-bold truncate max-w-xs md:max-w-md">
            {isAdPlaying ? 'Advertisement' : movie.title}
          </h2>
          {isAdPlaying && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[10px] bg-amber-500 px-1.5 py-0.5 rounded font-black text-black uppercase tracking-widest animate-pulse">Sponsored</span>
            </div>
          )}
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
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Playback Error</h3>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
              We couldn't initialize the secure stream. Please disable any content blockers and try again.
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
              id="my-video"
              ref={videoRef} 
              className="video-js vjs-big-play-centered vjs-theme-netflix" 
              playsInline
            />
          </div>
        )}

        {/* Custom Mute Control Layer - Only visible when ad is NOT playing */}
        {!error && !isAdPlaying && (
          <button 
            onClick={toggleMute}
            className="absolute bottom-10 left-10 z-[210] p-4 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 text-white transition-all active:scale-95 opacity-0 group-hover:opacity-100"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        )}
      </div>

      <style>{`
        /* Essential layering for IMA VAST container */
        .vjs-ima-ad-container {
          z-index: 215 !important;
        }
        
        /* Ensure ad container fills the player area */
        #my-video_ima-ad-container,
        .vjs-ima-ad-container {
            width: 100% !important;
            height: 100% !important;
        }

        /* Hide standard control bar while ad is playing */
        .vjs-ad-playing .vjs-control-bar {
          display: none !important;
        }

        .video-js {
          width: 100%;
          height: 100%;
          background-color: black;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;