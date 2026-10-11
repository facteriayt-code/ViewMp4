import React from 'react';

interface MovieCardSkeletonProps {
  isTop10?: boolean;
  rank?: number;
}

/**
 * Individual Movie Card Skeleton Loader
 * Perfectly matches the dimensions and 2:3 aspect ratio of cards in MovieRow
 */
export const MovieCardSkeleton: React.FC<MovieCardSkeletonProps> = ({ isTop10, rank }) => {
  return (
    <div className="relative flex-none flex items-start shrink-0">
      {isTop10 && (
        <div className="w-10 sm:w-14 md:w-16 flex items-end justify-end shrink-0 z-10 pointer-events-none -mr-3 sm:-mr-5 md:-mr-6 select-none h-[195px] sm:h-[240px] md:h-[278px] lg:h-[300px] pb-1">
          <div className="w-8 sm:w-12 h-16 sm:h-24 rounded-lg bg-white/[0.04] animate-pulse" />
        </div>
      )}

      <div className="w-[130px] sm:w-[160px] md:w-[185px] lg:w-[200px] flex flex-col shrink-0">
        <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-zinc-900/90 border border-white/5 shadow-lg animate-shimmer">
          {/* Top badge skeleton */}
          <div className="absolute top-2 left-2 w-9 h-3.5 rounded bg-white/10" />
          <div className="absolute top-2 right-2 w-6 h-6 rounded bg-white/10" />
          
          {/* Shimmering Center silhouette icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-10 h-10 rounded-full border-2 border-white" />
          </div>
        </div>

        {/* Title and metadata skeleton lines */}
        <div className="pt-2 space-y-1.5 px-0.5">
          <div className="h-3 sm:h-3.5 w-4/5 rounded bg-white/10 animate-shimmer" />
          <div className="h-2.5 w-1/2 rounded bg-white/5 animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

interface MovieRowSkeletonProps {
  title?: string;
  count?: number;
  isTop10?: boolean;
}

/**
 * Full MovieRow Skeleton Loader
 * Renders header bar and horizontal scroll track of card skeletons
 */
export const MovieRowSkeleton: React.FC<MovieRowSkeletonProps> = ({ 
  title, 
  count = 7, 
  isTop10 = false 
}) => {
  return (
    <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
      {/* Row Header Skeleton */}
      <div className="flex items-center px-4 sm:px-8 md:px-12 lg:px-16 justify-between gap-4">
        <div className="flex items-center space-x-3 min-w-0">
          {title ? (
            <h3 className="font-royal text-base sm:text-2xl md:text-3xl text-white/40 tracking-wider uppercase flex items-center gap-2 whitespace-nowrap">
              <span>{title}</span>
            </h3>
          ) : (
            <div className="h-6 sm:h-8 w-44 sm:w-64 rounded-lg bg-white/10 animate-shimmer" />
          )}
          <div className="h-5 w-14 rounded-full bg-white/5 animate-pulse" />
        </div>
      </div>

      {/* Cards Horizontal Carousel Track */}
      <div className="relative flex items-center">
        <div className="row-container flex items-start space-x-3 sm:space-x-4 md:space-x-5 overflow-x-hidden px-4 sm:px-8 md:px-12 lg:px-16 py-3 no-scrollbar">
          {Array.from({ length: count }).map((_, idx) => (
            <MovieCardSkeleton 
              key={`row-skel-${idx}`} 
              isTop10={isTop10} 
              rank={idx + 1} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface SearchCardSkeletonProps {
  isDropdown?: boolean;
}

/**
 * Individual Search Result Card Skeleton
 * Matches the aspect ratio, border styling, and actions of cards in SearchBoxResults
 */
export const SearchCardSkeleton: React.FC<SearchCardSkeletonProps> = ({ isDropdown = false }) => {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg flex flex-col animate-pulse">
      {/* 2:3 Poster Area with shimmer sweep */}
      <div className="relative aspect-[2/3] w-full bg-zinc-800/90 animate-shimmer overflow-hidden">
        {/* Type chip skeleton */}
        <div className="absolute top-1.5 left-1.5 w-10 h-3.5 rounded bg-white/15" />
        {/* Rating chip skeleton */}
        <div className="absolute top-1.5 right-1.5 w-9 h-3.5 rounded bg-white/15" />

        {/* Center film icon outline */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-8 h-8 rounded border border-white" />
        </div>
      </div>

      {/* Card Info & Action Buttons Skeleton */}
      <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1 space-y-2">
        <div className="space-y-1.5">
          <div className="h-3 w-4/5 rounded bg-white/15 animate-shimmer" />
          <div className="h-2.5 w-1/2 rounded bg-white/10 animate-shimmer" />
        </div>

        <div className="flex gap-1 pt-1">
          <div className="flex-1 h-6 rounded-lg bg-white/15 animate-shimmer" />
          <div className="w-6 h-6 rounded-lg bg-white/10 animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

interface SearchResultsSkeletonProps {
  isDropdown?: boolean;
  count?: number;
  message?: string;
}

/**
 * Grid Skeleton Loader for SearchBoxResults
 * Provides instant visual feedback while catalog and live TMDb API queries resolve
 */
export const SearchResultsSkeleton: React.FC<SearchResultsSkeletonProps> = ({
  isDropdown = false,
  count,
  message = "Fetching live titles and posters..."
}) => {
  const cardCount = count || (isDropdown ? 6 : 12);

  return (
    <div className="space-y-3">
      {message && (
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="truncate">{message}</span>
        </div>
      )}

      <div className={`grid ${isDropdown ? 'grid-cols-2 xs:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'} gap-2.5 sm:gap-3.5`}>
        {Array.from({ length: cardCount }).map((_, idx) => (
          <SearchCardSkeleton 
            key={`search-skel-${idx}`} 
            isDropdown={isDropdown} 
          />
        ))}
      </div>
    </div>
  );
};
