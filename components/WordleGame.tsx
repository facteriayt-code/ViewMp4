import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, CheckCircle2, RotateCcw, Volume2, VolumeX, ArrowRight,
  HelpCircle, BookOpen, Search, Trophy, Zap, AlertCircle, Eye, Info, History,
  Sliders, Settings, Flame, Shield, Check, Layers, Target
} from 'lucide-react';
import {
  WORDLE_DICTIONARY,
  WORDLE_4LETTER_DICTIONARY,
  WORDLE_6LETTER_DICTIONARY,
  getWordMeaning,
  isValidWordleWord,
  getWordsForLength,
  WordleWord
} from '../src/data/wordleDictionary';
import { useLearning } from '../src/context/LearningContext';

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';
export type DifficultyPreset = 'easy' | 'medium' | 'hard' | 'expert' | 'custom';

interface DifficultyConfig {
  id: DifficultyPreset;
  label: string;
  badgeBg: string;
  badgeTextColor: string;
  wordLength: number;
  maxGuesses: number;
  description: string;
}

export const DIFFICULTY_PRESETS: DifficultyConfig[] = [
  {
    id: 'easy',
    label: 'Easy',
    badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    badgeTextColor: 'text-emerald-700',
    wordLength: 4,
    maxGuesses: 7,
    description: '4-letter words • 7 attempts (Great for beginners)'
  },
  {
    id: 'medium',
    label: 'Medium (Classic)',
    badgeBg: 'bg-sky-100 border-sky-300 text-sky-800',
    badgeTextColor: 'text-sky-700',
    wordLength: 5,
    maxGuesses: 6,
    description: '5-letter words • 6 attempts (Standard Wordle)'
  },
  {
    id: 'hard',
    label: 'Hard',
    badgeBg: 'bg-amber-100 border-amber-300 text-amber-900',
    badgeTextColor: 'text-amber-700',
    wordLength: 6,
    maxGuesses: 5,
    description: '6-letter words • 5 attempts (Challenging)'
  },
  {
    id: 'expert',
    label: 'Expert',
    badgeBg: 'bg-rose-100 border-rose-300 text-rose-900',
    badgeTextColor: 'text-rose-700',
    wordLength: 6,
    maxGuesses: 4,
    description: '6-letter words • 4 attempts (For masters)'
  }
];

interface GuessResult {
  word: string;
  statuses: LetterStatus[];
  meaning: WordleWord;
}

interface DeepDiveData {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  etymologyReason: string;
  synonyms: string[];
  antonyms: string[];
  commonCollocations: string[];
  exampleSentence: string;
  whyUsedInExample: string;
}

// Web Audio API Synthesizer for Wordle Sound Effects
class WordleSoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Key tap sound (virtual keyboard press)
  playKeyClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.error(e);
    }
  }

  // Delete / Backspace sound
  playDeleteClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.error(e);
    }
  }

  // Enter / Submit guess sound
  playEnterClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.08);
    } catch (e) {
      console.error(e);
    }
  }

  // Error alert sound
  playErrorAlert() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.16);
    } catch (e) {
      console.error(e);
    }
  }

  // Victory fanfare sound
  playWinFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + i * 0.11;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Game over loss sound
  playLossTone() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [311.13, 293.66, 261.63]; // Eb4, D4, C4
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + i * 0.14;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

const soundEngine = new WordleSoundEngine();

