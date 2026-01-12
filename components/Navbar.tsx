
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between ${isScrolled ? 'bg-[#141414] shadow-lg' : 'bg-transparent'}`}>
      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="flex items-center space-x-2 shrink-0">
           <Film className="w-6 h-6 md:w-8 md:h-8 text-red-600 fill-red-600" />
           <h1 className="text-red-600 font-black text-lg md:text-2xl tracking-tighter uppercase hidden xs:block">GeminiStream</h1>
        </div>
        <div className="hidden lg:flex space-x-6 text-sm font-medium text-gray-200">
          <button className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition">Movies</button>
          <button className="hover:text-white transition">My List</button>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full px-2 md:px-3 py-1 hover:border-white/30 transition-colors">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
          <input 
            type="text" 
            placeholder="Search"
            className="bg-transparent border-none focus:outline-none text-xs md:text-sm ml-2 w-20 md:w-48 lg:w-64 placeholder:text-gray-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <button 
          onClick={onUploadClick}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full md:rounded-lg transition flex items-center space-x-2 px-3 md:px-4 shadow-lg active:scale-95"
          aria-label="Upload Video"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Upload</span>
        </button>

        <div className="hidden md:block">
          <Bell className="w-6 h-6 text-gray-300 cursor-pointer" />
        </div>
        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center cursor-pointer border border-white/10 overflow-hidden">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
