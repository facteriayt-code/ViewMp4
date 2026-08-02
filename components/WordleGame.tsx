import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, CheckCircle2, RotateCcw, Volume2, ArrowRight,
  HelpCircle, BookOpen, Search, Trophy, Zap, AlertCircle, Eye, Info
} from 'lucide-react';
import { WORDLE_DICTIONARY, getWordMeaning, WordleWord } from '../src/data/wordleDictionary';
import { useLearning } from '../src/context/LearningContext';

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

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

export const WordleGame: React.FC = () => {
  const { addXpAndGems, triggerConfetti, language } = useLearning();

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

  // Target Secret Word State (Picked from unplayed dictionary words)
  const [targetWordObj, setTargetWordObj] = useState<WordleWord>(() => {
    const savedCompleted: string[] = (() => {
      try { return JSON.parse(localStorage.getItem('lingo_completed_wordle_words') || '[]'); } catch (e) { return []; }
    })();
    const unplayed = WORDLE_DICTIONARY.filter(w => !savedCompleted.includes(w.word.toUpperCase()));
    const pool = unplayed.length > 0 ? unplayed : WORDLE_DICTIONARY;
    return pool[Math.floor(Math.random() * pool.length)];
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

  // Active word meaning being viewed (defaults to latest guess, or target word on game over)
  const [selectedWordMeaning, setSelectedWordMeaning] = useState<WordleWord | null>(null);

  // Deep dive state from API
  const [deepDiveData, setDeepDiveData] = useState<DeepDiveData | null>(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState<boolean>(false);

  // Reset Game for new word (Guarantees picking an unplayed word)
  const startNewGame = () => {
    const currentCompleted: string[] = (() => {
      try { return JSON.parse(localStorage.getItem('lingo_completed_wordle_words') || '[]'); } catch (e) { return []; }
    })();

    const unplayedPool = WORDLE_DICTIONARY.filter(
      w => !currentCompleted.includes(w.word.toUpperCase()) && w.word.toUpperCase() !== targetWord
    );

    if (unplayedPool.length === 0) {
      // If all dictionary words have been completed, cycle or reset seamlessly
      const fallbackPool = WORDLE_DICTIONARY.filter(w => w.word.toUpperCase() !== targetWord);
      const nextObj = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
      setTargetWordObj(nextObj);
    } else {
      const nextObj = unplayedPool[Math.floor(Math.random() * unplayedPool.length)];
      setTargetWordObj(nextObj);
    }

    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setErrorMessage(null);
    setSelectedWordMeaning(null);
    setDeepDiveData(null);
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

  // Evaluate a 5-letter guess
  const evaluateGuess = (guessWord: string): LetterStatus[] => {
    const statuses: LetterStatus[] = Array(5).fill('absent');
    const targetArr = targetWord.split('');
    const guessArr = guessWord.split('');
    const taken = Array(5).fill(false);

    // First pass: Green (correct position)
    for (let i = 0; i < 5; i++) {
      if (guessArr[i] === targetArr[i]) {
        statuses[i] = 'correct';
        taken[i] = true;
      }
    }

    // Second pass: Yellow (present in wrong position)
    for (let i = 0; i < 5; i++) {
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

    if (currentGuess.length !== 5) {
      setErrorMessage("Please enter a 5-letter word!");
      setTimeout(() => setErrorMessage(null), 2500);
      return;
    }

    setErrorMessage(null);
    const guessUpper = currentGuess.toUpperCase();
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
      setGameStatus('won');
      setSelectedWordMeaning(targetWordObj);
      markWordAsCompleted(targetWord);
      triggerConfetti();
      addXpAndGems(25, 10);
    } else if (updatedGuesses.length >= 6) {
      setGameStatus('lost');
      setSelectedWordMeaning(targetWordObj);
      markWordAsCompleted(targetWord);
    }
  }, [currentGuess, gameStatus, guesses, targetWord, targetWordObj, triggerConfetti, addXpAndGems, markWordAsCompleted]);

  // Physical keyboard key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentGuess.length < 5 && gameStatus === 'playing') {
          setCurrentGuess(prev => (prev + e.key).toUpperCase());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, submitGuess]);

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

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-indigo-950/60 rounded-2xl p-5 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Vocabulary Wordle • Unique Words Guarantee</span>
            <span className="ml-2 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/30">
              Mastered: {completedWords.length} / {WORDLE_DICTIONARY.length}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Guess the 5-Letter English Word
          </h2>
          <p className="text-xs text-slate-300">
            Guessed words never repeat! Every guess reveals definitions, phonetics, and Hindi meaning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {completedWords.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Reset your completed Wordle words list to replay them all?")) {
                  setCompletedWords([]);
                  localStorage.removeItem('lingo_completed_wordle_words');
                }
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2.5 rounded-xl text-xs transition border border-slate-700"
              title="Reset completed words list"
            >
              Reset List
            </button>
          )}

          <button
            onClick={startNewGame}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-emerald-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Word Challenge</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Dictionary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: WORDLE BOARD & KEYBOARD */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-6 shadow-xl">
          
          {/* Error / Alert Message */}
          {errorMessage && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center text-xs font-bold text-amber-300 animate-bounce">
              <AlertCircle className="w-4 h-4 inline mr-1 text-amber-400" />
              {errorMessage}
            </div>
          )}

          {/* 6 Rows Grid */}
          <div className="flex flex-col items-center gap-2 max-w-xs mx-auto">
            {Array.from({ length: 6 }).map((_, rowIndex) => {
              const isSubmitted = rowIndex < guesses.length;
              const isCurrent = rowIndex === guesses.length && gameStatus === 'playing';
              const guessResult = guesses[rowIndex];

              let rowChars = Array(5).fill('');
              if (isSubmitted) {
                rowChars = guessResult.word.split('');
              } else if (isCurrent) {
                rowChars = currentGuess.padEnd(5, ' ').split('');
              }

              return (
                <div key={rowIndex} className="flex gap-2 justify-center">
                  {rowChars.map((char, colIndex) => {
                    let tileClass = "w-11 h-11 sm:w-12 sm:h-12 border-2 rounded-xl flex items-center justify-center font-black text-lg transition-all duration-300 ";

                    if (isSubmitted && guessResult) {
                      const status = guessResult.statuses[colIndex];
                      if (status === 'correct') {
                        tileClass += "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30";
                      } else if (status === 'present') {
                        tileClass += "bg-amber-500 border-amber-400 text-slate-950 shadow-md shadow-amber-500/30";
                      } else {
                        tileClass += "bg-slate-800 border-slate-700 text-slate-400";
                      }
                    } else if (isCurrent && char.trim()) {
                      tileClass += "bg-slate-950 border-indigo-500 text-white scale-105 shadow-md shadow-indigo-500/20";
                    } else {
                      tileClass += "bg-slate-950/70 border-slate-800 text-slate-600";
                    }

                    return (
                      <div
                        key={colIndex}
                        onClick={() => {
                          if (isSubmitted && guessResult) {
                            setSelectedWordMeaning(guessResult.meaning);
                            setDeepDiveData(null);
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

          {/* GAME OVER WIN / LOSE BANNER */}
          {gameStatus !== 'playing' && (
            <div className={`rounded-2xl p-4 text-center space-y-3 border ${
              gameStatus === 'won'
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center justify-center space-x-2 font-bold text-lg">
                {gameStatus === 'won' ? (
                  <>
                    <Trophy className="w-6 h-6 text-amber-400" />
                    <span>Brilliant! You Guessed the Word! (+25 XP)</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-6 h-6 text-rose-400" />
                    <span>Game Over! The Secret Word was: <strong className="text-white underline">{targetWord}</strong></span>
                  </>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedWordMeaning(targetWordObj);
                    setDeepDiveData(null);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Secret Word Meaning</span>
                </button>

                <button
                  onClick={startNewGame}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Next Word</span>
                </button>
              </div>
            </div>
          )}

          {/* VIRTUAL KEYBOARD */}
          <div className="space-y-1.5 max-w-md mx-auto pt-2">
            {keyboardRows.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
                {row.map((key) => {
                  if (key === 'ENTER') {
                    return (
                      <button
                        key={key}
                        onClick={submitGuess}
                        className="px-2.5 sm:px-3 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] sm:text-xs transition active:scale-95 shadow-md"
                      >
                        ENTER
                      </button>
                    );
                  }
                  if (key === 'BACK') {
                    return (
                      <button
                        key={key}
                        onClick={() => setCurrentGuess(prev => prev.slice(0, -1))}
                        className="px-2.5 sm:px-3 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] sm:text-xs transition active:scale-95"
                      >
                        ⌫
                      </button>
                    );
                  }

                  const status = getKeyboardLetterStatus(key);
                  let keyClass = "w-8 h-10 sm:w-9 sm:h-11 rounded-lg font-bold text-xs transition active:scale-95 flex items-center justify-center ";

                  if (status === 'correct') {
                    keyClass += "bg-emerald-600 text-white shadow-md shadow-emerald-600/30";
                  } else if (status === 'present') {
                    keyClass += "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30";
                  } else if (status === 'absent') {
                    keyClass += "bg-slate-800 text-slate-600 line-through opacity-60";
                  } else {
                    keyClass += "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50";
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        if (currentGuess.length < 5 && gameStatus === 'playing') {
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

          {/* Color Legend */}
          <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
              <span>Correct Spot</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
              <span>Wrong Spot</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-sm bg-slate-800 inline-block" />
              <span>Not in Word</span>
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: GUESSED WORD MEANING & DICTIONARY EXPLORER */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* MEANING CARD FOR SELECTED / LAST GUESSED WORD */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-indigo-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Word Meaning & Vocabulary</span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-1 rounded-full border border-indigo-500/30">
                Instant Explainer
              </span>
            </div>

            {selectedWordMeaning ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Word Title & Audio */}
                <div className="flex items-start justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <h3 className="text-2xl font-black text-white font-heading tracking-wide">
                        {selectedWordMeaning.word}
                      </h3>
                      <span className="text-xs text-indigo-400 font-mono font-medium">
                        {selectedWordMeaning.phonetic}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-emerald-400 italic capitalize mt-0.5">
                      {selectedWordMeaning.partOfSpeech}
                    </p>
                  </div>

                  <button
                    onClick={() => speakText(selectedWordMeaning.word)}
                    className="p-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl border border-indigo-500/30 transition shadow-md"
                    title="Listen to pronunciation"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* English Definition */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    English Definition:
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {selectedWordMeaning.definition}
                  </p>
                </div>

                {/* Hindi Translation */}
                {selectedWordMeaning.hindiMeaning && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Hindi Meaning (हिंदी अर्थ):
                    </span>
                    <p className="text-sm font-bold text-amber-200 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                      {selectedWordMeaning.hindiMeaning}
                    </p>
                  </div>
                )}

                {/* Example Sentence */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Example Usage in Sentence:
                  </span>
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 italic flex items-start space-x-2">
                    <span className="text-indigo-400 font-bold not-italic">“</span>
                    <p className="flex-1 leading-relaxed">{selectedWordMeaning.exampleSentence}</p>
                    <button
                      onClick={() => speakText(selectedWordMeaning.exampleSentence)}
                      className="p-1 text-slate-400 hover:text-indigo-300 transition"
                      title="Listen to sentence"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* AI Gemini Deep Dive Trigger */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => fetchDeepDive(selectedWordMeaning.word)}
                    disabled={loadingDeepDive}
                    className="w-full bg-slate-950 hover:bg-slate-800 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
                  >
                    {loadingDeepDive ? (
                      <span className="animate-pulse">Analyzing with Gemini AI...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>Get Gemini AI Deep Dive (Collocations & Synonyms)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Deep Dive Modal / Expanded Content */}
                {deepDiveData && deepDiveData.word.toUpperCase() === selectedWordMeaning.word.toUpperCase() && (
                  <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/40 space-y-3 animate-fadeIn text-xs">
                    <h4 className="font-extrabold text-amber-300 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Gemini AI Vocabulary Insights for "{deepDiveData.word}"</span>
                    </h4>

                    {deepDiveData.synonyms && deepDiveData.synonyms.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-300">Synonyms: </span>
                        <span className="text-emerald-300 font-medium">{deepDiveData.synonyms.join(', ')}</span>
                      </div>
                    )}

                    {deepDiveData.commonCollocations && deepDiveData.commonCollocations.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-300">Common Word Pairings: </span>
                        <span className="text-amber-200 italic">{deepDiveData.commonCollocations.join(', ')}</span>
                      </div>
                    )}

                    {deepDiveData.etymologyReason && (
                      <div className="text-slate-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-indigo-300 block mb-1">Origin & Context:</span>
                        {deepDiveData.etymologyReason}
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <BookOpen className="w-12 h-12 mx-auto text-slate-700 animate-pulse" />
                <p className="text-xs font-medium max-w-xs mx-auto">
                  Type or click any word guess on the board to view its detailed definition, pronunciation, and Hindi meaning here!
                </p>
              </div>
            )}
          </div>

          {/* GUESSED WORDS HISTORY LIST */}
          {guesses.length > 0 && (
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3 shadow-xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Guessed Words History ({guesses.length})</span>
                <span className="text-[10px] text-slate-500">Click word to view meaning</span>
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {guesses.map((g, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedWordMeaning(g.meaning);
                      setDeepDiveData(null);
                    }}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      selectedWordMeaning?.word === g.meaning.word
                        ? 'bg-indigo-950/60 border-indigo-500/50 text-white shadow-md'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-extrabold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-black font-heading text-sm text-white tracking-wider">
                          {g.word}
                        </span>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
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
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <Eye className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
