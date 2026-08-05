import React, { useState } from 'react';
import { useLearning } from '../src/context/LearningContext';
import { Flame, Gem, CheckCircle2, Lock, Sparkles, X, Gift, Calendar, Award } from 'lucide-react';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({ isOpen, onClose }) => {
  const { progress, canClaimDailyCheckIn, claimDailyCheckIn, language } = useLearning();
  const [claimedRewardMessage, setClaimedRewardMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStreak = progress.consecutiveCheckInStreak || (progress.lastCheckInDate ? progress.streakDays : 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const isClaimedToday = progress.lastCheckInDate === todayStr;

  const REWARD_SCHEDULE = [
    { day: 1, gems: 15, xp: 20 },
    { day: 2, gems: 25, xp: 30 },
    { day: 3, gems: 35, xp: 40 },
    { day: 4, gems: 50, xp: 50 },
    { day: 5, gems: 65, xp: 60 },
    { day: 6, gems: 80, xp: 75 },
    { day: 7, gems: 120, xp: 100, isJackpot: true },
  ];

  // Determine active day slot (1-7)
  let activeDaySlot = 1;
  if (isClaimedToday) {
    activeDaySlot = Math.min(currentStreak, 7);
  } else {
    activeDaySlot = Math.min((currentStreak % 7) + 1, 7);
  }

  const handleClaim = () => {
    const res = claimDailyCheckIn();
    if (res.success) {
      setClaimedRewardMessage(
        language === 'hi'
          ? `🎉 बधाई हो! आपने 💎${res.gemsGained} डायमंड्स + ✨${res.xpGained} XP हासिल किए!`
          : `🎉 Claimed! You earned 💎${res.gemsGained} Diamonds + ✨${res.xpGained} XP!`
      );
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Background decorative glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-amber-300/30 to-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-tr from-cyan-300/30 to-rose-300/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-md shadow-amber-500/20">
            <Flame className="w-4 h-4 fill-white animate-bounce" />
            <span>{language === 'hi' ? 'दैनिक चेक-इन रिवार्ड्स' : 'Daily Check-in Bonus'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {language === 'hi' ? 'रोज़ लॉगिन करें, डायमंड्स पाएं!' : 'Claim Your Daily Diamonds'}
          </h2>
          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
            {language === 'hi'
              ? 'हर लगातार दिन चेक-इन करने पर आपको ज़्यादा बोनस डायमंड्स मिलते हैं!'
              : 'Log in every day to keep your streak going and earn bigger Diamond rewards!'}
          </p>
        </div>

        {/* Current Streak Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/40 rounded-2xl flex items-center justify-center text-amber-400">
              <Flame className="w-7 h-7 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest block">
                {language === 'hi' ? 'आपकी स्ट्रीक' : 'Current Streak'}
              </span>
              <span className="text-xl font-black text-white">
                {currentStreak} {language === 'hi' ? 'दिन' : 'Days'} 🔥
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-indigo-200 font-bold block">
              {language === 'hi' ? 'आपका बैलेंस' : 'Your Balance'}
            </span>
            <span className="text-lg font-black text-cyan-300 flex items-center justify-end space-x-1">
              <Gem className="w-4 h-4 fill-cyan-400" />
              <span>{progress.gems}</span>
            </span>
          </div>
        </div>

        {/* Success Claim Toast */}
        {claimedRewardMessage && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-2xl text-xs font-black text-center flex items-center justify-center space-x-2 animate-fadeIn shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>{claimedRewardMessage}</span>
          </div>
        )}

        {/* 7-Day Rewards Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'hi' ? '7-दिन का रिवार्ड प्लान' : '7-Day Streak Rewards'}</span>
            </span>
            <span className="text-[11px] text-indigo-600 font-extrabold">
              {language === 'hi' ? 'दिन 7: बड़ा जैकपॉट 💎120' : 'Day 7 Jackpot: 💎120'}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {REWARD_SCHEDULE.map((item) => {
              const isPastClaimed = isClaimedToday
                ? item.day <= activeDaySlot
                : item.day < activeDaySlot;
              const isCurrentToClaim = !isClaimedToday && item.day === activeDaySlot;

              return (
                <div
                  key={item.day}
                  className={`relative p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                    item.isJackpot ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    isPastClaimed
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs'
                      : isCurrentToClaim
                      ? 'bg-amber-50 border-2 border-amber-500 text-amber-950 shadow-md scale-105 animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-80'
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase ${
                    isPastClaimed ? 'text-emerald-700' : isCurrentToClaim ? 'text-amber-800' : 'text-slate-400'
                  }`}>
                    {language === 'hi' ? `दिन ${item.day}` : `Day ${item.day}`}
                  </span>

                  <div className="my-1.5 flex flex-col items-center">
                    {isPastClaimed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : item.isJackpot ? (
                      <Gift className="w-6 h-6 text-amber-500 fill-amber-100 animate-bounce" />
                    ) : (
                      <Gem className={`w-5 h-5 ${isCurrentToClaim ? 'text-cyan-500 fill-cyan-400' : 'text-slate-300'}`} />
                    )}
                    <span className="font-black text-xs mt-1">
                      +{item.gems} 💎
                    </span>
                  </div>

                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    isPastClaimed
                      ? 'bg-emerald-200/60 text-emerald-900'
                      : isCurrentToClaim
                      ? 'bg-amber-200 text-amber-900 font-extrabold'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPastClaimed
                      ? '✓ Claimed'
                      : isCurrentToClaim
                      ? 'Today!'
                      : `+${item.xp} XP`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Claim Action Button */}
        <div className="pt-2">
          {canClaimDailyCheckIn ? (
            <button
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3.5 rounded-2xl text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 transition transform active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-100 animate-spin" />
              <span>
                {language === 'hi' ? 'आज का रिवार्ड क्लेम करें!' : "CLAIM TODAY'S REWARD"}
              </span>
              <span className="bg-black/20 text-white px-2 py-0.5 rounded-lg text-xs font-bold">
                +15-120 💎
              </span>
            </button>
          ) : (
            <div className="w-full bg-slate-100 border border-slate-200 text-slate-500 font-bold py-3 rounded-2xl text-xs text-center flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'hi'
                  ? 'आपने आज का चेक-इन पूरा कर लिया है! कल फिर आएं!'
                  : 'Daily reward already claimed today! Come back tomorrow for more 💎'}
              </span>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center pt-1 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium">
            {language === 'hi'
              ? '💡 संकेत: वर्डले और गेम्स खेलते समय इन डायमंड्स का उपयोग हिंट अनलॉक करने में करें!'
              : '💡 Tip: Use your Diamonds for Wordle Hints, refill hearts, and unlock special rewards!'}
          </p>
        </div>

      </div>
    </div>
  );
};
