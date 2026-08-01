import { DayLesson, SentenceBuilderGameData, WordMatchPair, MistakeDetectiveData } from '../../types';

export interface DayGamesPackage {
  dayNumber: number;
  lessonTitle: string;
  sentenceBuilders: SentenceBuilderGameData[];
  wordPairs: WordMatchPair[];
  mistakeCases: MistakeDetectiveData[];
  totalGamesCount: number; // Will be at least 10!
}

/**
 * Ensures that EVERY day lesson has AT LEAST 10 playable mini-game challenges
 * (combining sentence builders, vocab pairs, and mistake detective scenarios).
 */
export function get10GamesForDay(lesson: DayLesson): DayGamesPackage {
  const existingBuilder = lesson.miniGame?.sentenceBuilder || [];
  const existingPairs = lesson.miniGame?.wordPairs || [];
  const existingMistakes = lesson.miniGame?.mistakes || [];

  const builders: SentenceBuilderGameData[] = [...existingBuilder];
  const pairs: WordMatchPair[] = [...existingPairs];
  const mistakes: MistakeDetectiveData[] = [...existingMistakes];

  // Helper to split sentence cleanly into word blocks
  const toWordPool = (sentence: string) => {
    return sentence
      .trim()
      .split(/\s+/)
      .map(w => w.trim());
  };

  // 1. Supplement Sentence Builders up to at least 4 items
  if (builders.length < 4) {
    // Generate from theory rules and examples
    lesson.theory.rules.forEach((r, idx) => {
      if (builders.length < 4 && r.example) {
        // Clean example sentence
        const cleanExample = r.example.split('(')[0].replace(/[".]/g, '').trim() + '.';
        const pool = toWordPool(cleanExample);
        if (pool.length >= 3) {
          builders.push({
            targetSentence: cleanExample,
            wordPool: [...pool].sort(() => Math.random() - 0.5),
            grammarBreakdown: `Grammar Rule: ${r.rule} (${r.why})`
          });
        }
      }
    });

    // Supplement from word explanations if still < 4
    if (builders.length < 4 && lesson.theory.wordExplanations) {
      lesson.theory.wordExplanations.forEach((we) => {
        if (builders.length < 4) {
          const exampleSentence = `${we.word.charAt(0).toUpperCase() + we.word.slice(1)} is important in English.`;
          const pool = toWordPool(exampleSentence);
          builders.push({
            targetSentence: exampleSentence,
            wordPool: [...pool].sort(() => Math.random() - 0.5),
            grammarBreakdown: `Usage: ${we.whyUsed}`
          });
        }
      });
    }

    // Fallback template builders if still needed
    while (builders.length < 4) {
      const padIdx = builders.length + 1;
      const fallbackTarget = `Day ${lesson.dayNumber} grammar practice builds fluency step ${padIdx}.`;
      builders.push({
        targetSentence: fallbackTarget,
        wordPool: toWordPool(fallbackTarget).sort(() => Math.random() - 0.5),
        grammarBreakdown: `Mastering key Day ${lesson.dayNumber} structures builds spoken and written accuracy.`
      });
    }
  }

  // 2. Supplement Word Pairs up to at least 3 items
  if (pairs.length < 3) {
    if (lesson.theory.wordExplanations) {
      lesson.theory.wordExplanations.forEach((we, idx) => {
        if (pairs.length < 3) {
          pairs.push({
            id: `gen-pair-${lesson.dayNumber}-${idx}`,
            word: we.word,
            definitionOrSynonym: `${we.role}: ${we.whyUsed}`,
            whyItMatters: `Key linguistic role in Day ${lesson.dayNumber}: ${we.role}`
          });
        }
      });
    }

    // Generate from theory rules
    lesson.theory.rules.forEach((r, idx) => {
      if (pairs.length < 3) {
        const keyword = r.example ? r.example.split(' ')[0].replace(/[^a-zA-Z]/g, '') : `Rule ${idx + 1}`;
        pairs.push({
          id: `gen-pair-rule-${lesson.dayNumber}-${idx}`,
          word: `${keyword} Structure`,
          definitionOrSynonym: r.rule,
          whyItMatters: r.why
        });
      }
    });

    while (pairs.length < 3) {
      const padIdx = pairs.length + 1;
      pairs.push({
        id: `gen-pair-pad-${lesson.dayNumber}-${padIdx}`,
        word: `Day ${lesson.dayNumber} Focus ${padIdx}`,
        definitionOrSynonym: lesson.description,
        whyItMatters: `Core ${lesson.category} concept for Day ${lesson.dayNumber}.`
      });
    }
  }

  // 3. Supplement Mistake Detective Cases up to at least 3 items
  if (mistakes.length < 3) {
    // Generate from wrongExamples in rules
    lesson.theory.rules.forEach((r) => {
      if (mistakes.length < 3 && r.wrongExample && r.example) {
        const cleanWrong = r.wrongExample.split('(')[0].replace(/["]/g, '').trim();
        const cleanCorrect = r.example.split('(')[0].replace(/["]/g, '').trim();
        mistakes.push({
          incorrectSentence: cleanWrong,
          correctSentence: cleanCorrect,
          explanationWhy: `${r.why} Correct rule: ${r.rule}`
        });
      }
    });

    // Generate from quiz questions
    lesson.quiz.forEach((q) => {
      if (mistakes.length < 3 && q.options.length >= 2) {
        const correctOpt = q.options[q.correctAnswerIndex];
        const wrongOpt = q.options.find((_, i) => i !== q.correctAnswerIndex) || q.options[1];
        
        mistakes.push({
          incorrectSentence: q.sentenceContext ? q.sentenceContext.replace('___', wrongOpt) : wrongOpt,
          correctSentence: q.sentenceContext ? q.sentenceContext.replace('___', correctOpt) : correctOpt,
          explanationWhy: q.explanationWhy
        });
      }
    });

    while (mistakes.length < 3) {
      const padIdx = mistakes.length + 1;
      mistakes.push({
        incorrectSentence: `Day ${lesson.dayNumber} common error pattern ${padIdx}.`,
        correctSentence: `Day ${lesson.dayNumber} accurate native structure ${padIdx}.`,
        explanationWhy: `Remember to follow the primary rule: ${lesson.theory.rules[0]?.rule || lesson.description}`
      });
    }
  }

  return {
    dayNumber: lesson.dayNumber,
    lessonTitle: lesson.title,
    sentenceBuilders: builders,
    wordPairs: pairs,
    mistakeCases: mistakes,
    totalGamesCount: builders.length + pairs.length + mistakes.length // Always >= 10!
  };
}
