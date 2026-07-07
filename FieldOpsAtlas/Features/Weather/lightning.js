/* ==========================================================================
   FieldOps Atlas Lightning
   File: FieldOpsAtlas/Features/Weather/lightning.js
   Version: 0.3.0-source-switches

   One source is loaded at a time:
   - EUMETSAT MTG Lightning Imager WMS
   - Official Blitzortung embedded vector map
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "0.3.0-source-switches";
  const STORAGE_KEY = "fieldops-lightning-active-source-v1";
  const EUMET_REFRESH_MS = 5 * 60 * 1000;
  const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const EUMETVIEW_WMS_URL = "https://view.eumetsat.int/geoserver/wms";

  /*
   * These are deliberately the same wide views shown in the supplied screenshots.
   * Do not tighten them to UK-only bounds.
   */
  const EUMETSAT_BOUNDS = [[17.0, -18.0], [68.5, 34.0]];
  const BLITZORTUNG_URL =
    "https://map.blitzortung.org/index.php" +
    "?interactive=0" +
    "&NavigationControl=0" +
    "&FullScreenControl=0" +
    "&Cookies=0" +
    "&InfoDiv=0" +
    "&MenuButtonDiv=0" +
    "&ScaleControl=0" +
    "&LightningCheckboxChecked=1" +
    "&LightningRangeValue=23" +
    "&CourseCheckboxChecked=0" +
    "&CountingCheckboxChecked=0" +
    "&CirclesCheckboxChecked=1" +
    "&CirclesRangeValue=6" +
    "&LinksCheckboxChecked=0" +
    "&DetectorsCheckboxChecked=0" +
    "&CoverageCheckboxChecked=0" +
    "&DayNightCheckboxChecked=0" +
    "&AudioCheckboxChecked=0" +
    "&MapStyle=0" +
    "&MapStyleRangeValue=0" +
    "&Advertisment=0" +
    "#4/54.8/-3.5";

  const state = {
    map: null,
    baseLayer: null,
    eumetsatLayer: null,
    activeSource: "eumetsat",
    refreshTimer: null,
    layerRequestId: 0
  };

  const elements = {};

  function init() {
    captureElements();

    if (!window.L || !elements.eumetsatMap) {
      setStatus("Leaflet or the map container is unavailable.", "error");
      return;
    }

    initMap();
    bindControls();

    const requestedSource = new URLSearchParams(window.location.search).get("source");
    const storedSource = readStoredSource();
    const initialSource = normaliseSource(requestedSource || storedSource || "eumetsat");

    activateSource(initialSource);
  }

  function captureElements() {
    elements.eumetsatMap = document.getElementById("eumetsatMap");
    elements.blitzortungFrame = document.getElementById("blitzortungFrame");
    elements.inactiveState = document.getElementById("inactiveMapState");
    elements.eumetsatToggle = document.getElementById("eumetsatToggle");
    elements.blitzortungToggle = document.getElementById("blitzortungToggle");
    elements.activeMapTitle = document.getElementById("activeMapTitle");
    elements.activeMapCaption = document.getElementById("activeMapCaption");
    elements.sourceBadge = document.getElementById("sourceBadge");
    elements.status = document.getElementById("statusText");
    elements.refresh = document.getElementById("refreshActiveMap");
    elements.deactivate = document.getElementById("deactivateAll");
    elements.opacityControl = document.getElementById("opacityControl");
    elements.opacity = document.getElementById("overlayOpacity");
  }

  function initMap() {
    state.map = window.L.map(elements.eumetsatMap, {
      center: [48.5, 5.0],
      zoom: 4,
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

    const overlayPane = state.map.createPane("lightningOfficialPane");
    overlayPane.style.zIndex = "430";
    overlayPane.style.pointerEvents = "none";
    overlayPane.classList.add("weather-overlay-pane");

    window.L.control.zoom({ position: "topright" }).addTo(state.map);

    state.baseLayer = window.L.tileLayer(OSM_TILE_URL, {
      pane: "lightningBasePane",
      minZoom: 3,
      maxZoom: 12,
      noWrap: true,
      keepBuffer: 1,
      updateWhenIdle: true,
      updateWhenZooming: false,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(state.map);

    setWideEumetsatView();
    window.setTimeout(() => state.map.invalidateSize(), 160);
  }

  function bindControls() {
    elements.eumetsatToggle?.addEventListener("click", () => {
      if (state.activeSource === "eumetsat") {
        deactivateAll();
      } else {
        activateSource("eumetsat");
      }
    });

    elements.blitzortungToggle?.addEventListener("click", () => {
      if (state.activeSource === "blitzortung") {
        deactivateAll();
      } else {
        activateSource("blitzortung");
      }
    });

    elements.refresh?.addEventListener("click", refreshActiveSource);
    elements.deactivate?.addEventListener("click", deactivateAll);

    elements.opacity?.addEventListener("input", () => {
      state.eumetsatLayer?.setOpacity(Number(elements.opacity.value));
    });

    document.querySelectorAll(".lightning-top-panel, .lightning-dock").forEach((panel) => {
      panel.addEventListener("toggle", () => {
        window.setTimeout(() => {
          state.map?.invalidateSize({ pan: false });
        }, 120);
      });
    });
  }

  function activateSource(source) {
    const nextSource = normaliseSource(source);

    if (nextSource === "eumetsat") {
      activateEumetsat();
    } else if (nextSource === "blitzortung") {
      activateBlitzortung();
    } else {
      deactivateAll();
      return;
    }

    state.activeSource = nextSource;
    writeStoredSource(nextSource);
    updateSourceButtons();
  }

  function activateEumetsat() {
    clearRefreshTimer();
    unloadBlitzortung();

    elements.eumetsatMap.classList.add("is-active");
    elements.blitzortungFrame.classList.remove("is-active");
    elements.inactiveState.hidden = true;
    elements.opacityControl.hidden = false;

    elements.activeMapTitle.textContent = "EUMETSAT Lightning";
    elements.activeMapCaption.textContent =
      "Official five-minute accumulated satellite layer";

    state.map.invalidateSize({ pan: false });
    setWideEumetsatView();
    refreshEumetsatLayer();

    state.refreshTimer = window.setInterval(
      refreshEumetsatLayer,
      EUMET_REFRESH_MS
    );
  }

  function activateBlitzortung() {
    clearRefreshTimer();
    removeEumetsatLayer();

    elements.eumetsatMap.classList.remove("is-active");
    elements.blitzortungFrame.classList.add("is-active");
    elements.inactiveState.hidden = true;
    elements.opacityControl.hidden = true;

    elements.activeMapTitle.textContent = "Blitzortung live";
    elements.activeMapCaption.textContent =
      "Official embedded vector map with native strike circles";

    setStatus(
      "Blitzortung is active. The embedded map updates its own live strike layer.",
      "live"
    );

    loadBlitzortung();
  }

  function deactivateAll() {
    clearRefreshTimer();
    removeEumetsatLayer();
    unloadBlitzortung();

    state.activeSource = "off";
    writeStoredSource("off");

    elements.eumetsatMap.classList.remove("is-active");
    elements.blitzortungFrame.classList.remove("is-active");
    elements.inactiveState.hidden = false;
    elements.opacityControl.hidden = true;

    elements.activeMapTitle.textContent = "Lightning maps";
    elements.activeMapCaption.textContent = "Both sources deactivated";

    setStatus("No lightning map is currently loaded.", "off");
    updateSourceButtons();
  }

  function refreshActiveSource() {
    if (state.activeSource === "eumetsat") {
      refreshEumetsatLayer();
      return;
    }

    if (state.activeSource === "blitzortung") {
      unloadBlitzortung();
      window.setTimeout(loadBlitzortung, 60);
      setStatus("Reloading the official Blitzortung map.", "loading");
      return;
    }

    setStatus("Activate a lightning map first.", "off");
  }

  function setWideEumetsatView() {
    state.map.fitBounds(EUMETSAT_BOUNDS, {
      padding: [0, 0],
      animate: false
    });
  }

  function refreshEumetsatLayer() {
    const requestId = ++state.layerRequestId;

    removeEumetsatLayer();
    setStatus("Loading the latest EUMETSAT Lightning Imager layer.", "loading");

    const layer = window.L.tileLayer.wms(EUMETVIEW_WMS_URL, {
      pane: "lightningOfficialPane",
      layers: "mtg_fd:li_afa",
      styles: "",
      format: "image/png",
      transparent: true,
      version: "1.3.0",
      opacity: Number(elements.opacity?.value || 0.88),
      attribution:
        '&copy; <a href="https://view.eumetsat.int/" target="_blank" rel="noopener">EUMETSAT</a>',
      uppercase: false,
      cacheBust: Date.now()
    });

    state.eumetsatLayer = layer;

    let finished = false;
    let tileErrors = 0;

    function markLoaded() {
      if (
        finished ||
        requestId !== state.layerRequestId ||
        state.eumetsatLayer !== layer
      ) {
        return;
      }

      finished = true;
      setStatus(
        "EUMETSAT is active. The latest five-minute accumulated layer is loaded.",
        "live"
      );
    }

    function markError() {
      if (
        finished ||
        requestId !== state.layerRequestId ||
        state.eumetsatLayer !== layer
      ) {
        return;
      }

      finished = true;
      setStatus("The EUMETSAT layer could not be loaded.", "error");
    }

    layer.once("tileload", markLoaded);
    layer.once("load", markLoaded);

    layer.on("tileerror", () => {
      tileErrors += 1;
      if (tileErrors >= 3) {
        markError();
      }
    });

    layer.addTo(state.map);

    window.setTimeout(() => {
      if (!finished) {
        markError();
      }
    }, 20000);
  }

  function removeEumetsatLayer() {
    state.layerRequestId += 1;

    if (state.eumetsatLayer && state.map.hasLayer(state.eumetsatLayer)) {
      state.map.removeLayer(state.eumetsatLayer);
    }

    state.eumetsatLayer = null;
  }

  function loadBlitzortung() {
    if (elements.blitzortungFrame.src !== BLITZORTUNG_URL) {
      elements.blitzortungFrame.src = BLITZORTUNG_URL;
    }
  }

  function unloadBlitzortung() {
    elements.blitzortungFrame.src = "about:blank";
  }

  function updateSourceButtons() {
    updateToggle(elements.eumetsatToggle, state.activeSource === "eumetsat");
    updateToggle(elements.blitzortungToggle, state.activeSource === "blitzortung");
  }

  function updateToggle(button, active) {
    if (!button) {
      return;
    }

    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));

    const stateLabel = button.querySelector(".lightning-source-state");
    if (stateLabel) {
      stateLabel.textContent = active ? "ACTIVE" : "ACTIVATE";
    }
  }

  function setStatus(message, mode) {
    elements.status.textContent = message;
    elements.sourceBadge.className = "weather-pill lightning-live-pill";

    if (mode === "live") {
      elements.sourceBadge.textContent = "LIVE";
      elements.sourceBadge.classList.add("is-live");
      return;
    }

    if (mode === "error") {
      elements.sourceBadge.textContent = "ERROR";
      elements.sourceBadge.classList.add("is-error");
      return;
    }

    if (mode === "off") {
      elements.sourceBadge.textContent = "OFF";
      elements.sourceBadge.classList.add("is-off");
      return;
    }

    elements.sourceBadge.textContent = "LOADING";
  }

  function normaliseSource(source) {
    if (source === "blitzortung" || source === "eumetsat" || source === "off") {
      return source;
    }

    return "eumetsat";
  }

  function readStoredSource() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeStoredSource(source) {
    try {
      window.localStorage.setItem(STORAGE_KEY, source);
    } catch (error) {
      // The page still works when storage is unavailable.
    }
  }

  function clearRefreshTimer() {
    if (state.refreshTimer) {
      window.clearInterval(state.refreshTimer);
      state.refreshTimer = null;
    }
  }

  window.FieldOpsLightning = {
    version: VERSION,
    activate: activateSource,
    deactivate: deactivateAll,
    refresh: refreshActiveSource
  };

  document.addEventListener("DOMContentLoaded", init, { once: true });
})();
