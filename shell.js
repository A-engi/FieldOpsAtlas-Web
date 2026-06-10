/* ==========================================================================
   FieldOps Atlas shared shell
   Root file: shell.js
   Version: 1.1.1-shell-v2.0

   Purpose:
   - Inject shared shell chrome into a .phone root.
   - Keep page state, burger drawer, collapsible Pages, filter panel,
     page search, and bottom nav in one place.
   ========================================================================== */

(function () {
  "use strict";

  const VERSION = "1.1.1-shell-v2.0";
  const DEFAULT_PAGE = "rf";
  const MAX_SEARCH_RESULTS = 12;

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
  const searchProviders = Object.create(null);

  function normalisePageKey(pageKey) {
    return pages[pageKey] ? pageKey : DEFAULT_PAGE;
  }

  function normaliseSearchItem(item) {
    return {
      title: String(item.title || ""),
      subtitle: String(item.subtitle || ""),
      href: item.href ? String(item.href) : "",
      keywords: Array.isArray(item.keywords) ? item.keywords.map(String) : []
    };
  }

  function normaliseSearchProvider(provider) {
    const page = String(provider && provider.page ? provider.page : "").trim();

    if (!page) {
      return null;
    }

    return {
      page,
      label: String(provider.label || (pages[page] && pages[page].label) || page.toUpperCase()),
      placeholder: String(provider.placeholder || `Search ${(pages[page] && pages[page].label) || page}...`),
      emptyText: String(provider.emptyText || "No matches found."),
      items: Array.isArray(provider.items)
        ? provider.items.map(normaliseSearchItem).filter(function (item) {
          return item.title;
        })
        : []
    };
  }

  function refreshSearchUi(page) {
    if (typeof window.FieldOpsSearchRefresh === "function") {
      window.FieldOpsSearchRefresh(page);
    }
  }

  function registerSearchProvider(provider) {
    const normalised = normaliseSearchProvider(provider);

    if (!normalised) {
      return;
    }

    searchProviders[normalised.page] = normalised;
    refreshSearchUi(normalised.page);
  }

  window.FieldOpsSearch = {
    register: registerSearchProvider,
    registerPage: registerSearchProvider,
    providers: searchProviders
  };

  (window.FieldOpsSearchQueue || []).forEach(registerSearchProvider);

  window.FieldOpsSearchQueue = {
    push(provider) {
      registerSearchProvider(provider);
      return Object.keys(searchProviders).length;
    }
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[character];
    });
  }

  function getScriptRoot() {
    const scripts = Array.from(document.querySelectorAll("script[src]"));
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
    return asset(pages[normalisePageKey(pageKey)].href);
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
    const active = normalisePageKey(activePage);
    const page = pages[active];

    return `
    <header class="top-shell" aria-label="App controls">
      <button class="button-surface icon-button" type="button" aria-label="Open menu" aria-expanded="false" data-menu-open>
        ${iconSpan("icon--menu")}
      </button>

      <button class="button-surface search-button" type="button" aria-label="Open search" aria-expanded="false" data-search-open>
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

    <button class="map-dim" type="button" aria-label="Close menu" data-menu-backdrop></button>

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

    <aside class="search-panel" aria-label="Page search" data-search-panel>
      <header class="search-panel__head">
        <div class="search-panel__copy">
          <h2 class="search-panel__title" data-search-title>Search</h2>
          <p class="search-panel__hint" data-search-hint>Search this page.</p>
        </div>

        <button class="button-surface search-panel__close" type="button" aria-label="Close search" data-search-close>
          <span class="css-close" aria-hidden="true"></span>
        </button>
      </header>

      <label class="search-field">
        <span class="repo-icon icon--search" aria-hidden="true"></span>
        <input class="search-field__input" type="search" autocomplete="off" spellcheck="false" data-search-input>
      </label>

      <div class="search-results" data-search-results></div>
      <p class="search-empty" data-search-empty>No matches found.</p>
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
            ${iconSpan(page.icon)}
            <span class="current-page-card__copy">
              <span class="current-page-card__eyebrow">Current page</span>
              <span class="current-page-card__title" data-current-page-title>${page.label}</span>
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
        <span>FieldOps Atlas v2.0</span>
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

    let activePage = normalisePageKey(shell.dataset.currentPage || shell.dataset.page);

    shell.dataset.shellReady = "true";
    shell.dataset.shellVersion = VERSION;
    shell.dataset.drawerOpen = "false";
    shell.dataset.pagesExpanded = "false";
    shell.dataset.filterOpen = "false";
    shell.dataset.searchOpen = "false";
    shell.dataset.currentPage = activePage;

    shell.insertAdjacentHTML("afterbegin", shellMarkup(activePage));

    const menuButton = shell.querySelector("[data-menu-open]");
    const backdropButton = shell.querySelector("[data-menu-backdrop]");
    const filterButton = shell.querySelector("[data-filter-open-button]");
    const filterClose = shell.querySelector("[data-filter-close]");
    const searchButton = shell.querySelector("[data-search-open]");
    const searchClose = shell.querySelector("[data-search-close]");
    const searchInput = shell.querySelector("[data-search-input]");
    const searchResults = shell.querySelector("[data-search-results]");
    const searchEmpty = shell.querySelector("[data-search-empty]");
    const searchTitle = shell.querySelector("[data-search-title]");
    const searchHint = shell.querySelector("[data-search-hint]");
    const searchQueryLabel = shell.querySelector(".search-query");
    const pagesButton = shell.querySelector("[data-pages-toggle]");
    const pagesButtonText = pagesButton ? pagesButton.querySelector(".section-toggle__text") : null;
    const pageOptions = Array.from(shell.querySelectorAll(".drawer-page-option"));
    const pageButtons = Array.from(shell.querySelectorAll("[data-page-button]"));
    const navButtons = Array.from(shell.querySelectorAll("[data-nav-button]"));
    const currentPageCard = shell.querySelector("[data-current-page-card]");
    const currentPageIcon = currentPageCard ? currentPageCard.querySelector(".repo-icon") : null;
    const currentPageTitle = shell.querySelector("[data-current-page-title]");

    function setDrawerOpen(isOpen) {
      shell.dataset.drawerOpen = isOpen ? "true" : "false";

      if (menuButton) {
        menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      if (isOpen) {
        setFilterOpen(false);
        setSearchOpen(false);
      }
    }

    function setFilterOpen(isOpen) {
      shell.dataset.filterOpen = isOpen ? "true" : "false";

      if (filterButton) {
        filterButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      if (isOpen) {
        setDrawerOpen(false);
        setSearchOpen(false);
      }
    }

    function currentSearchProvider() {
      return searchProviders[activePage] || null;
    }

    function resultHref(item) {
      if (!item.href) {
        return "#";
      }

      return new URL(item.href, window.location.href).href;
    }

    function renderSearchResults(query) {
      if (!searchResults || !searchEmpty) {
        return;
      }

      const provider = currentSearchProvider();

      if (!provider) {
        searchResults.innerHTML = "";
        searchEmpty.textContent = "Search is not available on this page yet.";
        searchEmpty.hidden = false;
        return;
      }

      const needle = String(query || "").trim().toLowerCase();
      const matches = provider.items.filter(function (item) {
        const haystack = [item.title, item.subtitle].concat(item.keywords).join(" ").toLowerCase();
        return !needle || haystack.includes(needle);
      }).slice(0, MAX_SEARCH_RESULTS);

      searchResults.innerHTML = matches.map(function (item) {
        return `
          <a class="button-surface search-result" href="${escapeHtml(resultHref(item))}">
            <span class="search-result__title">${escapeHtml(item.title)}</span>
            <span class="search-result__subtitle">${escapeHtml(item.subtitle)}</span>
          </a>`;
      }).join("");

      searchEmpty.textContent = provider.emptyText;
      searchEmpty.hidden = matches.length > 0;
    }

    function updateSearchUi() {
      const provider = currentSearchProvider();
      const page = pages[activePage] || pages[DEFAULT_PAGE];
      const placeholder = provider ? provider.placeholder : `Search ${page.label}...`;
      const title = provider ? `Search ${provider.label}` : `Search ${page.label}`;
      const hint = provider ? "Page-specific results only." : "Search is not available on this page yet.";

      if (searchInput) {
        searchInput.placeholder = placeholder;
      }

      if (searchQueryLabel) {
        searchQueryLabel.textContent = placeholder;
      }

      if (searchTitle) {
        searchTitle.textContent = title;
      }

      if (searchHint) {
        searchHint.textContent = hint;
      }

      renderSearchResults(searchInput ? searchInput.value : "");
    }

    function setSearchOpen(isOpen) {
      shell.dataset.searchOpen = isOpen ? "true" : "false";

      if (searchButton) {
        searchButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      if (isOpen) {
        setDrawerOpen(false);
        setFilterOpen(false);
        updateSearchUi();

        requestAnimationFrame(function () {
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        });
      }
    }

    function setPagesExpanded(isExpanded) {
      shell.dataset.pagesExpanded = isExpanded ? "true" : "false";

      if (pagesButton) {
        pagesButton.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      }

      if (pagesButtonText) {
        pagesButtonText.textContent = isExpanded ? "Hide" : "All";
      }

      updatePageOptionVisibility();
    }

    function updateCurrentPagePill() {
      const page = pages[activePage] || pages[DEFAULT_PAGE];

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
        return button.dataset.page === activePage;
      }));

      navButtons.forEach(function (button, index) {
        const isActive = button.dataset.page === activePage;

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
      const expanded = shell.dataset.pagesExpanded === "true";

      pageOptions.forEach(function (row) {
        row.hidden = !expanded || row.dataset.page === activePage;
      });
    }

    function setActivePage(pageName) {
      if (!pages[pageName]) {
        return;
      }

      activePage = pageName;
      shell.dataset.currentPage = pageName;

      updateCurrentPagePill();
      updateBottomNav();
      updatePageOptionVisibility();
      updateSearchUi();
    }

    if (menuButton) {
      menuButton.addEventListener("click", function () {
        setDrawerOpen(shell.dataset.drawerOpen !== "true");
      });
    }

    if (backdropButton) {
      backdropButton.addEventListener("click", function () {
        setDrawerOpen(false);
      });
    }

    if (filterButton) {
      filterButton.addEventListener("click", function () {
        setFilterOpen(shell.dataset.filterOpen !== "true");
      });
    }

    if (filterClose) {
      filterClose.addEventListener("click", function () {
        setFilterOpen(false);
      });
    }

    if (searchButton) {
      searchButton.addEventListener("click", function () {
        setSearchOpen(shell.dataset.searchOpen !== "true");
      });
    }

    if (searchClose) {
      searchClose.addEventListener("click", function () {
        setSearchOpen(false);
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderSearchResults(searchInput.value);
      });

      searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          setSearchOpen(false);
        }
      });
    }

    document.addEventListener("pointerdown", function (event) {
      if (shell.dataset.searchOpen !== "true") {
        return;
      }

      if (event.target.closest(".search-panel, .search-button")) {
        return;
      }

      setSearchOpen(false);
    }, true);

    if (pagesButton) {
      pagesButton.addEventListener("click", function () {
        setPagesExpanded(shell.dataset.pagesExpanded !== "true");
      });
    }

    pageButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        const pageName = button.dataset.page;

        if (samePath(button.href)) {
          event.preventDefault();
          setActivePage(pageName);
          setDrawerOpen(false);
          setFilterOpen(false);
        }

        /*
          Let real navigation happen without changing this page's active rail first.
          Safari can restore that mutated DOM from bfcache when pressing Back.
        */
      });
    });

    window.FieldOpsSearchRefresh = function (page) {
      if (page === activePage) {
        updateSearchUi();
      }
    };

    setDrawerOpen(false);
    setFilterOpen(false);
    setSearchOpen(false);
    setPagesExpanded(false);
    setActivePage(activePage);

    window.addEventListener("pageshow", function () {
      const resetPage = normalisePageKey(shell.dataset.page || shell.dataset.currentPage || activePage);

      setActivePage(resetPage);
      setDrawerOpen(false);
      setFilterOpen(false);
      setSearchOpen(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootFieldOpsShell, { once: true });
  } else {
    bootFieldOpsShell();
  }
})();
