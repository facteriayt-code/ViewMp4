
import React, { useState, useEffect } from 'react';
import { X, Play, Plus, ThumbsUp, Sparkles, User, Share2, Check, Eye } from 'lucide-react';
import { Movie } from '../types.ts';
import { getMovieAIInsight } from '../services/geminiService.ts';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

const formatViews = (views: number) => {
  return new Intl.NumberFormat('en-US').format(views);
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose, onPlay }) => {
  const [aiInsight, setAiInsight] = useState<string>('Summoning Gemini intelligence...');
  const [loadingAi, setLoadingAi] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAI = async () => {
      setLoadingAi(true);
      const insight = await getMovieAIInsight(movie.title);
      setAiInsight(insight);
      setLoadingAi(false);
    };
    fetchAI();
  }, [movie]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?v=${movie.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-[#181818] w-full max-w-4xl my-8 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative h-64 md:h-96">
          <img 
            src={movie.thumbnail} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent" />
          <div className="absolute bottom-8 left-8">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{movie.title}</h2>
            <div className="flex space-x-4">
              <button 
                onClick={() => onPlay(movie)}
                className="bg-white text-black px-8 py-2 rounded flex items-center font-bold hover:bg-gray-200 transition active:scale-95"
              >
                <Play className="w-5 h-5 mr-2 fill-black" /> Play
              </button>
              <button className="bg-gray-500/50 p-2 rounded-full border-2 border-white/20 hover:border-white transition">
                <Plus className="w-6 h-6" />
              </button>
              <button className="bg-gray-500/50 p-2 rounded-full border-2 border-white/20 hover:border-white transition">
                <ThumbsUp className="w-6 h-6" />
              </button>
              <button 
                onClick={handleShare}
                className={`p-2 rounded-full border-2 transition flex items-center justify-center relative ${copied ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-500/50 border-white/20 hover:border-white text-white'}`}
                title="Copy Share Link"
              >
                {copied ? <Check className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                {copied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-1 uppercase tracking-widest whitespace-nowrap">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3 text-sm font-semibold">
              <span className="text-green-500">98% Match</span>
              <span className="border border-gray-500 px-1 text-xs">{movie.rating}</span>
              <span>{movie.year}</span>
              <span className="flex items-center text-gray-400">
                <Eye className="w-4 h-4 mr-1" />
                {formatViews(movie.views)} views
              </span>
              <span className="border border-gray-500 px-1 text-[10px] rounded">HD</span>
            </div>
            
            {movie.uploaderName && (
              <div className="flex items-center space-x-2 text-sm text-gray-400 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/10">
                <User className="w-4 h-4" />
                <span>Uploaded by <span className="text-white font-bold">{movie.uploaderName}</span></span>
              </div>
            )}

            <p className="text-gray-200 text-lg leading-relaxed">
              {movie.description}
            </p>

            <div className="bg-indigo-950/30 border border-indigo-500/30 p-6 rounded-xl space-y-3 relative overflow-hidden group">
               <div className="flex items-center space-x-2 text-indigo-400 font-bold uppercase text-xs tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Discovery</span>
               </div>
               <p className={`italic text-indigo-100 ${loadingAi ? 'animate-pulse' : ''}`}>
                 "{aiInsight}"
               </p>
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[60px] rounded-full" />
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-500">Genre:</span> <span className="text-gray-200">{movie.genre}</span>
            </div>
            <div>
              <span className="text-gray-500">Available in:</span> <span className="text-gray-200">4K, Atmos, HDR</span>
            </div>
            <div className="pt-4 border-t border-gray-800">
               <p className="text-xs text-gray-500 italic">User Content? {movie.isUserUploaded ? 'Yes' : 'Original Selection'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;