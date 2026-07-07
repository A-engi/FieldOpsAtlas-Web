/* ==========================================================================
   FieldOps Atlas - UK electricity outages
   File: FieldOpsAtlas/Features/Weather/outages.js
   Version: 0.3.0-layergroups-dedupe

   The page requests official provider feeds directly where those feeds permit
   browser access. A failed source remains visible in the provider panel and
   links to the operator's own outage map.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "0.3.0-layergroups-dedupe";
  const ACTIVE_SOURCES_KEY = "fieldops-outage-active-sources-v1";
  const REFRESH_MS = 5 * 60 * 1000;
  const FETCH_TIMEOUT_MS = 18000;
  const MAX_RECORDS_PER_SOURCE = 600;
  const UK_BOUNDS = [[49.5, -11.0], [61.2, 2.7]];
  const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const OSM_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

  const SOURCES = [
    {
      id: "ukpn",
      name: "UK Power Networks",
      mode: "ods-discover",
      domain: "https://ukpowernetworks.opendatasoft.com",
      keywords: ["live power cuts", "power cuts", "outage"],
      officialUrl: "https://www.ukpowernetworks.co.uk/power-cut/map"
    },
    {
      id: "npg",
      name: "Northern Powergrid",
      mode: "ods",
      domain: "https://northernpowergrid.opendatasoft.com",
      dataset: "live-power-cuts-data",
      officialUrl: "https://www.northernpowergrid.com/power-cuts"
    },
    {
      id: "nged",
      name: "National Grid ED",
      mode: "csv",
      url: "https://connecteddata.nationalgrid.co.uk/dataset/d6672e1e-c684-4cea-bb78-c7e5248b62a2/resource/a1365982-4e05-463c-8304-8323a2ba0ccd/download/live_detailed_power_cuts.csv",
      officialUrl: "https://powercuts.nationalgrid.co.uk/"
    },
    {
      id: "spenw",
      name: "SP Electricity North West",
      mode: "ods",
      domain: "https://electricitynorthwest.opendatasoft.com",
      dataset: "live_incidents",
      officialUrl: "https://www.enwl.co.uk/power-cuts"
    },
    {
      id: "ssen",
      name: "SSEN Distribution",
      mode: "ckan",
      packageUrl: "https://ckan-prod.sse.datopian.com/api/3/action/package_show?id=realtime_outage_dataset",
      officialUrl: "https://powertrack.ssen.co.uk/powertrack"
    },
    {
      id: "spen",
      name: "SP Energy Networks",
      mode: "ods-discover",
      domain: "https://spenergynetworks.opendatasoft.com",
      keywords: ["live outages", "power cuts", "outage"],
      officialUrl: "https://www.spenergynetworks.co.uk/pages/power_cuts.aspx"
    },
    {
      id: "nie",
      name: "NIE Networks",
      mode: "ods-discover",
      domain: "https://nienetworks.opendatasoft.com",
      keywords: ["live network faults", "powercheck", "outage", "power cut"],
      officialUrl: "https://powercheck.nienetworks.co.uk/"
    }
  ];

  const state = {
    map: null,
    providerLayers: new Map(),
    sourceIncidents: new Map(),
    incidents: new Map(),
    firstSeen: new Map(),
    sourceState: new Map(),
    loadingSources: new Set(),
    refreshTimer: null,
    renderTimer: null,
    activeSources: new Set()
  };

  const elements = {};

  function init() {
    captureElements();
    state.activeSources = readActiveSources();
    initPanels();

    if (!window.L || !elements.map) {
      setHeadline("Map unavailable", "error");
      return;
    }

    initMap();
    bindControls();
    renderSourceList();
    loadAllSources();

    state.refreshTimer = window.setInterval(loadAllSources, REFRESH_MS);
    state.renderTimer = window.setInterval(refreshAnimatedMarkers, 1000);
  }

  function captureElements() {
    elements.map = document.getElementById("outageMap");
    elements.sourceSummary = document.getElementById("sourceSummary");
    elements.sourceList = document.getElementById("sourceList");
    elements.activateAllProviders = document.getElementById("activateAllProviders");
    elements.deactivateAllProviders = document.getElementById("deactivateAllProviders");
    elements.headlineStatus = document.getElementById("headlineStatus");
    elements.liveBadge = document.getElementById("liveBadge");
    elements.statusText = document.getElementById("statusText");
    elements.showCurrent = document.getElementById("showCurrent");
    elements.showPlanned = document.getElementById("showPlanned");
    elements.showRestored = document.getElementById("showRestored");
    elements.refresh = document.getElementById("refreshOutages");
    elements.ukView = document.getElementById("ukView");
    elements.currentCount = document.getElementById("currentCount");
    elements.plannedCount = document.getElementById("plannedCount");
    elements.providerCount = document.getElementById("providerCount");
    elements.rawRowCount = document.getElementById("rawRowCount");
    elements.uniqueIncidentCount = document.getElementById("uniqueIncidentCount");
    elements.groupedRowCount = document.getElementById("groupedRowCount");
    elements.animationDuration = document.getElementById("newIncidentAnimation");
  }

  function initPanels() {
    document.querySelectorAll(".outage-panel").forEach((panel) => {
      panel.addEventListener("toggle", () => {
        window.setTimeout(() => {
          state.map?.invalidateSize({ pan: false });
        }, 120);
      });
    });
  }

  function initMap() {
    state.map = window.L.map(elements.map, {
      center: [54.7, -3.2],
      zoom: 5,
      minZoom: 3,
      maxZoom: 13,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: false
    });

    const basePane = state.map.createPane("outageBasePane");
    basePane.style.zIndex = "190";
    basePane.classList.add("weather-base-pane");

    const markerPane = state.map.createPane("outageMarkerPane");
    markerPane.style.zIndex = "620";
    markerPane.classList.add("weather-marker-pane");

    window.L.control.zoom({ position: "topright" }).addTo(state.map);

    window.L.tileLayer(OSM_TILE_URL, {
      pane: "outageBasePane",
      minZoom: 3,
      maxZoom: 13,
      noWrap: true,
      keepBuffer: 1,
      updateWhenIdle: true,
      updateWhenZooming: false,
      attribution: OSM_ATTRIBUTION
    }).addTo(state.map);

    initialiseProviderLayers();
    syncProviderVisibility();
    syncCategoryVisibility();
    fitUkView();
    window.setTimeout(() => state.map.invalidateSize(), 160);
  }

  function initialiseProviderLayers() {
    SOURCES.forEach((source) => {
      const current = window.L.layerGroup();
      const planned = window.L.layerGroup();
      const restored = window.L.layerGroup();
      const root = window.L.layerGroup([current, planned, restored]);

      state.providerLayers.set(source.id, {
        root,
        current,
        planned,
        restored
      });

      state.sourceIncidents.set(source.id, []);
    });
  }

  function syncProviderVisibility() {
    SOURCES.forEach((source) => {
      const bundle = state.providerLayers.get(source.id);
      if (!bundle) return;

      const shouldShow = state.activeSources.has(source.id);
      const isShown = state.map.hasLayer(bundle.root);

      if (shouldShow && !isShown) {
        bundle.root.addTo(state.map);
      } else if (!shouldShow && isShown) {
        state.map.removeLayer(bundle.root);
      }
    });
  }

  function syncCategoryVisibility() {
    const categoryState = {
      current: Boolean(elements.showCurrent?.checked),
      planned: Boolean(elements.showPlanned?.checked),
      restored: Boolean(elements.showRestored?.checked)
    };

    state.providerLayers.forEach((bundle) => {
      Object.entries(categoryState).forEach(([category, shouldShow]) => {
        const layer = bundle[category];
        const isIncluded = bundle.root.hasLayer(layer);

        if (shouldShow && !isIncluded) {
          bundle.root.addLayer(layer);
        } else if (!shouldShow && isIncluded) {
          bundle.root.removeLayer(layer);
        }
      });
    });
  }

  function allLoadedIncidents() {
    return Array.from(state.sourceIncidents.values()).flat();
  }

  function activeIncidents() {
    return Array.from(state.activeSources).flatMap(
      (sourceId) => state.sourceIncidents.get(sourceId) || []
    );
  }

  function fitUkView() {
    state.map.fitBounds(UK_BOUNDS, { padding: [12, 12] });

    window.requestAnimationFrame(() => {
      const nextZoom = Math.max(state.map.getMinZoom(), state.map.getZoom() - 1);
      state.map.setZoom(nextZoom, { animate: false });
    });
  }

  function bindControls() {
    elements.refresh?.addEventListener("click", loadAllSources);
    elements.ukView?.addEventListener("click", fitUkView);

    [
      elements.showCurrent,
      elements.showPlanned,
      elements.showRestored
    ].forEach((input) => input?.addEventListener("change", () => {
      syncCategoryVisibility();
      updateSummary();
    }));

    elements.animationDuration?.addEventListener("change", refreshAnimatedMarkers);

    elements.sourceList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-source-toggle]");
      if (!button) return;

      const sourceId = button.getAttribute("data-source-toggle");
      setSourceActive(sourceId, !state.activeSources.has(sourceId));
    });

    elements.activateAllProviders?.addEventListener("click", () => {
      state.activeSources = new Set(SOURCES.map((source) => source.id));
      writeActiveSources();
      syncProviderVisibility();
      syncCategoryVisibility();
      renderSourceList();
      updateSummary();
      loadAllSources();
    });

    elements.deactivateAllProviders?.addEventListener("click", () => {
      state.activeSources.clear();
      writeActiveSources();
      syncProviderVisibility();
      renderSourceList();
      updateSummary();
    });
  }

  function readActiveSources() {
    try {
      const stored = window.localStorage.getItem(ACTIVE_SOURCES_KEY);

      if (!stored) {
        return new Set(SOURCES.map((source) => source.id));
      }

      const parsed = JSON.parse(stored);
      const validIds = new Set(SOURCES.map((source) => source.id));

      return new Set(
        Array.isArray(parsed)
          ? parsed.filter((sourceId) => validIds.has(sourceId))
          : SOURCES.map((source) => source.id)
      );
    } catch (error) {
      return new Set(SOURCES.map((source) => source.id));
    }
  }

  function writeActiveSources() {
    try {
      window.localStorage.setItem(
        ACTIVE_SOURCES_KEY,
        JSON.stringify(Array.from(state.activeSources))
      );
    } catch (error) {
      // The page still works when storage is unavailable.
    }
  }

  function setSourceActive(sourceId, active) {
    const source = SOURCES.find((item) => item.id === sourceId);
    if (!source) return;

    if (active) {
      state.activeSources.add(sourceId);
    } else {
      state.activeSources.delete(sourceId);
    }

    writeActiveSources();
    syncProviderVisibility();
    syncCategoryVisibility();
    renderSourceList();
    updateSummary();

    if (active) {
      loadSingleSource(source);
    }
  }

  async function loadAllSources() {
    const activeSources = SOURCES.filter((source) => state.activeSources.has(source.id));

    if (elements.refresh) {
      elements.refresh.disabled = true;
      elements.refresh.textContent = "Refreshing";
    }

    if (!activeSources.length) {
      setHeadline("All outage providers deactivated", "error");
      elements.refresh.disabled = false;
      elements.refresh.textContent = "Refresh feeds";
      return;
    }

    setHeadline("Loading official provider feeds", "loading");

    await Promise.allSettled(activeSources.map(loadSingleSource));

    if (elements.refresh) {
      elements.refresh.disabled = false;
      elements.refresh.textContent = "Refresh feeds";
    }

    renderIncidents();
    renderSourceList();
    updateSummary();
  }

  async function loadSingleSource(source) {
    if (state.loadingSources.has(source.id)) {
      return;
    }

    state.loadingSources.add(source.id);

    const previous = state.sourceIncidents.get(source.id) || [];

    state.sourceState.set(source.id, {
      status: "loading",
      rawRows: 0,
      validRows: 0,
      uniqueCount: previous.length,
      groupedRows: 0,
      skipped: 0,
      stale: false,
      message: "Loading"
    });

    renderSourceList();

    try {
      const result = await loadSource(source);
      state.sourceIncidents.set(source.id, result.incidents);

      const status = result.uniqueCount > 0
        ? "live"
        : result.rawRows > 0 && result.validRows === 0
          ? "warning"
          : "empty";

      const message = result.uniqueCount > 0
        ? `${result.uniqueCount} unique · ${result.rawRows} rows · ${result.groupedRows} grouped`
        : result.rawRows > 0
          ? `${result.rawRows} rows loaded · no usable incidents`
          : "Feed loaded · no published incidents";

      state.sourceState.set(source.id, {
        status,
        rawRows: result.rawRows,
        validRows: result.validRows,
        uniqueCount: result.uniqueCount,
        groupedRows: result.groupedRows,
        skipped: result.skipped,
        stale: false,
        dataset: result.dataset || "",
        message
      });
    } catch (error) {
      const hasCached = previous.length > 0;

      state.sourceState.set(source.id, {
        status: "error",
        rawRows: 0,
        validRows: 0,
        uniqueCount: previous.length,
        groupedRows: 0,
        skipped: 0,
        stale: hasCached,
        message: hasCached
          ? `${conciseError(error)} · showing ${previous.length} cached`
          : conciseError(error)
      });
    } finally {
      state.loadingSources.delete(source.id);
      renderIncidents();
      renderSourceList();
      updateSummary();
    }
  }

  async function loadSource(source) {
    if (source.mode === "ods") {
      return loadOdsDataset(source, source.dataset);
    }

    if (source.mode === "ods-discover") {
      const dataset = await discoverOdsDataset(source);
      return loadOdsDataset(source, dataset);
    }

    if (source.mode === "csv") {
      const text = await fetchText(source.url);
      const rows = parseCsv(text);
      return normaliseRows(source, rows);
    }

    if (source.mode === "ckan") {
      return loadCkanPackage(source);
    }

    throw new Error("Unsupported source adapter");
  }

  async function discoverOdsDataset(source) {
    const url = `${source.domain}/api/explore/v2.1/catalog/datasets?limit=100`;
    const payload = await fetchJson(url);
    const datasets = Array.isArray(payload.results) ? payload.results : [];

    let best = null;
    let bestScore = 0;

    datasets.forEach((dataset) => {
      const id = String(dataset.dataset_id || dataset.datasetid || "");
      const metadata = dataset.metas?.default || dataset.metas || {};
      const haystack = [
        id,
        metadata.title,
        metadata.description,
        metadata.theme,
        metadata.keyword
      ].flat().filter(Boolean).join(" ").toLowerCase();

      let score = 0;
      source.keywords.forEach((keyword, index) => {
        if (haystack.includes(keyword.toLowerCase())) {
          score += 20 - Math.min(index, 10);
        }
      });

      if (haystack.includes("live")) score += 5;
      if (haystack.includes("current")) score += 4;
      if (haystack.includes("historic")) score -= 12;
      if (haystack.includes("archive")) score -= 12;

      if (score > bestScore && id) {
        best = id;
        bestScore = score;
      }
    });

    if (!best) {
      throw new Error("No public live-outage dataset found");
    }

    return best;
  }

  async function loadOdsDataset(source, dataset) {
    const allRows = [];
    let offset = 0;
    const pageSize = 100;

    while (offset < MAX_RECORDS_PER_SOURCE) {
      const url =
        `${source.domain}/api/explore/v2.1/catalog/datasets/` +
        `${encodeURIComponent(dataset)}/records?limit=${pageSize}&offset=${offset}`;

      const payload = await fetchJson(url);
      const rows = Array.isArray(payload.results) ? payload.results : [];
      allRows.push(...rows);

      if (rows.length < pageSize || allRows.length >= Number(payload.total_count || 0)) {
        break;
      }

      offset += pageSize;
    }

    const result = normaliseRows(source, allRows.slice(0, MAX_RECORDS_PER_SOURCE));
    result.dataset = dataset;
    return result;
  }

  async function loadCkanPackage(source) {
    const packagePayload = await fetchJson(source.packageUrl);

    if (!packagePayload.success || !packagePayload.result) {
      throw new Error("Outage package metadata unavailable");
    }

    const resources = Array.isArray(packagePayload.result.resources)
      ? packagePayload.result.resources
      : [];

    const candidates = resources
      .filter((resource) => {
        const text = [
          resource.name,
          resource.description,
          resource.format,
          resource.url_type,
          resource.url
        ].filter(Boolean).join(" ").toLowerCase();

        return text.includes("api") || text.includes("json") || text.includes("csv");
      })
      .sort((a, b) => resourceScore(b) - resourceScore(a));

    let lastError = null;

    for (const resource of candidates) {
      try {
        const format = String(resource.format || "").toLowerCase();
        const url = resource.url;

        if (!url) continue;

        if (format.includes("csv") || String(url).toLowerCase().includes(".csv")) {
          return normaliseRows(source, parseCsv(await fetchText(url)));
        }

        const payload = await fetchJson(url);
        const rows = extractRows(payload);

        if (rows.length) {
          return normaliseRows(source, rows);
        }
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("No browser-readable PowerTrack resource found");
  }

  function resourceScore(resource) {
    const text = [
      resource.name,
      resource.description,
      resource.format,
      resource.url_type
    ].filter(Boolean).join(" ").toLowerCase();

    let score = 0;
    if (text.includes("real time")) score += 10;
    if (text.includes("outage")) score += 10;
    if (text.includes("api")) score += 8;
    if (text.includes("json")) score += 6;
    if (text.includes("csv")) score += 4;
    if (text.includes("documentation")) score -= 10;
    return score;
  }

  function extractRows(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.records)) return payload.records;
    if (Array.isArray(payload?.features)) return payload.features;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.outages)) return payload.outages;
    return [];
  }

  function normaliseRows(source, rows) {
    const candidates = [];
    let skipped = 0;

    rows.forEach((row, index) => {
      const incident = normaliseIncident(source, row, index);

      if (incident) {
        candidates.push(incident);
      } else {
        skipped += 1;
      }
    });

    const incidents = deduplicateIncidents(source, candidates);

    return {
      incidents,
      rawRows: rows.length,
      validRows: candidates.length,
      uniqueCount: incidents.length,
      groupedRows: Math.max(0, candidates.length - incidents.length),
      skipped
    };
  }

  function normaliseIncident(source, row, index) {
    const featureProperties = row?.type === "Feature" ? row.properties : null;
    const raw = featureProperties || row?.record || row?.fields || row;
    const fields = flattenObject(raw || {});
    const geometry = row?.type === "Feature" ? row.geometry : raw?.geometry;
    const coordinate = findCoordinate(raw, fields, geometry);

    if (!coordinate) {
      return null;
    }

    const statusText = String(pick(fields, [
      "status",
      "incidentstatus",
      "outagestatus",
      "eventstatus",
      "state",
      "faultstatus"
    ]) || "");

    const typeText = String(pick(fields, [
      "type",
      "incidenttype",
      "outagetype",
      "eventtype",
      "interruptiontype",
      "plannedunplanned",
      "planned"
    ]) || "");

    const combinedType = `${typeText} ${statusText}`.toLowerCase();
    let category = "current";

    if (/restored|resolved|closed|complete|completed/.test(combinedType)) {
      category = "restored";
    } else if (/planned|scheduled|future/.test(combinedType)) {
      category = "planned";
    }

    const referenceValue = pick(fields, [
      "incidentid",
      "incidentreference",
      "incidentnumber",
      "incidentno",
      "eventid",
      "eventreference",
      "outageid",
      "outagereference",
      "faultid",
      "faultreference",
      "powercutreference",
      "jobid",
      "reference"
    ]);

    const providerReference = isUsefulReference(referenceValue)
      ? String(referenceValue).trim()
      : null;

    const area = String(pick(fields, [
      "location",
      "area",
      "locality",
      "town",
      "description",
      "incidentlocation",
      "outagelocation",
      "affectedarea",
      "postcode",
      "postcodes"
    ]) || "Published incident location");

    const startedAt = parseDate(pick(fields, [
      "starttime",
      "startedat",
      "incidentstart",
      "incidentstarttime",
      "reportedat",
      "reportedtime",
      "createdat",
      "createdtime",
      "from"
    ]));

    const restoreAt = parseDate(pick(fields, [
      "estimatedrestorationtime",
      "estimatedrestore",
      "estimatedrestored",
      "restorationtime",
      "estimatedend",
      "endtime",
      "to"
    ]));

    const updatedAt = parseDate(pick(fields, [
      "updatedat",
      "updatedtime",
      "lastupdated",
      "lastupdate",
      "modified",
      "modificationdate"
    ]));

    return {
      sourceId: source.id,
      provider: source.name,
      reference: providerReference,
      category,
      status: statusText || category,
      type: typeText || category,
      area,
      lat: coordinate.lat,
      lon: coordinate.lon,
      startedAt,
      restoreAt,
      updatedAt,
      officialUrl: source.officialUrl,
      rawIndex: index
    };
  }

  function isUsefulReference(value) {
    if (value === undefined || value === null) return false;

    const text = String(value).trim();
    if (!text) return false;

    return !/^(0|unknown|none|null|n\/?a|not available|not published)$/i.test(text);
  }

  function deduplicateIncidents(source, incidents) {
    const explicitGroups = new Map();
    const fallbackGroups = [];

    incidents.forEach((incident) => {
      if (incident.reference) {
        const key = [
          source.id,
          "ref",
          normaliseIdentity(incident.reference),
          incident.category
        ].join(":");

        if (!explicitGroups.has(key)) {
          explicitGroups.set(key, createIncidentGroup(incident, key));
        } else {
          mergeIncidentGroup(explicitGroups.get(key), incident);
        }

        return;
      }

      const matchingGroup = fallbackGroups.find(
        (group) => canMergeFallback(group, incident)
      );

      if (matchingGroup) {
        mergeIncidentGroup(matchingGroup, incident);
      } else {
        fallbackGroups.push(createIncidentGroup(incident, null));
      }
    });

    const groups = [
      ...explicitGroups.values(),
      ...fallbackGroups
    ];

    return groups.map((group, index) => finaliseIncidentGroup(source, group, index));
  }

  function createIncidentGroup(incident, explicitKey) {
    return {
      explicitKey,
      sourceId: incident.sourceId,
      provider: incident.provider,
      reference: incident.reference,
      category: incident.category,
      status: incident.status,
      type: incident.type,
      officialUrl: incident.officialUrl,
      startedAt: incident.startedAt,
      restoreAt: incident.restoreAt,
      updatedAt: incident.updatedAt,
      areas: new Set([incident.area]),
      coordinates: [[incident.lat, incident.lon]],
      latSum: incident.lat,
      lonSum: incident.lon,
      rawRecordCount: 1
    };
  }

  function mergeIncidentGroup(group, incident) {
    group.rawRecordCount += 1;
    group.latSum += incident.lat;
    group.lonSum += incident.lon;
    group.coordinates.push([incident.lat, incident.lon]);
    group.areas.add(incident.area);

    group.startedAt = earlierDate(group.startedAt, incident.startedAt);
    group.restoreAt = laterDate(group.restoreAt, incident.restoreAt);
    group.updatedAt = laterDate(group.updatedAt, incident.updatedAt);

    if (!group.reference && incident.reference) {
      group.reference = incident.reference;
    }

    if ((!group.status || group.status === group.category) && incident.status) {
      group.status = incident.status;
    }

    if ((!group.type || group.type === group.category) && incident.type) {
      group.type = incident.type;
    }
  }

  function finaliseIncidentGroup(source, group, index) {
    const lat = group.latSum / group.rawRecordCount;
    const lon = group.lonSum / group.rawRecordCount;
    const areas = Array.from(group.areas).filter(Boolean);
    const area = areas.length <= 1
      ? areas[0] || "Published incident location"
      : `${areas[0]} + ${areas.length - 1} related location${areas.length === 2 ? "" : "s"}`;

    const timeBucket = group.startedAt
      ? Math.floor(group.startedAt / (30 * 60 * 1000))
      : "unknown";

    const fallbackKey = [
      source.id,
      "geo",
      group.category,
      lat.toFixed(3),
      lon.toFixed(3),
      timeBucket,
      normaliseIdentity(areas[0] || "location").slice(0, 40),
      index
    ].join(":");

    return {
      key: group.explicitKey || fallbackKey,
      sourceId: group.sourceId,
      provider: group.provider,
      reference: group.reference,
      category: group.category,
      status: group.status || group.category,
      type: group.type || group.category,
      area,
      areas,
      lat,
      lon,
      startedAt: group.startedAt,
      restoreAt: group.restoreAt,
      updatedAt: group.updatedAt,
      officialUrl: group.officialUrl,
      rawRecordCount: group.rawRecordCount,
      duplicateCount: Math.max(0, group.rawRecordCount - 1),
      coordinateSpreadKm: coordinateSpreadKm(group.coordinates)
    };
  }

  function canMergeFallback(group, incident) {
    if (group.category !== incident.category) return false;

    const centre = [
      group.latSum / group.rawRecordCount,
      group.lonSum / group.rawRecordCount
    ];

    const distanceKm = haversineKm(
      centre[0],
      centre[1],
      incident.lat,
      incident.lon
    );

    if (distanceKm > 1.5) return false;

    const groupStart = group.startedAt;
    const incidentStart = incident.startedAt;

    if (
      groupStart &&
      incidentStart &&
      Math.abs(groupStart - incidentStart) > 90 * 60 * 1000
    ) {
      return false;
    }

    const groupArea = Array.from(group.areas)[0] || "";
    const similarity = areaSimilarity(groupArea, incident.area);

    if (!groupStart || !incidentStart) {
      return distanceKm <= 0.5 && similarity >= 0.6;
    }

    return similarity >= 0.35 || isGenericArea(groupArea) || isGenericArea(incident.area);
  }

  function normaliseIdentity(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function areaSimilarity(first, second) {
    const a = areaTokens(first);
    const b = areaTokens(second);

    if (!a.size || !b.size) return 0;

    let shared = 0;
    a.forEach((token) => {
      if (b.has(token)) shared += 1;
    });

    return shared / Math.max(a.size, b.size);
  }

  function areaTokens(value) {
    const ignored = new Set([
      "the", "and", "near", "area", "location", "published",
      "incident", "outage", "power", "cut", "affected"
    ]);

    return new Set(
      String(value || "")
        .toLowerCase()
        .match(/[a-z0-9]+/g)
        ?.filter((token) => token.length > 2 && !ignored.has(token)) || []
    );
  }

  function isGenericArea(value) {
    return /published incident location|unknown|not available/i.test(String(value || ""));
  }

  function earlierDate(first, second) {
    if (!first) return second || null;
    if (!second) return first;
    return Math.min(first, second);
  }

  function laterDate(first, second) {
    if (!first) return second || null;
    if (!second) return first;
    return Math.max(first, second);
  }

  function coordinateSpreadKm(coordinates) {
    if (!Array.isArray(coordinates) || coordinates.length < 2) return 0;

    const lat = coordinates.reduce((sum, item) => sum + item[0], 0) / coordinates.length;
    const lon = coordinates.reduce((sum, item) => sum + item[1], 0) / coordinates.length;

    return coordinates.reduce((maximum, item) => {
      return Math.max(maximum, haversineKm(lat, lon, item[0], item[1]));
    }, 0);
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const radiusKm = 6371;
    const toRadians = (value) => value * Math.PI / 180;
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) ** 2;

    return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function flattenObject(value, prefix = "", result = {}) {
    if (!value || typeof value !== "object") {
      return result;
    }

    Object.entries(value).forEach(([key, item]) => {
      const normalKey = normaliseKey(prefix ? `${prefix}_${key}` : key);

      if (item && typeof item === "object" && !Array.isArray(item)) {
        flattenObject(item, normalKey, result);
      } else {
        result[normalKey] = item;
      }
    });

    return result;
  }

  function normaliseKey(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function pick(fields, keys) {
    for (const key of keys) {
      const value = fields[normaliseKey(key)];

      if (value !== undefined && value !== null && String(value).trim() !== "") {
        return value;
      }
    }

    return null;
  }

  function findCoordinate(raw, fields, geometry) {
    const geometryCoordinate = coordinateFromGeometry(geometry);
    if (geometryCoordinate) return geometryCoordinate;

    const candidateObjects = [
      raw?.geo_point_2d,
      raw?.geopoint,
      raw?.coordinates,
      raw?.location,
      raw?.position,
      raw?.point
    ];

    for (const candidate of candidateObjects) {
      const parsed = parseCoordinate(candidate);
      if (parsed) return parsed;
    }

    const lat = toNumber(pick(fields, [
      "lat",
      "latitude",
      "locationlat",
      "locationlatitude",
      "incidentlat",
      "incidentlatitude",
      "faultlat",
      "faultlatitude"
    ]));

    const lon = toNumber(pick(fields, [
      "lon",
      "lng",
      "longitude",
      "locationlon",
      "locationlng",
      "locationlongitude",
      "incidentlon",
      "incidentlng",
      "incidentlongitude",
      "faultlon",
      "faultlng",
      "faultlongitude"
    ]));

    return validateCoordinate(lat, lon);
  }

  function coordinateFromGeometry(geometry) {
    if (!geometry || typeof geometry !== "object") return null;

    if (geometry.type === "Point") {
      return parseCoordinate(geometry.coordinates);
    }

    if (
      ["Polygon", "MultiPolygon", "LineString", "MultiLineString"].includes(geometry.type)
    ) {
      const flat = flattenCoordinates(geometry.coordinates);

      if (!flat.length) return null;

      const lon = flat.reduce((sum, point) => sum + point[0], 0) / flat.length;
      const lat = flat.reduce((sum, point) => sum + point[1], 0) / flat.length;
      return validateCoordinate(lat, lon);
    }

    return null;
  }

  function flattenCoordinates(value, result = []) {
    if (
      Array.isArray(value) &&
      value.length >= 2 &&
      Number.isFinite(Number(value[0])) &&
      Number.isFinite(Number(value[1]))
    ) {
      result.push([Number(value[0]), Number(value[1])]);
      return result;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => flattenCoordinates(item, result));
    }

    return result;
  }

  function parseCoordinate(value) {
    if (!value) return null;

    if (Array.isArray(value) && value.length >= 2) {
      const first = Number(value[0]);
      const second = Number(value[1]);

      if (Math.abs(first) <= 20 && Math.abs(second) >= 40) {
        return validateCoordinate(second, first);
      }

      return validateCoordinate(first, second) || validateCoordinate(second, first);
    }

    if (typeof value === "object") {
      return validateCoordinate(
        toNumber(value.lat ?? value.latitude ?? value.y),
        toNumber(value.lon ?? value.lng ?? value.longitude ?? value.x)
      );
    }

    if (typeof value === "string") {
      const parts = value.match(/-?\d+(?:\.\d+)?/g);

      if (parts && parts.length >= 2) {
        return parseCoordinate([Number(parts[0]), Number(parts[1])]);
      }
    }

    return null;
  }

  function validateCoordinate(lat, lon) {
    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= 48 &&
      lat <= 62.5 &&
      lon >= -12.5 &&
      lon <= 4
    ) {
      return { lat, lon };
    }

    return null;
  }

  function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : Number.NaN;
  }

  function parseDate(value) {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      const ms = value > 100000000000 ? value : value * 1000;
      return Number.isFinite(ms) ? ms : null;
    }

    const text = String(value).trim();
    const numeric = Number(text);

    if (Number.isFinite(numeric) && text !== "") {
      return numeric > 100000000000 ? numeric : numeric * 1000;
    }

    const parsed = Date.parse(text);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function replaceIncidents() {
    const next = new Map();
    const now = Date.now();

    allLoadedIncidents().forEach((incident) => {
      next.set(incident.key, incident);

      if (!state.firstSeen.has(incident.key)) {
        state.firstSeen.set(incident.key, now);
      }
    });

    state.incidents = next;

    state.firstSeen.forEach((value, key) => {
      if (!next.has(key)) {
        state.firstSeen.delete(key);
      }
    });
  }

  function renderIncidents() {
    replaceIncidents();

    state.providerLayers.forEach((bundle) => {
      bundle.current.clearLayers();
      bundle.planned.clearLayers();
      bundle.restored.clearLayers();
    });

    const now = Date.now();

    state.incidents.forEach((incident) => {
      const bundle = state.providerLayers.get(incident.sourceId);
      const targetLayer = bundle?.[incident.category] || bundle?.current;

      if (!targetLayer) return;

      const marker = window.L.marker([incident.lat, incident.lon], {
        pane: "outageMarkerPane",
        keyboard: true,
        icon: createIncidentIcon(incident, now)
      });

      marker.bindPopup(createPopupHtml(incident), {
        closeButton: true,
        className: "outage-popup-shell"
      });

      marker.addTo(targetLayer);
      incident.marker = marker;
    });

    syncProviderVisibility();
    syncCategoryVisibility();
    updateSummary();
  }

  function isCategoryVisible(incident) {
    if (!state.activeSources.has(incident.sourceId)) return false;
    if (incident.category === "planned") return Boolean(elements.showPlanned?.checked);
    if (incident.category === "restored") return Boolean(elements.showRestored?.checked);
    return Boolean(elements.showCurrent?.checked);
  }

  function createIncidentIcon(incident, now) {
    const colour = categoryColour(incident.category);
    const firstSeen = state.firstSeen.get(incident.key) || now;
    const durationSeconds = Number(elements.animationDuration?.value || 0);
    const durationMs = durationSeconds * 1000;
    const ageMs = Math.max(0, now - firstSeen);
    const progress = durationMs > 0 ? Math.min(1, ageMs / durationMs) : 1;
    const ringSize = 44 - (progress * 28);
    const fadeStart = 0.75;
    const opacity = progress <= fadeStart
      ? 0.82
      : Math.max(0, 0.82 * (1 - ((progress - fadeStart) / (1 - fadeStart))));

    const groupedBadge = incident.rawRecordCount > 1
      ? `<span class="outage-marker-count" aria-label="${incident.rawRecordCount} provider rows grouped">${incident.rawRecordCount}</span>`
      : "";

    return window.L.divIcon({
      className: "outage-marker-shell",
      html: [
        '<span class="outage-marker-ring" style="',
        `--outage-colour:${colour};`,
        `--outage-ring-size:${ringSize.toFixed(2)}px;`,
        `--outage-ring-opacity:${opacity.toFixed(3)};`,
        '" aria-hidden="true"></span>',
        '<span class="outage-marker-core" style="',
        `--outage-colour:${colour};`,
        '" aria-hidden="true"></span>',
        groupedBadge
      ].join(""),
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });
  }

  function refreshAnimatedMarkers() {
    const now = Date.now();

    state.incidents.forEach((incident) => {
      if (incident.marker) {
        incident.marker.setIcon(createIncidentIcon(incident, now));
      }
    });
  }

  function categoryColour(category) {
    if (category === "planned") return "#f6b73c";
    if (category === "restored") return "#8193a4";
    return "#f04438";
  }

  function createPopupHtml(incident) {
    const status = escapeHtml(humanise(incident.status));
    const type = escapeHtml(humanise(incident.type));
    const area = escapeHtml(incident.area);
    const reference = incident.reference
      ? escapeHtml(incident.reference)
      : "Not published";

    const groupingText = incident.rawRecordCount > 1
      ? [
          `<span class="outage-popup-grouped">Grouped from ${incident.rawRecordCount} provider rows.</span>`,
          incident.coordinateSpreadKm > 0.05
            ? `<span>Published-coordinate spread: ${incident.coordinateSpreadKm.toFixed(1)} km.</span>`
            : ""
        ].join("")
      : "";

    return [
      '<div class="outage-popup">',
      `<strong>${escapeHtml(incident.provider)}</strong>`,
      `<span class="outage-popup-status">${type} · ${status}</span>`,
      `<span>${area}</span>`,
      groupingText,
      incident.startedAt
        ? `<span>Started: ${escapeHtml(formatDateTime(incident.startedAt))}</span>`
        : "",
      incident.restoreAt
        ? `<span>Estimated finish: ${escapeHtml(formatDateTime(incident.restoreAt))}</span>`
        : "",
      incident.updatedAt
        ? `<span>Provider update: ${escapeHtml(formatDateTime(incident.updatedAt))}</span>`
        : "",
      `<span>Reference: ${reference}</span>`,
      `<span>${incident.lat.toFixed(4)}, ${incident.lon.toFixed(4)}</span>`,
      `<a href="${escapeAttribute(incident.officialUrl)}" target="_blank" rel="noopener noreferrer">Open provider map</a>`,
      '</div>'
    ].join("");
  }

  function updateSummary() {
    const incidents = activeIncidents();
    const current = incidents.filter((item) => item.category === "current").length;
    const planned = incidents.filter((item) => item.category === "planned").length;

    const activeStates = Array.from(state.activeSources)
      .map((sourceId) => state.sourceState.get(sourceId))
      .filter(Boolean);

    const loadedSources = activeStates.filter(
      (item) => ["live", "empty", "warning"].includes(item.status)
    ).length;

    const errorSources = activeStates.filter((item) => item.status === "error").length;
    const activeSourceCount = state.activeSources.size;

    const rawRows = activeStates.reduce(
      (sum, item) => sum + Number(item.rawRows || 0),
      0
    );

    const groupedRows = activeStates.reduce(
      (sum, item) => sum + Number(item.groupedRows || 0),
      0
    );

    elements.currentCount.textContent = String(current);
    elements.plannedCount.textContent = String(planned);
    elements.providerCount.textContent = `${loadedSources}/${activeSourceCount}`;
    elements.rawRowCount.textContent = String(rawRows);
    elements.uniqueIncidentCount.textContent = String(incidents.length);
    elements.groupedRowCount.textContent = String(groupedRows);

    const summary = `${current} current · ${planned} planned`;
    elements.sourceSummary.textContent =
      `${activeSourceCount}/${SOURCES.length} active · ${rawRows} rows → ${incidents.length} incidents`;

    if (activeSourceCount === 0) {
      setHeadline("All outage providers deactivated", "error");
    } else if (loadedSources === activeSourceCount) {
      setHeadline(summary, "live");
    } else if (loadedSources > 0) {
      setHeadline(
        `${summary} · ${errorSources} feed${errorSources === 1 ? "" : "s"} unavailable`,
        "partial"
      );
    } else {
      setHeadline("Official feeds could not be loaded", "error");
    }

    if (incidents.length) {
      elements.statusText.textContent =
        `Showing ${incidents.length} unique incidents from ${rawRows} provider rows. ` +
        `${groupedRows} repeated rows were grouped.`;
    } else if (activeSourceCount === 0) {
      elements.statusText.textContent = "All provider layers are deactivated.";
    } else {
      elements.statusText.textContent =
        "No unique incidents have been mapped. Open Outage providers to inspect each feed.";
    }
  }

  function setHeadline(message, mode) {
    elements.headlineStatus.textContent = message;
    elements.liveBadge.className = "weather-pill outage-live-pill";

    if (mode === "live") {
      elements.liveBadge.textContent = "LIVE";
      elements.liveBadge.classList.add("is-live");
    } else if (mode === "partial") {
      elements.liveBadge.textContent = "PARTIAL";
      elements.liveBadge.classList.add("is-partial");
    } else if (mode === "error") {
      elements.liveBadge.textContent = "ERROR";
      elements.liveBadge.classList.add("is-error");
    } else {
      elements.liveBadge.textContent = "LOADING";
    }
  }

  function renderSourceList() {
    if (!elements.sourceList) return;

    elements.sourceList.innerHTML = SOURCES.map((source) => {
      const active = state.activeSources.has(source.id);
      const sourceState = state.sourceState.get(source.id) || {
        status: active ? "idle" : "off",
        rawRows: 0,
        uniqueCount: 0,
        groupedRows: 0,
        skipped: 0,
        message: active ? "Waiting" : "Deactivated"
      };

      const detail = sourceState.message || "Waiting";

      const stateText = !active
        ? "OFF"
        : sourceState.status === "live"
          ? "ACTIVE"
          : sourceState.status === "empty"
            ? "EMPTY"
            : sourceState.status === "warning"
              ? "CHECK"
              : sourceState.status === "error"
                ? "ERROR"
                : "LOADING";

      const rowStatus = active ? sourceState.status : "off";

      return [
        `<div class="outage-source-row is-${escapeAttribute(rowStatus)}">`,
        `<button class="outage-source-toggle" type="button" data-source-toggle="${escapeAttribute(source.id)}" aria-pressed="${String(active)}">`,
        '<span class="outage-source-dot" aria-hidden="true"></span>',
        '<span class="outage-source-copy">',
        `<strong>${escapeHtml(source.name)}</strong>`,
        `<small>${escapeHtml(detail)}</small>`,
        '</span>',
        `<span class="outage-source-switch-state">${escapeHtml(stateText)}</span>`,
        '</button>',
        `<a class="outage-source-link" href="${escapeAttribute(source.officialUrl)}" target="_blank" rel="noopener noreferrer">Map</a>`,
        '</div>'
      ].join("");
    }).join("");
  }

  async function fetchJson(url) {
    const response = await fetchWithTimeout(url, {
      cache: "no-store",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  async function fetchText(url) {
    const response = await fetchWithTimeout(url, {
      cache: "no-store",
      headers: { Accept: "text/csv,text/plain,*/*" }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.text();
  }

  async function fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal
      });
    } finally {
      window.clearTimeout(timer);
    }
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === '"' && quoted && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(value);
        value = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") {
          index += 1;
        }

        row.push(value);
        value = "";

        if (row.some((cell) => cell !== "")) {
          rows.push(row);
        }

        row = [];
      } else {
        value += char;
      }
    }

    if (value !== "" || row.length) {
      row.push(value);
      rows.push(row);
    }

    if (rows.length < 2) return [];

    const headers = rows[0].map((header) => header.trim());

    return rows.slice(1).map((cells) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = cells[index] ?? "";
      });
      return record;
    });
  }

  function formatDateTime(timestamp) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/London",
      timeZoneName: "short"
    }).format(new Date(timestamp));
  }

  function humanise(value) {
    return String(value || "Published")
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function conciseError(error) {
    if (error?.name === "AbortError") return "Timed out";
    return String(error?.message || "Unavailable").slice(0, 110);
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

  window.FieldOpsOutages = {
    version: VERSION,
    refresh: loadAllSources,
    diagnostics: () => ({
      sources: Object.fromEntries(state.sourceState.entries()),
      incidents: activeIncidents().map((incident) => ({
        key: incident.key,
        provider: incident.provider,
        category: incident.category,
        rawRecordCount: incident.rawRecordCount,
        coordinateSpreadKm: incident.coordinateSpreadKm
      }))
    }),
    sources: SOURCES.map((source) => ({
      id: source.id,
      name: source.name,
      officialUrl: source.officialUrl
    }))
  };

  document.addEventListener("DOMContentLoaded", init, { once: true });
})();
