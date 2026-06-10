/* ============================================================================
   FieldOps Atlas map shell guard
   Root file: FieldOpsAtlas/Features/Map/map-shell-guard.js
   Version: 1.1.1-map-shell-guard-v6

   Purpose:
   - Load the shared root shell on the map page when index.html has not yet
     been fully handed over.
   - Keep old map chrome clicks from leaking into broad map document handlers.
   - Preserve delegated map actions that intentionally rely on document clicks.
   - Bridge shared shell Region filter, Search, Settings, and Work online actions
     to the map-owned UI/state.
   - Do not change map data, region data, markers, Leaflet state, or visuals.

   Load order:
   - Best loaded after map-app.js and before map-ui.js.
   - Works with the current old map shell and with the newer shared shell chrome.
   ============================================================================ */

(function () {
  "use strict";

  const VERSION = "1.1.1-map-shell-guard-v6";
  const WORK_ONLINE_KEY = "fieldops-atlas-work-online";
  const MAP_SEARCH_PROVIDER_ID = "map-visible-walks";

  const SHARED_SHELL_CSS_PATH = "../../../shell.css";
  const SHARED_SHELL_JS_PATH = "../../../shell.js";
  const SHARED_SHELL_VERSION = "1.1.1-shell-v2.2-map-drawer-actions";

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

  function assetUrl(path) {
    return new URL(path, window.location.href).href;
  }

  function cacheBust(url, version) {
    const nextUrl = new URL(url, window.location.href);

    nextUrl.searchParams.set("v", version);
    return nextUrl.href;
  }

  function sameAssetUrl(left, right) {
    return new URL(left, window.location.href).href.split("?")[0] ===
      new URL(right, window.location.href).href.split("?")[0];
  }

  function existingStylesheet(href) {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"][href]')).find(function (link) {
      return sameAssetUrl(link.href, href);
    }) || null;
  }

  function existingScript(src) {
    return Array.from(document.querySelectorAll("script[src]")).find(function (script) {
      return sameAssetUrl(script.src, src);
    }) || null;
  }

  function refreshSharedShellState() {
    bindChromeRoots();
    registerMapSearchProvider();
    publishWorkOnlineState();
  }

  function ensureSharedShellStyles() {
    const cssHref = assetUrl(SHARED_SHELL_CSS_PATH);

    if (existingStylesheet(cssHref)) {
      return;
    }

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = cacheBust(cssHref, SHARED_SHELL_VERSION);
    link.dataset.fieldopsSharedShell = VERSION;

    document.head.appendChild(link);
  }

  function ensureSharedShellScript() {
    const jsSrc = assetUrl(SHARED_SHELL_JS_PATH);
    const existing = existingScript(jsSrc);

    if (existing) {
      window.requestAnimationFrame(refreshSharedShellState);
      return;
    }

    const script = document.createElement("script");

    script.src = cacheBust(jsSrc, SHARED_SHELL_VERSION);
    script.defer = true;
    script.dataset.fieldopsSharedShell = VERSION;
    script.addEventListener("load", refreshSharedShellState, { once: true });

    document.body.appendChild(script);
  }

  function ensureSharedShellAssets() {
    ensureSharedShellStyles();
    ensureSharedShellScript();
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
