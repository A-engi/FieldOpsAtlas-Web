/* ============================================================================
   FieldOps Atlas map shell guard
   Root file: FieldOpsAtlas/Features/Map/map-shell-guard.js
   Version: 1.1.1-map-shell-guard-v2

   Purpose:
   - Keep map chrome touches from leaking into map document-level handlers.
   - Keep old map chrome and the newer shared shell chrome safely separated.
   - Bridge shared shell Region filter actions to the map-owned region panel.

   Load order:
   - Load after map-app.js so map-owned button handlers run first.
   - This file then stops the same chrome click before broad document handlers
     treat it as a map/background click.
   ============================================================================ */

(function () {
  "use strict";

  const VERSION = "1.1.1-map-shell-guard-v2";

  const CHROME_EVENT_ROOTS = [
    ".top-bar",
    ".top-filter-menu",
    ".top-region-tree",
    ".search-shell",
    ".search-suggestions",
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

  function byId(id) {
    return document.getElementById(id);
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function stopBeforeDocumentHandlers(event) {
    event.stopPropagation();
  }

  function bindChromeEventRoots() {
    CHROME_EVENT_ROOTS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (root) {
        root.addEventListener("click", stopBeforeDocumentHandlers);
      });
    });
  }

  function setExpanded(element, isExpanded) {
    if (element) {
      element.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }
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

  function closeOldChromeMenus() {
    closeHiddenMenu(byId("topFilterMenu"));
    closeHiddenMenu(byId("topRegionTree"));
    closeHiddenMenu(byId("railToolsMenu"));

    setExpanded(byId("fitMapBtn"), false);
    setExpanded(byId("topSelectRegionButton"), false);
    setExpanded(byId("railToolsButton"), false);
  }

  function openRegionFilterPanel() {
    closeOldChromeMenus();

    if (openPanel(byId("filterPanel"))) {
      return;
    }

    /*
      Fallback for transitional markup: if the full region filter panel is not
      present, open the old top region tree instead of silently doing nothing.
    */
    const topRegionTree = byId("topRegionTree");
    const topSelectRegionButton = byId("topSelectRegionButton");

    if (topRegionTree) {
      topRegionTree.hidden = false;
      topRegionTree.classList.add("is-open");
      setExpanded(topSelectRegionButton, true);
    }
  }

  function bindSharedShellBridge() {
    window.addEventListener("fieldops:shell-filter-region", openRegionFilterPanel);
    window.addEventListener("fieldops:open-region-filter", openRegionFilterPanel);

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
      openRegionFilterPanel();
    }, true);
  }

  function boot() {
    document.documentElement.dataset.mapShellGuard = VERSION;
    bindChromeEventRoots();
    bindSharedShellBridge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
