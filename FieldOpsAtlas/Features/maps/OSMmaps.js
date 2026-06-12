/* ==========================================================================
   FieldOps Atlas maps
   File: FieldOpsAtlas/Features/maps/maps.js
   Version: 1.0.0-region-walks
   Purpose:
   - UK-only free Leaflet map prototype.
   - Load region buckets from data/regions.json.
   - Load walk/site pins only from the selected region JSON file to keep data low.
   - Use one OpenStreetMap tile layer and CSS filtering for dark mode.
   - Load optional weather for one selected walk on demand using Open-Meteo.
   ========================================================================== */

(function fieldOpsMaps() {
  "use strict";

  var VERSION = "1.0.0-region-walks";
  var DATA_FILES = {
    regions: "../../../data/regions.json",
    regionWalks: function regionWalks(regionId) {
      return "../../../data/regions/" + encodeURIComponent(regionId) + "-sites.json";
    }
  };

  var STORAGE_KEYS = {
    region: "fieldops-maps-selected-region-v1",
    theme: "fieldops-maps-theme-v1"
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
    return candidate ? candidate : fallback;
  }

  function isInsideUkBounds(walk) {
    return walk.lat >= UK_BOUNDS[0][0] &&
      walk.lat <= UK_BOUNDS[1][0] &&
      walk.lng >= UK_BOUNDS[0][1] &&
      walk.lng <= UK_BOUNDS[1][1];
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
      description: String(rawWalk.description || rawWalk.notes || rawWalk.accessNotes || ""),
      siteType: String(rawWalk.siteType || rawWalk.type || "Walk"),
      status: String(rawWalk.status || "demo"),
      regionId: String(rawWalk.regionId || rawWalk.region || fallbackRegionId || ""),
      lat: lat,
      lng: lng,
      gridRef: String(rawWalk.gridRef || rawWalk.grid || ""),
      what3words: String(rawWalk.what3words || rawWalk.w3w || "")
    };
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

  async function loadJson(url, fallback) {
    var response = await fetch(url + "?v=" + Date.now(), {
      cache: "no-store",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return fallback;
      }

      throw new Error("Could not load " + url + " (" + response.status + ")");
    }

    return response.json();
  }

  async function loadRegions() {
    var payload = await loadJson(DATA_FILES.regions, []);
    state.regions = asArray(payload, "regions").map(normaliseRegion).filter(Boolean);
    renderRegions();

    var storedRegion = safeLocalGet(STORAGE_KEYS.region);
    var firstRegion = state.regions[0] ? state.regions[0].id : "";

    if (storedRegion && state.regions.some(function hasStored(region) { return region.id === storedRegion; })) {
      await selectRegion(storedRegion);
    } else if (firstRegion) {
      await selectRegion(firstRegion);
    } else {
      renderSelectedPanel(null);
      renderSummary();
    }
  }

  async function loadRegionWalks(regionId) {
    if (state.regionCache.has(regionId)) {
      return state.regionCache.get(regionId);
    }

    var payload = await loadJson(DATA_FILES.regionWalks(regionId), []);
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
  }

  function setLoading(isLoading) {
    var loading = qs("[data-loading]");
    if (loading) {
      loading.hidden = !isLoading;
    }
  }

  async function selectRegion(regionId) {
    if (!regionId) {
      return;
    }

    state.selectedRegionId = regionId;
    state.selectedWalkId = "";
    safeLocalSet(STORAGE_KEYS.region, regionId);
    renderRegions();
    renderSelectedPanel(null);
    renderSummary();
    setLoading(true);

    try {
      state.walks = await loadRegionWalks(regionId);
      renderMarkers();
      renderSummary();
      fitVisible();
    } catch (error) {
      showMapError(error.message || "Region could not load.");
    } finally {
      setLoading(false);
    }
  }

  function renderRegions() {
    var list = qs("[data-region-list]");
    if (!list) {
      return;
    }

    list.innerHTML = state.regions.map(function regionButton(region) {
      var isSelected = region.id === state.selectedRegionId;
      return [
        '<button class="maps-region-button" type="button" data-region-id="' + escapeHtml(region.id) + '" aria-pressed="' + String(isSelected) + '" style="--region-color:' + escapeHtml(region.color) + '">',
        '<span class="maps-region-dot" aria-hidden="true"></span>',
        '<span>' + escapeHtml(region.name) + '</span>',
        '</button>'
      ].join("");
    }).join("");
  }

  function renderSummary() {
    var summary = qs("[data-region-summary]");
    var region = selectedRegion();

    if (!summary) {
      return;
    }

    if (!region) {
      summary.textContent = "No region selected";
      return;
    }

    summary.textContent = region.name + " Â· " + state.walks.length + " walks loaded";
  }

  function makeMarkerIcon(region) {
    return L.divIcon({
      className: "maps-pin-shell",
      html: '<span class="maps-pin" style="--pin-color:' + escapeHtml(region.color) + '"></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10]
    });
  }

  function markerPopup(walk, region) {
    return [
      '<article class="maps-popup">',
      '<h2 class="maps-popup-title">' + escapeHtml(walk.name) + '</h2>',
      '<p class="maps-popup-meta">' + escapeHtml(region.name) + ' Â· ' + escapeHtml(walk.siteType) + '</p>',
      '<p class="maps-popup-line">' + walk.lat.toFixed(5) + ', ' + walk.lng.toFixed(5) + '</p>',
      '</article>'
    ].join("");
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

      marker.bindPopup(markerPopup(walk, region));
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

  function selectWalk(walkId, openPopup) {
    var walk = state.walks.find(function findWalk(walkItem) {
      return walkItem.id === walkId;
    });

    if (!walk) {
      return;
    }

    state.selectedWalkId = walk.id;
    renderSelectedPanel(walk);

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

  function renderSelectedPanel(walk) {
    var panel = qs("[data-selected-panel]");
    var region = selectedRegion();

    if (!panel) {
      return;
    }

    if (!walk) {
      panel.innerHTML = '<p class="maps-empty">Pick a region, then tap a walk marker.</p>';
      return;
    }

    panel.innerHTML = [
      '<article>',
      '<h2 class="maps-selected-title">' + escapeHtml(walk.name) + '</h2>',
      '<p class="maps-selected-meta">' + escapeHtml(region ? region.name : walk.regionId) + ' Â· ' + escapeHtml(walk.siteType) + ' Â· ' + escapeHtml(walk.status) + '</p>',
      '<p class="maps-selected-line">' + walk.lat.toFixed(5) + ', ' + walk.lng.toFixed(5) + '</p>',
      walk.gridRef ? '<p class="maps-selected-line">Grid: ' + escapeHtml(walk.gridRef) + '</p>' : "",
      walk.what3words ? '<p class="maps-selected-line">w3w: ' + escapeHtml(walk.what3words) + '</p>' : "",
      walk.description ? '<p class="maps-selected-line">' + escapeHtml(walk.description) + '</p>' : "",
      '<div class="maps-weather-row">',
      '<p class="maps-weather-output" data-weather-output>Weather not loaded.</p>',
      '<button class="maps-weather-button" type="button" data-load-weather="' + escapeHtml(walk.id) + '">Weather</button>',
      '</div>',
      '</article>'
    ].join("");
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
    var output = qs("[data-weather-output]");
    if (output) {
      output.textContent = message;
    }
  }

  async function loadWeather(walkId) {
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

    setWeatherText("Loading weatherâ¦");

    try {
      var response = await fetch(weatherUrl(walk), {
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Weather unavailable.");
      }

      var payload = await response.json();
      var current = payload && payload.current;

      if (!current) {
        throw new Error("Weather unavailable.");
      }

      var label = [
        Math.round(current.temperature_2m) + "Â°C",
        weatherCodeText(current.weather_code),
        "Wind " + Math.round(current.wind_speed_10m) + " km/h",
        "Rain " + Number(current.precipitation || 0).toFixed(1) + " mm"
      ].join(" Â· ");

      state.weatherCache.set(cacheKey, {
        time: Date.now(),
        label: label
      });

      setWeatherText(label);
    } catch (error) {
      setWeatherText("Weather unavailable for this walk.");
    }
  }

  function setTheme(theme) {
    var page = qs("[data-maps-page]");
    var label = qs("[data-theme-label]");
    var nextTheme = theme === "light" ? "light" : "dark";

    state.theme = nextTheme;

    if (page) {
      page.setAttribute("data-theme", nextTheme);
    }

    if (label) {
      label.textContent = nextTheme === "light" ? "Light" : "Dark";
    }

    safeLocalSet(STORAGE_KEYS.theme, nextTheme);
  }

  function initialTheme() {
    var stored = safeLocalGet(STORAGE_KEYS.theme);

    if (stored === "light" || stored === "dark") {
      return stored;
    }

    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
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
      // Storage can be unavailable inside some previews/webviews.
    }
  }

  function showMapError(message) {
    var canvas = qs("#mapsCanvas");
    if (canvas) {
      canvas.innerHTML = '<div class="maps-error">' + escapeHtml(message) + '</div>';
    }
  }

  function wireEvents() {
    document.addEventListener("click", function onClick(event) {
      var regionButton = event.target.closest("[data-region-id]");
      var themeButton = event.target.closest("[data-theme-toggle]");
      var fitButton = event.target.closest("[data-fit-visible]");
      var weatherButton = event.target.closest("[data-load-weather]");

      if (regionButton) {
        selectRegion(regionButton.getAttribute("data-region-id"));
      }

      if (themeButton) {
        setTheme(state.theme === "dark" ? "light" : "dark");
      }

      if (fitButton) {
        fitVisible();
      }

      if (weatherButton) {
        loadWeather(weatherButton.getAttribute("data-load-weather"));
      }
    });
  }

  function initMap() {
    var canvas = qs("#mapsCanvas");

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

  async function init() {
    setTheme(initialTheme());
    wireEvents();
    initMap();

    try {
      await loadRegions();
      window.FieldOpsMaps = {
        version: VERSION,
        selectRegion: selectRegion,
        fitVisible: fitVisible,
        getRegions: function getRegions() {
          return state.regions.slice();
        },
        getWalks: function getWalks() {
          return state.walks.slice();
        },
        getSelectedWalk: selectedWalk
      };
    } catch (error) {
      showMapError(error.message || "Maps failed to load.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
}());
