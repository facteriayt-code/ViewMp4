
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
import { getAllVideosFromCloud } from './services/storageService.ts';

const STORAGE_KEYS = {
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
  const [isSyncing, setIsSyncing] = useState(true);

  // Load persistence
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (savedHistory) setHistoryIds(JSON.parse(savedHistory));

    const syncCloudData = async () => {
      try {
        const cloudVideos = await getAllVideosFromCloud();
        setMovies(prev => {
          const initialIds = new Set(INITIAL_MOVIES.map(m => m.id));
          const filteredPrev = prev.filter(m => initialIds.has(m.id));
          return [...cloudVideos, ...filteredPrev];
        });
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncCloudData();
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
    // Add user info as uploader
    const uploadedMovie = {
      ...newMovie,
      uploaderId: user?.id,
      uploaderName: user?.name
    };
    
    setMovies(prev => [uploadedMovie, ...prev]);
  };

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(null);
    setPlayingMovie(movie);
    
    if (!historyIds.includes(movie.id)) {
      const newHistory = [movie.id, ...historyIds].slice(0, 20);
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
      { title: 'Global Community Feed', movies: othersUploads },
      { title: 'Trending Now', movies: filteredMovies.slice(0, 10) },
      { title: 'My Cloud Uploads', movies: myUploads },
      { title: 'Continue Watching', movies: historyMovies },
      { title: 'Space & Beyond', movies: filteredMovies.filter(m => m.genre === 'Sci-Fi') },
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
        {isSyncing && (
           <div className="px-4 md:px-12 mb-4 flex items-center space-x-2 text-xs text-blue-500 animate-pulse">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Fetching Global Data...</span>
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
      </div>

      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} onPlay={handlePlay} />
      )}

      {playingMovie && (
        <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />
      )}

      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} onUpload={handleUpload} />}

      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}

      <footer className="px-4 md:px-12 py-12 border-t border-white/5 text-gray-600 text-sm mt-20 text-center">
        <p>© 2024 GeminiStream. Powered by Vercel Cloud Architecture.</p>
      </footer>
    </div>
  );
};

export default App;
