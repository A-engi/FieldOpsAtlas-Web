/* ==========================================================================
   FieldOps Atlas map-ui.js v1.1.3-shell-diagnostics
   Root file: FieldOpsAtlas/Features/Map/map-ui.js

   Purpose:
   - Keep map-app.js as the owner of map creation, region loading, markers,
     search data, selected-walk state, and GitHub write workflows.
   - Load the shared root shell from the map page because index.html still only
     calls map-app.js and map-ui.js.
   - Show a persistent diagnostic badge because map-app.js can overwrite the
     shared status toast during async map/region boot.
   - Load the map shell guard after the root shell request.
   - Keep essential late UI bridge behaviours alive while the map shell is being
     handed over.

   Swift conversion note:
   - This is deliberately controller-like and small.
   - The old large late-helper file can move to archive once the shell handoff is
     confirmed and the remaining panels are split into separate feature files.
   ========================================================================== */

(function () {
  "use strict";

  var UI_VERSION = "1.1.3-shell-diagnostics";
  var SHARED_SHELL_VERSION = "1.1.1-shell-v2.5-map-mount-fixes";
  var MAP_SHELL_GUARD_VERSION = "1.1.1-map-shell-guard-v10";

  var loadedAssets = Object.create(null);

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
    if (!target) return;
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
    return new URL(left, window.location.href).href.split("?")[0] ===
      new URL(right, window.location.href).href.split("?")[0];
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
        resolve("error: " + path);
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
        resolve("error: " + path);
      }, { once: true });

      document.body.appendChild(script);
    });
  }

  function showToast(message) {
    var toast = byId("statusToast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show", "is-visible");

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function () {
      toast.classList.remove("show", "is-visible");
    }, 1800);
  }

  function diagnosticsBadge() {
    var existing = byId("fieldopsMapShellDiagnostics");

    if (existing) {
      return existing;
    }

    var badge = document.createElement("div");

    badge.id = "fieldopsMapShellDiagnostics";
    badge.setAttribute("role", "status");
    badge.style.position = "fixed";
    badge.style.left = "12px";
    badge.style.right = "12px";
    badge.style.bottom = "calc(env(safe-area-inset-bottom, 0px) + 58px)";
    badge.style.zIndex = "9000";
    badge.style.padding = "9px 12px";
    badge.style.border = "1px solid rgba(255, 207, 119, 0.48)";
    badge.style.borderRadius = "16px";
    badge.style.color = "rgba(255, 227, 173, 0.94)";
    badge.style.background = "rgba(4, 14, 28, 0.82)";
    badge.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.30), 0 0 10px rgba(255, 205, 95, 0.16)";
    badge.style.font = "800 11px/1.2 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";
    badge.style.letterSpacing = "0.03em";
    badge.style.textAlign = "center";
    badge.style.pointerEvents = "none";
    badge.style.backdropFilter = "blur(10px)";
    badge.style.webkitBackdropFilter = "blur(10px)";

    document.body.appendChild(badge);
    return badge;
  }

  function updateDiagnosticsBadge(message) {
    var badge = diagnosticsBadge();

    badge.textContent = "FieldOps " + message;
    document.documentElement.dataset.mapUiDiagnostic = message;
  }

  function reportShellLoadStep(step, result) {
    var message = "map-ui v1.1.3 Â· " + step + ": " + result;

    updateDiagnosticsBadge(message);

    if (window.console && typeof window.console.info === "function") {
      window.console.info("FieldOps Atlas", message);
    }
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
    if (!panel) return;

    panel.hidden = false;
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
      if (id === exceptId) return;
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

  function openWeatherMode() {
    closeOtherPanels("weatherModePanel");
    setPanelVisible(byId("weatherModePanel"), true);

    var weatherButton = byId("weatherModeButton");
    if (weatherButton) {
      weatherButton.setAttribute("aria-pressed", "true");
    }

    var selected = getSelectedWalk();

    if (selected) {
      setSelectedWeatherPending();
    }

    setText("weatherOverlayStatus", "Weather map overlay paused. Forecast text stays in Weather Mode for now.");
  }

  function closeWeatherMode() {
    setPanelVisible(byId("weatherModePanel"), false);

    var weatherButton = byId("weatherModeButton");
    if (weatherButton) {
      weatherButton.setAttribute("aria-pressed", "false");
    }
  }

  function refreshWeatherMode() {
    var walks = getVisibleWalks();
    var list = byId("visibleWeatherSiteList");
    var message = walks.length
      ? "Weather refresh is parked during shell handoff. Visible walks: " + walks.length + "."
      : "No visible walks are loaded yet.";

    if (list) {
      list.innerHTML = '<p class="visible-weather-empty">' + message + "</p>";
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

    if (!panel) return;

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

    if (!panel || !handle || !window.PointerEvent) return;

    var drag = null;

    on(handle, "pointerdown", function (event) {
      if (!isPanelVisible(panel)) return;

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
      if (!drag || event.pointerId !== drag.pointerId) return;

      drag.lastY = event.clientY;

      if (Math.abs(drag.lastY - drag.startY) > 10) {
        drag.moved = true;
      }
    });

    on(handle, "pointerup", finishDrag);
    on(handle, "pointercancel", finishDrag);

    function finishDrag(event) {
      if (!drag || event.pointerId !== drag.pointerId) return;

      var deltaY = drag.lastY - drag.startY;
      var moved = drag.moved || Math.abs(deltaY) > 10;

      try {
        handle.releasePointerCapture(drag.pointerId);
      } catch (error) {
        // Pointer capture can already be released by the browser.
      }

      drag = null;
      panel.classList.remove("is-dragging", "dragging");

      if (!moved) return;

      if (deltaY <= -28) {
        setInfoPanelExpanded(true);
      } else if (deltaY >= 28) {
        setInfoPanelExpanded(false);
      }
    }
  }

  function wireButtons() {
    on(byId("weatherModeButton"), "click", function () {
      if (isPanelVisible(byId("weatherModePanel"))) {
        closeWeatherMode();
      } else {
        openWeatherMode();
      }
    });

    on(byId("closeWeatherModeButton"), "click", closeWeatherMode);
    on(byId("refreshVisibleWeatherButton"), "click", refreshWeatherMode);
    on(byId("openFieldNotesButton"), "click", openFieldNotesPanel);
    on(byId("closeFieldNotesButton"), "click", closeFieldNotesPanel);

    on(byId("expandInfoButton"), "click", function () {
      var panel = byId("infoPanel");
      var isExpanded = !!panel && panel.classList.contains("is-expanded");

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
      "saveFieldNoteButton",
      "clearFieldNoteButton",
      "clearAllFieldNotesButton"
    ].forEach(function (id) {
      on(byId(id), "click", function () {
        showToast("Map UI v1.1.3 shell diagnostics active");
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
  }

  function loadShellAssets() {
    updateDiagnosticsBadge("map-ui v1.1.3 Â· loading shell css");

    return loadStylesheet("../../../shell.css", SHARED_SHELL_VERSION)
      .then(function (result) {
        reportShellLoadStep("root css", result);
        return loadScript("../../../shell.js", SHARED_SHELL_VERSION);
      })
      .then(function (result) {
        reportShellLoadStep("root js", result);
        return loadScript("./map-shell-guard.js", MAP_SHELL_GUARD_VERSION);
      })
      .then(function (result) {
        reportShellLoadStep("guard js", result);

        window.setTimeout(function () {
          var shellReady = document.querySelector(".app-shell") &&
            document.querySelector(".app-shell").dataset.shellReady;
          var guardReady = document.documentElement.dataset.mapShellGuard || "not-ready";

          updateDiagnosticsBadge(
            "map-ui v1.1.3 Â· shell=" + (shellReady || "not-ready") + " Â· guard=" + guardReady
          );
        }, 1200);

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
    document.documentElement.dataset.mapUiDiagnostics = "true";
  }

  function boot() {
    markBody();
    updateBridge();

    safe("shared shell loader", function () {
      loadShellAssets();
    });

    safe("button wiring", wireButtons);
    safe("details panel drag", wireDetailsPanelDrag);

    showToast("FieldOps Atlas map-ui v1.1.3 loaded");
    updateDiagnosticsBadge("map-ui v1.1.3 loaded");
  }

  onReady(boot);
})();
