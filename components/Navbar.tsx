
import React, { useState, useEffect } from 'react';
import { Search, Bell, User as UserIcon, Plus, Film, LogOut, ShieldCheck } from 'lucide-react';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between ${isScrolled ? 'bg-[#141414] shadow-lg' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="flex items-center space-x-2 shrink-0">
           <Film className="w-6 h-6 md:w-8 md:h-8 text-red-600 fill-red-600" />
           <h1 className="text-red-600 font-black text-lg md:text-2xl tracking-tighter uppercase hidden xs:block">GeminiStream</h1>
        </div>
        <div className="hidden lg:flex space-x-6 text-sm font-medium text-gray-200">
          <button className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition font-bold text-red-500">Global Feed</button>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full px-2 md:px-3 py-1 hover:border-white/30 transition-colors">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
          <input 
            type="text" 
            placeholder="Search catalog..."
            className="bg-transparent border-none focus:outline-none text-xs md:text-sm ml-2 w-20 md:w-48 lg:w-64 placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); onSearch(e.target.value); }}
          />
        </div>
        
        {isAdmin && (
          <button 
            onClick={onUploadClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full md:rounded-lg transition flex items-center space-x-2 px-3 md:px-4 shadow-lg active:scale-95 animate-pulse-slow"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Admin: Add Movie</span>
          </button>
        )}

        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 group focus:outline-none"
            >
              <div className="relative">
                <img src={user.avatar} alt={user.name} className={`w-8 h-8 rounded-full border-2 ${isAdmin ? 'border-indigo-500' : 'border-white/20'} group-hover:scale-105 transition`} />
                {isAdmin && <ShieldCheck className="absolute -bottom-1 -right-1 w-3 h-3 text-indigo-400 bg-black rounded-full" />}
              </div>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#181818] border border-white/10 rounded-lg shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-white/10 mb-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    {isAdmin && <span className="text-[10px] bg-indigo-500 text-white px-1 rounded font-bold uppercase">Admin</span>}
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition">Management Console</button>
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
