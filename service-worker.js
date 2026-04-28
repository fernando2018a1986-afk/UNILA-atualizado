const CACHE_NAME = 'unila-v23'; // depois vamos mudar versão

self.addEventListener('install', event => {
  self.skipWaiting(); // instala e já prepara pra ativar
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim(); // assume controle imediato
});

// permite ativação manual (botão atualizar)
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// controle de cache
self.addEventListener('fetch', event => {

  // HTML sempre atualizado
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }

  // outros
