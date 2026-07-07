/* ==========================================================================
   FieldOps Atlas Lightning
   File: FieldOpsAtlas/Features/Weather/lightning.js
   Version: 0.2.0-eumetview-live

   The official layer is EUMETSAT EUMETView WMS:
   mtg_fd:li_afa = MTG Lightning Imager accumulated flash area.

   Exact LI-2-LFL point data is supplied as 10-second NetCDF products.
   It must be converted by a server before this static GitHub Pages client
   can safely consume it.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "0.2.0-eumetview-live";
  const MAX_VISIBLE_AGE_MS = 20 * 60 * 1000;
  const MAX_IMPORTED_FLASHES = 10000;
  const UK_BOUNDS = [[49.75, -8.7], [60.95, 1.95]];
  const SKAGERRAK_BOUNDS = [[56.2, 4.5], [60.4, 13.5]];
  const SKAGERRAK_CENTER = [58.2, 9.0];
  const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const EUMETVIEW_WMS_URL = "https://view.eumetsat.int/geoserver/wms";
  const OSM_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
  const EUMETSAT_ATTRIBUTION =
    '&copy; <a href="https://view.eumetsat.int/" target="_blank" rel="noopener">EUMETSAT</a>';

  const state = {
    map: null,
    officialLayer: null,
    rawLayer: null,
    rawFlashes: new Map(),
    rejected: 0,
    layerLoadedAt: null,
    refreshTimer: null,
    renderTimer: null
  };

  const elements = {};

  function byId(id) {
    return document.getElementById(id);
  }

  function init() {
    captureElements();

    if (!window.L || !elements.map) {
      setStatus("Leaflet or the map container is unavailable.", "error");
      return;
    }

    initMap();
    bindControls();
    updateClock();
    window.setInterval(updateClock, 1000);
    state.renderTimer = window.setInterval(refreshRawPoints, 1000);
    state.refreshTimer = window.setInterval(refreshOfficialLayer, 5 * 60 * 1000);
    refreshOfficialLayer();
  }

  function captureElements() {
    elements.map = byId("weatherMap");
    elements.status = byId("statusText");
    elements.feedMode = byId("feedMode");
    elements.feedFreshness = byId("feedFreshness");
    elements.feedClock = byId("feedClock");
    elements.layerState = byId("layerState");
    elements.rawFlashCount = byId("rawFlashCount");
    elements.rejectedCount = byId("rejectedCount");
    elements.stormViewButton = byId("stormViewButton");
    elements.ukViewButton = byId("ukViewButton");
    elements.refreshLayerButton = byId("refreshLayerButton");
    elements.overlayOpacity = byId("overlayOpacity");
    elements.rawFeedUrl = byId("rawFeedUrl");
    elements.loadFeedUrlButton = byId("loadFeedUrlButton");
    elements.clearRawButton = byId("clearRawButton");
    elements.rawJsonInput = byId("rawJsonInput");
    elements.loadJsonButton = byId("loadJsonButton");
  }

  function initMap() {
    state.map = window.L.map(elements.map, {
      center: SKAGERRAK_CENTER,
      zoom: 6,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: false
    });

    const basePane = state.map.createPane("lightningBasePane");
    basePane.style.zIndex = "190";
    basePane.classList.add("weather-base-pane");

    const officialPane = state.map.createPane("lightningOfficialPane");
    officialPane.style.zIndex = "430";
    officialPane.style.pointerEvents = "none";
    officialPane.classList.add("weather-overlay-pane");

    const markerPane = state.map.createPane("lightningMarkerPane");
    markerPane.style.zIndex = "610";
    markerPane.style.pointerEvents = "auto";
    markerPane.classList.add("weather-marker-pane");

    window.L.control.zoom({ position: "topright" }).addTo(state.map);

    window.L.tileLayer(OSM_TILE_URL, {
      pane: "lightningBasePane",
      minZoom: 3,
      maxZoom: 12,
      noWrap: true,
      keepBuffer: 1,
      updateWhenIdle: true,
      updateWhenZooming: false,
      attribution: OSM_ATTRIBUTION
    }).addTo(state.map);

    state.rawLayer = window.L.layerGroup().addTo(state.map);
    state.map.fitBounds(SKAGERRAK_BOUNDS, { padding: [18, 18] });
    window.setTimeout(() => state.map.invalidateSize(), 160);
  }

  function bindControls() {
    elements.stormViewButton?.addEventListener("click", () => {
      state.map.fitBounds(SKAGERRAK_BOUNDS, { padding: [18, 18] });
    });

    elements.ukViewButton?.addEventListener("click", () => {
      state.map.fitBounds(UK_BOUNDS, { padding: [18, 18] });
    });

    elements.refreshLayerButton?.addEventListener("click", refreshOfficialLayer);

    elements.overlayOpacity?.addEventListener("input", () => {
      if (state.officialLayer) {
        state.officialLayer.setOpacity(Number(elements.overlayOpacity.value));
      }
    });

    elements.loadFeedUrlButton?.addEventListener("click", loadRawFeedUrl);
    elements.clearRawButton?.addEventListener("click", clearRawPoints);
    elements.loadJsonButton?.addEventListener("click", loadPastedJson);
  }

  function buildOfficialLayer() {
    return window.L.tileLayer.wms(EUMETVIEW_WMS_URL, {
      pane: "lightningOfficialPane",
      layers: "mtg_fd:li_afa",
      styles: "",
      format: "image/png",
      transparent: true,
      version: "1.3.0",
      opacity: Number(elements.overlayOpacity?.value || 0.88),
      attribution: EUMETSAT_ATTRIBUTION,
      uppercase: false,
      cacheBust: Date.now()
    });
  }

  function refreshOfficialLayer() {
    setStatus("Loading the latest official EUMETSAT LI layer.", "loading");
    elements.layerState.textContent = "Loading";
    elements.refreshLayerButton.disabled = true;

    if (state.officialLayer) {
      state.map.removeLayer(state.officialLayer);
      state.officialLayer = null;
    }

    const layer = buildOfficialLayer();
    state.officialLayer = layer;

    layer.once("load", () => {
      if (state.officialLayer !== layer) {
        return;
      }

      state.layerLoadedAt = new Date();
      elements.layerState.textContent = "Loaded";
      elements.refreshLayerButton.disabled = false;
      setStatus(
        "Official EUMETSAT MTG-LI accumulated flash-area layer loaded.",
        "live"
      );
      updateOfficialFreshness();
    });

    layer.on("tileerror", () => {
      if (state.officialLayer !== layer) {
        return;
      }

      elements.layerState.textContent = "Error";
      elements.refreshLayerButton.disabled = false;
      setStatus(
        "The EUMETSAT layer could not be loaded. Check the connection and try Refresh.",
        "error"
      );
    });

    layer.addTo(state.map);

    window.setTimeout(() => {
      if (state.officialLayer === layer && elements.refreshLayerButton.disabled) {
        elements.refreshLayerButton.disabled = false;
      }
    }, 15000);
  }

  function updateOfficialFreshness() {
    if (!state.layerLoadedAt) {
      elements.feedFreshness.textContent = "Official LI layer not loaded";
      return;
    }

    const time = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC"
    }).format(state.layerLoadedAt);

    elements.feedFreshness.textContent = `latest layer requested ${time} UTC`;
  }

  async function loadRawFeedUrl() {
    const url = String(elements.rawFeedUrl.value || "").trim();

    if (!url) {
      setStatus("Enter the converted JSON feed URL first.", "error");
      return;
    }

    elements.loadFeedUrlButton.disabled = true;
    elements.loadFeedUrlButton.textContent = "Loading";

    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      loadRawPayload(await response.json(), url);
    } catch (error) {
      setStatus(`Raw feed unavailable: ${error.message}`, "error");
    } finally {
      elements.loadFeedUrlButton.disabled = false;
      elements.loadFeedUrlButton.textContent = "Load URL";
    }
  }

  function loadPastedJson() {
    let payload;

    try {
      payload = JSON.parse(elements.rawJsonInput.value);
    } catch (error) {
      setStatus(`JSON parse error: ${error.message}`, "error");
      return;
    }

    loadRawPayload(payload, "Pasted JSON");
  }

  function loadRawPayload(payload, fallbackSource) {
    const result = normalisePayload(payload);
    state.rejected = result.rejected;

    if (!result.flashes.length) {
      clearRawPoints();
      updateMetrics();
      setStatus("No valid raw flashes were found.", "error");
      return;
    }

    clearRawPoints(false);
    addRawFlashes(result.flashes);
    fitRawBounds(result.flashes);

    setStatus(
      `Loaded ${result.flashes.length} raw flashes from ${result.source || fallbackSource}.`,
      "raw"
    );
  }

  function normalisePayload(payload) {
    let source = "";
    let rows = [];

    if (Array.isArray(payload)) {
      rows = payload;
    } else if (payload?.type === "FeatureCollection" && Array.isArray(payload.features)) {
      source = String(payload.source || payload.name || "GeoJSON");
      rows = payload.features;
    } else if (Array.isArray(payload?.flashes)) {
      source = String(payload.source || payload.product || "EUMETSAT MTG-LI LFL");
      rows = payload.flashes;
    } else if (Array.isArray(payload?.data)) {
      source = String(payload.source || payload.product || "Converted data");
      rows = payload.data;
    } else {
      return { source, flashes: [], rejected: 1 };
    }

    const flashes = [];
    const seen = new Set();
    let rejected = 0;

    rows.slice(0, MAX_IMPORTED_FLASHES).forEach((row, index) => {
      const flash = normaliseRow(row, index);

      if (!flash) {
        rejected += 1;
        return;
      }

      const key = flash.id || [
        flash.lat.toFixed(5),
        flash.lon.toFixed(5),
        Math.round(flash.time / 1000)
      ].join(":");

      if (seen.has(key)) {
        rejected += 1;
        return;
      }

      seen.add(key);
      flashes.push(flash);
    });

    if (rows.length > MAX_IMPORTED_FLASHES) {
      rejected += rows.length - MAX_IMPORTED_FLASHES;
    }

    return { source, flashes, rejected };
  }

  function normaliseRow(row, index) {
    if (!row || typeof row !== "object") {
      return null;
    }

    const properties = row.properties && typeof row.properties === "object"
      ? row.properties
      : row;

    const coordinates = row.geometry?.type === "Point"
      ? row.geometry.coordinates
      : null;

    const lat = Number(
      properties.lat ??
      properties.latitude ??
      (Array.isArray(coordinates) ? coordinates[1] : Number.NaN)
    );

    const lon = Number(
      properties.lon ??
      properties.lng ??
      properties.longitude ??
      (Array.isArray(coordinates) ? coordinates[0] : Number.NaN)
    );

    const time = parseTime(
      properties.time ??
      properties.timestamp ??
      properties.datetime ??
      properties.flash_time ??
      properties.time_utc
    );

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180 ||
      !Number.isFinite(time)
    ) {
      return null;
    }

    return {
      id: String(properties.id ?? properties.flash_id ?? `row-${index + 1}`),
      lat,
      lon,
      time,
      radiance: finiteOrNull(properties.radiance ?? properties.flash_radiance),
      quality: String(
        properties.quality ??
        properties.flash_filter_confidence ??
        properties.status ??
        "unknown"
      )
    };
  }

  function parseTime(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value > 100000000000 ? value : value * 1000;
    }

    if (typeof value === "string" && value.trim()) {
      const numeric = Number(value);

      if (Number.isFinite(numeric)) {
        return numeric > 100000000000 ? numeric : numeric * 1000;
      }

      const parsed = Date.parse(value);
      return Number.isFinite(parsed) ? parsed : Number.NaN;
    }

    return Number.NaN;
  }

  function finiteOrNull(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function addRawFlashes(flashes) {
    const now = Date.now();

    flashes.forEach((flash) => {
      if (now - flash.time > MAX_VISIBLE_AGE_MS) {
        state.rejected += 1;
        return;
      }

      const marker = window.L.marker([flash.lat, flash.lon], {
        pane: "lightningMarkerPane",
        keyboard: true,
        icon: createFlashIcon(flash, now)
      });

      marker.bindPopup(createPopupHtml(flash, now), {
        closeButton: true,
        className: "lightning-popup-shell"
      });

      marker.addTo(state.rawLayer);
      state.rawFlashes.set(flash.id, { data: flash, marker });
    });

    updateMetrics();
  }

  function createFlashIcon(flash, now) {
    const ageMs = Math.max(0, now - flash.time);
    const style = ageStyle(ageMs);
    const pulsing = ageMs <= 10000 ? " is-pulsing" : "";

    return window.L.divIcon({
      className: `lightning-marker-shell${pulsing}`,
      html: [
        '<span class="lightning-flash-ring" aria-hidden="true"></span>',
        '<span class="lightning-flash-dot" style="',
        `--flash-fill:${style.fill};`,
        `--flash-stroke:${style.stroke};`,
        `--flash-glow:${style.glow};`,
        `--flash-size:${style.size}px`,
        '" aria-hidden="true"></span>'
      ].join(""),
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
  }

  function createPopupHtml(flash, now) {
    const age = formatAge(Math.max(0, now - flash.time));
    const time = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC"
    }).format(new Date(flash.time));

    return [
      '<div class="lightning-popup">',
      `<strong>${escapeHtml(age)} old</strong>`,
      `<span>${escapeHtml(time)} UTC</span>`,
      `<span>${escapeHtml(flash.lat.toFixed(4))}, ${escapeHtml(flash.lon.toFixed(4))}</span>`,
      flash.radiance == null
        ? ""
        : `<span>Radiance: ${escapeHtml(String(flash.radiance))}</span>`,
      `<span>Quality: ${escapeHtml(flash.quality)}</span>`,
      '</div>'
    ].join("");
  }

  function ageStyle(ageMs) {
    if (ageMs <= 30000) {
      return {
        fill: "#ffffff",
        stroke: "#fff3a3",
        glow: "rgba(255, 238, 112, 0.92)",
        size: 9
      };
    }

    if (ageMs <= 2 * 60 * 1000) {
      return {
        fill: "#ffe86b",
        stroke: "#fff2a0",
        glow: "rgba(255, 232, 107, 0.82)",
        size: 8
      };
    }

    if (ageMs <= 5 * 60 * 1000) {
      return {
        fill: "#ffba3a",
        stroke: "#ffd37a",
        glow: "rgba(255, 186, 58, 0.66)",
        size: 7
      };
    }

    if (ageMs <= 10 * 60 * 1000) {
      return {
        fill: "#ff6b31",
        stroke: "#ff9b6f",
        glow: "rgba(255, 107, 49, 0.54)",
        size: 7
      };
    }

    return {
      fill: "#8e1e1e",
      stroke: "#c85d52",
      glow: "rgba(142, 30, 30, 0.42)",
      size: 6
    };
  }

  function refreshRawPoints() {
    const now = Date.now();

    state.rawFlashes.forEach((entry, id) => {
      const ageMs = now - entry.data.time;

      if (ageMs > MAX_VISIBLE_AGE_MS) {
        state.rawLayer.removeLayer(entry.marker);
        state.rawFlashes.delete(id);
        return;
      }

      entry.marker.setIcon(createFlashIcon(entry.data, now));
      entry.marker.setPopupContent(createPopupHtml(entry.data, now));
    });

    updateMetrics();
    updateOfficialFreshness();
  }

  function clearRawPoints(resetRejected = true) {
    state.rawLayer.clearLayers();
    state.rawFlashes.clear();

    if (resetRejected) {
      state.rejected = 0;
    }

    updateMetrics();
  }

  function fitRawBounds(flashes) {
    const points = flashes.map((flash) => [flash.lat, flash.lon]);

    if (points.length === 1) {
      state.map.setView(points[0], 8);
      return;
    }

    state.map.fitBounds(points, { padding: [26, 26], maxZoom: 8 });
  }

  function updateMetrics() {
    elements.rawFlashCount.textContent = String(state.rawFlashes.size);
    elements.rejectedCount.textContent = String(state.rejected);
  }

  function setStatus(message, mode) {
    elements.status.textContent = message;
    elements.feedMode.className = "weather-pill lightning-feed-pill";

    if (mode === "live") {
      elements.feedMode.textContent = "LIVE";
      elements.feedMode.classList.add("is-live");
      return;
    }

    if (mode === "raw") {
      elements.feedMode.textContent = "RAW";
      elements.feedMode.classList.add("is-raw");
      return;
    }

    if (mode === "error") {
      elements.feedMode.textContent = "ERROR";
      elements.feedMode.classList.add("is-error");
      return;
    }

    elements.feedMode.textContent = "LOADING";
    elements.feedMode.classList.add("is-loading");
  }

  function updateClock() {
    elements.feedClock.textContent = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC"
    }).format(new Date());
  }

  function formatAge(ageMs) {
    const seconds = Math.max(0, Math.floor(ageMs / 1000));

    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.FieldOpsLightning = {
    VERSION,
    refreshOfficialLayer,
    normalisePayload
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
