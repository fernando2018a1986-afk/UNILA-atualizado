const CACHE_NAME = "unila-app-v15";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ⚡ SEM CACHE (sempre pega versão nova)
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// 🔥 FORÇA ATUALIZAÇÃO
self.addEventListener("message", event => {
  if (event.data === "FORCE_UPDATE") {
    self.skipWaiting();
  }
});
