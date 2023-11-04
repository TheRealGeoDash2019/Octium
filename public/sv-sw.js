importScripts("./sv/sv.sw.js");

const sw = new SVServiceWorker();

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));