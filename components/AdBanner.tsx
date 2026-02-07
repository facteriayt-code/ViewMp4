import React, { useEffect, useRef } from 'react';

const AdBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current) {
      // Determine format based on screen width
      const isLarge = window.innerWidth >= 768;
      const key = isLarge ? '8f3fb48addb0dc543ca53f89e9666e3d' : '201dc5784b8560e8fc14374de361d99b';
      const height = isLarge ? 90 : 60;
      const width = isLarge ? 728 : 468;

      const configScript = document.createElement('script');
      configScript.innerHTML = `
        atOptions = {
          'key' : '${key}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      bannerRef.current.appendChild(configScript);

      const adScript = document.createElement('script');
      adScript.src = `https://www.highperformanceformat.com/${key}/invoke.js`;
      adScript.async = true;
      bannerRef.current.appendChild(adScript);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 md:my-12 px-4 animate-in fade-in duration-1000">
      <div className="text-[9px] font-black text-gray-600 uppercase tracking-[0.5em] mb-4 opacity-40">
        Premium Broadcast Partner
      </div>
      
      <div className="w-full flex justify-center">
        <div className="relative group max-w-full overflow-hidden flex justify-center">
          <div className="absolute -inset-2 bg-red-600/5 blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          <div 
            ref={bannerRef}
            className="relative bg-[#181818]/40 backdrop-blur-sm rounded-xl border border-white/5 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 scale-[0.85] sm:scale-100"
            style={{ minHeight: '60px', width: '100%' }}
          >
            {/* Ad scripts are injected here */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[8px] font-black uppercase tracking-widest text-white italic">Premium Placement Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;