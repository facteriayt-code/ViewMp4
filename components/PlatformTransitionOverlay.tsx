import React, { useEffect, useState, useRef } from 'react';
import { PlatformId } from '../services/platformCatalog.ts';
import { NetflixLogo, NetflixNIcon, PrimeVideoLogo, DisneyPlusLogo, AppleTvLogo, MaxLogo, HuluLogo } from './PlatformLogos.tsx';
import { Film, ArrowRight, Loader2 } from 'lucide-react';

export type TransitionEntity = PlatformId | 'geministream';

interface PlatformTransitionOverlayProps {
  fromPlatform: TransitionEntity;
  toPlatform: TransitionEntity;
  isActive: boolean;
  onAnimationComplete: () => void;
}

interface PlatformTheme {
  name: string;
  primaryColor: string;
  glowColor: string;
  logo: React.ReactNode;
  tagline: string;
}

export const PLATFORM_THEMES: Record<TransitionEntity, PlatformTheme> = {
  geministream: {
    name: 'GeminiStream',
    primaryColor: '#E50914',
    glowColor: 'rgba(229, 9, 20, 0.35)',
    logo: (
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/40 shadow-lg shadow-red-600/20">
          <Film className="w-6 h-6 text-red-500 fill-red-500" />
        </div>
        <span className="font-royal font-black text-xl sm:text-2xl tracking-wider text-red-500 uppercase drop-shadow-md">
          GeminiStream
        </span>
      </div>
    ),
    tagline: 'The Future of Entertainment'
  },
  netflix: {
    name: 'Netflix',
    primaryColor: '#E50914',
    glowColor: 'rgba(229, 9, 20, 0.4)',
    logo: <NetflixLogo className="h-8 sm:h-10" />,
    tagline: 'See what is next'
  },
  prime: {
    name: 'Prime Video',
    primaryColor: '#00A8E1',
    glowColor: 'rgba(0, 168, 225, 0.4)',
    logo: <PrimeVideoLogo className="h-8 sm:h-10" />,
    tagline: 'Prime Original Series & Movies'
  },
  disney: {
    name: 'Disney+',
    primaryColor: '#113CCF',
    glowColor: 'rgba(17, 60, 207, 0.4)',
    logo: <DisneyPlusLogo className="h-8 sm:h-10" />,
    tagline: 'Endless Stories & Cinematic Universes'
  },
  appletv: {
    name: 'Apple TV+',
    primaryColor: '#FFFFFF',
    glowColor: 'rgba(255, 255, 255, 0.3)',
    logo: <AppleTvLogo className="h-8 sm:h-10" />,
    tagline: 'Apple Original Stories & Dramas'
  },
  max: {
    name: 'Max',
    primaryColor: '#7B2CBF',
    glowColor: 'rgba(123, 44, 191, 0.4)',
    logo: <MaxLogo className="h-8 sm:h-10" />,
    tagline: 'The One to Watch'
  },
  hulu: {
    name: 'Hulu',
    primaryColor: '#1CE783',
    glowColor: 'rgba(28, 231, 131, 0.4)',
    logo: <HuluLogo className="h-8 sm:h-10" />,
    tagline: 'Stream Original TV & Blockbusters'
  }
};

export const PlatformTransitionOverlay: React.FC<PlatformTransitionOverlayProps> = ({
  fromPlatform,
  toPlatform,
  isActive,
  onAnimationComplete
}) => {
  const [stage, setStage] = useState<'charging' | 'revealing' | 'fadeOut'>('charging');
  const [progress, setProgress] = useState(0);

  const fromTheme = PLATFORM_THEMES[fromPlatform] || PLATFORM_THEMES.geministream;
  const toTheme = PLATFORM_THEMES[toPlatform] || PLATFORM_THEMES.netflix;

  // Smooth realistic progress counter
  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const delta = Math.floor(Math.random() * 9) + 7;
        return Math.min(100, prev + delta);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    setStage('charging');

    // Stage 1: Initial charging & brand connection (0 - 400ms)
    const t1 = setTimeout(() => {
      setStage('revealing');
    }, 400);

    // Stage 2: Fade out & smooth un-blur (1100ms)
    const t2 = setTimeout(() => {
      setStage('fadeOut');
    }, 1150);

    // Stage 3: Animation complete (1350ms)
    const t3 = setTimeout(() => {
      onAnimationComplete();
    }, 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isActive, fromPlatform, toPlatform]);

  if (!isActive) return null;

  const handleSkip = () => {
    onAnimationComplete();
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center select-none transition-all duration-400 ${
        stage === 'fadeOut' 
          ? 'opacity-0 pointer-events-none' 
          : 'opacity-100 bg-black/45 backdrop-blur-xl sm:backdrop-blur-2xl'
      }`}
      onClick={handleSkip}
    >
      {/* Soft Ambient Brand Glow (No harsh rays or light beams) */}
      <div 
        className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full blur-[90px] pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${toTheme.glowColor} 0%, transparent 70%)`
        }}
      />

      {/* Premium Floating Loading Card */}
      <div 
        className={`relative z-10 w-[90%] max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl bg-[#0e1017]/80 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col items-center text-center transition-all duration-500 ${
          stage === 'fadeOut' ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Subtle Route Pipeline: [GeminiStream] ➔ [Target Platform] */}
        <div className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/10 mb-6 text-xs">
          <span className="font-semibold text-zinc-300">{fromTheme.name}</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
          <span className="font-bold flex items-center space-x-1.5" style={{ color: toTheme.primaryColor }}>
            <span className="w-2 h-2 rounded-full animate-ping inline-block" style={{ backgroundColor: toTheme.primaryColor }} />
            <span>{toTheme.name}</span>
          </span>
        </div>

        {/* Center Stage: Elegant Spinner & Logo Morph */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center my-2">
          {/* Circular SVG Stroke Spinner */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="3.5"
            />
            {/* Active animated progress arc */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={toTheme.primaryColor}
              strokeWidth="4"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${toTheme.primaryColor})`
              }}
            />
          </svg>

          {/* Morphing Logo Inside Spinner */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {stage === 'charging' ? (
              <div className="animate-in fade-in zoom-in-90 duration-300 transform scale-90 sm:scale-100">
                {fromTheme.logo}
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-400 transform scale-95 sm:scale-105">
                {toTheme.logo}
              </div>
            )}
          </div>
        </div>

        {/* Brand Tagline */}
        <p className="text-xs sm:text-sm font-medium text-zinc-300 mt-4 h-5 truncate max-w-xs">
          {toTheme.tagline}
        </p>

        {/* Minimal Progress Bar & Percentage */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
              Opening {toTheme.name} replica...
            </span>
            <span className="font-mono font-bold text-white">{progress}%</span>
          </div>

          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: toTheme.primaryColor,
                boxShadow: `0 0 10px ${toTheme.primaryColor}`
              }}
            />
          </div>
        </div>

        {/* Discreet skip caption */}
        <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase mt-4">
          Click anywhere to skip
        </span>
      </div>
    </div>
  );
};

export default PlatformTransitionOverlay;
