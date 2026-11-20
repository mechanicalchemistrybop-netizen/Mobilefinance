/* Finance Dashboard PWA service worker · v13.0
   Update CACHE_VERSION whenever index.html or bundled app assets change.
   Network-first for the app shell/workbook (with a fast offline fallback);
   cache-first for versioned local assets. */
'use strict';

const CACHE_VERSION = 'finance-dashboard-shell-v13.0';
const BASE_URL = self.registration.scope;
const INDEX_URL = new URL('index.html', BASE_URL).href;
const SHELL_URLS = [
  BASE_URL,
  INDEX_URL,
  new URL('manifest.webmanifest', BASE_URL).href,
  new URL('libs/xlsx.full.min.js', BASE_URL).href,
  new URL('libs/chart.umd.js', BASE_URL).href,
  new URL('libs/chartjs-plugin-datalabels.min.js', BASE_URL).href,
  new URL('icons/favicon-32.png', BASE_URL).href,
  new URL('icons/icon-192.png', BASE_URL).href,
  new URL('icons/icon-512.png', BASE_URL).href,
  new URL('icons/apple-touch-icon.png', BASE_URL).href
];

const isSameOrigin = url => url.origin === self.location.origin;
const isWorkbook = url => /(?:^|\/)finance_data\.xlsx$/i.test(url.pathname);
const STATIC_RE = /\.(?:js|css|png|jpe?g|webp|svg|ico|woff2?|webmanifest)$/i;

async function cacheSuccessfulResponse(cache, key, response) {
  if (response && response.ok && response.type !== 'opaque') {
    try { await cache.put(key, response.clone()); } catch (_) {}
  }
  return response;
}

/* Network first; if a saved copy exists, fall back to it when the network is
   slow (timeoutMs) or fails, while the cache keeps refreshing in the background. */
async function networkWithFallback(request, cache, cacheKey, timeoutMs) {
  const cached = await cache.match(cacheKey);
  const network = fetch(request, { cache: 'no-store' })
    .then(response => cacheSuccessfulResponse(cache, cacheKey, response));
  if (!cached) {
    try { return await network; } catch (_) { return Response.error(); }
  }
  let timer;
  const timeout = new Promise(resolve => { timer = setTimeout(() => resolve(cached), timeoutMs); });
  try {
    return await Promise.race([network.catch(() => cached), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await Promise.allSettled(SHELL_URLS.map(async url => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok && response.type !== 'opaque') await cache.put(url, response);
      } catch (_) { /* offline or optional asset missing: install must still complete */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith('finance-dashboard-') && key !== CACHE_VERSION)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING' || (event.data && event.data.type === 'SKIP_WAITING')) self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!isSameOrigin(url)) return;

  const navigation = request.mode === 'navigate';
  const workbook = isWorkbook(url);

  if (navigation || workbook) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      const key = navigation ? INDEX_URL : request.url;
      return networkWithFallback(request, cache, key, navigation ? 2500 : 8000);
    })());
    return;
  }

  // Cache only static same-origin assets. Leave APIs and dynamic endpoints online.
  if (!STATIC_RE.test(url.pathname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      return await cacheSuccessfulResponse(cache, request, response);
    } catch (_) {
      return Response.error();
    }
  })());
});
