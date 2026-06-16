/* ==========================================================================
   FieldOps Atlas OSM weather menu
   File: FieldOpsAtlas/Features/maps/OSMweather-menu.js
   Version: 1.0.0-weather-lab-menu
   Purpose:
   - Converts each walk details weather button into a small menu.
   - Keeps the existing Open-Meteo activate action via data-load-weather.
   - Adds a local Weather Lab link under FieldOpsAtlas/Features/Weather/Lab/.
   ========================================================================== */

(function fieldOpsOSMWeatherMenu() {
  "use strict";

  var VERSION = "1.0.0-weather-lab-menu";
  var LAB_URL = "../Weather/Lab/index.html";

  function enhanceWeatherButton(button) {
    var walkId = button.getAttribute("data-load-weather");

    if (!walkId || button.dataset.weatherMenuEnhanced === "true") {
      return;
    }

    button.dataset.weatherMenuEnhanced = "true";

    var menu = document.createElement("div");
    menu.className = "osmpanes-weather-menu";
    menu.setAttribute("data-weather-menu", "true");

    var copy = document.createElement("p");
    copy.className = "osmpanes-weather-menu-copy";
    copy.textContent = "Choose whether to activate quick site weather here or open the provider test lab.";

    var actions = document.createElement("div");
    actions.className = "osmpanes-weather-menu-actions";

    var activate = document.createElement("button");
    activate.className = "osmpanes-weather-menu-activate";
    activate.type = "button";
    activate.setAttribute("data-load-weather", walkId);
    activate.textContent = "Activate weather";

    var lab = document.createElement("a");
    lab.className = "osmpanes-weather-menu-link";
    lab.href = LAB_URL;
    lab.textContent = "Open Weather Lab";

    actions.appendChild(activate);
    actions.appendChild(lab);
    menu.appendChild(copy);
    menu.appendChild(actions);

    button.replaceWith(menu);
  }

  function enhanceWeatherMenus(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-load-weather]").forEach(enhanceWeatherButton);
  }

  function init() {
    enhanceWeatherMenus(document);

    var observer = new MutationObserver(function onMutations(mutations) {
      mutations.forEach(function onMutation(mutation) {
        mutation.addedNodes.forEach(function onAddedNode(node) {
          if (!node || node.nodeType !== 1) {
            return;
          }

          if (node.matches && node.matches("[data-load-weather]")) {
            enhanceWeatherButton(node);
            return;
          }

          enhanceWeatherMenus(node);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.FieldOpsOSMWeatherMenu = {
      version: VERSION,
      enhance: enhanceWeatherMenus
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

// End of file: FieldOpsAtlas/Features/maps/OSMweather-menu.js
