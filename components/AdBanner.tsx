import React, { useEffect, useRef } from 'react';

const AdBanner: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize once per component mount
    if (adRef.current && !initialized.current) {
      initialized.current = true;
      
      const scriptOptions = document.createElement('script');
      scriptOptions.type = 'text/javascript';
      scriptOptions.innerHTML = `
        atOptions = {
          'key' : '201dc5784b8560e8fc14374de361d99b',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = "//www.highperformanceformat.com/201dc5784b8560e8fc14374de361d99b/invoke.js";
      scriptInvoke.async = true;

      adRef.current.appendChild(scriptOptions);
      adRef.current.appendChild(scriptInvoke);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-8 px-4 animate-in fade-in duration-700">
      <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3 opacity-50">
        Premium Sponsorship
      </div>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div 
          ref={adRef} 
          className="relative min-h-[60px] min-w-[320px] md:min-w-[468px] bg-[#181818] rounded-lg border border-white/5 flex items-center justify-center overflow-hidden shadow-2xl"
        >
          {/* Ad Iframe will be injected here by the script */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <span className="text-[8px] font-bold uppercase tracking-widest text-white">Loading Placement...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;