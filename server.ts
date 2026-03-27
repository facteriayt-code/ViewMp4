import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase Config
const firebaseConfig = JSON.parse(readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));

const app = express();
const PORT = 3000;

// Supabase Configuration (Still used for storage)
const supabaseUrl = process.env.SUPABASE_URL || 'https://diurandrwkqhefhwclyv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-wW999bVAki7iV8KJjiNng_goaBCqlI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Firebase Admin Configuration (Bypasses security rules for server-side operations)
admin.initializeApp({
  projectId: firebaseConfig.projectId
});
const db = admin.firestore();

app.use(bodyParser.json());

// --- Migration Logic ---
app.get("/api/migrate-supabase-to-firestore", async (req, res) => {
  try {
    console.log("Starting migration from Supabase to Firestore...");
    
    // 1. Fetch all movies from Supabase
    const { data: supabaseMovies, error: supabaseError } = await supabase
      .from('movies')
      .select('*');

    if (supabaseError) throw supabaseError;
    if (!supabaseMovies || supabaseMovies.length === 0) {
      return res.json({ message: "No movies found in Supabase to migrate." });
    }

    console.log(`Found ${supabaseMovies.length} movies in Supabase.`);

    // 2. Fetch existing movies from Firestore to avoid duplicates
    const firestoreMoviesSnap = await db.collection('movies').get();
    const existingVideoUrls = new Set(firestoreMoviesSnap.docs.map(doc => doc.data().video_url));

    let migratedCount = 0;
    let skippedCount = 0;

    // 3. Migrate each movie
    for (const movie of supabaseMovies) {
      if (existingVideoUrls.has(movie.video_url)) {
        skippedCount++;
        continue;
      }

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
    }

    res.json({
      message: "Migration completed successfully",
      totalFound: supabaseMovies.length,
      migrated: migratedCount,
      skipped: skippedCount
    });
  } catch (error: any) {
    console.error("Migration Error:", error);
    res.status(500).json({ error: error.message });
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

// --- Vite Integration ---
async function startServer() {
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

startServer();
