/* ==========================================================================
   FieldOps Atlas shared shell
   Root file: shell.js
   Version: 1.1.1-shell-v1.3

   Purpose:
   - Inject shared shell chrome into a .phone root.
   - Keep page state, burger drawer, collapsible Pages, filter panel, and bottom nav in one place.
   ========================================================================== */

(function () {
  "use strict";

  const VERSION = "1.1.1-shell-v1.3";

  const pages = {
    map: {
      label: "Map",
      navLabel: "Map",
      icon: "icon--map",
      href: "FieldOpsAtlas/Features/Map/index.html"
    },
    rf: {
      label: "RF",
      navLabel: "RF",
      icon: "icon--rf",
      href: "FieldOpsAtlas/Features/RF/index.html"
    },
    network: {
      label: "Network",
      navLabel: "Net",
      icon: "icon--network",
      href: "FieldOpsAtlas/Features/Network/index.html"
    },
    docs: {
      label: "Docs",
      navLabel: "Docs",
      icon: "icon--docs",
      href: "FieldOpsAtlas/Features/Docs/index.html"
    },
    tools: {
      label: "Tools",
      navLabel: "Tool",
      icon: "icon--tools",
      href: "FieldOpsAtlas/Features/Tools/index.html"
    }
  };

  const pageOrder = ["map", "rf", "network", "docs", "tools"];

  function getScriptRoot() {
    const scripts = Array.prototype.slice.call(document.querySelectorAll("script[src]"));
    const shellScript = scripts.reverse().find(function (script) {
      return /(^|\/)shell\.js(\?|$)/.test(script.getAttribute("src") || "");
    });

    if (!shellScript) {
      return new URL("./", window.location.href).href;
    }

    return new URL("./", shellScript.src).href;
  }

  const rootPath = getScriptRoot();

  function asset(path) {
    return new URL(path, rootPath).href;
  }

  function samePath(url) {
    return new URL(url, window.location.href).pathname === window.location.pathname;
  }

  function iconSpan(iconClass, extraClass) {
    const classes = ["repo-icon", iconClass];

    if (extraClass) {
      classes.push(extraClass);
    }

    return `<span class="${classes.join(" ")}" aria-hidden="true"></span>`;
  }

  function chevron() {
    return '<span class="chevron-mark"></span>';
  }

  function pageHref(pageKey) {
    const page = pages[pageKey] || pages.rf;
    return asset(page.href);
  }

  function pageOptionMarkup(pageKey) {
    const page = pages[pageKey];

    return `
        <a class="button-surface drawer-row drawer-page-option" href="${pageHref(pageKey)}" hidden data-page-button data-page="${pageKey}">
          ${iconSpan(page.icon)}
          <span class="drawer-row__label">${page.label}</span>
          <span class="drawer-row__chevron" aria-hidden="true">${chevron()}</span>
        </a>`;
  }

  function navButtonMarkup(pageKey) {
    const page = pages[pageKey];

    return `
        <a class="button-surface nav-button" href="${pageHref(pageKey)}" data-page-button data-nav-button data-page="${pageKey}">
          ${iconSpan(page.icon)}
          <span>${page.navLabel}</span>
        </a>`;
  }

  function shellMarkup(activePage) {
    const active = pages[activePage] ? activePage : "rf";

    return `
    <header class="top-shell" aria-label="Map controls">
      <button class="button-surface icon-button" type="button" aria-label="Open menu" aria-expanded="false" data-menu-open>
        ${iconSpan("icon--menu")}
      </button>

      <button class="button-surface search-button" type="button" aria-label="Search">
        <span class="search-lead">
          ${iconSpan("icon--search", "search-icon")}
          <span class="search-query">Find...</span>
        </span>

        <span class="search-brand" aria-hidden="true">
          <span class="search-divider"></span>
          <span class="atlas-logo">
            ${iconSpan("icon--atlas")}
            <span class="atlas-word">ATLAS</span>
          </span>
        </span>
      </button>

      <button class="button-surface icon-button" type="button" aria-label="Open filter menu" aria-expanded="false" data-filter-open-button>
        ${iconSpan("icon--filter")}
      </button>
    </header>

    <div class="map-dim" aria-hidden="true"></div>

    <aside class="filter-panel" aria-label="Filter menu">
      <header class="filter-panel__head">
        <h2 class="filter-panel__title">Filter</h2>
        <button class="button-surface filter-panel__close" type="button" aria-label="Close filter menu" data-filter-close>
          <span class="css-close" aria-hidden="true"></span>
        </button>
      </header>

      <button class="button-surface filter-option" type="button" data-filter-region>
        <span class="filter-option__copy">
          <span class="filter-option__label">Region</span>
          <span class="filter-option__meta">All regions</span>
        </span>
        <span class="filter-option__chevron" aria-hidden="true">${chevron()}</span>
      </button>
    </aside>

    <aside class="drawer" aria-label="Main navigation menu">
      <header class="drawer-header">
        <div class="brand-mark" aria-hidden="true">
          <img class="brand-logo" src="${asset("data/icons/logo-atlas.svg")}" alt="">
        </div>

        <div class="brand-copy">
          <h1 class="brand-title"><span class="brand-title__fieldops">FieldOps</span><span class="atlas-word">ATLAS</span></h1>
          <p class="brand-subtitle">UK Network Toolkit</p>
        </div>

        <button class="button-surface drawer-close" type="button" aria-label="Close menu" data-menu-close>
          <span class="css-close" aria-hidden="true"></span>
        </button>
      </header>

      <section class="section-card" aria-label="Page selector">
        <div class="section-toggle">
          <p class="section-label">Pages</p>
          <button class="section-toggle__button" type="button" aria-expanded="false" data-pages-toggle>
            <span class="section-toggle__text">All</span>
            <span class="section-toggle__chevron" aria-hidden="true">${chevron()}</span>
          </button>
        </div>

        <nav class="drawer-pages" aria-label="Pages">
          <a class="button-surface current-page-card" href="${pageHref(active)}" aria-current="page" data-current-page-card>
            ${iconSpan(pages[active].icon)}
            <span class="current-page-card__copy">
              <span class="current-page-card__eyebrow">Current page</span>
              <span class="current-page-card__title" data-current-page-title>${pages[active].label}</span>
            </span>
            <span class="current-page-card__chevron" aria-hidden="true">${chevron()}</span>
          </a>
          ${pageOrder.map(pageOptionMarkup).join("")}
        </nav>
      </section>

      <div class="drawer-spacer" aria-hidden="true"></div>

      <p class="section-label">User</p>

      <div class="account-menu" aria-label="User menu">
        <button class="button-surface account-button" type="button" aria-label="Open profile placeholder">
          ${iconSpan("icon--profile")}
        </button>

        <button class="button-surface account-button" type="button" aria-label="Open settings">
          ${iconSpan("icon--settings")}
        </button>
      </div>

      <button class="button-surface online-row" type="button" aria-pressed="false">
        <span class="checkbox" aria-hidden="true"></span>
        <span>Work online</span>
      </button>

      <div class="button-surface version-row">
        ${iconSpan("icon--info")}
        <span>FieldOps Atlas v1.1.1</span>
      </div>
    </aside>

    <footer class="bottom-shell">
      <nav class="bottom-nav" aria-label="Primary navigation">
        ${pageOrder.map(navButtonMarkup).join("")}
      </nav>
    </footer>`;
  }

  function bootFieldOpsShell() {
    const shell = document.querySelector(".phone");

    if (!shell || shell.dataset.shellReady === "true") {
      return;
    }

    let activePage = shell.dataset.currentPage || shell.dataset.page || "rf";

    if (!pages[activePage]) {
      activePage = "rf";
    }

    shell.dataset.shellReady = "true";
    shell.dataset.drawerOpen = "false";
    shell.dataset.pagesExpanded = "false";
    shell.dataset.filterOpen = "false";
    shell.dataset.currentPage = activePage;

    shell.insertAdjacentHTML("afterbegin", shellMarkup(activePage));

    const menuButton = shell.querySelector("[data-menu-open]");
    const closeButton = shell.querySelector("[data-menu-close]");
    const filterButton = shell.querySelector("[data-filter-open-button]");
    const filterClose = shell.querySelector("[data-filter-close]");
    const pagesButton = shell.querySelector("[data-pages-toggle]");
    const pagesButtonText = pagesButton ? pagesButton.querySelector(".section-toggle__text") : null;
    const pageOptions = Array.prototype.slice.call(shell.querySelectorAll(".drawer-page-option"));
    const pageButtons = Array.prototype.slice.call(shell.querySelectorAll("[data-page-button]"));
    const navButtons = Array.prototype.slice.call(shell.querySelectorAll("[data-nav-button]"));
    const currentPageCard = shell.querySelector("[data-current-page-card]");
    const currentPageIcon = currentPageCard ? currentPageCard.querySelector(".repo-icon") : null;
    const currentPageTitle = shell.querySelector("[data-current-page-title]");

    function setDrawerOpen(isOpen) {
      shell.setAttribute("data-drawer-open", isOpen ? "true" : "false");

      if (menuButton) {
        menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      if (isOpen) {
        setFilterOpen(false);
      }
    }

    function setFilterOpen(isOpen) {
      shell.setAttribute("data-filter-open", isOpen ? "true" : "false");

      if (filterButton) {
        filterButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      if (isOpen) {
        setDrawerOpen(false);
      }
    }

    function setPagesExpanded(isExpanded) {
      shell.setAttribute("data-pages-expanded", isExpanded ? "true" : "false");

      if (pagesButton) {
        pagesButton.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      }

      if (pagesButtonText) {
        pagesButtonText.textContent = isExpanded ? "Hide" : "All";
      }

      updatePageOptionVisibility();
    }

    function updateCurrentPagePill() {
      const page = pages[activePage] || pages.rf;

      if (currentPageTitle) {
        currentPageTitle.textContent = page.label;
      }

      if (currentPageIcon) {
        currentPageIcon.className = "repo-icon " + page.icon;
        currentPageIcon.setAttribute("aria-hidden", "true");
      }

      if (currentPageCard) {
        currentPageCard.setAttribute("href", pageHref(activePage));
      }
    }

    function updateBottomNav() {
      const activeIndex = Math.max(0, navButtons.findIndex(function (button) {
        return button.getAttribute("data-page") === activePage;
      }));

      navButtons.forEach(function (button, index) {
        const isActive = button.getAttribute("data-page") === activePage;

        button.classList.toggle("is-active", isActive);
        button.classList.toggle("is-group-end", index === activeIndex - 1);
        button.classList.toggle("is-group-start", index === activeIndex + 1);

        if (isActive) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      });
    }

    function updatePageOptionVisibility() {
      const expanded = shell.getAttribute("data-pages-expanded") === "true";

      pageOptions.forEach(function (row) {
        const isCurrent = row.getAttribute("data-page") === activePage;
        row.hidden = !expanded || isCurrent;
        row.classList.toggle("is-active", isCurrent);
      });
    }

    function setActivePage(pageName) {
      if (!pages[pageName]) {
        return;
      }

      activePage = pageName;
      shell.setAttribute("data-current-page", pageName);
      updateCurrentPagePill();
      updateBottomNav();
      updatePageOptionVisibility();
    }

    if (menuButton) {
      menuButton.addEventListener("click", function () {
        setDrawerOpen(shell.getAttribute("data-drawer-open") !== "true");
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        setDrawerOpen(false);
      });
    }

    if (filterButton) {
      filterButton.addEventListener("click", function () {
        setFilterOpen(shell.getAttribute("data-filter-open") !== "true");
      });
    }

    if (filterClose) {
      filterClose.addEventListener("click", function () {
        setFilterOpen(false);
      });
    }

    if (pagesButton) {
      pagesButton.addEventListener("click", function () {
        setPagesExpanded(shell.getAttribute("data-pages-expanded") !== "true");
      });
    }

    pageButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        const pageName = button.getAttribute("data-page");

        setActivePage(pageName);

        if (samePath(button.href)) {
          event.preventDefault();
          setDrawerOpen(false);
          setFilterOpen(false);
        }
      });
    });

    setDrawerOpen(false);
    setFilterOpen(false);
    setPagesExpanded(false);
    setActivePage(activePage);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootFieldOpsShell, { once: true });
  } else {
    bootFieldOpsShell();
  }
})();
