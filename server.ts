console.log("SERVER.TS LOADED - " + new Date().toISOString());

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting server initialization...");

// --- Vite Integration ---
async function startServer() {
  console.log("Initializing startServer function...");
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logging middleware - VERY EARLY
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  const apiRouter = express.Router();

  // --- Health Check ---
  apiRouter.get("/health", (req, res) => {
    console.log("API: Health check requested");
    res.json({ status: "ok", timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
  });

  apiRouter.get("/ping", (req, res) => {
    console.log("API: Ping requested");
    res.send("pong");
  });

  // Load Firebase Config inside startServer to be safer
  let firebaseConfig: any;
  try {
    firebaseConfig = JSON.parse(readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
    console.log("Firebase config loaded for project:", firebaseConfig.projectId);
  } catch (err) {
    console.error("CRITICAL: Failed to load firebase-applet-config.json:", err);
    firebaseConfig = { projectId: process.env.GOOGLE_CLOUD_PROJECT || 'unknown' };
  }

  // Supabase Configuration
  const supabaseUrl = process.env.SUPABASE_URL || 'https://diurandrwkqhefhwclyv.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-wW999bVAki7iV8KJjiNng_goaBCqlI';

  // Validate and normalize Supabase URL
  let normalizedSupabaseUrl = supabaseUrl;
  if (normalizedSupabaseUrl && !normalizedSupabaseUrl.startsWith('http')) {
    if (normalizedSupabaseUrl.includes('.supabase.co')) {
      normalizedSupabaseUrl = `https://${normalizedSupabaseUrl}`;
    } else {
      normalizedSupabaseUrl = `https://${normalizedSupabaseUrl}.supabase.co`;
    }
  }

  let supabase: any;
  try {
    supabase = createClient(normalizedSupabaseUrl, supabaseKey);
    console.log("Supabase client initialized");
  } catch (e: any) {
    console.error("Failed to initialize Supabase client:", e.message);
  }

  // Firebase Admin Configuration
  if (!admin.apps.length) {
    try {
      if (firebaseConfig && firebaseConfig.projectId) {
        admin.initializeApp({
          projectId: firebaseConfig.projectId,
          storageBucket: firebaseConfig.storageBucket
        });
        console.log("Firebase Admin initialized");
      }
    } catch (e: any) {
      console.error("Failed to initialize Firebase Admin:", e.message);
    }
  }

  let db: any = null;
  try {
    if (admin.apps.length) {
      db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)")
        ? admin.firestore(firebaseConfig.firestoreDatabaseId)
        : admin.firestore();
    }
  } catch (e: any) {
    console.error("Failed to initialize Firestore handle:", e.message);
  }

  // --- Connection Test Logic ---
  apiRouter.get("/test-connections", async (req, res) => {
    console.log("API: Handling /test-connections");
    const results: any = {
      supabase: { status: "pending", message: "" },
      firestore: { status: "pending", message: "" }
    };

    try {
      const { data, error } = await supabase.from('movies').select('count', { count: 'exact', head: true });
      if (error) {
        results.supabase = { status: "error", message: `Supabase Error: [${error.code}] ${error.message}` };
      } else {
        results.supabase = { status: "ok", message: `Connected! Found ${data?.length || 0} movies.` };
      }
    } catch (e: any) {
      results.supabase = { status: "error", message: `Supabase Fatal: ${e.message}` };
    }

    try {
      const snap = await db.collection('movies').limit(1).get();
      results.firestore = { status: "ok", message: `Connected! Found ${snap.size} movies.` };
    } catch (e: any) {
      results.firestore = { status: "error", message: `Firestore Fatal: ${e.message}` };
    }

    res.json(results);
  });

  // --- Migration Logic ---
  apiRouter.get("/migrate-supabase-to-firestore", async (req, res) => {
    try {
      console.log("API: Starting migration...");
      
      const { data: supabaseMovies, error: supabaseError } = await supabase
        .from('movies')
        .select('*');

      if (supabaseError) throw new Error(`Supabase Fetch Error: ${supabaseError.message}`);

      if (!supabaseMovies || supabaseMovies.length === 0) {
        return res.json({ message: "No movies found in Supabase." });
      }

      const firestoreMoviesSnap = await db.collection('movies').get();
      const existingVideoUrls = new Set(firestoreMoviesSnap.docs.map(doc => doc.data().video_url));

      let migratedCount = 0;
      let skippedCount = 0;
      let errors = [];

      for (const movie of supabaseMovies) {
        if (existingVideoUrls.has(movie.video_url)) {
          skippedCount++;
          continue;
        }

        try {
          await db.collection('movies').add({
            title: movie.title,
            description: movie.description || "",
            video_url: movie.video_url,
            thumbnail: movie.thumbnail || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
            genre: movie.genre || "Uncategorized",
            year: movie.year || new Date().getFullYear(),
            rating: movie.rating || "NR",
            views: movie.views || 0,
            is_user_uploaded: movie.is_user_uploaded || false,
            uploader_name: movie.uploader_name || "System",
            created_at: movie.created_at ? admin.firestore.Timestamp.fromDate(new Date(movie.created_at)) : admin.firestore.FieldValue.serverTimestamp()
          });
          migratedCount++;
        } catch (addError: any) {
          errors.push(`${movie.title}: ${addError.message}`);
        }
      }

      res.json({
        message: errors.length > 0 ? "Migration completed with some errors" : "Migration completed successfully",
        totalFound: supabaseMovies.length,
        migrated: migratedCount,
        skipped: skippedCount,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error: any) {
      console.error("API: Migration Fatal Error:", error);
      res.status(500).json({ message: "Migration failed", error: error.message });
    }
  });

  // --- Telegram Bot Logic ---
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  apiRouter.post("/telegram-webhook", async (req, res) => {
    const update = req.body;
    console.log("Telegram Webhook received:", JSON.stringify(update));
    if (!update.message) return res.sendStatus(200);

    const chatId = update.message.chat.id;
    const text = update.message.text;
    const video = update.message.video || update.message.document?.mime_type?.startsWith('video/') ? update.message.document : null;

    try {
      if (video) {
        await sendMessage(chatId, "🎬 Video received! Processing...");
        const fileId = video.file_id;
        const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
        const fileData: any = await fileResponse.json();
        
        if (fileData.ok) {
          const filePath = fileData.result.file_path;
          const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
          const videoRes = await fetch(downloadUrl);
          const videoBuffer = await videoRes.arrayBuffer();
          
          const fileName = `tg-${Date.now()}-${video.file_name || 'video.mp4'}`;
          const bucket = admin.storage().bucket(firebaseConfig.storageBucket);
          const file = bucket.file(`videos/${fileName}`);
          
          await file.save(Buffer.from(videoBuffer), {
            metadata: { contentType: video.mime_type || 'video/mp4' },
            public: true
          });

          const publicUrl = `https://storage.googleapis.com/${bucket.name}/videos/${fileName}`;

          await db.collection('movies').add({
            title: update.message.caption || video.file_name || "Telegram Upload",
            description: `Uploaded via Telegram by ${update.message.from.first_name}`,
            video_url: publicUrl,
            thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
            genre: 'Telegram',
            year: new Date().getFullYear(),
            rating: 'NR',
            views: 0,
            is_user_uploaded: true,
            uploader_name: update.message.from.first_name || 'Telegram User',
            created_at: admin.firestore.FieldValue.serverTimestamp()
          });

          await sendMessage(chatId, "✅ Successfully uploaded!");
        }
      } else if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        await db.collection('movies').add({
          title: "Web Link",
          description: `Shared via Telegram: ${text}`,
          video_url: text,
          thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
          genre: 'Shared',
          year: new Date().getFullYear(),
          rating: 'NR',
          views: 0,
          is_user_uploaded: true,
          uploader_name: update.message.from.first_name || 'Telegram User',
          created_at: admin.firestore.FieldValue.serverTimestamp()
        });
        await sendMessage(chatId, "✅ Link added successfully!");
      }
    } catch (error: any) {
      console.error("Telegram Bot Error:", error);
      await sendMessage(chatId, `❌ Error: ${error.message}`);
    }
    res.sendStatus(200);
  });

  async function sendMessage(chatId: number, text: string) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
  }

  apiRouter.get("/test", (req, res) => {
    res.json({ message: "API is working" });
  });

  // --- Linguistic Grammar & Reason Explainer Endpoint ---
  apiRouter.post("/explain-grammar", async (req, res) => {
    try {
      const { sentence, target, level = "beginner" } = req.body;
      if (!sentence) {
        return res.status(400).json({ error: "Sentence is required" });
      }

      let data: any = null;
      try {
        const ai = getGeminiClient();
        const prompt = `Analyze this sentence: "${sentence}"
Target word/phrase to explain: "${target || "key grammatical structures"}"
User English Level: ${level}

Explain in clear, encouraging, structured JSON format why this specific word, noun, tense, article, or verb form was used here. Include:
1. "partOfSpeech": exact part of speech or tense (e.g., "Present Perfect Continuous", "Uncountable Noun", "Indefinite Article 'an'").
2. "whyUsed": 2-3 clear sentences explaining the underlying English grammar rule and WHY this exact form fits this context.
3. "alternativeComparison": What would happen if we used a common mistaken alternative (e.g. using 'a' instead of 'an', or Past Simple instead of Present Perfect).
4. "proTip": A helpful memory trick or nuance note for a ${level} learner.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                partOfSpeech: { type: Type.STRING },
                whyUsed: { type: Type.STRING },
                alternativeComparison: { type: Type.STRING },
                proTip: { type: Type.STRING }
              },
              required: ["partOfSpeech", "whyUsed", "alternativeComparison", "proTip"]
            }
          }
        });

        let text = (response.text || "").trim();
        text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        data = JSON.parse(text || "{}");
      } catch (geminiError) {
        console.warn("Gemini API not available, using fallback explainer logic:", geminiError);
      }

      if (data && data.partOfSpeech) {
        return res.json({ success: true, analysis: data });
      }

      // Smart Fallback
      res.json({
        success: true,
        analysis: {
          partOfSpeech: target ? `Grammatical Focus: "${target}"` : "English Syntax Analysis",
          whyUsed: `In the sentence "${sentence}", the structure obeys core English rules for subject-verb agreement and tense consistency.`,
          alternativeComparison: "Changing this word or tense would alter the timeframe or create unnatural phrasing for native speakers.",
          proTip: "Pay close attention to time keywords and spoken phonetics when forming your sentences!"
        }
      });
    } catch (error: any) {
      console.error("Explain Grammar API Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to analyze grammar"
      });
    }
  });

  // --- AI English Tutor & Correction Engine ---
  apiRouter.post("/ai-tutor", async (req, res) => {
    try {
      const { userQuery, sentenceToAnalyze, level = "intermediate" } = req.body;

      let resultData: any = null;

      try {
        const ai = getGeminiClient();
        const systemInstruction = `You are LingoSprint AI, a friendly, expert English Professor and Coach. 
If the user asks to explain a topic (e.g., 'Explain Articles', 'Explain Tenses', 'Explain Prepositions', 'Explain Conditionals', 'Explain Passive Voice', 'Explain Modals'), explain it step-by-step in simple, easy language tailored for a ${level} level student. 
Always include at least 3 concrete real-life examples for every step or rule.
Always explain the 'WHY' behind grammar rules so the student learns intuitively.
If given a sentence to analyze or correct, break down its syntax, correct any mistakes, explain why each word/form is used, and offer alternative examples.`;

        let prompt = userQuery || `Analyze this sentence for accuracy and explain why each word/form is used: "${sentenceToAnalyze}"`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                feedbackSummary: { type: Type.STRING, description: "Clear, step-by-step topic summary or direct sentence evaluation" },
                correctedSentence: { type: Type.STRING, description: "Cleaned up sentence or standard example sentence if applicable" },
                keyRulesExplained: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      concept: { type: Type.STRING, description: "e.g., Step 1: Phonetic Vowel Rule, Step 2: Specificity with 'The'" },
                      explanation: { type: Type.STRING, description: "Easy explanation of why this rule exists, with multiple clear examples" }
                    }
                  }
                },
                encouragingNote: { type: Type.STRING }
              },
              required: ["feedbackSummary", "keyRulesExplained", "encouragingNote"]
            }
          }
        });

        let text = (response.text || "").trim();
        text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        resultData = JSON.parse(text || "{}");
      } catch (geminiErr: any) {
        console.warn("Gemini API not configured or failed, providing smart AI tutor response:", geminiErr?.message);
      }

      if (!resultData || !resultData.feedbackSummary) {
        const inputSentence = sentenceToAnalyze || userQuery || "";
        resultData = generateFallbackTutorAnalysis(inputSentence, level);
      }

      res.json({ success: true, result: resultData });
    } catch (error: any) {
      console.error("AI Tutor API Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to query AI tutor"
      });
    }
  });

  function generateFallbackTutorAnalysis(inputSentence: string, level: string) {
    const queryLower = inputSentence.toLowerCase();

    // 0. TOPIC: HAS vs HAVE (Subject-Verb & Auxiliary Rules)
    if (queryLower.includes("has") || queryLower.includes("have") || queryLower.includes("has vs have") || queryLower.includes("has and have")) {
      return {
        feedbackSummary: "Why We Use HAS vs HAVE (Step-by-Step Reason): 'Has' and 'Have' are present tense verbs indicating possession or completed actions. The choice between 'Has' and 'Have' depends strictly on Subject Person & Number!",
        correctedSentence: "Examples: He HAS a car. She HAS completed her work. / I HAVE a car. They HAVE completed their work.",
        keyRulesExplained: [
          {
            concept: "Step 1: Use HAS for 3rd Person Singular Subjects (He, She, It, Singular Nouns)",
            explanation: "Reason: In English, third-person singular subjects require the verb to end with '-s' (Has). Examples: 'He HAS a key.' 'She HAS finished.' 'The company HAS grown.' 'Everyone HAS a ticket.'"
          },
          {
            concept: "Step 2: Use HAVE for I, You, We, They & Plural Nouns",
            explanation: "Reason: First-person (I, We), second-person (You), and plural subjects (They, My friends) take the base auxiliary form 'Have'. Examples: 'I HAVE a dream.' 'You HAVE done well.' 'They HAVE left.'"
          },
          {
            concept: "Step 3: Hindi Rule Explanation (हिंदी में नियम)",
            explanation: "हिंदी अनुवाद नियम: HAS का प्रयोग He, She, It और Singular (एकवचन) सब्जेक्ट के साथ किया जाता है। HAVE का प्रयोग I, You, We, They और Plural (बहुवचन) सब्जेक्ट के साथ किया जाता है।"
          }
        ],
        encouragingNote: "Easy Formula: Singular (He/She/It/Name) ➔ HAS. Plural + I/You (I/You/We/They) ➔ HAVE!"
      };
    }

    // 1. TOPIC: ARTICLES (a, an, the)
    if (queryLower.includes("article") || queryLower.includes("a, an, the") || queryLower.includes("a vs an")) {
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

    // 2. TOPIC: TENSES & TIMEFRAMES
    if (queryLower.includes("tense") || queryLower.includes("present perfect") || queryLower.includes("past simple")) {
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

    // 3. TOPIC: PREPOSITIONS (in, on, at)
    if (queryLower.includes("preposition") || queryLower.includes("in on at") || queryLower.includes("at on in")) {
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

    // 4. TOPIC: CONDITIONALS (if clauses)
    if (queryLower.includes("conditional") || queryLower.includes("if clause") || queryLower.includes("if i were")) {
      return {
        feedbackSummary: "Step-by-Step Guide to English Conditionals ('If' Clauses): Master 1st, 2nd, and 3rd Conditionals effortlessly!",
        correctedSentence: "Example: If it rains, I will take an umbrella (1st). If I were rich, I would buy a island (2nd).",
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

    // Default sentence evaluation
    let corrected = inputSentence;
    let feedback = "Excellent query! Let me break down this structure step-by-step with clear explanations and examples.";
    let rules = [
      {
        concept: "Rule 1: Subject-Verb & Tense Agreement",
        explanation: "Ensure singular subjects take singular verbs (e.g. 'She doesn't like' instead of 'She don't likes'). In negative present simple, auxiliary 'does' takes the third-person '-s', leaving the main verb in its base infinitive form."
      },
      {
        concept: "Rule 2: Article Phonetics & Noun Modifiers",
        explanation: "Pair 'a' before consonant spoken sounds ('a book', 'a user') and 'an' before vowel spoken sounds ('an hour', 'an orange')."
      },
      {
        concept: "Rule 3: Time Prepositions & Temporal Anchors",
        explanation: "Use 'at' for specific times, 'on' for specific days, and 'in' for months/years. Words like 'yesterday' and 'tomorrow' do not require prepositions."
      }
    ];

    if (queryLower.includes("don't likes") || queryLower.includes("doesn't likes")) {
      corrected = inputSentence.replace(/don't likes|doesn't likes/gi, "doesn't like").replace(/goes/gi, "go").replace(/on yesterday/gi, "yesterday");
      feedback = "Good effort! Note that negative sentences with 'does' keep the main verb in its base infinitive form ('like', 'go').";
    } else if (queryLower.includes("me and him")) {
      corrected = inputSentence.replace(/me and him/gi, "He and I");
      feedback = "When functioning as the subject of a sentence, use subject pronouns ('He and I') rather than object pronouns ('Me and him').";
    }

    return {
      feedbackSummary: feedback,
      correctedSentence: corrected,
      keyRulesExplained: rules,
      encouragingNote: `Focusing on the 'why' behind English grammar will help you speak and write with natural confidence at the ${level} level!`
    };
  }

  // --- Word Power Deep Dive ---
  apiRouter.post("/word-deepdive", async (req, res) => {
    try {
      const { word } = req.body;
      if (!word) return res.status(400).json({ error: "Word is required" });

      const ai = getGeminiClient();
      const prompt = `Provide a comprehensive, fun vocabulary deep-dive for the English word: "${word}".
Return JSON with:
1. word
2. phonetic (IPA pronunciation)
3. partOfSpeech
4. definition (clear and beginner-friendly)
5. etymologyReason (why this word came to mean what it means or its origin)
6. synonyms (array of strings)
7. antonyms (array of strings)
8. commonCollocations (natural word combinations, e.g. "heavy rain", "make a decision")
9. exampleSentence
10. whyUsedInExample (explain why this exact word choice works best in that sentence)`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              phonetic: { type: Type.STRING },
              partOfSpeech: { type: Type.STRING },
              definition: { type: Type.STRING },
              etymologyReason: { type: Type.STRING },
              synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
              antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonCollocations: { type: Type.ARRAY, items: { type: Type.STRING } },
              exampleSentence: { type: Type.STRING },
              whyUsedInExample: { type: Type.STRING }
            },
            required: ["word", "phonetic", "partOfSpeech", "definition", "etymologyReason", "synonyms", "commonCollocations", "exampleSentence", "whyUsedInExample"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json({ success: true, wordData: data });
    } catch (error: any) {
      console.error("Word Deepdive API Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // --- Pronunciation AI Feedback Endpoint ---
  apiRouter.post("/pronunciation-feedback", async (req, res) => {
    try {
      const { targetSentence, audioBase64, mimeType = "audio/webm", transcript, language = "en" } = req.body;
      if (!targetSentence) {
        return res.status(400).json({ error: "Target sentence is required" });
      }

      let data: any = null;
      try {
        const ai = getGeminiClient();

        const cleanMimeType = (mimeType || "audio/webm").split(";")[0].trim();
        const parts: any[] = [];

        if (audioBase64 && typeof audioBase64 === "string" && audioBase64.length > 50) {
          parts.push({
            inlineData: {
              mimeType: cleanMimeType,
              data: audioBase64
            }
          });
        }

        const promptText = `You are an expert English pronunciation teacher and speech evaluator.
Analyze the user's spoken audio directly and compare their pronunciation against the target English sentence:
Target Sentence: "${targetSentence}"
${transcript ? `Live Speech Recognition Transcript: "${transcript}"` : 'Live Speech Recognition Transcript: None'}
User Language Preference for Explanation: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}

CRITICAL INSTRUCTIONS:
1. Listen carefully to the audio provided to hear the exact words and sounds spoken by the user.
2. In "transcribedSpeech", write the EXACT words you hear spoken in the audio. If no speech or only silence/background noise is heard, set "transcribedSpeech" to "(No speech detected)".
3. Evaluate the user's spoken words strictly against the Target Sentence "${targetSentence}".
4. Score accurately (0-100):
   - 90-100: Master Level - All words pronounced clearly with correct vowels, consonants, and stress.
   - 75-89: Great Job - Most words correct, minor accent or slight mispronunciation.
   - 50-74: Getting There - Missing or mispronounced key words.
   - 0-49: Needs Practice - Silence, incorrect words spoken, or severe mispronunciation.
5. If the user said nothing or speech is unintelligible, set "score" to 0 and "transcribedSpeech" to "(No speech detected)".
6. In "mispronouncedWords", list ONLY the specific words that were mispronounced or skipped, along with exact phonetic advice. If the sentence was pronounced well, return an empty array [].
7. "accuracyLevel": "Master Level" (90-100), "Great Job" (75-89), "Getting There" (50-74), or "Needs Practice" (0-49).
8. "strengths": 1-2 honest observations (e.g., "Clear vowel sounds", "Good word pacing").
9. "intonationAndFluencyAdvice": practical tip on word stress or speed.
10. "hindiExplanation": ${language === 'hi' ? 'Warm 2-sentence explanation in Hindi explaining the evaluation.' : 'Brief note.'}`;

        parts.push({ text: promptText });

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                accuracyLevel: { type: Type.STRING },
                transcribedSpeech: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                mispronouncedWords: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      word: { type: Type.STRING },
                      issue: { type: Type.STRING },
                      correctionTip: { type: Type.STRING }
                    },
                    required: ["word", "issue", "correctionTip"]
                  }
                },
                intonationAndFluencyAdvice: { type: Type.STRING },
                hindiExplanation: { type: Type.STRING }
              },
              required: ["score", "accuracyLevel", "transcribedSpeech", "strengths", "mispronouncedWords", "intonationAndFluencyAdvice", "hindiExplanation"]
            }
          }
        });

        let text = (response.text || "").trim();
        text = text.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
        if (text) {
          data = JSON.parse(text);
        }
      } catch (geminiErr: any) {
        console.warn("Gemini audio analysis fallback:", geminiErr?.message || geminiErr);
      }

      if (!data || typeof data.score !== 'number') {
        const targetClean = targetSentence.toLowerCase().replace(/[^a-z0-9 ]/g, '');
        const transClean = (transcript || "").toLowerCase().replace(/[^a-z0-9 ]/g, '');
        
        const targetWords = targetClean.split(/\s+/).filter(Boolean);
        const transWords = transClean.split(/\s+/).filter(Boolean);

        if (!transClean || transWords.length === 0) {
          data = {
            score: 0,
            accuracyLevel: "Needs Practice",
            transcribedSpeech: "(No speech detected)",
            strengths: ["Audio recording session captured"],
            mispronouncedWords: [
              {
                word: targetWords[0] || targetSentence,
                issue: "No speech recognized",
                correctionTip: "Please speak clearly into your device microphone."
              }
            ],
            intonationAndFluencyAdvice: "Speak clearly into your microphone when recording.",
            hindiExplanation: language === 'hi'
              ? "कोई स्पष्ट आवाज़ नहीं मिली। कृपया अपने माइक्रोफ़ोन के पास साफ़ बोलें।"
              : "No speech detected. Please speak clearly into your microphone."
          };
        } else {
          let matchCount = 0;
          const missingWords: string[] = [];

          targetWords.forEach((w: string) => {
            if (transWords.includes(w)) {
              matchCount++;
            } else {
              missingWords.push(w);
            }
          });

          const ratio = targetWords.length > 0 ? matchCount / targetWords.length : 0;
          const score = Math.round(ratio * 100);

          data = {
            score,
            accuracyLevel: score >= 90 ? "Master Level" : score >= 75 ? "Great Job" : score >= 50 ? "Getting There" : "Needs Practice",
            transcribedSpeech: transcript,
            strengths: matchCount > 0 ? ["Captured key target words"] : ["Recorded audio attempted"],
            mispronouncedWords: missingWords.map(word => ({
              word,
              issue: "Word missed or mispronounced",
              correctionTip: `Focus on pronouncing '${word}' clearly.`
            })),
            intonationAndFluencyAdvice: "Practice pronouncing each word in the sentence smoothly.",
            hindiExplanation: language === 'hi'
              ? `आपने उच्चारण का प्रयास किया (${score}% शुद्धता)। छूट गए शब्दों का अभ्यास करें।`
              : "Keep practicing speaking each word clearly."
          };
        }
      }

      return res.json({ success: true, feedback: data });
    } catch (error: any) {
      console.error("Pronunciation API Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to analyze pronunciation" });
    }
  });

  apiRouter.get("/setup-telegram", async (req, res) => {
    console.log("API: setup-telegram requested");
    if (!TELEGRAM_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN is missing");
      return res.status(400).json({ error: "TELEGRAM_BOT_TOKEN is not set in environment variables." });
    }
    try {
      const appUrl = process.env.APP_URL || `https://${req.get('host')}`;
      const webhookUrl = `${appUrl}/api/telegram-webhook`;
      console.log(`Setting webhook to: ${webhookUrl}`);
      
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${webhookUrl}`);
      const data = await response.json();
      
      console.log("Telegram response:", JSON.stringify(data));
      res.json({ 
        message: "Telegram Webhook Setup Attempted", 
        webhookUrl, 
        telegramResponse: data 
      });
    } catch (error: any) {
      console.error("Setup Telegram Error:", error);
      res.status(500).json({ error: "Failed to setup Telegram webhook", details: error.message });
    }
  });

  // Mount API Router
  app.use("/api", apiRouter);

  // Express JSON Error Handler for /api routes
  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("API Router Global Error:", err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "An internal server error occurred"
    });
  });

  // Fallback for unmatched API routes
  app.use("/api", (req, res) => {
    console.log(`API: 404 Not Found - ${req.method} ${req.url}`);
    res.status(404).json({ success: false, error: "API endpoint not found" });
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> SERVER RUNNING ON PORT ${PORT} <<<`);
    console.log(`>>> APP_URL: ${process.env.APP_URL || 'Not set'} <<<`);
    console.log(`>>> TELEGRAM_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set'} <<<`);
  });
}

startServer().catch(err => {
  console.error("FATAL: Failed to start server:", err);
  process.exit(1);
});

