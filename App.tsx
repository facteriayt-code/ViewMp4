
import React, { useState, useMemo, useEffect } from 'react';
// Added ShieldCheck import to fix "Cannot find name 'ShieldCheck'" error
import { ShieldCheck } from 'lucide-react';
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
    // Check for explicit admin roles or the specific admin account ID
    const isAdmin = newUser.role === 'admin' || 
                    newUser.id === 'admin-account-anish' ||
                    newUser.id.includes('creator') || 
                    newUser.name.toLowerCase().includes('admin');
                    
    const enhancedUser = { 
      ...newUser, 
      role: isAdmin ? 'admin' : 'user' 
    } as User;

    setUser(enhancedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(enhancedUser));
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const handleUpload = (newMovie: Movie) => {
    setMovies(prev => [newMovie, ...prev]);
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
    const featured = movies.find(m => m.isFeatured);
    return featured || movies[0];
  }, [movies]);

  const rows = useMemo(() => {
    const filtered = searchTerm ? movies.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())) : movies;
    const historyMovies = historyIds.map(id => movies.find(m => m.id === id)).filter((m): m is Movie => !!m);
    
    return [
      { title: 'New Cloud Arrivals', movies: filtered.filter(m => m.isUserUploaded) },
      { title: 'Top Rated', movies: filtered.slice(0, 8) },
      { title: 'My History', movies: historyMovies },
      { title: 'Action Packed', movies: filtered.filter(m => m.genre === 'Action') },
    ];
  }, [movies, searchTerm, historyIds]);

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden">
      <Navbar 
        user={user}
        onUploadClick={() => setShowUploadModal(true)} 
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onSearch={setSearchTerm}
      />
      
      {!searchTerm && <Hero movie={featuredMovie} onInfoClick={setSelectedMovie} onPlay={handlePlay} />}
      
      <div className={`${searchTerm ? 'pt-24' : '-mt-32 relative z-20'} transition-all duration-500`}>
        {isSyncing && (
           <div className="px-4 md:px-12 mb-4 flex items-center space-x-2 text-xs text-indigo-400 animate-pulse">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifying Admin Cloud Sync...</span>
           </div>
        )}

        {rows.map((row, idx) => (
          <MovieRow key={idx} title={row.title} movies={row.movies} onMovieClick={setSelectedMovie} />
        ))}
      </div>

      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          currentUser={user} 
          onClose={() => setSelectedMovie(null)} 
          onPlay={handlePlay}
          onDeleted={(id) => setMovies(prev => prev.filter(m => m.id !== id))}
        />
      )}

      {playingMovie && <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />}
      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} onUpload={handleUpload} />}
      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default App;
