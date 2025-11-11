// Nome da cache (se mudares ficheiros estáticos no futuro, só muda esta versão)
const CACHE_NAME = 'receitas-do-que-ha-v1';

// Ficheiros estáticos principais a cachear
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/splash-1125x2436.png',
  '/splash-1170x2532.png',
  '/splash-1242x2688.png',
  '/splash-1284x2778.png',
  '/splash-828x1792.png'
];

// Instalação: guarda em cache os ficheiros base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {
        // Se algum falhar (ex: em dev), não rebenta tudo
        return;
      });
    })
  );
});

// Ativação: limpa caches antigas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

// Fetch:
// - ficheiros do próprio site: tenta cache primeiro, se não houver vai à rede
// - chamadas para Supabase e outros domínios: rede primeiro (não meter em cache agressivo)
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Só GET requests
  if (request.method !== 'GET') return;

  // Evita interferir com APIs externas (Supabase)
  if (url.hostname.includes('supabase.co')) return;

  // Estratégia: cache first, depois rede
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).catch(() => {
        // Se falhar e for uma navegação (HTML), mostra index.html
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
