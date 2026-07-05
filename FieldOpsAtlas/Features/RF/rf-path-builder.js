/* ===========================================================================
   FieldOps Atlas RF path builder
   File: FieldOpsAtlas/Features/RF/rf-path-builder.js
   Version: 1.3.0-path-distance-elevation

   Purpose:
   - Own the currently selected RF path used by the path-details pane.
   - Use one real map-cluster path as the default until live path selection is wired.
   - Expose the selected path to the 3D graph builder.
   - Keep all values demo-only and free of private operational data.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.3.0-path-distance-elevation";
  const SLOT_SELECTOR = "[data-rf-path-details]";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const RENDERED_EVENT = "fieldops:rf-path-details-rendered";
  const SELECTED_EVENT = "fieldops:rf-selected-path-change";
  const STORAGE_KEY = "fieldops-rf-selected-path-v1";
  const ELEVATION_CACHE_KEY = "fieldops-rf-elevation-cache-v1";
  const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];
  let elevationRequest = null;

  const SITES = [
    {
      id: "glasgow-core",
      name: "Glasgow",
      role: "Core",
      status: "Online",
      nodeType: "core",
      x: 0.13,
      y: 0.10,
      label: { dx: 0, dy: -54, anchor: "middle" }
    },
    {
      id: "edinburgh-core",
      name: "Edinburgh",
      role: "Core",
      status: "Online",
      nodeType: "core",
      x: 0.72,
      y: 0.10,
      label: { dx: 0, dy: -54, anchor: "middle" }
    },
    {
      id: "manchester-core",
      name: "Manchester",
      role: "Core",
      status: "Online",
      nodeType: "core",
      size: "large",
      x: 0.43,
      y: 0.34,
      label: { dx: 48, dy: -5, anchor: "start" }
    },
    {
      id: "birmingham-core",
      name: "Birmingham",
      role: "Core",
      status: "Online",
      nodeType: "core",
      x: 0.43,
      y: 0.54,
      label: { dx: 48, dy: -5, anchor: "start" }
    },
    {
      id: "london-core",
      name: "London",
      role: "Core",
      status: "Online",
      nodeType: "core",
      size: "large",
      x: 0.44,
      y: 0.77,
      label: { dx: 0, dy: 70, anchor: "middle" }
    },
    {
      id: "valley-remote",
      name: "Valley",
      role: "Remote",
      status: "Online",
      nodeType: "remote",
      x: 0.08,
      y: 0.69,
      label: { dx: -8, dy: 58, anchor: "middle" }
    },
    {
      id: "pinewood-remote",
      name: "Pinewood",
      role: "Remote",
      status: "Online",
      nodeType: "remote",
      x: 0.46,
      y: 0.96,
      label: { dx: 0, dy: 62, anchor: "middle" }
    },
    {
      id: "hilltop-relay",
      name: "Hilltop",
      role: "Relay",
      status: "Active",
      nodeType: "relay",
      size: "large",
      x: 0.80,
      y: 0.43,
      label: { dx: 48, dy: -5, anchor: "start" }
    },
    {
      id: "ridgeway-relay",
      name: "Ridgeway",
      role: "Relay",
      status: "Watch",
      nodeType: "relay",
      x: 0.82,
      y: 0.63,
      label: { dx: 48, dy: -5, anchor: "start" }
    },
    {
      id: "stone-shelf-loop",
      name: "Stone Shelf Loop",
      role: "Head",
      status: "Active",
      nodeType: "core",
      size: "large",
      x: 0.30,
      y: 0.52,
      label: { dx: -48, dy: -5, anchor: "end" }
    },
    {
      id: "crystal-valley-path",
      name: "Crystal Valley Path",
      role: "Relay",
      status: "Active",
      nodeType: "relay",
      size: "large",
      x: 0.70,
      y: 0.52,
      label: { dx: 48, dy: -5, anchor: "start" }
    }
  ];

  const LINKS = [
    { id: "glasgow-edinburgh", from: "glasgow-core", to: "edinburgh-core", type: "standby" },
    { id: "glasgow-manchester", from: "glasgow-core", to: "manchester-core", type: "main" },
    { id: "edinburgh-manchester", from: "edinburgh-core", to: "manchester-core", type: "main" },
    { id: "manchester-birmingham", from: "manchester-core", to: "birmingham-core", type: "main" },
    { id: "birmingham-london", from: "birmingham-core", to: "london-core", type: "standby" },
    {
      id: "london-hilltop",
      from: "london-core",
      to: "hilltop-relay",
      type: "main",
      bundleCount: 3,
      badge: "×6"
    },
    { id: "hilltop-ridgeway", from: "hilltop-relay", to: "ridgeway-relay", type: "alert" },
    { id: "london-ridgeway", from: "london-core", to: "ridgeway-relay", type: "standby" },
    { id: "london-valley", from: "london-core", to: "valley-remote", type: "fm" },
    { id: "london-pinewood", from: "london-core", to: "pinewood-remote", type: "fm" },
    {
      id: "dtt-stone-shelf-loop--crystal-valley-path-primary",
      from: "stone-shelf-loop",
      to: "crystal-valley-path",
      type: "main",
      serviceType: "dtt",
      clusterId: "South-Wales-central",
      bundleCount: 3,
      badge: "×3"
    }
  ];

  const DEFAULT_SELECTED_PATH = Object.freeze({
    id: "dtt-stone-shelf-loop--crystal-valley-path-primary",
    clusterId: "South-Wales-central",
    serviceType: "dtt",
    status: "Active",
    from: Object.freeze({
      siteId: "stone-shelf-loop",
      name: "Stone Shelf Loop",
      role: "Head Site",
      input: "Primary DTT Feed",
      lat: 51.434999,
      lng: -3.311963,
      elevationM: null,
      elevationSource: ""
    }),
    to: Object.freeze({
      siteId: "crystal-valley-path",
      name: "Crystal Valley Path",
      role: "Relay Site",
      input: "Off-air Antenna",
      lat: 51.554036,
      lng: -3.224351,
      elevationM: null,
      elevationSource: ""
    }),
    frequency: "234.928 MHz",
    channel: "DTT · 3 mux",
    bandwidth: "8 MHz",
    serviceCount: "3 multiplexes",
    services: Object.freeze([
      Object.freeze({ type: "DTT", name: "PSB1" }),
      Object.freeze({ type: "DTT", name: "PSB2" }),
      Object.freeze({ type: "DTT", name: "PSB3" })
    ]),
    distanceKm: 14.56,
    metrics: Object.freeze([
      Object.freeze({ label: "Path length", value: "14.6 km" }),
      Object.freeze({ label: "Azimuth", value: "24.6°" }),
      Object.freeze({ label: "RX power", value: "-58.2 dBm" }),
      Object.freeze({ label: "Fade margin", value: "18.6 dB" }),
      Object.freeze({ label: "Availability", value: "99.98%" })
    ])
  });

  function cleanText(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
  }

  function escapeHTML(value) {
    return cleanText(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }


  function numberOrNull(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function radians(value) {
    return value * Math.PI / 180;
  }

  function straightLineDistanceKm(from, to) {
    const lat1 = numberOrNull(from && from.lat);
    const lng1 = numberOrNull(from && from.lng);
    const lat2 = numberOrNull(to && to.lat);
    const lng2 = numberOrNull(to && to.lng);

    if (lat1 === null || lng1 === null || lat2 === null || lng2 === null) {
      return null;
    }

    const earthRadiusKm = 6371.0088;
    const dLat = radians(lat2 - lat1);
    const dLng = radians(lng2 - lng1);
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const value = sinLat * sinLat +
      Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * sinLng * sinLng;

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  }

  function bearingDegrees(from, to) {
    const lat1 = radians(Number(from.lat));
    const lat2 = radians(Number(to.lat));
    const dLng = radians(Number(to.lng) - Number(from.lng));
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  function distanceText(value) {
    const number = numberOrNull(value);
    return number === null ? "—" : number.toFixed(number < 10 ? 2 : 1) + " km";
  }

  function elevationText(value) {
    const number = numberOrNull(value);
    return number === null ? "Loading…" : Math.round(number) + " m";
  }

  function readElevationCache() {
    try {
      const raw = window.localStorage.getItem(ELEVATION_CACHE_KEY);
      const cache = raw ? JSON.parse(raw) : {};
      return cache && typeof cache === "object" ? cache : {};
    } catch (error) {
      return {};
    }
  }

  function writeElevationCache(cache) {
    try {
      window.localStorage.setItem(ELEVATION_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      // Storage can be unavailable in previews and embedded webviews.
    }
  }

  function elevationKey(endpoint) {
    return Number(endpoint.lat).toFixed(5) + "," + Number(endpoint.lng).toFixed(5);
  }

  function parseElevation(value) {
    const match = String(value == null ? "" : value).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
    return match ? numberOrNull(match[0]) : null;
  }

  function elementPoint(element) {
    const lat = numberOrNull(element && (element.lat ?? element.center?.lat));
    const lng = numberOrNull(element && (element.lon ?? element.center?.lon));
    return lat === null || lng === null ? null : { lat, lng };
  }

  function nearestMappedElevation(payload, endpoint) {
    const elements = payload && Array.isArray(payload.elements) ? payload.elements : [];
    return elements.map((element) => {
      const point = elementPoint(element);
      const elevationM = parseElevation(element?.tags?.ele);
      if (!point || elevationM === null) return null;
      return {
        elevationM,
        distanceKm: straightLineDistanceKm(endpoint, point),
        source: "osm-nearby-hill"
      };
    }).filter(Boolean).sort((a, b) => a.distanceKm - b.distanceKm)[0] || null;
  }

  function overpassQuery(endpoint) {
    return [
      "[out:json][timeout:20];",
      "nwr(around:20000,", Number(endpoint.lat).toFixed(6), ",", Number(endpoint.lng).toFixed(6), ")",
      '["natural"~"^(peak|hill)$"]["ele"];',
      "out center tags;"
    ].join("");
  }

  function requestOverpass(endpoint, index = 0) {
    const url = OVERPASS_ENDPOINTS[index] + "?data=" + encodeURIComponent(overpassQuery(endpoint));
    return fetch(url, {
      cache: "force-cache",
      headers: { Accept: "application/json" }
    }).then((response) => {
      if (!response.ok) throw new Error("Mapped elevation lookup failed.");
      return response.json();
    }).then((payload) => {
      const result = nearestMappedElevation(payload, endpoint);
      if (!result) throw new Error("No mapped elevation was found nearby.");
      return result;
    }).catch((error) => {
      if (index + 1 < OVERPASS_ENDPOINTS.length) {
        return requestOverpass(endpoint, index + 1);
      }
      throw error;
    });
  }

  function requestTerrainFallback(endpoint) {
    const url = "https://api.open-meteo.com/v1/elevation?latitude=" +
      encodeURIComponent(endpoint.lat) + "&longitude=" + encodeURIComponent(endpoint.lng);
    return fetch(url, {
      cache: "force-cache",
      headers: { Accept: "application/json" }
    }).then((response) => {
      if (!response.ok) throw new Error("Elevation lookup failed.");
      return response.json();
    }).then((payload) => {
      const elevationM = numberOrNull(payload && Array.isArray(payload.elevation) ? payload.elevation[0] : null);
      if (elevationM === null) throw new Error("Elevation is unavailable.");
      return { elevationM, distanceKm: 0, source: "terrain-fallback" };
    });
  }

  function resolveElevation(endpoint) {
    const key = elevationKey(endpoint);
    const cache = readElevationCache();
    const cached = cache[key];

    if (cached && numberOrNull(cached.elevationM) !== null) {
      return Promise.resolve(cached);
    }

    return requestOverpass(endpoint)
      .catch(() => requestTerrainFallback(endpoint))
      .then((result) => {
        const nextCache = readElevationCache();
        nextCache[key] = result;
        writeElevationCache(nextCache);
        return result;
      });
  }

  function calculatedMetrics(path, existing) {
    const metrics = Array.isArray(existing) ? clone(existing) : [];
    const calculated = [
      { label: "Path length", value: distanceText(path.distanceKm) },
      { label: "Azimuth", value: Number.isFinite(path.azimuthDegrees) ? path.azimuthDegrees.toFixed(1) + "°" : "—" }
    ];
    const excluded = new Set(["path length", "azimuth", "elevation", "from elevation", "to elevation"]);
    return calculated.concat(metrics.filter((metric) => !excluded.has(cleanText(metric.label).toLowerCase())));
  }

  function normaliseEndpoint(value, fallback) {
    const source = value && typeof value === "object" ? value : {};

    return {
      siteId: cleanText(source.siteId || source.id || fallback.siteId),
      name: cleanText(source.name || source.label || fallback.name),
      role: cleanText(source.role || source.siteRole || fallback.role),
      input: cleanText(source.input || source.feed || source.feedMethod || fallback.input),
      lat: numberOrNull(source.lat ?? source.latitude ?? fallback.lat),
      lng: numberOrNull(source.lng ?? source.lon ?? source.longitude ?? fallback.lng),
      elevationM: numberOrNull(source.elevationM ?? source.elevation ?? fallback.elevationM),
      elevationSource: cleanText(source.elevationSource || fallback.elevationSource)
    };
  }

  function normaliseList(value, fallback) {
    if (!Array.isArray(value) || !value.length) {
      return clone(fallback);
    }

    return value.map((item) => ({
      type: cleanText(item && item.type || "DTT"),
      name: cleanText(item && (item.name || item.label) || "Service")
    }));
  }

  function normaliseMetrics(value, fallback) {
    if (!Array.isArray(value) || !value.length) {
      return clone(fallback);
    }

    return value.map((item) => ({
      label: cleanText(item && item.label || "Metric"),
      value: cleanText(item && item.value || "—")
    }));
  }

  function normaliseSelectedPath(value) {
    const source = value && typeof value === "object" ? value : {};
    const from = normaliseEndpoint(source.from || source.feeding, DEFAULT_SELECTED_PATH.from);
    const to = normaliseEndpoint(source.to || source.receiving, DEFAULT_SELECTED_PATH.to);
    const calculatedDistance = straightLineDistanceKm(from, to);
    const distanceKm = numberOrNull(source.distanceKm) ?? calculatedDistance ?? DEFAULT_SELECTED_PATH.distanceKm;
    const azimuthDegrees = from.lat !== null && from.lng !== null && to.lat !== null && to.lng !== null
      ? bearingDegrees(from, to)
      : null;
    const path = {
      id: cleanText(source.id || source.pathId || DEFAULT_SELECTED_PATH.id),
      clusterId: cleanText(source.clusterId || DEFAULT_SELECTED_PATH.clusterId),
      serviceType: cleanText(source.serviceType || source.service || DEFAULT_SELECTED_PATH.serviceType).toLowerCase(),
      status: cleanText(source.status || DEFAULT_SELECTED_PATH.status),
      from,
      to,
      distanceKm,
      azimuthDegrees,
      frequency: cleanText(source.frequency || DEFAULT_SELECTED_PATH.frequency),
      channel: cleanText(source.channel || source.labelText || DEFAULT_SELECTED_PATH.channel),
      bandwidth: cleanText(source.bandwidth || DEFAULT_SELECTED_PATH.bandwidth),
      serviceCount: cleanText(source.serviceCount || DEFAULT_SELECTED_PATH.serviceCount),
      services: normaliseList(source.services, DEFAULT_SELECTED_PATH.services),
      metrics: []
    };
    path.metrics = calculatedMetrics(path, normaliseMetrics(source.metrics, DEFAULT_SELECTED_PATH.metrics));
    return path;
  }

  function readStoredPath() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function writeStoredPath(path) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(path));
    } catch (error) {
      // Local storage can be unavailable in previews and embedded webviews.
    }
  }

  let selectedPath = normaliseSelectedPath(
    window.ATLAS_RF_SELECTED_PATH || readStoredPath() || DEFAULT_SELECTED_PATH
  );
  window.ATLAS_RF_SELECTED_PATH = clone(selectedPath);

  function siteById(id) {
    return SITES.find((site) => site.id === id) || null;
  }

  function graphNodeFromSite(site) {
    return {
      id: site.id,
      name: site.name,
      role: site.role,
      type: site.nodeType || "relay",
      size: site.size || (site.nodeType === "core" ? "large" : ""),
      x: site.x,
      y: site.y,
      label: site.label ? { ...site.label } : null
    };
  }

  function endpointNode(endpoint, fallbackX) {
    return {
      id: endpoint.siteId,
      name: endpoint.name,
      role: endpoint.role,
      status: "Active",
      nodeType: fallbackX < 0.5 ? "core" : "relay",
      size: "large",
      x: fallbackX,
      y: 0.52,
      label: {
        dx: fallbackX < 0.5 ? -48 : 48,
        dy: -5,
        anchor: fallbackX < 0.5 ? "end" : "start"
      }
    };
  }

  function buildSites(path = selectedPath) {
    const sites = SITES.map((site) => ({
      ...site,
      label: site.label ? { ...site.label } : null
    }));

    [endpointNode(path.from, 0.30), endpointNode(path.to, 0.70)].forEach((site) => {
      if (!sites.some((item) => item.id === site.id)) {
        sites.push(site);
      }
    });

    return sites;
  }

  function buildLinks(path = selectedPath) {
    const links = LINKS.map((link) => ({ ...link }));

    if (!links.some((link) => link.id === path.id)) {
      links.push({
        id: path.id,
        from: path.from.siteId,
        to: path.to.siteId,
        type: "main",
        serviceType: path.serviceType,
        clusterId: path.clusterId
      });
    }

    return links;
  }

  function buildGraph(path = selectedPath) {
    if (
      window.ATLAS_RF_GRAPH &&
      Array.isArray(window.ATLAS_RF_GRAPH.nodes) &&
      window.ATLAS_RF_GRAPH.nodes.length > 0 &&
      Array.isArray(window.ATLAS_RF_GRAPH.links)
    ) {
      return {
        ...window.ATLAS_RF_GRAPH,
        selectedPathId: path.id,
        meta: {
          ...(window.ATLAS_RF_GRAPH.meta || {}),
          source: "window.ATLAS_RF_GRAPH",
          builderVersion: VERSION,
          mode: "external-model"
        }
      };
    }

    return {
      id: "rf-demo-network-map",
      selectedPathId: path.id,
      meta: {
        source: "FieldOpsRFPathBuilder",
        builderVersion: VERSION,
        mode: "demo-safe-rf-network",
        note: "The selected path is shared with the 3D endpoint scene."
      },
      nodes: buildSites(path).map(graphNodeFromSite),
      links: buildLinks(path)
    };
  }

  function endpointIconHTML(direction) {
    const tone = direction === "from" ? "tx" : "rx";

    return `
      <span class="rf-endpoint-icon is-${tone}" aria-hidden="true">
        <svg viewBox="0 0 48 48" focusable="false">
          <circle class="rf-endpoint-icon-bg" cx="24" cy="24" r="20"></circle>
          <circle class="rf-endpoint-icon-ring" cx="24" cy="24" r="23"></circle>
          <path class="rf-endpoint-icon-mast" d="M24 14L17 34H31Z"></path>
          <path class="rf-endpoint-icon-line" d="M24 18V34M20.5 27H27.5"></path>
          <path class="rf-endpoint-icon-wave" d="M14.2 17.8C10.8 21.2 10.8 26.8 14.2 30.2M33.8 17.8C37.2 21.2 37.2 26.8 33.8 30.2"></path>
        </svg>
      </span>
    `;
  }

  function endpointHTML(endpoint, direction) {
    return `
      <section class="rf-selected-endpoint is-${escapeHTML(direction)}">
        <small>${direction === "from" ? "From" : "To"}</small>
        ${endpointIconHTML(direction)}
        <b>${escapeHTML(endpoint.name)}</b>
        <span>${escapeHTML(endpoint.role)}</span>
        <em>${escapeHTML(endpoint.input)}</em>
        <span class="rf-endpoint-elevation">Elevation ${escapeHTML(elevationText(endpoint.elevationM))}</span>
      </section>
    `;
  }

  function serviceHTML(service) {
    return `
      <li>
        <b>${escapeHTML(service.type)}</b>
        <span>${escapeHTML(service.name)}</span>
      </li>
    `;
  }

  function metricHTML(metric) {
    return `
      <div class="rf-path-metric">
        <dt>${escapeHTML(metric.label)}</dt>
        <dd>${escapeHTML(metric.value)}</dd>
      </div>
    `;
  }

  function getSelectedPath() {
    return clone(selectedPath);
  }

  function buildSitePack(path = selectedPath) {
    return {
      id: path.id,
      from: siteById(path.from.siteId) || endpointNode(path.from, 0.30),
      to: siteById(path.to.siteId) || endpointNode(path.to, 0.70),
      selectedPath: clone(path),
      siteCount: buildSites(path).length,
      linkCount: buildLinks(path).length
    };
  }

  function renderPathDetails(pack) {
    const path = pack.selectedPath;

    return `
      <article class="rf-path-pack rf-selected-path-pack" data-rf-path-builder-body data-rf-path-id="${escapeHTML(pack.id)}">
        <section class="rf-path-selected-head">
          <small>Selected path</small>
          <span class="rf-path-active-dot" aria-hidden="true"></span>
          <b>${escapeHTML(path.status)}</b>
        </section>

        ${endpointHTML(path.from, "from")}

        <section class="rf-path-frequency-card">
          <small>Frequency</small>
          <b>${escapeHTML(path.frequency)}</b>
          <span>${escapeHTML(path.channel)} <i aria-hidden="true">|</i> ${escapeHTML(path.bandwidth)}</span>
        </section>

        <section class="rf-service-bundle">
          <header>
            <small>Service bundle</small>
            <b>${escapeHTML(path.serviceCount)}</b>
          </header>
          <ul>
            ${path.services.map(serviceHTML).join("")}
          </ul>
        </section>

        ${endpointHTML(path.to, "to")}

        <dl class="rf-path-metrics">
          ${path.metrics.map(metricHTML).join("")}
        </dl>
      </article>
    `;
  }

  function render(root = document) {
    const slot = root.querySelector(SLOT_SELECTOR);
    if (!slot) return false;

    const pack = buildSitePack(selectedPath);
    slot.replaceChildren();
    slot.insertAdjacentHTML("beforeend", renderPathDetails(pack));
    slot.dataset.rfPathBuilderLoaded = "true";
    slot.dataset.rfPathBuilderVersion = VERSION;
    slot.dataset.rfPathId = pack.id;
    slot.dataset.rfPathDistanceKm = String(selectedPath.distanceKm ?? "");

    document.dispatchEvent(new CustomEvent(RENDERED_EVENT, {
      detail: {
        version: VERSION,
        pathId: pack.id,
        source: "map-cluster-default",
        selectedPath: getSelectedPath(),
        graph: buildGraph(selectedPath)
      }
    }));

    return true;
  }

  function setSelectedPath(path, options = {}) {
    selectedPath = normaliseSelectedPath(path);
    window.ATLAS_RF_SELECTED_PATH = getSelectedPath();

    if (options.persist !== false) {
      writeStoredPath(selectedPath);
    }

    document.dispatchEvent(new CustomEvent(SELECTED_EVENT, {
      detail: {
        version: VERSION,
        pathId: selectedPath.id,
        selectedPath: getSelectedPath()
      }
    }));

    if (options.render !== false) {
      render();
    }

    return getSelectedPath();
  }

  function enrichSelectedPath() {
    if (elevationRequest) return elevationRequest;

    elevationRequest = Promise.all([
      selectedPath.from.elevationM === null ? resolveElevation(selectedPath.from).catch(() => null) : null,
      selectedPath.to.elevationM === null ? resolveElevation(selectedPath.to).catch(() => null) : null
    ]).then(([fromResult, toResult]) => {
      if (!fromResult && !toResult) return getSelectedPath();

      const next = getSelectedPath();
      if (fromResult) {
        next.from.elevationM = fromResult.elevationM;
        next.from.elevationSource = fromResult.source;
      }
      if (toResult) {
        next.to.elevationM = toResult.elevationM;
        next.to.elevationSource = toResult.source;
      }
      return setSelectedPath(next);
    }).finally(() => {
      elevationRequest = null;
    });

    return elevationRequest;
  }

  function init() {
    const rendered = render();
    if (!rendered) {
      document.addEventListener(PANE_READY_EVENT, () => {
        render();
        enrichSelectedPath();
      }, { once: true });
      return;
    }
    enrichSelectedPath();
  }

  window.FieldOpsRFPathBuilder = {
    VERSION,
    STORAGE_KEY,
    DEFAULT_SELECTED_PATH: clone(DEFAULT_SELECTED_PATH),
    buildSites,
    buildSitePack,
    buildGraph,
    getSelectedPath,
    setSelectedPath,
    straightLineDistanceKm,
    resolveElevation,
    enrichSelectedPath,
    render
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
