import React, { useState, useMemo } from 'react';
import { Play, Info, Database, Film, Tv, Sparkles, X, ChevronRight, Loader2, Filter } from 'lucide-react';
import { Movie } from '../types.ts';
import { WatchmodeSearchResult, convertSearchResultToMovie } from '../services/watchmodeService.ts';
import { matchesMediaType, matchesCategory, isTvOrSeries } from '../services/streamService.ts';

interface SearchBoxResultsProps {
  searchTerm: string;
  catalogMovies: Movie[];
  apiSearchResults?: WatchmodeSearchResult[];
  isSearchingApi?: boolean;
  onSelectMovie: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  onClose?: () => void;
  isDropdown?: boolean;
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
  isDropdown = false
}) => {
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Genres');

  // Convert and merge results
  // 1. Filtered catalog movies matching searchTerm, mediaType, and category
  const filteredCatalog = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return catalogMovies.filter(m => {
      const matchesQuery = !q || 
        m.title.toLowerCase().includes(q) || 
        m.genre.toLowerCase().includes(q) || 
        (m.uploaderName && m.uploaderName.toLowerCase().includes(q));
      
      if (!matchesQuery) return false;
      if (!matchesMediaType(m, mediaType)) return false;
      if (!matchesCategory(m, selectedCategory)) return false;
      return true;
    });
  }, [catalogMovies, searchTerm, mediaType, selectedCategory]);

  // 2. Filtered TMDb database API results
  const filteredApiResults = useMemo(() => {
    return apiSearchResults.filter(item => {
      // Media type filter
      const isTv = item.type === 'tv_series' || item.type === 'tv';
      if (mediaType === 'tv' && !isTv) return false;
      if (mediaType === 'movie' && isTv) return false;

      // Category filter
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
  }, [apiSearchResults, mediaType, selectedCategory]);

  const totalResultsCount = filteredCatalog.length + filteredApiResults.length;

  const handlePlayApiItem = (item: WatchmodeSearchResult) => {
    const movie = convertSearchResultToMovie(item);
    onPlay(movie);
    onClose?.();
  };

  const handleSelectApiItem = (item: WatchmodeSearchResult) => {
    const movie = convertSearchResultToMovie(item);
    onSelectMovie(movie);
    onClose?.();
  };

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

        {/* Categories / Genres Option Switcher */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5 overscroll-contain">
          <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0 mr-1">
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition active:scale-95 shrink-0 ${
                  isSelected 
                    ? 'bg-amber-500 text-black shadow-sm font-black' 
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-gray-300 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Results Container */}
      <div className={`space-y-4 ${isDropdown ? 'flex-1 overflow-y-auto p-2 sm:p-3 overscroll-contain' : ''}`}>
        {/* Loading Indicator */}
        {isSearchingApi && (
          <div className="flex items-center justify-center space-x-2 py-3 text-amber-400 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs font-bold">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span className="truncate">Searching TMDb Database for "{searchTerm}"...</span>
          </div>
        )}

        {/* No results */}
        {!isSearchingApi && totalResultsCount === 0 && (
          <div className="p-6 sm:p-8 text-center bg-zinc-900/50 rounded-2xl border border-white/5 space-y-2">
            <Film className="w-8 h-8 text-gray-500 mx-auto" />
            <h4 className="text-xs sm:text-sm font-bold text-gray-200">No matching titles found</h4>
            <p className="text-[11px] sm:text-xs text-gray-400">
              Try switching the type to "All" or reset the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setMediaType('all');
                setSelectedCategory('All Genres');
              }}
              className="mt-2 text-xs text-red-400 hover:text-red-300 underline font-semibold"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Catalog Matches */}
        {filteredCatalog.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 font-bold px-1">
              <span className="flex items-center space-x-1.5 uppercase tracking-wider text-[10px] sm:text-[11px]">
                <Film className="w-3.5 h-3.5 text-red-500" />
                <span>Ready to Watch Catalog ({filteredCatalog.length})</span>
              </span>
            </div>

            <div className={`grid ${isDropdown ? 'grid-cols-1 sm:grid-cols-2 gap-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5'}`}>
              {filteredCatalog.map(movie => {
                const isTv = isTvOrSeries(movie);

                if (isDropdown) {
                  // Dropdown format: clean horizontal card that fits on any smartphone screen
                  return (
                    <div
                      key={movie.id}
                      onClick={() => {
                        onSelectMovie(movie);
                        onClose?.();
                      }}
                      className="group bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-red-600/60 rounded-xl overflow-hidden transition-all duration-200 flex flex-row p-2 space-x-2.5 sm:space-x-3 items-center cursor-pointer hover:shadow-xl active:scale-[0.98]"
                    >
                      <div className="w-12 h-16 sm:w-14 sm:h-20 shrink-0 relative rounded-lg overflow-hidden bg-black/60">
                        <img 
                          src={movie.thumbnail} 
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy" 
                        />
                        <div className="absolute top-1 left-1 flex gap-1">
                          <span className={`text-[8px] font-black uppercase px-1 py-0.2 rounded ${isTv ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'}`}>
                            {isTv ? 'TV' : 'Movie'}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-red-400 transition">
                            {movie.title}
                          </h4>
                          <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5 truncate">
                            <span>{movie.year}</span>
                            <span>·</span>
                            <span className="truncate">{movie.genre}</span>
                            {movie.userRating && (
                              <>
                                <span>·</span>
                                <span className="text-amber-400 font-bold">★ {movie.userRating.toFixed(1)}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPlay(movie);
                              onClose?.();
                            }}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] sm:text-xs font-black transition active:scale-95 shadow-sm"
                            title="Watch now"
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
                            className="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg text-[10px] sm:text-xs font-bold transition"
                            title="View details"
                          >
                            <Info className="w-2.5 h-2.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Page format: responsive grid for smartphone (2-cols) and desktop
                return (
                  <div
                    key={movie.id}
                    onClick={() => onSelectMovie(movie)}
                    className="group bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-red-600/60 rounded-xl overflow-hidden transition-all duration-200 flex flex-col cursor-pointer hover:shadow-xl active:scale-[0.98]"
                  >
                    <div className="aspect-[2/3] w-full relative overflow-hidden bg-black/60">
                      <img 
                        src={movie.thumbnail} 
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy" 
                      />
                      <div className="absolute top-1 left-1 flex gap-1">
                        <span className={`text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${isTv ? 'bg-purple-600 text-white' : 'bg-red-600 text-white'}`}>
                          {isTv ? 'TV' : 'Movie'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    </div>

                    <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="font-bold text-white text-xs truncate group-hover:text-red-400 transition" title={movie.title}>
                          {movie.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                          {movie.year} • {movie.genre}
                        </p>
                      </div>

                      <div className="flex gap-1 pt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlay(movie);
                          }}
                          className="flex-1 flex items-center justify-center space-x-1 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black transition active:scale-95"
                          title="Watch now"
                        >
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>Play</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMovie(movie);
                          }}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg text-[10px] font-bold transition"
                          title="Details"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TMDb Database API Matches */}
        {filteredApiResults.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-gray-400 font-bold px-1">
              <span className="flex items-center space-x-1.5 uppercase tracking-wider text-[10px] sm:text-[11px] text-amber-400">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>TMDb Database API Results ({filteredApiResults.length})</span>
              </span>
            </div>

            <div className={`grid ${isDropdown ? 'grid-cols-1 sm:grid-cols-2 gap-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5'}`}>
              {filteredApiResults.map(item => {
                const isTv = item.type === 'tv_series' || item.type === 'tv';
                const title = item.name || item.title || 'Untitled';

                if (isDropdown) {
                  return (
                    <div
                      key={`api-${item.id}`}
                      onClick={() => handleSelectApiItem(item)}
                      className="group bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-amber-500/60 rounded-xl overflow-hidden transition-all duration-200 flex flex-row p-2 space-x-2.5 sm:space-x-3 items-center cursor-pointer hover:shadow-xl active:scale-[0.98]"
                    >
                      <div className="w-12 h-16 sm:w-14 sm:h-20 shrink-0 relative rounded-lg overflow-hidden bg-black/60">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-gray-500">
                            <Film className="w-5 h-5" />
                          </div>
                        )}
                        <div className="absolute top-1 left-1 flex gap-1">
                          <span className={`text-[8px] font-black uppercase px-1 py-0.2 rounded ${isTv ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
                            {isTv ? 'TV' : 'Movie'}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h4 className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-amber-400 transition">
                            {title}
                          </h4>
                          <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5 truncate">
                            <span>{item.year || 'TMDb'}</span>
                            {item.voteAverage && (
                              <>
                                <span>·</span>
                                <span className="text-amber-400 font-bold">★ {item.voteAverage.toFixed(1)}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayApiItem(item);
                            }}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[10px] sm:text-xs font-black transition active:scale-95 shadow-sm"
                            title="Instant stream via TMDb ID"
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
                            className="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg text-[10px] sm:text-xs font-bold transition"
                            title="View details"
                          >
                            <Info className="w-2.5 h-2.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`api-${item.id}`}
                    onClick={() => handleSelectApiItem(item)}
                    className="group bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-amber-500/60 rounded-xl overflow-hidden transition-all duration-200 flex flex-col cursor-pointer hover:shadow-xl active:scale-[0.98]"
                  >
                    <div className="aspect-[2/3] w-full relative overflow-hidden bg-black/60">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy" 
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBoxResults;
