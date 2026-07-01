(() => {
  "use strict";

  const Lab = window.AtlasWeatherLab;
  const OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";
  const MAX_SITES_PER_BATCH = 24;
  const HOURS_TO_SHOW = 12;

  const CURRENT_FIELDS = [
    "temperature_2m",
    "precipitation",
    "rain",
    "weather_code",
    "wind_speed_10m",
    "wind_gusts_10m"
  ];

  const HOURLY_FIELDS = [
    "precipitation_probability",
    "precipitation",
    "rain",
    "weather_code",
    "wind_gusts_10m"
  ];

  const state = {
    map: null,
    markerLayer: null,
    regions: [],
    sites: [],
    selectedSites: [],
    riskBySite: new Map()
  };

  const els = {
    status: document.getElementById("statusText"),
    regionCount: document.getElementById("regionCount"),
    siteCount: document.getElementById("siteCount"),
    rainCount: document.getElementById("rainCount"),
    windCount: document.getElementById("windCount"),
    loadSites: document.getElementById("loadSitesButton"),
    fetchRisk: document.getElementById("fetchRiskButton"),
    list: document.getElementById("riskList"),
    search: document.getElementById("siteSearch")
  };

  init();

  async function init() {
    state.map = Lab.initMap();
    state.markerLayer = window.L.layerGroup().addTo(state.map);
    bindEvents();
    await loadSites();
    await fetchRisk();
  }

  function bindEvents() {
    els.loadSites?.addEventListener("click", loadSites);
    els.fetchRisk?.addEventListener("click", fetchRisk);
    els.search?.addEventListener("input", () => {
      updateSelectedSites();
      render();
    });
  }

  async function loadSites() {
    Lab.setBusy(els.loadSites, true, "Loading...", "Reload");
    try {
      setStatus("Loading...");
      state.regions = await Lab.loadRegions();
      state.sites = Lab.allSites(state.regions);
      updateSelectedSites();
      render();
      Lab.fitSites(state.map, state.selectedSites);
      setStatus("Loaded.");
    } catch (error) {
      setStatus(error?.message || "Sites failed.");
    } finally {
      Lab.setBusy(els.loadSites, false, "Loading...", "Reload");
    }
  }

  function updateSelectedSites() {
    const query = String(els.search?.value || "").trim().toLowerCase();
    const source = query
      ? state.sites.filter((site) => {
          return site.name.toLowerCase().includes(query) ||
            site.region.toLowerCase().includes(query);
        })
      : state.sites;

    state.selectedSites = source.slice(0, MAX_SITES_PER_BATCH);
  }

  async function fetchRisk() {
    if (!state.selectedSites.length) {
      setStatus("No sites.");
      return;
    }

    Lab.setBusy(els.fetchRisk, true, "Loading...", "Refresh");
    try {
      setStatus("Loading...");
      const response = await fetch(buildForecastUrl(state.selectedSites), { cache: "no-store" });
      if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`);

      const payload = await response.json();
      const forecasts = Array.isArray(payload) ? payload : [payload];
      forecasts.forEach((forecast, index) => {
        const site = state.selectedSites[index];
        if (site) state.riskBySite.set(site.id, buildRisk(site, forecast));
      });

      render();
      setStatus("Loaded.");
    } catch (error) {
      setStatus(error?.message || "Open-Meteo failed.");
    } finally {
      Lab.setBusy(els.fetchRisk, false, "Loading...", "Refresh");
    }
  }

  function buildForecastUrl(sites) {
    const params = new URLSearchParams();
    params.set("latitude", sites.map((site) => site.lat.toFixed(5)).join(","));
    params.set("longitude", sites.map((site) => site.lon.toFixed(5)).join(","));
    params.set("current", CURRENT_FIELDS.join(","));
    params.set("hourly", HOURLY_FIELDS.join(","));
    params.set("forecast_days", "2");
    params.set("timezone", "Europe/London");
    return `${OPEN_METEO_API}?${params.toString()}`;
  }

  function buildRisk(site, forecast) {
    const current = forecast?.current || {};
    const hours = collectHours(forecast?.hourly || {});
    const maxRain = Math.max(Number(current.rain || current.precipitation || 0), ...hours.map((hour) => Number(hour.rain || hour.precipitation || 0)));
    const maxWind = Math.max(Number(current.wind_gusts_10m || current.wind_speed_10m || 0), ...hours.map((hour) => Number(hour.wind_gusts_10m || 0)));
    const maxProb = Math.max(0, ...hours.map((hour) => Number(hour.precipitation_probability || 0)));
    const weatherCode = Number(current.weather_code || 0);
    const level = riskLevel({ weatherCode, maxRain, maxWind, maxProb });

    return {
      site,
      level,
      colour: Lab.weatherColour(level),
      summary: [
        `${Number(current.temperature_2m ?? 0).toFixed(1)} C`,
        `${Number(current.wind_speed_10m ?? 0).toFixed(0)} km/h`,
        `${Number(current.precipitation ?? 0).toFixed(1)} mm`,
        `${maxProb.toFixed(0)}%`
      ].join(" · ")
    };
  }

  function collectHours(hourly) {
    return (hourly.time || []).slice(0, HOURS_TO_SHOW).map((time, index) => ({
      time,
      precipitation_probability: readHourly(hourly, "precipitation_probability", index),
      precipitation: readHourly(hourly, "precipitation", index),
      rain: readHourly(hourly, "rain", index),
      wind_gusts_10m: readHourly(hourly, "wind_gusts_10m", index),
      weather_code: readHourly(hourly, "weather_code", index)
    }));
  }

  function readHourly(hourly, field, index) {
    const list = hourly?.[field];
    return Array.isArray(list) ? list[index] : null;
  }

  function riskLevel(values) {
    if (values.weatherCode >= 95 || values.maxWind >= 70) return "extreme";
    if (values.maxWind >= 55 || values.maxRain >= 4) return "heavy";
    if (values.maxRain >= 0.5 || values.maxProb >= 45) return "rain";
    return "dry";
  }

  function render() {
    renderCounts();
    renderMarkers();
    renderList();
  }

  function renderCounts() {
    const risks = state.selectedSites.map((site) => state.riskBySite.get(site.id)).filter(Boolean);
    Lab.setText("regionCount", String(state.regions.length));
    Lab.setText("siteCount", String(state.selectedSites.length));
    Lab.setText("rainCount", String(risks.filter((risk) => risk.level === "rain" || risk.level === "heavy" || risk.level === "extreme").length));
    Lab.setText("windCount", String(risks.filter((risk) => risk.level === "heavy" || risk.level === "extreme").length));
  }

  function renderMarkers() {
    state.markerLayer.clearLayers();
    state.selectedSites.forEach((site) => {
      const risk = state.riskBySite.get(site.id);
      const colour = risk?.colour || Lab.weatherColour("dry");
      window.L.marker([site.lat, site.lon], {
        pane: "weatherMarkerPane",
        icon: Lab.markerIcon({ colour, label: risk?.level === "dry" ? "" : "!" })
      })
        .bindPopup(`<strong>${Lab.escapeHtml(site.name)}</strong><br>${Lab.escapeHtml(risk?.summary || site.region)}`)
        .addTo(state.markerLayer);
    });
  }

  function renderList() {
    if (!els.list) return;
    if (!state.selectedSites.length) {
      els.list.innerHTML = '<p class="weather-status">No results.</p>';
      return;
    }

    els.list.innerHTML = state.selectedSites.slice(0, 8).map((site) => {
      const risk = state.riskBySite.get(site.id);
      return [
        '<article class="weather-list-row">',
        `<strong>${Lab.escapeHtml(site.name)}</strong>`,
        `<span style="color:${Lab.escapeHtml(risk?.colour || Lab.weatherColour("dry"))}">${Lab.escapeHtml(risk?.level || "dry")}</span>`,
        `<small>${Lab.escapeHtml(risk?.summary || site.region)}</small>`,
        "</article>"
      ].join("");
    }).join("");
  }

  function setStatus(message) {
    if (els.status) els.status.textContent = message;
  }
})();
