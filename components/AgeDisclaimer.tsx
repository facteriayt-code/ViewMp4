
import React from 'react';
import { AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

interface AgeDisclaimerProps {
  onVerify: () => void;
}

const AgeDisclaimer: React.FC<AgeDisclaimerProps> = ({ onVerify }) => {
  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-[#181818] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(229,9,20,0.2)] p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center border-2 border-red-600 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            Adult Content Warning
          </h1>
          <div className="h-1 w-20 bg-red-600 mx-auto rounded-full" />
        </div>

        <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
          <p>
            This website contains age-restricted content, including mature themes, 18+ movies, and community-uploaded media intended for adults only.
          </p>
          <p className="font-bold text-gray-200">
            By entering, you confirm that you are at least 18 years of age and consent to viewing such material.
          </p>
        </div>

        <div className="flex flex-col space-y-3 pt-4">
          <button
            onClick={onVerify}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>I AM OVER 18 - ENTER</span>
          </button>
          
          <button
            onClick={handleExit}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-4 rounded-xl border border-white/10 transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <XCircle className="w-5 h-5" />
            <span>EXIT WEBSITE</span>
          </button>
        </div>

        <p className="text-[10px] text-gray-600 uppercase tracking-widest pt-2">
          Strictly monitored community standards apply
        </p>
      </div>
    </div>
  );
};

export default AgeDisclaimer;
