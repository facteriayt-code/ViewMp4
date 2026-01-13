
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Play, Plus, ThumbsUp, Sparkles, User, Share2, Check, Eye, Zap, TrendingUp } from 'lucide-react';
import { Movie } from '../types.ts';
import { getMovieAIInsight } from '../services/geminiService.ts';
import AdBanner from './AdBanner.tsx';

interface MovieDetailsProps {
  movie: Movie;
  allMovies: Movie[];
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onMovieSelect: (movie: Movie) => void;
}

const formatViews = (views: number) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, allMovies, onClose, onPlay, onMovieSelect }) => {
  const [aiInsight, setAiInsight] = useState<string>('Summoning Gemini intelligence...');
  const [loadingAi, setLoadingAi] = useState(true);
  const [copied, setCopied] = useState<'info' | 'play' | null>(null);
  const [viewPulse, setViewPulse] = useState(false);
  const prevViews = useRef(movie.views);

  useEffect(() => {
    const fetchAI = async () => {
      setLoadingAi(true);
      const insight = await getMovieAIInsight(movie.title);
      setAiInsight(insight);
      setLoadingAi(false);
    };
    fetchAI();
    
    const modal = document.querySelector('.modal-scroll-container');
    if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movie.id]);

  useEffect(() => {
    if (movie.views !== prevViews.current) {
      setViewPulse(true);
      const timer = setTimeout(() => setViewPulse(false), 1000);
      prevViews.current = movie.views;
      return () => clearTimeout(timer);
    }
  }, [movie.views]);

  const suggestions = useMemo(() => {
    return allMovies
      .filter(m => m.isUserUploaded === true && m.id !== movie.id)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }, [allMovies, movie.id]);

  const handleShare = async (directPlay: boolean = false) => {
    const shareUrl = `${window.location.origin}?v=${movie.id}${directPlay ? '&autoplay=true' : ''}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(directPlay ? 'play' : 'info');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto modal-scroll-container">
      <div className="relative bg-[#181818] w-full max-w-4xl my-8 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
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
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <button 
              onClick={() => onPlay(movie)}
              className="pointer-events-auto bg-red-600/90 text-white w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.5)] hover:scale-110 active:scale-95 transition-transform duration-300 hover:bg-red-600"
             >
                <Play className="w-8 h-8 md:w-12 md:h-12 fill-white ml-1.5" />
             </button>
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter drop-shadow-xl">{movie.title}</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <button 
                onClick={() => onPlay(movie)}
                className="bg-white text-black px-10 py-3 rounded flex items-center font-black uppercase tracking-widest hover:bg-gray-200 transition active:scale-95 shadow-lg"
              >
                <Play className="w-5 h-5 mr-2 fill-black" /> Play Now
              </button>
              
              <div className="hidden sm:block h-10 w-px bg-white/10 mx-2" />

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleShare(false)}
                  className={`p-3 rounded-full border-2 transition flex items-center justify-center relative ${copied === 'info' ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-500/50 border-white/20 hover:border-white text-white'}`}
                  title="Share Info Page"
                >
                  {copied === 'info' ? <Check className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                  {copied === 'info' && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-1 uppercase tracking-widest whitespace-nowrap">
                      Link Copied!
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => handleShare(true)}
                  className={`p-3 rounded-full border-2 transition flex items-center justify-center relative ${copied === 'play' ? 'bg-orange-600 border-orange-600 text-white' : 'bg-gray-500/50 border-white/20 hover:border-orange-500 text-white'}`}
                  title="Share Direct Play Link"
                >
                  {copied === 'play' ? <Check className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                </button>

                <button className="bg-gray-500/50 p-3 rounded-full border-2 border-white/20 hover:border-white transition text-white">
                  <ThumbsUp className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pb-4">
           <AdBanner zoneId="10802946" className="mb-6" />
           
           <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                <span className="text-green-500">98% Match</span>
                <span className="border border-gray-500 px-1 text-xs">{movie.rating}</span>
                <span>{movie.year}</span>
                <span className={`flex items-center transition-all duration-300 ${viewPulse ? 'text-red-500 scale-110 font-black' : 'text-gray-400'}`}>
                  <Eye className={`w-4 h-4 mr-1 ${viewPulse ? 'animate-bounce' : ''}`} />
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
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Genre:</span> <span className="text-gray-200">{movie.genre}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-500">Category:</span> <span className="text-gray-200">{movie.isUserUploaded ? 'Community Content' : 'Premium Movie'}</span>
              </div>
              <div className="pt-4">
                 <p className="text-[10px] text-gray-500 italic uppercase tracking-widest font-bold">Content Security Verified</p>
              </div>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/5">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Recommended For You</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {suggestions.map((sug) => (
                  <div 
                    key={sug.id}
                    className="group relative flex flex-col space-y-2 text-left"
                  >
                    <div 
                      onClick={() => onMovieSelect(sug)}
                      className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800 border border-white/5 cursor-pointer"
                    >
                      <img 
                        src={sug.thumbnail} 
                        alt={sug.title} 
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-50" 
                      />
                      
                      <div 
                        onClick={(e) => { e.stopPropagation(); onPlay(sug); }}
                        className="absolute inset-0 m-auto w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 shadow-lg"
                      >
                         <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>

                      <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[8px] font-bold text-white flex items-center">
                        <Eye className="w-2 h-2 mr-1 text-red-500" />
                        {formatViews(sug.views)}
                      </div>
                    </div>
                    <div onClick={() => onMovieSelect(sug)} className="cursor-pointer">
                      <h4 className="text-xs font-bold text-gray-200 truncate group-hover:text-red-500 transition-colors">{sug.title}</h4>
                      <p className="text-[9px] text-gray-500 truncate">@{sug.uploaderName || 'Anonymous'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
