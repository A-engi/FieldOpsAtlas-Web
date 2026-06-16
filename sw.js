/* FIELDOPS ATLAS SERVICE WORKER v1.1.6-weather-map-cache
   Keeps the browser prototype usable offline where possible.
   Maps remains the main fallback page.
   Bumps the cache so Weather v0.3.5 replaces stale Weather provider-test assets.
*/

const CACHE_NAME = "fieldops-atlas-v1.1.6-weather-map-cache";
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
  "./data/icons/profile.svg",
  "./FieldOpsAtlas/Features/Profile/index.html",
  "./FieldOpsAtlas/Features/RF/index.html",
  "./FieldOpsAtlas/Features/RF/background.css?v=1.1.76-graph-label",
  "./FieldOpsAtlas/Features/RF/rf-graph.css?v=1.1.83-rename-graph-files",
  "./FieldOpsAtlas/Features/RF/rf-graph.js?v=1.1.87-rf-graph-source",
  "./FieldOpsAtlas/Features/RF/rf-interface.css?v=1.1.117-rfpages-layout-clear",
  "./FieldOpsAtlas/Features/RF/rf-interface.js?v=1.1.119-cream-graph-assets",
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
  "./FieldOpsAtlas/Features/Tools/index.html",
  "./FieldOpsAtlas/Features/Weather/index.html",
  "./FieldOpsAtlas/Features/Weather/styles.css?v=0.3.5-stadia-smooth-base-filter",
  "./FieldOpsAtlas/Features/Weather/weather-map.js?v=0.3.5-stadia-smooth-base-filter",
  "./FieldOpsAtlas/Features/Weather/rainviewer.html",
  "./FieldOpsAtlas/Features/Weather/rainviewer.js?v=0.3.4-real-rainviewer-overlay",
  "./FieldOpsAtlas/Features/Weather/openmeteo.html",
  "./FieldOpsAtlas/Features/Weather/openmeteo.js?v=0.3.0-demapped-weather-apis",
  "./FieldOpsAtlas/Features/Weather/metoffice.html",
  "./FieldOpsAtlas/Features/Weather/metoffice.css?v=0.3.1-metoffice-single-colour",
  "./FieldOpsAtlas/Features/Weather/metoffice.js?v=0.3.1-metoffice-single-colour",
  "./FieldOpsAtlas/Features/Weather/ea-rainfall.html",
  "./FieldOpsAtlas/Features/Weather/ea-rainfall.js?v=0.3.0-demapped-weather-apis",
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

/* Destination: sw.js */
/* End of file: sw.js */
