/* ========================================================================== 
   FieldOps Atlas OSM weather menu
   File: FieldOpsAtlas/Features/maps/OSMweather-menu.js
   Version: 1.0.2-preview-freeze-fix
   Purpose:
   - Converts each walk details weather button into a small site-weather menu.
   - Keeps the existing Open-Meteo quick site weather action via data-load-weather.
   - Adds a link to the full Weather feature page.
   - Prevents the MutationObserver from repeatedly enhancing its own inserted button.
   ========================================================================== */
(function fieldOpsOSMWeatherMenu() {
  "use strict";

  var VERSION = "1.0.2-preview-freeze-fix";
  var WEATHER_URL = "../Weather/index.html";

  function shouldEnhance(button) {
    return Boolean(
      button &&
      button.matches &&
      button.matches("[data-load-weather]") &&
      button.dataset.weatherMenuEnhanced !== "true" &&
      !button.closest("[data-weather-menu]")
    );
  }

  function enhanceWeatherButton(button) {
    var walkId = button && button.getAttribute("data-load-weather");

    if (!walkId || !shouldEnhance(button)) {
      return;
    }

    button.dataset.weatherMenuEnhanced = "true";

    var menu = document.createElement("div");
    menu.className = "osmpanes-weather-menu";
    menu.setAttribute("data-weather-menu", "true");

    var copy = document.createElement("p");
    copy.className = "osmpanes-weather-menu-copy";
    copy.textContent = "Quick site weather here, or open the full Weather page.";

    var actions = document.createElement("div");
    actions.className = "osmpanes-weather-menu-actions";

    var activate = document.createElement("button");
    activate.className = "osmpanes-weather-menu-activate";
    activate.type = "button";
    activate.setAttribute("data-load-weather", walkId);
    activate.setAttribute("data-weather-menu-activate", "true");
    activate.textContent = "Activate site weather";

    var weatherPage = document.createElement("a");
    weatherPage.className = "osmpanes-weather-menu-link";
    weatherPage.href = WEATHER_URL;
    weatherPage.textContent = "Open Weather page";

    actions.appendChild(activate);
    actions.appendChild(weatherPage);
    menu.appendChild(copy);
    menu.appendChild(actions);

    button.replaceWith(menu);
  }

  function enhanceWeatherMenus(root) {
    var scope = root || document;

    if (scope.nodeType !== 1 && scope.nodeType !== 9 && scope.nodeType !== 11) {
      return;
    }

    if (scope.matches && shouldEnhance(scope)) {
      enhanceWeatherButton(scope);
      return;
    }

    scope.querySelectorAll("[data-load-weather]").forEach(function eachWeatherButton(button) {
      if (shouldEnhance(button)) {
        enhanceWeatherButton(button);
      }
    });
  }

  function init() {
    enhanceWeatherMenus(document);

    var observer = new MutationObserver(function onMutations(mutations) {
      mutations.forEach(function onMutation(mutation) {
        mutation.addedNodes.forEach(function onAddedNode(node) {
          enhanceWeatherMenus(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

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
}());

// End of file: FieldOpsAtlas/Features/maps/OSMweather-menu.js | bottom/end of file
