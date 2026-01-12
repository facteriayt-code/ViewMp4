
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
import { Database, Wifi, WifiOff } from 'lucide-react';

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
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED);
    setIsAgeVerified(verified === 'true');

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

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
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

    const syncCloudData = async () => {
      setIsSyncing(true);
      try {
        const cloudVideos = await getAllVideosFromCloud();
        const updatedMovies = [...cloudVideos, ...INITIAL_MOVIES];
        const uniqueMovies = Array.from(new Map(updatedMovies.map(m => [m.id, m])).values());
        setMovies(uniqueMovies);
        setIsOnline(true);
      } catch (err) {
        console.error("Supabase Connection Failed:", err);
        setIsOnline(false);
      } finally {
        setIsSyncing(false);
      }
    };

    syncCloudData();

    // Setup Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'movies',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setMovies(current => 
              current.map(m => m.id === payload.new.id ? { ...m, views: Number(payload.new.views) || 0 } : m)
            );
          } else if (payload.eventType === 'INSERT') {
            const newMovie: Movie = {
              id: payload.new.id,
              title: payload.new.title,
              description: payload.new.description,
              thumbnail: payload.new.thumbnail,
              videoUrl: payload.new.video_url,
              genre: payload.new.genre,
              year: payload.new.year,
              rating: payload.new.rating,
              views: Number(payload.new.views) || 0,
              isUserUploaded: payload.new.is_user_uploaded,
              uploaderId: payload.new.uploader_id,
              uploaderName: payload.new.uploader_name
            };
            setMovies(current => [newMovie, ...current]);
          }
        }
      )
      .subscribe();

    return () => {
      authSub.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(null);
    setPlayingMovie(movie);
  };

  const filteredMovies = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return movies;
    return movies.filter(m => 
      m.title.toLowerCase().includes(term) || 
      m.genre.toLowerCase().includes(term)
    );
  }, [movies, searchTerm]);

  const rows = useMemo(() => {
    return [
      { title: 'Trending Now', movies: [...filteredMovies].sort((a,b) => b.views - a.views).slice(0, 10) },
      { title: 'Insta post', movies: filteredMovies.filter(m => m.genre === 'Insta post') },
      { title: 'Viral Hits', movies: filteredMovies.filter(m => m.genre === 'Viral') },
      { title: 'Onlyfans Originals', movies: filteredMovies.filter(m => m.genre === 'Onlyfans') },
      { title: 'Full Library', movies: filteredMovies },
    ];
  }, [filteredMovies]);

  return (
    <div className={`relative min-h-screen pb-20 bg-[#141414] ${!isAgeVerified ? 'max-h-screen overflow-hidden' : ''}`}>
      {!isAgeVerified && <AgeDisclaimer onVerify={() => {
        localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, 'true');
        setIsAgeVerified(true);
      }} />}

      <Navbar 
        user={user}
        onUploadClick={() => user ? setShowUploadModal(true) : setShowLoginModal(true)} 
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onSearch={setSearchTerm}
      />
      
      {!searchTerm && movies.length > 0 && (
        <Hero 
          movie={movies.find(m => m.id === '1') || movies[0]} 
          onInfoClick={setSelectedMovie} 
          onPlay={handlePlay}
        />
      )}
      
      <div className={`${searchTerm ? 'pt-24' : '-mt-32 relative z-20'} transition-all duration-500`}>
        <div className="px-4 md:px-12 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className={`p-1.5 rounded-lg ${isOnline ? 'bg-green-600/10 text-green-500' : 'bg-red-600/10 text-red-500'}`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">Cloud Status</span>
                <span className="text-xs font-bold text-white leading-none">Stream Project Online</span>
             </div>
          </div>
          
          {isSyncing && (
            <div className="flex items-center space-x-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest animate-pulse">
               <Database className="w-3 h-3" />
               <span>Syncing Realtime...</span>
            </div>
          )}
        </div>

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
          onUpload={(m) => setMovies(prev => [m, ...prev])} 
        />
      )}

      {showLoginModal && (
        <LoginModal 
          onLogin={() => setShowLoginModal(false)} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}

      <footer className="px-4 md:px-12 py-16 border-t border-white/5 text-gray-600 text-sm mt-20 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Views Enabled</span>
          </div>
          <p>© 2024 GeminiStream Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
