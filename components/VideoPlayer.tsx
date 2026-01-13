
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

    // 1. Initialize Video.js with standard Netflix-like settings
    const player = videojs(videoRef.current, {
      autoplay: true,
      controls: true,
      muted: true,
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      poster: movie.thumbnail,
      sources: movie.videoUrl ? [{
        src: movie.videoUrl,
        type: 'video/mp4'
      }] : []
    });

    playerRef.current = player;

    // Critical fix: This function forces the UI to return to content mode
    const forceContentPlay = () => {
      console.log('IMA: Forcing content playback and clearing UI block.');
      if (adTimeoutRef.current) {
        clearTimeout(adTimeoutRef.current);
        adTimeoutRef.current = null;
      }
      
      setIsAdPlaying(false);
      setAdLoading(false);
      
      if (player) {
        // Explicitly strip classes that hide controls
        player.removeClass('vjs-ad-playing');
        player.removeClass('vjs-ad-loading');
        player.removeClass('vjs-ad-active');
        
        // Attempt to play content
        const playPromise = player.play();
        if (playPromise !== undefined) {
          playPromise.catch((err: any) => {
            console.warn('Playback resume handled:', err);
          });
        }
      }
    };

    // 2. Setup IMA with the Adcash/Onclickalgo VAST tag
    player.ready(() => {
      if (player.ima) {
        const imaOptions = {
          id: 'my-video',
          adTagUrl: 'https://onclickalgo.com/video/select.php?r=10802842',
          showCountdown: true,
          debug: false,
          adWillAutoPlay: true,
          adsResponseTimeout: 5000 // Faster timeout for better UX
        };

        try {
          player.ima(imaOptions);

          // Success Events
          player.on('ads-ad-started', () => {
            if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
            setIsAdPlaying(true);
            setAdLoading(false);
          });

          // Completion Events
          player.on('ads-ad-ended', forceContentPlay);
          player.on('ads-all-ads-completed', forceContentPlay);

          // Error/Blocker handling - ensures buttons don't stay "stuck"
          player.on('ads-error', (event: any) => {
            console.warn('IMA Ads Error:', event.error);
            forceContentPlay();
          });

          player.on('aderror', forceContentPlay);
          player.on('contentresumerequested', forceContentPlay);

          // Pre-roll Request Trigger on User Interaction
          const requestAdsOnPlay = () => {
            player.ima.initializeAdDisplayContainer();
            player.ima.requestAds();
            
            // Fail-safe: If ad hasn't started in 6 seconds, just play the movie
            adTimeoutRef.current = window.setTimeout(() => {
              if (adLoading || isAdPlaying === false) {
                console.warn('Ad Request Hang - Bypassing to movie.');
                forceContentPlay();
              }
            }, 6000);

            player.off('play', requestAdsOnPlay);
          };
          player.on('play', requestAdsOnPlay);

        } catch (e) {
          console.error("IMA setup failure:", e);
          forceContentPlay();
        }
      } else {
        forceContentPlay();
      }
    });

    // 3. Track View Analytics
    player.on('contentplay', () => {
      if (movie.id) incrementMovieView(movie.id);
    });

    player.on('error', () => {
      setError("Stream could not be initialized.");
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
          <h2 className="text-lg md:text-2xl font-bold truncate max-w-xs md:max-w-md uppercase tracking-tighter">
            {isAdPlaying ? 'Advertisement' : movie.title}
          </h2>
          {(isAdPlaying || adLoading) && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded font-black text-white uppercase tracking-widest animate-pulse">
                {adLoading ? 'Authenticating...' : 'Sponsored Content'}
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
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Negotiating Stream...</p>
          </div>
        )}

        {error ? (
          <div className="text-center space-y-6 animate-in zoom-in duration-300 px-6">
            <div className="w-20 h-20 bg-red-600/10 border-2 border-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Playback Error</h3>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed text-sm">
              We couldn't initialize the secure stream. Please check your internet and disable any ad-blockers to view this content.
            </p>
            <button 
              onClick={onClose} 
              className="bg-white text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:bg-gray-200 transition"
            >
              Exit Player
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

        {/* Custom Mute Control */}
        {!error && !adLoading && !isAdPlaying && (
          <button 
            onClick={toggleMute}
            className="absolute bottom-10 left-10 z-[210] p-4 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 text-white transition-all opacity-0 group-hover:opacity-100"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        )}
      </div>

      <style>{`
        /* FIX: Ensure ad container doesn't steal clicks when inactive */
        .vjs-ima-ad-container {
          z-index: 215 !important;
          pointer-events: none !important;
        }
        /* Only allow clicks on ad container during active playback */
        .vjs-ad-playing .vjs-ima-ad-container,
        .vjs-ad-active .vjs-ima-ad-container {
          pointer-events: auto !important;
        }
        
        #my-video_ima-ad-container {
            width: 100% !important;
            height: 100% !important;
        }
        
        /* Ensure controls are visible when not playing ads */
        .vjs-ad-playing .vjs-control-bar {
          display: none !important;
          opacity: 0 !important;
        }
        
        .video-js {
          width: 100%;
          height: 100%;
          background-color: black;
        }
        
        .video-js .vjs-control-bar {
          z-index: 216 !important;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
