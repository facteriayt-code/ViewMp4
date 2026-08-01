import React from 'react';
import { useLearning } from '../src/context/LearningContext';
import { BADGES_LIST } from '../data/courseData';
import { Trophy, Flame, Gem, Heart, Award, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { progress, setUserLevel, refillHearts } = useLearning();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Profile Card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-500 flex items-center justify-center font-heading font-black text-2xl text-white shadow-xl shadow-indigo-500/25">
            {progress.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-bold font-heading text-white">{progress.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                {progress.userLevel} Track
              </span>
              <span className="text-xs text-slate-400 font-medium">Joined LingoSprint</span>
            </div>
          </div>
        </div>

        {/* Level Changer */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Change Proficiency Level</span>
          <select
            value={progress.userLevel}
            onChange={(e) => setUserLevel(e.target.value as any)}
            className="bg-slate-900 text-xs font-bold text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="beginner">🌱 Beginner (Basics & Nouns)</option>
            <option value="intermediate">🚀 Intermediate (Tenses)</option>
            <option value="pro">👑 Pro (Subjunctive & Nuance)</option>
          </select>
        </div>
      </div>

      {/* Gamified Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/30 text-center space-y-1 shadow-lg">
          <Flame className="w-6 h-6 text-amber-500 fill-amber-500 mx-auto animate-pulse" />
          <span className="text-2xl font-black text-white">{progress.streakDays} Days</span>
          <span className="text-xs text-slate-400 font-bold block">Active Streak</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/30 text-center space-y-1 shadow-lg">
          <Trophy className="w-6 h-6 text-indigo-400 mx-auto" />
          <span className="text-2xl font-black text-white">{progress.xp}</span>
          <span className="text-xs text-slate-400 font-bold block">Total XP</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-cyan-500/30 text-center space-y-1 shadow-lg">
          <Gem className="w-6 h-6 text-cyan-400 fill-cyan-400 mx-auto" />
          <span className="text-2xl font-black text-white">{progress.gems}</span>
          <span className="text-xs text-slate-400 font-bold block">Gems Balance</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-emerald-500/30 text-center space-y-1 shadow-lg">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
          <span className="text-2xl font-black text-white">{progress.completedDayIds.length}</span>
          <span className="text-xs text-slate-400 font-bold block">Lessons Done</span>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-lg text-white flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Achievements & Master Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = progress.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start space-x-3 ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                }`}
              >
                <div className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800">
                  {badge.icon}
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-white text-sm block">{badge.name}</span>
                  <p className="text-xs text-slate-400 leading-snug">{badge.description}</p>
                  <span className="text-[10px] text-amber-400 font-bold block pt-1">
                    {badge.requirement} {isUnlocked ? '• Unlocked ✅' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Earned Month Final Exam Certificates */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-lg text-white flex items-center space-x-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>Month Graduation Diplomas & Exam Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((mNum) => {
            const isPassed = (progress.passedMonthNumbers || []).includes(mNum);
            const score = (progress.completedMonthExamScores || {})[mNum];

            return (
              <div
                key={mNum}
                className={`p-5 rounded-2xl border transition-all space-y-2 ${
                  isPassed
                    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-amber-500/40 shadow-lg'
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Month {mNum} Diploma
                  </span>
                  {isPassed ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      PASSED ({score}%)
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-bold">NOT TAKEN</span>
                  )}
                </div>

                <h4 className="font-bold text-white text-sm">
                  {mNum === 1 ? 'Foundations Exam' : mNum === 2 ? 'Intermediate Exam' : 'Pro Nuance Exam'}
                </h4>

                <p className="text-xs text-slate-400">
                  {isPassed
                    ? `Official Competency Certificate earned with ${score}% grade.`
                    : `Complete Month ${mNum} lessons and pass the final exam to earn your certificate.`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
