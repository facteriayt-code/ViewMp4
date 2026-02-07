
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, MousePointer2, ExternalLink, CheckCircle2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

interface IntermissionAdProps {
  onClose: () => void;
}

const IntermissionAd: React.FC<IntermissionAdProps> = ({ onClose }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (hasClicked) return;
      setIsVerifying(true);
      setTimeout(() => {
        setHasClicked(true);
        setIsVerifying(false);
      }, 2000);
    };

    window.addEventListener('blur', handleInteraction);

    if (!initialized.current && adContainerRef.current) {
      initialized.current = true;
      const scriptId = 'intermission-ad-script';
      
      // Cleanup previous instances to prevent atOptions conflict
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();

      const container = adContainerRef.current;
      const configScript = document.createElement('script');
      configScript.id = scriptId;
      configScript.innerHTML = `
        window._intermissionOptions = {
          'key' : '513013030b1823cbe0510f0f770e2443',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
        // Compatibility for standard invoke.js which expects global atOptions
        window.atOptions = window._intermissionOptions;
      `;
      container.appendChild(configScript);

      const bannerScript = document.createElement('script');
      bannerScript.src = "https://www.highperformanceformat.com/513013030b1823cbe0510f0f770e2443/invoke.js";
      bannerScript.async = true;
      bannerScript.crossOrigin = "anonymous";
      container.appendChild(bannerScript);
    }

    return () => {
      window.removeEventListener('blur', handleInteraction);
    };
  }, [hasClicked]);

  const handleCaptureClick = () => {
    if (hasClicked || isVerifying) return;
    setIsVerifying(true);
    setTimeout(() => {
      setHasClicked(true);
      setIsVerifying(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0a0a0a]/99 backdrop-blur-3xl animate-in fade-in duration-700 px-4 overflow-y-auto py-10">
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/20 p-6 rounded-[2.5rem] border border-red-600/30 animate-pulse relative shadow-[0_0_50px_rgba(229,9,20,0.3)]">
              <ShieldCheck className="w-14 h-14 text-red-600" />
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-2 shadow-lg border-2 border-black animate-bounce">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Stream <span className="text-red-600">Locked</span></h2>
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3 shadow-2xl relative group max-w-md mx-auto">
            <p className="text-gray-300 text-xs md:text-sm font-bold uppercase tracking-tight leading-relaxed">Please interact with the sponsor content below to verify your broadcast session.</p>
            <div className="flex items-center justify-center space-x-3 text-yellow-500">
              <MousePointer2 className="w-4 h-4 animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">One Click to Unlock</span>
            </div>
          </div>
        </div>

        <div className="relative w-full flex flex-col items-center">
          <div onClick={handleCaptureClick} className={`relative w-full min-h-[250px] bg-zinc-900/60 rounded-[2rem] border-2 transition-all duration-700 flex flex-col items-center justify-center overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] cursor-pointer ${hasClicked ? 'border-green-500 ring-[15px] ring-green-500/10 scale-[1.02]' : 'border-white/10 hover:border-red-600/40'}`}>
            <div ref={adContainerRef} className="w-full flex justify-center py-4 relative z-10 min-h-[250px]"></div>
            {isVerifying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-20 animate-in fade-in duration-300">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <span className="text-sm font-black uppercase tracking-[0.5em] text-white">Authenticating...</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 w-full max-w-sm flex flex-col items-center justify-center">
          {hasClicked ? (
            <div className="flex flex-col items-center space-y-8 animate-in zoom-in-95 slide-in-from-bottom-12 duration-700 w-full">
              <div className="flex items-center space-x-3 text-green-500 font-black uppercase text-xs tracking-[0.5em] bg-green-500/10 px-10 py-5 rounded-full border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Verification Successful</span>
              </div>
              <button onClick={onClose} className="w-full group relative bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">Unlock Stream</button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 opacity-40 group text-center">
               <div className="flex items-center space-x-5"><div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div><span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500">Validation Required</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntermissionAd;
