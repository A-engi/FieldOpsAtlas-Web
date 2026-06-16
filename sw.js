/* FIELDOPS ATLAS SERVICE WORKER v1.1.2-web-maps-rfpages
   Keeps the browser prototype usable offline where possible.
   Maps remains the main fallback page.
*/

const CACHE_NAME = "fieldops-atlas-v1.1.2-web-maps-rfpages";
const MAP_FALLBACK = "./FieldOpsAtlas/Features/maps/index.html";

const CORE_FILES = [
  "./",
  "./index.html",
  MAP_FALLBACK,
  "./shell.css?v=1.1.21-shell-smoke-controls",
  "./shell.js?v=1.1.20-web-repo-profile-link",
  "./components.css",
  "./theme.css",
  "./settings.html",
  "./FieldOpsAtlas/Features/Profile/index.html",
  "./FieldOpsAtlas/Features/RF/index.html",
  "./FieldOpsAtlas/Features/RF/background.css?v=1.1.76-graph-label",
  "./FieldOpsAtlas/Features/RF/rf-graph.css?v=1.1.83-rename-graph-files",
  "./FieldOpsAtlas/Features/RF/rf-graph.js?v=1.1.86-graph-data-rename",
  "./FieldOpsAtlas/Features/RF/rf-interface.css?v=1.1.115-site-pack-panel",
  "./FieldOpsAtlas/Features/RF/rf-interface.js?v=1.1.118-graph-labels",
  "./FieldOpsAtlas/Features/RF/rf-path-builder.js?v=1.1.116-generic-demo-builder",
  "./FieldOpsAtlas/Features/RFPages/sites.html",
  "./FieldOpsAtlas/Features/RFPages/dtt.html",
  "./FieldOpsAtlas/Features/RFPages/dab.html",
  "./FieldOpsAtlas/Features/RFPages/fm.html",
  "./FieldOpsAtlas/Features/RFPages/services.html",
  "./FieldOpsAtlas/Features/RFPages/equipment.html",
  "./FieldOpsAtlas/Features/RFPages/paths.html",
  "./FieldOpsAtlas/Features/RFPages/settings.html",
  "./FieldOpsAtlas/Features/Network/index.html",
  "./FieldOpsAtlas/Features/Docs/index.html",
  "./FieldOpsAtlas/Features/Tools/index.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => {
        return caches.match(event.request, { ignoreSearch: true })
          .then((cached) => cached || caches.match(MAP_FALLBACK) || caches.match("./index.html"));
      })
  );
});
