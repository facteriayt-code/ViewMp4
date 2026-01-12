
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Plus, Film } from 'lucide-react';

interface NavbarProps {
  onUploadClick: () => void;
  onSearch: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onUploadClick, onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 px-4 md:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-[#141414]' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
           <Film className="w-8 h-8 text-red-600 fill-red-600" />
           <h1 className="text-red-600 font-black text-2xl tracking-tighter uppercase">GeminiStream</h1>
        </div>
        <div className="hidden lg:flex space-x-6 text-sm font-medium text-gray-200">
          <button className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition">TV Shows</button>
          <button className="hover:text-white transition">Movies</button>
          <button className="hover:text-white transition">New & Popular</button>
          <button className="hover:text-white transition">My List</button>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative flex items-center bg-black/40 border border-white/20 rounded-full px-3 py-1">
          <Search className="w-5 h-5 text-gray-300" />
          <input 
            type="text" 
            placeholder="Titles, people, genres"
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-32 md:w-64 placeholder:text-gray-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <button 
          onClick={onUploadClick}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition flex items-center space-x-2 px-4"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Upload</span>
        </button>

        <Bell className="w-6 h-6 text-gray-300 cursor-pointer hidden md:block" />
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
