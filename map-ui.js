/* ==========================================================================
   FieldOps Atlas map-ui.js v1.1.1
   Owner: late map UI helpers only.

   Responsibilities:
   - weather mode panel
   - visible-walk forecast cards
   - weather risk overlay controls
   - selected-walk compact weather fields
   - Met Office warning feed helper
   - DNO / power outage helper
   - local-only Field Notes prototype
   - details panel drag gesture
   - popup text cleanup on Leaflet popup events

   Keep app.js as the owner of:
   - map creation
   - walk / region data loading
   - marker creation
   - search
   - selected-walk state
   - GitHub write workflows
   ========================================================================== */

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  var UI_VERSION = "1.1.1";

  var STORAGE_KEYS = {
    fieldNotes: "fieldops-atlas-field-notes-v1",
    weatherOverlayFilter: "fieldops-atlas-weather-overlay-filter-v1",
    metOfficeFeedUrl: "fieldops-atlas-metoffice-warning-feed-url-v1",
    metOfficeApiKey: "fieldops-atlas-metoffice-warning-api-key-v1",
    dnoPowerSettings: "fieldops-atlas-power-dno-settings-v1"
  };

  var WEATHER_BATCH_SIZE = 8;
  var WEATHER_MAX_SHOWN = 16;
  var WEATHER_ZOOM_MIN = 8;
  var DRAG_DECISION_PX = 28;
  var TAP_TOLERANCE_PX = 10;

  var DNO_POWER_LINKS = {
    auto: {
      label: "Find my DNO",
      url: "https://www.powercut105.com/en/"
    },
    nationalGrid: {
      label: "National Grid Electricity Distribution",
      url: "https://powercuts.nationalgrid.co.uk/"
    },
    ukpn: {
      label: "UK Power Networks",
      url: "https://www.ukpowernetworks.co.uk/power-cut"
    },
    ssen: {
      label: "SSEN Power Track",
      url: "https://www.ssen.co.uk/power-cuts-emergencies/"
    },
    spen: {
      label: "SP Energy Networks",
      url: "https://powercuts.spenergynetworks.co.uk/"
    },
    enwl: {
      label: "Electricity North West",
      url: "https://www.enwl.co.uk/power-cuts/"
    },
    northernPowergrid: {
      label: "Northern Powergrid",
      url: "https://www.northernpowergrid.com/power-cuts-map"
    }
  };

  // ---------------------------------------------------------------------------
  // Runtime state
  // ---------------------------------------------------------------------------

  var weatherRenderToken = 0;
  var selectedWalkWeatherToken = 0;
  var weatherRiskLayer = null;
  var weatherRiskSites = [];
  var currentWeatherOverlayFilter = readStoredString(STORAGE_KEYS.weatherOverlayFilter, "all");
  var currentSelectedWalk = null;

  // ---------------------------------------------------------------------------
  // DOM helpers
  // ---------------------------------------------------------------------------

  function byId(id) {
    return document.getElementById(id);
  }

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function on(target, eventName, callback, options) {
    if (!target) return;
    target.addEventListener(eventName, callback, options || false);
  }

  function safe(label, callback) {
    try {
      callback();
    } catch (error) {
      if (window.console && typeof window.console.warn === "function") {
        window.console.warn("FieldOps Atlas map UI skipped: " + label, error);
      }
    }
  }

  function normaliseText(value, maxLength) {
    var text = String(value || "").replace(/\s+/g, " ").trim();

    if (maxLength && text.length > maxLength) {
      return text.slice(0, maxLength).trim();
    }

    return text;
  }

  function normaliseLongText(value, maxLength) {
    var text = String(value || "")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (maxLength && text.length > maxLength) {
      return text.slice(0, maxLength).trim();
    }

    return text;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toFiniteNumber(value) {
    var numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  }

  function formatNumber(value, suffix, decimals) {
    var numberValue = Number(value);
    if (!Number.isFinite(numberValue)) return "-";
    return numberValue.toFixed(decimals || 0) + suffix;
  }

  function readStoredString(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value === null || value === undefined ? fallback : String(value);
    } catch (error) {
      return fallback;
    }
  }

  function writeStoredString(key, value) {
    try {
      localStorage.setItem(key, String(value || ""));
    } catch (error) {
      showToast("Could not save setting in this browser.");
    }
  }

  function readStoredJson(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      if (!value) return fallback;
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function writeStoredJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      showToast("Could not save in this browser.");
      return false;
    }
  }

  function showToast(message) {
    var toast = byId("statusToast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show", "is-visible");

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(function () {
      toast.classList.remove("show", "is-visible");
    }, 1800);
  }

  // ---------------------------------------------------------------------------
  // Bridge helpers
  // ---------------------------------------------------------------------------

  function getBridge() {
    window.FieldOpsAtlasBridge = window.FieldOpsAtlasBridge || {};
    return window.FieldOpsAtlasBridge;
  }

  function getMap() {
    var bridge = getBridge();

    if (bridge && typeof bridge.getMap === "function") {
      return bridge.getMap();
    }

    return bridge.map || null;
  }

  function getVisibleWalks() {
    var bridge = getBridge();

    if (bridge && typeof bridge.getVisibleWalks === "function") {
      return bridge.getVisibleWalks() || [];
    }

    return [];
  }

  function getSelectedWalk() {
    var bridge = getBridge();

    if (bridge && typeof bridge.getSelectedWalk === "function") {
      return bridge.getSelectedWalk() || currentSelectedWalk || null;
    }

    return currentSelectedWalk || null;
  }

  function getRegionName(regionId) {
    var bridge = getBridge();

    if (bridge && typeof bridge.getRegion === "function") {
      var region = bridge.getRegion(regionId);
      if (region && region.name) return region.name;
    }

    return regionId || "Region";
  }

  function updateBridge() {
    var bridge = getBridge();

    bridge.mapUiVersion = UI_VERSION;
    bridge.refreshWeatherMode = renderVisibleWalkWeather;
    bridge.openWeatherMode = openWeatherMode;
    bridge.closeWeatherMode = closeWeatherMode;
    bridge.openFieldNotes = openFieldNotesPanel;
    bridge.closeFieldNotes = closeFieldNotesPanel;
  }

  // ---------------------------------------------------------------------------
  // Panel helpers
  // ---------------------------------------------------------------------------

  function setPanelVisible(panel, visible) {
    if (!panel) return;

    panel.classList.toggle("is-hidden", !visible);
    panel.setAttribute("aria-hidden", visible ? "false" : "true");

    if ("hidden" in panel) {
      panel.hidden = false;
    }
  }

  function isPanelVisible(panel) {
    return !!panel &&
      !panel.classList.contains("is-hidden") &&
      panel.getAttribute("aria-hidden") !== "true";
  }

  function closeOtherFloatingPanels(exceptId) {
    [
      "weatherModePanel",
      "fieldNotesPanel"
    ].forEach(function (id) {
      if (id === exceptId) return;
      setPanelVisible(byId(id), false);
    });
  }

  // ---------------------------------------------------------------------------
  // Details panel drag support
  // ---------------------------------------------------------------------------

  function setInfoPanelExpanded(expanded) {
    var panel = byId("infoPanel");
    var button = byId("expandInfoButton");

    if (!panel) return;

    panel.style.transform = "";
    panel.classList.remove("is-hidden", "is-dragging", "dragging");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");

    if (expanded) {
      panel.classList.remove("collapsed", "is-collapsed");
      panel.classList.add("is-expanded");
    } else {
      panel.classList.remove("is-expanded", "is-collapsed");
      panel.classList.add("collapsed");
    }

    if (button) {
      button.textContent = expanded ? "Minimise" : "Expand";
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
    }

    if (expanded) {
      setSelectedWeatherPending();
    }
  }

  function wireDetailsPanelDrag() {
    var panel = byId("infoPanel");
    var handle = byId("infoPanelDragTarget");

    if (!panel || !handle || !window.PointerEvent) return;

    var drag = null;

    on(handle, "pointerdown", function (event) {
      if (!isPanelVisible(panel)) return;

      drag = {
        pointerId: event.pointerId,
        startY: event.clientY,
        lastY: event.clientY,
        moved: false
      };

      panel.classList.add("is-dragging");
      handle.setPointerCapture(event.pointerId);
    });

    on(handle, "pointermove", function (event) {
      if (!drag || event.pointerId !== drag.pointerId) return;

      drag.lastY = event.clientY;

      if (Math.abs(drag.lastY - drag.startY) > TAP_TOLERANCE_PX) {
        drag.moved = true;
      }
    });

    on(handle, "pointerup", finishPointerDrag);
    on(handle, "pointercancel", finishPointerDrag);

    function finishPointerDrag(event) {
      if (!drag || event.pointerId !== drag.pointerId) return;

      var deltaY = drag.lastY - drag.startY;
      var moved = drag.moved || Math.abs(deltaY) > TAP_TOLERANCE_PX;

      try {
        handle.releasePointerCapture(drag.pointerId);
      } catch (error) {
        // Pointer capture may already have been released by the browser.
      }

      drag = null;
      panel.classList.remove("is-dragging", "dragging");

      if (!moved) return;

      if (deltaY <= -DRAG_DECISION_PX) {
        setInfoPanelExpanded(true);
      } else if (deltaY >= DRAG_DECISION_PX) {
        setInfoPanelExpanded(false);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Weather helpers
  // ---------------------------------------------------------------------------

  function normaliseWeatherWalk(walk) {
    if (!walk || typeof walk !== "object") return null;

    var lat = toFiniteNumber(walk.lat || walk.latitude);
    var lng = toFiniteNumber(walk.lng || walk.lon || walk.longitude);

    if ((!Number.isFinite(lat) || !Number.isFinite(lng)) && typeof walk.coordinates === "string") {
      var parts = walk.coordinates.split(",").map(function (part) {
        return Number(part.trim());
      });

      lat = parts[0];
      lng = parts[1];
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return {
      id: normaliseText(walk.id || walk.slug || walk.name || "walk", 90),
      name: normaliseText(walk.name || walk.site || walk.title || "Unnamed walk", 90),
      regionId: normaliseText(walk.regionId || walk.region || "region", 64),
      lat: lat,
      lng: lng,
      source: walk
    };
  }

  function weatherCodeLabel(code) {
    var numberCode = Number(code);

    var labels = {
      0: "Clear",
      1: "Mostly clear",
      2: "Partly cloudy",
      3: "Cloudy",
      45: "Fog",
      48: "Freezing fog",
      51: "Light drizzle",
      53: "Drizzle",
      55: "Heavy drizzle",
      56: "Freezing drizzle",
      57: "Heavy freezing drizzle",
      61: "Light rain",
      63: "Rain",
      65: "Heavy rain",
      66: "Freezing rain",
      67: "Heavy freezing rain",
      71: "Light snow",
      73: "Snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Light showers",
      81: "Showers",
      82: "Heavy showers",
      85: "Snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunder and hail",
      99: "Severe thunder and hail"
    };

    return labels[numberCode] || "Forecast";
  }

  function weatherRiskScore(code) {
    var numberCode = Number(code);

    if (!Number.isFinite(numberCode)) return 0;
    if ([95, 96, 99].indexOf(numberCode) !== -1) return 90;
    if ([71, 73, 75, 77, 85, 86].indexOf(numberCode) !== -1) return 70;
    if ([65, 82].indexOf(numberCode) !== -1) return 64;
    if ([63, 80, 81].indexOf(numberCode) !== -1) return 46;
    if ([61, 66, 67].indexOf(numberCode) !== -1) return 32;
    if ([45, 48, 51, 53, 55, 56, 57].indexOf(numberCode) !== -1) return 22;
    if ([1, 2, 3].indexOf(numberCode) !== -1) return 8;

    return 0;
  }

  function maxFinite(values) {
    var max = null;

    if (!Array.isArray(values)) return null;

    values.forEach(function (value) {
      var numberValue = toFiniteNumber(value);
      if (numberValue === null) return;

      if (max === null || numberValue > max) {
        max = numberValue;
      }
    });

    return max;
  }

  function worstWeatherCode(codes, fallbackCode) {
    var worstCode = fallbackCode;
    var worstScore = weatherRiskScore(fallbackCode);

    if (!Array.isArray(codes)) return worstCode;

    codes.forEach(function (code) {
      var score = weatherRiskScore(code);

      if (score > worstScore) {
        worstScore = score;
        worstCode = code;
      }
    });

    return worstCode;
  }

  function calculateRisk(forecast) {
    if (!forecast) {
      return {
        level: "unknown",
        label: "Manual check",
        score: -1,
        flags: ["Forecast unavailable"]
      };
    }

    var flags = [];
    var score = weatherRiskScore(forecast.worstWeatherCode);
    var gusts = toFiniteNumber(forecast.windGusts);
    var wind = toFiniteNumber(forecast.windSpeed);
    var rain = toFiniteNumber(forecast.precipitation);
    var rainChance = toFiniteNumber(forecast.maxRainChance);

    if (weatherRiskScore(forecast.worstWeatherCode) >= 90) {
      flags.push("Thunder");
      score = Math.max(score, 90);
    }

    if (gusts !== null && gusts >= 45) {
      flags.push("Severe gusts");
      score = Math.max(score, 88);
    } else if (gusts !== null && gusts >= 35) {
      flags.push("Gusty");
      score = Math.max(score, 62);
    } else if (wind !== null && wind >= 30) {
      flags.push("Windy");
      score = Math.max(score, 48);
    }

    if (rain !== null && rain >= 3) {
      flags.push("Heavy rain now");
      score = Math.max(score, 70);
    } else if (rain !== null && rain >= 1) {
      flags.push("Rain now");
      score = Math.max(score, 44);
    }

    if (rainChance !== null && rainChance >= 70) {
      flags.push("Rain likely next 6h");
      score = Math.max(score, 58);
    } else if (rainChance !== null && rainChance >= 40) {
      flags.push("Rain possible next 6h");
      score = Math.max(score, 34);
    }

    if (!flags.length) {
      flags.push("No obvious weather risk");
    }

    if (score >= 75) {
      return { level: "high", label: "High risk", score: score, flags: flags.slice(0, 4) };
    }

    if (score >= 40) {
      return { level: "watch", label: "Watch", score: score, flags: flags.slice(0, 4) };
    }

    return { level: "low", label: "Normal", score: score, flags: flags.slice(0, 4) };
  }

  function buildOpenMeteoUrl(walks) {
    var params = new URLSearchParams();

    params.set("latitude", walks.map(function (walk) {
      return walk.lat.toFixed(5);
    }).join(","));

    params.set("longitude", walks.map(function (walk) {
      return walk.lng.toFixed(5);
    }).join(","));

    params.set(
      "current",
      "temperature_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m"
    );

    params.set("hourly", "precipitation_probability,weather_code");
    params.set("forecast_hours", "6");
    params.set("forecast_days", "1");
    params.set("timezone", "auto");
    params.set("wind_speed_unit", "mph");
    params.set("precipitation_unit", "mm");

    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
  }

  function parseOpenMeteoForecast(payload) {
    var current = payload && payload.current;
    var hourly = payload && payload.hourly ? payload.hourly : {};

    if (!current) return null;

    var forecast = {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      precipitation: current.precipitation,
      weatherCode: current.weather_code,
      worstWeatherCode: worstWeatherCode(hourly.weather_code, current.weather_code),
      maxRainChance: maxFinite(hourly.precipitation_probability),
      cloudCover: current.cloud_cover,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      windGusts: current.wind_gusts_10m,
      time: current.time
    };

    forecast.risk = calculateRisk(forecast);

    return forecast;
  }

  function fetchForecastBatch(walks) {
    if (!walks.length) return Promise.resolve([]);

    return fetch(buildOpenMeteoUrl(walks), { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Open-Meteo returned " + response.status);
        }

        return response.json();
      })
      .then(function (payload) {
        var records = Array.isArray(payload) ? payload : [payload];

        return walks.map(function (walk, index) {
          var clone = Object.assign({}, walk);
          clone.forecast = parseOpenMeteoForecast(records[index]);
          clone.risk = calculateRisk(clone.forecast);
          return clone;
        });
      });
  }

  function fetchForecasts(walks) {
    var batches = [];

    for (var index = 0; index < walks.length; index += WEATHER_BATCH_SIZE) {
      batches.push(walks.slice(index, index + WEATHER_BATCH_SIZE));
    }

    return Promise.all(batches.map(fetchForecastBatch)).then(function (results) {
      return results.reduce(function (all, batch) {
        return all.concat(batch);
      }, []);
    });
  }

  function renderForecastLine(forecast) {
    if (!forecast) return "Forecast unavailable";

    return [
      weatherCodeLabel(forecast.weatherCode),
      formatNumber(forecast.temperature, "Â°C", 1),
      "feels " + formatNumber(forecast.feelsLike, "Â°C", 1)
    ].join(" Â· ");
  }

  function renderWindLine(forecast) {
    if (!forecast) return "Wind unavailable";

    return [
      "Wind " + formatNumber(forecast.windSpeed, " mph", 0),
      "gust " + formatNumber(forecast.windGusts, " mph", 0)
    ].join(" Â· ");
  }

  function renderLightningLine(forecast) {
    if (!forecast) return "Lightning not checked";

    var risk = forecast.risk || calculateRisk(forecast);

    if (risk.flags.indexOf("Thunder") !== -1) {
      return "Thunder risk in forecast Â· check live strike map";
    }

    return "No thunder flag in 6h forecast";
  }

  function setSelectedWeatherLoading() {
    setText("selectedSitePressureMemo", "Loading forecast...");
    setText("selectedSiteWindMemo", "Loading wind...");
    setText("selectedSiteLightningMemo", "Checking thunder risk...");
  }

  function setSelectedWeatherPending() {
    setText("selectedSitePressureMemo", "Weather is paused. Use Weather Mode > Refresh forecasts.");
    setText("selectedSiteWindMemo", "No automatic forecast fetch on marker/detail open.");
    setText("selectedSiteLightningMemo", "Open Weather Mode for manual strike links.");
  }

  function updateSelectedWalkWeather(walk) {
    var normalisedWalk = normaliseWeatherWalk(walk);

    if (!normalisedWalk) {
      setText("selectedSitePressureMemo", "Select a walk.");
      setText("selectedSiteWindMemo", "Select a walk.");
      setText("selectedSiteLightningMemo", "Select a walk.");
      return;
    }

    var token = ++selectedWalkWeatherToken;

    setSelectedWeatherLoading();

    fetchForecastBatch([normalisedWalk])
      .then(function (results) {
        if (token !== selectedWalkWeatherToken) return;

        var forecast = results[0] && results[0].forecast;

        setText("selectedSitePressureMemo", renderForecastLine(forecast));
        setText("selectedSiteWindMemo", renderWindLine(forecast));
        setText("selectedSiteLightningMemo", renderLightningLine(forecast));
      })
      .catch(function () {
        if (token !== selectedWalkWeatherToken) return;

        setText("selectedSitePressureMemo", "Forecast unavailable.");
        setText("selectedSiteWindMemo", "Wind unavailable.");
        setText("selectedSiteLightningMemo", "Manual lightning check needed.");
      });
  }

  function setText(id, value) {
    var element = byId(id);
    if (element) element.textContent = value;
  }

  // ---------------------------------------------------------------------------
  // Weather mode panel
  // ---------------------------------------------------------------------------

  function openWeatherMode() {
    closeOtherFloatingPanels("weatherModePanel");
    setPanelVisible(byId("weatherModePanel"), true);
    byId("weatherModeButton")?.setAttribute("aria-pressed", "true");

    var selected = getSelectedWalk();
    if (selected) {
      currentSelectedWalk = selected;
      setSelectedWeatherPending();
    }

    setWeatherMessage("Weather fetch is manual to keep the map responsive. Press Refresh forecasts to load visible walk weather.", "manual");
    setWeatherOverlayStatus("Forecasts paused. Press Refresh forecasts to load visible walk weather.");
  }

  function closeWeatherMode() {
    setPanelVisible(byId("weatherModePanel"), false);
    byId("weatherModeButton")?.setAttribute("aria-pressed", "false");
  }

  function ensureWeatherList() {
    var list = byId("visibleWeatherSiteList");

    if (list) return list;

    var card = document.querySelector(".weather-source-card-primary");
    if (!card) return null;

    list = document.createElement("div");
    list.id = "visibleWeatherSiteList";
    list.className = "visible-weather-site-list";
    card.appendChild(list);

    return list;
  }

  function setWeatherMessage(message, tone) {
    var list = ensureWeatherList();
    if (!list) return;

    list.innerHTML = '<p class="visible-weather-empty ' + escapeHtml(tone || "") + '">' + escapeHtml(message) + "</p>";
  }

  function compareWeather(a, b) {
    var aScore = a && a.risk && Number.isFinite(a.risk.score) ? a.risk.score : -1;
    var bScore = b && b.risk && Number.isFinite(b.risk.score) ? b.risk.score : -1;

    if (aScore !== bScore) return bScore - aScore;

    return String(a.name || "").localeCompare(String(b.name || ""));
  }

  function addWeatherSummary(list, walks) {
    var counts = {
      high: 0,
      watch: 0,
      low: 0,
      unknown: 0
    };

    walks.forEach(function (walk) {
      var level = walk.risk && walk.risk.level ? walk.risk.level : "unknown";
      counts[level] = (counts[level] || 0) + 1;
    });

    var summary = document.createElement("p");
    summary.className = "visible-weather-empty";
    summary.textContent = "Risk sort: " +
      counts.high + " high Â· " +
      counts.watch + " watch Â· " +
      counts.low + " normal Â· " +
      counts.unknown + " manual";

    list.appendChild(summary);
  }

  function addWeatherCard(list, walk) {
    var risk = walk.risk || calculateRisk(walk.forecast);
    var card = document.createElement("article");

    card.className = "visible-weather-site-card weather-risk-" + risk.level;

    var title = document.createElement("strong");
    title.textContent = walk.name;
    card.appendChild(title);

    var meta = document.createElement("span");
    meta.textContent = getRegionName(walk.regionId) + " Â· " + walk.lat.toFixed(4) + ", " + walk.lng.toFixed(4);
    card.appendChild(meta);

    var status = document.createElement("small");

    if (walk.forecast) {
      status.textContent = risk.label + " Â· " +
        risk.flags.join(" Â· ") + " Â· " +
        weatherCodeLabel(walk.forecast.weatherCode) + " Â· " +
        formatNumber(walk.forecast.temperature, "Â°C", 1) + " Â· " +
        "wind " + formatNumber(walk.forecast.windSpeed, " mph", 0) + " Â· " +
        "gust " + formatNumber(walk.forecast.windGusts, " mph", 0) + " Â· " +
        "rain " + formatNumber(walk.forecast.maxRainChance, "%", 0);
    } else {
      status.textContent = "Forecast unavailable â point kept separate for manual check.";
    }

    card.appendChild(status);
    list.appendChild(card);
  }

  function renderVisibleWalkWeather() {
    var list = ensureWeatherList();
    var token = ++weatherRenderToken;

    if (!list) return;

    var walks = getVisibleWalks()
      .map(normaliseWeatherWalk)
      .filter(Boolean);

    if (!walks.length) {
      clearWeatherRiskLayer();
      setWeatherMessage("No visible walks are loaded yet.", "warning");
      setWeatherOverlayStatus("Weather overlay waiting for visible walks.");
      return;
    }

    list.innerHTML = '<p class="visible-weather-empty">Loading visible walk forecasts...</p>';
    setWeatherOverlayStatus("Loading weather for " + walks.length + " visible walk point" + (walks.length === 1 ? "" : "s") + ".");

    fetchForecasts(walks)
      .then(function (forecastWalks) {
        if (token !== weatherRenderToken) return;

        weatherRiskSites = forecastWalks.slice();
        renderWeatherCards(forecastWalks, true);
        renderWeatherRiskLayer();
      })
      .catch(function () {
        if (token !== weatherRenderToken) return;

        weatherRiskSites = walks.map(function (walk) {
          walk.risk = calculateRisk(null);
          return walk;
        });

        renderWeatherCards(weatherRiskSites, false);
        renderWeatherRiskLayer();
      });
  }

  function renderWeatherCards(walks, liveEnabled) {
    var list = ensureWeatherList();
    if (!list) return;

    var sorted = walks.slice().sort(compareWeather);
    var maxShown = Math.min(sorted.length, WEATHER_MAX_SHOWN);

    list.innerHTML = "";
    addWeatherSummary(list, sorted);

    for (var index = 0; index < maxShown; index += 1) {
      addWeatherCard(list, sorted[index]);
    }

    if (sorted.length > maxShown) {
      var more = document.createElement("p");
      more.className = "visible-weather-empty";
      more.textContent = "+ " + (sorted.length - maxShown) + " more visible walks not shown in this compact panel.";
      list.appendChild(more);
    }

    if (!liveEnabled) {
      var note = document.createElement("p");
      note.className = "visible-weather-empty warning";
      note.textContent = "Live forecast fetch failed. Walk points are still listed separately for manual checks.";
      list.appendChild(note);
    }
  }

  // ---------------------------------------------------------------------------
  // Weather risk map overlay
  // ---------------------------------------------------------------------------

  function shouldShowWeatherWalk(walk) {
    var level = walk && walk.risk ? walk.risk.level : "unknown";

    if (currentWeatherOverlayFilter === "off") return false;
    if (currentWeatherOverlayFilter === "high") return level === "high";
    if (currentWeatherOverlayFilter === "watch") return level === "high" || level === "watch";

    return true;
  }

  function riskMarkerStyle(risk) {
    var level = risk && risk.level ? risk.level : "unknown";

    if (level === "high") {
      return { radius: 10, color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.34, weight: 2 };
    }

    if (level === "watch") {
      return { radius: 9, color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.30, weight: 2 };
    }

    return { radius: 7, color: "#38bdf8", fillColor: "#38bdf8", fillOpacity: 0.18, weight: 1 };
  }

  function getWeatherLayer() {
    var map = getMap();

    if (!map || !window.L) return null;

    if (!weatherRiskLayer) {
      weatherRiskLayer = window.L.layerGroup();
    }

    if (!map.hasLayer(weatherRiskLayer)) {
      weatherRiskLayer.addTo(map);
    }

    return weatherRiskLayer;
  }

  function clearWeatherRiskLayer() {
    if (weatherRiskLayer) {
      weatherRiskLayer.clearLayers();
    }

    setWeatherOverlayStatus("Weather overlay cleared.");
  }

  function renderWeatherRiskLayer() {
    clearWeatherRiskLayer();

    /*
      WEATHER MAP OVERLAY PAUSED â keep this here for later development.

      Original intent:
      - draw visual weather-risk markers for visible walks
      - support All / Watch+ / High only / Clear overlay filters
      - optionally show a future weather popup

      Paused because the weather overlay was taking ownership of marker clicks
      before the weather popup design was finished. Forecast/weather text still
      stays in Weather Mode and in the selected-walk Weather section.

      Future implementation sketch:

      var layer = getWeatherLayer();

      if (!layer) {
        setWeatherOverlayStatus("Map overlay waiting for Leaflet.");
        return;
      }

      layer.clearLayers();

      var shown = weatherRiskSites.filter(shouldShowWeatherWalk);

      shown.forEach(function (walk) {
        if (!Number.isFinite(walk.lat) || !Number.isFinite(walk.lng)) return;

        var marker = window.L.circleMarker([walk.lat, walk.lng], riskMarkerStyle(walk.risk));

        marker.bindPopup(
          '<strong>' + escapeHtml(walk.name) + '</strong><br>' +
          escapeHtml(walk.risk ? walk.risk.label : "Weather") + ' Â· ' +
          escapeHtml(walk.risk ? walk.risk.flags.join(" Â· ") : "Manual check")
        );

        marker.addTo(layer);
      });
    */

    setWeatherOverlayStatus("Weather map overlay paused. Forecast text stays in Weather Mode for now.");
  }

  function setWeatherOverlayStatus(message) {
    setText("weatherOverlayStatus", message);
  }

  function setWeatherOverlayFilter(filter) {
    currentWeatherOverlayFilter = filter || "all";
    writeStoredString(STORAGE_KEYS.weatherOverlayFilter, currentWeatherOverlayFilter);

    ["all", "watch", "high", "off"].forEach(function (name) {
      var button = byId("weatherOverlay" + capitalise(name === "off" ? "clear" : name) + "Button");
      if (button) button.setAttribute("aria-pressed", currentWeatherOverlayFilter === name ? "true" : "false");
    });

    renderWeatherRiskLayer();
  }

  function capitalise(value) {
    value = String(value || "");
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function fitWeatherOverlay() {
    showToast("Weather map overlay is paused for now.");
  }

  // ---------------------------------------------------------------------------
  // Met Office warning helper
  // ---------------------------------------------------------------------------

  function loadMetOfficeSettings() {
    var feedInput = byId("metOfficeWarningsFeedInput");
    var keyInput = byId("metOfficeWarningsKeyInput");

    if (feedInput) feedInput.value = readStoredString(STORAGE_KEYS.metOfficeFeedUrl, "");
    if (keyInput) keyInput.value = readStoredString(STORAGE_KEYS.metOfficeApiKey, "");
  }

  function saveMetOfficeSettings() {
    var feedInput = byId("metOfficeWarningsFeedInput");
    var keyInput = byId("metOfficeWarningsKeyInput");

    writeStoredString(STORAGE_KEYS.metOfficeFeedUrl, feedInput ? feedInput.value.trim() : "");
    writeStoredString(STORAGE_KEYS.metOfficeApiKey, keyInput ? keyInput.value.trim() : "");

    setMetOfficeResult("Saved locally in this browser.");
    showToast("Met Office source saved locally");
  }

  function clearMetOfficeSettings() {
    writeStoredString(STORAGE_KEYS.metOfficeFeedUrl, "");
    writeStoredString(STORAGE_KEYS.metOfficeApiKey, "");

    loadMetOfficeSettings();
    setMetOfficeResult("Manual warning link is ready. NSWWS feed check is optional.");
  }

  function checkMetOfficeFeed() {
    var feedInput = byId("metOfficeWarningsFeedInput");
    var keyInput = byId("metOfficeWarningsKeyInput");
    var feedUrl = feedInput ? feedInput.value.trim() : "";
    var apiKey = keyInput ? keyInput.value.trim() : "";

    if (!feedUrl) {
      setMetOfficeResult("Paste a supplied NSWWS Atom feed URL first.");
      return;
    }

    setMetOfficeResult("Checking feed...");

    fetch(feedUrl, {
      cache: "no-store",
      headers: apiKey ? { "x-api-key": apiKey } : {}
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Feed returned " + response.status);
        }

        return response.text();
      })
      .then(function (text) {
        var count = (text.match(/<entry[\s>]/g) || []).length;
        setMetOfficeResult("Feed reachable. Entries found: " + count + ".");
      })
      .catch(function () {
        setMetOfficeResult("Feed could not be checked from this browser. Use the official warning link as fallback.");
      });
  }

  function setMetOfficeResult(message) {
    var result = byId("metOfficeWarningsResult");
    if (!result) return;

    result.innerHTML = '<p class="alert-feed-message">' + escapeHtml(message) + "</p>";
  }

  // ---------------------------------------------------------------------------
  // DNO / power helper
  // ---------------------------------------------------------------------------

  function loadDnoSettings() {
    var settings = readStoredJson(STORAGE_KEYS.dnoPowerSettings, {});
    var postcodeInput = byId("dnoPowerPostcodeInput");
    var providerSelect = byId("dnoPowerProviderSelect");

    if (postcodeInput) postcodeInput.value = settings.postcode || "";
    if (providerSelect) providerSelect.value = settings.provider || "auto";

    renderDnoResult();
  }

  function saveDnoSettings() {
    var postcodeInput = byId("dnoPowerPostcodeInput");
    var providerSelect = byId("dnoPowerProviderSelect");

    var settings = {
      postcode: normaliseText(postcodeInput ? postcodeInput.value : "", 16).toUpperCase(),
      provider: providerSelect ? providerSelect.value : "auto",
      savedAt: new Date().toISOString()
    };

    if (writeStoredJson(STORAGE_KEYS.dnoPowerSettings, settings)) {
      renderDnoResult();
      updateSelectedPowerMemo();
      showToast("Power source saved locally");
    }
  }

  function clearDnoSettings() {
    try {
      localStorage.removeItem(STORAGE_KEYS.dnoPowerSettings);
    } catch (error) {
      // Ignore storage errors.
    }

    loadDnoSettings();
    updateSelectedPowerMemo();
  }

  function selectedDnoLink() {
    var settings = readStoredJson(STORAGE_KEYS.dnoPowerSettings, {});
    var provider = settings.provider || "auto";

    return DNO_POWER_LINKS[provider] || DNO_POWER_LINKS.auto;
  }

  function renderDnoResult() {
    var result = byId("dnoPowerResult");
    if (!result) return;

    var settings = readStoredJson(STORAGE_KEYS.dnoPowerSettings, {});
    var link = selectedDnoLink();
    var postcode = settings.postcode ? " for " + settings.postcode : "";

    result.innerHTML =
      '<p class="alert-feed-message">Saved checker: ' +
      escapeHtml(link.label + postcode) +
      ".</p>";
  }

  function openDnoPowerCheck() {
    var link = selectedDnoLink();
    window.open(link.url, "_blank", "noopener");
  }

  function updateSelectedPowerMemo() {
    var target = byId("selectedSitePowerCompany");
    if (!target) return;

    var settings = readStoredJson(STORAGE_KEYS.dnoPowerSettings, null);

    if (!settings || (!settings.postcode && (!settings.provider || settings.provider === "auto"))) {
      target.textContent = "Use Power panel to save a postcode/DNO check.";
      return;
    }

    var link = selectedDnoLink();
    var postcode = settings.postcode ? " Â· " + settings.postcode : "";

    target.textContent = link.label + postcode;
  }

  // ---------------------------------------------------------------------------
  // Field Notes
  // ---------------------------------------------------------------------------

  function readFieldNotes() {
    var notes = readStoredJson(STORAGE_KEYS.fieldNotes, []);
    return Array.isArray(notes) ? notes : [];
  }

  function saveFieldNotes(notes) {
    return writeStoredJson(STORAGE_KEYS.fieldNotes, notes);
  }

  function selectedWalkLabel() {
    var walk = getSelectedWalk();

    if (!walk) return "No walk selected";

    return walk.name || walk.title || walk.id || "Selected walk";
  }

  function updateFieldNoteSiteLabel() {
    setText("fieldNoteSiteLabel", selectedWalkLabel());
  }

  function openFieldNotesPanel() {
    closeOtherFloatingPanels("fieldNotesPanel");
    updateFieldNoteSiteLabel();
    renderFieldNotes();
    setPanelVisible(byId("fieldNotesPanel"), true);
  }

  function closeFieldNotesPanel() {
    setPanelVisible(byId("fieldNotesPanel"), false);
  }

  function clearFieldNoteForm() {
    var title = byId("fieldNoteTitleInput");
    var body = byId("fieldNoteBodyInput");
    var scope = byId("fieldNoteScopeSelect");

    if (title) title.value = "";
    if (body) body.value = "";
    if (scope) scope.value = "Company";
  }

  function submitFieldNote(event) {
    if (event) event.preventDefault();

    var titleInput = byId("fieldNoteTitleInput");
    var bodyInput = byId("fieldNoteBodyInput");
    var scopeInput = byId("fieldNoteScopeSelect");
    var walk = getSelectedWalk();

    var title = normaliseText(titleInput ? titleInput.value : "", 80);
    var body = normaliseLongText(bodyInput ? bodyInput.value : "", 600);

    if (!title && !body) {
      showToast("Write a title or note first.");
      return;
    }

    var note = {
      id: "note-" + Date.now().toString(36),
      scope: normaliseText(scopeInput ? scopeInput.value : "Company", 32) || "Company",
      title: title || "Untitled note",
      body: body,
      siteId: walk && walk.id ? walk.id : "",
      siteName: walk && walk.name ? walk.name : "",
      createdAt: new Date().toISOString()
    };

    var notes = readFieldNotes();
    notes.unshift(note);

    if (saveFieldNotes(notes.slice(0, 80))) {
      clearFieldNoteForm();
      renderFieldNotes();
      showToast("Field note saved");
    }
  }

  function renderFieldNotes() {
    var list = byId("fieldNotesSavedList");
    if (!list) return;

    var notes = readFieldNotes();

    if (!notes.length) {
      list.innerHTML = '<p class="visible-weather-empty">No field notes saved yet.</p>';
      return;
    }

    list.innerHTML = notes.map(function (note) {
      var date = formatNoteDate(note.createdAt);
      var site = note.siteName ? " Â· " + note.siteName : "";

      return [
        '<article class="field-note-card" data-note-id="' + escapeHtml(note.id) + '">',
        '  <div class="field-note-tag">' + escapeHtml(note.scope || "Note") + "</div>",
        "  <h3>" + escapeHtml(note.title || "Untitled note") + "</h3>",
        note.body ? "  <p>" + escapeHtml(note.body) + "</p>" : "",
        '  <small>' + escapeHtml(date + site) + "</small>",
        '  <div class="button-row">',
        '    <button class="tool-button danger small" type="button" data-delete-field-note="' + escapeHtml(note.id) + '">Delete</button>',
        "  </div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function formatNoteDate(value) {
    var date = new Date(value);

    if (!Number.isFinite(date.getTime())) {
      return "Saved note";
    }

    return date.toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function deleteFieldNote(noteId) {
    var notes = readFieldNotes().filter(function (note) {
      return note.id !== noteId;
    });

    if (saveFieldNotes(notes)) {
      renderFieldNotes();
      showToast("Field note deleted");
    }
  }

  function clearAllFieldNotes() {
    if (!confirm("Clear all local Field Notes from this browser?")) return;

    if (saveFieldNotes([])) {
      renderFieldNotes();
      showToast("Field notes cleared");
    }
  }

  // ---------------------------------------------------------------------------
  // Popup cleanup
  // ---------------------------------------------------------------------------

  function cleanPopupText(root) {
    if (!root) return;

    root.querySelectorAll("*").forEach(function (element) {
      if (!element.childNodes || !element.childNodes.length) return;

      element.childNodes.forEach(function (node) {
        if (node.nodeType !== Node.TEXT_NODE) return;

        node.nodeValue = node.nodeValue
          .replace(/ÃÂ·/g, "Â·")
          .replace(/Ã¢ÂÂ/g, "â")
          .replace(/Ã¢ÂÂ/g, "â")
          .replace(/Ã¢ÂÂ/g, "â");
      });
    });
  }

  function wirePopupCleanup() {
    var map = getMap();

    if (map && typeof map.on === "function") {
      map.on("popupopen", function (event) {
        if (event && event.popup && typeof event.popup.getElement === "function") {
          cleanPopupText(event.popup.getElement());
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Event wiring
  // ---------------------------------------------------------------------------

  function wireWeatherControls() {
    on(byId("weatherModeButton"), "click", function () {
      var panel = byId("weatherModePanel");

      if (isPanelVisible(panel)) {
        closeWeatherMode();
      } else {
        openWeatherMode();
      }
    });

    on(byId("closeWeatherModePanelButton"), "click", closeWeatherMode);
    on(byId("weatherSitesRefreshButton"), "click", renderVisibleWalkWeather);

    on(byId("weatherOverlayAllButton"), "click", function () {
      setWeatherOverlayFilter("all");
    });

    on(byId("weatherOverlayWatchButton"), "click", function () {
      setWeatherOverlayFilter("watch");
    });

    on(byId("weatherOverlayHighButton"), "click", function () {
      setWeatherOverlayFilter("high");
    });

    on(byId("weatherOverlayClearButton"), "click", function () {
      setWeatherOverlayFilter("off");
    });

    on(byId("weatherOverlayFitButton"), "click", fitWeatherOverlay);

    setWeatherOverlayFilter(currentWeatherOverlayFilter);
  }

  function wireMetOfficeControls() {
    loadMetOfficeSettings();

    on(byId("saveMetOfficeWarningsButton"), "click", saveMetOfficeSettings);
    on(byId("clearMetOfficeWarningsButton"), "click", clearMetOfficeSettings);
    on(byId("checkMetOfficeWarningsButton"), "click", checkMetOfficeFeed);
  }

  function wireDnoControls() {
    loadDnoSettings();

    on(byId("saveDnoPowerButton"), "click", saveDnoSettings);
    on(byId("clearDnoPowerButton"), "click", clearDnoSettings);
    on(byId("openDnoPowerButton"), "click", openDnoPowerCheck);

    updateSelectedPowerMemo();
  }

  function wireFieldNotes() {
    updateFieldNoteSiteLabel();
    renderFieldNotes();

    on(byId("openFieldNotesButton"), "click", openFieldNotesPanel);
    on(byId("closeFieldNotesButton"), "click", closeFieldNotesPanel);
    on(byId("fieldNoteForm"), "submit", submitFieldNote);
    on(byId("clearFieldNoteFormButton"), "click", clearFieldNoteForm);
    on(byId("clearFieldNotesButton"), "click", clearAllFieldNotes);

    on(byId("fieldNotesSavedList"), "click", function (event) {
      var button = event.target.closest("[data-delete-field-note]");
      if (!button) return;

      deleteFieldNote(button.dataset.deleteFieldNote);
    });
  }

  function wireBridgeEvents() {
    on(window, "fieldops-atlas-ready", function () {
      safe("popup cleanup", wirePopupCleanup);
    });

    on(window, "fieldops-atlas-walks-changed", function () {
      if (isPanelVisible(byId("weatherModePanel"))) {
        setWeatherMessage("Visible walks changed. Press Refresh forecasts to reload weather when needed.", "manual");
        setWeatherOverlayStatus("Forecasts paused after visible walks changed.");
      }
    });

    on(window, "fieldops-atlas-walk-selected", function (event) {
      currentSelectedWalk = event && event.detail ? event.detail.walk : getSelectedWalk();

      updateFieldNoteSiteLabel();
      updateSelectedPowerMemo();
      setSelectedWeatherPending();
    });

    on(window, "fieldops-atlas-details-expanded", function (event) {
      currentSelectedWalk = event && event.detail ? event.detail.walk : getSelectedWalk();

      updateFieldNoteSiteLabel();
      updateSelectedPowerMemo();
      setSelectedWeatherPending();
    });
  }

  // ---------------------------------------------------------------------------
  // Startup
  // ---------------------------------------------------------------------------

  function init() {
    updateBridge();

    safe("details drag", wireDetailsPanelDrag);
    safe("weather controls", wireWeatherControls);
    safe("Met Office controls", wireMetOfficeControls);
    safe("DNO controls", wireDnoControls);
    safe("Field Notes", wireFieldNotes);
    safe("bridge events", wireBridgeEvents);
    safe("popup cleanup", wirePopupCleanup);

    var selected = getSelectedWalk();
    if (selected) {
      currentSelectedWalk = selected;
      setSelectedWeatherPending();
    }
  }

  onReady(init);
})();
