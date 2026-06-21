/* ==========================================================================
   FieldOps Atlas OSM maps
   File: FieldOpsAtlas/Features/maps/OSMmaps.js
   Version: 1.1.11-hide-attached-feed-during-zoom
   Purpose:
   - Own the Leaflet map, regions, sites, service clusters, RF paths, labels, and fitting.
   - Keep service-menu opening fast by returning cached cluster metadata without rerendering.
   - Render or clear map clusters only after the cluster selection changes.
   - Delegate all panel and button presentation to OSMpanes.js.
   - Delegate weather requests and parsing to OSMweather-menu.js.
   - Use FieldOpsEditor from the shared shell for online GitHub writes.
   ========================================================================== */

(function fieldOpsOSMMaps() {
  "use strict";

  var VERSION = "1.1.11-hide-attached-feed-during-zoom";
  var REGION_TOAST_MS = 3000;
  var UK_BOUNDS = [[49.75, -8.7], [60.95, 1.95]];
  var UK_CENTER = [54.55, -3.15];
  var REGION_STORAGE_KEY = "fieldops-osmmaps-selected-region-v1";
  var ATTACHED_INPUT_OFFSET_PX = 84;
  var ATTACHED_SITE_RADIUS_PX = 12;
  var ATTACHED_INPUT_RADIUS_PX = 17;
  var INPUT_ICON_URLS = {
    satellite: "../../../data/icons/satellite-dish.svg?v=1.5.7-large-rx-farther-right",
    fibre: "../../../data/icons/ethernet-fibre.svg?v=1.0.5"
  };
  var DATA_FILES = {
    regions: "../../../data/regions.json",
    regionWalks: function regionWalks(regionId) {
      return "../../../data/regions/" + encodeURIComponent(regionId) + "-sites.json";
    },
    regionPath: function regionPath(regionId) {
      return "data/regions/" + encodeURIComponent(regionId) + "-sites.json";
    },
    recyclePath: function recyclePath(regionId) {
      return "data/recycle-bin/" + encodeURIComponent(regionId) + "-sites-recycle.json";
    }
  };
  var DETAIL_FILES = {
    dtt: {
      wenvoe: "../../../data/rf/wenvoe/dtt-details.json"
    },
    dab: {},
    fm: {}
  };
  var SERVICE_STYLES = {
    dtt: {
      line: "#16a34a",
      selected: "#86efac"
    },
    dab: {
      line: "#1686d9",
      selected: "#7dd3fc"
    },
    fm: {
      line: "#a23bb7",
      selected: "#e879f9"
    }
  };
  var STORAGE_KEYS = {
    region: REGION_STORAGE_KEY,
    theme: "fieldops-osmmaps-theme-v1",
    localPrefix: "fieldops-osmmaps-local-region-",
    recyclePrefix: "fieldops-osmmaps-local-recycle-"
  };

  var state = {
    map: null,
    markerLayer: null,
    regions: [],
    walks: [],
    visibleWalkIds: null,
    selectedRegionId: "",
    selectedWalkId: "",
    selectedClusters: new Map(),
    regionCache: new Map(),
    detailCache: new Map(),
    markerRefs: new Map(),
    theme: "dark",
    paneHideTimer: 0,
    fitSettleTimer: 0,
    panesBound: false,
    rf: {
      lineLayer: null,
      endpointLayer: null,
      virtualLayer: null,
      siteLabelLayer: null,
      pathLabelLayer: null,
      activeCluster: null,
      activeWalks: [],
      activePaths: [],
      siteDetails: new Map(),
      pathLines: new Map(),
      virtualEndpoints: new Map(),
      virtualMarkers: new Map(),
      attachedInputs: new Map(),
      overlayFrame: 0,
      selectedPathId: "",
      serviceId: "",
      regionId: "",
      redrawTimer: 0,
      stagedTimers: [],
      mapEventsBound: false
    }
  };

  function panes() {
    return window.FieldOpsOSMpanes || null;
  }

  function weatherData() {
    return window.FieldOpsOSMWeatherMenu || null;
  }

  function editor() {
    return window.FieldOpsEditor || null;
  }

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

  function asStringList(value) {
    if (Array.isArray(value)) {
      return value.map(function mapItem(item) {
        if (typeof item === "string") {
          return item.trim();
        }

        if (item && typeof item === "object") {
          return String(item.name || item.label || item.title || item.service || item.id || "").trim();
        }

        return "";
      }).filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      return value.split(/[,;\n]/).map(function splitLine(line) {
        return line.trim();
      }).filter(Boolean);
    }

    return [];
  }

  function numberFrom(value) {
    var number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function cssColor(value, fallback) {
    var candidate = String(value || "").trim();
    return candidate || fallback;
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
      window.localStorage.setItem(key, String(value == null ? "" : value));
    } catch (error) {
      // Storage can be unavailable in previews and webviews.
    }
  }

  function safeLocalJson(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function localRegionKey(regionId) {
    return STORAGE_KEYS.localPrefix + regionId;
  }

  function localRecycleKey(regionId) {
    return STORAGE_KEYS.recyclePrefix + regionId;
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
      notes: String(rawRegion.notes || rawRegion.description || ""),
      serviceClusters: rawRegion.serviceClusters && typeof rawRegion.serviceClusters === "object"
        ? rawRegion.serviceClusters
        : {}
    };
  }

  function normaliseWalkthrough(rawWalkthrough) {
    if (!rawWalkthrough || typeof rawWalkthrough !== "object") {
      return {
        type: "",
        url: "",
        notes: ""
      };
    }

    return {
      type: String(rawWalkthrough.type || ""),
      url: String(rawWalkthrough.url || rawWalkthrough.href || ""),
      notes: String(rawWalkthrough.notes || rawWalkthrough.description || "")
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
      description: String(rawWalk.description || ""),
      notes: String(rawWalk.notes || rawWalk.note || ""),
      siteType: String(rawWalk.siteType || rawWalk.type || "Walk"),
      status: String(rawWalk.status || "demo"),
      regionId: String(rawWalk.regionId || rawWalk.region || fallbackRegionId || ""),
      lat: lat,
      lng: lng,
      gridRef: String(rawWalk.gridRef || rawWalk.grid || ""),
      what3words: String(rawWalk.what3words || rawWalk.w3w || ""),
      accessNotes: String(rawWalk.accessInfo || rawWalk.accessNotes || rawWalk.access || ""),
      address: String(rawWalk.address || ""),
      services: asStringList(rawWalk.services),
      alerts: asStringList(rawWalk.alerts || rawWalk.warnings),
      inputs: asStringList(rawWalk.inputs),
      equipment: asStringList(rawWalk.equipment),
      walkthrough: normaliseWalkthrough(rawWalk.walkthrough)
    };
  }

  function serialiseWalk(walk) {
    return {
      id: walk.id,
      name: walk.name,
      description: walk.description || "",
      siteType: walk.siteType || "Walk",
      status: walk.status || "demo",
      regionId: walk.regionId || state.selectedRegionId,
      lat: Number(walk.lat),
      lng: Number(walk.lng),
      what3words: walk.what3words || "",
      accessNotes: walk.accessNotes || "",
      address: walk.address || "",
      gridRef: walk.gridRef || "",
      services: asStringList(walk.services),
      inputs: asStringList(walk.inputs),
      equipment: asStringList(walk.equipment),
      walkthrough: normaliseWalkthrough(walk.walkthrough),
      alerts: asStringList(walk.alerts),
      notes: walk.notes || ""
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

  function selectedPanel() {
    return qs("[data-selected-panel]");
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

  function loadJson(url, fallback) {
    return fetch(url + "?v=" + Date.now(), {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    }).then(function handleResponse(response) {
      if (!response.ok) {
        if (response.status === 404) {
          return fallback;
        }

        throw new Error("Could not load " + url + " (" + response.status + ")");
      }

      return response.json();
    });
  }

  function setTheme(theme) {
    var page = qs("[data-osmmaps-page]");
    var nextTheme = theme === "light" ? "light" : "dark";

    state.theme = nextTheme;

    if (page) {
      page.setAttribute("data-theme", nextTheme);
    }

    safeLocalSet(STORAGE_KEYS.theme, nextTheme);
  }

  function initialTheme() {
    var stored = safeLocalGet(STORAGE_KEYS.theme);

    if (stored === "light" || stored === "dark") {
      return stored;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }

    return "dark";
  }

  function setOverlayOpen(open) {
    var overlay = qs("[data-region-overlay]");
    if (overlay) {
      overlay.hidden = !open;
    }
  }

  function openRegionOverlay() {
    setOverlayOpen(true);
  }

  function closeRegionOverlay() {
    setOverlayOpen(false);
  }

  function clearPaneTimer() {
    if (state.paneHideTimer) {
      window.clearTimeout(state.paneHideTimer);
      state.paneHideTimer = 0;
    }
  }

  function schedulePaneHide() {
    clearPaneTimer();
    state.paneHideTimer = window.setTimeout(function hideToast() {
      var paneRenderer = panes();

      if (paneRenderer && !state.selectedWalkId) {
        paneRenderer.hide(selectedPanel());
      }
    }, REGION_TOAST_MS);
  }

  function showMapError(message) {
    var panel = selectedPanel();

    if (panel) {
      clearPaneTimer();
      panel.hidden = false;
      panel.innerHTML = '<p class="osmpanes-empty">' + escapeHtml(message) + '</p>';
    }
  }

  function makeMarkerIcon(region) {
    var activePathColor = state.rf.serviceId
      ? serviceStyle(state.rf.serviceId).line
      : "transparent";

    return window.L.divIcon({
      className: "osmmaps-pin-shell",
      html: [
        '<span class="osmmaps-pin" style="--pin-color:',
        escapeHtml(region.color),
        ';--pin-path-color:',
        escapeHtml(activePathColor),
        '"></span>'
      ].join(""),
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10]
    });
  }

  function visibleWalks() {
    if (!state.visibleWalkIds) {
      return state.walks.slice();
    }

    return state.walks.filter(function visibleWalk(walk) {
      return state.visibleWalkIds.has(String(walk.id));
    });
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

    visibleWalks().forEach(function addWalkMarker(walk) {
      var marker = window.L.marker([walk.lat, walk.lng], {
        icon: makeMarkerIcon(region),
        title: walk.name,
        keyboard: true
      });

      marker.bindPopup(panes() ? panes().popupHtml(walk) : escapeHtml(walk.name));
      marker.on("click", function onMarkerClick() {
        selectWalk(walk.id, true, false);
      });

      marker.addTo(state.markerLayer);
      state.markerRefs.set(walk.id, marker);
    });
  }

  function elementVisible(element) {
    if (!element || element.hidden) {
      return false;
    }

    var style = window.getComputedStyle ? window.getComputedStyle(element) : null;
    var rect = element.getBoundingClientRect();

    return (!style || (style.display !== "none" && style.visibility !== "hidden")) &&
      rect.width > 0 &&
      rect.height > 0;
  }

  function fitInsets() {
    var mapRect = state.map.getContainer().getBoundingClientRect();
    var side = 12;
    var top = 18;
    var bottom = 18;

    qsa(".top-shell, [data-map-quick-tools]").forEach(function topElement(element) {
      if (!elementVisible(element)) {
        return;
      }

      var rect = element.getBoundingClientRect();

      if (rect.bottom > mapRect.top && rect.top < mapRect.bottom) {
        top = Math.max(top, rect.bottom - mapRect.top + 8);
      }
    });

    qsa(".bottom-shell, [data-selected-panel]:not([hidden])").forEach(function bottomElement(element) {
      if (!elementVisible(element)) {
        return;
      }

      var rect = element.getBoundingClientRect();

      if (rect.bottom > mapRect.top && rect.top < mapRect.bottom) {
        bottom = Math.max(bottom, mapRect.bottom - rect.top + 8);
      }
    });

    return {
      side: side,
      top: Math.min(top, mapRect.height * 0.30),
      bottom: Math.min(bottom, mapRect.height * 0.30)
    };
  }

  function exactFitZoom(bounds, insets, maxZoom) {
    var size = state.map.getSize();
    var northWest = state.map.project(bounds.getNorthWest(), 0);
    var southEast = state.map.project(bounds.getSouthEast(), 0);
    var spanX = Math.max(1 / 256, Math.abs(southEast.x - northWest.x));
    var spanY = Math.max(1 / 256, Math.abs(southEast.y - northWest.y));
    var usableWidth = Math.max(80, size.x - insets.side * 2);
    var usableHeight = Math.max(80, size.y - insets.top - insets.bottom);
    var widthZoom = Math.log(usableWidth / spanX) / Math.LN2;
    var heightZoom = Math.log(usableHeight / spanY) / Math.LN2;
    var target = Math.min(
      widthZoom,
      heightZoom,
      Number(maxZoom || 12),
      state.map.getMaxZoom()
    );

    target = Math.max(state.map.getMinZoom(), target);

    /*
     * Round down to a twentieth of a zoom level so the outermost sites remain
     * fully inside the viewport without the large gaps caused by whole levels.
     */
    return Math.floor(target * 20) / 20;
  }

  function exactFitCenter(bounds, zoom, insets) {
    var size = state.map.getSize();
    var usableHeight = Math.max(80, size.y - insets.top - insets.bottom);
    var desiredScreenY = insets.top + usableHeight / 2 - 18;
    var boundsCenterPoint = state.map.project(bounds.getCenter(), zoom);
    var mapCenterPoint = boundsCenterPoint.add(window.L.point(
      0,
      size.y / 2 - desiredScreenY
    ));

    return state.map.unproject(mapCenterPoint, zoom);
  }

  function fitPoints(points, maxZoom, animate) {
    if (!state.map || !window.L || !points || !points.length) {
      return;
    }

    var validPoints = points.filter(function validPoint(point) {
      return point &&
        Number.isFinite(Number(point.lat)) &&
        Number.isFinite(Number(point.lng));
    });

    if (!validPoints.length) {
      return;
    }

    var applyFit = function applyFit() {
      var insets = fitInsets();
      var bounds = window.L.latLngBounds(validPoints.map(function pointLatLng(point) {
        return [Number(point.lat), Number(point.lng)];
      }));
      var targetZoom = validPoints.length === 1
        ? Number(maxZoom || 12)
        : exactFitZoom(bounds, insets, maxZoom);
      var targetCenter = exactFitCenter(bounds, targetZoom, insets);

      state.map.stop();
      state.map.invalidateSize({
        pan: false,
        debounceMoveend: true
      });
      state.map.setView(targetCenter, targetZoom, {
        animate: Boolean(animate)
      });
    };

    applyFit();

    /*
     * Run once more after the shell and mobile safe-area layout has settled.
     * This prevents the marker group sitting low when the top/bottom shell
     * finishes sizing after Leaflet's first render.
     */
    if (state.fitSettleTimer) {
      window.clearTimeout(state.fitSettleTimer);
    }

    state.fitSettleTimer = window.setTimeout(function settledFit() {
      state.fitSettleTimer = 0;
      applyFit();
    }, 180);
  }

  function fitVisible() {
    fitPoints(visibleWalks(), 12, true);
  }

  function renderRegions() {
    var list = qs("[data-region-list]");

    if (!list) {
      return;
    }

    if (!state.regions.length) {
      list.innerHTML = '<p class="osmpanes-empty">No regions found.</p>';
      return;
    }

    list.innerHTML = state.regions.map(function regionButton(region) {
      var isSelected = region.id === state.selectedRegionId;

      return [
        '<button class="osmmaps-region-button" type="button" data-region-id="',
        escapeHtml(region.id),
        '" aria-pressed="',
        String(isSelected),
        '" style="--region-color:',
        escapeHtml(region.color),
        '">',
        '<span class="osmmaps-region-dot" aria-hidden="true"></span>',
        '<span class="osmmaps-region-name">', escapeHtml(region.name), '</span>',
        isSelected ? '<span class="osmmaps-region-count">' + state.walks.length + '</span>' : "",
        '</button>'
      ].join("");
    }).join("");
  }

  function renderRegionToast() {
    var region = selectedRegion();
    var paneRenderer = panes();

    if (!region || !paneRenderer) {
      return;
    }

    paneRenderer.renderRegionToast(selectedPanel(), region, state.walks.length);
    schedulePaneHide();
  }

  function renderCollapsedPane(walk) {
    if (!panes()) {
      return;
    }

    clearPaneTimer();
    panes().renderCollapsed(selectedPanel(), walk);
  }

  function renderFullDetailsPane(walk) {
    if (!panes()) {
      return;
    }

    clearPaneTimer();
    panes().renderDetails(selectedPanel(), walk, selectedRegion(), {
      walkCount: state.walks.length
    });
  }

  function renderEditPane(walk, message) {
    if (!panes()) {
      return;
    }

    clearPaneTimer();
    panes().renderEdit(selectedPanel(), walk, selectedRegion(), message || editStatusText());
  }

  function closeDetailsPane() {
    clearPaneTimer();
    state.selectedWalkId = "";

    if (panes()) {
      panes().hide(selectedPanel());
    }
  }

  function selectWalk(walkId, openPopup, expandDetails) {
    var walk = state.walks.find(function findWalk(walkItem) {
      return walkItem.id === walkId;
    });

    if (!walk) {
      return;
    }

    state.selectedWalkId = walk.id;

    if (expandDetails) {
      renderFullDetailsPane(walk);
    } else {
      renderCollapsedPane(walk);
    }

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

  function applyLocalOverride(regionId, walks) {
    var local = safeLocalJson(localRegionKey(regionId), null);

    if (!Array.isArray(local)) {
      return walks;
    }

    return local.map(function normaliseLocal(rawWalk) {
      return normaliseWalk(rawWalk, regionId);
    }).filter(Boolean).filter(isInsideUkBounds);
  }

  function loadRegionWalks(regionId) {
    if (state.regionCache.has(regionId)) {
      return Promise.resolve(state.regionCache.get(regionId));
    }

    return loadJson(DATA_FILES.regionWalks(regionId), []).then(function handlePayload(payload) {
      var rawWalks = asArray(payload, "walks");

      if (!rawWalks.length) {
        rawWalks = asArray(payload, "sites");
      }

      var walks = rawWalks.map(function mapWalk(rawWalk) {
        return normaliseWalk(rawWalk, regionId);
      }).filter(Boolean).filter(isInsideUkBounds);

      walks = applyLocalOverride(regionId, walks);
      state.regionCache.set(regionId, walks);
      return walks;
    });
  }

  function clearMarkers() {
    state.walks = [];
    state.visibleWalkIds = null;
    state.selectedWalkId = "";
    state.markerRefs.clear();

    if (state.markerLayer) {
      state.markerLayer.clearLayers();
    }
  }

  function selectRegion(regionId) {
    if (!regionId) {
      return Promise.resolve();
    }

    state.selectedRegionId = regionId;
    state.selectedClusters.clear();
    safeLocalSet(STORAGE_KEYS.region, regionId);
    clearPaneTimer();
    clearRfOverlay();
    clearMarkers();
    renderRegions();
    closeRegionOverlay();

    return loadRegionWalks(regionId)
      .then(function handleWalks(walks) {
        state.walks = walks;
        state.visibleWalkIds = null;
        renderMarkers();
        renderRegions();
        renderRegionToast();
        fitVisible();
        registerSearch();
      })
      .catch(function handleError(error) {
        showMapError(error.message || "Region could not load.");
      });
  }

  function loadRegions() {
    return loadJson(DATA_FILES.regions, []).then(function handleRegions(payload) {
      var storedRegion = safeLocalGet(STORAGE_KEYS.region);

      state.regions = asArray(payload, "regions").map(normaliseRegion).filter(Boolean);
      renderRegions();

      if (storedRegion && state.regions.some(function hasStored(region) {
        return region.id === storedRegion;
      })) {
        return selectRegion(storedRegion);
      }

      if (panes()) {
        panes().hide(selectedPanel());
      }

      openRegionOverlay();
      return Promise.resolve();
    });
  }

  function walkHasService(walk, serviceId) {
    var wanted = String(serviceId || "").toLowerCase();

    return asStringList(walk && walk.services).some(function matchingService(service) {
      return String(service || "").toLowerCase() === wanted;
    });
  }

  function clustersForService(serviceId) {
    var region = selectedRegion();
    var serviceClusters = region && region.serviceClusters;
    var clusters = serviceClusters && Array.isArray(serviceClusters[serviceId])
      ? serviceClusters[serviceId]
      : [];

    return clusters.filter(function validCluster(cluster) {
      return cluster &&
        cluster.id &&
        cluster.name &&
        Array.isArray(cluster.siteIds) &&
        cluster.siteIds.length;
    });
  }

  function selectedClusterSet(serviceId) {
    var key = String(serviceId || "");

    if (!state.selectedClusters.has(key)) {
      state.selectedClusters.set(key, new Set());
    }

    return state.selectedClusters.get(key);
  }

  function combineClusters(clusters) {
    var siteIds = new Set();
    var paths = new Map();
    var headSiteIds = new Set();

    clusters.forEach(function collectCluster(cluster) {
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

  function serviceMenuResult(serviceId, status, warning) {
    var serviceWalks = state.walks.filter(function serviceWalk(walk) {
      return walkHasService(walk, serviceId);
    });

    return {
      serviceId: serviceId,
      clusters: clustersForService(serviceId),
      selectedIds: Array.from(selectedClusterSet(serviceId)),
      siteCount: serviceWalks.length,
      status: status || "",
      warning: Boolean(warning)
    };
  }

  function openServiceMenu(serviceId) {
    if (!selectedRegion()) {
      return Promise.reject(new Error("Choose a map region before selecting a service."));
    }

    return Promise.resolve(serviceMenuResult(serviceId));
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

    return walk || normaliseVirtualEndpoint(path[virtualKey], siteId);
  }

  function pathsForCluster(cluster, walksById) {
    var list = cluster && Array.isArray(cluster.paths) ? cluster.paths : [];

    return list.filter(function usablePath(path) {
      return path &&
        pathEndpoint(path, "feeding", walksById) &&
        pathEndpoint(path, "receiving", walksById);
    });
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
      interactive: true,
      fieldOpsPathId: String(path.id || ""),
      fieldOpsServiceId: String(path.serviceType || "dtt"),
      fieldOpsRegionId: String(state.selectedRegionId || ""),
      fieldOpsRouteType: String(path.routeType || "primary")
    };
  }

  function ensurePane(name, zIndex) {
    var pane = state.map.getPane(name);

    if (!pane) {
      pane = state.map.createPane(name);
    }

    pane.style.zIndex = String(zIndex);
    return pane;
  }

  function setRfAttachedInputPaneVisible(visible) {
    var pane = state.map && state.map.getPane
      ? state.map.getPane("fieldopsRfAttachedInputs")
      : null;

    if (pane) {
      pane.style.visibility = visible ? "visible" : "hidden";
    }
  }

  function hideRfAttachedInputDuringZoom() {
    setRfAttachedInputPaneVisible(false);
  }

  function restoreRfAttachedInputAfterZoom() {
    if (state.rf.overlayFrame) {
      window.cancelAnimationFrame(state.rf.overlayFrame);
      state.rf.overlayFrame = 0;
    }

    state.rf.overlayFrame = window.requestAnimationFrame(function redrawAtFinalZoom() {
      state.rf.overlayFrame = 0;
      layoutRfAttachedInputs();
      scheduleRfLabelLayout();

      window.requestAnimationFrame(function revealAttachedInput() {
        setRfAttachedInputPaneVisible(true);
      });
    });
  }

  function ensureRfLayers() {
    if (!state.map || !window.L) {
      return;
    }

    ensurePane("fieldopsRfPaths", 430);
    ensurePane("fieldopsRfAttachedInputs", 440);
    ensurePane("fieldopsRfEndpoints", 625);
    ensurePane("fieldopsRfLabels", 650);
    setRfAttachedInputPaneVisible(true);

    if (!state.rf.lineLayer) {
      state.rf.lineLayer = window.L.layerGroup().addTo(state.map);
      state.rf.endpointLayer = window.L.layerGroup().addTo(state.map);
      state.rf.virtualLayer = window.L.layerGroup().addTo(state.map);
      state.rf.siteLabelLayer = window.L.layerGroup().addTo(state.map);
      state.rf.pathLabelLayer = window.L.layerGroup().addTo(state.map);
    }

    if (!state.rf.mapEventsBound) {
      ["moveend", "resize", "viewreset"].forEach(function bindOverlayLayout(eventName) {
        state.map.on(eventName, scheduleRfOverlayLayout);
      });
      state.map.on("zoomstart", hideRfAttachedInputDuringZoom);
      state.map.on("zoomend", restoreRfAttachedInputAfterZoom);
      state.rf.mapEventsBound = true;
    }
  }

  function clearRfOverlay() {
    [
      state.rf.lineLayer,
      state.rf.endpointLayer,
      state.rf.virtualLayer,
      state.rf.siteLabelLayer,
      state.rf.pathLabelLayer
    ].forEach(function clearLayer(layer) {
      if (layer) {
        layer.clearLayers();
      }
    });

    state.rf.activeCluster = null;
    state.rf.activeWalks = [];
    state.rf.activePaths = [];
    state.rf.siteDetails = new Map();
    state.rf.pathLines = new Map();
    state.rf.virtualEndpoints = new Map();
    state.rf.virtualMarkers = new Map();
    state.rf.attachedInputs = new Map();
    state.rf.selectedPathId = "";
    state.rf.serviceId = "";
    state.rf.regionId = "";

    if (state.rf.redrawTimer) {
      window.clearTimeout(state.rf.redrawTimer);
      state.rf.redrawTimer = 0;
    }

    if (state.rf.overlayFrame) {
      window.cancelAnimationFrame(state.rf.overlayFrame);
      state.rf.overlayFrame = 0;
    }

    state.rf.stagedTimers.forEach(function clearTimer(timerId) {
      window.clearTimeout(timerId);
    });
    state.rf.stagedTimers = [];
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
    var accessibleName = String(endpoint.name || endpoint.label || kind + " input");

    return window.L.divIcon({
      className: "osmmaps-rf-input-icon is-" + service + " is-" + kind,
      html: [
        '<span class="osmmaps-rf-input-node" role="img" aria-label="',
        escapeHtml(accessibleName),
        '"><img src="',
        iconUrl,
        '" alt="" aria-hidden="true"></span>'
      ].join(""),
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  }

  function attachedInputForPath(path, fromWalk, toWalk) {
    if (fromWalk && fromWalk.isVirtual && toWalk && !toWalk.isVirtual) {
      return {
        path: path,
        virtualSide: "feeding",
        virtualEndpoint: fromWalk,
        anchorWalk: toWalk
      };
    }

    if (toWalk && toWalk.isVirtual && fromWalk && !fromWalk.isVirtual) {
      return {
        path: path,
        virtualSide: "receiving",
        virtualEndpoint: toWalk,
        anchorWalk: fromWalk
      };
    }

    return null;
  }

  function attachedInputDirection(endpoint, anchorWalk) {
    var walksById = walkMap(state.walks);
    var anchorPoint = state.map.latLngToContainerPoint([anchorWalk.lat, anchorWalk.lng]);
    var directionX = 0;
    var directionY = 0;
    var connectedCount = 0;

    state.rf.activePaths.forEach(function includeConnectedPath(path) {
      var counterpart = null;

      if (String(path.feedingSiteId) === String(anchorWalk.id)) {
        counterpart = pathEndpoint(path, "receiving", walksById);
      } else if (String(path.receivingSiteId) === String(anchorWalk.id)) {
        counterpart = pathEndpoint(path, "feeding", walksById);
      }

      if (!counterpart || counterpart.isVirtual) {
        return;
      }

      var counterpartPoint = state.map.latLngToContainerPoint([
        counterpart.lat,
        counterpart.lng
      ]);
      var dx = counterpartPoint.x - anchorPoint.x;
      var dy = counterpartPoint.y - anchorPoint.y;
      var length = Math.sqrt(dx * dx + dy * dy);

      if (!Number.isFinite(length) || length < 1) {
        return;
      }

      directionX += dx / length;
      directionY += dy / length;
      connectedCount += 1;
    });

    /*
     * The dish is an incoming site-level feed, so place it on the opposite
     * side of the physical site from the other connected transmitter paths.
     */
    if (connectedCount) {
      directionX *= -1;
      directionY *= -1;
    }

    var directionLength = Math.sqrt(
      directionX * directionX + directionY * directionY
    );

    if (!Number.isFinite(directionLength) || directionLength < 0.15) {
      var configuredPoint = state.map.latLngToContainerPoint([
        endpoint.lat,
        endpoint.lng
      ]);

      directionX = configuredPoint.x - anchorPoint.x;
      directionY = configuredPoint.y - anchorPoint.y;
      directionLength = Math.sqrt(
        directionX * directionX + directionY * directionY
      );
    }

    if (!Number.isFinite(directionLength) || directionLength < 1) {
      directionX = -1;
      directionY = -0.55;
      directionLength = Math.sqrt(
        directionX * directionX + directionY * directionY
      );
    }

    return {
      x: directionX / directionLength,
      y: directionY / directionLength
    };
  }

  function attachedInputLayout(endpoint, anchorWalk) {
    var anchorPoint = state.map.latLngToContainerPoint([
      anchorWalk.lat,
      anchorWalk.lng
    ]);
    var direction = attachedInputDirection(endpoint, anchorWalk);
    var markerPoint = window.L.point(
      anchorPoint.x + direction.x * ATTACHED_INPUT_OFFSET_PX,
      anchorPoint.y + direction.y * ATTACHED_INPUT_OFFSET_PX
    );
    var lineStartPoint = window.L.point(
      anchorPoint.x + direction.x * ATTACHED_SITE_RADIUS_PX,
      anchorPoint.y + direction.y * ATTACHED_SITE_RADIUS_PX
    );
    var lineEndPoint = window.L.point(
      markerPoint.x - direction.x * ATTACHED_INPUT_RADIUS_PX,
      markerPoint.y - direction.y * ATTACHED_INPUT_RADIUS_PX
    );

    return {
      markerLatLng: state.map.containerPointToLatLng(markerPoint),
      lineStartLatLng: state.map.containerPointToLatLng(lineStartPoint),
      lineEndLatLng: state.map.containerPointToLatLng(lineEndPoint)
    };
  }

  function ensureVirtualInputMarker(displayEndpoint, serviceId, path) {
    var endpointId = String(displayEndpoint.id);
    var marker = state.rf.virtualMarkers.get(endpointId);

    if (!marker) {
      marker = window.L.marker([displayEndpoint.lat, displayEndpoint.lng], {
        pane: "fieldopsRfEndpoints",
        icon: virtualInputIcon(displayEndpoint, serviceId, path),
        interactive: false,
        keyboard: false
      }).addTo(state.rf.virtualLayer);

      state.rf.virtualMarkers.set(endpointId, marker);
    } else {
      marker.setLatLng([displayEndpoint.lat, displayEndpoint.lng]);
    }

    return marker;
  }

  function displayPathEndpoint(path, side, walksById) {
    var endpoint = pathEndpoint(path, side, walksById);
    var attached = state.rf.attachedInputs.get(String(path.id));

    if (
      endpoint &&
      endpoint.isVirtual &&
      attached &&
      attached.virtualSide === side &&
      attached.displayEndpoint
    ) {
      return attached.displayEndpoint;
    }

    return endpoint;
  }

  function updateAttachedInput(record) {
    var layout = attachedInputLayout(
      record.virtualEndpoint,
      record.anchorWalk
    );
    var displayEndpoint = record.displayEndpoint;

    displayEndpoint.lat = layout.markerLatLng.lat;
    displayEndpoint.lng = layout.markerLatLng.lng;

    if (record.marker) {
      record.marker.setLatLng(layout.markerLatLng);
    }

    if (record.line) {
      var fromLatLng = record.virtualSide === "feeding"
        ? layout.lineEndLatLng
        : layout.lineStartLatLng;
      var toLatLng = record.virtualSide === "receiving"
        ? layout.lineEndLatLng
        : layout.lineStartLatLng;

      record.line.setLatLngs([fromLatLng, toLatLng]);
    }
  }

  function layoutRfAttachedInputs() {
    state.rf.attachedInputs.forEach(function positionAttachedInput(record) {
      updateAttachedInput(record);
    });
  }

  function scheduleRfOverlayLayout() {
    if (state.rf.overlayFrame) {
      return;
    }

    state.rf.overlayFrame = window.requestAnimationFrame(function redrawOverlay() {
      state.rf.overlayFrame = 0;
      layoutRfAttachedInputs();
      scheduleRfLabelLayout();
    });
  }

  function lightweightSiteDetails(cluster, walks, paths) {
    var details = new Map();
    var headSiteId = String(cluster && cluster.headSiteId || "");

    walks.forEach(function addDetail(walk) {
      var connected = paths.filter(function connectedPath(path) {
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

  function renderRfLines(serviceId, cluster, walks) {
    var walksById = walkMap(state.walks);
    var activePaths = pathsForCluster(cluster, walksById);

    ensureRfLayers();
    clearRfOverlay();

    state.rf.activeCluster = cluster;
    state.rf.activeWalks = walks.slice();
    state.rf.activePaths = activePaths;
    state.rf.siteDetails = lightweightSiteDetails(cluster, walks, activePaths);
    state.rf.serviceId = serviceId;
    state.rf.regionId = state.selectedRegionId;

    activePaths.forEach(function addPathLine(path) {
      var fromWalk = pathEndpoint(path, "feeding", walksById);
      var toWalk = pathEndpoint(path, "receiving", walksById);
      var attached = attachedInputForPath(path, fromWalk, toWalk);
      var displayFrom = fromWalk;
      var displayTo = toWalk;
      var line;
      var style = lineStyle(path, false);

      if (attached) {
        var attachedLayout = attachedInputLayout(
          attached.virtualEndpoint,
          attached.anchorWalk
        );
        var displayEndpoint = Object.assign({}, attached.virtualEndpoint, {
          lat: attachedLayout.markerLatLng.lat,
          lng: attachedLayout.markerLatLng.lng,
          attachedToSiteId: attached.anchorWalk.id
        });

        attached.displayEndpoint = displayEndpoint;
        attached.marker = ensureVirtualInputMarker(
          displayEndpoint,
          serviceId,
          path
        );

        state.rf.virtualEndpoints.set(
          String(displayEndpoint.id),
          displayEndpoint
        );

        if (attached.virtualSide === "feeding") {
          displayFrom = displayEndpoint;
        } else {
          displayTo = displayEndpoint;
        }

        style = Object.assign({}, style, {
          pane: "fieldopsRfAttachedInputs",
          dashArray: "8 6"
        });

        /*
         * The short satellite feed is clipped to the edges of the site and
         * dish markers so the service-coloured line remains clearly visible.
         */
        line = new window.L.Polyline(
          [
            attached.virtualSide === "feeding"
              ? attachedLayout.lineEndLatLng
              : attachedLayout.lineStartLatLng,
            attached.virtualSide === "receiving"
              ? attachedLayout.lineEndLatLng
              : attachedLayout.lineStartLatLng
          ],
          style
        );
      } else {
        [fromWalk, toWalk].forEach(function addVirtualEndpoint(endpoint) {
          if (!endpoint || !endpoint.isVirtual || state.rf.virtualEndpoints.has(String(endpoint.id))) {
            return;
          }

          state.rf.virtualEndpoints.set(String(endpoint.id), endpoint);
          ensureVirtualInputMarker(endpoint, serviceId, path);
        });

        line = window.L.polyline(
          [[displayFrom.lat, displayFrom.lng], [displayTo.lat, displayTo.lng]],
          style
        );
      }

      line.on("click", function selectLine(event) {
        selectRfPath(path.id, true, event.latlng);
      });

      line.addTo(state.rf.lineLayer);
      state.rf.pathLines.set(String(path.id), line);

      if (attached) {
        attached.line = line;
        state.rf.attachedInputs.set(String(path.id), attached);
      }
    });

    layoutRfAttachedInputs();
    scheduleRfLabelLayoutStaged();
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

  function siteLabelHtml(detail, walk) {
    var services = asStringList(walk.services).length ? asStringList(walk.services) : ["dtt"];
    var badges = services.map(function serviceBadge(service) {
      var id = String(service || "").toLowerCase();
      return '<span class="is-' + escapeHtml(id) + '">' + escapeHtml(id.toUpperCase()) + '</span>';
    }).join("");
    var role = String(detail.serviceRole || "relay");
    var mux = Number(detail.multiplexCount);
    var meta = role.charAt(0).toUpperCase() + role.slice(1) +
      (Number.isFinite(mux) ? " · " + mux + " mux" : "");

    return [
      '<span class="osmmaps-rf-site-label">',
      '<span class="osmmaps-rf-site-services">', badges, '</span>',
      '<small>', escapeHtml(meta), '</small>',
      '</span>'
    ].join("");
  }

  function mapUiRects() {
    var mapRect = state.map.getContainer().getBoundingClientRect();
    var selectors = [
      "[data-map-quick-tools]",
      "[data-selected-panel]:not([hidden])",
      ".weather-api-panel:not([hidden])",
      "[data-region-overlay]:not([hidden])",
      ".leaflet-control-container .leaflet-control"
    ];
    var rects = [];

    selectors.forEach(function collectSelector(selector) {
      qsa(selector).forEach(function addRect(element) {
        if (!elementVisible(element)) {
          return;
        }

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

  function rectInsideMap(rect, margin) {
    var size = state.map.getSize();
    var edge = Number(margin || 0);

    return rect.left >= edge &&
      rect.top >= edge &&
      rect.right <= size.x - edge &&
      rect.bottom <= size.y - edge;
  }

  function markerObstacleRects(walks) {
    var endpoints = walks.slice();

    state.rf.virtualEndpoints.forEach(function addEndpoint(endpoint) {
      endpoints.push(endpoint);
    });

    return endpoints.map(function markerRect(walk) {
      var point = state.map.latLngToContainerPoint([walk.lat, walk.lng]);
      var radius = walk.isVirtual ? 15 : 14;

      return {
        left: point.x - radius,
        top: point.y - radius,
        right: point.x + radius,
        bottom: point.y + radius
      };
    });
  }

  function placePathLabels(obstacles) {
    var walksById = walkMap(state.walks);

    state.rf.activePaths.forEach(function addPathLabel(path) {
      var fromWalk = displayPathEndpoint(path, "feeding", walksById);
      var toWalk = displayPathEndpoint(path, "receiving", walksById);

      if (!fromWalk || !toWalk) {
        return;
      }

      var fromPoint = state.map.latLngToContainerPoint([fromWalk.lat, fromWalk.lng]);
      var toPoint = state.map.latLngToContainerPoint([toWalk.lat, toWalk.lng]);
      var centreX = (fromPoint.x + toPoint.x) / 2;
      var centreY = (fromPoint.y + toPoint.y) / 2;
      var backup = String(path.routeType || "primary").toLowerCase() !== "primary";
      var width = backup ? 48 : 42;
      var height = backup ? 46 : 36;
      var offsets = [0, 10, -10, 20, -20];
      var placement = null;

      offsets.some(function findPlacement(offset) {
        var rect = {
          left: centreX - width / 2,
          top: centreY + offset - height / 2,
          right: centreX + width / 2,
          bottom: centreY + offset + height / 2
        };

        if (rectInsideMap(rect, 5) && !rectOverlaps(rect, obstacles, 2)) {
          placement = {
            rect: rect,
            centreX: centreX,
            centreY: centreY + offset
          };
          return true;
        }

        return false;
      });

      if (!placement) {
        return;
      }

      var service = String(path.serviceType || "dtt").toLowerCase();
      var selected = String(path.id) === state.rf.selectedPathId;
      var icon = window.L.divIcon({
        className: "osmmaps-rf-path-label-icon is-" + service +
          (backup ? " is-backup" : "") +
          (selected ? " is-selected" : ""),
        html: pathLabelHtml(path),
        iconSize: [width, height],
        iconAnchor: [width / 2, height / 2]
      });

      window.L.marker(
        state.map.containerPointToLatLng([placement.centreX, placement.centreY]),
        {
          pane: "fieldopsRfLabels",
          icon: icon,
          interactive: false,
          keyboard: false
        }
      ).addTo(state.rf.pathLabelLayer);

      obstacles.push(placement.rect);
    });
  }

  function placeSiteLabels(obstacles) {
    var selectedEndpoints = new Set();
    var selectedPath = state.rf.activePaths.find(function findSelected(path) {
      return String(path.id) === String(state.rf.selectedPathId);
    });

    if (selectedPath) {
      selectedEndpoints.add(String(selectedPath.feedingSiteId));
      selectedEndpoints.add(String(selectedPath.receivingSiteId));
    }

    var headId = String(state.rf.activeCluster && state.rf.activeCluster.headSiteId || "");
    var ordered = state.rf.activeWalks.slice().sort(function labelPriority(a, b) {
      function priority(walk) {
        if (selectedEndpoints.has(String(walk.id))) {
          return 0;
        }
        if (String(walk.id) === headId) {
          return 1;
        }
        return 2;
      }

      return priority(a) - priority(b);
    });

    ordered.forEach(function addSiteLabel(walk) {
      var detail = state.rf.siteDetails.get(String(walk.id));

      if (!detail) {
        return;
      }

      var point = state.map.latLngToContainerPoint([walk.lat, walk.lng]);
      var width = 96;
      var height = 40;
      var candidates = [
        { name: "top-right", left: point.x + 15, top: point.y - height - 14 },
        { name: "top-left", left: point.x - width - 15, top: point.y - height - 14 },
        { name: "bottom-right", left: point.x + 15, top: point.y + 14 },
        { name: "bottom-left", left: point.x - width - 15, top: point.y + 14 }
      ];
      var placement = candidates.find(function clearCandidate(candidate) {
        candidate.rect = {
          left: candidate.left,
          top: candidate.top,
          right: candidate.left + width,
          bottom: candidate.top + height
        };

        return rectInsideMap(candidate.rect, 5) &&
          !rectOverlaps(candidate.rect, obstacles, 4);
      });

      if (!placement) {
        return;
      }

      var icon = window.L.divIcon({
        className: "osmmaps-rf-site-label-icon is-" + placement.name +
          (selectedEndpoints.has(String(walk.id)) ? " is-selected" : ""),
        html: siteLabelHtml(detail, walk),
        iconSize: [width, height],
        iconAnchor: [
          point.x - placement.left,
          point.y - placement.top
        ]
      });

      window.L.marker([walk.lat, walk.lng], {
        pane: "fieldopsRfLabels",
        icon: icon,
        interactive: false,
        keyboard: false
      }).addTo(state.rf.siteLabelLayer);

      obstacles.push(placement.rect);
    });
  }

  function layoutRfLabels() {
    if (
      !state.map ||
      !state.rf.activeCluster ||
      !state.rf.siteLabelLayer ||
      !state.rf.pathLabelLayer
    ) {
      return;
    }

    state.rf.siteLabelLayer.clearLayers();
    state.rf.pathLabelLayer.clearLayers();

    var obstacles = mapUiRects().concat(markerObstacleRects(state.rf.activeWalks));
    placePathLabels(obstacles);
    placeSiteLabels(obstacles);
  }

  function scheduleRfLabelLayout() {
    if (state.rf.redrawTimer) {
      window.clearTimeout(state.rf.redrawTimer);
    }

    state.rf.redrawTimer = window.setTimeout(function redrawLabels() {
      state.rf.redrawTimer = 0;
      layoutRfLabels();
    }, 48);
  }

  function scheduleRfLabelLayoutStaged() {
    scheduleRfLabelLayout();

    window.requestAnimationFrame(function firstFrame() {
      window.requestAnimationFrame(scheduleRfLabelLayout);
    });

    state.rf.stagedTimers.forEach(function clearTimer(timerId) {
      window.clearTimeout(timerId);
    });

    state.rf.stagedTimers = [90, 220, 480].map(function staged(delay) {
      return window.setTimeout(scheduleRfLabelLayout, delay);
    });
  }

  function detailUrlFor(serviceId, regionId) {
    var service = DETAIL_FILES[serviceId] || {};
    return String(service[regionId] || "");
  }

  function loadDetailData(serviceId, regionId) {
    var url = detailUrlFor(serviceId, regionId);
    var key = String(regionId || "") + ":" + String(serviceId || "");

    if (!url) {
      return Promise.reject(new Error("Detailed path data is not available for this region."));
    }

    if (state.detailCache.has(key)) {
      return state.detailCache.get(key);
    }

    var request = loadJson(url, null).catch(function clearFailure(error) {
      state.detailCache.delete(key);
      throw error;
    });

    state.detailCache.set(key, request);
    return request;
  }

  function titleCase(value) {
    var text = String(value || "").replace(/[-_]+/g, " ").trim();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  }

  function pathCardHtml(path, walksById) {
    var fromWalk = pathEndpoint(path, "feeding", walksById);
    var toWalk = pathEndpoint(path, "receiving", walksById);

    return [
      '<article class="osmmaps-rf-path-card">',
      '<header>',
      '<small>', escapeHtml(String(path.serviceType || "dtt").toUpperCase()), ' · ',
      escapeHtml(titleCase(path.routeType || "primary")), '</small>',
      '<strong>', escapeHtml(fromWalk.name), ' → ', escapeHtml(toWalk.name), '</strong>',
      '</header>',
      '<dl>',
      '<div><dt>Multiplexes</dt><dd>', escapeHtml(path.bundleCount || "—"), '</dd></div>',
      '<div><dt>Feed method</dt><dd>', escapeHtml(titleCase(path.feedMethod || "terrestrial")), '</dd></div>',
      '<div><dt>Confidence</dt><dd>', escapeHtml(titleCase(path.confidence || "")), '</dd></div>',
      '</dl>',
      path.notes ? '<p>' + escapeHtml(path.notes) + '</p>' : "",
      '</article>'
    ].join("");
  }

  function selectRfPath(pathId, openPopup, latlng) {
    var selectedPath = state.rf.activePaths.find(function findPath(path) {
      return String(path.id) === String(pathId);
    });
    var walksById = walkMap(state.walks);
    var detailPopup = null;

    if (!selectedPath || !state.map) {
      return;
    }

    state.rf.selectedPathId = String(selectedPath.id);
    state.rf.endpointLayer.clearLayers();

    state.rf.pathLines.forEach(function syncStyle(line, id) {
      var path = state.rf.activePaths.find(function findPath(item) {
        return String(item.id) === String(id);
      });

      if (path) {
        line.setStyle(lineStyle(path, String(id) === state.rf.selectedPathId));
      }
    });

    ["feeding", "receiving"].forEach(function addEndpoint(side, index) {
      var endpoint = displayPathEndpoint(selectedPath, side, walksById);

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
      }).addTo(state.rf.endpointLayer);
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
        .setLatLng(latlng || state.map.getCenter())
        .setContent(
          '<article class="osmmaps-rf-path-card is-loading">' +
          '<header><small>Path details</small><strong>Loading…</strong></header></article>'
        )
        .openOn(state.map);
    }

    loadDetailData(state.rf.serviceId, state.rf.regionId)
      .then(function showDetails(payload) {
        if (!detailPopup || state.rf.selectedPathId !== String(pathId)) {
          return;
        }

        var detailed = payload && Array.isArray(payload.paths)
          ? payload.paths.find(function findDetailed(path) {
              return String(path.id || "") === String(selectedPath.id || "");
            })
          : null;

        detailPopup.setContent(pathCardHtml(detailed || selectedPath, walksById));
        detailPopup.update();
      })
      .catch(function fallbackDetails() {
        if (detailPopup && state.rf.selectedPathId === String(pathId)) {
          detailPopup.setContent(pathCardHtml(selectedPath, walksById));
          detailPopup.update();
        }
      });
  }

  function focusClusters(serviceId, clusterIds) {
    var ids = new Set((clusterIds || []).map(String));
    var selected = selectedClusterSet(serviceId);

    selected.clear();
    ids.forEach(function addId(id) {
      selected.add(id);
    });

    if (!selected.size) {
      clearRfOverlay();
      state.visibleWalkIds = null;
      renderMarkers();
      fitVisible();

      return Promise.resolve(serviceMenuResult(
        serviceId,
        "No clusters selected. Region sites restored.",
        false
      ));
    }

    var clusters = clustersForService(serviceId).filter(function selectedCluster(cluster) {
      return selected.has(String(cluster.id));
    });

    if (!clusters.length) {
      return Promise.reject(new Error("The selected clusters were not found."));
    }

    var combined = combineClusters(clusters);
    var serviceIds = new Set(
      state.walks.filter(function serviceWalk(walk) {
        return walkHasService(walk, serviceId);
      }).map(function walkId(walk) {
        return String(walk.id);
      })
    );
    var memberIds = new Set(combined.siteIds.map(String).filter(function validMember(siteId) {
      return serviceIds.has(siteId);
    }));
    var walksById = walkMap(state.walks);
    var paths = pathsForCluster(combined, walksById);

    paths.forEach(function includeEndpoints(path) {
      if (walksById.has(String(path.feedingSiteId))) {
        memberIds.add(String(path.feedingSiteId));
      }
      if (walksById.has(String(path.receivingSiteId))) {
        memberIds.add(String(path.receivingSiteId));
      }
    });

    state.visibleWalkIds = memberIds;

    /*
     * The node fill always comes directly from data/regions.json.
     * The active service colour is used only for the outer path ring.
     */
    state.rf.serviceId = serviceId;
    renderMarkers();

    var visible = visibleWalks();
    renderRfLines(serviceId, combined, visible);

    /*
     * Include the visible sites and the rendered virtual satellite/fibre
     * endpoints so the full cluster path spread stays in view.
     */
    var fitList = visible.slice();
    state.rf.virtualEndpoints.forEach(function addVirtual(endpoint) {
      fitList.push(endpoint);
    });

    fitPoints(fitList, 12, false);

    var warning = clusters.length > 1;
    var status = warning
      ? "Warning: " + clusters.length + " clusters and " + paths.length +
        " paths are being rendered. Some labels may be hidden."
      : clusters[0].name + " rendered with " + paths.length + " paths.";

    window.dispatchEvent(new CustomEvent("fieldops:map-service-cluster-selected", {
      detail: {
        version: VERSION,
        regionId: state.selectedRegionId,
        serviceType: serviceId,
        clusterIds: clusters.map(function clusterId(cluster) {
          return cluster.id;
        }),
        clusterCount: clusters.length,
        siteCount: memberIds.size,
        pathCount: paths.length
      }
    }));

    return Promise.resolve(serviceMenuResult(serviceId, status, warning));
  }

  function registerSearch() {
    if (!window.FieldOpsSearch || !window.FieldOpsSearch.registerPage) {
      return;
    }

    window.FieldOpsSearch.registerPage({
      page: "map",
      label: "Maps",
      placeholder: "Search Map...",
      emptyText: "No loaded walks match that search.",
      items: state.walks.map(function searchItem(walk) {
        return {
          id: walk.id,
          title: walk.name,
          subtitle: selectedRegion() ? selectedRegion().name : "",
          href: "#",
          keywords: [walk.siteType, walk.status, walk.gridRef, walk.what3words].filter(Boolean)
        };
      })
    });
  }

  function editStatusText() {
    if (editor() && editor().isOnline && editor().isOnline()) {
      return "Editing online. Save writes the region file to GitHub.";
    }

    return "Editing locally. Save stores a local override on this device.";
  }

  function parseLines(value) {
    return String(value || "").split(/\n|,/).map(function clean(line) {
      return line.trim();
    }).filter(Boolean);
  }

  function formValue(form, name) {
    var field = form.elements[name];
    return field ? String(field.value || "").trim() : "";
  }

  function walkFromForm(form) {
    var existing = selectedWalk() || {};
    var lat = Number(formValue(form, "lat"));
    var lng = Number(formValue(form, "lng"));

    return serialiseWalk(Object.assign({}, existing, {
      name: formValue(form, "name") || existing.name,
      siteType: formValue(form, "siteType") || "Walk",
      status: formValue(form, "status") || "demo",
      lat: Number.isFinite(lat) ? lat : existing.lat,
      lng: Number.isFinite(lng) ? lng : existing.lng,
      what3words: formValue(form, "what3words"),
      gridRef: formValue(form, "gridRef"),
      address: formValue(form, "address"),
      accessNotes: formValue(form, "accessNotes"),
      services: parseLines(formValue(form, "services")),
      alerts: parseLines(formValue(form, "alerts")),
      inputs: parseLines(formValue(form, "inputs")),
      equipment: parseLines(formValue(form, "equipment")),
      walkthrough: {
        type: formValue(form, "walkthroughType"),
        url: formValue(form, "walkthroughUrl"),
        notes: formValue(form, "walkthroughNotes")
      },
      description: formValue(form, "description"),
      notes: formValue(form, "notes")
    }));
  }

  function storeLocalRegion(regionId, walks) {
    safeLocalSet(localRegionKey(regionId), JSON.stringify(walks.map(serialiseWalk)));
  }

  function persistRegion(regionId, walks, message) {
    var cleanWalks = walks.map(serialiseWalk);

    if (editor() && editor().isOnline && editor().isOnline()) {
      return editor().saveJsonFile(DATA_FILES.regionPath(regionId), cleanWalks, message);
    }

    storeLocalRegion(regionId, cleanWalks);
    return Promise.resolve({
      local: true
    });
  }

  function saveCurrentEdit(form) {
    var updated = walkFromForm(form);
    var regionId = state.selectedRegionId;
    var existingIndex = state.walks.findIndex(function findWalkIndex(walk) {
      return walk.id === updated.id;
    });

    if (existingIndex === -1) {
      state.walks.push(updated);
    } else {
      state.walks.splice(existingIndex, 1, updated);
    }

    if (panes()) {
      panes().setEditStatus("Saving...");
    }

    return persistRegion(regionId, state.walks, "Update walk " + updated.name)
      .then(function saved() {
        state.regionCache.set(regionId, state.walks.slice());
        renderMarkers();
        renderRegions();
        registerSearch();
        state.selectedWalkId = updated.id;
        renderFullDetailsPane(updated);
      })
      .catch(function handleError(error) {
        if (panes()) {
          panes().setEditStatus(error.message || "Save failed.");
        }
      });
  }

  function recycleLocal(regionId, deletedWalk) {
    var recycled = safeLocalJson(localRecycleKey(regionId), []);
    recycled.push(Object.assign({}, serialiseWalk(deletedWalk), {
      deletedAt: new Date().toISOString(),
      sourcePath: DATA_FILES.regionPath(regionId)
    }));
    safeLocalSet(localRecycleKey(regionId), JSON.stringify(recycled));
  }

  function recycleOnline(regionId, deletedWalk) {
    var binPath = DATA_FILES.recyclePath(regionId);
    var item = Object.assign({}, serialiseWalk(deletedWalk), {
      deletedAt: new Date().toISOString(),
      sourcePath: DATA_FILES.regionPath(regionId)
    });

    return editor().readJsonFile(binPath, [])
      .then(function appendRecycle(recycled) {
        var next = Array.isArray(recycled) ? recycled.slice() : [];
        next.push(item);
        return editor().saveJsonFile(binPath, next, "Recycle walk " + deletedWalk.name);
      });
  }

  function deleteCurrentWalk(walkId) {
    var regionId = state.selectedRegionId;
    var deletedWalk = state.walks.find(function findWalk(walk) {
      return walk.id === walkId;
    });

    if (!deletedWalk) {
      return;
    }

    var nextWalks = state.walks.filter(function keepWalk(walk) {
      return walk.id !== walkId;
    });

    if (panes()) {
      panes().setEditStatus("Deleting...");
    }

    var recycle = editor() && editor().isOnline && editor().isOnline()
      ? recycleOnline(regionId, deletedWalk)
      : Promise.resolve().then(function localRecycle() {
          recycleLocal(regionId, deletedWalk);
        });

    recycle
      .then(function saveAfterRecycle() {
        state.walks = nextWalks;
        return persistRegion(regionId, state.walks, "Delete walk " + deletedWalk.name);
      })
      .then(function finishDelete() {
        state.regionCache.set(regionId, state.walks.slice());
        state.selectedWalkId = "";
        renderMarkers();
        renderRegions();
        registerSearch();
        renderRegionToast();
      })
      .catch(function handleError(error) {
        if (panes()) {
          panes().setEditStatus(error.message || "Delete failed.");
        }
      });
  }

  function loadSiteWeather(walkId) {
    var walk = state.walks.find(function findWalk(item) {
      return String(item.id) === String(walkId);
    });
    var weather = weatherData();

    if (!walk || !panes()) {
      return;
    }

    if (!weather || typeof weather.loadSiteWeather !== "function") {
      panes().setSiteWeatherText("Weather data module is unavailable.");
      return;
    }

    panes().setSiteWeatherText("Loading weather...");

    weather.loadSiteWeather(walk)
      .then(panes().setSiteWeatherText)
      .catch(function weatherError(error) {
        panes().setSiteWeatherText(error.message || "Weather unavailable for this site.");
      });
  }

  function consumeClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function wireEvents() {
    document.addEventListener("click", function onClick(event) {
      var regionButton = event.target.closest("[data-region-id]");
      var overlayClose = event.target.closest("[data-region-overlay-close]");
      var regionOpen = event.target.closest("[data-region-open]");
      var weatherButton = event.target.closest("[data-load-weather]");
      var detailsButton = event.target.closest("[data-open-details]");
      var expandButton = event.target.closest("[data-expand-details]");
      var collapseButton = event.target.closest("[data-collapse-details]");
      var closePaneButton = event.target.closest("[data-close-pane]");
      var editButton = event.target.closest("[data-edit-walk]");
      var editCancel = event.target.closest("[data-edit-cancel]");
      var editDelete = event.target.closest("[data-edit-delete]");

      if (regionButton) {
        consumeClick(event);
        selectRegion(regionButton.getAttribute("data-region-id"));
        return;
      }

      if (overlayClose) {
        consumeClick(event);
        closeRegionOverlay();
        return;
      }

      if (regionOpen) {
        consumeClick(event);
        openRegionOverlay();
        return;
      }

      if (detailsButton) {
        consumeClick(event);
        selectWalk(detailsButton.getAttribute("data-open-details"), false, true);
        return;
      }

      if (expandButton) {
        consumeClick(event);
        selectWalk(expandButton.getAttribute("data-expand-details"), false, true);
        return;
      }

      if (collapseButton) {
        consumeClick(event);
        selectWalk(collapseButton.getAttribute("data-collapse-details"), false, false);
        return;
      }

      if (closePaneButton) {
        consumeClick(event);
        closeDetailsPane();
        return;
      }

      if (editButton) {
        consumeClick(event);
        var walk = state.walks.find(function findWalk(item) {
          return item.id === editButton.getAttribute("data-edit-walk");
        });

        if (walk) {
          state.selectedWalkId = walk.id;
          renderEditPane(walk);
        }
        return;
      }

      if (editCancel) {
        consumeClick(event);
        selectWalk(editCancel.getAttribute("data-edit-cancel"), false, true);
        return;
      }

      if (editDelete) {
        consumeClick(event);
        deleteCurrentWalk(editDelete.getAttribute("data-edit-delete"));
        return;
      }

      if (weatherButton) {
        consumeClick(event);
        loadSiteWeather(weatherButton.getAttribute("data-load-weather"));
      }
    }, true);

    document.addEventListener("submit", function onSubmit(event) {
      var form = event.target.closest("[data-edit-form]");

      if (!form) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      saveCurrentEdit(form);
    });

    window.addEventListener("fieldops:shell-filter-region", openRegionOverlay);
    window.addEventListener("fieldops:shell-map-tools-toggle", openRegionOverlay);

    window.addEventListener("fieldops:editor-mode-change", function editorModeChanged() {
      var walk = selectedWalk();
      var panel = selectedPanel();

      if (!walk || !panel || panel.hidden) {
        return;
      }

      if (panel.dataset.paneMode === "edit") {
        renderEditPane(walk);
      } else if (panel.dataset.paneMode === "details") {
        renderFullDetailsPane(walk);
      }
    });
  }

  function initMap() {
    var canvas = qs("#OSMmaps");

    if (!canvas) {
      return;
    }

    if (!window.L) {
      showMapError("Map library failed to load.");
      return;
    }

    state.map = window.L.map(canvas, {
      center: UK_CENTER,
      zoom: 6,
      minZoom: 5,
      maxZoom: 16,
      maxBounds: UK_BOUNDS,
      maxBoundsViscosity: 0.9,
      zoomControl: false,
      zoomSnap: 0.05,
      zoomDelta: 0.5,
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: false
    });

    window.FieldOpsAtlasLeafletMap = state.map;

    window.L.control.zoom({
      position: "bottomright"
    }).addTo(state.map);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
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

    state.markerLayer = window.L.layerGroup().addTo(state.map);
  }

  function bindPaneControls() {
    if (state.panesBound || !panes() || typeof panes().bindMapControls !== "function") {
      return;
    }

    panes().bindMapControls({
      onServiceOpen: openServiceMenu,
      onClusterChange: focusClusters
    });

    state.panesBound = true;
  }

  function exposeApi() {
    window.FieldOpsOSMmaps = {
      VERSION: VERSION,
      version: VERSION,
      selectRegion: selectRegion,
      openRegionOverlay: openRegionOverlay,
      closeRegionOverlay: closeRegionOverlay,
      closeDetailsPane: closeDetailsPane,
      fitVisible: fitVisible,
      focusClusters: focusClusters,
      getServiceMenu: openServiceMenu,
      getRegions: function getRegions() {
        return state.regions.slice();
      },
      getWalks: function getWalks() {
        return state.walks.slice();
      },
      getSelectedWalk: selectedWalk,
      clearRfOverlay: clearRfOverlay
    };

    if (window.FieldOpsEditor && window.FieldOpsEditor.registerPage) {
      window.FieldOpsEditor.registerPage({
        page: "map",
        label: "Maps",
        fileScope: "data/regions"
      });
    }

    bindPaneControls();
  }

  function init() {
    setTheme(initialTheme());
    wireEvents();
    initMap();

    loadRegions()
      .then(exposeApi)
      .catch(function handleError(error) {
        showMapError(error.message || "OSM maps failed to load.");
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());

/* Destination: FieldOpsAtlas/Features/maps/OSMmaps.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMmaps.js | bottom/end of file */
