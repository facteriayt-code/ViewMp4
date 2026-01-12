import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import MovieRow from './components/MovieRow.tsx';
import MovieDetails from './components/MovieDetails.tsx';
import UploadModal from './components/UploadModal.tsx';
import VideoPlayer from './components/VideoPlayer.tsx';
import LoginModal from './components/LoginModal.tsx';
import AgeDisclaimer from './components/AgeDisclaimer.tsx';
import { INITIAL_MOVIES } from './constants.ts';
import { Movie, User } from './types.ts';
import { getAllVideosFromCloud } from './services/storageService.ts';
import { supabase } from './services/supabaseClient.ts';
import { signOut } from './services/authService.ts';

const STORAGE_KEYS = {
  HISTORY: 'gemini_stream_history',
  AGE_VERIFIED: 'geministream_age_verified'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(true); // Default true until checked
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);

  // Initial checks
  useEffect(() => {
    // 1. Age Verification Check
    const verified = localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED);
    setIsAgeVerified(verified === 'true');

    // 2. Auth Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || 'User',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=User&background=E50914&color=fff`
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || 'User',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=User&background=E50914&color=fff`
        });
      } else {
        setUser(null);
      }
    });

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
        console.error("Sync Error:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    syncCloudData();

    return () => subscription.unsubscribe();
  }, []);

  const handleVerifyAge = () => {
    localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, 'true');
    setIsAgeVerified(true);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error", err);
    }
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

  const filteredMovies = useMemo(() => {
    if (!searchTerm) return movies;
    return movies.filter(m => 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  const rows = useMemo(() => {
    return [
      { 
        title: 'Recent', 
        movies: filteredMovies.slice(0, 10) 
      },
      { 
        title: 'Insta post', 
        movies: filteredMovies.filter(m => m.genre === 'Insta post') 
      },
      { 
        title: 'Viral', 
        movies: filteredMovies.filter(m => m.genre === 'Viral') 
      },
      { 
        title: 'Onlyfans', 
        movies: filteredMovies.filter(m => m.genre === 'Onlyfans') 
      },
      { 
        title: 'All', 
        movies: filteredMovies 
      },
    ];
  }, [filteredMovies]);

  const featuredMovie = useMemo(() => {
    return filteredMovies[0] || INITIAL_MOVIES[0];
  }, [filteredMovies]);

  return (
    <div className={`relative min-h-screen pb-20 overflow-x-hidden ${!isAgeVerified ? 'max-h-screen overflow-hidden' : ''}`}>
      {!isAgeVerified && <AgeDisclaimer onVerify={handleVerifyAge} />}

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
              <span>Updating Feed...</span>
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

      {showUploadModal && user && (
        <UploadModal 
          user={user}
          onClose={() => setShowUploadModal(false)} 
          onUpload={handleUpload} 
        />
      )}

      {showLoginModal && (
        <LoginModal 
          onLogin={() => setShowLoginModal(false)} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}

      <footer className="px-4 md:px-12 py-12 border-t border-white/5 text-gray-600 text-sm mt-20 text-center">
        <p>© 2024 GeminiStream. Discover everything.</p>
      </footer>
    </div>
  );
};

export default App;