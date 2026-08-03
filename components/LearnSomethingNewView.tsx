import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Check, 
  Brain, 
  Zap, 
  History, 
  HelpCircle, 
  BookOpen, 
  Languages, 
  Award, 
  ChevronRight, 
  Eye, 
  Search,
  Bot
} from 'lucide-react';
import { LEARN_FACTS_DATABASE, LearnFact } from '../data/learnSomethingNewData';
import { useLearning } from '../src/context/LearningContext';
import confetti from 'canvas-confetti';

export const LearnSomethingNewView: React.FC = () => {
  const { addXP, language } = useLearning();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentFact, setCurrentFact] = useState<LearnFact>(LEARN_FACTS_DATABASE[0]);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(true);
  const [savedFactIds, setSavedFactIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('lingo_saved_facts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [discoveredHistory, setDiscoveredHistory] = useState<LearnFact[]>([LEARN_FACTS_DATABASE[0]]);
  const [showHindi, setShowHindi] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync saved facts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lingo_saved_facts', JSON.stringify(savedFactIds));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [savedFactIds]);

  // Handle category change
  const filteredDatabase = LEARN_FACTS_DATABASE.filter(fact => {
    if (activeCategory === 'all') return true;
    return fact.category === activeCategory;
  });

  const handleNextFact = async () => {
    setIsAnswerRevealed(!isQuizMode);
    
    // Pick next random fact from filtered DB or fetch AI generated fact
    const remaining = filteredDatabase.filter(f => f.id !== currentFact.id);
    const chosenList = remaining.length > 0 ? remaining : filteredDatabase;
    const randomIndex = Math.floor(Math.random() * chosenList.length);
    const nextFact = chosenList[randomIndex] || LEARN_FACTS_DATABASE[0];

    setCurrentFact(nextFact);
    if (!discoveredHistory.some(h => h.id === nextFact.id)) {
      setDiscoveredHistory(prev => [nextFact, ...prev]);
      addXP(5);
      confetti({
        particleCount: 20,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleFetchAIFact = async () => {
    setIsLoadingAI(true);
    setIsAnswerRevealed(!isQuizMode);
    try {
      const response = await fetch('/api/learn-something-new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: activeCategory, language })
      });
      const data = await response.json();
      if (data.success && data.fact) {
        const newAiFact: LearnFact = data.fact;
        setCurrentFact(newAiFact);
        setDiscoveredHistory(prev => [newAiFact, ...prev]);
        addXP(10);
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.7 }
        });
      } else {
        // Fallback to offline random
        handleNextFact();
      }
    } catch (err) {
      console.warn("AI Fact Generation failed, falling back to database:", err);
      handleNextFact();
    } finally {
      setIsLoadingAI(false);
    }
  };

  const toggleSaveFact = (factId: string) => {
    setSavedFactIds(prev => 
      prev.includes(factId) ? prev.filter(id => id !== factId) : [...prev, factId]
    );
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    const textToCopy = `💡 English Fact: ${currentFact.title}\n\n${currentFact.factContent}\n\n👉 Example: ${currentFact.exampleSentence}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  const isSaved = savedFactIds.includes(currentFact.id);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'History': return <History className="w-4 h-4" />;
      case 'HelpCircle': return <HelpCircle className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  // Filter history for search
  const filteredHistory = discoveredHistory.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.factContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-amber-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-400/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>Learn Something New Every Time</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight">
              Surprising English Facts, Word Origins & Hidden Reasons
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Discover strange linguistic rules, unwritten grammar secrets, and fascinating word origin stories. Learn something new with every click!
            </p>
          </div>

          {/* Quick Counter Stats */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[200px]">
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">Discovered Facts</span>
              <span className="text-2xl font-black text-amber-300">{discoveredHistory.length}</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider block">Saved Favorites</span>
              <span className="text-xl font-bold text-white">{savedFactIds.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Facts</span>
        </button>

        <button
          onClick={() => setActiveCategory('strange_facts')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeCategory === 'strange_facts'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Strange & Surprising</span>
        </button>

        <button
          onClick={() => setActiveCategory('word_origins')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeCategory === 'word_origins'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Word Origins</span>
        </button>

        <button
          onClick={() => setActiveCategory('linguistic_reasons')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeCategory === 'linguistic_reasons'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Linguistic Reasons</span>
        </button>

        <button
          onClick={() => setActiveCategory('important_idioms')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeCategory === 'important_idioms'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Important Idioms</span>
        </button>

        <button
          onClick={() => setActiveCategory('mindblowing_vocab')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeCategory === 'mindblowing_vocab'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Mind-Blowing Vocab</span>
        </button>
      </div>

      {/* Main Feature Spotlight Fact Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6 relative overflow-hidden transition-all duration-300">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
              {getCategoryIcon(currentFact.categoryIcon)}
              <span>{currentFact.categoryLabel}</span>
            </span>

            {/* Fun Rating */}
            <div className="flex items-center space-x-1 text-amber-500 text-xs">
              {'★'.repeat(currentFact.funRating)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            
            {/* Quiz Teaser Toggle */}
            <button
              onClick={() => {
                setIsQuizMode(!isQuizMode);
                if (!isQuizMode) setIsAnswerRevealed(false);
                else setIsAnswerRevealed(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                isQuizMode 
                  ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Quiz Mode (Hide explanation until you click reveal)"
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              <span>{isQuizMode ? 'Quiz Mode ON' : 'Quiz Mode'}</span>
            </button>

            {/* Hindi Toggle */}
            <button
              onClick={() => setShowHindi(!showHindi)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                showHindi 
                  ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Languages className="w-3.5 h-3.5 inline mr-1" />
              <span>{showHindi ? '🇮🇳 हिंदी ON' : '🇮🇳 हिंदी'}</span>
            </button>

            {/* Bookmark Favorite */}
            <button
              onClick={() => toggleSaveFact(currentFact.id)}
              className={`p-2 rounded-xl transition border ${
                isSaved
                  ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-xs'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
              title={isSaved ? "Saved to Favorites" : "Save Fact"}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Share / Copy */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 transition"
              title="Copy Fact Text"
            >
              {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

          </div>
        </div>

        {/* Fact Headline */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 leading-tight">
            {currentFact.title}
          </h2>

          {/* Short Teaser / Riddle */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-sm italic leading-relaxed">
            💡 <span className="font-semibold">{currentFact.shortTeaser}</span>
          </div>
        </div>

        {/* Answer / Main Fact Content */}
        {isQuizMode && !isAnswerRevealed ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
            <span className="text-2xl">🧠</span>
            <h3 className="text-sm font-bold text-slate-800">Think you know the reason?</h3>
            <p className="text-xs text-slate-500">Test your English intuition before revealing the answer!</p>
            <button
              onClick={() => setIsAnswerRevealed(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
            >
              Reveal Answer & Explanation
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Core Explanation */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                📖 The Strange Fact / Story Explained:
              </h3>
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-normal">
                {currentFact.factContent}
              </p>
            </div>

            {/* Why It Matters for English Learners */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Why This Matters to You:</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {currentFact.whyItMatters}
              </p>
            </div>

            {/* Example Sentence Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Example in Natural English:
                </span>
                <button
                  onClick={() => speakText(currentFact.exampleSentence)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-mono italic text-slate-100">
                "{currentFact.exampleSentence}"
              </p>
            </div>

            {/* Hindi Explanation Card */}
            {showHindi && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 animate-fadeIn">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  🇮🇳 हिंदी में समझें (Hindi Explanation):
                </span>
                <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                  {currentFact.hindiTranslation}
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {currentFact.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                  #{tag}
                </span>
              ))}
            </div>

          </div>
        )}

        {/* Action Button Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          
          <button
            onClick={handleNextFact}
            disabled={isLoadingAI}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-indigo-600/20 transition flex items-center justify-center space-x-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Learn Another Offline Fact (+5 XP)</span>
          </button>

          <button
            onClick={handleFetchAIFact}
            disabled={isLoadingAI}
            className="flex-1 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-purple-600/20 transition flex items-center justify-center space-x-2 text-sm"
          >
            {isLoadingAI ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Asking Gemini AI for Fresh Fact...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-amber-300" />
                <span>Generate Infinite AI Fact (+10 XP)</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Discovered Facts History & Notebook */}
      <div className="space-y-4 pt-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Discovered Facts & Notebook ({discoveredHistory.length})
            </h3>
            <p className="text-xs text-slate-500">
              Revisit any surprising English knowledge you have discovered during this session.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facts..."
              className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((fact) => {
            const isCurrentlySelected = fact.id === currentFact.id;
            const isSavedFact = savedFactIds.includes(fact.id);
            return (
              <div
                key={fact.id}
                onClick={() => setCurrentFact(fact)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                  isCurrentlySelected
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {fact.categoryLabel}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveFact(fact.id);
                    }}
                    className="text-slate-400 hover:text-amber-500 p-1"
                  >
                    {isSavedFact ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <h4 className="font-bold text-xs text-slate-900 line-clamp-2">
                  {fact.title}
                </h4>

                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {fact.factContent}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] font-bold text-indigo-600">
                  <span>Click to review ➔</span>
                  <span className="text-slate-400 font-normal">{'★'.repeat(fact.funRating)}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
