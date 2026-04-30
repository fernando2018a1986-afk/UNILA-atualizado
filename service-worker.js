const CACHE_NAME = "unila-app-v40"; // 🔥 MUDE SEMPRE AO ATUALIZAR

const FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

// 🚀 INSTALL - instala nova versão imediatamente
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES);
    })
  );
});

// ⚡ ACTIVATE - remove versões antigas e assume controle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // limpa cache antigo
          }
        })
      );
    })
  );

  return self.clients.claim(); // assume controle imediato
});

// 🌐 FETCH - tenta online primeiro, fallback offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response; // sempre pega versão online
      })
      .catch(() => {
        return caches.match(event.request); // fallback offline
      })
  );
});

// 📩 FORÇA ATUALIZAÇÃO (botão do app)
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
