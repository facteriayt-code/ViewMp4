import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, Volume2, VolumeX, AlertCircle, Loader2, PlayCircle, SkipForward, ChevronRight } from 'lucide-react';
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
  const skipIntervalRef = useRef<number | null>(null);
  
  const [isMuted, setIsMuted] = useState(true);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [needsClickToStart, setNeedsClickToStart] = useState(true);
  const [adSecondsElapsed, setAdSecondsElapsed] = useState(0);
  
  const SKIP_THRESHOLD = 20;

  useEffect(() => {
    if (!videoRef.current) return;

    // 1. Basic Player Setup
    const player = videojs(videoRef.current, {
      autoplay: false,
      controls: true,
      muted: true,
      responsive: true,
      fluid: true,
      poster: movie.thumbnail,
      sources: movie.videoUrl ? [{
        src: movie.videoUrl,
        type: 'video/mp4'
      }] : []
    });

    playerRef.current = player;

    const finalizeAndPlay = () => {
      console.log('IMA: Finalizing ad phase and playing content.');
      setIsAdPlaying(false);
      setAdLoading(false);
      setAdSecondsElapsed(0);
      
      if (skipIntervalRef.current) {
        window.clearInterval(skipIntervalRef.current);
        skipIntervalRef.current = null;
      }
      
      if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
      
      if (player) {
        player.removeClass('vjs-ad-playing');
        player.removeClass('vjs-ad-loading');
        player.controls(true);
        player.play();
      }
    };

    // 2. IMA Initialization
    player.ready(() => {
      if (player.ima) {
        const imaOptions = {
          id: 'my-video',
          adTagUrl: 'https://improbablehospital.com/dOm.FfzgddGkNWvTZLGNUn/XeimA9euBZUUQlwkNP/TmY/3lNeDwg_xwMej/MFtfNxjNcj0ROEDjEpyPNJCAZGsta-WG1-pndaDk0/xp',
          showCountdown: false, // We use our custom UI for skipping
          debug: false,
          adsResponseTimeout: 8000,
          adWillAutoPlay: true
        };

        try {
          player.ima(imaOptions);

          // Success Events
          player.on('ads-ad-started', () => {
            console.log('IMA Event: Ad Started');
            setIsAdPlaying(true);
            setAdLoading(false);
            setAdSecondsElapsed(0);
            
            if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
            
            // Start custom skip timer
            if (skipIntervalRef.current) window.clearInterval(skipIntervalRef.current);
            skipIntervalRef.current = window.setInterval(() => {
              setAdSecondsElapsed(prev => prev + 1);
            }, 1000);
          });

          // Completion / Error Events
          player.on('ads-ad-ended', finalizeAndPlay);
          player.on('ads-all-ads-completed', finalizeAndPlay);
          player.on('ads-error', (err: any) => {
            console.warn('IMA Ads Error (likely no inventory or blocked):', err);
            finalizeAndPlay();
          });

          player.on('aderror', finalizeAndPlay);
          player.on('contentresumerequested', finalizeAndPlay);

        } catch (e) {
          console.error("IMA Initialization Error:", e);
          finalizeAndPlay();
        }
      } else {
        console.warn('IMA Plugin not detected');
        finalizeAndPlay();
      }
    });

    // View Tracking
    player.on('contentplay', () => {
      if (movie.id) incrementMovieView(movie.id);
    });

    return () => {
      if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
      if (skipIntervalRef.current) window.clearInterval(skipIntervalRef.current);
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [movie]);

  const handleStartBroadcast = () => {
    setNeedsClickToStart(false);
    setAdLoading(true);
    
    if (playerRef.current) {
      // Critical: IMA requires a user gesture to initialize the ad container
      if (playerRef.current.ima && playerRef.current.ima.initializeAdDisplayContainer) {
        playerRef.current.ima.initializeAdDisplayContainer();
        playerRef.current.ima.requestAds();
      }
      
      playerRef.current.play();

      // Fail-safe: If ad server is silent for 8 seconds, just play the movie
      adTimeoutRef.current = window.setTimeout(() => {
        if (!isAdPlaying) {
          console.warn('IMA Ad server unresponsive. Skipping to content.');
          finalizeContentPlay();
        }
      }, 8000);
    }
  };

  const handleSkipAd = () => {
    if (adSecondsElapsed >= SKIP_THRESHOLD && playerRef.current?.ima?.getAdsManager()) {
      playerRef.current.ima.getAdsManager().skip();
    }
  };

  const finalizeContentPlay = () => {
    setIsAdPlaying(false);
    setAdLoading(false);
    setAdSecondsElapsed(0);
    if (skipIntervalRef.current) {
      window.clearInterval(skipIntervalRef.current);
      skipIntervalRef.current = null;
    }
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
      {/* Dynamic Header */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-[220] bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <button onClick={onClose} className="flex items-center text-white hover:text-gray-300 transition-colors group pointer-events-auto">
          <ArrowLeft className="w-8 h-8 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xl font-bold hidden md:inline tracking-tight">Back</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-black truncate max-w-xs md:max-w-md uppercase tracking-tighter text-white">
            {isAdPlaying ? 'Sponsored Advertisement' : movie.title}
          </h2>
        </div>

        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors pointer-events-auto">
          <X className="w-8 h-8 text-white" />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-black relative group">
        {/* Loading Overlay */}
        {adLoading && !needsClickToStart && (
          <div className="absolute inset-0 z-[215] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-white animate-pulse">Establishing Secure Stream...</p>
          </div>
        )}

        {/* Start Experience / User Gesture Guard */}
        {needsClickToStart && (
          <div className="absolute inset-0 z-[216] flex flex-col items-center justify-center bg-black/90 px-6 text-center">
             <button 
              onClick={handleStartBroadcast}
              className="flex flex-col items-center space-y-6 hover:scale-105 transition-transform group/start"
             >
                <div className="w-24 h-24 md:w-32 md:h-32 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(229,9,20,0.6)] group-hover/start:shadow-red-600/80 transition-shadow">
                  <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-white fill-white/20" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm md:text-xl font-black uppercase tracking-[0.4em] text-white">Watch BroadCast</span>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Pre-roll sponsorship may play</p>
                </div>
             </button>
          </div>
        )}

        {/* Custom Skip Ad Button */}
        {isAdPlaying && (
          <div className="absolute bottom-24 right-0 z-[220] flex items-end justify-end pointer-events-none pr-0 sm:pr-8">
            <button 
              onClick={handleSkipAd}
              disabled={adSecondsElapsed < SKIP_THRESHOLD}
              className={`pointer-events-auto flex items-center space-x-2 px-6 py-3 bg-black/70 border-y border-l border-white/10 text-white transition-all duration-300 ${
                adSecondsElapsed >= SKIP_THRESHOLD 
                ? 'opacity-100 translate-x-0 hover:bg-white/20 active:scale-95' 
                : 'opacity-80 translate-x-4 grayscale'
              }`}
            >
              {adSecondsElapsed >= SKIP_THRESHOLD ? (
                <>
                  <span className="text-sm font-black uppercase tracking-widest">Skip Ad</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  You can skip in {SKIP_THRESHOLD - adSecondsElapsed}s
                </span>
              )}
            </button>
          </div>
        )}

        <div data-vjs-player className="w-full h-full">
          <video id="my-video" ref={videoRef} className="video-js vjs-big-play-centered vjs-theme-netflix" playsInline />
        </div>

        {/* Custom Overlay Controls */}
        {!adLoading && !isAdPlaying && !needsClickToStart && (
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
        .video-js { width: 100%; height: 100%; }
        /* Style adjustments for the skip button container to ensure it stays above the IMA container */
        .vjs-ima-ad-container + div { pointer-events: none; }
      `}</style>
    </div>
  );
};

export default VideoPlayer;