/* ==========================================================================
   FieldOps Atlas - SP Networks embedded outage map
   File: FieldOpsAtlas/Features/Weather/sp-outages.js
   Version: 0.2.0-official-embed
   ========================================================================== */

(() => {
  "use strict";

  const ACTIVE_STORAGE_KEY = "fieldops-sp-networks-active-v1";

  const VIEWS = {
    map: "https://powercuts.spenergynetworks.co.uk/map",
    list: "https://powercuts.spenergynetworks.co.uk/list"
  };

  const frame = document.getElementById("spNetworksFrame");
  const reloadButton = document.getElementById("reloadSpNetworks");
  const openLink = document.getElementById("openSpNetworks");
  const toggleButton = document.getElementById("toggleSpNetworks");
  const inactiveState = document.getElementById("spNetworksInactive");

  let currentView = "map";
  let isActive = readActiveState();

  function viewUrl(viewName) {
    return VIEWS[viewName] || VIEWS.map;
  }

  function loadView(viewName) {
    currentView = Object.prototype.hasOwnProperty.call(VIEWS, viewName)
      ? viewName
      : "map";

    if (isActive && frame) {
      frame.src = viewUrl(currentView);
    }

    if (openLink) {
      openLink.href = viewUrl(currentView);
      openLink.textContent = currentView === "list"
        ? "Open full SP Networks list"
        : "Open full SP Networks map";
    }

    document.querySelectorAll("[data-sp-view]").forEach((button) => {
      button.classList.toggle(
        "is-primary",
        button.getAttribute("data-sp-view") === currentView
      );
    });
  }

  function readActiveState() {
    try {
      const stored = window.localStorage.getItem(ACTIVE_STORAGE_KEY);
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  }

  function writeActiveState() {
    try {
      window.localStorage.setItem(ACTIVE_STORAGE_KEY, String(isActive));
    } catch {
      // The page remains usable when local storage is unavailable.
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
        ? "Deactivate SP Networks"
        : "Activate SP Networks";
      toggleButton.setAttribute("aria-pressed", String(isActive));
    }

    if (isActive) {
      loadView(currentView);
    } else if (frame) {
      frame.src = "about:blank";
    }
  }

  document.querySelectorAll("[data-sp-view]").forEach((button) => {
    button.addEventListener("click", () => {
      loadView(button.getAttribute("data-sp-view"));
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

  document.querySelectorAll(".sp-networks-panel").forEach((panel) => {
    panel.addEventListener("toggle", () => {
      window.setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 120);
    });
  });

  setActive(isActive);

  window.FieldOpsSpNetworks = {
    loadView,
    setActive,
    views: { ...VIEWS }
  };
})();
