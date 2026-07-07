/* ==========================================================================
   FieldOps Atlas - Blitzortung embedded map
   File: FieldOpsAtlas/Features/Weather/blitzortung.js
   Version: 0.1.1-circles-zoomout
   ========================================================================== */

(() => {
  "use strict";

  const BASE_URL = "https://map.blitzortung.org/index.php";
  const OPEN_URL = "https://map.blitzortung.org/";

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

  let currentView = "uk";

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

    frame.src = buildEmbedUrl(currentView);

    if (openLink) {
      openLink.href = buildOpenUrl(currentView);
    }
  }

  document.querySelectorAll("[data-blitz-view]").forEach((button) => {
    button.addEventListener("click", () => {
      loadView(button.getAttribute("data-blitz-view"));
    });
  });

  reloadButton?.addEventListener("click", () => {
    loadView(currentView);
  });

  document.querySelectorAll(".blitzortung-panel").forEach((panel) => {
    panel.addEventListener("toggle", () => {
      window.setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 120);
    });
  });

  window.FieldOpsBlitzortung = {
    loadView,
    views: { ...VIEWS }
  };
})();
