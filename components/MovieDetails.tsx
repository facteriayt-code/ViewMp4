
import React, { useState, useEffect } from 'react';
import { X, Play, Plus, ThumbsUp, Sparkles, User, Trash2, ShieldAlert } from 'lucide-react';
import { Movie, User as UserType } from '../types.ts';
import { getMovieAIInsight } from '../services/geminiService.ts';
import { deleteMovieFromCloud } from '../services/storageService.ts';

interface MovieDetailsProps {
  movie: Movie;
  currentUser: UserType | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onDeleted?: (movieId: string) => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, currentUser, onClose, onPlay, onDeleted }) => {
  const [aiInsight, setAiInsight] = useState<string>('Summoning Gemini intelligence...');
  const [loadingAi, setLoadingAi] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAI = async () => {
      setLoadingAi(true);
      const insight = await getMovieAIInsight(movie.title);
      setAiInsight(insight);
      setLoadingAi(false);
    };
    fetchAI();
  }, [movie]);

  const isAdmin = currentUser?.role === 'admin';

  const handleDelete = async () => {
    if (!window.confirm("Admin Alert: Are you sure you want to delete this movie from the global feed?")) return;
    
    setIsDeleting(true);
    try {
      await deleteMovieFromCloud(movie.id);
      onDeleted?.(movie.id);
      onClose();
    } catch (err) {
      alert("Failed to delete. DB Connection error.");
    } finally {
      setIsDeleting(false);
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
          <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
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
              
              {isAdmin && (
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600/20 text-red-500 p-2 rounded-lg border-2 border-red-500/20 hover:bg-red-600 hover:text-white transition active:scale-95 flex items-center space-x-2 px-4"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3 text-sm font-semibold text-gray-400">
               <span className="text-green-500">98% Match</span>
               <span className="border border-gray-700 px-1 text-xs">{movie.rating}</span>
               <span>{movie.year}</span>
               {movie.isFeatured && <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Featured</span>}
            </div>
            
            <p className="text-gray-200 text-lg leading-relaxed">{movie.description}</p>

            <div className="bg-indigo-950/30 border border-indigo-500/30 p-6 rounded-xl space-y-3 relative overflow-hidden">
               <div className="flex items-center space-x-2 text-indigo-400 font-bold uppercase text-xs tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Insight</span>
               </div>
               <p className={`italic text-indigo-100 ${loadingAi ? 'animate-pulse' : ''}`}>"{aiInsight}"</p>
            </div>
          </div>

          <div className="space-y-4 text-sm border-l border-gray-800 pl-8">
            <div><span className="text-gray-500">Genre:</span> <span className="text-gray-200">{movie.genre}</span></div>
            <div><span className="text-gray-500">Quality:</span> <span className="text-gray-200 font-bold">4K UHD</span></div>
            {isAdmin && (
              <div className="mt-8 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">Admin Zone</span>
                </div>
                <p className="text-[10px] text-gray-500">You can edit metadata or remove this video because you are a Content Manager.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
