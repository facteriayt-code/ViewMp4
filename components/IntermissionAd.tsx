import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, ShieldAlert, MousePointer2 } from 'lucide-react';

interface IntermissionAdProps {
  onClose: () => void;
}

const IntermissionAd: React.FC<IntermissionAdProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(7);
  const [canClose, setCanClose] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Timer Logic
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg p-8 flex flex-col items-center">
        
        {/* Close Button - Only visible when timer is 0 */}
        {canClose && (
          <button 
            onClick={onClose}
            className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90 z-[1001]"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="mb-6 text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600/10 p-3 rounded-2xl border border-red-600/20">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">
            Security Verification
          </h2>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
            Connection Verification in progress
          </p>
        </div>

        {/* Ad Container */}
        <div className="relative group origin-center transition-transform duration-500 scale-[0.9] sm:scale-100">
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 blur opacity-50"></div>
          <div 
            ref={adRef} 
            className="relative min-h-[250px] w-[300px] bg-[#181818] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl"
          >
            {/* New Ad Placement */}
            <div id='_2639672' className='_0bb5c4ffef'></div>
            
            {!canClose && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Streaming Media...</span>
              </div>
            )}
          </div>
        </div>

        {/* CLICK INSTRUCTION TEXT */}
        <div className="mt-6 flex flex-col items-center space-y-3 px-4 text-center">
          <div className="flex items-center space-x-2 text-yellow-500">
            <MousePointer2 className="w-4 h-4 animate-bounce" />
            <p className="text-[11px] md:text-xs font-black uppercase tracking-widest">
              Action Required
            </p>
          </div>
          <p className="text-white text-xs md:text-sm font-bold uppercase italic tracking-tight leading-snug">
            To access the content click on the ad and then comeback
          </p>
        </div>

        {/* Status / Countdown */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          {!canClose ? (
            <div className="flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
              <Clock className="w-4 h-4 text-red-600 animate-pulse" />
              <span className="text-sm font-black text-white uppercase tracking-[0.2em]">
                Unlocking in {timeLeft}s
              </span>
            </div>
          ) : (
            <button 
              onClick={onClose}
              className="bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all active:scale-95 shadow-xl animate-bounce"
            >
              Continue to Movie
            </button>
          )}
        </div>

        <p className="mt-8 text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em] text-center">
          Verified Safe Stream via Ad-Network
        </p>
      </div>
    </div>
  );
};

export default IntermissionAd;