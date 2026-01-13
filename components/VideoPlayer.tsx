import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, Volume2, VolumeX, AlertCircle, Loader2 } from 'lucide-react';
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
  const adTimeoutRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adLoading, setAdLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;

    // 1. Initialize Video.js
    const player = videojs(videoRef.current, {
      autoplay: true,
      controls: true,
      muted: true, // Required for reliable autoplay across browsers
      responsive: true,
      fluid: true,
      poster: movie.thumbnail,
      sources: movie.videoUrl ? [{
        src: movie.videoUrl,
        type: 'video/mp4'
      }] : []
    });

    playerRef.current = player;

    const forceContentPlay = () => {
      console.log('Forcing content playback fallback');
      if (adTimeoutRef.current) {
        clearTimeout(adTimeoutRef.current);
        adTimeoutRef.current = null;
      }
      setIsAdPlaying(false);
      setAdLoading(false);
      
      // Ensure the player UI reflects content state
      if (player && !player.paused()) {
        player.play().catch(() => {});
      } else if (player) {
        player.play().catch(() => {});
      }
    };

    // 2. Setup IMA
    player.ready(() => {
      if (player.ima) {
        const imaOptions = {
          id: 'my-video',
          adTagUrl: 'https://youradexchange.com/video/select.php?r=10801106',
          showCountdown: true,
          debug: false,
          adWillAutoPlay: true,
          adsResponseTimeout: 5000 // Internal IMA timeout
        };

        try {
          player.ima(imaOptions);

          // Handle Ad Events
          player.on('ads-ad-started', () => {
            console.log('Ad started playing');
            if (adTimeoutRef.current) {
              clearTimeout(adTimeoutRef.current);
              adTimeoutRef.current = null;
            }
            setIsAdPlaying(true);
            setAdLoading(false);
          });

          player.on('ads-ad-ended', () => {
            console.log('Ad ended');
            forceContentPlay();
          });

          // Standard IMA/Video.js Error Catchers
          player.on('ads-error', (event: any) => {
            console.warn('IMA Ads Error caught:', event.adsManagerLoadedEvent?.getError() || 'Unknown');
            forceContentPlay();
          });

          player.on('ads-loader-error', () => {
            console.warn('IMA Loader Error - Ad source unreachable');
            forceContentPlay();
          });

          player.on('aderror', () => {
            console.warn('General Ad Error');
            forceContentPlay();
          });

          player.on('contentresumerequested', () => {
            console.log('Content resume requested by IMA');
            forceContentPlay();
          });

          // Safety net for stuck player
          const requestAdsOnPlay = () => {
            console.log('Playback initiated - Requesting Ads');
            player.ima.initializeAdDisplayContainer();
            player.ima.requestAds();
            
            // Set a 5-second safety timeout. If ads don't start, play content.
            adTimeoutRef.current = window.setTimeout(() => {
              if (adLoading) {
                console.warn('Ad safety timeout triggered - No ad response received');
                forceContentPlay();
              }
            }, 5000);

            player.off('play', requestAdsOnPlay);
          };
          player.on('play', requestAdsOnPlay);

        } catch (e) {
          console.error("IMA Plugin failed initialization:", e);
          forceContentPlay();
        }
      } else {
        console.warn('IMA plugin not found on player object');
        forceContentPlay();
      }
    });

    // 3. Track View
    player.on('contentplay', () => {
      if (movie.id) incrementMovieView(movie.id);
    });

    player.on('error', () => {
      setError("Unable to load video stream.");
      setAdLoading(false);
    });

    return () => {
      if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
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
          {(isAdPlaying || adLoading) && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[10px] bg-amber-500 px-2 py-0.5 rounded font-black text-black uppercase tracking-widest animate-pulse">
                {adLoading ? 'Verifying Stream...' : 'Sponsored'}
              </span>
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
        {adLoading && !error && (
          <div className="absolute inset-0 z-[215] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Loading Secure Buffer...</p>
            <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">Ad check in progress</p>
          </div>
        )}

        {error ? (
          <div className="text-center space-y-6 animate-in zoom-in duration-300 px-6">
            <div className="w-20 h-20 bg-red-600/10 border-2 border-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Playback Error</h3>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-sm">
              We encountered an issue initializing the secure stream. This can be caused by network instability or content blockers.
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

        {/* Custom Mute Control Layer */}
        {!error && !adLoading && !isAdPlaying && (
          <button 
            onClick={toggleMute}
            className="absolute bottom-10 left-10 z-[210] p-4 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 text-white transition-all active:scale-95 opacity-0 group-hover:opacity-100"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        )}
      </div>

      <style>{`
        .vjs-ima-ad-container {
          z-index: 215 !important;
        }
        #my-video_ima-ad-container,
        .vjs-ima-ad-container {
            width: 100% !important;
            height: 100% !important;
        }
        /* Hide controls while ad is playing to prevent interaction issues */
        .vjs-ad-playing .vjs-control-bar {
          display: none !important;
        }
        .video-js {
          width: 100%;
          height: 100%;
          background-color: black;
        }
        /* Netflix-style loading spinner */
        .vjs-loading-spinner {
            border: 3px solid rgba(229, 9, 20, 0.3) !important;
            border-top-color: #e50914 !important;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;