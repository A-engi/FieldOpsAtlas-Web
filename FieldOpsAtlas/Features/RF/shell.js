/*
  FieldOps Atlas RF shell
  Version: 1.1.1

  Purpose:
  - Build the shared RF prototype header, quick-service row, footer nav,
    search panel, burger menu, and local prototype controls.
  - Keep the existing shell.css class contract stable before CSS cleanup.

  Conversion note:
  - This file is intentionally organised into small sections so it can map
    cleanly later to SwiftUI navigation state, search state, and settings state.
*/

(() => {
  "use strict";

  // =========================================================
  // 01. Constants
  // =========================================================

  const VERSION = "1.1.1";
  const TOKEN_KEY = "rfAtlas.githubToken";
  const ICON_BASE = "../../../data/icons/";

  const PAGE_LINKS = {
    map: "../Map/index.html",
    sites: "../RF/sites.html",
    rf: "../RF/index.html",
    network: "../Network/index.html",
    docs: "../Docs/index.html",
    tools: "../Tools/index.html",
    dtt: "../RF/dtt.html",
    dab: "../RF/dab.html",
    fm: "../RF/fm.html",
    more: "../RF/services.html",
    services: "../RF/services.html",
    equipment: "../RF/equipment.html",
    paths: "../RF/paths.html",
    settings: "../RF/settings.html"
  };

  const QUICK_ITEMS = [
    { key: "dtt", label: "DTT", href: PAGE_LINKS.dtt, className: "is-dtt" },
    { key: "dab", label: "DAB", href: PAGE_LINKS.dab, className: "is-dab" },
    { key: "fm", label: "FM", href: PAGE_LINKS.fm, className: "is-fm" },
    { key: "more", label: "More", href: PAGE_LINKS.more, className: "is-more" }
  ];

  const FOOTER_ITEMS = [
    { key: "map", label: "Map", href: PAGE_LINKS.map },
    { key: "rf", label: "RF", href: PAGE_LINKS.rf },
    { key: "network", label: "Net", href: PAGE_LINKS.network },
    { key: "docs", label: "Docs", href: PAGE_LINKS.docs },
    { key: "tools", label: "Tool", href: PAGE_LINKS.tools }
  ];

  const SEARCH_ITEMS = [
    ["RF Overview", "Live RF control dashboard", PAGE_LINKS.rf],
    ["Map", "Network map and regions", PAGE_LINKS.map],
    ["Sites", "Site directory and status", PAGE_LINKS.sites],
    ["Network", "Topology and link overview", PAGE_LINKS.network],
    ["Docs", "Walkthroughs, equipment, and manuals", PAGE_LINKS.docs],
    ["Tools", "Calculators and field utilities", PAGE_LINKS.tools],
    ["DTT", "Digital terrestrial television services", PAGE_LINKS.dtt],
    ["DAB", "Digital audio broadcasting services", PAGE_LINKS.dab],
    ["FM", "FM radio services", PAGE_LINKS.fm],
    ["Equipment", "Transmitters, antennas, receivers", PAGE_LINKS.equipment],
    ["Paths", "RF paths and link analysis", PAGE_LINKS.paths],
    ["Settings", "Preferences and app setup", PAGE_LINKS.settings],
    ["Winter Hill", "TX site - DTT / DAB / FM", PAGE_LINKS.sites],
    ["Crystal Palace", "TX site - London", PAGE_LINKS.sites],
    ["Swansea Main", "TX site - Wales", PAGE_LINKS.sites]
  ];

  const ICONS = {
    menu: icon("hamburger.svg", "shell-icon menu-icon"),
    transmitter: icon("atlas-transmitter-gold.svg", "shell-icon atlas-transmitter"),
    dtt: icon("dtt.svg", "shell-icon quick-icon"),
    dab: icon("dab.svg", "shell-icon quick-icon"),
    fm: icon("fm.svg", "shell-icon quick-icon"),
    more: icon("more.svg", "shell-icon quick-icon"),
    map: icon("map.svg", "shell-icon nav-icon"),
    sites: icon("sites.svg", "shell-icon nav-icon"),
    rf: icon("rf.svg", "shell-icon nav-icon"),
    network: icon("network.svg", "shell-icon nav-icon"),
    docs: icon("docs.svg", "shell-icon nav-icon"),
    tools: icon("tools.svg", "shell-icon nav-icon")
  };

  // =========================================================
  // 02. Small helpers
  // =========================================================

  function icon(fileName, className = "shell-icon") {
    return `<img src="${ICON_BASE}${fileName}" class="${className}" alt="" aria-hidden="true" loading="lazy" decoding="async" />`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (match) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[match]));
  }

  function setButtonState(button, disabled) {
    if (button) {
      button.disabled = disabled;
      button.setAttribute("aria-disabled", String(disabled));
    }
  }

  function currentServicePage(page, explicitService) {
    if (explicitService) {
      return explicitService;
    }

    return ["dtt", "dab", "fm", "more", "services"].includes(page) ? page : "";
  }

  function currentNavPage(page, explicitNav) {
    if (explicitNav) {
      return explicitNav;
    }

    if (["map", "sites", "rf", "network", "tools"].includes(page)) {
      return page;
    }

    return "rf";
  }

  // =========================================================
  // 03. Shell markup
  // =========================================================

  function quickLink(item, activeKey) {
    const classes = ["quick-chip", item.className];

    if (item.key === activeKey || (item.key === "more" && activeKey === "services")) {
      classes.push("is-current");
    }

    return `
      <a class="${classes.join(" ")}" href="${item.href}">
        ${ICONS[item.key]}
        <span>${escapeHtml(item.label)}</span>
      </a>
    `;
  }

  function buildHeader(activeService) {
    return `
      <header class="top-shell" aria-label="RF Atlas header">
        <div class="command-row">
          <button class="menu-button" type="button" aria-label="Open Atlas menu">
            ${ICONS.menu}
          </button>

          <button class="atlas-command" type="button" aria-label="Search Atlas">
            <span class="search-symbol" aria-hidden="true"></span>
            <span class="command-search-text">Search</span>
            <span class="command-divider" aria-hidden="true"></span>
            <span class="atlas-identity">
              ${ICONS.transmitter}
              <span class="atlas-mini-word">ATLAS</span>
            </span>
          </button>
        </div>

        <nav class="quick-access" aria-label="RF service shortcuts">
          ${QUICK_ITEMS.map((item) => quickLink(item, activeService)).join("")}
        </nav>

        <button
          class="quick-toggle"
          type="button"
          aria-expanded="true"
          aria-label="Collapse service buttons"
        ></button>
      </header>
    `;
  }

  function buildFooter(activePage) {
    const activeIndex = Math.max(0, FOOTER_ITEMS.findIndex((item) => item.key === activePage));

    const items = FOOTER_ITEMS.map((item, index) => {
      const classes = ["nav-item"];

      if (item.key === activePage) {
        classes.push("is-active");
      }

      if (index === activeIndex - 1) {
        classes.push("is-group-end");
      }

      if (index === activeIndex + 1) {
        classes.push("is-group-start");
      }

      return `
        <a class="${classes.join(" ")}" href="${item.href}"${item.key === activePage ? ' aria-current="page"' : ""}>
          ${ICONS[item.key]}
          <span>${escapeHtml(item.label)}</span>
        </a>
      `;
    }).join("");

    return `
      <footer class="bottom-shell" aria-label="Primary navigation">
        <nav class="bottom-nav">
          ${items}
        </nav>
      </footer>
    `;
  }

  function menuLink(title, sub, href) {
    return `
      <a class="shell-link" href="${href}">
        <span>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(sub)}</small>
        </span>
      </a>
    `;
  }

  function buildBackdrop() {
    return `<button class="shell-backdrop" type="button" aria-label="Close menu"></button>`;
  }

  function buildSearchPanel() {
    return `
      <section class="shell-popover is-search" aria-label="Search Atlas panel">
        <div class="shell-panel">
          <header class="shell-panel-head">
            <h2 class="shell-panel-title">Search Atlas</h2>
            <button class="shell-close" type="button" data-close-shell aria-label="Close search">x</button>
          </header>

          <input
            class="shell-search-input"
            type="search"
            autocomplete="off"
            placeholder="Search pages and sites"
            aria-label="Search pages and sites"
          />

          <div class="shell-search-results shell-list"></div>
          <p class="shell-empty">No matches found.</p>
        </div>
      </section>
    `;
  }

  function buildMenuPanel() {
    return `
      <section class="shell-popover is-menu" aria-label="Atlas menu panel">
        <div class="shell-panel">
          <header class="shell-panel-head">
            <h2 class="shell-panel-title">Atlas menu</h2>
            <button class="shell-close" type="button" data-close-shell aria-label="Close menu">x</button>
          </header>

          <div class="shell-list">
            ${menuLink("Map", "Full network map view", PAGE_LINKS.map)}
            ${menuLink("Sites", "Browse site records", PAGE_LINKS.sites)}
            ${menuLink("RF", "RF overview dashboard", PAGE_LINKS.rf)}
            ${menuLink("Network", "Topology and links", PAGE_LINKS.network)}
            ${menuLink("Tools", "Field utilities", PAGE_LINKS.tools)}
            ${menuLink("Equipment", "Inventory and kit status", PAGE_LINKS.equipment)}
            ${menuLink("Paths", "RF path analysis", PAGE_LINKS.paths)}
            ${menuLink("Settings", "Prototype settings", PAGE_LINKS.settings)}
          </div>

          <footer class="shell-menu-footer">
            <div class="shell-menu-version">
              <span>RF Atlas</span>
              <strong>v${VERSION}</strong>
            </div>

            <label class="github-key-label" for="githubKeyInput">GitHub key</label>

            <div class="github-key-row">
              <input
                class="github-key-input"
                id="githubKeyInput"
                type="password"
                autocomplete="off"
                spellcheck="false"
                placeholder="Optional local key"
              />
              <button class="github-key-button" type="button" data-save-github-key>Save</button>
              <button class="github-key-button is-clear" type="button" data-clear-github-key>Clear</button>
            </div>

            <p class="github-key-note">
              <span class="github-key-state" data-github-key-state>Not saved.</span>
              Stored locally for online/offline use. Do not put real keys in public files.
            </p>
          </footer>
        </div>
      </section>
    `;
  }

  function buildBlankContent() {
    return `
      <article class="blank-canvas" aria-label="Prototype placeholder">
        <h1>Prototype</h1>
        <p>This page is connected to the shared shell. Add page content inside the content canvas.</p>
      </article>
    `;
  }

  // =========================================================
  // 04. Search panel behaviour
  // =========================================================

  function renderSearchResults(query, results, empty) {
    if (!results || !empty) {
      return;
    }

    const needle = query.trim().toLowerCase();
    const matches = SEARCH_ITEMS.filter(([title, sub]) => {
      return !needle || `${title} ${sub}`.toLowerCase().includes(needle);
    });

    results.innerHTML = matches.map(([title, sub, href]) => menuLink(title, sub, href)).join("");
    empty.style.display = matches.length ? "none" : "block";
  }

  function bindPanels(app) {
    const menuButton = app.querySelector(".menu-button");
    const commandButton = app.querySelector(".atlas-command");
    const backdrop = app.querySelector(".shell-backdrop");
    const searchInput = app.querySelector(".shell-search-input");
    const results = app.querySelector(".shell-search-results");
    const empty = app.querySelector(".shell-empty");

    const closePanels = () => app.classList.remove("menu-open", "search-open");

    if (menuButton) {
      menuButton.addEventListener("click", () => {
        app.classList.remove("search-open");
        app.classList.add("menu-open");
      });
    }

    if (commandButton) {
      commandButton.addEventListener("click", () => {
        app.classList.remove("menu-open");
        app.classList.add("search-open");
        renderSearchResults("", results, empty);

        if (searchInput) {
          requestAnimationFrame(() => searchInput.focus());
        }
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", closePanels);
    }

    app.querySelectorAll("[data-close-shell]").forEach((button) => {
      button.addEventListener("click", closePanels);
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        renderSearchResults(searchInput.value, results, empty);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePanels();
      }
    });
  }

  // =========================================================
  // 05. Quick row collapse
  // =========================================================

  function bindQuickToggle(app) {
    const toggle = app.querySelector(".quick-toggle");

    if (!toggle) {
      return;
    }

    const setCollapsed = (collapsed) => {
      app.classList.toggle("quick-collapsed", collapsed);
      toggle.setAttribute("aria-expanded", String(!collapsed));
      toggle.setAttribute("aria-label", collapsed ? "Expand service buttons" : "Collapse service buttons");
    };

    setCollapsed(app.dataset.quick === "collapsed");
    toggle.addEventListener("click", () => setCollapsed(!app.classList.contains("quick-collapsed")));
  }

  // =========================================================
  // 06. Local GitHub key control
  // =========================================================

  function bindGithubKeyControls(app) {
    const keyInput = app.querySelector("#githubKeyInput");
    const keyState = app.querySelector("[data-github-key-state]");
    const saveKey = app.querySelector("[data-save-github-key]");
    const clearKey = app.querySelector("[data-clear-github-key]");

    if (!keyInput || !keyState) {
      return;
    }

    const refreshKeyState = () => {
      let saved = false;

      try {
        saved = Boolean(localStorage.getItem(TOKEN_KEY));
      } catch {
        saved = false;
      }

      const onlineText = navigator.onLine ? "Online" : "Offline";
      keyState.textContent = saved ? `Saved locally - ${onlineText}` : `Not saved - ${onlineText}`;
      keyInput.value = saved ? "â¢â¢â¢â¢â¢â¢â¢â¢â¢â¢â¢â¢" : "";
      setButtonState(clearKey, !saved);
    };

    if (saveKey) {
      saveKey.addEventListener("click", () => {
        const value = keyInput.value.trim();

        if (value && !value.includes("â¢")) {
          try {
            localStorage.setItem(TOKEN_KEY, value);
          } catch {
            // Private browsing or restricted storage can block localStorage.
          }
        }

        refreshKeyState();
      });
    }

    if (clearKey) {
      clearKey.addEventListener("click", () => {
        try {
          localStorage.removeItem(TOKEN_KEY);
        } catch {
          // Private browsing or restricted storage can block localStorage.
        }

        refreshKeyState();
      });
    }

    window.addEventListener("online", refreshKeyState);
    window.addEventListener("offline", refreshKeyState);
    refreshKeyState();
  }

  // =========================================================
  // 07. Service worker
  // =========================================================

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("../../../sw.js").catch(() => {
      // Service worker registration should never block the prototype shell.
    });
  }

  // =========================================================
  // 08. Boot
  // =========================================================

  function bootRfAtlasShell() {
    const app = document.querySelector(".phone");

    if (!app || app.dataset.shellReady === "true") {
      return;
    }

    const page = app.dataset.page || "rf";
    const servicePage = currentServicePage(page, app.dataset.service);
    const navPage = currentNavPage(page, app.dataset.nav);
    const content = app.querySelector(".content-canvas");

    if (!content) {
      return;
    }

    app.dataset.version = VERSION;
    app.dataset.shellReady = "true";

    const hasRealContent =
      Boolean(content.querySelector(".page-content")) ||
      content.textContent.trim().length > 0;

    if (!hasRealContent) {
      content.innerHTML = buildBlankContent();
    }

    app.insertAdjacentHTML("afterbegin", buildHeader(servicePage));
    app.insertAdjacentHTML("beforeend", buildFooter(navPage));
    app.insertAdjacentHTML("beforeend", buildBackdrop() + buildSearchPanel() + buildMenuPanel());

    bindQuickToggle(app);
    bindPanels(app);
    bindGithubKeyControls(app);
    registerServiceWorker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootRfAtlasShell, { once: true });
  } else {
    bootRfAtlasShell();
  }
})();
