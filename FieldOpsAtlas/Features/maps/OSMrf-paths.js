/* ==========================================================================
   FieldOps Atlas saved RF path renderer
   File: FieldOpsAtlas/Features/maps/OSMrf-paths.js
   Version: 1.1.13-node-rim-connection
   Purpose:
   - Ask OSMpath-generator.js for a route only when no saved route exists.
   - Render saved geographic path points without rerouting on pan or zoom.
   - Add a lightweight animated ribbon flow over the service-coloured line.
   - Keep the compact FROM → TO label for the selected path.
   - Expose explicit regeneration for the future Map tools panel.
   ========================================================================== */

(function fieldOpsOSMRfPaths() {
  "use strict";

  var VERSION = "1.1.13-node-rim-connection";
  var REGION_STORAGE_KEY = "fieldops-osmmaps-selected-region-v1";
  var REGION_SITES_URL = "../../../data/regions/";
  var REGIONS_URL = "../../../data/regions.json";
  var LAYOUT_DELAY_MS = 0;
  var CHEVRON_ICON_URL = "../../../data/icons/path-pane-chevron-gold.svg?v=1.0.1";
  var CHEVRON_COUNT = 3;
  var CHEVRON_DURATION_SECONDS = 6.6;
  var CHEVRON_WIDTH = 10;
  var CHEVRON_HEIGHT = 14;
  var ROUTE_HIGHLIGHT_OFFSET_PX = 4;
  var ROUTE_HIGHLIGHT_WEIGHT = 2;
  var NODE_BRIDGE_INSET_PX = 8.5;
  var NODE_BRIDGE_OUTSET_PX = 11.5;
  var NODE_BRIDGE_WEIGHT = 6;
  var XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";
  var originalPolyline = window.L && window.L.polyline;
  var pathRecords = [];
  var selectedRecord = null;
  var selectedLabelLayer = null;
  var layoutTimer = 0;
  var endpointIndex = new Map();
  var endpointDataRequests = new Map();
  var ribbonMap = null;
  var ribbonRenderer = null;
  var nodeConnectionRenderer = null;
  var ribbonSequence = 0;

  function coordinateKey(value) {
    var latlng = window.L.latLng(value);
    return latlng.lat.toFixed(5) + "," + latlng.lng.toFixed(5);
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
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

  function tidyPathStyle(style) {
    var nextStyle = Object.assign({}, style || {});
    var weight = Number(nextStyle.weight);

    if (weight === 5) {
      nextStyle.weight = 4;
    } else if (weight >= 8) {
      nextStyle.weight = 7;
    }

    return nextStyle;
  }

  function isSelectedStyle(style) {
    return Number(style && style.weight) >= 8;
  }

  function activeMap() {
    if (window.FieldOpsAtlasLeafletMap) {
      return window.FieldOpsAtlasLeafletMap;
    }

    var activeRecord = pathRecords.find(function findMappedRecord(record) {
      return record.line && record.line._map;
    });

    return activeRecord ? activeRecord.line._map : null;
  }

  function activeRecords(map) {
    pathRecords = pathRecords.filter(function keepRecord(record) {
      return record &&
        record.line &&
        record.line._map &&
        (!map || !map.hasLayer || map.hasLayer(record.line));
    });

    return pathRecords.slice();
  }

  function ensurePane(map, name, zIndex) {
    var pane = map.getPane(name);

    if (!pane) {
      pane = map.createPane(name);
    }

    pane.style.zIndex = String(zIndex);
    pane.style.pointerEvents = "none";
    return pane;
  }

  function setRibbonAnimationPaused(paused) {
    var root = ribbonRenderer && ribbonRenderer._container;

    if (!root) {
      return;
    }

    if (paused && typeof root.pauseAnimations === "function") {
      root.pauseAnimations();
    } else if (!paused && typeof root.unpauseAnimations === "function") {
      root.unpauseAnimations();
    }
  }

  function bindRibbonZoomAnimation(map) {
    if (!map || map.__fieldOpsRfRibbonZoomAnimationBound) {
      return;
    }

    map.__fieldOpsRfRibbonZoomAnimationBound = true;

    map.on("zoomstart", function pauseRibbonDuringZoom() {
      setRibbonAnimationPaused(true);
    });

    map.on("zoomend", function restoreRibbonAfterZoom() {
      window.requestAnimationFrame(function redrawAtFinalZoom() {
        layoutPaths(false);

        window.requestAnimationFrame(function resumeChevronMotion() {
          setRibbonAnimationPaused(false);
        });
      });
    });
  }

  function ensureRibbonRenderers(map) {
    if (
      ribbonMap === map &&
      ribbonRenderer &&
      nodeConnectionRenderer
    ) {
      bindRibbonZoomAnimation(map);
      return;
    }

    ribbonMap = map;
    ensurePane(map, "fieldopsRfRibbon", 435);
    ensurePane(map, "fieldopsRfNodeConnections", 610);
    ribbonRenderer = window.L.svg({
      pane: "fieldopsRfRibbon",
      padding: 0.5
    });
    nodeConnectionRenderer = window.L.svg({
      pane: "fieldopsRfNodeConnections",
      padding: 0.5
    });
    bindRibbonZoomAnimation(map);
  }

  function ribbonDefinitions(record) {
    var color = String(
      record.baseColor ||
      record.line.options.color ||
      "#16a34a"
    );

    record.baseColor = color;

    return [
      {
        name: "main",
        className: "osmmaps-rf-ribbon-main",
        style: {
          color: color,
          weight: 6,
          opacity: 0.62
        }
      }
    ];
  }

  function pixelPathLength(points) {
    var total = 0;
    var index;

    for (index = 1; index < points.length; index += 1) {
      total += points[index - 1].distanceTo(points[index]);
    }

    return total;
  }

  function offsetPixelPath(points, offset) {
    return points.map(function offsetPoint(point, index) {
      var previous = points[Math.max(0, index - 1)];
      var next = points[Math.min(points.length - 1, index + 1)];
      var dx = next.x - previous.x;
      var dy = next.y - previous.y;
      var length = Math.sqrt((dx * dx) + (dy * dy)) || 1;
      var normalX = -dy / length;
      var normalY = dx / length;

      return window.L.point(
        point.x + (normalX * offset),
        point.y + (normalY * offset)
      );
    });
  }

  function longestSideHighlightPoints(map, latlngs) {
    var projected;
    var left;
    var right;
    var selected;

    if (!map || !Array.isArray(latlngs) || latlngs.length < 2) {
      return latlngs || [];
    }

    projected = latlngs.map(function projectPoint(latlng) {
      return map.latLngToLayerPoint(latlng);
    });

    left = offsetPixelPath(projected, ROUTE_HIGHLIGHT_OFFSET_PX);
    right = offsetPixelPath(projected, -ROUTE_HIGHLIGHT_OFFSET_PX);
    selected = pixelPathLength(left) >= pixelPathLength(right)
      ? left
      : right;

    return selected.map(function unprojectPoint(point) {
      return map.layerPointToLatLng(point);
    });
  }

  function highlightLayerOptions() {
    return {
      pane: "fieldopsRfRibbon",
      renderer: ribbonRenderer,
      interactive: false,
      keyboard: false,
      className: "osmmaps-rf-ribbon-highlight",
      color: "#e6fff5",
      weight: ROUTE_HIGHLIGHT_WEIGHT,
      opacity: 0.46,
      lineCap: "round",
      lineJoin: "round"
    };
  }

  function ribbonLayerOptions(definition) {
    return Object.assign({
      pane: "fieldopsRfRibbon",
      renderer: ribbonRenderer,
      interactive: false,
      keyboard: false,
      className: definition.className,
      lineCap: "round",
      lineJoin: "round"
    }, definition.style);
  }

  function nodeBridgeSegment(map, centreLatLng, adjacentLatLng) {
    var centre = map.latLngToLayerPoint(centreLatLng);
    var adjacent = map.latLngToLayerPoint(adjacentLatLng);
    var dx = adjacent.x - centre.x;
    var dy = adjacent.y - centre.y;
    var length = Math.sqrt((dx * dx) + (dy * dy)) || 1;
    var unitX = dx / length;
    var unitY = dy / length;
    var inner = window.L.point(
      centre.x + (unitX * NODE_BRIDGE_INSET_PX),
      centre.y + (unitY * NODE_BRIDGE_INSET_PX)
    );
    var outer = window.L.point(
      centre.x + (unitX * NODE_BRIDGE_OUTSET_PX),
      centre.y + (unitY * NODE_BRIDGE_OUTSET_PX)
    );

    return [
      map.layerPointToLatLng(inner),
      map.layerPointToLatLng(outer)
    ];
  }

  function nodeBridgeSegments(map, points) {
    if (!map || !Array.isArray(points) || points.length < 2) {
      return {
        start: [],
        end: []
      };
    }

    return {
      start: nodeBridgeSegment(map, points[0], points[1]),
      end: nodeBridgeSegment(
        map,
        points[points.length - 1],
        points[points.length - 2]
      )
    };
  }

  function nodeBridgeOptions(record) {
    return {
      pane: "fieldopsRfNodeConnections",
      renderer: nodeConnectionRenderer,
      interactive: false,
      keyboard: false,
      className: "osmmaps-rf-node-bridge",
      color: String(record.baseColor || "#16a34a"),
      weight: NODE_BRIDGE_WEIGHT,
      opacity: 1,
      lineCap: "butt",
      lineJoin: "round"
    };
  }

  function reducedMotionEnabled() {
    return Boolean(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function setLinkedHref(element, value) {
    element.setAttribute("href", value);
    element.setAttributeNS(XLINK_NAMESPACE, "href", value);
  }

  function createChevronFlow(record) {
    var mainPath = record.ribbon &&
      record.ribbon.main &&
      record.ribbon.main._path;
    var parent;
    var namespace;
    var pathId;
    var chevrons = [];
    var totalLength;
    var chevronCount;
    var duration;
    var stagger;
    var index;

    if (!mainPath || reducedMotionEnabled()) {
      return chevrons;
    }

    parent = mainPath.parentNode;
    namespace = mainPath.namespaceURI;

    if (!parent || !namespace) {
      return chevrons;
    }

    totalLength = typeof mainPath.getTotalLength === "function"
      ? Number(mainPath.getTotalLength()) || 0
      : 0;
    chevronCount = clamp(Math.round(totalLength / 180) || CHEVRON_COUNT, 2, 4);
    duration = clamp(totalLength / 70, CHEVRON_DURATION_SECONDS, 8.8);
    stagger = duration / chevronCount;

    ribbonSequence += 1;
    pathId = "fieldops-rf-chevron-route-" + String(ribbonSequence);
    mainPath.setAttribute("id", pathId);

    for (index = 0; index < chevronCount; index += 1) {
      var group = document.createElementNS(namespace, "g");
      var image = document.createElementNS(namespace, "image");
      var motion = document.createElementNS(namespace, "animateMotion");
      var motionPath = document.createElementNS(namespace, "mpath");

      group.setAttribute("class", "osmmaps-rf-ribbon-chevron");
      group.setAttribute("aria-hidden", "true");

      image.setAttribute("class", "osmmaps-rf-ribbon-chevron-image");
      image.setAttribute("x", String(-CHEVRON_WIDTH / 2));
      image.setAttribute("y", String(-CHEVRON_HEIGHT / 2));
      image.setAttribute("width", String(CHEVRON_WIDTH));
      image.setAttribute("height", String(CHEVRON_HEIGHT));
      image.setAttribute("preserveAspectRatio", "xMidYMid meet");
      image.setAttribute("transform", "rotate(180)");
      setLinkedHref(image, CHEVRON_ICON_URL);

      motion.setAttribute("dur", String(duration) + "s");
      motion.setAttribute("begin", String(-(index * stagger)) + "s");
      motion.setAttribute("repeatCount", "indefinite");
      motion.setAttribute("rotate", "auto");
      motion.setAttribute("calcMode", "linear");

      setLinkedHref(motionPath, "#" + pathId);
      motion.appendChild(motionPath);

      group.appendChild(image);
      group.appendChild(motion);
      parent.appendChild(group);
      chevrons.push(group);
    }

    return chevrons;
  }

  function removeRibbon(record) {
    if (!record.ribbon) {
      return;
    }

    Object.keys(record.ribbon).forEach(function removeLayer(name) {
      var layer = record.ribbon[name];

      if (Array.isArray(layer)) {
        layer.forEach(function removeChevron(chevron) {
          if (chevron && chevron.parentNode) {
            chevron.parentNode.removeChild(chevron);
          }
        });
        return;
      }

      if (layer && layer._map) {
        layer.remove();
      }
    });

    record.ribbon = null;
  }

  function createRibbon(record) {
    var map = record.line && record.line._map;
    var points = record.line ? record.line.getLatLngs() : [];

    if (!map || points.length < 2) {
      return;
    }

    var bridges;

    ensureRibbonRenderers(map);
    removeRibbon(record);
    bridges = nodeBridgeSegments(map, points);
    record.ribbon = {
      highlight: window.L.polyline(
        longestSideHighlightPoints(map, points),
        highlightLayerOptions()
      ).addTo(map),
      connectionStart: window.L.polyline(
        bridges.start,
        nodeBridgeOptions(record)
      ).addTo(map),
      connectionEnd: window.L.polyline(
        bridges.end,
        nodeBridgeOptions(record)
      ).addTo(map)
    };

    ribbonDefinitions(record).forEach(function createLayer(definition) {
      record.ribbon[definition.name] = window.L.polyline(
        points,
        ribbonLayerOptions(definition)
      ).addTo(map);
    });

    record.ribbon.chevrons = createChevronFlow(record);
  }

  function updateRibbon(record) {
    var points = record.line ? record.line.getLatLngs() : [];
    var bridges;

    if (!record.ribbon) {
      createRibbon(record);
      return;
    }

    bridges = nodeBridgeSegments(record.line._map, points);

    if (record.ribbon.highlight) {
      record.ribbon.highlight
        .setLatLngs(longestSideHighlightPoints(record.line._map, points))
        .setStyle(highlightLayerOptions());
    }

    if (record.ribbon.connectionStart) {
      record.ribbon.connectionStart
        .setLatLngs(bridges.start)
        .setStyle(nodeBridgeOptions(record));
    }

    if (record.ribbon.connectionEnd) {
      record.ribbon.connectionEnd
        .setLatLngs(bridges.end)
        .setStyle(nodeBridgeOptions(record));
    }

    ribbonDefinitions(record).forEach(function updateLayer(definition) {
      var layer = record.ribbon[definition.name];

      if (!layer) {
        return;
      }

      layer
        .setLatLngs(points)
        .setStyle(definition.style);
    });
  }

  function generator() {
    return window.FieldOpsOSMPathGenerator || null;
  }

  function applyRoutes(map, records, routes) {
    var pathGenerator = generator();

    records.forEach(function applyRoute(record) {
      var routeKey = pathGenerator && typeof pathGenerator.keyFor === "function"
        ? pathGenerator.keyFor(record)
        : record.stableKey;
      var points = routes && routes.get(routeKey);

      if (Array.isArray(points) && points.length >= 2) {
        record.line.setLatLngs(points);
      }

      updateRibbon(record);
    });

    if (selectedRecord) {
      renderSelectedLabel(false);
    }
  }

  function layoutPaths(forceRegenerate) {
    var map = activeMap();
    var records = activeRecords(map);
    var pathGenerator = generator();
    var routes;

    if (!map || !records.length) {
      return;
    }

    if (
      !pathGenerator ||
      typeof pathGenerator.resolve !== "function" ||
      typeof pathGenerator.regenerate !== "function"
    ) {
      records.forEach(updateRibbon);
      return;
    }

    routes = forceRegenerate
      ? pathGenerator.regenerate(map, records)
      : pathGenerator.resolve(map, records);

    applyRoutes(map, records, routes);
  }

  function scheduleLayout() {
    if (layoutTimer) {
      window.clearTimeout(layoutTimer);
    }

    layoutTimer = window.setTimeout(function runLayout() {
      layoutTimer = 0;
      layoutPaths(false);
    }, LAYOUT_DELAY_MS);
  }

  function regenerateActivePaths() {
    layoutPaths(true);
  }

  function deriveAbbreviation(value) {
    var words = String(value || "")
      .replace(/[^A-Za-z0-9 ]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!words.length) {
      return "SITE";
    }

    if (words.length === 1) {
      return words[0].slice(0, 4).toUpperCase();
    }

    return words
      .slice(0, 4)
      .map(function firstCharacter(word) {
        return word.charAt(0);
      })
      .join("")
      .toUpperCase();
  }

  function endpointAbbreviation(endpoint) {
    var explicit = endpoint && (
      endpoint.abbreviation ||
      endpoint.abbr ||
      endpoint.shortName ||
      endpoint.shortCode ||
      endpoint.siteCode ||
      endpoint.code
    );

    return String(explicit || "").trim().toUpperCase() ||
      deriveAbbreviation(endpoint && (endpoint.name || endpoint.label || endpoint.id));
  }

  function addEndpointRecord(endpoint) {
    if (
      !endpoint ||
      !Number.isFinite(Number(endpoint.lat)) ||
      !Number.isFinite(Number(endpoint.lng))
    ) {
      return;
    }

    endpointIndex.set(
      coordinateKey([Number(endpoint.lat), Number(endpoint.lng)]),
      endpoint
    );
  }

  function indexLoadedWalks() {
    var mapApi = window.FieldOpsOSMmaps;
    var walks = mapApi && typeof mapApi.getWalks === "function"
      ? mapApi.getWalks()
      : [];

    walks.forEach(addEndpointRecord);
  }

  function selectedRegionId() {
    var mapApi = window.FieldOpsOSMmaps;
    var walks = mapApi && typeof mapApi.getWalks === "function"
      ? mapApi.getWalks()
      : [];

    if (walks.length && walks[0].regionId) {
      return String(walks[0].regionId);
    }

    try {
      return String(window.localStorage.getItem(REGION_STORAGE_KEY) || "");
    } catch (error) {
      return "";
    }
  }

  function loadJson(url) {
    return fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    }).then(function readResponse(response) {
      if (!response.ok) {
        throw new Error("Could not load " + url + ".");
      }

      return response.json();
    });
  }

  function indexVirtualEndpoints(regions, regionId) {
    var region = Array.isArray(regions)
      ? regions.find(function findRegion(item) {
          return item && String(item.id) === String(regionId);
        })
      : null;
    var serviceClusters = region && region.serviceClusters;

    if (!serviceClusters || typeof serviceClusters !== "object") {
      return;
    }

    Object.keys(serviceClusters).forEach(function indexService(serviceId) {
      var clusters = Array.isArray(serviceClusters[serviceId])
        ? serviceClusters[serviceId]
        : [];

      clusters.forEach(function indexCluster(cluster) {
        var paths = cluster && Array.isArray(cluster.paths)
          ? cluster.paths
          : [];

        paths.forEach(function indexPath(path) {
          addEndpointRecord(path && path.virtualFeeder);
          addEndpointRecord(path && path.virtualReceiver);
        });
      });
    });
  }

  function loadEndpointData() {
    var regionId = selectedRegionId();

    indexLoadedWalks();

    if (!regionId) {
      return Promise.resolve();
    }

    if (endpointDataRequests.has(regionId)) {
      return endpointDataRequests.get(regionId);
    }

    var request = Promise.allSettled([
      loadJson(REGION_SITES_URL + encodeURIComponent(regionId) + "-sites.json"),
      loadJson(REGIONS_URL)
    ]).then(function indexPayloads(results) {
      if (
        results[0].status === "fulfilled" &&
        Array.isArray(results[0].value)
      ) {
        results[0].value.forEach(addEndpointRecord);
      }

      if (results[1].status === "fulfilled") {
        indexVirtualEndpoints(results[1].value, regionId);
      }
    });

    endpointDataRequests.set(regionId, request);
    return request;
  }

  function endpointFor(latlng) {
    indexLoadedWalks();

    return endpointIndex.get(coordinateKey(latlng)) || {
      id: "external",
      name: "External",
      abbreviation: "EXT"
    };
  }

  function selectedLabelText(record) {
    return endpointAbbreviation(endpointFor(record.from)) +
      " → " +
      endpointAbbreviation(endpointFor(record.to));
  }

  function ensureLabelLayer(map) {
    var pane = map.getPane("fieldopsRfRouteLabels");

    if (!pane) {
      pane = map.createPane("fieldopsRfRouteLabels");
      pane.style.zIndex = "655";
      pane.style.pointerEvents = "none";
    }

    if (!selectedLabelLayer) {
      selectedLabelLayer = window.L.layerGroup().addTo(map);
    }

    return selectedLabelLayer;
  }

  function labelAnchor(record) {
    var points = record.line.getLatLngs();
    var index = Math.max(
      0,
      Math.min(
        points.length - 1,
        Math.round((points.length - 1) * 0.52)
      )
    );

    return points[index] || record.from;
  }

  function renderSelectedLabel(loadRawData) {
    var map = activeMap();

    if (
      !map ||
      !selectedRecord ||
      !selectedRecord.line ||
      !selectedRecord.line._map
    ) {
      if (selectedLabelLayer) {
        selectedLabelLayer.clearLayers();
      }
      return;
    }

    var layer = ensureLabelLayer(map);
    var label = selectedLabelText(selectedRecord);
    var width = clamp(label.length * 8 + 22, 74, 142);
    var icon = window.L.divIcon({
      className: "osmmaps-rf-route-label-icon",
      html: '<span class="osmmaps-rf-route-label">' +
        escapeHtml(label) +
        "</span>",
      iconSize: [width, 24],
      iconAnchor: [width / 2, 12]
    });

    layer.clearLayers();
    window.L.marker(labelAnchor(selectedRecord), {
      pane: "fieldopsRfRouteLabels",
      icon: icon,
      interactive: false,
      keyboard: false
    }).addTo(layer);

    if (loadRawData !== false) {
      loadEndpointData().then(function refreshLoadedLabel() {
        if (selectedRecord) {
          renderSelectedLabel(false);
        }
      });
    }
  }

  function selectRecord(record) {
    selectedRecord = record;
    renderSelectedLabel(true);
  }

  function deselectRecord(record) {
    if (selectedRecord !== record) {
      return;
    }

    selectedRecord = null;

    if (selectedLabelLayer) {
      selectedLabelLayer.clearLayers();
    }
  }

  function patchPolyline() {
    if (!window.L || typeof originalPolyline !== "function") {
      return;
    }

    if (window.L.polyline.__fieldOpsRfPathRenderer === VERSION) {
      return;
    }

    window.L.polyline = function fieldOpsRfPolyline(latlngs, options) {
      var isRfPath = options &&
        options.pane === "fieldopsRfPaths" &&
        Array.isArray(latlngs) &&
        latlngs.length === 2;

      if (!isRfPath) {
        return originalPolyline.call(this, latlngs, options);
      }

      var from = window.L.latLng(latlngs[0]);
      var to = window.L.latLng(latlngs[1]);
      var cleanOptions = tidyPathStyle(options);
      var visibleColor = String(cleanOptions.color || "#16a34a");
      var hiddenOptions = Object.assign({}, cleanOptions, {
        opacity: 0,
        fillOpacity: 0,
        className: [
          cleanOptions.className || "",
          "osmmaps-rf-path-hit"
        ].filter(Boolean).join(" ")
      });
      var line = originalPolyline.call(this, [from, to], hiddenOptions);
      var originalSetStyle = line.setStyle;
      var record = {
        line: line,
        from: from,
        to: to,
        pathId: String(cleanOptions.fieldOpsPathId || ""),
        regionId: String(cleanOptions.fieldOpsRegionId || ""),
        serviceId: String(cleanOptions.fieldOpsServiceId || ""),
        stableKey: String(cleanOptions.fieldOpsPathId || "") ||
          coordinateKey(from) + "->" + coordinateKey(to),
        baseColor: visibleColor,
        ribbon: null
      };

      pathRecords.push(record);

      line.setStyle = function setRfPathStyle(style) {
        var selected = isSelectedStyle(style);
        var cleanStyle = tidyPathStyle(style);
        var hiddenStyle;

        if (cleanStyle.color) {
          record.baseColor = String(cleanStyle.color);
        }

        hiddenStyle = Object.assign({}, cleanStyle, {
          opacity: 0,
          fillOpacity: 0
        });

        var result = originalSetStyle.call(this, hiddenStyle);

        updateRibbon(record);

        if (selected) {
          selectRecord(record);
        } else {
          deselectRecord(record);
        }

        return result;
      };

      line.on("add", scheduleLayout);
      line.on("remove", function removeRfPath() {
        deselectRecord(record);
        removeRibbon(record);
        scheduleLayout();
      });

      return line;
    };

    window.L.polyline.__fieldOpsRfPathRenderer = VERSION;
  }

  patchPolyline();

  window.addEventListener(
    "fieldops:map-regenerate-paths",
    regenerateActivePaths
  );

  window.FieldOpsOSMRfPaths = {
    VERSION: VERSION,
    version: VERSION,
    layout: function layout() {
      layoutPaths(false);
    },
    regenerate: regenerateActivePaths,
    clearGenerated: function clearGenerated() {
      var pathGenerator = generator();
      var records = activeRecords(activeMap());

      if (pathGenerator && typeof pathGenerator.clear === "function") {
        pathGenerator.clear(records);
      }
    },
    refreshLabel: function refreshLabel() {
      renderSelectedLabel(true);
    }
  };
}());

/* Destination: FieldOpsAtlas/Features/maps/OSMrf-paths.js */
/* End of file: FieldOpsAtlas/Features/maps/OSMrf-paths.js | bottom/end of file */
