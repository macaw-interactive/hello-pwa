importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  
  // This line will be replaced and will contain all necessary precache files
  workbox.precaching.precacheAndRoute([]);
  
  workbox.routing.registerRoute(
    new RegExp(/\.(?:html|js|css)$/),
    workbox.strategies.networkFirst({
      cacheName: 'pwa-app',
      networkTimeoutSeconds: 10
    }) 
  );

  workbox.routing.registerRoute(
    new RegExp(/\.(?:png|jpg|jpeg|svg)$/),
    workbox.strategies.cacheFirst({
      cacheName: 'pwa-media',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 60*60*24,
        })
      ]
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// Make sure the offline page is cached
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('app')
    .then(function(cache) {
      return cache.addAll(['index.html']);
    })
    .then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
	// `claim()` sets this worker as the active worker for all clients that
	// match the workers scope and triggers an `oncontrollerchange` event for
	// the clients.
	return self.clients.claim();
});

// Get offline page from cache when trying to fetch a 'navigate' resource (read page) and it fails (read user is offline)
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(error => {
        return caches.match('index.html');
      })
    );
  }
});

self.addEventListener('push', function(event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
      return;
  }

  var data = {};
  if (event.data) {
      data = event.data.json();
  }
  var title = data.title;
  var message = data.message;
  
  self.clickTarget = data.clickTarget;

  event.waitUntil(self.registration.showNotification(title, {
      body: message,
      tag: 'push-demo',
      badge: '/notification-badge.png',
      icon: '/notification-icon.png',
      image: '/notification-image.jpg'
  }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  if (clients.openWindow){
      event.waitUntil(clients.openWindow(self.clickTarget));
  }
});