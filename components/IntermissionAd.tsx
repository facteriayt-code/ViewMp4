import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, MousePointer2, ExternalLink, CheckCircle2, Lock, ArrowRight, Sparkles, Loader2, ShieldAlert } from 'lucide-react';

interface IntermissionAdProps {
  onClose: () => void;
}

const IntermissionAd: React.FC<IntermissionAdProps> = ({ onClose }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && adContainerRef.current) {
      initialized.current = true;

      // 1. Re-inject Pop-up Ad Script (Main Trigger)
      const popUpScript = document.createElement('script');
      popUpScript.src = "https://pl28466582.effectivegatecpm.com/cd/6c/2a/cd6c2a20f9d7644f313ec50ba131207a.js";
      popUpScript.async = true;
      document.body.appendChild(popUpScript);

      // 2. Inject Smopy Resource
      const smopyScript = document.createElement('script');
      smopyScript.src = "//d.smopy.com/d/?resource=pubJS";
      smopyScript.async = true;
      document.body.appendChild(smopyScript);

      // 3. Inject High Performance 300x250 Banner as a "Validation Target"
      const bannerConfig = document.createElement('script');
      bannerConfig.innerHTML = `
        atOptions = {
          'key' : '513013030b1823cbe0510f0f770e2443',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      adContainerRef.current.appendChild(bannerConfig);

      const bannerScript = document.createElement('script');
      bannerScript.src = "https://www.highperformanceformat.com/513013030b1823cbe0510f0f770e2443/invoke.js";
      bannerScript.async = true;
      adContainerRef.current.appendChild(bannerScript);

      return () => {
        // Cleanup if necessary, though scripts usually stay in DOM
      };
    }

    // Interaction Detection logic using window blur (iframe interaction)
    const handleBlur = () => {
      setIsVerifying(true);
      setTimeout(() => {
        setHasClicked(true);
        setIsVerifying(false);
      }, 1500);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0a0a0a]/99 backdrop-blur-3xl animate-in fade-in duration-700 px-4 overflow-y-auto py-10">
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        
        {/* Verification Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/20 p-6 rounded-[2.5rem] border border-red-600/30 animate-pulse relative shadow-[0_0_50px_rgba(229,9,20,0.3)]">
              <ShieldCheck className="w-14 h-14 text-red-600" />
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-2 shadow-lg border-2 border-black animate-bounce">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
            Stream <span className="text-red-600">Locked</span>
          </h2>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3 shadow-2xl relative group max-w-md mx-auto">
            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
            <p className="relative z-10 text-gray-300 text-xs md:text-sm font-bold uppercase tracking-tight leading-relaxed">
              New session detected. Please validate your high-speed stream by interacting with the sponsor content below.
            </p>
            <div className="flex items-center justify-center space-x-3 text-yellow-500">
              <MousePointer2 className="w-4 h-4 animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">One Interaction Required</span>
            </div>
          </div>
        </div>

        {/* Ad Container Section */}
        <div className="relative w-full flex flex-col items-center">
          <div className="absolute -inset-20 bg-red-600/10 blur-[150px] opacity-40 pointer-events-none"></div>
          
          {!hasClicked && !isVerifying && (
            <div className="mb-6 flex items-center space-x-3 bg-red-600 text-white px-10 py-3 rounded-full animate-bounce z-10 shadow-[0_10px_40px_rgba(229,9,20,0.4)] border border-white/20 font-black uppercase tracking-widest text-[10px] italic">
              <span>Validate & Unlock</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          )}

          <div 
            className={`relative w-full min-h-[250px] bg-zinc-900/60 rounded-[2rem] border-2 transition-all duration-700 flex flex-col items-center justify-center overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] ${hasClicked ? 'border-green-500 ring-[15px] ring-green-500/10 scale-[1.02]' : 'border-white/10 hover:border-red-600/40'}`}
          >
            {/* Mounting point for the 300x250 validation banner */}
            <div ref={adContainerRef} className="w-full flex justify-center py-4"></div>
            
            {/* Global native ad fallback container */}
            <div id="container-92100ea7c1b81dec5e887cbf56a2c891" className="w-full relative z-10"></div>
            
            {(!hasClicked && !isVerifying) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[1px]">
                <div className="w-14 h-14 border-4 border-red-600/10 border-t-red-600 rounded-full animate-spin mb-4"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.8em] text-white/50 italic text-center px-10 leading-loose">
                  Securing Broadcast<br/>Connection
                </span>
              </div>
            )}

            {isVerifying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-20 animate-in fade-in duration-300">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <span className="text-sm font-black uppercase tracking-[0.5em] text-white">Validating Signal...</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button Section */}
        <div className="mt-14 w-full max-w-sm flex flex-col items-center justify-center">
          {hasClicked ? (
            <div className="flex flex-col items-center space-y-8 animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 w-full">
              <div className="flex items-center space-x-3 text-green-500 font-black uppercase text-xs tracking-[0.5em] bg-green-500/10 px-10 py-5 rounded-full border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Verified</span>
              </div>
              <button 
                onClick={onClose}
                className="w-full group relative bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Enter Broadcast
                  <ExternalLink className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-tr from-red-700 via-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-full bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-30deg]"></div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 opacity-40 group text-center">
               <div className="flex items-center space-x-5">
                 <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500">Handshake Pending</span>
               </div>
               <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] px-10 leading-loose">
                 Global ad protocols v7.2: Interaction with media content validates your individual session and prevents automated bypass.
               </p>
            </div>
          )}
        </div>

        <div className="mt-20 text-center opacity-10 group hover:opacity-40 transition-all duration-700">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[1em] italic">
            SECURE-ACCESS-GATEWAY • v2.0
          </p>
        </div>
      </div>
      
      <style>{`
        #container-92100ea7c1b81dec5e887cbf56a2c891 { width: 100%; display: flex; justify-content: center; padding: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default IntermissionAd;