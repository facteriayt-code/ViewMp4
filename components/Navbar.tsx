import React, { useState, useEffect, useRef } from 'react';
import { Search, User as UserIcon, Plus, Film, LogOut, Crown, Database, X, Tv, ChevronDown, ShieldCheck, MessageSquare } from 'lucide-react';
import { User, Movie } from '../types.ts';
import { PlatformId } from '../services/platformCatalog.ts';
import { SearchBoxResults } from './SearchBoxResults.tsx';

interface NavbarProps {
  user: User | null;
  onUploadClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onSearch: (term: string) => void;
  onSelectPlatform?: (platform: PlatformId) => void;
  onAdBlockClick?: () => void;
  onChatClick?: () => void;
  onGoogleChatClick?: () => void;
  searchTerm?: string;
  catalogMovies?: Movie[];
  onSelectMovie?: (movie: Movie) => void;
  onPlayMovie?: (movie: Movie) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onUploadClick, 
  onLoginClick, 
  onLogout, 
  onSearch, 
  onSelectPlatform,
  onAdBlockClick,
  onChatClick,
  onGoogleChatClick,
  searchTerm: parentSearchTerm = '',
  catalogMovies = [],
  onSelectMovie,
  onPlayMovie
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState(parentSearchTerm);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHubsDropdown, setShowHubsDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const hubsRef = useRef<HTMLDivElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync internal search term when parent changes
  useEffect(() => {
    setSearchTerm(parentSearchTerm);
  }, [parentSearchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (hubsRef.current && !hubsRef.current.contains(e.target as Node)) {
        setShowHubsDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowHubsDropdown(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 sm:px-8 md:px-12 lg:px-16 md:pl-24 py-3 sm:py-3.5 md:py-4 flex items-center justify-between ${
      isScrolled || searchTerm.trim().length > 0 
        ? 'bg-[#090b10]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.7)]' 
        : 'bg-gradient-to-b from-[#090b10]/95 via-[#090b10]/60 to-transparent'
    }`}>
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8 shrink-0">
        <div className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer" onClick={() => handleClearSearch()}>
           <Film className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600 fill-red-600 shrink-0" />
           <h1 className="font-royal text-red-600 font-extrabold text-sm sm:text-lg md:text-xl tracking-wider uppercase hidden xs:inline sm:block">GeminiStream</h1>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-200">
          <button onClick={() => handleClearSearch()} className="hover:text-white transition">Home</button>
          
          {/* Streaming Hubs Dropdown */}
          <div className="relative" ref={hubsRef}>
            <button
              onClick={() => setShowHubsDropdown(!showHubsDropdown)}
              className="hover:text-white transition flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <Tv className="w-3.5 h-3.5 text-red-500" />
              <span className="font-semibold text-xs">Streaming Hubs</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showHubsDropdown && (
              <div className="absolute left-0 mt-2 w-56 bg-[#0d0f17]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 space-y-1">
                {[
                  { id: 'netflix' as PlatformId, name: 'Netflix', color: '#E50914' },
                  { id: 'prime' as PlatformId, name: 'Prime Video', color: '#00A8E1' },
                  { id: 'disney' as PlatformId, name: 'Disney+', color: '#113CCF' },
                  { id: 'appletv' as PlatformId, name: 'Apple TV+', color: '#FFFFFF' },
                  { id: 'max' as PlatformId, name: 'Max', color: '#7B2CBF' },
                  { id: 'hulu' as PlatformId, name: 'Hulu', color: '#1CE783' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowHubsDropdown(false);
                      onSelectPlatform?.(item.id);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/10 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <div className="font-bold text-white group-hover:text-red-400 transition">{item.name}</div>
                    </div>
                    <span className="text-[10px] text-gray-500 group-hover:text-white">Open →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              handleClearSearch();
              setTimeout(() => {
                const el = document.getElementById('continue-watching');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }} 
            className="hover:text-white transition"
          >
            Continue Watching
          </button>
          <button onClick={() => onUploadClick()} className="hover:text-white transition flex items-center space-x-1">
            <span>Database API</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </button>
          <button onClick={() => handleClearSearch()} className="hover:text-white transition">New & Popular</button>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0">
        {/* Perfectly Fitted Search Box with Real-time Trending Searches Dropdown */}
        <div ref={searchContainerRef} className="relative">
          <div className={`flex items-center h-9 sm:h-10 px-3 sm:px-3.5 bg-black/80 hover:bg-black/95 focus-within:bg-black border border-white/20 hover:border-white/35 focus-within:border-red-600 rounded-full transition-all duration-300 shadow-inner focus-within:ring-2 focus-within:ring-red-600/30 ${
            isSearchFocused ? 'w-44 xs:w-56 sm:w-64 md:w-72 lg:w-80 shadow-[0_0_20px_rgba(229,9,20,0.2)]' : 'w-32 xs:w-44 sm:w-56 md:w-64 lg:w-72'
          }`}>
            <Search className="w-4 h-4 text-gray-400 shrink-0 transition-colors" />
            <input 
              id="main-search-input"
              type="text" 
              placeholder={isSearchFocused ? "Search movies & shows..." : "Search..."}
              className="bg-transparent border-none focus:outline-none text-xs sm:text-sm ml-2 w-full min-w-0 placeholder:text-gray-400 text-white font-medium truncate"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition ml-1 shrink-0 active:scale-90"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Real-time Trending Searches Dropdown - Fitted viewport bounds (fixed on mobile, absolute on desktop) */}
          {isSearchFocused && !searchTerm.trim() && (
            <div className="fixed inset-x-2.5 top-[58px] max-w-[calc(100vw-1.25rem)] mx-auto sm:inset-x-auto sm:absolute sm:right-0 sm:top-full sm:w-[460px] sm:max-w-[min(460px,calc(100vw-2rem))] mt-2 z-[150] bg-[#0c0e15]/98 backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden animate-in fade-in slide-in-from-top-2">
              <SearchBoxResults
                searchTerm=""
                catalogMovies={catalogMovies}
                onSelectMovie={(movie) => {
                  setIsSearchFocused(false);
                  onSelectMovie?.(movie);
                }}
                onPlay={(movie) => {
                  setIsSearchFocused(false);
                  onPlayMovie?.(movie);
                }}
                onClose={() => setIsSearchFocused(false)}
                isDropdown={true}
                isInputFocused={true}
                onSelectQuery={(query) => {
                  setSearchTerm(query);
                  onSearch(query);
                  setIsSearchFocused(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Community Live Chat Button (Registered users real-time chat, 12h auto-delete) */}
        {onChatClick && (
          <button
            type="button"
            onClick={onChatClick}
            className="flex items-center space-x-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-white px-2 sm:px-2.5 py-1.5 rounded-lg transition text-xs font-semibold shrink-0 active:scale-95 shadow-sm group"
            title="Community Live Chat (Connected for all users, 12h auto-delete)"
          >
            <MessageSquare className="w-3.5 h-3.5 text-red-500 fill-red-500/30 group-hover:scale-110 transition-transform" />
            <span className="hidden xs:inline text-[10px] font-black uppercase tracking-wider">Chat</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        )}

        {/* Smart Link Ad Integration */}
        <a 
          href="https://www.effectivegatecpm.com/b9d6r82q?key=902e05c8bacf00762eff1614c901fae1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black rounded-lg transition shadow-lg active:scale-95 group shrink-0"
        >
          <Crown className="w-3.5 h-3.5 fill-black group-hover:animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest">VIP</span>
        </a>

        {/* Ad Block Option (Step-by-Step AdGuard DNS) */}
        {onAdBlockClick && (
          <button
            type="button"
            onClick={onAdBlockClick}
            className="hidden sm:flex items-center space-x-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 px-2.5 py-1.5 rounded-lg transition text-xs font-semibold shrink-0 active:scale-95 shadow-sm"
            title="Block All Ads: Step-by-step instructions to use AdGuard DNS"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">Ad Block</span>
          </button>
        )}

        {/* Google Chat Button */}
        {onGoogleChatClick && (
          <button
            type="button"
            onClick={onGoogleChatClick}
            className="flex items-center space-x-1.5 bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-white px-2.5 py-1.5 rounded-lg transition text-xs font-semibold shrink-0 active:scale-95 shadow-sm"
            title="Open Google Workspace Chat (Spaces & Messages)"
          >
            <svg className="w-3.5 h-3.5 fill-blue-400 shrink-0" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-wider hidden xs:inline">Google Chat</span>
          </button>
        )}

        {/* TMDb API Live Badge (Desktop) */}
        <button
          onClick={onUploadClick}
          className="hidden md:flex items-center space-x-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-gray-200 hover:text-white px-2.5 py-1.5 rounded-lg transition text-xs font-semibold shrink-0"
          title="TMDb Movie Database API Connected (Unlimited Requests)"
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-wider text-red-300">TMDb</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        </button>
        
        {/* Upload Button */}
        <button 
          onClick={onUploadClick}
          className="bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-full sm:rounded-lg transition flex items-center space-x-1.5 sm:px-3 shadow-lg active:scale-95 shrink-0"
          aria-label="Upload Video"
          title="Upload or Import Movie"
        >
          <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Upload</span>
        </button>

        {/* User Profile / Sign In */}
        {user ? (
          <div className="relative shrink-0">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-1 group focus:outline-none"
            >
              <img src={user.avatar} alt={user.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 group-hover:border-white transition object-cover" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#181818] border border-white/10 rounded-lg shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-white/10 mb-2">
                  <p className="text-sm font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition">Account</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition">Help Center</button>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="bg-white text-black text-[11px] sm:text-xs md:text-sm font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded transition hover:bg-gray-200 active:scale-95 shrink-0"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
