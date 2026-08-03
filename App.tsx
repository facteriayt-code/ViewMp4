import React, { useState } from 'react';
import { LearningProvider, useLearning } from './src/context/LearningContext';
import { Navbar } from './components/Navbar';
import { RoadmapView } from './components/RoadmapView';
import { LessonView } from './components/LessonView';
import { MonthTestView } from './components/MonthTestView';
import { LinguisticExplainerView } from './components/LinguisticExplainerView';
import { MiniGamesView } from './components/MiniGamesView';
import { AITutorView } from './components/AITutorView';
import { LearnSomethingNewView } from './components/LearnSomethingNewView';
import { ProfileView } from './components/ProfileView';
import { DayLesson, MonthExam } from './types';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'explainer' | 'games' | 'tutor' | 'learn' | 'profile'>('roadmap');
  const [selectedDay, setSelectedDay] = useState<DayLesson | null>(null);
  const [selectedMonthExam, setSelectedMonthExam] = useState<MonthExam | null>(null);

  const handleSelectDay = (day: DayLesson) => {
    setSelectedDay(day);
    setSelectedMonthExam(null);
  };

  const handleSelectMonthExam = (exam: MonthExam) => {
    setSelectedMonthExam(exam);
    setSelectedDay(null);
  };

  const handleBackFromLesson = () => {
    setSelectedDay(null);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedDay(null);
          setSelectedMonthExam(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Container */}
      <main className="flex-grow pb-16 w-full max-w-full overflow-x-hidden">
        {selectedMonthExam ? (
          <MonthTestView exam={selectedMonthExam} onClose={() => setSelectedMonthExam(null)} />
        ) : selectedDay ? (
          <LessonView day={selectedDay} onBack={handleBackFromLesson} />
        ) : (
          <>
            {activeTab === 'roadmap' && (
              <RoadmapView
                onSelectDay={handleSelectDay}
                onSelectMonthExam={handleSelectMonthExam}
              />
            )}
            {activeTab === 'explainer' && <LinguisticExplainerView />}
            {activeTab === 'games' && <MiniGamesView />}
            {activeTab === 'tutor' && <AITutorView />}
            {activeTab === 'learn' && <LearnSomethingNewView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-600 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-heading font-extrabold text-indigo-600">LingoSprint</span>
            <span>• Interactive English Learning & Linguistic Explainer</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Learn English step-by-step from beginner to pro with daily tasks, games, and AI reasoning.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <LearningProvider>
      <AppContent />
    </LearningProvider>
  );
}
