console.log("SERVER.TS LOADED - " + new Date().toISOString());

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting server initialization...");

// --- Vite Integration ---
async function startServer() {
  console.log("Initializing startServer function...");
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket
      });
      console.log("Firebase Admin initialized");
    } catch (e: any) {
      console.error("Failed to initialize Firebase Admin:", e.message);
    }
  }

  const db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)")
    ? admin.firestore(firebaseConfig.firestoreDatabaseId)
    : admin.firestore();

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

  // Fallback for unmatched API routes
  app.use("/api/*", (req, res) => {
    console.log(`API: 404 Not Found - ${req.method} ${req.url}`);
    res.status(404).json({ error: "API endpoint not found" });
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
    app.get("*", (req, res) => {
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

