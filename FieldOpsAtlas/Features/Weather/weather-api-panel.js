/* ==========================================================================
   FieldOps Atlas weather API panel
   File: FieldOpsAtlas/Features/Weather/weather-api-panel.js
   Version: 1.0.0-existing-map-only
   Purpose:
   - Keep one map only: the existing FieldOps Atlas OSM map.
   - Remove provider-owned map creation and provider image previews.
   - Run weather API checks as data/results panels against the selected map walk.
   ========================================================================== */

(function fieldOpsWeatherApiPanel() {
  "use strict";

  var VERSION = "1.0.0-existing-map-only";
  var STORAGE_KEYS = {
    theme: "fieldops-osmmaps-theme-v1",
    metOfficeKey: "fieldops-weather-metoffice-key-local-v1",
    metOfficeOrder: "fieldops-weather-metoffice-order-local-v1"
  };

  var RAINVIEWER_API = "https://api.rainviewer.com/public/weather-maps.json";
  var OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";
  var EA_API = "https://environment.data.gov.uk/flood-monitoring/id/stations";
  var METOFFICE_API = "https://data.hub.api.metoffice.gov.uk/map-images/1.0.0";

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function output(value) {
    var element = qs("[data-weather-output]");
    if (!element) {
      return;
    }

    element.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  }

  function setActiveSource(source) {
    qsa("[data-weather-source]").forEach(function update(button) {
      button.dataset.active = button.getAttribute("data-weather-source") === source ? "true" : "false";
    });

    var metOfficeFields = qs("[data-weather-metoffice-fields]");
    if (metOfficeFields) {
      metOfficeFields.hidden = source !== "metoffice";
    }
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

  function selectedWalk() {
    if (!window.FieldOpsOSMmaps || typeof window.FieldOpsOSMmaps.getSelectedWalk !== "function") {
      return null;
    }

    return window.FieldOpsOSMmaps.getSelectedWalk();
  }

  function requireSelectedWalk() {
    var walk = selectedWalk();

    if (!walk) {
      output("Select a marker on the existing Atlas map first, then run this weather check.");
      return null;
    }

    return walk;
  }

  function fetchJson(url, options) {
    return fetch(url, Object.assign({ cache: "no-store" }, options || {})).then(function handleResponse(response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status + " from " + url);
      }

      return response.json();
    });
  }

  function round(value, places) {
    var factor = Math.pow(10, places == null ? 1 : places);
    return Math.round(Number(value || 0) * factor) / factor;
  }

  function normaliseOrderId(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, "-");
  }

  function checkOpenMeteo() {
    var walk = requireSelectedWalk();

    if (!walk) {
      return;
    }

    var params = new URLSearchParams({
      latitude: Number(walk.lat).toFixed(5),
      longitude: Number(walk.lng).toFixed(5),
      current: "temperature_2m,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m",
      forecast_days: "1",
      timezone: "Europe/London",
      wind_speed_unit: "mph"
    });

    output("Loading Open-Meteo site risk for " + walk.name + "...");

    fetchJson(OPEN_METEO_API + "?" + params.toString())
      .then(function handleOpenMeteo(payload) {
        var current = payload.current || {};
        var gust = Number(current.wind_gusts_10m || 0);
        var wind = Number(current.wind_speed_10m || 0);
        var rain = Number(current.rain || current.precipitation || 0);
        var cloud = Number(current.cloud_cover || 0);
        var weatherCode = Number(current.weather_code || 0);

        output({
          source: "Open-Meteo",
          map: "Existing Atlas OSM map only",
          site: walk.name,
          coordinates: [walk.lat, walk.lng],
          current: {
            temperatureC: current.temperature_2m,
            windMph: round(wind, 1),
            gustMph: round(gust, 1),
            rainMm: round(rain, 1),
            cloudPercent: round(cloud, 0),
            weatherCode: weatherCode
          },
          note: "No Open-Meteo map is created. These values are attached to the selected Atlas map marker."
        });
      })
      .catch(function handleError(error) {
        output("Open-Meteo failed: " + error.message);
      });
  }

  function checkRainViewer() {
    output("Loading RainViewer metadata only...");

    fetchJson(RAINVIEWER_API)
      .then(function handleRainViewer(payload) {
        var frames = payload && payload.radar && Array.isArray(payload.radar.past) ? payload.radar.past : [];
        var latest = frames[frames.length - 1];

        if (!latest || !payload.host) {
          throw new Error("No radar frames returned.");
        }

        output({
          source: "RainViewer",
          map: "Existing Atlas OSM map only",
          frameCount: frames.length,
          latestFrameTime: new Date(latest.time * 1000).toLocaleString("en-GB"),
          host: payload.host,
          latestPath: latest.path,
          note: "No RainViewer map or embedded radar page is created. This only proves metadata access."
        });
      })
      .catch(function handleError(error) {
        output("RainViewer failed: " + error.message);
      });
  }

  function checkMetOffice() {
    var keyField = qs("[data-metoffice-key]");
    var orderField = qs("[data-metoffice-order]");
    var key = keyField ? keyField.value.trim() : "";
    var order = normaliseOrderId(orderField ? orderField.value : "");

    if (!key || !order) {
      output("Enter a DataHub API key and API Order ID. The key stays in this browser only.");
      return;
    }

    safeLocalSet(STORAGE_KEYS.metOfficeKey, key);
    safeLocalSet(STORAGE_KEYS.metOfficeOrder, order);

    var url = METOFFICE_API + "/orders/" + encodeURIComponent(order) + "/latest?detail=MINIMAL";

    output("Loading Met Office order list only...");

    fetchJson(url, {
      headers: {
        "Accept": "application/json",
        "apikey": key
      }
    })
      .then(function handleMetOffice(payload) {
        var files = [];

        if (payload && payload.orderDetails && Array.isArray(payload.orderDetails.files)) {
          files = payload.orderDetails.files;
        } else if (payload && Array.isArray(payload.files)) {
          files = payload.files;
        } else if (payload && Array.isArray(payload.items)) {
          files = payload.items;
        }

        output({
          source: "Met Office DataHub Map Images",
          map: "Existing Atlas OSM map only",
          order: order,
          fileCount: files.length,
          sampleFiles: files.slice(0, 8).map(function mapFile(file) {
            return typeof file === "string" ? file : file.fileId || file.filename || file.name || file.id || "unknown";
          }),
          note: "No Met Office PNG map preview is created. The old provider image map is removed."
        });
      })
      .catch(function handleError(error) {
        output("Met Office request failed: " + error.message);
      });
  }

  function checkEaRainfall() {
    var walk = requireSelectedWalk();

    if (!walk) {
      return;
    }

    var params = new URLSearchParams({
      parameter: "rainfall",
      lat: Number(walk.lat).toFixed(5),
      long: Number(walk.lng).toFixed(5),
      dist: "25",
      _view: "full"
    });

    output("Loading Environment Agency rainfall gauges near " + walk.name + "...");

    fetchJson(EA_API + "?" + params.toString())
      .then(function handleEa(payload) {
        var gauges = Array.isArray(payload.items) ? payload.items : [];

        output({
          source: "Environment Agency rainfall gauges",
          map: "Existing Atlas OSM map only",
          site: walk.name,
          gaugeCount: gauges.length,
          gauges: gauges.slice(0, 12).map(function mapGauge(gauge) {
            var measures = Array.isArray(gauge.measures) ? gauge.measures : [];
            var rainfall = measures.find(function findRainfall(measure) {
              return measure.parameter === "rainfall";
            }) || measures[0] || {};
            var reading = rainfall.latestReading || {};

            return {
              label: gauge.label || gauge.stationReference || gauge.notation || gauge["@id"],
              grid: gauge.gridReference || "",
              latest: reading.value != null ? reading.value + " " + (rainfall.unitName || "mm") : "No latest reading",
              time: reading.dateTime || ""
            };
          }),
          note: "No EA map is created. Gauge results are listed against the selected Atlas map marker."
        });
      })
      .catch(function handleError(error) {
        output("EA rainfall request failed: " + error.message);
      });
  }

  function applyTheme(theme) {
    var nextTheme = theme === "light" ? "light" : "dark";
    var page = qs("[data-osmmaps-page]");

    if (page) {
      page.setAttribute("data-theme", nextTheme);
    }

    qsa("[data-weather-theme]").forEach(function update(button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-weather-theme") === nextTheme ? "true" : "false");
    });

    safeLocalSet(STORAGE_KEYS.theme, nextTheme);

    if (window.FieldOpsOSMmaps && typeof window.FieldOpsOSMmaps.fitVisible === "function") {
      window.setTimeout(window.FieldOpsOSMmaps.fitVisible, 80);
    }
  }

  function initialTheme() {
    var stored = safeLocalGet(STORAGE_KEYS.theme);

    if (stored === "light" || stored === "dark") {
      return stored;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }

    return "dark";
  }

  function restoreMetOfficeFields() {
    var keyField = qs("[data-metoffice-key]");
    var orderField = qs("[data-metoffice-order]");

    if (keyField) {
      keyField.value = safeLocalGet(STORAGE_KEYS.metOfficeKey);
    }

    if (orderField) {
      orderField.value = safeLocalGet(STORAGE_KEYS.metOfficeOrder);
    }
  }

  function wireControls() {
    document.addEventListener("click", function onClick(event) {
      var sourceButton = event.target.closest("[data-weather-source]");
      var themeButton = event.target.closest("[data-weather-theme]");
      var hideButton = event.target.closest("[data-weather-panel-toggle]");
      var openButton = event.target.closest("[data-weather-panel-open]");

      if (sourceButton) {
        var source = sourceButton.getAttribute("data-weather-source");
        setActiveSource(source);

        if (source === "openmeteo") {
          checkOpenMeteo();
        } else if (source === "rainviewer") {
          checkRainViewer();
        } else if (source === "metoffice") {
          checkMetOffice();
        } else if (source === "ea") {
          checkEaRainfall();
        }

        return;
      }

      if (themeButton) {
        applyTheme(themeButton.getAttribute("data-weather-theme"));
        return;
      }

      if (hideButton) {
        var panel = qs(".weather-api-panel");
        var opener = qs("[data-weather-panel-open]");

        if (panel) {
          panel.hidden = true;
        }

        if (opener) {
          opener.hidden = false;
        }

        return;
      }

      if (openButton) {
        var hiddenPanel = qs(".weather-api-panel");

        if (hiddenPanel) {
          hiddenPanel.hidden = false;
        }

        openButton.hidden = true;
      }
    });
  }

  function init() {
    restoreMetOfficeFields();
    wireControls();
    applyTheme(initialTheme());
    output("Existing Atlas OSM map loaded. Select a marker, then run a weather source check. No provider-owned maps are rendered.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

// End of file: FieldOpsAtlas/Features/Weather/weather-api-panel.js
