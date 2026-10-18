import React, { useEffect, useState, useRef } from 'react';
import { PlatformId } from '../services/platformCatalog.ts';
import { NetflixLogo, NetflixNIcon, PrimeVideoLogo, DisneyPlusLogo, AppleTvLogo, MaxLogo, HuluLogo } from './PlatformLogos.tsx';
import { Film, Sparkles, ArrowRight } from 'lucide-react';

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
  secondaryColor: string;
  glowColor: string;
  raysColor: string;
  logo: React.ReactNode;
  icon: React.ReactNode;
  tagline: string;
}

export const PLATFORM_THEMES: Record<TransitionEntity, PlatformTheme> = {
  geministream: {
    name: 'GeminiStream',
    primaryColor: '#E50914',
    secondaryColor: '#FFB800',
    glowColor: 'rgba(229, 9, 20, 0.6)',
    raysColor: 'rgba(255, 60, 60, 0.45)',
    logo: (
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-2xl bg-red-600/30 border border-red-500/50 shadow-[0_0_25px_rgba(229,9,20,0.6)]">
          <Film className="w-8 h-8 text-red-500 fill-red-500" />
        </div>
        <span className="font-royal font-black text-2xl sm:text-3xl tracking-wider text-red-500 uppercase drop-shadow-[0_0_20px_rgba(229,9,20,0.7)]">
          GeminiStream
        </span>
      </div>
    ),
    icon: <Film className="w-6 h-6 text-red-500 fill-red-500" />,
    tagline: 'The Future of Entertainment'
  },
  netflix: {
    name: 'Netflix',
    primaryColor: '#E50914',
    secondaryColor: '#B81D24',
    glowColor: 'rgba(229, 9, 20, 0.75)',
    raysColor: 'rgba(229, 9, 20, 0.55)',
    logo: <NetflixLogo className="h-9 sm:h-12 scale-110" />,
    icon: <NetflixNIcon className="w-7 h-10" />,
    tagline: 'See what is next'
  },
  prime: {
    name: 'Prime Video',
    primaryColor: '#00A8E1',
    secondaryColor: '#1A98FF',
    glowColor: 'rgba(0, 168, 225, 0.75)',
    raysColor: 'rgba(0, 168, 225, 0.55)',
    logo: <PrimeVideoLogo className="h-9 sm:h-12 scale-110" />,
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#00A8E1]/30 flex items-center justify-center font-black text-white text-xs border border-[#00A8E1]/60 shadow-[0_0_15px_rgba(0,168,225,0.6)]">
        PV
      </div>
    ),
    tagline: 'Prime Original Series & Movies'
  },
  disney: {
    name: 'Disney+',
    primaryColor: '#113CCF',
    secondaryColor: '#00D2FF',
    glowColor: 'rgba(17, 60, 207, 0.8)',
    raysColor: 'rgba(0, 210, 255, 0.5)',
    logo: <DisneyPlusLogo className="h-9 sm:h-12 scale-110" />,
    icon: (
      <span className="font-serif italic font-black text-white text-lg drop-shadow-[0_0_12px_rgba(0,210,255,0.8)]">
        D+
      </span>
    ),
    tagline: 'Endless Stories & Cinematic Universes'
  },
  appletv: {
    name: 'Apple TV+',
    primaryColor: '#FFFFFF',
    secondaryColor: '#8E8E93',
    glowColor: 'rgba(255, 255, 255, 0.7)',
    raysColor: 'rgba(255, 255, 255, 0.4)',
    logo: <AppleTvLogo className="h-9 sm:h-12 scale-110" />,
    icon: (
      <span className="font-bold text-white text-base tracking-tight">
        tv+
      </span>
    ),
    tagline: 'Apple Original Stories & Dramas'
  },
  max: {
    name: 'Max',
    primaryColor: '#7B2CBF',
    secondaryColor: '#002BE7',
    glowColor: 'rgba(123, 44, 191, 0.8)',
    raysColor: 'rgba(123, 44, 191, 0.55)',
    logo: <MaxLogo className="h-9 sm:h-12 scale-110" />,
    icon: (
      <span className="font-black italic text-white text-lg drop-shadow-[0_0_15px_rgba(123,44,191,0.9)]">
        MAX
      </span>
    ),
    tagline: 'The One to Watch'
  },
  hulu: {
    name: 'Hulu',
    primaryColor: '#1CE783',
    secondaryColor: '#00C853',
    glowColor: 'rgba(28, 231, 131, 0.8)',
    raysColor: 'rgba(28, 231, 131, 0.55)',
    logo: <HuluLogo className="h-9 sm:h-12 scale-110" />,
    icon: (
      <span className="font-black text-[#1CE783] text-lg lowercase drop-shadow-[0_0_12px_rgba(28,231,131,0.8)]">
        hulu
      </span>
    ),
    tagline: 'Stream Original TV & Blockbusters'
  }
};

