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

  const iconBase = "../../../data/icons/";

  const icon = (fileName, className = "shell-icon") => `
    <img class="${className}" src="${iconBase}${fileName}" alt="" aria-hidden="true" loading="eager">
  `;

  const icons = {
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

  app.dataset.version = "1.1.1";

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
    navigator.serviceWorker.register("../../../sw.js").catch(() => {});
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootRfAtlasShell, { once: true });
} else {
  bootRfAtlasShell();
}
