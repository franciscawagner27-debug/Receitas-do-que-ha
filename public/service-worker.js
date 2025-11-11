// Nome da cache (se mudares ficheiros estáticos no futuro, só mudas esta versão)
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
// - chamadas para Supabase e outros domains: rede primeiro (não meter em cache agressivo)
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Só lidamos com GET
  if (request.method !== 'GET') {
    return;
  }

  // Pedidos para Supabase ou APIs externas: deixa seguir normal (ou poderias fazer network-first)
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // Mesma origem (o teu site)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        // Se existir na cache, usa; senão vai buscar à rede
        return (
          cached ||
          fetch(request).catch(() => {
            // Se estiver offline e não houver cache, deixa falhar silenciosamente
            return cached;
          })
        );
      })
    );
  }
  // Outros domínios (fonts, etc.): tenta rede, e se quiseres no futuro podes adicionar cache
});
