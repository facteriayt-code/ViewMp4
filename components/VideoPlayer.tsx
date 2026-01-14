import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, Volume2, VolumeX, AlertCircle, Loader2, PlayCircle } from 'lucide-react';
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
  const [needsClickToStart, setNeedsClickToStart] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;

    // 1. Initialize Video.js
    const player = videojs(videoRef.current, {
      autoplay: false,
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

    const forceContentPlay = () => {
      console.log('IMA: Returning to content playback.');
      if (adTimeoutRef.current) {
        clearTimeout(adTimeoutRef.current);
        adTimeoutRef.current = null;
      }
      
      setIsAdPlaying(false);
      setAdLoading(false);
      
      if (player) {
        player.removeClass('vjs-ad-playing');
        player.removeClass('vjs-ad-loading');
        player.controls(true);
        
        const playPromise = player.play();
        if (playPromise !== undefined) {
          playPromise.catch((e: any) => {
            console.warn('Playback resume failed - likely needs click:', e);
            setNeedsClickToStart(true);
          });
        }
      }
    };

    // 2. Setup IMA
    player.ready(() => {
      if (player.ima) {
        const imaOptions = {
          id: 'my-video',
          adTagUrl: 'https://s.magsrv.com/v1/vast.php?idzone=5828614',
          showCountdown: true,
          debug: false,
          adsResponseTimeout: 8000,
          adWillAutoPlay: true,
          adWillPlayMuted: true
        };

        try {
          player.ima(imaOptions);

          // Events
          player.on('ads-ad-started', () => {
            console.log('IMA: Ad Started');
            if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
            setIsAdPlaying(true);
            setAdLoading(false);
          });

          player.on('ads-ad-ended', forceContentPlay);
          player.on('ads-all-ads-completed', forceContentPlay);
          player.on('ads-error', (err: any) => {
            console.warn('IMA: Ads Error (blocked or no inventory):', err);
            forceContentPlay();
          });

          player.on('aderror', forceContentPlay);
          player.on('contentresumerequested', forceContentPlay);

        } catch (e) {
          console.error("IMA: Setup failure:", e);
          forceContentPlay();
        }
      } else {
        console.warn('IMA: Plugin not found');
        forceContentPlay();
      }
    });

    player.on('contentplay', () => {
      if (movie.id) incrementMovieView(movie.id);
    });

    return () => {
      if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [movie]);

  const handleManualStart = () => {
    setNeedsClickToStart(false);
    setAdLoading(true);
    
    if (playerRef.current) {
      // IMA requires this call inside a user gesture handler to allow the ad container to play
      if (playerRef.current.ima && playerRef.current.ima.initializeAdDisplayContainer) {
        playerRef.current.ima.initializeAdDisplayContainer();
        playerRef.current.ima.requestAds();
      }
      
      playerRef.current.play();

      // Fail-safe: Skip if ad doesn't start in 7 seconds
      adTimeoutRef.current = window.setTimeout(() => {
        if (!isAdPlaying) {
          console.warn('IMA: Ad request timed out. Skipping.');
          forceContentPlayAction();
        }
      }, 7000);
    }
  };

  const forceContentPlayAction = () => {
    setIsAdPlaying(false);
    setAdLoading(false);
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      const newMuted = !isMuted;
      playerRef.current.muted(newMuted);
      setIsMuted(newMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-[220] bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <button onClick={onClose} className="flex items-center text-white hover:text-gray-300 transition-colors group pointer-events-auto">
          <ArrowLeft className="w-8 h-8 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xl font-bold hidden md:inline tracking-tight">Back</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-bold truncate max-w-xs md:max-w-md uppercase tracking-tighter text-white">
            {isAdPlaying ? 'Advertisement' : movie.title}
          </h2>
        </div>

        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors pointer-events-auto">
          <X className="w-8 h-8 text-white" />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-black relative group">
        {adLoading && !error && !needsClickToStart && (
          <div className="absolute inset-0 z-[215] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-white animate-pulse">Initializing Ad Stream...</p>
          </div>
        )}

        {needsClickToStart && (
          <div className="absolute inset-0 z-[216] flex flex-col items-center justify-center bg-black/90 px-6 text-center">
             <button 
              onClick={handleManualStart}
              className="flex flex-col items-center space-y-6 hover:scale-105 transition-transform group/start"
             >
                <div className="w-24 h-24 md:w-32 md:h-32 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(229,9,20,0.6)] group-hover/start:shadow-red-600/80 transition-shadow">
                  <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-white fill-white/20" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm md:text-xl font-black uppercase tracking-[0.4em] text-white">Watch Now</span>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sponsored content may play before video</p>
                </div>
             </button>
          </div>
        )}

        {error ? (
          <div className="text-center space-y-6 animate-in zoom-in duration-300 px-6">
            <AlertCircle className="w-20 h-20 text-red-600 mx-auto" />
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Playback Error</h3>
            <button onClick={onClose} className="bg-white text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:bg-gray-200 transition">Exit</button>
          </div>
        ) : (
          <div data-vjs-player className="w-full h-full">
            <video id="my-video" ref={videoRef} className="video-js vjs-big-play-centered vjs-theme-netflix" playsInline />
          </div>
        )}

        {!error && !adLoading && !isAdPlaying && !needsClickToStart && (
          <button 
            onClick={toggleMute}
            className="absolute bottom-10 left-10 z-[210] p-4 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 text-white transition-all opacity-0 group-hover:opacity-100"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        )}
      </div>

      <style>{`
        .vjs-ima-ad-container { z-index: 215 !important; }
        .vjs-ad-playing .vjs-control-bar { display: none !important; }
        .video-js { width: 100%; height: 100%; background-color: black; }
        .vjs-ad-loading .vjs-poster { display: block !important; }
      `}</style>
    </div>
  );
};

export default VideoPlayer;