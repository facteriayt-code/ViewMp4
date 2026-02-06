import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, MousePointer2, ExternalLink, CheckCircle2, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface IntermissionAdProps {
  onClose: () => void;
}

const IntermissionAd: React.FC<IntermissionAdProps> = ({ onClose }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Inject the specific Native Ad script and Pop-under tag
    if (adContainerRef.current && !initialized.current) {
      initialized.current = true;
      
      // 1. Native Ad Script
      const nativeScript = document.createElement('script');
      nativeScript.type = 'text/javascript';
      nativeScript.src = "https://pl28466918.effectivegatecpm.com/92100ea7c1b81dec5e887cbf56a2c891/invoke.js";
      nativeScript.async = true;
      nativeScript.setAttribute('data-cfasync', 'false');
      adContainerRef.current.appendChild(nativeScript);

      // 2. Pop-under Ad Script
      const popUnderScript = document.createElement('script');
      popUnderScript.type = 'text/javascript';
      popUnderScript.src = "https://pl28466582.effectivegatecpm.com/cd/6c/2a/cd6c2a20f9d7644f313ec50ba131207a.js";
      popUnderScript.async = true;
      adContainerRef.current.appendChild(popUnderScript);
    }

    // Click Detection logic using window blur (iframe interaction)
    const handleBlur = () => {
      // Small delay to ensure the user actually navigated or interacted
      setTimeout(() => {
        setHasClicked(true);
      }, 800);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-700 px-4 overflow-y-auto py-10">
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        
        {/* Verification Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/20 p-5 rounded-3xl border border-red-600/30 animate-pulse relative">
              <ShieldCheck className="w-12 h-12 text-red-600" />
              <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1.5 shadow-lg border border-black animate-bounce">
                <Sparkles className="w-3 h-3 text-black" />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
            Security Check
          </h2>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 shadow-2xl relative group">
            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <p className="relative z-10 text-white text-sm md:text-lg font-bold uppercase tracking-tight leading-relaxed">
              To access the premium broadcast, please interact with our sponsors.
            </p>
            <div className="flex items-center justify-center space-x-3 text-yellow-500">
              <MousePointer2 className="w-5 h-5 animate-bounce" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Validation Required</span>
            </div>
          </div>
        </div>

        {/* Ad Container - Native & Pop-under Mounting Point */}
        <div className="relative w-full flex flex-col items-center">
          <div className="absolute -inset-20 bg-red-600/5 blur-[120px] opacity-40 pointer-events-none"></div>
          
          {!hasClicked && (
            <div className="mb-4 flex items-center space-x-2 bg-red-600 text-white px-8 py-2.5 rounded-full whitespace-nowrap animate-bounce z-10 shadow-2xl border border-white/20 hover:scale-105 transition-transform cursor-pointer">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest italic">Click to Start Stream</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}

          <div 
            className={`relative w-full min-h-[180px] bg-zinc-900/40 rounded-3xl border-2 transition-all duration-700 flex flex-col items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] ${hasClicked ? 'border-green-500 ring-[12px] ring-green-500/10 scale-[1.02]' : 'border-white/10 hover:border-red-600/30'}`}
          >
            {/* The actual native ad container */}
            <div id="container-92100ea7c1b81dec5e887cbf56a2c891" className="w-full relative z-10"></div>
            
            {/* Hidden script mounting point for both native and pop-under */}
            <div ref={adContainerRef} className="hidden invisible h-0 w-0 overflow-hidden"></div>
            
            {!hasClicked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px]">
                <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mb-4"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 italic text-center px-10">
                  Initializing Secure<br/>Sponsor Connection
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button Section */}
        <div className="mt-14 w-full max-w-sm flex flex-col items-center justify-center">
          {hasClicked ? (
            <div className="flex flex-col items-center space-y-8 animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 w-full">
              <div className="flex items-center space-x-3 text-green-500 font-black uppercase text-sm tracking-[0.4em] bg-green-500/10 px-8 py-4 rounded-full border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                <CheckCircle2 className="w-6 h-6" />
                <span>Stream Ready</span>
              </div>
              <button 
                onClick={onClose}
                className="w-full group relative bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Access BroadCast
                  <ExternalLink className="w-5 h-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600 via-red-500 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]"></div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-5 opacity-40 group">
               <div className="flex items-center space-x-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Awaiting Signal</span>
               </div>
               <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center px-6 leading-loose">
                 Verified interaction required for session validation. This process helps us keep the high-definition content free for all users.
               </p>
            </div>
          )}
        </div>

        {/* Footer Technical Info */}
        <div className="mt-20 text-center opacity-20 group hover:opacity-50 transition-all duration-500">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.8em] italic">
            Gateway v5.8.2 • Secure-Protocol
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="h-0.5 w-8 bg-white/20 rounded-full"></div>
            <div className="h-0.5 w-8 bg-white/20 rounded-full"></div>
            <div className="h-0.5 w-8 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <style>{`
        #container-92100ea7c1b81dec5e887cbf56a2c891 {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 10px;
        }
        #container-92100ea7c1b81dec5e887cbf56a2c891 > * {
          max-width: 100%;
          border-radius: 12px;
          overflow: hidden;
        }
        ::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
};

export default IntermissionAd;