/* ==========================================================================
   FieldOps Atlas map-ui.js
   Root file: FieldOpsAtlas/Features/Map/map-ui.js
   Version: 1.1.5-root-width-retire-legacy-map-shell

   Purpose:
   - Keep map-app.js as the owner of map creation, region loading, markers,
     search data, selected-walk state, and GitHub write workflows.
   - Load the shared root shell from the map page.
   - Load the bridge-only map shell guard after the root shell request.
   - Keep essential late UI bridge behaviours alive while the map shell is handed over.
   - Do not inject fallback top/bottom shell UI.
   ========================================================================== */

(function fieldOpsMapUi() {
  "use strict";

  const UI_VERSION = "1.1.5-root-width-retire-legacy-map-shell";
  const SHARED_SHELL_VERSION = "1.1.15-rf-width-root-shell";
  const MAP_SHELL_GUARD_VERSION = "1.1.2-retire-map-legacy-shell";

  const loadedAssets = Object.create(null);

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
    const nextUrl = new URL(url, window.location.href);
    nextUrl.searchParams.set("v", version);
    return nextUrl.href;
  }

  function sameAsset(left, right) {
    return new URL(left, window.location.href).href.split("?")[0] ===
      new URL(right, window.location.href).href.split("?")[0];
  }

  function existingStylesheet(href) {
    return qsa('link[rel="stylesheet"][href]').find(function findStylesheet(link) {
      return sameAsset(link.href, href);
    }) || null;
  }

  function existingScript(src) {
    return qsa("script[src]").find(function findScript(script) {
      return sameAsset(script.src, src);
    }) || null;
  }

  function loadStylesheet(path, version) {
    const href = assetUrl(path);

    if (existingStylesheet(href) || loadedAssets[href]) {
      return Promise.resolve("already-loaded");
    }

    loadedAssets[href] = true;

    return new Promise(function createStylesheet(resolve) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cacheBust(href, version);
      link.dataset.fieldopsMapUiLoader = UI_VERSION;
      link.addEventListener("load", function onLoad() {
        resolve("loaded");
      }, { once: true });
      link.addEventListener("error", function onError() {
        resolve("error");
      }, { once: true });
      document.head.appendChild(link);
    });
  }

  function loadScript(path, version) {
    const src = assetUrl(path);

    if (existingScript(src) || loadedAssets[src]) {
      return Promise.resolve("already-loaded");
    }

    loadedAssets[src] = true;

    return new Promise(function createScript(resolve) {
      const script = document.createElement("script");
      script.src = cacheBust(src, version);
      script.defer = true;
      script.dataset.fieldopsMapUiLoader = UI_VERSION;
      script.addEventListener("load", function onLoad() {
        resolve("loaded");
      }, { once: true });
      script.addEventListener("error", function onError() {
        resolve("error");
      }, { once: true });
      document.body.appendChild(script);
    });
  }

  function removeDiagnosticBadge() {
    const badge = byId("fieldopsMapShellDiagnostics");
    if (badge && badge.parentNode) {
      badge.parentNode.removeChild(badge);
    }

    delete document.documentElement.dataset.mapUiDiagnostic;
    delete document.documentElement.dataset.mapUiDiagnostics;
  }

  function showToast(message) {
    const toast = byId("statusToast");
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("show", "is-visible");

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function hideToast() {
      toast.classList.remove("show", "is-visible");
    }, 1800);
  }

  function getBridge() {
    window.FieldOpsAtlasBridge = window.FieldOpsAtlasBridge || {};
    return window.FieldOpsAtlasBridge;
  }

  function getSelectedWalk() {
    const bridge = getBridge();
    if (bridge && typeof bridge.getSelectedWalk === "function") {
      return bridge.getSelectedWalk();
    }
    return null;
  }

  function getVisibleWalks() {
    const bridge = getBridge();
    if (bridge && typeof bridge.getVisibleWalks === "function") {
      return bridge.getVisibleWalks() || [];
    }
    return [];
  }

  function setPanelVisible(panel, visible) {
    if (!panel) {
      return;
    }

    panel.hidden = false;
    panel.classList.toggle("is-hidden", !visible);
    panel.classList.toggle("is-open", Boolean(visible));
    panel.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function isPanelVisible(panel) {
    return Boolean(panel) &&
      !panel.classList.contains("is-hidden") &&
      panel.getAttribute("aria-hidden") !== "true";
  }

  function closeOtherPanels(exceptId) {
    ["weatherModePanel", "fieldNotesPanel"].forEach(function closePanel(id) {
      if (id !== exceptId) {
        setPanelVisible(byId(id), false);
      }
    });
  }

  function setText(id, value) {
    const element = byId(id);
    if (element) {
      element.textContent = value;
    }
  }

  function setSelectedWeatherPending() {
    setText("selectedSitePressureMemo", "Weather is paused. Use Weather Mode > Refresh forecasts.");
    setText("selectedSiteWindMemo", "No automatic forecast fetch on marker/detail open.");
    setText("selectedSiteLightningMemo", "Open Weather Mode for manual strike links.");
  }

  function openWeatherMode() {
    const selected = getSelectedWalk();
    const weatherButton = byId("weatherModeButton");

    closeOtherPanels("weatherModePanel");
    setPanelVisible(byId("weatherModePanel"), true);

    if (weatherButton) {
      weatherButton.setAttribute("aria-pressed", "true");
    }

    if (selected) {
      setSelectedWeatherPending();
    }

    setText("weatherOverlayStatus", "Weather map overlay paused. Forecast text stays in Weather Mode for now.");
  }

  function closeWeatherMode() {
    const weatherButton = byId("weatherModeButton");

    setPanelVisible(byId("weatherModePanel"), false);

    if (weatherButton) {
      weatherButton.setAttribute("aria-pressed", "false");
    }
  }

  function refreshWeatherMode() {
    const walks = getVisibleWalks();
    const list = byId("visibleWeatherSiteList");
    const message = walks.length
      ? "Weather refresh is parked during shell handoff. Visible walks: " + walks.length + "."
      : "No visible walks are loaded yet.";

    if (list) {
      list.innerHTML = "<p class=\"visible-weather-empty\">" + message + "</p>";
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
    const panel = byId("infoPanel");
    const button = byId("expandInfoButton");

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
    const panel = byId("infoPanel");
    const handle = byId("infoPanelDragTarget");

    if (!panel || !handle || !window.PointerEvent || handle.dataset.fieldopsMapUiDrag === UI_VERSION) {
      return;
    }

    handle.dataset.fieldopsMapUiDrag = UI_VERSION;

    let drag = null;

    function finishDrag(event) {
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      const deltaY = drag.lastY - drag.startY;
      const moved = drag.moved || Math.abs(deltaY) > 10;

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

    on(handle, "pointerdown", function handlePointerDown(event) {
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

    on(handle, "pointermove", function handlePointerMove(event) {
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

  function wireButtons() {
    on(byId("weatherModeButton"), "click", function toggleWeatherMode() {
      if (isPanelVisible(byId("weatherModePanel"))) {
        closeWeatherMode();
      } else {
        openWeatherMode();
      }
    });

    on(byId("closeWeatherModeButton") || byId("closeWeatherModePanelButton"), "click", closeWeatherMode);
    on(byId("refreshVisibleWeatherButton") || byId("weatherSitesRefreshButton"), "click", refreshWeatherMode);
    on(byId("openFieldNotesButton"), "click", openFieldNotesPanel);
    on(byId("closeFieldNotesButton"), "click", closeFieldNotesPanel);

    on(byId("expandInfoButton"), "click", function handleExpandInfo() {
      const panel = byId("infoPanel");
      const isExpanded = Boolean(panel && panel.classList.contains("is-expanded"));
      setInfoPanelExpanded(!isExpanded);
    });

    [
      "weatherOverlayAllButton",
      "weatherOverlayWatchButton",
      "weatherOverlayHighButton",
      "weatherOverlayClearButton",
      "weatherOverlayFitButton",
      "metOfficeWarningsSaveButton",
      "metOfficeWarningsCheckButton",
      "metOfficeWarningsClearButton",
      "dnoPowerSaveButton",
      "dnoPowerOpenButton",
      "dnoPowerClearButton",
      "saveDnoPowerButton",
      "openDnoPowerButton",
      "clearDnoPowerButton",
      "saveFieldNoteButton",
      "clearFieldNoteButton",
      "clearAllFieldNotesButton"
    ].forEach(function bindToast(id) {
      on(byId(id), "click", function handleUtilityClick() {
        showToast("Map UI active");
      });
    });
  }

  function wireShellEvents() {
    if (window.__fieldopsMapUiShellEventsVersion === UI_VERSION) {
      return;
    }

    window.__fieldopsMapUiShellEventsVersion = UI_VERSION;

    window.addEventListener("fieldops:shell-search-open", function closeMapToolsOnSearch() {
      const panel = byId("mapToolsPanel");
      if (panel) {
        panel.hidden = true;
      }
    });

    window.addEventListener("fieldops:shell-filter-region", function closeMapToolsOnFilter() {
      const panel = byId("mapToolsPanel");
      if (panel) {
        panel.hidden = true;
      }
    });
  }

  function updateBridge() {
    const bridge = getBridge();

    bridge.mapUiVersion = UI_VERSION;
    bridge.refreshWeatherMode = refreshWeatherMode;
    bridge.openWeatherMode = openWeatherMode;
    bridge.closeWeatherMode = closeWeatherMode;
    bridge.openFieldNotes = openFieldNotesPanel;
    bridge.closeFieldNotes = closeFieldNotesPanel;
  }

  function loadShellAssets() {
    return loadStylesheet("../../../shell.css", SHARED_SHELL_VERSION)
      .then(function loadSharedShellScript() {
        return loadScript("../../../shell.js", SHARED_SHELL_VERSION);
      })
      .then(function loadMapGuard() {
        return loadScript("./map-shell-guard.js", MAP_SHELL_GUARD_VERSION);
      })
      .then(function notifyShellLoaderReady() {
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

    safe("shared shell loader", function loadShell() {
      loadShellAssets();
    });
    safe("button wiring", wireButtons);
    safe("shell event bridge", wireShellEvents);
    safe("details panel drag", wireDetailsPanelDrag);
  }

  onReady(boot);
})();
