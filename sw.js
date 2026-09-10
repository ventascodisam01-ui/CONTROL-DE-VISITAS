/**
 * Service Worker — Control de Visitas
 * Guarda en caché los archivos propios de la app para que abran sin señal.
 * Las peticiones al backend (POST a Apps Script) nunca pasan por aquí:
 * ese envío y la cola de pendientes los maneja app.html directamente.
 */
var CACHE = "control-visitas-v1";
var ARCHIVOS = ["./app.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return; // los POST al backend se dejan pasar sin intervenir
  e.respondWith(
    caches.match(e.request).then(function (resp) {
      return resp || fetch(e.request);
    })
  );
});
