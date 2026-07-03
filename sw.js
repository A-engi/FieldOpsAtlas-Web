const CACHE_NAME = "fieldops-atlas-v1.1.14-rf-cache-refresh";
const MAP_FALLBACK = "./FieldOpsAtlas/Features/maps/index.html";

const CORE_FILES = [
  "./",
  "./index.html",
  MAP_FALLBACK,
  "./shell.css?v=1.1.22-weather-nav",
  "./shell.js?v=1.1.21-session-editor-token",
  "./components.css",
  "./theme.css",
  "./settings.html",
  "./data/icons/profile",
  "./FieldOpsAtlas/Features/Profile/index.html",
  "./FieldOpsAtlas/Features/RF/index.html",
  "./FieldOpsAtlas/Features/RF/background.css?v=1.1.76-graph-label",
  "./FieldOpsAtlas/Features/RF/rf-graph.css?v=1.1.85-network-topology",
  "./FieldOpsAtlas/Features/RF/rf-graph.js?v=1.1.90-builder-source",
  "./FieldOpsAtlas/Features/RF/rf-interface.css?v=1.1.120-pane-fit",
  "./FieldOpsAtlas/Features/RF/rf-interface.js?v=1.1.122-pane-fit",
  "./FieldOpsAtlas/Features/RF/rf-path-builder.js?v=1.1.125-network-topology",
  "./FieldOpsAtlas/Features/RF/rf-graph-builder-3.js?v=1.1.307-builder-3-near-surface-closed-core",
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
  "./FieldOpsAtlas/Features/Tools/index.html",
  "./FieldOpsAtlas/Features/Weather/index.html",
  "./FieldOpsAtlas/Features/Weather/styles.css?v=1.0.0-weather-map-shell",
  "./FieldOpsAtlas/Features/Weather/app.js?v=1.0.0-weather-map-shell",
  "./FieldOpsAtlas/Features/Weather/weather-display-style.js?v=0.1.2",
  "./FieldOpsAtlas/Features/Weather/rainviewer.html",
  "./FieldOpsAtlas/Features/Weather/rainviewer.js?v=1.0.0-weather-map-shell",
  "./FieldOpsAtlas/Features/Weather/openmeteo.html",
  "./FieldOpsAtlas/Features/Weather/openmeteo.js?v=1.0.0-weather-map-shell",
  "./FieldOpsAtlas/Features/Weather/metoffice.html",
  "./FieldOpsAtlas/Features/Weather/metoffice.js?v=1.0.0-weather-map-shell",
  "./FieldOpsAtlas/Features/Weather/ea-rainfall.html",
  "./FieldOpsAtlas/Features/Weather/ea-rainfall.js?v=1.0.0-weather-map-shell",
  "./FieldOpsAtlas/Features/Weather/data/regions.json"
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
