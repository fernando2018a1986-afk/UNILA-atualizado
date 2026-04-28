const CACHE_NAME = "unila-app-v30"; // MUDE A CADA UPDATE

const FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

// 🔧 INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES);
    })
  );
});

// 🔧 ACTIVATE (limpeza + controle imediato)
self.addEventListener("activate", event => {
  event.waitUntil(
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

  return self.clients.claim();
});

// 🌐 FETCH (online com fallback offline)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// 📩 FORÇA ATUALIZAÇÃO (botão manual)
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
