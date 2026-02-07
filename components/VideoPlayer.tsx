import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ArrowLeft, Volume2, VolumeX, PlayCircle, RotateCcw, RotateCw, Maximize, Minimize, Settings, Play, Pause } from 'lucide-react';
import { Movie } from '../types.ts';
import { incrementMovieView } from '../services/storageService.ts';

declare var videojs: any;

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const lastTapRef = useRef<{ time: number; side: 'left' | 'right' | null }>({ time: 0, side: null });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [needsClickToStart, setNeedsClickToStart] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isHoveringProgressBar, setIsHoveringProgressBar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [seekFeedback, setSeekFeedback] = useState<'forward' | 'backward' | null>(null);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !isHoveringProgressBar) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  }, [isPlaying, isHoveringProgressBar]);

  useEffect(() => {
    if (!videoRef.current) return;

    // Safety check for videojs
    if (typeof videojs === 'undefined') {
      console.error("VideoJS not loaded correctly. Check index.html.");
      return;
    }

    try {
      const player = videojs(videoRef.current, {
        autoplay: false,
        controls: false, 
        muted: true,
        responsive: true,
        fluid: true,
        preload: 'auto',
        poster: movie.thumbnail,
        sources: movie.videoUrl ? [{
          src: movie.videoUrl,
          type: 'video/mp4'
        }] : []
      });

      playerRef.current = player;

      player.ready(() => {
        if (movie.id) incrementMovieView(movie.id);
      });

      player.on('loadedmetadata', () => {
        setDuration(player.duration());
      });

      player.on('timeupdate', () => {
        setCurrentTime(player.currentTime());
      });

      player.on('play', () => setIsPlaying(true));
      player.on('pause', () => setIsPlaying(false));
      player.on('volumechange', () => {
        setIsMuted(player.muted());
        setVolume(player.volume());
      });
    } catch (err) {
      console.error("Video Player Init Error:", err);
    }

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
        } catch (e) {}
      }
    };
  }, [movie]);

  const handleStartBroadcast = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNeedsClickToStart(false);
    if (playerRef.current) {
      playerRef.current.muted(false);
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
      resetControlsTimeout();
    }
  };

  const seek = (seconds: number, e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    if (playerRef.current) {
      const current = playerRef.current.currentTime();
      const dur = playerRef.current.duration();
      const newTime = current + seconds;
      
      playerRef.current.currentTime(Math.max(0, Math.min(newTime, dur)));
      setCurrentTime(playerRef.current.currentTime());
      
      setSeekFeedback(seconds > 0 ? 'forward' : 'backward');
      setTimeout(() => setSeekFeedback(null), 500);
      
      resetControlsTimeout();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (needsClickToStart) return;
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const side = touch.clientX < screenWidth / 2 ? 'left' : 'right';
    const now = Date.now();
    if (lastTapRef.current.side === side && now - lastTapRef.current.time < 300) {
      seek(side === 'left' ? -10 : 10, e);
      lastTapRef.current = { time: 0, side: null };
    } else {
      lastTapRef.current = { time: now, side };
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

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
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
    if (!seconds || isNaN(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m < 10 && h > 0 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden ${showControls ? '' : 'md:cursor-none'}`}
      onMouseMove={() => resetControlsTimeout()}
      onTouchStart={handleTouchStart}
    >
      <div className={`absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-[220] bg-gradient-to-b from-black/90 to-transparent transition-all duration-500 ${showControls || needsClickToStart ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <button onClick={onClose} className="flex items-center text-white hover:text-gray-300 transition-colors group p-2">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 mr-1 md:mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm md:text-xl font-bold tracking-tight">Back</span>
        </button>
        <div className="text-center flex-1 mx-2 overflow-hidden">
          <h2 className="text-xs md:text-2xl font-black truncate uppercase tracking-tighter text-white">{movie.title}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-black relative group" onClick={() => !needsClickToStart && togglePlay()}>
        {seekFeedback && (
          <div className="absolute inset-0 z-[215] flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center bg-black/40 backdrop-blur-md p-6 rounded-full animate-in zoom-in-95 fade-in duration-200">
               {seekFeedback === 'forward' ? <RotateCw className="w-12 h-12 text-white animate-pulse" /> : <RotateCcw className="w-12 h-12 text-white animate-pulse" />}
               <span className="text-white font-black mt-2 text-xl">{seekFeedback === 'forward' ? '+10s' : '-10s'}</span>
            </div>
          </div>
        )}

        {needsClickToStart && (
          <div className="absolute inset-0 z-[216] flex flex-col items-center justify-center bg-black/90 px-6 text-center">
             <button onClick={handleStartBroadcast} className="flex flex-col items-center space-y-4 md:space-y-6 hover:scale-105 transition-transform group/start">
                <div className="w-20 h-20 md:w-32 md:h-32 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(229,9,20,0.6)] group-hover/start:shadow-red-600/80 transition-all">
                  <PlayCircle className="w-10 h-10 md:w-16 md:h-16 text-white fill-white/20" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs md:text-xl font-black uppercase tracking-[0.3em] text-white">Watch BroadCast</span>
                </div>
             </button>
          </div>
        )}

        <div data-vjs-player className="w-full h-full flex items-center justify-center">
          <video id="my-video" ref={videoRef} className="video-js vjs-big-play-centered" playsInline />
        </div>

        {!needsClickToStart && (
          <div className={`absolute inset-0 z-[210] flex flex-col justify-end bg-gradient-to-t from-black/90 via-transparent to-black/50 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`}>
            <div className="absolute inset-0 flex items-center justify-center space-x-8 md:space-x-20 pointer-events-none">
              <button onClick={(e) => seek(-10, e)} className="p-3 md:p-4 rounded-full bg-black/30 hover:bg-black/50 transition-all active:scale-90 pointer-events-auto shadow-xl group/seek">
                <RotateCcw className="w-8 h-8 md:w-12 md:h-12 text-white group-hover/seek:rotate-[-45deg] transition-transform" />
              </button>
              <button onClick={togglePlay} className="w-16 h-16 md:w-28 md:h-28 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-all active:scale-95 pointer-events-auto shadow-2xl">
                {isPlaying ? <Pause className="w-8 h-8 md:w-14 md:h-14 text-white fill-white" /> : <Play className="w-8 h-8 md:w-14 md:h-14 text-white fill-white ml-1 md:ml-2" />}
              </button>
              <button onClick={(e) => seek(10, e)} className="p-3 md:p-4 rounded-full bg-black/30 hover:bg-black/50 transition-all active:scale-90 pointer-events-auto shadow-xl group/seek">
                <RotateCw className="w-8 h-8 md:w-12 md:h-12 text-white group-hover/seek:rotate-[45deg] transition-transform" />
              </button>
            </div>

            <div className="px-4 pb-6 md:px-8 md:pb-8 space-y-2 md:space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="relative flex flex-col group/progress pt-8 pb-2" onMouseEnter={() => setIsHoveringProgressBar(true)} onMouseLeave={() => setIsHoveringProgressBar(false)}>
                <div className="flex justify-between mb-2 text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration - currentTime)}</span>
                </div>
                <div className="relative w-full h-6 flex items-center">
                   <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleProgressBarChange} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                   <div className="relative w-full h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
                   </div>
                   <div className="absolute h-3 w-3 md:h-5 md:w-5 bg-red-600 rounded-full border-2 border-white shadow-lg pointer-events-none transition-all z-10" style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - ${currentTime > duration / 2 ? '14px' : '0px'})` }} />
                </div>
              </div>

              <div className="flex items-center justify-between h-10 md:h-12">
                <div className="flex items-center space-x-4 md:space-x-8">
                  <button onClick={togglePlay} className="text-white hover:scale-110 transition p-1">
                    {isPlaying ? <Pause className="w-5 h-5 md:w-8 md:h-8 fill-white" /> : <Play className="w-5 h-5 md:w-8 md:h-8 fill-white" />}
                  </button>
                  <div className="flex items-center space-x-2 group/volume">
                    <button onClick={toggleMute} className="text-white hover:scale-110 transition p-1">
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 md:w-8 md:h-8" /> : <Volume2 className="w-5 h-5 md:w-8 md:h-8" />}
                    </button>
                    <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-0 md:group-hover/volume:w-32 transition-all overflow-hidden h-1 accent-white hidden md:block" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 md:space-x-8">
                  <button className="text-white opacity-50 hover:opacity-100 transition hidden md:block"><Settings className="w-5 h-5 md:w-6 md:h-6" /></button>
                  <button onClick={toggleFullscreen} className="text-white hover:scale-110 transition p-1">
                    {isFullscreen ? <Minimize className="w-5 h-5 md:w-8 md:h-8" /> : <Maximize className="w-5 h-5 md:w-8 md:h-8" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .video-js { width: 100% !important; height: 100% !important; border: none !important; background-color: transparent !important; }
        .vjs-control-bar { display: none !important; }
        .vjs-tech { object-fit: contain !important; }
      `}</style>
    </div>
  );
};

export default VideoPlayer;