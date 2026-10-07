import React, { useState } from 'react';
import { Share2, Check, Flame, Star, Tv, Sparkles, Film, Compass, Trophy } from 'lucide-react';

interface CategoryShareBarProps {
  onCategoryClick: (category: string) => void;
  activeCategory?: string;
}

const CATEGORIES = [
  { name: 'All Categories', label: 'All', icon: <Compass className="w-3.5 h-3.5" />, color: 'text-zinc-400' },
  { name: 'Top 10', label: 'Top 10 Today', icon: <Trophy className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  { name: 'Trending Now', label: 'Trending', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-orange-400' },
  { name: 'Top TV Series & Binge Shows', label: 'TV Shows', icon: <Tv className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  { name: 'Top Rated Movies & Masterpieces', label: 'Masterpieces', icon: <Star className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  { name: 'Sci-Fi & Cosmic Adventures', label: 'Sci-Fi', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
  { name: 'Action & Adventure Hits', label: 'Action', icon: <Film className="w-3.5 h-3.5" />, color: 'text-red-400' },
];

const CategoryShareBar: React.FC<CategoryShareBarProps> = ({ onCategoryClick, activeCategory }) => {
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const handleShare = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?cat=${encodeURIComponent(name)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 2000);
    } catch (err) {
      console.error('Failed to copy category link:', err);
    }
  };

  return (
    <div className="sticky top-[58px] md:top-[68px] z-[40] w-full bg-[#090b10]/85 backdrop-blur-xl border-b border-white/[0.07] py-2.5 transition-all">
      <div 
        className="flex items-center space-x-2.5 sm:space-x-3 overflow-x-auto px-4 md:px-12 no-scrollbar scroll-snap-x-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap mr-1 hidden sm:inline">
          Explore:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <div
              key={cat.name}
              className="flex items-center group shrink-0 scroll-snap-align-start"
            >
              <button
                onClick={() => onCategoryClick(cat.name)}
                className={`flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 active:scale-95 border ${
                  isActive 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.25)] font-black' 
                    : 'bg-white/[0.04] hover:bg-white/[0.09] text-gray-300 hover:text-white border-white/[0.08] hover:border-white/20 font-semibold'
                }`}
              >
                <span className={isActive ? 'text-black' : cat.color}>{cat.icon}</span>
                <span className="text-xs tracking-tight whitespace-nowrap">
                  {cat.label}
                </span>
              </button>

              <button
                onClick={(e) => handleShare(e, cat.name)}
                className={`ml-1 p-1.5 rounded-full border transition-all duration-200 ${
                  copiedName === cat.name
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                    : 'bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-white hover:bg-white/10'
                }`}
                title={`Share ${cat.label}`}
              >
                {copiedName === cat.name ? (
                  <Check className="w-2.5 h-2.5 text-white" />
                ) : (
                  <Share2 className="w-2.5 h-2.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-snap-x-mandatory {
          scroll-snap-type: x mandatory;
        }
        .scroll-snap-align-start {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
};

export default CategoryShareBar;