export const WordleGame: React.FC = () => {
  const { addXpAndGems, triggerConfetti } = useLearning();

  // Difficulty & Customization Settings State
  const [wordLength, setWordLength] = useState<number>(() => {
    const saved = localStorage.getItem('lingo_wordle_word_length');
    return saved ? Math.min(Math.max(parseInt(saved, 10), 4), 6) : 5;
  });

  const [maxGuesses, setMaxGuesses] = useState<number>(() => {
    const saved = localStorage.getItem('lingo_wordle_max_guesses');
    return saved ? Math.min(Math.max(parseInt(saved, 10), 3), 8) : 6;
  });

  const [difficultyPreset, setDifficultyPreset] = useState<DifficultyPreset>(() => {
    const saved = localStorage.getItem('lingo_wordle_preset');
    return (saved as DifficultyPreset) || 'medium';
  });

  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);

  // Sync settings with localStorage
  useEffect(() => {
    localStorage.setItem('lingo_wordle_word_length', wordLength.toString());
    localStorage.setItem('lingo_wordle_max_guesses', maxGuesses.toString());
    localStorage.setItem('lingo_wordle_preset', difficultyPreset);
  }, [wordLength, maxGuesses, difficultyPreset]);

  // Sound Mute Toggle State
  const [soundMuted, setSoundMuted] = useState<boolean>(() => {
    return localStorage.getItem('lingo_wordle_muted') === 'true';
  });

  useEffect(() => {
    soundEngine.isMuted = soundMuted;
    localStorage.setItem('lingo_wordle_muted', soundMuted ? 'true' : 'false');
  }, [soundMuted]);

  // Persistent Played Target Words State (Prevents repeating words)
  const [completedWords, setCompletedWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lingo_completed_wordle_words');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Keep localStorage synced
  useEffect(() => {
    localStorage.setItem('lingo_completed_wordle_words', JSON.stringify(completedWords));
  }, [completedWords]);

  // Helper to pick a random target secret word for a given word length
  const getRandomTargetWord = useCallback((len: number, excludeWord?: string): WordleWord => {
    const dictionary = getWordsForLength(len);
    const savedCompleted: string[] = (() => {
      try { return JSON.parse(localStorage.getItem('lingo_completed_wordle_words') || '[]'); } catch (e) { return []; }
    })();

    const unplayed = dictionary.filter(
      w => !savedCompleted.includes(w.word.toUpperCase()) && w.word.toUpperCase() !== excludeWord
    );
    const pool = unplayed.length > 0 ? unplayed : dictionary.filter(w => w.word.toUpperCase() !== excludeWord);
    const poolToUse = pool.length > 0 ? pool : dictionary;
    return poolToUse[Math.floor(Math.random() * poolToUse.length)];
  }, []);

  // Target Secret Word State
  const [targetWordObj, setTargetWordObj] = useState<WordleWord>(() => {
    return getRandomTargetWord(wordLength);
  });

  const targetWord = targetWordObj.word.toUpperCase();

  // Helper to mark target word as completed so it never appears again
  const markWordAsCompleted = useCallback((wordToMark: string) => {
    const upper = wordToMark.toUpperCase();
    setCompletedWords(prev => {
      if (!prev.includes(upper)) {
        return [...prev, upper];
      }
      return prev;
    });
  }, []);

  // Game State
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active word meaning being viewed
  const [selectedWordMeaning, setSelectedWordMeaning] = useState<WordleWord | null>(null);

  // Deep dive state from API
  const [deepDiveData, setDeepDiveData] = useState<DeepDiveData | null>(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState<boolean>(false);

  // Reset Game for new word
  const startNewGame = useCallback((newLen?: number) => {
    const activeLength = newLen ?? wordLength;
    const nextTarget = getRandomTargetWord(activeLength, targetWordObj?.word?.toUpperCase());
    setTargetWordObj(nextTarget);

    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setErrorMessage(null);
    setSelectedWordMeaning(null);
    setDeepDiveData(null);
  }, [getRandomTargetWord, targetWordObj, wordLength]);

  // Difficulty Switcher Handler
  const handleSelectDifficulty = (preset: DifficultyPreset, customLen?: number, customGuesses?: number) => {
    if (preset === 'custom') {
      const targetLen = customLen ?? wordLength;
      const targetGuesses = customGuesses ?? maxGuesses;
      setDifficultyPreset('custom');
      setWordLength(targetLen);
      setMaxGuesses(targetGuesses);
      startNewGame(targetLen);
    } else {
      const config = DIFFICULTY_PRESETS.find(p => p.id === preset);
      if (config) {
        setDifficultyPreset(preset);
        setWordLength(config.wordLength);
        setMaxGuesses(config.maxGuesses);
        startNewGame(config.wordLength);
      }
    }
  };

  // Text-to-Speech Helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Evaluate a guess dynamically against secret target word
  const evaluateGuess = (guessWord: string): LetterStatus[] => {
    const len = targetWord.length;
    const statuses: LetterStatus[] = Array(len).fill('absent');
    const targetArr = targetWord.split('');
    const guessArr = guessWord.split('');
    const taken = Array(len).fill(false);

    // First pass: Green (correct position)
    for (let i = 0; i < len; i++) {
      if (guessArr[i] === targetArr[i]) {
        statuses[i] = 'correct';
        taken[i] = true;
      }
    }

    // Second pass: Yellow (present in wrong position)
    for (let i = 0; i < len; i++) {
      if (statuses[i] !== 'correct') {
        const char = guessArr[i];
        const matchIdx = targetArr.findIndex((tChar, idx) => tChar === char && !taken[idx]);
        if (matchIdx !== -1) {
          statuses[i] = 'present';
          taken[matchIdx] = true;
        }
      }
    }

    return statuses;
  };

  // Keyboard letter color mapping
  const getKeyboardLetterStatus = useCallback((letter: string): LetterStatus => {
    let bestStatus: LetterStatus = 'empty';
    for (const g of guesses) {
      g.word.split('').forEach((char, idx) => {
        if (char === letter) {
          const stat = g.statuses[idx];
          if (stat === 'correct') bestStatus = 'correct';
          else if (stat === 'present' && bestStatus !== 'correct') bestStatus = 'present';
          else if (stat === 'absent' && bestStatus === 'empty') bestStatus = 'absent';
        }
      });
    }
    return bestStatus;
  }, [guesses]);

  // Handle word submission
  const submitGuess = useCallback(() => {
    if (gameStatus !== 'playing') return;

    if (currentGuess.length !== wordLength) {
      soundEngine.playErrorAlert();
      setErrorMessage(`Please enter a ${wordLength}-letter word!`);
      setTimeout(() => setErrorMessage(null), 2500);
      return;
    }

    const guessUpper = currentGuess.toUpperCase();

    // Verify word validity - only real English words of correct length allowed
    if (!isValidWordleWord(guessUpper, wordLength)) {
      soundEngine.playErrorAlert();
      setErrorMessage(`Not in word list! Please enter a valid ${wordLength}-letter English word.`);
      setTimeout(() => setErrorMessage(null), 2500);
      return;
    }

    soundEngine.playEnterClick();
    setErrorMessage(null);
    const statuses = evaluateGuess(guessUpper);
    const meaning = getWordMeaning(guessUpper);

    const newGuessResult: GuessResult = {
      word: guessUpper,
      statuses,
      meaning
    };

    const updatedGuesses = [...guesses, newGuessResult];
    setGuesses(updatedGuesses);
    setCurrentGuess('');

    // Immediately show the meaning of the guessed word!
    setSelectedWordMeaning(meaning);
    setDeepDiveData(null);
    speakText(meaning.word);

    // Check Win/Loss
    if (guessUpper === targetWord) {
      soundEngine.playWinFanfare();
      setGameStatus('won');
      setSelectedWordMeaning(targetWordObj);
      markWordAsCompleted(targetWord);
      triggerConfetti();
      addXpAndGems(25 + (wordLength - 4) * 5, 10);
    } else if (updatedGuesses.length >= maxGuesses) {
      soundEngine.playLossTone();
      setGameStatus('lost');
      setSelectedWordMeaning(targetWordObj);
      markWordAsCompleted(targetWord);
    }
  }, [currentGuess, gameStatus, guesses, targetWord, targetWordObj, wordLength, maxGuesses, triggerConfetti, addXpAndGems, markWordAsCompleted]);

  // Physical keyboard key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        soundEngine.playDeleteClick();
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length < wordLength && gameStatus === 'playing') {
          soundEngine.playKeyClick();
          setCurrentGuess(prev => (prev + e.key).toUpperCase());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, submitGuess, wordLength]);

  // Fetch AI Deep Dive for the selected word
  const fetchDeepDive = async (wordToFetch: string) => {
    setLoadingDeepDive(true);
    try {
      const res = await fetch('/api/word-deepdive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: wordToFetch })
      });
      const data = await res.json();
      if (data.success && data.wordData) {
        setDeepDiveData(data.wordData);
      }
    } catch (e) {
      console.error("Failed to fetch deep dive:", e);
    } finally {
      setLoadingDeepDive(false);
    }
  };

  // View section state for quick navigation buttons
  const [activeViewSection, setActiveViewSection] = useState<'game' | 'meaning' | 'history' | 'all'>('all');

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Difficulty Bar & Action Buttons */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-indigo-50 rounded-3xl p-5 border border-emerald-200 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Vocabulary Wordle Challenge</span>
              
              {/* Dynamic Difficulty Badge */}
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                difficultyPreset === 'easy' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' :
                difficultyPreset === 'medium' ? 'bg-sky-100 border-sky-300 text-sky-800' :
                difficultyPreset === 'hard' ? 'bg-amber-100 border-amber-300 text-amber-900' :
                difficultyPreset === 'expert' ? 'bg-rose-100 border-rose-300 text-rose-900' :
                'bg-purple-100 border-purple-300 text-purple-900'
              }`}>
                {difficultyPreset === 'custom' ? `Custom (${wordLength} Ltrs • ${maxGuesses} Attempts)` : `${DIFFICULTY_PRESETS.find(p => p.id === difficultyPreset)?.label}`}
              </span>

              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-300">
                Mastered: {completedWords.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Guess the English Secret Word
            </h2>
            <p className="text-xs text-slate-600">
              Test your vocabulary intuition! Choose word lengths (4-6 letters) and difficulty attempt limits.
            </p>
          </div>

          {/* Core Control Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Difficulty Settings Toggle Button */}
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border shadow-2xs ${
                showSettingsDrawer
                  ? 'bg-slate-900 text-white border-slate-900 shadow-slate-900/20'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
              title="Customize Word Lengths and Attempt Limits"
            >
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Difficulty Settings</span>
            </button>

            {/* 1. Word Meaning & Vocabulary Button */}
            <button
              onClick={() => {
                if (selectedWordMeaning) {
                  setActiveViewSection('meaning');
                } else if (guesses.length > 0) {
                  setSelectedWordMeaning(guesses[guesses.length - 1].meaning);
                  setActiveViewSection('meaning');
                } else {
                  setSelectedWordMeaning(targetWordObj);
                  setActiveViewSection('meaning');
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border shadow-2xs ${
                activeViewSection === 'meaning'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-600/20'
                  : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
              }`}
              title="View Word Meaning & Vocabulary"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Word Meaning & Vocabulary</span>
            </button>

            {/* 2. Sound Button */}
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border shadow-2xs ${
                soundMuted
                  ? 'bg-slate-100 text-slate-500 border-slate-300'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
              title={soundMuted ? 'Unmute game sounds' : 'Mute game sounds'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
              <span>Sound {soundMuted ? 'OFF' : 'ON'}</span>
            </button>

            {/* 3. Reset Button */}
            <button
              onClick={() => startNewGame()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm"
              title="Reset board & pick a fresh new word challenge"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Game</span>
            </button>

            {/* 4. Word History Button */}
            <button
              onClick={() => setActiveViewSection(activeViewSection === 'history' ? 'all' : 'history')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border shadow-2xs ${
                activeViewSection === 'history'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-purple-600/20'
                  : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
              }`}
              title="View Guessed Word History & Mastered List"
            >
              <History className="w-4 h-4 text-purple-600" />
              <span>Word History ({guesses.length})</span>
            </button>

          </div>
        </div>

        {/* DIFFICULTY PRESETS & CUSTOMIZATION DRAWER */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Quick Difficulty Selection:
            </span>
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center space-x-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{showSettingsDrawer ? 'Hide Custom Options' : 'Custom Options (4-6 Letters, Guesses)'}</span>
            </button>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIFFICULTY_PRESETS.map((preset) => {
              const isSelected = difficultyPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectDifficulty(preset.id)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10 scale-[1.02]'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs">{preset.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {preset.wordLength} Letters • {preset.maxGuesses} Guesses
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Custom Settings Panel */}
          {showSettingsDrawer && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 animate-fadeIn border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Sliders className="w-4 h-4" />
                  <span>Custom Word Game Configuration</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Changes apply immediately with a fresh secret word
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Word Length Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">
                    Word Length (Letters):
                  </label>
                  <div className="flex gap-2">
                    {[4, 5, 6].map((len) => (
                      <button
                        key={len}
                        onClick={() => handleSelectDifficulty('custom', len, maxGuesses)}
                        className={`flex-1 py-2.5 rounded-xl font-black text-sm transition border ${
                          wordLength === len
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {len} Letters
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {wordLength === 4 && 'Short 4-letter vocabulary words (Easy & Fast)'}
                    {wordLength === 5 && 'Classic 5-letter vocabulary words (Standard Wordle)'}
                    {wordLength === 6 && 'Longer 6-letter vocabulary words (Advanced Challenge)'}
                  </p>
                </div>

                {/* 2. Max Guesses Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">
                    Allowed Guesses (Attempts):
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[3, 4, 5, 6, 7, 8].map((gCount) => (
                      <button
                        key={gCount}
                        onClick={() => handleSelectDifficulty('custom', wordLength, gCount)}
                        className={`px-3 py-2 rounded-xl font-bold text-xs transition border ${
                          maxGuesses === gCount
                            ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {gCount} Guesses
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Fewer guesses require precise deduction; more guesses allow room for exploration.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowSettingsDrawer(false)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Apply & Start Game
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Toggle Filters */}
        <div className="flex items-center gap-2 pt-1 border-t border-emerald-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">View Layout:</span>
          <button
            onClick={() => setActiveViewSection('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeViewSection === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Show All
          </button>
          <button
            onClick={() => setActiveViewSection('game')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeViewSection === 'game'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Game Board
          </button>
          <button
            onClick={() => setActiveViewSection('meaning')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeViewSection === 'meaning'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Meaning Card
          </button>
          <button
            onClick={() => setActiveViewSection('history')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeViewSection === 'history'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Word History
          </button>
        </div>

      </div>

      {/* Main Grid & Dictionary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* MAIN GAME COLUMN (boxes -> keyboard -> instructions) */}
        {(activeViewSection === 'all' || activeViewSection === 'game') && (
          <div className={`${activeViewSection === 'game' ? 'lg:col-span-12' : 'lg:col-span-7'} bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-6 shadow-sm`}>
            
            {/* Error / Alert Message */}
            {errorMessage && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-center text-xs font-bold text-amber-900 animate-bounce">
                <AlertCircle className="w-4 h-4 inline mr-1 text-amber-600" />
                {errorMessage}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 1. WORDLE GRID BOXES (Centered, dynamic rows & columns)       */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Step 1: Word Guess Grid ({wordLength} Letters • {maxGuesses} Attempts)
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 max-w-md mx-auto py-2">
                {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
                  const isSubmitted = rowIndex < guesses.length;
                  const isCurrent = rowIndex === guesses.length && gameStatus === 'playing';
                  const guessResult = guesses[rowIndex];

                  let rowChars = Array(wordLength).fill('');
                  if (isSubmitted) {
                    rowChars = guessResult.word.split('');
                  } else if (isCurrent) {
                    rowChars = currentGuess.padEnd(wordLength, ' ').split('');
                  }

                  return (
                    <div key={rowIndex} className="flex gap-1.5 sm:gap-2 justify-center">
                      {rowChars.map((char, colIndex) => {
                        let tileClass = "border-2 rounded-xl flex items-center justify-center font-black transition-all duration-300 ";

                        if (wordLength === 4) {
                          tileClass += "w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl ";
                        } else if (wordLength === 6) {
                          tileClass += "w-9 h-9 sm:w-11 sm:h-11 text-base sm:text-lg ";
                        } else {
                          tileClass += "w-11 h-11 sm:w-12 sm:h-12 text-lg ";
                        }

                        if (isSubmitted && guessResult) {
                          const status = guessResult.statuses[colIndex];
                          if (status === 'correct') {
                            tileClass += "bg-emerald-600 border-emerald-600 text-white shadow-xs";
                          } else if (status === 'present') {
                            tileClass += "bg-amber-400 border-amber-400 text-slate-950 font-black shadow-xs";
                          } else {
                            tileClass += "bg-slate-200 border-slate-300 text-slate-600 font-bold";
                          }
                        } else if (isCurrent && char.trim()) {
                          tileClass += "bg-white border-indigo-600 text-slate-900 scale-105 shadow-md shadow-indigo-500/10";
                        } else {
                          tileClass += "bg-slate-50 border-slate-200 text-slate-400";
                        }

                        return (
                          <div
                            key={colIndex}
                            onClick={() => {
                              if (isSubmitted && guessResult) {
                                setSelectedWordMeaning(guessResult.meaning);
                                setDeepDiveData(null);
                                setActiveViewSection('meaning');
                              }
                            }}
                            className={`${tileClass} ${isSubmitted ? 'cursor-pointer hover:opacity-90' : ''}`}
                            title={isSubmitted ? `Click to view meaning for ${guessResult.word}` : undefined}
                          >
                            {char.trim()}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GAME OVER WIN / LOSE BANNER */}
            {gameStatus !== 'playing' && (
              <div className={`rounded-2xl p-4 text-center space-y-3 border ${
                gameStatus === 'won'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                  : 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm'
              }`}>
                <div className="flex items-center justify-center space-x-2 font-bold text-lg">
                  {gameStatus === 'won' ? (
                    <>
                      <Trophy className="w-6 h-6 text-amber-500" />
                      <span className="text-emerald-900">Brilliant! You Guessed the Word! (+{25 + (wordLength - 4) * 5} XP)</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-6 h-6 text-rose-600" />
                      <span className="text-rose-900">Game Over! Secret Word: <strong className="text-slate-900 underline">{targetWord}</strong></span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedWordMeaning(targetWordObj);
                      setDeepDiveData(null);
                      setActiveViewSection('meaning');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>View Word Meaning & Vocabulary</span>
                  </button>

                  <button
                    onClick={startNewGame}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Play Next Challenge</span>
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 2. VIRTUAL ON-SCREEN KEYBOARD                                  */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Step 2: On-Screen Keyboard (Touch or Type)
                </span>
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                {keyboardRows.map((row, rIdx) => (
                  <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
                    {row.map((key) => {
                      if (key === 'ENTER') {
                        return (
                          <button
                            key={key}
                            onClick={submitGuess}
                            className="px-2.5 sm:px-3 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] sm:text-xs transition active:scale-95 shadow-sm"
                          >
                            ENTER
                          </button>
                        );
                      }
                      if (key === 'BACK') {
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              soundEngine.playDeleteClick();
                              setCurrentGuess(prev => prev.slice(0, -1));
                            }}
                            className="px-2.5 sm:px-3 py-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] sm:text-xs transition active:scale-95"
                          >
                            ⌫
                          </button>
                        );
                      }

                      const status = getKeyboardLetterStatus(key);
                      let keyClass = "w-8 h-10 sm:w-9 sm:h-11 rounded-lg font-bold text-xs transition active:scale-95 flex items-center justify-center ";

                      if (status === 'correct') {
                        keyClass += "bg-emerald-600 text-white shadow-xs";
                      } else if (status === 'present') {
                        keyClass += "bg-amber-400 text-slate-950 font-black shadow-xs";
                      } else if (status === 'absent') {
                        keyClass += "bg-slate-200 text-slate-400 line-through border border-slate-200 opacity-70";
                      } else {
                        keyClass += "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-2xs";
                      }

                      return (
                        <button
                          key={key}
                          onClick={() => {
                            if (currentGuess.length < wordLength && gameStatus === 'playing') {
                              soundEngine.playKeyClick();
                              setCurrentGuess(prev => (prev + key).toUpperCase());
                            }
                          }}
                          className={keyClass}
                        >
                          {key}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 3. GAME INSTRUCTIONS & COLOR LEGEND                            */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-3 pt-3 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                Step 3: Instructions & Color Legend
              </span>

              {/* Color Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-700">
                <span className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="w-3.5 h-3.5 rounded-sm bg-emerald-600 inline-block shadow-2xs" />
                  <span>Green = Correct Spot</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="w-3.5 h-3.5 rounded-sm bg-amber-400 inline-block shadow-2xs" />
                  <span>Yellow = Wrong Spot</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="w-3.5 h-3.5 rounded-sm bg-slate-200 inline-block border border-slate-300" />
                  <span>Gray = Not in Word</span>
                </span>
              </div>

              {/* Rules instructions */}
              <p className="text-[11px] text-slate-600 text-center leading-relaxed max-w-md mx-auto font-medium">
                Type any valid <strong>{wordLength}-letter</strong> English word and press <strong>ENTER</strong>. You have <strong>{maxGuesses} attempts</strong> to guess the secret word. Click any tile or word in history to read its full definition and listen to pronunciation!
              </p>
            </div>

          </div>
        )}

        {/* RIGHT COLUMN: GUESSED WORD MEANING & DICTIONARY EXPLORER */}
        {(activeViewSection === 'all' || activeViewSection === 'meaning' || activeViewSection === 'history') && (
          <div className={`${activeViewSection !== 'all' ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-5`}>
            
            {/* WORD MEANING & VOCABULARY CARD */}
            {(activeViewSection === 'all' || activeViewSection === 'meaning') && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Word Meaning & Vocabulary</span>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-200">
                    Instant Explainer
                  </span>
                </div>

                {selectedWordMeaning ? (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Word Title & Audio */}
                    <div className="flex items-start justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <h3 className="text-2xl font-black text-slate-900 font-heading tracking-wide">
                            {selectedWordMeaning.word}
                          </h3>
                          <span className="text-xs text-indigo-600 font-mono font-medium">
                            {selectedWordMeaning.phonetic}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-emerald-700 italic capitalize mt-0.5">
                          {selectedWordMeaning.partOfSpeech}
                        </p>
                      </div>

                      <button
                        onClick={() => speakText(selectedWordMeaning.word)}
                        className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 transition shadow-2xs"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* English Definition */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        English Definition:
                      </span>
                      <p className="text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                        {selectedWordMeaning.definition}
                      </p>
                    </div>

                    {/* Hindi Translation */}
                    {selectedWordMeaning.hindiMeaning && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                          Hindi Meaning (हिंदी अर्थ):
                        </span>
                        <p className="text-sm font-bold text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                          {selectedWordMeaning.hindiMeaning}
                        </p>
                      </div>
                    )}

                    {/* Example Sentence */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Example Usage in Sentence:
                      </span>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 italic flex items-start space-x-2">
                        <span className="text-indigo-600 font-bold not-italic">“</span>
                        <p className="flex-1 leading-relaxed">{selectedWordMeaning.exampleSentence}</p>
                        <button
                          onClick={() => speakText(selectedWordMeaning.exampleSentence)}
                          className="p-1 text-slate-500 hover:text-indigo-600 transition"
                          title="Listen to sentence"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* AI Gemini Deep Dive Trigger */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => fetchDeepDive(selectedWordMeaning.word)}
                        disabled={loadingDeepDive}
                        className="w-full bg-slate-50 hover:bg-slate-100 border border-indigo-200 text-indigo-700 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-2xs"
                      >
                        {loadingDeepDive ? (
                          <span className="animate-pulse">Analyzing with Gemini AI...</span>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span>Get Gemini AI Deep Dive (Collocations & Synonyms)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Deep Dive Modal / Expanded Content */}
                    {deepDiveData && deepDiveData.word.toUpperCase() === selectedWordMeaning.word.toUpperCase() && (
                      <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 space-y-3 animate-fadeIn text-xs">
                        <h4 className="font-extrabold text-indigo-900 flex items-center space-x-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Gemini AI Vocabulary Insights for "{deepDiveData.word}"</span>
                        </h4>

                        {deepDiveData.synonyms && deepDiveData.synonyms.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-700">Synonyms: </span>
                            <span className="text-emerald-800 font-medium">{deepDiveData.synonyms.join(', ')}</span>
                          </div>
                        )}

                        {deepDiveData.commonCollocations && deepDiveData.commonCollocations.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-700">Common Word Pairings: </span>
                            <span className="text-amber-900 italic">{deepDiveData.commonCollocations.join(', ')}</span>
                          </div>
                        )}

                        {deepDiveData.etymologyReason && (
                          <div className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-indigo-100">
                            <span className="font-bold text-indigo-800 block mb-1">Origin & Context:</span>
                            {deepDiveData.etymologyReason}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="py-10 text-center text-slate-400 space-y-3">
                    <BookOpen className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
                    <p className="text-xs font-medium max-w-xs mx-auto text-slate-500">
                      Type or click any word guess on the board to view its detailed definition, pronunciation, and Hindi meaning here!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* GUESSED WORDS HISTORY LIST */}
            {(activeViewSection === 'all' || activeViewSection === 'history') && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <History className="w-4 h-4 text-purple-600" />
                    <span>Guessed Words History ({guesses.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Click word to view meaning</span>
                </div>

                {guesses.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                    {guesses.map((g, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedWordMeaning(g.meaning);
                          setDeepDiveData(null);
                          setActiveViewSection('meaning');
                        }}
                        className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                          selectedWordMeaning?.word === g.meaning.word
                            ? 'bg-indigo-50 border-indigo-300 text-slate-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-black font-heading text-sm text-slate-900 tracking-wider">
                              {g.word}
                            </span>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {g.meaning.definition}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(g.word);
                            }}
                            className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <Eye className="w-4 h-4 text-indigo-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No word guesses made yet in this round. Start guessing to build your vocabulary list!
                  </p>
                )}

                {/* Mastered Words Count */}
                {completedWords.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Total Words Mastered:</span>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {completedWords.length} Words
                    </span>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
