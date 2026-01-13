
import React, { useEffect, useRef } from 'react';

declare var aclib: any;

interface AdBannerProps {
  zoneId?: string;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ zoneId = '10802910', className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If aclib is loaded, execute the banner run
    if (typeof aclib !== 'undefined' && aclib.runBanner && adRef.current) {
      // Clear existing content to prevent duplicate banners if the component re-renders
      adRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        aclib.runBanner({
            zoneId: '${zoneId}',
        });
      `;
      adRef.current.appendChild(script);
    }
  }, [zoneId]);

  return (
    <div className={`w-full flex justify-center py-4 ${className}`}>
      <div 
        ref={adRef} 
        className="w-full max-w-[728px] min-h-[90px] bg-white/5 border border-white/5 rounded-lg flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 bg-black/40 text-[8px] uppercase tracking-widest px-2 py-0.5 text-gray-500 rounded-br z-10">
          Advertisement
        </div>
        {/* Adcash banner will be injected here by the script above */}
      </div>
    </div>
  );
};

export default AdBanner;
