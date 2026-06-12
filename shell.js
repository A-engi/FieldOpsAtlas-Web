/* ==========================================================================
 FieldOps Atlas shared shell
 Root file: shell.js
 Version: 1.1.13-one-root-shell
 Purpose:
 Inject one shared shell into the current page root.
 Rules:
 - One root shell only.
 - One top shell only.
 - One bottom shell only.
 - Page files own page content.
 - Feature files own feature panels and data logic.
 ========================================================================== */

(function fieldOpsSharedShell() {
  "use strict";

  var VERSION = "1.1.13-one-root-shell";
  var ROOT_SELECTOR = ".phone, .app-shell, .fieldops-shell-root";
  var CHROME_SELECTOR = [
    ":scope > .top-shell",
    ":scope > .bottom-shell",
    ":scope > .drawer",
    ":scope > .map-dim",
    ":scope > .search-panel",
    ":scope > .filter-panel",
    ":scope > [data-fieldops-shell-chrome]"
  ].join(", ");

  var pages = {
    map: {
      label: "Map",
      navLabel: "Map",
      icon: "icon--map",
      href: "FieldOpsAtlas/Features/maps/index.html"
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

  var pageOrder = ["map", "rf", "network", "docs", "tools"];
  var searchProviders = Object.create(null);

  function scriptRoot() {
    var scripts = Array.prototype.slice.call(document.querySelectorAll("script[src]"));
    var shellScript = scripts.reverse().find(function findShellScript(script) {
      return /(^|\/)shell\.js(\?|$)/.test(script.getAttribute("src") || "");
    });

    if (!shellScript) {
      return new URL("./", window.location.href).href;
    }

    return new URL("./", shellScript.src).href;
  }

  var rootPath = scriptRoot();

  function asset(path) {
    return new URL(path, rootPath).href;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function replaceCharacter(character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function normalisePage(page) {
    return pages[page] ? page : "rf";
  }

  function inferPage() {
    var path = window.location.pathname.toLowerCase();

    if (path.indexOf("/features/map/") !== -1) {
      return "map";
    }

    if (path.indexOf("/features/rf/") !== -1) {
      return "rf";
    }

    if (path.indexOf("/features/network/") !== -1) {
      return "network";
    }

    if (path.indexOf("/features/docs/") !== -1) {
      return "docs";
    }

    if (path.indexOf("/features/tools/") !== -1) {
      return "tools";
    }

    return "rf";
  }

  function samePage(url) {
    return new URL(url, window.location.href).pathname === window.location.pathname;
  }

  function icon(iconClass, extraClass) {
    var classes = ["repo-icon", iconClass];

    if (extraClass) {
      classes.push(extraClass);
    }

    return '<span class="' + classes.join(" ") + '" aria-hidden="true"></span>';
  }

  function chevron() {
    return '<span class="chevron-mark" aria-hidden="true"></span>';
  }

  function pageHref(pageKey) {
    return asset(pages[normalisePage(pageKey)].href);
  }

  function pageOption(pageKey, activePage) {
    var page = pages[pageKey];
    var hidden = pageKey === activePage ? " hidden" : "";

    return [
      '<a class="drawer-page-option drawer-row" data-page="', pageKey, '" data-page-button href="', pageHref(pageKey), '"', hidden, '>',
      icon(page.icon),
      '<span class="drawer-row__copy">',
      '<span class="drawer-row__eyebrow">Page</span>',
      '<span class="drawer-row__title">', escapeHtml(page.label), '</span>',
      '</span>',
      '<span class="drawer-row__chevron">', chevron(), '</span>',
      '</a>'
    ].join("");
  }

  function navButton(pageKey, activePage, activeIndex, index) {
    var page = pages[pageKey];
    var classes = ["nav-button"];

    if (pageKey === activePage) {
      classes.push("is-active");
    }

    if (index === activeIndex - 1) {
      classes.push("is-group-end");
    }

    if (index === activeIndex + 1) {
      classes.push("is-group-start");
    }

    return [
      '<a class="', classes.join(" "), '" data-page="', pageKey, '" data-nav-button href="', pageHref(pageKey), '"',
      pageKey === activePage ? ' aria-current="page"' : "",
      '>',
      icon(page.icon),
      '<span class="nav-label">', escapeHtml(page.navLabel), '</span>',
      '</a>'
    ].join("");
  }

  function shellMarkup(activePage) {
    var active = normalisePage(activePage);
    var page = pages[active];
    var activeIndex = Math.max(0, pageOrder.indexOf(active));

    return [
      '<button class="map-dim" type="button" data-menu-backdrop data-fieldops-shell-chrome aria-label="Close menu"></button>',
      '<header class="top-shell" data-fieldops-shell-chrome>',
      '<button class="icon-button" type="button" data-menu-open aria-label="Open menu" aria-expanded="false">',
      icon("icon--menu"),
      '</button>',
      '<button class="search-button" type="button" data-search-open aria-label="Search" aria-expanded="false">',
      '<span class="search-lead">',
      icon("icon--search", "search-icon"),
      '<span class="search-query">Search ', escapeHtml(page.label), '</span>',
      '</span>',
      '<span class="search-brand">',
      '<span class="search-divider" aria-hidden="true"></span>',
      '<span class="atlas-logo">', icon("icon--atlas"), '<span class="atlas-mini-word">ATLAS</span></span>',
      '</span>',
      '</button>',
      '<button class="icon-button" type="button" data-filter-open-button aria-label="Filter" aria-expanded="false">',
      icon("icon--filter"),
      '</button>',
      '</header>',
      '<aside class="drawer" data-fieldops-shell-chrome aria-label="FieldOps menu">',
      '<div class="drawer-header">',
      '<div class="drawer-brand-mark">', icon("icon--atlas"), '</div>',
      '<div><h2 class="drawer-title">FieldOps ATLAS</h2><p class="drawer-subtitle">UK Network Toolkit</p></div>',
      '</div>',
      '<section class="drawer-section">',
      '<div class="section-toggle">',
      '<h3 class="drawer-section__title">Pages</h3>',
      '<button class="section-toggle__button" type="button" data-pages-toggle aria-expanded="false">',
      '<span class="section-toggle__text">All</span>',
      '<span class="section-toggle__chevron">', chevron(), '</span>',
      '</button>',
      '</div>',
      '<button class="current-page-card" type="button" data-current-page-card aria-expanded="false">',
      icon(page.icon),
      '<span class="current-page-card__copy">',
      '<span class="current-page-card__eyebrow">Current page</span>',
      '<span class="current-page-card__title" data-current-page-title>', escapeHtml(page.label), '</span>',
      '</span>',
      '<span class="current-page-card__chevron">', chevron(), '</span>',
      '</button>',
      '<div class="drawer-pages">', pageOrder.map(function mapOption(pageKey) {
        return pageOption(pageKey, active);
      }).join(""), '</div>',
      '</section>',
      '<section class="drawer-section">',
      '<h3 class="drawer-section__title">User</h3>',
      '<div class="drawer-actions">',
      '<button class="drawer-row" type="button" data-shell-profile aria-label="Profile">', icon("icon--profile"), '<span class="drawer-row__title">Profile</span></button>',
      '<button class="drawer-row" type="button" data-shell-settings aria-label="Settings">', icon("icon--settings"), '<span class="drawer-row__title">Settings</span></button>',
      '</div>',
      '</section>',
      '<div class="drawer-footer">',
      '<button class="online-row" type="button" data-shell-online aria-pressed="false">', icon("icon--info"), '<span class="drawer-row__title">Work online</span></button>',
      '<p class="drawer-subtitle">FieldOps Atlas ', VERSION, '</p>',
      '</div>',
      '</aside>',
      '<aside class="search-panel" data-fieldops-shell-chrome aria-label="Search panel">',
      '<h2 class="panel-heading" data-search-title>Search ', escapeHtml(page.label), '</h2>',
      '<p class="panel-subtext" data-search-hint>Page-specific results only.</p>',
      '<input class="search-input" type="search" data-search-input placeholder="Search ', escapeHtml(page.label), '">',
      '<div class="search-results" data-search-results></div>',
      '<p class="search-empty" data-search-empty>No matches found.</p>',
      '</aside>',
      '<aside class="filter-panel" data-fieldops-shell-chrome aria-label="Filter panel">',
      '<h2 class="panel-heading">Filter</h2>',
      '<p class="panel-subtext">Region</p>',
      '<button class="filter-region-button" type="button" data-filter-region>All regions ', chevron(), '</button>',
      '</aside>',
      '<nav class="bottom-shell" data-fieldops-shell-chrome aria-label="Primary navigation">',
      pageOrder.map(function mapNav(pageKey, index) {
        return navButton(pageKey, active, activeIndex, index);
      }).join(""),
      '</nav>'
    ].join("");
  }

  function cleanChrome(root) {
    root.querySelectorAll(CHROME_SELECTOR).forEach(function removeChrome(node) {
      node.remove();
    });

    root.dataset.shellReady = "false";
  }

  function providerFromQueueItem(provider) {
    var page = String(provider && provider.page ? provider.page : "").trim();

    if (!page) {
      return null;
    }

    return {
      page: page,
      label: String(provider.label || (pages[page] && pages[page].label) || page.toUpperCase()),
      placeholder: String(provider.placeholder || "Search " + ((pages[page] && pages[page].label) || page) + "..."),
      emptyText: String(provider.emptyText || "No matches found."),
      items: Array.isArray(provider.items) ? provider.items.map(function normaliseItem(item) {
        var title = String(item.title || "");

        return {
          id: String(item.id || item.href || title),
          title: title,
          subtitle: String(item.subtitle || ""),
          href: item.href ? String(item.href) : "",
          keywords: Array.isArray(item.keywords) ? item.keywords.map(String) : []
        };
      }).filter(function onlyTitled(item) {
        return item.title;
      }) : []
    };
  }

  function registerSearchProvider(provider) {
    var normalised = providerFromQueueItem(provider);

    if (!normalised) {
      return;
    }

    searchProviders[normalised.page] = normalised;

    if (typeof window.FieldOpsSearchRefresh === "function") {
      window.FieldOpsSearchRefresh(normalised.page);
    }
  }

  window.FieldOpsSearch = {
    register: registerSearchProvider,
    registerPage: registerSearchProvider,
    providers: searchProviders
  };

  (window.FieldOpsSearchQueue || []).forEach(registerSearchProvider);

  window.FieldOpsSearchQueue = {
    push: function pushProvider(provider) {
      registerSearchProvider(provider);
      return Object.keys(searchProviders).length;
    }
  };

  function ShellController(root) {
    this.root = root;
    this.root.classList.add("fieldops-shell-root");
    this.page = normalisePage(root.dataset.currentPage || root.dataset.page || inferPage());
    this.refs = {};
  }

  ShellController.prototype.boot = function boot() {
    cleanChrome(this.root);
    this.root.dataset.shellReady = "true";
    this.root.dataset.shellVersion = VERSION;
    this.root.dataset.page = this.page;
    this.root.dataset.currentPage = this.page;
    this.root.dataset.drawerOpen = "false";
    this.root.dataset.pagesExpanded = "false";
    this.root.dataset.searchOpen = "false";
    this.root.dataset.filterOpen = "false";
    this.root.insertAdjacentHTML("afterbegin", shellMarkup(this.page));
    this.cache();
    this.bind();
    this.setActivePage(this.page);
  };

  ShellController.prototype.cache = function cache() {
    this.refs.menuButton = this.root.querySelector("[data-menu-open]");
    this.refs.backdrop = this.root.querySelector("[data-menu-backdrop]");
    this.refs.filterButton = this.root.querySelector("[data-filter-open-button]");
    this.refs.filterRegion = this.root.querySelector("[data-filter-region]");
    this.refs.searchButton = this.root.querySelector("[data-search-open]");
    this.refs.searchPanel = this.root.querySelector(".search-panel");
    this.refs.searchInput = this.root.querySelector("[data-search-input]");
    this.refs.searchResults = this.root.querySelector("[data-search-results]");
    this.refs.searchEmpty = this.root.querySelector("[data-search-empty]");
    this.refs.searchTitle = this.root.querySelector("[data-search-title]");
    this.refs.searchHint = this.root.querySelector("[data-search-hint]");
    this.refs.searchQuery = this.root.querySelector(".search-query");
    this.refs.pagesButton = this.root.querySelector("[data-pages-toggle]");
    this.refs.currentPageCard = this.root.querySelector("[data-current-page-card]");
    this.refs.currentPageTitle = this.root.querySelector("[data-current-page-title]");
    this.refs.pageOptions = Array.prototype.slice.call(this.root.querySelectorAll(".drawer-page-option"));
    this.refs.navButtons = Array.prototype.slice.call(this.root.querySelectorAll("[data-nav-button]"));
    this.refs.pageButtons = Array.prototype.slice.call(this.root.querySelectorAll("[data-page-button]"));
    this.refs.profileButton = this.root.querySelector("[data-shell-profile]");
    this.refs.settingsButton = this.root.querySelector("[data-shell-settings]");
    this.refs.onlineButton = this.root.querySelector("[data-shell-online]");
  };

  ShellController.prototype.bind = function bind() {
    var controller = this;

    if (this.refs.menuButton) {
      this.refs.menuButton.addEventListener("click", function menuClick() {
        controller.setDrawerOpen(controller.root.dataset.drawerOpen !== "true");
      });
    }

    if (this.refs.backdrop) {
      this.refs.backdrop.addEventListener("click", function backdropClick() {
        controller.setDrawerOpen(false);
      });
    }

    if (this.refs.filterButton) {
      this.refs.filterButton.addEventListener("click", function filterClick() {
        controller.handleFilterClick();
      });
    }

    if (this.refs.filterRegion) {
      this.refs.filterRegion.addEventListener("click", function regionClick() {
        controller.dispatch("fieldops:shell-filter-region", { source: "filter-panel" });
        controller.setFilterOpen(false);
      });
    }

    if (this.refs.searchButton) {
      this.refs.searchButton.addEventListener("click", function searchClick() {
        controller.setSearchOpen(controller.root.dataset.searchOpen !== "true");
      });
    }

    if (this.refs.searchInput) {
      this.refs.searchInput.addEventListener("input", function inputSearch() {
        controller.renderSearch(controller.refs.searchInput.value);
      });

      this.refs.searchInput.addEventListener("keydown", function inputKeydown(event) {
        if (event.key === "Escape") {
          controller.setSearchOpen(false);
        }
      });
    }

    if (this.refs.pagesButton) {
      this.refs.pagesButton.addEventListener("click", function pagesClick() {
        controller.setPagesExpanded(controller.root.dataset.pagesExpanded !== "true");
      });
    }

    if (this.refs.currentPageCard) {
      this.refs.currentPageCard.addEventListener("click", function currentPageClick() {
        controller.setPagesExpanded(controller.root.dataset.pagesExpanded !== "true");
      });
    }

    this.refs.pageButtons.forEach(function bindPageButton(button) {
      button.addEventListener("click", function pageButtonClick(event) {
        controller.handlePageNavigation(event, button);
      });
    });

    this.refs.navButtons.forEach(function bindNavButton(button) {
      button.addEventListener("click", function navButtonClick(event) {
        controller.handlePageNavigation(event, button);
      });
    });

    if (this.refs.profileButton) {
      this.refs.profileButton.addEventListener("click", function profileClick() {
        controller.dispatch("fieldops:shell-profile", { source: "drawer" });
        controller.setDrawerOpen(false);
      });
    }

    if (this.refs.settingsButton) {
      this.refs.settingsButton.addEventListener("click", function settingsClick() {
        controller.dispatch("fieldops:shell-settings", { source: "drawer" });
        controller.setDrawerOpen(false);
      });
    }

    if (this.refs.onlineButton) {
      this.refs.onlineButton.addEventListener("click", function onlineClick() {
        var next = controller.refs.onlineButton.getAttribute("aria-pressed") !== "true";
        controller.refs.onlineButton.setAttribute("aria-pressed", next ? "true" : "false");
        controller.dispatch("fieldops:shell-work-online-toggle", { source: "drawer", online: next });
      });
    }

    document.addEventListener("pointerdown", function documentPointer(event) {
      if (controller.root.dataset.searchOpen !== "true") {
        return;
      }

      if (event.target.closest(".search-panel, .search-button")) {
        return;
      }

      controller.setSearchOpen(false);
    }, true);

    window.FieldOpsSearchRefresh = function refreshSearch(page) {
      if (page === controller.page) {
        controller.updateSearchUi();
      }
    };
  };

  ShellController.prototype.dispatch = function dispatch(name, detail) {
    window.dispatchEvent(new CustomEvent(name, {
      detail: Object.assign({
        page: this.page,
        version: VERSION
      }, detail || {})
    }));
  };

  ShellController.prototype.setDrawerOpen = function setDrawerOpen(open) {
    this.root.dataset.drawerOpen = open ? "true" : "false";

    if (this.refs.menuButton) {
      this.refs.menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (open) {
      this.setSearchOpen(false);
      this.setFilterOpen(false);
    }
  };

  ShellController.prototype.setFilterOpen = function setFilterOpen(open) {
    this.root.dataset.filterOpen = open ? "true" : "false";

    if (this.refs.filterButton) {
      this.refs.filterButton.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (open) {
      this.setDrawerOpen(false);
      this.setSearchOpen(false);
    }
  };

  ShellController.prototype.handleFilterClick = function handleFilterClick() {
    if (this.page === "map") {
      this.dispatch("fieldops:shell-filter-region", { source: "top-filter-button" });
      this.setDrawerOpen(false);
      this.setSearchOpen(false);
      return;
    }

    this.setFilterOpen(this.root.dataset.filterOpen !== "true");
  };

  ShellController.prototype.setSearchOpen = function setSearchOpen(open) {
    this.root.dataset.searchOpen = open ? "true" : "false";

    if (this.refs.searchButton) {
      this.refs.searchButton.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (!open) {
      return;
    }

    this.dispatch("fieldops:shell-search-open", { source: "top-search-button" });
    this.setDrawerOpen(false);
    this.setFilterOpen(false);
    this.updateSearchUi();

    if (this.refs.searchInput) {
      this.refs.searchInput.focus();
      this.refs.searchInput.select();
    }
  };

  ShellController.prototype.setPagesExpanded = function setPagesExpanded(open) {
    this.root.dataset.pagesExpanded = open ? "true" : "false";

    if (this.refs.pagesButton) {
      this.refs.pagesButton.setAttribute("aria-expanded", open ? "true" : "false");

      var text = this.refs.pagesButton.querySelector(".section-toggle__text");

      if (text) {
        text.textContent = open ? "Hide" : "All";
      }
    }

    if (this.refs.currentPageCard) {
      this.refs.currentPageCard.setAttribute("aria-expanded", open ? "true" : "false");
    }

    this.refs.pageOptions.forEach(function updateOption(row) {
      row.hidden = !open || row.dataset.page === this.page;
    }, this);
  };

  ShellController.prototype.setActivePage = function setActivePage(page) {
    this.page = normalisePage(page);
    this.root.dataset.page = this.page;
    this.root.dataset.currentPage = this.page;

    var current = pages[this.page];

    if (this.refs.currentPageTitle) {
      this.refs.currentPageTitle.textContent = current.label;
    }

    this.refs.navButtons.forEach(function updateNav(button) {
      var active = button.dataset.page === this.page;

      button.classList.toggle("is-active", active);

      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    }, this);

    this.updateSearchUi();
    this.setPagesExpanded(false);
  };

  ShellController.prototype.handlePageNavigation = function handlePageNavigation(event, button) {
    var page = normalisePage(button.dataset.page);

    if (!samePage(button.href)) {
      return;
    }

    event.preventDefault();

    if (this.page === "map" && page === "map") {
      this.dispatch("fieldops:shell-map-tools-toggle", { source: "bottom-nav-map" });
      this.setDrawerOpen(false);
      this.setSearchOpen(false);
      this.setFilterOpen(false);
      return;
    }

    this.setActivePage(page);
    this.setDrawerOpen(false);
    this.setSearchOpen(false);
    this.setFilterOpen(false);
  };

  ShellController.prototype.currentProvider = function currentProvider() {
    return searchProviders[this.page] || null;
  };

  ShellController.prototype.updateSearchUi = function updateSearchUi() {
    var provider = this.currentProvider();
    var page = pages[this.page];
    var placeholder = provider ? provider.placeholder : "Search " + page.label + "...";

    if (this.refs.searchInput) {
      this.refs.searchInput.placeholder = placeholder;
    }

    if (this.refs.searchQuery) {
      this.refs.searchQuery.textContent = placeholder;
    }

    if (this.refs.searchTitle) {
      this.refs.searchTitle.textContent = provider ? "Search " + provider.label : "Search " + page.label;
    }

    if (this.refs.searchHint) {
      this.refs.searchHint.textContent = provider ? "Page-specific results only." : "Search is not available on this page yet.";
    }

    this.renderSearch(this.refs.searchInput ? this.refs.searchInput.value : "");
  };

  ShellController.prototype.renderSearch = function renderSearch(query) {
    var provider = this.currentProvider();

    if (!this.refs.searchResults || !this.refs.searchEmpty) {
      return;
    }

    if (!provider) {
      this.refs.searchResults.innerHTML = "";
      this.refs.searchEmpty.hidden = false;
      this.refs.searchEmpty.textContent = "Search is not available on this page yet.";
      return;
    }

    var needle = String(query || "").trim().toLowerCase();
    var matches = provider.items.filter(function matchItem(item) {
      var haystack = [item.title, item.subtitle].concat(item.keywords).join(" ").toLowerCase();
      return !needle || haystack.indexOf(needle) !== -1;
    }).slice(0, 12);

    this.refs.searchResults.innerHTML = matches.map(function renderItem(item) {
      var href = item.href ? new URL(item.href, window.location.href).href : "#";

      return [
        '<a class="search-result" href="', href, '" data-search-result="', escapeHtml(item.id), '">',
        '<strong>', escapeHtml(item.title), '</strong>',
        item.subtitle ? '<span>' + escapeHtml(item.subtitle) + '</span>' : "",
        '</a>'
      ].join("");
    }).join("");

    this.refs.searchEmpty.hidden = matches.length > 0;
    this.refs.searchEmpty.textContent = provider.emptyText;
  };

  function boot() {
    var roots = Array.prototype.slice.call(document.querySelectorAll(ROOT_SELECTOR)).filter(function topLevelOnly(root) {
      return !root.parentElement || !root.parentElement.closest(ROOT_SELECTOR);
    });

    roots.forEach(function bootRoot(root) {
      new ShellController(root).boot();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
}());
