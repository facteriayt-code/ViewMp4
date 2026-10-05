import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User as UserIcon, Plus, Film, LogOut, Crown, Database, X, Tv, ChevronDown } from 'lucide-react';
import { User, Movie } from '../types.ts';
import { PlatformId } from '../services/platformCatalog.ts';
import { WatchmodeSearchResult } from '../services/watchmodeService.ts';
import { SearchBoxResults } from './SearchBoxResults.tsx';

interface NavbarProps {
  user: User | null;
  onUploadClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onSearch: (term: string) => void;
  onSelectPlatform?: (platform: PlatformId) => void;
  movies?: Movie[];
  onSelectMovie?: (movie: Movie) => void;
  onPlay?: (movie: Movie) => void;
  searchTerm?: string;
  apiSearchResults?: WatchmodeSearchResult[];
  isSearchingApi?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onUploadClick, 
  onLoginClick, 
  onLogout, 
  onSearch, 
  onSelectPlatform,
  movies = [],
  onSelectMovie,
  onPlay,
  searchTerm: parentSearchTerm = '',
  apiSearchResults = [],
  isSearchingApi = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState(parentSearchTerm);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHubsDropdown, setShowHubsDropdown] = useState(false);
  
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
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setShowHubsDropdown(false);
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
    if (value.trim().length > 0) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
    setIsSearchOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-3 sm:px-6 md:px-12 py-2 sm:py-3 md:py-4 flex items-center justify-between ${isScrolled || isSearchOpen ? 'bg-[#141414] shadow-lg' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8 shrink-0">
        <div className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer" onClick={() => handleClearSearch()}>
           <Film className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600 fill-red-600 shrink-0" />
           <h1 className="text-red-600 font-black text-sm sm:text-lg md:text-2xl tracking-tighter uppercase hidden xs:inline sm:block">GeminiStream</h1>
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
              <div className="absolute left-0 mt-2 w-56 bg-[#181818]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 space-y-1">
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

          <button onClick={() => onUploadClick()} className="hover:text-white transition flex items-center space-x-1">
            <span>Database API</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </button>
          <button onClick={() => handleClearSearch()} className="hover:text-white transition">New & Popular</button>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-6 min-w-0">
        {/* Search Container with Fully Smartphone-Safe Dropdown */}
        <div ref={searchContainerRef} className="relative">
          <div className="flex items-center bg-black/60 border border-white/15 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 hover:border-red-600/40 transition-colors focus-within:border-red-600/70 focus-within:bg-black/95 shadow-inner">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search..."
              className="bg-transparent border-none focus:outline-none text-xs sm:text-sm ml-1.5 sm:ml-2 w-24 xs:w-32 sm:w-48 md:w-56 lg:w-72 placeholder:text-gray-500 text-white font-medium truncate"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchTerm.trim().length > 0) setIsSearchOpen(true);
              }}
            />
            {searchTerm && (
              <button 
                onClick={handleClearSearch}
                className="p-0.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition ml-1 shrink-0"
                title="Clear search"
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>

          {/* Results appear JUST DOWN TO THE SEARCH BOX - Fully Mobile Safe (Never cut off or overflows) */}
          {isSearchOpen && searchTerm.trim().length > 0 && (
            <div className="fixed inset-x-2 top-13 xs:top-14 bottom-2 z-[70] sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:mt-2 sm:w-[520px] md:w-[600px] sm:max-h-[82vh] sm:bottom-auto bg-zinc-950/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2">
              <SearchBoxResults
                searchTerm={searchTerm}
                catalogMovies={movies}
                apiSearchResults={apiSearchResults}
                isSearchingApi={isSearchingApi}
                onSelectMovie={(m) => {
                  onSelectMovie?.(m);
                  setIsSearchOpen(false);
                }}
                onPlay={(m) => {
                  onPlay?.(m);
                  setIsSearchOpen(false);
                }}
                onClose={() => setIsSearchOpen(false)}
                isDropdown={true}
              />
            </div>
          )}
        </div>

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
