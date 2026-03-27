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

// Load Firebase Config
let firebaseConfig: any;
try {
  firebaseConfig = JSON.parse(readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
  console.log("Firebase config loaded for project:", firebaseConfig.projectId);
} catch (err) {
  console.error("Failed to load firebase-applet-config.json:", err);
  process.exit(1);
}

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://diurandrwkqhefhwclyv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-wW999bVAki7iV8KJjiNng_goaBCqlI';

// Validate and normalize Supabase URL
let normalizedSupabaseUrl = supabaseUrl;
if (normalizedSupabaseUrl && !normalizedSupabaseUrl.startsWith('http')) {
  console.error("CRITICAL: SUPABASE_URL must be a full URL (starting with https://), not just a project ID.");
  normalizedSupabaseUrl = `https://${normalizedSupabaseUrl}.supabase.co`;
  console.log("Attempting to normalize Supabase URL to:", normalizedSupabaseUrl);
}

let supabase: any;
try {
  supabase = createClient(normalizedSupabaseUrl, supabaseKey);
  console.log("Supabase client initialized with URL:", normalizedSupabaseUrl);
} catch (e: any) {
  console.error("Failed to initialize Supabase client:", e.message);
}

// Firebase Admin Configuration
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: firebaseConfig.projectId
    });
    console.log("Firebase Admin initialized for project:", firebaseConfig.projectId);
  } catch (e: any) {
    console.error("Failed to initialize Firebase Admin:", e.message);
  }
}

const db = firebaseConfig.firestoreDatabaseId 
  ? admin.firestore(firebaseConfig.firestoreDatabaseId)
  : admin.firestore();

// --- Vite Integration ---
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // --- Health Check ---
  app.get(["/api/health", "/api/health/"], (req, res) => {
    console.log("Health check requested");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get(["/api/ping", "/api/ping/"], (req, res) => {
    console.log("Ping requested");
    res.send("pong");
  });

  // --- Connection Test Logic ---
  app.get(["/api/test-connections", "/api/test-connections/"], async (req, res) => {
    console.log("Handling /api/test-connections request");
    const results: any = {
      supabase: { status: "pending", message: "" },
      firestore: { status: "pending", message: "" }
    };

    try {
      // Test Supabase
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
      // Test Firestore
      const snap = await db.collection('movies').limit(1).get();
      results.firestore = { status: "ok", message: `Connected! Found ${snap.size} movies.` };
    } catch (e: any) {
      results.firestore = { status: "error", message: `Firestore Fatal: ${e.message}` };
    }

    res.json(results);
  });

  // --- Migration Logic ---
  app.get(["/api/migrate-supabase-to-firestore", "/api/migrate-supabase-to-firestore/"], async (req, res) => {
    try {
      console.log("Starting migration from Supabase to Firestore...");
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase URL or Key is missing from environment variables.");
      }

      // 1. Fetch all movies from Supabase
      console.log("Fetching from Supabase URL:", supabaseUrl);
      const { data: supabaseMovies, error: supabaseError } = await supabase
        .from('movies')
        .select('*');

      if (supabaseError) {
        console.error("Supabase Fetch Error:", supabaseError);
        throw new Error(`Supabase Fetch Error: [${supabaseError.code}] ${supabaseError.message}. Hint: Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Settings.`);
      }

      if (!supabaseMovies || supabaseMovies.length === 0) {
        console.log("No movies found in Supabase.");
        return res.json({ message: "No movies found in Supabase to migrate. Make sure your Supabase project is correct." });
      }

      console.log(`Found ${supabaseMovies.length} movies in Supabase. First row keys:`, Object.keys(supabaseMovies[0]));

      // 2. Fetch existing movies from Firestore to avoid duplicates
      let firestoreMoviesSnap;
      try {
        firestoreMoviesSnap = await db.collection('movies').get();
      } catch (fsError: any) {
        console.error("Firestore Fetch Error:", fsError);
        throw new Error(`Firestore Fetch Error: ${fsError.message}`);
      }

      const existingVideoUrls = new Set(firestoreMoviesSnap.docs.map(doc => doc.data().video_url));

      let migratedCount = 0;
      let skippedCount = 0;
      let errors = [];

      // 3. Migrate each movie
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
          console.error(`Error migrating movie ${movie.title}:`, addError);
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
      console.error("Migration Fatal Error:", error);
      res.status(500).json({ 
        message: "Migration failed", 
        error: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      });
    }
  });

  // --- Telegram Bot Logic ---
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  app.post("/api/telegram-webhook", async (req, res) => {
    const update = req.body;
    console.log("Received Telegram Update:", JSON.stringify(update, null, 2));

    if (!update.message) return res.sendStatus(200);

    const chatId = update.message.chat.id;
    const text = update.message.text;
    const video = update.message.video || update.message.document?.mime_type?.startsWith('video/') ? update.message.document : null;

    try {
      if (video) {
        await sendMessage(chatId, "🎬 Video received! Processing and uploading to GeminiStream...");
        
        const fileId = video.file_id;
        const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`);
        const fileData: any = await fileResponse.json();
        
        if (fileData.ok) {
          const filePath = fileData.result.file_path;
          const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;
          
          // Download video
          const videoRes = await fetch(downloadUrl);
          const videoBuffer = await videoRes.arrayBuffer();
          
          // Upload to Supabase Storage
          const fileName = `tg-${Date.now()}-${video.file_name || 'video.mp4'}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('videos')
            .upload(fileName, videoBuffer, {
              contentType: video.mime_type || 'video/mp4',
              upsert: false
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(fileName);

          // Add to Firestore using Admin SDK
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

          await sendMessage(chatId, "✅ Successfully uploaded! Check the website.");
        } else {
          await sendMessage(chatId, "❌ Failed to get video file from Telegram.");
        }
      } else if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        await sendMessage(chatId, "🔗 Link received! Adding to GeminiStream...");
        
        // Add to Firestore using Admin SDK
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
      } else {
        await sendMessage(chatId, "👋 Welcome to GeminiStream Bot! Send me a video or a video link to upload it directly to the website.");
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

  // Helper endpoint to set webhook
  app.get("/api/setup-telegram", async (req, res) => {
    const appUrl = process.env.APP_URL || `https://${req.get('host')}`;
    const webhookUrl = `${appUrl}/api/telegram-webhook`;
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${webhookUrl}`);
    const data = await response.json();
    
    res.json({
      message: "Telegram Webhook Setup Attempted",
      webhookUrl,
      telegramResponse: data
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("FATAL: Failed to start server:", err);
  process.exit(1);
});
