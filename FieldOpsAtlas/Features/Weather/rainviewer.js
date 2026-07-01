(() => {
  "use strict";

  const Lab = window.AtlasWeatherLab;
  const Style = window.FIELDOPS_WEATHER_DISPLAY_STYLE;
  const RAINVIEWER_API = "https://api.rainviewer.com/public/weather-maps.json";

  const state = {
    map: null,
    layer: null,
    host: "",
    frames: []
  };

  const els = {
    status: document.getElementById("statusText"),
    load: document.getElementById("loadRadarButton"),
    range: document.getElementById("radarFrameRange"),
    time: document.getElementById("radarTimeLabel"),
    count: document.getElementById("radarFrameCount")
  };

  init();

  function init() {
    state.map = Lab.initMap();
    bindEvents();
    loadFrames({ manual: false });
  }

  function bindEvents() {
    els.load?.addEventListener("click", () => loadFrames({ manual: true }));
    els.range?.addEventListener("input", () => showFrame(Number(els.range.value || 0)));
  }

  async function loadFrames({ manual }) {
    Lab.setBusy(els.load, true, "Loading...", "Refresh");

    try {
      setStatus("Loading...");
      const response = await fetch(RAINVIEWER_API, { cache: "no-store" });
      if (!response.ok) throw new Error(`RainViewer HTTP ${response.status}`);

      const data = await response.json();
      const frames = data?.radar?.past || [];
      if (!frames.length) throw new Error("No radar frames.");

      state.host = String(data.host || "");
      state.frames = frames
        .map((frame, index) => ({
          index,
          time: Number(frame.time),
          path: String(frame.path || "")
        }))
        .filter((frame) => frame.time && frame.path);

      if (!state.frames.length) throw new Error("No usable radar frames.");

      configureRange();
      showFrame(state.frames.length - 1);
      setStatus(manual ? "Loaded." : "Loaded.");
    } catch (error) {
      clearRadar();
      setStatus(error?.message || "RainViewer failed.");
    } finally {
      Lab.setBusy(els.load, false, "Loading...", "Refresh");
    }
  }

  function configureRange() {
    if (!els.range) return;
    els.range.disabled = false;
    els.range.min = "0";
    els.range.max = String(state.frames.length - 1);
    els.range.value = String(state.frames.length - 1);
  }

  function showFrame(index) {
    const frame = state.frames[index];
    if (!frame || !state.map) {
      clearRadar();
      return;
    }

    const scheme = Number(Style?.rainViewer?.freeColourScheme || 2);
    const opacity = Number(Style?.rainViewer?.defaultOpacity || 0.95);
    const template = `${state.host}${frame.path}/256/{z}/{x}/{y}/${scheme}/1_1.png`;

    clearRadar();
    state.layer = window.L.tileLayer(template, {
      pane: "weatherOverlayPane",
      minZoom: 5,
      maxZoom: 11,
      tileSize: 256,
      opacity,
      keepBuffer: 1,
      noWrap: true,
      updateWhenIdle: true,
      updateWhenZooming: false,
      attribution: '&copy; <a href="https://www.rainviewer.com/" target="_blank" rel="noopener">RainViewer</a>'
    }).addTo(state.map);

    if (els.range) els.range.value = String(index);
    if (els.count) els.count.textContent = `${index + 1}/${state.frames.length}`;
    if (els.time) els.time.textContent = Lab.formatDateTime(frame.time);
  }

  function clearRadar() {
    if (state.layer && state.map) {
      state.map.removeLayer(state.layer);
      state.layer = null;
    }

    if (els.count) els.count.textContent = "0";
    if (els.time) els.time.textContent = "Not loaded";
    if (els.range) {
      els.range.disabled = true;
      els.range.value = "0";
      els.range.max = "0";
    }
  }

  function setStatus(message) {
    if (els.status) els.status.textContent = message;
  }
})();
