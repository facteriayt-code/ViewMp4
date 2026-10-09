import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Movie, ContinueWatchingItem } from '../types.ts';
import { PLATFORMS, PlatformId, isMovieOnPlatform } from '../services/platformCatalog.ts';
import { NetflixLogo, NetflixNIcon, PrimeVideoLogo, DisneyPlusLogo, AppleTvLogo, MaxLogo, HuluLogo } from './PlatformLogos.tsx';
import { Play, Info, Plus, Check, ArrowLeft, Search, Bell, X, Sparkles, Star, ChevronRight, Volume2, Shield, AlertTriangle, Wrench, ExternalLink, RefreshCw } from 'lucide-react';
import { ContinueWatchingRow } from './ContinueWatchingRow.tsx';
import { getContinueWatchingList, removeContinueWatching, subscribeToContinueWatching } from '../services/continueWatchingService.ts';
import { SearchBoxResults } from './SearchBoxResults.tsx';
import { searchWatchmode, WatchmodeSearchResult } from '../services/watchmodeService.ts';
import { ReportIssueModal } from './ReportIssueModal.tsx';
import { getPlatformTop10, Top10PlatformData, NETFLIX_TUDUM_SNAPSHOT, PRIME_FLIXPATROL_SNAPSHOT } from '../services/top10Service.ts';
import { toggleSaveMovie, isMovieSaved } from '../services/userLibraryService.ts';

interface StreamingPlatformReplicaProps {
  platformId: PlatformId;
  movies: Movie[];
  onSelectPlatform: (platformId: PlatformId) => void;
  onExit: () => void;
  onPlay: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
}

