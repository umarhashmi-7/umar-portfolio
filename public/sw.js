// Self-destructing Service Worker
// Deletes old caches and unregisters itself to break out of the caching trap.

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          console.log('[Service Worker] Deleting cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      console.log('[Service Worker] Unregistered successfully');
    })
  );
});
