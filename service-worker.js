const CACHE_NAME = "unila-v2"; // ⚠️ mude a versão sempre que atualizar

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// INSTALAÇÃO
self.addEventListener("install", event => {
  self.skipWaiting(); // ativa imediatamente

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
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

  self.clients.claim(); // controla todas as abas
});

// FETCH (offline primeiro, depois internet)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(networkResponse => {
          // salva no cache dinamicamente
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          // fallback offline (opcional)
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        })
      );
    })
  );
});

// ATUALIZAÇÃO FORÇADA PELO BOTÃO
self.addEventListener("message", event => {
  if (event.data === "update") {
    self.skipWaiting();
  }
});
