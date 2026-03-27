
import React, { useState, useEffect } from 'react';
import { Search, Bell, User as UserIcon, Plus, Film, LogOut, Crown, X } from 'lucide-react';
import { User } from '../types.ts';

interface NavbarProps {
  user: User | null;
  onUploadClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onSearch: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onUploadClick, onLoginClick, onLogout, onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between ${isScrolled ? 'bg-[#141414] shadow-lg' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="flex items-center space-x-2 shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
           <Film className="w-6 h-6 md:w-8 md:h-8 text-red-600 fill-red-600" />
           <h1 className="text-red-600 font-black text-lg md:text-2xl tracking-tighter uppercase hidden xs:block">GeminiStream</h1>
        </div>
        <div className="hidden lg:flex space-x-6 text-sm font-medium text-gray-200">
          <button className="hover:text-white transition" onClick={() => { clearSearch(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</button>
          <button className="hover:text-white transition">Movies</button>
          <button className="hover:text-white transition">New & Popular</button>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full px-2 md:px-3 py-1 hover:border-white/30 transition-colors group">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-focus-within:text-red-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Signals"
            className="bg-transparent border-none focus:outline-none text-xs md:text-sm ml-2 w-20 md:w-48 lg:w-64 placeholder:text-gray-500 text-white font-medium"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="p-1 hover:bg-white/10 rounded-full transition-colors ml-1"
            >
              <X className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            </button>
          )}
        </div>

        <a 
          href="https://www.effectivegatecpm.com/b9d6r82q?key=902e05c8bacf00762eff1614c901fae1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black rounded-lg transition shadow-lg active:scale-95 group"
        >
          <Crown className="w-4 h-4 fill-black group-hover:animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest">VIP</span>
        </a>
        
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
