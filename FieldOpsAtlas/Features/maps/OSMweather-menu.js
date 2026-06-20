/* ==========================================================================
   FieldOps Atlas map service controls and weather preview
   File: FieldOpsAtlas/Features/maps/OSMweather-menu.js
   Version: 1.0.15-service-cluster-picker
   Purpose:
   - Controls the collapsible DTT, DAB, FM, and Weather rail.
   - Opens an attached map-cluster picker for service controls.
   - Loads only public demo RF cluster metadata.
   - Focuses the existing Leaflet map on the selected 25-to-40-site cluster.
   - Controls the existing lazy Weather preview.
   ========================================================================== */

(function fieldOpsOSMServiceControls() {
  "use strict";

  var VERSION = "1.0.15-service-cluster-picker";
  var PRESELI = {
    name: "Preseli area",
    lat: 51.921,
    lng: -4.742
  };
  var SERVICE_FILES = {
    dtt: {
      label: "DTT",
      regionId: "wenvoe",
      url: "../../../data/rf/wenvoe/dtt-details.json"
    },
    dab: {
      label: "DAB",
      regionId: "wenvoe",
      url: ""
    },
    fm: {
      label: "FM",
      regionId: "wenvoe",
      url: ""
    }
  };
  var FORECAST_CACHE_MS = 10 * 60 * 1000;
  var TOOLBAR_STORAGE_KEY = "fieldops.maps.quick-tools.collapsed";
  var TOOLBAR_COLLAPSED_CLASS = "is-collapsed";
  var serviceCache = new Map();
  var weatherCache = null;
  var capturedMap = null;

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
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

  function captureLeafletMap() {
    if (!window.L || typeof window.L.map !== "function" || window.L.map.__fieldOpsCaptured) {
      return;
    }

    var originalMap = window.L.map;

    function wrappedMap() {
      var map = originalMap.apply(this, arguments);
      var container = map && typeof map.getContainer === "function" ? map.getContainer() : null;

      if (container && container.id === "OSMmaps") {
        capturedMap = map;
        window.FieldOpsAtlasLeafletMap = map;
      }

      return map;
    }

    Object.keys(originalMap).forEach(function copyProperty(key) {
      wrappedMap[key] = originalMap[key];
    });

    wrappedMap.__fieldOpsCaptured = true;
    window.L.map = wrappedMap;
  }

  captureLeafletMap();

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
      closeServicePicker();
      setWeatherPanelOpen(false);
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

  function setActiveService(serviceId) {
    qsa("[data-map-service]").forEach(function syncButton(button) {
      var active = button.getAttribute("data-map-service") === serviceId;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-expanded", String(active));
    });
  }

  function setServiceStatus(message) {
    var output = qs("[data-map-service-status]");

    if (output) {
      output.textContent = message || "";
    }
  }

  function setServiceHeading(serviceId, title) {
    var service = SERVICE_FILES[serviceId];
    var kicker = qs("[data-map-service-kicker]");
    var heading = qs("[data-map-service-title]");

    if (kicker) {
      kicker.textContent = service ? service.label + " map" : "Service map";
    }

    if (heading) {
      heading.textContent = title || "Choose area";
    }
  }

  function closeServicePicker() {
    var toolbar = qs("[data-map-quick-tools]");
    var picker = qs("[data-map-service-picker]");

    if (picker) {
      picker.hidden = true;
      delete picker.dataset.activeService;
    }

    if (toolbar) {
      toolbar.classList.remove("has-service-picker");
    }

    setActiveService("");
  }

  function openServicePicker(serviceId) {
    var toolbar = qs("[data-map-quick-tools]");
    var picker = qs("[data-map-service-picker]");
    var service = SERVICE_FILES[serviceId];

    if (!toolbar || !picker || !service) {
      return;
    }

    if (!picker.hidden && picker.dataset.activeService === serviceId) {
      closeServicePicker();
      return;
    }

    setWeatherPanelOpen(false);
    picker.hidden = false;
    picker.dataset.activeService = serviceId;
    toolbar.classList.add("has-service-picker");
    setActiveService(serviceId);
    setServiceHeading(serviceId, "Choose Wenvoe area");

    if (!service.url) {
      renderServiceUnavailable(serviceId);
      return;
    }

    renderServiceLoading();
    loadServiceData(serviceId)
      .then(function renderLoaded(payload) {
        renderServiceClusters(serviceId, payload);
      })
      .catch(function renderError(error) {
        renderServiceError(error.message || "Service cluster data could not load.");
      });
  }

  function renderServiceLoading() {
    var options = qs("[data-map-service-options]");

    if (options) {
      options.innerHTML = "";
    }

    setServiceStatus("Loading cluster data...");
  }

  function renderServiceUnavailable(serviceId) {
    var options = qs("[data-map-service-options]");
    var service = SERVICE_FILES[serviceId];

    if (options) {
      options.innerHTML = "";
    }

    setServiceStatus((service ? service.label : "This service") + " cluster data has not been added yet.");
  }

  function renderServiceError(message) {
    var options = qs("[data-map-service-options]");

    if (options) {
      options.innerHTML = "";
    }

    setServiceStatus(message);
  }

  function loadJson(url) {
    return fetch(url + "?v=" + Date.now(), {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    }).then(function handleResponse(response) {
      if (!response.ok) {
        throw new Error("Could not load cluster data (" + response.status + ").");
      }

      return response.json();
    });
  }

  function loadServiceData(serviceId) {
    var service = SERVICE_FILES[serviceId];

    if (!service || !service.url) {
      return Promise.reject(new Error("No cluster file is configured."));
    }

    if (serviceCache.has(serviceId)) {
      return Promise.resolve(serviceCache.get(serviceId));
    }

    return loadJson(service.url).then(function cachePayload(payload) {
      serviceCache.set(serviceId, payload);
      return payload;
    });
  }

  function mapClustersFrom(payload) {
    if (payload && Array.isArray(payload.mapClusters)) {
      return payload.mapClusters.filter(function validCluster(cluster) {
        return cluster &&
          cluster.id &&
          cluster.name &&
          Array.isArray(cluster.siteIds) &&
          cluster.siteIds.length >= 25 &&
          cluster.siteIds.length <= 40;
      });
    }

    return [];
  }

  function renderServiceClusters(serviceId, payload) {
    var options = qs("[data-map-service-options]");
    var clusters = mapClustersFrom(payload);

    if (!options) {
      return;
    }

    if (!clusters.length) {
      options.innerHTML = "";
      setServiceStatus("No 25-to-40-site map clusters were found.");
      return;
    }

    options.innerHTML = clusters.map(function clusterButton(cluster) {
      return [
        '<button class="map-service-cluster" type="button" data-map-cluster="',
        escapeHtml(cluster.id),
        '" data-map-service-id="',
        escapeHtml(serviceId),
        '">',
        "<strong>",
        escapeHtml(cluster.name),
        "</strong>",
        "<span>",
        escapeHtml(cluster.siteCount || cluster.siteIds.length),
        " sites</span>",
        "</button>"
      ].join("");
    }).join("");

    setServiceStatus("Choose one area. Only its sites will remain visible.");
  }

  function waitForMapApi() {
    return new Promise(function resolveMapApi(resolve, reject) {
      var attempts = 0;

      function check() {
        if (
          window.FieldOpsOSMmaps &&
          typeof window.FieldOpsOSMmaps.selectRegion === "function" &&
          typeof window.FieldOpsOSMmaps.getWalks === "function"
        ) {
          resolve(window.FieldOpsOSMmaps);
          return;
        }

        attempts += 1;

        if (attempts >= 80) {
          reject(new Error("Map controls are not ready."));
          return;
        }

        window.setTimeout(check, 50);
      }

      check();
    });
  }

  function markerLayers(map) {
    var markers = [];

    if (!map || !window.L) {
      return markers;
    }

    map.eachLayer(function collectLayer(layer) {
      if (layer instanceof window.L.Marker && layer.options && layer.options.title) {
        markers.push(layer);
      }
    });

    return markers;
  }

  function focusClusterOnMap(serviceId, clusterId) {
    var service = SERVICE_FILES[serviceId];

    if (!service) {
      return;
    }

    setServiceStatus("Loading " + service.label + " area...");

    Promise.all([
      loadServiceData(serviceId),
      waitForMapApi()
    ])
      .then(function prepareCluster(values) {
        var payload = values[0];
        var mapApi = values[1];
        var cluster = mapClustersFrom(payload).find(function findCluster(item) {
          return item.id === clusterId;
        });

        if (!cluster) {
          throw new Error("The selected cluster was not found.");
        }

        return mapApi.selectRegion(service.regionId).then(function regionLoaded() {
          return {
            mapApi: mapApi,
            cluster: cluster
          };
        });
      })
      .then(function applyCluster(context) {
        var mapApi = context.mapApi;
        var cluster = context.cluster;
        var selectedIds = new Set(cluster.siteIds.map(String));
        var walks = mapApi.getWalks();
        var selectedWalks = walks.filter(function selectedWalk(walk) {
          return selectedIds.has(String(walk.id));
        });
        var selectedNames = new Set(selectedWalks.map(function walkName(walk) {
          return walk.name;
        }));
        var map = capturedMap || window.FieldOpsAtlasLeafletMap;

        if (!map || !window.L) {
          throw new Error("Leaflet map instance is unavailable.");
        }

        markerLayers(map).forEach(function filterMarker(marker) {
          if (!selectedNames.has(marker.options.title)) {
            map.removeLayer(marker);
          }
        });

        if (selectedWalks.length) {
          var bounds = window.L.latLngBounds(selectedWalks.map(function toLatLng(walk) {
            return [walk.lat, walk.lng];
          }));

          map.fitBounds(bounds.pad(0.18), {
            animate: true,
            maxZoom: 11
          });
        }

        window.dispatchEvent(new CustomEvent("fieldops:map-service-cluster-selected", {
          detail: {
            version: VERSION,
            regionId: service.regionId,
            serviceType: serviceId,
            clusterId: cluster.id,
            clusterName: cluster.name,
            siteCount: selectedWalks.length,
            siteIds: cluster.siteIds.slice()
          }
        }));

        closeServicePicker();
      })
      .catch(function handleClusterError(error) {
        setServiceStatus(error.message || "Could not focus the selected cluster.");
      });
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

  function setWeatherPanelOpen(open) {
    var panel = qs(".weather-api-panel");

    if (panel) {
      panel.hidden = !open;
    }

    qsa("[data-weather-panel-open]").forEach(function syncOpenButton(button) {
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setWeatherStatus(message) {
    var output = qs("[data-weather-output]");

    if (output) {
      output.textContent = message;
    }
  }

  function setWeatherUpdated(message) {
    var output = qs("[data-weather-forecast-updated]");

    if (output) {
      output.textContent = message;
    }
  }

  function renderWeatherPlaceholder(message) {
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

    setWeatherUpdated("Updated now");
    setWeatherStatus("Preview loaded for " + PRESELI.name + ".");
  }

  function activatePreview() {
    if (weatherCache && Date.now() - weatherCache.time < FORECAST_CACHE_MS) {
      renderForecast(weatherCache.payload);
      return;
    }

    setWeatherUpdated("Loading");
    setWeatherStatus("Loading Preseli preview...");
    renderWeatherPlaceholder("Loading preview...");

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
        weatherCache = {
          time: Date.now(),
          payload: payload
        };
        renderForecast(payload);
      })
      .catch(function handleError() {
        setWeatherUpdated("Not loaded");
        setWeatherStatus("Preseli preview unavailable.");
        renderWeatherPlaceholder("Preview unavailable. Open full Weather for provider pages.");
      });
  }

  function wireControls() {
    document.addEventListener("click", function onClick(event) {
      var toolbarToggle = event.target.closest("[data-map-quick-toggle]");
      var serviceControl = event.target.closest("[data-map-service]");
      var serviceClose = event.target.closest("[data-map-service-close]");
      var clusterControl = event.target.closest("[data-map-cluster]");
      var weatherOpen = event.target.closest("[data-weather-panel-open]");
      var weatherClose = event.target.closest("[data-weather-panel-close]");
      var weatherActivate = event.target.closest("[data-weather-activate]");

      if (toolbarToggle) {
        event.preventDefault();
        event.stopPropagation();
        toggleToolbar();
        return;
      }

      if (serviceControl) {
        event.preventDefault();
        event.stopPropagation();
        openServicePicker(serviceControl.getAttribute("data-map-service"));
        return;
      }

      if (serviceClose) {
        event.preventDefault();
        event.stopPropagation();
        closeServicePicker();
        return;
      }

      if (clusterControl) {
        event.preventDefault();
        event.stopPropagation();
        focusClusterOnMap(
          clusterControl.getAttribute("data-map-service-id"),
          clusterControl.getAttribute("data-map-cluster")
        );
        return;
      }

      if (weatherOpen) {
        event.preventDefault();
        event.stopPropagation();
        closeServicePicker();
        setWeatherPanelOpen(true);
        return;
      }

      if (weatherClose) {
        event.preventDefault();
        event.stopPropagation();
        setWeatherPanelOpen(false);
        return;
      }

      if (weatherActivate) {
        event.preventDefault();
        event.stopPropagation();
        activatePreview();
      }
    }, false);

    document.addEventListener("keydown", function onKeyDown(event) {
      if (event.key === "Escape") {
        closeServicePicker();
        setWeatherPanelOpen(false);
      }
    });
  }

  function init() {
    qsa("[data-weather-panel-open]").forEach(function initWeatherButton(button) {
      button.setAttribute("aria-expanded", "false");
    });

    qsa("[data-map-service]").forEach(function initServiceButton(button) {
      button.setAttribute("aria-expanded", "false");
    });

    setToolbarCollapsed(readToolbarCollapsed(), false);
    renderWeatherPlaceholder("Tap Activate preview.");
    wireControls();

    window.FieldOpsOSMWeatherMenu = {
      VERSION: VERSION,
      version: VERSION,
      open: function open() {
        setWeatherPanelOpen(true);
      },
      close: function close() {
        setWeatherPanelOpen(false);
      },
      activate: activatePreview,
      openService: openServicePicker,
      closeService: closeServicePicker,
      focusCluster: focusClusterOnMap,
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
