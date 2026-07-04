(function fieldOpsOSMWeatherData() {
  "use strict";

  var VERSION = "1.0.28-weather-panel-routing";
  var CACHE_MS = 10 * 60 * 1000;
  var REGION_STORAGE_KEY = "fieldops-osmmaps-selected-region-v1";
  var siteCache = new Map();
  var forecastCache = new Map();
  var controlsBound = false;

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(
      /[&<>"']/g,
      function replaceCharacter(character) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[character];
      }
    );
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

  function fetchJson(url, label) {
    return fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    }).then(function handleResponse(response) {
      if (!response.ok) {
        throw new Error((label || "Weather") + " unavailable.");
      }

      return response.json();
    });
  }

  function siteWeatherUrl(walk) {
    var params = new URLSearchParams({
      latitude: Number(walk.lat).toFixed(5),
      longitude: Number(walk.lng).toFixed(5),
      current: "temperature_2m,precipitation,weather_code,wind_speed_10m",
      timezone: "auto",
      forecast_days: "1"
    });

    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
  }

  function selectedRegionId() {
    var selectedButton = qs('[data-region-id][aria-pressed="true"]');

    if (selectedButton) {
      return String(
        selectedButton.getAttribute("data-region-id") || ""
      ).trim();
    }

    try {
      return String(
        window.localStorage.getItem(REGION_STORAGE_KEY) || ""
      ).trim();
    } catch (error) {
      return "";
    }
  }

  function selectedRegionTarget() {
    var maps = window.FieldOpsOSMmaps;
    var regionId = selectedRegionId();
    var regions;
    var region;
    var walks;
    var validWalks;
    var total;

    if (
      !maps ||
      typeof maps.getRegions !== "function" ||
      typeof maps.getWalks !== "function"
    ) {
      throw new Error("Map region data is not ready.");
    }

    regions = maps.getRegions();
    walks = maps.getWalks();

    region = regions.find(function findRegion(item) {
      return String(item && item.id || "") === regionId;
    });

    validWalks = walks.filter(function validCoordinates(walk) {
      return walk &&
        Number.isFinite(Number(walk.lat)) &&
        Number.isFinite(Number(walk.lng));
    });

    if (!regionId || !region) {
      throw new Error("Select a map region first.");
    }

    if (!validWalks.length) {
      throw new Error("The selected region has no forecast coordinates.");
    }

    total = validWalks.reduce(function addCoordinates(result, walk) {
      result.latitude += Number(walk.lat);
      result.longitude += Number(walk.lng);
      return result;
    }, {
      latitude: 0,
      longitude: 0
    });

    return {
      id: regionId,
      name: String(region.name || regionId),
      latitude: total.latitude / validWalks.length,
      longitude: total.longitude / validWalks.length,
      siteCount: validWalks.length
    };
  }

  function regionForecastUrl(target) {
    var latitude = Number(target && target.latitude);
    var longitude = Number(target && target.longitude);
    var params;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("The selected region has no forecast coordinates.");
    }

    params = new URLSearchParams({
      latitude: latitude.toFixed(5),
      longitude: longitude.toFixed(5),
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min," +
        "precipitation_sum,wind_speed_10m_max",
      timezone: "Europe/London",
      forecast_days: "5"
    });

    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
  }

  function loadSiteWeather(walk) {
    var cacheKey;
    var cached;

    if (
      !walk ||
      !Number.isFinite(Number(walk.lat)) ||
      !Number.isFinite(Number(walk.lng))
    ) {
      return Promise.reject(
        new Error("Site coordinates are unavailable.")
      );
    }

    cacheKey =
      Number(walk.lat).toFixed(3) +
      "," +
      Number(walk.lng).toFixed(3);
    cached = siteCache.get(cacheKey);

    if (cached && Date.now() - cached.time < CACHE_MS) {
      return Promise.resolve(cached.label);
    }

    return fetchJson(siteWeatherUrl(walk), "Site weather")
      .then(function parseSiteWeather(payload) {
        var current = payload && payload.current;
        var label;

        if (!current) {
          throw new Error("Site weather unavailable.");
        }

        label = [
          Math.round(Number(current.temperature_2m)) + "°C",
          weatherCodeText(current.weather_code),
          "Wind " +
            Math.round(Number(current.wind_speed_10m)) +
            " km/h",
          "Rain " +
            Number(current.precipitation || 0).toFixed(1) +
            " mm"
        ].join(" · ");

        siteCache.set(cacheKey, {
          time: Date.now(),
          label: label
        });

        return label;
      });
  }

  function normaliseRegionForecast(payload, target) {
    var daily = payload && payload.daily;

    if (!daily || !Array.isArray(daily.time)) {
      throw new Error("Forecast payload missing daily data.");
    }

    return {
      regionId: target.id,
      location: target.name,
      latitude: target.latitude,
      longitude: target.longitude,
      siteCount: target.siteCount,
      updatedAt: new Date().toISOString(),
      days: daily.time.map(function mapDay(dateText, index) {
        return {
          date: String(dateText || ""),
          weatherCode: Number(daily.weather_code[index]),
          summary: weatherCodeText(daily.weather_code[index]),
          maximumC: Math.round(
            Number(daily.temperature_2m_max[index])
          ),
          minimumC: Math.round(
            Number(daily.temperature_2m_min[index])
          ),
          rainMm: Number(
            daily.precipitation_sum[index] || 0
          ),
          windKmh: Math.round(
            Number(daily.wind_speed_10m_max[index] || 0)
          )
        };
      })
    };
  }

  function forecastCacheKey(target) {
    return [
      String(target.id || ""),
      Number(target.latitude).toFixed(3),
      Number(target.longitude).toFixed(3)
    ].join(":");
  }

  function loadRegionForecast(target, force) {
    var key;
    var cached;

    try {
      key = forecastCacheKey(target);
      cached = forecastCache.get(key);

      if (
        !force &&
        cached &&
        Date.now() - cached.time < CACHE_MS
      ) {
        return Promise.resolve(cached.data);
      }

      return fetchJson(
        regionForecastUrl(target),
        String(target.name || "Selected region") + " forecast"
      ).then(function parseForecast(payload) {
        var data = normaliseRegionForecast(payload, target);

        forecastCache.set(key, {
          time: Date.now(),
          data: data
        });

        return data;
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function loadSelectedRegionForecast(force) {
    try {
      return loadRegionForecast(
        selectedRegionTarget(),
        Boolean(force)
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function setWeatherStatus(message) {
    var output = qs("[data-weather-output]");

    if (output) {
      output.textContent = message || "";
    }
  }

  function setWeatherUpdated(message) {
    var output = qs("[data-weather-forecast-updated]");

    if (output) {
      output.textContent = message || "";
    }
  }

  function renderForecastPlaceholder(message) {
    var track = qs("[data-weather-forecast-track]");

    if (!track) {
      return;
    }

    track.innerHTML = [
      '<article class="weather-forecast-card ',
      'weather-forecast-card-placeholder" role="listitem">',
      escapeHtml(message || "Loading forecast..."),
      "</article>"
    ].join("");
  }

  function formatDay(dateText) {
    var date = new Date(String(dateText || "") + "T12:00:00");

    if (Number.isNaN(date.getTime())) {
      return String(dateText || "");
    }

    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  }

  function renderPanelForecast(data) {
    var track = qs("[data-weather-forecast-track]");
    var days = data && Array.isArray(data.days)
      ? data.days
      : [];

    if (!track || !days.length) {
      throw new Error("Forecast data is unavailable.");
    }

    track.innerHTML = days.map(function renderDay(day) {
      return [
        '<article class="weather-forecast-card" role="listitem">',
        "<strong>", escapeHtml(formatDay(day.date)), "</strong>",
        "<span>", escapeHtml(day.summary), "</span>",
        "<span>",
        escapeHtml(day.minimumC),
        "–",
        escapeHtml(day.maximumC),
        "°C</span>",
        "<span>Rain ",
        escapeHtml(Number(day.rainMm || 0).toFixed(1)),
        " mm</span>",
        "<span>Wind ",
        escapeHtml(day.windKmh),
        " km/h</span>",
        "</article>"
      ].join("");
    }).join("");

    setWeatherUpdated("Updated now");
    setWeatherStatus(
      "Forecast loaded for " +
      String(data.location || "selected region") +
      "."
    );
  }

  function loadWeatherPanelForecast(force) {
    setWeatherUpdated("Loading");
    setWeatherStatus("Loading selected region forecast...");
    renderForecastPlaceholder("Loading forecast...");

    return loadSelectedRegionForecast(Boolean(force))
      .then(renderPanelForecast)
      .catch(function forecastError(error) {
        setWeatherUpdated("Not loaded");
        setWeatherStatus(
          error.message ||
          "Selected region forecast unavailable."
        );
        renderForecastPlaceholder("Forecast unavailable. Try again from the map weather panel.");
      });
  }

  function installWarningStateStyles() {
    var style;

    if (qs("#fieldops-weather-warning-state-fix")) {
      return;
    }

    style = document.createElement("style");
    style.id = "fieldops-weather-warning-state-fix";
    style.textContent = [
      ".map-quick-tool.is-weather:not(.has-weather-warning),",
      ".map-weather-collapsed-button:not(.has-weather-warning){",
      "border-color:rgba(126,190,235,.48)!important;",
      "background:linear-gradient(135deg,rgba(29,75,114,.98),",
      "rgba(8,35,67,.98))!important;",
      "box-shadow:inset 0 1px 0 rgba(255,255,255,.14),",
      "0 5px 12px rgba(0,0,0,.22)!important;",
      "}",
      ".map-quick-tool.is-weather:not(.has-weather-warning) ",
      ".map-weather-active-label,",
      ".map-weather-collapsed-button:not(.has-weather-warning) ",
      ".map-weather-active-label,",
      ".map-quick-tool.is-weather:not(.has-weather-warning) ",
      "[data-metoffice-warning-button],",
      ".map-weather-collapsed-button:not(.has-weather-warning) ",
      "[data-metoffice-warning-button]{display:none!important;}",
      ".map-weather-active-label[hidden],",
      "[data-metoffice-warning-button][hidden],",
      "[data-metoffice-warning-card][hidden]{display:none!important;}"
    ].join("");
    document.head.appendChild(style);
  }

  function weatherPanelIsOpen() {
    var panel = qs(".weather-api-panel");
    return Boolean(panel && !panel.hidden);
  }

  function bindWeatherPanelControls() {
    if (controlsBound) {
      return;
    }

    controlsBound = true;

    document.addEventListener("click", function handleWeatherClick(event) {
      var weatherOpen =
        event.target.closest("[data-weather-panel-open]");
      var regionButton =
        event.target.closest("[data-region-id]");

      if (weatherOpen) {
        window.setTimeout(function loadAfterPanelOpen() {
          loadWeatherPanelForecast(false);
        }, 0);
        return;
      }

      if (regionButton && weatherPanelIsOpen()) {
        window.setTimeout(function reloadSelectedRegion() {
          loadWeatherPanelForecast(true);
        }, 250);
      }
    }, false);
  }

  function initWeatherPanelBehaviour() {
    installWarningStateStyles();
    bindWeatherPanelControls();
  }

  window.FieldOpsOSMWeatherMenu = {
    VERSION: VERSION,
    version: VERSION,
    loadSiteWeather: loadSiteWeather,
    loadRegionForecast: loadRegionForecast,
    loadSelectedRegionForecast: loadSelectedRegionForecast,
    loadWeatherPanelForecast: loadWeatherPanelForecast,
    weatherCodeText: weatherCodeText
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initWeatherPanelBehaviour,
      { once: true }
    );
  } else {
    initWeatherPanelBehaviour();
  }
}());
