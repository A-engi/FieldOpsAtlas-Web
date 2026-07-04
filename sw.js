const CACHE_NAME = "fieldops-atlas-v1.1.24-rf-historical-mountain";
const MAP_FALLBACK = "./FieldOpsAtlas/Features/maps/index.html";

const CORE_FILES = [
  "./",
  "./index.html",
  MAP_FALLBACK,
  "./shell.css?v=1.1.22-weather-nav",
  "./shell.js?v=1.1.22-no-weather-shell-nav",
  "./components.css",
  "./theme.css",
  "./settings.html",
  "./data/icons/profile",
  "./FieldOpsAtlas/Features/Profile/index.html",
  "./FieldOpsAtlas/Features/RF/index.html",
  "./FieldOpsAtlas/Features/RF/background.css?v=1.1.76-graph-label",
  "./FieldOpsAtlas/Features/RF/rf-graph.css?v=1.1.85-network-topology",
  "./FieldOpsAtlas/Features/RF/rf-interface.css?v=1.1.120-pane-fit",
  "./FieldOpsAtlas/Features/RF/rf-interface.js?v=1.1.122-pane-fit",
  "./FieldOpsAtlas/Features/RF/rf-path-builder.js?v=1.1.125-network-topology",
  "./FieldOpsAtlas/Features/RF/rf-graph.js?v=1.1.116-revert-jagged-range",
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
  "./FieldOpsAtlas/Features/Docs/ops-page.css",
  "./FieldOpsAtlas/Features/Docs/job-readiness.html",
  "./FieldOpsAtlas/Features/Docs/site-reporting.html",
  "./FieldOpsAtlas/Features/Docs/manuals-methods.html",
  "./FieldOpsAtlas/Features/Docs/admin-stock.html",
  "./FieldOpsAtlas/Features/Tools/index.html",
  "./FieldOpsAtlas/Features/Weather/metoffice-warning.js?v=1.0.7-map-weather-only"
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
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || !response.ok) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((cached) => cached || caches.match(MAP_FALLBACK) || caches.match("./index.html"));
      })
  );
});
