import React, { useState } from 'react';
import { Sparkles, Search, Volume2, HelpCircle, ArrowRight, Zap, RefreshCw, CheckCircle2, BookOpen } from 'lucide-react';
import { GrammarAnalysisResult } from '../types';

export const LinguisticExplainerView: React.FC = () => {
  const [sentenceInput, setSentenceInput] = useState<string>('She is an honest person who has lived in London since 2018.');
  const [targetWord, setTargetWord] = useState<string>('an honest person');
  const [analysisResult, setAnalysisResult] = useState<GrammarAnalysisResult | null>({
    partOfSpeech: "Indefinite Article 'an' + Silent H Adjective",
    whyUsed: '"An" is used before "honest" because "honest" begins with a silent "H" sound, producing the vowel sound /ɒ/. This prevents a harsh glottal stop.',
    alternativeComparison: 'If you say "a honest person", the speech creates an awkward stuttering pause ("a...honest"). "An" allows smooth continuous speech flow.',
    proTip: 'Always listen for the first SPOKEN SOUND, not the written letter! "An hour", but "A university".'
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sampleSentences = [
    { text: 'If I were you, I would accept the offer.', target: 'were', label: 'Subjunctive "Were"' },
    { text: 'Water freezes at 0 degrees Celsius.', target: 'freezes', label: 'Present Simple Fact' },
    { text: 'I have lost my keys!', target: 'have lost', label: 'Present Perfect vs Past' },
    { text: 'We arrived at the airport on Monday.', target: 'at / on', label: 'Prepositions "At & On"' }
  ];

  const handleAnalyze = async (textToUse?: string, targetToUse?: string) => {
    const finalSentence = textToUse || sentenceInput;
    const finalTarget = targetToUse || targetWord;

    if (!finalSentence.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/explain-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: finalSentence,
          target: finalTarget,
          level: 'intermediate'
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else if (data.fallback) {
        setAnalysisResult(data.fallback);
      }
    } catch (err) {
      console.error('Explainer error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const speakSentence = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentenceInput);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-900/80 via-slate-900 to-indigo-900/80 rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Linguistic Reasoning Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Why Particular Words & Sentence Forms are Used
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
          Enter any English sentence below to break down its underlying grammatical rules, phonetic choices, article usage, or verb tense logic!
        </p>
      </div>

      {/* Preset Quick Try Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Try Example Grammatical Scenarios:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleSentences.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSentenceInput(sample.text);
                setTargetWord(sample.target);
                handleAnalyze(sample.text, sample.target);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Box Form */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
            Enter Sentence to Deconstruct:
          </label>
          <div className="relative">
            <input
              type="text"
              value={sentenceInput}
              onChange={(e) => setSentenceInput(e.target.value)}
              placeholder="e.g. She has been working here since 2020."
              className="w-full bg-slate-950 text-white font-medium px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm pr-12"
            />
            <button
              onClick={speakSentence}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition"
              title="Listen to pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Target Word / Noun / Form to Explain (Optional):
          </label>
          <input
            type="text"
            value={targetWord}
            onChange={(e) => setTargetWord(e.target.value)}
            placeholder="e.g. 'an' or 'has been working' or 'since'"
            className="w-full bg-slate-950 text-slate-200 text-xs px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={() => handleAnalyze()}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 text-sm"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing English Syntax & Phonetics...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Deconstruct Sentence & Explain "Why"</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Output Box */}
      {analysisResult && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-500/30 space-y-6 shadow-2xl animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                Grammatical Classification
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {analysisResult.partOfSpeech}
              </h3>
            </div>

            <button
              onClick={speakSentence}
              className="flex items-center space-x-1.5 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-xl border border-indigo-500/30 text-xs font-bold transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>Audio</span>
            </button>
          </div>

          {/* Core Reason Box */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Why This Exact Word/Form Was Chosen</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              {analysisResult.whyUsed}
            </p>
          </div>

          {/* Alternative Comparison */}
          <div className="bg-rose-950/30 p-5 rounded-2xl border border-rose-500/20 space-y-2">
            <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-rose-400" />
              <span>What Happens If You Use The Mistaken Alternative?</span>
            </div>
            <p className="text-rose-200/90 text-sm leading-relaxed">
              {analysisResult.alternativeComparison}
            </p>
          </div>

          {/* Pro Tip */}
          <div className="bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pro Memory Rule & Native Habit</span>
            </div>
            <p className="text-emerald-200 text-sm font-medium leading-relaxed">
              {analysisResult.proTip}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
