import React, { useState } from 'react';
import { DayLesson } from '../types';
import { useLearning } from '../src/context/LearningContext';
import { DAYS_CURRICULUM } from '../data/courseData';
import { Volume2, ArrowLeft, CheckCircle2, XCircle, Sparkles, HelpCircle, Award, Play, RotateCcw, Heart, RefreshCw, BookOpen, Zap, ArrowRight, Languages } from 'lucide-react';
import { playClickSound, playCorrectSound, playIncorrectSound, playCompletionChime } from '../src/utils/audio';

interface LessonViewProps {
  day: DayLesson;
  onBack: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ day, onBack }) => {
  const { completeLesson, deductHeart, progress, language, toggleLanguage } = useLearning();

  const previousLesson = DAYS_CURRICULUM.find(l => l.dayNumber === day.dayNumber - 1);

  const [step, setStep] = useState<'revision' | 'theory' | 'quiz' | 'minigame' | 'completed'>(
    day.dayNumber > 1 && previousLesson ? 'revision' : 'theory'
  );
  
  // Revision warmup state
  const [revisionSelectedOpt, setRevisionSelectedOpt] = useState<number | null>(null);
  const [revisionSubmitted, setRevisionSubmitted] = useState<boolean>(false);

  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);

  // Mini-game state for Sentence Builder
  const [userSentenceWords, setUserSentenceWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(
    day.miniGame?.sentenceBuilder?.[0]?.wordPool ? [...day.miniGame.sentenceBuilder[0].wordPool].sort(() => Math.random() - 0.5) : []
  );
  const [gameSuccess, setGameSuccess] = useState<boolean>(false);

  // Audio Speech synthesis
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuizOptionSelect = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    playClickSound();
    setSelectedOption(optionIdx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    const currentQ = day.quiz[currentQuizIndex];
    if (selectedOption === currentQ.correctAnswerIndex) {
      setScoreCount(prev => prev + 1);
      playCorrectSound();
      speakText("Correct! " + currentQ.options[selectedOption]);
    } else {
      deductHeart();
      playIncorrectSound();
      speakText("Not quite.");
    }
  };

  const handleNextQuizQuestion = () => {
    playClickSound();
    if (currentQuizIndex < day.quiz.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed! Go to minigame if present, else finish
      if (day.miniGame) {
        setStep('minigame');
      } else {
        finishLesson();
      }
    }
  };

  const handleWordBlockClick = (word: string, indexInPool: number) => {
    playClickSound();
    setUserSentenceWords(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter((_, i) => i !== indexInPool));
  };

  const handleRemoveWordFromUserSentence = (word: string, indexInUser: number) => {
    playClickSound();
    setUserSentenceWords(prev => prev.filter((_, i) => i !== indexInUser));
    setAvailableWords(prev => [...prev, word]);
  };

  const checkSentenceBuilder = () => {
    const target = day.miniGame?.sentenceBuilder?.[0]?.targetSentence.trim().replace(/\.$/, '');
    const userBuilt = userSentenceWords.join(' ').trim().replace(/\.$/, '');

    if (target?.toLowerCase() === userBuilt.toLowerCase()) {
      setGameSuccess(true);
      playCorrectSound();
      speakText(userBuilt);
    } else {
      playIncorrectSound();
      alert("Try re-ordering the words according to the grammar rules!");
    }
  };

  const finishLesson = () => {
    playCompletionChime();
    const scorePercent = Math.round((scoreCount / (day.quiz.length || 1)) * 100);
    completeLesson(day.id, scorePercent, day.xpReward);
    setStep('completed');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Bar with Progress */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition text-xs font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Lesson</span>
        </button>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Hindi / English Toggle Button */}
          <button
            onClick={toggleLanguage}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              language === 'hi'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30 hover:bg-indigo-900/60'
            }`}
            title="Toggle Hindi Explanation / हिंदी अनुवाद"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? '🇮🇳 हिंदी (Hindi)' : '🇬🇧 English'}</span>
          </button>

          <div className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
            Day {day.dayNumber} • {day.title}
          </div>

          <div className="flex items-center space-x-1 text-rose-400 font-bold text-xs bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{progress.hearts}</span>
          </div>
        </div>
      </div>

      {/* STEP 0: QUICK PREVIOUS LESSON REVISION & WARMUP */}
      {step === 'revision' && previousLesson && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>Quick Daily Revision • Day {previousLesson.dayNumber}</span>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  setStep('theory');
                }}
                className="text-xs text-slate-400 hover:text-white underline font-medium"
              >
                Skip Warmup
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black font-heading text-white flex items-center space-x-2">
                <span>Warmup: {previousLesson.title}</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {previousLesson.theory.summary}
              </p>
            </div>
          </div>

          {/* Key Takeaways Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Key Grammar Rules to Remember:</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {previousLesson.theory.rules.slice(0, 2).map((r, i) => (
                <div key={i} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">{r.rule}</p>
                      <p className="text-xs text-slate-300 leading-snug">{r.why}</p>
                      <p className="text-[11px] text-emerald-400 font-medium italic">
                        Example: "{r.example}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Refresher Question */}
          {previousLesson.quiz[0] && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>60-Second Memory Check:</span>
              </div>

              <p className="text-sm font-bold text-white">
                {previousLesson.quiz[0].question}
              </p>

              <div className="space-y-2">
                {previousLesson.quiz[0].options.map((opt, optIdx) => {
                  const isSelected = revisionSelectedOpt === optIdx;
                  const isCorrect = optIdx === previousLesson.quiz[0].correctAnswerIndex;

                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700";
                  if (revisionSubmitted) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-950/90 border-rose-500 text-rose-300";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-indigo-900 border-indigo-500 text-white font-bold";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        if (revisionSubmitted) return;
                        playClickSound();
                        setRevisionSelectedOpt(optIdx);
                        setRevisionSubmitted(true);
                        if (isCorrect) playCorrectSound();
                        else playIncorrectSound();
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {revisionSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {revisionSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {revisionSubmitted && (
                <div className="bg-indigo-950/80 p-3.5 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 space-y-1 animate-fadeIn">
                  <span className="font-bold text-amber-300 block text-[10px] uppercase tracking-wider">
                    Rule Refresher:
                  </span>
                  <p>{previousLesson.quiz[0].explanationWhy}</p>
                </div>
              )}
            </div>
          )}

          {/* Transition Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                playClickSound();
                setStep('theory');
              }}
              className="w-full bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center space-x-2 text-sm"
            >
              <span>I'm Warmed Up! Start Day {day.dayNumber} Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 1: THEORY & LINGUISTIC "WHY" EXPLANATION */}
      {step === 'theory' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 rounded-2xl p-6 border border-indigo-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Core Linguistic Rule & Context</span>
            </div>
            <h2 className="text-2xl font-black font-heading text-white">{day.title}</h2>
            <p className="text-slate-200 text-sm leading-relaxed">{day.theory.summary}</p>
          </div>

          {/* Grammar Rules Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Why These Rules Exist in English</span>
            </h3>

            {day.theory.rules.map((r, i) => (
              <div key={i} className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <p className="font-bold text-slate-100 text-sm">{r.rule}</p>
                    
                    {/* Explicit WHY Box */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 space-y-1">
                      <span className="font-bold text-amber-300 block uppercase text-[10px] tracking-wider">
                        💡 Why Particular Words/Forms are used:
                      </span>
                      <p>{r.why}</p>
                    </div>

                    {/* Example with Audio Pronunciation */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-emerald-400 font-bold">✅ Correct: </span>
                        <span className="text-slate-200 italic">"{r.example}"</span>
                      </div>
                      <button
                        onClick={() => speakText(r.example)}
                        className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition"
                        title="Listen to native pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {r.wrongExample && (
                      <p className="text-xs text-rose-400 italic">
                        ❌ Avoid: "{r.wrongExample}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Word Breakdown List */}
          {day.theory.wordExplanations && day.theory.wordExplanations.length > 0 && (
            <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-indigo-300 uppercase tracking-wider">
                Word-by-Word Purpose Analysis
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {day.theory.wordExplanations.map((w, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 text-sm">{w.word}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{w.role}</span>
                    </div>
                    <p className="text-xs text-slate-300">{w.whyUsed}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep('quiz')}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all text-sm"
            >
              <span>Take Practice Quiz</span>
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: INTERACTIVE QUIZ WITH "WHY" EXPLANATIONS */}
      {step === 'quiz' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Question {currentQuizIndex + 1} of {day.quiz.length}</span>
            <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all"
                style={{ width: `${((currentQuizIndex + 1) / day.quiz.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                {day.quiz[currentQuizIndex].grammaticalRole}
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">
                {day.quiz[currentQuizIndex].question}
              </h3>
              {day.quiz[currentQuizIndex].sentenceContext && (
                <p className="text-sm font-mono text-indigo-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  "{day.quiz[currentQuizIndex].sentenceContext}"
                </p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {day.quiz[currentQuizIndex].options.map((option, optIdx) => {
                let btnStyle = "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200";
                if (selectedOption === optIdx) {
                  btnStyle = "bg-indigo-600/20 border-indigo-500 text-indigo-200";
                }
                if (isAnswerSubmitted) {
                  if (optIdx === day.quiz[currentQuizIndex].correctAnswerIndex) {
                    btnStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold";
                  } else if (selectedOption === optIdx) {
                    btnStyle = "bg-rose-600/20 border-rose-500 text-rose-300 font-bold";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleQuizOptionSelect(optIdx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && optIdx === day.quiz[currentQuizIndex].correctAnswerIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && selectedOption === optIdx && optIdx !== day.quiz[currentQuizIndex].correctAnswerIndex && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {isAnswerSubmitted && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 text-xs text-indigo-200 space-y-1.5 animate-fadeIn">
                <div className="flex items-center space-x-2 font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Linguistic "Why" Reason:</span>
                </div>
                <p className="leading-relaxed text-sm">{day.quiz[currentQuizIndex].explanationWhy}</p>
              </div>
            )}

            {/* Submit / Next Button */}
            <div className="pt-4 flex justify-end">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={selectedOption === null}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuizQuestion}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition flex items-center space-x-2"
                >
                  <span>{currentQuizIndex < day.quiz.length - 1 ? "Next Question" : "Continue to Game"}</span>
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* STEP 3: MINI GAME */}
      {step === 'minigame' && day.miniGame && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                🎮 {day.miniGame.title}
              </span>
              <p className="text-xs text-slate-400">{day.miniGame.instructions}</p>
            </div>

            {/* Sentence Builder Game */}
            {day.miniGame.type === 'sentence_builder' && (
              <div className="space-y-6 pt-2">
                
                {/* User Built Sentence Slot */}
                <div className="min-h-[70px] bg-slate-950 p-4 rounded-2xl border-2 border-dashed border-indigo-500/40 flex flex-wrap gap-2 items-center">
                  {userSentenceWords.length === 0 ? (
                    <span className="text-slate-500 text-xs italic">Tap words below in correct order...</span>
                  ) : (
                    userSentenceWords.map((word, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRemoveWordFromUserSentence(word, idx)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow transition scale-95 hover:scale-100"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Word Pool */}
                <div className="flex flex-wrap gap-2">
                  {availableWords.map((word, poolIdx) => (
                    <button
                      key={poolIdx}
                      onClick={() => handleWordBlockClick(word, poolIdx)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3.5 py-2 rounded-xl text-xs transition"
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {/* Check Button or Success Box */}
                {!gameSuccess ? (
                  <button
                    onClick={checkSentenceBuilder}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-sm transition"
                  >
                    Check Sentence Order
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 space-y-2 animate-fadeIn">
                    <div className="flex items-center space-x-2 font-bold text-emerald-300">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Perfect Syntax!</span>
                    </div>
                    <p className="text-xs">{day.miniGame.sentenceBuilder?.[0]?.grammarBreakdown}</p>
                    <button
                      onClick={finishLesson}
                      className="mt-2 bg-emerald-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs hover:bg-emerald-400 transition"
                    >
                      Complete Lesson 🎉
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* Fallback for other game types */}
            {day.miniGame.type !== 'sentence_builder' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">Read through these key vocabulary pairs and master their linguistic usage!</p>
                {day.miniGame.wordPairs?.map((pair, pIdx) => (
                  <div key={pIdx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 text-sm">{pair.word}</span>
                    <p className="text-xs text-slate-300">{pair.definitionOrSynonym}</p>
                    <p className="text-[11px] text-indigo-300 italic">{pair.whyItMatters}</p>
                  </div>
                ))}
                <button
                  onClick={finishLesson}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl text-sm transition"
                >
                  Mark Game Completed 🎉
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* STEP 4: COMPLETED LESSON REWARD SCREEN */}
      {step === 'completed' && (
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Award className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black font-heading text-white">Lesson Completed!</h2>
            <p className="text-slate-300 text-sm">
              You mastered <span className="text-indigo-300 font-bold">Day {day.dayNumber}: {day.title}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-bold block">XP Gained</span>
              <span className="text-2xl font-black text-indigo-400">+{day.xpReward} XP</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-bold block">Gems Earned</span>
              <span className="text-2xl font-black text-cyan-400">+15 💎</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-2xl shadow-lg transition"
          >
            Return to Course Roadmap
          </button>
        </div>
      )}

    </div>
  );
};
