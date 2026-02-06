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
    // Inject the specific Native Ad script and Pop-under tag
    if (adContainerRef.current && !initialized.current) {
      initialized.current = true;
      
      // 1. Native Ad Script (92100ea7c1b81dec5e887cbf56a2c891)
      const nativeScript = document.createElement('script');
      nativeScript.type = 'text/javascript';
      nativeScript.src = "https://pl28466918.effectivegatecpm.com/92100ea7c1b81dec5e887cbf56a2c891/invoke.js";
      nativeScript.async = true;
      nativeScript.setAttribute('data-cfasync', 'false');
      adContainerRef.current.appendChild(nativeScript);

      // 2. Pop-under Ad Script (cd6c2a20f9d7644f313ec50ba131207a)
      const popUnderScript = document.createElement('script');
      popUnderScript.type = 'text/javascript';
      popUnderScript.src = "https://pl28466582.effectivegatecpm.com/cd/6c/2a/cd6c2a20f9d7644f313ec50ba131207a.js";
      popUnderScript.async = true;
      adContainerRef.current.appendChild(popUnderScript);
    }

    // Click Detection logic using window blur (iframe interaction)
    const handleBlur = () => {
      setIsVerifying(true);
      // Simulate a "Verification" process after the user interacts with the ad
      setTimeout(() => {
        setHasClicked(true);
        setIsVerifying(false);
      }, 1500);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0a0a0a]/98 backdrop-blur-3xl animate-in fade-in duration-700 px-4 overflow-y-auto py-10">
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        
        {/* Verification Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/20 p-6 rounded-[2.5rem] border border-red-600/30 animate-pulse relative shadow-[0_0_40px_rgba(229,9,20,0.2)]">
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
            <p className="relative z-10 text-gray-300 text-sm md:text-base font-bold uppercase tracking-tight leading-relaxed">
              Verify your session by interacting with our sponsors to unlock high-definition playback.
            </p>
            <div className="flex items-center justify-center space-x-3 text-yellow-500">
              <MousePointer2 className="w-5 h-5 animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">One Click Required</span>
            </div>
          </div>
        </div>

        {/* Ad Container - Native & Pop-under Mounting Point */}
        <div className="relative w-full flex flex-col items-center">
          <div className="absolute -inset-20 bg-red-600/10 blur-[150px] opacity-40 pointer-events-none"></div>
          
          {!hasClicked && !isVerifying && (
            <div className="mb-6 flex items-center space-x-3 bg-red-600 text-white px-10 py-3 rounded-full whitespace-nowrap animate-bounce z-10 shadow-[0_10px_40px_rgba(229,9,20,0.4)] border border-white/20 hover:scale-105 transition-transform cursor-pointer font-black uppercase tracking-widest text-xs italic">
              <span>Click Content Below</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}

          <div 
            className={`relative w-full min-h-[220px] bg-zinc-900/60 rounded-[2.5rem] border-2 transition-all duration-700 flex flex-col items-center justify-center overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] ${hasClicked ? 'border-green-500 ring-[15px] ring-green-500/10 scale-[1.02]' : 'border-white/10 hover:border-red-600/40'}`}
          >
            {/* The actual native ad container requested by user */}
            <div id="container-92100ea7c1b81dec5e887cbf56a2c891" className="w-full relative z-10"></div>
            
            {/* Hidden script mounting point for both native and pop-under */}
            <div ref={adContainerRef} className="hidden invisible h-0 w-0 overflow-hidden"></div>
            
            {(!hasClicked && !isVerifying) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[1px]">
                <div className="w-14 h-14 border-4 border-red-600/10 border-t-red-600 rounded-full animate-spin mb-4"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/50 italic text-center px-10 leading-loose">
                  Initializing Secure<br/>Handshake
                </span>
              </div>
            )}

            {isVerifying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20 animate-in fade-in duration-300">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <span className="text-sm font-black uppercase tracking-[0.5em] text-white">Verifying Identity...</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button Section */}
        <div className="mt-14 w-full max-w-sm flex flex-col items-center justify-center">
          {hasClicked ? (
            <div className="flex flex-col items-center space-y-8 animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 w-full">
              <div className="flex items-center space-x-3 text-green-500 font-black uppercase text-sm tracking-[0.5em] bg-green-500/10 px-10 py-5 rounded-full border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                <CheckCircle2 className="w-6 h-6" />
                <span>Verification Success</span>
              </div>
              <button 
                onClick={onClose}
                className="w-full group relative bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Unlock Broadcast
                  <ExternalLink className="w-5 h-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-tr from-red-700 via-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-full bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-30deg]"></div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 opacity-40 group">
               <div className="flex items-center space-x-5">
                 <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,1)]"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500">Awaiting Signal</span>
               </div>
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] text-center px-10 leading-loose max-w-sm">
                 Security protocol v6.1: Interaction with sponsored media ensures you are not a bot and keeps our premium catalog free.
               </p>
            </div>
          )}
        </div>

        {/* Footer Technical Info */}
        <div className="mt-20 text-center opacity-10 group hover:opacity-40 transition-all duration-700 cursor-default">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[1em] italic">
            SECURE-ACCESS-GATEWAY • BYPASS: DISABLED
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="h-0.5 w-12 bg-white/20 rounded-full animate-pulse"></div>
            <div className="h-0.5 w-12 bg-white/20 rounded-full animate-pulse delay-75"></div>
            <div className="h-0.5 w-12 bg-white/20 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
      
      <style>{`
        #container-92100ea7c1b81dec5e887cbf56a2c891 {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 15px;
        }
        #container-92100ea7c1b81dec5e887cbf56a2c891 > * {
          max-width: 100%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        /* Custom hide scrollbar for the modal */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default IntermissionAd;