/* ==========================================================================
   FieldOps Atlas saved RF path renderer
   File: FieldOpsAtlas/Features/maps/OSMrf-paths.js
   Version: 1.1.2-aligned-four-layer-flow
   Purpose:
   - Ask OSMpath-generator.js for a route only when no saved route exists.
   - Render saved geographic path points without rerouting on pan or zoom.
   - Add a lightweight animated ribbon flow over the service-coloured line.
   - Keep the compact FROM → TO label for the selected path.
   - Expose explicit regeneration for the future Map tools panel.
   ========================================================================== */

(function fieldOpsOSMRfPaths() {
  "use strict";

  var VERSION = "1.1.2-aligned-four-layer-flow";
  var REGION_STORAGE_KEY = "fieldops-osmmaps-selected-region-v1";
  var REGION_SITES_URL = "../../../data/regions/";
  var REGIONS_URL = "../../../data/regions.json";
  var LAYOUT_DELAY_MS = 0;
  var originalPolyline = window.L && window.L.polyline;
  var pathRecords = [];
  var selectedRecord = null;
  var selectedLabelLayer = null;
  var layoutTimer = 0;
  var endpointIndex = new Map();
  var endpointDataRequests = new Map();
  var ribbonMap = null;
  var ribbonRenderer = null;

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

  function ensureRibbonRenderers(map) {
    if (ribbonMap === map && ribbonRenderer) {
      return;
    }

    ribbonMap = map;
    ensurePane(map, "fieldopsRfRibbon", 435);
    ribbonRenderer = window.L.svg({
      pane: "fieldopsRfRibbon",
      padding: 0.5
    });
  }

  function lightenHex(value, amount) {
    var raw = String(value || "").trim().replace(/^#/, "");
    var hex = raw.length === 3
      ? raw.split("").map(function expand(character) {
          return character + character;
        }).join("")
      : raw;
    var factor = clamp(Number(amount) || 0, 0, 1);
    var red;
    var green;
    var blue;

    if (!/^[0-9a-f]{6}$/i.test(hex)) {
      return "#69f0bd";
    }

    red = parseInt(hex.slice(0, 2), 16);
    green = parseInt(hex.slice(2, 4), 16);
    blue = parseInt(hex.slice(4, 6), 16);

    red = Math.round(red + (255 - red) * factor);
    green = Math.round(green + (255 - green) * factor);
    blue = Math.round(blue + (255 - blue) * factor);

    return "#" +
      red.toString(16).padStart(2, "0") +
      green.toString(16).padStart(2, "0") +
      blue.toString(16).padStart(2, "0");
  }

  function removeRibbon(record) {
    ["under", "main", "highlight", "flow"].forEach(function removePart(name) {
      var layer = record.ribbon && record.ribbon[name];

      if (layer && layer._map) {
        layer.remove();
      }
    });

    record.ribbon = null;
  }

  function ribbonStyle(record) {
    var color = String(
      record.baseColor ||
      record.line.options.color ||
      "#16a34a"
    );

    record.baseColor = color;

    return {
      under: {
        color: "#e6fff5",
        weight: 10,
        opacity: 0.82
      },
      main: {
        color: color,
        weight: 6,
        opacity: 0.94
      },
      highlight: {
        color: "#ffffff",
        weight: 2,
        opacity: 0.52
      },
      flow: {
        color: lightenHex(color, 0.44),
        weight: 10,
        opacity: 0.98
      }
    };
  }

  function createRibbon(record) {
    var map = record.line && record.line._map;
    var points = record.line ? record.line.getLatLngs() : [];
    var style;

    if (!map || points.length < 2) {
      return;
    }

    ensureRibbonRenderers(map);
    removeRibbon(record);
    style = ribbonStyle(record);

    record.ribbon = {
      under: window.L.polyline(points, {
        pane: "fieldopsRfRibbon",
        renderer: ribbonRenderer,
        interactive: false,
        keyboard: false,
        className: "osmmaps-rf-ribbon-under",
        color: style.under.color,
        weight: style.under.weight,
        opacity: style.under.opacity,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(map),
      main: window.L.polyline(points, {
        pane: "fieldopsRfRibbon",
        renderer: ribbonRenderer,
        interactive: false,
        keyboard: false,
        className: "osmmaps-rf-ribbon-main",
        color: style.main.color,
        weight: style.main.weight,
        opacity: style.main.opacity,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(map),
      highlight: window.L.polyline(points, {
        pane: "fieldopsRfRibbon",
        renderer: ribbonRenderer,
        interactive: false,
        keyboard: false,
        className: "osmmaps-rf-ribbon-highlight",
        color: style.highlight.color,
        weight: style.highlight.weight,
        opacity: style.highlight.opacity,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(map),
      flow: window.L.polyline(points, {
        pane: "fieldopsRfRibbon",
        renderer: ribbonRenderer,
        interactive: false,
        keyboard: false,
        className: "osmmaps-rf-ribbon-flow",
        color: style.flow.color,
        weight: style.flow.weight,
        opacity: style.flow.opacity,
        dashArray: "10 16",
        dashOffset: "0",
        lineCap: "round",
        lineJoin: "round"
      }).addTo(map)
    };
  }

  function updateRibbon(record) {
    var points = record.line ? record.line.getLatLngs() : [];
    var style;

    if (!record.ribbon) {
      createRibbon(record);
      return;
    }

    style = ribbonStyle(record);

    record.ribbon.under.setLatLngs(points).setStyle(style.under);
    record.ribbon.main.setLatLngs(points).setStyle(style.main);
    record.ribbon.highlight.setLatLngs(points).setStyle(style.highlight);
    record.ribbon.flow.setLatLngs(points).setStyle(style.flow);
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
