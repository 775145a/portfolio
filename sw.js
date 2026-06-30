var CACHE = 'valopos-v1';
var STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/api.js',
    '/js/app.js',
    '/js/medicines.js',
    '/manifest.json',
    '/icons/icon.svg'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll(STATIC_ASSETS);
        }).then(self.skipWaiting())
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })
            );
        }).then(function() { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function(e) {
    var request = e.request;
    var isHTML = request.headers.get('Accept') && request.headers.get('Accept').indexOf('text/html') !== -1;

    if (isHTML) {
        e.respondWith(
            fetch(request).then(function(response) {
                return caches.open(CACHE).then(function(cache) {
                    if (request.method === 'GET' && request.url.startsWith(self.location.origin)) {
                        cache.put(request, response.clone());
                    }
                    return response;
                });
            }).catch(function() {
                return caches.match(request).then(function(cached) {
                    return cached || caches.match('/index.html');
                });
            })
        );
    } else {
        e.respondWith(
            caches.match(request).then(function(cached) {
                var fetchPromise = fetch(request).then(function(response) {
                    return caches.open(CACHE).then(function(cache) {
                        if (request.method === 'GET' && request.url.startsWith(self.location.origin) && request.url.indexOf('/api/') === -1) {
                            cache.put(request, response.clone());
                        }
                        return response;
                    });
                }).catch(function() { return cached; });
                return fetchPromise;
            })
        );
    }
});

self.addEventListener('push', function(e) {
    var data = e.data ? e.data.json() : {};
    self.registration.showNotification(data.title || 'ValoPOS', {
        body: data.body || 'تحديث من نظام الصيدلية',
        icon: '/icons/icon.svg',
        badge: '/icons/icon.svg',
        vibrate: [200, 100, 200]
    });
});

self.addEventListener('notificationclick', function(e) {
    e.notification.close();
    e.waitUntil(clients.openWindow('/'));
});
