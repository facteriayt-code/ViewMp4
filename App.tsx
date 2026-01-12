
import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieDetails from './components/MovieDetails';
import UploadModal from './components/UploadModal';
import { INITIAL_MOVIES, CATEGORIES } from './constants';
import { Movie } from './types';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const featuredMovie = useMemo(() => {
    const scifi = movies.filter(m => m.genre === 'Sci-Fi');
    return scifi.length > 0 ? scifi[0] : movies[0];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (!searchTerm) return movies;
    return movies.filter(m => 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  const rows = useMemo(() => {
    return [
      { title: 'Trending Now', movies: filteredMovies.slice(0, 6) },
      { title: 'Sci-Fi & Fantasy', movies: filteredMovies.filter(m => m.genre === 'Sci-Fi') },
      { title: 'Your Creations', movies: filteredMovies.filter(m => m.isUserUploaded) },
      { title: 'Action Packed', movies: filteredMovies.filter(m => m.genre === 'Action') },
    ];
  }, [filteredMovies]);

  const handleUpload = (newMovie: Movie) => {
    setMovies(prev => [newMovie, ...prev]);
  };

  return (
    <div className="relative min-h-screen pb-20">
      <Navbar 
        onUploadClick={() => setShowUploadModal(true)} 
        onSearch={setSearchTerm}
      />
      
      {!searchTerm && <Hero movie={featuredMovie} onInfoClick={setSelectedMovie} />}
      
      <div className={`${searchTerm ? 'pt-24' : '-mt-32 relative z-20'} transition-all duration-500`}>
        {searchTerm && (
          <div className="px-4 md:px-12 mb-8">
            <h2 className="text-3xl font-bold mb-2">Search results for "{searchTerm}"</h2>
            <p className="text-gray-500">{filteredMovies.length} items found</p>
          </div>
        )}
        
        {rows.map((row, idx) => (
          <MovieRow 
            key={row.title + idx}
            title={row.title}
            movies={row.movies}
            onMovieClick={setSelectedMovie}
          />
        ))}

        {filteredMovies.length === 0 && (
           <div className="flex flex-col items-center justify-center py-40 opacity-50">
              <p className="text-2xl font-light">No titles match your search.</p>
           </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)} 
          onUpload={handleUpload}
        />
      )}

      <footer className="px-4 md:px-12 py-12 border-t border-white/5 text-gray-600 text-sm mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Audio Description</span>
            <span className="hover:underline cursor-pointer">Help Center</span>
            <span className="hover:underline cursor-pointer">Gift Cards</span>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Media Center</span>
            <span className="hover:underline cursor-pointer">Investor Relations</span>
            <span className="hover:underline cursor-pointer">Jobs</span>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Terms of Use</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Legal Notices</span>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Corporate Information</span>
            <span className="hover:underline cursor-pointer">Contact Us</span>
          </div>
        </div>
        <p className="mt-12 text-center text-xs tracking-widest uppercase">© 2024 GeminiStream Inc. (Powered by Gemini AI)</p>
      </footer>
    </div>
  );
};

export default App;
