import React from 'react';
import { Movie } from '../types.ts';
import { PLATFORMS, PlatformId } from '../services/platformCatalog.ts';
import { NetflixLogo, PrimeVideoLogo, DisneyPlusLogo, AppleTvLogo, MaxLogo, HuluLogo } from './PlatformLogos.tsx';
import { ExternalLink, Play, Tv, Sparkles, Layers } from 'lucide-react';

interface StreamingServicesQuickBarProps {
  movies: Movie[];
  onSelectPlatform: (platformId: PlatformId) => void;
}

export const StreamingServicesQuickBar: React.FC<StreamingServicesQuickBarProps> = ({ movies, onSelectPlatform }) => {
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
    <section className="px-4 md:px-12 py-4 relative z-20" aria-label="Streaming Services Replica Hub">
      {/* Header with Title and Description */}
      <div className="bg-gradient-to-r from-zinc-900/90 via-[#161616] to-zinc-900/90 border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-red-500 mb-1">
              <Tv className="w-4 h-4 text-red-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400">
                Interactive Studio Replicas
              </span>
              <span aria-hidden="true" className="text-gray-600">·</span>
              <span className="text-[11px] font-bold text-gray-400">
                6 Full Platform Environments
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Streaming Services Hub</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Click any streaming service below to launch its authentic studio replica — styled with its official interface, hero billboard, top 10 charts, and all matching movies from our catalog.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 text-xs text-gray-400 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Click card to switch page · Icon to open in new tab</span>
          </div>
        </div>

        {/* 6 High-Fidelity Streaming Platform Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {platformIds.map((pId) => {
            const config = PLATFORMS[pId];
            const platformMovies = config.filterMovies(movies);
            const count = platformMovies.length;
            const newTabUrl = `${window.location.origin}${window.location.pathname}?platform=${pId}`;

            return (
              <div
                key={pId}
                className="group relative bg-black/60 hover:bg-black/90 border border-white/10 hover:border-white/30 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col justify-between cursor-pointer"
                onClick={() => onSelectPlatform(pId)}
                style={{
                  boxShadow: `0 8px 25px -12px ${config.glowColor}`
                }}
              >
                {/* Brand glow overlay on hover */}
                <div 
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-35 transition-opacity pointer-events-none"
                  style={{ backgroundColor: config.brandColor }}
                />

                {/* Top Row: Brand Logo + New Tab Link */}
                <div className="flex items-start justify-between gap-1 mb-3">
                  <div className="h-8 flex items-center">
                    {renderLogo(pId)}
                  </div>
                  
                  {/* Open in New Page / Tab Button */}
                  <a
                    href={newTabUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${config.name} replica in a new tab`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white transition opacity-70 group-hover:opacity-100"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Metadata */}
                <div className="space-y-1 mb-3">
                  <div className="text-[11px] font-black text-white group-hover:text-red-400 transition">
                    {config.name}
                  </div>
                  <div className="text-[10px] text-gray-400 line-clamp-1">
                    {config.tagline}
                  </div>
                  <div className="text-[10px] font-bold" style={{ color: config.brandColor === '#FFFFFF' ? '#E5E7EB' : config.brandColor }}>
                    {count} Available Movies
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlatform(pId);
                  }}
                  className="w-full py-1.5 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition active:scale-95 shadow-sm"
                  style={{
                    backgroundColor: config.brandColor === '#FFFFFF' ? '#FFFFFF' : `${config.brandColor}25`,
                    color: config.brandColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                    border: `1px solid ${config.brandColor}50`
                  }}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Open Replica</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
