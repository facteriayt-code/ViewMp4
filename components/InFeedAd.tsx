
import React, { useEffect } from 'react';

const InFeedAd: React.FC = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("In-Feed Ad initialization failed:", e);
    }
  }, []);

  return (
    <div className="w-full px-4 md:px-12 my-8 overflow-hidden">
      <div className="bg-[#181818]/50 border border-white/5 rounded-xl p-2 transition-all hover:bg-[#181818]/80">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-format="fluid"
             data-ad-layout-key="-6t+ed+2i-1n-4w"
             data-ad-client="ca-pub-4236455328558244"
             data-ad-slot="5760355805"></ins>
      </div>
      <div className="mt-2 text-[10px] text-gray-600 uppercase tracking-widest text-right px-2">
        Sponsored Content
      </div>
    </div>
  );
};

export default InFeedAd;
