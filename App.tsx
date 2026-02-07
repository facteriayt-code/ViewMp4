
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
import IntermissionAd from './components/IntermissionAd.tsx';
import CategoryShareBar from './components/CategoryShareBar.tsx';
import { INITIAL_MOVIES } from './constants.ts';
import { Movie, User } from './types.ts';
import { getAllVideosFromCloud } from './services/storageService.ts';
import { supabase } from './services/supabaseClient.ts';
import { signOut } from './services/authService.ts';
import { Database, Wifi, WifiOff, Loader2, X, Search as SearchIcon } from 'lucide-react';

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
  const [movieToUnlock, setMovieToUnlock] = useState<Movie | null>(null);

  const selectedMovieRef = useRef<Movie | null>(null);
  const playingMovieRef = useRef<Movie | null>(null);
  const showUploadModalRef = useRef<boolean>(false);
  const deepLinkProcessed = useRef(false);
  
  useEffect(() => {
    const handleGlobalClick = () => {
      console.debug("User interaction captured for ad-sync");
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    selectedMovieRef.current = selectedMovie;
    playingMovieRef.current = playingMovie;
    showUploadModalRef.current = showUploadModal;
  }, [selectedMovie, playingMovie, showUploadModal]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (playingMovieRef.current || selectedMovieRef.current || showUploadModalRef.current) {
        setPlayingMovie(null);
        setSelectedMovie(null);
        setShowUploadModal(false);
        setEditingMovie(null);
        setMovieToUnlock(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const pushState = (params: Record<string, string | null>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    window.history.pushState({ modal: true }, '', url.toString());
  };

  const clearModalUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('v');
    url.searchParams.delete('play');
    url.searchParams.delete('autoplay');
    window.history.replaceState({}, '', url.toString());
  };

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

  const handleCategoryScroll = (categoryName: string) => {
    const targetId = `row-${categoryName.replace(/\s+/g, '-').toLowerCase()}`;
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      element.classList.add('ring-1', 'ring-red-600/50', 'bg-red-600/5', 'rounded-xl', 'transition-all');
      setTimeout(() => {
        element.classList.remove('ring-1', 'ring-red-600/50', 'bg-red-600/5');
      }, 3000);
    }
  };

  useEffect(() => {
    if (movies.length > 0 && !deepLinkProcessed.current) {
      const params = new URLSearchParams(window.location.search);
      const videoId = params.get('v');
      const category = params.get('cat');

      if (videoId) {
        const target = movies.find(m => m.id === videoId);
        if (target) {
          const autoplay = params.get('autoplay') !== 'false';
          if (autoplay) {
            setMovieToUnlock(target);
          } else {
            setSelectedMovie(target);
          }
          deepLinkProcessed.current = true;
        }
      } 
      else if (category) {
        const decodedCat = decodeURIComponent(category);
        setTimeout(() => handleCategoryScroll(decodedCat), 1000);
        deepLinkProcessed.current = true;
      } else {
        deepLinkProcessed.current = true;
      }
    }
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
    setMovieToUnlock(movie);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    pushState({ v: movie.id, autoplay: 'false' });
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowUploadModal(true);
    pushState({ edit: movie.id });
  };

  const filteredMovies = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return movies;
    return movies.filter(m => {
      const title = (m.title || "").toLowerCase();
      const genre = (m.genre || "").toLowerCase();
      const uploader = (m.uploaderName || "").toLowerCase();
      return title.includes(term) || genre.includes(term) || uploader.includes(term);
    });
  }, [movies, searchTerm]);

  const rows = useMemo(() => {
    // If searching, only show a search result row
    if (searchTerm.trim()) {
      return [
        { title: 'Search Results', movies: filteredMovies }
      ];
    }

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
      { title: 'Premium Movies', movies: filteredMovies.filter(m => !m.isUserUploaded) }
    ];
  }, [filteredMovies, searchTerm]);

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {!isAgeVerified && <AgeDisclaimer onVerify={() => {
        setIsAgeVerified(true);
        localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, 'true');
      }} />}
      
      <Navbar 
        user={user} 
        onUploadClick={() => {
          if (!user) setShowLoginModal(true);
          else {
            setEditingMovie(null);
            setShowUploadModal(true);
            pushState({ action: 'upload' });
          }
        }} 
        onLoginClick={() => setShowLoginModal(true)} 
        onLogout={handleLogout}
        onSearch={setSearchTerm}
      />

      {/* Hide Hero when searching for cleaner results view */}
      {!searchTerm && (
        <Hero 
          movie={movies[0]} 
          onInfoClick={handleSelectMovie} 
          onPlay={handlePlay} 
        />
      )}

      {!searchTerm && <CategoryShareBar onCategoryClick={handleCategoryScroll} />}

      <div className={`relative z-20 space-y-4 ${searchTerm ? 'pt-24 md:pt-32' : ''}`}>
        {isSyncing && (
          <div className="flex items-center justify-center space-x-2 text-red-600 bg-black/40 backdrop-blur-md py-2 px-4 rounded-full w-fit mx-auto border border-red-600/20 shadow-lg mt-8">
             <Loader2 className="w-4 h-4 animate-spin" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing Broadcasts</span>
          </div>
        )}

        {!isOnline && (
          <div className="flex items-center justify-center space-x-2 text-amber-500 bg-black/40 backdrop-blur-md py-2 px-4 rounded-full w-fit mx-auto border border-amber-500/20 shadow-lg animate-bounce mt-8">
             <WifiOff className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Offline Mode</span>
          </div>
        )}

        <div className="space-y-4">
          {rows.map((row, idx) => (
            <React.Fragment key={row.title}>
              <MovieRow 
                title={row.title} 
                movies={row.movies} 
                onMovieClick={handleSelectMovie} 
                onPlay={handlePlay} 
              />
              {!searchTerm && idx === 0 && <AdBanner />}
              {!searchTerm && idx === 2 && <NativeAd />}
            </React.Fragment>
          ))}
          
          {searchTerm && filteredMovies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-4">
               <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 mb-6">
                 <SearchIcon className="w-16 h-16 text-gray-700" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">No signals found</h3>
               <p className="text-gray-500 text-sm mt-2 max-w-xs font-medium">We couldn't find any broadcasts matching "{searchTerm}". Try a different frequency.</p>
               <button 
                onClick={() => setSearchTerm('')}
                className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-600/20"
               >
                 Clear Search
               </button>
            </div>
          )}
        </div>
      </div>

      {movieToUnlock && (
        <IntermissionAd 
          onClose={() => {
            setPlayingMovie(movieToUnlock);
            setMovieToUnlock(null);
            pushState({ v: movieToUnlock.id, autoplay: 'true' });
          }} 
        />
      )}

      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          allMovies={movies} 
          user={user}
          onClose={() => {
            setSelectedMovie(null);
            clearModalUrl();
          }} 
          onPlay={handlePlay}
          onMovieSelect={handleSelectMovie}
          onEdit={handleEdit}
        />
      )}

      {playingMovie && (
        <VideoPlayer 
          movie={playingMovie} 
          onClose={() => {
            setPlayingMovie(null);
            clearModalUrl();
          }} 
        />
      )}

      {showUploadModal && user && (
        <UploadModal 
          user={user} 
          onClose={() => {
            setShowUploadModal(false);
            const url = new URL(window.location.href);
            url.searchParams.delete('action');
            url.searchParams.delete('edit');
            window.history.replaceState({}, '', url.toString());
          }} 
          onUpload={(newMovie) => {
            if (editingMovie) {
              setMovies(prev => prev.map(m => m.id === newMovie.id ? newMovie : m));
            } else {
              setMovies(prev => [newMovie, ...prev]);
            }
          }}
          movieToEdit={editingMovie}
        />
      )}

      {showLoginModal && (
        <LoginModal 
          onLogin={(u) => {
            setUser(u);
            setShowLoginModal(false);
          }}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default App;
