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
          'key' : '513013030b1823cbe0510f0f770e2443',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      
      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = "https://www.highperformanceformat.com/513013030b1823cbe0510f0f770e2443/invoke.js";
      scriptInvoke.async = true;

      adRef.current.appendChild(scriptOptions);
      adRef.current.appendChild(scriptInvoke);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 md:my-10 px-4 animate-in fade-in duration-700 overflow-hidden">
      <div className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3 opacity-50">
        Premium Sponsorship
      </div>
      
      {/* Container with overflow-hidden and scaling to prevent break on mobile */}
      <div className="w-full flex justify-center overflow-hidden">
        <div className="relative group flex justify-center origin-center transition-transform duration-500 scale-[0.7] xs:scale-[0.85] sm:scale-100">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div 
            ref={adRef} 
            className="relative min-h-[250px] w-[300px] bg-[#181818] rounded-lg border border-white/5 flex items-center justify-center overflow-hidden shadow-2xl"
          >
            {/* Ad Iframe will be injected here by the script */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <span className="text-[8px] font-bold uppercase tracking-widest text-white">Loading Placement...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;