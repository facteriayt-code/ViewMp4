import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, MousePointer2, ExternalLink, CheckCircle2, Lock, ArrowRight, Zap } from 'lucide-react';

interface IntermissionAdProps {
  onClose: () => void;
}

const IntermissionAd: React.FC<IntermissionAdProps> = ({ onClose }) => {
  const [hasClicked, setHasClicked] = useState(false);
  const banner468Ref = useRef<HTMLDivElement>(null);
  const rectangle300Ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      
      // Inject 468x60 Banner (Key: 201dc5784b8560e8fc14374de361d99b)
      const injectBanner468 = () => {
        if (!banner468Ref.current) return;
        const scriptOptions = document.createElement('script');
        scriptOptions.type = 'text/javascript';
        scriptOptions.innerHTML = `
          atOptions468 = {
            'key' : '201dc5784b8560e8fc14374de361d99b',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
          };
        `;
        // We use a custom atOptions name to avoid conflicts if the script supports it, 
        // or we just inject them sequentially. Most of these scripts look for 'atOptions'.
        // Since they use the same domain/script, we might need to handle them carefully.
        
        // Standard injection for the first one
        (window as any).atOptions = {
          'key' : '201dc5784b8560e8fc14374de361d99b',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
        const scriptInvoke = document.createElement('script');
        scriptInvoke.src = "//www.highperformanceformat.com/201dc5784b8560e8fc14374de361d99b/invoke.js";
        scriptInvoke.async = true;
        banner468Ref.current.appendChild(scriptInvoke);
      };

      // Inject 300x250 Rectangle (Key: 513013030b1823cbe0510f0f770e2443)
      const injectRectangle300 = () => {
        if (!rectangle300Ref.current) return;
        // Re-assigning atOptions for the second invoke
        const scriptInvoke = document.createElement('script');
        scriptInvoke.src = "//www.highperformanceformat.com/513013030b1823cbe0510f0f770e2443/invoke.js";
        scriptInvoke.async = true;
        
        // We set the global atOptions right before injecting the script
        // Note: Some ad networks might not support multiple 'atOptions' calls on one page 
        // without unique variable names, but we try sequential assignment.
        const observer = new MutationObserver(() => {
           (window as any).atOptions = {
            'key' : '513013030b1823cbe0510f0f770e2443',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        });
        observer.observe(rectangle300Ref.current, { childList: true });
        
        rectangle300Ref.current.appendChild(scriptInvoke);
      };

      injectBanner468();
      // Delay second injection slightly to prevent race condition on the global 'atOptions' variable
      setTimeout(injectRectangle300, 1000);
    }

    const handleBlur = () => {
      setTimeout(() => {
        setHasClicked(true);
      }, 500);
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500 overflow-y-auto py-10 px-4">
      <div className="relative w-full max-w-3xl flex flex-col items-center">
        
        {/* Verification Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600/20 p-4 rounded-full border border-red-600/40 animate-pulse">
              <Lock className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
            Stream Verification
          </h2>
          <div className="h-1.5 w-32 bg-red-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-400 text-sm md:text-lg font-bold uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed">
            Interact with any sponsor below to unlock your content
          </p>
        </div>

        {/* Ad Slots Section */}
        <div className="flex flex-col items-center space-y-12 w-full">
          
          {/* 468x60 Banner */}
          <div className="relative w-full flex justify-center">
            <div className="relative transition-all duration-500 scale-[0.6] xs:scale-[0.8] sm:scale-100">
              {!hasClicked && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-red-600 text-white px-4 py-1.5 rounded-full whitespace-nowrap animate-bounce z-10 shadow-lg">
                  <MousePointer2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Click Banner</span>
                </div>
              )}
              <div 
                ref={banner468Ref} 
                className={`relative min-h-[60px] w-[468px] bg-zinc-900/50 rounded-xl border-2 transition-all duration-500 flex items-center justify-center overflow-hidden ${hasClicked ? 'border-green-500 bg-green-500/5' : 'border-white/10 hover:border-red-600/50'}`}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white italic">Partner Slot A</span>
                </div>
              </div>
            </div>
          </div>

          {/* 300x250 Rectangle */}
          <div className="relative w-full flex justify-center">
            <div className="relative transition-all duration-500 scale-[0.8] sm:scale-100">
               {!hasClicked && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 z-10">
                   <div className="bg-yellow-500 text-black px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center space-x-2">
                     <Zap className="w-4 h-4 fill-black" />
                     <span>High Speed Unlock</span>
                   </div>
                </div>
              )}
              <div 
                ref={rectangle300Ref} 
                className={`relative min-h-[250px] w-[300px] bg-zinc-900/50 rounded-2xl border-2 transition-all duration-500 flex items-center justify-center overflow-hidden shadow-2xl ${hasClicked ? 'border-green-500 bg-green-500/5 ring-4 ring-green-500/20' : 'border-white/10 hover:border-red-600/50'}`}
              >
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white italic text-center">Premium Media Partner<br/>Slot B</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-16 flex flex-col items-center space-y-8 w-full max-w-sm">
          {!hasClicked ? (
            <div className="text-center space-y-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 animate-pulse">
               <p className="text-red-500 text-xs font-black uppercase tracking-[0.3em]">System Awaiting Signal...</p>
               <p className="text-gray-500 text-[10px] font-bold">Please click one of the ads above to continue to your broadcast.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-500 w-full">
              <div className="flex items-center space-x-3 text-green-500 font-black uppercase text-sm tracking-[0.3em] bg-green-500/10 px-8 py-3 rounded-full border border-green-500/20">
                <CheckCircle2 className="w-6 h-6" />
                <span>Identity Verified</span>
              </div>
              
              <button 
                onClick={onClose}
                className="w-full group relative bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Unlock Broadcast
                  <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-16 pt-10 border-t border-white/5 w-full flex flex-col items-center text-center space-y-3 opacity-30">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.5em]">
            Secure Stream Gateway • Ad-Network Protocol
          </p>
          <p className="text-[9px] text-gray-600 font-medium max-w-md">
            All interactions are encrypted. Ad revenue supports the hosting of 4K content for the community.
          </p>
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default IntermissionAd;