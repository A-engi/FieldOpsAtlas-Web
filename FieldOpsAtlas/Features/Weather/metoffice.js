/* Met Office DataHub Map Images v0.4.1
   Destination: FieldOpsAtlas/Features/Weather/metoffice.js

   - Debug/count/control pane deleted.
   - Provider-owned maps removed.
   - Clean/repaint image path deleted.
   - Rainfall PNG is shown as returned by Met Office. Colours are not inserted
     a second time by this screen.
   - Weather display colours remain centralised in weather-display-style.js
     for future legends/overlays, not for repainting the already-coloured PNG.
*/

(() => {
  "use strict";

  const VERSION = "0.4.1";
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
    rainfall: { label: "Rainfall", patterns: [/precip/i, /rainfall/i, /rain/i], empty: "No rainfall/precipitation files matched this order." },
    cloud: { label: "Cloud", patterns: [/cloud/i], empty: "No cloud files matched this order." },
    pressure: { label: "Pressure", patterns: [/pressure/i, /mean[_-]?sea/i, /meansea/i, /mslp/i, /msl/i], empty: "No pressure/MSLP files matched this order." },
    temperature: { label: "Temp", patterns: [/temperature/i, /temp/i], empty: "No temperature files matched this order." }
  };

  const els = {
    image: byId("moImage"),
    placeholder: byId("moPlaceholder"),
    status: byId("moStatus"),
    apiKey: byId("moApiKey"),
    orderId: byId("moOrderId"),
    saveSettings: byId("moSaveSettings"),
    forgetSettings: byId("moForgetSettings"),
    refreshOrder: byId("moRefreshOrder"),
    layerButtons: Array.from(document.querySelectorAll(".mo-layer-button[data-layer]")),
    frameCount: byId("moFrameCount"),
    prevFrame: byId("moPrevFrame"),
    nextFrame: byId("moNextFrame"),
    frameSlider: byId("moFrameSlider"),
    validUkLabel: byId("moValidUkLabel")
  };

  const state = {
    fileIds: [],
    layerFiles: [],
    frames: [],
    layer: getStoredLayer(),
    frameKey: localStorage.getItem(STORAGE.frame) || "000",
    selectedFileId: "",
    loading: false,
    rawUrl: ""
  };

  init();

  function init() {
    restoreSettingsInputs();
    bindEvents();
    applyLayerButtons();
    applyFrameUi();
    bootstrap();
  }

  function bindEvents() {
    els.saveSettings?.addEventListener("click", () => {
      saveSettings();
      loadOrder({ forceRefresh: false, previewAfter: true });
    });

    els.forgetSettings?.addEventListener("click", forgetSettings);
    els.refreshOrder?.addEventListener("click", () => loadOrder({ forceRefresh: true, previewAfter: true }));

    els.layerButtons.forEach((button) => {
      button.addEventListener("click", () => setLayer(button.dataset.layer));
    });

    els.prevFrame?.addEventListener("click", () => bumpFrame(-1));
    els.nextFrame?.addEventListener("click", () => bumpFrame(1));

    els.frameSlider?.addEventListener("input", () => {
      const index = Number(els.frameSlider.value || 0);
      const frame = state.frames[index];
      if (!frame) return;
      state.frameKey = frame.key;
      localStorage.setItem(STORAGE.frame, state.frameKey);
      chooseSelectedFrame();
      applyFrameUi();
    });

    els.frameSlider?.addEventListener("change", () => loadSelectedImage());
  }

  async function bootstrap() {
    const apiKey = getApiKey();
    const orderId = getOrderId();
    if (!apiKey || !orderId) {
      setStatus("Setup needed: paste the Map Images key and API Order ID. They stay in this browser only.");
      return;
    }

    const cached = readCachedFiles(orderId);
    if (cached.length) {
      state.fileIds = cached;
      rebuildLayerFiles();
      setStatus(`Using cached order list: ${cached.length} file(s).`);
      await loadSelectedImage();
      return;
    }

    await loadOrder({ forceRefresh: false, previewAfter: true });
  }

  async function loadOrder({ forceRefresh, previewAfter }) {
    const apiKey = getApiKey();
    const orderId = getOrderId();
    if (!apiKey || !orderId) {
      setStatus("Setup needed: paste a Map Images key and API Order ID first.");
      return;
    }

    saveSettings();
    disableControls(true);

    try {
      const cached = forceRefresh ? [] : readCachedFiles(orderId);
      if (cached.length) {
        state.fileIds = cached;
        rebuildLayerFiles();
        setStatus(`Using cached order list: ${cached.length} file(s).`);
        if (previewAfter) await loadSelectedImage();
        return;
      }

      setStatus("Fetching latest Met Office order file list...");
      const url = `${METOFFICE_MAP_IMAGES_BASE}/orders/${encodeURIComponent(orderId)}/latest?detail=MINIMAL`;
      const response = await fetch(url, { headers: { Accept: "application/json", apikey: apiKey } });
      if (!response.ok) throw new Error(`Met Office latest-order request returned HTTP ${response.status}.`);

      const json = await response.json();
      const files = findFileIds(json);
      if (!files.length) throw new Error(`Order request worked, but no PNG/file IDs were found. JSON keys: ${Object.keys(json || {}).join(", ")}`);

      state.fileIds = files;
      writeCachedFiles(orderId, files);
      rebuildLayerFiles();
      setStatus(`${files.length} file(s) listed and cached. Only the selected PNG frame is fetched.`);
      if (previewAfter) await loadSelectedImage();
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      disableControls(false);
    }
  }

  async function loadSelectedImage() {
    const apiKey = getApiKey();
    const orderId = getOrderId();

    if (!apiKey || !orderId) {
      setStatus("Setup needed: paste a Map Images key and API Order ID first.");
      return;
    }

    if (!state.frames.length || !state.selectedFileId) {
      setStatus(LAYERS[state.layer].empty);
      clearImage();
      return;
    }

    state.loading = true;
    disableControls(true);
    clearImageUrl();

    try {
      setStatus(`Loading ${LAYERS[state.layer].label}: ${state.selectedFileId}`);
      const includeLand = state.layer === "rainfall" ? "false" : "true";
      const url = `${METOFFICE_MAP_IMAGES_BASE}/orders/${encodeURIComponent(orderId)}/latest/${encodeURIComponent(state.selectedFileId)}/data?includeLand=${includeLand}`;
      const response = await fetch(url, { headers: { Accept: "image/png", apikey: apiKey } });
      if (!response.ok) throw new Error(`Met Office image request returned HTTP ${response.status}.`);

      const blob = await response.blob();
      state.rawUrl = URL.createObjectURL(blob);

      applyImageSource();
      els.image.alt = `Met Office ${LAYERS[state.layer].label} image: ${state.selectedFileId}`;
      els.image.hidden = false;
      els.placeholder.hidden = true;
      setStatus(state.layer === "rainfall" ? "Rainfall image loaded from Met Office. No local colour repaint applied." : "Image loaded from Met Office.");
    } catch (error) {
      setStatus(getErrorMessage(error));
      clearImage();
    } finally {
      state.loading = false;
      disableControls(false);
    }
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
    const matched = state.fileIds
      .filter((fileId) => layerConfig.patterns.some((pattern) => pattern.test(fileId)))
      .map((fileId) => ({ fileId, key: extractFrameKey(fileId), valid: extractValidTime(fileId) }))
      .sort((a, b) => a.fileId.localeCompare(b.fileId));

    state.layerFiles = matched;
    state.frames = matched.map((item, index) => ({ ...item, index }));
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
    els.layerButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.layer === state.layer));
  }

  function applyFrameUi() {
    const index = Math.max(0, state.frames.findIndex((frame) => frame.fileId === state.selectedFileId));

    if (els.frameSlider) {
      els.frameSlider.max = String(Math.max(0, state.frames.length - 1));
      els.frameSlider.value = String(index);
      els.frameSlider.disabled = state.frames.length <= 1;
    }

    if (els.frameCount) {
      els.frameCount.textContent = state.frames.length ? `${index + 1}/${state.frames.length}` : "0/0";
    }

    const current = state.frames[index];
    if (els.validUkLabel) {
      els.validUkLabel.textContent = current?.valid ? `UK valid ${formatDate(current.valid)}` : "UK time unavailable";
    }
  }

  function applyImageSource() {
    if (!els.image || !state.rawUrl) return;
    els.image.src = state.rawUrl;
  }

  function disableControls(disabled) {
    [
      els.saveSettings,
      els.forgetSettings,
      els.refreshOrder,
      els.prevFrame,
      els.nextFrame,
      els.frameSlider,
      ...els.layerButtons
    ].forEach((element) => {
      if (element) element.disabled = Boolean(disabled || state.loading);
    });
  }

  function clearImage() {
    clearImageUrl();
    if (els.image) {
      els.image.removeAttribute("src");
      els.image.hidden = true;
    }
    if (els.placeholder) els.placeholder.hidden = false;
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
    state.layerFiles = [];
    state.frames = [];
    state.selectedFileId = "";
    clearImage();
    restoreSettingsInputs();
    applyFrameUi();
    setStatus("Met Office local settings and cached file list cleared.");
  }

  function restoreSettingsInputs() {
    if (els.apiKey) els.apiKey.value = getApiKey();
    if (els.orderId) els.orderId.value = getOrderId();
  }

  function getApiKey() {
    return localStorage.getItem(STORAGE.key) || "";
  }

  function getOrderId() {
    return localStorage.getItem(STORAGE.order) || "";
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
      setStatus("File list loaded, but this browser could not cache it.");
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

      if (typeof value === "object") {
        ["fileId", "file_id", "id", "name", "filename", "fileName", "path", "key"].forEach((key) => {
          if (typeof value[key] === "string") visit(value[key]);
        });
        Object.values(value).forEach(visit);
      }
    }

    visit(payload);
    return found;
  }

  function looksLikeImageFile(value) {
    const text = String(value);
    return /png/i.test(text) || /precip|rainfall|rain|cloud|pressure|temperature|temp|mslp|meansea/i.test(text);
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

    const year = compact.slice(0, 4);
    const month = compact.slice(4, 6);
    const day = compact.slice(6, 8);
    const hour = compact.slice(8, 10);
    const minute = compact.slice(10, 12) || "00";
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
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

  function getErrorMessage(error) {
    return error?.message || String(error || "Unknown Met Office error.");
  }

  window.addEventListener("beforeunload", clearImageUrl);
})();

/* End of file: FieldOpsAtlas/Features/Weather/metoffice.js */
