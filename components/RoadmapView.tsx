import React, { useState } from 'react';
import { useLearning } from '../src/context/LearningContext';
import { DAYS_CURRICULUM, MONTH_EXAMS } from '../data/courseData';
import { DayLesson, MonthExam, UserLevel } from '../types';
import { Lock, CheckCircle2, Play, Star, BookOpen, Sparkles, Award, Zap, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

interface RoadmapViewProps {
  onSelectDay: (day: DayLesson) => void;
  onSelectMonthExam: (exam: MonthExam) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onSelectDay, onSelectMonthExam }) => {
  const { progress, setUserLevel } = useLearning();
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  // Filter lessons by Month
  const currentMonthLessons = DAYS_CURRICULUM.filter(d => d.monthNumber === selectedMonth);
  const currentMonthExam = MONTH_EXAMS.find(e => e.monthNumber === selectedMonth);

  const passedExamScores = progress.completedMonthExamScores || {};
  const isMonthExamPassed = (progress.passedMonthNumbers || []).includes(selectedMonth);
  const examScore = passedExamScores[selectedMonth];

  // Check if a day is unlocked
  const isDayUnlocked = (day: DayLesson, index: number) => {
    if (day.dayNumber === 1) return true;
    const prevDayId = `day-${day.dayNumber - 1}`;
    // Either completed previous day or is early days
    return progress.completedDayIds.includes(prevDayId) || day.dayNumber <= progress.completedDayIds.length + 1;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Structured 90-Day Journey</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Master English Grammar & Vocabulary <br className="hidden sm:inline"/>
              <span className="bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                With Deep "Why" Explanations
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Step-by-step daily tasks designed for every proficiency level. Learn why each noun, tense, article, and sentence form is used in real English.
            </p>
          </div>

          {/* Level Switcher Widget */}
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 space-y-3 min-w-[240px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Track</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setUserLevel('beginner')}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  progress.userLevel === 'beginner'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>🌱 Beginner (Basics & Nouns)</span>
                {progress.userLevel === 'beginner' && <Zap className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button
                onClick={() => setUserLevel('intermediate')}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  progress.userLevel === 'intermediate'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>🚀 Intermediate (Tenses & Vocab)</span>
                {progress.userLevel === 'intermediate' && <Zap className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button
                onClick={() => setUserLevel('pro')}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  progress.userLevel === 'pro'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>👑 Pro (Subjunctive & Nuance)</span>
                {progress.userLevel === 'pro' && <Zap className="w-3.5 h-3.5 fill-current" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Month Navigator Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setSelectedMonth(1)}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedMonth === 1
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Month 1: Foundations
          </button>

          <button
            onClick={() => setSelectedMonth(2)}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedMonth === 2
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Month 2: Tenses & Vocab
          </button>

          <button
            onClick={() => setSelectedMonth(3)}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedMonth === 3
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Month 3: Pro Syntax & Nuance
          </button>
        </div>

        <div className="text-xs text-slate-400 font-semibold flex items-center space-x-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Month {selectedMonth} Progress: {progress.completedDayIds.filter(id => id.startsWith(`day-${(selectedMonth-1)*30}`)).length} / 30 Days</span>
        </div>
      </div>

      {/* MONTH FINAL EXAM BANNER */}
      {currentMonthExam && (
        <div className={`rounded-3xl p-6 sm:p-7 border transition-all shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isMonthExamPassed
            ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-emerald-500/50'
            : 'bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-amber-500/50 shadow-amber-500/10'
        }`}>
          <div className="space-y-2 text-center sm:text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Month {selectedMonth} Final Assessment & Diploma</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-heading text-white">
              {currentMonthExam.title}
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {currentMonthExam.description}
            </p>

            {isMonthExamPassed && (
              <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Certificate Earned! Passed with Score: {examScore}%</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectMonthExam(currentMonthExam)}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xl shrink-0 flex items-center justify-center space-x-2 ${
              isMonthExamPassed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-amber-500/25 animate-pulse'
            }`}
          >
            <span>{isMonthExamPassed ? 'Review / Retake Final Exam' : `Take Month ${selectedMonth} Final Exam`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Days Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMonthLessons.map((day, idx) => {
          const isCompleted = progress.completedDayIds.includes(day.id);
          const unlocked = isDayUnlocked(day, idx);
          const score = progress.dayScores[day.id] || 0;

          return (
            <div
              key={day.id}
              className={`relative rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 group ${
                isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500 shadow-lg shadow-emerald-500/5'
                  : unlocked
                  ? 'bg-slate-900/90 border-indigo-500/40 hover:border-indigo-400 shadow-xl hover:-translate-y-1'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
            >
              {/* Top Row: Day Pill + Category Tag + Score Star */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    Day {day.dayNumber}
                  </span>

                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {day.category}
                  </span>
                </div>

                {isCompleted ? (
                  <div className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{score}%</span>
                  </div>
                ) : unlocked ? (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="font-heading font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                  {day.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {day.description}
                </p>
              </div>

              {/* Footer Row: Time + XP + Action Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 font-medium">
                  ⏳ {day.estimatedMinutes} mins • ⚡ +{day.xpReward} XP
                </div>

                {unlocked ? (
                  <button
                    onClick={() => onSelectDay(day)}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-slate-800 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isCompleted ? 'Review' : 'Start Task'}</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-600 font-bold flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
