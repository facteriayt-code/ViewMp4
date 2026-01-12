
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
import { supabase } from './services/supabaseClient.ts';
import { signOut } from './services/authService.ts';

const STORAGE_KEYS = {
  HISTORY: 'gemini_stream_history',
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

  // Load Persistence & Listen to Supabase Auth Changes
  useEffect(() => {
    // 1. Initial Session Check
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

    // 2. Auth State Listener (Handles Google Redirect & Manual Login)
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

    // 3. Load Watch History
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (savedHistory) setHistoryIds(JSON.parse(savedHistory));

    // 4. Sync Cloud Data
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
              <span>Connecting to Supabase...</span>
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
        <p>© 2024 GeminiStream. Powered by Supabase & Vercel.</p>
      </footer>
    </div>
  );
};

export default App;
