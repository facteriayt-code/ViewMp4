import React, { useState } from 'react';
import { Bot, Send, Sparkles, RefreshCw, CheckCircle2, MessageSquare, BookOpen, Volume2 } from 'lucide-react';
import { useLearning } from '../src/context/LearningContext';

export const AITutorView: React.FC = () => {
  const { progress } = useLearning();

  const [userQuery, setUserQuery] = useState<string>('');
  const [sentenceToAnalyze, setSentenceToAnalyze] = useState<string>('She don\'t likes to goes to school on yesterday.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tutorResult, setTutorResult] = useState<any>({
    feedbackSummary: "Great effort! There are a few subject-verb agreement and double-tense corrections needed.",
    correctedSentence: "She doesn't like to go to school.",
    keyRulesExplained: [
      {
        concept: "Auxiliary Verb 'doesn't'",
        explanation: "In third-person singular (she), negative present simple uses 'doesn't' (does + not). Once 'does' takes the third-person '-s', the main verb 'like' MUST return to base form ('like', NOT 'likes')."
      },
      {
        concept: "Infinitives After 'To'",
        explanation: "The preposition 'to' is followed by the base infinitive verb form ('to go', NOT 'to goes')."
      },
      {
        concept: "Time Prepositions with 'Yesterday'",
        explanation: "Words like 'yesterday', 'today', and 'tomorrow' never take prepositions ('on yesterday' is incorrect; just say 'yesterday')."
      }
    ],
    encouragingNote: "Keep going! Small adjustments to auxiliary verbs will make your spoken English sound effortless."
  });

  const handleAskTutor = async () => {
    if (!userQuery.trim() && !sentenceToAnalyze.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: userQuery.trim() || undefined,
          sentenceToAnalyze: sentenceToAnalyze.trim() || undefined,
          level: progress.userLevel
        })
      });

      const data = await response.json();
      if (data.success && data.result) {
        setTutorResult(data.result);
      }
    } catch (err) {
      console.error('AI Tutor error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <Bot className="w-4 h-4 text-amber-400" />
          <span>AI English Professor & Sentence Doctor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Ask Any Question or Check Written English
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
          Get instant, personalized feedback on your written sentences, grammar queries, or word choices tailored to your current level ({progress.userLevel}).
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
            Paste Sentence / Paragraph to Analyze & Correct:
          </label>
          <textarea
            rows={3}
            value={sentenceToAnalyze}
            onChange={(e) => setSentenceToAnalyze(e.target.value)}
            placeholder="e.g. Me and him was going to the market..."
            className="w-full bg-slate-950 text-white font-medium p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Or Ask a Custom Question ("Why do we say...?"):
          </label>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="e.g. What is the difference between 'few' and 'a few'?"
            className="w-full bg-slate-950 text-slate-200 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          onClick={handleAskTutor}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-amber-600/20 transition flex items-center justify-center space-x-2 text-sm"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing with AI Professor...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Ask AI Tutor & Explain Rules</span>
            </>
          )}
        </button>
      </div>

      {/* AI Tutor Feedback Card */}
      {tutorResult && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6 shadow-2xl animate-fadeIn">
          
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              Professor Feedback
            </span>
            <p className="text-slate-200 text-sm leading-relaxed">
              {tutorResult.feedbackSummary}
            </p>
          </div>

          {/* Corrected Sentence */}
          {tutorResult.correctedSentence && (
            <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  ✅ Corrected Sentence:
                </span>
                <button
                  onClick={() => speakText(tutorResult.correctedSentence)}
                  className="p-1.5 text-emerald-300 hover:text-white"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white font-bold text-base italic">
                "{tutorResult.correctedSentence}"
              </p>
            </div>
          )}

          {/* Key Rules Breakdown */}
          {tutorResult.keyRulesExplained && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-indigo-300 uppercase tracking-wider">
                Grammar Rules & Reasons Explained:
              </h4>

              {tutorResult.keyRulesExplained.map((rule: any, idx: number) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-300 text-sm">{rule.concept}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{rule.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Encouragement */}
          {tutorResult.encouragingNote && (
            <div className="bg-indigo-950/60 p-4 rounded-2xl border border-indigo-500/30 text-xs text-indigo-200 italic">
              🌟 {tutorResult.encouragingNote}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
