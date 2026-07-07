/* ==========================================================================
   FieldOps Atlas - Blitzortung embedded map
   File: FieldOpsAtlas/Features/Weather/blitzortung.js
   Version: 0.2.0-full-page-toggle
   ========================================================================== */

(() => {
  "use strict";

  const BASE_URL = "https://map.blitzortung.org/index.php";
  const OPEN_URL = "https://map.blitzortung.org/";
  const ACTIVE_STORAGE_KEY = "fieldops-blitzortung-active-v1";

  const PARAMS = new URLSearchParams({
    interactive: "0",
    NavigationControl: "0",
    FullScreenControl: "0",
    Cookies: "0",
    InfoDiv: "0",
    MenuButtonDiv: "0",
    ScaleControl: "0",
    LightningCheckboxChecked: "1",
    LightningRangeValue: "23",
    CourseCheckboxChecked: "0",
    CountingCheckboxChecked: "0",
    CirclesCheckboxChecked: "1",
    CirclesRangeValue: "6",
    LinksCheckboxChecked: "0",
    DetectorsCheckboxChecked: "0",
    CoverageCheckboxChecked: "0",
    DayNightCheckboxChecked: "0",
    AudioCheckboxChecked: "0",
    MapStyle: "0",
    MapStyleRangeValue: "0",
    Advertisment: "0"
  });

  const VIEWS = {
    uk: "#4/54.8/-3.5",
    scandinavia: "#4/59.0/10.0",
    europe: "#3/50.0/10.0"
  };

  const frame = document.getElementById("blitzortungFrame");
  const reloadButton = document.getElementById("reloadBlitzortung");
  const openLink = document.getElementById("openBlitzortung");
  const toggleButton = document.getElementById("toggleBlitzortung");
  const inactiveState = document.getElementById("blitzortungInactive");

  let currentView = "uk";
  let isActive = readActiveState();

  function buildEmbedUrl(viewName) {
    return `${BASE_URL}?${PARAMS.toString()}${VIEWS[viewName] || VIEWS.uk}`;
  }

  function buildOpenUrl(viewName) {
    return `${OPEN_URL}${VIEWS[viewName] || VIEWS.uk}`;
  }

  function loadView(viewName) {
    if (!frame) {
      return;
    }

    currentView = Object.prototype.hasOwnProperty.call(VIEWS, viewName)
      ? viewName
      : "uk";

    if (isActive) {
      frame.src = buildEmbedUrl(currentView);
    }

    if (openLink) {
      openLink.href = buildOpenUrl(currentView);
    }
  }

  function readActiveState() {
    try {
      const stored = window.localStorage.getItem(ACTIVE_STORAGE_KEY);
      return stored === null ? true : stored === "true";
    } catch (error) {
      return true;
    }
  }

  function writeActiveState() {
    try {
      window.localStorage.setItem(ACTIVE_STORAGE_KEY, String(isActive));
    } catch (error) {
      // The page still works if storage is unavailable.
    }
  }

  function setActive(active) {
    isActive = Boolean(active);
    writeActiveState();

    frame?.classList.toggle("is-deactivated", !isActive);

    if (inactiveState) {
      inactiveState.hidden = isActive;
    }

    if (toggleButton) {
      toggleButton.textContent = isActive
        ? "Deactivate Blitzortung"
        : "Activate Blitzortung";
      toggleButton.setAttribute("aria-pressed", String(isActive));
    }

    if (isActive) {
      loadView(currentView);
    } else if (frame) {
      frame.src = "about:blank";
    }
  }

  document.querySelectorAll("[data-blitz-view]").forEach((button) => {
    button.addEventListener("click", () => {
      loadView(button.getAttribute("data-blitz-view"));
    });
  });

  reloadButton?.addEventListener("click", () => {
    if (isActive) {
      loadView(currentView);
    }
  });

  toggleButton?.addEventListener("click", () => {
    setActive(!isActive);
  });

  document.querySelectorAll(".blitzortung-panel").forEach((panel) => {
    panel.addEventListener("toggle", () => {
      window.setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 120);
    });
  });

  setActive(isActive);

  window.FieldOpsBlitzortung = {
    loadView,
    setActive,
    views: { ...VIEWS }
  };
})();
