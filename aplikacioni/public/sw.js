const CACHE_NAME = "rideshare-public-v1";
const OFFLINE_URL = "/offline.html";
const PUBLIC_API_URL = "/api/udhetimet";
const PUBLIC_ASSETS = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

function withCacheHeaders(response, source, savedAt) {
  const headers = new Headers(response.headers);
  headers.set("X-RideShare-Source", source);
  headers.set("X-RideShare-Saved-At", savedAt);
  return response.clone().arrayBuffer().then((body) =>
    new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PUBLIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname === PUBLIC_API_URL) {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Public API request failed");
          }
          const savedAt = new Date().toISOString();
          const cachedResponse = await withCacheHeaders(response, "server", savedAt);
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, cachedResponse.clone());
          return cachedResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (!cached) {
            return Response.json(
              { error: "Lista nuk është ende e ruajtur në pajisje." },
              { status: 503 }
            );
          }
          return withCacheHeaders(
            cached,
            "cache",
            cached.headers.get("X-RideShare-Saved-At") || ""
          );
        })
    );
    return;
  }

  if (PUBLIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});
