(() => {
  "use strict";

  const Lab = window.AtlasWeatherLab;
  const EA_ROOT = "https://environment.data.gov.uk/flood-monitoring";

  const state = {
    map: null,
    siteLayer: null,
    gaugeLayer: null,
    regions: [],
    sites: []
  };

  const els = {
    status: document.getElementById("statusText"),
    siteSelect: document.getElementById("siteSelect"),
    distanceRange: document.getElementById("distanceRange"),
    distanceLabel: document.getElementById("distanceLabel"),
    load: document.getElementById("loadGaugesButton"),
    clear: document.getElementById("clearGaugesButton"),
    list: document.getElementById("gaugeList"),
    count: document.getElementById("gaugeCount")
  };

  init();

  async function init() {
    state.map = Lab.initMap();
    state.siteLayer = window.L.layerGroup().addTo(state.map);
    state.gaugeLayer = window.L.layerGroup().addTo(state.map);
    bindEvents();

    state.regions = await Lab.loadRegions();
    state.sites = Lab.allSites(state.regions);
    populateSites();
    renderSites();
    setStatus("Ready.");
  }

  function bindEvents() {
    els.distanceRange?.addEventListener("input", () => {
      if (els.distanceLabel) els.distanceLabel.textContent = `${els.distanceRange.value} km`;
    });
    els.siteSelect?.addEventListener("change", renderSites);
    els.load?.addEventListener("click", loadNearbyGauges);
    els.clear?.addEventListener("click", clearGauges);
  }

  function populateSites() {
    if (!els.siteSelect) return;
    els.siteSelect.innerHTML = state.sites.map((site) => {
      return `<option value="${Lab.escapeHtml(site.id)}">${Lab.escapeHtml(site.name)}</option>`;
    }).join("");
    if (state.sites[0]) els.siteSelect.value = state.sites[0].id;
  }

  function renderSites() {
    const site = currentSite();
    state.siteLayer.clearLayers();
    if (!site) return;

    window.L.marker([site.lat, site.lon], {
      pane: "weatherMarkerPane",
      icon: Lab.markerIcon({ colour: Lab.weatherColour("wind"), label: "S" })
    })
      .bindPopup(`<strong>${Lab.escapeHtml(site.name)}</strong><br>${Lab.escapeHtml(site.region)}`)
      .addTo(state.siteLayer);

    state.map.setView([site.lat, site.lon], 8);
  }

  async function loadNearbyGauges() {
    const site = currentSite();
    if (!site) {
      setStatus("No site selected.");
      return;
    }

    const radiusKm = Number(els.distanceRange?.value || 40);
    Lab.setBusy(els.load, true, "Loading...", "Load");
    setStatus("Loading...");

    try {
      const url = `${EA_ROOT}/id/stations?parameter=rainfall&lat=${site.lat}&long=${site.lon}&dist=${radiusKm}`;
      const response = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
      if (!response.ok) throw new Error(`EA rainfall HTTP ${response.status}`);

      const data = await response.json();
      const gauges = (Array.isArray(data?.items) ? data.items : [])
        .map((station) => normaliseGauge(station, site))
        .filter(Boolean)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      renderGauges(gauges);
      setStatus("Loaded.");
    } catch (error) {
      setStatus(error?.message || "EA rainfall failed.");
    } finally {
      Lab.setBusy(els.load, false, "Loading...", "Load");
    }
  }

  function normaliseGauge(station, site) {
    const lat = Number(station.lat);
    const lon = Number(station.long ?? station.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

    return {
      id: String(station.stationReference || station.notation || station["@id"] || station.label || "unknown"),
      label: String(station.label || station.stationReference || "Unnamed gauge"),
      lat,
      lon,
      distanceKm: Lab.haversineKm(site, { lat, lon }),
      riverName: station.riverName || "",
      town: station.town || ""
    };
  }

  function renderGauges(gauges) {
    state.gaugeLayer.clearLayers();
    const visible = gauges.slice(0, 30);

    visible.forEach((gauge) => {
      window.L.marker([gauge.lat, gauge.lon], {
        pane: "weatherMarkerPane",
        icon: Lab.markerIcon({ colour: Lab.weatherColour("gauge"), label: "R" })
      })
        .bindPopup(`<strong>${Lab.escapeHtml(gauge.label)}</strong><br>${gauge.distanceKm.toFixed(1)} km`)
        .addTo(state.gaugeLayer);
    });

    if (visible.length) {
      const allPoints = visible.concat(currentSite() || []);
      Lab.fitSites(state.map, allPoints);
    }

    if (els.count) els.count.textContent = `${visible.length} gauges`;
    renderList(visible);
  }

  function renderList(gauges) {
    if (!els.list) return;
    if (!gauges.length) {
      els.list.innerHTML = '<p class="weather-status">No results.</p>';
      return;
    }

    els.list.innerHTML = gauges.slice(0, 8).map((gauge) => {
      const detail = [gauge.town, gauge.riverName].filter(Boolean).join(" · ");
      return [
        '<article class="weather-list-row">',
        `<strong>${Lab.escapeHtml(gauge.label)}</strong>`,
        `<span>${gauge.distanceKm.toFixed(1)} km</span>`,
        `<small>${Lab.escapeHtml(detail)}</small>`,
        "</article>"
      ].join("");
    }).join("");
  }

  function clearGauges() {
    state.gaugeLayer.clearLayers();
    if (els.list) els.list.innerHTML = "";
    if (els.count) els.count.textContent = "0 gauges";
    setStatus("Cleared.");
  }

  function currentSite() {
    const id = els.siteSelect?.value;
    return state.sites.find((site) => site.id === id) || state.sites[0] || null;
  }

  function setStatus(message) {
    if (els.status) els.status.textContent = message;
  }
})();
