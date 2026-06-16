/* FieldOps Atlas Weather map v0.3.6
   Destination: FieldOpsAtlas/Features/Weather/weather-map.js

   Purpose:
   - Load a lightweight Weather-only Leaflet map.
   - Use Stadia Alidade Smooth via domain authentication; no API key is stored in GitHub or browser storage.
   - Apply the base colour filter before weather APIs/overlays arrive.
   - Map RainViewer radar tiles above the basemap in an unfiltered weather pane.
   - Do not load Atlas Maps region/site/editor modules.
*/

(() => {
  "use strict";

  const VERSION = "0.3.6";
  const UK_BOUNDS = [[49.75, -8.7], [60.95, 1.95]];
  const UK_CENTER = [54.55, -3.15];

  const STADIA_TILE_URL = "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
  const OSM_FALLBACK_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const RAINVIEWER_API = "https://api.rainviewer.com/public/weather-maps.json";
  const RAINVIEWER_SCHEME = 2;
  const RAINVIEWER_OPACITY = 0.92;

  const state = {
    map: null,
    baseLayer: null,
    radarLayer: null,
    tileErrors: 0,
    usingFallback: false,
    radarHost: "",
    radarFrames: [],
    radarIndex: 0
  };

  const els = {
    map: document.getElementById("weatherMap"),
    status: document.getElementById("weatherMapStatus"),
    reloadRadar: document.getElementById("loadRainViewerButton"),
    radarRange: document.getElementById("rainFrameRange"),
    radarTime: document.getElementById("rainFrameTime")
  };

  init();

  function init() {
    if (!window.L) {
      setStatus("Map library failed to load.");
      return;
    }

    if (!els.map) {
      setStatus("Weather map container missing.");
      return;
    }

    bindEvents();
    initMap();
    loadSmoothBase();
    loadRainViewer({ manual: false });
  }

  function bindEvents() {
    els.reloadRadar?.addEventListener("click", () => loadRainViewer({ manual: true }));
    els.radarRange?.addEventListener("input", () => {
      showRadarFrame(Number(els.radarRange.value || 0));
    });
  }

  function initMap() {
    const L = window.L;

    state.map = L.map(els.map, {
      center: UK_CENTER,
      zoom: 6,
      minZoom: 5,
      maxZoom: 11,
      maxBounds: UK_BOUNDS,
      maxBoundsViscosity: 0.9,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: false
    });

    createPane("weatherBasePane", 200, "auto", "weather-base-pane");
    createPane("weatherLayerPane", 430, "none", "weather-layer-pane");
    createPane("weatherMarkerPane", 600, "auto", "weather-marker-pane");
    createPane("weatherControlPane", 650, "auto", "weather-control-pane");

    window.setTimeout(() => state.map.invalidateSize(), 120);
  }

  function createPane(name, zIndex, pointerEvents, className) {
    const pane = state.map.getPane(name) || state.map.createPane(name);
    pane.style.zIndex = String(zIndex);
    pane.style.pointerEvents = pointerEvents;
    if (className) pane.classList.add(className);
    return pane;
  }

  function loadSmoothBase() {
    state.usingFallback = false;
    state.tileErrors = 0;
    replaceBaseLayer(makeStadiaLayer());

    setStatus("Loading Stadia Alidade Smooth via domain auth...");
  }

  function makeStadiaLayer() {
    const L = window.L;

    const layer = L.tileLayer(STADIA_TILE_URL, {
      pane: "weatherBasePane",
      minZoom: 5,
      maxZoom: 11,
      keepBuffer: 1,
      noWrap: true,
      updateWhenIdle: true,
      updateWhenZooming: false,
      detectRetina: true,
      attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank" rel="noopener">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    });

    layer.on("tileload", () => {
      if (!state.usingFallback && !state.radarFrames.length) {
        setStatus("Stadia Alidade Smooth loaded. Loading RainViewer radar...");
      }
    });

    layer.on("tileerror", () => {
      state.tileErrors += 1;
      if (!state.usingFallback && state.tileErrors >= 3) {
        loadOsmFallback();
      }
    });

    return layer;
  }

  function loadOsmFallback() {
    state.usingFallback = true;
    state.tileErrors = 0;
    replaceBaseLayer(makeOsmFallbackLayer());
    setStatus("Stadia tiles did not load. Showing filtered OSM fallback while RainViewer loads.");
  }

  function makeOsmFallbackLayer() {
    const L = window.L;

    return L.tileLayer(OSM_FALLBACK_URL, {
      pane: "weatherBasePane",
      minZoom: 5,
      maxZoom: 11,
      keepBuffer: 1,
      noWrap: true,
      updateWhenIdle: true,
      updateWhenZooming: false,
      detectRetina: false,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    });
  }

  function replaceBaseLayer(layer) {
    if (state.baseLayer && state.map) {
      state.map.removeLayer(state.baseLayer);
    }

    state.baseLayer = layer;
    state.baseLayer.addTo(state.map);
  }

  async function loadRainViewer({ manual } = { manual: false }) {
    if (els.reloadRadar) {
      els.reloadRadar.disabled = true;
      els.reloadRadar.textContent = manual ? "Reloading radar..." : "Loading radar...";
    }

    try {
      setStatus("Loading RainViewer radar frames...");
      const response = await fetch(RAINVIEWER_API, { cache: "no-store" });
      if (!response.ok) throw new Error(`RainViewer HTTP ${response.status}`);

      const data = await response.json();
      const frames = data?.radar?.past || [];
      if (!frames.length) throw new Error("No observed RainViewer radar frames returned.");

      state.radarHost = String(data.host || "");
      state.radarFrames = frames
        .map((frame, index) => ({
          index,
          time: Number(frame.time),
          path: String(frame.path || "")
        }))
        .filter((frame) => frame.time && frame.path);

      if (!state.radarFrames.length) throw new Error("RainViewer returned frames without usable tile paths.");

      state.radarIndex = Math.max(0, state.radarFrames.length - 1);

      if (els.radarRange) {
        els.radarRange.disabled = false;
        els.radarRange.min = "0";
        els.radarRange.max = String(state.radarFrames.length - 1);
        els.radarRange.value = String(state.radarIndex);
      }

      showRadarFrame(state.radarIndex);
      setStatus(`RainViewer radar mapped. ${state.radarFrames.length} frames available; base filter does not affect radar colours.`);
    } catch (error) {
      removeRadarLayer();
      state.radarFrames = [];
      state.radarIndex = 0;
      if (els.radarRange) {
        els.radarRange.disabled = true;
        els.radarRange.min = "0";
        els.radarRange.max = "0";
        els.radarRange.value = "0";
      }
      setFrameTime("Radar unavailable.");
      setStatus(error?.message || "RainViewer radar load failed.");
    } finally {
      if (els.reloadRadar) {
        els.reloadRadar.disabled = false;
        els.reloadRadar.textContent = "Reload radar";
      }
    }
  }

  function showRadarFrame(index) {
    const frame = state.radarFrames[index];
    if (!frame) {
      removeRadarLayer();
      setFrameTime("Radar frame not loaded.");
      return;
    }

    state.radarIndex = index;
    const template = `${state.radarHost}${frame.path}/256/{z}/{x}/{y}/${RAINVIEWER_SCHEME}/1_1.png`;

    removeRadarLayer();

    state.radarLayer = window.L.tileLayer(template, {
      pane: "weatherLayerPane",
      minZoom: 5,
      maxZoom: 11,
      tileSize: 256,
      opacity: RAINVIEWER_OPACITY,
      keepBuffer: 1,
      noWrap: true,
      updateWhenIdle: true,
      updateWhenZooming: false,
      crossOrigin: false,
      attribution: '&copy; <a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>'
    });

    state.radarLayer.addTo(state.map);

    setFrameTime(`${index + 1}/${state.radarFrames.length} · ${formatDateTime(frame.time)}`);
  }

  function removeRadarLayer() {
    if (state.radarLayer && state.map) {
      state.map.removeLayer(state.radarLayer);
      state.radarLayer = null;
    }
  }

  function formatDateTime(epochSeconds) {
    const date = new Date(Number(epochSeconds) * 1000);
    if (Number.isNaN(date.getTime())) return "Unknown time";

    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short"
    }).format(date);
  }

  function setFrameTime(message) {
    if (els.radarTime) els.radarTime.textContent = message;
  }

  function setStatus(message) {
    if (els.status) els.status.textContent = message;
  }

  window.FieldOpsWeatherMap = {
    VERSION,
    getMap: () => state.map,
    getBaseLayer: () => state.baseLayer,
    getRadarLayer: () => state.radarLayer,
    getWeatherPaneName: () => "weatherLayerPane",
    reloadSmoothBase: loadSmoothBase,
    reloadRainViewer: () => loadRainViewer({ manual: true })
  };
})();

/* End of file: FieldOpsAtlas/Features/Weather/weather-map.js */
