import React from 'react';
import { PlatformId } from '../services/platformCatalog.ts';
import { NetflixLogo, PrimeVideoLogo, DisneyPlusLogo, AppleTvLogo, MaxLogo, HuluLogo } from './PlatformLogos.tsx';

interface StreamingPlatformLogosBarProps {
  onSelectPlatform: (platformId: PlatformId) => void;
}

export const StreamingPlatformLogosBar: React.FC<StreamingPlatformLogosBarProps> = ({ onSelectPlatform }) => {
  const platforms: { 
    id: PlatformId; 
    name: string; 
    logo: React.ReactNode; 
    hoverBorder: string;
    hoverGlow: string;
  }[] = [
    { 
      id: 'netflix', 
      name: 'Netflix', 
      logo: <NetflixLogo className="h-5 sm:h-6 md:h-7" />, 
      hoverBorder: 'hover:border-red-600/70',
      hoverGlow: 'hover:shadow-[0_4px_20px_rgba(229,9,20,0.35)]'
    },
    { 
      id: 'prime', 
      name: 'Prime Video', 
      logo: <PrimeVideoLogo className="h-5 sm:h-6 md:h-7" />, 
      hoverBorder: 'hover:border-cyan-400/70',
      hoverGlow: 'hover:shadow-[0_4px_20px_rgba(0,168,225,0.35)]'
    },
    { 
      id: 'disney', 
      name: 'Disney+', 
      logo: <DisneyPlusLogo className="h-5 sm:h-6 md:h-7" />, 
      hoverBorder: 'hover:border-blue-500/70',
      hoverGlow: 'hover:shadow-[0_4px_20px_rgba(17,60,207,0.35)]'
    },
    { 
      id: 'appletv', 
      name: 'Apple TV+', 
      logo: <AppleTvLogo className="h-5 sm:h-6 md:h-7" />, 
      hoverBorder: 'hover:border-white/70',
      hoverGlow: 'hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)]'
    },
    { 
      id: 'max', 
      name: 'Max', 
      logo: <MaxLogo className="h-5 sm:h-6 md:h-7" />, 
      hoverBorder: 'hover:border-purple-500/70',
      hoverGlow: 'hover:shadow-[0_4px_20px_rgba(123,44,191,0.35)]'
    },
    { 
      id: 'hulu', 
      name: 'Hulu', 
      logo: <HuluLogo className="h-5 sm:h-6 md:h-7" />, 
      hoverBorder: 'hover:border-emerald-500/70',
      hoverGlow: 'hover:shadow-[0_4px_20px_rgba(28,231,131,0.35)]'
    },
  ];

  return (
    <section className="px-3 sm:px-6 md:px-12 py-2 sm:py-3 relative z-20" aria-label="Streaming Platform Hubs">
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {platforms.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPlatform(p.id)}
            className={`group flex items-center justify-center py-2.5 sm:py-3.5 px-2 sm:px-4 bg-zinc-950/70 hover:bg-zinc-900 border border-white/10 ${p.hoverBorder} ${p.hoverGlow} rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md`}
            title={`Open ${p.name}`}
          >
            <div className="transition-transform duration-300 group-hover:scale-105 scale-90 sm:scale-100">
              {p.logo}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
export default StreamingPlatformLogosBar;
