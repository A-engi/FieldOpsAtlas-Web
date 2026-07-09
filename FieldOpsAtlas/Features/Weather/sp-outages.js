/* ==========================================================================
   FieldOps Atlas - SP Energy Networks outage map
   File: FieldOpsAtlas/Features/Weather/sp-outages.js
   Version: 0.3.0-live-spen
   ========================================================================== */

(() => {
  "use strict";

  const DATA_URL = "data/outages/spen.geojson";
  const STATUS_URL = "data/outages/status.json";
  const MAP_VIEW_KEY = "fieldops-weather-map-view-v1";
  const SPEN_BOUNDS = L.latLngBounds([
    [52.8, -5.6],
    [56.3, -1.7]
  ]);
  const CATEGORY_COLOURS = {
    current: "#f04438",
    planned: "#f6b73c",
    restored: "#8193a4"
  };

  const storedView = readMapView();
  const map = L.map("spOutageMap", {
    center: storedView?.center || [54.55, -3.15],
    zoom: storedView?.zoom || 6,
    zoomControl: false,
    attributionControl: true
  });
  const markerLayer = L.layerGroup().addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
  if (!storedView) map.fitBounds(SPEN_BOUNDS, { padding: [20, 20] });
  map.on("moveend zoomend", rememberMapView);
  window.FieldOpsWeatherMap = {
    remember: rememberMapView,
    invalidate: () => window.setTimeout(() => map.invalidateSize({ pan: false }), 80)
  };
  window.addEventListener("fieldops:weather-shell-resize", window.FieldOpsWeatherMap.invalidate);

  const elements = {
    headline: document.getElementById("spHeadlineStatus"),
    livePill: document.getElementById("spLivePill"),
    current: document.getElementById("spCurrentCount"),
    planned: document.getElementById("spPlannedCount"),
    restored: document.getElementById("spRestoredCount"),
    list: document.getElementById("spIncidentList"),
    note: document.getElementById("spOutageNote"),
    refresh: document.getElementById("refreshSpOutages")
  };

  function setLoading() {
    elements.livePill.textContent = "Loading";
    elements.livePill.className = "weather-live-pill sp-outage-live-pill";
    elements.headline.textContent = "Loading live SPEN outage data";
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
      // Default bounds remain available.
    }

    return null;
  }

  function rememberMapView() {
    try {
      const center = map.getCenter();
      window.sessionStorage.setItem(MAP_VIEW_KEY, JSON.stringify({
        center: [center.lat, center.lng],
        zoom: map.getZoom()
      }));
    } catch {
      // Session storage is optional.
    }
  }

  async function loadOutages() {
    setLoading();

    try {
      const [collection, status] = await Promise.all([
        fetchJson(cacheBust(DATA_URL)),
        fetchJson(cacheBust(STATUS_URL)).catch(() => null)
      ]);
      const features = Array.isArray(collection?.features)
        ? collection.features.filter(hasPoint)
        : [];
      const providerStatus = status?.providers?.spen || null;

      render(features, collection, providerStatus);
    } catch (error) {
      elements.livePill.textContent = "Error";
      elements.livePill.classList.add("is-error");
      elements.headline.textContent = "SPEN outage data failed to load";
      elements.note.textContent = error.message || "Unable to load SPEN outage data.";
      elements.list.innerHTML = "";
      markerLayer.clearLayers();
      map.fitBounds(SPEN_BOUNDS, { padding: [20, 20] });
    }
  }

  async function fetchJson(url) {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} loading ${url}`);
    }

    return response.json();
  }

  function render(features, collection, providerStatus) {
    markerLayer.clearLayers();

    const counts = countCategories(features);
    const officialCurrent =
      providerStatus?.feeds?.find((feed) => feed.id === "live")?.officialCount;
    const displayCurrent = Number.isFinite(Number(officialCurrent))
      ? Number(officialCurrent)
      : counts.current;

    elements.current.textContent = String(displayCurrent);
    elements.planned.textContent = String(counts.planned);
    elements.restored.textContent = String(counts.restored);

    const stale = Boolean(collection?.stale || providerStatus?.stale);
    const state = providerStatus?.state || (features.length ? "live" : "empty");
    const generatedAt = collection?.generatedAt || providerStatus?.generatedAt;

    elements.livePill.textContent = stale
      ? "Stale"
      : state === "live"
        ? "Live"
        : humaniseState(state);
    elements.livePill.className = `weather-live-pill sp-outage-live-pill is-${statusClass(stale ? "stale" : state)}`;
    elements.headline.textContent =
      `${displayCurrent} current SPEN fault${displayCurrent === 1 ? "" : "s"}`;
    elements.note.textContent = generatedAt
      ? `Last updated ${formatDate(generatedAt)} from SPEN live outage data.`
      : "SPEN live outage data loaded.";

    features.forEach((feature) => {
      markerLayer.addLayer(buildMarker(feature));
    });

    if (features.length) {
      map.fitBounds(L.geoJSON(features).getBounds(), { padding: [36, 36] });
    } else {
      map.fitBounds(SPEN_BOUNDS, { padding: [20, 20] });
    }

    renderList(features);
  }

  function buildMarker(feature) {
    const [lon, lat] = feature.geometry.coordinates;
    const properties = feature.properties || {};
    const category = properties.category || "current";
    const colour = CATEGORY_COLOURS[category] || CATEGORY_COLOURS.current;
    const affected = Number(properties.affectedPostcodes || properties.rawRecordCount || 1);
    const ringSize = Math.min(54, 22 + Math.max(0, affected) * 1.4);

    const marker = L.marker([lat, lon], {
      icon: L.divIcon({
        className: "sp-outage-marker-shell",
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        html: `<span class="sp-outage-marker-ring" style="--sp-outage-colour:${colour};--sp-outage-ring-size:${ringSize}px"></span><span class="sp-outage-marker-core" style="--sp-outage-colour:${colour}"></span>`
      })
    });

    marker.bindPopup(popupHtml(properties));
    return marker;
  }

  function popupHtml(properties) {
    return `
      <div class="sp-outage-popup">
        <strong>${escapeHtml(properties.area || "SPEN incident")}</strong>
        <span class="sp-outage-popup-status">${escapeHtml(properties.status || "Power cut")}</span>
        <span>${escapeHtml(properties.reference || "No reference published")}</span>
        <span>${escapeHtml(postcodeSummary(properties))}</span>
        ${properties.restoreAt ? `<span>Estimated restore ${escapeHtml(formatDate(properties.restoreAt))}</span>` : ""}
        <a href="${escapeAttribute(properties.officialUrl || "https://powercuts.spenergynetworks.co.uk/map")}" target="_blank" rel="noopener">Open official SPEN map</a>
      </div>
    `;
  }

  function renderList(features) {
    const sorted = [...features].sort((first, second) =>
      String(second.properties?.startedAt || "").localeCompare(
        String(first.properties?.startedAt || "")
      )
    );

    if (!sorted.length) {
      elements.list.innerHTML = `
        <div class="sp-outage-empty">
          <strong>No SPEN incidents in the collected dataset</strong>
          <span>The map is ready and will render markers as soon as the collector publishes them.</span>
        </div>
      `;
      return;
    }

    elements.list.innerHTML = sorted
      .map((feature) => {
        const properties = feature.properties || {};
        const category = properties.category || "current";
        return `
          <article class="sp-outage-row is-${escapeAttribute(category)}">
            <span class="sp-outage-row-dot"></span>
            <div>
              <strong>${escapeHtml(properties.area || "SPEN incident")}</strong>
              <small>${escapeHtml(properties.reference || "")} ${escapeHtml(postcodeSummary(properties))}</small>
            </div>
            <span>${escapeHtml(properties.status || category)}</span>
          </article>
        `;
      })
      .join("");
  }

  function postcodeSummary(properties) {
    const affected = Number(properties.affectedPostcodes || 0);
    const postcode = properties.postcode || "";

    if (affected > 0) {
      return `${affected} postcode${affected === 1 ? "" : "s"} affected${postcode ? ` near ${postcode}` : ""}`;
    }

    return postcode ? `Near ${postcode}` : "Affected postcodes published by SPEN";
  }

  function countCategories(features) {
    return features.reduce(
      (counts, feature) => {
        const category = feature?.properties?.category;
        const key = ["current", "planned", "restored"].includes(category)
          ? category
          : "current";
        counts[key] += 1;
        return counts;
      },
      { current: 0, planned: 0, restored: 0 }
    );
  }

  function statusClass(state) {
    if (["source failure", "authentication required", "unavailable", "error"].includes(state)) {
      return "error";
    }
    return String(state || "empty").replace(/\s+/g, "-");
  }

  function humaniseState(state) {
    return String(state || "empty")
      .replace(/(^|\s)\w/g, (match) => match.toUpperCase());
  }

  function hasPoint(feature) {
    const coordinates = feature?.geometry?.coordinates;
    return (
      feature?.geometry?.type === "Point" &&
      Array.isArray(coordinates) &&
      Number.isFinite(Number(coordinates[0])) &&
      Number.isFinite(Number(coordinates[1]))
    );
  }

  function cacheBust(url) {
    return `${url}?v=${Date.now()}`;
  }

  function formatDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value || "");

    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return map[character];
    });
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  elements.refresh.addEventListener("click", loadOutages);
  window.addEventListener("resize", () => {
    window.setTimeout(() => map.invalidateSize(), 120);
  });

  loadOutages();

  window.FieldOpsSpOutages = {
    loadOutages
  };
})();
