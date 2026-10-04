import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const NetflixLogo: React.FC<LogoProps> = ({ className = 'h-7' }) => (
  <div className={`flex items-center select-none ${className}`}>
    <span className="font-black text-red-600 tracking-wider text-2xl md:text-3xl uppercase font-sans drop-shadow-[0_2px_10px_rgba(229,9,20,0.4)]">
      NETFLIX
    </span>
  </div>
);

export const NetflixNIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-10' }) => (
  <svg viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M0 0H7.5V40H0V0Z" fill="#B81D24" />
    <path d="M16.5 0H24V40H16.5V0Z" fill="#B81D24" />
    <path d="M0 0H7.5L24 40H16.5L0 0Z" fill="#E50914" />
  </svg>
);

export const PrimeVideoLogo: React.FC<LogoProps> = ({ className = 'h-7' }) => (
  <div className={`flex items-center space-x-1 select-none ${className}`}>
    <div className="relative inline-block">
      <span className="font-extrabold text-white text-xl md:text-2xl tracking-tight">prime</span>
      <span className="font-bold text-[#00A8E1] text-xl md:text-2xl ml-1 tracking-tight">video</span>
      {/* Prime smile arrow curve */}
      <svg viewBox="0 0 80 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-3 -mt-0.5">
        <path d="M4 4C24 13 56 13 76 4" stroke="#00A8E1" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M72 1L77 4L73 8" fill="#00A8E1" stroke="#00A8E1" strokeWidth="1" />
      </svg>
    </div>
  </div>
);

export const DisneyPlusLogo: React.FC<LogoProps> = ({ className = 'h-7' }) => (
  <div className={`flex items-center select-none ${className}`}>
    <div className="relative flex items-center">
      <span className="font-black italic text-white text-xl md:text-2xl tracking-tighter font-serif">
        Disney
      </span>
      <span className="font-black text-[#113CCF] text-2xl md:text-3xl ml-0.5 drop-shadow-[0_0_12px_rgba(17,60,207,0.8)]">
        +
      </span>
      <div className="absolute -top-1 left-0 right-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
    </div>
  </div>
);

export const AppleTvLogo: React.FC<LogoProps> = ({ className = 'h-7' }) => (
  <div className={`flex items-center space-x-1 select-none text-white ${className}`}>
    <svg viewBox="0 0 170 170" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 -mt-0.5">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.68-7.85-11.97-14.42-6.19-9.56-11.05-20.66-14.58-33.3-3.53-12.65-5.3-24.3-5.3-34.96 0-14.24 3.53-26.06 10.59-35.47 7.06-9.41 16.03-14.24 26.92-14.49 4.35 0 9.38 1.18 15.08 3.53 5.71 2.36 9.49 3.53 11.35 3.53 1.62 0 5.46-1.24 11.53-3.71 6.07-2.47 11.19-3.59 15.35-3.36 12.24.64 22.06 5.34 29.47 14.12-10.7 6.47-15.94 15.42-15.71 26.83.24 8.94 3.76 16.35 10.59 22.24 6.82 5.88 14.82 9.17 24 9.88-2.12 6.35-4.7 12.59-7.76 18.7zM119.22 33.7c0-7.41 2.65-14.35 7.94-20.82 5.3-6.47 11.88-10.47 19.76-12-0.23 7.88-3.06 15.11-8.47 21.7-5.41 6.59-12.12 10.3-20.12 11.12.23-.7.89-1.5 1.99-2.4 1.11-.9 2.06-1.74 2.87-2.52-2.73-4.22-3.97-10.54-3.97-15.08z" />
    </svg>
    <span className="font-bold text-lg md:text-xl tracking-tight">tv+</span>
  </div>
);

export const MaxLogo: React.FC<LogoProps> = ({ className = 'h-7' }) => (
  <div className={`flex items-center select-none ${className}`}>
    <span className="font-black text-white text-2xl md:text-3xl tracking-widest uppercase italic drop-shadow-[0_0_15px_rgba(123,44,191,0.6)]">
      MAX
    </span>
  </div>
);

export const HuluLogo: React.FC<LogoProps> = ({ className = 'h-7' }) => (
  <div className={`flex items-center select-none ${className}`}>
    <span className="font-black text-[#1CE783] text-2xl md:text-3xl tracking-tighter lowercase drop-shadow-[0_0_12px_rgba(28,231,131,0.5)]">
      hulu
    </span>
  </div>
);
