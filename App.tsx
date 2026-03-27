
import * as React from 'react';
import { useState, useMemo, useEffect, useRef, ErrorInfo, ReactNode } from 'react';
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
import { getAllVideosFromCloud, handleFirestoreError, OperationType } from './services/storageService.ts';
import { signOut } from './services/authService.ts';
import { db, auth } from './firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, getDocFromServer, doc } from 'firebase/firestore';
import { Database, Wifi, WifiOff, Loader2, X, Search as SearchIcon, AlertTriangle } from 'lucide-react';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-red-600/10 border border-red-600/20 p-12 rounded-[3rem] max-w-lg space-y-6">
            <AlertTriangle className="w-20 h-20 text-red-600 mx-auto" />
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">System Failure</h1>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              A critical error has occurred in the broadcast stream. We're working to restore the signal.
            </p>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-left">
              <p className="text-[10px] font-mono text-red-500 break-all">
                {(this.state.error as any)?.message || "Unknown Error"}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all"
            >
              Restart Signal
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

const STORAGE_KEYS = {
  HISTORY: 'gemini_stream_history',
  AGE_VERIFIED: 'geministream_age_verified'
};

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
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

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=User&background=E50914&color=fff`
        });
        setShowLoginModal(false); // Close modal on auth success
      } else {
        setUser(null);
        // If not authenticated, show the login modal automatically to make it "compulsory"
        setShowLoginModal(true);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) {
      setIsSyncing(false);
      return;
    }

    let unsubscribeMovies: (() => void) | undefined;

    const syncCloudData = async () => {
      setIsSyncing(true);
      try {
        // Test Firestore connection
        try {
          await getDocFromServer(doc(db, 'test', 'connection'));
        } catch (error) {
          if (error instanceof Error && error.message.includes('the client is offline')) {
            console.error("Please check your Firebase configuration.");
          }
        }

        const cloudVideos = await getAllVideosFromCloud();
        const updatedMovies = [...cloudVideos, ...INITIAL_MOVIES];
        const uniqueMovies = Array.from(new Map(updatedMovies.map(m => [m.id, m])).values());
        setMovies(uniqueMovies);
        setIsOnline(true);
      } catch (err) {
        console.error("Cloud Connection Failed:", err);
        setIsOnline(false);
      } finally {
        setIsSyncing(false);
      }
    };

    syncCloudData();

    const q = query(collection(db, 'movies'), orderBy('created_at', 'desc'));
    unsubscribeMovies = onSnapshot(q, (snapshot) => {
      const cloudMovies = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        thumbnail: doc.data().thumbnail,
        videoUrl: doc.data().video_url,
        genre: doc.data().genre,
        year: doc.data().year,
        rating: doc.data().rating,
        views: Number(doc.data().views) || 0,
        isUserUploaded: doc.data().is_user_uploaded,
        uploaderId: doc.data().uploader_id,
        uploaderName: doc.data().uploader_name
      } as Movie));

      const updatedMovies = [...cloudMovies, ...INITIAL_MOVIES];
      const uniqueMovies = Array.from(new Map(updatedMovies.map(m => [m.id, m])).values());
      setMovies(uniqueMovies);

      // Update selected movie if it was changed
      if (selectedMovieRef.current) {
        const updatedSelected = cloudMovies.find(m => m.id === selectedMovieRef.current?.id);
        if (updatedSelected) {
          setSelectedMovie(updatedSelected);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'movies');
    });

    return () => {
      if (unsubscribeMovies) unsubscribeMovies();
    };
  }, [isAuthReady, user]);

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

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

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

      {!user ? (
        <div className="relative z-20 pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-[70vh] text-center">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">
              <Database className="w-3 h-3" />
              <span>Secure Broadcast Network</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
              Unlock the <span className="text-red-600">Signal</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
              Join the GeminiStream community to access exclusive broadcasts, upload your own content, and sync with the global feed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/20"
              >
                Sign In to Access
              </button>
            </div>
          </div>
          
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full -z-10" />
        </div>
      ) : (
        <>
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
        </>
      )}

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

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
