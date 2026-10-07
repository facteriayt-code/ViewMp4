
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
import { Movie, User, ContinueWatchingItem } from './types.ts';
import { getAllVideosFromCloud } from './services/storageService.ts';
import { supabase } from './services/supabaseClient.ts';
import { signOut } from './services/authService.ts';
import { Database, Wifi, WifiOff, Loader2, X, Search, Sparkles, Play, Info, Plus, Check, Film, Tv, ExternalLink } from 'lucide-react';
import { searchWatchmode, getWatchmodeDetails, importMovieFromWatchmode, WatchmodeSearchResult } from './services/watchmodeService.ts';
import { StreamingPlatformLogosBar } from './components/StreamingPlatformLogosBar.tsx';
import { StreamingPlatformReplica } from './components/StreamingPlatformReplica.tsx';
import { SearchBoxResults } from './components/SearchBoxResults.tsx';
import { ContinueWatchingRow } from './components/ContinueWatchingRow.tsx';
import { getContinueWatchingList, removeContinueWatching, subscribeToContinueWatching } from './services/continueWatchingService.ts';
import { PlatformId } from './services/platformCatalog.ts';
import { AdGuardDnsModal } from './components/AdGuardDnsModal.tsx';
import { getPlatformTop10, initTop10AutoRefresh, NETFLIX_TUDUM_SNAPSHOT, PRIME_FLIXPATROL_SNAPSHOT } from './services/top10Service.ts';

