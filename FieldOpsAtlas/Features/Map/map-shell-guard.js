/* ============================================================================
   FieldOps Atlas map shell guard
   Root file: FieldOpsAtlas/Features/Map/map-shell-guard.js
   Version: 1.1.1-map-shell-guard-v1

   Purpose:
   - Keep map chrome touches from leaking into map document-level handlers.
   - Keep the map canvas behind the top rail by treating chrome as chrome only.
   - Bridge the shared shell Region filter action to the map-owned filter panel.

   Load order:
   - Load after map-app.js so map button handlers run first, then this guard stops
     the same click before broad document-level closers see it.
   ============================================================================ */

(function () {
  "use strict";

  const VERSION = "1.1.1-map-shell-guard-v1";

  const CHROME_EVENT_ROOTS = [
    ".top-bar",
    ".top-filter-menu",
    ".top-region-tree",
    ".search-shell",
    ".search-suggestions",
    ".side-menu",
    ".menu-overlay",
    ".side-rail",
    ".rail-tools-menu"
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

  function openPanel(panel) {
    if (!panel) {
      return;
    }

    panel.hidden = false;
    panel.classList.remove("is-hidden");
    panel.classList.add("is-open");
  }

  function closeOldChromeMenus() {
    const topFilterMenu = byId("topFilterMenu");
    const topRegionTree = byId("topRegionTree");
    const railToolsMenu = byId("railToolsMenu");
    const fitMapButton = byId("fitMapBtn");
    const topSelectRegionButton = byId("topSelectRegionButton");
    const railToolsButton = byId("railToolsButton");

    [topFilterMenu, topRegionTree, railToolsMenu].forEach(function (menu) {
      if (!menu) {
        return;
      }

      menu.hidden = true;
      menu.classList.remove("is-open");
    });

    [fitMapButton, topSelectRegionButton, railToolsButton].forEach(function (button) {
      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function openRegionFilterPanel() {
    closeOldChromeMenus();
    openPanel(byId("filterPanel"));
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
