
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, SkipForward, Info, Volume2, VolumeX } from 'lucide-react';
import { Movie } from '../types.ts';
import { incrementMovieView } from '../services/storageService.ts';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

const AD_VIDEOS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
];

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const [isAdPlaying, setIsAdPlaying] = useState(true);
  const [adUrl] = useState(() => AD_VIDEOS[Math.floor(Math.random() * AD_VIDEOS.length)]);
  const [skipTimer, setSkipTimer] = useState(5);
  const [isMuted, setIsMuted] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timer: number;
    if (isAdPlaying && skipTimer > 0) {
      timer = window.setInterval(() => {
        setSkipTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAdPlaying, skipTimer]);

  useEffect(() => {
    if (!isAdPlaying && !viewTracked && movie.id) {
      incrementMovieView(movie.id);
      setViewTracked(true);
    }
  }, [isAdPlaying, viewTracked, movie.id]);

  const handleAdEnd = () => {
    setIsAdPlaying(false);
  };

  const skipAd = () => {
    if (skipTimer <= 0) {
      setIsAdPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-30 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <button 
          onClick={onClose}
          className="flex items-center text-white hover:text-gray-300 transition-colors group pointer-events-auto"
        >
          <ArrowLeft className="w-8 h-8 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xl font-bold hidden md:inline">Back to Browsing</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-bold">
            {isAdPlaying ? 'Sponsored Content' : movie.title}
          </h2>
          <p className="text-xs md:text-sm text-gray-400">
            {isAdPlaying ? 'Advertisement' : 'Playing Now'}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors pointer-events-auto"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-black relative">
        {isAdPlaying && (
          <div className="absolute top-24 left-8 z-40 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded flex items-center space-x-2">
            <Info className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Ad</span>
          </div>
        )}

        <button 
          onClick={toggleMute}
          className="absolute bottom-10 left-10 z-40 p-3 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 text-white transition-all active:scale-95"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        {isAdPlaying && (
          <div className="absolute bottom-10 right-10 z-40">
            <button
              onClick={skipAd}
              disabled={skipTimer > 0}
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg border backdrop-blur-xl transition-all ${
                skipTimer > 0 
                ? 'bg-black/40 border-white/10 text-gray-500 cursor-not-allowed' 
                : 'bg-white/10 hover:bg-white/20 border-white/30 text-white active:scale-95'
              }`}
            >
              <span className="text-sm font-black uppercase tracking-widest">
                {skipTimer > 0 ? `Skip in ${skipTimer}...` : 'Skip Ad'}
              </span>
              <SkipForward className={`w-5 h-5 ${skipTimer > 0 ? 'opacity-20' : 'animate-pulse'}`} />
            </button>
          </div>
        )}

        {(isAdPlaying || movie.videoUrl) ? (
          <video 
            ref={videoRef}
            key={isAdPlaying ? 'ad' : 'movie'}
            src={isAdPlaying ? adUrl : movie.videoUrl} 
            className="w-full h-full max-h-screen object-contain"
            controls={!isAdPlaying}
            autoPlay
            onEnded={isAdPlaying ? handleAdEnd : undefined}
            poster={movie.thumbnail}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-center space-y-4 px-6">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold">No Playable Video Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              This movie ("{movie.title}") doesn't have a direct video stream.
            </p>
            <button onClick={onClose} className="bg-white text-black px-8 py-2 rounded font-bold">Go Back</button>
          </div>
        )}
      </div>

      {isAdPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
           <div className="h-full bg-yellow-500 transition-all duration-1000 animate-ad-progress" style={{ width: '0%' }} />
        </div>
      )}
      
      <style>{`
        @keyframes ad-progress { from { width: 0%; } to { width: 100%; } }
        .animate-ad-progress { animation: ad-progress 30s linear forwards; }
      `}</style>
    </div>
  );
};

export default VideoPlayer;