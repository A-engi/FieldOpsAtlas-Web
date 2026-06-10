/* ============================================================================
   FieldOps Atlas shared shell
   Root file: shell.js
   Version: 1.1.1-shell-v2.4-map-visible-build

   Purpose:
   - Inject shared shell chrome into a .phone root.
   - Keep page state, burger drawer, collapsible Pages, filter panel,
     page search, and bottom nav in one place.
   - Keep logic grouped so the shell can later map cleanly to Swift views,
     state, and controller actions.
   ============================================================================ */

(function () {
  "use strict";

  /* ========================================================================
     Configuration
     ======================================================================== */

  const VERSION = "1.1.1-shell-v2.4-map-visible-build";
  const SHELL_ROOT_SELECTOR = ".phone, .app-shell";
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

  /* ========================================================================
     Search provider registry
     ======================================================================== */

  function normaliseSearchItem(item) {
    const title = String(item.title || "");

    return {
      id: String(item.id || item.href || title),
      title,
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

  function notifySearchProviderChanged(page) {
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
    notifySearchProviderChanged(normalised.page);
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

  /* ========================================================================
     Utilities
     ======================================================================== */

  function normalisePageKey(pageKey) {
    return pages[pageKey] ? pageKey : DEFAULT_PAGE;
  }

  function inferPageFromLocation() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("/features/map/")) return "map";
    if (path.includes("/features/rf/")) return "rf";
    if (path.includes("/features/network/")) return "network";
    if (path.includes("/features/docs/")) return "docs";
    if (path.includes("/features/tools/")) return "tools";

    return DEFAULT_PAGE;
  }

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

  function isSamePagePath(url) {
    return new URL(url, window.location.href).pathname === window.location.pathname;
  }

  /* ========================================================================
     Markup helpers
     ======================================================================== */

  function iconMarkup(iconClass, extraClass) {
    const classes = ["repo-icon", iconClass];

    if (extraClass) {
      classes.push(extraClass);
    }

    return `<span class="${classes.join(" ")}" aria-hidden="true"></span>`;
  }

  function chevronMarkup() {
    return '<span class="chevron-mark"></span>';
  }

  function pageHref(pageKey) {
    return asset(pages[normalisePageKey(pageKey)].href);
  }

  function pageOptionMarkup(pageKey) {
    const page = pages[pageKey];

    return `
        <a class="button-surface drawer-row drawer-page-option" href="${pageHref(pageKey)}" hidden data-page-button data-page="${pageKey}">
          ${iconMarkup(page.icon)}
          <span class="drawer-row__label">${page.label}</span>
          <span class="drawer-row__chevron" aria-hidden="true">${chevronMarkup()}</span>
        </a>`;
  }

  function navButtonMarkup(pageKey) {
    const page = pages[pageKey];

    return `
        <a class="button-surface nav-button" href="${pageHref(pageKey)}" data-page-button data-nav-button data-page="${pageKey}">
          ${iconMarkup(page.icon)}
          <span>${page.navLabel}</span>
        </a>`;
  }

  function shellMarkup(activePage) {
    const active = normalisePageKey(activePage);
    const page = pages[active];

    return `
    <header class="top-shell" aria-label="App controls">
      <button class="button-surface icon-button" type="button" aria-label="Open menu" aria-expanded="false" data-menu-open>
        ${iconMarkup("icon--menu")}
      </button>

      <button class="button-surface search-button" type="button" aria-label="Open search" aria-expanded="false" data-search-open>
        <span class="search-lead">
          ${iconMarkup("icon--search", "search-icon")}
          <span class="search-query">Find...</span>
        </span>

        <span class="search-brand" aria-hidden="true">
          <span class="search-divider"></span>
          <span class="atlas-logo">
            ${iconMarkup("icon--atlas")}
            <span class="atlas-word">ATLAS</span>
          </span>
        </span>
      </button>

      <button class="button-surface icon-button" type="button" aria-label="Open filter menu" aria-expanded="false" data-filter-open-button>
        ${iconMarkup("icon--filter")}
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
        <span class="filter-option__chevron" aria-hidden="true">${chevronMarkup()}</span>
      </button>
    </aside>

    <aside class="search-panel" aria-label="Page search">
      <header class="search-panel__copy">
        <h2 class="search-panel__title" data-search-title>Search</h2>
        <p class="search-panel__hint" data-search-hint>Search this page.</p>
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

      <section aria-label="Page selector">
        <div class="section-toggle">
          <p class="section-label">Pages</p>
          <button class="section-toggle__button" type="button" aria-expanded="false" data-pages-toggle>
            <span class="section-toggle__text">All</span>
            <span class="section-toggle__chevron" aria-hidden="true">${chevronMarkup()}</span>
          </button>
        </div>

        <nav class="drawer-pages" aria-label="Pages">
          <button class="button-surface current-page-card" type="button" aria-current="page" aria-expanded="false" data-current-page-card>
            ${iconMarkup(page.icon)}
            <span class="current-page-card__copy">
              <span class="current-page-card__eyebrow">Current page</span>
              <span class="current-page-card__title" data-current-page-title>${page.label}</span>
            </span>
            <span class="current-page-card__chevron" aria-hidden="true">${chevronMarkup()}</span>
          </button>
          ${pageOrder.map(pageOptionMarkup).join("")}
        </nav>
      </section>

      <div class="drawer-spacer" aria-hidden="true"></div>

      <p class="section-label">User</p>

      <div class="account-menu" aria-label="User menu">
        <button class="button-surface account-button" type="button" aria-label="Open profile placeholder" data-shell-profile>
          ${iconMarkup("icon--profile")}
        </button>

        <button class="button-surface account-button" type="button" aria-label="Open settings" data-shell-settings>
          ${iconMarkup("icon--settings")}
        </button>
      </div>

      <button class="button-surface online-row" type="button" aria-pressed="false" data-shell-online>
        <span class="checkbox" aria-hidden="true"></span>
        <span>Work online</span>
      </button>

      <div class="button-surface version-row">
        ${iconMarkup("icon--info")}
        <span>FieldOps Atlas v2.4 map shell</span>
      </div>
    </aside>

    <footer class="bottom-shell">
      <nav class="bottom-nav" aria-label="Primary navigation">
        ${pageOrder.map(navButtonMarkup).join("")}
      </nav>
    </footer>`;
  }

  /* ========================================================================
     Shell controller
     ======================================================================== */

  function ShellController(shell) {
    this.shell = shell;
    this.activePage = normalisePageKey(shell.dataset.currentPage || shell.dataset.page);
    this.refs = Object.create(null);
  }

  ShellController.prototype.boot = function () {
    if (!this.shell || this.shell.dataset.shellReady === "true") {
      return;
    }

    this.initialiseDataset();
    this.shell.insertAdjacentHTML("afterbegin", shellMarkup(this.activePage));
    this.cacheRefs();
    this.bindEvents();
    this.exposeSearchRefresh();
    this.resetUiState();
  };

  ShellController.prototype.initialiseDataset = function () {
    this.shell.dataset.shellReady = "true";
    this.shell.dataset.shellVersion = VERSION;
    this.shell.dataset.drawerOpen = "false";
    this.shell.dataset.pagesExpanded = "false";
    this.shell.dataset.filterOpen = "false";
    this.shell.dataset.searchOpen = "false";
    this.shell.dataset.currentPage = this.activePage;
    this.shell.dataset.page = this.activePage;
  };

  ShellController.prototype.cacheRefs = function () {
    this.refs = {
      menuButton: this.shell.querySelector("[data-menu-open]"),
      backdropButton: this.shell.querySelector("[data-menu-backdrop]"),
      filterButton: this.shell.querySelector("[data-filter-open-button]"),
      filterClose: this.shell.querySelector("[data-filter-close]"),
      filterRegionButton: this.shell.querySelector("[data-filter-region]"),
      searchButton: this.shell.querySelector("[data-search-open]"),
      searchPanel: this.shell.querySelector(".search-panel"),
      searchInput: this.shell.querySelector("[data-search-input]"),
      searchResults: this.shell.querySelector("[data-search-results]"),
      searchEmpty: this.shell.querySelector("[data-search-empty]"),
      searchTitle: this.shell.querySelector("[data-search-title]"),
      searchHint: this.shell.querySelector("[data-search-hint]"),
      searchQueryLabel: this.shell.querySelector(".search-query"),
      pagesButton: this.shell.querySelector("[data-pages-toggle]"),
      currentPageCard: this.shell.querySelector("[data-current-page-card]"),
      currentPageTitle: this.shell.querySelector("[data-current-page-title]"),
      profileButton: this.shell.querySelector("[data-shell-profile]"),
      settingsButton: this.shell.querySelector("[data-shell-settings]"),
      onlineButton: this.shell.querySelector("[data-shell-online]"),
      pageOptions: Array.from(this.shell.querySelectorAll(".drawer-page-option")),
      pageButtons: Array.from(this.shell.querySelectorAll("[data-page-button]")),
      navButtons: Array.from(this.shell.querySelectorAll("[data-nav-button]"))
    };

    this.refs.pagesButtonText = this.refs.pagesButton
      ? this.refs.pagesButton.querySelector(".section-toggle__text")
      : null;

    this.refs.currentPageIcon = this.refs.currentPageCard
      ? this.refs.currentPageCard.querySelector(".repo-icon")
      : null;
  };

  ShellController.prototype.bindEvents = function () {
    const controller = this;
    const refs = this.refs;

    if (refs.menuButton) {
      refs.menuButton.addEventListener("click", function () {
        controller.setDrawerOpen(controller.shell.dataset.drawerOpen !== "true");
      });
    }

    if (refs.backdropButton) {
      refs.backdropButton.addEventListener("click", function () {
        controller.setDrawerOpen(false);
      });
    }

    if (refs.filterButton) {
      refs.filterButton.addEventListener("click", function () {
        controller.setFilterOpen(controller.shell.dataset.filterOpen !== "true");
      });
    }

    if (refs.filterClose) {
      refs.filterClose.addEventListener("click", function () {
        controller.setFilterOpen(false);
      });
    }

    if (refs.filterRegionButton) {
      refs.filterRegionButton.addEventListener("click", function () {
        controller.handleRegionFilterClick();
      });
    }

    if (refs.searchButton) {
      refs.searchButton.addEventListener("click", function () {
        controller.setSearchOpen(controller.shell.dataset.searchOpen !== "true");
      });
    }

    if (refs.searchInput) {
      refs.searchInput.addEventListener("input", function () {
        controller.renderSearchResults(refs.searchInput.value);
      });

      refs.searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          controller.setSearchOpen(false);
        }
      });
    }

    if (refs.searchResults) {
      refs.searchResults.addEventListener("click", function (event) {
        controller.handleSearchResultClick(event);
      });
    }

    document.addEventListener("pointerdown", function (event) {
      controller.handleDocumentPointerDown(event);
    }, true);

    if (refs.pagesButton) {
      refs.pagesButton.addEventListener("click", function () {
        controller.togglePagesExpanded();
      });
    }

    if (refs.currentPageCard) {
      refs.currentPageCard.addEventListener("click", function () {
        controller.togglePagesExpanded();
      });
    }

    refs.pageButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        controller.handlePageButtonClick(event, button);
      });
    });

    if (refs.profileButton) {
      refs.profileButton.addEventListener("click", function () {
        controller.handleProfileClick();
      });
    }

    if (refs.settingsButton) {
      refs.settingsButton.addEventListener("click", function () {
        controller.handleSettingsClick();
      });
    }

    if (refs.onlineButton) {
      refs.onlineButton.addEventListener("click", function () {
        controller.handleWorkOnlineClick();
      });
    }

    window.addEventListener("fieldops:shell-work-online-state", function (event) {
      controller.handleWorkOnlineState(event);
    });

    window.addEventListener("pageshow", function () {
      controller.handlePageShow();
    });
  };

  ShellController.prototype.exposeSearchRefresh = function () {
    const controller = this;

    window.FieldOpsSearchRefresh = function (page) {
      if (page === controller.activePage) {
        controller.updateSearchUi();
      }
    };
  };

  ShellController.prototype.resetUiState = function () {
    this.setDrawerOpen(false);
    this.setFilterOpen(false);
    this.setSearchOpen(false);
    this.setPagesExpanded(false);
    this.setActivePage(this.activePage);
  };

  /* ========================================================================
     Shell controller: state setters
     ======================================================================== */

  ShellController.prototype.setDrawerOpen = function (isOpen) {
    this.shell.dataset.drawerOpen = isOpen ? "true" : "false";

    if (this.refs.menuButton) {
      this.refs.menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    if (isOpen) {
      this.setFilterOpen(false);
      this.setSearchOpen(false);
    }
  };

  ShellController.prototype.setFilterOpen = function (isOpen) {
    this.shell.dataset.filterOpen = isOpen ? "true" : "false";

    if (this.refs.filterButton) {
      this.refs.filterButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    if (isOpen) {
      this.setDrawerOpen(false);
      this.setSearchOpen(false);
    }
  };

  ShellController.prototype.setSearchOpen = function (isOpen) {
    const refs = this.refs;

    this.shell.dataset.searchOpen = isOpen ? "true" : "false";

    if (refs.searchButton) {
      refs.searchButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    if (!isOpen) {
      return;
    }

    this.setDrawerOpen(false);
    this.setFilterOpen(false);
    this.updateSearchUi();

    requestAnimationFrame(function () {
      if (refs.searchInput) {
        refs.searchInput.focus();
        refs.searchInput.select();
      }
    });
  };

  ShellController.prototype.setPagesExpanded = function (isExpanded) {
    const expanded = isExpanded ? "true" : "false";

    this.shell.dataset.pagesExpanded = expanded;

    if (this.refs.pagesButton) {
      this.refs.pagesButton.setAttribute("aria-expanded", expanded);
    }

    if (this.refs.currentPageCard) {
      this.refs.currentPageCard.setAttribute("aria-expanded", expanded);
    }

    if (this.refs.pagesButtonText) {
      this.refs.pagesButtonText.textContent = isExpanded ? "Hide" : "All";
    }

    this.updatePageOptionVisibility();
  };

  ShellController.prototype.togglePagesExpanded = function () {
    this.setPagesExpanded(this.shell.dataset.pagesExpanded !== "true");
  };

  ShellController.prototype.setActivePage = function (pageName) {
    if (!pages[pageName]) {
      return;
    }

    this.activePage = pageName;
    this.shell.dataset.currentPage = pageName;
    this.shell.dataset.page = pageName;

    this.updateCurrentPagePill();
    this.updateBottomNav();
    this.updatePageOptionVisibility();
    this.updateSearchUi();
  };

  /* ========================================================================
     Shell controller: rendering
     ======================================================================== */

  ShellController.prototype.updateCurrentPagePill = function () {
    const page = pages[this.activePage] || pages[DEFAULT_PAGE];

    if (this.refs.currentPageTitle) {
      this.refs.currentPageTitle.textContent = page.label;
    }

    if (this.refs.currentPageIcon) {
      this.refs.currentPageIcon.className = "repo-icon " + page.icon;
      this.refs.currentPageIcon.setAttribute("aria-hidden", "true");
    }
  };

  ShellController.prototype.updateBottomNav = function () {
    const activePage = this.activePage;
    const activeIndex = Math.max(0, this.refs.navButtons.findIndex(function (button) {
      return button.dataset.page === activePage;
    }));

    this.refs.navButtons.forEach(function (button, index) {
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
  };

  ShellController.prototype.updatePageOptionVisibility = function () {
    const activePage = this.activePage;
    const expanded = this.shell.dataset.pagesExpanded === "true";

    this.refs.pageOptions.forEach(function (row) {
      row.hidden = !expanded || row.dataset.page === activePage;
    });
  };

  /* ========================================================================
     Shell controller: search
     ======================================================================== */

  ShellController.prototype.currentSearchProvider = function () {
    return searchProviders[this.activePage] || null;
  };

  ShellController.prototype.resultHref = function (item) {
    if (!item.href) {
      return "#";
    }

    return new URL(item.href, window.location.href).href;
  };

  ShellController.prototype.itemMatchesQuery = function (item, query) {
    const needle = String(query || "").trim().toLowerCase();

    if (!needle) {
      return true;
    }

    const haystack = [item.title, item.subtitle].concat(item.keywords).join(" ").toLowerCase();
    return haystack.includes(needle);
  };

  ShellController.prototype.renderSearchResults = function (query) {
    const refs = this.refs;
    const provider = this.currentSearchProvider();

    if (!refs.searchResults || !refs.searchEmpty) {
      return;
    }

    if (!provider) {
      refs.searchResults.innerHTML = "";
      refs.searchEmpty.textContent = "Search is not available on this page yet.";
      refs.searchEmpty.hidden = false;
      return;
    }

    const matches = provider.items.filter(function (item) {
      return this.itemMatchesQuery(item, query);
    }, this).slice(0, MAX_SEARCH_RESULTS);

    refs.searchResults.innerHTML = matches.map(function (item) {
      return `
          <a class="button-surface search-result" href="${escapeHtml(this.resultHref(item))}">
            <span class="search-result__title">${escapeHtml(item.title)}</span>
            <span class="search-result__subtitle">${escapeHtml(item.subtitle)}</span>
          </a>`;
    }, this).join("");

    refs.searchEmpty.textContent = provider.emptyText;
    refs.searchEmpty.hidden = matches.length > 0;
  };

  ShellController.prototype.updateSearchUi = function () {
    const refs = this.refs;
    const provider = this.currentSearchProvider();
    const page = pages[this.activePage] || pages[DEFAULT_PAGE];
    const placeholder = provider ? provider.placeholder : `Search ${page.label}...`;
    const title = provider ? `Search ${provider.label}` : `Search ${page.label}`;
    const hint = provider ? "Page-specific results only." : "Search is not available on this page yet.";

    if (refs.searchInput) {
      refs.searchInput.placeholder = placeholder;
    }

    if (refs.searchQueryLabel) {
      refs.searchQueryLabel.textContent = placeholder;
    }

    if (refs.searchTitle) {
      refs.searchTitle.textContent = title;
    }

    if (refs.searchHint) {
      refs.searchHint.textContent = hint;
    }

    this.renderSearchResults(refs.searchInput ? refs.searchInput.value : "");
  };

  /* ========================================================================
     Shell controller: events
     ======================================================================== */

  ShellController.prototype.handleDocumentPointerDown = function (event) {
    const target = event.target;

    if (this.shell.dataset.searchOpen !== "true" || !(target instanceof Element)) {
      return;
    }

    if (target.closest(".search-panel, .search-button")) {
      return;
    }

    this.setSearchOpen(false);
  };

  ShellController.prototype.dispatchShellEvent = function (name, detail) {
    window.dispatchEvent(new CustomEvent(name, {
      detail: {
        page: this.activePage,
        version: VERSION,
        ...(detail || {})
      }
    }));
  };

  ShellController.prototype.handleRegionFilterClick = function () {
    this.dispatchShellEvent("fieldops:shell-filter-region", { source: "filter-panel" });
    this.setFilterOpen(false);
  };

  ShellController.prototype.findSearchItem = function (itemId) {
    const provider = this.currentSearchProvider();

    if (!provider) {
      return null;
    }

    return provider.items.find(function (item) {
      return item.id === itemId;
    }) || null;
  };

  ShellController.prototype.handleSearchResultClick = function (event) {
    const result = event.target.closest("[data-search-result]");

    if (!result) {
      return;
    }

    const item = this.findSearchItem(result.dataset.searchResultId || "");

    if (!item) {
      return;
    }

    this.dispatchShellEvent("fieldops:shell-search-select", {
      source: "search-panel",
      item
    });

    this.setSearchOpen(false);
  };

  ShellController.prototype.setWorkOnlinePressed = function (isOnline) {
    if (this.refs.onlineButton) {
      this.refs.onlineButton.setAttribute("aria-pressed", isOnline ? "true" : "false");
    }
  };

  ShellController.prototype.handleProfileClick = function () {
    this.dispatchShellEvent("fieldops:shell-profile", { source: "drawer" });
    this.setDrawerOpen(false);
  };

  ShellController.prototype.handleSettingsClick = function () {
    this.dispatchShellEvent("fieldops:shell-settings", { source: "drawer" });
    this.setDrawerOpen(false);
  };

  ShellController.prototype.handleWorkOnlineClick = function () {
    const nextOnlineState = !(this.refs.onlineButton && this.refs.onlineButton.getAttribute("aria-pressed") === "true");

    this.setWorkOnlinePressed(nextOnlineState);
    this.dispatchShellEvent("fieldops:shell-work-online-toggle", {
      source: "drawer",
      online: nextOnlineState
    });
  };

  ShellController.prototype.handleWorkOnlineState = function (event) {
    const detail = event.detail || {};

    if (detail.page && detail.page !== this.activePage) {
      return;
    }

    this.setWorkOnlinePressed(Boolean(detail.online));
  };

  ShellController.prototype.handlePageButtonClick = function (event, button) {
    const pageName = button.dataset.page;

    if (!isSamePagePath(button.href)) {
      /*
        Let real navigation happen without changing this page's active rail first.
        Safari can restore that mutated DOM from bfcache when pressing Back.
      */
      return;
    }

    event.preventDefault();
    this.setActivePage(pageName);
    this.setDrawerOpen(false);
    this.setFilterOpen(false);
  };

  ShellController.prototype.handlePageShow = function () {
    const resetPage = normalisePageKey(this.shell.dataset.page || this.shell.dataset.currentPage || this.activePage);

    this.setActivePage(resetPage);
    this.setDrawerOpen(false);
    this.setFilterOpen(false);
    this.setSearchOpen(false);
  };

  /* ========================================================================
     Boot
     ======================================================================== */

  function bootFieldOpsShell() {
    const shell = document.querySelector(SHELL_ROOT_SELECTOR);

    if (!shell || shell.dataset.shellReady === "true") {
      return;
    }

    new ShellController(shell).boot();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootFieldOpsShell, { once: true });
  } else {
    bootFieldOpsShell();
  }
})();
