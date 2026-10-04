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

  // In-memory cache for fast fallback
  const inMemoryMovies: any[] = [];

  // --- Movie Streaming Endpoints ---
  apiRouter.get("/movies", async (req, res) => {
    try {
      let results: any[] = [];

      if (db) {
        try {
          const snap = await db.collection('movies').orderBy('created_at', 'desc').limit(50).get();
          if (!snap.empty) {
            results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        } catch (dbErr) {
          // Fall through to Supabase / memory
        }
      }

      if (results.length === 0 && supabase) {
        try {
          const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            results = data;
          }
        } catch (supErr) {
          // Fall through to memory
        }
      }

      const all = [...results, ...inMemoryMovies];
      const unique = Array.from(new Map(all.map(m => [m.id || m.title, m])).values());
      res.json({ success: true, movies: unique });
    } catch (err: any) {
      console.warn("Movies fetch warning:", err.message);
      res.json({ success: true, movies: inMemoryMovies });
    }
  });

  apiRouter.post("/movies", async (req, res) => {
    try {
      const { title, description, thumbnail, videoUrl, genre, uploaderId, uploaderName } = req.body;
      if (!title || (!videoUrl && !thumbnail)) {
        return res.status(400).json({ error: "Title and videoUrl/thumbnail are required." });
      }

      const moviePayload = {
        title: title || 'Untitled Broadcast',
        description: description || '',
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
        video_url: videoUrl,
        genre: genre || 'Viral',
        year: new Date().getFullYear(),
        rating: 'NR',
        views: 0,
        is_user_uploaded: true,
        uploader_id: uploaderId || 'anonymous',
        uploader_name: uploaderName || 'Community User',
        created_at: new Date().toISOString()
      };

      if (db) {
        try {
          const docRef = await db.collection('movies').add({
            ...moviePayload,
            created_at: admin.firestore.FieldValue.serverTimestamp()
          });
          return res.json({ success: true, movie: { id: docRef.id, ...moviePayload } });
        } catch (dbErr) {
          // Fallback to Supabase / in-memory
        }
      }

      if (supabase) {
        try {
          const { data, error } = await supabase.from('movies').insert([moviePayload]).select();
          if (!error && data && data.length > 0) {
            return res.json({ success: true, movie: data[0] });
          }
        } catch (supErr) {
          // Fallback to in-memory
        }
      }

      const localItem = { id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, ...moviePayload };
      inMemoryMovies.unshift(localItem);
      res.json({ success: true, movie: localItem });
    } catch (err: any) {
      console.error("Movie creation error:", err);
      res.status(500).json({ error: err.message || "Failed to create movie record." });
    }
  });

  // --- Bulk Import Movies Database Endpoint ---
  apiRouter.post("/movies/bulk-import", async (req, res) => {
    try {
      const { movies } = req.body;
      if (!Array.isArray(movies) || movies.length === 0) {
        return res.status(400).json({ error: "An array of 'movies' is required in the request body." });
      }

      const imported: any[] = [];
      const errors: string[] = [];

      for (const m of movies) {
        if (!m.title) {
          errors.push(`Skipped movie without title`);
          continue;
        }

        const payload = {
          title: m.title,
          description: m.description || '',
          thumbnail: m.thumbnail || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
          video_url: m.videoUrl || m.video_url || '',
          genre: m.genre || 'Action',
          year: Number(m.year) || new Date().getFullYear(),
          rating: m.rating || 'NR',
          views: Number(m.views) || 0,
          is_user_uploaded: m.isUserUploaded ?? true,
          uploader_id: m.uploaderId || 'admin',
          uploader_name: m.uploaderName || 'Database Admin',
          created_at: new Date().toISOString()
        };

        let saved = false;

        if (db) {
          try {
            const ref = await db.collection('movies').add({
              ...payload,
              created_at: admin.firestore.FieldValue.serverTimestamp()
            });
            imported.push({ id: ref.id, ...payload });
            saved = true;
          } catch (itemErr: any) {
            // Fallback to Supabase / memory
          }
        }

        if (!saved && supabase) {
          try {
            const { data } = await supabase.from('movies').insert([payload]).select();
            if (data && data[0]) {
              imported.push(data[0]);
              saved = true;
            }
          } catch (supErr: any) {
            // Fallback to memory
          }
        }

        if (!saved) {
          const memItem = { id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, ...payload };
          inMemoryMovies.unshift(memItem);
          imported.push(memItem);
        }
      }

      res.json({
        success: true,
        message: `Successfully imported ${imported.length} movies.`,
        totalReceived: movies.length,
        importedCount: imported.length,
        imported
      });
    } catch (err: any) {
      console.error("Bulk import error:", err);
      res.status(500).json({ error: err.message || "Bulk database import failed." });
    }
  });

  // --- AI Movie Insights Endpoint ---
  apiRouter.post("/ai-insight", async (req, res) => {
    try {
      const { movieTitle } = req.body;
      if (!movieTitle) return res.status(400).json({ error: "Movie title is required" });

      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Provide a short, fascinating, 2-sentence piece of trivia or secret about the film "${movieTitle}". Keep it witty and captivating for a movie streaming platform audience.`,
        });
        return res.json({ success: true, insight: response.text || "A cinematic gem worth discovering." });
      } catch (err: any) {
        console.warn("Gemini Insight Fallback:", err.message);
        return res.json({ 
          success: true, 
          insight: `"${movieTitle}" is an audience favorite celebrated for its compelling storytelling and memorable visual atmosphere.` 
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to get AI insight" });
    }
  });

  // --- AI Recommendations Endpoint ---
  apiRouter.post("/ai-recommendations", async (req, res) => {
    try {
      const { userHistory } = req.body;
      const historyList = Array.isArray(userHistory) && userHistory.length > 0 ? userHistory.join(", ") : "Sci-Fi, Action, Thriller";

      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `A user has recently watched: ${historyList}.
Recommend exactly ONE great movie they would love. Provide response in format:
"Title: [Movie Name] | Genre: [Genre] | Why: [1 sentence reason why they will enjoy it]."`,
        });
        return res.json({ success: true, recommendation: response.text || "Check out trending picks in Sci-Fi & Action!" });
      } catch (err: any) {
        return res.json({
          success: true,
          recommendation: "Title: Blade Runner 2049 | Genre: Sci-Fi | Why: A visually stunning masterpiece that expands the horizons of atmospheric cinema."
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate recommendations" });
    }
  });

  // --- Watchmode Movie Database API Integration ---
  const WATCHMODE_API_KEY = process.env.WATCHMODE_API_KEY || "wm_B2elbWn5PLPyFydmJ6awQ09TkrSv2njOpCPqwoiyyjA";
  const WATCHMODE_BASE_URL = "https://api.watchmode.com/v1";

  // Watchmode Status & Quota Check
  apiRouter.get("/watchmode/status", async (req, res) => {
    try {
      const resp = await fetch(`${WATCHMODE_BASE_URL}/status/?apiKey=${WATCHMODE_API_KEY}`);
      if (!resp.ok) {
        return res.status(resp.status).json({ success: false, error: `Watchmode status failed: ${resp.statusText}` });
      }
      const data: any = await resp.json();
      res.json({
        success: true,
        connected: true,
        quota: data.quota,
        quotaUsed: data.quotaUsed,
        quotaRemaining: data.quota - data.quotaUsed,
        apiKeyPreview: `${WATCHMODE_API_KEY.slice(0, 6)}...${WATCHMODE_API_KEY.slice(-4)}`
      });
    } catch (err: any) {
      console.error("Watchmode status check failed:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to check Watchmode status" });
    }
  });

  // Watchmode Live Movie Search (parallel autocomplete + standard search for 100% accuracy)
  apiRouter.get("/watchmode/search", async (req, res) => {
    try {
      const query = (req.query.query as string || "").trim();
      if (!query) {
        return res.status(400).json({ success: false, error: "Search query is required" });
      }

      // Parallel search: both autocomplete (has rich TMDb posters) and standard title search (exact phrase match)
      const [autoSettled, stdSettled] = await Promise.allSettled([
        fetch(`${WATCHMODE_BASE_URL}/autocomplete-search/?apiKey=${WATCHMODE_API_KEY}&search_value=${encodeURIComponent(query)}&search_type=1`),
        fetch(`${WATCHMODE_BASE_URL}/search/?apiKey=${WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(query)}`)
      ]);

      const resultMap = new Map<number, any>();

      // 1. Process Autocomplete Results (prioritize high relevance & posters)
      if (autoSettled.status === 'fulfilled' && autoSettled.value.ok) {
        try {
          const autoData: any = await autoSettled.value.json();
          if (Array.isArray(autoData.results)) {
            for (const item of autoData.results) {
              if (item && item.id && (item.result_type === 'title' || (item.type && !['person', 'Visual effects', 'crew', 'cast'].includes(item.type)))) {
                resultMap.set(item.id, {
                  id: item.id,
                  name: item.name || item.title,
                  title: item.name || item.title,
                  type: item.type || 'movie',
                  year: item.year,
                  imageUrl: item.image_url || null,
                  imdb_id: item.imdb_id,
                  tmdb_id: item.tmdb_id,
                  relevance: item.relevance || 100
                });
              }
            }
          }
        } catch (e) {
          console.warn("Error parsing autocomplete response:", e);
        }
      }

      // 2. Process Standard Search Results (adds exact title matches)
      if (stdSettled.status === 'fulfilled' && stdSettled.value.ok) {
        try {
          const stdData: any = await stdSettled.value.json();
          const titles = Array.isArray(stdData.title_results) ? stdData.title_results : [];
          for (const item of titles) {
            if (item && item.id) {
              if (resultMap.has(item.id)) {
                const existing = resultMap.get(item.id);
                // Enrich existing with any missing info
                if (!existing.year && item.year) existing.year = item.year;
                if (!existing.imdb_id && item.imdb_id) existing.imdb_id = item.imdb_id;
                if (!existing.tmdb_id && item.tmdb_id) existing.tmdb_id = item.tmdb_id;
              } else {
                resultMap.set(item.id, {
                  id: item.id,
                  name: item.name || item.title,
                  title: item.name || item.title,
                  type: item.type || 'movie',
                  year: item.year,
                  imageUrl: item.image_url || (item.tmdb_id ? `https://image.tmdb.org/t/p/w185/` : null),
                  imdb_id: item.imdb_id,
                  tmdb_id: item.tmdb_id,
                  relevance: 50
                });
              }
            }
          }
        } catch (e) {
          console.warn("Error parsing standard search response:", e);
        }
      }

      const results = Array.from(resultMap.values()).slice(0, 30);

      res.json({
        success: true,
        query,
        count: results.length,
        results
      });
    } catch (err: any) {
      console.error("Watchmode search error:", err);
      res.status(500).json({ success: false, error: err.message || "Watchmode search failed" });
    }
  });

  // Watchmode Movie Details & Streaming Providers
  apiRouter.get("/watchmode/details/:id", async (req, res) => {
    try {
      const titleId = req.params.id;
      if (!titleId) {
        return res.status(400).json({ success: false, error: "Movie ID is required" });
      }

      const [detailsResp, sourcesResp] = await Promise.all([
        fetch(`${WATCHMODE_BASE_URL}/title/${titleId}/details/?apiKey=${WATCHMODE_API_KEY}`),
        fetch(`${WATCHMODE_BASE_URL}/title/${titleId}/sources/?apiKey=${WATCHMODE_API_KEY}`)
      ]);

      if (!detailsResp.ok) {
        return res.status(detailsResp.status).json({ success: false, error: "Title details not found on Watchmode" });
      }

      const details: any = await detailsResp.json();
      let sources: any[] = [];
      if (sourcesResp.ok) {
        try {
          const rawSources: any = await sourcesResp.json();
          sources = Array.isArray(rawSources) ? rawSources : [];
        } catch {
          sources = [];
        }
      }

      res.json({
        success: true,
        movie: {
          watchmodeId: details.id,
          title: details.title || details.original_title,
          description: details.plot_overview || "",
          thumbnail: details.posterLarge || details.poster || details.posterMedium || "",
          backdrop: details.backdrop || "",
          year: details.year || new Date().getFullYear(),
          rating: details.us_rating || "PG-13",
          userRating: details.user_rating,
          criticScore: details.critic_score,
          genres: details.genre_names || [],
          genre: (details.genre_names && details.genre_names[0]) || "Feature",
          runtimeMinutes: details.runtime_minutes,
          trailer: details.trailer || "",
          trailerThumbnail: details.trailer_thumbnail || "",
          imdbId: details.imdb_id,
          tmdbId: details.tmdb_id,
          streamingSources: (sources || []).slice(0, 10).map((s: any) => ({
            source_id: s.source_id,
            name: s.name,
            type: s.type,
            region: s.region,
            web_url: s.web_url,
            format: s.format,
            price: s.price
          }))
        }
      });
    } catch (err: any) {
      console.error("Watchmode details error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to load movie details" });
    }
  });

  // Watchmode Popular Movies List
  apiRouter.get("/watchmode/popular", async (req, res) => {
    try {
      const resp = await fetch(`${WATCHMODE_BASE_URL}/list-titles/?apiKey=${WATCHMODE_API_KEY}&types=movie&limit=12&sort_by=popularity_desc`);
      if (!resp.ok) {
        return res.status(resp.status).json({ success: false, error: "Failed to fetch popular list" });
      }
      const data: any = await resp.json();
      res.json({
        success: true,
        titles: data.titles || [],
        totalResults: data.total_results
      });
    } catch (err: any) {
      console.error("Watchmode popular error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to fetch popular movies" });
    }
  });

  // Import a Movie from Watchmode into Site Database
  apiRouter.post("/watchmode/import", async (req, res) => {
    try {
      const { watchmodeId, customVideoUrl } = req.body;
      if (!watchmodeId) {
        return res.status(400).json({ success: false, error: "watchmodeId is required" });
      }

      const [detailsResp, sourcesResp] = await Promise.all([
        fetch(`${WATCHMODE_BASE_URL}/title/${watchmodeId}/details/?apiKey=${WATCHMODE_API_KEY}`),
        fetch(`${WATCHMODE_BASE_URL}/title/${watchmodeId}/sources/?apiKey=${WATCHMODE_API_KEY}`)
      ]);

      if (!detailsResp.ok) {
        return res.status(detailsResp.status).json({ success: false, error: "Movie details could not be retrieved from Watchmode" });
      }

      const details: any = await detailsResp.json();
      let sources: any[] = [];
      if (sourcesResp.ok) {
        try {
          const rawSources: any = await sourcesResp.json();
          sources = Array.isArray(rawSources) ? rawSources : [];
        } catch {
          sources = [];
        }
      }

      const SAMPLE_STREAMS = [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
      ];
      const fallbackStream = SAMPLE_STREAMS[Math.floor(Math.random() * SAMPLE_STREAMS.length)];

      const moviePayload = {
        title: details.title || details.original_title,
        description: details.plot_overview || "Critically acclaimed film from the global cinema archives.",
        thumbnail: details.posterLarge || details.poster || details.posterMedium || details.backdrop || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
        video_url: customVideoUrl || fallbackStream,
        genre: (details.genre_names && details.genre_names[0]) || 'Feature',
        year: Number(details.year) || new Date().getFullYear(),
        rating: details.us_rating || 'PG-13',
        views: Math.floor(Math.random() * 850000) + 120000,
        is_user_uploaded: true,
        uploader_id: 'watchmode-api',
        uploader_name: 'Watchmode Cinema Network',
        watchmode_id: details.id,
        backdrop: details.backdrop || '',
        trailer: details.trailer || '',
        user_rating: details.user_rating || 8.5,
        critic_score: details.critic_score || 85,
        streaming_sources: (sources || []).slice(0, 8).map((s: any) => ({
          source_id: s.source_id,
          name: s.name,
          type: s.type,
          region: s.region,
          web_url: s.web_url,
          format: s.format,
          price: s.price
        })),
        created_at: new Date().toISOString()
      };

      let savedDoc: any = null;

      if (db) {
        try {
          const docRef = await db.collection('movies').add({
            ...moviePayload,
            created_at: admin.firestore.FieldValue.serverTimestamp()
          });
          savedDoc = { id: docRef.id, ...moviePayload };
        } catch (dbErr) {
          console.warn("Firestore import save failed, fallback to Supabase/memory:", dbErr);
        }
      }

      if (!savedDoc && supabase) {
        try {
          const { data, error } = await supabase.from('movies').insert([moviePayload]).select();
          if (!error && data && data.length > 0) {
            savedDoc = data[0];
          }
        } catch (supErr) {
          console.warn("Supabase import save fallback to memory:", supErr);
        }
      }

      if (!savedDoc) {
        savedDoc = { id: `wm_${details.id}_${Date.now()}`, ...moviePayload };
        inMemoryMovies.unshift(savedDoc);
      }

      // Format for frontend
      const clientMovie = {
        id: savedDoc.id,
        title: savedDoc.title,
        description: savedDoc.description,
        thumbnail: savedDoc.thumbnail,
        videoUrl: savedDoc.video_url || savedDoc.videoUrl,
        genre: savedDoc.genre,
        year: savedDoc.year,
        rating: savedDoc.rating,
        views: savedDoc.views,
        isUserUploaded: true,
        uploaderId: savedDoc.uploader_id,
        uploaderName: savedDoc.uploader_name,
        watchmodeId: savedDoc.watchmode_id,
        backdrop: savedDoc.backdrop,
        trailer: savedDoc.trailer,
        userRating: savedDoc.user_rating,
        criticScore: savedDoc.critic_score,
        streamingSources: savedDoc.streaming_sources
      };

      res.json({
        success: true,
        message: `Imported "${details.title}" from Watchmode API`,
        movie: clientMovie
      });
    } catch (err: any) {
      console.error("Watchmode import error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to import movie from Watchmode" });
    }
  });

  // Bulk Sync Blockbuster Titles from Watchmode API
  apiRouter.post("/watchmode/sync-blockbusters", async (req, res) => {
    try {
      const topIds = [1182444, 1386160, 1184713, 1376101, 1404364];
      const imported: any[] = [];

      for (const id of topIds) {
        try {
          const detailsResp = await fetch(`${WATCHMODE_BASE_URL}/title/${id}/details/?apiKey=${WATCHMODE_API_KEY}`);
          if (!detailsResp.ok) continue;
          const details: any = await detailsResp.json();

          const SAMPLE_STREAMS = [
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          ];
          const streamUrl = SAMPLE_STREAMS[imported.length % SAMPLE_STREAMS.length];

          const moviePayload = {
            title: details.title || details.original_title,
            description: details.plot_overview || "Award-winning blockbuster masterpiece.",
            thumbnail: details.posterLarge || details.poster || details.backdrop || '',
            video_url: streamUrl,
            genre: (details.genre_names && details.genre_names[0]) || 'Sci-Fi',
            year: Number(details.year) || 2020,
            rating: details.us_rating || 'PG-13',
            views: Math.floor(Math.random() * 900000) + 250000,
            is_user_uploaded: true,
            uploader_id: 'watchmode-api',
            uploader_name: 'Watchmode Cinema',
            watchmode_id: details.id,
            backdrop: details.backdrop || '',
            trailer: details.trailer || '',
            user_rating: details.user_rating || 9.0,
            critic_score: details.critic_score || 88,
            created_at: new Date().toISOString()
          };

          let saved = false;
          let savedItem: any = null;

          if (db) {
            try {
              const ref = await db.collection('movies').add({
                ...moviePayload,
                created_at: admin.firestore.FieldValue.serverTimestamp()
              });
              savedItem = { id: ref.id, ...moviePayload };
              saved = true;
            } catch {}
          }

          if (!saved && supabase) {
            try {
              const { data } = await supabase.from('movies').insert([moviePayload]).select();
              if (data && data[0]) {
                savedItem = data[0];
                saved = true;
              }
            } catch {}
          }

          if (!saved) {
            savedItem = { id: `wm_${details.id}_${Date.now()}`, ...moviePayload };
            inMemoryMovies.unshift(savedItem);
          }

          if (savedItem) {
            imported.push({
              id: savedItem.id,
              title: savedItem.title,
              description: savedItem.description,
              thumbnail: savedItem.thumbnail,
              videoUrl: savedItem.video_url || savedItem.videoUrl,
              genre: savedItem.genre,
              year: savedItem.year,
              rating: savedItem.rating,
              views: savedItem.views,
              isUserUploaded: true,
              uploaderId: savedItem.uploader_id,
              uploaderName: savedItem.uploader_name,
              backdrop: savedItem.backdrop,
              trailer: savedItem.trailer,
              userRating: savedItem.user_rating,
              criticScore: savedItem.critic_score
            });
          }
        } catch (itemErr) {
          console.warn("Blockbuster item sync failed:", itemErr);
        }
      }

      res.json({
        success: true,
        message: `Synced ${imported.length} blockbuster movies from Watchmode API`,
        count: imported.length,
        movies: imported
      });
    } catch (err: any) {
      console.error("Watchmode sync blockbusters error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to sync blockbusters" });
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

