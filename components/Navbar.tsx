
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User as UserIcon, Plus, Film, LogOut, Crown, Database, X, Tv, ChevronDown } from 'lucide-react';
import { User } from '../types.ts';
import { PlatformId } from '../services/platformCatalog.ts';

interface NavbarProps {
  user: User | null;
  onUploadClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onSearch: (term: string) => void;
  onSelectPlatform?: (platform: PlatformId) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onUploadClick, onLoginClick, onLogout, onSearch, onSelectPlatform }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHubsDropdown, setShowHubsDropdown] = useState(false);
  const hubsRef = useRef<HTMLDivElement | null>(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between ${isScrolled ? 'bg-[#141414] shadow-lg' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="flex items-center space-x-2 shrink-0 cursor-pointer" onClick={() => handleClearSearch()}>
           <Film className="w-6 h-6 md:w-8 md:h-8 text-red-600 fill-red-600" />
           <h1 className="text-red-600 font-black text-lg md:text-2xl tracking-tighter uppercase hidden xs:block">GeminiStream</h1>
        </div>
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
                <div className="px-3 py-1.5 border-b border-white/10 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Launch Studio Replica</span>
                </div>
                {[
                  { id: 'netflix' as PlatformId, name: 'Netflix', color: '#E50914', desc: 'Originals & Blockbusters' },
                  { id: 'prime' as PlatformId, name: 'Prime Video', color: '#00A8E1', desc: 'Included with Prime' },
                  { id: 'disney' as PlatformId, name: 'Disney+', color: '#113CCF', desc: 'Marvel, Star Wars & Pixar' },
                  { id: 'appletv' as PlatformId, name: 'Apple TV+', color: '#FFFFFF', desc: 'Apple Originals & Award Hits' },
                  { id: 'max' as PlatformId, name: 'Max (HBO)', color: '#7B2CBF', desc: 'Warner Bros. & DC Universe' },
                  { id: 'hulu' as PlatformId, name: 'Hulu', color: '#1CE783', desc: 'Hit Movies & Exclusives' },
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
                      <div>
                        <div className="font-bold text-white group-hover:text-red-400 transition">{item.name}</div>
                        <div className="text-[10px] text-gray-400">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 group-hover:text-white">Launch →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => onUploadClick()} className="hover:text-white transition flex items-center space-x-1">
            <span>Database API</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </button>
          <button className="hover:text-white transition">New & Popular</button>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="relative flex items-center bg-black/50 border border-white/10 rounded-full px-3 py-1.5 hover:border-red-600/40 transition-colors focus-within:border-red-600/60 focus-within:bg-black/80">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search movies in Database API..."
            className="bg-transparent border-none focus:outline-none text-xs md:text-sm ml-2 w-32 md:w-56 lg:w-72 placeholder:text-gray-500 text-white font-medium"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button 
              onClick={handleClearSearch}
              className="p-0.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition ml-1"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Smart Link Ad Integration */}
        <a 
          href="https://www.effectivegatecpm.com/b9d6r82q?key=902e05c8bacf00762eff1614c901fae1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black rounded-lg transition shadow-lg active:scale-95 group"
        >
          <Crown className="w-4 h-4 fill-black group-hover:animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest">VIP</span>
        </a>

        {/* TMDb API Live Badge */}
        <button
          onClick={onUploadClick}
          className="hidden md:flex items-center space-x-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-gray-200 hover:text-white px-3 py-1.5 rounded-lg transition text-xs font-semibold"
          title="TMDb Movie Database API Connected (Unlimited Requests)"
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-wider text-red-300">TMDb Live</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        </button>
        
        <button 
          onClick={onUploadClick}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full md:rounded-lg transition flex items-center space-x-2 px-3 md:px-4 shadow-lg active:scale-95"
          aria-label="Upload Video"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Upload</span>
        </button>

        <div className="hidden md:block">
          <Bell className="w-6 h-6 text-gray-300 cursor-pointer hover:text-white transition" />
        </div>

        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 group focus:outline-none"
            >
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white transition" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#181818] border border-white/10 rounded-lg shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
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
            className="bg-white text-black text-xs md:text-sm font-bold px-4 py-2 rounded transition hover:bg-gray-200 active:scale-95"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
