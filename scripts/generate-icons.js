import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp Vector SVG for GeminiStream
// Features cinematic dark background, glowing red/crimson gradient disc, modern play chevron and Gemini sparkle stars
const svgStandard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#181c26"/>
      <stop offset="60%" stop-color="#0f1117"/>
      <stop offset="100%" stop-color="#07080c"/>
    </radialGradient>
    <linearGradient id="neonRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF334B"/>
      <stop offset="50%" stop-color="#E50914"/>
      <stop offset="100%" stop-color="#990008"/>
    </linearGradient>
    <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE600"/>
      <stop offset="100%" stop-color="#FF7B00"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Base Plate with rounded rectangle -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)"/>
  <rect width="504" height="504" x="4" y="4" rx="111" fill="none" stroke="rgba(229, 9, 20, 0.35)" stroke-width="4"/>

  <!-- Glowing Emblem Circle -->
  <circle cx="256" cy="256" r="168" fill="url(#neonRed)" filter="url(#glow)" opacity="0.3"/>
  <circle cx="256" cy="256" r="160" fill="url(#neonRed)"/>

  <!-- Inner Dynamic Ring -->
  <circle cx="256" cy="256" r="150" fill="none" stroke="rgba(255, 255, 255, 0.25)" stroke-width="3"/>

  <!-- Cinema Play Glyph -->
  <path d="M 215 165 L 345 256 L 215 347 Z" fill="#ffffff" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.5))"/>

  <!-- Twin Gemini Sparkle Stars -->
  <!-- Top Right Star -->
  <path d="M 365 140 Q 365 160 385 160 Q 365 160 365 180 Q 365 160 345 160 Q 365 160 365 140 Z" fill="url(#goldGlow)"/>
  <!-- Bottom Left Small Star -->
  <path d="M 145 330 Q 145 345 160 345 Q 145 345 145 360 Q 145 345 130 345 Q 145 345 145 330 Z" fill="url(#goldGlow)" opacity="0.85"/>
</svg>`;

// Maskable SVG with safe margin (Android adaptive icons crop 10-15% of edges)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGradM" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#181c26"/>
      <stop offset="60%" stop-color="#0f1117"/>
      <stop offset="100%" stop-color="#07080c"/>
    </radialGradient>
    <linearGradient id="neonRedM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF334B"/>
      <stop offset="50%" stop-color="#E50914"/>
      <stop offset="100%" stop-color="#990008"/>
    </linearGradient>
    <linearGradient id="goldGlowM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE600"/>
      <stop offset="100%" stop-color="#FF7B00"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed background for maskable -->
  <rect width="512" height="512" fill="url(#bgGradM)"/>

  <!-- Centered safe zone circle (within 80% circle) -->
  <circle cx="256" cy="256" r="130" fill="url(#neonRedM)"/>
  <circle cx="256" cy="256" r="122" fill="none" stroke="rgba(255, 255, 255, 0.3)" stroke-width="3"/>

  <!-- Safe Cinema Play Glyph -->
  <path d="M 224 182 L 326 256 L 224 330 Z" fill="#ffffff"/>

  <!-- Safe Gemini Sparkle Stars -->
  <path d="M 345 160 Q 345 175 360 175 Q 345 175 345 190 Q 345 175 330 175 Q 345 175 345 160 Z" fill="url(#goldGlowM)"/>
  <path d="M 165 320 Q 165 332 177 332 Q 165 332 165 344 Q 165 332 153 332 Q 165 332 165 320 Z" fill="url(#goldGlowM)" opacity="0.9"/>
</svg>`;

async function run() {
  console.log('Writing public/icon.svg...');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgStandard);

  const targets = [
    { name: 'pwa-192x192.png', size: 192, svg: svgStandard },
    { name: 'pwa-512x512.png', size: 512, svg: svgStandard },
    { name: 'pwa-maskable-512x512.png', size: 512, svg: svgMaskable },
    { name: 'apple-touch-icon.png', size: 180, svg: svgStandard },
    { name: 'favicon-32x32.png', size: 32, svg: svgStandard },
    { name: 'favicon.png', size: 64, svg: svgStandard },
  ];

  for (const t of targets) {
    const buf = await sharp(Buffer.from(t.svg))
      .resize(t.size, t.size)
      .png({ quality: 95 })
      .toBuffer();

    // Write to public/
    fs.writeFileSync(path.join(publicDir, t.name), buf);
    // Also write to root for any direct fallback
    fs.writeFileSync(path.resolve(t.name), buf);
    console.log(`Generated ${t.name} (${t.size}x${t.size})`);
  }

  // Also write favicon.ico from 32x32 png
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), fs.readFileSync(path.join(publicDir, 'favicon-32x32.png')));
  fs.writeFileSync(path.resolve('favicon.ico'), fs.readFileSync(path.join(publicDir, 'favicon-32x32.png')));
  console.log('Icons generated successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
