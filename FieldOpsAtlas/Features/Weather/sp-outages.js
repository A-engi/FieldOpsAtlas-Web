/* ==========================================================================
   FieldOps Atlas - SP Networks outage source test map
   File: FieldOpsAtlas/Features/Weather/sp-outages.js
   Version: 0.1.0-sp-test-map
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "0.1.0-sp-test-map";
  const DATA_ROOT = "data/sp-outages-test";
  const LEGACY_DATA_ROOT = "data/outages";
  const REFRESH_MS = 5 * 60 * 1000;
  const SP_COVERAGE_BOUNDS = [[52.45, -5.85], [56.45, -1.55]];
  const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const OSM_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

  const SOURCE_CATALOG = [
    {
      id: "official-v2.1-records",
      name: "Official records v2.1",
      short: "O21"
    },
    {
      id: "official-v2.0-records",
      name: "Official records v2.0",
      short: "O20"
    },
    {
      id: "official-v2.1-geojson",
      name: "Official GeoJSON export",
      short: "OGJ"
    },
    {
      id: "global-ods-v2.1-records",
      name: "Global ODS mirror",
      short: "ODS"
    },
    {
      id: "global-huwise-v2.1-records",
      name: "Huwise mirror",
      short: "HUW"
    }
  ];

  const LEGACY_SOURCE = {
    id: "current-map-output",
    name: "Existing seven-provider output",
    short: "CUR"
  };

  const state = {
    map: null,
    bundles: new Map(),
    records: new Map(),
    statuses: new Map(),
    activeSources: new Set(),
    selectedSource: null,
    summary: null,
    sequence: 0,
    refreshTimer: null,
    initialised: false
  };

  const elements = {};

  function init() {
    captureElements();
    initPanels();

    if (!window.L || !elements.map) {
      setHeadline("Map unavailable", "error");
      return;
    }

    initMap();
    bindControls();
    refreshAll();
    state.refreshTimer = window.setInterval(refreshAll, REFRESH_MS);
  }

  function captureElements() {
    elements.map = document.getElementById("spOutageMap");
    elements.sourceSummary = document.getElementById("sourceSummary");
    elements.sourceList = document.getElementById("sourceList");
    elements.useSelectedSource = document.getElementById("useSelectedSource");
    elements.deactivateAllSources = document.getElementById("deactivateAllSources");
    elements.headlineStatus = document.getElementById("headlineStatus");
    elements.liveBadge = document.getElementById("liveBadge");
    elements.statusText = document.getElementById("statusText");
    elements.showCurrent = document.getElementById("showCurrent");
    elements.showPlanned = document.getElementById("showPlanned");
    elements.showRestored = document.getElementById("showRestored");
    elements.refresh = document.getElementById("refreshSpOutages");
    elements.fitCoverage = document.getElementById("fitSpCoverage");
    elements.currentCount = document.getElementById("currentCount");
    elements.plannedCount = document.getElementById("plannedCount");
    elements.incidentCount = document.getElementById("incidentCount");
    elements.rawRowCount = document.getElementById("rawRowCount");
    elements.validRowCount = document.getElementById("validRowCount");
    elements.skippedRowCount = document.getElementById("skippedRowCount");
    elements.selectedSourceName = document.getElementById("selectedSourceName");
    elements.authStatus = document.getElementById("authStatus");
    elements.generatedAt = document.getElementById("generatedAt");
    elements.collectorVersion = document.getElementById("collectorVersion");
  }

  function initPanels() {
    document.querySelectorAll(".outage-panel").forEach((panel) => {
      panel.addEventListener("toggle", () => {
        window.setTimeout(() => state.map?.invalidateSize({ pan: false }), 120);
      });
    });
  }

  function initMap() {
    state.map = window.L.map(elements.map, {
      center: [54.35, -3.35],
      zoom: 6,
      minZoom: 3,
      maxZoom: 15,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: false
    });

    const basePane = state.map.createPane("spOutageBasePane");
    basePane.style.zIndex = "190";
    basePane.classList.add("weather-base-pane");

    const markerPane = state.map.createPane("spOutageMarkerPane");
    markerPane.style.zIndex = "620";
    markerPane.classList.add("weather-marker-pane");

    window.L.control.zoom({ position: "topright" }).addTo(state.map);

    window.L.tileLayer(OSM_TILE_URL, {
      pane: "spOutageBasePane",
      minZoom: 3,
      maxZoom: 15,
      noWrap: true,
      keepBuffer: 1,
      updateWhenIdle: true,
      updateWhenZooming: false,
      attribution: OSM_ATTRIBUTION
    }).addTo(state.map);

    fitCoverage();
    window.setTimeout(() => state.map.invalidateSize(), 160);
  }

  function bindControls() {
    elements.refresh?.addEventListener("click", refreshAll);
    elements.fitCoverage?.addEventListener("click", fitVisibleIncidents);

    [elements.showCurrent, elements.showPlanned, elements.showRestored]
      .forEach((input) => input?.addEventListener("change", () => {
        syncVisibility();
        updateSummary();
      }));

    elements.sourceList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-source-toggle]");
      if (!button || button.disabled) return;

      const sourceId = button.getAttribute("data-source-toggle");
      if (!sourceId) return;

      if (state.activeSources.has(sourceId)) {
        state.activeSources.delete(sourceId);
      } else {
        state.activeSources.add(sourceId);
      }

      syncVisibility();
      renderSourceList();
      updateSummary();
    });

    elements.useSelectedSource?.addEventListener("click", () => {
      state.activeSources.clear();
      if (state.selectedSource && isSourceUsable(state.statuses.get(state.selectedSource))) {
        state.activeSources.add(state.selectedSource);
      }
      syncVisibility();
      renderSourceList();
      updateSummary();
      fitVisibleIncidents();
    });

    elements.deactivateAllSources?.addEventListener("click", () => {
      state.activeSources.clear();
      syncVisibility();
      renderSourceList();
      updateSummary();
    });
  }

  async function refreshAll() {
    const sequence = state.sequence + 1;
    state.sequence = sequence;

    setRefreshState(true);
    setHeadline("Loading SP Networks test datasets", "loading");

    try {
      const summary = await fetchJson(`${DATA_ROOT}/summary.json`, sequence, true);

      if (sequence !== state.sequence) return;

      if (summary) {
        await applyTestSummary(summary, sequence);
      } else {
        await applyLegacyFallback(sequence);
      }

      if (sequence !== state.sequence) return;

      if (!state.initialised) {
        chooseInitialSource();
        state.initialised = true;
        fitVisibleIncidents();
      }

      syncVisibility();
      renderSourceList();
      updateSummary();
    } catch (error) {
      if (sequence !== state.sequence) return;
      setHeadline("SP Networks test data unavailable", "error");
      elements.statusText.textContent = conciseError(error);
    } finally {
      if (sequence === state.sequence) setRefreshState(false);
    }
  }

  async function applyTestSummary(summary, sequence) {
    state.summary = summary;
    state.selectedSource = summary.selectedSource || null;
    state.statuses.clear();

    const reportedSources = Array.isArray(summary.sources) ? summary.sources : [];

    SOURCE_CATALOG.forEach((definition) => {
      const reported = reportedSources.find((item) => item.id === definition.id);
      const status = {
        ...definition,
        ...(reported || {}),
        state: reported?.state || "waiting"
      };
      state.statuses.set(definition.id, status);
      ensureBundle(definition);
    });

    const loads = SOURCE_CATALOG.map(async (definition) => {
      const status = state.statuses.get(definition.id);
      const file = status?.file;

      if (!file || !["live", "empty", "stale"].includes(status.state)) {
        clearBundle(definition.id);
        return;
      }

      try {
        const geojson = await fetchJson(`${DATA_ROOT}/${file}`, sequence, false);
        if (sequence !== state.sequence) return;
        replaceSourceFeatures(definition, geojson?.features || []);
      } catch (error) {
        const previous = state.statuses.get(definition.id) || definition;
        state.statuses.set(definition.id, {
          ...previous,
          state: "error",
          error: conciseError(error)
        });
        clearBundle(definition.id);
      }
    });

    await Promise.allSettled(loads);
  }

  async function applyLegacyFallback(sequence) {
    state.summary = null;
    state.selectedSource = LEGACY_SOURCE.id;
    state.statuses.clear();

    ensureBundle(LEGACY_SOURCE);

    const [statusPayload, geojson] = await Promise.all([
      fetchJson(`${LEGACY_DATA_ROOT}/status.json`, sequence, true),
      fetchJson(`${LEGACY_DATA_ROOT}/spen.geojson`, sequence, false)
    ]);

    if (sequence !== state.sequence) return;

    const providerStatus = statusPayload?.providers?.spen || {};
    const records = Array.isArray(geojson?.features) ? geojson.features : [];

    state.statuses.set(LEGACY_SOURCE.id, {
      ...LEGACY_SOURCE,
      ...providerStatus,
      state: geojson?.stale
        ? "stale"
        : providerStatus.state || (records.length ? "live" : "empty"),
      file: "../outages/spen.geojson",
      uniqueIncidents: records.length,
      fallback: true
    });

    replaceSourceFeatures(LEGACY_SOURCE, records);
  }

  function chooseInitialSource() {
    if (state.selectedSource && isSourceUsable(state.statuses.get(state.selectedSource))) {
      state.activeSources = new Set([state.selectedSource]);
      return;
    }

    const firstUsable = [...state.statuses.values()].find(isSourceUsable);
    state.activeSources = firstUsable ? new Set([firstUsable.id]) : new Set();
  }

  function ensureBundle(source) {
    if (state.bundles.has(source.id)) return state.bundles.get(source.id);

    const root = window.L.layerGroup();
    const current = window.L.layerGroup();
    const planned = window.L.layerGroup();
    const restored = window.L.layerGroup();

    root.addLayer(current);
    root.addLayer(planned);
    root.addLayer(restored);

    const bundle = { root, current, planned, restored };
    state.bundles.set(source.id, bundle);
    state.records.set(source.id, []);
    return bundle;
  }

  function clearBundle(sourceId) {
    const bundle = state.bundles.get(sourceId);
    if (!bundle) return;

    bundle.current.clearLayers();
    bundle.planned.clearLayers();
    bundle.restored.clearLayers();
    state.records.set(sourceId, []);
  }

  function replaceSourceFeatures(source, features) {
    const bundle = ensureBundle(source);
    clearBundle(source.id);

    const records = [];

    features.forEach((feature, index) => {
      const record = featureToRecord(source, feature, index);
      if (!record) return;

      const target = bundle[record.category] || bundle.current;
      const marker = window.L.marker([record.lat, record.lon], {
        pane: "spOutageMarkerPane",
        keyboard: true,
        icon: createIncidentIcon(record)
      });

      marker.bindPopup(createPopupHtml(record), {
        closeButton: true,
        className: "outage-popup-shell"
      });

      marker.addTo(target);
      record.marker = marker;
      records.push(record);
    });

    state.records.set(source.id, records);
  }

  function featureToRecord(source, feature, index) {
    const coordinates = feature?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

    const lon = Number(coordinates[0]);
    const lat = Number(coordinates[1]);
    if (!validCoordinate(lat, lon)) return null;

    const properties = feature.properties || {};
    const category = ["current", "planned", "restored"].includes(properties.category)
      ? properties.category
      : "current";

    return {
      key: String(feature.id || `${source.id}:${category}:${lat}:${lon}:${index}`),
      sourceId: source.id,
      sourceName: source.name,
      sourceShort: source.short,
      provider: properties.provider || "SP Networks",
      reference: properties.reference || null,
      category,
      status: properties.status || category,
      type: properties.type || category,
      area: properties.area || "Published incident location",
      lat,
      lon,
      startedAt: parseTimestamp(properties.startedAt),
      restoreAt: parseTimestamp(properties.restoreAt),
      updatedAt: parseTimestamp(properties.updatedAt),
      officialUrl: safeOfficialUrl(properties.officialUrl),
      locationQuality: properties.locationQuality || "approximate",
      rawRecordCount: Math.max(1, Number(properties.rawRecordCount || 1)),
      coordinateSpreadKm: Math.max(0, Number(properties.coordinateSpreadKm || 0))
    };
  }

  function createIncidentIcon(record) {
    const colour = categoryColour(record.category);
    const groupedBadge = record.rawRecordCount > 1
      ? `<span class="outage-marker-count">${record.rawRecordCount}</span>`
      : "";

    return window.L.divIcon({
      className: "sp-source-marker",
      html: [
        '<span class="outage-marker-core" ',
        `data-source="${escapeAttribute(record.sourceShort || "SP")}" `,
        `style="--outage-colour:${colour}" aria-hidden="true"></span>`,
        groupedBadge
      ].join(""),
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });
  }

  function createPopupHtml(record) {
    const grouped = record.rawRecordCount > 1
      ? `<span class="outage-popup-grouped">Grouped from ${record.rawRecordCount} source rows.</span>`
      : "";

    return [
      '<div class="outage-popup">',
      `<strong>${escapeHtml(record.provider)}</strong>`,
      `<span class="sp-popup-source">Source: ${escapeHtml(record.sourceName)}</span>`,
      `<span class="outage-popup-status">${escapeHtml(humanise(record.type))} · ${escapeHtml(humanise(record.status))}</span>`,
      `<span>${escapeHtml(record.area)}</span>`,
      grouped,
      `<span>Location: ${escapeHtml(humanise(record.locationQuality))}</span>`,
      record.startedAt ? `<span>Started: ${escapeHtml(formatDateTime(record.startedAt))}</span>` : "",
      record.restoreAt ? `<span>Estimated finish: ${escapeHtml(formatDateTime(record.restoreAt))}</span>` : "",
      record.updatedAt ? `<span>Provider update: ${escapeHtml(formatDateTime(record.updatedAt))}</span>` : "",
      `<span>Reference: ${escapeHtml(record.reference || "Not published")}</span>`,
      `<span>${record.lat.toFixed(4)}, ${record.lon.toFixed(4)}</span>`,
      `<a href="${escapeAttribute(record.officialUrl)}" target="_blank" rel="noopener noreferrer">Open official map</a>`,
      "</div>"
    ].join("");
  }

  function syncVisibility() {
    const categoryVisibility = {
      current: Boolean(elements.showCurrent?.checked),
      planned: Boolean(elements.showPlanned?.checked),
      restored: Boolean(elements.showRestored?.checked)
    };

    state.bundles.forEach((bundle, sourceId) => {
      const sourceVisible = state.activeSources.has(sourceId);
      const rootVisible = state.map.hasLayer(bundle.root);

      if (sourceVisible && !rootVisible) bundle.root.addTo(state.map);
      if (!sourceVisible && rootVisible) state.map.removeLayer(bundle.root);

      Object.entries(categoryVisibility).forEach(([category, visible]) => {
        const layer = bundle[category];
        const included = bundle.root.hasLayer(layer);

        if (visible && !included) bundle.root.addLayer(layer);
        if (!visible && included) bundle.root.removeLayer(layer);
      });
    });
  }

  function renderSourceList() {
    if (!elements.sourceList) return;

    const definitions = state.summary ? SOURCE_CATALOG : [LEGACY_SOURCE];

    elements.sourceList.innerHTML = definitions.map((definition) => {
      const status = state.statuses.get(definition.id) || {
        ...definition,
        state: "waiting"
      };
      const active = state.activeSources.has(definition.id);
      const usable = isSourceUsable(status);
      const selected = state.selectedSource === definition.id;
      const detail = sourceDetail(status);
      const rowState = status.state === "partial" ? "stale" : status.state;

      return [
        `<div class="outage-source-row is-${escapeAttribute(rowState || "waiting")}${selected ? " is-selected" : ""}">`,
        `<button class="sp-source-toggle" type="button" data-source-toggle="${escapeAttribute(definition.id)}"`,
        ` aria-pressed="${String(active)}"${usable ? "" : " disabled"}>`,
        '<span class="outage-source-dot" aria-hidden="true"></span>',
        '<span class="sp-source-meta">',
        `<strong>${escapeHtml(definition.name)}</strong>`,
        `<small>${escapeHtml(detail)}</small>`,
        "</span>",
        `<span class="sp-source-state">${escapeHtml(sourceStateLabel(status.state, active))}</span>`,
        "</button>",
        "</div>"
      ].join("");
    }).join("");
  }

  function updateSummary() {
    const visibleRecords = activeRecords().filter((record) => categoryIsVisible(record.category));
    const current = visibleRecords.filter((record) => record.category === "current").length;
    const planned = visibleRecords.filter((record) => record.category === "planned").length;
    const selectedStatus = state.statuses.get(state.selectedSource) || null;
    const usableCount = [...state.statuses.values()].filter(isSourceUsable).length;
    const sourceCount = state.statuses.size;

    elements.currentCount.textContent = String(current);
    elements.plannedCount.textContent = String(planned);
    elements.incidentCount.textContent = String(visibleRecords.length);
    elements.rawRowCount.textContent = String(selectedStatus?.rawRows || 0);
    elements.validRowCount.textContent = String(selectedStatus?.validRows || 0);
    elements.skippedRowCount.textContent = String(selectedStatus?.skippedRows || 0);
    elements.selectedSourceName.textContent =
      selectedStatus?.name || selectedStatus?.label || "Not selected";
    elements.authStatus.textContent = state.summary
      ? state.summary.authConfigured
        ? "Configured"
        : "Not configured"
      : "Main collector";
    elements.generatedAt.textContent = state.summary?.generatedAt
      ? formatDateTime(state.summary.generatedAt)
      : selectedStatus?.generatedAt
        ? formatDateTime(selectedStatus.generatedAt)
        : "Unknown";
    elements.collectorVersion.textContent =
      state.summary?.version || "Existing map output";

    elements.sourceSummary.textContent = state.summary
      ? `${usableCount}/${sourceCount} methods usable · ${visibleRecords.length} visible`
      : `Test summary unavailable · showing existing output`;

    if (state.activeSources.size === 0) {
      setHeadline("All SP Networks test layers hidden", "error");
      elements.statusText.textContent =
        "Open SP Networks source tests and activate a usable source.";
      return;
    }

    const activeStatuses = [...state.activeSources]
      .map((sourceId) => state.statuses.get(sourceId))
      .filter(Boolean);
    const hasError = activeStatuses.some((status) => status.state === "error");
    const hasStale = activeStatuses.some((status) => status.state === "stale");
    const allEmpty = activeStatuses.length > 0 &&
      activeStatuses.every((status) => status.state === "empty");

    if (hasError) {
      setHeadline(`${current} current · ${planned} planned · source error`, "error");
    } else if (hasStale) {
      setHeadline(`${current} current · ${planned} planned · stale source`, "stale");
    } else if (allEmpty || visibleRecords.length === 0) {
      setHeadline("Sources responded with no published incidents", "empty");
    } else {
      setHeadline(`${current} current · ${planned} planned`, "live");
    }

    const activeNames = [...state.activeSources]
      .map((sourceId) => state.statuses.get(sourceId)?.name)
      .filter(Boolean)
      .join(", ");

    elements.statusText.textContent = visibleRecords.length
      ? `Showing ${visibleRecords.length} incidents from ${activeNames}. Multiple active methods may display the same incident more than once for comparison.`
      : `No incidents are visible from ${activeNames || "the active source"}. Check the source state before treating an empty result as a fault.`;
  }

  function setHeadline(message, mode) {
    elements.headlineStatus.textContent = message;
    elements.liveBadge.className = "weather-pill outage-live-pill";

    if (mode === "live") {
      elements.liveBadge.textContent = "LIVE";
      elements.liveBadge.classList.add("is-live");
    } else if (mode === "empty") {
      elements.liveBadge.textContent = "EMPTY";
    } else if (mode === "stale") {
      elements.liveBadge.textContent = "STALE";
      elements.liveBadge.classList.add("is-partial");
    } else if (mode === "error") {
      elements.liveBadge.textContent = "ERROR";
      elements.liveBadge.classList.add("is-error");
    } else {
      elements.liveBadge.textContent = "LOADING";
    }
  }

  function setRefreshState(loading) {
    if (!elements.refresh) return;
    elements.refresh.disabled = loading;
    elements.refresh.textContent = loading ? "Refreshing" : "Refresh test data";
  }

  function fitCoverage() {
    state.map.fitBounds(SP_COVERAGE_BOUNDS, { padding: [18, 18] });
  }

  function fitVisibleIncidents() {
    const points = activeRecords()
      .filter((record) => categoryIsVisible(record.category))
      .map((record) => [record.lat, record.lon]);

    if (!points.length) {
      fitCoverage();
      return;
    }

    state.map.fitBounds(window.L.latLngBounds(points), {
      padding: [36, 36],
      maxZoom: 11
    });
  }

  function activeRecords() {
    return [...state.activeSources].flatMap(
      (sourceId) => state.records.get(sourceId) || []
    );
  }

  function categoryIsVisible(category) {
    if (category === "planned") return Boolean(elements.showPlanned?.checked);
    if (category === "restored") return Boolean(elements.showRestored?.checked);
    return Boolean(elements.showCurrent?.checked);
  }

  function isSourceUsable(status) {
    return Boolean(status && ["live", "empty", "stale"].includes(status.state));
  }

  function sourceDetail(status) {
    if (status.error) return status.error;
    if (status.state === "skipped") return status.message || "Skipped because authentication is unavailable";
    if (status.state === "waiting") return "Not reported by the latest test run";

    const parts = [];
    if (Number.isFinite(Number(status.rawRows))) {
      parts.push(`${Number(status.rawRows)} raw`);
    }
    if (Number.isFinite(Number(status.uniqueIncidents))) {
      parts.push(`${Number(status.uniqueIncidents)} incidents`);
    }
    if (Number.isFinite(Number(status.durationMs))) {
      parts.push(`${Number(status.durationMs)} ms`);
    }
    if (status.fallback) parts.push("existing map output");

    return parts.join(" · ") || status.message || "No source details";
  }

  function sourceStateLabel(sourceState, active) {
    if (!active && isSourceUsable({ state: sourceState })) return "OFF";
    if (sourceState === "live") return "LIVE";
    if (sourceState === "empty") return "EMPTY";
    if (sourceState === "stale") return "STALE";
    if (sourceState === "error") return "ERROR";
    if (sourceState === "skipped") return "SKIPPED";
    if (sourceState === "loading") return "LOADING";
    return "WAITING";
  }

  async function fetchJson(path, sequence, optional) {
    const separator = path.includes("?") ? "&" : "?";
    const response = await fetch(`${path}${separator}v=${sequence}-${Date.now()}`, {
      cache: "no-store",
      headers: { Accept: "application/json, application/geo+json" }
    });

    if (optional && response.status === 404) return null;
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return response.json();
  }

  function validCoordinate(lat, lon) {
    return Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= 48 &&
      lat <= 62.5 &&
      lon >= -12.5 &&
      lon <= 4;
  }

  function categoryColour(category) {
    if (category === "planned") return "#f6b73c";
    if (category === "restored") return "#8193a4";
    return "#f04438";
  }

  function safeOfficialUrl(value) {
    try {
      const url = new URL(
        value || "https://www.spenergynetworks.co.uk/pages/power_cuts.aspx"
      );
      return ["http:", "https:"].includes(url.protocol)
        ? url.toString()
        : "https://www.spenergynetworks.co.uk/pages/power_cuts.aspx";
    } catch {
      return "https://www.spenergynetworks.co.uk/pages/power_cuts.aspx";
    }
  }

  function parseTimestamp(value) {
    if (!value) return null;
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function formatDateTime(value) {
    const parsed = typeof value === "number" ? value : Date.parse(value);
    if (!Number.isFinite(parsed)) return "Unknown";

    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/London"
    }).format(parsed);
  }

  function humanise(value) {
    return String(value || "")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function conciseError(error) {
    return String(error?.message || error || "Unknown error").slice(0, 320);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
