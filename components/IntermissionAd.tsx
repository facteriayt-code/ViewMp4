import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldAlert, MousePointer2, ExternalLink, CheckCircle2 } from 'lucide-react';

interface IntermissionAdProps {
  onClose: () => void;
}

const IntermissionAd: React.FC<IntermissionAdProps> = ({ onClose }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Inject Ad Scripts
    if (adRef.current && !initialized.current) {
      initialized.current = true;
      
      const scriptOptions = document.createElement('script');
      scriptOptions.type = 'text/javascript';
      scriptOptions.innerHTML = `
        atOptions = {
          'key' : '8f3fb48addb0dc543ca53f89e9666e3d',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = "https://www.highperformanceformat.com/8f3fb48addb0dc543ca53f89e9666e3d/invoke.js";
      scriptInvoke.async = true;

      adRef.current.appendChild(scriptOptions);
      adRef.current.appendChild(scriptInvoke);
    }

    // Heuristic to detect ad click: When user clicks the iframe, the window loses focus
    const handleBlur = () => {
      // Small timeout to ensure the blur was intentional
      setTimeout(() => {
        setHasClicked(true);
      }, 500);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-in fade-in duration-300 px-4">
      <div className="relative w-full max-w-5xl flex flex-col items-center">
        
        {/* Verification Header */}
        <div className="mb-8 text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600/20 p-4 rounded-full border border-red-600/30 animate-pulse">
              <ShieldAlert className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
            Verification Required
          </h2>
          <div className="h-1.5 w-24 bg-red-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
            To access this broadcast, you must interact with the sponsorship partner below
          </p>
        </div>

        {/* Ad Container - Optimized for 728x90 with mobile scaling */}
        <div className="relative w-full flex justify-center py-4">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600/10 via-red-600/5 to-red-600/10 blur-3xl opacity-50"></div>
          
          <div className="relative origin-center transition-all duration-500 scale-[0.45] xs:scale-[0.6] sm:scale-[0.8] md:scale-100 lg:scale-110">
            {/* Click Indicator Overlay */}
            {!hasClicked && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-yellow-500 text-black px-4 py-1.5 rounded-full whitespace-nowrap animate-bounce shadow-xl z-10">
                <MousePointer2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Click This Banner to Unlock</span>
              </div>
            )}

            <div 
              ref={adRef} 
              className={`relative min-h-[90px] w-[728px] bg-zinc-900 rounded-xl border-2 transition-all duration-500 flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] ${hasClicked ? 'border-green-500 ring-4 ring-green-500/20 shadow-green-500/20' : 'border-white/10 hover:border-red-600/50'}`}
            >
              {/* Ad content injected here */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <span className="text-xs font-black uppercase tracking-widest text-white">Sponsor Media Stream</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions & Actions */}
        <div className="mt-12 md:mt-16 flex flex-col items-center space-y-6 w-full max-w-md">
          {!hasClicked ? (
            <div className="space-y-4 text-center">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
                <p className="text-white text-sm md:text-base font-black uppercase italic tracking-tight">
                  1. Click on the banner ad above
                </p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                  2. Come back to this screen to continue
                </p>
              </div>
              <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                Awaiting Verification Signal...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex items-center space-x-3 text-green-500 bg-green-500/10 px-6 py-3 rounded-full border border-green-500/20">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">Verification Successful</span>
              </div>
              
              <button 
                onClick={onClose}
                className="group relative bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center"
              >
                Continue to Stream
                <ExternalLink className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/5 w-full flex flex-col items-center text-center space-y-2">
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em]">
            Secure Verification Gateway
          </p>
          <p className="text-[8px] text-gray-700 font-medium max-w-xs">
            Interaction is required to maintain our free-tier broadcasting service for all users worldwide.
          </p>
        </div>
      </div>

      <style>{`
        /* Scaled ad container needs to maintain its footprint in layout if possible, 
           but here we use relative positioning and manual margin/scale for better mobile control */
        @media (max-width: 768px) {
          .ad-scale-fix {
            margin: -20px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default IntermissionAd;