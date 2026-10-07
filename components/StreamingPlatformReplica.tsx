import React, { useState, useMemo, useEffect } from 'react';
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
  const [selectedBrandTile, setSelectedBrandTile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [myListIds, setMyListIds] = useState<Set<string>>(new Set());
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
    setMyListIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

      {/* 2. Platform-Specific Header Bar */}
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
          <div className="relative flex items-center bg-black/60 border border-white/15 rounded-full px-3 py-1.5 focus-within:border-white/50 focus-within:bg-black/90 transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search all movies & ${config.shortName}...`}
              className="bg-transparent border-none focus:outline-none text-xs ml-2 w-28 sm:w-44 md:w-56 text-white placeholder:text-gray-500 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 text-gray-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base md:text-xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>{config.top10Title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </h3>
                  {top10Data && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Refreshes in 24h</span>
                    </span>
                  )}
                </div>

                {top10Data && (
                  <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                    <a
                      href={top10Data.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white underline flex items-center gap-1 transition text-[10px] sm:text-xs"
                      title={`Official Chart Source: ${top10Data.sourceUrl}`}
                    >
                      <span>Source: {top10Data.sourceName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleManualRefreshTop10}
                      disabled={isRefreshingTop10}
                      className="hover:text-white flex items-center gap-1 transition text-[10px] sm:text-xs text-amber-300 hover:text-amber-200 disabled:opacity-50"
                      title="Force refresh chart data from website"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRefreshingTop10 ? 'animate-spin text-emerald-400' : ''}`} />
                      <span>{isRefreshingTop10 ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Numbered Row (Authentic Netflix/Prime Style) */}
              <div className="flex items-center space-x-4 md:space-x-6 overflow-x-auto no-scrollbar py-2">
                {top10Movies.map((movie, idx) => {
                  const rank = idx + 1;
                  return (
                    <div
                      key={movie.id}
                      onClick={() => onSelectMovie(movie)}
                      className="group cursor-pointer shrink-0 flex items-center relative transition-transform duration-300 hover:scale-105"
                    >
                      {/* Huge Stylized Rank Number */}
                      <span 
                        className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter select-none font-sans mr-[-18px] md:mr-[-26px] z-10 drop-shadow-2xl"
                        style={{
                          WebkitTextStroke: '2px rgba(255,255,255,0.4)',
                          color: '#000000',
                          opacity: 0.95
                        }}
                      >
                        {rank}
                      </span>

                      {/* Movie Card */}
                      <div className="w-32 sm:w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-black/50 border border-white/10 group-hover:border-white/40 shadow-xl relative">
                        <img
                          src={movie.thumbnail}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
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
                              onPlay(movie);
                            }}
                            className="w-full py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1 shadow-lg"
                            style={{
                              backgroundColor: config.brandColor === '#FFFFFF' ? '#FFFFFF' : config.brandColor,
                              color: config.brandColor === '#FFFFFF' ? '#000000' : '#FFFFFF'
                            }}
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play</span>
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
          src={movie.thumbnail}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
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
                onPlay();
              }}
              className="p-2.5 rounded-full bg-white text-black hover:scale-110 transition shadow-xl"
              title="Stream Now"
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
