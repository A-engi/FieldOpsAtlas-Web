/* ==========================================================================
   FieldOps Atlas shared shell
   Root file: shell.js
   Version: 1.1.20-web-repo-profile-link
   Purpose:
   - Inject one shared root shell into the current page root.
   - Root shell owns menu, top controls, search, filter, bottom nav.
   - Root shell owns editor mode, GitHub key/config, and GitHub file writes.
   - Page files own page content and page-specific edit forms.
   ========================================================================== */

(function fieldOpsSharedShell() {
  "use strict";

  var VERSION = "1.1.20-web-repo-profile-link";
  var ROOT_SELECTOR = ".phone, .app-shell, .fieldops-shell-root";
  var CHROME_SELECTOR = [
    ":scope > .top-shell",
    ":scope > .bottom-shell",
    ":scope > .drawer",
    ":scope > .map-dim",
    ":scope > .search-panel",
    ":scope > .filter-panel",
    ":scope > .editor-panel",
    ":scope > [data-fieldops-shell-chrome]"
  ].join(", ");

  var pages = {
    map: {
      label: "Map",
      navLabel: "Map",
      icon: "icon--map",
      href: "FieldOpsAtlas/Features/maps/index.html"
    },
    weather: {
      label: "Weather",
      navLabel: "Wthr",
      icon: "icon--weather",
      href: "FieldOpsAtlas/Features/Weather/index.html"
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

  var pageOrder = ["map", "weather", "rf", "network", "docs", "tools"];
  var searchProviders = Object.create(null);
  var editorProviders = Object.create(null);

  var EDITOR_KEYS = {
    token: "fieldops.editor.github.token",
    owner: "fieldops.editor.github.owner",
    repo: "fieldops.editor.github.repo",
    branch: "fieldops.editor.github.branch",
    online: "fieldops.editor.github.online"
  };

  var editorState = {
    token: localGet(EDITOR_KEYS.token),
    owner: localGet(EDITOR_KEYS.owner) || "A-engi",
    repo: localGet(EDITOR_KEYS.repo) || "FieldOpsAtlas-Web",
    branch: localGet(EDITOR_KEYS.branch) || "main",
    online: localGet(EDITOR_KEYS.online) === "true"
  };

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
    return String(value == null ? "" : value).replace(/[&<>"']/g, function replaceCharacter(character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function localGet(key) {
    try {
      return window.localStorage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }

  function localSet(key, value) {
    try {
      window.localStorage.setItem(key, String(value || ""));
    } catch (error) {
      // Storage can be blocked inside previews/webviews.
    }
  }

  function localRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // Storage can be blocked inside previews/webviews.
    }
  }

  function normalisePage(page) {
    return pages[page] ? page : "rf";
  }

  function inferPage() {
    var path = window.location.pathname.toLowerCase();

    if (path.indexOf("/features/maps/") !== -1 || path.indexOf("/features/map/") !== -1) {
      return "map";
    }

    if (path.indexOf("/features/weather/") !== -1) {
      return "weather";
    }

    if (path.indexOf("/features/rf/") !== -1 || path.indexOf("/features/rfpages/") !== -1) {
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
      '<a class="drawer-page-option drawer-row" data-page-button data-page="',
      escapeHtml(pageKey),
      '" href="',
      escapeHtml(pageHref(pageKey)),
      '"',
      hidden,
      '>',
      icon(page.icon),
      '<span class="drawer-row__copy">',
      '<span class="drawer-row__eyebrow">Page</span>',
      '<span class="drawer-row__title">',
      escapeHtml(page.label),
      '</span>',
      '</span>',
      '<span class="drawer-row__chevron">',
      chevron(),
      '</span>',
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
      '<a class="',
      classes.join(" "),
      '" data-nav-button data-page="',
      escapeHtml(pageKey),
      '" href="',
      escapeHtml(pageHref(pageKey)),
      '"',
      pageKey === activePage ? ' aria-current="page"' : "",
      '>',
      icon(page.icon),
      '<span class="nav-label">',
      escapeHtml(page.navLabel),
      '</span>',
      '</a>'
    ].join("");
  }

  function shellMarkup(activePage) {
    var active = normalisePage(activePage);
    var page = pages[active];
    var activeIndex = Math.max(0, pageOrder.indexOf(active));

    return [
      '<header class="top-shell" data-fieldops-shell-chrome>',
      '<button class="icon-button" type="button" data-menu-open aria-label="Open menu" aria-expanded="false">',
      icon("icon--menu"),
      '</button>',
      '<button class="search-button" type="button" data-search-open aria-label="Search" aria-expanded="false">',
      '<span class="search-lead">',
      icon("icon--search", "search-icon"),
      '<span class="search-query">Search ',
      escapeHtml(page.label),
      '</span>',
      '</span>',
      '<span class="search-brand" aria-hidden="true">',
      '<span class="search-divider"></span>',
      '<span class="atlas-logo">',
      icon("icon--atlas"),
      '<span class="atlas-mini-word">ATLAS</span>',
      '</span>',
      '</span>',
      '</button>',
      '<button class="icon-button" type="button" data-filter-open-button aria-label="Filter" aria-expanded="false">',
      icon("icon--filter"),
      '</button>',
      '</header>',

      '<button class="map-dim" type="button" data-menu-backdrop data-fieldops-shell-chrome aria-label="Close menu"></button>',

      '<aside class="drawer" data-fieldops-shell-chrome aria-label="Menu">',
      '<header class="drawer-header">',
      '<span class="drawer-brand-mark">',
      icon("icon--atlas"),
      '</span>',
      '<div>',
      '<h2 class="drawer-title">FieldOps ATLAS</h2>',
      '<p class="drawer-subtitle">UK Network Toolkit</p>',
      '</div>',
      '</header>',

      '<section class="drawer-section">',
      '<div class="section-toggle">',
      '<h3 class="drawer-section__title">Pages</h3>',
      '<button class="section-toggle__button" type="button" data-pages-toggle aria-expanded="false">',
      '<span class="section-toggle__text">All</span>',
      '<span class="section-toggle__chevron">',
      chevron(),
      '</span>',
      '</button>',
      '</div>',
      '<button class="current-page-card" type="button" data-current-page-card aria-expanded="false">',
      icon(page.icon),
      '<span class="current-page-card__copy">',
      '<span class="current-page-card__eyebrow">Current page</span>',
      '<span class="current-page-card__title" data-current-page-title>',
      escapeHtml(page.label),
      '</span>',
      '</span>',
      '<span class="current-page-card__chevron">',
      chevron(),
      '</span>',
      '</button>',
      '<div class="drawer-pages">',
      pageOrder.map(function mapOption(pageKey) {
        return pageOption(pageKey, active);
      }).join(""),
      '</div>',
      '</section>',

      '<section class="drawer-section drawer-footer">',
      '<h3 class="drawer-section__title">User</h3>',
      '<div class="drawer-actions">',
      '<button class="drawer-row" type="button" data-shell-profile>',
      icon("icon--profile"),
      '<span class="drawer-row__copy">',
      '<span class="drawer-row__title">Profile</span>',
      '</span>',
      '</button>',
      '<button class="drawer-row" type="button" data-shell-settings>',
      icon("icon--settings"),
      '<span class="drawer-row__copy">',
      '<span class="drawer-row__title">Settings</span>',
      '</span>',
      '</button>',
      '</div>',
      '<p class="drawer-version">FieldOps Atlas ',
      VERSION,
      '</p>',
      '</section>',
      '</aside>',

      '<section class="search-panel" data-fieldops-shell-chrome aria-label="Search panel">',
      '<h2 class="panel-heading" data-search-title>Search ',
      escapeHtml(page.label),
      '</h2>',
      '<p class="panel-subtext" data-search-hint>Page-specific results only.</p>',
      '<input class="search-input" type="search" data-search-input autocomplete="off">',
      '<div class="search-results" data-search-results></div>',
      '<p class="search-empty" data-search-empty>No matches found.</p>',
      '</section>',

      '<section class="filter-panel" data-fieldops-shell-chrome aria-label="Filter panel">',
      '<h2 class="panel-heading">Filter</h2>',
      '<div class="filter-region-list">',
      '<button class="filter-region-button" type="button" data-filter-region>Region</button>',
      '</div>',
      '</section>',

      '<section class="editor-panel" data-fieldops-shell-chrome aria-label="Settings">',
      '<header class="editor-panel__header">',
      '<div>',
      '<h2 class="panel-heading">Settings</h2>',
      '<p class="panel-subtext">GitHub editor key and edit mode.</p>',
      '</div>',
      '<button class="panel-close-button" type="button" data-editor-close>Close</button>',
      '</header>',
      '<label class="editor-field">',
      '<span>Token / key</span>',
      '<input type="password" data-editor-token autocomplete="off" placeholder="GitHub fine-grained token">',
      '</label>',
      '<div class="editor-field-grid">',
      '<label class="editor-field">',
      '<span>Owner</span>',
      '<input type="text" data-editor-owner autocomplete="off">',
      '</label>',
      '<label class="editor-field">',
      '<span>Repo</span>',
      '<input type="text" data-editor-repo autocomplete="off">',
      '</label>',
      '<label class="editor-field">',
      '<span>Branch</span>',
      '<input type="text" data-editor-branch autocomplete="off">',
      '</label>',
      '</div>',
      '<div class="editor-actions">',
      '<button class="panel-close-button" type="button" data-editor-save-key>Save key</button>',
      '<button class="panel-close-button" type="button" data-editor-toggle-online>Go online</button>',
      '<button class="panel-close-button" type="button" data-editor-clear-key>Clear key</button>',
      '</div>',
      '<p class="editor-mode-note" data-editor-panel-status></p>',
      '</section>',

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

  function editorMode() {
    return editorState.online && editorState.token ? "online" : "offline";
  }

  function editorStatusText() {
    if (editorMode() === "online") {
      return "Online edits write to GitHub.";
    }

    if (editorState.online && !editorState.token) {
      return "Add a GitHub key to edit online.";
    }

    return "Local edits only.";
  }

  function githubApi(path) {
    return "https://api.github.com/repos/" +
      encodeURIComponent(editorState.owner) +
      "/" +
      encodeURIComponent(editorState.repo) +
      "/contents/" +
      path.split("/").map(encodeURIComponent).join("/");
  }

  function encodeBase64(text) {
    var bytes = new TextEncoder().encode(text);
    var binary = "";
    bytes.forEach(function appendByte(byte) {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  }

  function decodeBase64(text) {
    var binary = window.atob(String(text || "").replace(/\n/g, ""));
    var bytes = new Uint8Array(binary.length);
    for (var index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new TextDecoder().decode(bytes);
  }

  function githubFetch(path, options) {
    var headers = Object.assign({
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }, options && options.headers ? options.headers : {});

    if (editorState.token) {
      headers.Authorization = "Bearer " + editorState.token;
    }

    return fetch(githubApi(path) + (options && options.query ? options.query : ""), Object.assign({}, options || {}, {
      headers: headers
    }));
  }

  function readGitHubFile(path) {
    if (editorMode() !== "online") {
      return Promise.reject(new Error("GitHub editor is offline."));
    }

    return githubFetch(path, {
      method: "GET",
      query: "?ref=" + encodeURIComponent(editorState.branch)
    }).then(function handleResponse(response) {
      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error("GitHub read failed: " + response.status);
      }

      return response.json();
    });
  }

  function readJsonFile(path, fallback) {
    return readGitHubFile(path).then(function handleFile(file) {
      if (!file) {
        return fallback;
      }

      return JSON.parse(decodeBase64(file.content || ""));
    });
  }

  function saveJsonFile(path, data, message) {
    if (editorMode() !== "online") {
      return Promise.reject(new Error("GitHub editor is offline."));
    }

    return readGitHubFile(path).then(function handleCurrent(file) {
      var body = {
        message: message || "Update " + path,
        content: encodeBase64(JSON.stringify(data, null, 2) + "\n"),
        branch: editorState.branch
      };

      if (file && file.sha) {
        body.sha = file.sha;
      }

      return githubFetch(path, {
        method: "PUT",
        body: JSON.stringify(body)
      });
    }).then(function handleSave(response) {
      if (!response.ok) {
        return response.text().then(function fail(text) {
          throw new Error("GitHub save failed: " + response.status + " " + text);
        });
      }

      return response.json();
    });
  }

  function registerEditorProvider(provider) {
    if (!provider || !provider.page) {
      return;
    }

    editorProviders[String(provider.page)] = provider;
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

  window.FieldOpsEditor = {
    version: VERSION,
    register: registerEditorProvider,
    registerPage: registerEditorProvider,
    providers: editorProviders,
    getMode: editorMode,
    isOnline: function isOnline() {
      return editorMode() === "online";
    },
    hasKey: function hasKey() {
      return Boolean(editorState.token);
    },
    getConfig: function getConfig() {
      return {
        owner: editorState.owner,
        repo: editorState.repo,
        branch: editorState.branch,
        online: editorState.online,
        hasKey: Boolean(editorState.token),
        mode: editorMode()
      };
    },
    openSettings: function openSettings() {
      window.dispatchEvent(new CustomEvent("fieldops:editor-open-settings"));
    },
    readJsonFile: readJsonFile,
    saveJsonFile: saveJsonFile
  };

  function dispatchEditorChange() {
    window.dispatchEvent(new CustomEvent("fieldops:editor-mode-change", {
      detail: window.FieldOpsEditor.getConfig()
    }));
  }

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
    this.root.dataset.editorOpen = "false";
    this.root.insertAdjacentHTML("afterbegin", shellMarkup(this.page));
    this.cache();
    this.bind();
    this.setActivePage(this.page);
    this.syncEditorUi();
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
    this.refs.editorKeyButton = this.root.querySelector("[data-shell-editor-key]");
    this.refs.editorModeLabel = this.root.querySelector("[data-editor-mode-label]");
    this.refs.editorStatus = this.root.querySelector("[data-editor-status]");
    this.refs.editorPanelStatus = this.root.querySelector("[data-editor-panel-status]");
    this.refs.editorPanel = this.root.querySelector(".editor-panel");
    this.refs.editorClose = this.root.querySelector("[data-editor-close]");
    this.refs.editorSaveKey = this.root.querySelector("[data-editor-save-key]");
    this.refs.editorOnlineToggle = this.root.querySelector("[data-editor-toggle-online]");
    this.refs.editorClearKey = this.root.querySelector("[data-editor-clear-key]");
    this.refs.editorToken = this.root.querySelector("[data-editor-token]");
    this.refs.editorOwner = this.root.querySelector("[data-editor-owner]");
    this.refs.editorRepo = this.root.querySelector("[data-editor-repo]");
    this.refs.editorBranch = this.root.querySelector("[data-editor-branch]");
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
        controller.dispatch("fieldops:shell-filter-region", {
          source: "filter-panel"
        });
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
        controller.dispatch("fieldops:shell-profile", {
          source: "drawer"
        });
        controller.setDrawerOpen(false);
        window.location.href = asset("FieldOpsAtlas/Features/Profile/index.html");
      });
    }

    if (this.refs.settingsButton) {
      this.refs.settingsButton.addEventListener("click", function settingsClick() {
        controller.setEditorOpen(true);
      });
    }

    if (this.refs.onlineButton) {
      this.refs.onlineButton.addEventListener("click", function onlineClick() {
        editorState.online = editorMode() !== "online";
        localSet(EDITOR_KEYS.online, editorState.online ? "true" : "false");
        controller.syncEditorUi();
        dispatchEditorChange();
      });
    }

    if (this.refs.editorKeyButton) {
      this.refs.editorKeyButton.addEventListener("click", function editorKeyClick() {
        controller.setEditorOpen(true);
      });
    }

    if (this.refs.editorClose) {
      this.refs.editorClose.addEventListener("click", function editorCloseClick() {
        controller.setEditorOpen(false);
      });
    }

    if (this.refs.editorSaveKey) {
      this.refs.editorSaveKey.addEventListener("click", function saveKeyClick() {
        controller.saveEditorConfig();
      });
    }

    if (this.refs.editorOnlineToggle) {
      this.refs.editorOnlineToggle.addEventListener("click", function toggleOnlineClick() {
        editorState.online = editorMode() !== "online";
        localSet(EDITOR_KEYS.online, editorState.online ? "true" : "false");
        controller.syncEditorUi();
        dispatchEditorChange();
      });
    }

    if (this.refs.editorClearKey) {
      this.refs.editorClearKey.addEventListener("click", function clearKeyClick() {
        controller.clearEditorConfig();
      });
    }

    document.addEventListener("pointerdown", function documentPointer(event) {
      if (controller.root.dataset.searchOpen === "true" && !event.target.closest(".search-panel, .search-button")) {
        controller.setSearchOpen(false);
      }

      if (controller.root.dataset.editorOpen === "true" && !event.target.closest(".editor-panel, [data-shell-editor-key]")) {
        controller.setEditorOpen(false);
      }
    }, true);

    window.addEventListener("fieldops:editor-open-settings", function openSettingsEvent() {
      controller.setEditorOpen(true);
    });

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
      this.setEditorOpen(false);
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
      this.setEditorOpen(false);
    }
  };

  ShellController.prototype.setEditorOpen = function setEditorOpen(open) {
    this.root.dataset.editorOpen = open ? "true" : "false";

    if (!open) {
      return;
    }

    if (this.refs.editorToken) {
      this.refs.editorToken.value = editorState.token;
    }

    if (this.refs.editorOwner) {
      this.refs.editorOwner.value = editorState.owner;
    }

    if (this.refs.editorRepo) {
      this.refs.editorRepo.value = editorState.repo;
    }

    if (this.refs.editorBranch) {
      this.refs.editorBranch.value = editorState.branch;
    }

    this.setDrawerOpen(false);
    this.setSearchOpen(false);
    this.setFilterOpen(false);
    this.syncEditorUi();

    if (this.refs.editorToken) {
      this.refs.editorToken.focus();
    }
  };

  ShellController.prototype.handleFilterClick = function handleFilterClick() {
    if (this.page === "map") {
      this.dispatch("fieldops:shell-filter-region", {
        source: "top-filter-button"
      });
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

    this.dispatch("fieldops:shell-search-open", {
      source: "top-search-button"
    });
    this.setDrawerOpen(false);
    this.setFilterOpen(false);
    this.setEditorOpen(false);
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
      this.dispatch("fieldops:shell-map-tools-toggle", {
        source: "bottom-nav-map"
      });
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
        '<a class="search-result" href="',
        escapeHtml(href),
        '" data-search-result-id="',
        escapeHtml(item.id),
        '">',
        '<span>',
        escapeHtml(item.title),
        '</span>',
        item.subtitle ? '<small>' + escapeHtml(item.subtitle) + '</small>' : "",
        '</a>'
      ].join("");
    }).join("");

    this.refs.searchEmpty.hidden = matches.length > 0;
    this.refs.searchEmpty.textContent = provider.emptyText;
  };

  ShellController.prototype.saveEditorConfig = function saveEditorConfig() {
    editorState.token = this.refs.editorToken ? this.refs.editorToken.value.trim() : editorState.token;
    editorState.owner = this.refs.editorOwner ? this.refs.editorOwner.value.trim() || "A-engi" : editorState.owner;
    editorState.repo = this.refs.editorRepo ? this.refs.editorRepo.value.trim() || "FieldOpsAtlas-Web" : editorState.repo;
    editorState.branch = this.refs.editorBranch ? this.refs.editorBranch.value.trim() || "main" : editorState.branch;
    editorState.online = Boolean(editorState.token);

    localSet(EDITOR_KEYS.token, editorState.token);
    localSet(EDITOR_KEYS.owner, editorState.owner);
    localSet(EDITOR_KEYS.repo, editorState.repo);
    localSet(EDITOR_KEYS.branch, editorState.branch);
    localSet(EDITOR_KEYS.online, editorState.online ? "true" : "false");

    this.syncEditorUi();

    if (this.refs.editorPanelStatus) {
      this.refs.editorPanelStatus.textContent = editorState.token ? "Key saved. Online editing enabled." : "No key saved.";
    }

    dispatchEditorChange();
  };

  ShellController.prototype.clearEditorConfig = function clearEditorConfig() {
    editorState.token = "";
    editorState.online = false;
    localRemove(EDITOR_KEYS.token);
    localSet(EDITOR_KEYS.online, "false");

    if (this.refs.editorToken) {
      this.refs.editorToken.value = "";
    }

    this.syncEditorUi();

    if (this.refs.editorPanelStatus) {
      this.refs.editorPanelStatus.textContent = "Key removed. Local editing only.";
    }

    dispatchEditorChange();
  };

  ShellController.prototype.syncEditorUi = function syncEditorUi() {
    var mode = editorMode();
    var label = mode === "online" ? "Online" : "Offline";

    if (this.refs.onlineButton) {
      this.refs.onlineButton.setAttribute("aria-pressed", mode === "online" ? "true" : "false");
    }

    if (this.refs.editorOnlineToggle) {
      this.refs.editorOnlineToggle.textContent = mode === "online" ? "Go offline" : "Go online";
      this.refs.editorOnlineToggle.setAttribute("aria-pressed", mode === "online" ? "true" : "false");
    }

    if (this.refs.editorModeLabel) {
      this.refs.editorModeLabel.textContent = label;
    }

    if (this.refs.editorStatus) {
      this.refs.editorStatus.textContent = editorStatusText();
    }

    if (this.refs.editorPanelStatus) {
      this.refs.editorPanelStatus.textContent = editorStatusText();
    }
  };

  function boot() {
    var roots = Array.prototype.slice.call(document.querySelectorAll(ROOT_SELECTOR)).filter(function topLevelOnly(root) {
      return !root.parentElement || !root.parentElement.closest(ROOT_SELECTOR);
    });

    roots.forEach(function bootRoot(root) {
      new ShellController(root).boot();
    });

    dispatchEditorChange();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, {
      once: true
    });
  } else {
    boot();
  }
}());
