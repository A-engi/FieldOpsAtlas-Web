window.AtlasWeatherLab = (() => {
  "use strict";

  const VERSION = "1.0.0";
  const REGIONS_URL = "data/regions.json";
  const UK_BOUNDS = [[49.75, -8.7], [60.95, 1.95]];
  const UK_CENTER = [54.55, -3.15];
  const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
  const MAP_VIEW_KEY = "fieldops-weather-map-view-v1";
  let activeMap = null;

  const fallbackRegions = [
    { id: "west-wales", name: "West Wales", bounds: null, sites: [] }
  ];

  function initMap(options = {}) {
    const element = document.getElementById(options.mapId || "weatherMap");
    if (!window.L || !element) return null;

    const storedView = readMapView();
    const map = window.L.map(element, {
      center: options.center || storedView?.center || UK_CENTER,
      zoom: options.zoom || storedView?.zoom || 6,
      minZoom: 5,
      maxZoom: 11,
      maxBounds: UK_BOUNDS,
      maxBoundsViscosity: 0.9,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: false
    });

    createPane(map, "weatherBasePane", 190, "auto", "weather-base-pane");
    createPane(map, "weatherOverlayPane", 430, "none", "weather-overlay-pane");
    createPane(map, "weatherMarkerPane", 610, "auto", "weather-marker-pane");

    window.L.control.zoom({ position: "topright" }).addTo(map);
    window.L.tileLayer(OSM_TILE_URL, {
      pane: "weatherBasePane",
      minZoom: 5,
      maxZoom: 11,
      noWrap: true,
      keepBuffer: 1,
      updateWhenIdle: true,
      updateWhenZooming: false,
      attribution: OSM_ATTRIBUTION
    }).addTo(map);

    activeMap = map;
    rememberMapView(map);
    map.on("moveend zoomend", () => rememberMapView(map));
    window.setTimeout(() => map.invalidateSize(), 160);
    return map;
  }

  function readMapView() {
    try {
      const parsed = JSON.parse(window.sessionStorage.getItem(MAP_VIEW_KEY) || "null");
      if (
        Array.isArray(parsed?.center) &&
        parsed.center.length === 2 &&
        parsed.center.every(Number.isFinite) &&
        Number.isFinite(parsed.zoom)
      ) {
        return parsed;
      }
    } catch {
      // Ignore storage errors; the default UK view is still valid.
    }

    return null;
  }

  function rememberMapView(map = activeMap) {
    if (!map?.getCenter) return;

    try {
      const center = map.getCenter();
      window.sessionStorage.setItem(MAP_VIEW_KEY, JSON.stringify({
        center: [center.lat, center.lng],
        zoom: map.getZoom()
      }));
    } catch {
      // Map navigation still works without session storage.
    }
  }

  function invalidateActiveMap() {
    window.setTimeout(() => activeMap?.invalidateSize?.({ pan: false }), 80);
  }

  function createPane(map, name, zIndex, pointerEvents, className) {
    const pane = map.getPane(name) || map.createPane(name);
    pane.style.zIndex = String(zIndex);
    pane.style.pointerEvents = pointerEvents;
    if (className) pane.classList.add(className);
    return pane;
  }

  async function loadRegions() {
    try {
      const response = await fetch(REGIONS_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return normaliseRegions(await response.json());
    } catch (error) {
      return fallbackRegions;
    }
  }

  function normaliseRegions(data) {
    const regions = Array.isArray(data) ? data : data?.regions;
    if (!Array.isArray(regions) || !regions.length) return fallbackRegions;
    return regions.map((region, index) => ({
      id: String(region.id || `region-${index + 1}`),
      name: String(region.name || region.id || `Region ${index + 1}`),
      bounds: region.bounds || null,
      sites: normaliseSites(region.sites || [], region.name || region.id || `Region ${index + 1}`)
    }));
  }

  function normaliseSites(sites, regionName) {
    if (!Array.isArray(sites)) return [];
    return sites
      .map((site, index) => ({
        id: String(site.id || `${regionName}-${index + 1}`),
        name: String(site.name || site.siteName || `Site ${index + 1}`),
        region: String(site.region || regionName || "Unknown"),
        lat: Number(site.lat ?? site.latitude),
        lon: Number(site.lon ?? site.lng ?? site.longitude)
      }))
      .filter((site) => Number.isFinite(site.lat) && Number.isFinite(site.lon));
  }

  function allSites(regions) {
    return (regions || []).flatMap((region) => {
      return (region.sites || []).map((site) => ({
        ...site,
        region: site.region || region.name || region.id || "Unknown"
      }));
    });
  }

  function fitSites(map, sites) {
    if (!map || !sites.length) return;
    const points = sites.map((site) => [site.lat, site.lon]);
    map.fitBounds(points, { padding: [32, 32], maxZoom: 8 });
  }

  function markerIcon(options = {}) {
    const colour = options.colour || weatherColour("rain");
    const label = options.label || "";
    return window.L.divIcon({
      className: "weather-marker-shell",
      html: `<span class="weather-marker" style="--weather-marker-colour:${escapeHtml(colour)}">${escapeHtml(label)}</span>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function setBusy(button, busy, loadingText, readyText) {
    if (!button) return;
    button.disabled = Boolean(busy);
    button.textContent = busy ? loadingText : readyText;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDateTime(epochSeconds) {
    if (!Number.isFinite(epochSeconds)) return "Unknown";
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/London"
    }).format(new Date(epochSeconds * 1000));
  }

  function formatIsoTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/London"
    }).format(date);
  }

  function weatherColour(level) {
    const bands = window.FIELDOPS_WEATHER_DISPLAY_STYLE?.metOffice?.rainfallBands || [];
    const map = {
      extreme: bands[0]?.colour,
      heavy: bands[2]?.colour,
      rain: bands[5]?.colour,
      light: bands[7]?.colour,
      dry: "#B3D0AE",
      wind: "#FCCA15",
      gauge: "#0FBCFF"
    };
    return map[level] || map.rain;
  }

  function haversineKm(a, b) {
    const radiusKm = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinLat = Math.sin(dLat / 2);
    const sinLon = Math.sin(dLon / 2);
    const h = (sinLat * sinLat) + (Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon);
    return 2 * radiusKm * Math.asin(Math.sqrt(h));
  }

  function toRad(value) {
    return value * Math.PI / 180;
  }

  return {
    VERSION,
    UK_BOUNDS,
    UK_CENTER,
    initMap,
    readMapView,
    rememberMapView,
    rememberCurrentMapView: rememberMapView,
    invalidateActiveMap,
    loadRegions,
    allSites,
    fitSites,
    markerIcon,
    setText,
    setBusy,
    escapeHtml,
    formatDateTime,
    formatIsoTime,
    weatherColour,
    haversineKm
  };
})();
