/* ==========================================================================
   FieldOps Atlas weather data
   File: FieldOpsAtlas/Features/maps/OSMweather-menu.js
   Version: 1.0.26-weather-data-only
   Purpose:
   - Own Open-Meteo requests, response parsing, and short-lived weather caches.
   - Return weather data to OSMpanes.js and OSMmaps.js.
   - Contain no map, cluster, RF path, toolbar, button, or panel logic.
   ========================================================================== */

(function fieldOpsOSMWeatherData() {
  "use strict";

  var VERSION = "1.0.26-weather-data-only";
  var CACHE_MS = 10 * 60 * 1000;
  var PRESELI = {
    name: "Preseli area",
    lat: 51.921,
    lng: -4.742
  };
  var siteCache = new Map();
  var previewCache = null;

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

  function previewUrl() {
    var params = new URLSearchParams({
      latitude: PRESELI.lat.toFixed(4),
      longitude: PRESELI.lng.toFixed(4),
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
      timezone: "Europe/London",
      forecast_days: "5"
    });

    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
  }

  function loadSiteWeather(walk) {
    if (!walk || !Number.isFinite(Number(walk.lat)) || !Number.isFinite(Number(walk.lng))) {
      return Promise.reject(new Error("Site coordinates are unavailable."));
    }

    var cacheKey = Number(walk.lat).toFixed(3) + "," + Number(walk.lng).toFixed(3);
    var cached = siteCache.get(cacheKey);

    if (cached && Date.now() - cached.time < CACHE_MS) {
      return Promise.resolve(cached.label);
    }

    return fetchJson(siteWeatherUrl(walk), "Site weather")
      .then(function parseSiteWeather(payload) {
        var current = payload && payload.current;

        if (!current) {
          throw new Error("Site weather unavailable.");
        }

        var label = [
          Math.round(Number(current.temperature_2m)) + "°C",
          weatherCodeText(current.weather_code),
          "Wind " + Math.round(Number(current.wind_speed_10m)) + " km/h",
          "Rain " + Number(current.precipitation || 0).toFixed(1) + " mm"
        ].join(" · ");

        siteCache.set(cacheKey, {
          time: Date.now(),
          label: label
        });

        return label;
      });
  }

  function normalisePreview(payload) {
    var daily = payload && payload.daily;

    if (!daily || !Array.isArray(daily.time)) {
      throw new Error("Forecast payload missing daily data.");
    }

    return {
      location: PRESELI.name,
      updatedAt: new Date().toISOString(),
      days: daily.time.map(function mapDay(dateText, index) {
        return {
          date: String(dateText || ""),
          weatherCode: Number(daily.weather_code[index]),
          summary: weatherCodeText(daily.weather_code[index]),
          maximumC: Math.round(Number(daily.temperature_2m_max[index])),
          minimumC: Math.round(Number(daily.temperature_2m_min[index])),
          rainMm: Number(daily.precipitation_sum[index] || 0),
          windKmh: Math.round(Number(daily.wind_speed_10m_max[index] || 0))
        };
      })
    };
  }

  function loadPreseliForecast() {
    if (previewCache && Date.now() - previewCache.time < CACHE_MS) {
      return Promise.resolve(previewCache.data);
    }

    return fetchJson(previewUrl(), "Preseli forecast")
      .then(function parsePreview(payload) {
        var data = normalisePreview(payload);

        previewCache = {
          time: Date.now(),
          data: data
        };

        return data;
      });
  }

  window.FieldOpsOSMWeatherMenu = {
    VERSION: VERSION,
    version: VERSION,
    loadSiteWeather: loadSiteWeather,
    loadPreseliForecast: loadPreseliForecast,
    weatherCodeText: weatherCodeText
  };
}());

/* Destination: FieldOpsAtlas/Features/maps/OSMweather-menu.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMweather-menu.js | bottom/end of file */
