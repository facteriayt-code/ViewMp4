import React, { useState } from 'react';
import { Share2, Check, Zap, Flame, Heart, PlayCircle, Star } from 'lucide-react';

interface CategoryShareBarProps {
  onCategoryClick: (category: string) => void;
}

const CATEGORIES = [
  { name: 'Trending Now', icon: <Flame className="w-3 h-3" />, color: 'text-orange-500' },
  { name: 'New Community Uploads', icon: <Zap className="w-3 h-3" />, color: 'text-yellow-400' },
  { name: 'onlyfans Content', icon: <Heart className="w-3 h-3" />, color: 'text-blue-400' },
  { name: 'Insta post', icon: <Star className="w-3 h-3" />, color: 'text-pink-500' },
  { name: 'Viral Highlights', icon: <PlayCircle className="w-3 h-3" />, color: 'text-red-500' },
];

const CategoryShareBar: React.FC<CategoryShareBarProps> = ({ onCategoryClick }) => {
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
    <div className="sticky top-[60px] md:top-[70px] z-[40] w-full bg-[#141414]/80 backdrop-blur-md border-b border-white/5 py-3">
      <div className="flex items-center space-x-3 overflow-x-auto px-4 md:px-12 no-scrollbar">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap mr-2">
          Quick Share:
        </span>
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="flex items-center group shrink-0"
          >
            <button
              onClick={() => onCategoryClick(cat.name)}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all active:scale-95"
            >
              <span className={cat.color}>{cat.icon}</span>
              <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tight whitespace-nowrap">
                {cat.name}
              </span>
            </button>
            <button
              onClick={(e) => handleShare(e, cat.name)}
              className={`ml-1.5 p-2 rounded-full border transition-all duration-300 ${
                copiedName === cat.name
                  ? 'bg-green-600 border-green-500 scale-110 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                  : 'bg-red-600/10 border-red-600/20 hover:bg-red-600 hover:border-red-500'
              }`}
            >
              {copiedName === cat.name ? (
                <Check className="w-3 h-3 text-white" />
              ) : (
                <Share2 className="w-3 h-3 text-white" />
              )}
            </button>
          </div>
        ))}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryShareBar;