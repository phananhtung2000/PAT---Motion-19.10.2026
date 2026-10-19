/* PAT Motion – service worker (chỉ cache app shell + thư viện bản đồ; không đụng dữ liệu nghiệp vụ) */
const CACHE_PREFIX = 'pat-motion-cache-';
const CACHE_NAME = CACHE_PREFIX + 'v1'; // cập nhật: đổi v1 -> v2

const LOCAL_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];
const CDN_SHELL = [
  'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js',
  'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(LOCAL_SHELL);
      // CDN: lỗi mạng ở đây không được làm hỏng việc cài đặt
      await Promise.all(CDN_SHELL.map((u) => cache.add(u).catch(() => {})));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isCdnShell = CDN_SHELL.indexOf(req.url) !== -1;
  const isNavigate = req.mode === 'navigate';

  // Chỉ xử lý: trang chính, tệp tĩnh cùng nguồn, 2 tệp thư viện bản đồ đã khai báo.
  // Mọi request khác (API độ cao, thời tiết, tìm đường, ô bản đồ...) để trình duyệt tự xử lý.
  if (!(isCdnShell || (sameOrigin && (isNavigate || /\.(?:html|json|png|js)$/i.test(url.pathname) || url.pathname.endsWith('/'))))) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(req, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;
        return fetch(req).catch(() => {
          if (isNavigate) return cache.match('./index.html');
          return Response.error();
        });
      })
    )
  );
});
