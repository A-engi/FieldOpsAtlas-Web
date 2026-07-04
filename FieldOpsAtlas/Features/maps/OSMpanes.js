/* ==========================================================================
   FieldOps Atlas OSM panes and map controls
   File: FieldOpsAtlas/Features/maps/OSMpanes.js
   Version: 1.0.4-map-controls
   Purpose:
   - Own Leaflet popup and selected-walk pane markup.
   - Own temporary region-loaded toast and edit forms.
   - Own quick-tool buttons, service picker, cluster checkbox UI, and weather panel UI.
   - Emit service and cluster selections to OSMmaps.js.
   - Ask the weather data module for forecast data and render it.
   ========================================================================== */

(function fieldOpsOSMpanes() {
  "use strict";

  var VERSION = "1.0.4-map-controls";
  var TOOLBAR_STORAGE_KEY = "fieldops.maps.quick-tools.collapsed";
  var TOOLBAR_COLLAPSED_CLASS = "is-collapsed";
  var controlHandlers = {
    onServiceOpen: null,
    onClusterChange: null
  };
  var controlsBound = false;
  var activeServiceId = "";

  var copySvg = [
    '<span class="osmpanes-copy-icon" aria-hidden="true">',
    '<svg viewBox="0 0 24 24" focusable="false">',
    '<rect x="8" y="8" width="11" height="11" rx="2"></rect>',
    '<path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path>',
    '</svg>',
    '</span>'
  ].join("");

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

  function valueOrFallback(value, fallback) {
    var text = String(value == null ? "" : value).trim();
    return text || fallback;
  }

  function asList(value) {
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
      return value.split(/[,;\n]/).map(function splitLine(item) {
        return item.trim();
      }).filter(Boolean);
    }

    return [];
  }

  function editMode() {
    if (window.FieldOpsEditor && typeof window.FieldOpsEditor.getMode === "function") {
      return window.FieldOpsEditor.getMode();
    }

    return "offline";
  }

  function modePillHtml() {
    var mode = editMode();
    return '<span class="osmpanes-mode-pill" data-mode="' + escapeHtml(mode) + '">' + escapeHtml(mode) + '</span>';
  }

  function formatCoordinates(walk) {
    var lat = Number(walk && walk.lat);
    var lng = Number(walk && walk.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return "No coordinates recorded.";
    }

    return "(" + lat.toFixed(7) + ", " + lng.toFixed(7) + ")";
  }

  function listHtml(items, fallback) {
    var list = asList(items);

    if (!list.length) {
      return '<p class="osmpanes-line">' + escapeHtml(fallback) + '</p>';
    }

    return '<ul class="osmpanes-list">' + list.map(function renderItem(item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join("") + '</ul>';
  }

  function accessControlLines(walk) {
    var access = walk && walk.accessControl && typeof walk.accessControl === "object"
      ? walk.accessControl
      : {};

    return [
      access.summary || walk.accessNotes ? "Summary: " + (access.summary || walk.accessNotes) : "",
      access.keys ? "Keys: " + access.keys : "",
      access.gate ? "Gate/barrier: " + access.gate : "",
      access.cctv ? "CCTV: " + access.cctv : "",
      access.parking ? "Parking: " + access.parking : "",
      access.contact ? "Access contact: " + access.contact : ""
    ].filter(function onlyText(item) {
      return String(item || "").trim();
    });
  }

  function sectionHtml(title, bodyHtml) {
    return [
      '<section class="osmpanes-section">',
      '<h3 class="osmpanes-section-title">', escapeHtml(title), '</h3>',
      bodyHtml,
      '</section>'
    ].join("");
  }

  function copyRowHtml(label, value) {
    return sectionHtml(label, [
      '<div class="osmpanes-copy-row">',
      '<span class="osmpanes-value">', escapeHtml(value), '</span>',
      '<button class="osmpanes-icon-button" type="button" data-copy-value="',
      escapeHtml(value),
      '" aria-label="Copy ', escapeHtml(label), '">',
      copySvg,
      '</button>',
      '</div>'
    ].join(""));
  }

  function popupHtml(walk) {
    return [
      '<article class="osmpanes-popup">',
      '<h2 class="osmpanes-popup-title">', escapeHtml(walk.name), '</h2>',
      '<div class="osmpanes-popup-actions">',
      '<button class="osmpanes-popup-button" type="button" data-open-details="',
      escapeHtml(walk.id),
      '">Details</button>',
      '<button class="osmpanes-popup-button" type="button" data-edit-walk="',
      escapeHtml(walk.id),
      '">Edit</button>',
      '</div>',
      '</article>'
    ].join("");
  }

  function emptyPaneHtml() {
    return [
      '<div class="osmpanes-title-row">',
      '<p class="osmpanes-empty">Pick a region to load walks.</p>',
      '<button class="osmpanes-button" type="button" data-region-open>Region</button>',
      '</div>'
    ].join("");
  }

  function regionToastHtml(region, walkCount) {
    return [
      '<div class="osmpanes-title-row">',
      '<div>',
      '<h2 class="osmpanes-title">', escapeHtml(region.name), '</h2>',
      '<p class="osmpanes-subtitle">', Number(walkCount || 0), ' walks loaded</p>',
      '</div>',
      modePillHtml(),
      '</div>'
    ].join("");
  }

  function collapsedWalkHtml(walk) {
    return [
      '<div class="osmpanes-title-row osmpanes-title-row--three">',
      '<h2 class="osmpanes-title">', escapeHtml(walk.name), '</h2>',
      '<button class="osmpanes-button" type="button" data-expand-details="',
      escapeHtml(walk.id),
      '">Expand</button>',
      '<button class="osmpanes-button osmpanes-button--quiet" type="button" data-close-pane>Close</button>',
      '</div>'
    ].join("");
  }

  function regionSectionHtml(region) {
    if (!region) {
      return sectionHtml("Region", '<p class="osmpanes-line">No region recorded.</p>');
    }

    return sectionHtml("Region", [
      '<p class="osmpanes-line">', escapeHtml(region.name), '</p>',
      region.notes ? '<p class="osmpanes-line">' + escapeHtml(region.notes) + '</p>' : "",
      region.id ? '<p class="osmpanes-line">ID: ' + escapeHtml(region.id) + '</p>' : ""
    ].join(""));
  }

  function hasWalkthrough(walkthrough) {
    return Boolean(
      walkthrough &&
      typeof walkthrough === "object" &&
      (
        String(walkthrough.type || "").trim() ||
        String(walkthrough.url || "").trim() ||
        String(walkthrough.notes || "").trim()
      )
    );
  }

  function optionalExtraSections(walk) {
    var sections = [];

    if (asList(walk.inputs).length) {
      sections.push(sectionHtml("Inputs", listHtml(walk.inputs, "No inputs recorded.")));
    }

    if (asList(walk.equipment).length) {
      sections.push(sectionHtml("Equipment", listHtml(walk.equipment, "No equipment recorded.")));
    }

    if (hasWalkthrough(walk.walkthrough)) {
      sections.push(sectionHtml("Walkthrough", [
        walk.walkthrough.type ? '<p class="osmpanes-line">Type: ' + escapeHtml(walk.walkthrough.type) + '</p>' : "",
        walk.walkthrough.url ? '<p class="osmpanes-line">URL: ' + escapeHtml(walk.walkthrough.url) + '</p>' : "",
        walk.walkthrough.notes ? '<p class="osmpanes-line">' + escapeHtml(walk.walkthrough.notes) + '</p>' : ""
      ].join("")));
    }

    return sections.join("");
  }

  function detailsPaneHtml(walk, region, options) {
    var coordinates = formatCoordinates(walk);
    var what3words = valueOrFallback(walk.what3words, "No w3w recorded.");
    var accessLines = accessControlLines(walk);
    var notes = valueOrFallback(walk.notes || walk.description, "No notes recorded.");
    var weatherText = valueOrFallback(options && options.weatherText, "Weather not loaded.");
    var alerts = walk.alerts && walk.alerts.length ? walk.alerts : [];

    return [
      '<article>',
      '<div class="osmpanes-title-row osmpanes-title-row--three">',
      '<h2 class="osmpanes-title">', escapeHtml(walk.name), '</h2>',
      modePillHtml(),
      '<button class="osmpanes-button osmpanes-button--quiet" type="button" data-close-pane>Close</button>',
      '</div>',
      '<div class="osmpanes-grid">',
      regionSectionHtml(region),
      copyRowHtml("Coordinates", coordinates),
      copyRowHtml("w3w", what3words),
      sectionHtml(
        "Access control",
        accessLines.length
          ? listHtml(accessLines, "No access control recorded.")
          : '<p class="osmpanes-line">No access control recorded.</p>'
      ),
      sectionHtml("Location identifiers", listHtml([
        walk.address ? "Address: " + walk.address : "",
        walk.gridRef ? "Grid: " + walk.gridRef : "",
        coordinates
      ], "No location identifiers recorded.")),
      sectionHtml("Services", listHtml(walk.services, "No services recorded.")),
      optionalExtraSections(walk),
      sectionHtml("Weather", [
        '<div class="osmpanes-actions">',
        '<button class="osmpanes-button" type="button" data-load-weather="',
        escapeHtml(walk.id),
        '">Load weather</button>',
        '<p class="osmpanes-weather-output" data-site-weather-output>',
        escapeHtml(weatherText),
        '</p>',
        '</div>'
      ].join("")),
      sectionHtml("Alerts", listHtml(alerts, "No active alerts.")),
      sectionHtml("Notes", '<p class="osmpanes-line">' + escapeHtml(notes) + '</p>'),
      sectionHtml("Site reporting", [
        '<p class="osmpanes-line">Overgrowth, blocked route, damage and vehicle scratches are condition reports, not access notes.</p>',
        '<p class="osmpanes-line"><a href="../Docs/site-reporting.html">Open site reporting</a></p>'
      ].join("")),
      '<div class="osmpanes-actions">',
      '<button class="osmpanes-button" type="button" data-collapse-details="',
      escapeHtml(walk.id),
      '">Collapse</button>',
      '<button class="osmpanes-button" type="button" data-edit-walk="',
      escapeHtml(walk.id),
      '">Edit</button>',
      '</div>',
      '</div>',
      '</article>'
    ].join("");
  }

  function fieldHtml(name, label, value, full, textarea) {
    var tag = textarea ? "textarea" : "input";
    var fullClass = full ? " osmpanes-edit-field--full" : "";
    var attrs = textarea ? "" : ' type="text"';

    return [
      '<label class="osmpanes-edit-field', fullClass, '">',
      '<span>', escapeHtml(label), '</span>',
      '<', tag, attrs, ' name="', escapeHtml(name), '">',
      textarea ? escapeHtml(value || "") + '</textarea>' : escapeHtml(value || "") + '</input>',
      '</label>'
    ].join("").replace(/<input([^>]*)>(.*?)<\/input>/g, '<input$1 value="$2">');
  }

  function editPaneHtml(walk, region, statusText) {
    var walkthrough = walk.walkthrough || {};
    var access = walk.accessControl || {};

    return [
      '<article>',
      '<div class="osmpanes-title-row osmpanes-title-row--three">',
      '<h2 class="osmpanes-title">Edit ', escapeHtml(walk.name), '</h2>',
      modePillHtml(),
      '<button class="osmpanes-button osmpanes-button--quiet" type="button" data-edit-cancel="',
      escapeHtml(walk.id),
      '">Close</button>',
      '</div>',
      '<form class="osmpanes-edit-form" data-edit-form data-walk-id="',
      escapeHtml(walk.id),
      '" data-region-id="',
      escapeHtml(region ? region.id : walk.regionId),
      '">',
      '<p class="osmpanes-edit-note" data-edit-status>', escapeHtml(statusText || ""), '</p>',
      '<div class="osmpanes-edit-grid">',
      fieldHtml("name", "Name", walk.name, true, false),
      fieldHtml("siteType", "Type", walk.siteType, false, false),
      fieldHtml("status", "Status", walk.status, false, false),
      fieldHtml("lat", "Latitude", walk.lat, false, false),
      fieldHtml("lng", "Longitude", walk.lng, false, false),
      fieldHtml("what3words", "w3w", walk.what3words, true, false),
      fieldHtml("gridRef", "Grid ref", walk.gridRef, true, false),
      fieldHtml("address", "Address", walk.address, true, true),
      fieldHtml("accessSummary", "Access summary", access.summary || walk.accessNotes, true, true),
      fieldHtml("accessKeys", "Keys / fob / Tile", access.keys, true, true),
      fieldHtml("accessGate", "Gate / barrier / lock", access.gate, true, true),
      fieldHtml("accessCctv", "CCTV / access monitoring", access.cctv, true, true),
      fieldHtml("accessParking", "Parking / vehicle position", access.parking, true, true),
      fieldHtml("accessContact", "Access contact", access.contact, true, true),
      fieldHtml("services", "Services", asList(walk.services).join("\\n"), true, true),
      fieldHtml("alerts", "Alerts", asList(walk.alerts).join("\\n"), true, true),
      fieldHtml("inputs", "Inputs", asList(walk.inputs).join("\\n"), true, true),
      fieldHtml("equipment", "Equipment", asList(walk.equipment).join("\\n"), true, true),
      fieldHtml("walkthroughType", "Walkthrough type", walkthrough.type, false, false),
      fieldHtml("walkthroughUrl", "Walkthrough URL", walkthrough.url, false, false),
      fieldHtml("walkthroughNotes", "Walkthrough notes", walkthrough.notes, true, true),
      fieldHtml("description", "Description", walk.description, true, true),
      fieldHtml("notes", "Notes", walk.notes, true, true),
      '</div>',
      '<div class="osmpanes-edit-actions">',
      '<button class="osmpanes-button" type="submit" data-edit-save>Save</button>',
      '<button class="osmpanes-button osmpanes-button--danger" type="button" data-edit-delete="',
      escapeHtml(walk.id),
      '">Delete</button>',
      '<button class="osmpanes-button osmpanes-button--quiet" type="button" data-edit-cancel="',
      escapeHtml(walk.id),
      '">Cancel</button>',
      '</div>',
      '</form>',
      '</article>'
    ].join("");
  }

  function render(panel, mode, html) {
    if (!panel) {
      return;
    }

    panel.hidden = false;
    panel.dataset.paneMode = mode;
    panel.innerHTML = html;
  }

  function hide(panel) {
    if (!panel) {
      return;
    }

    panel.hidden = true;
    panel.removeAttribute("data-pane-mode");
    panel.innerHTML = "";
  }

  function renderEmpty(panel) {
    render(panel, "empty", emptyPaneHtml());
  }

  function renderRegionToast(panel, region, walkCount) {
    if (!region) {
      renderEmpty(panel);
      return;
    }

    render(panel, "toast", regionToastHtml(region, walkCount));
  }

  function renderCollapsed(panel, walk) {
    if (!walk) {
      renderEmpty(panel);
      return;
    }

    render(panel, "collapsed", collapsedWalkHtml(walk));
  }

  function renderDetails(panel, walk, region, options) {
    if (!walk) {
      renderEmpty(panel);
      return;
    }

    render(panel, "details", detailsPaneHtml(walk, region, options || {}));
  }

  function renderEdit(panel, walk, region, statusText) {
    if (!walk) {
      renderEmpty(panel);
      return;
    }

    render(panel, "edit", editPaneHtml(walk, region, statusText));
  }

  function setSiteWeatherText(message) {
    var output = qs("[data-site-weather-output]");
    if (output) {
      output.textContent = message;
    }
  }

  function setEditStatus(message) {
    var output = qs("[data-edit-status]");
    if (output) {
      output.textContent = message;
    }
  }

  function copyText(value) {
    var text = String(value || "");

    if (!text) {
      return Promise.resolve(false);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function copied() {
        return true;
      });
    }

    var input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.top = "-1000px";
    document.body.appendChild(input);
    input.select();

    try {
      document.execCommand("copy");
      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    } finally {
      input.remove();
    }
  }

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

  function setServiceHeading(serviceId, title) {
    var kicker = qs("[data-map-service-kicker]");
    var heading = qs("[data-map-service-title]");

    if (kicker) {
      kicker.textContent = String(serviceId || "service").toUpperCase();
    }

    if (heading) {
      heading.textContent = title || "Choose one or more clusters";
    }
  }

  function setServiceStatus(message, warning) {
    var output = qs("[data-map-service-status]");

    if (output) {
      output.textContent = message || "";
      output.classList.toggle("is-warning", Boolean(warning));
    }
  }

  function renderServiceLoading(message) {
    var options = qs("[data-map-service-options]");

    if (options) {
      options.innerHTML = "";
    }

    setServiceStatus(message || "Loading clusters...");
  }

  function renderServiceClusters(result) {
    var options = qs("[data-map-service-options]");
    var clusters = result && Array.isArray(result.clusters) ? result.clusters : [];
    var selected = new Set((result && result.selectedIds ? result.selectedIds : []).map(String));
    var serviceId = String(result && result.serviceId ? result.serviceId : activeServiceId);

    if (!options) {
      return;
    }

    if (!clusters.length) {
      options.innerHTML = "";
      setServiceStatus(
        Number(result && result.siteCount || 0) + " " +
        serviceId.toUpperCase() +
        " sites. No clusters are configured."
      );
      return;
    }

    options.innerHTML = clusters.map(function clusterCheckbox(cluster) {
      var checked = selected.has(String(cluster.id));

      return [
        '<label class="map-service-cluster', checked ? ' is-selected' : '', '">',
        '<input class="map-service-cluster__checkbox" type="checkbox" data-map-cluster="',
        escapeHtml(cluster.id),
        '" data-map-service-id="',
        escapeHtml(serviceId),
        '"',
        checked ? ' checked' : '',
        '>',
        '<span class="map-service-cluster__body">',
        '<strong>', escapeHtml(cluster.name), '</strong>',
        '<span>', escapeHtml(cluster.siteCount || (cluster.siteIds || []).length), ' sites</span>',
        '</span>',
        '</label>'
      ].join("");
    }).join("");

    setServiceStatus(
      result && result.status
        ? result.status
        : Number(result && result.siteCount || 0) + " " +
          serviceId.toUpperCase() +
          " sites. Tick one or more clusters.",
      Boolean(result && result.warning)
    );
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
    var id = String(serviceId || "");

    if (!picker || !id) {
      return;
    }

    if (!picker.hidden && picker.dataset.activeService === id) {
      closeServicePicker();
      return;
    }

    setWeatherPanelOpen(false);
    setActiveService(id);
    setServiceHeading(id, "Choose one or more clusters");
    showServicePicker(id);
    renderServiceLoading("Loading " + id.toUpperCase() + " clusters...");

    if (typeof controlHandlers.onServiceOpen !== "function") {
      setServiceStatus("Map controls are not ready.");
      return;
    }

    Promise.resolve(controlHandlers.onServiceOpen(id))
      .then(renderServiceClusters)
      .catch(function serviceOpenError(error) {
        setServiceStatus(error.message || "Could not load service clusters.");
      });
  }

  function selectedClusterIds(serviceId) {
    return qsa(
      'input[data-map-cluster][data-map-service-id="' +
      String(serviceId || "") +
      '"]:checked'
    ).map(function checkboxId(checkbox) {
      return String(checkbox.getAttribute("data-map-cluster") || "");
    }).filter(Boolean);
  }

  function changeClusterSelection(serviceId) {
    var selectedIds = selectedClusterIds(serviceId);

    qsa('input[data-map-cluster][data-map-service-id="' + serviceId + '"]').forEach(function syncRow(checkbox) {
      var row = checkbox.closest(".map-service-cluster");
      if (row) {
        row.classList.toggle("is-selected", checkbox.checked);
      }
    });

    if (typeof controlHandlers.onClusterChange !== "function") {
      return;
    }

    setServiceStatus("Updating selected clusters...");

    Promise.resolve(controlHandlers.onClusterChange(serviceId, selectedIds))
      .then(renderServiceClusters)
      .catch(function clusterChangeError(error) {
        setServiceStatus(error.message || "Could not update selected clusters.");
      });
  }

  function setWeatherPanelOpen(open) {
    var panel = qs(".weather-api-panel");

    if (panel) {
      panel.hidden = !open;
    }

    qsa("[data-weather-panel-open]").forEach(function syncButton(button) {
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setWeatherStatus(message) {
    var output = qs("[data-weather-output]");
    if (output) {
      output.textContent = message || "";
    }
  }

  function setWeatherUpdated(message) {
    var output = qs("[data-weather-forecast-updated]");
    if (output) {
      output.textContent = message || "";
    }
  }

  function renderForecastPlaceholder(message) {
    var track = qs("[data-weather-forecast-track]");

    if (!track) {
      return;
    }

    track.innerHTML = [
      '<article class="weather-forecast-card weather-forecast-card-placeholder" role="listitem">',
      escapeHtml(message || "Tap Activate."),
      '</article>'
    ].join("");
  }

  function formatDay(dateText) {
    var date = new Date(String(dateText || "") + "T12:00:00");

    if (Number.isNaN(date.getTime())) {
      return String(dateText || "");
    }

    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  }

  function renderForecast(data) {
    var track = qs("[data-weather-forecast-track]");
    var days = data && Array.isArray(data.days) ? data.days : [];

    if (!track || !days.length) {
      throw new Error("Forecast data is unavailable.");
    }

    track.innerHTML = days.map(function renderDay(day) {
      return [
        '<article class="weather-forecast-card" role="listitem">',
        '<strong>', escapeHtml(formatDay(day.date)), '</strong>',
        '<span>', escapeHtml(day.summary), '</span>',
        '<span>', escapeHtml(day.minimumC), '-', escapeHtml(day.maximumC), ' C</span>',
        '<span>Rain ', escapeHtml(Number(day.rainMm || 0).toFixed(1)), ' mm</span>',
        '<span>Wind ', escapeHtml(day.windKmh), ' km/h</span>',
        '</article>'
      ].join("");
    }).join("");

    setWeatherUpdated("Updated now");
    setWeatherStatus("Loaded.");
  }

  function activateWeatherPreview() {
    var weather = window.FieldOpsOSMWeatherMenu;

    if (!weather || typeof weather.loadSelectedRegionForecast !== "function") {
      setWeatherStatus("Weather data module is unavailable.");
      return;
    }

    setWeatherUpdated("Loading");
    setWeatherStatus("Loading...");
    renderForecastPlaceholder("Loading...");

    weather.loadSelectedRegionForecast()
      .then(renderForecast)
      .catch(function weatherPreviewError(error) {
        setWeatherUpdated("Not loaded");
        setWeatherStatus(error.message || "Preview unavailable.");
        renderForecastPlaceholder("Preview unavailable. Try again from the map weather panel.");
      });
  }

  function copyButtonClick(copyButton) {
    copyText(copyButton.getAttribute("data-copy-value")).then(function copied() {
      copyButton.setAttribute("aria-label", copied ? "Copied" : "Copy failed");
      copyButton.dataset.copied = copied ? "true" : "false";

      window.setTimeout(function resetCopyLabel() {
        copyButton.removeAttribute("data-copied");
      }, 900);
    });
  }

  function bindDocumentControls() {
    if (controlsBound) {
      return;
    }

    controlsBound = true;

    document.addEventListener("click", function onDocumentClick(event) {
      var copyButton = event.target.closest("[data-copy-value]");
      var toolbarToggle = event.target.closest("[data-map-quick-toggle]");
      var serviceButton = event.target.closest("[data-map-service]");
      var serviceClose = event.target.closest("[data-map-service-close]");
      var weatherOpen = event.target.closest("[data-weather-panel-open]");
      var weatherClose = event.target.closest("[data-weather-panel-close]");
      var weatherActivate = event.target.closest("[data-weather-activate]");

      if (copyButton) {
        copyButtonClick(copyButton);
        return;
      }

      if (toolbarToggle) {
        event.preventDefault();
        event.stopPropagation();
        var toolbar = qs("[data-map-quick-tools]");
        setToolbarCollapsed(
          toolbar && !toolbar.classList.contains(TOOLBAR_COLLAPSED_CLASS)
        );
        return;
      }

      if (serviceButton) {
        event.preventDefault();
        event.stopPropagation();
        openServicePicker(serviceButton.getAttribute("data-map-service"));
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
        activateWeatherPreview();
      }
    }, false);

    document.addEventListener("change", function onDocumentChange(event) {
      var checkbox = event.target.closest(".map-service-cluster__checkbox[data-map-cluster]");

      if (!checkbox) {
        return;
      }

      event.stopPropagation();
      changeClusterSelection(checkbox.getAttribute("data-map-service-id"));
    });

    document.addEventListener("keydown", function onDocumentKeydown(event) {
      if (event.key === "Escape") {
        closeServicePicker();
        setWeatherPanelOpen(false);
      }
    });
  }

  function bindMapControls(handlers) {
    controlHandlers = Object.assign({}, controlHandlers, handlers || {});
    bindDocumentControls();
  }

  function init() {
    setToolbarCollapsed(readToolbarCollapsed(), false);
    renderForecastPlaceholder("Tap Activate preview.");
    bindDocumentControls();

    qsa("[data-weather-panel-open]").forEach(function initWeatherButton(button) {
      button.setAttribute("aria-expanded", "false");
    });

    qsa("[data-map-service]").forEach(function initServiceButton(button) {
      button.setAttribute("aria-expanded", "false");
    });
  }

  window.FieldOpsOSMpanes = {
    VERSION: VERSION,
    version: VERSION,
    popupHtml: popupHtml,
    renderEmpty: renderEmpty,
    renderRegionToast: renderRegionToast,
    renderCollapsed: renderCollapsed,
    renderDetails: renderDetails,
    renderEdit: renderEdit,
    setWeatherText: setSiteWeatherText,
    setSiteWeatherText: setSiteWeatherText,
    setEditStatus: setEditStatus,
    formatCoordinates: formatCoordinates,
    hide: hide,
    bindMapControls: bindMapControls,
    renderServiceClusters: renderServiceClusters,
    setServiceStatus: setServiceStatus,
    openServicePicker: openServicePicker,
    closeServicePicker: closeServicePicker,
    setWeatherPanelOpen: setWeatherPanelOpen,
    renderForecast: renderForecast,
    collapseTools: function collapseTools() {
      setToolbarCollapsed(true);
    },
    expandTools: function expandTools() {
      setToolbarCollapsed(false);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());
