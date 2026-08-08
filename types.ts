export type UserLevel = 'beginner' | 'intermediate' | 'pro';

export interface GrammarRuleExplanation {
  rule: string;
  why: string;
  example: string;
  wrongExample?: string;
  hindiMeaning?: string;
}

export interface WordLinguisticBreakdown {
  word: string;
  role: string;
  whyUsed: string;
  category?: string;
  hindiMeaning?: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  hindiText?: string;
}

export interface LessonTheory {
  summary: string;
  hindiSummary?: string;
  rules: GrammarRuleExplanation[];
  wordExplanations?: WordLinguisticBreakdown[];
  dialogueExample?: DialogueLine[];
  proTip?: string;
  commonMistakesToAvoid?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  sentenceContext?: string;
  options: string[];
  correctAnswerIndex: number;
  explanationWhy: string; // Explains WHY this particular word/form/noun/tense is used
  grammaticalRole: string;
  hindiExplanation?: string;
}

export interface SentenceBuilderGameData {
  targetSentence: string;
  wordPool: string[];
  grammarBreakdown: string;
}

export interface WordMatchPair {
  id: string;
  word: string;
  definitionOrSynonym: string;
  whyItMatters: string;
}

export interface MistakeDetectiveData {
  incorrectSentence: string;
  correctSentence: string;
  mistakeWordIndex?: number;
  explanationWhy: string;
}

export interface RoleplayMessage {
  speaker: 'ai' | 'user';
  text: string;
  options?: Array<{ text: string; quality: 'best' | 'ok' | 'poor'; whyReason: string }>;
}

export interface MiniGameConfig {
  type: 'sentence_builder' | 'word_match' | 'mistake_detective' | 'roleplay';
  title: string;
  instructions: string;
  sentenceBuilder?: SentenceBuilderGameData[];
  wordPairs?: WordMatchPair[];
  mistakes?: MistakeDetectiveData[];
  roleplayScenario?: {
    setting: string;
    aiRole: string;
    initialPrompt: string;
  };
}

export interface DayLesson {
  id: string;
  dayNumber: number; // 1 to 90
  monthNumber: number; // 1, 2, or 3
  title: string;
  category: 'grammar' | 'vocabulary' | 'tenses' | 'conversation' | 'idioms' | 'pro_syntax';
  level: UserLevel | 'all';
  description: string;
  xpReward: number;
  estimatedMinutes: number;
  theory: LessonTheory;
  quiz: QuizQuestion[];
  miniGame?: MiniGameConfig;
}

export interface UserProgress {
  userId: string;
  name: string;
  userLevel: UserLevel;
  xp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedDayIds: string[];
  dayScores: Record<string, number>; // dayId -> score percentage (0-100)
  completedMonthExamScores?: Record<number, number>; // monthNumber (1,2,3) -> score percentage
  passedMonthNumbers?: number[]; // [1, 2, 3]
  unlockedBadges: string[];
  gems: number;
  hearts: number; // 1 to 5
  lastCheckInDate?: string; // YYYY-MM-DD when daily check-in was last claimed
  consecutiveCheckInStreak?: number; // current consecutive check-in streak length
}

export interface MonthExamQuestion {
  id: string;
  question: string;
  sentenceContext?: string;
  options: string[];
  correctAnswerIndex: number;
  explanationWhy: string;
  topicTag: string; // e.g. "Articles & Phonetics", "Subjunctive Mood", "Conditionals"
}

export interface MonthExam {
  monthNumber: number; // 1, 2, or 3
  title: string;
  subtitle: string;
  description: string;
  passingScorePercent: number; // 70 or 80
  xpReward: number;
  gemReward: number;
  questions: MonthExamQuestion[];
  badgeId: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: string;
}

export interface GrammarAnalysisResult {
  partOfSpeech: string;
  whyUsed: string;
  alternativeComparison: string;
  proTip: string;
}

export interface WordDeepDiveData {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  etymologyReason: string;
  synonyms: string[];
  antonyms: string[];
  commonCollocations: string[];
  exampleSentence: string;
  whyUsedInExample: string;
}
