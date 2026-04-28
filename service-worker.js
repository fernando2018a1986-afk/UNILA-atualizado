const CACHE_NAME = "unila-app-v6"; // MUDE ESSE NOME A CADA ATUALIZAÇÃO

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

// INSTALAR (força instalar na hora)
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ATIVAR (remove versões antigas)
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

// FETCH (usa cache primeiro)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// RECEBER COMANDO DE ATUALIZAÇÃO
self.addEventListener("message", event => {
  if (event.data === "FORCE_UPDATE") {
    self.skipWaiting();
  }
});
