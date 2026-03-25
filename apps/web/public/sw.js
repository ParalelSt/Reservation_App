/// <reference lib="webworker" />

const CACHE_NAME = 'reservehub-v1';

// Install event — activate immediately
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activate event — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
        return;
      }
      return self.clients.openWindow('/');
    }),
  );
});

// Fetch event — required for PWA installability (network-first strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// Handle push events (for future server-sent push notifications)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'ReserveHub';
  const body = data.body || 'Imate novu obavijest';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
    }),
  );
});
