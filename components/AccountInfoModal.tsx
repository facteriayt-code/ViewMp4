import React, { useEffect } from 'react';
import { User as UserIcon, LogOut, X, Crown, ShieldCheck, Film, Clock, Sparkles } from 'lucide-react';
import { User, ContinueWatchingItem } from '../types.ts';

interface AccountInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  continueWatchingCount: number;
}

export const AccountInfoModal: React.FC<AccountInfoModalProps> = ({
  isOpen,
  onClose,
  user,
  onLoginClick,
  onLogout,
  continueWatchingCount
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-[#161822] via-[#0f1017] to-[#0a0a0f] rounded-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400">
              <UserIcon className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Account & Profile</h3>
              <p className="text-xs text-gray-400">Bingr streaming preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-5 space-y-4">
          {user ? (
            <div className="flex items-center space-x-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-red-500/50 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-base font-bold text-white truncate">{user.name}</h4>
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                </div>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  VIP Active
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 px-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Guest Streaming</h4>
                <p className="text-xs text-gray-400">Sign in to save favorites and sync progress</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLoginClick();
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg active:scale-95"
              >
                Sign In Now
              </button>
            </div>
          )}

          {/* Stats & Quick Info */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center space-x-1.5 text-gray-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                <span>Continue Watching</span>
              </div>
              <p className="text-lg font-black text-white">{continueWatchingCount} Titles</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center space-x-1.5 text-gray-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ad Block DNS</span>
              </div>
              <p className="text-xs font-bold text-emerald-400 mt-1">Ready / Protected</p>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-gray-300 font-medium">Default Stream Quality</span>
              <span className="text-amber-400 font-bold">4K Ultra HDR</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-gray-300 font-medium">Recommendation Engine</span>
              <span className="text-red-400 font-bold">Bingr v2 Smart</span>
            </div>
          </div>

          {/* Sign Out Action */}
          {user && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 transition active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountInfoModal;
