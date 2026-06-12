import React, { useState } from 'react';
import { Trophy, Users, Shield, BookOpen, LogOut, Menu, X } from 'lucide-react';
import { User } from '../types.ts';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, activeTab, setActiveTab, onLoginClick, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'scorer', label: 'Match Scorer', icon: Trophy },
    { id: 'teams', label: 'Teams & Rosters', icon: Users },
    { id: 'stats', label: 'Player Insights', icon: Shield },
    { id: 'history', label: 'Annals (History)', icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0B132B] border-b border-[#D4AF37]/20 shadow-xl px-4 md:px-12 py-3 flex items-center justify-between">
      {/* Royal Logo */}
      <div 
        className="flex items-center space-x-3 cursor-pointer select-none"
        onClick={() => { setActiveTab('scorer'); setIsMobileMenuOpen(false); }}
      >
        <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] rounded-lg shadow-md flex items-center justify-center">
          <Trophy className="w-6 h-6 text-[#0B132B]" />
        </div>
        <div>
          <h1 className="text-white text-lg md:text-xl font-bold tracking-wider uppercase leading-none font-sans">
            Royal <span className="text-[#D4AF37]">Cricket Ledger</span>
          </h1>
          <p className="text-[9px] font-mono tracking-widest text-[#D4AF37]/60 uppercase ml-0.5">Imperial Scorekeeping</p>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                isActive
                  ? 'bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-[#0B132B] shadow-md shadow-[#D4AF37]/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile & Auth Section */}
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-full p-0.5"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-8 h-8 rounded-full border border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition object-cover" 
              />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-[#0E1726] border border-[#D4AF37]/20 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-4 py-3 border-b border-[#D4AF37]/10 mb-2">
                  <p className="text-white text-sm font-semibold truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
                </div>
                <div className="px-2">
                  <button 
                    onClick={() => { onLogout(); setShowDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-400/10 rounded-xl transition flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out from Ledger
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-all text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl active:scale-95"
          >
            Ledger Sync
          </button>
        )}

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-[65px] left-0 w-full bg-[#0B132B] border-b border-[#D4AF37]/20 shadow-2xl md:hidden p-4 flex flex-col space-y-2 animate-in slide-in-from-top duration-200 z-40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-[#0B132B]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
