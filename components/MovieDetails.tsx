
import React, { useState, useEffect, useMemo } from 'react';
import { X, Play, Share2, Check, Eye, TrendingUp, PlayCircle, Trash2, Edit3, AlertCircle, Loader2, Sparkles, Brain } from 'lucide-react';
import { Movie, User } from '../types.ts';
import { deleteVideoFromCloud } from '../services/storageService.ts';
import { getMovieAIInsight } from '../services/geminiService.ts';
import AdBanner from './AdBanner.tsx';

interface MovieDetailsProps {
  movie: Movie;
  allMovies: Movie[];
  user: User | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onMovieSelect: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
}

const formatViews = (views: number) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, allMovies, user, onClose, onPlay, onMovieSelect, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const isOwner = user && movie.uploaderId === user.id;

  useEffect(() => {
    const modal = document.querySelector('.modal-scroll-container');
    if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Fetch AI Insight when movie changes
    const fetchInsight = async () => {
      setIsLoadingInsight(true);
      setAiInsight(null);
      try {
        const insight = await getMovieAIInsight(movie.title);
        setAiInsight(insight);
      } catch (err) {
        setAiInsight("AI insight is currently resting.");
      } finally {
        setIsLoadingInsight(false);
      }
    };
    
    fetchInsight();
  }, [movie.id, movie.title]);

  const suggestions = useMemo(() => {
    return allMovies
      .filter(m => m.id !== movie.id)
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);
  }, [allMovies, movie.id]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?v=${movie.id}&autoplay=true`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDelete = async () => {
    if (!movie.id) return;
    setIsDeleting(true);
    try {
      await deleteVideoFromCloud(movie.id);
      onClose();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto modal-scroll-container">
      <div className="relative bg-[#141414] w-full max-w-3xl min-h-screen md:min-h-0 md:rounded-2xl overflow-hidden shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-200 mb-10 md:mb-0">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] bg-black/60 hover:bg-red-600 p-2 rounded-full transition-all active:scale-90 shadow-lg"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* 1. Video Thumbnail with Central Play Button */}
        <div className="relative aspect-video group">
          <img 
            src={movie.thumbnail} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />
          
          <div className="absolute inset-0 flex items-center justify-center">
             <button 
              onClick={() => onPlay(movie)}
              className="bg-red-600 text-white w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(229,9,20,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white/20"
             >
                <Play className="w-8 h-8 md:w-12 md:h-12 fill-white ml-1 md:ml-2" />
             </button>
          </div>

          {/* Owner Badge */}
          {isOwner && (
            <div className="absolute top-4 left-4 flex items-center bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl border border-blue-400/30">
              Your Upload
            </div>
          )}
        </div>

        {/* 2. Content Details & Actions */}
        <div className="p-5 md:p-8 space-y-5 md:space-y-6">
          {/* Owner controls */}
          {isOwner && (
            <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-auto">Owner Controls</span>
              <button 
                onClick={() => onEdit(movie)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              
              {!showConfirmDelete ? (
                <button 
                  onClick={() => setShowConfirmDelete(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg text-xs font-bold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 animate-in slide-in-from-right-2 duration-200">
                  <span className="text-[10px] text-red-500 font-bold uppercase">Confirm?</span>
                  <button 
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={() => setShowConfirmDelete(false)}
                    className="p-1.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">
              {movie.title}
            </h2>
            <div className="flex items-center space-x-3 md:space-x-4 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span>{movie.year}</span>
              <span>•</span>
              <span className="text-green-500">{movie.rating}</span>
              <span>•</span>
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" /> {formatViews(movie.views)}
              </span>
            </div>
          </div>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-4">
            {movie.description}
          </p>

          {/* AI Insights Section */}
          <div className="relative overflow-hidden group/ai">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-purple-600/5 rounded-2xl border border-white/5 group-hover/ai:border-white/10 transition-colors"></div>
            <div className="relative p-4 md:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-red-600/10 p-1.5 rounded-lg border border-red-600/20">
                    <Sparkles className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em] italic">AI Insights Powered by Gemini</h3>
                </div>
                {isLoadingInsight && <Loader2 className="w-3 h-3 text-red-600 animate-spin" />}
              </div>
              
              <div className="min-h-[60px]">
                {isLoadingInsight ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-white/5 rounded-full w-full"></div>
                    <div className="h-3 bg-white/5 rounded-full w-3/4"></div>
                  </div>
                ) : aiInsight ? (
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-medium italic animate-in fade-in slide-in-from-bottom-1 duration-500">
                    "{aiInsight}"
                  </p>
                ) : (
                  <p className="text-gray-500 text-xs italic">Insight pending...</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={() => onPlay(movie)}
              className="flex-1 bg-white text-black py-3 md:py-4 rounded-xl flex items-center justify-center font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-lg text-xs md:text-sm"
            >
              <PlayCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 fill-black" />
              Watch Now
            </button>
            
            <button 
              onClick={handleShare}
              className={`flex-1 py-3 md:py-4 rounded-xl flex items-center justify-center font-black uppercase tracking-widest transition-all active:scale-95 border-2 text-xs md:text-sm ${copied ? 'bg-green-600 border-green-600 text-white' : 'bg-transparent border-white/10 text-white hover:bg-white/5'}`}
            >
              {copied ? <Check className="w-5 h-5 md:w-6 md:h-6 mr-2" /> : <Share2 className="w-5 h-5 md:w-6 md:h-6 mr-2" />}
              {copied ? 'Link Copied' : 'Share Link'}
            </button>
          </div>

          <div className="py-2 overflow-hidden">
            <AdBanner />
          </div>

          <div className="pt-6 md:pt-8 border-t border-white/5 space-y-4">
            <div className="flex items-center space-x-2 text-gray-100">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <h3 className="text-base md:text-lg font-black uppercase tracking-tighter">Recommended</h3>
            </div>
            
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
              {suggestions.map((sug) => (
                <div 
                  key={sug.id}
                  onClick={() => onMovieSelect(sug)}
                  className="relative aspect-video rounded-lg overflow-hidden border border-white/5 cursor-pointer hover:scale-105 transition duration-300 group/sug shadow-lg"
                >
                   <img src={sug.thumbnail} alt={sug.title} className="w-full h-full object-cover brightness-75 group-hover/sug:brightness-100 transition" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                      <p className="text-[10px] font-black text-white uppercase truncate">{sug.title}</p>
                      <p className="text-[8px] font-bold text-gray-400">{sug.year} • {formatViews(sug.views)}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
