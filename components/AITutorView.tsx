import React, { useState } from 'react';
import { Bot, Send, Sparkles, RefreshCw, CheckCircle2, MessageSquare, BookOpen, Volume2, AlertCircle } from 'lucide-react';
import { useLearning } from '../src/context/LearningContext';

export const AITutorView: React.FC = () => {
  const { progress } = useLearning();

  const [userQuery, setUserQuery] = useState<string>('');
  const [sentenceToAnalyze, setSentenceToAnalyze] = useState<string>('She don\'t likes to goes to school on yesterday.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const topicPrompts = [
    { label: "📚 Explain Articles (A, An, The)", query: "Explain articles A, An, and The step by step in simple language with multiple examples." },
    { label: "⏱️ Explain Tenses & Timeframes", query: "Explain English tenses step by step in simple language with clear real-life examples." },
    { label: "📍 Explain Prepositions (In, On, At)", query: "Explain prepositions In, On, At step by step with multiple location and time examples." },
    { label: "💡 Explain Conditionals & 'If' Clauses", query: "Explain English conditionals and 'If' clauses step by step with easy examples." },
    { label: "🔁 Explain Passive Voice", query: "Explain Active vs Passive Voice step by step with clear transformations and examples." },
    { label: "🔒 Explain Modal Verbs (Can, Must, Should)", query: "Explain Modal Verbs step by step in simple English with real-life examples." }
  ];

  const sentencePrompts = [
    { label: "Check: 'Me and him was going'", sentence: "Me and him was going to the store.", query: "Why is 'Me and him was' grammatically incorrect?" },
    { label: "'If I were' vs 'If I was'", sentence: "If I was president, I will change the law.", query: "Why do native speakers say 'If I were you' instead of 'was'?" },
    { label: "'Few' vs 'A few'", sentence: "I have few friends vs I have a few friends.", query: "What is the nuance difference between 'few' and 'a few'?" },
    { label: "Present Perfect vs Past", sentence: "I have lived in London vs I lived in London.", query: "How does the timeframe change between 'have lived' and 'lived'?" }
  ];

  const generateClientFallbackTutor = (inputSentence: string, query: string) => {
    const textLower = (inputSentence + " " + query).toLowerCase();

    if (textLower.includes("article") || textLower.includes("a, an, the") || textLower.includes("a vs an")) {
      return {
        feedbackSummary: "Step-by-Step Guide to English Articles ('A', 'An', 'The'): Articles signal whether a noun is general or specific. Let's master all 3 simple rules with examples!",
        correctedSentence: "Example: She ate an apple, bought a book, and loved the movie we watched.",
        keyRulesExplained: [
          {
            concept: "Step 1: 'A' vs 'An' depends on spoken SOUNDS, not letters",
            explanation: "Use 'a' before consonant sounds (e.g. 'a book', 'a cat', 'a university' [/jʊər/ sound]). Use 'an' before vowel sounds (e.g. 'an apple', 'an orange', 'an hour' [silent 'h' /aʊər/]). Example: 'It took an hour to find a university.'"
          },
          {
            concept: "Step 2: Use 'The' for Specific, Known Nouns",
            explanation: "Use 'the' when both speaker and listener know exactly WHICH thing is being referred to. Example: 'I saw a dog in the park. The dog was very friendly.' ('a dog' introduces it; 'the dog' specifies it)."
          },
          {
            concept: "Step 3: Zero Article for General Plurals & Uncountables",
            explanation: "Do NOT use articles when speaking about things in general. Example: 'Water is essential' (General water) vs 'The water in this glass is cold' (Specific glass)."
          }
        ],
        encouragingNote: "Remember: Listen to the spoken sound! 'An honest man' uses 'an' because the H is completely silent."
      };
    }

    if (textLower.includes("tense") || textLower.includes("present perfect") || textLower.includes("past simple")) {
      return {
        feedbackSummary: "Step-by-Step Guide to Main English Tenses: Master Present Simple, Past Simple, and Present Perfect with clear timeframe rules!",
        correctedSentence: "Example: I live in London now (Present Simple). I lived in Paris in 2020 (Past Simple). I have lived here for 3 years (Present Perfect).",
        keyRulesExplained: [
          {
            concept: "Step 1: Present Simple (Habits & Facts)",
            explanation: "Use for daily routines and universal truths. Add '-s' for third-person (he/she/it). Examples: 'She drinks tea every morning.' 'Water boils at 100°C.'"
          },
          {
            concept: "Step 2: Past Simple (Finished Past + Specific Time)",
            explanation: "Use when an action happened and finished at a known time in the past. Examples: 'I graduated in 2021.' 'They visited Rome last month.'"
          },
          {
            concept: "Step 3: Present Perfect (Past Action connected to NOW)",
            explanation: "Use 'have/has + past participle' when time is unstated, recent, or experience matters today. Examples: 'I have lost my key (so I can't open the door now).' 'She has visited 10 countries.'"
          }
        ],
        encouragingNote: "Pro Tip: If you specify 'yesterday' or 'in 2018', ALWAYS use Past Simple!"
      };
    }

    if (textLower.includes("preposition") || textLower.includes("in on at") || textLower.includes("at on in")) {
      return {
        feedbackSummary: "Step-by-Step Guide to Prepositions of Time & Place ('At', 'On', 'In'): Think of a pyramid from precise to general!",
        correctedSentence: "Example: The meeting is at 9:00 AM on Monday in July.",
        keyRulesExplained: [
          {
            concept: "Step 1: 'AT' for Precise Clock Times & Small Points",
            explanation: "Use 'at' for exact clock times, noon, night, and specific addresses. Examples: 'at 5:30 PM', 'at midnight', 'at 123 Main Street'."
          },
          {
            concept: "Step 2: 'ON' for Calendar Days & Streets",
            explanation: "Use 'on' for specific calendar dates, days of the week, and street names. Examples: 'on Monday', 'on May 15th', 'on Oxford Street'."
          },
          {
            concept: "Step 3: 'IN' for Months, Years, Seasons & Enclosed Places",
            explanation: "Use 'in' for broader time periods and enclosed areas. Examples: 'in July', 'in 2025', 'in summer', 'in London', 'in the room'."
          }
        ],
        encouragingNote: "Remember: 'AT' = pinpoint, 'ON' = surface/day, 'IN' = container/period!"
      };
    }

    if (textLower.includes("conditional") || textLower.includes("if clause") || textLower.includes("if i were")) {
      return {
        feedbackSummary: "Step-by-Step Guide to English Conditionals ('If' Clauses): Master 1st, 2nd, and 3rd Conditionals effortlessly!",
        correctedSentence: "Example: If it rains, I will take an umbrella (1st). If I were rich, I would buy an island (2nd).",
        keyRulesExplained: [
          {
            concept: "Step 1: 1st Conditional (Real Future Possibility)",
            explanation: "Structure: [If + Present Simple, Will + Verb]. Examples: 'If you study, you will pass the exam.' 'If she calls, I will answer.'"
          },
          {
            concept: "Step 2: 2nd Conditional (Imaginary / Unreal Today)",
            explanation: "Structure: [If + Past Simple, Would + Verb]. Use 'were' for all subjects! Examples: 'If I were you, I would accept the job.' 'If he had wings, he would fly.'"
          },
          {
            concept: "Step 3: 3rd Conditional (Past Regret / Unchangeable Past)",
            explanation: "Structure: [If + Past Perfect, Would have + Past Participle]. Example: 'If I had woken up earlier, I would not have missed the train.'"
          }
        ],
        encouragingNote: "Native Tip: 'If I were you' is standard formal English for giving advice!"
      };
    }

    if (textLower.includes("passive") || textLower.includes("active vs passive")) {
      return {
        feedbackSummary: "Step-by-Step Guide to Passive Voice: Focus on the action or object rather than who performed it!",
        correctedSentence: "Active: 'Shakespeare wrote Hamlet.' ➔ Passive: 'Hamlet was written by Shakespeare.'",
        keyRulesExplained: [
          {
            concept: "Step 1: When to Use Passive Voice",
            explanation: "Use passive voice when the action or object is more important than the doer, or when the doer is unknown. Example: 'My car was stolen' (we don't know who stole it)."
          },
          {
            concept: "Step 2: The Core Passive Structure [Be + Past Participle]",
            explanation: "The object becomes the subject, followed by the appropriate form of 'be' + 3rd form verb. Examples: 'The report was submitted yesterday.' 'English is spoken worldwide.'"
          },
          {
            concept: "Step 3: Adding 'By [Doer]' Optional Agent",
            explanation: "Only include 'by...' if the person or cause adds valuable context. Examples: 'The painting was created by Da Vinci.' 'The letter was sent this morning.'"
          }
        ],
        encouragingNote: "Pro Tip: Passive voice is frequently used in formal news, research papers, and executive business reports!"
      };
    }

    if (textLower.includes("modal") || textLower.includes("can, must, should")) {
      return {
        feedbackSummary: "Step-by-Step Guide to Modal Verbs ('Can', 'Could', 'Should', 'Must', 'May'): Express ability, obligation, and probability!",
        correctedSentence: "Example: I can speak English. You should practice daily. We must follow the rules.",
        keyRulesExplained: [
          {
            concept: "Step 1: Ability & Possibility ('Can' / 'Could')",
            explanation: "'Can' = present ability. 'Could' = past ability or polite request. Examples: 'I can swim.' 'Could you pass the salt, please?'"
          },
          {
            concept: "Step 2: Advice vs Hard Obligation ('Should' vs 'Must')",
            explanation: "'Should' = good advice/recommendation. 'Must' = non-negotiable requirement. Examples: 'You should sleep early.' 'Drivers must stop at red lights.'"
          },
          {
            concept: "Step 3: Modals ALWAYS Take Base Infinitive",
            explanation: "Never add '-s', '-ed', or 'to' directly after a modal verb! Examples: 'She can speak' (NOT 'She can speaks' or 'She can to speak')."
          }
        ],
        encouragingNote: "Modal Rule: Modals do not change form for he/she/it!"
      };
    }

    let corrected = inputSentence;
    let feedback = "Great query! Let's break down this structure step-by-step with clear rules and examples.";
    let rules = [
      {
        concept: "Rule 1: Subject-Verb & Auxiliary Agreement",
        explanation: "Ensure the auxiliary verb matches the subject number and tense. Third-person singular (he/she/it) takes 'does' in present simple negatives ('She doesn't like')."
      },
      {
        concept: "Rule 2: Article & Phonetic Alignment",
        explanation: "Use 'a' before consonant spoken sounds ('a book', 'a European') and 'an' before vowel spoken sounds ('an hour', 'an apple')."
      },
      {
        concept: "Rule 3: Time Prepositions",
        explanation: "Use 'at' for precise clock times, 'on' for specific calendar days, and 'in' for months, years, or seasons."
      }
    ];

    if (textLower.includes("don't likes") || textLower.includes("doesn't likes")) {
      corrected = inputSentence.replace(/don't likes|doesn't likes/gi, "doesn't like").replace(/goes/gi, "go").replace(/on yesterday/gi, "yesterday");
      feedback = "Good effort! Note that negative sentences with 'does' keep the main verb in its base infinitive form ('like', 'go').";
    } else if (textLower.includes("me and him")) {
      corrected = inputSentence.replace(/me and him/gi, "He and I");
      feedback = "When functioning as the subject of a sentence, use subject pronouns ('He and I') rather than object pronouns ('Me and him').";
    }

    return {
      feedbackSummary: feedback,
      correctedSentence: corrected,
      keyRulesExplained: rules,
      encouragingNote: `Focusing on the 'why' behind English grammar will help you speak and write with natural confidence!`
    };
  };

  const handleAskTutor = async (customSentence?: string, customQuery?: string) => {
    const finalSentence = customSentence !== undefined ? customSentence : sentenceToAnalyze;
    const finalQuery = customQuery !== undefined ? customQuery : userQuery;

    if (!finalQuery.trim() && !finalSentence.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: finalQuery.trim() || undefined,
          sentenceToAnalyze: finalSentence.trim() || undefined,
          level: progress.userLevel
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.result) {
          setTutorResult(data.result);
          return;
        }
      }
      
      const fallbackResult = generateClientFallbackTutor(finalSentence || finalQuery, finalQuery);
      setTutorResult(fallbackResult);
    } catch (err: any) {
      console.warn('AI Tutor network fallback activated:', err);
      const fallbackResult = generateClientFallbackTutor(finalSentence || finalQuery, finalQuery);
      setTutorResult(fallbackResult);
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

      {/* Quick Try Prompts */}
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
            📖 Request Step-by-Step Topic Lessons:
          </span>
          <div className="flex flex-wrap gap-2">
            {topicPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserQuery(p.query);
                  setSentenceToAnalyze('');
                  handleAskTutor('', p.query);
                }}
                className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            🔍 Check Sentence Errors & Grammar Differences:
          </span>
          <div className="flex flex-wrap gap-2">
            {sentencePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSentenceToAnalyze(p.sentence);
                  setUserQuery(p.query);
                  handleAskTutor(p.sentence, p.query);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
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

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          onClick={() => handleAskTutor()}
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
