import React from 'react';

const NativeAd: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-12 my-8 md:my-12">
      <div className="bg-[#181818] rounded-2xl border border-white/5 p-4 md:p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-transparent to-red-600 opacity-30"></div>
        
        <div className="flex items-center space-x-2 self-start mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Sponsored Content
          </span>
        </div>
        
        <div className="w-full flex justify-center min-h-[100px] transition-all duration-500">
          <div id="container-92100ea7c1b81dec5e887cbf56a2c891" className="w-full"></div>
        </div>
        
        <div className="mt-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center opacity-0 group-hover:opacity-100 transition-opacity">
          Platform Monetization Partner
        </div>
      </div>
    </div>
  );
};

export default NativeAd;