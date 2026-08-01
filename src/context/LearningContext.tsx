import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress, UserLevel } from '../../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import confetti from 'canvas-confetti';

interface LearningContextType {
  progress: UserProgress;
  setUserLevel: (level: UserLevel) => void;
  completeLesson: (dayId: string, scorePercent: number, xpGained: number) => void;
  completeMonthExam: (monthNumber: number, scorePercent: number, xpReward: number, gemReward: number, badgeId: string) => void;
  deductHeart: () => boolean; // returns false if no hearts left
  refillHearts: () => void;
  buyGems: (amount: number) => void;
  addXpAndGems: (xp: number, gems: number) => void;
  activeDayId: string;
  setActiveDayId: (id: string) => void;
  isLoading: boolean;
  triggerConfetti: () => void;
}

const DEFAULT_PROGRESS: UserProgress = {
  userId: 'guest_user',
  name: 'Lingo Student',
  userLevel: 'beginner',
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedDayIds: [],
  dayScores: {},
  unlockedBadges: ['first_step'],
  gems: 120,
  hearts: 5
};

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('lingo_user_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_PROGRESS;
  });

  const [activeDayId, setActiveDayId] = useState<string>('day-1');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto-save to LocalStorage
  useEffect(() => {
    localStorage.setItem('lingo_user_progress', JSON.stringify(progress));
  }, [progress]);

  // Sync to Firestore if user logged in or guest doc
  useEffect(() => {
    const syncToFirestore = async () => {
      try {
        const uid = auth.currentUser?.uid || 'guest_user';
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
          ...progress,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.debug('Firestore sync notice:', err);
      }
    };
    syncToFirestore();
  }, [progress]);

  // Check and update Daily Streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = progress.lastActiveDate;
    if (lastActive !== today) {
      const lastDate = new Date(lastActive);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Increment streak
        setProgress(prev => ({
          ...prev,
          streakDays: prev.streakDays + 1,
          lastActiveDate: today
        }));
      } else if (diffDays > 1) {
        // Streak lost unless freeze power-up
        setProgress(prev => ({
          ...prev,
          streakDays: 1,
          lastActiveDate: today
        }));
      }
    }
  }, []);

  const setUserLevel = (level: UserLevel) => {
    setProgress(prev => ({ ...prev, userLevel: level }));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.debug('Confetti error:', e);
    }
  };

  const completeLesson = (dayId: string, scorePercent: number, xpGained: number) => {
    setProgress(prev => {
      const isNew = !prev.completedDayIds.includes(dayId);
      const updatedCompleted = isNew ? [...prev.completedDayIds, dayId] : prev.completedDayIds;
      const updatedScores = { ...prev.dayScores, [dayId]: Math.max(prev.dayScores[dayId] || 0, scorePercent) };
      
      const addedGems = scorePercent >= 80 ? 15 : 5;
      const newXp = prev.xp + xpGained;

      return {
        ...prev,
        xp: newXp,
        gems: prev.gems + addedGems,
        completedDayIds: updatedCompleted,
        dayScores: updatedScores
      };
    });

    triggerConfetti();
  };

  const completeMonthExam = (
    monthNumber: number,
    scorePercent: number,
    xpReward: number,
    gemReward: number,
    badgeId: string
  ) => {
    setProgress(prev => {
      const isPassed = scorePercent >= 70;
      const currentPassed = prev.passedMonthNumbers || [];
      const updatedPassed = isPassed && !currentPassed.includes(monthNumber)
        ? [...currentPassed, monthNumber]
        : currentPassed;

      const currentBadges = prev.unlockedBadges || [];
      const updatedBadges = isPassed && !currentBadges.includes(badgeId)
        ? [...currentBadges, badgeId]
        : currentBadges;

      const currentExamScores = prev.completedMonthExamScores || {};
      const updatedExamScores = {
        ...currentExamScores,
        [monthNumber]: Math.max(currentExamScores[monthNumber] || 0, scorePercent)
      };

      return {
        ...prev,
        xp: prev.xp + (isPassed ? xpReward : Math.round(xpReward * 0.3)),
        gems: prev.gems + (isPassed ? gemReward : 10),
        completedMonthExamScores: updatedExamScores,
        passedMonthNumbers: updatedPassed,
        unlockedBadges: updatedBadges
      };
    });

    if (scorePercent >= 70) {
      triggerConfetti();
    }
  };

  const deductHeart = (): boolean => {
    if (progress.hearts <= 1) {
      setProgress(prev => ({ ...prev, hearts: 0 }));
      return false;
    }
    setProgress(prev => ({ ...prev, hearts: prev.hearts - 1 }));
    return true;
  };

  const refillHearts = () => {
    if (progress.gems >= 50) {
      setProgress(prev => ({
        ...prev,
        gems: prev.gems - 50,
        hearts: 5
      }));
    } else {
      setProgress(prev => ({ ...prev, hearts: 5 }));
    }
  };

  const buyGems = (amount: number) => {
    setProgress(prev => ({ ...prev, gems: prev.gems + amount }));
  };

  const addXpAndGems = (xpAmount: number, gemAmount: number) => {
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + xpAmount,
      gems: prev.gems + gemAmount
    }));
    triggerConfetti();
  };

  return (
    <LearningContext.Provider
      value={{
        progress,
        setUserLevel,
        completeLesson,
        completeMonthExam,
        deductHeart,
        refillHearts,
        buyGems,
        addXpAndGems,
        activeDayId,
        setActiveDayId,
        isLoading,
        triggerConfetti
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
