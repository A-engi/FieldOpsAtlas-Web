/* ==========================================================================
   FieldOps Atlas weather data
   File: FieldOpsAtlas/Features/maps/OSMweather-menu.js
   Version: 1.0.27-selected-region-weather
   Purpose:
   - Own Open-Meteo requests, response parsing, and short-lived weather caches.
   - Resolve the selected Atlas region from the loaded map region and its walks.
   - Return weather data to OSMpanes.js and OSMmaps.js.
   - Contain no map, cluster, RF path, toolbar, button, or panel logic.
   ========================================================================== */

(function fieldOpsOSMWeatherData() {
  "use strict";

  var VERSION = "1.0.27-selected-region-weather";
  var CACHE_MS = 10 * 60 * 1000;
  var REGION_STORAGE_KEY = "fieldops-osmmaps-selected-region-v1";
  var siteCache = new Map();
  var forecastCache = new Map();

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
    var selectedButton = document.querySelector(
      '[data-region-id][aria-pressed="true"]'
    );

    if (selectedButton) {
      return String(selectedButton.getAttribute("data-region-id") || "").trim();
    }

    try {
      return String(window.localStorage.getItem(REGION_STORAGE_KEY) || "").trim();
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
          maximumC: Math.round(Number(daily.temperature_2m_max[index])),
          minimumC: Math.round(Number(daily.temperature_2m_min[index])),
          rainMm: Number(daily.precipitation_sum[index] || 0),
          windKmh: Math.round(Number(daily.wind_speed_10m_max[index] || 0))
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

      if (!force && cached && Date.now() - cached.time < CACHE_MS) {
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
      return loadRegionForecast(selectedRegionTarget(), Boolean(force));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /*
   * Compatibility bridge for OSMpanes.js.
   * The historical function name is retained, but it now resolves the currently
   * selected map region instead of using fixed Preseli coordinates.
   */
  function loadPreseliForecast(force) {
    return loadSelectedRegionForecast(force);
  }

  window.FieldOpsOSMWeatherMenu = {
    VERSION: VERSION,
    version: VERSION,
    loadSiteWeather: loadSiteWeather,
    loadRegionForecast: loadRegionForecast,
    loadSelectedRegionForecast: loadSelectedRegionForecast,
    loadPreseliForecast: loadPreseliForecast,
    weatherCodeText: weatherCodeText
  };
}());

/* Destination: FieldOpsAtlas/Features/maps/OSMweather-menu.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMweather-menu.js | bottom/end of file */
