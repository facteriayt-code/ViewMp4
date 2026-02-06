import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, MousePointer2, ExternalLink, CheckCircle2, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface IntermissionAdProps {
  onClose: () => void;
}

const IntermissionAd: React.FC<IntermissionAdProps> = ({ onClose }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Inject the specific Native Ad script provided
    if (adContainerRef.current && !initialized.current) {
      initialized.current = true;
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = "https://pl28466918.effectivegatecpm.com/92100ea7c1b81dec5e887cbf56a2c891/invoke.js";
      script.async = true;
      script.setAttribute('data-cfasync', 'false');

      adContainerRef.current.appendChild(script);
    }

    // Click Detection logic using window blur (iframe interaction)
    // Most ad interactions cause a window blur event
    const handleBlur = () => {
      setTimeout(() => {
        setHasClicked(true);
      }, 500);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500 px-4 overflow-y-auto py-10">
      <div className="relative w-full max-w-2xl flex flex-col items-center">
        
        {/* Verification Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/20 p-5 rounded-3xl border border-red-600/30 animate-pulse">
              <ShieldCheck className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
            Unlock Content
          </h2>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 shadow-2xl">
            <p className="text-white text-sm md:text-lg font-bold uppercase tracking-tight leading-relaxed">
              To proceed to the broadcast, please interact with the sponsored content below.
            </p>
            <div className="flex items-center justify-center space-x-3 text-yellow-500">
              <MousePointer2 className="w-5 h-5 animate-bounce" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Action Required</span>
            </div>
          </div>
        </div>

        {/* Ad Container - Native Ad Slot */}
        <div className="relative w-full flex flex-col items-center">
          <div className="absolute -inset-20 bg-red-600/5 blur-[100px] opacity-30 pointer-events-none"></div>
          
          {!hasClicked && (
            <div className="mb-4 flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-full whitespace-nowrap animate-bounce z-10 shadow-xl border border-white/20">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest italic">Click to Verify Stream</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}

          <div 
            className={`relative w-full min-h-[150px] bg-zinc-900/50 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ${hasClicked ? 'border-green-500 ring-8 ring-green-500/10' : 'border-white/10'}`}
          >
            {/* The actual ad container requested by the user */}
            <div id="container-92100ea7c1b81dec5e887cbf56a2c891" className="w-full"></div>
            
            {/* Hidden script mounting point */}
            <div ref={adContainerRef} className="hidden"></div>
            
            {!hasClicked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 bg-black/40">
                <span className="text-xs font-black uppercase tracking-[0.5em] text-white italic text-center px-10">
                  Premium Media Partner<br/>Loading Secured Content
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button Section */}
        <div className="mt-12 w-full max-w-sm flex flex-col items-center justify-center">
          {hasClicked ? (
            <div className="flex flex-col items-center space-y-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 w-full">
              <div className="flex items-center space-x-3 text-green-500 font-black uppercase text-sm tracking-[0.3em] bg-green-500/10 px-6 py-3 rounded-full border border-green-500/20 shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
                <span>Verification Successful</span>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Access High-Speed Stream
                  <ExternalLink className="w-5 h-5 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 opacity-40">
               <div className="flex items-center space-x-3">
                 <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Identity Check In Progress</span>
               </div>
               <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center px-4">
                 Interaction with sponsorship content validates your session and prevents bot activity
               </p>
            </div>
          )}
        </div>

        {/* Footer Technical Info */}
        <div className="mt-16 text-center opacity-20 group hover:opacity-40 transition-opacity">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.6em] italic">
            Secure Access Gateway v5.2 • Encrypted Handshake
          </p>
        </div>
      </div>
      
      <style>{`
        #container-92100ea7c1b81dec5e887cbf56a2c891 {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        /* Ensure the native ad scales or centers correctly */
        #container-92100ea7c1b81dec5e887cbf56a2c891 > * {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default IntermissionAd;