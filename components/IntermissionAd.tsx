import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, MousePointer2, ExternalLink, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface IntermissionAdProps {
  onClose: () => void;
}

const IntermissionAd: React.FC<IntermissionAdProps> = ({ onClose }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Inject the specific 468x60 banner script
    if (adRef.current && !initialized.current) {
      initialized.current = true;
      
      (window as any).atOptions = {
        'key' : '201dc5784b8560e8fc14374de361d99b',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = "//www.highperformanceformat.com/201dc5784b8560e8fc14374de361d99b/invoke.js";
      script.async = true;

      adRef.current.appendChild(script);
    }

    // Click Detection logic using window blur (iframe interaction)
    const handleBlur = () => {
      setTimeout(() => {
        setHasClicked(true);
      }, 500);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500 px-4">
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        
        {/* Verification UI */}
        <div className="mb-10 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/10 p-5 rounded-3xl border border-red-600/30 animate-pulse">
              <Lock className="w-10 h-10 text-red-600" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
            Content Locked
          </h2>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3">
            <p className="text-white text-sm md:text-base font-bold uppercase tracking-tight leading-relaxed">
              To access the content click on the ad below and then comeback
            </p>
            <div className="flex items-center justify-center space-x-2 text-yellow-500">
              <MousePointer2 className="w-4 h-4 animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verification Required</span>
            </div>
          </div>
        </div>

        {/* Ad Container - Optimized for 468x60 */}
        <div className="relative w-full flex justify-center py-4">
          <div className="absolute -inset-10 bg-red-600/10 blur-3xl opacity-30"></div>
          
          <div className="relative transition-all duration-500 scale-[0.6] xs:scale-[0.8] sm:scale-100">
            {!hasClicked && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-red-600 text-white px-4 py-1.5 rounded-full whitespace-nowrap animate-bounce z-10 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest italic">Click to Unlock Stream</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            )}

            <div 
              ref={adRef} 
              className={`relative min-h-[60px] w-[468px] bg-zinc-900/80 rounded-xl border-2 transition-all duration-500 flex items-center justify-center overflow-hidden shadow-2xl ${hasClicked ? 'border-green-500 ring-4 ring-green-500/20' : 'border-white/10'}`}
            >
              {/* Ad content injected here */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white italic">Sponsor Media Slot</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button after Click */}
        <div className="mt-12 w-full max-w-xs h-20 flex flex-col items-center justify-center">
          {hasClicked ? (
            <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex items-center space-x-2 text-green-500 font-black uppercase text-xs tracking-widest">
                <CheckCircle2 className="w-5 h-5" />
                <span>Verification Success</span>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-2xl flex items-center justify-center group"
              >
                Access Stream
                <ExternalLink className="w-4 h-4 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-gray-600 animate-pulse">
               <div className="w-2 h-2 rounded-full bg-gray-600"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Interaction</span>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center opacity-30">
          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.5em]">
            Stream Gateway v4.0 • Verified Partner
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntermissionAd;