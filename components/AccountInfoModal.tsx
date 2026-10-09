import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, LogOut, X, Crown, ShieldCheck, Film, Clock, 
  Bookmark, Heart, Play, Trash2, Info, ChevronRight, Sparkles 
} from 'lucide-react';
import { User, Movie, ContinueWatchingItem } from '../types.ts';
import { 
  getSavedMovies, getLikedMovies, removeSavedMovie, removeLikedMovie 
} from '../services/userLibraryService.ts';

interface AccountInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  continueWatchingCount: number;
  continueWatchingItems?: ContinueWatchingItem[];
  onPlayMovie?: (movie: Movie) => void;
  onSelectMovie?: (movie: Movie) => void;
}

export const AccountInfoModal: React.FC<AccountInfoModalProps> = ({
  isOpen,
  onClose,
  user,
  onLoginClick,
  onLogout,
  continueWatchingCount,
  continueWatchingItems = [],
  onPlayMovie,
  onSelectMovie
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'liked' | 'history' | 'settings'>('saved');
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);

  // Load and subscribe to real-time library updates
  const refreshLibrary = () => {
    setSavedMovies(getSavedMovies());
    setLikedMovies(getLikedMovies());
  };

  useEffect(() => {
    if (isOpen) {
      refreshLibrary();
    }

    const handleSavedUpdated = () => refreshLibrary();
    const handleLikedUpdated = () => refreshLibrary();

    window.addEventListener('gemini_saved_movies_updated', handleSavedUpdated);
    window.addEventListener('gemini_liked_movies_updated', handleLikedUpdated);

    return () => {
      window.removeEventListener('gemini_saved_movies_updated', handleSavedUpdated);
      window.removeEventListener('gemini_liked_movies_updated', handleLikedUpdated);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePlay = (movie: Movie) => {
    onClose();
    onPlayMovie?.(movie);
  };

  const handleSelect = (movie: Movie) => {
    onClose();
    onSelectMovie?.(movie);
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-[#181a24] via-[#10121a] to-[#0a0b10] rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-500 shadow-lg">
              <UserIcon className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white">Account Info & Library</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                  VIP
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {user ? `${user.name} • ${user.email}` : 'Personal Saved Movies, Likes & Streaming Preferences'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition active:scale-90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 px-4 sm:px-6 pt-3 pb-2 border-b border-white/10 bg-black/30 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'saved' 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>Saved Movies</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-300'
            }`}>
              {savedMovies.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('liked')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'liked' 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Liked Titles</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              activeTab === 'liked' ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-300'
            }`}>
              {likedMovies.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'history' 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Continue Watching</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-300'
            }`}>
              {continueWatchingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Account Details</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 no-scrollbar space-y-4">
          
          {/* TAB 1: SAVED MOVIES (WATCHLIST) */}
          {activeTab === 'saved' && (
            <div>
              {savedMovies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedMovies.map((movie) => (
                    <div 
                      key={movie.id}
                      className="flex items-center p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition group"
                    >
                      <div 
                        onClick={() => handleSelect(movie)}
                        className="relative w-20 aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 shrink-0 cursor-pointer shadow-md"
                      >
                        <img 
                          src={movie.thumbnail || movie.backdrop} 
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Play className="w-6 h-6 fill-white text-white drop-shadow-md" />
                        </div>
                      </div>

                      <div className="ml-3 min-w-0 flex-1">
                        <h4 
                          onClick={() => handleSelect(movie)}
                          className="text-xs sm:text-sm font-bold text-white hover:text-red-400 transition truncate cursor-pointer"
                        >
                          {movie.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-0.5">
                          <span>{movie.year || 2024}</span>
                          <span>•</span>
                          <span className="truncate">{movie.genre?.split(/[,/]/)[0] || 'Movie'}</span>
                          {movie.rating && (
                            <span className="border border-white/20 px-1 py-0.2 rounded text-[9px] uppercase font-bold text-gray-300">
                              {movie.rating}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handlePlay(movie)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 transition active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSelect(movie)}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-200 rounded-lg text-[11px] font-medium transition"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() => removeSavedMovie(movie.id)}
                            className="p-1 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded-lg transition ml-auto"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-red-600/10 flex items-center justify-center text-red-500">
                    <Bookmark className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">No Saved Movies Yet</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                      Whenever you click the <strong>Bookmark</strong> or <strong>Save</strong> button on any title, it will appear here in your account info section!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                  >
                    Explore Catalog
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIKED TITLES */}
          {activeTab === 'liked' && (
            <div>
              {likedMovies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {likedMovies.map((movie) => (
                    <div 
                      key={movie.id}
                      className="flex items-center p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition group"
                    >
                      <div 
                        onClick={() => handleSelect(movie)}
                        className="relative w-20 aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 shrink-0 cursor-pointer shadow-md"
                      >
                        <img 
                          src={movie.thumbnail || movie.backdrop} 
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Play className="w-6 h-6 fill-white text-white drop-shadow-md" />
                        </div>
                      </div>

                      <div className="ml-3 min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <h4 
                            onClick={() => handleSelect(movie)}
                            className="text-xs sm:text-sm font-bold text-white hover:text-red-400 transition truncate cursor-pointer"
                          >
                            {movie.title}
                          </h4>
                          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />
                        </div>

                        <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-0.5">
                          <span>{movie.year || 2024}</span>
                          <span>•</span>
                          <span className="truncate">{movie.genre?.split(/[,/]/)[0] || 'Movie'}</span>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handlePlay(movie)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 transition active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSelect(movie)}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-200 rounded-lg text-[11px] font-medium transition"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() => removeLikedMovie(movie.id)}
                            className="p-1 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded-lg transition ml-auto"
                            title="Unlike"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-red-600/10 flex items-center justify-center text-red-500">
                    <Heart className="w-7 h-7 fill-red-500" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">No Liked Movies Yet</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                      Give a thumbs up or like on any movie or replica detail page, and it will be stored right here in your account!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                  >
                    Find Movies to Like
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTINUE WATCHING */}
          {activeTab === 'history' && (
            <div>
              {continueWatchingItems.length > 0 ? (
                <div className="space-y-2.5">
                  {continueWatchingItems.map((item) => (
                    <div 
                      key={item.movie.id}
                      className="flex items-center p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition"
                    >
                      <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-zinc-900 shrink-0">
                        <img 
                          src={item.movie.backdrop || item.movie.thumbnail} 
                          alt={item.movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                          <div 
                            className="h-full bg-red-600" 
                            style={{ width: `${Math.min(100, item.progress * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="ml-3 min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {item.movie.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {item.season ? `Season ${item.season}, Ep ${item.episode || 1}` : `${Math.round(item.progress * 100)}% completed`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlay(item.movie)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 ml-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-red-600/10 flex items-center justify-center text-red-500">
                    <Clock className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">No Watch History</h4>
                  <p className="text-xs text-gray-400">
                    Titles you begin playing will automatically save their progress here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACCOUNT DETAILS & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {user ? (
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-500/50 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-bold text-white truncate">{user.name}</h4>
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                    </div>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        VIP Active
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        Google Verified
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 px-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Guest Streaming Profile</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Your likes and saved movies are stored in this browser session.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLoginClick();
                    }}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg active:scale-95"
                  >
                    Sign In with Google
                  </button>
                </div>
              )}

              {/* Streaming Preferences */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-gray-300 font-medium">Default Stream Quality</span>
                  <span className="text-amber-400 font-bold">4K Ultra HD HDR</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-gray-300 font-medium">Ad Blocker DNS Protection</span>
                  <span className="text-emerald-400 font-bold">Active & Shielded</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-gray-300 font-medium">Total Saved Movies</span>
                  <span className="text-white font-bold">{savedMovies.length} Titles</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-gray-300 font-medium">Total Liked Movies</span>
                  <span className="text-red-400 font-bold">{likedMovies.length} Titles</span>
                </div>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 transition active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AccountInfoModal;
