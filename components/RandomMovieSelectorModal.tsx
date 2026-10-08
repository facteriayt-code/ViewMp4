import React, { useState, useEffect } from 'react';
import { Dices, Play, Info, X, Sparkles, Star, Film, RotateCcw, Clapperboard } from 'lucide-react';
import { Movie } from '../types.ts';

interface RandomMovieSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

const GENRE_FILTERS = ['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Top Rated'];

export const RandomMovieSelectorModal: React.FC<RandomMovieSelectorModalProps> = ({
  isOpen,
  onClose,
  movies,
  onSelectMovie,
  onPlay
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [rollCount, setRollCount] = useState<number>(0);

  // Filter pool based on genre filter
  const getFilteredPool = (genre: string): Movie[] => {
    let pool = movies.filter(m => !m.isUserUploaded && (m.thumbnail || m.backdrop));
    if (pool.length === 0) pool = movies;

    if (genre === 'Top Rated') {
      return pool.filter(m => (m.userRating && m.userRating >= 7.0) || (m.rating && !m.rating.includes('G')));
    }
    if (genre !== 'All') {
      const match = pool.filter(m => 
        m.genre?.toLowerCase().includes(genre.toLowerCase()) || 
        m.description?.toLowerCase().includes(genre.toLowerCase())
      );
      if (match.length > 0) return match;
    }
    return pool;
  };

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    const pool = getFilteredPool(selectedGenre);
    if (pool.length === 0) {
      setIsRolling(false);
      return;
    }

    // Fast roulette flicker animation
    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * pool.length);
      setCurrentMovie(pool[randomIdx]);
      count++;

      if (count > 12) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * pool.length);
        setCurrentMovie(pool[finalIdx]);
        setIsRolling(false);
        setRollCount(prev => prev + 1);
      }
    }, 70);
  };

  useEffect(() => {
    if (isOpen) {
      rollDice();
    }
  }, [isOpen, selectedGenre]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-gradient-to-b from-[#161822] via-[#0f1017] to-[#090a0f] rounded-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
              <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                <span>Random Movie Selector</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                  Bingr Pick
                </span>
              </h3>
              <p className="text-xs text-gray-400">Can't decide what to watch? Let the dice choose!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-2.5 flex items-center space-x-1.5 overflow-x-auto no-scrollbar border-b border-white/5 bg-black/30">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            Genre:
          </span>
          {GENRE_FILTERS.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                if (selectedGenre !== genre) {
                  setSelectedGenre(genre);
                }
              }}
              disabled={isRolling}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-all shrink-0 ${
                selectedGenre === genre
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Movie Pick Card */}
        <div className="p-5 sm:p-6">
          {currentMovie ? (
            <div className={`transition-all duration-300 ${isRolling ? 'opacity-50 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}>
              <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-xl group">
                {/* Backdrop Image with gradient overlay */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                  <img
                    src={currentMovie.backdrop || currentMovie.thumbnail}
                    alt={currentMovie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-[#0d0f17]/60 to-transparent" />
                  
                  {/* Floating Poster Overlay */}
                  <div className="absolute bottom-3 left-4 flex items-end space-x-3.5">
                    <img
                      src={currentMovie.thumbnail || currentMovie.backdrop}
                      alt={currentMovie.title}
                      className="w-20 sm:w-24 aspect-[2/3] object-cover rounded-lg shadow-2xl border border-white/20 shrink-0"
                    />
                    <div className="pb-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                          {currentMovie.genre || 'Feature'}
                        </span>
                        <span className="text-xs text-gray-300 font-medium">{currentMovie.year}</span>
                        {currentMovie.userRating && (
                          <span className="flex items-center text-xs font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                            {currentMovie.userRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-white tracking-wide line-clamp-1 drop-shadow-md">
                        {currentMovie.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Description & Metadata */}
                <div className="p-4 sm:p-5 pt-3 bg-[#0d0f17] space-y-3">
                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed">
                    {currentMovie.description || 'An acclaimed cinema masterpiece streaming in high-definition 4K HDR.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-400">
                    <span className="flex items-center space-x-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      <Clapperboard className="w-3.5 h-3.5 text-red-500" />
                      <span>{currentMovie.rating || 'PG-13'}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>4K Ultra HD</span>
                    </span>
                    <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/30">
                      High Match Pick
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPlay(currentMovie);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all active:scale-95 group"
                >
                  <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                  <span>Watch Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectMovie(currentMovie);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all active:scale-95"
                >
                  <Info className="w-4 h-4 text-gray-300" />
                  <span>Movie Details</span>
                </button>

                <button
                  type="button"
                  onClick={rollDice}
                  disabled={isRolling}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/80 hover:to-indigo-800/80 text-purple-200 border border-purple-500/30 transition-all active:scale-95 group"
                >
                  <RotateCcw className={`w-4 h-4 text-purple-300 ${isRolling ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  <span>Roll Again</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <Dices className="w-10 h-10 mx-auto text-gray-600 animate-spin mb-3" />
              <p>Rolling movie database...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RandomMovieSelectorModal;
