/* ============================================================================
   FieldOps Atlas map shell guard
   Root file: FieldOpsAtlas/Features/Map/map-shell-guard.js
   Version: 1.1.1-map-shell-guard-v5

   Purpose:
   - Keep old map chrome clicks from leaking into broad map document handlers.
   - Preserve delegated map actions that intentionally rely on document clicks.
   - Bridge shared shell Region filter actions to the map-owned region UI.
   - Do not change map data, region data, markers, Leaflet state, or visuals.

   Load order:
   - Best loaded after map-app.js and before map-ui.js.
   - Works with the current old map shell and with the newer shared shell chrome.
   ============================================================================ */

(function () {
  "use strict";

  const VERSION = "1.1.1-map-shell-guard-v5";
  const WORK_ONLINE_KEY = "fieldops-atlas-work-online";
  const MAP_SEARCH_PROVIDER_ID = "map-visible-walks";

  const CHROME_ROOT_SELECTORS = [
    ".top-bar",
    ".top-filter-menu",
    ".top-region-tree",
    ".search-shell",
    ".side-menu",
    ".menu-overlay",
    ".side-rail",
    ".rail-tools-menu",

    ".top-shell",
    ".drawer",
    ".filter-panel",
    ".search-panel",
    ".bottom-shell"
  ];

  /*
    These actions are intentionally handled by map-app.js through document-level
    delegation. Do not block them or search results / region chips stop working.
  */
  const MAP_DELEGATED_ACTION_SELECTOR = [
    "[data-action][data-walk]",
    "[data-search-walk]",
    "[data-region-filter]",
    "[data-edit-region]",
    "[data-open-panel]",
    "[data-close-panel]",
    "[data-copy-target]"
  ].join(",");

  const boundChromeRoots = new WeakSet();

  function byId(id) {
    return document.getElementById(id);
  }

  function isElement(value) {
    return value instanceof Element;
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

    /*
      Bubble-phase only:
      - lets the button/input/link target handler run first;
      - stops the same click before map-app.js document-level closers see it.
    */
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
    closeOldFloatingMenus();

    /*
      Prefer the full map-owned region panel if present. That is the real region
      filter UI, and map-app.js owns its contents.
    */
    if (openPanel(byId("filterPanel"))) {
      return;
    }

    /*
      Transitional fallback: older top filter/tree markup, as shown in the map
      page currently. This does not touch map state; it only opens the UI.
    */
    openOldTopRegionFilter();
  }

  function mapBridge() {
    return window.FieldOpsAtlasBridge || null;
  }

  function visibleWalks() {
    const bridge = mapBridge();

    if (!bridge || typeof bridge.getVisibleWalks !== "function") {
      return [];
    }

    return bridge.getVisibleWalks();
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
    window.requestAnimationFrame(function () {
      registerMapSearchProvider();
    });
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

  function bindMapSearchBridge() {
    window.addEventListener("fieldops:shell-search-select", handleShellSearchSelect);
    window.addEventListener("fieldops-atlas-walks-changed", scheduleMapSearchProviderRefresh);
    window.addEventListener("fieldops-atlas-regions-changed", scheduleMapSearchProviderRefresh);
    window.addEventListener("fieldops:map-shell-guard-refresh-search", scheduleMapSearchProviderRefresh);

    scheduleMapSearchProviderRefresh();
    window.setTimeout(registerMapSearchProvider, 250);
    window.setTimeout(registerMapSearchProvider, 900);
  }

  function dispatchShellState(name, detail) {
    window.dispatchEvent(new CustomEvent(name, {
      detail: {
        page: "map",
        version: VERSION,
        ...(detail || {})
      }
    }));
  }

  function uniqueElements(elements) {
    return elements.filter(function (element, index, all) {
      return element && all.indexOf(element) === index;
    });
  }

  function mapWorkOnlineToggles() {
    return uniqueElements([
      byId("workOnlineToggle"),
      byId("writeToggle")
    ]);
  }

  function currentWorkOnlineState() {
    const toggle = mapWorkOnlineToggles()[0];

    if (toggle) {
      return Boolean(toggle.checked);
    }

    return localStorage.getItem(WORK_ONLINE_KEY) === "true";
  }

  function publishWorkOnlineState() {
    dispatchShellState("fieldops:shell-work-online-state", {
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

    /*
      map-app.js owns the real save/toast/sync logic. One change event is enough:
      its setWorkOnline() mirrors the paired toggle internally.
    */
    toggles[0].dispatchEvent(new Event("change", { bubbles: true }));
    publishWorkOnlineState();
  }

  function openMapSettings() {
    closeOldFloatingMenus();

    if (openPanel(byId("settingsPanel"))) {
      return;
    }

    const settingsButton = byId("menuSettingsButton");

    if (settingsButton) {
      settingsButton.click();
    }
  }

  function bindSharedShellBridge() {
    window.addEventListener("fieldops:shell-filter-region", openMapRegionFilter);
    window.addEventListener("fieldops:open-region-filter", openMapRegionFilter);

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

    window.addEventListener("storage", function (event) {
      if (event.key === WORK_ONLINE_KEY) {
        publishWorkOnlineState();
      }
    });

    document.addEventListener("click", function (event) {
      const target = event.target;

      if (!isElement(target)) {
        return;
      }

      const regionFilterButton = target.closest("[data-filter-region]");

      if (!regionFilterButton) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openMapRegionFilter();
    }, true);
  }

  function boot() {
    document.documentElement.dataset.mapShellGuard = VERSION;

    bindChromeRoots();
    observeChromeRoots();
    bindSharedShellBridge();
    bindMapSearchBridge();
    publishWorkOnlineState();

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