export const StreamingPlatformReplica: React.FC<StreamingPlatformReplicaProps> = ({
  platformId,
  movies,
  onSelectPlatform,
  onExit,
  onPlay,
  onSelectMovie
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const replicaSearchRef = useRef<HTMLDivElement | null>(null);
  const [selectedBrandTile, setSelectedBrandTile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [myListIds, setMyListIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (replicaSearchRef.current && !replicaSearchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const updateList = () => {
      setMyListIds(new Set(movies.filter(m => isMovieSaved(m.id)).map(m => m.id)));
    };
    updateList();
    window.addEventListener('gemini_saved_movies_updated', updateList);
    return () => window.removeEventListener('gemini_saved_movies_updated', updateList);
  }, [movies]);

  const [continueWatchingItems, setContinueWatchingItems] = useState<ContinueWatchingItem[]>(() => 
    getContinueWatchingList()
  );
  const [apiSearchResults, setApiSearchResults] = useState<WatchmodeSearchResult[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [reportingMovie, setReportingMovie] = useState<Movie | null>(null);
  const [top10Data, setTop10Data] = useState<Top10PlatformData | null>(null);
  const [isRefreshingTop10, setIsRefreshingTop10] = useState(false);

  // Fetch verified Top 10 data for Netflix (Tudum) and Prime (FlixPatrol) with 24-hour auto-refresh
  useEffect(() => {
    let isMounted = true;
    if (platformId === 'netflix' || platformId === 'prime') {
      getPlatformTop10(platformId).then(data => {
        if (isMounted) setTop10Data(data);
      });
    } else {
      setTop10Data(null);
    }
    return () => { isMounted = false; };
  }, [platformId]);

  const handleManualRefreshTop10 = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (platformId !== 'netflix' && platformId !== 'prime') return;
    setIsRefreshingTop10(true);
    try {
      const fresh = await getPlatformTop10(platformId, true);
      setTop10Data(fresh);
    } finally {
      setIsRefreshingTop10(false);
    }
  };

  useEffect(() => {
    return subscribeToContinueWatching((items) => {
      setContinueWatchingItems(items);
    });
  }, []);

  // Real-time API and catalog search matching the site search box
  useEffect(() => {
    const term = searchQuery.trim();
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
        console.error("Replica search error:", err);
        setApiSearchResults([]);
      } finally {
        setIsSearchingApi(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const config = PLATFORMS[platformId];

  // Continue Watching items specifically on this platform replica
  const platformContinueWatching = useMemo(() => {
    return continueWatchingItems.filter(item => isMovieOnPlatform(item.movie, platformId));
  }, [continueWatchingItems, platformId]);

  // Detect scroll for dynamic navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter movies for this specific platform
  const platformMovies = useMemo(() => {
    let list = config.filterMovies(movies);
    if (selectedBrandTile && config.id === 'disney') {
      const tile = selectedBrandTile.toLowerCase();
      if (tile === 'marvel') {
        list = list.filter(m => /avenger|iron man|spider|deadpool|hero/i.test(`${m.title} ${m.genre}`));
      } else if (tile === 'star wars') {
        list = list.filter(m => /star wars|cosmic|space/i.test(`${m.title} ${m.genre}`));
      } else if (tile === 'pixar' || tile === 'disney') {
        list = list.filter(m => /animation|family|adventure/i.test(`${m.genre} ${m.title}`));
      }
    }
    return list;
  }, [movies, config, selectedBrandTile]);

  // Featured Hero Movie (highest rated/views)
  const heroMovie = useMemo(() => {
    return platformMovies[0] || movies[0];
  }, [platformMovies, movies]);

  // Top 10 Movies on this platform (According to Netflix Tudum for Netflix and FlixPatrol for Prime Video)
  const top10Movies = useMemo(() => {
    if ((platformId === 'netflix' || platformId === 'prime') && top10Data && top10Data.movies.length > 0) {
      return top10Data.movies.slice(0, 10);
    }
    return [...platformMovies].sort((a, b) => b.views - a.views).slice(0, 10);
  }, [platformMovies, platformId, top10Data]);

  const toggleMyList = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const movieToSave = movies.find(m => m.id === id);
    if (movieToSave) {
      toggleSaveMovie(movieToSave);
    }
  };

  const renderLogo = (id: PlatformId) => {
    switch (id) {
      case 'netflix':
        return <NetflixLogo className="h-7 md:h-8" />;
      case 'prime':
        return <PrimeVideoLogo className="h-7 md:h-8" />;
      case 'disney':
        return <DisneyPlusLogo className="h-7 md:h-8" />;
      case 'appletv':
        return <AppleTvLogo className="h-7 md:h-8" />;
      case 'max':
        return <MaxLogo className="h-7 md:h-8" />;
      case 'hulu':
        return <HuluLogo className="h-7 md:h-8" />;
    }
  };

  const platformList: { id: PlatformId; label: string; color: string }[] = [
    { id: 'netflix', label: 'Netflix', color: '#E50914' },
    { id: 'prime', label: 'Prime Video', color: '#00A8E1' },
    { id: 'disney', label: 'Disney+', color: '#113CCF' },
    { id: 'appletv', label: 'Apple TV+', color: '#FFFFFF' },
    { id: 'max', label: 'Max', color: '#7B2CBF' },
    { id: 'hulu', label: 'Hulu', color: '#1CE783' }
  ];

  return (
    <div className={`min-h-screen text-white select-none ${config.bodyBg} transition-colors duration-500`}>
      {/* 1. Global Switcher & Hub Exit Bar (Always on Top) */}
      <div className="bg-black/90 border-b border-white/10 px-4 md:px-12 py-2 flex flex-wrap items-center justify-between text-xs gap-2 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <button
            onClick={onExit}
            className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white font-black px-3 py-1 rounded-full text-[11px] uppercase tracking-wider transition active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to GeminiStream</span>
          </button>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="text-[11px] text-gray-400 hidden sm:inline font-medium">
            Active Studio: <strong className="text-white">{config.name}</strong> ({platformMovies.length} movies)
          </span>
        </div>

        {/* Quick Platform Switcher Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
          {platformList.map((p) => {
            const isActive = p.id === platformId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedBrandTile(null);
                  setSearchQuery('');
                  onSelectPlatform(p.id);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive 
                    ? 'bg-white text-black shadow-lg scale-105' 
                    : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Platform-Specific Header Bar & Dynamic Content */}
      <div key={platformId} className="animate-platform-fade">
        <header className={`sticky top-[41px] z-40 transition-all duration-300 px-4 md:px-12 py-3.5 flex items-center justify-between ${scrolled ? `${config.headerBg} backdrop-blur-lg shadow-2xl` : 'bg-gradient-to-b from-black/90 to-transparent'}`}>
        <div className="flex items-center space-x-6 md:space-x-10">
          <div className="cursor-pointer" onClick={() => { setSearchQuery(''); setSelectedBrandTile(null); }}>
            {renderLogo(platformId)}
          </div>

          <nav className="hidden lg:flex items-center space-x-6 text-xs md:text-sm font-semibold text-gray-300">
            {config.navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setActiveTab(link)}
                className={`hover:text-white transition ${activeTab === link ? 'text-white font-black' : 'text-gray-400'}`}
              >
                {link}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3 md:space-x-5">
          {/* In-Platform Search Bar */}
          <div ref={replicaSearchRef} className="relative">
            <div className={`flex items-center h-9 sm:h-10 px-3 sm:px-3.5 bg-black/80 hover:bg-black/95 border border-white/20 rounded-full focus-within:border-white/50 focus-within:bg-black/95 transition-all duration-300 shadow-inner ${
              isSearchFocused ? 'w-44 xs:w-56 sm:w-64 md:w-72' : 'w-32 xs:w-44 sm:w-56 md:w-64'
            }`}>
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={isSearchFocused ? `Search movies & ${config.shortName}...` : `Search...`}
                className="bg-transparent border-none focus:outline-none text-xs sm:text-sm ml-2 w-full min-w-0 text-white placeholder:text-gray-400 font-medium truncate"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-white transition active:scale-90 ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* In-Platform Trending Searches Dropdown - Fitted viewport bounds */}
            {isSearchFocused && !searchQuery.trim() && (
              <div className="fixed inset-x-2.5 top-[58px] max-w-[calc(100vw-1.25rem)] mx-auto sm:inset-x-auto sm:absolute sm:right-0 sm:top-full sm:w-[460px] sm:max-w-[min(460px,calc(100vw-2rem))] mt-2 z-[150] bg-[#0c0d14]/98 backdrop-blur-2xl border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden animate-in fade-in slide-in-from-top-2">
                <SearchBoxResults
                  searchTerm=""
                  catalogMovies={movies}
                  onSelectMovie={(movie) => {
                    setIsSearchFocused(false);
                    onSelectMovie(movie);
                  }}
                  onPlay={(movie) => {
                    setIsSearchFocused(false);
                    onPlay(movie);
                  }}
                  onClose={() => setIsSearchFocused(false)}
                  isDropdown={true}
                  isInputFocused={true}
                  onSelectQuery={(query) => {
                    setSearchQuery(query);
                    setIsSearchFocused(false);
                  }}
                />
              </div>
            )}
          </div>

          <Bell className="w-5 h-5 text-gray-400 hover:text-white transition cursor-pointer hidden sm:block" />

          {/* User Profile Avatar with Platform Vibe */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div 
              className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase shadow-md"
              style={{ 
                backgroundColor: config.brandColor === '#FFFFFF' ? '#27272A' : config.brandColor,
                color: '#FFFFFF'
              }}
            >
              {platformId === 'netflix' ? <NetflixNIcon className="w-4 h-6" /> : config.shortName.slice(0, 1)}
            </div>
          </div>
        </div>
      </header>

      {/* 3. Disney+ Brand Tiles (Exclusive to Disney+ Replica) */}
      {config.id === 'disney' && (
        <div className="px-4 md:px-12 pt-4 pb-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {config.brandTiles?.map((tile) => {
              const isSelected = selectedBrandTile === tile.name;
              return (
                <button
                  key={tile.name}
                  onClick={() => setSelectedBrandTile(isSelected ? null : tile.name)}
                  className={`p-4 md:p-6 rounded-2xl bg-gradient-to-br ${tile.gradient} border transition-all duration-300 hover:scale-105 hover:shadow-2xl text-center group relative overflow-hidden ${
                    isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-cyan-900/50' : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="block font-black text-sm md:text-base tracking-widest text-white group-hover:text-cyan-300 transition-colors uppercase">
                    {tile.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                    {tile.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Search Results View (Shows all site results just like site search box) */}
      {searchQuery.trim().length > 0 ? (
        <main className="px-2 sm:px-4 md:px-12 py-6 sm:py-8 min-h-screen relative z-20">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: config.brandColor === '#FFFFFF' ? '#E5E7EB' : config.brandColor }} 
              />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                All Search Results ({config.name} Hub)
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-gray-400 hover:text-white transition flex items-center space-x-1"
            >
              <span>Back to {config.name}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <SearchBoxResults
            searchTerm={searchQuery}
            catalogMovies={movies}
            apiSearchResults={apiSearchResults}
            isSearchingApi={isSearchingApi}
            onSelectMovie={onSelectMovie}
            onPlay={onPlay}
            onClose={() => setSearchQuery('')}
            isDropdown={false}
            onSelectQuery={(q) => setSearchQuery(q)}
          />
        </main>
      ) : (
        /* Normal Platform Feed: Hero Billboard & Styled Rows */
        <>
          {/* 5. Authentic Hero Billboard Banner */}
          {heroMovie && (
            <section className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden flex items-end">
              {/* Fullscreen Backdrop */}
              <div className="absolute inset-0">
                <img
                  src={heroMovie.backdrop || heroMovie.thumbnail}
                  alt={heroMovie.title}
                  className="w-full h-full object-cover object-center scale-105 transform animate-fade-in"
                />
                {/* Authentic Platform Lighting Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Billboard Metadata & CTAs */}
              <div className="relative z-20 px-4 md:px-12 pb-16 md:pb-24 max-w-3xl space-y-4">
                {/* Platform Hero Badge */}
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-[10px] md:text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md"
                    style={{
                      backgroundColor: config.brandColor === '#FFFFFF' ? '#FFFFFF' : config.brandColor,
                      color: config.brandColor === '#FFFFFF' ? '#000000' : '#FFFFFF'
                    }}
                  >
                    {config.heroBadge}
                  </span>
                  <span className="text-xs text-gray-300 font-bold">•</span>
                  <span className="text-xs text-green-400 font-bold">
                    {heroMovie.userRating ? `${Math.round(heroMovie.userRating * 10)}% Match` : '98% Match'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{heroMovie.year}</span>
                  <span className="text-[10px] border border-white/30 px-1 rounded text-gray-300">
                    {heroMovie.rating || 'PG-13'}
                  </span>
                  <span className="text-[10px] border border-white/30 px-1 rounded text-gray-300 font-bold">
                    4K ULTRA HD
                  </span>
                </div>

                {/* Big Movie Title */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] line-clamp-2">
                  {heroMovie.title}
                </h1>

                {/* Synopsis */}
                <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-3 leading-relaxed drop-shadow-md max-w-2xl font-normal">
                  {heroMovie.description}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onPlay(heroMovie)}
                    className="flex items-center space-x-2 px-6 sm:px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-2xl active:scale-95"
                    style={{
                      backgroundColor: config.id === 'prime' ? '#00A8E1' : config.id === 'hulu' ? '#1CE783' : '#FFFFFF',
                      color: config.id === 'hulu' ? '#000000' : config.id === 'prime' ? '#FFFFFF' : '#000000'
                    }}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>{config.ctaPlayText}</span>
                  </button>

                  <button
                    onClick={() => onSelectMovie(heroMovie)}
                    className="flex items-center space-x-2 px-6 sm:px-8 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 border border-white/20 active:scale-95"
                  >
                    <Info className="w-5 h-5" />
                    <span>{config.ctaInfoText}</span>
                  </button>

                  <button
                    onClick={(e) => toggleMyList(heroMovie.id, e)}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
                    title={myListIds.has(heroMovie.id) ? "Remove from List" : "Add to My List"}
                  >
                    {myListIds.has(heroMovie.id) ? <Check className="w-5 h-5 text-green-400" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* 6. Content Carousels & Rows */}
          <main className="px-4 md:px-12 -mt-10 md:-mt-16 relative z-30 pb-20 space-y-10">
            {/* Continue Watching Section for Platform */}
            {platformContinueWatching.length > 0 && (
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-1 sm:p-2">
                <ContinueWatchingRow
                  userName="You"
                  items={platformContinueWatching}
                  onPlay={(movie, season, episode) => {
                    onPlay({
                      ...movie,
                      initialSeason: season ?? movie.initialSeason,
                      initialEpisode: episode ?? movie.initialEpisode
                    });
                  }}
                  onSelectMovie={onSelectMovie}
                  onRemove={(id) => removeContinueWatching(id)}
                />
              </div>
            )}

            {/* Top 10 Styled Row */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-royal text-lg sm:text-xl md:text-2xl font-black tracking-wider uppercase text-white flex items-center gap-2">
                    <span>{config.top10Title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </h3>
                </div>
              </div>

              {/* Numbered Row (Authentic, Pixel-Perfect Netflix/Prime Style) */}
              <div className="flex items-end space-x-2 sm:space-x-3 md:space-x-4 overflow-x-auto no-scrollbar py-3 pl-1">
                {top10Movies.map((movie, idx) => {
                  const rank = movie.rank || (idx + 1);
                  return (
                    <div
                      key={movie.id}
                      onClick={() => onSelectMovie(movie)}
                      className="group cursor-pointer shrink-0 flex items-end relative transition-all duration-300 hover:scale-[1.04] hover:z-20 select-none"
                    >
                      {/* Fixed-width Rank Number Container ensuring posters never displace */}
                      <div className="w-12 sm:w-16 md:w-20 flex items-end justify-end shrink-0 z-10 pointer-events-none -mr-3 sm:-mr-5 md:-mr-7">
                        <span 
                          className="font-black tracking-tighter leading-none select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]"
                          style={{
                            fontSize: 'clamp(5rem, 8vw, 8rem)',
                            WebkitTextStroke: platformId === 'netflix' ? '3px #595959' : '2.5px rgba(255,255,255,0.45)',
                            color: '#0a0a0a',
                            lineHeight: '0.8',
                            letterSpacing: '-0.07em'
                          }}
                        >
                          {rank}
                        </span>
                      </div>

                      {/* Movie Card - strictly uniform 2:3 aspect ratio */}
                      <div className="w-32 sm:w-36 md:w-44 aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-white/40 shadow-2xl relative shrink-0">
                        <img
                          src={movie.thumbnail || movie.poster || movie.backdrop}
                          alt={movie.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (movie.backdrop && target.src !== movie.backdrop) {
                              target.src = movie.backdrop;
                            } else if (movie.poster && target.src !== movie.poster) {
                              target.src = movie.poster;
                            } else {
                              target.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop";
                            }
                          }}
                        />

                        {/* Top-right Report Button */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReportingMovie(movie);
                            }}
                            className="p-1.5 bg-black/80 hover:bg-amber-600 text-amber-300 hover:text-white rounded-full border border-white/20 transition shadow-lg active:scale-90"
                            title="Report if this movie is not playing or wrong movie"
                          >
                            <AlertTriangle className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectMovie(movie);
                            }}
                            className="w-full py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1 shadow-lg"
                            style={{
                              backgroundColor: config.brandColor === '#FFFFFF' ? '#FFFFFF' : config.brandColor,
                              color: config.brandColor === '#FFFFFF' ? '#000000' : '#FFFFFF'
                            }}
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Custom Category Rows for this Platform */}
            {config.categoryRows.map((catRow) => {
              const rowMovies = platformMovies.filter(catRow.filter);
              if (rowMovies.length === 0) return null;

              return (
                <section key={catRow.title} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm md:text-lg font-black tracking-tight text-white flex items-center gap-1.5 group cursor-pointer">
                      <span>{catRow.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <span className="text-[11px] text-gray-400 font-semibold">
                      {rowMovies.length} Titles
                    </span>
                  </div>

                  <div className="flex items-center space-x-3.5 md:space-x-4 overflow-x-auto no-scrollbar py-2">
                    {rowMovies.map((movie) => (
                      <div key={movie.id} className="w-36 sm:w-44 md:w-52 shrink-0">
                        <MovieCard
                          movie={movie}
                          config={config}
                          isInMyList={myListIds.has(movie.id)}
                          onToggleList={(e) => toggleMyList(movie.id, e)}
                          onPlay={() => onPlay(movie)}
                          onSelect={() => onSelectMovie(movie)}
                          onReport={() => setReportingMovie(movie)}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Complete Platform Catalog Row */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-xl font-black text-white">
                    All {platformMovies.length} Titles on {config.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Stream blockbusters and classics available on this platform from our stored movie collection.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
                {platformMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    config={config}
                    isInMyList={myListIds.has(movie.id)}
                    onToggleList={(e) => toggleMyList(movie.id, e)}
                    onPlay={() => onPlay(movie)}
                    onSelect={() => onSelectMovie(movie)}
                    onReport={() => setReportingMovie(movie)}
                  />
                ))}
              </div>
            </section>
          </main>
        </>
      )}
      </div>

      {/* 7. Platform Footer */}
      <footer className="border-t border-white/10 py-12 px-4 md:px-12 text-gray-500 text-xs space-y-6 bg-black/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {renderLogo(platformId)}
            <span className="text-[11px] font-bold text-gray-400">Studio Replica Interface</span>
          </div>
          <button
            onClick={onExit}
            className="flex items-center space-x-1.5 text-white hover:text-red-400 transition font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to GeminiStream Cinema Hub</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-[11px] text-gray-400">
          <div>Audio and Subtitles</div>
          <div>Media Center</div>
          <div>Privacy & Terms</div>
          <div>Contact Us</div>
        </div>

        <p className="text-[10px] text-gray-600">
          Interactive replica of {config.name} integrated with GeminiStream cinema database. All video content provided for streaming demonstration.
        </p>
      </footer>

      {/* Instant Stream Fix & Report Modal for Platform Replicas */}
      {reportingMovie && (
        <ReportIssueModal
          isOpen={!!reportingMovie}
          movie={reportingMovie}
          onClose={() => setReportingMovie(null)}
          onFixApplied={() => {
            // Stream override saved automatically
          }}
          onPlayFixed={(fixedMovie) => {
            setReportingMovie(null);
            onPlay(fixedMovie);
          }}
        />
      )}
    </div>
  );
};

// Sub-component for individual Movie Cards inside Platform Replicas
interface MovieCardProps {
  movie: Movie;
  config: any;
  isInMyList: boolean;
  onToggleList: (e: React.MouseEvent) => void;
  onPlay: () => void;
  onSelect: () => void;
  onReport: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  config,
  isInMyList,
  onToggleList,
  onPlay,
  onSelect,
  onReport
}) => {
  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer bg-white/[0.03] border border-white/10 hover:border-white/30 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl relative flex flex-col justify-between"
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-black/60">
        <img
          src={movie.thumbnail || movie.poster || movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (movie.backdrop && target.src !== movie.backdrop) {
              target.src = movie.backdrop;
            } else if (movie.poster && target.src !== movie.poster) {
              target.src = movie.poster;
            } else {
              target.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop";
            }
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span 
            className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm"
            style={{
              backgroundColor: config.brandColor === '#FFFFFF' ? '#FFFFFF' : config.brandColor,
              color: config.brandColor === '#FFFFFF' ? '#000000' : '#FFFFFF'
            }}
          >
            {movie.rating || 'HD'}
          </span>
        </div>

        {/* Top Right Quick Report Button */}
        <div className="absolute top-2 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReport();
            }}
            className="p-1.5 rounded-full bg-black/75 hover:bg-amber-600 text-amber-300 hover:text-white transition backdrop-blur-md border border-white/20 shadow-lg active:scale-90"
            title="Report if this movie is not playing or wrong movie"
          >
            <AlertTriangle className="w-3 h-3" />
          </button>
        </div>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="p-2.5 rounded-full bg-white text-black hover:scale-110 transition shadow-xl"
              title="View Details"
            >
              <Play className="w-4 h-4 fill-black" />
            </button>

            <button
              onClick={onToggleList}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition backdrop-blur-md"
              title={isInMyList ? "Remove from List" : "Add to My List"}
            >
              {isInMyList ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onReport();
              }}
              className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-white transition backdrop-blur-md border border-amber-500/30"
              title="Report issue (not playing or wrong movie)"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition backdrop-blur-md"
              title="More Info"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-gray-300 font-medium line-clamp-1">
            {movie.genre} • {movie.year}
          </p>
        </div>
      </div>

      <div className="p-2.5 space-y-1">
        <h4 className="font-bold text-white text-xs truncate group-hover:text-red-400 transition" title={movie.title}>
          {movie.title}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <span>{movie.year}</span>
          <span className="text-green-400 font-semibold">
            {movie.userRating ? `${Math.round(movie.userRating * 10)}%` : '95%'}
          </span>
        </div>
      </div>
    </div>
  );
};
