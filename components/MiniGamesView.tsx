import React, { useState, useEffect } from 'react';
import { Gamepad2, Sparkles, CheckCircle2, RotateCcw, Lock, Award, Flame, Volume2, ArrowRight, RefreshCw, Trophy, ShieldAlert, Zap } from 'lucide-react';
import { useLearning } from '../src/context/LearningContext';
import { DAYS_CURRICULUM } from '../data/courseData';
import { DayLesson } from '../types';
import { get10GamesForDay } from '../src/utils/gameGenerator';

export const MiniGamesView: React.FC = () => {
  const { progress, addXpAndGems, triggerConfetti } = useLearning();

  // Selected Day ID: 'all_unlocked' or 'day-1', 'day-2', etc.
  const [selectedDayId, setSelectedDayId] = useState<string>('all_unlocked');
  const [activeGameMode, setActiveGameMode] = useState<'builder' | 'match' | 'detective'>('builder');

  // Determine unlocked status
  const maxUnlockedDayNumber = Math.max(1, progress.completedDayIds.length + 1);

  const isDayUnlocked = (lesson: DayLesson) => {
    return lesson.dayNumber <= maxUnlockedDayNumber || progress.completedDayIds.includes(lesson.id);
  };

  const unlockedLessons = DAYS_CURRICULUM.filter(isDayUnlocked);

  // Active Lesson selected
  const activeLesson = DAYS_CURRICULUM.find(l => l.id === selectedDayId);
  const isSelectedLocked = activeLesson ? !isDayUnlocked(activeLesson) : false;

  // --- Game State 1: Sentence Builder ---
  const [builderIndex, setBuilderIndex] = useState<number>(0);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [poolWords, setPoolWords] = useState<string[]>([]);
  const [builderSuccess, setBuilderSuccess] = useState<boolean>(false);

  // --- Game State 2: Vocab Match ---
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // --- Game State 3: Mistake Detective ---
  const [detectiveIndex, setDetectiveIndex] = useState<number>(0);
  const [detectiveChoice, setDetectiveChoice] = useState<number | null>(null);
  const [detectiveSubmitted, setDetectiveSubmitted] = useState<boolean>(false);

  // Gather challenges from selected lesson or all unlocked lessons
  const targetLessons = selectedDayId === 'all_unlocked' ? unlockedLessons : (activeLesson ? [activeLesson] : unlockedLessons);

  // Extract 10 games per day using get10GamesForDay
  const dayPackages = targetLessons.map(l => get10GamesForDay(l));

  // Gather sentence builder items (4+ per day)
  const sentenceBuilderPool = dayPackages.flatMap(pkg => {
    return pkg.sentenceBuilders.map(sb => ({
      ...sb,
      lessonTitle: pkg.lessonTitle,
      dayNumber: pkg.dayNumber
    }));
  });

  // Gather word match items (3+ per day)
  const wordPairsPool = dayPackages.flatMap(pkg => {
    return pkg.wordPairs.map(wp => ({
      ...wp,
      lessonTitle: pkg.lessonTitle,
      dayNumber: pkg.dayNumber
    }));
  });

  // Gather mistake detective items (3+ per day)
  const mistakesPool = dayPackages.flatMap(pkg => {
    return pkg.mistakeCases.map(m => ({
      ...m,
      lessonTitle: pkg.lessonTitle,
      dayNumber: pkg.dayNumber
    }));
  });

  // Initialize Sentence Builder
  useEffect(() => {
    if (sentenceBuilderPool.length > 0) {
      const current = sentenceBuilderPool[builderIndex % sentenceBuilderPool.length];
      if (current) {
        setUserWords([]);
        setPoolWords([...current.wordPool].sort(() => Math.random() - 0.5));
        setBuilderSuccess(false);
      }
    }
  }, [selectedDayId, builderIndex]);

  // Reset Detective Choice when switching index or lesson
  useEffect(() => {
    setDetectiveChoice(null);
    setDetectiveSubmitted(false);
  }, [selectedDayId, detectiveIndex]);

  // Sentence Builder Handlers
  const handleAddWord = (w: string, idx: number) => {
    setUserWords(prev => [...prev, w]);
    setPoolWords(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveWord = (w: string, idx: number) => {
    setUserWords(prev => prev.filter((_, i) => i !== idx));
    setPoolWords(prev => [...prev, w]);
  };

  const checkSentenceBuilder = () => {
    if (sentenceBuilderPool.length === 0) return;
    const current = sentenceBuilderPool[builderIndex % sentenceBuilderPool.length];
    
    // Normalize target and user sentence (stripping extra space/punctuation comparison)
    const cleanTarget = current.targetSentence.toLowerCase().replace(/[.,!?]/g, '').trim();
    const cleanUser = userWords.join(' ').toLowerCase().replace(/[.,!?]/g, '').trim();

    if (cleanTarget === cleanUser || userWords.join(' ') === current.targetSentence) {
      setBuilderSuccess(true);
      addXpAndGems(15, 5);
    } else {
      alert("Not quite right! Check word placement and grammar rules.");
    }
  };

  const nextSentenceBuilder = () => {
    setBuilderIndex(prev => prev + 1);
  };

  const resetSentenceBuilder = () => {
    if (sentenceBuilderPool.length > 0) {
      const current = sentenceBuilderPool[builderIndex % sentenceBuilderPool.length];
      setUserWords([]);
      setPoolWords([...current.wordPool].sort(() => Math.random() - 0.5));
      setBuilderSuccess(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>Course Progression Mini-Games</span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold">
            <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-amber-300 flex items-center space-x-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlocked Lessons: {unlockedLessons.length} / {DAYS_CURRICULUM.length}</span>
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Progression-Linked English Puzzles
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
          Games unlock naturally as you complete daily lessons! Practice grammar structures, vocabulary matches, and error detective scenarios directly tied to your course progress.
        </p>

        {/* Day Progression Selector */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
            Select Lesson Content to Practice:
          </label>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedDayId('all_unlocked')}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                selectedDayId === 'all_unlocked'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>All Unlocked Days (Blitz)</span>
            </button>

            {DAYS_CURRICULUM.map((lesson) => {
              const unlocked = isDayUnlocked(lesson);
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedDayId(lesson.id)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    selectedDayId === lesson.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : unlocked
                      ? 'bg-slate-950 text-slate-200 hover:bg-slate-800 border border-slate-800'
                      : 'bg-slate-950/50 text-slate-500 border border-slate-900'
                  }`}
                >
                  {unlocked ? (
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-slate-600" />
                  )}
                  <span>Day {lesson.dayNumber}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Game Mode Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveGameMode('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGameMode === 'builder'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🧩 Sentence Builder ({sentenceBuilderPool.length})
          </button>

          <button
            onClick={() => setActiveGameMode('match')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGameMode === 'match'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🃏 Vocab Match Blitz ({wordPairsPool.length})
          </button>

          <button
            onClick={() => setActiveGameMode('detective')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGameMode === 'detective'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🔍 Mistake Detective ({mistakesPool.length})
          </button>
        </div>
      </div>

      {/* LOCKED DAY ALERT SCREEN */}
      {isSelectedLocked ? (
        <div className="bg-slate-900 rounded-3xl p-8 border border-amber-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Lesson Locked!</h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Day {activeLesson?.dayNumber} games will unlock automatically once you complete earlier lessons in your English Roadmap.
          </p>
          <button
            onClick={() => setSelectedDayId('all_unlocked')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl text-xs transition shadow-lg"
          >
            Play All Unlocked Content
          </button>
        </div>
      ) : (
        <>
          {/* MODE 1: SENTENCE BUILDER PUZZLE */}
          {activeGameMode === 'builder' && (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl">
              {sentenceBuilderPool.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm space-y-2">
                  <p>No sentence builder puzzles found for this lesson yet.</p>
                  <button onClick={() => setSelectedDayId('all_unlocked')} className="text-emerald-400 underline font-bold">
                    Switch to All Unlocked Blitz
                  </button>
                </div>
              ) : (
                (() => {
                  const currentChallenge = sentenceBuilderPool[builderIndex % sentenceBuilderPool.length];
                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 mb-1">
                            <span>Day {currentChallenge.dayNumber}: {currentChallenge.lessonTitle}</span>
                          </div>
                          <h3 className="font-bold text-base sm:text-lg text-white">Assemble The Grammatically Accurate Sentence</h3>
                        </div>
                        
                        <button onClick={resetSentenceBuilder} className="p-2 text-slate-400 hover:text-white" title="Reset Word Pool">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Assembled Sentence Box */}
                      <div className="min-h-[90px] bg-slate-950 p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 flex flex-wrap gap-2 items-center">
                        {userWords.length === 0 ? (
                          <span className="text-slate-500 text-xs italic">Tap word blocks below to construct sentence...</span>
                        ) : (
                          userWords.map((w, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleRemoveWord(w, idx)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow transition animate-fadeIn"
                            >
                              {w}
                            </button>
                          ))
                        )}
                      </div>

                      {/* Word Pool */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Word Pool:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {poolWords.map((w, poolIdx) => (
                            <button
                              key={poolIdx}
                              onClick={() => handleAddWord(w, poolIdx)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2.5 rounded-xl text-xs transition"
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>

                      {!builderSuccess ? (
                        <button
                          onClick={checkSentenceBuilder}
                          disabled={userWords.length === 0}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-emerald-600/20"
                        >
                          Verify Sentence Syntax
                        </button>
                      ) : (
                        <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-500/40 space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              <span>Mastered! +15 XP & +5 Gems</span>
                            </div>
                            <button onClick={() => speakText(currentChallenge.targetSentence)} className="p-1.5 text-emerald-300 hover:text-white" title="Listen">
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                            💡 <span className="font-bold text-amber-300">Why this works:</span> {currentChallenge.grammarBreakdown}
                          </p>

                          <button
                            onClick={nextSentenceBuilder}
                            className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
                          >
                            <span>Next Sentence Challenge</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          )}

          {/* MODE 2: VOCAB & TERM MATCH BLITZ */}
          {activeGameMode === 'match' && (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl">
              {wordPairsPool.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm space-y-2">
                  <p>No term pairs found for this lesson yet.</p>
                  <button onClick={() => setSelectedDayId('all_unlocked')} className="text-emerald-400 underline font-bold">
                    Switch to All Unlocked Blitz
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-lg text-white">Linguistic Terms & Collocations Match</h3>
                    <p className="text-xs text-slate-400">Review terms and their native usage explanations.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wordPairsPool.map((pair, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 text-sm">{pair.word}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Day {pair.dayNumber}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{pair.definitionOrSynonym}</p>
                        <div className="bg-indigo-950/60 p-2.5 rounded-xl text-[11px] text-indigo-300 border border-indigo-500/20">
                          💡 <span className="font-bold text-indigo-200">Why It Matters:</span> {pair.whyItMatters}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: MISTAKE DETECTIVE */}
          {activeGameMode === 'detective' && (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl">
              {mistakesPool.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm space-y-2">
                  <p>No error scenarios found for this lesson yet.</p>
                  <button onClick={() => setSelectedDayId('all_unlocked')} className="text-emerald-400 underline font-bold">
                    Switch to All Unlocked Blitz
                  </button>
                </div>
              ) : (
                (() => {
                  const currentDetective = mistakesPool[detectiveIndex % mistakesPool.length];
                  return (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                          🔍 Spot & Fix The Error (Day {currentDetective.dayNumber})
                        </span>

                        <span className="text-xs text-slate-400 font-bold">
                          Case { (detectiveIndex % mistakesPool.length) + 1 } of {mistakesPool.length}
                        </span>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                          Mistaken Sentence:
                        </span>
                        <p className="text-slate-200 font-mono text-sm">
                          ❌ "{currentDetective.incorrectSentence}"
                        </p>
                      </div>

                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          Choose the corrected native sentence:
                        </span>

                        <button
                          onClick={() => {
                            setDetectiveChoice(0);
                            setDetectiveSubmitted(true);
                            addXpAndGems(15, 5);
                          }}
                          className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition ${
                            detectiveSubmitted
                              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          ✅ {currentDetective.correctSentence}
                        </button>
                      </div>

                      {detectiveSubmitted && (
                        <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-xs text-indigo-200 space-y-2 animate-fadeIn">
                          <span className="font-bold text-amber-300 uppercase tracking-wider block text-[10px]">
                            Why This Correction Is Right:
                          </span>
                          <p className="leading-relaxed">{currentDetective.explanationWhy}</p>

                          <button
                            onClick={() => setDetectiveIndex(prev => prev + 1)}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2"
                          >
                            Next Detective Case
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
};
