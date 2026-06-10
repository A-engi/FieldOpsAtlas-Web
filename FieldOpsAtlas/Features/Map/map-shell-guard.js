/* ============================================================================
   FieldOps Atlas map shell guard
   Root file: FieldOpsAtlas/Features/Map/map-shell-guard.js
   Version: 1.1.1-map-shell-guard-v9

   Purpose:
   - Load the shared root shell on the map page when index.html has not yet
     been fully handed over.
   - If the shared root shell fails to mount, inject a map-only fallback shell
     so the old archived shell is not replaced by blank space.
   - Keep old map chrome clicks from leaking into broad map document handlers.
   - Preserve delegated map actions that intentionally rely on document clicks.
   - Bridge shared shell Region filter, Search, Settings, and Work online actions
     to the map-owned UI/state.
   - Do not change map data, region data, markers, Leaflet state, or visuals.

   Load order:
   - Best loaded after map-app.js and before map-ui.js.
   ============================================================================ */

(function () {
  "use strict";

  const VERSION = "1.1.1-map-shell-guard-v9";
  const WORK_ONLINE_KEY = "fieldops-atlas-work-online";
  const MAP_SEARCH_PROVIDER_ID = "map-visible-walks";

  const SHARED_SHELL_CSS_PATHS = [
    "../../../shell.css",
    "/shell.css"
  ];

  const SHARED_SHELL_JS_PATHS = [
    "../../../shell.js",
    "/shell.js"
  ];

  const SHARED_SHELL_VERSION = "1.1.1-shell-v2.4-map-visible-build";

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
    ".bottom-shell",
    "[data-map-shell-fallback]"
  ];

  const MAP_DELEGATED_ACTION_SELECTOR = [
    "[data-action][data-walk]",
    "[data-search-walk]",
    "[data-region-filter]",
    "[data-edit-region]",
    "[data-open-panel]",
    "[data-close-panel]",
    "[data-copy-target]"
  ].join(",");

  const fallbackPages = [
    {
      key: "map",
      label: "Map",
      navLabel: "Map",
      icon: "icon--map",
      href: "FieldOpsAtlas/Features/Map/index.html"
    },
    {
      key: "rf",
      label: "RF",
      navLabel: "RF",
      icon: "icon--rf",
      href: "FieldOpsAtlas/Features/RF/index.html"
    },
    {
      key: "network",
      label: "Network",
      navLabel: "Net",
      icon: "icon--network",
      href: "FieldOpsAtlas/Features/Network/index.html"
    },
    {
      key: "docs",
      label: "Docs",
      navLabel: "Docs",
      icon: "icon--docs",
      href: "FieldOpsAtlas/Features/Docs/index.html"
    },
    {
      key: "tools",
      label: "Tools",
      navLabel: "Tool",
      icon: "icon--tools",
      href: "FieldOpsAtlas/Features/Tools/index.html"
    }
  ];

  const boundChromeRoots = new WeakSet();

  function byId(id) {
    return document.getElementById(id);
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function shellRoot() {
    return document.querySelector(".app-shell") || document.body;
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

  function hasMountedSharedShell() {
    const root = shellRoot();

    return Boolean(
      document.querySelector(".top-shell") &&
      document.querySelector(".bottom-shell") &&
      root.dataset.shellReady === "true"
    );
  }

  function refreshSharedShellState() {
    bindChromeRoots();
    registerMapSearchProvider();
    publishWorkOnlineState();
  }

  function ensureSharedShellStyles() {
    SHARED_SHELL_CSS_PATHS.forEach(function (path) {
      const href = assetUrl(path);

      if (existingStylesheet(href)) {
        return;
      }

      const link = document.createElement("link");

      link.rel = "stylesheet";
      link.href = cacheBust(href, SHARED_SHELL_VERSION);
      link.dataset.fieldopsSharedShell = VERSION;

      document.head.appendChild(link);
    });
  }

  function ensureSharedShellScript() {
    const firstCandidate = SHARED_SHELL_JS_PATHS.map(assetUrl).find(function (src) {
      return !existingScript(src);
    });

    if (!firstCandidate) {
      window.requestAnimationFrame(refreshSharedShellState);
      return;
    }

    const script = document.createElement("script");

    script.src = cacheBust(firstCandidate, SHARED_SHELL_VERSION);
    script.defer = true;
    script.dataset.fieldopsSharedShell = VERSION;
    script.addEventListener("load", refreshSharedShellState, { once: true });

    document.body.appendChild(script);
  }

  function ensureSharedShellAssets() {
    ensureSharedShellStyles();
    ensureSharedShellScript();
  }

  function iconMarkup(iconClass) {
    return '<span class="repo-icon ' + iconClass + '" aria-hidden="true"></span>';
  }

  function fallbackPageHref(page) {
    return new URL("../../../" + page.href, window.location.href).href;
  }

  function fallbackNavMarkup() {
    return fallbackPages.map(function (page) {
      const active = page.key === "map" ? " is-active" : "";

      return `
        <a class="button-surface nav-button${active}" href="${fallbackPageHref(page)}" data-page="${page.key}"${active ? ' aria-current="page"' : ""}>
          ${iconMarkup(page.icon)}
          <span>${page.navLabel}</span>
        </a>`;
    }).join("");
  }

  function fallbackShellMarkup() {
    return `
    <header class="top-shell" aria-label="Map controls" data-map-shell-fallback data-build="v2.4-guard-v9">
      <button class="button-surface icon-button" type="button" aria-label="Open menu" aria-expanded="false" data-fallback-menu>
        ${iconMarkup("icon--menu")}
      </button>

      <button class="button-surface search-button" type="button" aria-label="Open search" data-fallback-search>
        <span class="search-lead">
          ${iconMarkup("icon--search")}
          <span class="search-query">Find walk</span>
        </span>

        <span class="search-brand" aria-hidden="true">
          <span class="search-divider"></span>
          <span class="atlas-logo">
            ${iconMarkup("icon--atlas")}
            <span class="atlas-word">ATLAS</span>
          </span>
        </span>
      </button>

      <button class="button-surface icon-button" type="button" aria-label="Open filter menu" data-filter-region>
        ${iconMarkup("icon--filter")}
      </button>
    </header>

    <footer class="bottom-shell" data-map-shell-fallback data-build="v2.4-guard-v9">
      <div class="map-shell-build">v2.4 map shell Â· guard v9</div>
      <nav class="bottom-nav" aria-label="Primary navigation">
        ${fallbackNavMarkup()}
      </nav>
    </footer>`;
  }

  function injectFallbackShellStyles() {
    if (document.getElementById("fieldops-map-fallback-shell-style")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "fieldops-map-fallback-shell-style";
    style.textContent = `
      .fieldops-shell-root {
        --safe-top: env(safe-area-inset-top, 0px);
        --safe-bottom: env(safe-area-inset-bottom, 0px);
        --shell-side: 12px;
        --shell-surface: #0d2947;
        --text: rgba(255, 255, 255, 0.92);
        --gold: #ffe3ad;
        --gold-border: rgba(255, 207, 119, 0.78);
        --gold-line: rgba(255, 207, 119, 0.40);
        --gold-glow: rgba(255, 205, 95, 0.20);
        --button-top: rgba(9, 24, 45, 0.94);
        --button-bottom: rgba(4, 14, 28, 0.92);
        --button-border: rgba(96, 235, 255, 0.62);
        --outer-radius: 16px;
        --inner-radius: 14px;
        --top-height: 56px;
        --top-pad-y: 8px;
        --top-control-height: 42px;
        --top-icon-button-width: 48px;
        --top-icon-size: 26px;
        --gap: 12px;
        --search-height: var(--top-control-height);
        --search-icon-size: 25px;
        --search-edge: 14px;
        --search-gap: 12px;
        --search-brand-gap: 8px;
        --search-cluster-gap: 12px;
        --nav-height: 38px;
        --nav-design-width: 68px;
        --nav-pad-x: calc(var(--nav-design-width) * 0.17);
        --nav-pad-y: calc(var(--nav-height) * 0.17);
        --nav-usable-y: calc(var(--nav-height) - (var(--nav-pad-y) * 2));
        --nav-text-height: calc(var(--nav-usable-y) / 3.1);
        --nav-icon-size: calc(var(--nav-text-height) * 2);
        --nav-text-width: calc(var(--nav-design-width) - (var(--nav-pad-x) * 2));
        --nav-gap: calc(var(--nav-text-height) * 0.1);
        --nav-active-gap: 5px;
        --bottom-lift: 8px;
      }

      .fieldops-shell-root .button-surface {
        appearance: none;
        -webkit-appearance: none;
        border: 1px solid var(--button-border);
        border-radius: var(--inner-radius);
        color: var(--text);
        background:
          radial-gradient(circle at 50% 0%, rgba(255, 224, 154, 0.12), transparent 36%),
          linear-gradient(180deg, var(--button-top), var(--button-bottom));
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.12),
          0 8px 20px rgba(0, 0, 0, 0.16);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .fieldops-shell-root .repo-icon {
        display: block;
        flex: 0 0 auto;
        background-color: currentColor;
        -webkit-mask: var(--icon-src) center / contain no-repeat;
        mask: var(--icon-src) center / contain no-repeat;
      }

      .fieldops-shell-root .icon--menu { --icon-src: url("../../../data/icons/hamburger.svg"); }
      .fieldops-shell-root .icon--search { --icon-src: url("../../../data/icons/search.svg"); }
      .fieldops-shell-root .icon--filter { --icon-src: url("../../../data/icons/filter.svg"); }
      .fieldops-shell-root .icon--atlas { --icon-src: url("../../../data/icons/atlas-transmitter-gold.svg"); }
      .fieldops-shell-root .icon--map { --icon-src: url("../../../data/icons/map.svg"); }
      .fieldops-shell-root .icon--rf { --icon-src: url("../../../data/icons/rf.svg"); }
      .fieldops-shell-root .icon--network { --icon-src: url("../../../data/icons/network.svg"); }
      .fieldops-shell-root .icon--docs { --icon-src: url("../../../data/icons/docs.svg"); }
      .fieldops-shell-root .icon--tools { --icon-src: url("../../../data/icons/tools.svg"); }

      .fieldops-shell-root .top-shell {
        position: absolute;
        z-index: 5002;
        top: 0;
        right: 0;
        left: 0;
        height: calc(var(--top-height) + var(--safe-top));
        padding: calc(var(--top-pad-y) + var(--safe-top)) var(--shell-side) var(--top-pad-y);
        display: grid;
        grid-template-columns: var(--top-icon-button-width) minmax(0, 1fr) var(--top-icon-button-width);
        gap: var(--gap);
        align-items: center;
        pointer-events: none;
      }

      .fieldops-shell-root .top-shell > * {
        pointer-events: auto;
      }

      .fieldops-shell-root .icon-button {
        width: var(--top-icon-button-width);
        height: var(--top-control-height);
        padding: 0;
        display: grid;
        place-items: center;
        line-height: 1;
      }

      .fieldops-shell-root .icon-button .repo-icon {
        width: var(--top-icon-size);
        height: var(--top-icon-size);
      }

      .fieldops-shell-root .search-button {
        min-width: 0;
        height: var(--search-height);
        padding: 0 var(--search-edge);
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        column-gap: var(--search-cluster-gap);
        text-align: left;
      }

      .fieldops-shell-root .search-lead,
      .fieldops-shell-root .search-brand,
      .fieldops-shell-root .atlas-logo {
        display: flex;
        align-items: center;
        min-width: 0;
        white-space: nowrap;
      }

      .fieldops-shell-root .search-lead {
        gap: var(--search-gap);
        overflow: hidden;
      }

      .fieldops-shell-root .search-lead .repo-icon {
        width: var(--search-icon-size);
        height: var(--search-icon-size);
      }

      .fieldops-shell-root .search-query {
        min-width: 0;
        overflow: hidden;
        color: rgba(215, 235, 247, 0.78);
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
        transform: translateY(1px);
      }

      .fieldops-shell-root .search-brand {
        gap: var(--search-brand-gap);
      }

      .fieldops-shell-root .search-divider {
        width: 1px;
        height: 18px;
        flex: 0 0 auto;
        background: var(--gold-line);
      }

      .fieldops-shell-root .atlas-logo {
        height: 28px;
        gap: 7px;
        color: #fffdf7;
      }

      .fieldops-shell-root .atlas-logo .repo-icon {
        width: 21px;
        height: 21px;
        color: var(--gold);
      }

      .fieldops-shell-root .atlas-word {
        color: #fffdf7;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 13px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: 0.022em;
        text-transform: uppercase;
        transform: translateY(1px);
      }

      .fieldops-shell-root .bottom-shell {
        position: absolute;
        z-index: 5002;
        right: 0;
        bottom: calc(var(--safe-bottom) + var(--bottom-lift));
        left: 0;
        padding: 0 var(--shell-side);
        pointer-events: none;
      }

      .fieldops-shell-root .map-shell-build {
        position: absolute;
        right: var(--shell-side);
        bottom: calc(var(--nav-height) + 6px);
        padding: 3px 7px;
        border: 1px solid rgba(255, 207, 119, 0.44);
        border-radius: 999px;
        color: rgba(255, 227, 173, 0.92);
        background: rgba(4, 14, 28, 0.72);
        box-shadow: 0 0 8px rgba(255, 205, 95, 0.16);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        pointer-events: none;
      }

      .fieldops-shell-root .bottom-nav {
        height: var(--nav-height);
        display: flex;
        align-items: stretch;
        justify-content: center;
        overflow: visible;
        border: 0;
        background: transparent;
        box-shadow: none;
        pointer-events: auto;
      }

      .fieldops-shell-root .nav-button {
        position: relative;
        width: 20%;
        flex: 0 0 20%;
        min-width: 0;
        height: var(--nav-height);
        padding: 0;
        display: grid;
        grid-template-rows:
          var(--nav-pad-y)
          var(--nav-icon-size)
          var(--nav-gap)
          var(--nav-text-height)
          var(--nav-pad-y);
        justify-items: center;
        align-items: center;
        overflow: hidden;
        color: rgba(255, 255, 255, 0.84);
        border: 1px solid rgba(76, 113, 151, 0.74);
        border-right: 0;
        border-radius: 0;
        text-decoration: none;
        line-height: 1;
      }

      .fieldops-shell-root .nav-button:first-child {
        border-left: 1px solid rgba(76, 113, 151, 0.74);
        border-radius: var(--outer-radius) 0 0 var(--outer-radius);
      }

      .fieldops-shell-root .nav-button:last-child {
        border-right: 1px solid rgba(76, 113, 151, 0.74);
        border-radius: 0 var(--outer-radius) var(--outer-radius) 0;
      }

      .fieldops-shell-root .nav-button.is-active {
        z-index: 3;
        width: calc(20% - (var(--nav-active-gap) * 2));
        flex: 0 0 calc(20% - (var(--nav-active-gap) * 2));
        margin-inline: var(--nav-active-gap);
        color: var(--gold);
        border: 1px solid var(--gold-border);
        border-radius: var(--inner-radius);
        background:
          radial-gradient(circle at 50% 0%, rgba(120, 211, 255, 0.34), transparent 48%),
          radial-gradient(circle at 50% 104%, rgba(255, 190, 47, 0.18), transparent 38%),
          linear-gradient(180deg, #2a6fac 0%, #184c7f 100%);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.16),
          0 0 0 1px rgba(255, 220, 140, 0.12),
          0 0 10px var(--gold-glow);
      }

      .fieldops-shell-root .nav-button .repo-icon {
        grid-row: 2;
        width: var(--nav-icon-size);
        height: var(--nav-icon-size);
      }

      .fieldops-shell-root .nav-button span {
        grid-row: 4;
        width: var(--nav-text-width);
        height: var(--nav-text-height);
        display: grid;
        place-items: center;
        overflow: hidden;
        font-size: var(--nav-text-height);
        font-weight: 700;
        line-height: var(--nav-text-height);
        text-align: center;
        white-space: nowrap;
      }
    `;

    document.head.appendChild(style);
  }

  function injectFallbackShellIfNeeded() {
    window.setTimeout(function () {
      const root = shellRoot();

      if (hasMountedSharedShell() || document.querySelector("[data-map-shell-fallback]")) {
        return;
      }

      root.classList.add("fieldops-shell-root");
      root.dataset.page = "map";
      root.dataset.currentPage = "map";
      root.dataset.shellReady = "fallback";
      root.dataset.shellVersion = VERSION;

      injectFallbackShellStyles();
      root.insertAdjacentHTML("afterbegin", fallbackShellMarkup());
      bindChromeRoots();

      window.dispatchEvent(new CustomEvent("fieldops:map-shell-fallback-mounted", {
        detail: { version: VERSION }
      }));
    }, 450);
  }

  function injectLegacyShellArchiveStyles() {
    if (document.getElementById("fieldops-map-legacy-shell-archive-style")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "fieldops-map-legacy-shell-archive-style";
    style.textContent = `
      .top-bar,
      .side-menu,
      .menu-overlay,
      .side-rail,
      .rail-tools-menu,
      .top-filter-menu,
      .top-region-tree,
      .site-search-results {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
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

    if (openPanel(byId("filterPanel"))) {
      return;
    }

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

  function bindFallbackShellActions() {
    document.addEventListener("click", function (event) {
      const target = event.target;

      if (!isElement(target)) {
        return;
      }

      if (target.closest("[data-fallback-search]")) {
        event.preventDefault();
        event.stopPropagation();

        const input = byId("siteSearchInput");

        if (input) {
          input.focus();
        }

        return;
      }

      if (target.closest("[data-fallback-menu]")) {
        event.preventDefault();
        event.stopPropagation();
        openMapSettings();
      }
    }, true);
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
    document.documentElement.dataset.mapLegacyShell = "archived";

    injectLegacyShellArchiveStyles();
    ensureSharedShellAssets();
    injectFallbackShellIfNeeded();
    bindFallbackShellActions();
    bindChromeRoots();
    observeChromeRoots();
    bindSharedShellBridge();
    bindMapSearchBridge();
    publishWorkOnlineState();

    window.dispatchEvent(new CustomEvent("fieldops:map-shell-guard-ready", {
      detail: {
        version: VERSION,
        sharedShellVersion: SHARED_SHELL_VERSION
      }
    }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
