self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // optional caching logic
});

self.addEventListener("push", (event) => {
  const title = "Pengingat Jurnal PKL";

  const options = {
    body: event.data
      ? event.data.text()
      : "Jangan lupa mengisi jurnal hari ini.",
    icon: "/icon-192.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
