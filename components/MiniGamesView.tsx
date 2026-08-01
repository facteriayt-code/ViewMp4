import React, { useState } from 'react';
import { Gamepad2, Sparkles, CheckCircle2, RotateCcw, Award, Flame, Volume2, ShieldAlert } from 'lucide-react';
import { useLearning } from '../src/context/LearningContext';

export const MiniGamesView: React.FC = () => {
  const { triggerConfetti, completeLesson } = useLearning();

  const [activeGameMode, setActiveGameMode] = useState<'builder' | 'match' | 'detective'>('builder');

  // Game 1: Sentence Builder State
  const builderChallenges = [
    {
      target: 'If I were president I would change the law',
      pool: ['If', 'I', 'were', 'president', 'I', 'would', 'change', 'the', 'law'],
      explanation: 'Subjunctive mood "were" is used for unreal conditions.'
    },
    {
      target: 'She ordered an apple and a hot tea',
      pool: ['She', 'ordered', 'an', 'apple', 'and', 'a', 'hot', 'tea'],
      explanation: '"An" pairs with vowel sound "apple", "a" pairs with consonant sound "hot".'
    }
  ];
  const [builderIdx, setBuilderIdx] = useState<number>(0);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [poolWords, setPoolWords] = useState<string[]>([...builderChallenges[0].pool].sort(() => Math.random() - 0.5));
  const [builderComplete, setBuilderComplete] = useState<boolean>(false);

  // Game 2: Vocabulary Match State
  const matchPairs = [
    { word: 'Collocation', desc: 'Natural combination of words (e.g. "heavy rain")', why: 'Native speakers expect these exact pairs.' },
    { word: 'Subjunctive', desc: 'Mood used for hypothetical or imaginary situations', why: 'Changes "was" to "were" for all subjects.' },
    { word: 'Stative Verb', desc: 'Verb describing state/emotion rather than physical motion', why: 'Does not usually take continuous -ing.' }
  ];
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Game 3: Mistake Detective State
  const detectiveCases = [
    {
      incorrect: 'He have been living in New York since five years.',
      options: [
        'He has been living in New York for five years.',
        'He is living in New York since five years.',
        'He lived in New York since five years.'
      ],
      correctIdx: 0,
      why: '"has been living" fixes agreement for singular "He", and "for" is required for a duration ("five years"). "Since" requires a starting point ("since 2020").'
    }
  ];
  const [detectiveChoice, setDetectiveChoice] = useState<number | null>(null);
  const [detectiveSubmitted, setDetectiveSubmitted] = useState<boolean>(false);

  // Handlers for Sentence Builder
  const handleAddWord = (w: string, idx: number) => {
    setUserWords(prev => [...prev, w]);
    setPoolWords(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveWord = (w: string, idx: number) => {
    setUserWords(prev => prev.filter((_, i) => i !== idx));
    setPoolWords(prev => [...prev, w]);
  };

  const checkBuilder = () => {
    const target = builderChallenges[builderIdx].target.toLowerCase();
    const user = userWords.join(' ').toLowerCase();

    if (target === user) {
      setBuilderComplete(true);
      triggerConfetti();
    } else {
      alert("Not quite right! Check word order and article placements.");
    }
  };

  const resetBuilder = () => {
    setUserWords([]);
    setPoolWords([...builderChallenges[builderIdx].pool].sort(() => Math.random() - 0.5));
    setBuilderComplete(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span>Interactive Game Blitz</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Gamified English Tasks & Puzzles
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
          Reinforce your grammar rules and vocabulary through interactive sentence puzzles, word match blitz, and grammar detective challenges!
        </p>

        {/* Game Mode Selectors */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setActiveGameMode('builder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGameMode === 'builder'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🧩 Sentence Builder Puzzle
          </button>

          <button
            onClick={() => setActiveGameMode('match')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGameMode === 'match'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🃏 Vocab Match Blitz
          </button>

          <button
            onClick={() => setActiveGameMode('detective')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeGameMode === 'detective'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🔍 Mistake Detective
          </button>
        </div>
      </div>

      {/* MODE 1: SENTENCE BUILDER */}
      {activeGameMode === 'builder' && (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-lg text-white">Assemble The Grammatically Correct Sentence</h3>
              <p className="text-xs text-slate-400">Tap word blocks to order them correctly.</p>
            </div>
            <button onClick={resetBuilder} className="p-2 text-slate-400 hover:text-white" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* User Sentence Slot */}
          <div className="min-h-[80px] bg-slate-950 p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 flex flex-wrap gap-2 items-center">
            {userWords.length === 0 ? (
              <span className="text-slate-500 text-xs italic">Tap words below...</span>
            ) : (
              userWords.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveWord(w, idx)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow transition"
                >
                  {w}
                </button>
              ))
            )}
          </div>

          {/* Word Pool */}
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

          {!builderComplete ? (
            <button
              onClick={checkBuilder}
              disabled={userWords.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm transition"
            >
              Verify Sentence Order
            </button>
          ) : (
            <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-500/40 space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Correct Syntax Assembled!</span>
              </div>
              <p className="text-xs text-emerald-200">{builderChallenges[builderIdx].explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: VOCAB MATCH */}
      {activeGameMode === 'match' && (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl">
          <h3 className="font-bold text-lg text-white">Match Key Terms to Their Linguistic Definition</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matchPairs.map((pair, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-300 text-sm">{pair.word}</span>
                <p className="text-xs text-slate-300 leading-relaxed">{pair.desc}</p>
                <div className="bg-indigo-950/60 p-2 rounded-lg text-[11px] text-indigo-300 border border-indigo-500/20">
                  💡 Why: {pair.why}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: MISTAKE DETECTIVE */}
      {activeGameMode === 'detective' && (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
              🔍 Spot & Fix The Error
            </span>
            <p className="text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm mt-2">
              ❌ Incorrect: "{detectiveCases[0].incorrect}"
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Choose the corrected, natural English version:
            </span>

            {detectiveCases[0].options.map((opt, optIdx) => (
              <button
                key={optIdx}
                onClick={() => {
                  setDetectiveChoice(optIdx);
                  setDetectiveSubmitted(true);
                }}
                className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition ${
                  detectiveChoice === optIdx
                    ? optIdx === detectiveCases[0].correctIdx
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-rose-600/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {detectiveSubmitted && (
            <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-xs text-indigo-200 space-y-1 animate-fadeIn">
              <span className="font-bold text-amber-300 uppercase tracking-wider block text-[10px]">
                Why This Correction Works:
              </span>
              <p className="leading-relaxed">{detectiveCases[0].why}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
