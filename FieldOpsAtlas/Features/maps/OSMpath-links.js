/* ==========================================================================
   FieldOps Atlas map RF path links
   File: FieldOpsAtlas/Features/maps/OSMpath-links.js
   Version: 1.0.0-view-path-elevation
   Purpose:
   - Add a wide invisible click target over each rendered physical RF path.
   - Open a compact two-button popup: Details and View path.
   - Calculate straight-line distance from the two map coordinates.
   - Resolve and cache the nearest mapped hill/peak elevation for each endpoint.
   - Pass the selected path to the RF 3D page through localStorage.
   ========================================================================== */

(function fieldOpsMapPathLinks() {
  "use strict";

  var VERSION = "1.0.0-view-path-elevation";
  var REGIONS_URL = "../../../data/regions.json";
  var RF_PAGE_URL = "../RF/index.html";
  var PATH_STORAGE_KEY = "fieldops-rf-selected-path-v1";
  var ELEVATION_CACHE_KEY = "fieldops-rf-elevation-cache-v1";
  var OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];
  var layer = null;
  var regionPromise = null;
  var elevationRequests = new Map();

  function mapInstance() {
    return window.FieldOpsAtlasLeafletMap || null;
  }

  function mapApi() {
    return window.FieldOpsOSMmaps || null;
  }

  function clean(value, fallback) {
    var text = String(value == null ? "" : value).replace(/\s+/g, " ").trim();
    return text || String(fallback || "");
  }

  function numberOrNull(value) {
    var number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function readJson(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function radians(value) {
    return value * Math.PI / 180;
  }

  function distanceKm(a, b) {
    if (!a || !b) {
      return null;
    }

    var lat1 = numberOrNull(a.lat);
    var lng1 = numberOrNull(a.lng);
    var lat2 = numberOrNull(b.lat);
    var lng2 = numberOrNull(b.lng);

    if (lat1 === null || lng1 === null || lat2 === null || lng2 === null) {
      return null;
    }

    var earthRadiusKm = 6371.0088;
    var dLat = radians(lat2 - lat1);
    var dLng = radians(lng2 - lng1);
    var sinLat = Math.sin(dLat / 2);
    var sinLng = Math.sin(dLng / 2);
    var value = sinLat * sinLat +
      Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * sinLng * sinLng;

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  }

  function bearingDegrees(a, b) {
    var lat1 = radians(Number(a.lat));
    var lat2 = radians(Number(b.lat));
    var dLng = radians(Number(b.lng) - Number(a.lng));
    var y = Math.sin(dLng) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  function distanceText(value) {
    var number = numberOrNull(value);
    return number === null ? "—" : number.toFixed(number < 10 ? 2 : 1) + " km";
  }

  function elevationText(value) {
    var number = numberOrNull(value);
    return number === null ? "Loading…" : Math.round(number) + " m";
  }

  function loadRegions() {
    if (!regionPromise) {
      regionPromise = fetch(REGIONS_URL + "?v=" + encodeURIComponent(VERSION), {
        cache: "no-store",
        headers: { Accept: "application/json" }
      }).then(function parse(response) {
        if (!response.ok) {
          throw new Error("Could not load RF cluster data.");
        }
        return response.json();
      });
    }

    return regionPromise;
  }

  function elevationCache() {
    var cache = readJson(ELEVATION_CACHE_KEY, {});
    return cache && typeof cache === "object" ? cache : {};
  }

  function elevationKey(endpoint) {
    return Number(endpoint.lat).toFixed(5) + "," + Number(endpoint.lng).toFixed(5);
  }

  function parseElevation(value) {
    var match = String(value == null ? "" : value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    return match ? numberOrNull(match[0]) : null;
  }

  function elementPoint(element) {
    if (!element) {
      return null;
    }

    var lat = numberOrNull(element.lat != null ? element.lat : element.center && element.center.lat);
    var lng = numberOrNull(element.lon != null ? element.lon : element.center && element.center.lon);

    return lat === null || lng === null ? null : { lat: lat, lng: lng };
  }

  function nearestMappedElevation(payload, endpoint) {
    var elements = payload && Array.isArray(payload.elements) ? payload.elements : [];
    var candidates = elements.map(function toCandidate(element) {
      var point = elementPoint(element);
      var elevationM = parseElevation(element && element.tags && element.tags.ele);

      if (!point || elevationM === null) {
        return null;
      }

      return {
        elevationM: elevationM,
        distanceKm: distanceKm(endpoint, point),
        source: "osm-nearby-hill"
      };
    }).filter(Boolean).sort(function nearest(a, b) {
      return a.distanceKm - b.distanceKm;
    });

    return candidates[0] || null;
  }

  function overpassQuery(endpoint) {
    return [
      "[out:json][timeout:20];",
      "nwr(around:20000,", Number(endpoint.lat).toFixed(6), ",", Number(endpoint.lng).toFixed(6), ")",
      '["natural"~"^(peak|hill)$"]["ele"];',
      "out center tags;"
    ].join("");
  }

  function requestOverpass(endpoint, index) {
    var endpointUrl = OVERPASS_ENDPOINTS[index || 0];
    var url = endpointUrl + "?data=" + encodeURIComponent(overpassQuery(endpoint));

    return fetch(url, {
      cache: "force-cache",
      headers: { Accept: "application/json" }
    }).then(function parse(response) {
      if (!response.ok) {
        throw new Error("Mapped elevation lookup failed.");
      }
      return response.json();
    }).then(function choose(payload) {
      var result = nearestMappedElevation(payload, endpoint);
      if (!result) {
        throw new Error("No mapped elevation was found nearby.");
      }
      return result;
    }).catch(function retry(error) {
      if ((index || 0) + 1 < OVERPASS_ENDPOINTS.length) {
        return requestOverpass(endpoint, (index || 0) + 1);
      }
      throw error;
    });
  }

  function requestTerrainFallback(endpoint) {
    var url = "https://api.open-meteo.com/v1/elevation?latitude=" +
      encodeURIComponent(endpoint.lat) + "&longitude=" + encodeURIComponent(endpoint.lng);

    return fetch(url, {
      cache: "force-cache",
      headers: { Accept: "application/json" }
    }).then(function parse(response) {
      if (!response.ok) {
        throw new Error("Elevation lookup failed.");
      }
      return response.json();
    }).then(function result(payload) {
      var elevations = payload && Array.isArray(payload.elevation) ? payload.elevation : [];
      var elevationM = numberOrNull(elevations[0]);

      if (elevationM === null) {
        throw new Error("Elevation is unavailable.");
      }

      return {
        elevationM: elevationM,
        distanceKm: 0,
        source: "terrain-fallback"
      };
    });
  }

  function resolveElevation(endpoint) {
    var key = elevationKey(endpoint);
    var cache = elevationCache();
    var cached = cache[key];

    if (cached && numberOrNull(cached.elevationM) !== null) {
      return Promise.resolve(cached);
    }

    if (elevationRequests.has(key)) {
      return elevationRequests.get(key);
    }

    var request = requestOverpass(endpoint, 0)
      .catch(function fallback() {
        return requestTerrainFallback(endpoint);
      })
      .then(function remember(result) {
        var nextCache = elevationCache();
        nextCache[key] = result;
        writeJson(ELEVATION_CACHE_KEY, nextCache);
        return result;
      })
      .finally(function clearRequest() {
        elevationRequests.delete(key);
      });

    elevationRequests.set(key, request);
    return request;
  }

  function physicalEndpoint(path, side, walksById) {
    var id = side === "from" ? path.feedingSiteId : path.receivingSiteId;
    var walk = walksById.get(String(id));

    if (!walk || walk.isVirtual) {
      return null;
    }

    return {
      siteId: String(walk.id),
      name: clean(walk.name, walk.id),
      role: side === "from" ? "From" : "To",
      input: side === "from" ? "Primary feed" : "Off-air antenna",
      lat: Number(walk.lat),
      lng: Number(walk.lng),
      elevationM: numberOrNull(walk.elevationM),
      elevationSource: clean(walk.elevationSource, "")
    };
  }

  function servicesFor(path) {
    var count = Math.max(1, Number(path.bundleCount) || 1);
    var service = clean(path.serviceType, "dtt").toUpperCase();
    var services = [];

    for (var index = 1; index <= count; index += 1) {
      services.push({ type: service, name: service + " MUX " + index });
    }

    return services;
  }

  function pathModel(path, cluster, walksById) {
    var from = physicalEndpoint(path, "from", walksById);
    var to = physicalEndpoint(path, "to", walksById);

    if (!from || !to) {
      return null;
    }

    var straightDistanceKm = distanceKm(from, to);
    var azimuth = bearingDegrees(from, to);

    return {
      id: clean(path.id, from.siteId + "--" + to.siteId),
      clusterId: clean(path.clusterId, cluster && cluster.id),
      serviceType: clean(path.serviceType, "dtt").toLowerCase(),
      status: "Active",
      from: from,
      to: to,
      distanceKm: straightDistanceKm,
      frequency: clean(path.frequency, "—"),
      channel: clean(path.labelText, clean(path.serviceType, "DTT").toUpperCase()),
      bandwidth: clean(path.bandwidth, "—"),
      serviceCount: (Number(path.bundleCount) || 1) + " multiplexes",
      services: servicesFor(path),
      metrics: [
        { label: "Path length", value: distanceText(straightDistanceKm) },
        { label: "Azimuth", value: azimuth.toFixed(1) + "°" },
        { label: "Route", value: clean(path.routeType, "primary") }
      ]
    };
  }

  function enrichPath(path) {
    return Promise.all([
      resolveElevation(path.from).catch(function unavailable() { return null; }),
      resolveElevation(path.to).catch(function unavailable() { return null; })
    ]).then(function apply(results) {
      var next = JSON.parse(JSON.stringify(path));

      if (results[0]) {
        next.from.elevationM = results[0].elevationM;
        next.from.elevationSource = results[0].source;
      }

      if (results[1]) {
        next.to.elevationM = results[1].elevationM;
        next.to.elevationSource = results[1].source;
      }

      return next;
    });
  }

  function savePath(path) {
    window.ATLAS_RF_SELECTED_PATH = path;
    writeJson(PATH_STORAGE_KEY, path);
  }

  function openRfPath(path) {
    savePath(path);
    var query = new URLSearchParams({
      path: path.id,
      scene: "mount-a_b-comp-scene"
    });
    window.location.href = RF_PAGE_URL + "?" + query.toString();
  }

  function textElement(tag, className, text) {
    var element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function popupCard(path) {
    var card = document.createElement("article");
    card.className = "osmmaps-path-link-card";
    card.dataset.pathId = path.id;

    var header = document.createElement("header");
    header.appendChild(textElement("small", "", path.serviceType.toUpperCase() + " path"));
    header.appendChild(textElement("strong", "", path.from.name + " → " + path.to.name));

    var summary = textElement("p", "osmmaps-path-link-summary", distanceText(path.distanceKm));
    var details = document.createElement("div");
    details.className = "osmmaps-path-link-details";
    details.hidden = true;
    details.innerHTML = [
      '<div><span>From elevation</span><strong data-path-from-elevation>', elevationText(path.from.elevationM), '</strong></div>',
      '<div><span>To elevation</span><strong data-path-to-elevation>', elevationText(path.to.elevationM), '</strong></div>',
      '<div><span>Straight line</span><strong>', distanceText(path.distanceKm), '</strong></div>'
    ].join("");

    var actions = document.createElement("div");
    actions.className = "osmmaps-path-link-actions";
    var detailsButton = textElement("button", "osmmaps-path-link-button is-details", "Details");
    detailsButton.type = "button";
    var viewButton = textElement("button", "osmmaps-path-link-button is-view", "View path");
    viewButton.type = "button";
    actions.append(detailsButton, viewButton);

    card.append(header, summary, details, actions);

    var enrichedPath = path;
    var elevationPromise = null;

    function loadElevations() {
      if (!elevationPromise) {
        elevationPromise = enrichPath(path).then(function updated(next) {
          enrichedPath = next;
          var fromOutput = card.querySelector("[data-path-from-elevation]");
          var toOutput = card.querySelector("[data-path-to-elevation]");
          if (fromOutput) fromOutput.textContent = elevationText(next.from.elevationM);
          if (toOutput) toOutput.textContent = elevationText(next.to.elevationM);
          savePath(next);
          return next;
        });
      }
      return elevationPromise;
    }

    detailsButton.addEventListener("click", function showDetails(event) {
      event.preventDefault();
      event.stopPropagation();
      details.hidden = !details.hidden;
      detailsButton.textContent = details.hidden ? "Details" : "Hide details";
      if (!details.hidden) {
        loadElevations();
      }
    });

    viewButton.addEventListener("click", function viewPath(event) {
      event.preventDefault();
      event.stopPropagation();
      savePath(enrichedPath);
      openRfPath(enrichedPath);
    });

    return card;
  }

  function showPopup(path, latlng) {
    var map = mapInstance();
    if (!map || !window.L) {
      return;
    }

    window.L.popup({
      className: "osmmaps-path-link-popup",
      maxWidth: 330,
      closeButton: true,
      autoPan: true
    })
      .setLatLng(latlng || map.getCenter())
      .setContent(popupCard(path))
      .openOn(map);
  }

  function ensureLayer() {
    var map = mapInstance();
    if (!map || !window.L) {
      return null;
    }

    if (!layer) {
      if (!map.getPane("fieldopsPathLinks")) {
        var pane = map.createPane("fieldopsPathLinks");
        pane.style.zIndex = "455";
        pane.style.pointerEvents = "auto";
      }
      layer = window.L.layerGroup().addTo(map);
    }

    return layer;
  }

  function selectedClusters(regions, detail) {
    var region = (regions || []).find(function sameRegion(item) {
      return String(item.id) === String(detail.regionId);
    });
    var clusters = region && region.serviceClusters && region.serviceClusters[detail.serviceType];
    var ids = new Set((detail.clusterIds || []).map(String));

    return Array.isArray(clusters)
      ? clusters.filter(function chosen(cluster) { return ids.has(String(cluster.id)); })
      : [];
  }

  function renderLinks(detail) {
    var targetLayer = ensureLayer();
    var api = mapApi();

    if (!targetLayer || !api || typeof api.getWalks !== "function") {
      return;
    }

    targetLayer.clearLayers();

    loadRegions().then(function addLinks(regions) {
      var walks = api.getWalks();
      var walksById = new Map(walks.map(function pair(walk) {
        return [String(walk.id), walk];
      }));

      selectedClusters(regions, detail).forEach(function eachCluster(cluster) {
        (cluster.paths || []).forEach(function eachPath(path) {
          var model = pathModel(path, cluster, walksById);

          if (!model) {
            return;
          }

          var hitLine = window.L.polyline([
            [model.from.lat, model.from.lng],
            [model.to.lat, model.to.lng]
          ], {
            pane: "fieldopsPathLinks",
            color: "#ffffff",
            opacity: 0.001,
            weight: 24,
            lineCap: "round",
            interactive: true,
            bubblingMouseEvents: false,
            className: "osmmaps-path-link-hit"
          });

          hitLine.on("click", function pathClicked(event) {
            if (event.originalEvent) {
              window.L.DomEvent.stopPropagation(event.originalEvent);
            }
            showPopup(model, event.latlng);
          });

          hitLine.addTo(targetLayer);
        });
      });
    }).catch(function pathLinksError(error) {
      console.warn("FieldOps path links could not load", error);
    });
  }

  function clearLinks() {
    if (layer) {
      layer.clearLayers();
    }
  }

  function init() {
    window.addEventListener("fieldops:map-service-cluster-selected", function clusterSelected(event) {
      var detail = event && event.detail;
      if (!detail || !Array.isArray(detail.clusterIds) || !detail.clusterIds.length) {
        clearLinks();
        return;
      }
      renderLinks(detail);
    });

    document.addEventListener("change", function clusterCheckboxChanged(event) {
      if (!event.target.closest("[data-map-cluster]")) return;
      window.setTimeout(function clearIfEmpty() {
        if (!document.querySelector("[data-map-cluster]:checked")) clearLinks();
      }, 0);
    });

    document.addEventListener("click", function regionChanged(event) {
      if (event.target.closest("[data-region-id]")) clearLinks();
    });
  }

  window.FieldOpsMapPathLinks = Object.freeze({
    VERSION: VERSION,
    distanceKm: distanceKm,
    resolveElevation: resolveElevation,
    renderLinks: renderLinks,
    clear: clearLinks
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
