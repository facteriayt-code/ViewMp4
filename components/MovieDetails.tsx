
import React, { useState, useEffect } from 'react';
import { X, Play, Plus, ThumbsUp, Sparkles } from 'lucide-react';
import { Movie } from '../types.ts';
import { getMovieAIInsight } from '../services/geminiService.ts';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  const [aiInsight, setAiInsight] = useState<string>('Summoning Gemini intelligence...');
  const [loadingAi, setLoadingAi] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      setLoadingAi(true);
      const insight = await getMovieAIInsight(movie.title);
      setAiInsight(insight);
      setLoadingAi(false);
    };
    fetchAI();
  }, [movie]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-[#181818] w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
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
              <button className="bg-white text-black px-8 py-2 rounded flex items-center font-bold hover:bg-gray-200 transition">
                <Play className="w-5 h-5 mr-2 fill-black" /> Play
              </button>
              <button className="bg-gray-500/50 p-2 rounded-full border-2 border-white/20 hover:border-white transition">
                <Plus className="w-6 h-6" />
              </button>
              <button className="bg-gray-500/50 p-2 rounded-full border-2 border-white/20 hover:border-white transition">
                <ThumbsUp className="w-6 h-6" />
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
              <span className="border border-gray-500 px-1 text-[10px] rounded">HD</span>
            </div>
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
