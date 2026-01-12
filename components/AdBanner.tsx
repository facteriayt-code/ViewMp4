
import React, { useEffect } from 'react';

const AdBanner: React.FC = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense initialization failed:", e);
    }
  }, []);

  return (
    <div className="w-full py-6 flex justify-center bg-black/20">
      <div className="w-full max-w-7xl px-4 md:px-12">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-4236455328558244"
             data-ad-slot="1773009337"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};

export default AdBanner;