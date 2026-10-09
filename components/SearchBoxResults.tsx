import React, { useState, useMemo } from 'react';
import { 
  Play, Info, Database, Film, Tv, Sparkles, X, ChevronRight, 
  Loader2, Filter, AlertTriangle, TrendingUp, Flame, Search, 
  ArrowUpRight, Clock, Star, Crown
} from 'lucide-react';
import { Movie } from '../types.ts';
import { WatchmodeSearchResult, convertSearchResultToMovie } from '../services/watchmodeService.ts';
import { matchesMediaType, matchesCategory, isTvOrSeries } from '../services/streamService.ts';
import { ReportIssueModal } from './ReportIssueModal.tsx';

export interface TrendingQuery {
  id: string;
  query: string;
  badge: string;
  category: string;
  searchesToday: string;
  trend: 'up' | 'hot' | 'top';
}

export const TRENDING_QUERIES: TrendingQuery[] = [
  { id: 't1', query: 'Deadpool & Wolverine', badge: '#1 Trending', category: 'Action Comedy', searchesToday: '124K searches', trend: 'hot' },
  { id: 't2', query: 'Stranger Things', badge: '#2 Global', category: 'Sci-Fi Series', searchesToday: '98K searches', trend: 'hot' },
  { id: 't3', query: 'Oppenheimer', badge: '#3 Oscar Winner', category: 'Biography Drama', searchesToday: '87K searches', trend: 'top' },
  { id: 't4', query: 'Dune: Part Two', badge: '#4 Blockbuster', category: 'Sci-Fi Epic', searchesToday: '76K searches', trend: 'up' },
  { id: 't5', query: 'House of the Dragon', badge: '#5 Hit Series', category: 'Fantasy Drama', searchesToday: '69K searches', trend: 'hot' },
  { id: 't6', query: 'The Penguin', badge: '#6 Crime Drama', category: 'DC Universe', searchesToday: '63K searches', trend: 'up' },
  { id: 't7', query: 'The Bear', badge: '#7 Emmy Winner', category: 'Comedy Drama', searchesToday: '54K searches', trend: 'up' },
  { id: 't8', query: 'Shōgun', badge: '#8 Historic', category: 'Historical Drama', searchesToday: '49K searches', trend: 'top' }
];

export const POPULAR_SEARCH_TAGS = [
  '🔥 Top 10 Global',
  '🚀 Sci-Fi Hits',
  '🏆 Academy Winners',
  '⚔️ Historical Epics',
  '⚡ Bingeable TV Series',
  '✨ Anime & Animation',
  '🍿 Weekend Blockbusters',
  '👻 Horror Thrillers'
];

interface SearchBoxResultsProps {
  searchTerm: string;
  catalogMovies: Movie[];
  apiSearchResults?: WatchmodeSearchResult[];
  isSearchingApi?: boolean;
  onSelectMovie: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  onClose?: () => void;
  isDropdown?: boolean;
  onSelectQuery?: (query: string) => void;
  isInputFocused?: boolean;
}

const CATEGORIES = [
  'All Genres',
  'Action',
  'Animation',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Horror',
  'Thriller',
  'Adventure',
  'Romance',
  'Crime'
];