const STORAGE_KEYS = {
  HISTORY: 'gemini_stream_history',
  AGE_VERIFIED: 'geministream_age_verified'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [continueWatchingItems, setContinueWatchingItems] = useState<ContinueWatchingItem[]>(() => 
    getContinueWatchingList()
  );
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalInitialMode, setUploadModalInitialMode] = useState<'single' | 'bulk' | 'watchmode'>('single');
  const [uploadModalInitialQuery, setUploadModalInitialQuery] = useState<string | undefined>(undefined);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdGuardModal, setShowAdGuardModal] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [movieToUnlock, setMovieToUnlock] = useState<Movie | null>(null);
  const [netflixTop10, setNetflixTop10] = useState<Movie[]>(NETFLIX_TUDUM_SNAPSHOT);
  const [primeTop10, setPrimeTop10] = useState<Movie[]>(PRIME_FLIXPATROL_SNAPSHOT);

  // Load and subscribe to 24-hour automatic refresh for Netflix and Prime Top 10
  useEffect(() => {
    let isMounted = true;
    getPlatformTop10('netflix').then(data => {
      if (isMounted && data.movies.length > 0) setNetflixTop10(data.movies);
    });
    getPlatformTop10('prime').then(data => {
      if (isMounted && data.movies.length > 0) setPrimeTop10(data.movies);
    });

    const cleanup = initTop10AutoRefresh((platform, data) => {
      if (!isMounted) return;
      if (platform === 'netflix' && data.movies.length > 0) setNetflixTop10(data.movies);
      if (platform === 'prime' && data.movies.length > 0) setPrimeTop10(data.movies);
    });

    return () => {
      isMounted = false;
      cleanup();
    };
  }, []);

  // Active Streaming Platform Replica State (Netflix, Prime Video, Disney+, Apple TV+, Max, Hulu)
  const [activePlatform, setActivePlatform] = useState<PlatformId | null>(() => {
    try {
      const p = new URL(window.location.href).searchParams.get('platform') as PlatformId | null;
      if (p && ['netflix', 'prime', 'disney', 'appletv', 'max', 'hulu'].includes(p)) {
        return p;
      }
    } catch {}
    return null;
  });

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

  // Listen for Continue Watching updates (persisted in localStorage & synced across components)
  useEffect(() => {
    const unsub = subscribeToContinueWatching((items) => {
      setContinueWatchingItems(items);
    });
    return unsub;
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
      const params = new URL(window.location.href).searchParams;
      const p = params.get('platform') as PlatformId | null;
      if (p && ['netflix', 'prime', 'disney', 'appletv', 'max', 'hulu'].includes(p)) {
        setActivePlatform(p);
      } else {
        setActivePlatform(null);
      }

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

  const handleSelectPlatform = (platformId: PlatformId) => {
    setActivePlatform(platformId);
    pushState({ platform: platformId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitPlatform = () => {
    setActivePlatform(null);
    pushState({ platform: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        const updatedMovies = [...INITIAL_MOVIES, ...cloudVideos];
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
            setPlayingMovie(target);
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
    setMovieToUnlock(null);
    setPlayingMovie(movie);
    pushState({ v: movie.id, autoplay: 'true' });
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
    // Exclude community uploads from homepage recommendation rows per user specification
    const officialMovies = filteredMovies.filter(m => !m.isUserUploaded);
    const playableMovies = officialMovies.filter(m => m.year && m.year <= 2024);
    const pool = playableMovies.length > 0 ? playableMovies : officialMovies;
    const tvShows = pool.filter(m => m.isTv || /tv|series/i.test(m.genre || ''));
    const moviesOnly = pool.filter(m => !m.isTv && !/tv|series/i.test(m.genre || ''));

    return [
      { 
        title: 'Trending Now (Blockbusters & Hits)', 
        movies: pool.slice(0, 20) 
      },
      { 
        title: 'Top TV Series & Binge Shows', 
        movies: tvShows.slice(0, 20) 
      },
      { 
        title: 'Top Rated Movies & Masterpieces', 
        movies: [...moviesOnly].sort((a,b) => (b.userRating || 0) - (a.userRating || 0)).slice(0, 20) 
      },
      { 
        title: 'Sci-Fi & Cosmic Adventures', 
        movies: pool.filter(m => /sci-fi|science fiction|space|alien|interstellar|inception|dune|matrix|avatar/i.test(`${m.genre} ${m.title}`)) 
      },
      { 
        title: 'Action & Adventure Hits', 
        movies: pool.filter(m => /action|adventure|thriller|knight|rings|spider|deadpool|wick|gladiator|batman|avengers|fast/i.test(`${m.genre} ${m.title}`)) 
      },
      { 
        title: 'Popular Streaming Catalog', 
        movies: pool 
      }
    ];
  }, [filteredMovies]);

  // Featured Hero movie: always verified cinema title (never community upload)
  const heroMovie = useMemo(() => {
    return movies.find(m => !m.isUserUploaded && (m.backdrop || m.thumbnail)) || INITIAL_MOVIES[0];
  }, [movies]);

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
      
      {activePlatform ? (
        <StreamingPlatformReplica
          platformId={activePlatform}
          movies={movies}
          onSelectPlatform={handleSelectPlatform}
          onExit={handleExitPlatform}
          onPlay={handlePlay}
          onSelectMovie={handleSelectMovie}
        />
      ) : (
        <>
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
            onSelectPlatform={handleSelectPlatform}
            onAdBlockClick={() => setShowAdGuardModal(true)}
            searchTerm={searchTerm}
          />

          {searchTerm.trim().length > 0 ? (
            /* Search Results: Appears JUST DOWN to the search box at the top of the page! */
            <div className="pt-16 sm:pt-24 px-2 sm:px-4 md:px-12 min-h-screen relative z-20">
              <SearchBoxResults
                searchTerm={searchTerm}
                catalogMovies={movies}
                apiSearchResults={apiSearchResults}
                isSearchingApi={isSearchingApi}
                onSelectMovie={handleSelectMovie}
                onPlay={handlePlay}
                onClose={() => setSearchTerm("")}
                isDropdown={false}
              />
            </div>
          ) : (
            <>
              <Hero 
                movie={heroMovie} 
                onInfoClick={handleSelectMovie} 
                onPlay={handlePlay} 
              />

              {/* Single clean Streaming Platform Logos Bar (only logos, only once on homepage, no instructions) */}
              <StreamingPlatformLogosBar onSelectPlatform={handleSelectPlatform} />

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

                {/* Continue Watching Section */}
                {continueWatchingItems.length > 0 && (
                  <div id="continue-watching" className="scroll-mt-24">
                    <ContinueWatchingRow
                      userName={user?.name ? user.name.split(' ')[0] : 'You'}
                      items={continueWatchingItems}
                      onPlay={(movie, season, episode) => {
                        handlePlay({
                          ...movie,
                          initialSeason: season ?? movie.initialSeason,
                          initialEpisode: episode ?? movie.initialEpisode
                        });
                      }}
                      onSelectMovie={handleSelectMovie}
                      onRemove={(id) => removeContinueWatching(id)}
                    />
                  </div>
                )}

                {/* Normal Homepage Feed */}
                <div className="space-y-4">
                  {/* Top 10 on Netflix India Today (According to Netflix Tudum) */}
                  {netflixTop10.length > 0 && (
                    <MovieRow 
                      title="Top 10 on Netflix India Today" 
                      movies={netflixTop10} 
                      onMovieClick={handleSelectMovie} 
                      onPlay={handlePlay} 
                      isTop10={true}
                      sourceUrl="https://www.netflix.com/tudum/top10/india"
                    />
                  )}

                  {/* Top 10 on Prime Video India Today (According to FlixPatrol) */}
                  {primeTop10.length > 0 && (
                    <MovieRow 
                      title="Top 10 on Prime Video India Today" 
                      movies={primeTop10} 
                      onMovieClick={handleSelectMovie} 
                      onPlay={handlePlay} 
                      isTop10={true}
                      sourceUrl="https://flixpatrol.com/top10/amazon-prime/india/2026-10-06/"
                    />
                  )}

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
              </div>
            </>
          )}
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

      {showAdGuardModal && (
        <AdGuardDnsModal 
          isOpen={showAdGuardModal} 
          onClose={() => setShowAdGuardModal(false)} 
        />
      )}
    </div>
  );
};

export default App;
