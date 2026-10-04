
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
import { Database, Wifi, WifiOff, Loader2, X, Search, Sparkles, Play, Info, Plus, Check, Film, Tv, ExternalLink } from 'lucide-react';
import { searchWatchmode, getWatchmodeDetails, importMovieFromWatchmode, WatchmodeSearchResult } from './services/watchmodeService.ts';

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
  const [uploadModalInitialMode, setUploadModalInitialMode] = useState<'single' | 'bulk' | 'watchmode'>('single');
  const [uploadModalInitialQuery, setUploadModalInitialQuery] = useState<string | undefined>(undefined);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [movieToUnlock, setMovieToUnlock] = useState<Movie | null>(null);

  // Watchmode Database API Real-Time Search States
  const [apiSearchResults, setApiSearchResults] = useState<WatchmodeSearchResult[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [importingApiId, setImportingApiId] = useState<number | null>(null);
  const [addedMovieIds, setAddedMovieIds] = useState<Set<number>>(new Set());

  const selectedMovieRef = useRef<Movie | null>(null);
  const playingMovieRef = useRef<Movie | null>(null);
  const showUploadModalRef = useRef<boolean>(false);
  const deepLinkProcessed = useRef(false);
  
  // 1. Global Click Listener for Pop-ups/Ads
  useEffect(() => {
    const handleGlobalClick = () => {
      // This empty listener encourages the browser to allow script-triggered popups 
      // from the ad networks included in index.html
      console.debug("User interaction captured for ad-sync");
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Update refs to avoid stale closures in event listeners
  useEffect(() => {
    selectedMovieRef.current = selectedMovie;
    playingMovieRef.current = playingMovie;
    showUploadModalRef.current = showUploadModal;
  }, [selectedMovie, playingMovie, showUploadModal]);

  // Handle Browser Back Button (Popstate)
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
            setMovieToUnlock(target); // Force unlock for deep links
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
    setMovieToUnlock(movie); // Trigger IntermissionAd
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
    const term = searchTerm.toLowerCase();
    if (!term) return movies;
    return movies.filter(m => 
      m.title.toLowerCase().includes(term) || 
      m.genre.toLowerCase().includes(term) ||
      (m.uploaderName && m.uploaderName.toLowerCase().includes(term))
    );
  }, [movies, searchTerm]);

  const rows = useMemo(() => {
    return [
      { 
        title: 'Trending Now (TMDb Global Picks)', 
        movies: [...filteredMovies].sort((a,b) => b.views - a.views).slice(0, 20) 
      },
      { 
        title: 'Blockbuster Releases & TMDb Cinema Database', 
        movies: filteredMovies.slice(0, 20) 
      },
      { 
        title: 'Sci-Fi & Cosmic Adventures', 
        movies: filteredMovies.filter(m => /sci-fi|science fiction|space|alien|interstellar|inception|dune|matrix|avatar/i.test(`${m.genre} ${m.title}`)) 
      },
      { 
        title: 'Action & Adventure Hits', 
        movies: filteredMovies.filter(m => /action|adventure|thriller|knight|rings|spider|deadpool|wick|gladiator|batman|avengers|fast/i.test(`${m.genre} ${m.title}`)) 
      },
      { 
        title: 'Top Rated Classics & Masterpieces', 
        movies: [...filteredMovies].sort((a,b) => (b.criticScore || 80) - (a.criticScore || 80)).slice(0, 20) 
      },
      { 
        title: 'Full Streaming Library (70+ TMDb Stored Movies)', 
        movies: filteredMovies 
      }
    ];
  }, [filteredMovies]);

  // Real-time Watchmode Database API search when user types in search bar
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term || term.length < 1) {
      setApiSearchResults([]);
      setIsSearchingApi(false);
      return;
    }

    setIsSearchingApi(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchWatchmode(term);
        setApiSearchResults(results);
      } catch (err) {
        console.error("TMDb search error:", err);
        setApiSearchResults([]);
      } finally {
        setIsSearchingApi(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle direct streaming from an API result card
  const handleStreamApiMovie = async (item: WatchmodeSearchResult) => {
    const existing = movies.find(m => m.watchmodeId === item.id || m.title.toLowerCase() === item.name.toLowerCase());
    if (existing) {
      handlePlay(existing);
      return;
    }

    setImportingApiId(item.id);
    try {
      const newMovie = await importMovieFromWatchmode(item.id);
      if (newMovie) {
        setMovies(prev => [newMovie, ...prev.filter(m => m.id !== newMovie.id)]);
        setAddedMovieIds(prev => new Set(prev).add(item.id));
        handlePlay(newMovie);
      }
    } catch (err) {
      console.error("Failed to stream movie from API:", err);
      // Fallback: create playable movie object and trigger intermission ad + stream
      const tempMovie: Movie = {
        id: `wm-${item.id}`,
        title: item.name,
        description: `Official title from Watchmode Cinema Database (${item.year || 'Featured'}).`,
        thumbnail: item.imageUrl || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        genre: item.type === 'tv_series' ? 'TV Series' : 'Movie',
        year: item.year || new Date().getFullYear(),
        rating: 'PG-13',
        views: 450000,
        watchmodeId: item.id
      };
      handlePlay(tempMovie);
    } finally {
      setImportingApiId(null);
    }
  };

  // Handle viewing full details and official streaming platforms from an API result card
  const handleInfoApiMovie = async (item: WatchmodeSearchResult) => {
    const existing = movies.find(m => m.watchmodeId === item.id || m.title.toLowerCase() === item.name.toLowerCase());
    if (existing) {
      handleSelectMovie(existing);
      return;
    }

    setImportingApiId(item.id);
    try {
      const details = await getWatchmodeDetails(item.id);
      if (details) {
        const fullMovie: Movie = {
          id: `wm-${details.watchmodeId}`,
          title: details.title,
          description: details.description || `Official title from Watchmode Cinema Database.`,
          thumbnail: details.thumbnail || item.imageUrl || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          genre: details.genre || 'Feature',
          year: details.year || item.year || new Date().getFullYear(),
          rating: details.rating || 'PG-13',
          views: 620000,
          watchmodeId: details.watchmodeId,
          backdrop: details.backdrop,
          trailer: details.trailer,
          userRating: details.userRating,
          criticScore: details.criticScore,
          streamingSources: details.streamingSources
        };
        setSelectedMovie(fullMovie);
      } else {
        handleOpenDatabaseApiSearch(item.name);
      }
    } catch (err) {
      console.error("Failed to load details for API movie:", err);
      handleOpenDatabaseApiSearch(item.name);
    } finally {
      setImportingApiId(null);
    }
  };

  // Handle 1-click Add to Catalog from an API result card
  const handleAddApiMovie = async (item: WatchmodeSearchResult) => {
    setImportingApiId(item.id);
    try {
      const newMovie = await importMovieFromWatchmode(item.id);
      if (newMovie) {
        setMovies(prev => [newMovie, ...prev.filter(m => m.id !== newMovie.id)]);
        setAddedMovieIds(prev => new Set(prev).add(item.id));
      }
    } catch (err) {
      console.error("Failed to import movie from API:", err);
    } finally {
      setImportingApiId(null);
    }
  };

  const handleOpenDatabaseApiSearch = (query?: string) => {
    if (!user) {
      setUser({
        id: `guest-${Date.now()}`,
        name: 'Guest Explorer',
        email: 'guest@geministream.pro',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150'
      });
    }
    setUploadModalInitialMode('watchmode');
    setUploadModalInitialQuery(query || searchTerm);
    setEditingMovie(null);
    setShowUploadModal(true);
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {!isAgeVerified && <AgeDisclaimer onVerify={() => {
        setIsAgeVerified(true);
        localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, 'true');
      }} />}
      
      <Navbar 
        user={user} 
        onUploadClick={() => {
          if (!user) {
            setUser({
              id: `guest-${Date.now()}`,
              name: 'Guest Explorer',
              email: 'guest@geministream.pro',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150'
            });
          }
          setUploadModalInitialMode('watchmode');
          setUploadModalInitialQuery(searchTerm || '');
          setEditingMovie(null);
          setShowUploadModal(true);
          pushState({ action: 'upload' });
        }} 
        onLoginClick={() => setShowLoginModal(true)} 
        onLogout={handleLogout}
        onSearch={setSearchTerm}
      />

      <Hero 
        movie={movies[0]} 
        onInfoClick={handleSelectMovie} 
        onPlay={handlePlay} 
      />

      <CategoryShareBar onCategoryClick={handleCategoryScroll} />

      <div className="relative z-20 space-y-4">
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

        {/* Live Search Section: Both Local Catalog & TMDb Database API */}
        {searchTerm.trim().length > 0 ? (
          <div className="space-y-8 px-4 md:px-12 pt-2">
            {/* Search Header Banner */}
            <div className="bg-gradient-to-r from-red-950/60 via-[#181818] to-red-950/40 border border-red-500/30 p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
              <div>
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400">TMDb Database API Live Search</span>
                </div>
                <h2 className="text-xl font-black text-white mt-1">
                  Results for "<span className="text-red-500">{searchTerm}</span>"
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-300">
                  <span className="bg-white/10 px-2.5 py-1 rounded-full font-bold">
                    {apiSearchResults.length} from TMDb Database
                  </span>
                  <span className="bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full font-bold">
                    {filteredMovies.length} ready in Catalog
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleOpenDatabaseApiSearch(searchTerm)}
                  className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-lg active:scale-95"
                >
                  <Database className="w-4 h-4" />
                  <span>Open in Database Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 1. Local Catalog Matches (if any) */}
            {filteredMovies.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Film className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-300">
                    Ready in Catalog ({filteredMovies.length})
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredMovies.map(movie => (
                    <div 
                      key={movie.id}
                      onClick={() => handleSelectMovie(movie)}
                      className="group cursor-pointer bg-white/[0.02] border border-white/5 hover:border-red-600/50 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative"
                    >
                      <div className="aspect-[2/3] relative overflow-hidden bg-black/40">
                        <img 
                          src={movie.thumbnail} 
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                            {movie.rating || 'HD'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlay(movie);
                          }}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                        >
                          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </button>
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-white text-xs truncate group-hover:text-red-400 transition">{movie.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{movie.year} • {movie.genre}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. TMDb Database API Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    TMDb Database API Results {apiSearchResults.length > 0 && `(${apiSearchResults.length})`}
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-black uppercase">
                    Millions of Titles
                  </span>
                </div>
              </div>

              {isSearchingApi ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-4 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
                  <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
                  <div>
                    <p className="text-sm font-bold text-gray-200 uppercase tracking-widest">
                      Querying TMDb Movie Database...
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Searching global cinema archives & official streaming providers for "{searchTerm}"
                    </p>
                  </div>
                </div>
              ) : apiSearchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {apiSearchResults.map((res) => {
                    const isImporting = importingApiId === res.id;
                    const isAdded = addedMovieIds.has(res.id);

                    return (
                      <div 
                        key={res.id}
                        className="group bg-white/[0.02] border border-white/5 hover:border-red-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between"
                      >
                        <div className="aspect-[2/3] relative overflow-hidden bg-black/40">
                          {res.imageUrl ? (
                            <img 
                              src={res.imageUrl} 
                              alt={res.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-gray-600 bg-white/5">
                              <Film className="w-10 h-10 text-gray-500 mb-2" />
                              <span className="text-[10px] uppercase font-bold text-gray-400">{res.name}</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                          {/* Year & Type Badges */}
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {res.year && (
                              <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10">
                                {res.year}
                              </span>
                            )}
                            <span className="bg-red-600/80 backdrop-blur-md text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                              {res.type === 'tv_series' ? 'TV' : 'Movie'}
                            </span>
                          </div>

                          {/* Quick Stream Overlay on Hover */}
                          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-2">
                            <button
                              type="button"
                              onClick={() => handleStreamApiMovie(res)}
                              disabled={isImporting}
                              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-2xl transform active:scale-95 transition flex items-center justify-center"
                              title="Stream Now"
                            >
                              {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInfoApiMovie(res)}
                              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md shadow-2xl transform active:scale-95 transition flex items-center justify-center"
                              title="Details & Where to Watch"
                            >
                              <Info className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <div>
                            <h4 className="font-bold text-white text-xs truncate group-hover:text-red-400 transition" title={res.name}>
                              {res.name}
                            </h4>
                            <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-gray-400">
                              {res.year && <span>{res.year}</span>}
                              <span>•</span>
                              <span className="uppercase">{res.type}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleStreamApiMovie(res)}
                              disabled={isImporting}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition flex items-center justify-center space-x-1 shadow-md active:scale-95"
                            >
                              {isImporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-white" />}
                              <span>Stream</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAddApiMovie(res)}
                              disabled={isImporting || isAdded}
                              className={`py-1.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition flex items-center justify-center ${isAdded ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'}`}
                              title={isAdded ? "Added to catalog" : "Add to Library"}
                            >
                              {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : filteredMovies.length === 0 ? (
                /* No Results Found: Friendly Helper with 1-Click Popular Picks */
                <div className="py-12 px-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center space-y-4 max-w-2xl mx-auto">
                  <Film className="w-12 h-12 text-gray-600 mx-auto animate-pulse" />
                  <h3 className="text-base font-bold text-gray-200">
                    No results found for "<span className="text-red-400">{searchTerm}</span>"
                  </h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Try checking the spelling or click one of these verified blockbusters from the 150,000+ title database:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {['Avatar', 'Inception', 'Interstellar', 'The Dark Knight', 'Dune', 'Oppenheimer', 'Titanic', 'Deadpool', 'Gladiator', 'Spider-Man'].map((pop) => (
                      <button
                        key={pop}
                        type="button"
                        onClick={() => setSearchTerm(pop)}
                        className="bg-white/5 hover:bg-red-600/20 hover:text-red-400 border border-white/10 hover:border-red-500/40 text-gray-300 px-3.5 py-1.5 rounded-full text-xs font-semibold transition shadow-sm active:scale-95"
                      >
                        {pop}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          /* Normal Homepage Feed */
          <div className="space-y-4">
            {rows.map((row, idx) => (
              row.movies.length > 0 && (
                <React.Fragment key={row.title}>
                  <MovieRow 
                    title={row.title} 
                    movies={row.movies} 
                    onMovieClick={handleSelectMovie} 
                    onPlay={handlePlay} 
                  />
                  {idx === 0 && <AdBanner />}
                  {idx === 2 && <NativeAd />}
                </React.Fragment>
              )
            ))}
          </div>
        )}
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
          initialMode={uploadModalInitialMode}
          initialQuery={uploadModalInitialQuery}
          onClose={() => {
            setShowUploadModal(false);
            setUploadModalInitialQuery(undefined);
            const url = new URL(window.location.href);
            url.searchParams.delete('action');
            url.searchParams.delete('edit');
            window.history.replaceState({}, '', url.toString());
          }} 
          onUpload={(newMovie) => {
            if (editingMovie) {
              setMovies(prev => prev.map(m => m.id === newMovie.id ? newMovie : m));
            } else {
              setMovies(prev => [newMovie, ...prev.filter(m => m.id !== newMovie.id)]);
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
