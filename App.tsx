
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import MovieRow from './components/MovieRow.tsx';
import MovieDetails from './components/MovieDetails.tsx';
import UploadModal from './components/UploadModal.tsx';
import VideoPlayer from './components/VideoPlayer.tsx';
import LoginModal from './components/LoginModal.tsx';
import { INITIAL_MOVIES } from './constants.ts';
import { Movie, User } from './types.ts';

const STORAGE_KEYS = {
  UPLOADS: 'gemini_stream_uploads',
  HISTORY: 'gemini_stream_history',
  USER: 'gemini_stream_user'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Load from Persistence
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedUploads = localStorage.getItem(STORAGE_KEYS.UPLOADS);
    if (savedUploads) {
      const parsedUploads = JSON.parse(savedUploads);
      setMovies(prev => [...parsedUploads, ...prev]);
    }

    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (savedHistory) setHistoryIds(JSON.parse(savedHistory));
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const handleUpload = (newMovie: Movie) => {
    // Attach user info if logged in
    const uploadedMovie = {
      ...newMovie,
      uploaderId: user?.id,
      uploaderName: user?.name
    };
    
    setMovies(prev => [uploadedMovie, ...prev]);
    
    // Save to "Global" local library
    const currentUploads = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPLOADS) || '[]');
    localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify([uploadedMovie, ...currentUploads]));
  };

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(null);
    setPlayingMovie(movie);
    
    // Add to Watch History
    if (!historyIds.includes(movie.id)) {
      const newHistory = [movie.id, ...historyIds].slice(0, 20); // Keep last 20
      setHistoryIds(newHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
    }
  };

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

  const historyMovies = useMemo(() => {
    return historyIds
      .map(id => movies.find(m => m.id === id))
      .filter((m): m is Movie => !!m);
  }, [historyIds, movies]);

  const rows = useMemo(() => {
    const userCreated = filteredMovies.filter(m => m.isUserUploaded);
    const myUploads = userCreated.filter(m => m.uploaderId === user?.id);
    const othersUploads = userCreated.filter(m => m.uploaderId !== user?.id);

    return [
      { title: 'Trending Now', movies: filteredMovies.slice(0, 6) },
      { title: 'Community Uploads', movies: othersUploads },
      { title: 'Sci-Fi & Fantasy', movies: filteredMovies.filter(m => m.genre === 'Sci-Fi') },
      { title: 'My Watch History', movies: historyMovies },
      { title: 'My Uploads', movies: myUploads },
      { title: 'Action Packed', movies: filteredMovies.filter(m => m.genre === 'Action') },
    ];
  }, [filteredMovies, historyMovies, user]);

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden">
      <Navbar 
        user={user}
        onUploadClick={() => user ? setShowUploadModal(true) : setShowLoginModal(true)} 
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onSearch={setSearchTerm}
      />
      
      {!searchTerm && (
        <Hero 
          movie={featuredMovie} 
          onInfoClick={setSelectedMovie} 
          onPlay={handlePlay}
        />
      )}
      
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
          onPlay={handlePlay}
        />
      )}

      {playingMovie && (
        <VideoPlayer 
          movie={playingMovie} 
          onClose={() => setPlayingMovie(null)} 
        />
      )}

      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)} 
          onUpload={handleUpload}
        />
      )}

      {showLoginModal && (
        <LoginModal 
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      <footer className="px-4 md:px-12 py-12 border-t border-white/5 text-gray-600 text-sm mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Audio Description</span>
            <span className="hover:underline cursor-pointer">Help Center</span>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Media Center</span>
            <span className="hover:underline cursor-pointer">Jobs</span>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Terms of Use</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Contact Us</span>
          </div>
        </div>
        <p className="mt-12 text-center text-xs tracking-widest uppercase">© 2024 GeminiStream Inc. (Powered by Gemini AI)</p>
      </footer>
    </div>
  );
};

export default App;
