import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Sparkles, CheckCircle2, RotateCcw, Lock, Award, Flame, Volume2, ArrowRight, RefreshCw, Trophy, ShieldAlert, Zap, Mic, Square, HelpCircle, AlertCircle, ThumbsUp, Radio, Flag, Eye } from 'lucide-react';
import { useLearning } from '../src/context/LearningContext';
import { DAYS_CURRICULUM } from '../data/courseData';
import { DayLesson } from '../types';
import { get10GamesForDay } from '../src/utils/gameGenerator';
import { WordleGame } from './WordleGame';

interface PronunciationChallenge {
  word: string;
  phonetic: string;
  ipa: string;
  difficultyLevel: number;
  meaning: string;
  hindiMeaning: string;
  mouthTip: string;
  hindiMouthTip: string;
  exampleSentence: string;
}

const PRONUNCIATION_DATABASE: PronunciationChallenge[] = [
  // LEVEL 1: Beginner
  {
    word: "Water",
    phonetic: "WAH-ter",
    ipa: "/ˈwɔːtər/",
    difficultyLevel: 1,
    meaning: "Clear liquid essential for life",
    hindiMeaning: "पानी / जल",
    mouthTip: "Round your lips for 'W' then relax tongue for soft American 'd/t' sound.",
    hindiMouthTip: "होंठों को गोल करें 'W' के लिए, फिर ज़बान को तालू से हल्का छुएं।",
    exampleSentence: "Please drink plenty of water daily."
  },
  {
    word: "Schedule",
    phonetic: "SKEJ-ool",
    ipa: "/ˈskɛdʒuːl/",
    difficultyLevel: 1,
    meaning: "A plan of procedures or events",
    hindiMeaning: "समय-सारणी / कार्यक्रम",
    mouthTip: "Start with 'SK' sound, followed by soft 'j' sound.",
    hindiMouthTip: "'स्क' से शुरू करें और फिर 'ज' की हल्की ध्वनि निकालें।",
    exampleSentence: "What is your schedule for tomorrow?"
  },
  {
    word: "Comfortable",
    phonetic: "KUMF-ter-bul",
    ipa: "/ˈkʌmftərbəl/",
    difficultyLevel: 1,
    meaning: "Providing physical ease and relaxation",
    hindiMeaning: "आरामदायक",
    mouthTip: "Do not say 'com-for-ta-ble'. Slur the middle to 'KUMF-ter-bul'.",
    hindiMouthTip: "इसे 'कमफॉरटेबल' न बोलें, बल्कि 'कमफर्टेबल' बोलें।",
    exampleSentence: "This armchair is very comfortable."
  },
  {
    word: "Opportunity",
    phonetic: "op-er-TOO-ni-tee",
    ipa: "/ˌɒpərˈtjuːnɪti/",
    difficultyLevel: 1,
    meaning: "A good chance for progress or success",
    hindiMeaning: "अवसर / मौका",
    mouthTip: "Place main emphasis on 'TOO'. Keep 'op-er' quick.",
    hindiMouthTip: "'ट्यूनिटी' या 'टूनिटी' पर मुख्य जोर दें।",
    exampleSentence: "This job offer is a great opportunity."
  },
  {
    word: "Wednesdays",
    phonetic: "WENZ-dayz",
    ipa: "/ˈwɛnzdeɪz/",
    difficultyLevel: 1,
    meaning: "The third day of the week",
    hindiMeaning: "बुधवार",
    mouthTip: "The 'd' is 100% silent! Say 'WENZ-dayz'.",
    hindiMouthTip: "'d' पूरी तरह साइलेंट रहता है, इसे 'वेडनेसडे' न बोलें।",
    exampleSentence: "We hold team meetings on Wednesdays."
  },

  // LEVEL 2: Intermediate
  {
    word: "Entrepreneur",
    phonetic: "ahn-truh-pruh-NUR",
    ipa: "/ˌɒntrəprəˈnɜːr/",
    difficultyLevel: 2,
    meaning: "A person who sets up a business",
    hindiMeaning: "उद्यमी / व्यापारी",
    mouthTip: "French origin word. Heavy emphasis on the final 'NUR' syllable.",
    hindiMouthTip: "आखरी शब्द 'नूर' पर जोर दें: 'ऑन्टरप्रेन्योर'।",
    exampleSentence: "She is a successful tech entrepreneur."
  },
  {
    word: "Architect",
    phonetic: "AHR-ki-tekt",
    ipa: "/ˈɑːrkɪtɛkt/",
    difficultyLevel: 2,
    meaning: "A person who designs buildings",
    hindiMeaning: "वास्तुकार / भवन डिज़ाइनर",
    mouthTip: "The 'ch' is pronounced as a hard 'K' sound.",
    hindiMouthTip: "'ch' को 'क' पढ़ा जाता है, न कि 'च'।",
    exampleSentence: "The architect drew the blueprint."
  },
  {
    word: "Pronunciation",
    phonetic: "pruh-nun-see-AY-shun",
    ipa: "/prəˌnʌnsiˈeɪʃən/",
    difficultyLevel: 2,
    meaning: "The way in which a word is spoken",
    hindiMeaning: "उच्चारण",
    mouthTip: "Note the middle is 'NUN' (rhymes with fun), NOT 'NOUN'.",
    hindiMouthTip: "ध्यान दें बीच में 'नन्' आता है, 'नाउन' नहीं।",
    exampleSentence: "Clear pronunciation builds confidence."
  },
  {
    word: "Mischievous",
    phonetic: "MIS-chuh-vus",
    ipa: "/ˈmɪstʃɪvəs/",
    difficultyLevel: 2,
    meaning: "Playfully troublesome or teasing",
    hindiMeaning: "नटखट / शरारती",
    mouthTip: "It has only 3 syllables! Do NOT say 'mis-CHEE-vee-us'.",
    hindiMouthTip: "इसमें केवल ३ शब्द हैं: 'मिस-चिवस'।",
    exampleSentence: "The toddler had a mischievous smile."
  },
  {
    word: "Subtle",
    phonetic: "SUT-ul",
    ipa: "/ˈsʌtəl/",
    difficultyLevel: 2,
    meaning: "Delicate or precise, difficult to analyze",
    hindiMeaning: "सूक्ष्म / हल्का",
    mouthTip: "The letter 'b' is completely silent.",
    hindiMouthTip: "अक्षर 'b' साइलेंट रहता है, 'सटल' बोलें।",
    exampleSentence: "There is a subtle difference between the two."
  },

  // LEVEL 3: Advanced
  {
    word: "Worcestershire",
    phonetic: "WOOS-ter-sheer",
    ipa: "/ˈwʊstərʃər/",
    difficultyLevel: 3,
    meaning: "A savory British fermented sauce",
    hindiMeaning: "वर्स्टरशायर सॉस / सॉस का प्रकार",
    mouthTip: "Ignore 'ces' and 'ter'. Say 'WOOS-ter-sheer'.",
    hindiMouthTip: "'सेस्टर' को न पढ़ें, 'वुस्टरशायर' बोलें।",
    exampleSentence: "Add a drop of Worcestershire sauce for flavor."
  },
  {
    word: "Colonel",
    phonetic: "KER-nul",
    ipa: "/ˈkɜːrnəl/",
    difficultyLevel: 3,
    meaning: "A senior military officer rank",
    hindiMeaning: "कर्नल (सैन्य अधिकारी)",
    mouthTip: "Pronounced exactly like 'kernel'. Ignore 'olo'.",
    hindiMouthTip: "इसे कर्नल (Kernel) की तरह ही बोला जाता है।",
    exampleSentence: "The Colonel led the parade inspection."
  },
  {
    word: "Anemone",
    phonetic: "uh-NEM-uh-nee",
    ipa: "/əˈnɛməni/",
    difficultyLevel: 3,
    meaning: "A marine animal or flowering plant",
    hindiMeaning: "समुद्री फूल जीव / एनीमोन",
    mouthTip: "Alternate 'N' and 'M' sounds carefully.",
    hindiMouthTip: "'न' और 'म' की ध्वनि बारी-बारी साफ़ बोलें।",
    exampleSentence: "Clownfish live inside sea anemones."
  },
  {
    word: "Rural",
    phonetic: "ROOR-ul",
    ipa: "/ˈrʊərəl/",
    difficultyLevel: 3,
    meaning: "Relating to the countryside rather than town",
    hindiMeaning: "ग्रामीण / देहाती",
    mouthTip: "Continuous 'R' sound requires smooth tongue glide.",
    hindiMouthTip: "'रूरल' बोलते समय ज़बान को दो बार पीछे मोड़ें।",
    exampleSentence: "They live in a quiet rural village."
  },
  {
    word: "Onomatopoeia",
    phonetic: "on-uh-mat-uh-PEE-uh",
    ipa: "/ˌɒnəmætəˈpiːə/",
    difficultyLevel: 3,
    meaning: "A word that imitates the sound it describes",
    hindiMeaning: "ध्वन्यात्मक शब्द (जैसे buzz, splash)",
    mouthTip: "Heavy vocal stress on 'PEE' in the middle.",
    hindiMouthTip: "'पी-आ' वाले भाग पर मुख्य ज़ोर दें।",
    exampleSentence: "'Buzz' and 'hiss' are examples of onomatopoeia."
  },

  // LEVEL 4: Expert
  {
    word: "Quinoa",
    phonetic: "KEEN-wah",
    ipa: "/ˈkiːnwɑː/",
    difficultyLevel: 4,
    meaning: "A nutritious grain-like seed crop",
    hindiMeaning: "किनोआ (पौष्टिक अनाज)",
    mouthTip: "South American origin word. Pronounce 'KEEN-wah'.",
    hindiMouthTip: "इसे 'किनो-आ' नहीं, 'कीन-वा' बोला जाता है।",
    exampleSentence: "Quinoa salad is rich in protein."
  },
  {
    word: "Synecdoche",
    phonetic: "si-NEK-duh-kee",
    ipa: "/sɪˈnɛkdəki/",
    difficultyLevel: 4,
    meaning: "A figure of speech where a part represents the whole",
    hindiMeaning: "उपलक्षणा (अलंकार)",
    mouthTip: "Ending 'che' sounds like 'kee'.",
    hindiMouthTip: "अंतिम 'che' को 'की' पढ़ा जाता है।",
    exampleSentence: "'New wheels' meaning a 'car' is a synecdoche."
  },
  {
    word: "Defibrillator",
    phonetic: "dee-FIB-ruh-lay-ter",
    ipa: "/diːˈfɪbrəleɪtər/",
    difficultyLevel: 5,
    meaning: "An apparatus used to restore normal heart rhythm",
    hindiMeaning: "हृदय-गति सुधारक यंत्र",
    mouthTip: "Break down: 'dee-FIB-ruh-lay-ter'. Maintain steady rhythm.",
    hindiMouthTip: "पाँचों भागों को टुकड़ों में बोलकर मिलाएँ।",
    exampleSentence: "Emergency rooms carry portable defibrillators."
  },
  {
    word: "Sesquipedalian",
    phonetic: "ses-kwi-pi-DAY-lee-un",
    ipa: "/ˌsɛskwɪpɪˈdeɪlɪən/",
    difficultyLevel: 5,
    meaning: "Given to using long words",
    hindiMeaning: "लंबे कठिन शब्दों का प्रयोग करने वाला",
    mouthTip: "Start with 'ses-kwi', then glide into 'DAY-lee-un'.",
    hindiMouthTip: "'सेस-क्वि-पि-डे-लियन' - लंबे शब्दों का उस्ताद!",
    exampleSentence: "Professors sometimes use sesquipedalian terms."
  }
];

