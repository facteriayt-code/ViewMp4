import React, { useState } from 'react';
import { MonthExam, MonthExamQuestion } from '../types';
import { useLearning } from '../src/context/LearningContext';
import { Award, CheckCircle2, XCircle, Trophy, Sparkles, ArrowRight, RotateCcw, Shield, HelpCircle, Download, BookOpen, Clock, Star } from 'lucide-react';
import { playClickSound, playCorrectSound, playIncorrectSound, playCompletionChime } from '../src/utils/audio';

interface MonthTestViewProps {
  exam: MonthExam;
  onClose: () => void;
}

export const MonthTestView: React.FC<MonthTestViewProps> = ({ exam, onClose }) => {
  const { progress, completeMonthExam, triggerConfetti } = useLearning();

  const [gameState, setGameState] = useState<'intro' | 'active' | 'review' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showInstantWhy, setShowInstantWhy] = useState<boolean>(false);
  const [finalScorePercent, setFinalScorePercent] = useState<number>(0);
  const [passed, setPassed] = useState<boolean>(false);

  const currentQ: MonthExamQuestion = exam.questions[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // already answered
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
    setShowInstantWhy(true);

    if (optIdx === currentQ.correctAnswerIndex) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  };

  const handleNext = () => {
    playClickSound();
    setShowInstantWhy(false);
    if (currentIdx < exam.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      exam.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswerIndex) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / exam.questions.length) * 100);
      const isPassed = score >= exam.passingScorePercent;
      
      setFinalScorePercent(score);
      setPassed(isPassed);
      setGameState('result');

      if (isPassed) {
        playCompletionChime();
      } else {
        playIncorrectSound();
      }

      // Update global context state
      completeMonthExam(exam.monthNumber, score, exam.xpReward, exam.gemReward, exam.badgeId);
    }
  };

  const handleResetExam = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowInstantWhy(false);
    setGameState('active');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      
      {/* Top Navigation / Close Bar */}
      <div className="flex items-center justify-between bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Month {exam.monthNumber} Final Mastery Exam
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Pass Threshold: {exam.passingScorePercent}%
          </span>
        </div>

        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
        >
          Exit Exam
        </button>
      </div>

      {/* 1. INTRO SCREEN */}
      {gameState === 'intro' && (
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl space-y-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center shadow-xl shadow-amber-500/10 animate-bounce">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-4xl font-black font-heading text-white">
              {exam.title}
            </h1>
            <p className="text-amber-300 text-sm font-semibold">
              {exam.subtitle}
            </p>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {exam.description}
            </p>
          </div>

          {/* Exam Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <BookOpen className="w-5 h-5 text-indigo-400 mx-auto" />
              <span className="text-xs font-bold text-slate-400 block">Questions</span>
              <span className="text-sm font-black text-white">{exam.questions.length} Items</span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <Award className="w-5 h-5 text-amber-400 mx-auto" />
              <span className="text-xs font-bold text-slate-400 block">Required Pass</span>
              <span className="text-sm font-black text-white">{exam.passingScorePercent}%</span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <Sparkles className="w-5 h-5 text-purple-400 mx-auto" />
              <span className="text-xs font-bold text-slate-400 block">XP Reward</span>
              <span className="text-sm font-black text-white">+{exam.xpReward} XP</span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <Shield className="w-5 h-5 text-emerald-400 mx-auto" />
              <span className="text-xs font-bold text-slate-400 block">Certificate</span>
              <span className="text-sm font-black text-white">Earned on Pass</span>
            </div>
          </div>

          <button
            onClick={() => setGameState('active')}
            className="w-full max-w-md mx-auto bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-amber-500/20 text-base transition flex items-center justify-center space-x-2"
          >
            <span>Begin Month {exam.monthNumber} Mastery Exam</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 2. ACTIVE EXAM SCREEN */}
      {gameState === 'active' && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          
          {/* Progress Bar & Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="text-amber-400 uppercase tracking-wider">
                Question {currentIdx + 1} of {exam.questions.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Topic: {currentQ.topicTag}
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / exam.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Exam Question
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>
            {currentQ.sentenceContext && (
              <p className="text-xs text-slate-300 font-mono bg-slate-900 p-3 rounded-xl border border-slate-800">
                "{currentQ.sentenceContext}"
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const userChosen = selectedAnswers[currentIdx];
              const isSelected = userChosen === optIdx;
              const isCorrect = optIdx === currentQ.correctAnswerIndex;

              let style = "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700";
              if (userChosen !== undefined) {
                if (isSelected) {
                  style = isCorrect
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold"
                    : "bg-rose-950/80 border-rose-500 text-rose-200 font-bold";
                } else if (isCorrect) {
                  style = "bg-emerald-950/50 border-emerald-500/50 text-emerald-300";
                } else {
                  style = "bg-slate-950/50 border-slate-900 text-slate-500 opacity-50";
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={userChosen !== undefined}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm flex items-center justify-between ${style}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>

                  {userChosen !== undefined && isSelected && (
                    isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Linguistic Reason Breakdown */}
          {showInstantWhy && (
            <div className="bg-indigo-950/80 p-4 rounded-2xl border border-indigo-500/30 text-xs text-indigo-200 space-y-1 animate-fadeIn">
              <span className="font-bold text-amber-300 uppercase tracking-wider block text-[10px]">
                💡 Linguistic Reason & Explanation:
              </span>
              <p className="leading-relaxed">{currentQ.explanationWhy}</p>
            </div>
          )}

          {/* Action Footer */}
          {selectedAnswers[currentIdx] !== undefined && (
            <button
              onClick={handleNext}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
            >
              <span>{currentIdx < exam.questions.length - 1 ? 'Next Question' : 'Complete Month Exam'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

        </div>
      )}

      {/* 3. RESULT & DIPLOMA CERTIFICATE SCREEN */}
      {gameState === 'result' && (
        <div className="space-y-6">
          
          {passed ? (
            /* PASSED: OFFICIAL CERTIFICATE CARD */
            <div className="bg-gradient-to-b from-amber-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 border-2 border-amber-500 shadow-2xl space-y-8 text-center relative overflow-hidden animate-fadeIn">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>OFFICIAL CERTIFICATE OF MASTERY</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight pt-2">
                  LINGOSPRINT CERTIFICATE
                </h2>
                <p className="text-amber-200 text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Month {exam.monthNumber} English Language Competency
                </p>
              </div>

              {/* Certificate Diploma Body */}
              <div className="bg-slate-950/90 p-6 sm:p-8 rounded-2xl border border-amber-500/30 max-w-2xl mx-auto space-y-4 shadow-2xl relative">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                  This Certificate is Awarded to
                </p>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-heading">
                  {progress.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                  For successfully passing the <span className="text-white font-bold">{exam.title}</span> with an outstanding score of <span className="text-emerald-400 font-extrabold">{finalScorePercent}%</span>.
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-slate-800 text-left text-[11px] text-slate-400">
                  <div>
                    <span className="block font-bold text-slate-300">Issue Date:</span>
                    <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <div className="text-right">
                    <span className="block font-bold text-amber-400">Authorized Badge:</span>
                    <span>🏆 {exam.badgeId.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Rewards Earned */}
              <div className="flex items-center justify-center space-x-6">
                <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl text-center">
                  <span className="text-xs font-bold text-amber-300 block">XP Awarded</span>
                  <span className="text-lg font-black text-white">+{exam.xpReward} XP</span>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-2xl text-center">
                  <span className="text-xs font-bold text-cyan-300 block">Gems Bonus</span>
                  <span className="text-lg font-black text-white">+{exam.gemReward} Gems</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition shadow-xl"
                >
                  Return to Roadmap & Continue
                </button>
              </div>

            </div>
          ) : (
            /* NOT PASSED: TRY AGAIN VIEW */
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-rose-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-heading text-white">
                  Exam Score: {finalScorePercent}%
                </h3>
                <p className="text-xs text-rose-300">
                  Passing threshold is {exam.passingScorePercent}%. You need a bit more practice before earning your Month {exam.monthNumber} Certificate.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-3 max-w-xl mx-auto">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Recommended Action Plan:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Review your daily grammar lessons, try the Mini-Games View to reinforce sentence structures, or ask the AI Tutor for assistance!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleResetExam}
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Month Exam</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 py-3 rounded-2xl text-xs transition"
                >
                  Back to Lessons
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
