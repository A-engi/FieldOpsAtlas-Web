/* ============================================================================
   FieldOps Atlas map shell guard
   Root file: FieldOpsAtlas/Features/Map/map-shell-guard.js
   Version: 1.1.1-map-shell-guard-v11-bridge-only

   Purpose:
   - Bridge shared shell events into the map-owned UI/state.
   - Protect shell chrome clicks from broad map document handlers.
   - Register visible map walks with FieldOpsSearch.
   - Do not load root shell files.
   - Do not inject fallback top/bottom shell UI.
   - Do not change map data, region JSON, markers, Leaflet state, or fade visuals.
   ============================================================================ */

(function () {
  "use strict";

  const VERSION = "1.1.1-map-shell-guard-v11-bridge-only";
  const WORK_ONLINE_KEY = "fieldops-atlas-work-online";
  const MAP_SEARCH_PROVIDER_ID = "map-visible-walks";

  const CHROME_ROOT_SELECTORS = [
    ".top-shell",
    ".drawer",
    ".filter-panel",
    ".search-panel",
    ".bottom-shell",
    ".top-bar",
    ".top-filter-menu",
    ".top-region-tree",
    ".search-shell",
    ".side-menu",
    ".menu-overlay",
    ".side-rail",
    ".rail-tools-menu",
    ".map-tools-panel"
  ];

  const MAP_DELEGATED_ACTION_SELECTOR = [
    "[data-action][data-walk]",
    "[data-search-walk]",
    "[data-region-filter]",
    "[data-edit-region]",
    "[data-open-panel]",
    "[data-close-panel]",
    "[data-copy-target]",
    "[data-map-tool-action]"
  ].join(",");

  const boundChromeRoots = new WeakSet();

  function byId(id) {
    return document.getElementById(id);
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function dispatchMapShellState(name, detail) {
    window.dispatchEvent(new CustomEvent(name, {
      detail: {
        page: "map",
        version: VERSION,
        ...(detail || {})
      }
    }));
  }

  function setExpanded(element, isExpanded) {
    if (element) {
      element.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }
  }

  function openHiddenMenu(menu) {
    if (!menu) {
      return false;
    }

    menu.hidden = false;
    menu.classList.add("is-open");
    return true;
  }

  function closeHiddenMenu(menu) {
    if (!menu) {
      return;
    }

    menu.hidden = true;
    menu.classList.remove("is-open");
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

  function closeOldFloatingMenus() {
    closeHiddenMenu(byId("topFilterMenu"));
    closeHiddenMenu(byId("topRegionTree"));
    closeHiddenMenu(byId("railToolsMenu"));

    setExpanded(byId("fitMapBtn"), false);
    setExpanded(byId("topSelectRegionButton"), false);
    setExpanded(byId("railToolsButton"), false);
    setExpanded(byId("railMapButton"), false);
  }

  function openOldTopRegionFilter() {
    const topFilterMenu = byId("topFilterMenu");
    const topRegionTree = byId("topRegionTree");

    const openedFilter = openHiddenMenu(topFilterMenu);
    const openedTree = openHiddenMenu(topRegionTree);

    setExpanded(byId("fitMapBtn"), openedFilter);
    setExpanded(byId("topSelectRegionButton"), openedTree);

    return openedFilter || openedTree;
  }

  function openMapRegionFilter() {
    closeMapToolsPanel();

    if (openPanel(byId("filterPanel"))) {
      return;
    }

    openOldTopRegionFilter();
  }

  function openMapSettings() {
    closeOldFloatingMenus();
    closeMapToolsPanel();

    if (openPanel(byId("settingsPanel"))) {
      return;
    }

    const settingsButton = byId("menuSettingsButton");

    if (settingsButton) {
      settingsButton.click();
    }
  }

  function clickIfPresent(id) {
    const element = byId(id);

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
    const bridge = mapBridge();

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
    const walks = visibleWalks();

    const provider = {
      page: "map",
      id: MAP_SEARCH_PROVIDER_ID,
      label: "Map",
      placeholder: "Find walk",
      emptyText: walks.length ? "No matching walks." : "Pick a region to load walks.",
      items: walks.map(function (walk) {
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
      }).filter(function (item) {
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
    const detail = event.detail || {};
    const item = detail.item || {};
    const bridge = mapBridge();

    if (detail.page !== "map" || !item.id || !bridge || typeof bridge.selectWalk !== "function") {
      return;
    }

    bridge.selectWalk(item.id, true);
  }

  function mapWorkOnlineToggles() {
    return [byId("workOnlineToggle"), byId("writeToggle")].filter(Boolean);
  }

  function currentWorkOnlineState() {
    const toggle = mapWorkOnlineToggles()[0];

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
    const nextState = Boolean(isOnline);
    const toggles = mapWorkOnlineToggles();

    if (!toggles.length) {
      localStorage.setItem(WORK_ONLINE_KEY, String(nextState));
      publishWorkOnlineState();
      return;
    }

    toggles.forEach(function (toggle) {
      toggle.checked = nextState;
    });

    toggles[0].dispatchEvent(new Event("change", { bubbles: true }));
    publishWorkOnlineState();
  }

  function injectMapToolsStyles() {
    if (byId("fieldopsMapToolsPanelStyle")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "fieldopsMapToolsPanelStyle";
    style.textContent = `
      .map-tools-panel {
        position: absolute;
        z-index: 5008;
        right: 12px;
        bottom: calc(env(safe-area-inset-bottom, 0px) + 58px);
        left: 12px;
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
    let panel = byId("mapToolsPanel");

    if (panel) {
      return panel;
    }

    injectMapToolsStyles();

    panel = document.createElement("aside");
    panel.id = "mapToolsPanel";
    panel.className = "map-tools-panel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Map tools");
    panel.innerHTML = `
      <p class="map-tools-panel__title">Map tools</p>
      <button class="map-tools-panel__button" type="button" data-map-tool-action="regions">Regions</button>
      <button class="map-tools-panel__button" type="button" data-map-tool-action="fit">Fit map</button>
      <button class="map-tools-panel__button" type="button" data-map-tool-action="weather">Weather</button>
      <button class="map-tools-panel__button" type="button" data-map-tool-action="settings">Settings</button>
    `;

    (document.querySelector(".app-shell") || document.body).appendChild(panel);
    return panel;
  }

  function closeMapToolsPanel() {
    const panel = byId("mapToolsPanel");

    if (panel) {
      panel.hidden = true;
    }
  }

  function toggleMapToolsPanel() {
    closeOldFloatingMenus();

    const panel = mapToolsPanel();
    panel.hidden = !panel.hidden;
  }

  function handleMapToolAction(action) {
    closeMapToolsPanel();

    if (action === "regions") {
      openMapRegionFilter();
      return;
    }

    if (action === "fit") {
      if (!clickIfPresent("fitMapBtn")) {
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
    const target = event.target;

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
    CHROME_ROOT_SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(bindChromeRoot);
    });
  }

  function observeChromeRoots() {
    if (!("MutationObserver" in window)) {
      return;
    }

    const observer = new MutationObserver(bindChromeRoots);

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function bindShellEvents() {
    window.addEventListener("fieldops:shell-filter-region", openMapRegionFilter);
    window.addEventListener("fieldops:open-region-filter", openMapRegionFilter);
    window.addEventListener("fieldops:shell-map-tools-toggle", toggleMapToolsPanel);
    window.addEventListener("fieldops:shell-search-select", handleShellSearchSelect);

    window.addEventListener("fieldops:shell-settings", function (event) {
      if (!event.detail || event.detail.page === "map") {
        openMapSettings();
      }
    });

    window.addEventListener("fieldops:shell-work-online-toggle", function (event) {
      const detail = event.detail || {};

      if (detail.page === "map") {
        setMapWorkOnline(Boolean(detail.online));
      }
    });

    window.addEventListener("fieldops-atlas-walks-changed", scheduleMapSearchProviderRefresh);
    window.addEventListener("fieldops-atlas-regions-changed", scheduleMapSearchProviderRefresh);
    window.addEventListener("fieldops:map-shell-guard-refresh-search", scheduleMapSearchProviderRefresh);

    document.addEventListener("click", function (event) {
      const target = event.target;

      if (!isElement(target)) {
        return;
      }

      const toolButton = target.closest("[data-map-tool-action]");

      if (toolButton) {
        event.preventDefault();
        event.stopPropagation();
        handleMapToolAction(toolButton.dataset.mapToolAction);
        return;
      }

      if (target.closest("[data-filter-region]")) {
        event.preventDefault();
        event.stopPropagation();
        openMapRegionFilter();
      }
    }, true);

    document.addEventListener("pointerdown", function (event) {
      const target = event.target;

      if (!isElement(target) || !byId("mapToolsPanel") || byId("mapToolsPanel").hidden) {
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
    document.documentElement.dataset.mapLegacyShell = "archived";

    bindChromeRoots();
    observeChromeRoots();
    bindShellEvents();
    registerMapSearchProvider();
    publishWorkOnlineState();

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
})();
