import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import MovieRow from './components/MovieRow.tsx';
import MovieDetails from './components/MovieDetails.tsx';
import UploadModal from './components/UploadModal.tsx';
import VideoPlayer from './components/VideoPlayer.tsx';
import LoginModal from './components/LoginModal.tsx';
import AgeDisclaimer from './components/AgeDisclaimer.tsx';
import NativeAd from './components/NativeAd.tsx';
import AdBanner from './components/AdBanner.tsx';
import { INITIAL_MOVIES } from './constants.ts';
import { Movie, User } from './types.ts';
import { getAllVideosFromCloud } from './services/storageService.ts';
import { supabase } from './services/supabaseClient.ts';
import { signOut } from './services/authService.ts';
import { Database, Wifi, WifiOff, Loader2, X } from 'lucide-react';

const STORAGE_KEYS = {
  HISTORY: 'gemini_stream_history',
  AGE_VERIFIED: 'geministream_age_verified'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isDeepLinking, setIsDeepLinking] = useState(false);
  
  const pendingVideoId = useRef<string | null>(new URLSearchParams(window.location.search).get('v'));
  const selectedMovieRef = useRef<Movie | null>(null);
  
  useEffect(() => {
    selectedMovieRef.current = selectedMovie;
  }, [selectedMovie]);

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

    const moviesChannel = supabase
      .channel('movies-realtime-global')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movies' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          const updatedMovie: Movie = {
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
          setMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
          if (selectedMovieRef.current?.id === updatedMovie.id) {
            setSelectedMovie(updatedMovie);
          }
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
            views: payload.new.views || 0,
            isUserUploaded: payload.new.is_user_uploaded,
            uploaderId: payload.new.uploader_id,
            uploaderName: payload.new.uploader_name
          };
          setMovies(prev => [newMovie, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setMovies(prev => prev.filter(m => m.id !== payload.old.id));
          if (selectedMovieRef.current?.id === payload.old.id) {
            setSelectedMovie(null);
          }
        }
      })
      .subscribe();

    return () => {
      authSub.unsubscribe();
      supabase.removeChannel(moviesChannel);
    };
  }, []);

  useEffect(() => {
    const processDeepLink = () => {
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get('v');
      const autoplay = params.get('autoplay') === 'true';

      if (videoId) {
        const target = movies.find(m => m.id === videoId);
        if (target) {
          setIsDeepLinking(false);
          pendingVideoId.current = null;
          if (autoplay) {
            setPlayingMovie(target);
            setSelectedMovie(null);
          } else {
            setSelectedMovie(target);
            setPlayingMovie(null);
          }
        } else {
          setIsDeepLinking(true);
        }
      } else {
        setIsDeepLinking(false);
      }
    };

    processDeepLink();
    window.addEventListener('popstate', processDeepLink);
    return () => window.removeEventListener('popstate', processDeepLink);
  }, [movies]);

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

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowUploadModal(true);
  };

  const filteredMovies = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return movies;
    return movies.filter(m => 
      m.title.toLowerCase().includes(term) || 
      m.genre.toLowerCase().includes(term) ||
      (m.uploaderName && m.uploaderName.toLowerCase().includes(term))
    );
  }, [movies, searchTerm]);

  const rows = useMemo(() => {
    const userUploadsOnly = filteredMovies.filter(m => m.isUserUploaded === true);
    
    return [
      { 
        title: 'Trending Now', 
        movies: [...userUploadsOnly].sort((a,b) => b.views - a.views) 
      },
      { title: 'New Community Uploads', movies: userUploadsOnly.slice(0, 10) },
      { title: 'onlyfans Content', movies: filteredMovies.filter(m => m.genre === 'onlyfans') },
      { title: 'Insta post', movies: filteredMovies.filter(m => m.genre === 'Insta post') },
      { title: 'Viral Highlights', movies: filteredMovies.filter(m => m.genre === 'Viral') },
      { title: 'Premium Movies', movies: filteredMovies.filter(m => !m.isUserUploaded) },
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
        onUploadClick={() => {
          setEditingMovie(null);
          user ? setShowUploadModal(true) : setShowLoginModal(true);
        }} 
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onSearch={setSearchTerm}
      />
      
      {isDeepLinking && isSyncing && (
        <div className="fixed inset-0 z-[80] bg-black/90 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
           <p className="text-white font-bold uppercase tracking-widest text-sm animate-pulse">Fetching shared content...</p>
        </div>
      )}

      {!searchTerm && movies.length > 0 && (
        <Hero 
          movie={movies[0]} 
          onInfoClick={setSelectedMovie} 
          onPlay={handlePlay}
        />
      )}
      
      <div className={`${searchTerm ? 'pt-24' : '-mt-32 relative z-20'} transition-all duration-500`}>
        {/* Connection status moved to footer to prevent blocking content flow */}
        
        {/* PRIMARY AD PLACEMENT - TOP OF FEED FOR MAX REVENUE */}
        <AdBanner />

        {rows.map((row, idx) => (
          <React.Fragment key={row.title + idx}>
            <MovieRow 
              title={row.title}
              movies={row.movies}
              onMovieClick={setSelectedMovie}
              onPlay={handlePlay}
            />
            {idx === 0 && <NativeAd />}
          </React.Fragment>
        ))}
      </div>

      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          allMovies={movies}
          user={user}
          onClose={() => setSelectedMovie(null)} 
          onPlay={handlePlay} 
          onMovieSelect={setSelectedMovie}
          onEdit={handleEdit}
        />
      )}

      {playingMovie && (
        <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />
      )}

      {showUploadModal && user && (
        <UploadModal 
          user={user}
          movieToEdit={editingMovie}
          onClose={() => {
            setShowUploadModal(false);
            setEditingMovie(null);
          }} 
          onUpload={(m) => {
            if (editingMovie) {
               setMovies(prev => prev.map(old => old.id === m.id ? m : old));
            } else {
               setMovies(prev => [m, ...prev]);
            }
          }} 
        />
      )}

      {showLoginModal && (
        <LoginModal 
          onLogin={() => setShowLoginModal(false)} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}

      <footer className="px-4 md:px-12 py-16 border-t border-white/5 text-gray-600 text-sm mt-20 text-center pb-10">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Supabase: {isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>
            
            {isSyncing && (
              <div className="flex items-center space-x-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest animate-pulse">
                <Database className="w-3 h-3" />
                <span>Syncing Database...</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p>© 2024 GeminiStream Platform.</p>
            <p className="text-[10px] opacity-50">High-performance streaming engine powered by Supabase & Gemini AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;