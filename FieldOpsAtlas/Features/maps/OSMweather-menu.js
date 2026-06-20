/* ========================================================================== 
   FieldOps Atlas map quick tools and weather preview
   File: FieldOpsAtlas/Features/maps/OSMweather-menu.js
   Version: 1.0.11-map-quick-tools
   Purpose:
   - Controls the collapsible DTT, DAB, FM, and Weather button rail.
   - Controls the small map Weather preview panel.
   - Makes no Weather API request until Activate preview is tapped.
   ========================================================================== */

(function fieldOpsOSMWeatherPreview() {
  "use strict";

  var VERSION = "1.0.11-map-quick-tools";
  var PRESELI = {
    name: "Preseli area",
    lat: 51.921,
    lng: -4.742
  };
  var FORECAST_CACHE_MS = 10 * 60 * 1000;
  var TOOLBAR_STORAGE_KEY = "fieldops.maps.quick-tools.collapsed";
  var TOOLBAR_COLLAPSED_CLASS = "is-collapsed";
  var cache = null;

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function readToolbarCollapsed() {
    try {
      return window.localStorage.getItem(TOOLBAR_STORAGE_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function saveToolbarCollapsed(collapsed) {
    try {
      window.localStorage.setItem(TOOLBAR_STORAGE_KEY, String(collapsed));
    } catch (error) {
      // Storage can be blocked inside previews and webviews.
    }
  }

  function setToolbarCollapsed(collapsed, persist) {
    var toolbar = qs("[data-map-quick-tools]");
    var toggle = qs("[data-map-quick-toggle]");

    if (!toolbar || !toggle) {
      return;
    }

    toolbar.classList.toggle(TOOLBAR_COLLAPSED_CLASS, collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute(
      "aria-label",
      collapsed ? "Expand map quick tools" : "Collapse map quick tools"
    );

    if (collapsed) {
      setPanelOpen(false);
    }

    if (persist !== false) {
      saveToolbarCollapsed(collapsed);
    }
  }

  function toggleToolbar() {
    var toolbar = qs("[data-map-quick-tools]");

    if (!toolbar) {
      return;
    }

    setToolbarCollapsed(!toolbar.classList.contains(TOOLBAR_COLLAPSED_CLASS));
  }

  function weatherCodeText(code) {
    var labels = {
      0: "Clear",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime fog",
      51: "Light drizzle",
      53: "Drizzle",
      55: "Dense drizzle",
      61: "Light rain",
      63: "Rain",
      65: "Heavy rain",
      71: "Light snow",
      73: "Snow",
      75: "Heavy snow",
      80: "Rain showers",
      81: "Heavy showers",
      82: "Violent showers",
      95: "Thunderstorm",
      96: "Thunderstorm hail",
      99: "Heavy thunderstorm hail"
    };

    return labels[Number(code)] || "Weather code " + code;
  }

  function forecastUrl() {
    var params = new URLSearchParams({
      latitude: PRESELI.lat.toFixed(4),
      longitude: PRESELI.lng.toFixed(4),
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
      timezone: "Europe/London",
      forecast_days: "5"
    });

    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
  }

  function setPanelOpen(open) {
    var panel = qs(".weather-api-panel");

    if (panel) {
      panel.hidden = !open;
    }

    qsa("[data-weather-panel-open]").forEach(function syncOpenButton(button) {
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setStatus(message) {
    var output = qs("[data-weather-output]");

    if (output) {
      output.textContent = message;
    }
  }

  function setUpdated(message) {
    var output = qs("[data-weather-forecast-updated]");

    if (output) {
      output.textContent = message;
    }
  }

  function renderPlaceholder(message) {
    var track = qs("[data-weather-forecast-track]");

    if (!track) {
      return;
    }

    track.innerHTML = [
      '<article class="weather-forecast-card weather-forecast-card-placeholder" role="listitem">',
      message,
      "</article>"
    ].join("");
  }

  function formatDay(dateText) {
    var date = new Date(dateText + "T12:00:00");

    if (Number.isNaN(date.getTime())) {
      return dateText;
    }

    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  }

  function renderForecast(payload) {
    var track = qs("[data-weather-forecast-track]");
    var daily = payload && payload.daily;

    if (!track || !daily || !Array.isArray(daily.time)) {
      throw new Error("Forecast payload missing daily data.");
    }

    track.innerHTML = daily.time.map(function renderDay(dateText, index) {
      var max = Math.round(Number(daily.temperature_2m_max[index]));
      var min = Math.round(Number(daily.temperature_2m_min[index]));
      var rain = Number(daily.precipitation_sum[index] || 0).toFixed(1);
      var wind = Math.round(Number(daily.wind_speed_10m_max[index] || 0));
      var summary = weatherCodeText(daily.weather_code[index]);

      return [
        '<article class="weather-forecast-card" role="listitem">',
        "<strong>", formatDay(dateText), "</strong>",
        "<span>", summary, "</span>",
        "<span>", min, "–", max, "°C</span>",
        "<span>Rain ", rain, " mm</span>",
        "<span>Wind ", wind, " km/h</span>",
        "</article>"
      ].join("");
    }).join("");

    setUpdated("Updated now");
    setStatus("Preview loaded for " + PRESELI.name + ".");
  }

  function activatePreview() {
    if (cache && Date.now() - cache.time < FORECAST_CACHE_MS) {
      renderForecast(cache.payload);
      return;
    }

    setUpdated("Loading");
    setStatus("Loading Preseli preview...");
    renderPlaceholder("Loading preview...");

    fetch(forecastUrl(), {
      headers: {
        Accept: "application/json"
      }
    })
      .then(function handleResponse(response) {
        if (!response.ok) {
          throw new Error("Forecast unavailable.");
        }

        return response.json();
      })
      .then(function handlePayload(payload) {
        cache = {
          time: Date.now(),
          payload: payload
        };
        renderForecast(payload);
      })
      .catch(function handleError() {
        setUpdated("Not loaded");
        setStatus("Preseli preview unavailable.");
        renderPlaceholder("Preview unavailable. Open full Weather for provider pages.");
      });
  }

  function wirePreview() {
    document.addEventListener("click", function onClick(event) {
      var toolbarToggle = event.target.closest("[data-map-quick-toggle]");
      var openButton = event.target.closest("[data-weather-panel-open]");
      var closeButton = event.target.closest("[data-weather-panel-close]");
      var activateButton = event.target.closest("[data-weather-activate]");

      if (toolbarToggle) {
        event.preventDefault();
        event.stopPropagation();
        toggleToolbar();
        return;
      }

      if (openButton) {
        event.preventDefault();
        event.stopPropagation();
        setPanelOpen(true);
        return;
      }

      if (closeButton) {
        event.preventDefault();
        event.stopPropagation();
        setPanelOpen(false);
        return;
      }

      if (activateButton) {
        event.preventDefault();
        event.stopPropagation();
        activatePreview();
      }
    }, false);

    document.addEventListener("keydown", function onKeyDown(event) {
      if (event.key === "Escape") {
        setPanelOpen(false);
      }
    });
  }

  function init() {
    qsa("[data-weather-panel-open]").forEach(function initButton(button) {
      button.setAttribute("aria-expanded", "false");
    });

    setToolbarCollapsed(readToolbarCollapsed(), false);
    renderPlaceholder("Tap Activate preview.");
    wirePreview();

    window.FieldOpsOSMWeatherMenu = {
      VERSION: VERSION,
      version: VERSION,
      open: function open() {
        setPanelOpen(true);
      },
      close: function close() {
        setPanelOpen(false);
      },
      activate: activatePreview,
      collapseTools: function collapseTools() {
        setToolbarCollapsed(true);
      },
      expandTools: function expandTools() {
        setToolbarCollapsed(false);
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* Destination: FieldOpsAtlas/Features/maps/OSMweather-menu.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMweather-menu.js | bottom/end of file */
