/* eslint-disable */
const CACHE_NAME = 'jnan-cache-v1';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json'
];

// 1. Install SW & cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force SW activate immediately
  self.skipWaiting();
});

// 2. Activate SW & prune legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Pruning old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Claim clients immediately
  self.clients.claim();
});

// 3. Network First with Cache Fallback strategy
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/S requests (ignore chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) return;

  // Handle navigation requests (pages loads)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(OFFLINE_URL);
        });
      })
    );
    return;
  }

  // Handle static assets (cache first, fallback to network)
  const isStaticAsset = 
    event.request.url.includes('/assets/') || 
    event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: Network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
