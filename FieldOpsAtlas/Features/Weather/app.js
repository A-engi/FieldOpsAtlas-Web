/* FieldOps Atlas Weather shared utilities v0.3.1
   Static-safe: no committed API keys, no internal operational data.
   Provider/API screens are data-only here; no provider screen owns a Leaflet/OSM map.
*/

window.AtlasWeatherLab = (() => {
  "use strict";

  const version = "0.3.1-west-wales-demo-source";
  const regionsUrl = "data/regions.json";

  const fallbackRegions = [
    {
      id: "West-Wales",
      name: "West-Wales Demo",
      bounds: null,
      sites: []
    }
  ];

  async function loadRegions() {
    try {
      const response = await fetch(regionsUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return normaliseRegions(data);
    } catch (error) {
      console.warn("Weather regions fallback used", error);
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

  function sitesFromRegions(regions) {
    return allSites(regions);
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
    if (!Number.isFinite(epochSeconds)) return "Unknown time";
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

  function riskColor(level) {
    const style = window.FIELDOPS_WEATHER_DISPLAY_STYLE;
    return style?.riskStates?.[level]?.colour || style?.riskStates?.rain?.colour || "currentColor";
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
    version,
    loadRegions,
    allSites,
    sitesFromRegions,
    escapeHtml,
    formatDateTime,
    formatIsoTime,
    riskColor,
    haversineKm
  };
})();

/* End of file: FieldOpsAtlas/Features/Weather/app.js */