export const SearchBoxResults: React.FC<SearchBoxResultsProps> = ({
  searchTerm,
  catalogMovies,
  apiSearchResults = [],
  isSearchingApi = false,
  onSelectMovie,
  onPlay,
  onClose,
  isDropdown = false,
  onSelectQuery,
  isInputFocused = false
}) => {
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Genres');
  const [reportingMovie, setReportingMovie] = useState<Movie | null>(null);

  const isSearchEmpty = !searchTerm || searchTerm.trim().length === 0;

  // Filtered catalog movies matching searchTerm, mediaType, and category
  const filteredCatalog = useMemo(() => {
    if (isSearchEmpty) return [];
    const q = searchTerm.toLowerCase().trim();
    return catalogMovies.filter(m => {
      const matchesQuery = 
        m.title.toLowerCase().includes(q) || 
        m.genre.toLowerCase().includes(q) || 
        (m.uploaderName && m.uploaderName.toLowerCase().includes(q));
      
      if (!matchesQuery) return false;
      if (!matchesMediaType(m, mediaType)) return false;
      if (!matchesCategory(m, selectedCategory)) return false;
      return true;
    });
  }, [catalogMovies, searchTerm, isSearchEmpty, mediaType, selectedCategory]);

  // Filtered TMDb database API results
  const filteredApiResults = useMemo(() => {
    if (isSearchEmpty) return [];
    return apiSearchResults.filter(item => {
      const isTv = item.type === 'tv_series' || item.type === 'tv';
      if (mediaType === 'tv' && !isTv) return false;
      if (mediaType === 'movie' && isTv) return false;

      if (selectedCategory !== 'All Genres') {
        const cat = selectedCategory.toLowerCase();
        const text = `${item.name || item.title || ''} ${item.overview || ''}`.toLowerCase();
        if (cat === 'animation') {
          if (!text.includes('anim')) return false;
        } else if (cat === 'sci-fi') {
          if (!/sci-fi|science fiction|space|alien|future/i.test(text)) return false;
        } else {
          if (!text.includes(cat)) return false;
        }
      }
      return true;
    });
  }, [apiSearchResults, isSearchEmpty, mediaType, selectedCategory]);

  const totalResultsCount = filteredCatalog.length + filteredApiResults.length;

  // Popular Quick-Picks when search is empty (top rated from catalog)
  const trendingQuickPicks = useMemo(() => {
    return [...catalogMovies]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, isDropdown ? 3 : 6);
  }, [catalogMovies, isDropdown]);

  const handlePlayApiItem = (item: WatchmodeSearchResult) => {
    const isTv = item.type === 'tv_series' || item.type === 'tv' || (item as any).is_tv;
    const movie = convertSearchResultToMovie(item);
    onPlay({ ...movie, isTv: Boolean(isTv) });
    onClose?.();
  };

  const handleSelectApiItem = (item: WatchmodeSearchResult) => {
    const isTv = item.type === 'tv_series' || item.type === 'tv' || (item as any).is_tv;
    const movie = convertSearchResultToMovie(item);
    onSelectMovie({ ...movie, isTv: Boolean(isTv) });
    onClose?.();
  };

  const handleQueryClick = (q: string) => {
    // Strip emojis if search tag
    const cleanQuery = q.replace(/^[\p{Emoji}\s]+/gu, '').trim();
    if (onSelectQuery) {
      onSelectQuery(cleanQuery);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 1. REAL-TIME TRENDING SEARCHES DROPDOWN (when search input is focused but empty)
  // ─────────────────────────────────────────────────────────────
  if (isSearchEmpty) {
    return (
      <div className={`w-full ${isDropdown ? 'text-white flex flex-col max-h-[80vh] overflow-hidden' : 'space-y-6 pt-2 pb-12'}`}>
        {/* Trending Searches Header */}
        <div className={`${isDropdown ? 'p-3.5 border-b border-white/10 bg-zinc-900/95 shrink-0' : 'bg-gradient-to-r from-red-950/40 via-zinc-900/80 to-zinc-950 border border-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
                <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    Trending Searches
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.2 rounded bg-red-600 text-white animate-pulse">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Most searched titles across GeminiStream today
                </p>
              </div>
            </div>

            {onClose && (
              <button 
                type="button" 
                onClick={onClose} 
                className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition shrink-0"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Tags Carousel */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-3">
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQueryClick(tag)}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 transition whitespace-nowrap active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content: Ranked Trending Queries + Quick Picks */}
        <div className={`${isDropdown ? 'overflow-y-auto flex-1 p-3 space-y-4 no-scrollbar' : 'space-y-6'}`}>
          {/* Ranked Queries Grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <span>Popular Queries</span>
              <span className="text-red-400 font-medium">Real-Time Rank</span>
            </div>

            <div className={`grid ${isDropdown ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-1.5`}>
              {TRENDING_QUERIES.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleQueryClick(item.query)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-red-600/30 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-xs shrink-0 ${
                      index === 0 
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/40' 
                        : index === 1 
                          ? 'bg-amber-500 text-black font-bold' 
                          : index === 2 
                            ? 'bg-zinc-300 text-black font-bold' 
                            : 'bg-white/10 text-gray-400'
                    }`}>
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition truncate">
                          {item.query}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="text-gray-500">{item.searchesToday}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0 ml-2">
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-red-400 transition">
                      Search
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Quick-Picks (Movies ready to stream) */}
          {trendingQuickPicks.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Trending Movies Quick-Pick</span>
                </span>
                <span className="text-[10px] text-gray-500">Instant stream</span>
              </div>

              <div className={`grid ${isDropdown ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6'} gap-2 sm:gap-2.5`}>
                {trendingQuickPicks.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectMovie(m);
                      onClose?.();
                    }}
                    className="group/pick cursor-pointer space-y-1.5 rounded-xl bg-white/[0.02] p-1.5 hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 shadow-md">
                      <img
                        src={m.thumbnail || m.backdrop}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover/pick:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/pick:opacity-100 transition flex items-center justify-center">
                        <Play className="w-5 h-5 fill-white text-white drop-shadow-md" />
                      </div>
                      <div className="absolute top-1 left-1 bg-black/70 px-1 rounded text-[9px] font-bold text-amber-300">
                        ★ {typeof m.userRating === 'number' ? m.userRating.toFixed(1) : '8.2'}
                      </div>
                    </div>
                    <h4 className="text-[11px] font-bold text-gray-200 group-hover/pick:text-white truncate">
                      {m.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. ACTIVE SEARCH RESULTS VIEW (when user typed a query)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={`w-full ${isDropdown ? 'text-white flex flex-col h-full max-h-full overflow-hidden' : 'space-y-4 sm:space-y-6 pt-1 sm:pt-2 pb-12'}`}>
      {/* 1. Header with Search Query & Options (Movies vs TV Shows vs Categories) */}
      <div className={`${isDropdown ? 'p-2.5 sm:p-3.5 border-b border-white/10 bg-zinc-900/90 shrink-0' : 'bg-gradient-to-r from-red-950/40 via-zinc-900/80 to-zinc-950 border border-white/10 p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl'} space-y-2 sm:space-y-3`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2 truncate">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-600/20 px-2 py-0.5 rounded border border-red-500/30 shrink-0">
              Live Search
            </span>
            <span className="text-xs sm:text-sm text-gray-300 font-medium truncate">
              "<strong className="text-white font-bold">{searchTerm}</strong>"
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 font-bold shrink-0">
              ({totalResultsCount})
            </span>
          </div>

          {onClose && (
            <button 
              type="button" 
              onClick={onClose} 
              className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition shrink-0"
              title="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Media Type Options: All | Movies | TV Shows */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-red-500" />
            <span>Type:</span>
          </span>

          <button
            type="button"
            onClick={() => setMediaType('all')}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all active:scale-95 ${
              mediaType === 'all' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setMediaType('movie')}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center space-x-1 active:scale-95 ${
              mediaType === 'movie' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
            }`}
          >
            <Film className="w-3 h-3" />
            <span>Movies</span>
          </button>

          <button
            type="button"
            onClick={() => setMediaType('tv')}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center space-x-1 active:scale-95 ${
              mediaType === 'tv' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
            }`}
          >
            <Tv className="w-3 h-3" />
            <span>TV Shows</span>
          </button>
        </div>

        {/* Categories / Genres Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-white text-black font-black shadow-sm' 
                  : 'bg-white/5 hover:bg-white/15 text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Results Content: Catalog Verified Movies + TMDb Global Search */}
      <div className={`${isDropdown ? 'overflow-y-auto flex-1 p-2.5 sm:p-3.5 space-y-4 no-scrollbar' : 'space-y-6 sm:space-y-8'}`}>
        {/* Loading Indicator */}
        {isSearchingApi && (
          <div className="flex items-center justify-center space-x-2 py-3 text-red-500 bg-red-600/10 rounded-xl border border-red-500/20 animate-pulse text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-bold">Searching millions of movies & shows in live database...</span>
          </div>
        )}

        {/* No Results Fallback */}
        {totalResultsCount === 0 && !isSearchingApi && (
          <div className="text-center py-10 px-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-600/10 flex items-center justify-center text-red-500">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white">No exact matches found</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Try searching with another spelling, genre, or click one of our trending search queries above.
            </p>
          </div>
        )}

        {/* Section 1: Verified Catalog Results (Instantly available on site) */}
        {filteredCatalog.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
              <span className="flex items-center space-x-1.5 uppercase tracking-wider text-[11px] text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured Streams ({filteredCatalog.length})</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
              {filteredCatalog.map(movie => (
                <div
                  key={movie.id}
                  onClick={() => {
                    onSelectMovie(movie);
                    onClose?.();
                  }}
                  className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-red-600/50 transition cursor-pointer shadow-lg flex flex-col"
                >
                  <div className="relative aspect-[2/3] w-full bg-zinc-800 overflow-hidden">
                    <img 
                      src={movie.thumbnail || movie.backdrop} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute top-1.5 left-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-bold text-amber-300">
                      ★ {typeof movie.userRating === 'number' ? movie.userRating.toFixed(1) : '8.0'}
                    </div>
                  </div>

                  <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-bold text-white text-xs truncate group-hover:text-red-400 transition">
                        {movie.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                        {movie.year || 2024} • {movie.genre?.split(/[,/]/)[0] || 'Movie'}
                      </p>
                    </div>

                    <div className="flex gap-1 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlay(movie);
                          onClose?.();
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-black transition active:scale-95"
                      >
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>Play</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMovie(movie);
                          onClose?.();
                        }}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg text-[10px] font-bold transition"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Global Database API Results */}
        {filteredApiResults.length > 0 && (
          <div className="space-y-2 sm:space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300">
              <span className="flex items-center space-x-1.5 uppercase tracking-wider text-[11px] text-amber-400">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Global Database Results ({filteredApiResults.length})</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
              {filteredApiResults.map(item => {
                const title = item.name || item.title || 'Untitled';
                const isTv = item.type === 'tv_series' || item.type === 'tv' || (item as any).is_tv;
                const poster = item.image_url || (item as any).poster_path || (item as any).thumbnail;

                return (
                  <div
                    key={`api-${item.id}`}
                    onClick={() => handleSelectApiItem(item)}
                    className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/20 hover:border-amber-400/50 transition cursor-pointer shadow-lg flex flex-col"
                  >
                    <div className="relative aspect-[2/3] w-full bg-zinc-800 overflow-hidden">
                      {poster ? (
                        <img 
                          src={poster} 
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-gray-500">
                          <Film className="w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute top-1 left-1 flex gap-1">
                        <span className={`text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${isTv ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {isTv ? 'TV' : 'Movie'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    </div>

                    <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="font-bold text-white text-xs truncate group-hover:text-amber-400 transition" title={title}>
                          {title}
                        </h4>
                        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5">
                          <span>{item.year || 'TMDb'}</span>
                          {item.voteAverage && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400 font-bold">★ {item.voteAverage.toFixed(1)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1 pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayApiItem(item);
                          }}
                          className="flex-1 flex items-center justify-center space-x-1 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[10px] font-black transition active:scale-95"
                          title="Instant stream"
                        >
                          <Play className="w-2.5 h-2.5 fill-black" />
                          <span>Stream</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectApiItem(item);
                          }}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg text-[10px] font-bold transition"
                          title="Details"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const m = convertSearchResultToMovie(item);
                            setReportingMovie({ ...m, isTv: Boolean(isTv) });
                          }}
                          className="px-1.5 py-1 bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 hover:text-white rounded-lg text-[10px] font-bold transition border border-amber-500/20 active:scale-90"
                          title="Report issue (not playing or wrong movie)"
                        >
                          <AlertTriangle className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Instant Stream Fix & Report Modal */}
      {reportingMovie && (
        <ReportIssueModal
          isOpen={!!reportingMovie}
          movie={reportingMovie}
          onClose={() => setReportingMovie(null)}
          onFixApplied={() => {
            // Fix applied
          }}
          onPlayFixed={(fixedMovie) => {
            setReportingMovie(null);
            onPlay(fixedMovie);
            onClose?.();
          }}
        />
      )}
    </div>
  );
};

export default SearchBoxResults;
