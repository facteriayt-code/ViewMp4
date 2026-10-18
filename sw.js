// GeminiStream PWA High-Performance Service Worker
const CACHE_NAME = 'geministream-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

// 1. Service Worker Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache non-blocking warning:', err);
      });
    })
  );
});

// 2. Service Worker Activation & Cache Cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event Handler (Crucial for Chrome PWA Installability)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass non-GET, API routes, WebSockets, and third-party video streams/iframes
  if (
    req.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/ws/') ||
    url.pathname.includes('/stream') ||
    url.pathname.endsWith('.m3u8') ||
    url.pathname.endsWith('.ts') ||
    url.origin.includes('vidrock.to') ||
    url.origin.includes('streamrip.fun') ||
    url.origin.includes('autoembed.co') ||
    url.origin.includes('filmu.in') ||
    url.origin.includes('codespecters.com')
  ) {
    return;
  }

  // HTML Navigation - Network First, fallback to cached App Shell
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const fallback = await caches.match('/index.html');
          return fallback || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // Static Assets (Icons, Manifest, Fonts, CSS, JS) - Stale While Revalidate
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/pwa-') ||
     url.pathname === '/manifest.json' ||
     url.pathname.endsWith('.png') ||
     url.pathname.endsWith('.svg') ||
     url.pathname.endsWith('.ico') ||
     url.pathname.endsWith('.css') ||
     url.pathname.endsWith('.js'))
  ) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const fetchPromise = fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        }).catch(() => null);

        return cachedRes || fetchPromise;
      })
    );
    return;
  }

  // Default network request with fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

// Optional external push notifications/ad service integration
try {
  self.options = {
    "domain": "3nbf4.com",
    "zoneId": 10452209
  };
  self.lary = "";
  importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw');
} catch (err) {
  // Silent fallback if offline or blocked
}