import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ArrowLeft, Volume2, VolumeX, AlertCircle, Loader2, PlayCircle, SkipForward, ChevronRight, Play, Pause, RotateCcw, RotateCw, Maximize, Minimize, Settings, FastForward } from 'lucide-react';
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
  const controlsTimeoutRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [needsClickToStart, setNeedsClickToStart] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isHoveringProgressBar, setIsHoveringProgressBar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-hide controls logic
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !isHoveringProgressBar) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, isHoveringProgressBar]);

  useEffect(() => {
    if (!videoRef.current) return;

    // 1. Basic Player Setup
    const player = videojs(videoRef.current, {
      autoplay: false,
      controls: false, // We use our own custom UI
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
      setIsAdPlaying(false);
      setAdLoading(false);
      if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
      if (player) {
        player.removeClass('vjs-ad-playing');
        player.removeClass('vjs-ad-loading');
        player.play();
        setIsPlaying(true);
      }
    };

    // 2. IMA Initialization
    player.ready(() => {
      if (player.ima) {
        const imaOptions = {
          id: 'my-video',
          adTagUrl: 'https://improbablehospital.com/dOm.FfzgddGkNWvTZLGNUn/XeimA9euBZUUQlwkNP/TmY/3lNeDwg_xwMej/MFtfNxjNcj0ROEDjEpyPNJCAZGsta-WG1-pndaDk0/xp',
          showCountdown: false,
          debug: false,
          adsResponseTimeout: 8000,
          adWillAutoPlay: true
        };

        try {
          player.ima(imaOptions);
          player.on('ads-ad-started', () => {
            setIsAdPlaying(true);
            setAdLoading(false);
            if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
          });
          player.on('ads-ad-ended', finalizeAndPlay);
          player.on('ads-all-ads-completed', finalizeAndPlay);
          player.on('ads-error', finalizeAndPlay);
          player.on('aderror', finalizeAndPlay);
          player.on('contentresumerequested', finalizeAndPlay);
        } catch (e) {
          finalizeAndPlay();
        }
      } else {
        finalizeAndPlay();
      }
    });

    // Time Tracking
    player.on('timeupdate', () => {
      setCurrentTime(player.currentTime());
      setDuration(player.duration());
    });

    player.on('play', () => setIsPlaying(true));
    player.on('pause', () => setIsPlaying(false));
    player.on('volumechange', () => {
      setIsMuted(player.muted());
      setVolume(player.volume());
    });

    // View Tracking
    player.on('contentplay', () => {
      if (movie.id) incrementMovieView(movie.id);
    });

    return () => {
      if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (playerRef.current) playerRef.current.dispose();
    };
  }, [movie]);

  const handleStartBroadcast = () => {
    setNeedsClickToStart(false);
    setAdLoading(true);
    if (playerRef.current) {
      if (playerRef.current.ima && playerRef.current.ima.initializeAdDisplayContainer) {
        playerRef.current.ima.initializeAdDisplayContainer();
        playerRef.current.ima.requestAds();
      }
      playerRef.current.play();
      adTimeoutRef.current = window.setTimeout(() => {
        if (!isAdPlaying) finalizeContentPlay();
      }, 8000);
    }
  };

  const finalizeContentPlay = () => {
    setIsAdPlaying(false);
    setAdLoading(false);
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  // Control Handlers
  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  };

  const seek = (seconds: number) => {
    if (playerRef.current) {
      const newTime = playerRef.current.currentTime() + seconds;
      playerRef.current.currentTime(Math.max(0, Math.min(newTime, duration)));
      resetControlsTimeout();
    }
  };

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.currentTime(time);
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      const newMuted = !isMuted;
      playerRef.current.muted(newMuted);
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.volume(val);
      playerRef.current.muted(val === 0);
      setVolume(val);
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (playerRef.current.isFullscreen()) {
        playerRef.current.exitFullscreen();
        setIsFullscreen(false);
      } else {
        playerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden cursor-none"
      onMouseMove={() => {
        resetControlsTimeout();
        document.body.style.cursor = 'default';
      }}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      {/* Header Overlay */}
      <div className={`absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-[220] bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 ${showControls || needsClickToStart ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={onClose} className="flex items-center text-white hover:text-gray-300 transition-colors group">
          <ArrowLeft className="w-8 h-8 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xl font-bold hidden md:inline tracking-tight">Back</span>
        </button>
        
        <div className="text-center flex-1 mx-4">
          <h2 className="text-lg md:text-2xl font-black truncate max-w-xs md:max-w-md uppercase tracking-tighter text-white">
            {isAdPlaying ? 'Advertisement' : movie.title}
          </h2>
        </div>

        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-8 h-8 text-white" />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-black relative group" onClick={() => !needsClickToStart && !isAdPlaying && togglePlay()}>
        {/* Ad Components */}
        {adLoading && !needsClickToStart && (
          <div className="absolute inset-0 z-[215] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-white">Establishing Stream...</p>
          </div>
        )}

        {needsClickToStart && (
          <div className="absolute inset-0 z-[216] flex flex-col items-center justify-center bg-black/90 px-6 text-center">
             <button onClick={handleStartBroadcast} className="flex flex-col items-center space-y-6 hover:scale-105 transition-transform group/start">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(229,9,20,0.6)] group-hover/start:shadow-red-600/80">
                  <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-white fill-white/20" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm md:text-xl font-black uppercase tracking-[0.4em] text-white">Watch BroadCast</span>
                </div>
             </button>
          </div>
        )}

        {isAdPlaying && (
          <div className="absolute bottom-24 right-0 z-[220] flex items-end justify-end">
            <button 
              onClick={(e) => { e.stopPropagation(); if (playerRef.current?.ima?.getAdsManager()) playerRef.current.ima.getAdsManager().skip(); }}
              className="flex items-center space-x-2 px-6 py-3 bg-black/70 border-y border-l border-white/10 text-white hover:bg-white/20"
            >
              <span className="text-sm font-black uppercase tracking-widest">Skip Ad</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Video Surface */}
        <div data-vjs-player className="w-full h-full">
          <video id="my-video" ref={videoRef} className="video-js vjs-big-play-centered" playsInline />
        </div>

        {/* Custom Playback Controls Overlay */}
        {!isAdPlaying && !needsClickToStart && (
          <div className={`absolute inset-0 z-[210] flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* Center Play/Pause Large Toggle */}
            <div className="absolute inset-0 flex items-center justify-center space-x-20 pointer-events-none">
              <button onClick={(e) => { e.stopPropagation(); seek(-10); }} className="p-4 rounded-full bg-black/20 hover:bg-black/40 transition-all active:scale-90 pointer-events-auto">
                <RotateCcw className="w-10 h-10 text-white" />
              </button>
              <button onClick={togglePlay} className="w-24 h-24 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 transition-all active:scale-95 pointer-events-auto">
                {isPlaying ? <Pause className="w-12 h-12 text-white fill-white" /> : <Play className="w-12 h-12 text-white fill-white ml-2" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); seek(10); }} className="p-4 rounded-full bg-black/20 hover:bg-black/40 transition-all active:scale-90 pointer-events-auto">
                <RotateCw className="w-10 h-10 text-white" />
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div className="p-4 md:p-8 space-y-4" onClick={(e) => e.stopPropagation()}>
              
              {/* Progress Slider */}
              <div 
                className="relative flex flex-col group/progress pt-6"
                onMouseEnter={() => setIsHoveringProgressBar(true)}
                onMouseLeave={() => setIsHoveringProgressBar(false)}
              >
                <div className="flex justify-between mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration - currentTime)}</span>
                </div>
                <div className="relative w-full flex items-center">
                   <input 
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleProgressBarChange}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-red-600 z-10 hover:h-2 transition-all"
                   />
                   <div 
                    className="absolute h-1 bg-red-600 rounded-full pointer-events-none transition-all" 
                    style={{ width: `${(currentTime / duration) * 100}%` }} 
                   />
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 md:space-x-8">
                  <button onClick={togglePlay} className="text-white hover:scale-110 transition">
                    {isPlaying ? <Pause className="w-6 h-6 md:w-8 md:h-8 fill-white" /> : <Play className="w-6 h-6 md:w-8 md:h-8 fill-white" />}
                  </button>
                  
                  <div className="flex items-center space-x-2 group/volume">
                    <button onClick={toggleMute} className="text-white hover:scale-110 transition">
                      {isMuted || volume === 0 ? <VolumeX className="w-6 h-6 md:w-8 md:h-8" /> : <Volume2 className="w-6 h-6 md:w-8 md:h-8" />}
                    </button>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-20 md:group-hover/volume:w-32 transition-all overflow-hidden h-1 accent-white"
                    />
                  </div>

                  <div className="hidden md:flex flex-col justify-center">
                    <span className="text-sm font-black text-white uppercase tracking-tighter truncate max-w-[200px]">{movie.title}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 md:space-x-8">
                  <button className="text-white opacity-50 hover:opacity-100 transition hidden sm:block">
                    <Settings className="w-6 h-6" />
                  </button>
                  <button onClick={toggleFullscreen} className="text-white hover:scale-110 transition">
                    {isFullscreen ? <Minimize className="w-6 h-6 md:w-8 md:h-8" /> : <Maximize className="w-6 h-6 md:w-8 md:h-8" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .vjs-ima-ad-container { z-index: 215 !important; }
        .video-js { width: 100%; height: 100%; border: none !important; }
        .vjs-control-bar { display: none !important; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #E50914;
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #E50914;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;