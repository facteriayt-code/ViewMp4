import React from 'react';
import { Flame, Gem, Heart, Trophy, Compass, BookOpen, Sparkles, Gamepad2, Bot, Languages, Lightbulb } from 'lucide-react';
import { useLearning } from '../src/context/LearningContext';
import { UserLevel } from '../types';

interface NavbarProps {
  activeTab: 'roadmap' | 'explainer' | 'games' | 'tutor' | 'learn' | 'profile';
  setActiveTab: (tab: 'roadmap' | 'explainer' | 'games' | 'tutor' | 'learn' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { progress, setUserLevel, refillHearts, language, toggleLanguage } = useLearning();

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserLevel(e.target.value as UserLevel);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1 sm:gap-3">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('roadmap')}
            className="flex items-center space-x-1.5 sm:space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-base sm:text-xl font-extrabold text-white">L</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1">
                <span className="font-heading font-black text-sm sm:text-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 bg-clip-text text-transparent truncate">
                  LingoSprint
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  PRO
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-500 font-medium truncate">Gamified English Mastery</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('explainer')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'explainer'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Linguistic "Why" Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'games'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Game Blitz</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tutor'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Tutor</span>
            </button>

            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'learn'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Learn New</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Stats</span>
            </button>
          </nav>

          {/* Gamified Stats Pill Bar */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            
            {/* Hindi / English Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-1 sm:py-1 rounded-xl text-[10px] sm:text-xs font-bold transition border shrink-0 ${
                language === 'hi'
                  ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="Toggle Hindi Explanation / हिंदी अनुवाद"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">{language === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
              <span className="sm:hidden">{language === 'hi' ? 'HI' : 'EN'}</span>
            </button>

            {/* Level Selector */}
            <div className="relative hidden xl:block shrink-0">
              <select
                value={progress.userLevel}
                onChange={handleLevelChange}
                className="bg-slate-100 text-xs font-bold text-slate-800 border border-slate-300 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="beginner">🌱 Beginner</option>
                <option value="intermediate">🚀 Intermediate</option>
                <option value="pro">👑 Pro</option>
              </select>
            </div>

            {/* Daily Streak */}
            <div 
              className="flex items-center space-x-0.5 sm:space-x-1 bg-amber-50 border border-amber-200 px-1.5 sm:px-2 py-1 rounded-xl text-amber-700 font-black text-[10px] sm:text-xs shrink-0"
              title={`${progress.streakDays} Days Streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse shrink-0" />
              <span>{progress.streakDays}d</span>
            </div>

            {/* Gems / Diamonds */}
            <div 
              className="flex items-center space-x-0.5 sm:space-x-1 bg-cyan-50 border border-cyan-200 px-1.5 sm:px-2 py-1 rounded-xl text-cyan-700 font-black text-[10px] sm:text-xs shrink-0"
              title={`${progress.gems} Diamonds`}
            >
              <Gem className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500 shrink-0" />
              <span>{progress.gems}</span>
            </div>

            {/* Hearts / Life */}
            <button
              onClick={refillHearts}
              title="Click to refill hearts"
              className="flex items-center space-x-0.5 sm:space-x-1 bg-rose-50 border border-rose-200 px-1.5 sm:px-2 py-1 rounded-xl text-rose-700 font-black text-[10px] sm:text-xs hover:bg-rose-100 transition shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
              <span>{progress.hearts}</span>
            </button>

            {/* Total XP */}
            <div className="hidden xl:flex items-center space-x-1 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-xl text-indigo-700 font-bold text-xs shrink-0">
              <Trophy className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{progress.xp} XP</span>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 py-2 px-1 text-xs">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'roadmap' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('explainer')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'explainer' ? 'text-purple-600 font-bold' : 'text-slate-500'}`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Why Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'games' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
        >
          <Gamepad2 className="w-5 h-5 mb-0.5" />
          <span>Games</span>
        </button>

        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'tutor' ? 'text-amber-600 font-bold' : 'text-slate-500'}`}
        >
          <Bot className="w-5 h-5 mb-0.5" />
          <span>AI Tutor</span>
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'learn' ? 'text-amber-600 font-bold' : 'text-slate-500'}`}
        >
          <Lightbulb className="w-5 h-5 mb-0.5" />
          <span>Learn New</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${activeTab === 'profile' ? 'text-slate-900 font-bold' : 'text-slate-500'}`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
};
