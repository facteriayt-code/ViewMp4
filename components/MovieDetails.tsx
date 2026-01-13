
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Play, ThumbsUp, Sparkles, User, Share2, Check, Eye, Zap, TrendingUp, PlayCircle } from 'lucide-react';
import { Movie } from '../types.ts';
import { getMovieAIInsight } from '../services/geminiService.ts';
import AdBanner from './AdBanner.tsx';

interface MovieDetailsProps {
  movie: movie;
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-xl overflow-y-auto modal-scroll-container">
      {/* MOBILE STICKY PLAY FOOTER */}
      <div className="fixed bottom-0 left-0 w-full p-4 z-[110] md:hidden bg-gradient-to-t from-black via-black/80 to-transparent">
        <button 
          onClick={() => onPlay(movie)}
          className="w-full bg-red-600 text-white py-4 rounded-xl flex items-center justify-center font-black uppercase tracking-widest shadow-[0_0_30px_rgba(229,9,20,0.5)] active:scale-95 transition-all"
        >
          <PlayCircle className="w-6 h-6 mr-2 fill-white" />
          Watch Video Now
        </button>
      </div>

      <div className="relative bg-[#181818] w-full max-w-4xl min-h-screen md:min-h-0 md:my-8 md:rounded-3xl overflow-hidden shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-300 pb-24 md:pb-0">
        
        {/* Top Control Bar */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-[70]">
           <div className="flex space-x-2">
              {movie.isUserUploaded && (
                <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center shadow-lg border border-white/20">
                  <Zap className="w-3 h-3 mr-1 fill-white" /> Community Choice
                </div>
              )}
           </div>
           <button 
            onClick={onClose}
            className="bg-black/60 hover:bg-red-600 p-3 rounded-full transition-all group active:scale-90"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Hero Section with Massive Pulsing Centered Play Button */}
        <div className="relative h-[45vh] md:h-[500px] group">
          <img 
            src={movie.thumbnail} 
            alt={movie.title} 
            className="w-full h-full object-cover brightness-75 md:brightness-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/20" />
          
          {/* THE BIG PLAY BUTTON - CENTERED IN MIDDLE OF PAGE VIEW */}
          <div className="absolute inset-0 flex items-center justify-center z-[65]">
             <button 
              onClick={() => onPlay(movie)}
              className="bg-red-600 text-white w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(229,9,20,0.8)] hover:scale-110 active:scale-95 transition-all duration-300 group/play border-4 border-white/30"
             >
                <div className="relative">
                  <Play className="w-12 h-12 md:w-16 md:h-16 fill-white ml-2 animate-pulse" />
                  <div className="absolute -inset-8 bg-white/20 rounded-full animate-ping pointer-events-none" />
                </div>
             </button>
          </div>

          <div className="absolute bottom-4 left-0 w-full p-8">
            <h2 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter drop-shadow-2xl uppercase italic text-white">{movie.title}</h2>
          </div>
        </div>

        <div className="p-6 md:p-10">
           <AdBanner zoneId="10802946" className="mb-8" />
           
           <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              
              {/* PRIMARY ACTION SECTION */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button 
                  onClick={() => onPlay(movie)}
                  className="bg-white text-black px-12 py-5 rounded-2xl flex items-center font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-xl group/btn w-full sm:w-auto justify-center"
                >
                  <Play className="w-6 h-6 mr-3 fill-black group-hover/btn:scale-125 transition-transform" /> 
                  Watch Now
                </button>
                
                <div className="flex space-x-3 w-full sm:w-auto justify-center">
                  <button 
                    onClick={() => handleShare(false)}
                    className={`p-5 rounded-2xl border-2 transition-all relative flex-1 sm:flex-none flex justify-center items-center ${copied === 'info' ? 'bg-green-600 border-green-600 text-white' : 'bg-white/5 border-white/10 text-white'}`}
                  >
                    {copied === 'info' ? <Check className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                  </button>
                  <button className="bg-white/5 p-5 rounded-2xl border-2 border-white/10 text-white flex-1 sm:flex-none flex justify-center items-center">
                    <ThumbsUp className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs font-black uppercase tracking-widest text-gray-400">
                <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded">High Match</span>
                <span className="border border-white/20 px-2 py-0.5 rounded text-white">{movie.rating}</span>
                <span>{movie.year}</span>
                <span className={`flex items-center transition-all duration-300 ${viewPulse ? 'text-red-500' : ''}`}>
                  <Eye className="w-5 h-5 mr-2" />
                  {formatViews(movie.views)} Views
                </span>
              </div>
              
              {movie.uploaderName && (
                <div className="flex items-center space-x-4 p-5 bg-white/5 rounded-2xl border border-white/10 w-full sm:w-fit">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                    {movie.uploaderName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Uploaded by</p>
                    <p className="text-white font-black text-xl italic">@{movie.uploaderName}</p>
                  </div>
                </div>
              )}

              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                {movie.description}
              </p>

              <div className="bg-indigo-950/20 border border-indigo-500/20 p-8 rounded-3xl space-y-4 relative overflow-hidden group">
                 <div className="flex items-center space-x-3 text-indigo-400 font-black uppercase text-xs tracking-widest">
                    <Sparkles className="w-5 h-5" />
                    <span>Gemini AI Discovery</span>
                 </div>
                 <p className={`text-lg md:text-xl leading-snug text-indigo-100 italic font-serif ${loadingAi ? 'animate-pulse' : ''}`}>
                   "{aiInsight}"
                 </p>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 blur-[80px] rounded-full" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 shadow-xl">
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">About this video</p>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400 text-xs uppercase font-bold">Category</span>
                    <span className="text-white font-bold">{movie.genre}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400 text-xs uppercase font-bold">Format</span>
                    <span className="text-green-500 font-bold">Ultra HD</span>
                 </div>
              </div>
              
              <div className="p-5 bg-red-600/5 border border-red-600/20 rounded-2xl">
                 <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-red-500" />
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">Trending Status</p>
                 </div>
                 <p className="text-xs text-gray-400">This video is currently picking up views in your region. Watch it now!</p>
              </div>
            </div>
          </div>

          {/* COMMUNITY DISCOVERIES */}
          {suggestions.length > 0 && (
            <div className="mt-20 pt-12 border-t border-white/5">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 italic">More from the community</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {suggestions.map((sug) => (
                  <div 
                    key={sug.id}
                    className="group relative flex flex-col space-y-3"
                  >
                    <div 
                      onClick={() => onMovieSelect(sug)}
                      className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer shadow-lg hover:border-red-600/50 transition-all duration-300"
                    >
                      <img 
                        src={sug.thumbnail} 
                        alt={sug.title} 
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-50 transition-all duration-500" 
                      />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div 
                          onClick={(e) => { e.stopPropagation(); onPlay(sug); }}
                          className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 scale-100 sm:scale-50 group-hover:scale-100 shadow-xl border border-white/20"
                         >
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                         </div>
                      </div>

                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[8px] md:text-[10px] font-black text-white flex items-center">
                        <Eye className="w-3 h-3 mr-1 text-red-500" />
                        {formatViews(sug.views)}
                      </div>
                    </div>
                    <div onClick={() => onMovieSelect(sug)} className="cursor-pointer">
                      <h4 className="text-sm font-black text-gray-200 truncate group-hover:text-red-500 transition-colors uppercase italic">{sug.title}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">@{sug.uploaderName || 'Anonymous'}</p>
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
