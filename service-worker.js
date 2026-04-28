const CACHE_NAME = "unila-app-v3"; // MUDE ISSO A CADA UPDATE

const FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

// INSTALAÇÃO
self.addEventListener("install", event => {
  self.skipWaiting(); // força instalar imediatamente

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES);
    })
  );
});

// ATIVAÇÃO
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // remove cache antigo
          }
        })
      );
    })
  );

  self.clients.claim(); // assume controle imediato
});

// FETCH (offline)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
