/* ==========================================================================
   FieldOps Atlas map service controls and weather preview
   File: FieldOpsAtlas/Features/maps/OSMweather-menu.js
   Version: 1.0.25-input-svg-assets
   Purpose:
   - Controls the collapsible DTT, DAB, FM, and Weather rail.
   - Opens an attached checkbox cluster picker for service controls.
   - Filters existing region markers using each region record's services array.
   - Reads lightweight service clusters and path summaries from data/regions.json.
   - Supports rendering one or more selected clusters with a performance warning.
   - Uses stable non-animated fitting before laying out RF labels.
   - Colours RF paths by service and stacks compact labels over the line.
   - Uses external SVG assets for satellite and fibre virtual input endpoints.
   - Loads full path/transmitter details only after a rendered path is selected.
   - Does not request RF details during page, service, or cluster selection.
   - Controls the existing lazy Weather preview.
   ========================================================================== */

(function fieldOpsOSMServiceControls() {
  "use strict";

  var VERSION = "1.0.25-input-svg-assets";
  var PRESELI = {
    name: "Preseli area",
    lat: 51.921,
    lng: -4.742
  };
  var REGIONS_URL = "../../../data/regions.json";
  var INPUT_ICON_URLS = {
    satellite: "../../../data/icons/satellite-dish.svg?v=1.5.1",
    fibre: "../../../data/icons/ethernet-fibre.svg?v=1.0.5"
  };
  var REGION_STORAGE_KEY = "fieldops-osmmaps-selected-region-v1";
  var SERVICE_FILES = {
    dtt: {
      label: "DTT",
      detailUrls: {
        wenvoe: "../../../data/rf/wenvoe/dtt-details.json"
      }
    },
    dab: {
      label: "DAB",
      detailUrls: {}
    },
    fm: {
      label: "FM",
      detailUrls: {}
    }
  };
  var SERVICE_STYLES = {
    dtt: {
      line: "#16a34a",
      selected: "#86efac",
      label: "#15803d",
      text: "#f0fdf4"
    },
    dab: {
      line: "#1686d9",
      selected: "#7dd3fc",
      label: "#0369a1",
      text: "#f0f9ff"
    },
    fm: {
      line: "#a23bb7",
      selected: "#e879f9",
      label: "#86198f",
      text: "#fdf4ff"
    }
  };
  var FORECAST_CACHE_MS = 10 * 60 * 1000;
  var TOOLBAR_STORAGE_KEY = "fieldops.maps.quick-tools.collapsed";
  var TOOLBAR_COLLAPSED_CLASS = "is-collapsed";
  var regionLookupCache = null;
  var detailCache = new Map();
  var clusterSelections = new Map();
  var activeServiceId = "";
  var serviceRequestId = 0;
  var clusterRenderRequestId = 0;
  var weatherCache = null;
  var capturedMap = null;
  var rfOverlay = {
    map: null,
    lineLayer: null,
    endpointLayer: null,
    virtualLayer: null,
    siteLabelLayer: null,
    pathLabelLayer: null,
    activePayload: null,
    activeCluster: null,
    activeWalks: [],
    activePaths: [],
    siteDetails: new Map(),
    pathLines: new Map(),
    virtualEndpoints: new Map(),
    selectedPathId: "",
    activeServiceId: "",
    activeRegionId: "",
    redrawTimer: 0,
    stagedTimers: [],
    mapEventsBound: false
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

  function captureLeafletMap() {
    if (!window.L || typeof window.L.map !== "function" || window.L.map.__fieldOpsCaptured) {
      return;
    }

    var originalMap = window.L.map;

    function wrappedMap() {
      var map = originalMap.apply(this, arguments);
      var container = map && typeof map.getContainer === "function" ? map.getContainer() : null;

      if (container && container.id === "OSMmaps") {
        capturedMap = map;
        window.FieldOpsAtlasLeafletMap = map;
      }

      return map;
    }

    Object.keys(originalMap).forEach(function copyProperty(key) {
      wrappedMap[key] = originalMap[key];
    });

    wrappedMap.__fieldOpsCaptured = true;
    window.L.map = wrappedMap;
  }

  captureLeafletMap();

  function readToolbarCollapsed() {
    try {
      return window.localStorage.getItem(TOOLBAR_STORAGE_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function saveToolbarCollapsed(collapsed) {
    try {
      window.localStorage.setItem(TOOLBAR_STORAGE_KEY, String(collapsed));
    } catch (error) {
      // Storage can be blocked inside previews and webviews.
    }
  }

  function setToolbarCollapsed(collapsed, persist) {
    var toolbar = qs("[data-map-quick-tools]");
    var toggle = qs("[data-map-quick-toggle]");

    if (!toolbar || !toggle) {
      return;
    }

    toolbar.classList.toggle(TOOLBAR_COLLAPSED_CLASS, collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute(
      "aria-label",
      collapsed ? "Expand map quick tools" : "Collapse map quick tools"
    );

    if (collapsed) {
      closeServicePicker();
      setWeatherPanelOpen(false);
    }

    if (persist !== false) {
      saveToolbarCollapsed(collapsed);
    }
  }

  function toggleToolbar() {
    var toolbar = qs("[data-map-quick-tools]");

    if (!toolbar) {
      return;
    }

    setToolbarCollapsed(!toolbar.classList.contains(TOOLBAR_COLLAPSED_CLASS));
  }

  function setActiveService(serviceId) {
    activeServiceId = String(serviceId || "");

    qsa("[data-map-service]").forEach(function syncButton(button) {
      var active = button.getAttribute("data-map-service") === activeServiceId;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setPickerExpanded(serviceId, expanded) {
    qsa("[data-map-service]").forEach(function syncButton(button) {
      var matches = button.getAttribute("data-map-service") === serviceId;
      button.setAttribute("aria-expanded", String(Boolean(expanded && matches)));
    });
  }

  function setServiceStatus(message, warning) {
    var output = qs("[data-map-service-status]");

    if (output) {
      output.textContent = message || "";
      output.classList.toggle("is-warning", Boolean(warning));
    }
  }

  function setServiceHeading(serviceId, title) {
    var service = SERVICE_FILES[serviceId];
    var kicker = qs("[data-map-service-kicker]");
    var heading = qs("[data-map-service-title]");

    if (kicker) {
      kicker.textContent = service ? service.label : "Service";
    }

    if (heading) {
      heading.textContent = title || "Choose cluster";
    }
  }

  function closeServicePicker() {
    var toolbar = qs("[data-map-quick-tools]");
    var picker = qs("[data-map-service-picker]");

    if (picker) {
      picker.hidden = true;
      delete picker.dataset.activeService;
    }

    if (toolbar) {
      toolbar.classList.remove("has-service-picker");
    }

    setPickerExpanded("", false);
  }

  function showServicePicker(serviceId) {
    var toolbar = qs("[data-map-quick-tools]");
    var picker = qs("[data-map-service-picker]");

    if (!toolbar || !picker) {
      return;
    }

    picker.hidden = false;
    picker.dataset.activeService = serviceId;
    toolbar.classList.add("has-service-picker");
    setPickerExpanded(serviceId, true);
  }

  function openServicePicker(serviceId) {
    var picker = qs("[data-map-service-picker]");
    var service = SERVICE_FILES[serviceId];
    var sameService = activeServiceId === serviceId;

    if (!picker || !service) {
      return;
    }

    if (!picker.hidden && picker.dataset.activeService === serviceId) {
      closeServicePicker();
      return;
    }

    setWeatherPanelOpen(false);
    setActiveService(serviceId);
    setServiceHeading(serviceId, "Choose one or more clusters");
    showServicePicker(serviceId);

    if (sameService && qs("[data-map-service-options]") && qs("[data-map-service-options]").children.length) {
      return;
    }

    clusterSelections.set(serviceId, new Set());
    applyServiceFilter(serviceId);
  }

  function stableFitWalks(map, walks, maxZoom) {
    if (!map || !window.L || !walks || !walks.length) {
      return;
    }

    var bounds = window.L.latLngBounds(walks.map(function toLatLng(walk) {
      return [walk.lat, walk.lng];
    }));

    map.stop();
    map.invalidateSize({
      pan: false,
      debounceMoveend: true
    });
    map.fitBounds(bounds.pad(0.14), {
      animate: false,
      maxZoom: Number(maxZoom || 11)
    });

    scheduleRfLabelLayoutStaged();
  }

  function applyVisibleSiteIds(mapApi, map, siteIds, fit) {
    var visibleIds = new Set((siteIds || []).map(String));
    var walks = mapApi.getWalks();
    var visibleWalks = walks.filter(function visibleWalk(walk) {
      return visibleIds.has(String(walk.id));
    });
    var visibleNames = new Set(visibleWalks.map(function walkName(walk) {
      return walk.name;
    }));

    markerLayers(map).forEach(function filterMarker(marker) {
      if (!visibleNames.has(marker.options.title)) {
        map.removeLayer(marker);
      }
    });

    if (fit) {
      stableFitWalks(map, visibleWalks, 11);
    }

    return visibleWalks;
  }

  function walkHasService(walk, serviceId) {
    var wanted = String(serviceId || "").toLowerCase();
    var services = walk && Array.isArray(walk.services) ? walk.services : [];

    return services.some(function matchingService(service) {
      return String(service || "").trim().toLowerCase() === wanted;
    });
  }

  function currentRegionId(mapApi) {
    var walks = mapApi && typeof mapApi.getWalks === "function" ? mapApi.getWalks() : [];

    if (walks.length && walks[0].regionId) {
      return String(walks[0].regionId);
    }

    try {
      return String(window.localStorage.getItem(REGION_STORAGE_KEY) || "");
    } catch (error) {
      return "";
    }
  }

  function loadRegionLookup() {
    if (regionLookupCache) {
      return regionLookupCache;
    }

    regionLookupCache = loadJson(REGIONS_URL, "region lookup")
      .then(function validRegionLookup(payload) {
        if (!Array.isArray(payload)) {
          throw new Error("Region lookup is not a valid array.");
        }

        return payload;
      })
      .catch(function clearFailedRegionLookup(error) {
        regionLookupCache = null;
        throw error;
      });

    return regionLookupCache;
  }

  function regionFromLookup(regions, regionId) {
    return (regions || []).find(function findRegion(region) {
      return region && String(region.id) === String(regionId);
    }) || null;
  }

  function clustersFromRegion(region, serviceId) {
    var serviceClusters = region && region.serviceClusters;
    var clusters = serviceClusters && Array.isArray(serviceClusters[serviceId])
      ? serviceClusters[serviceId]
      : [];

    return clusters.filter(function validCluster(cluster) {
      return cluster &&
        cluster.id &&
        cluster.name &&
        Array.isArray(cluster.siteIds) &&
        cluster.siteIds.length > 0;
    });
  }

  function selectedClusterSet(serviceId) {
    var key = String(serviceId || "");

    if (!clusterSelections.has(key)) {
      clusterSelections.set(key, new Set());
    }

    return clusterSelections.get(key);
  }

  function syncClusterCheckboxes(serviceId) {
    var selected = selectedClusterSet(serviceId);

    qsa('input[data-map-cluster][data-map-service-id="' + serviceId + '"]').forEach(function syncCheckbox(checkbox) {
      var checked = selected.has(String(checkbox.getAttribute("data-map-cluster") || ""));
      var row = checkbox.closest(".map-service-cluster");

      checkbox.checked = checked;

      if (row) {
        row.classList.toggle("is-selected", checked);
      }
    });
  }

  function combineClusters(clusters) {
    var siteIds = new Set();
    var paths = new Map();
    var headSiteIds = new Set();

    (clusters || []).forEach(function collectCluster(cluster) {
      (cluster.siteIds || []).forEach(function collectSite(siteId) {
        siteIds.add(String(siteId));
      });

      (cluster.paths || []).forEach(function collectPath(path) {
        if (path && path.id) {
          paths.set(String(path.id), path);
        }
      });

      if (cluster.headSiteId) {
        headSiteIds.add(String(cluster.headSiteId));
      }
    });

    return {
      id: clusters.length === 1 ? String(clusters[0].id) : "multiple-clusters",
      name: clusters.length === 1 ? String(clusters[0].name) : clusters.length + " clusters",
      headSiteId: headSiteIds.size === 1 ? Array.from(headSiteIds)[0] : "",
      siteCount: siteIds.size,
      siteIds: Array.from(siteIds),
      paths: Array.from(paths.values()),
      selectedClusterIds: clusters.map(function clusterId(cluster) {
        return String(cluster.id);
      })
    };
  }

  function detailUrlFor(serviceId, regionId) {
    var service = SERVICE_FILES[serviceId];
    var urls = service && service.detailUrls ? service.detailUrls : {};

    return String(urls[regionId] || "");
  }

  function applyServiceFilter(serviceId) {
    var service = SERVICE_FILES[serviceId];
    var requestId = ++serviceRequestId;

    if (!service) {
      return;
    }

    renderServiceLoading("Filtering region sites...");

    Promise.all([
      waitForMapApi(),
      loadRegionLookup()
    ])
      .then(function prepareRegion(values) {
        var mapApi = values[0];
        var regions = values[1];
        var regionId = currentRegionId(mapApi);
        var region = regionFromLookup(regions, regionId);

        if (!regionId || !region) {
          throw new Error("Choose a map region before selecting a service.");
        }

        return mapApi.selectRegion(regionId).then(function regionLoaded() {
          return {
            mapApi: mapApi,
            region: region,
            regionId: regionId
          };
        });
      })
      .then(function applyRegionFilter(context) {
        if (!context || requestId !== serviceRequestId || activeServiceId !== serviceId) {
          return;
        }

        var mapApi = context.mapApi;
        var map = capturedMap || window.FieldOpsAtlasLeafletMap;

        if (!map || !window.L) {
          throw new Error("Leaflet map instance is unavailable.");
        }

        clearRfOverlay();

        var serviceWalks = mapApi.getWalks().filter(function filterByRegionService(walk) {
          return walkHasService(walk, serviceId);
        });
        var clusters = clustersFromRegion(context.region, serviceId);

        applyVisibleSiteIds(
          mapApi,
          map,
          serviceWalks.map(function serviceSiteId(walk) {
            return walk.id;
          }),
          true
        );

        renderServiceClusters(serviceId, clusters, serviceWalks.length);
      })
      .catch(function handleServiceError(error) {
        if (requestId === serviceRequestId) {
          renderServiceError(error.message || "Could not filter the service sites.");
        }
      });
  }

  function renderServiceLoading(message) {
    var options = qs("[data-map-service-options]");

    if (options) {
      options.innerHTML = "";
    }

    setServiceStatus(message || "Filtering region sites...");
  }

  function renderServiceUnavailable(serviceId, siteCount) {
    var options = qs("[data-map-service-options]");
    var service = SERVICE_FILES[serviceId];

    if (options) {
      options.innerHTML = "";
    }

    setServiceStatus(
      Number(siteCount || 0) + " " +
      (service ? service.label : "service") +
      " sites shown. No path topology is configured."
    );
  }

  function renderServiceError(message) {
    var options = qs("[data-map-service-options]");

    if (options) {
      options.innerHTML = "";
    }

    setServiceStatus(message);
  }

  function loadJson(url, label) {
    return fetch(url + "?v=" + Date.now(), {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    }).then(function handleResponse(response) {
      if (!response.ok) {
        throw new Error("Could not load " + (label || "map data") + " (" + response.status + ").");
      }

      return response.json();
    });
  }

  function loadDetailData(serviceId, regionId) {
    var service = SERVICE_FILES[serviceId];
    var detailUrl = detailUrlFor(serviceId, regionId);
    var cacheKey = String(regionId || "") + ":" + String(serviceId || "");

    if (!service || !detailUrl) {
      return Promise.reject(new Error(
        "Detailed " + String(serviceId || "").toUpperCase() +
        " path data is not available for this region."
      ));
    }

    if (detailCache.has(cacheKey)) {
      return detailCache.get(cacheKey);
    }

    var request = loadJson(detailUrl, service.label + " path details")
      .catch(function clearFailedDetail(error) {
        detailCache.delete(cacheKey);
        throw error;
      });

    detailCache.set(cacheKey, request);
    return request;
  }

  function renderServiceClusters(serviceId, clusters, siteCount) {
    var options = qs("[data-map-service-options]");
    var service = SERVICE_FILES[serviceId];
    var selected = selectedClusterSet(serviceId);

    if (!options) {
      return;
    }

    if (!clusters.length) {
      options.innerHTML = "";
      setServiceStatus(
        Number(siteCount || 0) + " " +
        (service ? service.label : "service") +
        " sites shown. No clusters are configured."
      );
      return;
    }

    options.innerHTML = clusters.map(function clusterCheckbox(cluster) {
      var checked = selected.has(String(cluster.id));

      return [
        '<label class="map-service-cluster',
        checked ? ' is-selected' : '',
        '">',
        '<input class="map-service-cluster__checkbox" type="checkbox" data-map-cluster="',
        escapeHtml(cluster.id),
        '" data-map-service-id="',
        escapeHtml(serviceId),
        '"',
        checked ? ' checked' : '',
        '>',
        '<span class="map-service-cluster__body">',
        '<strong>',
        escapeHtml(cluster.name),
        '</strong>',
        '<span>',
        escapeHtml(cluster.siteCount || cluster.siteIds.length),
        ' sites</span>',
        '</span>',
        '</label>'
      ].join("");
    }).join("");

    setServiceStatus(
      Number(siteCount || 0) + " " +
      (service ? service.label : "service") +
      " sites shown. Tick one or more clusters."
    );
  }

  function waitForMapApi() {
    return new Promise(function resolveMapApi(resolve, reject) {
      var attempts = 0;

      function check() {
        if (
          window.FieldOpsOSMmaps &&
          typeof window.FieldOpsOSMmaps.selectRegion === "function" &&
          typeof window.FieldOpsOSMmaps.getWalks === "function"
        ) {
          resolve(window.FieldOpsOSMmaps);
          return;
        }

        attempts += 1;

        if (attempts >= 80) {
          reject(new Error("Map controls are not ready."));
          return;
        }

        window.setTimeout(check, 50);
      }

      check();
    });
  }

  function markerLayers(map) {
    var markers = [];

    if (!map || !window.L) {
      return markers;
    }

    map.eachLayer(function collectLayer(layer) {
      if (layer instanceof window.L.Marker && layer.options && layer.options.title) {
        markers.push(layer);
      }
    });

    return markers;
  }

  function ensureRfPane(map, paneName, zIndex) {
    var pane = map.getPane(paneName);

    if (!pane) {
      pane = map.createPane(paneName);
    }

    pane.style.zIndex = String(zIndex);
    return pane;
  }

  function ensureRfLayers(map) {
    if (!map || !window.L) {
      return;
    }

    rfOverlay.map = map;
    ensureRfPane(map, "fieldopsRfPaths", 430);
    ensureRfPane(map, "fieldopsRfEndpoints", 625);
    ensureRfPane(map, "fieldopsRfLabels", 650);

    if (!rfOverlay.lineLayer) {
      rfOverlay.lineLayer = window.L.layerGroup().addTo(map);
    }

    if (!rfOverlay.endpointLayer) {
      rfOverlay.endpointLayer = window.L.layerGroup().addTo(map);
    }

    if (!rfOverlay.virtualLayer) {
      rfOverlay.virtualLayer = window.L.layerGroup().addTo(map);
    }

    if (!rfOverlay.siteLabelLayer) {
      rfOverlay.siteLabelLayer = window.L.layerGroup().addTo(map);
    }

    if (!rfOverlay.pathLabelLayer) {
      rfOverlay.pathLabelLayer = window.L.layerGroup().addTo(map);
    }

    if (!rfOverlay.mapEventsBound) {
      ["zoomend", "moveend", "resize", "viewreset"].forEach(function bindLabelLayout(eventName) {
        map.on(eventName, scheduleRfLabelLayout);
      });
      rfOverlay.mapEventsBound = true;
    }
  }

  function clearRfOverlay() {
    [
      rfOverlay.lineLayer,
      rfOverlay.endpointLayer,
      rfOverlay.virtualLayer,
      rfOverlay.siteLabelLayer,
      rfOverlay.pathLabelLayer
    ].forEach(function clearLayer(layer) {
      if (layer) {
        layer.clearLayers();
      }
    });

    rfOverlay.activePayload = null;
    rfOverlay.activeCluster = null;
    rfOverlay.activeWalks = [];
    rfOverlay.activePaths = [];
    rfOverlay.siteDetails = new Map();
    rfOverlay.pathLines = new Map();
    rfOverlay.virtualEndpoints = new Map();
    rfOverlay.selectedPathId = "";
    rfOverlay.activeServiceId = "";
    rfOverlay.activeRegionId = "";

    if (rfOverlay.redrawTimer) {
      window.clearTimeout(rfOverlay.redrawTimer);
      rfOverlay.redrawTimer = 0;
    }

    rfOverlay.stagedTimers.forEach(function clearStagedTimer(timerId) {
      window.clearTimeout(timerId);
    });
    rfOverlay.stagedTimers = [];
  }

  function siteDetailMap(payload) {
    var details = new Map();
    var list = [];

    if (payload && Array.isArray(payload.siteDetails)) {
      list = payload.siteDetails;
    } else if (payload && Array.isArray(payload.siteSummaries)) {
      list = payload.siteSummaries;
    }

    list.forEach(function addDetail(detail) {
      if (detail && detail.siteId) {
        details.set(String(detail.siteId), detail);
      }
    });

    return details;
  }

  function walkMap(walks) {
    var result = new Map();

    (walks || []).forEach(function addWalk(walk) {
      if (walk && walk.id) {
        result.set(String(walk.id), walk);
      }
    });

    return result;
  }

  function normaliseVirtualEndpoint(rawEndpoint, fallbackId) {
    if (!rawEndpoint || typeof rawEndpoint !== "object") {
      return null;
    }

    var lat = Number(rawEndpoint.lat);
    var lng = Number(rawEndpoint.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return {
      id: String(rawEndpoint.id || fallbackId || "virtual-endpoint"),
      name: String(rawEndpoint.name || rawEndpoint.label || "Virtual endpoint"),
      label: String(rawEndpoint.label || rawEndpoint.name || "Virtual endpoint"),
      type: String(rawEndpoint.type || "virtual"),
      lat: lat,
      lng: lng,
      isVirtual: true
    };
  }

  function pathEndpoint(path, side, walksById) {
    var feeding = side === "feeding";
    var siteId = feeding ? path.feedingSiteId : path.receivingSiteId;
    var virtualKey = feeding ? "virtualFeeder" : "virtualReceiver";
    var walk = walksById.get(String(siteId || ""));

    if (walk) {
      return walk;
    }

    return normaliseVirtualEndpoint(path[virtualKey], siteId);
  }

  function pathsForCluster(cluster, walksById) {
    var list = cluster && Array.isArray(cluster.paths) ? cluster.paths : [];

    return list.filter(function usablePath(path) {
      return path &&
        pathEndpoint(path, "feeding", walksById) &&
        pathEndpoint(path, "receiving", walksById);
    });
  }

  function lightweightSiteDetails(cluster, walks, paths) {
    var details = new Map();
    var headSiteId = String((cluster && cluster.headSiteId) || "");

    (walks || []).forEach(function addLightweightDetail(walk) {
      var connected = (paths || []).filter(function connectedPath(path) {
        return String(path.feedingSiteId) === String(walk.id) ||
          String(path.receivingSiteId) === String(walk.id);
      });
      var muxCount = connected.reduce(function highestMux(highest, path) {
        var count = Number(path.bundleCount);
        return Number.isFinite(count) ? Math.max(highest, count) : highest;
      }, 0);

      details.set(String(walk.id), {
        siteId: String(walk.id),
        serviceRole: String(walk.id) === headSiteId ? "head" : "relay",
        multiplexCount: muxCount || null
      });
    });

    return details;
  }

  function detailedPathMatches(summary, candidate) {
    if (!summary || !candidate) {
      return false;
    }

    if (summary.id && candidate.id && String(summary.id) === String(candidate.id)) {
      return true;
    }

    return String(summary.feedingSiteId || "") === String(candidate.feedingSiteId || "") &&
      String(summary.receivingSiteId || "") === String(candidate.receivingSiteId || "") &&
      String(summary.clusterId || "") === String(candidate.clusterId || "") &&
      String(summary.routeType || "primary") === String(candidate.routeType || "primary");
  }

  function titleCase(value) {
    var text = String(value || "").replace(/[-_]+/g, " ").trim();

    if (!text) {
      return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function listText(value, suffix) {
    if (!Array.isArray(value) || !value.length) {
      return "—";
    }

    return value.join(", ") + (suffix || "");
  }

  function numberText(value, suffix) {
    var number = Number(value);

    if (!Number.isFinite(number)) {
      return "—";
    }

    return number + (suffix || "");
  }

  function toRadians(value) {
    return Number(value) * Math.PI / 180;
  }

  function toDegrees(value) {
    return Number(value) * 180 / Math.PI;
  }

  function pathGeometry(fromWalk, toWalk) {
    var earthRadiusKm = 6371.0088;
    var lat1 = toRadians(fromWalk.lat);
    var lat2 = toRadians(toWalk.lat);
    var deltaLat = toRadians(toWalk.lat - fromWalk.lat);
    var deltaLng = toRadians(toWalk.lng - fromWalk.lng);
    var sinLat = Math.sin(deltaLat / 2);
    var sinLng = Math.sin(deltaLng / 2);
    var a = sinLat * sinLat +
      Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
    var distanceKm = 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var y = Math.sin(deltaLng) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    var forwardBearing = (toDegrees(Math.atan2(y, x)) + 360) % 360;
    var reverseBearing = (forwardBearing + 180) % 360;
    var compassPoints = [
      "N", "NNE", "NE", "ENE",
      "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW",
      "W", "WNW", "NW", "NNW"
    ];

    return {
      distanceKm: distanceKm,
      forwardBearing: forwardBearing,
      reverseBearing: reverseBearing,
      direction: compassPoints[Math.round(forwardBearing / 22.5) % 16]
    };
  }

  function pathLabelText(path) {
    var service = String(path.serviceType || "dtt").toUpperCase();
    var mux = Number(path.bundleCount);
    var route = String(path.routeType || "primary").toLowerCase();

    if (route !== "primary") {
      return [
        service,
        "Backup " + (path.backupNumber || path.routeIndex || ""),
        Number.isFinite(mux) ? mux + " mux" : ""
      ].filter(Boolean).join(" · ");
    }

    return [
      service,
      Number.isFinite(mux) ? mux + " mux" : ""
    ].filter(Boolean).join(" · ");
  }

  function pathDetailsHtml(path, walksById) {
    var fromWalk = pathEndpoint(path, "feeding", walksById);
    var toWalk = pathEndpoint(path, "receiving", walksById);
    var fromDetail = rfOverlay.siteDetails.get(String(path.feedingSiteId)) || {};
    var toDetail = rfOverlay.siteDetails.get(String(path.receivingSiteId)) || {};
    var feedSummary = path.feedSummary || {};
    var receiveSummary = path.receiveSummary || {};
    var geometry = pathGeometry(fromWalk, toWalk);
    var heading = escapeHtml(fromWalk.name) + " → " + escapeHtml(toWalk.name);

    return [
      '<article class="osmmaps-rf-path-card">',
      '<header><small>', escapeHtml(String(path.serviceType || "dtt").toUpperCase()),
      ' · ', escapeHtml(titleCase(path.routeType || "primary")),
      '</small><strong>', heading, '</strong></header>',
      '<dl>',
      '<div><dt>Path</dt><dd>', escapeHtml(pathLabelText(path)), '</dd></div>',
      '<div><dt>Distance</dt><dd>', geometry.distanceKm.toFixed(1), ' km</dd></div>',
      '<div><dt>Bearing</dt><dd>', geometry.forwardBearing.toFixed(0), '° ',
      escapeHtml(geometry.direction), ' / ', geometry.reverseBearing.toFixed(0), '° reverse</dd></div>',
      '<div><dt>Feed method</dt><dd>', escapeHtml(titleCase(path.feedMethod || "")), '</dd></div>',
      '<div><dt>TX channels</dt><dd>', escapeHtml(listText(feedSummary.txChannels || (fromDetail.tx && fromDetail.tx.channels))), '</dd></div>',
      '<div><dt>TX frequencies</dt><dd>', escapeHtml(listText(feedSummary.txFrequenciesMHz || (fromDetail.tx && fromDetail.tx.frequenciesMHz), " MHz")), '</dd></div>',
      '<div><dt>TX power</dt><dd>', escapeHtml(numberText(feedSummary.txPowerKw != null ? feedSummary.txPowerKw : (fromDetail.tx && fromDetail.tx.powerKw), " kW")), '</dd></div>',
      '<div><dt>TX equipment</dt><dd>', escapeHtml(feedSummary.transmitterType || fromDetail.transmitterType || "—"), '</dd></div>',
      '<div><dt>TX antenna</dt><dd>', escapeHtml(feedSummary.outputAntennaType || fromDetail.outputAntennaType || "—"), '</dd></div>',
      '<div><dt>RX mode</dt><dd>', escapeHtml(titleCase(receiveSummary.inputMode || (toDetail.rx && toDetail.rx.inputMode) || "")), '</dd></div>',
      '<div><dt>RX channels</dt><dd>', escapeHtml(listText(receiveSummary.rxChannels || (toDetail.rx && toDetail.rx.channels))), '</dd></div>',
      '<div><dt>RX frequencies</dt><dd>', escapeHtml(listText(receiveSummary.rxFrequenciesMHz || (toDetail.rx && toDetail.rx.frequenciesMHz), " MHz")), '</dd></div>',
      '<div><dt>RX level</dt><dd>', escapeHtml(numberText(receiveSummary.rxPowerDbm != null ? receiveSummary.rxPowerDbm : (toDetail.rx && toDetail.rx.powerDbm), " dBm")), '</dd></div>',
      '<div><dt>Receiver</dt><dd>', escapeHtml(receiveSummary.receiverType || (toDetail.rx && toDetail.rx.receiverType) || "—"), '</dd></div>',
      '<div><dt>RX antenna</dt><dd>', escapeHtml(receiveSummary.receivingAntennaType || (toDetail.rx && toDetail.rx.receivingAntennaType) || "—"), '</dd></div>',
      '<div><dt>Telemetry</dt><dd>', escapeHtml(toDetail.telemetryType || "—"), '</dd></div>',
      '<div><dt>Service IP</dt><dd>', escapeHtml(toDetail.siteServiceIp || "—"), '</dd></div>',
      '<div><dt>Confidence</dt><dd>', escapeHtml(titleCase(path.confidence || "")), '</dd></div>',
      '</dl>',
      path.notes ? '<p>' + escapeHtml(path.notes) + '</p>' : "",
      '</article>'
    ].join("");
  }

  function serviceStyle(serviceId) {
    var id = String(serviceId || "dtt").toLowerCase();
    return SERVICE_STYLES[id] || SERVICE_STYLES.dtt;
  }

  function lineStyle(path, selected) {
    var backup = String(path.routeType || "primary").toLowerCase() !== "primary";
    var style = serviceStyle(path.serviceType);

    return {
      pane: "fieldopsRfPaths",
      color: selected ? style.selected : style.line,
      weight: selected ? 8 : 5,
      opacity: selected ? 1 : 0.88,
      dashArray: backup ? "11 8" : null,
      lineCap: "round",
      lineJoin: "round",
      interactive: true
    };
  }

  function selectRfPath(pathId, openPopup, latlng) {
    var selectedPath = rfOverlay.activePaths.find(function findPath(path) {
      return String(path.id) === String(pathId);
    });
    var walksById = walkMap(rfOverlay.activeWalks);
    var detailPopup = null;

    if (!selectedPath || !rfOverlay.map) {
      return;
    }

    rfOverlay.selectedPathId = String(selectedPath.id);
    rfOverlay.endpointLayer.clearLayers();

    rfOverlay.pathLines.forEach(function syncPathStyle(line, id) {
      var path = rfOverlay.activePaths.find(function findLinePath(item) {
        return String(item.id) === String(id);
      });

      if (path) {
        line.setStyle(lineStyle(path, String(id) === rfOverlay.selectedPathId));
      }
    });

    ["feeding", "receiving"].forEach(function addEndpoint(side, index) {
      var endpoint = pathEndpoint(selectedPath, side, walksById);

      if (!endpoint) {
        return;
      }

      window.L.circleMarker([endpoint.lat, endpoint.lng], {
        pane: "fieldopsRfEndpoints",
        radius: endpoint.isVirtual ? 10 : (index === 0 ? 11 : 9),
        color: "#f8fafc",
        weight: 3,
        fillColor: endpoint.isVirtual
          ? serviceStyle(selectedPath.serviceType).line
          : (index === 0 ? serviceStyle(selectedPath.serviceType).selected : "#102a43"),
        fillOpacity: 0.94,
        interactive: false
      }).addTo(rfOverlay.endpointLayer);
    });

    scheduleRfLabelLayoutStaged();

    if (openPopup) {
      detailPopup = window.L.popup({
        className: "osmmaps-rf-path-popup",
        maxWidth: 340,
        maxHeight: 360,
        closeButton: true,
        autoPan: true
      })
        .setLatLng(latlng || rfOverlay.map.getCenter())
        .setContent(
          '<article class="osmmaps-rf-path-card is-loading">' +
          '<header><small>' + escapeHtml(String(rfOverlay.activeServiceId || "").toUpperCase()) +
          '</small><strong>Loading path details…</strong></header></article>'
        )
        .openOn(rfOverlay.map);
    }

    loadDetailData(rfOverlay.activeServiceId, rfOverlay.activeRegionId)
      .then(function showPathDetails(payload) {
        if (rfOverlay.selectedPathId !== String(pathId)) {
          return;
        }

        var detailedPath = Array.isArray(payload.paths)
          ? payload.paths.find(function findDetailedPath(path) {
              return detailedPathMatches(selectedPath, path);
            })
          : null;

        if (!detailedPath) {
          throw new Error("The selected path detail record was not found.");
        }

        rfOverlay.siteDetails = siteDetailMap(payload);
        scheduleRfLabelLayoutStaged();

        if (detailPopup) {
          detailPopup.setContent(pathDetailsHtml(detailedPath, walksById));
          detailPopup.update();
        }
      })
      .catch(function showDetailError(error) {
        if (detailPopup && rfOverlay.selectedPathId === String(pathId)) {
          detailPopup.setContent(
            '<article class="osmmaps-rf-path-card is-loading">' +
            '<header><small>Path details</small><strong>' +
            escapeHtml(error.message || "Path details could not load.") +
            '</strong></header></article>'
          );
          detailPopup.update();
        }
      });
  }

  function virtualInputKind(endpoint, path) {
    var values = [
      endpoint && endpoint.type,
      path && path.sourceType,
      path && path.feedMethod
    ].map(function normaliseValue(value) {
      return String(value || "").toLowerCase();
    }).join(" ");

    return /fibre|fiber|ethernet|line/.test(values) ? "fibre" : "satellite";
  }

  function virtualInputIcon(endpoint, serviceId, path) {
    var service = String(serviceId || "dtt").toLowerCase();
    var kind = virtualInputKind(endpoint, path);
    var iconUrl = INPUT_ICON_URLS[kind] || INPUT_ICON_URLS.satellite;
    var accessibleName = String(endpoint.name || endpoint.label || titleCase(kind) + " input");

    return window.L.divIcon({
      className: "osmmaps-rf-input-icon is-" + service + " is-" + kind,
      html: [
        '<span class="osmmaps-rf-input-node" role="img" aria-label="',
        escapeHtml(accessibleName),
        '"><img src="',
        iconUrl,
        '" alt="" aria-hidden="true"></span>'
      ].join(""),
      iconSize: [58, 58],
      iconAnchor: [29, 29]
    });
  }

  function renderRfLines(map, serviceId, regionId, cluster, walks) {
    var walksById = walkMap(walks);
    var activePaths = pathsForCluster(cluster, walksById);

    ensureRfLayers(map);
    rfOverlay.lineLayer.clearLayers();
    rfOverlay.endpointLayer.clearLayers();
    rfOverlay.virtualLayer.clearLayers();
    rfOverlay.siteLabelLayer.clearLayers();
    rfOverlay.pathLabelLayer.clearLayers();
    rfOverlay.pathLines = new Map();
    rfOverlay.virtualEndpoints = new Map();
    rfOverlay.activePayload = cluster;
    rfOverlay.activeCluster = cluster;
    rfOverlay.activeWalks = walks.slice();
    rfOverlay.activePaths = activePaths;
    rfOverlay.siteDetails = lightweightSiteDetails(cluster, walks, activePaths);
    rfOverlay.selectedPathId = "";
    rfOverlay.activeServiceId = serviceId;
    rfOverlay.activeRegionId = regionId;

    rfOverlay.activePaths.forEach(function addPathLine(path) {
      var fromWalk = pathEndpoint(path, "feeding", walksById);
      var toWalk = pathEndpoint(path, "receiving", walksById);
      var line = window.L.polyline(
        [[fromWalk.lat, fromWalk.lng], [toWalk.lat, toWalk.lng]],
        lineStyle(path, false)
      );

      [fromWalk, toWalk].forEach(function addVirtualEndpoint(endpoint) {
        if (!endpoint || !endpoint.isVirtual || rfOverlay.virtualEndpoints.has(String(endpoint.id))) {
          return;
        }

        rfOverlay.virtualEndpoints.set(String(endpoint.id), endpoint);
        window.L.marker([endpoint.lat, endpoint.lng], {
          pane: "fieldopsRfEndpoints",
          icon: virtualInputIcon(endpoint, serviceId, path),
          interactive: false,
          keyboard: false
        }).addTo(rfOverlay.virtualLayer);
      });

      line.on("click", function onPathClick(event) {
        selectRfPath(path.id, true, event.latlng);
      });

      line.addTo(rfOverlay.lineLayer);
      rfOverlay.pathLines.set(String(path.id), line);
    });

    scheduleRfLabelLayoutStaged();
  }

  function mapUiRects(map) {
    var mapRect = map.getContainer().getBoundingClientRect();
    var selectors = [
      "[data-map-quick-tools]",
      "[data-selected-panel]:not([hidden])",
      ".weather-api-panel:not([hidden])",
      "[data-region-overlay]:not([hidden])",
      ".leaflet-control-container .leaflet-control"
    ];
    var rects = [];

    selectors.forEach(function collectSelector(selector) {
      qsa(selector).forEach(function addElementRect(element) {
        var rect = element.getBoundingClientRect();
        var left = Math.max(0, rect.left - mapRect.left);
        var top = Math.max(0, rect.top - mapRect.top);
        var right = Math.min(mapRect.width, rect.right - mapRect.left);
        var bottom = Math.min(mapRect.height, rect.bottom - mapRect.top);

        if (right > left && bottom > top) {
          rects.push({
            left: left,
            top: top,
            right: right,
            bottom: bottom
          });
        }
      });
    });

    return rects;
  }

  function rectOverlaps(rect, others, padding) {
    var gap = Number(padding || 0);

    return others.some(function overlaps(other) {
      return !(
        rect.right + gap <= other.left ||
        rect.left >= other.right + gap ||
        rect.bottom + gap <= other.top ||
        rect.top >= other.bottom + gap
      );
    });
  }

  function rectInsideMap(rect, map, margin) {
    var size = map.getSize();
    var edge = Number(margin || 0);

    return rect.left >= edge &&
      rect.top >= edge &&
      rect.right <= size.x - edge &&
      rect.bottom <= size.y - edge;
  }

  function markerObstacleRects(map, walks) {
    var endpoints = (walks || []).slice();

    rfOverlay.virtualEndpoints.forEach(function addVirtualEndpoint(endpoint) {
      endpoints.push(endpoint);
    });

    return endpoints.map(function markerRect(walk) {
      var point = map.latLngToContainerPoint([walk.lat, walk.lng]);
      var radius = walk.isVirtual ? 31 : 14;

      return {
        left: point.x - radius,
        top: point.y - radius,
        right: point.x + radius,
        bottom: point.y + radius
      };
    });
  }

  function siteLabelHtml(detail, walk) {
    var services = walk && Array.isArray(walk.services) && walk.services.length
      ? walk.services
      : ["dtt"];
    var badges = services.map(function serviceBadge(service) {
      var id = String(service || "").toLowerCase();
      return '<span class="is-' + escapeHtml(id) + '">' + escapeHtml(id.toUpperCase()) + '</span>';
    }).join("");
    var role = titleCase(detail.serviceRole || "relay");
    var mux = Number(detail.multiplexCount);
    var meta = role + (Number.isFinite(mux) ? " · " + mux + " mux" : "");

    return [
      '<span class="osmmaps-rf-site-label">',
      '<span class="osmmaps-rf-site-services">', badges, '</span>',
      '<small>', escapeHtml(meta), '</small>',
      '</span>'
    ].join("");
  }

  function siteLabelSize(detail, walk) {
    var services = walk && Array.isArray(walk.services) && walk.services.length
      ? walk.services
      : ["dtt"];
    var role = titleCase(detail.serviceRole || "relay");
    var meta = role + " · " + (Number(detail.multiplexCount) || "") + " mux";
    var badgeWidth = services.reduce(function countBadge(total, service) {
      return total + Math.max(25, String(service || "").length * 8 + 12);
    }, 0);
    var width = Math.max(badgeWidth + Math.max(0, services.length - 1) * 4 + 12, meta.length * 6.2 + 14);

    return {
      width: Math.min(154, Math.max(78, Math.ceil(width))),
      height: 40
    };
  }

  function siteLabelCandidates(point, width, height) {
    return [
      { name: "top-right", left: point.x + 15, top: point.y - height - 14 },
      { name: "top-left", left: point.x - width - 15, top: point.y - height - 14 },
      { name: "bottom-right", left: point.x + 15, top: point.y + 14 },
      { name: "bottom-left", left: point.x - width - 15, top: point.y + 14 },
      { name: "right", left: point.x + 16, top: point.y - height / 2 },
      { name: "left", left: point.x - width - 16, top: point.y - height / 2 },
      { name: "top", left: point.x - width / 2, top: point.y - height - 17 },
      { name: "bottom", left: point.x - width / 2, top: point.y + 17 }
    ];
  }

  function placeSiteLabels(map, obstacles) {
    var selectedEndpoints = new Set();
    var selectedPath = rfOverlay.activePaths.find(function findSelected(path) {
      return String(path.id) === String(rfOverlay.selectedPathId);
    });

    if (selectedPath) {
      selectedEndpoints.add(String(selectedPath.feedingSiteId));
      selectedEndpoints.add(String(selectedPath.receivingSiteId));
    }

    var clusterHeadId = rfOverlay.activeCluster
      ? String(rfOverlay.activeCluster.headSiteId || "")
      : "";
    var orderedWalks = rfOverlay.activeWalks.slice().sort(function sortLabels(a, b) {
      function priority(walk) {
        var id = String(walk.id);
        if (selectedEndpoints.has(id)) {
          return 0;
        }
        if (id === clusterHeadId) {
          return 1;
        }
        return 2;
      }

      return priority(a) - priority(b);
    });

    orderedWalks.forEach(function addSiteLabel(walk) {
      var detail = rfOverlay.siteDetails.get(String(walk.id));

      if (!detail) {
        return;
      }

      var point = map.latLngToContainerPoint([walk.lat, walk.lng]);
      var size = siteLabelSize(detail, walk);
      var placement = siteLabelCandidates(point, size.width, size.height).find(function clearCandidate(candidate) {
        var rect = {
          left: candidate.left,
          top: candidate.top,
          right: candidate.left + size.width,
          bottom: candidate.top + size.height
        };

        if (!rectInsideMap(rect, map, 5) || rectOverlaps(rect, obstacles, 4)) {
          return false;
        }

        candidate.rect = rect;
        return true;
      });

      if (!placement) {
        return;
      }

      var anchorX = point.x - placement.left;
      var anchorY = point.y - placement.top;
      var isSelected = selectedEndpoints.has(String(walk.id));
      var icon = window.L.divIcon({
        className: "osmmaps-rf-site-label-icon " +
          "is-" + placement.name +
          (isSelected ? " is-selected" : ""),
        html: siteLabelHtml(detail, walk),
        iconSize: [size.width, size.height],
        iconAnchor: [anchorX, anchorY]
      });

      window.L.marker([walk.lat, walk.lng], {
        pane: "fieldopsRfLabels",
        icon: icon,
        interactive: false,
        keyboard: false
      }).addTo(rfOverlay.siteLabelLayer);

      obstacles.push(placement.rect);
    });
  }

  function pathLabelCandidates(map, fromWalk, toWalk, width, height) {
    var fromPoint = map.latLngToContainerPoint([fromWalk.lat, fromWalk.lng]);
    var toPoint = map.latLngToContainerPoint([toWalk.lat, toWalk.lng]);
    var dx = toPoint.x - fromPoint.x;
    var dy = toPoint.y - fromPoint.y;
    var length = Math.sqrt(dx * dx + dy * dy) || 1;
    var perpendicularX = -dy / length;
    var perpendicularY = dx / length;
    var along = [0.5, 0.46, 0.54, 0.4, 0.6];
    var offsets = [0, 8, -8, 15, -15, 24, -24];
    var candidates = [];

    along.forEach(function addAlong(position) {
      var baseX = fromPoint.x + dx * position;
      var baseY = fromPoint.y + dy * position;

      offsets.forEach(function addOffset(offset) {
        var centerX = baseX + perpendicularX * offset;
        var centerY = baseY + perpendicularY * offset;

        candidates.push({
          centerX: centerX,
          centerY: centerY,
          rect: {
            left: centerX - width / 2,
            top: centerY - height / 2,
            right: centerX + width / 2,
            bottom: centerY + height / 2
          }
        });
      });
    });

    return candidates;
  }

  function pathLabelHtml(path) {
    var service = String(path.serviceType || "dtt").toUpperCase();
    var mux = Number(path.bundleCount);
    var backup = String(path.routeType || "primary").toLowerCase() !== "primary";
    var note = backup
      ? (String(path.feedMethod || "").toLowerCase() === "satellite"
        ? "SAT"
        : "B" + String(path.backupNumber || path.routeIndex || ""))
      : "";

    return [
      '<span class="osmmaps-rf-path-label">',
      '<strong>', escapeHtml(service), '</strong>',
      '<span>', Number.isFinite(mux) ? "×" + escapeHtml(mux) : "—", '</span>',
      note ? '<small>' + escapeHtml(note) + '</small>' : "",
      '</span>'
    ].join("");
  }

  function placePathLabels(map, obstacles) {
    var walksById = walkMap(rfOverlay.activeWalks);
    var orderedPaths = rfOverlay.activePaths.slice().sort(function selectedFirst(a, b) {
      return Number(String(b.id) === rfOverlay.selectedPathId) -
        Number(String(a.id) === rfOverlay.selectedPathId);
    });

    orderedPaths.forEach(function addPathLabel(path) {
      var fromWalk = pathEndpoint(path, "feeding", walksById);
      var toWalk = pathEndpoint(path, "receiving", walksById);

      if (!fromWalk || !toWalk) {
        return;
      }

      var backup = String(path.routeType || "primary").toLowerCase() !== "primary";
      var service = String(path.serviceType || "dtt").toLowerCase();
      var width = backup ? 48 : 42;
      var height = backup ? 46 : 36;
      var placement = pathLabelCandidates(map, fromWalk, toWalk, width, height).find(function clearCandidate(candidate) {
        return rectInsideMap(candidate.rect, map, 5) &&
          !rectOverlaps(candidate.rect, obstacles, 2);
      });

      if (!placement) {
        return;
      }

      var isSelected = String(path.id) === rfOverlay.selectedPathId;
      var icon = window.L.divIcon({
        className: "osmmaps-rf-path-label-icon is-" + service +
          (backup ? " is-backup" : "") +
          (isSelected ? " is-selected" : ""),
        html: pathLabelHtml(path),
        iconSize: [width, height],
        iconAnchor: [width / 2, height / 2]
      });
      var latlng = map.containerPointToLatLng([placement.centerX, placement.centerY]);

      window.L.marker(latlng, {
        pane: "fieldopsRfLabels",
        icon: icon,
        interactive: false,
        keyboard: false
      }).addTo(rfOverlay.pathLabelLayer);

      obstacles.push(placement.rect);
    });
  }

  function layoutRfLabels() {
    var map = rfOverlay.map;

    if (!map || !rfOverlay.activeCluster || !rfOverlay.siteLabelLayer || !rfOverlay.pathLabelLayer) {
      return;
    }

    rfOverlay.siteLabelLayer.clearLayers();
    rfOverlay.pathLabelLayer.clearLayers();

    var obstacles = mapUiRects(map).concat(markerObstacleRects(map, rfOverlay.activeWalks));

    // Path badges stay on the route where possible. Site labels move or hide first.
    placePathLabels(map, obstacles);
    placeSiteLabels(map, obstacles);
  }

  function scheduleRfLabelLayout() {
    if (rfOverlay.redrawTimer) {
      window.clearTimeout(rfOverlay.redrawTimer);
    }

    rfOverlay.redrawTimer = window.setTimeout(function redrawLabels() {
      rfOverlay.redrawTimer = 0;
      layoutRfLabels();
    }, 48);
  }

  function scheduleRfLabelLayoutStaged() {
    scheduleRfLabelLayout();

    window.requestAnimationFrame(function firstFrame() {
      window.requestAnimationFrame(scheduleRfLabelLayout);
    });

    rfOverlay.stagedTimers.forEach(function clearOldTimer(timerId) {
      window.clearTimeout(timerId);
    });

    rfOverlay.stagedTimers = [90, 220, 480].map(function stageLayout(delay) {
      return window.setTimeout(scheduleRfLabelLayout, delay);
    });
  }

  function focusClustersOnMap(serviceId, clusterIds) {
    var service = SERVICE_FILES[serviceId];
    var wantedIds = new Set((clusterIds || []).map(String));
    var requestId = ++clusterRenderRequestId;

    if (!service) {
      return;
    }

    if (!wantedIds.size) {
      applyServiceFilter(serviceId);
      return;
    }

    setServiceStatus(
      "Loading " + wantedIds.size + " " + service.label +
      (wantedIds.size === 1 ? " cluster..." : " clusters...")
    );

    Promise.all([
      loadRegionLookup(),
      waitForMapApi()
    ])
      .then(function prepareClusters(values) {
        var regions = values[0];
        var mapApi = values[1];
        var regionId = currentRegionId(mapApi);
        var region = regionFromLookup(regions, regionId);
        var selectedClusters = clustersFromRegion(region, serviceId).filter(function selectedCluster(item) {
          return wantedIds.has(String(item.id));
        });

        if (!regionId || !region) {
          throw new Error("Choose a map region before selecting clusters.");
        }

        if (!selectedClusters.length) {
          throw new Error("The selected clusters were not found in the region lookup.");
        }

        return mapApi.selectRegion(regionId).then(function regionLoaded() {
          return {
            mapApi: mapApi,
            regionId: regionId,
            clusters: selectedClusters,
            combinedCluster: combineClusters(selectedClusters)
          };
        });
      })
      .then(function applyClusters(context) {
        if (requestId !== clusterRenderRequestId || activeServiceId !== serviceId) {
          return;
        }

        var mapApi = context.mapApi;
        var clusters = context.clusters;
        var combinedCluster = context.combinedCluster;
        var allWalks = mapApi.getWalks();
        var serviceWalks = allWalks.filter(function filterByRegionService(walk) {
          return walkHasService(walk, serviceId);
        });
        var serviceIds = new Set(serviceWalks.map(function serviceSiteId(walk) {
          return String(walk.id);
        }));
        var memberIds = new Set(combinedCluster.siteIds.map(String).filter(function validMember(siteId) {
          return serviceIds.has(siteId);
        }));
        var walksById = walkMap(allWalks);
        var clusterPaths = pathsForCluster(combinedCluster, walksById);
        var visibleIds = new Set(memberIds);

        clusterPaths.forEach(function includePathEndpoints(path) {
          visibleIds.add(String(path.feedingSiteId));
          visibleIds.add(String(path.receivingSiteId));
        });

        var map = capturedMap || window.FieldOpsAtlasLeafletMap;

        if (!map || !window.L) {
          throw new Error("Leaflet map instance is unavailable.");
        }

        clearRfOverlay();
        var visibleWalks = applyVisibleSiteIds(
          mapApi,
          map,
          Array.from(visibleIds),
          false
        );

        renderRfLines(map, serviceId, context.regionId, combinedCluster, visibleWalks);
        stableFitWalks(map, visibleWalks, clusters.length > 1 ? 10 : 11);
        setActiveService(serviceId);
        syncClusterCheckboxes(serviceId);

        if (clusters.length > 1) {
          setServiceStatus(
            "Warning: " + clusters.length + " clusters and " + clusterPaths.length +
            " paths are being rendered. Performance may reduce and some labels may be hidden.",
            true
          );
        } else {
          setServiceStatus(
            clusters[0].name + " rendered with " + clusterPaths.length + " paths."
          );
        }

        window.dispatchEvent(new CustomEvent("fieldops:map-service-cluster-selected", {
          detail: {
            version: VERSION,
            regionId: context.regionId,
            serviceType: serviceId,
            clusterId: clusters.length === 1 ? clusters[0].id : "multiple-clusters",
            clusterName: clusters.length === 1 ? clusters[0].name : clusters.length + " clusters",
            clusterIds: clusters.map(function clusterId(cluster) {
              return cluster.id;
            }),
            clusterNames: clusters.map(function clusterName(cluster) {
              return cluster.name;
            }),
            clusterCount: clusters.length,
            siteCount: memberIds.size,
            visibleSiteCount: visibleWalks.length,
            pathCount: clusterPaths.length,
            siteIds: Array.from(memberIds),
            detailsLoaded: false
          }
        }));
      })
      .catch(function handleClusterError(error) {
        if (requestId !== clusterRenderRequestId) {
          return;
        }

        clearRfOverlay();
        setServiceStatus(error.message || "Could not focus the selected clusters.");
      });
  }

  function setClusterSelected(serviceId, clusterId, checked) {
    var selected = selectedClusterSet(serviceId);
    var id = String(clusterId || "");

    if (!id) {
      return;
    }

    if (checked) {
      selected.add(id);
    } else {
      selected.delete(id);
    }

    syncClusterCheckboxes(serviceId);

    if (!selected.size) {
      clusterRenderRequestId += 1;
      clearRfOverlay();
      applyServiceFilter(serviceId);
      return;
    }

    focusClustersOnMap(serviceId, Array.from(selected));
  }

  function focusClusterOnMap(serviceId, clusterId) {
    var selected = selectedClusterSet(serviceId);

    selected.clear();
    selected.add(String(clusterId));
    syncClusterCheckboxes(serviceId);
    focusClustersOnMap(serviceId, Array.from(selected));
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
      95: "Thunderstorm",
      96: "Thunderstorm hail",
      99: "Heavy thunderstorm hail"
    };

    return labels[Number(code)] || "Weather code " + code;
  }

  function forecastUrl() {
    var params = new URLSearchParams({
      latitude: PRESELI.lat.toFixed(4),
      longitude: PRESELI.lng.toFixed(4),
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
      timezone: "Europe/London",
      forecast_days: "5"
    });

    return "https://api.open-meteo.com/v1/forecast?" + params.toString();
  }

  function setWeatherPanelOpen(open) {
    var panel = qs(".weather-api-panel");

    if (panel) {
      panel.hidden = !open;
    }

    qsa("[data-weather-panel-open]").forEach(function syncOpenButton(button) {
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setWeatherStatus(message) {
    var output = qs("[data-weather-output]");

    if (output) {
      output.textContent = message;
    }
  }

  function setWeatherUpdated(message) {
    var output = qs("[data-weather-forecast-updated]");

    if (output) {
      output.textContent = message;
    }
  }

  function renderWeatherPlaceholder(message) {
    var track = qs("[data-weather-forecast-track]");

    if (!track) {
      return;
    }

    track.innerHTML = [
      '<article class="weather-forecast-card weather-forecast-card-placeholder" role="listitem">',
      message,
      "</article>"
    ].join("");
  }

  function formatDay(dateText) {
    var date = new Date(dateText + "T12:00:00");

    if (Number.isNaN(date.getTime())) {
      return dateText;
    }

    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  }

  function renderForecast(payload) {
    var track = qs("[data-weather-forecast-track]");
    var daily = payload && payload.daily;

    if (!track || !daily || !Array.isArray(daily.time)) {
      throw new Error("Forecast payload missing daily data.");
    }

    track.innerHTML = daily.time.map(function renderDay(dateText, index) {
      var max = Math.round(Number(daily.temperature_2m_max[index]));
      var min = Math.round(Number(daily.temperature_2m_min[index]));
      var rain = Number(daily.precipitation_sum[index] || 0).toFixed(1);
      var wind = Math.round(Number(daily.wind_speed_10m_max[index] || 0));
      var summary = weatherCodeText(daily.weather_code[index]);

      return [
        '<article class="weather-forecast-card" role="listitem">',
        "<strong>", formatDay(dateText), "</strong>",
        "<span>", summary, "</span>",
        "<span>", min, "–", max, "°C</span>",
        "<span>Rain ", rain, " mm</span>",
        "<span>Wind ", wind, " km/h</span>",
        "</article>"
      ].join("");
    }).join("");

    setWeatherUpdated("Updated now");
    setWeatherStatus("Preview loaded for " + PRESELI.name + ".");
  }

  function activatePreview() {
    if (weatherCache && Date.now() - weatherCache.time < FORECAST_CACHE_MS) {
      renderForecast(weatherCache.payload);
      return;
    }

    setWeatherUpdated("Loading");
    setWeatherStatus("Loading Preseli preview...");
    renderWeatherPlaceholder("Loading preview...");

    fetch(forecastUrl(), {
      headers: {
        Accept: "application/json"
      }
    })
      .then(function handleResponse(response) {
        if (!response.ok) {
          throw new Error("Forecast unavailable.");
        }

        return response.json();
      })
      .then(function handlePayload(payload) {
        weatherCache = {
          time: Date.now(),
          payload: payload
        };
        renderForecast(payload);
      })
      .catch(function handleError() {
        setWeatherUpdated("Not loaded");
        setWeatherStatus("Preseli preview unavailable.");
        renderWeatherPlaceholder("Preview unavailable. Open full Weather for provider pages.");
      });
  }

  function wireControls() {
    document.addEventListener("click", function onClick(event) {
      var toolbarToggle = event.target.closest("[data-map-quick-toggle]");
      var serviceControl = event.target.closest("[data-map-service]");
      var serviceClose = event.target.closest("[data-map-service-close]");
      var weatherOpen = event.target.closest("[data-weather-panel-open]");
      var weatherClose = event.target.closest("[data-weather-panel-close]");
      var weatherActivate = event.target.closest("[data-weather-activate]");

      if (toolbarToggle) {
        event.preventDefault();
        event.stopPropagation();
        toggleToolbar();
        return;
      }

      if (serviceControl) {
        event.preventDefault();
        event.stopPropagation();
        openServicePicker(serviceControl.getAttribute("data-map-service"));
        return;
      }

      if (serviceClose) {
        event.preventDefault();
        event.stopPropagation();
        closeServicePicker();
        return;
      }

      if (weatherOpen) {
        event.preventDefault();
        event.stopPropagation();
        closeServicePicker();
        setWeatherPanelOpen(true);
        return;
      }

      if (weatherClose) {
        event.preventDefault();
        event.stopPropagation();
        setWeatherPanelOpen(false);
        return;
      }

      if (weatherActivate) {
        event.preventDefault();
        event.stopPropagation();
        activatePreview();
      }
    }, false);

    document.addEventListener("change", function onChange(event) {
      var clusterCheckbox = event.target.closest(".map-service-cluster__checkbox[data-map-cluster]");

      if (!clusterCheckbox) {
        return;
      }

      event.stopPropagation();
      setClusterSelected(
        clusterCheckbox.getAttribute("data-map-service-id"),
        clusterCheckbox.getAttribute("data-map-cluster"),
        clusterCheckbox.checked
      );
    });

    document.addEventListener("keydown", function onKeyDown(event) {
      if (event.key === "Escape") {
        closeServicePicker();
        setWeatherPanelOpen(false);
      }
    });
  }

  function init() {
    qsa("[data-weather-panel-open]").forEach(function initWeatherButton(button) {
      button.setAttribute("aria-expanded", "false");
    });

    qsa("[data-map-service]").forEach(function initServiceButton(button) {
      button.setAttribute("aria-expanded", "false");
    });

    setToolbarCollapsed(readToolbarCollapsed(), false);
    renderWeatherPlaceholder("Tap Activate preview.");
    wireControls();

    window.FieldOpsOSMWeatherMenu = {
      VERSION: VERSION,
      version: VERSION,
      open: function open() {
        setWeatherPanelOpen(true);
      },
      close: function close() {
        setWeatherPanelOpen(false);
      },
      activate: activatePreview,
      openService: openServicePicker,
      closeService: closeServicePicker,
      filterService: applyServiceFilter,
      focusCluster: focusClusterOnMap,
      focusClusters: focusClustersOnMap,
      clearRfOverlay: clearRfOverlay,
      collapseTools: function collapseTools() {
        setToolbarCollapsed(true);
      },
      expandTools: function expandTools() {
        setToolbarCollapsed(false);
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* Destination: FieldOpsAtlas/Features/maps/OSMweather-menu.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMweather-menu.js | bottom/end of file */
