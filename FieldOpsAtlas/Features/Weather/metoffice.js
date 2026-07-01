(() => {
  "use strict";

  const Lab = window.AtlasWeatherLab;
  const VERSION = "1.0.0";
  const DEFAULT_ORDER_ID = "Maps-uk1";
  const METOFFICE_MAP_IMAGES_BASE = "https://data.hub.api.metoffice.gov.uk/map-images/1.0.0";
  const UK_TIME_ZONE = "Europe/London";

  const STORAGE = {
    key: "atlasWeatherLab.metOffice.mapImages.apiKey",
    order: "atlasWeatherLab.metOffice.mapImages.orderId",
    layer: "atlasWeatherLab.metOffice.v041.layer",
    frame: "atlasWeatherLab.metOffice.v041.frame",
    cachePrefix: "atlasWeatherLab.metOffice.mapImages.fileCache.v041."
  };

  const LAYERS = {
    rainfall: { label: "Rain", patterns: [/precip/i, /rainfall/i, /rain/i], empty: "No rainfall files." },
    cloud: { label: "Cloud", patterns: [/cloud/i], empty: "No cloud files." },
    pressure: { label: "Pressure", patterns: [/pressure/i, /mean[_-]?sea/i, /meansea/i, /mslp/i, /msl/i], empty: "No pressure files." },
    temperature: { label: "Temp", patterns: [/temperature/i, /temp/i], empty: "No temperature files." }
  };

  const els = {
    status: byId("moStatus"),
    apiKey: byId("moApiKey"),
    orderId: byId("moOrderId"),
    save: byId("moSaveSettings"),
    forget: byId("moForgetSettings"),
    refresh: byId("moRefreshOrder"),
    layerButtons: Array.from(document.querySelectorAll(".mo-layer-button[data-layer]")),
    count: byId("moFrameCount"),
    prev: byId("moPrevFrame"),
    next: byId("moNextFrame"),
    slider: byId("moFrameSlider"),
    valid: byId("moValidUkLabel")
  };

  const state = {
    map: null,
    imageLayer: null,
    fileIds: [],
    frames: [],
    layer: getStoredLayer(),
    frameKey: localStorage.getItem(STORAGE.frame) || "000",
    selectedFileId: "",
    rawUrl: ""
  };

  init();

  function init() {
    state.map = Lab.initMap();
    restoreSettingsInputs();
    bindEvents();
    applyLayerButtons();
    applyFrameUi();
    bootstrap();
  }

  function bindEvents() {
    els.save?.addEventListener("click", () => {
      saveSettings();
      loadOrder({ forceRefresh: false, previewAfter: true });
    });
    els.forget?.addEventListener("click", forgetSettings);
    els.refresh?.addEventListener("click", () => loadOrder({ forceRefresh: true, previewAfter: true }));
    els.layerButtons.forEach((button) => button.addEventListener("click", () => setLayer(button.dataset.layer)));
    els.prev?.addEventListener("click", () => bumpFrame(-1));
    els.next?.addEventListener("click", () => bumpFrame(1));
    els.slider?.addEventListener("input", () => {
      const frame = state.frames[Number(els.slider.value || 0)];
      if (!frame) return;
      state.frameKey = frame.key;
      localStorage.setItem(STORAGE.frame, state.frameKey);
      chooseSelectedFrame();
      applyFrameUi();
    });
    els.slider?.addEventListener("change", loadSelectedImage);
  }

  async function bootstrap() {
    if (!getApiKey() || !getOrderId()) {
      setStatus("Add key and order.");
      return;
    }

    const cached = readCachedFiles(getOrderId());
    if (cached.length) {
      state.fileIds = cached;
      rebuildLayerFiles();
      setStatus("Loaded.");
      await loadSelectedImage();
      return;
    }

    await loadOrder({ forceRefresh: false, previewAfter: true });
  }

  async function loadOrder({ forceRefresh, previewAfter }) {
    const apiKey = getApiKey();
    const orderId = getOrderId();
    if (!apiKey || !orderId) {
      setStatus("Add key and order.");
      return;
    }

    saveSettings();
    disableControls(true);

    try {
      const cached = forceRefresh ? [] : readCachedFiles(orderId);
      if (cached.length) {
        state.fileIds = cached;
        rebuildLayerFiles();
        setStatus("Loaded.");
        if (previewAfter) await loadSelectedImage();
        return;
      }

      setStatus("Loading...");
      const url = `${METOFFICE_MAP_IMAGES_BASE}/orders/${encodeURIComponent(orderId)}/latest?detail=MINIMAL`;
      const response = await fetch(url, { headers: { Accept: "application/json", apikey: apiKey } });
      if (!response.ok) throw new Error(`Met Office HTTP ${response.status}`);

      const files = findFileIds(await response.json());
      if (!files.length) throw new Error("No image files.");

      state.fileIds = files;
      writeCachedFiles(orderId, files);
      rebuildLayerFiles();
      setStatus("Loaded.");
      if (previewAfter) await loadSelectedImage();
    } catch (error) {
      setStatus(error?.message || "Met Office failed.");
    } finally {
      disableControls(false);
    }
  }

  async function loadSelectedImage() {
    const apiKey = getApiKey();
    const orderId = getOrderId();
    if (!apiKey || !orderId) {
      setStatus("Add key and order.");
      return;
    }

    if (!state.frames.length || !state.selectedFileId) {
      setStatus(LAYERS[state.layer].empty);
      clearImageLayer();
      return;
    }

    disableControls(true);
    clearImageUrl();

    try {
      setStatus("Loading...");
      const includeLand = state.layer === "rainfall" ? "false" : "true";
      const url = `${METOFFICE_MAP_IMAGES_BASE}/orders/${encodeURIComponent(orderId)}/latest/${encodeURIComponent(state.selectedFileId)}/data?includeLand=${includeLand}`;
      const response = await fetch(url, { headers: { Accept: "image/png", apikey: apiKey } });
      if (!response.ok) throw new Error(`Met Office image HTTP ${response.status}`);

      const blob = await response.blob();
      state.rawUrl = URL.createObjectURL(blob);
      drawImageLayer();
      setStatus("Loaded.");
    } catch (error) {
      setStatus(error?.message || "Met Office image failed.");
    } finally {
      disableControls(false);
    }
  }

  function drawImageLayer() {
    clearImageLayer();
    state.imageLayer = window.L.imageOverlay(state.rawUrl, Lab.UK_BOUNDS, {
      pane: "weatherOverlayPane",
      opacity: state.layer === "rainfall" ? 0.92 : 0.78,
      className: "weather-map-image"
    }).addTo(state.map);
    state.map.fitBounds(Lab.UK_BOUNDS, { padding: [4, 4] });
  }

  function setLayer(layer) {
    if (!LAYERS[layer] || state.layer === layer) return;
    state.layer = layer;
    localStorage.setItem(STORAGE.layer, layer);
    rebuildLayerFiles();
    applyLayerButtons();
    applyFrameUi();
    loadSelectedImage();
  }

  function bumpFrame(delta) {
    if (!state.frames.length) return;
    const currentIndex = Math.max(0, state.frames.findIndex((frame) => frame.key === state.frameKey));
    const nextIndex = Math.min(state.frames.length - 1, Math.max(0, currentIndex + delta));
    state.frameKey = state.frames[nextIndex].key;
    localStorage.setItem(STORAGE.frame, state.frameKey);
    chooseSelectedFrame();
    applyFrameUi();
    loadSelectedImage();
  }

  function rebuildLayerFiles() {
    const layerConfig = LAYERS[state.layer] || LAYERS.rainfall;
    state.frames = state.fileIds
      .filter((fileId) => layerConfig.patterns.some((pattern) => pattern.test(fileId)))
      .map((fileId, index) => ({ fileId, index, key: extractFrameKey(fileId), valid: extractValidTime(fileId) }))
      .sort((a, b) => {
        const at = a.valid ? a.valid.getTime() : 0;
        const bt = b.valid ? b.valid.getTime() : 0;
        return at - bt || a.fileId.localeCompare(b.fileId);
      });
    chooseSelectedFrame();
  }

  function chooseSelectedFrame() {
    if (!state.frames.length) {
      state.selectedFileId = "";
      return;
    }

    const preferred = state.frames.find((frame) => frame.key === state.frameKey) || state.frames[state.frames.length - 1];
    state.frameKey = preferred.key;
    state.selectedFileId = preferred.fileId;
    localStorage.setItem(STORAGE.frame, state.frameKey);
  }

  function applyLayerButtons() {
    els.layerButtons.forEach((button) => {
      const active = button.dataset.layer === state.layer;
      button.classList.toggle("is-primary", active);
      button.classList.toggle("is-active", active);
    });
  }

  function applyFrameUi() {
    const index = Math.max(0, state.frames.findIndex((frame) => frame.fileId === state.selectedFileId));
    if (els.slider) {
      els.slider.max = String(Math.max(0, state.frames.length - 1));
      els.slider.value = String(index);
      els.slider.disabled = state.frames.length <= 1;
    }
    if (els.count) els.count.textContent = state.frames.length ? `${index + 1}/${state.frames.length}` : "0/0";
    const current = state.frames[index];
    if (els.valid) els.valid.textContent = current?.valid ? formatDate(current.valid) : "UK time unavailable";
  }

  function disableControls(disabled) {
    [els.save, els.forget, els.refresh, els.prev, els.next, els.slider, ...els.layerButtons].forEach((element) => {
      if (element) element.disabled = Boolean(disabled);
    });
  }

  function clearImageLayer() {
    if (state.imageLayer && state.map) {
      state.map.removeLayer(state.imageLayer);
      state.imageLayer = null;
    }
    clearImageUrl();
  }

  function clearImageUrl() {
    if (state.rawUrl) URL.revokeObjectURL(state.rawUrl);
    state.rawUrl = "";
  }

  function saveSettings() {
    const apiKey = els.apiKey?.value.trim() || "";
    const orderId = els.orderId?.value.trim() || "";
    if (apiKey) localStorage.setItem(STORAGE.key, apiKey);
    if (orderId) localStorage.setItem(STORAGE.order, orderId);
    restoreSettingsInputs();
  }

  function forgetSettings() {
    localStorage.removeItem(STORAGE.key);
    localStorage.removeItem(STORAGE.order);
    localStorage.removeItem(STORAGE.frame);
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE.cachePrefix))
      .forEach((key) => localStorage.removeItem(key));
    state.fileIds = [];
    state.frames = [];
    state.selectedFileId = "";
    clearImageLayer();
    restoreSettingsInputs();
    applyFrameUi();
    setStatus("Cleared.");
  }

  function restoreSettingsInputs() {
    if (els.apiKey) els.apiKey.value = getApiKey();
    if (els.orderId) els.orderId.value = getOrderId();
  }

  function getApiKey() {
    return localStorage.getItem(STORAGE.key) || "";
  }

  function getOrderId() {
    return localStorage.getItem(STORAGE.order) || DEFAULT_ORDER_ID;
  }

  function getStoredLayer() {
    const stored = localStorage.getItem(STORAGE.layer);
    return LAYERS[stored] ? stored : "rainfall";
  }

  function readCachedFiles(orderId) {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.cachePrefix + orderId) || "[]").filter(Boolean);
    } catch {
      return [];
    }
  }

  function writeCachedFiles(orderId, files) {
    try {
      localStorage.setItem(STORAGE.cachePrefix + orderId, JSON.stringify(files));
    } catch {
      setStatus("Loaded.");
    }
  }

  function findFileIds(payload) {
    const found = [];
    const seen = new Set();

    function visit(value) {
      if (!value) return;
      if (typeof value === "string") {
        if (looksLikeImageFile(value) && !seen.has(value)) {
          seen.add(value);
          found.push(value);
        }
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (typeof value === "object") Object.values(value).forEach(visit);
    }

    visit(payload);
    return found;
  }

  function looksLikeImageFile(value) {
    return /png|precip|rainfall|rain|cloud|pressure|temperature|temp|mslp|meansea/i.test(String(value));
  }

  function extractFrameKey(fileId) {
    const matches = String(fileId).match(/(\d{3,})/g);
    return matches?.[matches.length - 1] || String(fileId);
  }

  function extractValidTime(fileId) {
    const iso = String(fileId).match(/(20\d{2}[01]\d[0-3]\d[T_ -]?[0-2]\d(?:[0-5]\d)?)/);
    if (!iso) return null;
    const compact = iso[1].replace(/[T_ -]/g, "");
    if (compact.length < 10) return null;
    return new Date(`${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}T${compact.slice(8, 10)}:${compact.slice(10, 12) || "00"}:00Z`);
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: UK_TIME_ZONE
    }).format(date);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(message) {
    if (els.status) els.status.textContent = message;
  }

  window.addEventListener("beforeunload", clearImageUrl);
  window.FieldOpsMetOfficeMapImages = { VERSION, reload: () => loadOrder({ forceRefresh: true, previewAfter: true }) };
})();
