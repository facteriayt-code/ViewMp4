
import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Movie } from '../types.ts';

interface VideoPlayerProps {
  movie: Movie;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={onClose}
          className="flex items-center text-white hover:text-gray-300 transition-colors group"
        >
          <ArrowLeft className="w-8 h-8 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xl font-bold hidden md:inline">Back to Browsing</span>
        </button>
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-bold">{movie.title}</h2>
          <p className="text-xs md:text-sm text-gray-400">Playing Now</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="w-full h-full flex items-center justify-center bg-black">
        {movie.videoUrl ? (
          <video 
            src={movie.videoUrl} 
            className="w-full h-full max-h-screen"
            controls
            autoPlay
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
              This demo movie ("{movie.title}") uses a static image. Please upload a real video to test the player functionality!
            </p>
            <button 
              onClick={onClose}
              className="bg-white text-black px-8 py-2 rounded font-bold hover:bg-gray-200 transition"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
