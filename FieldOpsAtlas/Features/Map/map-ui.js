/* ==========================================================================
   FieldOps Atlas map-ui.js
   Root file: FieldOpsAtlas/Features/Map/map-ui.js
   Version: 1.1.5-lazy-weather-v1

   Purpose:
   - Keep map-app.js as the owner of map creation, region loading, markers,
     search data, selected-walk state, and GitHub write workflows.
   - Load the shared root shell from the map page because index.html still only
     calls map-app.js and map-ui.js.
   - Load the bridge-only map shell guard after the root shell request.
   - Keep essential late UI bridge behaviours alive while the map shell is being
     handed over.
   - Do not inject fallback shell UI.
   - Do not preload Weather Mode panel markup.
   - Initialise Weather Mode only when the Weather button is pressed.

   Swift conversion note:
   - This file is deliberately controller-like and small.
   - Shell owns shell chrome.
   - Map owns map state.
   - Weather panel is lazy-created by weather-mode-panel.js.
   - Guard only bridges events.
   ========================================================================== */

(function () {
  "use strict";

  var UI_VERSION = "1.1.5-lazy-weather-v1";
  var SHARED_SHELL_VERSION = "1.1.1-shell-v2.6-map-button-events";
  var MAP_SHELL_GUARD_VERSION = "1.1.1-map-shell-guard-v11";
  var WEATHER_PANEL_VERSION = "1.1.1-lazy-weather-v1";

  var loadedAssets = Object.create(null);
  var weatherPanelReadyPromise = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function on(target, eventName, callback, options) {
    if (!target) {
      return;
    }

    target.addEventListener(eventName, callback, options || false);
  }

  function safe(label, callback) {
    try {
      callback();
    } catch (error) {
      if (window.console && typeof window.console.warn === "function") {
        window.console.warn("FieldOps Atlas map UI skipped: " + label, error);
      }
    }
  }

  function assetUrl(path) {
    return new URL(path, window.location.href).href;
  }

  function cacheBust(url, version) {
    var nextUrl = new URL(url, window.location.href);
    nextUrl.searchParams.set("v", version);
    return nextUrl.href;
  }

  function sameAsset(left, right) {
    return (
      new URL(left, window.location.href).href.split("?")[0] ===
      new URL(right, window.location.href).href.split("?")[0]
    );
  }

  function existingStylesheet(href) {
    return qsa('link[rel="stylesheet"][href]').find(function (link) {
      return sameAsset(link.href, href);
    }) || null;
  }

  function existingScript(src) {
    return qsa("script[src]").find(function (script) {
      return sameAsset(script.src, src);
    }) || null;
  }

  function loadStylesheet(path, version) {
    var href = assetUrl(path);

    if (existingStylesheet(href) || loadedAssets[href]) {
      return Promise.resolve("already-loaded");
    }

    loadedAssets[href] = true;

    return new Promise(function (resolve) {
      var link = document.createElement("link");

      link.rel = "stylesheet";
      link.href = cacheBust(href, version);
      link.dataset.fieldopsMapUiLoader = UI_VERSION;

      link.addEventListener("load", function () {
        resolve("loaded");
      }, { once: true });

      link.addEventListener("error", function () {
        resolve("error");
      }, { once: true });

      document.head.appendChild(link);
    });
  }

  function loadScript(path, version) {
    var src = assetUrl(path);

    if (existingScript(src) || loadedAssets[src]) {
      return Promise.resolve("already-loaded");
    }

    loadedAssets[src] = true;

    return new Promise(function (resolve) {
      var script = document.createElement("script");

      script.src = cacheBust(src, version);
      script.defer = true;
      script.dataset.fieldopsMapUiLoader = UI_VERSION;

      script.addEventListener("load", function () {
        resolve("loaded");
      }, { once: true });

      script.addEventListener("error", function () {
        resolve("error");
      }, { once: true });

      document.body.appendChild(script);
    });
  }

  function removeDiagnosticBadge() {
    var badge = byId("fieldopsMapShellDiagnostics");

    if (badge && badge.parentNode) {
      badge.parentNode.removeChild(badge);
    }

    delete document.documentElement.dataset.mapUiDiagnostic;
    delete document.documentElement.dataset.mapUiDiagnostics;
  }

  function showToast(message) {
    var toast = byId("statusToast");

    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("show", "is-visible");

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function () {
      toast.classList.remove("show", "is-visible");
    }, 1800);
  }

  function getBridge() {
    window.FieldOpsAtlasBridge = window.FieldOpsAtlasBridge || {};
    return window.FieldOpsAtlasBridge;
  }

  function getSelectedWalk() {
    var bridge = getBridge();

    if (bridge && typeof bridge.getSelectedWalk === "function") {
      return bridge.getSelectedWalk();
    }

    return null;
  }

  function getVisibleWalks() {
    var bridge = getBridge();

    if (bridge && typeof bridge.getVisibleWalks === "function") {
      return bridge.getVisibleWalks() || [];
    }

    return [];
  }

  function setPanelVisible(panel, visible) {
    if (!panel) {
      return;
    }

    panel.classList.toggle("is-hidden", !visible);
    panel.classList.toggle("is-open", !!visible);
    panel.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function isPanelVisible(panel) {
    return !!panel &&
      !panel.classList.contains("is-hidden") &&
      panel.getAttribute("aria-hidden") !== "true";
  }

  function closeOtherPanels(exceptId) {
    [
      "weatherModePanel",
      "fieldNotesPanel"
    ].forEach(function (id) {
      if (id === exceptId) {
        return;
      }

      setPanelVisible(byId(id), false);
    });
  }

  function setText(id, value) {
    var element = byId(id);

    if (element) {
      element.textContent = value;
    }
  }

  function setSelectedWeatherPending() {
    setText("selectedSitePressureMemo", "Weather is paused. Use Weather Mode > Refresh forecasts.");
    setText("selectedSiteWindMemo", "No automatic forecast fetch on marker/detail open.");
    setText("selectedSiteLightningMemo", "Open Weather Mode for manual strike links.");
  }

  function wireWeatherModePanel(panel) {
    if (!panel || panel.dataset.fieldopsWeatherPanelWired === UI_VERSION) {
      return;
    }

    panel.dataset.fieldopsWeatherPanelWired = UI_VERSION;

    on(byId("closeWeatherModePanelButton") || byId("closeWeatherModeButton"), "click", closeWeatherMode);
    on(byId("weatherSitesRefreshButton") || byId("refreshVisibleWeatherButton"), "click", refreshWeatherMode);

    [
      "weatherOverlayAllButton",
      "weatherOverlayWatchButton",
      "weatherOverlayHighButton",
      "weatherOverlayClearButton",
      "weatherOverlayFitButton",
      "saveMetOfficeWarningsButton",
      "checkMetOfficeWarningsButton",
      "clearMetOfficeWarningsButton",
      "saveDnoPowerButton",
      "openDnoPowerButton",
      "clearDnoPowerButton"
    ].forEach(function (id) {
      on(byId(id), "click", function () {
        showToast("Map UI active");
      });
    });
  }

  function ensureWeatherModePanel() {
    var existingPanel = byId("weatherModePanel");

    if (existingPanel) {
      wireWeatherModePanel(existingPanel);
      return Promise.resolve(existingPanel);
    }

    if (weatherPanelReadyPromise) {
      return weatherPanelReadyPromise;
    }

    weatherPanelReadyPromise = loadScript("./weather-mode-panel.js", WEATHER_PANEL_VERSION)
      .then(function () {
        var weatherMode = window.FieldOpsAtlasWeatherMode;

        if (!weatherMode || typeof weatherMode.ensurePanel !== "function") {
          throw new Error("weather-mode-panel.js loaded but did not expose FieldOpsAtlasWeatherMode.ensurePanel");
        }

        return weatherMode.ensurePanel();
      })
      .then(function (panel) {
        wireWeatherModePanel(panel);
        return panel;
      })
      .catch(function (error) {
        weatherPanelReadyPromise = null;

        if (window.console && typeof window.console.warn === "function") {
          window.console.warn("FieldOps Atlas Weather Mode failed to initialise", error);
        }

        showToast("Weather Mode failed to load");
        return null;
      });

    return weatherPanelReadyPromise;
  }

  function openWeatherMode() {
    var weatherButton = byId("weatherModeButton");

    if (weatherButton) {
      weatherButton.setAttribute("aria-busy", "true");
    }

    ensureWeatherModePanel().then(function (panel) {
      if (!panel) {
        if (weatherButton) {
          weatherButton.setAttribute("aria-busy", "false");
        }

        return;
      }

      closeOtherPanels("weatherModePanel");
      setPanelVisible(panel, true);

      if (weatherButton) {
        weatherButton.setAttribute("aria-pressed", "true");
        weatherButton.setAttribute("aria-busy", "false");
      }

      if (getSelectedWalk()) {
        setSelectedWeatherPending();
      }

      refreshWeatherMode();
    });
  }

  function closeWeatherMode() {
    var weatherButton = byId("weatherModeButton");

    setPanelVisible(byId("weatherModePanel"), false);

    if (weatherButton) {
      weatherButton.setAttribute("aria-pressed", "false");
      weatherButton.setAttribute("aria-busy", "false");
    }
  }

  function refreshWeatherMode() {
    var walks = getVisibleWalks();
    var list = byId("visibleWeatherSiteList");
    var message = walks.length
      ? "Weather refresh is parked during shell handoff. Visible walks: " + walks.length + "."
      : "No visible walks are loaded yet.";

    if (list) {
      list.innerHTML = "";
      var item = document.createElement("p");
      item.className = "visible-weather-empty";
      item.textContent = message;
      list.appendChild(item);
    }

    setText("weatherOverlayStatus", message);
  }

  function openFieldNotesPanel() {
    closeOtherPanels("fieldNotesPanel");
    setPanelVisible(byId("fieldNotesPanel"), true);
  }

  function closeFieldNotesPanel() {
    setPanelVisible(byId("fieldNotesPanel"), false);
  }

  function setInfoPanelExpanded(expanded) {
    var panel = byId("infoPanel");
    var button = byId("expandInfoButton");

    if (!panel) {
      return;
    }

    panel.style.transform = "";
    panel.classList.remove("is-hidden", "is-dragging", "dragging", "is-collapsed");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");

    if (expanded) {
      panel.classList.remove("collapsed");
      panel.classList.add("is-expanded");
    } else {
      panel.classList.remove("is-expanded");
      panel.classList.add("collapsed");
    }

    if (button) {
      button.textContent = expanded ? "Minimise" : "Expand";
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
    }
  }

  function wireDetailsPanelDrag() {
    var panel = byId("infoPanel");
    var handle = byId("infoPanelDragTarget");

    if (!panel || !handle || !window.PointerEvent || handle.dataset.fieldopsMapUiDrag === UI_VERSION) {
      return;
    }

    handle.dataset.fieldopsMapUiDrag = UI_VERSION;

    var drag = null;

    function finishDrag(event) {
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      var deltaY = drag.lastY - drag.startY;
      var moved = drag.moved || Math.abs(deltaY) > 10;

      try {
        handle.releasePointerCapture(drag.pointerId);
      } catch (error) {
        /* Pointer capture can already be released by the browser. */
      }

      drag = null;
      panel.classList.remove("is-dragging", "dragging");

      if (!moved) {
        return;
      }

      if (deltaY <= -28) {
        setInfoPanelExpanded(true);
      } else if (deltaY >= 28) {
        setInfoPanelExpanded(false);
      }
    }

    on(handle, "pointerdown", function (event) {
      if (!isPanelVisible(panel)) {
        return;
      }

      drag = {
        pointerId: event.pointerId,
        startY: event.clientY,
        lastY: event.clientY,
        moved: false
      };

      panel.classList.add("is-dragging");
      handle.setPointerCapture(event.pointerId);
    });

    on(handle, "pointermove", function (event) {
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      drag.lastY = event.clientY;

      if (Math.abs(drag.lastY - drag.startY) > 10) {
        drag.moved = true;
      }
    });

    on(handle, "pointerup", finishDrag);
    on(handle, "pointercancel", finishDrag);
  }

  function setMapToolsOpen(open) {
    var menu = byId("railToolsMenu");
    var trigger = byId("railMapButton") || qs(".map-tools-trigger");

    if (!menu || !trigger) {
      return;
    }

    menu.hidden = !open;
    menu.classList.toggle("is-open", !!open);
    trigger.classList.toggle("is-active", !!open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");

    if (document.querySelector(".fieldops-shell-root")) {
      document.querySelector(".fieldops-shell-root").dataset.mapToolsOpen = open ? "true" : "false";
    }
  }

  function toggleMapTools() {
    var menu = byId("railToolsMenu");
    setMapToolsOpen(Boolean(menu && (menu.hidden || !menu.classList.contains("is-open"))));
  }

  function wireMapTools() {
    var button = byId("railMapButton") || qs(".map-tools-trigger");
    var menu = byId("railToolsMenu");

    if (!button || !menu || button.dataset.fieldopsMapToolsBridge === UI_VERSION) {
      return;
    }

    button.dataset.fieldopsMapToolsBridge = UI_VERSION;

    on(button, "click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }

      toggleMapTools();
    }, true);

    on(document, "click", function (event) {
      var target = event.target;

      if (!target || typeof target.closest !== "function") {
        return;
      }

      if (
        target.closest("#railToolsMenu") ||
        target.closest("#railMapButton") ||
        target.closest(".map-tools-trigger")
      ) {
        return;
      }

      setMapToolsOpen(false);
    }, true);
  }

  function wireShellEvents() {
    if (window.__fieldopsMapUiShellEventsVersion === UI_VERSION) {
      return;
    }

    window.__fieldopsMapUiShellEventsVersion = UI_VERSION;

    window.addEventListener("fieldops:shell-map-tools-toggle", function () {
      toggleMapTools();
    });

    window.addEventListener("fieldops:shell-search-open", function () {
      setMapToolsOpen(false);
    });

    window.addEventListener("fieldops:shell-filter-region", function () {
      setMapToolsOpen(false);
    });
  }

  function wireButtons() {
    on(byId("weatherModeButton"), "click", function () {
      var panel = byId("weatherModePanel");

      if (isPanelVisible(panel)) {
        closeWeatherMode();
      } else {
        openWeatherMode();
      }
    });

    on(byId("openFieldNotesButton"), "click", openFieldNotesPanel);
    on(byId("closeFieldNotesButton"), "click", closeFieldNotesPanel);

    on(byId("expandInfoButton"), "click", function () {
      var panel = byId("infoPanel");
      var isExpanded = !!panel && panel.classList.contains("is-expanded");

      setInfoPanelExpanded(!isExpanded);
    });

    [
      "saveFieldNoteButton",
      "clearFieldNoteButton",
      "clearAllFieldNotesButton"
    ].forEach(function (id) {
      on(byId(id), "click", function () {
        showToast("Map UI active");
      });
    });
  }

  function updateBridge() {
    var bridge = getBridge();

    bridge.mapUiVersion = UI_VERSION;
    bridge.refreshWeatherMode = refreshWeatherMode;
    bridge.openWeatherMode = openWeatherMode;
    bridge.closeWeatherMode = closeWeatherMode;
    bridge.openFieldNotes = openFieldNotesPanel;
    bridge.closeFieldNotes = closeFieldNotesPanel;
    bridge.toggleMapTools = toggleMapTools;
  }

  function loadShellAssets() {
    return loadStylesheet("../../../shell.css", SHARED_SHELL_VERSION)
      .then(function () {
        return loadScript("../../../shell.js", SHARED_SHELL_VERSION);
      })
      .then(function () {
        return loadScript("./map-shell-guard.js", MAP_SHELL_GUARD_VERSION);
      })
      .then(function () {
        window.dispatchEvent(new CustomEvent("fieldops:map-ui-shell-loader-ready", {
          detail: {
            version: UI_VERSION,
            shellVersion: SHARED_SHELL_VERSION,
            guardVersion: MAP_SHELL_GUARD_VERSION
          }
        }));
      });
  }

  function markBody() {
    document.documentElement.dataset.mapUiVersion = UI_VERSION;
    document.documentElement.dataset.mapUiShellLoader = "true";
    document.documentElement.dataset.mapUiShellVersion = SHARED_SHELL_VERSION;
    document.documentElement.dataset.mapUiGuardVersion = MAP_SHELL_GUARD_VERSION;
    document.documentElement.dataset.mapUiDiagnostics = "false";
  }

  function boot() {
    markBody();
    removeDiagnosticBadge();
    updateBridge();

    safe("shared shell loader", function () {
      loadShellAssets();
    });

    safe("button wiring", wireButtons);
    safe("map tools wiring", wireMapTools);
    safe("shell event bridge", wireShellEvents);
    safe("details panel drag", wireDetailsPanelDrag);
  }

  onReady(boot);
}());
