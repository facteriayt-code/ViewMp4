import React from 'react';
import { Movie } from '../types.ts';
import { PLATFORMS, PlatformId } from '../services/platformCatalog.ts';
import { NetflixLogo, NetflixNIcon, PrimeVideoLogo, DisneyPlusLogo, AppleTvLogo, MaxLogo, HuluLogo } from './PlatformLogos.tsx';
import { Tv, Sparkles, ChevronRight, Play } from 'lucide-react';

interface StreamingPlatformHubProps {
  movies: Movie[];
  onSelectPlatform: (platformId: PlatformId) => void;
}

export const StreamingPlatformHub: React.FC<StreamingPlatformHubProps> = ({ movies, onSelectPlatform }) => {
  const platformIds: PlatformId[] = ['netflix', 'prime', 'disney', 'appletv', 'max', 'hulu'];

  const renderLogo = (id: PlatformId) => {
    switch (id) {
      case 'netflix':
        return <NetflixLogo className="h-6 md:h-7" />;
      case 'prime':
        return <PrimeVideoLogo className="h-6 md:h-7" />;
      case 'disney':
        return <DisneyPlusLogo className="h-6 md:h-7" />;
      case 'appletv':
        return <AppleTvLogo className="h-6 md:h-7" />;
      case 'max':
        return <MaxLogo className="h-6 md:h-7" />;
      case 'hulu':
        return <HuluLogo className="h-6 md:h-7" />;
    }
  };

  return (
    <section className="px-4 md:px-12 py-8 relative z-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-3 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-red-500 mb-1">
            <Tv className="w-4 h-4 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
              Interactive Streaming Hubs
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Browse by Streaming Platform</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-semibold uppercase tracking-wider hidden sm:inline-block">
              Full Replicas
            </span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
            Launch authentic studio replicas of Netflix, Prime Video, Disney+, Apple TV+, Max, and Hulu to explore blockbusters stored in our database.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Themes & Real Streams</span>
        </div>
      </div>

      {/* Grid of Streaming Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {platformIds.map((pId) => {
          const config = PLATFORMS[pId];
          const availableMovies = config.filterMovies(movies);
          const previewPosters = availableMovies.slice(0, 4);

          return (
            <div
              key={pId}
              onClick={() => onSelectPlatform(pId)}
              className="group cursor-pointer relative bg-gradient-to-b from-white/[0.04] to-black/70 border border-white/10 hover:border-white/30 rounded-3xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden flex flex-col justify-between"
              style={{
                boxShadow: `0 10px 30px -15px ${config.glowColor}`
              }}
            >
              {/* Subtle top glow highlight */}
              <div 
                className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: config.brandColor }}
              />

              <div>
                {/* Header row: Logo & Available Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
                    {renderLogo(pId)}
                  </div>
                  <div className="text-right">
                    <span 
                      className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full border tracking-wider"
                      style={{ 
                        color: config.brandColor === '#FFFFFF' ? '#E5E7EB' : config.brandColor,
                        borderColor: `${config.brandColor}40`,
                        backgroundColor: `${config.brandColor}15`
                      }}
                    >
                      {availableMovies.length} Titles
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 font-medium line-clamp-2 mb-4 leading-relaxed">
                  {config.tagline}
                </p>

                {/* Mini Preview Poster Strip */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {previewPosters.map((pm) => (
                    <div 
                      key={pm.id} 
                      className="aspect-[2/3] rounded-xl overflow-hidden bg-black/50 border border-white/5 relative group-hover:border-white/20 transition"
                    >
                      <img 
                        src={pm.thumbnail} 
                        alt={pm.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div 
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all duration-300"
                style={{
                  backgroundColor: config.brandColor === '#FFFFFF' ? '#FFFFFF' : `${config.brandColor}20`,
                  color: config.brandColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                  border: `1px solid ${config.brandColor}50`
                }}
              >
                <div className="flex items-center space-x-2">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch {config.shortName} Replica</span>
                </div>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
