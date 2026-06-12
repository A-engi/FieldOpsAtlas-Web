/* ==========================================================================
   FieldOps Atlas OSM maps
   File: FieldOpsAtlas/Features/maps/OSMmaps.js
   Version: 1.0.3-panes
   Purpose:
   - UK-only free OSM map rendered through Leaflet.
   - Load region buckets from data/regions.json.
   - Load only the selected region's walk/site pins.
   - Delegate marker popups and selected-walk details to OSMpanes.js.
   ========================================================================== */

(function fieldOpsOSMMaps() {
  "use strict";

  var VERSION = "1.0.3-panes";
  var DATA_FILES = {
    regions: "../../../data/regions.json",
    regionWalks: function regionWalks(regionId) {
      return "../../../data/regions/" + encodeURIComponent(regionId) + "-sites.json";
    }
  };
  var STORAGE_KEYS = {
    region: "fieldops-osmmaps-selected-region-v1",
    theme: "fieldops-osmmaps-theme-v1"
  };
  var UK_BOUNDS = [[49.75, -8.7], [60.95, 1.95]];
  var UK_CENTER = [54.55, -3.15];
  var WEATHER_CACHE_MS = 10 * 60 * 1000;

  var state = {
    map: null,
    markerLayer: null,
    regions: [],
    walks: [],
    selectedRegionId: "",
    selectedWalkId: "",
    regionCache: new Map(),
    weatherCache: new Map(),
    markerRefs: new Map(),
    theme: "dark"
  };

  function panes() {
    return window.FieldOpsOSMpanes || null;
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
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

  function asArray(payload, key) {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && Array.isArray(payload[key])) {
      return payload[key];
    }

    return [];
  }

  function numberFrom(value) {
    var number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function cssColor(value, fallback) {
    var candidate = String(value || "").trim();
    return candidate || fallback;
  }

  function isInsideUkBounds(walk) {
    return walk.lat >= UK_BOUNDS[0][0] &&
      walk.lat <= UK_BOUNDS[1][0] &&
      walk.lng >= UK_BOUNDS[0][1] &&
      walk.lng <= UK_BOUNDS[1][1];
  }

  function asStringList(value) {
    if (Array.isArray(value)) {
      return value.map(function mapItem(item) {
        if (typeof item === "string") {
          return item.trim();
        }

        if (item && typeof item === "object") {
          return String(item.name || item.label || item.title || item.service || item.id || "").trim();
        }

        return "";
      }).filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      return value.split(/[,;\n]/).map(function splitLine(line) {
        return line.trim();
      }).filter(Boolean);
    }

    return [];
  }

  function normaliseRegion(rawRegion) {
    if (!rawRegion) {
      return null;
    }

    var id = String(rawRegion.id || "").trim();
    var name = String(rawRegion.name || id).trim();

    if (!id || !name) {
      return null;
    }

    return {
      id: id,
      name: name,
      color: cssColor(rawRegion.color, "#38bdf8"),
      notes: String(rawRegion.notes || rawRegion.description || "")
    };
  }

  function normaliseWalk(rawWalk, fallbackRegionId) {
    if (!rawWalk) {
      return null;
    }

    var lat = numberFrom(rawWalk.lat != null ? rawWalk.lat : rawWalk.latitude);
    var lng = numberFrom(
      rawWalk.lng != null ? rawWalk.lng :
      rawWalk.lon != null ? rawWalk.lon :
      rawWalk.longitude
    );
    var id = String(rawWalk.id || rawWalk.slug || rawWalk.name || "").trim();
    var name = String(rawWalk.name || rawWalk.title || id).trim();

    if (!id || !name || lat === null || lng === null) {
      return null;
    }

    return {
      id: id,
      name: name,
      description: String(rawWalk.description || ""),
      notes: String(rawWalk.notes || rawWalk.note || ""),
      siteType: String(rawWalk.siteType || rawWalk.type || "Walk"),
      status: String(rawWalk.status || "demo"),
      regionId: String(rawWalk.regionId || rawWalk.region || fallbackRegionId || ""),
      lat: lat,
      lng: lng,
      gridRef: String(rawWalk.gridRef || rawWalk.grid || ""),
      what3words: String(rawWalk.what3words || rawWalk.w3w || ""),
      accessNotes: String(rawWalk.accessInfo || rawWalk.accessNotes || rawWalk.access || ""),
      address: String(rawWalk.address || ""),
      services: asStringList(rawWalk.services),
      alerts: asStringList(rawWalk.alerts || rawWalk.warnings)
    };
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
      // Storage can be unavailable in previews/webviews.
    }
  }

  function selectedRegion() {
    return state.regions.find(function findRegion(region) {
      return region.id === state.selectedRegionId;
    }) || null;
  }

  function selectedWalk() {
    return state.walks.find(function findWalk(walk) {
      return walk.id === state.selectedWalkId;
    }) || null;
  }

  function loadJson(url, fallback) {
    return fetch(url + "?v=" + Date.now(), {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    }).then(function handleResponse(response) {
      if (!response.ok) {
        if (response.status === 404) {
          return fallback;
        }

        throw new Error("Could not load " + url + " (" + response.status + ")");
      }

      return response.json();
    });
  }

  function setTheme(theme) {
    var page = qs("[data-osmmaps-page]");
    var nextTheme = theme === "light" ? "light" : "dark";

    state.theme = nextTheme;

    if (page) {
      page.setAttribute("data-theme", nextTheme);
    }

    safeLocalSet(STORAGE_KEYS.theme, nextTheme);
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

  function setOverlayOpen(open) {
    var overlay = qs("[data-region-overlay]");
    if (overlay) {
      overlay.hidden = !open;
    }
  }

  function openRegionOverlay() {
    setOverlayOpen(true);
  }

  function closeRegionOverlay() {
    setOverlayOpen(false);
  }

  function clearMarkers() {
    state.walks = [];
    state.selectedWalkId = "";
    state.markerRefs.clear();

    if (state.markerLayer) {
      state.markerLayer.clearLayers();
    }
  }

  function renderRegions() {
    var list = qs("[data-region-list]");
    if (!list) {
      return;
    }

    if (!state.regions.length) {
      list.innerHTML = '<p class="osmpanes-empty">No regions found.</p>';
      return;
    }

    list.innerHTML = state.regions.map(function regionButton(region) {
      var isSelected = region.id === state.selectedRegionId;
      return [
        '<button class="osmmaps-region-button" type="button" data-region-id="',
        escapeHtml(region.id),
        '" aria-pressed="',
        String(isSelected),
        '" style="--region-color:',
        escapeHtml(region.color),
        '">',
        '<span class="osmmaps-region-dot" aria-hidden="true"></span>',
        '<span class="osmmaps-region-name">',
        escapeHtml(region.name),
        '</span>',
        isSelected ? '<span class="osmmaps-region-count">' + state.walks.length + '</span>' : "",
        '</button>'
      ].join("");
    }).join("");
  }

  function showMapError(message) {
    var panel = qs("[data-selected-panel]");
    if (panel) {
      panel.hidden = false;
      panel.innerHTML = '<p class="osmpanes-empty">' + escapeHtml(message) + '</p>';
    }
  }

  function makeMarkerIcon(region) {
    return L.divIcon({
      className: "osmmaps-pin-shell",
      html: '<span class="osmmaps-pin" style="--pin-color:' + escapeHtml(region.color) + '"></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10]
    });
  }

  function renderMarkers() {
    if (!state.markerLayer || !window.L) {
      return;
    }

    state.markerLayer.clearLayers();
    state.markerRefs.clear();

    var region = selectedRegion() || {
      id: state.selectedRegionId,
      name: state.selectedRegionId,
      color: "#38bdf8"
    };

    state.walks.forEach(function addWalkMarker(walk) {
      var marker = L.marker([walk.lat, walk.lng], {
        icon: makeMarkerIcon(region),
        title: walk.name,
        keyboard: true
      });

      marker.bindPopup(panes() ? panes().popupHtml(walk) : escapeHtml(walk.name));
      marker.on("click", function onMarkerClick() {
        selectWalk(walk.id, true);
      });

      marker.addTo(state.markerLayer);
      state.markerRefs.set(walk.id, marker);
    });
  }

  function fitVisible() {
    if (!state.map || !state.walks.length) {
      return;
    }

    var bounds = L.latLngBounds(state.walks.map(function toLatLng(walk) {
      return [walk.lat, walk.lng];
    }));

    state.map.fitBounds(bounds.pad(0.22), {
      animate: true,
      maxZoom: 11
    });
  }

  function renderPane(walk) {
    var panel = qs("[data-selected-panel]");
    var region = selectedRegion();
    var paneRenderer = panes();

    if (!panel || !paneRenderer) {
      return;
    }

    if (!region) {
      paneRenderer.renderEmpty(panel);
      return;
    }

    if (!walk) {
      paneRenderer.renderRegion(panel, region, state.walks.length);
      return;
    }

    paneRenderer.renderDetails(panel, walk, region, {
      walkCount: state.walks.length
    });
  }

  function selectWalk(walkId, openPopup) {
    var walk = state.walks.find(function findWalk(walkItem) {
      return walkItem.id === walkId;
    });

    if (!walk) {
      return;
    }

    state.selectedWalkId = walk.id;
    renderPane(walk);

    var marker = state.markerRefs.get(walk.id);
    if (marker && state.map) {
      state.map.setView(marker.getLatLng(), Math.max(state.map.getZoom(), 10), {
        animate: true
      });

      if (openPopup) {
        marker.openPopup();
      }
    }
  }

  function loadRegionWalks(regionId) {
    if (state.regionCache.has(regionId)) {
      return Promise.resolve(state.regionCache.get(regionId));
    }

    return loadJson(DATA_FILES.regionWalks(regionId), []).then(function handlePayload(payload) {
      var rawWalks = asArray(payload, "walks");

      if (!rawWalks.length) {
        rawWalks = asArray(payload, "sites");
      }

      var walks = rawWalks
        .map(function mapWalk(rawWalk) {
          return normaliseWalk(rawWalk, regionId);
        })
        .filter(Boolean)
        .filter(isInsideUkBounds);

      state.regionCache.set(regionId, walks);
      return walks;
    });
  }

  function selectRegion(regionId) {
    if (!regionId) {
      return Promise.resolve();
    }

    state.selectedRegionId = regionId;
    safeLocalSet(STORAGE_KEYS.region, regionId);
    clearMarkers();
    renderRegions();
    renderPane(null);
    closeRegionOverlay();

    return loadRegionWalks(regionId)
      .then(function handleWalks(walks) {
        state.walks = walks;
        renderMarkers();
        renderRegions();
        renderPane(null);
        fitVisible();
        registerSearch();
      })
      .catch(function handleError(error) {
        showMapError(error.message || "Region could not load.");
      });
  }

  function loadRegions() {
    return loadJson(DATA_FILES.regions, []).then(function handleRegions(payload) {
      var storedRegion = safeLocalGet(STORAGE_KEYS.region);

      state.regions = asArray(payload, "regions").map(normaliseRegion).filter(Boolean);
      renderRegions();

      if (storedRegion && state.regions.some(function hasStored(region) {
        return region.id === storedRegion;
      })) {
        return selectRegion(storedRegion);
      }

      renderPane(null);
      openRegionOverlay();
      return Promise.resolve();
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
      95: "Thunderstorm"
    };

    return labels[Number(code)] || "Weather code " + code;
  }

  function weatherUrl(walk) {
    var params = new URLSearchParams({
      latitude: walk.lat.toFixed(5),
      longitude: walk.lng.toFixed(5),
      current: "temperature_2m,precipitation,weather_code,wind_speed_10m",
      timezone: "auto",
      forecast_days: "1"
    });

    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
  }

  function setWeatherText(message) {
    if (panes()) {
      panes().setWeatherText(message);
    }
  }

  function loadWeather(walkId) {
    var walk = state.walks.find(function findWalk(walkItem) {
      return walkItem.id === walkId;
    });

    if (!walk) {
      return;
    }

    var cacheKey = walk.lat.toFixed(3) + "," + walk.lng.toFixed(3);
    var cached = state.weatherCache.get(cacheKey);

    if (cached && Date.now() - cached.time < WEATHER_CACHE_MS) {
      setWeatherText(cached.label);
      return;
    }

    setWeatherText("Loading weather...");

    fetch(weatherUrl(walk), {
      headers: {
        Accept: "application/json"
      }
    })
      .then(function handleResponse(response) {
        if (!response.ok) {
          throw new Error("Weather unavailable.");
        }

        return response.json();
      })
      .then(function handleWeather(payload) {
        var current = payload && payload.current;

        if (!current) {
          throw new Error("Weather unavailable.");
        }

        var label = [
          Math.round(current.temperature_2m) + "C",
          weatherCodeText(current.weather_code),
          "Wind " + Math.round(current.wind_speed_10m) + " km/h",
          "Rain " + Number(current.precipitation || 0).toFixed(1) + " mm"
        ].join(" - ");

        state.weatherCache.set(cacheKey, {
          time: Date.now(),
          label: label
        });

        setWeatherText(label);
      })
      .catch(function handleError() {
        setWeatherText("Weather unavailable for this walk.");
      });
  }

  function registerSearch() {
    if (!window.FieldOpsSearch || !window.FieldOpsSearch.registerPage) {
      return;
    }

    window.FieldOpsSearch.registerPage({
      page: "map",
      label: "Maps",
      placeholder: "Search Map...",
      emptyText: "No loaded walks match that search.",
      items: state.walks.map(function searchItem(walk) {
        return {
          id: walk.id,
          title: walk.name,
          subtitle: selectedRegion() ? selectedRegion().name : "",
          keywords: [walk.siteType, walk.status, walk.gridRef, walk.what3words].filter(Boolean)
        };
      })
    });
  }

  function wireEvents() {
    document.addEventListener("click", function onClick(event) {
      var regionButton = event.target.closest("[data-region-id]");
      var overlayClose = event.target.closest("[data-region-overlay-close]");
      var regionOpen = event.target.closest("[data-region-open]");
      var weatherButton = event.target.closest("[data-load-weather]");
      var detailsButton = event.target.closest("[data-open-details]");
      var editButton = event.target.closest("[data-edit-walk]");

      if (regionButton) {
        selectRegion(regionButton.getAttribute("data-region-id"));
        return;
      }

      if (overlayClose) {
        closeRegionOverlay();
        return;
      }

      if (regionOpen) {
        openRegionOverlay();
        return;
      }

      if (detailsButton) {
        selectWalk(detailsButton.getAttribute("data-open-details"), false);
        return;
      }

      if (editButton) {
        window.dispatchEvent(new CustomEvent("fieldops:walk-edit", {
          detail: {
            walk: selectedWalk(),
            walkId: editButton.getAttribute("data-edit-walk"),
            region: selectedRegion()
          }
        }));
        return;
      }

      if (weatherButton) {
        loadWeather(weatherButton.getAttribute("data-load-weather"));
      }
    });

    window.addEventListener("fieldops:shell-filter-region", function onShellFilterRegion() {
      openRegionOverlay();
    });

    window.addEventListener("fieldops:shell-map-tools-toggle", function onMapToolsToggle() {
      openRegionOverlay();
    });
  }

  function initMap() {
    var canvas = qs("#OSMmaps");

    if (!canvas) {
      return;
    }

    if (!window.L) {
      showMapError("Map library failed to load.");
      return;
    }

    state.map = L.map(canvas, {
      center: UK_CENTER,
      zoom: 6,
      minZoom: 5,
      maxZoom: 16,
      maxBounds: UK_BOUNDS,
      maxBoundsViscosity: 0.9,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: false
    });

    L.control.zoom({
      position: "bottomright"
    }).addTo(state.map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      bounds: UK_BOUNDS,
      minZoom: 5,
      maxZoom: 16,
      keepBuffer: 1,
      noWrap: true,
      updateWhenIdle: true,
      updateWhenZooming: false,
      detectRetina: false
    }).addTo(state.map);

    state.markerLayer = L.layerGroup().addTo(state.map);
  }

  function exposeApi() {
    window.FieldOpsOSMmaps = {
      version: VERSION,
      selectRegion: selectRegion,
      openRegionOverlay: openRegionOverlay,
      closeRegionOverlay: closeRegionOverlay,
      fitVisible: fitVisible,
      getRegions: function getRegions() {
        return state.regions.slice();
      },
      getWalks: function getWalks() {
        return state.walks.slice();
      },
      getSelectedWalk: selectedWalk
    };
  }

  function init() {
    setTheme(initialTheme());
    wireEvents();
    initMap();

    loadRegions()
      .then(exposeApi)
      .catch(function handleError(error) {
        showMapError(error.message || "OSM maps failed to load.");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
