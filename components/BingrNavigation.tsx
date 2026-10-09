import React, { useState } from 'react';
import { Home, Search, Dices, Sparkles, Tv, User as UserIcon, Film, MessageSquare } from 'lucide-react';
import { User } from '../types.ts';
import { PlatformId } from '../services/platformCatalog.ts';

export type BingrNavTab = 'home' | 'search' | 'random' | 'recommendations' | 'hubs' | 'account';

interface BingrNavigationProps {
  activeTab: BingrNavTab;
  onTabChange: (tab: BingrNavTab) => void;
  user: User | null;
  onOpenSearch: () => void;
  onOpenRandom: () => void;
  onOpenRecommendations: () => void;
  onOpenAccount: () => void;
  onOpenChat?: () => void;
  onSelectPlatform?: (platform: PlatformId) => void;
  onGoHome: () => void;
}

export const BingrNavigation: React.FC<BingrNavigationProps> = ({
  activeTab,
  onTabChange,
  user,
  onOpenSearch,
  onOpenRandom,
  onOpenRecommendations,
  onOpenAccount,
  onOpenChat,
  onSelectPlatform,
  onGoHome,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHubsFlyout, setShowHubsFlyout] = useState(false);

  const navItems = [
    {
      id: 'home' as BingrNavTab,
      label: 'Home',
      icon: Home,
      onClick: () => {
        onTabChange('home');
        onGoHome();
      }
    },
    {
      id: 'random' as BingrNavTab,
      label: 'Random Movie',
      icon: Dices,
      badge: 'Pick',
      onClick: () => {
        onTabChange('random');
        onOpenRandom();
      }
    },
    {
      id: 'recommendations' as BingrNavTab,
      label: 'Personalized',
      icon: Sparkles,
      badge: 'For You',
      onClick: () => {
        onTabChange('recommendations');
        onOpenRecommendations();
      }
    },
    {
      id: 'hubs' as BingrNavTab,
      label: 'Streaming Hubs',
      icon: Tv,
      onClick: () => {
        setShowHubsFlyout(!showHubsFlyout);
        onTabChange('hubs');
      }
    },
    {
      id: 'account' as BingrNavTab,
      label: user ? user.name.split(' ')[0] : 'Account Info',
      icon: UserIcon,
      isAvatar: !!user,
      onClick: () => {
        onTabChange('account');
        onOpenAccount();
      }
    }
  ];

  return (
    <>
      {/* ── DESKTOP: Bingr Left Sidebar Dock (Fixed w-20, expands to w-60 on hover) ── */}
      <aside
        className={`hidden md:flex flex-col justify-between fixed left-0 top-0 bottom-0 z-[60] bg-gradient-to-r from-[#0c0d12]/95 via-[#0e1017]/90 to-transparent transition-[width] duration-300 ease-in-out select-none ${
          isExpanded ? 'w-60 shadow-[20px_0_40px_rgba(0,0,0,0.85)] backdrop-blur-xl border-r border-white/10' : 'w-20'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setShowHubsFlyout(false);
        }}
      >
        {/* Top Logo (Bingr style) */}
        <div className="pt-6 pb-4 w-20 flex flex-col items-center justify-center shrink-0">
          <button
            type="button"
            onClick={onGoHome}
            className="flex flex-col items-center justify-center group focus:outline-none"
            title="GeminiStream - Bingr Edition"
          >
            <div className="relative p-2 rounded-2xl bg-red-600/15 border border-red-500/30 group-hover:bg-red-600/30 group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
              <Film className="w-6 h-6 text-red-500 fill-red-500 group-hover:rotate-6 transition-transform" />
            </div>
            {isExpanded && (
              <span className="font-royal text-red-500 font-black text-xs tracking-widest uppercase mt-2 animate-in fade-in duration-200">
                GeminiStream
              </span>
            )}
          </button>
        </div>

        {/* Center Navigation List with Smooth Sliding Active Indicator */}
        <nav className="my-auto py-4 w-full flex flex-col space-y-2 px-3 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={item.onClick}
                  className={`w-full flex items-center h-12 rounded-xl px-3 transition-all duration-300 relative ${
                    isActive
                      ? 'bg-red-600/20 text-white border border-red-500/40 shadow-[0_0_15px_rgba(229,9,20,0.35)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={item.label}
                >
                  {/* Left Active Glow Pip */}
                  {isActive && (
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_8px_#ef4444] transition-all duration-300" />
                  )}

                  {/* Icon / User Avatar */}
                  <span className="shrink-0 flex items-center justify-center w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                    {item.isAvatar && user ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/20 group-hover:border-red-500 transition-colors"
                      />
                    ) : (
                      <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-red-500 stroke-[2.5]' : 'group-hover:text-white'}`} />
                    )}
                  </span>

                  {/* Label (Slides out smoothly when sidebar expands) */}
                  <div
                    className={`ml-3.5 flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
                    }`}
                  >
                    <span className={`text-xs font-bold tracking-wide whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap ml-2">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>

                {/* Desktop Collapsed Floating Tooltip (shown when sidebar is not expanded) */}
                {!isExpanded && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-black/90 backdrop-blur-md text-white text-xs font-semibold rounded-lg shadow-xl border border-white/15 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Streaming Hubs Quick Flyout Menu (when hubs clicked) */}
        {showHubsFlyout && (
          <div className="absolute left-20 bottom-16 w-56 bg-[#0f1118]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-2 z-[70] animate-in fade-in slide-in-from-left-2 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-white/10">
              Streaming Hubs
            </div>
            {[
              { id: 'netflix' as PlatformId, name: 'Netflix', color: '#E50914' },
              { id: 'prime' as PlatformId, name: 'Prime Video', color: '#00A8E1' },
              { id: 'disney' as PlatformId, name: 'Disney+', color: '#113CCF' },
              { id: 'appletv' as PlatformId, name: 'Apple TV+', color: '#FFFFFF' },
              { id: 'max' as PlatformId, name: 'Max', color: '#7B2CBF' },
              { id: 'hulu' as PlatformId, name: 'Hulu', color: '#1CE783' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setShowHubsFlyout(false);
                  onSelectPlatform?.(p.id);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/10 transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="font-bold text-white group-hover:text-red-400 transition">{p.name}</span>
                </div>
                <span className="text-[10px] text-gray-500 group-hover:text-white">Open →</span>
              </button>
            ))}
          </div>
        )}

        {/* Dedicated Desktop Sidebar Community Chat Action */}
        {onOpenChat && (
          <div className="px-3 pb-2 w-full shrink-0">
            <button
              type="button"
              onClick={onOpenChat}
              className="w-full flex items-center h-10 rounded-xl px-2.5 transition-all duration-300 relative text-gray-400 hover:text-white hover:bg-white/10 group"
              title="Community Live Chat (Connected for all users, 12h auto-delete)"
            >
              <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-red-600/15 group-hover:bg-red-600/30 text-red-500 transition-colors relative">
                <MessageSquare className="w-4 h-4 fill-red-500/20" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <div
                className={`ml-3 flex items-center justify-between flex-1 overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'
                }`}
              >
                <span className="text-xs font-bold tracking-wide whitespace-nowrap text-gray-300 group-hover:text-white">
                  Live Chat
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap ml-2">
                  12h
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Bottom User Quick Info / Version */}
        <div className="p-3 w-20 flex flex-col items-center justify-center shrink-0 border-t border-white/5">
          <div className="text-[9px] font-black tracking-widest text-gray-500 uppercase text-center">
            {isExpanded ? 'Bingr Engine v2' : 'v2'}
          </div>
        </div>
      </aside>

      {/* ── MOBILE: Floating Bottom Dock Bar (Clean 4-item dock: Home, Dice, For You, Account) ── */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-[60] w-[94%] max-w-md">
        <div className="relative flex items-center justify-around h-14 bg-[#0d0f17]/90 backdrop-blur-2xl border border-white/15 px-2 py-1 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.85)]">
          {navItems.filter(item => item.id !== 'hubs').map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-300 active:scale-90 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
                title={item.label}
              >
                {/* Active Pill Glow Indicator */}
                {isActive && (
                  <span className="absolute inset-0 bg-red-600/25 border border-red-500/40 rounded-full shadow-[0_0_12px_rgba(229,9,20,0.4)] transition-all duration-300 animate-in zoom-in-75" />
                )}

                {/* Icon */}
                <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {item.isAvatar && user ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover border border-white/30"
                    />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'text-red-500 stroke-[2.5]' : ''}`} />
                  )}
                </span>

                {/* Subtitle / Tiny Label */}
                <span className={`relative z-10 text-[10px] font-bold tracking-tight mt-0.5 leading-none transition-colors ${
                  isActive ? 'text-white font-black' : 'text-gray-400'
                }`}>
                  {item.id === 'random' ? 'Dice' : item.id === 'recommendations' ? 'For You' : item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BingrNavigation;