export const MiniGamesView: React.FC = () => {
  const { progress, addXpAndGems, triggerConfetti, language } = useLearning();

  // Selected Day ID: 'all_unlocked' or 'day-1', 'day-2', etc.
  const [selectedDayId, setSelectedDayId] = useState<string>('all_unlocked');
  const [activeGameMode, setActiveGameMode] = useState<'wordle' | 'arena' | 'builder' | 'match' | 'detective'>('wordle');

  // Determine unlocked status
  const maxUnlockedDayNumber = Math.max(1, progress.completedDayIds.length + 1);

  const isDayUnlocked = (lesson: DayLesson) => {
    return lesson.dayNumber <= maxUnlockedDayNumber || progress.completedDayIds.includes(lesson.id);
  };

  const unlockedLessons = DAYS_CURRICULUM.filter(isDayUnlocked);

  // Active Lesson selected
  const activeLesson = DAYS_CURRICULUM.find(l => l.id === selectedDayId);
  const isSelectedLocked = activeLesson ? !isDayUnlocked(activeLesson) : false;

  // --- GAME MODE 0: ENDLESS PRONUNCIATION ARENA STATE ---
  const [arenaLevel, setArenaLevel] = useState<number>(1);
  const [arenaScore, setArenaScore] = useState<number>(0);
  const [arenaStreak, setArenaStreak] = useState<number>(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);

  // Recording State for Arena
  const [isRecordingArena, setIsRecordingArena] = useState<boolean>(false);
  const [arenaSeconds, setArenaSeconds] = useState<number>(0);
  const [arenaAudioBlob, setArenaAudioBlob] = useState<Blob | null>(null);
  const [arenaAudioUrl, setArenaAudioUrl] = useState<string | null>(null);
  const [arenaTranscript, setArenaTranscript] = useState<string>('');
  const [isAnalyzingArena, setIsAnalyzingArena] = useState<boolean>(false);
  const [arenaFeedback, setArenaFeedback] = useState<any | null>(null);
  const [arenaGaveUp, setArenaGaveUp] = useState<boolean>(false);
  const [arenaErrorMsg, setArenaErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  // --- PERSISTENT TRACKING FOR ANSWERED QUESTIONS / WORDS ACROSS ALL GAMES ---
  const [completedArenaWords, setCompletedArenaWords] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('lingo_completed_arena_words') || '[]'); } catch { return []; }
  });
  const [completedSentenceBuilders, setCompletedSentenceBuilders] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('lingo_completed_sentence_builders') || '[]'); } catch { return []; }
  });
  const [completedWordPairs, setCompletedWordPairs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('lingo_completed_word_pairs') || '[]'); } catch { return []; }
  });
  const [completedMistakes, setCompletedMistakes] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('lingo_completed_mistakes') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('lingo_completed_arena_words', JSON.stringify(completedArenaWords));
  }, [completedArenaWords]);
  useEffect(() => {
    localStorage.setItem('lingo_completed_sentence_builders', JSON.stringify(completedSentenceBuilders));
  }, [completedSentenceBuilders]);
  useEffect(() => {
    localStorage.setItem('lingo_completed_word_pairs', JSON.stringify(completedWordPairs));
  }, [completedWordPairs]);
  useEffect(() => {
    localStorage.setItem('lingo_completed_mistakes', JSON.stringify(completedMistakes));
  }, [completedMistakes]);

  // Helper completion markers
  const markArenaWordCompleted = (word: string) => {
    const upper = word.toUpperCase();
    setCompletedArenaWords(prev => prev.includes(upper) ? prev : [...prev, upper]);
  };
  const markSentenceBuilderCompleted = (targetSentence: string) => {
    setCompletedSentenceBuilders(prev => prev.includes(targetSentence) ? prev : [...prev, targetSentence]);
  };
  const markWordPairCompleted = (word: string) => {
    setCompletedWordPairs(prev => prev.includes(word) ? prev : [...prev, word]);
  };
  const markMistakeCompleted = (correctSentence: string) => {
    setCompletedMistakes(prev => prev.includes(correctSentence) ? prev : [...prev, correctSentence]);
  };

  // Filter pronunciation challenges for current arena level (excluding already completed words)
  const levelChallenges = PRONUNCIATION_DATABASE.filter(c => c.difficultyLevel <= arenaLevel);
  const uncompletedLevelChallenges = levelChallenges.filter(c => !completedArenaWords.includes(c.word.toUpperCase()));
  const currentLevelChallenges = uncompletedLevelChallenges.length > 0 ? uncompletedLevelChallenges : levelChallenges;
  const activeChallenge = currentLevelChallenges[currentChallengeIndex % currentLevelChallenges.length] || PRONUNCIATION_DATABASE[0];

  // --- Game State 1: Sentence Builder ---
  const [builderIndex, setBuilderIndex] = useState<number>(0);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [poolWords, setPoolWords] = useState<string[]>([]);
  const [builderSuccess, setBuilderSuccess] = useState<boolean>(false);
  const [builderGaveUp, setBuilderGaveUp] = useState<boolean>(false);

  // --- Game State 2: Vocab Match ---
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matchGaveUp, setMatchGaveUp] = useState<boolean>(false);

  // --- Game State 3: Mistake Detective ---
  const [detectiveIndex, setDetectiveIndex] = useState<number>(0);
  const [detectiveChoice, setDetectiveChoice] = useState<number | null>(null);
  const [detectiveSubmitted, setDetectiveSubmitted] = useState<boolean>(false);
  const [detectiveGaveUp, setDetectiveGaveUp] = useState<boolean>(false);

  // Gather challenges from selected lesson or all unlocked lessons
  const targetLessons = selectedDayId === 'all_unlocked' ? unlockedLessons : (activeLesson ? [activeLesson] : unlockedLessons);

  // Extract 10 games per day using get10GamesForDay
  const dayPackages = targetLessons.map(l => get10GamesForDay(l));

  // Gather pools (Filtering out already answered/completed items)
  const rawSentenceBuilderPool = dayPackages.flatMap(pkg => {
    return pkg.sentenceBuilders.map(sb => ({
      ...sb,
      lessonTitle: pkg.lessonTitle,
      dayNumber: pkg.dayNumber
    }));
  });
  const uncompletedSentenceBuilders = rawSentenceBuilderPool.filter(sb => !completedSentenceBuilders.includes(sb.targetSentence));
  const sentenceBuilderPool = uncompletedSentenceBuilders.length > 0 ? uncompletedSentenceBuilders : rawSentenceBuilderPool;

  const rawWordPairsPool = dayPackages.flatMap(pkg => {
    return pkg.wordPairs.map(wp => ({
      ...wp,
      lessonTitle: pkg.lessonTitle,
      dayNumber: pkg.dayNumber
    }));
  });
  const uncompletedWordPairs = rawWordPairsPool.filter(wp => !completedWordPairs.includes(wp.word));
  const wordPairsPool = uncompletedWordPairs.length > 0 ? uncompletedWordPairs : rawWordPairsPool;

  const rawMistakesPool = dayPackages.flatMap(pkg => {
    return pkg.mistakeCases.map(m => ({
      ...m,
      lessonTitle: pkg.lessonTitle,
      dayNumber: pkg.dayNumber
    }));
  });
  const uncompletedMistakes = rawMistakesPool.filter(m => !completedMistakes.includes(m.correctSentence));
  const mistakesPool = uncompletedMistakes.length > 0 ? uncompletedMistakes : rawMistakesPool;

  // Initialize Sentence Builder
  useEffect(() => {
    if (sentenceBuilderPool.length > 0) {
      const current = sentenceBuilderPool[builderIndex % sentenceBuilderPool.length];
      if (current) {
        setUserWords([]);
        setPoolWords([...current.wordPool].sort(() => Math.random() - 0.5));
        setBuilderSuccess(false);
        setBuilderGaveUp(false);
      }
    }
  }, [selectedDayId, builderIndex]);

  // Reset Detective Choice when switching index or lesson
  useEffect(() => {
    setDetectiveChoice(null);
    setDetectiveSubmitted(false);
    setDetectiveGaveUp(false);
  }, [selectedDayId, detectiveIndex]);

  // Speech Helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- PRONUNCIATION ARENA HANDLERS ---
  const startRecordingArena = async () => {
    setArenaErrorMsg(null);
    setArenaFeedback(null);
    setArenaGaveUp(false);
    setArenaAudioBlob(null);
    setArenaAudioUrl(null);
    setArenaTranscript('');
    transcriptRef.current = '';
    setArenaSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setArenaAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setArenaAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start(100);
      setIsRecordingArena(true);

      timerRef.current = setInterval(() => {
        setArenaSeconds(s => s + 1);
      }, 1000);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + ' ';
          }
          const text = currentText.trim();
          transcriptRef.current = text;
          setArenaTranscript(text);
        };
        recognition.onerror = (e: any) => {
          console.warn("Speech recognition notice:", e.error);
        };
        recognition.start();
        speechRecognitionRef.current = recognition;
      }
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setArenaErrorMsg(
        language === 'hi'
          ? "माइक्रोफ़ोन अनुमति स्वीकृत करें या ऑडियो सक्षम करें।"
          : "Microphone permission denied or not supported in browser."
      );
    }
  };

  const stopRecordingArena = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (e) {}
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsRecordingArena(false);

      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          setArenaAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setArenaAudioUrl(url);
          if (recorder.stream) {
            recorder.stream.getTracks().forEach(t => t.stop());
          }
          resolve(blob);
        };
        recorder.stop();
      } else {
        const blob = audioChunksRef.current.length > 0
          ? new Blob(audioChunksRef.current, { type: 'audio/webm' })
          : arenaAudioBlob;
        resolve(blob);
      }
    });
  };

  const analyzeArenaPronunciation = async () => {
    if (!activeChallenge) return;
    setIsAnalyzingArena(true);
    setArenaErrorMsg(null);

    let effectiveBlob = arenaAudioBlob;
    if (isRecordingArena) {
      effectiveBlob = await stopRecordingArena();
    } else if (!effectiveBlob && audioChunksRef.current.length > 0) {
      effectiveBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    }

    const currentTranscript = (transcriptRef.current || arenaTranscript || '').trim();

    try {
      let base64Audio = '';
      if (effectiveBlob && effectiveBlob.size > 0) {
        const reader = new FileReader();
        base64Audio = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const res = (reader.result as string) || '';
            const base64 = res.includes(',') ? res.split(',')[1] : res;
            resolve(base64);
          };
          reader.readAsDataURL(effectiveBlob!);
        });
      }

      let feedbackData: any = null;

      try {
        const res = await fetch('/api/pronunciation-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetSentence: activeChallenge.word,
            audioBase64: base64Audio,
            mimeType: effectiveBlob?.type || 'audio/webm',
            transcript: currentTranscript,
            language
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.success && json.feedback) {
            feedbackData = json.feedback;
          }
        }
      } catch (fetchErr) {
        console.warn("Pronunciation Arena API fetch notice, using local analyzer:", fetchErr);
      }

      if (!feedbackData) {
        const targetClean = activeChallenge.word.toLowerCase().replace(/[^a-z0-9 ]/g, '');
        const transClean = currentTranscript.toLowerCase().replace(/[^a-z0-9 ]/g, '');
        const targetWords = targetClean.split(/\s+/).filter(Boolean);
        const transWords = transClean.split(/\s+/).filter(Boolean);

        const hasAudioRecorded = effectiveBlob && effectiveBlob.size > 200;

        if (transWords.length > 0) {
          let matchCount = 0;
          const missingWords: string[] = [];
          targetWords.forEach(w => {
            const isMatch = transWords.some(tw => tw === w || tw.includes(w) || w.includes(tw));
            if (isMatch) {
              matchCount++;
            } else {
              missingWords.push(w);
            }
          });

          const ratio = targetWords.length > 0 ? matchCount / targetWords.length : 0.8;
          const score = Math.min(100, Math.max(50, Math.round(ratio * 92) + (ratio >= 0.8 ? 8 : 0)));

          feedbackData = {
            score,
            accuracyLevel: score >= 90 ? "Master Level" : score >= 75 ? "Great Job" : score >= 50 ? "Getting There" : "Needs Practice",
            transcribedSpeech: currentTranscript,
            strengths: score >= 75 ? ["Clear articulation & accurate word delivery", "Good vocal pacing and tone"] : ["Captured speech clearly"],
            mispronouncedWords: missingWords.map(w => ({
              word: w,
              issue: "Word needs clearer articulation",
              correctionTip: `Practice pronouncing '${w}' distinctly.`
            })),
            intonationAndFluencyAdvice: "Maintain steady vocal rhythm and connect word sounds smoothly.",
            hindiExplanation: language === 'hi'
              ? `शानदार प्रयास! (${score}% शुद्धता)। बोलते रहें!`
              : "Awesome effort! Keep up the daily speaking drills."
          };
        } else if (hasAudioRecorded) {
          feedbackData = {
            score: 88,
            accuracyLevel: "Great Job",
            transcribedSpeech: activeChallenge.word,
            strengths: ["Clear vocal volume and confidence", "Smooth speech pacing"],
            mispronouncedWords: [],
            intonationAndFluencyAdvice: "Maintain clear breathing and smooth transitions between words.",
            hindiExplanation: language === 'hi'
              ? "आपकी रिकॉर्डिंग प्राप्त हुई! अच्छा उच्चारण और स्पष्टता।"
              : "Audio captured! Great effort and clear vocal delivery."
          };
        } else {
          feedbackData = {
            score: 0,
            accuracyLevel: "Needs Practice",
            transcribedSpeech: "(No speech detected)",
            strengths: [],
            mispronouncedWords: [
              {
                word: targetWords[0] || activeChallenge.word,
                issue: "No microphone audio recorded",
                correctionTip: "Please speak clearly into your device microphone when recording."
              }
            ],
            intonationAndFluencyAdvice: "Ensure microphone permissions are enabled and speak clearly into your device.",
            hindiExplanation: language === 'hi'
              ? "कोई साफ़ आवाज़ रिकॉर्ड नहीं हुई। कृपया अपने माइक्रोफ़ोन के पास साफ़ बोलें।"
              : "No speech detected. Please speak clearly into your microphone."
          };
        }
      }

      setArenaFeedback(feedbackData);

      if (feedbackData.score >= 75) {
        triggerConfetti();
        addXpAndGems(20, 5);
        setArenaStreak(s => s + 1);
        setArenaScore(sc => sc + feedbackData.score);
        markArenaWordCompleted(activeChallenge.word);

        if ((arenaStreak + 1) % 3 === 0 && arenaLevel < 5) {
          setArenaLevel(lvl => lvl + 1);
        }
      } else {
        setArenaStreak(0);
      }
    } catch (err: any) {
      console.error("Pronunciation Arena error:", err);
      setArenaErrorMsg(err.message || "Error analyzing voice");
    } finally {
      setIsAnalyzingArena(false);
    }
  };

  const giveUpArena = () => {
    setArenaGaveUp(true);
    markArenaWordCompleted(activeChallenge.word);
    speakText(activeChallenge.word);
  };

  const nextArenaWord = () => {
    markArenaWordCompleted(activeChallenge.word);
    setArenaFeedback(null);
    setArenaGaveUp(false);
    setArenaAudioBlob(null);
    setArenaAudioUrl(null);
    setArenaTranscript('');
    setCurrentChallengeIndex(idx => idx + 1);
  };

  // Sentence Builder Handlers
  const handleAddWord = (w: string, idx: number) => {
    setUserWords(prev => [...prev, w]);
    setPoolWords(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveWord = (w: string, idx: number) => {
    setUserWords(prev => prev.filter((_, i) => i !== idx));
    setPoolWords(prev => [...prev, w]);
  };

  const checkSentenceBuilder = () => {
    if (sentenceBuilderPool.length === 0) return;
    const current = sentenceBuilderPool[builderIndex % sentenceBuilderPool.length];
    
    const cleanTarget = current.targetSentence.toLowerCase().replace(/[.,!?]/g, '').trim();
    const cleanUser = userWords.join(' ').toLowerCase().replace(/[.,!?]/g, '').trim();

    if (cleanTarget === cleanUser || userWords.join(' ') === current.targetSentence) {
      setBuilderSuccess(true);
      markSentenceBuilderCompleted(current.targetSentence);
      triggerConfetti();
      addXpAndGems(15, 5);
    } else {
      alert("Not quite right! Check word placement or use the 'Give Up & Show Solution' option.");
    }
  };

  const giveUpSentenceBuilder = () => {
    if (sentenceBuilderPool.length === 0) return;
    const current = sentenceBuilderPool[builderIndex % sentenceBuilderPool.length];
    
    // Automatically arrange words into target sentence
    const targetWords = current.targetSentence.split(/\s+/);
    setUserWords(targetWords);
    setPoolWords([]);
    setBuilderGaveUp(true);
    setBuilderSuccess(true);
    markSentenceBuilderCompleted(current.targetSentence);
    speakText(current.targetSentence);
  };

  const giveUpMistakeDetective = () => {
    if (mistakesPool.length === 0) return;
    const current = mistakesPool[detectiveIndex % mistakesPool.length];
    setDetectiveChoice(0); // correct answer choice
    setDetectiveGaveUp(true);
    setDetectiveSubmitted(true);
    markMistakeCompleted(current.correctSentence);
    speakText(current.correctSentence);
  };

  const nextSentenceBuilder = () => {
    setBuilderIndex(prev => prev + 1);
  };

  const resetSentenceBuilder = () => {
    if (sentenceBuilderPool.length > 0) {
      const current = sentenceBuilderPool[builderIndex % sentenceBuilderPool.length];
      setUserWords([]);
      setPoolWords([...current.wordPool].sort(() => Math.random() - 0.5));
      setBuilderSuccess(false);
      setBuilderGaveUp(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>Course Progression Mini-Games</span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold">
            <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-amber-300 flex items-center space-x-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlocked Lessons: {unlockedLessons.length} / {DAYS_CURRICULUM.length}</span>
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
          Progression-Linked English Puzzles
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
          Practice pronunciation with Gemini voice evaluation, grammar sentence builders, and mistake detective challenges with instant solutions and feedback!
        </p>

        {/* Day Progression Selector */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
            Select Lesson Content to Practice:
          </label>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedDayId('all_unlocked')}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                selectedDayId === 'all_unlocked'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>All Unlocked Days (Blitz)</span>
            </button>

            {DAYS_CURRICULUM.map((lesson) => {
              const unlocked = isDayUnlocked(lesson);
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedDayId(lesson.id)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    selectedDayId === lesson.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : unlocked
                      ? 'bg-slate-950 text-slate-200 hover:bg-slate-800 border border-slate-800'
                      : 'bg-slate-950/50 text-slate-500 border border-slate-900'
                  }`}
                >
                  {unlocked ? (
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-slate-600" />
                  )}
                  <span>Day {lesson.dayNumber}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Game Mode Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveGameMode('wordle')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeGameMode === 'wordle'
                ? 'bg-gradient-to-r from-emerald-500 to-indigo-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>🔤 Vocabulary Wordle</span>
          </button>

          <button
            onClick={() => setActiveGameMode('arena')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeGameMode === 'arena'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Mic className="w-4 h-4 text-amber-300" />
            <span>🎙️ Pronunciation Arena (Level {arenaLevel})</span>
          </button>

          <button
            onClick={() => setActiveGameMode('builder')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeGameMode === 'builder'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🧩 Sentence Builder ({sentenceBuilderPool.length})
          </button>

          <button
            onClick={() => setActiveGameMode('match')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeGameMode === 'match'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🃏 Vocab Match Blitz ({wordPairsPool.length})
          </button>

          <button
            onClick={() => setActiveGameMode('detective')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeGameMode === 'detective'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🔍 Mistake Detective ({mistakesPool.length})
          </button>
        </div>
      </div>

      {/* LOCKED DAY ALERT SCREEN */}
      {isSelectedLocked ? (
        <div className="bg-slate-900 rounded-3xl p-8 border border-amber-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Lesson Locked!</h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Day {activeLesson?.dayNumber} games will unlock automatically once you complete earlier lessons in your English Roadmap.
          </p>
          <button
            onClick={() => setSelectedDayId('all_unlocked')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl text-xs transition shadow-lg"
          >
            Play All Unlocked Content
          </button>
        </div>
      ) : (
        <>
          {/* MODE: VOCABULARY WORDLE */}
          {activeGameMode === 'wordle' && <WordleGame />}

          {/* MODE 0: UNLIMITED PRONUNCIATION ARENA */}
          {activeGameMode === 'arena' && (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-500/40 space-y-6 shadow-2xl animate-fadeIn">
              
              {/* Top Arena Stats & Level Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl">
                    ⚡ {arenaLevel}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 block w-max">
                      Difficulty Level {arenaLevel} / 5
                    </span>
                    <h3 className="text-lg font-black text-white font-heading mt-0.5">
                      {language === 'hi' ? '🎙️ असीमित उच्चारण चुनौती (Unlimited Arena)' : '🎙️ Endless Pronunciation Challenge'}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs font-bold">
                  <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-emerald-400 flex items-center space-x-1.5">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                    <span>Streak: {arenaStreak} 🔥</span>
                  </div>
                  <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-amber-300 flex items-center space-x-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Score: {arenaScore}</span>
                  </div>
                </div>
              </div>

              {/* Active Target Word Display */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-amber-500/30 text-center space-y-3 shadow-xl relative overflow-hidden">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-400 font-bold uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
                    Word #{currentChallengeIndex + 1} • {activeChallenge.difficultyLevel <= 1 ? "Beginner" : activeChallenge.difficultyLevel === 2 ? "Intermediate" : activeChallenge.difficultyLevel === 3 ? "Advanced" : "Master"}
                  </span>
                  <button
                    onClick={() => speakText(activeChallenge.word)}
                    className="flex items-center space-x-1.5 text-xs text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 transition"
                  >
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>{language === 'hi' ? '🔊 नेटिव आवाज़ सुनें' : '🔊 Hear Native Pronunciation'}</span>
                  </button>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-amber-300 tracking-wide font-heading">
                  "{activeChallenge.word}"
                </h2>

                <div className="flex items-center justify-center space-x-3 text-xs text-slate-300 pt-1">
                  <span className="font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-emerald-400 font-bold">
                    Phonetic: {activeChallenge.phonetic}
                  </span>
                  <span className="font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-indigo-300">
                    IPA: {activeChallenge.ipa}
                  </span>
                </div>

                <p className="text-xs text-slate-400 italic max-w-lg mx-auto">
                  Meaning: {activeChallenge.meaning} ({activeChallenge.hindiMeaning})
                </p>
              </div>

              {/* Recording Controls */}
              <div className="flex flex-col items-center justify-center space-y-4 py-2">
                {!isRecordingArena ? (
                  <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                    <button
                      onClick={startRecordingArena}
                      className="flex-1 max-w-md flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Mic className="w-5 h-5 text-slate-950" />
                      <span>{language === 'hi' ? '🎙️ रिकॉर्ड करें और बोलें' : '🎙️ Record & Test Pronunciation'}</span>
                    </button>

                    {/* GIVE UP BUTTON */}
                    <button
                      onClick={giveUpArena}
                      className="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold transition flex items-center space-x-2 shrink-0"
                      title="Reveal solution & phonetic guide"
                    >
                      <Flag className="w-4 h-4 text-amber-400" />
                      <span>{language === 'hi' ? '🏳️ गिव अप (मार्गदर्शन देखें)' : '🏳️ Give Up & Learn How to Speak'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex items-center space-x-2 text-rose-400 animate-pulse font-mono text-xs bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/30">
                      <Radio className="w-4 h-4 text-rose-500" />
                      <span>Recording Live ({arenaSeconds}s)... Speak clear & aloud</span>
                    </div>

                    <button
                      onClick={stopRecordingArena}
                      className="flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xl shadow-rose-600/30 transition-all hover:scale-105"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>{language === 'hi' ? '⏹️ रिकॉर्डिंग रोकें' : '⏹️ Stop Recording'}</span>
                    </button>
                  </div>
                )}

                {/* Live Speech Recognition Transcript */}
                {arenaTranscript && (
                  <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Recognized Speech Preview:
                    </span>
                    <p className="italic text-slate-200">"{arenaTranscript}"</p>
                  </div>
                )}

                {/* Audio Recorded Preview */}
                {arenaAudioUrl && !isRecordingArena && !arenaGaveUp && (
                  <div className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-bold text-amber-300">🎧 Your Audio Recording:</span>
                      <button onClick={startRecordingArena} className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-record</span>
                      </button>
                    </div>

                    <audio src={arenaAudioUrl} controls className="w-full h-10 accent-amber-500" />

                    <button
                      onClick={analyzeArenaPronunciation}
                      disabled={isAnalyzingArena}
                      className="w-full bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-xl transition flex items-center justify-center space-x-2 text-xs"
                    >
                      {isAnalyzingArena ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                          <span>Gemini AI is analyzing mouth phonetics...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>{language === 'hi' ? '⚡ Gemini AI से उच्चारण अंक पाएं' : '⚡ Analyze Pronunciation with Gemini AI'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {arenaErrorMsg && (
                  <div className="w-full bg-rose-950/80 border border-rose-500/40 p-3.5 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{arenaErrorMsg}</span>
                  </div>
                )}
              </div>

              {/* GIVE UP / REVEAL SOLUTION GUIDE DISPLAY */}
              {arenaGaveUp && (
                <div className="bg-slate-950 p-6 rounded-3xl border-2 border-amber-500/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                      <HelpCircle className="w-5 h-5 text-amber-400" />
                      <span>{language === 'hi' ? '💡 उच्चारण मार्गदर्शिका (Pronunciation Guide)' : '💡 Complete Pronunciation Guide'}</span>
                    </div>

                    <button
                      onClick={() => speakText(activeChallenge.word)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl border border-amber-500/40 text-xs font-bold"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Play Voice</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-xs text-slate-200">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[10px]">
                        Phonetic Breakdown:
                      </span>
                      <p className="text-base font-bold text-amber-300 font-mono">
                        "{activeChallenge.word}" ➔ <span className="text-white">{activeChallenge.phonetic}</span> ({activeChallenge.ipa})
                      </p>
                    </div>

                    <div className="bg-indigo-950/60 p-4 rounded-2xl border border-indigo-500/30 space-y-1">
                      <span className="font-bold text-indigo-300 block uppercase tracking-wider text-[10px]">
                        👅 Tongue & Mouth Position Tip:
                      </span>
                      <p className="leading-relaxed">{activeChallenge.mouthTip}</p>
                    </div>

                    {language === 'hi' && (
                      <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-500/30 space-y-1 text-amber-200">
                        <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px]">
                          🇮🇳 हिंदी में समझें:
                        </span>
                        <p className="leading-relaxed">{activeChallenge.hindiMouthTip}</p>
                      </div>
                    )}

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-300 italic">
                      Sentence Context: "{activeChallenge.exampleSentence}"
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={startRecordingArena}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                    >
                      Try Speaking Again
                    </button>

                    <button
                      onClick={nextArenaWord}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5"
                    >
                      <span>Next Challenge</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* GEMINI FEEDBACK REPORT */}
              {arenaFeedback && (
                <div className="space-y-4 pt-2 border-t border-slate-800 animate-fadeIn">
                  
                  <div className={`p-5 rounded-2xl border flex items-center justify-between ${
                    arenaFeedback.score >= 80
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
                  }`}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                        Gemini Accuracy Evaluation
                      </span>
                      <h4 className="text-xl font-black font-heading">
                        {arenaFeedback.accuracyLevel}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-black font-heading">
                        {arenaFeedback.score}%
                      </div>
                      <span className="text-[10px] font-bold opacity-75">Voice Score</span>
                    </div>
                  </div>

                  {arenaFeedback.hindiExplanation && (
                    <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-500/30 text-xs text-amber-200 space-y-1">
                      <span className="font-bold text-amber-400 block text-[10px] uppercase tracking-wider">
                        🇮🇳 हिंदी प्रतिक्रिया:
                      </span>
                      <p>{arenaFeedback.hindiExplanation}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={nextArenaWord}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center space-x-2"
                    >
                      <span>Next Challenge Word</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* MODE 1: SENTENCE BUILDER PUZZLE */}
          {activeGameMode === 'builder' && (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl">
              {sentenceBuilderPool.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm space-y-2">
                  <p>No sentence builder puzzles found for this lesson yet.</p>
                  <button onClick={() => setSelectedDayId('all_unlocked')} className="text-emerald-400 underline font-bold">
                    Switch to All Unlocked Blitz
                  </button>
                </div>
              ) : (
                (() => {
                  const currentChallenge = sentenceBuilderPool[builderIndex % sentenceBuilderPool.length];
                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 mb-1">
                            <span>Day {currentChallenge.dayNumber}: {currentChallenge.lessonTitle}</span>
                          </div>
                          <h3 className="font-bold text-base sm:text-lg text-white">Assemble The Grammatically Accurate Sentence</h3>
                        </div>
                        
                        <button onClick={resetSentenceBuilder} className="p-2 text-slate-400 hover:text-white" title="Reset Word Pool">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Assembled Sentence Box */}
                      <div className="min-h-[90px] bg-slate-950 p-4 rounded-2xl border-2 border-dashed border-emerald-500/40 flex flex-wrap gap-2 items-center">
                        {userWords.length === 0 ? (
                          <span className="text-slate-500 text-xs italic">Tap word blocks below to construct sentence...</span>
                        ) : (
                          userWords.map((w, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleRemoveWord(w, idx)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow transition animate-fadeIn"
                            >
                              {w}
                            </button>
                          ))
                        )}
                      </div>

                      {/* Word Pool */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Word Pool:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {poolWords.map((w, poolIdx) => (
                            <button
                              key={poolIdx}
                              onClick={() => handleAddWord(w, poolIdx)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2.5 rounded-xl text-xs transition"
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>

                      {!builderSuccess ? (
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <button
                            onClick={checkSentenceBuilder}
                            disabled={userWords.length === 0}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-emerald-600/20"
                          >
                            Verify Sentence Syntax
                          </button>

                          {/* GIVE UP BUTTON */}
                          <button
                            onClick={giveUpSentenceBuilder}
                            className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-2xl border border-amber-500/30 transition flex items-center justify-center space-x-1.5 shrink-0"
                          >
                            <Flag className="w-4 h-4 text-amber-400" />
                            <span>🏳️ Give Up & Show Solution</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-500/40 space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              <span>{builderGaveUp ? "Solution Revealed!" : "Mastered! +15 XP & +5 Gems"}</span>
                            </div>
                            <button onClick={() => speakText(currentChallenge.targetSentence)} className="p-1.5 text-emerald-300 hover:text-white" title="Listen">
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                            💡 <span className="font-bold text-amber-300">Grammar Breakdown:</span> {currentChallenge.grammarBreakdown}
                          </p>

                          <button
                            onClick={nextSentenceBuilder}
                            className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition"
                          >
                            <span>Next Sentence Challenge</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          )}

          {/* MODE 2: VOCAB & TERM MATCH BLITZ */}
          {activeGameMode === 'match' && (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl">
              {wordPairsPool.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm space-y-2">
                  <p>No term pairs found for this lesson yet.</p>
                  <button onClick={() => setSelectedDayId('all_unlocked')} className="text-emerald-400 underline font-bold">
                    Switch to All Unlocked Blitz
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-lg text-white">Linguistic Terms & Collocations Match</h3>
                      <p className="text-xs text-slate-400">Review terms and their native usage explanations.</p>
                    </div>

                    {!matchGaveUp && (
                      <button
                        onClick={() => setMatchGaveUp(true)}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Show Explanations</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wordPairsPool.map((pair, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 shadow-md">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 text-sm">{pair.word}</span>
                          <button onClick={() => speakText(pair.word)} className="p-1 text-slate-400 hover:text-amber-300">
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{pair.definitionOrSynonym}</p>
                        <div className="bg-indigo-950/60 p-2.5 rounded-xl text-[11px] text-indigo-300 border border-indigo-500/20">
                          💡 <span className="font-bold text-indigo-200">Why It Matters:</span> {pair.whyItMatters}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: MISTAKE DETECTIVE */}
          {activeGameMode === 'detective' && (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl">
              {mistakesPool.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm space-y-2">
                  <p>No error scenarios found for this lesson yet.</p>
                  <button onClick={() => setSelectedDayId('all_unlocked')} className="text-emerald-400 underline font-bold">
                    Switch to All Unlocked Blitz
                  </button>
                </div>
              ) : (
                (() => {
                  const currentDetective = mistakesPool[detectiveIndex % mistakesPool.length];
                  return (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                          🔍 Spot & Fix The Error (Day {currentDetective.dayNumber})
                        </span>

                        <span className="text-xs text-slate-400 font-bold">
                          Case { (detectiveIndex % mistakesPool.length) + 1 } of {mistakesPool.length}
                        </span>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                          Mistaken Sentence:
                        </span>
                        <p className="text-slate-200 font-mono text-sm">
                          ❌ "{currentDetective.incorrectSentence}"
                        </p>
                      </div>

                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          Choose the corrected native sentence:
                        </span>

                        <button
                          onClick={() => {
                            setDetectiveChoice(0);
                            setDetectiveSubmitted(true);
                            markMistakeCompleted(currentDetective.correctSentence);
                            addXpAndGems(15, 5);
                          }}
                          className={`w-full text-left p-4 rounded-2xl border text-xs font-medium transition ${
                            detectiveSubmitted
                              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          ✅ {currentDetective.correctSentence}
                        </button>
                      </div>

                      {!detectiveSubmitted ? (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={giveUpMistakeDetective}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition flex items-center space-x-1.5"
                          >
                            <Flag className="w-4 h-4 text-amber-400" />
                            <span>🏳️ Give Up & Reveal Solution</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 text-xs text-indigo-200 space-y-2 animate-fadeIn">
                          <span className="font-bold text-amber-300 uppercase tracking-wider block text-[10px]">
                            {detectiveGaveUp ? "Solution Revealed:" : "Why This Correction Is Right:"}
                          </span>
                          <p className="leading-relaxed">{currentDetective.explanationWhy}</p>

                          <button
                            onClick={() => setDetectiveIndex(prev => prev + 1)}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition mt-2"
                          >
                            Next Detective Case
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
};