export const PlatformTransitionOverlay: React.FC<PlatformTransitionOverlayProps> = ({
  fromPlatform,
  toPlatform,
  isActive,
  onAnimationComplete
}) => {
  const [animationStage, setAnimationStage] = useState<'charging' | 'raysBurst' | 'targetReveal' | 'fadeOut'>('charging');
  const soundPlayedRef = useRef(false);

  const fromTheme = PLATFORM_THEMES[fromPlatform] || PLATFORM_THEMES.geministream;
  const toTheme = PLATFORM_THEMES[toPlatform] || PLATFORM_THEMES.netflix;

  // Synthesize cinematic light beam audio cue using Web Audio API (gracefully fails silent if restricted)
  useEffect(() => {
    if (!isActive || soundPlayedRef.current) return;
    soundPlayedRef.current = true;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      // 1. Cinematic low drone / boom
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.9);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);

      // 2. High-frequency light streak shimmer
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(520, now + 0.35);
      shimmer.frequency.exponentialRampToValueAtTime(1040, now + 0.9);

      shimmerGain.gain.setValueAtTime(0.001, now + 0.35);
      shimmerGain.gain.linearRampToValueAtTime(0.04, now + 0.55);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      shimmer.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);

      shimmer.start(now + 0.35);
      shimmer.stop(now + 1.15);
    } catch {
      // Audio autoplay policy handled silently
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      soundPlayedRef.current = false;
      return;
    }

    setAnimationStage('charging');

    // Stage 1: Initial charge (0 - 320ms)
    const timer1 = setTimeout(() => {
      setAnimationStage('raysBurst');
    }, 320);

    // Stage 2: Light Rays burst & target reveal (320ms - 880ms)
    const timer2 = setTimeout(() => {
      setAnimationStage('targetReveal');
    }, 850);

    // Stage 3: Fade out to content (880ms - 1350ms)
    const timer3 = setTimeout(() => {
      setAnimationStage('fadeOut');
    }, 1320);

    // Stage 4: Completed
    const timer4 = setTimeout(() => {
      onAnimationComplete();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isActive, fromPlatform, toPlatform]);

  if (!isActive) return null;

  // Skip animation on click or tap
  const handleSkip = () => {
    onAnimationComplete();
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#06070a] select-none transition-opacity duration-300 ${
        animationStage === 'fadeOut' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={handleSkip}
    >
      {/* 1. Volumetric Rotating Radial Light Rays */}
      <div 
        className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-all duration-700 ${
          animationStage === 'raysBurst' || animationStage === 'targetReveal' 
            ? 'scale-125 opacity-100' 
            : 'scale-90 opacity-30'
        }`}
      >
        <div 
          className="w-[200vw] h-[200vw] sm:w-[150vw] sm:h-[150vw] rounded-full animate-[spin_12s_linear_infinite]"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg,
              ${toTheme.raysColor} 15deg,
              transparent 30deg,
              ${toTheme.primaryColor}33 45deg,
              transparent 60deg,
              ${toTheme.raysColor} 75deg,
              transparent 90deg,
              ${toTheme.primaryColor}44 105deg,
              transparent 120deg,
              ${toTheme.raysColor} 135deg,
              transparent 150deg,
              ${toTheme.primaryColor}33 165deg,
              transparent 180deg,
              ${toTheme.raysColor} 195deg,
              transparent 210deg,
              ${toTheme.primaryColor}44 225deg,
              transparent 240deg,
              ${toTheme.raysColor} 255deg,
              transparent 270deg,
              ${toTheme.primaryColor}33 285deg,
              transparent 300deg,
              ${toTheme.raysColor} 315deg,
              transparent 330deg,
              ${toTheme.primaryColor}44 345deg,
              transparent 360deg
            )`,
            maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 10%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 70%)'
          }}
        />
      </div>

      {/* 2. Secondary Counter-Rotating Light Shafts */}
      <div 
        className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 mix-blend-screen"
      >
        <div 
          className="w-[180vw] h-[180vw] rounded-full animate-[spin_20s_linear_infinite_reverse]"
          style={{
            background: `conic-gradient(from 45deg at 50% 50%, 
              transparent 0deg,
              ${fromTheme.primaryColor}44 25deg,
              transparent 50deg,
              ${toTheme.secondaryColor}44 75deg,
              transparent 100deg,
              ${fromTheme.primaryColor}44 125deg,
              transparent 150deg,
              ${toTheme.secondaryColor}44 175deg,
              transparent 200deg,
              ${fromTheme.primaryColor}44 225deg,
              transparent 250deg,
              ${toTheme.secondaryColor}44 275deg,
              transparent 300deg,
              ${fromTheme.primaryColor}44 325deg,
              transparent 360deg
            )`,
            filter: 'blur(30px)'
          }}
        />
      </div>

      {/* 3. Intense Central Core Flare & Optical Streak */}
      <div 
        className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-all duration-500 ${
          animationStage === 'raysBurst' || animationStage === 'targetReveal' 
            ? 'opacity-100 scale-100' 
            : 'opacity-40 scale-75'
        }`}
      >
        {/* Horizontal Anamorphic Cinema Flare */}
        <div 
          className="absolute w-[140vw] h-1.5 sm:h-2.5 rounded-full blur-[2px] transition-all duration-700 animate-pulse"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${toTheme.secondaryColor} 20%, #ffffff 50%, ${toTheme.primaryColor} 80%, transparent 100%)`,
            boxShadow: `0 0 45px 12px ${toTheme.glowColor}`
          }}
        />

        {/* Diagonal Light Streak */}
        <div 
          className="absolute w-[100vw] h-1 rotate-45 rounded-full blur-[3px] opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%)`,
            boxShadow: `0 0 30px 6px ${toTheme.primaryColor}`
          }}
        />

        {/* Core Pulsing Nebula Glow */}
        <div 
          className="w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[70px] pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${toTheme.glowColor} 0%, ${toTheme.primaryColor}33 50%, transparent 75%)`
          }}
        />
      </div>

      {/* 4. Cinematic Stage Content: Transition Pipeline (GeminiStream -> Target Platform) */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 max-w-xl text-center">
        
        {/* Top Transition Tracker Pills */}
        <div 
          className={`flex items-center space-x-2.5 mb-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 ${
            animationStage === 'charging' ? 'opacity-80 translate-y-0' : 'opacity-100 -translate-y-1'
          }`}
        >
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-300">
            <span>{fromTheme.name}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <div className="flex items-center space-x-1.5 text-xs font-black" style={{ color: toTheme.primaryColor }}>
            <span className="w-2 h-2 rounded-full animate-ping inline-block" style={{ backgroundColor: toTheme.primaryColor }} />
            <span>{toTheme.name}</span>
          </div>
        </div>

        {/* Dynamic Center Branding Morph */}
        <div className="relative h-28 sm:h-36 flex items-center justify-center">
          
          {/* Stage A: Source Platform (Charging & Zooming Out) */}
          <div 
            className={`absolute flex flex-col items-center justify-center transition-all duration-500 ease-out ${
              animationStage === 'charging' 
                ? 'opacity-100 scale-100 filter-none' 
                : 'opacity-0 scale-75 blur-md pointer-events-none'
            }`}
          >
            <div className="transform transition-transform duration-300">
              {fromTheme.logo}
            </div>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-3 animate-pulse">
              Transitioning Portal...
            </p>
          </div>

          {/* Stage B: Target Platform Reveal (Expanding with Divine Rays Burst) */}
          <div 
            className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${
              animationStage === 'raysBurst' || animationStage === 'targetReveal' || animationStage === 'fadeOut'
                ? 'opacity-100 scale-100 sm:scale-110 filter-none' 
                : 'opacity-0 scale-125 blur-lg pointer-events-none'
            }`}
          >
            <div 
              className="transform drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-500"
              style={{
                filter: `drop-shadow(0 0 25px ${toTheme.glowColor})`
              }}
            >
              {toTheme.logo}
            </div>

            {/* Target Platform Tagline */}
            <div className="mt-4 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-white/70 animate-spin" />
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-white/90 drop-shadow-md">
                {toTheme.tagline}
              </p>
              <Sparkles className="w-3.5 h-3.5 text-white/70 animate-spin" />
            </div>
          </div>
        </div>

        {/* Ambient Loading Indicator Bar */}
        <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden relative border border-white/5">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: animationStage === 'charging' ? '30%' : animationStage === 'raysBurst' ? '70%' : '100%',
              backgroundColor: toTheme.primaryColor,
              boxShadow: `0 0 12px ${toTheme.primaryColor}`
            }}
          />
        </div>

        {/* Skip Tip */}
        <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mt-4 opacity-60">
          Click anywhere to skip
        </span>
      </div>

      {/* Floating Light Ray Dust & Spark Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '25%', left: '20%', size: 'w-1 h-1', delay: '0s', dur: '3s' },
          { top: '35%', left: '75%', size: 'w-1.5 h-1.5', delay: '0.4s', dur: '2.5s' },
          { top: '65%', left: '15%', size: 'w-2 h-2', delay: '0.2s', dur: '4s' },
          { top: '75%', left: '80%', size: 'w-1 h-1', delay: '0.6s', dur: '3.2s' },
          { top: '20%', left: '60%', size: 'w-1 h-1', delay: '0.8s', dur: '2.8s' },
          { top: '80%', left: '40%', size: 'w-1.5 h-1.5', delay: '0.3s', dur: '3.5s' },
        ].map((spark, idx) => (
          <div 
            key={idx}
            className={`absolute ${spark.size} rounded-full bg-white animate-pulse shadow-[0_0_10px_#ffffff]`}
            style={{
              top: spark.top,
              left: spark.left,
              animationDelay: spark.delay,
              animationDuration: spark.dur
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PlatformTransitionOverlay;
