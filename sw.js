const CACHE_NAME = 'bible-searcher-v1.012'; // Оновив версію для скидання кешу

const ASSETS = [
  'index.html',
  'reader.html',
  'reader.js',
  'script.js',      // Додав ваш основний скрипт
  'app.webmanifest.json',
  'bibleTextUA.json',
  'bibleTextRU.json',
  'icon-192.png',
  'icon-512.png',
  'bg.jpg'
];

// 1. Встановлення
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Активація (очищення старих версій)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Стратегія "Stale-While-Revalidate" з фільтрацією запитів
self.addEventListener('fetch', (event) => {
  // ФІКС ПОМИЛКИ: Ігноруємо запити від розширень (chrome-extension://)
  // Кешуємо лише стандартні запити http та https
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Зберігаємо в кеш тільки успішні відповіді від сервера
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Якщо мережі немає, помилка не повинна валити скрипт
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});

// 4. Подія для отримання версії
self.addEventListener('message', (event) => {
  if (event.data.action === 'getVersion') {
    event.source.postMessage({
      version: CACHE_NAME
    });
  }
});
