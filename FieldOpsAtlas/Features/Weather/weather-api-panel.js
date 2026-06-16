/* ==========================================================================
   FieldOps Atlas weather API panel
   File: FieldOpsAtlas/Features/Weather/weather-api-panel.js
   Version: v1.0.4-weather-activate-history
   Purpose:
   - Keep one map only: the existing FieldOps Atlas OSM map.
   - Weather button opens a compact Preseli preview panel.
   - Activate link opens the Weather pages at the History anchor.
   ========================================================================== */

(function fieldOpsWeatherApiPanel() {
  "use strict";

  var VERSION = "v1.0.4-weather-activate-history";
  var OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";
  var STORAGE_KEY = "fieldops-osmmaps-theme-v1";
  var PRESELI = {
    name: "Preseli area",
    latitude: 51.946,
    longitude: -4.735
  };

  var forecastLoaded = false;
  var forecastLoading = false;

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function safeLocalGet(key) {
    try {
      return window.localStorage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }

  function safeLocalSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Local storage can be unavailable in previews or restricted webviews.
    }
  }

  function status(message) {
    var element = qs("[data-weather-output]");
    if (element) {
      element.textContent = message;
    }
  }

  function updatedLabel(message) {
    var element = qs("[data-weather-forecast-updated]");
    if (element) {
      element.textContent = message;
    }
  }

  function openPanel() {
    var panel = qs(".weather-api-panel");
    var icon = qs("[data-weather-panel-open]");

    if (panel) {
      panel.hidden = false;
    }

    if (icon) {
      icon.setAttribute("aria-expanded", "true");
    }

    loadPreseliForecast();
  }

  function closePanel() {
    var panel = qs(".weather-api-panel");
    var icon = qs("[data-weather-panel-open]");

    if (panel) {
      panel.hidden = true;
    }

    if (icon) {
      icon.setAttribute("aria-expanded", "false");
    }
  }

  function togglePanel() {
    var panel = qs(".weather-api-panel");

    if (!panel || panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  }

  function weatherIcon(code) {
    if (code === 0) {
      return "☀";
    }

    if (code === 1 || code === 2) {
      return "🌤";
    }

    if (code === 3 || code === 45 || code === 48) {
      return "☁";
    }

    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return "🌧";
    }

    if (code >= 71 && code <= 77) {
      return "❄";
    }

    if (code >= 95) {
      return "⛈";
    }

    return "☁";
  }

  function formatDay(value) {
    var date = new Date(value + "T12:00:00");
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit"
    });
  }

  function round(value) {
    var number = Number(value);
    return Number.isFinite(number) ? Math.round(number) : "—";
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

  function renderForecast(payload) {
    var daily = payload && payload.daily ? payload.daily : {};
    var dates = Array.isArray(daily.time) ? daily.time : [];
    var max = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max : [];
    var min = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min : [];
    var rain = Array.isArray(daily.precipitation_probability_max) ? daily.precipitation_probability_max : [];
    var gusts = Array.isArray(daily.wind_gusts_10m_max) ? daily.wind_gusts_10m_max : [];
    var codes = Array.isArray(daily.weather_code) ? daily.weather_code : [];
    var track = qs("[data-weather-forecast-track]");

    if (!track) {
      return;
    }

    if (!dates.length) {
      track.innerHTML = '<article class="weather-forecast-card weather-forecast-card-placeholder" role="listitem">No forecast returned.</article>';
      status("Forecast returned no daily data.");
      return;
    }

    track.innerHTML = dates.slice(0, 7).map(function mapDay(date, index) {
      var code = Number(codes[index] || 0);

      return [
        '<article class="weather-forecast-card" role="listitem">',
        '<p class="weather-forecast-day">' + escapeHtml(formatDay(date)) + '</p>',
        '<p class="weather-forecast-icon" aria-hidden="true">' + escapeHtml(weatherIcon(code)) + '</p>',
        '<p class="weather-forecast-temp">' + escapeHtml(round(min[index])) + '–' + escapeHtml(round(max[index])) + '°C</p>',
        '<p class="weather-forecast-meta">Rain ' + escapeHtml(round(rain[index])) + '%</p>',
        '<p class="weather-forecast-meta">Gust ' + escapeHtml(round(gusts[index])) + ' mph</p>',
        '</article>'
      ].join("");
    }).join("");

    forecastLoaded = true;
    updatedLabel("Updated " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    status("Activate opens Weather history. " + VERSION);
  }

  function fetchJson(url) {
    return fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    }).then(function handleResponse(response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      return response.json();
    });
  }

  function loadPreseliForecast() {
    var params;

    if (forecastLoaded || forecastLoading) {
      return;
    }

    forecastLoading = true;
    status("Loading Preseli forecast preview...");

    params = new URLSearchParams({
      latitude: PRESELI.latitude,
      longitude: PRESELI.longitude,
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_gusts_10m_max",
      forecast_days: "7",
      timezone: "Europe/London",
      wind_speed_unit: "mph"
    });

    fetchJson(OPEN_METEO_API + "?" + params.toString())
      .then(renderForecast)
      .catch(function handleError(error) {
        status("Preseli forecast preview failed: " + error.message);
      })
      .finally(function clearLoading() {
        forecastLoading = false;
      });
  }

  function applyTheme(theme) {
    var nextTheme = theme === "light" ? "light" : "dark";
    var page = qs("[data-osmmaps-page]");

    if (page) {
      page.setAttribute("data-theme", nextTheme);
    }

    safeLocalSet(STORAGE_KEY, nextTheme);
  }

  function initialTheme() {
    var stored = safeLocalGet(STORAGE_KEY);

    if (stored === "light" || stored === "dark") {
      return stored;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }

    return "dark";
  }

  function wireControls() {
    document.addEventListener("click", function onClick(event) {
      if (event.target.closest("[data-weather-panel-open]")) {
        togglePanel();
        return;
      }

      if (event.target.closest("[data-weather-panel-close]")) {
        closePanel();
      }
    });
  }

  function init() {
    wireControls();
    applyTheme(initialTheme());
    closePanel();
    status(VERSION);
    window.FieldOpsWeatherApiPanel = {
      version: VERSION,
      open: openPanel,
      close: closePanel,
      loadPreseliForecast: loadPreseliForecast
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

// End of file: FieldOpsAtlas/Features/Weather/weather-api-panel.js
