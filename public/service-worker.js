// Nome da cache
const CACHE_NAME = 'receitas-do-que-ha-v3';

// Ficheiros estáticos principais
const ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/splash-1125x2436.png',
  '/splash-1170x2532.png',
  '/splash-1242x2688.png',
  '/splash-1284x2778.png',
  '/splash-828x1792.png'
];

// Instalação: guarda ficheiros base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação: limpa caches antigas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Ignora APIs externas (Supabase, Google Fonts, etc.)
  if (!url.origin.includes(self.location.origin)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Atualiza cache com nova versão
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        return response;
      })
      .catch(() => {
        // Se falhar (offline)
        return caches.match(request).then((cached) => {
          // Se tiver na cache, mostra
          if (cached) return cached;
          // Caso contrário, mostra offline.html
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});
