import React from 'react';

const NativeAd: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-12 py-8 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6 relative">
        <div className="absolute top-2 right-4 text-[8px] uppercase tracking-widest text-gray-600 font-bold z-10">
          Native Recommendations
        </div>
        
        {/* Adcash Native Container */}
        <div id="awn-z10802954" className="w-full min-h-[250px] flex items-center justify-center">
           <div className="text-gray-700 text-[10px] animate-pulse uppercase tracking-[0.2em]">
             Discovering new content...
           </div>
        </div>
      </div>
    </div>
  );
};

export default NativeAd;