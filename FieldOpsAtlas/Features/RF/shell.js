/* =========================================================
   RF ATLAS SHELL v0.1.54
   Shared shell builder, page links, active states, burger,
   search panel, and collapsible quick row.
========================================================= */

const bootRfAtlasShell = () => {
  const pageLinks = {
    map: "../Map/index.html",
    sites: "../../../sites.html",
    rf: "index.html",
    network: "../../../network.html",
    docs: "../../../equipment.html",
    tools: "../../../tools.html",
    dtt: "../../../dtt.html",
    dab: "../../../dab.html",
    fm: "../../../fm.html",
    more: "../../../services.html",
    services: "../../../services.html",
    equipment: "../../../equipment.html",
    paths: "../../../paths.html",
    settings: "../../../settings.html"
  };

  const searchItems = [
    ["RF Overview", "Live RF control dashboard", pageLinks.rf],
    ["Map", "Network map and regions", pageLinks.map],
    ["Sites", "Site directory and status", pageLinks.sites],
    ["Network", "Topology and link overview", pageLinks.network],
    ["Docs", "Walkthroughs, equipment, and manuals", pageLinks.docs],
    ["Tools", "Calculators and field utilities", pageLinks.tools],
    ["DTT", "Digital terrestrial television services", pageLinks.dtt],
    ["DAB", "Digital audio broadcasting services", pageLinks.dab],
    ["FM", "FM radio services", pageLinks.fm],
    ["Equipment", "Transmitters, antennas, receivers", pageLinks.equipment],
    ["Paths", "RF paths and link analysis", pageLinks.paths],
    ["Settings", "Preferences and app setup", pageLinks.settings],
    ["Winter Hill", "TX site - DTT / DAB / FM", pageLinks.sites],
    ["Crystal Palace", "TX site - London", pageLinks.sites],
    ["Swansea Main", "TX site - Wales", pageLinks.sites]
  ];

  const icons = {
    menu: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
      </svg>
    `,

    transmitter: `
      <svg class="atlas-transmitter" viewBox="0 0 48 48" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M24 19v24M17 43l7-24 7 24M15 31h18M19 22h10" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="24" cy="15" r="4" stroke-width="2.6" />
        <path d="M14 16a12 12 0 0 1 0-12M34 4a12 12 0 0 1 0 12M8 20a20 20 0 0 1 0-20M40 0a20 20 0 0 1 0 20" stroke-width="2.6" stroke-linecap="round" />
      </svg>
    `,

    dtt: `
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="16" cy="8.5" r="2.5" stroke-width="2.1" />
        <path d="M16 11v14M11.5 25l4.5-14 4.5 14M10.5 18.5h11" stroke-width="2.1" />
        <path d="M8.5 10.5a7.5 7.5 0 0 1 0-7M23.5 3.5a7.5 7.5 0 0 1 0 7" stroke-width="1.9" />
        <path d="M5 13a12 12 0 0 1 0-12M27 1a12 12 0 0 1 0 12" stroke-width="1.7" opacity="0.92" />
      </svg>
    `,

    dab: `
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <circle cx="6" cy="16" r="1.4" />
        <circle cx="10" cy="12.5" r="1.4" /><circle cx="10" cy="16" r="1.4" /><circle cx="10" cy="19.5" r="1.4" />
        <circle cx="14" cy="9.5" r="1.4" /><circle cx="14" cy="13" r="1.4" /><circle cx="14" cy="16.5" r="1.4" /><circle cx="14" cy="20" r="1.4" /><circle cx="14" cy="23.5" r="1.4" />
        <circle cx="18" cy="7" r="1.4" /><circle cx="18" cy="10.5" r="1.4" /><circle cx="18" cy="14" r="1.4" /><circle cx="18" cy="17.5" r="1.4" /><circle cx="18" cy="21" r="1.4" /><circle cx="18" cy="24.5" r="1.4" />
        <circle cx="22" cy="10" r="1.4" /><circle cx="22" cy="13.5" r="1.4" /><circle cx="22" cy="17" r="1.4" /><circle cx="22" cy="20.5" r="1.4" />
        <circle cx="26" cy="13.5" r="1.4" /><circle cx="26" cy="17" r="1.4" /><circle cx="26" cy="20.5" r="1.4" />
      </svg>
    `,

    fm: `
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="16" cy="16" r="4.3" fill="currentColor" stroke="none" opacity="0.95" />
        <circle cx="16" cy="16" r="8.6" stroke-width="1.8" opacity="0.92" />
        <circle cx="16" cy="16" r="12" stroke-width="1.5" opacity="0.72" />
        <path d="M3.5 16h7M21.5 16h7" stroke-width="1.9" opacity="0.96" />
      </svg>
    `,

    more: `
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <circle cx="9" cy="16" r="2.5" /><circle cx="16" cy="16" r="2.5" /><circle cx="23" cy="16" r="2.5" />
      </svg>
    `,

    map: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M3 6.5 9 4l6 2.5 6-2.5v13.5L15 20l-6-2.5L3 20V6.5Z" stroke-linejoin="round" />
        <path d="M9 4v13.5M15 6.5V20" />
      </svg>
    `,

    sites: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M4 11.5 12 5l8 6.5V20H6v-8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10 20v-6h4v6" stroke-linejoin="round" />
      </svg>
    `,

    rf: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M12 10v11M8 21l4-11 4 11M8.5 16h7" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="12" cy="7" r="2.25" />
        <path d="M6.5 8a6 6 0 0 1 0-6M17.5 2a6 6 0 0 1 0 6M3.5 10a10 10 0 0 1 0-10M20.5 0a10 10 0 0 1 0 10" stroke-linecap="round" />
      </svg>
    `,

    network: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="9" y="3" width="6" height="5" rx="1.1" />
        <rect x="4" y="16" width="5" height="5" rx="1.1" />
        <rect x="15" y="16" width="5" height="5" rx="1.1" />
        <path d="M12 8v4M6.5 16v-4h11v4" />
      </svg>
    `,

    docs: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M6 4.5h8.5L18 8v11.5H6z" stroke-linejoin="round" />
        <path d="M14.5 4.5V8H18M8.5 11h7M8.5 14h7M8.5 17h4.5" stroke-linecap="round" />
      </svg>
    `,


    tools: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 6.4a5 5 0 0 1-6.3 6.2L8.1 19.2a2.6 2.6 0 0 1-3.7-3.7l6.6-6.6A5 5 0 0 1 17.2 2.6l-3 3 2.2 2.2 3-3c.6.4 1.1.9 1.6 1.6Z" />
        <path d="M6.1 17.4h.1" />
      </svg>
    `
  };

  const quickLink = (key, label, active) => `
    <a class="quick-chip is-${key === "more" ? "more" : key}${active === key ? " is-current" : ""}" href="${pageLinks[key]}" aria-label="${label}">
      ${icons[key]}<span>${label}</span>
    </a>
  `;

  const buildHeader = (servicePage) => `
    <header class="top-shell">
      <section class="command-row" aria-label="App header">
        <button class="menu-button" type="button" aria-label="Open menu">${icons.menu}</button>
        <button class="atlas-command" type="button" aria-label="Open search">
          <span class="search-symbol" aria-hidden="true"></span>
          <span class="command-search-text">Search</span>
          <span class="command-divider" aria-hidden="true"></span>
          <span class="atlas-identity" aria-label="ATLAS">
            ${icons.transmitter}
            <span class="atlas-mini-word">ATLAS</span>
          </span>
        </button>
      </section>
      <nav class="quick-access" aria-label="Quick access">
        ${quickLink("dtt", "DTT", servicePage)}
        ${quickLink("dab", "DAB", servicePage)}
        ${quickLink("fm", "FM", servicePage)}
        ${quickLink("more", "More", servicePage)}
      </nav>
      <button class="quick-toggle" type="button" aria-label="Collapse service buttons" aria-expanded="true"></button>
    </header>
  `;

  const buildFooter = (activePage) => {
    const items = [
      ["map", "Map"],
      ["rf", "RF"],
      ["network", "Net"],
      ["docs", "Docs"],
      ["tools", "Tool"]
    ];

    const activeIndex = Math.max(0, items.findIndex(([key]) => key === activePage));

    const itemMarkup = items.map(([key, label], index) => {
      const classes = ["nav-item"];
      if (key === activePage) classes.push("is-active");
      if (index === activeIndex - 1) classes.push("is-group-end");
      if (index === activeIndex + 1) classes.push("is-group-start");

      return `
        <a class="${classes.join(" ")}" href="${pageLinks[key]}" aria-label="${label}" ${key === activePage ? 'aria-current="page"' : ""}>
          ${icons[key]}
          <span>${label}</span>
        </a>
      `;
    }).join("");

    return `
      <footer class="bottom-shell">
        <nav class="bottom-nav" aria-label="Primary navigation">${itemMarkup}</nav>
      </footer>
    `;
  };

  const menuLink = (title, sub, href) => `
    <a class="shell-link" href="${href}">
      <span>${title}<small>${sub}</small></span>
    </a>
  `;

  const buildBackdrop = () => `<button class="shell-backdrop" type="button" aria-label="Close shell panel"></button>`;

  const buildSearchPanel = () => `
    <section class="shell-popover is-search" aria-label="Search panel">
      <div class="shell-panel">
        <div class="shell-panel-head">
          <h2 class="shell-panel-title">Search Atlas</h2>
          <button class="shell-close" type="button" data-close-shell aria-label="Close search">x</button>
        </div>
        <input class="shell-search-input" type="search" placeholder="Find site, page, service..." />
        <div class="shell-list shell-search-results"></div>
        <p class="shell-empty">No matches found.</p>
      </div>
    </section>
  `;

  const buildMenuPanel = () => `
    <section class="shell-popover is-menu" aria-label="Menu panel">
      <div class="shell-panel">
        <div class="shell-panel-head">
          <h2 class="shell-panel-title">Atlas menu</h2>
          <button class="shell-close" type="button" data-close-shell aria-label="Close menu">x</button>
        </div>
        <div class="shell-list">
          ${menuLink("Map", "Full network map view", pageLinks.map)}
          ${menuLink("Sites", "Browse site records", pageLinks.sites)}
          ${menuLink("RF", "RF overview dashboard", pageLinks.rf)}
          ${menuLink("Network", "Topology and links", pageLinks.network)}
          ${menuLink("Tools", "Field utilities", pageLinks.tools)}
          ${menuLink("Equipment", "Inventory and kit status", pageLinks.equipment)}
          ${menuLink("Paths", "RF path analysis", pageLinks.paths)}
          ${menuLink("Settings", "Prototype settings", pageLinks.settings)}
        </div>

        <div class="shell-menu-footer">
          <div class="shell-menu-version">
            <span>RF Atlas</span>
            <strong>v0.1.54</strong>
          </div>

          <label class="github-key-label" for="githubKeyInput">GitHub key</label>
          <div class="github-key-row">
            <input id="githubKeyInput" class="github-key-input" type="password" placeholder="Stored on this device" autocomplete="off" />
            <button class="github-key-button" type="button" data-save-github-key>Save</button>
            <button class="github-key-button is-clear" type="button" data-clear-github-key>Clear</button>
          </div>
          <p class="github-key-note">
            <span class="github-key-state" data-github-key-state>Not saved</span>.
            Stored locally for online/offline use. Do not put real keys in public files.
          </p>
        </div>
      </div>
    </section>
  `;

  const app = document.querySelector(".phone");
  if (!app) return;

  const page = app.dataset.page || "rf";
  const servicePage = app.dataset.service || (["dtt", "dab", "fm", "more"].includes(page) ? page : "");
  const navPage = app.dataset.nav || (["map", "sites", "rf", "network", "tools"].includes(page) ? page : "rf");

  app.dataset.version = "0.1.37";

  const content = app.querySelector(".content-canvas");
  if (!content) return;

  const hasRealContent = content.querySelector(".page-content") || content.textContent.trim().length > 0;
  if (!hasRealContent) {
    content.innerHTML = `
      <article class="page-content">
        <header class="page-head">
          <div class="page-kicker">Prototype</div>
          <h1 class="page-title">Content area</h1>
          <p class="page-lede">This page is connected to the shared shell. Add page content inside the content canvas.</p>
        </header>
      </article>
    `;
  }

  app.insertAdjacentHTML("afterbegin", buildHeader(servicePage));
  app.insertAdjacentHTML("beforeend", buildFooter(navPage));
  app.insertAdjacentHTML("beforeend", buildBackdrop() + buildSearchPanel() + buildMenuPanel());

  const toggle = app.querySelector(".quick-toggle");
  const setCollapsed = (collapsed) => {
    app.classList.toggle("quick-collapsed", collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", collapsed ? "Expand service buttons" : "Collapse service buttons");
  };

  setCollapsed(app.dataset.quick === "collapsed");
  toggle.addEventListener("click", () => setCollapsed(!app.classList.contains("quick-collapsed")));

  const menuButton = app.querySelector(".menu-button");
  const commandButton = app.querySelector(".atlas-command");
  const backdrop = app.querySelector(".shell-backdrop");
  const searchInput = app.querySelector(".shell-search-input");
  const results = app.querySelector(".shell-search-results");
  const empty = app.querySelector(".shell-empty");

  const closePanels = () => app.classList.remove("menu-open", "search-open");

  const renderResults = (query) => {
    if (!results || !empty) return;

    const needle = query.trim().toLowerCase();
    const matches = searchItems.filter(([title, sub]) => {
      return !needle || `${title} ${sub}`.toLowerCase().includes(needle);
    });

    results.innerHTML = matches.map(([title, sub, href]) => `
      <a class="shell-link" href="${href}">
        <span>${title}<small>${sub}</small></span>
      </a>
    `).join("");

    empty.style.display = matches.length ? "none" : "block";
  };

  menuButton.addEventListener("click", () => {
    app.classList.remove("search-open");
    app.classList.add("menu-open");
  });

  commandButton.addEventListener("click", () => {
    app.classList.remove("menu-open");
    app.classList.add("search-open");
    renderResults("");
    requestAnimationFrame(() => searchInput.focus());
  });

  backdrop.addEventListener("click", closePanels);

  app.querySelectorAll("[data-close-shell]").forEach((button) => {
    button.addEventListener("click", closePanels);
  });

  searchInput.addEventListener("input", () => renderResults(searchInput.value));

  const keyInput = app.querySelector("#githubKeyInput");
  const keyState = app.querySelector("[data-github-key-state]");
  const saveKey = app.querySelector("[data-save-github-key]");
  const clearKey = app.querySelector("[data-clear-github-key]");
  const tokenKey = "rfAtlas.githubToken";

  const refreshKeyState = () => {
    const saved = Boolean(localStorage.getItem(tokenKey));
    const onlineText = navigator.onLine ? "Online" : "Offline";
    if (keyState) keyState.textContent = saved ? `Saved locally - ${onlineText}` : `Not saved - ${onlineText}`;
    if (keyInput) keyInput.value = saved ? "Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢Ã¢ÂÂ¢" : "";
  };

  if (saveKey && keyInput) {
    saveKey.addEventListener("click", () => {
      const value = keyInput.value.trim();
      if (value && !value.includes("Ã¢ÂÂ¢")) localStorage.setItem(tokenKey, value);
      refreshKeyState();
    });
  }

  if (clearKey) {
    clearKey.addEventListener("click", () => {
      localStorage.removeItem(tokenKey);
      refreshKeyState();
    });
  }

  window.addEventListener("online", refreshKeyState);
  window.addEventListener("offline", refreshKeyState);
  refreshKeyState();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootRfAtlasShell, { once: true });
} else {
  bootRfAtlasShell();
}
