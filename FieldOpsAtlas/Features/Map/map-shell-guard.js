/* ============================================================================
   FieldOps Atlas map shell guard
   Root file: FieldOpsAtlas/Features/Map/map-shell-guard.js
   Version: 1.1.3-force-retire-map-legacy-shell

   Purpose:
   - Bridge shared shell events into the map-owned UI/state.
   - Force-retire duplicate legacy Map chrome after the shared root shell loads.
   - Register visible map walks with FieldOpsSearch.
   - Protect shell chrome clicks from broad map document handlers.
   - Do not change map data, region JSON, markers, Leaflet state, or walk files.

   Notes:
   - Legacy chrome is hidden by broad selector and inline style.
   - Legacy nodes are hidden, not removed, so older map code can still query ids.
   ============================================================================ */

(function fieldOpsMapShellGuard() {
  "use strict";

  var VERSION = "1.1.3-force-retire-map-legacy-shell";
  var WORK_ONLINE_KEY = "fieldops-atlas-work-online";
  var MAP_SEARCH_PROVIDER_ID = "map-visible-walks";

  var LEGACY_CHROME_SELECTORS = [
    ".top-bar",
    "#topBarFade",
    "#topFilterMenu",
    "#topRegionTree",
    "#menuOverlay",
    "#sideMenu",
    ".side-rail",
    "#railToolsMenu"
  ];

  var CHROME_ROOT_SELECTORS = [
    ".top-shell",
    ".drawer",
    ".filter-panel",
    ".search-panel",
    ".bottom-shell",
    ".map-tools-panel"
  ];

  var MAP_DELEGATED_ACTION_SELECTOR = [
    "[data-action][data-walk]",
    "[data-search-walk]",
    "[data-region-filter]",
    "[data-edit-region]",
    "[data-open-panel]",
    "[data-close-panel]",
    "[data-copy-target]",
    "[data-map-tool-action]"
  ].join(",");

  var boundChromeRoots = new WeakSet();

  function byId(id) {
    return document.getElementById(id);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function dispatchMapShellState(name, detail) {
    window.dispatchEvent(new CustomEvent(name, {
      detail: Object.assign({
        page: "map",
        version: VERSION
      }, detail || {})
    }));
  }

  function setExpanded(element, isExpanded) {
    if (element) {
      element.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }
  }

  function forceHide(element) {
    if (!element) {
      return;
    }

    element.dataset.fieldopsLegacyShellRetired = VERSION;
    element.setAttribute("aria-hidden", "true");
    element.hidden = true;
    element.classList.remove("is-open", "open", "active", "is-active");
    element.style.setProperty("display", "none", "important");
    element.style.setProperty("visibility", "hidden", "important");
    element.style.setProperty("pointer-events", "none", "important");
  }

  function injectLegacyRetireStyles() {
    if (byId("fieldopsMapLegacyShellRetireStyle")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "fieldopsMapLegacyShellRetireStyle";
    style.textContent = [
      'html[data-map-legacy-shell="retired"] .top-bar',
      'html[data-map-legacy-shell="retired"] #topBarFade',
      'html[data-map-legacy-shell="retired"] #topFilterMenu',
      'html[data-map-legacy-shell="retired"] #topRegionTree',
      'html[data-map-legacy-shell="retired"] #menuOverlay',
      'html[data-map-legacy-shell="retired"] #sideMenu',
      'html[data-map-legacy-shell="retired"] .side-rail',
      'html[data-map-legacy-shell="retired"] #railToolsMenu',
      '.top-bar[data-fieldops-legacy-shell-retired]',
      '#topBarFade[data-fieldops-legacy-shell-retired]',
      '#topFilterMenu[data-fieldops-legacy-shell-retired]',
      '#topRegionTree[data-fieldops-legacy-shell-retired]',
      '#menuOverlay[data-fieldops-legacy-shell-retired]',
      '#sideMenu[data-fieldops-legacy-shell-retired]',
      '.side-rail[data-fieldops-legacy-shell-retired]',
      '#railToolsMenu[data-fieldops-legacy-shell-retired]',
      '{',
      '  display: none !important;',
      '  visibility: hidden !important;',
      '  pointer-events: none !important;',
      '}'
    ].join("\n");

    document.head.appendChild(style);
  }

  function retireLegacyChrome() {
    injectLegacyRetireStyles();
    document.documentElement.dataset.mapLegacyShell = "retired";

    LEGACY_CHROME_SELECTORS.forEach(function hideSelector(selector) {
      qsa(selector).forEach(forceHide);
    });

    setExpanded(byId("menuBtn"), false);
    setExpanded(byId("fitMapBtn"), false);
    setExpanded(byId("topSelectRegionButton"), false);
    setExpanded(byId("railMapButton"), false);
    setExpanded(byId("railToolsButton"), false);
  }

  function openPanel(panel) {
    if (!panel) {
      return false;
    }

    panel.hidden = false;
    panel.classList.remove("is-hidden");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    return true;
  }

  function closePanel(panel) {
    if (!panel) {
      return;
    }

    panel.classList.add("is-hidden");
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }

  function closeMapFeaturePanels(exceptId) {
    [
      "filterPanel",
      "settingsPanel",
      "addPanel",
      "regionPanel",
      "weatherModePanel",
      "fieldNotesPanel"
    ].forEach(function closeFeaturePanel(id) {
      if (id !== exceptId) {
        closePanel(byId(id));
      }
    });
  }

  function openMapRegionFilter() {
    closeMapToolsPanel();
    closeMapFeaturePanels("filterPanel");

    if (openPanel(byId("filterPanel"))) {
      return;
    }

    dispatchMapShellState("fieldops:map-region-filter-missing");
  }

  function openMapSettings() {
    closeMapToolsPanel();
    closeMapFeaturePanels("settingsPanel");

    if (openPanel(byId("settingsPanel"))) {
      return;
    }

    var settingsButton = byId("menuSettingsButton");

    if (settingsButton) {
      settingsButton.click();
    }
  }

  function clickIfPresent(id) {
    var element = byId(id);

    if (!element) {
      return false;
    }

    element.click();
    return true;
  }

  function mapBridge() {
    return window.FieldOpsAtlasBridge || null;
  }

  function visibleWalks() {
    var bridge = mapBridge();

    if (!bridge || typeof bridge.getVisibleWalks !== "function") {
      return [];
    }

    return bridge.getVisibleWalks() || [];
  }

  function walkSubtitle(walk) {
    return [
      walk.regionName || walk.region || walk.regionId || "",
      walk.gridRef || walk.grid || "",
      walk.siteType || walk.type || "Walk"
    ].filter(Boolean).join(" Â· ");
  }

  function registerMapSearchProvider() {
    var walks = visibleWalks();

    var provider = {
      page: "map",
      id: MAP_SEARCH_PROVIDER_ID,
      label: "Map",
      placeholder: "Find walk",
      emptyText: walks.length ? "No matching walks." : "Pick a region to load walks.",
      items: walks.map(function mapWalkToSearchItem(walk) {
        return {
          id: String(walk.id || walk.slug || walk.name || ""),
          title: String(walk.name || walk.title || "Unnamed walk"),
          subtitle: walkSubtitle(walk),
          keywords: [
            walk.id,
            walk.slug,
            walk.regionId,
            walk.region,
            walk.gridRef,
            walk.grid,
            walk.what3words,
            walk.w3w,
            walk.notes
          ].filter(Boolean)
        };
      }).filter(function hasSearchIdentity(item) {
        return item.id && item.title;
      })
    };

    if (window.FieldOpsSearch && typeof window.FieldOpsSearch.registerPage === "function") {
      window.FieldOpsSearch.registerPage(provider);
      return;
    }

    window.FieldOpsSearchQueue = window.FieldOpsSearchQueue || [];

    if (Array.isArray(window.FieldOpsSearchQueue)) {
      window.FieldOpsSearchQueue.push(provider);
    }
  }

  function scheduleMapSearchProviderRefresh() {
    window.requestAnimationFrame(registerMapSearchProvider);
  }

  function handleShellSearchSelect(event) {
    var detail = event.detail || {};
    var item = detail.item || {};
    var bridge = mapBridge();

    if (detail.page !== "map" || !item.id || !bridge || typeof bridge.selectWalk !== "function") {
      return;
    }

    bridge.selectWalk(item.id, true);
  }

  function mapWorkOnlineToggles() {
    return [byId("workOnlineToggle"), byId("writeToggle")].filter(Boolean);
  }

  function currentWorkOnlineState() {
    var toggle = mapWorkOnlineToggles()[0];

    if (toggle) {
      return Boolean(toggle.checked);
    }

    return localStorage.getItem(WORK_ONLINE_KEY) === "true";
  }

  function publishWorkOnlineState() {
    dispatchMapShellState("fieldops:shell-work-online-state", {
      online: currentWorkOnlineState()
    });
  }

  function setMapWorkOnline(isOnline) {
    var nextState = Boolean(isOnline);
    var toggles = mapWorkOnlineToggles();

    if (!toggles.length) {
      localStorage.setItem(WORK_ONLINE_KEY, String(nextState));
      publishWorkOnlineState();
      return;
    }

    toggles.forEach(function updateToggle(toggle) {
      toggle.checked = nextState;
    });

    toggles[0].dispatchEvent(new Event("change", { bubbles: true }));
    publishWorkOnlineState();
  }

  function injectMapToolsStyles() {
    if (byId("fieldopsMapToolsPanelStyle")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "fieldopsMapToolsPanelStyle";
    style.textContent = `
      .map-tools-panel {
        position: absolute;
        z-index: 5008;
        right: var(--shell-side, 7px);
        bottom: calc(env(safe-area-inset-bottom, 0px) + 58px);
        left: var(--shell-side, 7px);
        padding: 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        border: 1px solid rgba(255, 207, 119, 0.78);
        border-radius: 18px;
        color: rgba(255, 255, 255, 0.92);
        background:
          radial-gradient(circle at 18% 4%, rgba(95, 181, 255, 0.24), transparent 30%),
          radial-gradient(circle at 100% 100%, rgba(255, 207, 119, 0.13), transparent 34%),
          linear-gradient(180deg, rgba(13, 42, 72, 0.985), rgba(6, 20, 38, 0.985));
        box-shadow:
          0 0 0 1px rgba(255, 228, 166, 0.12),
          0 14px 30px rgba(0, 0, 0, 0.38),
          inset 0 1px 0 rgba(255, 255, 255, 0.10);
        -webkit-backdrop-filter: blur(16px) saturate(122%);
        backdrop-filter: blur(16px) saturate(122%);
      }

      .map-tools-panel[hidden] {
        display: none !important;
      }

      .map-tools-panel__title {
        grid-column: 1 / -1;
        margin: 0 0 2px;
        color: rgba(255, 255, 255, 0.94);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .map-tools-panel__button {
        min-height: 42px;
        padding: 0 10px;
        border: 1px solid rgba(76, 113, 151, 0.74);
        border-radius: 12px;
        color: rgba(255, 255, 255, 0.92);
        background:
          radial-gradient(circle at 50% 0%, rgba(255, 224, 154, 0.12), transparent 36%),
          linear-gradient(180deg, rgba(21, 57, 94, 0.96), rgba(16, 44, 76, 0.96));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
        font: inherit;
        font-size: 13px;
        font-weight: 800;
      }
    `;

    document.head.appendChild(style);
  }

  function mapToolsPanel() {
    var panel = byId("mapToolsPanel");

    if (panel) {
      return panel;
    }

    injectMapToolsStyles();

    panel = document.createElement("aside");
    panel.id = "mapToolsPanel";
    panel.className = "map-tools-panel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Map tools");
    panel.innerHTML = [
      '<div class="map-tools-panel__title">Map tools</div>',
      '<button class="map-tools-panel__button" type="button" data-map-tool-action="regions">Regions</button>',
      '<button class="map-tools-panel__button" type="button" data-map-tool-action="fit">Fit map</button>',
      '<button class="map-tools-panel__button" type="button" data-map-tool-action="weather">Weather</button>',
      '<button class="map-tools-panel__button" type="button" data-map-tool-action="settings">Settings</button>'
    ].join("");

    (document.querySelector(".app-shell") || document.body).appendChild(panel);
    return panel;
  }

  function closeMapToolsPanel() {
    var panel = byId("mapToolsPanel");

    if (panel) {
      panel.hidden = true;
    }
  }

  function toggleMapToolsPanel() {
    var panel = mapToolsPanel();
    panel.hidden = !panel.hidden;
  }

  function handleMapToolAction(action) {
    closeMapToolsPanel();

    if (action === "regions") {
      openMapRegionFilter();
      return;
    }

    if (action === "fit") {
      if (!clickIfPresent("fitVisibleSitesButton")) {
        dispatchMapShellState("fieldops:map-tools-fit", { source: "map-tools-panel" });
      }
      return;
    }

    if (action === "weather") {
      if (!clickIfPresent("weatherModeButton")) {
        dispatchMapShellState("fieldops:map-tools-weather", { source: "map-tools-panel" });
      }
      return;
    }

    if (action === "settings") {
      openMapSettings();
    }
  }

  function shouldLetMapDocumentHandle(event) {
    var target = event.target;

    if (!isElement(target)) {
      return false;
    }

    return Boolean(target.closest(MAP_DELEGATED_ACTION_SELECTOR));
  }

  function stopChromeClickBeforeMapDocumentHandlers(event) {
    if (shouldLetMapDocumentHandle(event)) {
      return;
    }

    event.stopPropagation();
  }

  function bindChromeRoot(root) {
    if (!root || boundChromeRoots.has(root)) {
      return;
    }

    root.addEventListener("click", stopChromeClickBeforeMapDocumentHandlers);
    boundChromeRoots.add(root);
  }

  function bindChromeRoots() {
    CHROME_ROOT_SELECTORS.forEach(function bindSelector(selector) {
      qsa(selector).forEach(bindChromeRoot);
    });
  }

  function observeChromeRoots() {
    if (!("MutationObserver" in window)) {
      return;
    }

    var observer = new MutationObserver(function observeShellMutation() {
      retireLegacyChrome();
      bindChromeRoots();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  function bindShellEvents() {
    window.addEventListener("fieldops:shell-filter-region", openMapRegionFilter);
    window.addEventListener("fieldops:open-region-filter", openMapRegionFilter);
    window.addEventListener("fieldops:shell-map-tools-toggle", toggleMapToolsPanel);
    window.addEventListener("fieldops:shell-search-select", handleShellSearchSelect);

    window.addEventListener("fieldops:shell-search-open", closeMapToolsPanel);
    window.addEventListener("fieldops:shell-filter-open", closeMapToolsPanel);

    window.addEventListener("fieldops:shell-settings", function handleShellSettings(event) {
      if (!event.detail || event.detail.page === "map") {
        openMapSettings();
      }
    });

    window.addEventListener("fieldops:shell-work-online-toggle", function handleShellWorkOnline(event) {
      var detail = event.detail || {};

      if (detail.page === "map") {
        setMapWorkOnline(Boolean(detail.online));
      }
    });

    window.addEventListener("fieldops-atlas-walks-changed", scheduleMapSearchProviderRefresh);
    window.addEventListener("fieldops-atlas-regions-changed", scheduleMapSearchProviderRefresh);
    window.addEventListener("fieldops:map-shell-guard-refresh-search", scheduleMapSearchProviderRefresh);

    document.addEventListener("click", function handleGuardClick(event) {
      var target = event.target;

      if (!isElement(target)) {
        return;
      }

      var toolButton = target.closest("[data-map-tool-action]");

      if (toolButton) {
        event.preventDefault();
        event.stopPropagation();
        handleMapToolAction(toolButton.dataset.mapToolAction);
      }
    }, true);

    document.addEventListener("pointerdown", function handleOutsidePointer(event) {
      var target = event.target;
      var panel = byId("mapToolsPanel");

      if (!isElement(target) || !panel || panel.hidden) {
        return;
      }

      if (target.closest(".map-tools-panel, .bottom-shell, .top-shell")) {
        return;
      }

      closeMapToolsPanel();
    }, true);
  }

  function boot() {
    document.documentElement.dataset.mapShellGuard = VERSION;

    retireLegacyChrome();
    bindChromeRoots();
    observeChromeRoots();
    bindShellEvents();
    registerMapSearchProvider();
    publishWorkOnlineState();

    window.setTimeout(retireLegacyChrome, 0);
    window.setTimeout(retireLegacyChrome, 100);
    window.setTimeout(retireLegacyChrome, 500);
    window.setTimeout(retireLegacyChrome, 1200);
    window.setTimeout(registerMapSearchProvider, 250);
    window.setTimeout(registerMapSearchProvider, 900);

    window.dispatchEvent(new CustomEvent("fieldops:map-shell-guard-ready", {
      detail: { version: VERSION }
    }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}());
