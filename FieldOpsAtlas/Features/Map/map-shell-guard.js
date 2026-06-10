/* ============================================================================
   FieldOps Atlas map shell guard
   Root file: FieldOpsAtlas/Features/Map/map-shell-guard.js
   Version: 1.1.1-map-shell-guard-v10-fallback-restore-v1

   Purpose:
   - Restore the map-only fallback top and bottom shell when the shared root shell
     has not mounted into the Map page.
   - Keep old map chrome archived and inert without hiding the restored shell.
   - Bridge shared/fallback shell actions to map-owned UI/state.
   - Do not load shell assets, edit map data, edit region JSON, markers, Leaflet
     state, or root shell files.

   Swift conversion note:
   - Shell recovery stays isolated here.
   - Map-owned state remains in map-app.js / map UI.
   - Cross-area actions use browser events.
   ============================================================================ */

(function () {
  "use strict";

  const VERSION = "1.1.1-map-shell-guard-v10-fallback-restore-v1";
  const WORK_ONLINE_KEY = "fieldops-atlas-work-online";
  const MAP_SEARCH_PROVIDER_ID = "map-visible-walks";

  const LEGACY_CHROME_SELECTORS = [
    ".top-bar",
    ".side-menu",
    ".menu-overlay",
    ".side-rail",
    ".top-filter-menu",
    ".top-region-tree",
    ".site-search-results"
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

  function byId(id) {
    return document.getElementById(id);
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function shellRoot() {
    return qs(".app-shell") || qs(".phone") || document.body;
  }

  function mapBridge() {
    return window.FieldOpsAtlasBridge || null;
  }

  function safe(label, callback) {
    try {
      return callback();
    } catch (error) {
      if (window.console && typeof window.console.warn === "function") {
        window.console.warn("FieldOps map shell guard skipped: " + label, error);
      }
      return null;
    }
  }

  function assetUrl(path) {
    return new URL(path, window.location.href).href;
  }

  function iconMarkup(iconClass) {
    return '<span class="repo-icon ' + iconClass + '" aria-hidden="true"></span>';
  }

  function pageHref(page) {
    return assetUrl("../../../" + page.href);
  }

  function navMarkup() {
    return fallbackPages.map(function (page) {
      const isActive = page.key === "map";
      const activeClass = isActive ? " is-active" : "";
      const ariaCurrent = isActive ? ' aria-current="page"' : "";
      const action = isActive ? ' data-fallback-map-nav' : "";
      return [
        '<a class="button-surface nav-button' + activeClass + '"',
        ' href="' + pageHref(page) + '"',
        ' data-page="' + page.key + '"',
        action,
        ariaCurrent,
        '>',
        iconMarkup(page.icon),
        '<span>' + page.navLabel + '</span>',
        '</a>'
      ].join("");
    }).join("");
  }

  function fallbackShellMarkup() {
    return [
      '<header class="top-shell" aria-label="Map controls" data-map-shell-fallback data-build="' + VERSION + '">',
      '  <button class="button-surface icon-button" type="button" aria-label="Open menu" aria-expanded="false" data-fallback-menu>',
      iconMarkup("icon--menu"),
      '  </button>',
      '  <button class="button-surface search-button" type="button" aria-label="Open search" data-fallback-search>',
      '    <span class="search-lead">',
      iconMarkup("icon--search"),
      '      <span class="search-query">Find walk</span>',
      '    </span>',
      '    <span class="search-brand" aria-hidden="true">',
      '      <span class="search-divider"></span>',
      '      <span class="atlas-logo">',
      iconMarkup("icon--atlas"),
      '        <span class="atlas-word">ATLAS</span>',
      '      </span>',
      '    </span>',
      '  </button>',
      '  <button class="button-surface icon-button" type="button" aria-label="Open filter menu" data-fallback-filter>',
      iconMarkup("icon--filter"),
      '  </button>',
      '</header>',
      '<footer class="bottom-shell" data-map-shell-fallback data-build="' + VERSION + '">',
      '  <nav class="bottom-nav" aria-label="Primary navigation">',
      navMarkup(),
      '  </nav>',
      '</footer>'
    ].join("");
  }

  function injectFallbackShellStyles() {
    if (byId("fieldops-map-fallback-shell-style")) return;

    const style = document.createElement("style");
    style.id = "fieldops-map-fallback-shell-style";
    style.textContent = `
      .fieldops-shell-root {
        --safe-top: env(safe-area-inset-top, 0px);
        --safe-bottom: env(safe-area-inset-bottom, 0px);
        --shell-side: 12px;
        --shell-surface: #0d2947;
        --text: rgba(255, 255, 255, 0.92);
        --text-muted: rgba(226, 241, 255, 0.66);
        --gold: #ffe3ad;
        --gold-border: rgba(255, 207, 119, 0.78);
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
        --search-cluster-gap: 12px;
        --nav-height: 38px;
        --nav-design-width: 68px;
        --nav-pad-y: calc(var(--nav-height) * 0.17);
        --nav-usable-y: calc(var(--nav-height) - (var(--nav-pad-y) * 2));
        --nav-text-height: calc(var(--nav-usable-y) / 3.1);
        --nav-icon-size: calc(var(--nav-text-height) * 2);
        --nav-gap: calc(var(--nav-text-height) * 0.10);
        --bottom-lift: 8px;
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

      .fieldops-shell-root .repo-icon {
        display: block;
        background-color: currentColor;
        -webkit-mask: var(--icon-src) center / contain no-repeat;
        mask: var(--icon-src) center / contain no-repeat;
      }

      .fieldops-shell-root .button-surface {
        color: var(--text);
        border: 1px solid var(--button-border);
        border-radius: var(--inner-radius);
        background:
          linear-gradient(180deg, var(--button-top), var(--button-bottom));
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.10),
          0 0 0 1px rgba(96, 235, 255, 0.10),
          0 0 18px rgba(96, 235, 255, 0.20),
          0 8px 20px rgba(0, 0, 0, 0.18);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
      }

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
        isolation: isolate;
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
        min-width: 0;
        display: inline-flex;
        align-items: center;
      }

      .fieldops-shell-root .search-lead {
        gap: 10px;
      }

      .fieldops-shell-root .search-query {
        overflow: hidden;
        color: rgba(244, 250, 255, 0.86);
        font-size: 15px;
        font-weight: 750;
        line-height: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fieldops-shell-root .search-lead .repo-icon {
        width: var(--search-icon-size);
        height: var(--search-icon-size);
        flex: 0 0 auto;
      }

      .fieldops-shell-root .search-divider {
        width: 1px;
        height: 22px;
        margin: 0 9px 0 0;
        flex: 0 0 auto;
        background: rgba(255, 255, 255, 0.22);
      }

      .fieldops-shell-root .atlas-logo {
        gap: 6px;
        color: var(--gold);
      }

      .fieldops-shell-root .atlas-logo .repo-icon {
        width: 19px;
        height: 19px;
      }

      .fieldops-shell-root .atlas-word {
        color: #fffdf7;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.022em;
        line-height: 1;
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
        background:
          radial-gradient(circle at 50% 0%, rgba(255, 224, 154, 0.12), transparent 36%),
          linear-gradient(180deg, #15395e, #102c4c);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.12),
          0 -3px 10px rgba(4, 10, 18, 0.14);
        line-height: 1;
        text-decoration: none;
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
        z-index: 2;
        color: #fffdf7;
        border-color: var(--gold-border);
        background:
          radial-gradient(circle at 50% 0%, rgba(255, 232, 173, 0.42), transparent 45%),
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

      .fieldops-shell-root .nav-button span:not(.repo-icon) {
        grid-row: 4;
        max-width: 100%;
        overflow: hidden;
        font-size: var(--nav-text-height);
        font-weight: 700;
        line-height: var(--nav-text-height);
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function injectLegacyArchiveStyle() {
    if (byId("fieldops-map-legacy-shell-archive-style")) return;

    const style = document.createElement("style");
    style.id = "fieldops-map-legacy-shell-archive-style";
    style.textContent = LEGACY_CHROME_SELECTORS + " { display: none !important; }";
    document.head.appendChild(style);
  }

  function hasMountedSharedShell() {
    const root = shellRoot();
    return Boolean(
      qs(".top-shell:not([data-map-shell-fallback])", root) &&
      qs(".bottom-shell:not([data-map-shell-fallback])", root) &&
      root.dataset.shellReady === "true"
    );
  }

  function fallbackShellExists() {
    return Boolean(qs("[data-map-shell-fallback]"));
  }

  function ensureFallbackShell() {
    const root = shellRoot();

    if (hasMountedSharedShell()) {
      removeFallbackShell();
      return;
    }

    if (fallbackShellExists()) {
      return;
    }

    root.classList.add("fieldops-shell-root");
    root.dataset.page = "map";
    root.dataset.currentPage = "map";
    root.dataset.shellFallbackReady = "true";
    root.dataset.shellFallbackVersion = VERSION;

    injectFallbackShellStyles();
    root.insertAdjacentHTML("afterbegin", fallbackShellMarkup());

    window.dispatchEvent(new CustomEvent("fieldops:map-shell-fallback-mounted", {
      detail: {
        version: VERSION,
        page: "map"
      }
    }));
  }

  function removeFallbackShell() {
    document.querySelectorAll("[data-map-shell-fallback]").forEach(function (element) {
      element.remove();
    });

    const fallbackStyle = byId("fieldops-map-fallback-shell-style");
    if (fallbackStyle) {
      fallbackStyle.remove();
    }
  }

  function setExpanded(element, isExpanded) {
    if (element) {
      element.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }
  }

  function openHiddenMenu(menu) {
    if (!menu) return false;
    menu.hidden = false;
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    return true;
  }

  function closeHiddenMenu(menu) {
    if (!menu) return;
    menu.hidden = true;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
  }

  function openPanel(panel) {
    if (!panel) return false;
    panel.hidden = false;
    panel.classList.remove("is-hidden");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    return true;
  }

  function closeMapTools() {
    closeHiddenMenu(byId("railToolsMenu"));
    setExpanded(byId("railToolsButton"), false);
    setExpanded(byId("railMapButton"), false);
    shellRoot().dataset.mapToolsOpen = "false";
  }

  function setMapToolsOpen(isOpen) {
    const nextState = Boolean(isOpen);
    const menu = byId("railToolsMenu");

    if (!menu) {
      shellRoot().dataset.mapToolsOpen = "false";
      return false;
    }

    if (nextState) {
      openHiddenMenu(menu);
    } else {
      closeHiddenMenu(menu);
    }

    setExpanded(byId("railToolsButton"), nextState);
    setExpanded(byId("railMapButton"), nextState);
    shellRoot().dataset.mapToolsOpen = nextState ? "true" : "false";
    return true;
  }

  function toggleMapTools() {
    const root = shellRoot();
    setMapToolsOpen(root.dataset.mapToolsOpen !== "true");
  }

  function closeOldFloatingMenus() {
    closeHiddenMenu(byId("topFilterMenu"));
    closeHiddenMenu(byId("topRegionTree"));
    closeMapTools();
    setExpanded(byId("fitMapBtn"), false);
    setExpanded(byId("topSelectRegionButton"), false);
  }

  function openOldTopRegionFilter() {
    const openedFilter = openHiddenMenu(byId("topFilterMenu"));
    const openedTree = openHiddenMenu(byId("topRegionTree"));
    setExpanded(byId("fitMapBtn"), openedFilter);
    setExpanded(byId("topSelectRegionButton"), openedTree);
    return openedFilter || openedTree;
  }

  function openMapRegionFilter() {
    closeMapTools();

    if (openPanel(byId("filterPanel"))) {
      return;
    }

    openOldTopRegionFilter();
  }

  function openMapSettings() {
    closeOldFloatingMenus();

    if (openPanel(byId("settingsPanel"))) {
      return;
    }

    const legacyButton = byId("menuSettingsButton");
    if (legacyButton) {
      legacyButton.click();
    }
  }

  function visibleWalks() {
    const bridge = mapBridge();

    if (!bridge || typeof bridge.getVisibleWalks !== "function") {
      return [];
    }

    const walks = bridge.getVisibleWalks();
    return Array.isArray(walks) ? walks : [];
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
            walk.regionName,
            walk.gridRef,
            walk.grid,
            walk.what3words,
            walk.w3w,
            walk.notes,
            walk.siteType,
            walk.type
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

  function currentWorkOnlineState() {
    const toggle = byId("workOnlineToggle") || byId("writeToggle");

    if (toggle) {
      return Boolean(toggle.checked);
    }

    return localStorage.getItem(WORK_ONLINE_KEY) === "true";
  }

  function publishWorkOnlineState() {
    window.dispatchEvent(new CustomEvent("fieldops:shell-work-online-state", {
      detail: {
        page: "map",
        online: currentWorkOnlineState(),
        version: VERSION
      }
    }));
  }

  function setMapWorkOnline(isOnline) {
    const nextState = Boolean(isOnline);
    const toggles = [byId("workOnlineToggle"), byId("writeToggle")].filter(Boolean);

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

  function bindSharedShellBridge() {
    window.addEventListener("fieldops:shell-map-tools-toggle", function (event) {
      const detail = event.detail || {};
      if (detail.page !== "map") return;
      setMapToolsOpen(Boolean(detail.open));
    });

    window.addEventListener("fieldops:shell-filter-region", function (event) {
      const detail = event.detail || {};
      if (detail.page && detail.page !== "map") return;
      openMapRegionFilter();
    });

    window.addEventListener("fieldops:open-region-filter", openMapRegionFilter);
    window.addEventListener("fieldops:shell-search-select", handleShellSearchSelect);

    window.addEventListener("fieldops:shell-settings", function (event) {
      const detail = event.detail || {};
      if (detail.page && detail.page !== "map") return;
      openMapSettings();
    });

    window.addEventListener("fieldops:shell-work-online-toggle", function (event) {
      const detail = event.detail || {};
      if (detail.page !== "map") return;
      setMapWorkOnline(Boolean(detail.online));
    });

    window.addEventListener("fieldops-atlas-ready", scheduleMapSearchProviderRefresh);
    window.addEventListener("fieldops-atlas-walks-changed", scheduleMapSearchProviderRefresh);
    window.addEventListener("fieldops-atlas-regions-changed", scheduleMapSearchProviderRefresh);
    window.addEventListener("fieldops:map-shell-guard-refresh-search", scheduleMapSearchProviderRefresh);

    window.addEventListener("fieldops:shell-ready", function (event) {
      const detail = event.detail || {};
      if (detail.page === "map") {
        removeFallbackShell();
        scheduleMapSearchProviderRefresh();
        publishWorkOnlineState();
      }
    });

    window.addEventListener("storage", function (event) {
      if (event.key === WORK_ONLINE_KEY) {
        publishWorkOnlineState();
      }
    });
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

      if (target.closest("[data-fallback-filter]")) {
        event.preventDefault();
        event.stopPropagation();
        openMapRegionFilter();
        return;
      }

      if (target.closest("[data-fallback-menu]")) {
        event.preventDefault();
        event.stopPropagation();
        openMapSettings();
        return;
      }

      if (target.closest("[data-fallback-map-nav]")) {
        event.preventDefault();
        event.stopPropagation();
        toggleMapTools();
        return;
      }

      const shellClicked = target.closest(".top-shell, .bottom-shell, .drawer, .fieldops-shell-panel");
      const toolsClicked = target.closest("#railToolsMenu");

      if (!shellClicked && !toolsClicked) {
        closeMapTools();
      }
    }, true);
  }

  function boot() {
    const root = shellRoot();

    root.dataset.page = "map";
    root.dataset.currentPage = "map";
    document.documentElement.dataset.mapShellGuard = VERSION;

    injectLegacyArchiveStyle();
    bindSharedShellBridge();
    bindFallbackShellActions();

    ensureFallbackShell();
    window.setTimeout(ensureFallbackShell, 300);
    window.setTimeout(ensureFallbackShell, 1000);

    scheduleMapSearchProviderRefresh();
    window.setTimeout(registerMapSearchProvider, 250);
    window.setTimeout(registerMapSearchProvider, 900);
    window.setTimeout(registerMapSearchProvider, 1800);

    publishWorkOnlineState();

    window.dispatchEvent(new CustomEvent("fieldops:map-shell-guard-ready", {
      detail: {
        version: VERSION,
        mode: "fallback-restore"
      }
    }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      safe("boot", boot);
    }, { once: true });
  } else {
    safe("boot", boot);
  }
})();
