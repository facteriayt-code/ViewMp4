import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center my-6 md:my-10 px-4 animate-in fade-in duration-700 overflow-hidden">
      <div className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3 opacity-50">
        Premium Sponsorship
      </div>
      
      <div className="w-full flex justify-center overflow-hidden">
        <div className="relative group flex justify-center origin-center transition-transform duration-500 scale-[0.8] xs:scale-[0.9] sm:scale-100">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div 
            className="relative min-h-[250px] w-[300px] bg-[#181818] rounded-lg border border-white/5 flex items-center justify-center overflow-hidden shadow-2xl"
          >
            {/* New Ad Placement */}
            <div id='_2639672' className='_0bb5c4ffef'></div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[8px] font-bold uppercase tracking-widest text-white">Media Placement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;