const CACHE_NAME = 'glass-scheduler-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/main.js',
  '/js/components/header.js',
  '/js/components/sidebar.js',
  '/js/components/calendar.js',
  '/js/components/events.js',
  '/js/components/modal.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('/index.html')));
    return;
  }
  event.respondWith(
    caches.match(req).then(resp => resp || fetch(req).then(r => {
      return caches.open(CACHE_NAME).then(cache => {
        try { cache.put(req, r.clone()); } catch (e) { /* skip opaque or CORS issues */ }
        return r;
      });
    }))
  );
});