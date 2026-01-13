
import React, { useEffect, useRef } from 'react';

declare var aclib: any;

const AdBanner: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If aclib is loaded, execute the banner run
    if (typeof aclib !== 'undefined' && aclib.runBanner) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        aclib.runBanner({
            zoneId: '10802910',
        });
      `;
      if (adRef.current) {
        adRef.current.appendChild(script);
      }
    }
  }, []);

  return (
    <div className="w-full flex justify-center py-8">
      <div 
        ref={adRef} 
        className="w-full max-w-[728px] min-h-[90px] bg-white/5 border border-white/5 rounded-lg flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 bg-black/40 text-[8px] uppercase tracking-widest px-2 py-0.5 text-gray-500 rounded-br">
          Advertisement
        </div>
        {/* Adcash banner will be injected here by the script above */}
      </div>
    </div>
  );
};

export default AdBanner;
