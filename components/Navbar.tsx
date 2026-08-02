import React from 'react';
import { Flame, Gem, Heart, Trophy, Compass, BookOpen, Sparkles, Gamepad2, Bot, Languages } from 'lucide-react';
import { useLearning } from '../src/context/LearningContext';
import { UserLevel } from '../types';

interface NavbarProps {
  activeTab: 'roadmap' | 'explainer' | 'games' | 'tutor' | 'profile';
  setActiveTab: (tab: 'roadmap' | 'explainer' | 'games' | 'tutor' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { progress, setUserLevel, refillHearts, language, toggleLanguage } = useLearning();

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserLevel(e.target.value as UserLevel);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('roadmap')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <span className="text-xl font-extrabold text-white">L</span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-heading font-black text-xl bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                  LingoSprint
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Gamified English Mastery</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('explainer')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'explainer'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Linguistic "Why" Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'games'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-emerald-300" />
              <span>Game Blitz</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'tutor'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>AI Tutor</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Stats</span>
            </button>
          </nav>

          {/* Gamified Stats Pill Bar */}
          <div className="flex items-center space-x-2">
            
            {/* Hindi / English Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                language === 'hi'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30 hover:bg-indigo-900/60'
              }`}
              title="Toggle Hindi Explanation / हिंदी अनुवाद"
            >
              <Languages className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? '🇮🇳 हिंदी (Hindi)' : '🇬🇧 English'}</span>
            </button>

            {/* Level Selector */}
            <div className="relative hidden sm:block">
              <select
                value={progress.userLevel}
                onChange={handleLevelChange}
                className="bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="beginner">🌱 Beginner Track</option>
                <option value="intermediate">🚀 Intermediate</option>
                <option value="pro">👑 Pro / Advanced</option>
              </select>
            </div>

            {/* Daily Streak */}
            <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl text-amber-400 font-bold text-xs">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{progress.streakDays}d</span>
            </div>

            {/* Gems */}
            <div className="flex items-center space-x-1 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-xl text-cyan-300 font-bold text-xs">
              <Gem className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              <span>{progress.gems}</span>
            </div>

            {/* Hearts */}
            <button
              onClick={refillHearts}
              title="Click to refill hearts"
              className="flex items-center space-x-1 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-xl text-rose-400 font-bold text-xs hover:bg-rose-500/20 transition"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>{progress.hearts}</span>
            </button>

            {/* Total XP */}
            <div className="hidden lg:flex items-center space-x-1 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-xl text-indigo-300 font-bold text-xs">
              <Trophy className="w-4 h-4 text-indigo-400" />
              <span>{progress.xp} XP</span>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800 py-2 px-1 text-xs">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'roadmap' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('explainer')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'explainer' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Why Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'games' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          <Gamepad2 className="w-5 h-5 mb-0.5" />
          <span>Games</span>
        </button>

        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'tutor' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <Bot className="w-5 h-5 mb-0.5" />
          <span>AI Tutor</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'profile' ? 'text-slate-200 font-bold' : 'text-slate-400'}`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
};
