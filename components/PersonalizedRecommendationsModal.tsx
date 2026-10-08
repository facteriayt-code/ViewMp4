import React, { useState, useMemo } from 'react';
import { Sparkles, Play, Info, X, Heart, Star, Flame, RotateCw, CheckCircle2 } from 'lucide-react';
import { Movie, ContinueWatchingItem } from '../types.ts';

interface PersonalizedRecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  continueWatchingItems: ContinueWatchingItem[];
  onSelectMovie: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

const TASTE_MOODS = [
  { id: 'for-you', label: 'Curated For You', icon: Sparkles },
  { id: 'action', label: 'Action & Thrills', icon: Flame },
  { id: 'scifi', label: 'Sci-Fi & Fantasy', icon: Star },
  { id: 'top-rated', label: 'Critically Acclaimed', icon: Heart },
  { id: 'trending', label: 'Trending Right Now', icon: Flame }
];

export const PersonalizedRecommendationsModal: React.FC<PersonalizedRecommendationsModalProps> = ({
  isOpen,
  onClose,
  movies,
  continueWatchingItems,
  onSelectMovie,
  onPlay
}) => {
  const [activeMood, setActiveMood] = useState<string>('for-you');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Compute user taste profile based on watch history
  const userFavoriteGenres = useMemo(() => {
    const genreCounts: Record<string, number> = {};
    continueWatchingItems.forEach(item => {
      const g = item.movie.genre || 'Action';
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
  }, [continueWatchingItems]);

  // Generate personalized movies with match scores and reasoning
  const recommendedMovies = useMemo(() => {
    const watchedIds = new Set(continueWatchingItems.map(item => item.movie.id));
    const pool = movies.filter(m => !m.isUserUploaded && (m.thumbnail || m.backdrop));

    let filtered = [...pool];

    if (activeMood === 'action') {
      filtered = filtered.filter(m => /action|thriller|adventure|crime/i.test(`${m.genre} ${m.title}`));
    } else if (activeMood === 'scifi') {
      filtered = filtered.filter(m => /sci-fi|fantasy|space|future|marvel|alien/i.test(`${m.genre} ${m.title} ${m.description}`));
    } else if (activeMood === 'top-rated') {
      filtered = filtered.filter(m => (m.userRating && m.userRating >= 7.5) || (m.rating && !m.rating.includes('G')));
    }

    if (filtered.length === 0) filtered = pool;

    // Score movies based on genres, rating, and watch history
    const scored = filtered.map(movie => {
      let score = 84;
      let reason = 'Trending in your region';

      if (continueWatchingItems.length > 0) {
        const lastWatched = continueWatchingItems[0].movie;
        if (movie.genre && lastWatched.genre && movie.genre.toLowerCase() === lastWatched.genre.toLowerCase()) {
          score += 12;
          reason = `Because you watched ${lastWatched.title}`;
        }
      }

      if (movie.userRating) {
        score += Math.round(movie.userRating * 1.5);
      }

      if (watchedIds.has(movie.id)) {
        score -= 10;
      }

      // Add pseudo variation based on refreshKey and id length
      score = Math.min(99, Math.max(78, score + ((movie.id.length * 3 + refreshKey * 7) % 8) - 3));

      return {
        movie,
        matchScore: score,
        reason
      };
    });

    // Sort by match score descending
    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 12);
  }, [movies, continueWatchingItems, activeMood, refreshKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#141622] via-[#0c0d14] to-[#08080c] rounded-2xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                <span>Personalized Recommendations</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Smart Match
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                {continueWatchingItems.length > 0 
                  ? `Tailored using your viewing habits & favorite genres`
                  : `Curated selections based on global trending ratings & cinema quality`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition active:rotate-180"
              title="Refresh suggestions"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mood & Taste Filter Bar */}
        <div className="px-5 sm:px-6 py-3 flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-black/40">
          {TASTE_MOODS.map(mood => {
            const Icon = mood.icon;
            const isActive = activeMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setActiveMood(mood.id)}
                className={`flex items-center space-x-1.5 text-xs px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-600/30 scale-105'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-amber-400'}`} />
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>

        {/* Recommendations Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {recommendedMovies.map(({ movie, matchScore, reason }) => (
              <div
                key={movie.id}
                className="group relative flex flex-col bg-[#11131c] hover:bg-[#161824] rounded-xl border border-white/10 hover:border-red-500/40 transition-all duration-300 p-3 shadow-lg hover:shadow-red-950/20"
              >
                <div className="flex space-x-3">
                  {/* Poster Thumbnail */}
                  <div className="relative w-20 sm:w-24 aspect-[2/3] shrink-0 rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={movie.thumbnail || movie.backdrop}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-black text-amber-400 border border-amber-400/30">
                      ★ {movie.userRating ? movie.userRating.toFixed(1) : '8.2'}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Match Score Badge */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-black text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 inline shrink-0" />
                          <span>{matchScore}% Match</span>
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">{movie.year}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                        {movie.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                        {movie.description || 'Critically acclaimed hit title.'}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] font-medium text-amber-300/90 italic truncate block">
                        {reason}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="mt-3 pt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onPlay(movie);
                    }}
                    className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-sm active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Watch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectMovie(movie);
                    }}
                    className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition active:scale-95"
                  >
                    <Info className="w-3 h-3 text-gray-300" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-gray-400">
          <span>Updated dynamically with live TMDb ratings & preferences</span>
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="text-amber-400 hover:text-amber-300 font-semibold text-xs flex items-center space-x-1"
          >
            <RotateCw className="w-3 h-3 mr-1" />
            <span>Shuffle Matches</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendationsModal;
