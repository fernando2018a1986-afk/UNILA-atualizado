const CACHE_NAME = "unila-app-v18"; // 🔥 troque versão sempre que atualizar

const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];

// 🔧 INSTALAÇÃO
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// 🔧 ATIVAÇÃO (remove cache antigo)
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
  self.clients.claim();
});

// ⚡ FETCH INTELIGENTE (network first)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// 🔥 FORÇAR UPDATE
self.addEventListener("message", event => {
  if (event.data === "FORCE_UPDATE") {
    self.skipWaiting();
  }
});
