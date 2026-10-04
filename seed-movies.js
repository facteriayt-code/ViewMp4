// Script to upload/seed movies into the database via the API
import fs from 'fs';

const API_BASE = process.env.API_URL || 'http://localhost:3000/api';

async function seed() {
  try {
    const raw = fs.readFileSync('./sample-movies-database.json', 'utf8');
    const movies = JSON.parse(raw);
    console.log(`📡 Uploading ${movies.length} movies to ${API_BASE}/movies/bulk-import...`);

    const res = await fetch(`${API_BASE}/movies/bulk-import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movies })
    });

    const data = await res.json();
    console.log("✅ Response:", data);
  } catch (err) {
    console.error("❌ Failed to seed database:", err);
  }
}

seed();
