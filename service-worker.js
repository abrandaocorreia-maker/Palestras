const CACHE_NAME = 'palestras-v1';

const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(ARQUIVOS);
      })
  );

  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names
          .filter(function(name) {
            return name !== CACHE_NAME;
          })
          .map(function(name) {
            return caches.delete(name);
          })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
