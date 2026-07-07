/* ==========================================================================
   FieldOps Atlas Lightning Lab
   File: FieldOpsAtlas/Features/Weather/lightning.js
   Version: 0.1.0-lightning-mock

   This page deliberately does not call EUMETSAT directly:
   - MTG Lightning Imager L2 flashes arrive as NetCDF chunks.
   - A production service should download, validate, UK-filter and convert them.
   - The browser should receive only compact JSON or GeoJSON.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "0.1.0-lightning-mock";
  const MAX_VISIBLE_AGE_MS = 20 * 60 * 1000;
  const MAX_IMPORTED_FLASHES = 10000;
  const UK_BOUNDS = [[49.75, -8.7], [60.95, 1.95]];
  const UK_CENTER = [54.55, -3.15];
  const DEMO_BOUNDS = [[27.8, 76.2], [29.4, 78.4]];
  const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const OSM_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

  const state = {
    map: null,
    markerLayer: null,
    flashes: new Map(),
    rejected: 0,
    mode: "demo",
    simulationRunning: false,
    simulationTimer: null,
    renderTimer: null,
    sequence: 0
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
    state.renderTimer = window.setInterval(refreshVisibleFlashes, 1000);
    insertSampleJson();
    setStatus("Safe mock only. Load the test storm or paste converted JSON.", "demo");
  }

  function captureElements() {
    elements.map = byId("weatherMap");
    elements.status = byId("statusText");
    elements.feedMode = byId("feedMode");
    elements.feedFreshness = byId("feedFreshness");
    elements.feedClock = byId("feedClock");
    elements.sourceBadge = byId("sourceBadge");
    elements.flashCount = byId("flashCount");
    elements.newFlashCount = byId("newFlashCount");
    elements.rejectedCount = byId("rejectedCount");
    elements.ukViewButton = byId("ukViewButton");
    elements.demoStormButton = byId("demoStormButton");
    elements.simulationButton = byId("simulationButton");
    elements.rawJsonInput = byId("rawJsonInput");
    elements.loadJsonButton = byId("loadJsonButton");
    elements.sampleJsonButton = byId("sampleJsonButton");
  }

  function initMap() {
    state.map = window.L.map(elements.map, {
      center: UK_CENTER,
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

    state.markerLayer = window.L.layerGroup().addTo(state.map);
    window.setTimeout(() => state.map.invalidateSize(), 160);
  }

  function bindControls() {
    elements.ukViewButton?.addEventListener("click", () => {
      state.map.fitBounds(UK_BOUNDS, { padding: [20, 20] });
      setStatus("UK view selected. The mock feed remains visible only where its points are located.", state.mode);
    });

    elements.demoStormButton?.addEventListener("click", loadDemoStorm);

    elements.simulationButton?.addEventListener("click", () => {
      if (state.simulationRunning) {
        stopSimulation();
      } else {
        startSimulation();
      }
    });

    elements.loadJsonButton?.addEventListener("click", loadPastedJson);
    elements.sampleJsonButton?.addEventListener("click", insertSampleJson);
  }

  function loadDemoStorm() {
    stopSimulation();
    clearFlashes();
    state.mode = "demo";
    state.rejected = 0;

    const now = Date.now();
    const random = seededRandom(7072026);
    const flashes = [];

    for (let index = 0; index < 64; index += 1) {
      const cluster = index % 3;
      const centre = [
        [28.61, 77.21],
        [28.82, 77.02],
        [28.42, 77.48]
      ][cluster];
      const ageMs = Math.floor(random() * MAX_VISIBLE_AGE_MS);
      const spread = cluster === 1 ? 0.19 : 0.14;

      flashes.push({
        id: `demo-${index + 1}`,
        lat: centre[0] + ((random() - 0.5) * spread),
        lon: centre[1] + ((random() - 0.5) * spread * 1.25),
        time: now - ageMs,
        radiance: Number((2 + random() * 13).toFixed(2)),
        quality: "demo"
      });
    }

    addFlashes(flashes, { source: "Generated test storm" });
    state.map.fitBounds(DEMO_BOUNDS, { padding: [24, 24] });
    elements.simulationButton.disabled = false;
    elements.sourceBadge.textContent = "DEMO · Delhi-NCR";
    setStatus(
      "Generated test points only. Start feed adds synthetic flashes so the live behaviour can be tested.",
      "demo"
    );
  }

  function startSimulation() {
    if (state.simulationRunning) {
      return;
    }

    if (!state.flashes.size) {
      loadDemoStorm();
    }

    state.simulationRunning = true;
    elements.simulationButton.textContent = "Pause feed";

    state.simulationTimer = window.setInterval(() => {
      const stormCentres = [
        [28.61, 77.21],
        [28.82, 77.02],
        [28.42, 77.48]
      ];
      const centre = stormCentres[state.sequence % stormCentres.length];
      state.sequence += 1;

      addFlashes([{
        id: `sim-${Date.now()}-${state.sequence}`,
        lat: centre[0] + ((Math.random() - 0.5) * 0.16),
        lon: centre[1] + ((Math.random() - 0.5) * 0.2),
        time: Date.now(),
        radiance: Number((3 + Math.random() * 15).toFixed(2)),
        quality: "demo"
      }], { source: "Generated test storm" });
    }, 1500);

    setStatus("Synthetic feed running. These are not observed lightning flashes.", "demo");
  }

  function stopSimulation() {
    state.simulationRunning = false;

    if (state.simulationTimer) {
      window.clearInterval(state.simulationTimer);
      state.simulationTimer = null;
    }

    if (elements.simulationButton) {
      elements.simulationButton.textContent = "Start feed";
    }
  }

  function loadPastedJson() {
    stopSimulation();

    let payload;
    try {
      payload = JSON.parse(elements.rawJsonInput.value);
    } catch (error) {
      setStatus(`JSON parse error: ${error.message}`, "error");
      return;
    }

    const result = normalisePayload(payload);
    state.rejected = result.rejected;

    if (!result.flashes.length) {
      clearFlashes();
      updateMetrics();
      setStatus("No valid flashes were found in the pasted payload.", "error");
      return;
    }

    clearFlashes();
    state.mode = "raw";
    addFlashes(result.flashes, { source: result.source || "Pasted JSON" });
    fitFlashBounds(result.flashes);
    elements.simulationButton.disabled = true;
    elements.sourceBadge.textContent = result.source || "RAW JSON";

    setStatus(
      `Loaded ${result.flashes.length} validated flashes; rejected ${result.rejected}.`,
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
      source = String(payload.source || payload.product || "Converted MTG-LI");
      rows = payload.flashes;
    } else if (Array.isArray(payload?.data)) {
      source = String(payload.source || payload.product || "Converted data");
      rows = payload.data;
    } else {
      return { source, flashes: [], rejected: 1 };
    }

    const flashes = [];
    let rejected = 0;
    const seen = new Set();

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
      radiance: finiteOrNull(
        properties.radiance ??
        properties.flash_radiance ??
        properties.energy
      ),
      quality: String(
        properties.quality ??
        properties.quality_flag ??
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

  function addFlashes(flashes, options = {}) {
    const now = Date.now();

    flashes.forEach((flash) => {
      if (!flash || now - flash.time > MAX_VISIBLE_AGE_MS) {
        return;
      }

      const existing = state.flashes.get(flash.id);
      if (existing) {
        existing.data = flash;
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

      marker.addTo(state.markerLayer);
      state.flashes.set(flash.id, {
        data: flash,
        marker
      });
    });

    updateMetrics();
    updateFreshness(options.source);
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

  function refreshVisibleFlashes() {
    const now = Date.now();

    state.flashes.forEach((entry, id) => {
      const ageMs = now - entry.data.time;

      if (ageMs > MAX_VISIBLE_AGE_MS) {
        state.markerLayer.removeLayer(entry.marker);
        state.flashes.delete(id);
        return;
      }

      entry.marker.setIcon(createFlashIcon(entry.data, now));
      entry.marker.setPopupContent(createPopupHtml(entry.data, now));
    });

    updateMetrics();
    updateFreshness();
  }

  function updateMetrics() {
    const now = Date.now();
    let recent = 0;

    state.flashes.forEach((entry) => {
      if (now - entry.data.time <= 2 * 60 * 1000) {
        recent += 1;
      }
    });

    elements.flashCount.textContent = String(state.flashes.size);
    elements.newFlashCount.textContent = String(recent);
    elements.rejectedCount.textContent = String(state.rejected);
  }

  function updateFreshness(source) {
    const latest = latestFlash();

    if (!latest) {
      elements.feedFreshness.textContent = "No feed loaded";
      return;
    }

    const ageMs = Math.max(0, Date.now() - latest.time);
    const prefix = source ? `${source} · ` : "";
    elements.feedFreshness.textContent = `${prefix}newest ${formatAge(ageMs)} ago`;
  }

  function latestFlash() {
    let latest = null;

    state.flashes.forEach((entry) => {
      if (!latest || entry.data.time > latest.time) {
        latest = entry.data;
      }
    });

    return latest;
  }

  function fitFlashBounds(flashes) {
    const points = flashes.map((flash) => [flash.lat, flash.lon]);

    if (points.length === 1) {
      state.map.setView(points[0], 8);
      return;
    }

    state.map.fitBounds(points, { padding: [26, 26], maxZoom: 8 });
  }

  function clearFlashes() {
    state.markerLayer.clearLayers();
    state.flashes.clear();
    updateMetrics();
    updateFreshness();
  }

  function setStatus(message, mode) {
    elements.status.textContent = message;
    elements.feedMode.className = "weather-pill lightning-feed-pill";

    if (mode === "raw") {
      state.mode = "raw";
      elements.feedMode.textContent = "RAW";
      elements.feedMode.classList.add("is-raw");
      return;
    }

    if (mode === "error") {
      elements.feedMode.textContent = "ERROR";
      elements.feedMode.classList.add("is-error");
      return;
    }

    state.mode = "demo";
    elements.feedMode.textContent = "DEMO";
    elements.feedMode.classList.add("is-demo");
  }

  function updateClock() {
    if (!elements.feedClock) {
      return;
    }

    elements.feedClock.textContent = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC"
    }).format(new Date());
  }

  function insertSampleJson() {
    const now = Date.now();

    const sample = {
      source: "Example converted MTG-LI JSON",
      generatedAt: new Date(now).toISOString(),
      flashes: [
        {
          id: "sample-1",
          latitude: 51.5074,
          longitude: -0.1278,
          timestamp: new Date(now - 12000).toISOString(),
          radiance: 8.4,
          quality: "example"
        },
        {
          id: "sample-2",
          latitude: 52.4862,
          longitude: -1.8904,
          timestamp: new Date(now - 92000).toISOString(),
          radiance: 5.1,
          quality: "example"
        },
        {
          id: "sample-3",
          latitude: 53.4808,
          longitude: -2.2426,
          timestamp: new Date(now - 225000).toISOString(),
          radiance: 3.6,
          quality: "example"
        }
      ]
    };

    elements.rawJsonInput.value = JSON.stringify(sample, null, 2);
  }

  function formatAge(ageMs) {
    const seconds = Math.max(0, Math.floor(ageMs / 1000));

    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function seededRandom(seed) {
    let value = seed >>> 0;

    return function next() {
      value += 0x6D2B79F5;
      let result = value;
      result = Math.imul(result ^ (result >>> 15), result | 1);
      result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  window.FieldOpsLightningLab = {
    VERSION,
    normalisePayload,
    loadDemoStorm
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
