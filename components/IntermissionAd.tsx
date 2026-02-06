
import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldAlert, MousePointer2, ExternalLink, CheckCircle2, Lock } from 'lucide-react';

interface IntermissionAdProps {
  onClose: () => void;
}

const IntermissionAd: React.FC<IntermissionAdProps> = ({ onClose }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Robust injection for Adsterra/HighPerformanceFormat scripts
    if (adRef.current && !initialized.current) {
      initialized.current = true;
      
      // Define options globally as required by the invoke script
      (window as any).atOptions = {
        'key' : '8f3fb48addb0dc543ca53f89e9666e3d',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = "//www.highperformanceformat.com/8f3fb48addb0dc543ca53f89e9666e3d/invoke.js";
      script.async = true;

      adRef.current.appendChild(script);
    }

    // Heuristic: Detecting clicks on cross-domain iframes via window blur
    const handleBlur = () => {
      // If the user clicks into the iframe, the main window loses focus
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
        <div className="mb-10 text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600/20 p-5 rounded-full border-2 border-red-600/40 animate-pulse relative">
              <Lock className="w-10 h-10 text-red-600" />
              <div className="absolute -inset-1 bg-red-600/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
            Access Restricted
          </h2>
          <div className="h-1.5 w-32 bg-red-600 mx-auto rounded-full mb-6 shadow-[0_0_20px_rgba(229,9,20,0.5)]" />
          <p className="text-gray-300 text-sm md:text-lg font-bold uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed">
            To access the content click on the ad below and then comeback
          </p>
        </div>

        {/* Ad Container - Scaled for mobile responsive layout */}
        <div className="relative w-full flex justify-center py-6 min-h-[180px]">
          <div className="absolute -inset-10 bg-gradient-to-r from-red-600/10 via-red-600/5 to-red-600/10 blur-3xl opacity-40"></div>
          
          <div className="relative origin-center transition-all duration-700 scale-[0.4] xs:scale-[0.55] sm:scale-[0.8] md:scale-100 lg:scale-110">
            {/* Click Indicator Overlay */}
            {!hasClicked && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 z-10">
                <div className="flex items-center space-x-2 bg-yellow-500 text-black px-6 py-2 rounded-full whitespace-nowrap animate-bounce shadow-[0_10px_30px_rgba(234,179,8,0.4)]">
                  <MousePointer2 className="w-5 h-5 fill-black" />
                  <span className="text-xs font-black uppercase tracking-widest italic">Click Ad to Unlock Video</span>
                </div>
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-yellow-500"></div>
              </div>
            )}

            <div 
              ref={adRef} 
              className={`relative min-h-[90px] w-[728px] bg-zinc-900/50 rounded-xl border-4 transition-all duration-700 flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] ${hasClicked ? 'border-green-500 ring-8 ring-green-500/20 scale-105' : 'border-white/10 hover:border-red-600/50 hover:bg-zinc-800'}`}
            >
              {/* Fallback Message if script fails */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-2">Loading Verification Partner</span>
                <span className="text-[8px] text-white/10 italic">If ad does not appear, check your connection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions & Actions */}
        <div className="mt-16 md:mt-24 flex flex-col items-center space-y-8 w-full max-w-md">
          {!hasClicked ? (
            <div className="space-y-6 text-center animate-pulse">
               <div className="inline-flex items-center space-x-3 text-red-500 bg-red-600/5 px-6 py-2 rounded-full border border-red-600/20">
                  <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">
                    Awaiting Verification Interaction...
                  </p>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-green-500/10 p-4 rounded-full border-2 border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <span className="text-lg font-black text-white uppercase tracking-[0.3em] italic">Stream Verified</span>
              </div>
              
              <button 
                onClick={onClose}
                className="group relative bg-white text-black px-16 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[0_30px_60px_rgba(229,9,20,0.3)] flex items-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Continue to Stream
                  <ExternalLink className="w-5 h-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-16 pt-10 border-t border-white/5 w-full flex flex-col items-center text-center space-y-3 opacity-40">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.5em]">
            Secure Verification Gateway v3.1
          </p>
          <p className="text-[9px] text-gray-600 font-medium max-w-sm">
            Ads support our global infrastructure. Clicking helps us provide premium entertainment free of charge.
          </p>
        </div>
      </div>

      <style>{`
        /* Custom scroll and mobile behavior for high-res banners */
        @media (max-width: 480px) {
          .banner-container {
            transform: scale(0.4);
            margin: -40px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default IntermissionAd;
