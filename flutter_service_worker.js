// Выключатель старого service worker'а. До переезда на /online/ Flutter-приложение
// жило в корне, и его service worker со scope «/» мог отдавать вернувшимся людям
// закэшированное приложение вместо лендинга. Браузер, проверяя обновление, скачает
// этот файл: он чистит кэши, снимает регистрацию и перезагружает открытые вкладки.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(function (c) { c.navigate(c.url); });
  })());
});
