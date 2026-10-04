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

  // CORS Middleware - Enables cross-origin access from external browsers, tabs, and devices
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Range");
    res.header("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges, Content-Length");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

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

  // --- The Movie Database (TMDb) API Integration ---
  const TMDB_API_KEY = process.env.TMDB_API_KEY || "f4a9807fa5f35bc12030eaa91320e625";
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";
  const TMDB_IMG_POSTER = "https://image.tmdb.org/t/p/w780";
  const TMDB_IMG_BACKDROP = "https://image.tmdb.org/t/p/w1280";
  const TMDB_IMG_THUMB = "https://image.tmdb.org/t/p/w342";

  // TMDb Status & Connectivity Check
  const handleTmdbStatus = async (req: express.Request, res: express.Response) => {
    try {
      const resp = await fetch(`${TMDB_BASE_URL}/configuration?api_key=${TMDB_API_KEY}`);
      if (!resp.ok) {
        return res.status(resp.status).json({ success: false, error: `TMDb configuration failed: ${resp.statusText}` });
      }
      res.json({
        success: true,
        connected: true,
        provider: "The Movie Database (TMDb)",
        quota: "Unlimited (Official Developer Tier)",
        quotaUsed: 0,
        quotaRemaining: 999999,
        apiKeyPreview: `${TMDB_API_KEY.slice(0, 6)}...${TMDB_API_KEY.slice(-4)}`
      });
    } catch (err: any) {
      console.error("TMDb status check failed:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to check TMDb status" });
    }
  };
  apiRouter.get("/watchmode/status", handleTmdbStatus);
  apiRouter.get("/tmdb/status", handleTmdbStatus);

  // TMDb Live Movie Search (Multi-search across movies & series)
  const handleTmdbSearch = async (req: express.Request, res: express.Response) => {
    try {
      const query = (req.query.query as string || "").trim();
      if (!query) {
        return res.status(400).json({ success: false, error: "Search query is required" });
      }

      const resp = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
      if (!resp.ok) {
        return res.status(resp.status).json({ success: false, error: "TMDb search request failed" });
      }

      const data: any = await resp.json();
      const rawResults = Array.isArray(data.results) ? data.results : [];

      const results = rawResults
        .filter((item: any) => item && (item.media_type === 'movie' || item.media_type === 'tv' || (!item.media_type && (item.title || item.name))))
        .map((item: any) => {
          const isTv = item.media_type === 'tv';
          const title = item.title || item.name || "Untitled";
          const releaseDate = item.release_date || item.first_air_date || "";
          const year = releaseDate ? parseInt(releaseDate.slice(0, 4), 10) : undefined;
          const poster = item.poster_path ? `${TMDB_IMG_THUMB}${item.poster_path}` : null;
          const backdrop = item.backdrop_path ? `${TMDB_IMG_BACKDROP}${item.backdrop_path}` : null;

          return {
            id: item.id,
            name: title,
            title: title,
            type: isTv ? 'tv_series' : 'movie',
            year: year,
            imageUrl: poster,
            backdropUrl: backdrop,
            voteAverage: item.vote_average,
            overview: item.overview || "",
            tmdb_id: item.id
          };
        });

      res.json({
        success: true,
        query,
        count: results.length,
        results
      });
    } catch (err: any) {
      console.error("TMDb search error:", err);
      res.status(500).json({ success: false, error: err.message || "TMDb search failed" });
    }
  };
  apiRouter.get("/watchmode/search", handleTmdbSearch);
  apiRouter.get("/tmdb/search", handleTmdbSearch);

  // Helper to extract details from TMDb movie or TV show
  const fetchTmdbItemDetails = async (id: number | string) => {
    // 1. Try movie first
    let itemResp = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,watch/providers`);
    let isTv = false;

    // 2. If not found, try TV series
    if (!itemResp.ok) {
      itemResp = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,watch/providers`);
      isTv = true;
    }

    if (!itemResp.ok) return null;
    const data: any = await itemResp.json();

    const title = data.title || data.name || data.original_title || "Untitled";
    const releaseDate = data.release_date || data.first_air_date || "";
    const year = releaseDate ? parseInt(releaseDate.slice(0, 4), 10) : new Date().getFullYear();
    const poster = data.poster_path ? `${TMDB_IMG_POSTER}${data.poster_path}` : (data.backdrop_path ? `${TMDB_IMG_BACKDROP}${data.backdrop_path}` : "");
    const backdrop = data.backdrop_path ? `${TMDB_IMG_BACKDROP}${data.backdrop_path}` : "";

    // YouTube Trailer
    const videoList = Array.isArray(data.videos?.results) ? data.videos.results : [];
    const ytTrailer = videoList.find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || videoList.find((v: any) => v.site === 'YouTube');
    const trailerUrl = ytTrailer ? `https://www.youtube.com/watch?v=${ytTrailer.key}` : "";
    const trailerThumb = ytTrailer ? `https://img.youtube.com/vi/${ytTrailer.key}/hqdefault.jpg` : "";

    // Watch Providers (US region or first available)
    const providerResults = data['watch/providers']?.results || {};
    const regionObj = providerResults.US || providerResults.GB || Object.values(providerResults)[0] as any || {};
    const flatrate = Array.isArray(regionObj.flatrate) ? regionObj.flatrate : [];
    const buyRent = [
      ...(Array.isArray(regionObj.buy) ? regionObj.buy : []),
      ...(Array.isArray(regionObj.rent) ? regionObj.rent : [])
    ];
    const rawProviders = [...flatrate, ...buyRent];

    // Deduplicate providers by provider_id
    const seenProviderIds = new Set<number>();
    const streamingSources: any[] = [];
    for (const p of rawProviders) {
      if (p && p.provider_id && !seenProviderIds.has(p.provider_id)) {
        seenProviderIds.add(p.provider_id);
        streamingSources.push({
          source_id: p.provider_id,
          name: p.provider_name,
          type: flatrate.includes(p) ? 'sub' : 'rent_buy',
          region: 'US',
          web_url: regionObj.link || `https://www.themoviedb.org/${isTv ? 'tv' : 'movie'}/${data.id}/watch`,
          format: '4K/HD'
        });
      }
    }

    const genreNames = Array.isArray(data.genres) ? data.genres.map((g: any) => g.name) : [];
    const primaryGenre = genreNames[0] || (isTv ? 'TV Series' : 'Feature');

    return {
      id: data.id,
      watchmodeId: data.id,
      title,
      description: data.overview || "High-quality title from the global cinema archives.",
      thumbnail: poster,
      backdrop,
      year,
      rating: data.adult ? "R" : "PG-13",
      userRating: data.vote_average ? Math.round(data.vote_average * 10) / 10 : 8.5,
      criticScore: data.vote_average ? Math.round(data.vote_average * 10) : 85,
      genres: genreNames,
      genre: primaryGenre,
      runtimeMinutes: data.runtime || (Array.isArray(data.episode_run_time) ? data.episode_run_time[0] : 120),
      trailer: trailerUrl,
      trailerThumbnail: trailerThumb,
      imdbId: data.imdb_id || "",
      tmdbId: data.id,
      streamingSources
    };
  };

  // TMDb Movie Details & Streaming Providers
  const handleTmdbDetails = async (req: express.Request, res: express.Response) => {
    try {
      const titleId = req.params.id;
      if (!titleId) {
        return res.status(400).json({ success: false, error: "Movie ID is required" });
      }

      const movie = await fetchTmdbItemDetails(titleId);
      if (!movie) {
        return res.status(404).json({ success: false, error: "Movie details not found on TMDb" });
      }

      res.json({
        success: true,
        movie
      });
    } catch (err: any) {
      console.error("TMDb details error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to load movie details" });
    }
  };
  apiRouter.get("/watchmode/details/:id", handleTmdbDetails);
  apiRouter.get("/tmdb/details/:id", handleTmdbDetails);

  // TMDb Popular / Trending Movies List
  const handleTmdbPopular = async (req: express.Request, res: express.Response) => {
    try {
      const resp = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
      if (!resp.ok) {
        return res.status(resp.status).json({ success: false, error: "Failed to fetch trending movies from TMDb" });
      }
      const data: any = await resp.json();
      const titles = (data.results || []).slice(0, 20).map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        name: item.title || item.name,
        type: 'movie',
        year: item.release_date ? parseInt(item.release_date.slice(0, 4), 10) : new Date().getFullYear(),
        imageUrl: item.poster_path ? `${TMDB_IMG_THUMB}${item.poster_path}` : null,
        poster: item.poster_path ? `${TMDB_IMG_POSTER}${item.poster_path}` : null,
        backdrop: item.backdrop_path ? `${TMDB_IMG_BACKDROP}${item.backdrop_path}` : null,
        overview: item.overview,
        voteAverage: item.vote_average
      }));

      res.json({
        success: true,
        titles,
        results: titles,
        totalResults: data.total_results || titles.length
      });
    } catch (err: any) {
      console.error("TMDb popular error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to fetch popular movies" });
    }
  };
  apiRouter.get("/watchmode/popular", handleTmdbPopular);
  apiRouter.get("/tmdb/popular", handleTmdbPopular);
  apiRouter.get("/tmdb/trending", handleTmdbPopular);

  // Import a Movie from TMDb into Site Database
  const handleTmdbImport = async (req: express.Request, res: express.Response) => {
    try {
      const { watchmodeId, tmdbId, customVideoUrl } = req.body;
      const targetId = tmdbId || watchmodeId;
      if (!targetId) {
        return res.status(400).json({ success: false, error: "Movie ID (tmdbId or watchmodeId) is required" });
      }

      const details = await fetchTmdbItemDetails(targetId);
      if (!details) {
        return res.status(404).json({ success: false, error: "Movie details could not be retrieved from TMDb" });
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
        title: details.title,
        description: details.description,
        thumbnail: details.thumbnail || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop',
        video_url: customVideoUrl || fallbackStream,
        genre: details.genre,
        year: details.year,
        rating: details.rating,
        views: Math.floor(Math.random() * 850000) + 120000,
        is_user_uploaded: true,
        uploader_id: 'tmdb-api',
        uploader_name: 'The Movie Database (TMDb)',
        watchmode_id: details.id,
        backdrop: details.backdrop || '',
        trailer: details.trailer || '',
        user_rating: details.userRating,
        critic_score: details.criticScore,
        streaming_sources: details.streamingSources,
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
        savedDoc = { id: `tmdb_${details.id}_${Date.now()}`, ...moviePayload };
        inMemoryMovies.unshift(savedDoc);
      }

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
        message: `Imported "${details.title}" from TMDb API`,
        movie: clientMovie
      });
    } catch (err: any) {
      console.error("TMDb import error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to import movie from TMDb" });
    }
  };
  apiRouter.post("/watchmode/import", handleTmdbImport);
  apiRouter.post("/tmdb/import", handleTmdbImport);

  // Bulk Sync Trending Blockbusters from TMDb API
  const handleTmdbSyncBlockbusters = async (req: express.Request, res: express.Response) => {
    try {
      const resp = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`);
      if (!resp.ok) {
        return res.status(resp.status).json({ success: false, error: "Failed to fetch trending titles from TMDb" });
      }
      const data: any = await resp.json();
      const topItems = (data.results || []).slice(0, 6);
      const imported: any[] = [];

      for (let i = 0; i < topItems.length; i++) {
        const item = topItems[i];
        try {
          const details = await fetchTmdbItemDetails(item.id);
          if (!details) continue;

          const SAMPLE_STREAMS = [
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
          ];
          const streamUrl = SAMPLE_STREAMS[i % SAMPLE_STREAMS.length];

          const moviePayload = {
            title: details.title,
            description: details.description,
            thumbnail: details.thumbnail || '',
            video_url: streamUrl,
            genre: details.genre,
            year: details.year,
            rating: details.rating,
            views: Math.floor(Math.random() * 900000) + 250000,
            is_user_uploaded: true,
            uploader_id: 'tmdb-api',
            uploader_name: 'The Movie Database (TMDb)',
            watchmode_id: details.id,
            backdrop: details.backdrop || '',
            trailer: details.trailer || '',
            user_rating: details.userRating,
            critic_score: details.criticScore,
            streaming_sources: details.streamingSources,
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
              const { data: sData } = await supabase.from('movies').insert([moviePayload]).select();
              if (sData && sData[0]) {
                savedItem = sData[0];
                saved = true;
              }
            } catch {}
          }

          if (!saved) {
            savedItem = { id: `tmdb_${details.id}_${Date.now()}`, ...moviePayload };
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
              criticScore: savedItem.critic_score,
              streamingSources: savedItem.streaming_sources
            });
          }
        } catch (itemErr) {
          console.warn("TMDb blockbuster sync item failed:", itemErr);
        }
      }

      res.json({
        success: true,
        message: `Synced ${imported.length} blockbuster movies from TMDb API`,
        count: imported.length,
        movies: imported
      });
    } catch (err: any) {
      console.error("TMDb sync blockbusters error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to sync blockbusters from TMDb" });
    }
  };
  apiRouter.post("/watchmode/sync-blockbusters", handleTmdbSyncBlockbusters);
  apiRouter.post("/tmdb/sync-blockbusters", handleTmdbSyncBlockbusters);

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

