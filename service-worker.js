// ======================================
// CONFIG
// ======================================

const CACHE_NAME = "nutriapp-v6";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/192x192.png",
  "/512x512.png",
];

// ======================================
// INSTALL
// ======================================

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache iniciado");

        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // força ativação imediata
        return self.skipWaiting();
      }),
  );
});

// ======================================
// ACTIVATE
// ======================================

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("Cache removido:", key);

              return caches.delete(key);
            }
          }),
        );
      })
      .then(() => {
        // assume controle imediatamente
        return self.clients.claim();
      }),
  );
});

// ======================================
// FETCH
// ======================================

self.addEventListener("fetch", (event) => {
  // Ignorar requests não GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna cache se existir
      if (cachedResponse) {
        return cachedResponse;
      }

      // Senão busca da rede
      return fetch(event.request)
        .then((networkResponse) => {
          // Segurança
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // Clonar resposta
          const responseClone = networkResponse.clone();

          // Salvar automaticamente no cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          // fallback offline opcional
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    }),
  );
});
