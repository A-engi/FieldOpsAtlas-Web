/* ============================================================================
   FieldOps Atlas map shell guard
   Root file: FieldOpsAtlas/Features/Map/map-shell-guard.js
   Version: 1.1.1-map-shell-guard-v3

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

  const VERSION = "1.1.1-map-shell-guard-v3";

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

  function bindSharedShellBridge() {
    window.addEventListener("fieldops:shell-filter-region", openMapRegionFilter);
    window.addEventListener("fieldops:open-region-filter", openMapRegionFilter);

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
