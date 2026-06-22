/* ==========================================================================
   FieldOps Atlas Met Office warnings
   File: FieldOpsAtlas/Features/Weather/metoffice-warning.js
   Version: 1.0.2-map-warning-alerts
   Purpose:
   - Load official Met Office UK or regional severe-weather RSS warnings.
   - Link the warning feed to the currently selected Atlas map region.
   - Render warning summaries in the maps weather panel with Met Office links.
   - Show active warnings as a compact map badge and Weather-button badge.
   - Add the selected-region warning to the existing site Details > Alerts section.
   - Fall back to the UK feed when the selected region has no explicit mapping.
   ========================================================================== */

(function fieldOpsMetOfficeWarning() {
  "use strict";

  var VERSION = "1.0.2-map-warning-alerts";
  var CACHE_MS = 10 * 60 * 1000;
  var REGION_STORAGE_KEY = "fieldops-osmmaps-selected-region-v1";
  var WARNING_PAGE_URL =
    "https://weather.metoffice.gov.uk/warnings-and-advice/uk-warnings";
  var FEED_BASE =
    "https://weather.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/";
  var cache = new Map();
  var lastContext = null;
  var lastItems = [];
  var detailsObserver = null;
  var detailsRendering = false;

  var FEEDS = {
    UK: { code: "UK", label: "United Kingdom" },
    os: { code: "os", label: "Orkney & Shetland" },
    he: { code: "he", label: "Highlands & Eilean Siar" },
    gr: { code: "gr", label: "Grampian" },
    st: { code: "st", label: "Strathclyde" },
    ta: { code: "ta", label: "Central, Tayside & Fife" },
    dg: { code: "dg", label: "SW Scotland, Lothian Borders" },
    ni: { code: "ni", label: "Northern Ireland" },
    wl: { code: "wl", label: "Wales" },
    nw: { code: "nw", label: "North West England" },
    ne: { code: "ne", label: "North East England" },
    yh: { code: "yh", label: "Yorkshire & Humber" },
    wm: { code: "wm", label: "West Midlands" },
    em: { code: "em", label: "East Midlands" },
    ee: { code: "ee", label: "East of England" },
    sw: { code: "sw", label: "South West England" },
    se: { code: "se", label: "London & South East England" }
  };

  var ATLAS_REGION_FEEDS = {
    preseli: "wl",
    wenvoe: "wl"
  };

  var NAME_RULES = [
    { code: "os", pattern: /\b(orkney|shetland)\b/i },
    { code: "he", pattern: /\b(highlands?|eilean siar|western isles)\b/i },
    { code: "gr", pattern: /\b(grampian|aberdeen|aberdeenshire|moray)\b/i },
    { code: "st", pattern: /\b(strathclyde|glasgow|argyll|ayrshire)\b/i },
    { code: "ta", pattern: /\b(tayside|fife|perth|dundee|stirling)\b/i },
    { code: "dg", pattern: /\b(lothian|borders|dumfries|galloway|edinburgh)\b/i },
    { code: "ni", pattern: /\b(northern ireland|ulster|belfast)\b/i },
    {
      code: "wl",
      pattern:
        /\b(wales|welsh|preseli|wenvoe|cardiff|swansea|pembroke|ceredigion|carmarthen|newport|powys|gwynedd)\b/i
    },
    {
      code: "nw",
      pattern:
        /\b(north west england|cumbria|lancashire|manchester|merseyside|cheshire)\b/i
    },
    {
      code: "ne",
      pattern: /\b(north east england|northumberland|tyne|durham|tees)\b/i
    },
    { code: "yh", pattern: /\b(yorkshire|humber)\b/i },
    {
      code: "wm",
      pattern:
        /\b(west midlands|birmingham|shropshire|staffordshire|worcestershire|warwickshire|herefordshire)\b/i
    },
    {
      code: "em",
      pattern:
        /\b(east midlands|derby|nottingham|leicester|lincoln|northampton|rutland)\b/i
    },
    {
      code: "ee",
      pattern:
        /\b(east of england|norfolk|suffolk|essex|cambridge|hertford|bedford)\b/i
    },
    {
      code: "sw",
      pattern:
        /\b(south west england|cornwall|devon|somerset|dorset|bristol|gloucester|wiltshire)\b/i
    },
    {
      code: "se",
      pattern:
        /\b(london|south east england|kent|surrey|sussex|hampshire|oxford|buckingham|berkshire)\b/i
    }
  ];

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  function safeLocalGet(key) {
    try {
      return window.localStorage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }

  function selectedRegionId() {
    var selectedButton = qs('[data-region-id][aria-pressed="true"]');

    if (selectedButton) {
      return String(selectedButton.getAttribute("data-region-id") || "").trim();
    }

    return String(safeLocalGet(REGION_STORAGE_KEY) || "").trim();
  }

  function selectedRegionRecord() {
    var maps = window.FieldOpsOSMmaps;
    var regionId = selectedRegionId();
    var regions = maps && typeof maps.getRegions === "function"
      ? maps.getRegions()
      : [];
    var region = regions.find(function findRegion(item) {
      return String(item && item.id || "") === regionId;
    });

    return {
      id: regionId,
      name: String(region && region.name || regionId || "Selected region"),
      source: region || null
    };
  }

  function normaliseFeedCode(value) {
    var candidate = String(value || "").trim();
    var lower = candidate.toLowerCase();

    if (candidate === "UK" || lower === "uk") {
      return "UK";
    }

    return FEEDS[lower] ? lower : "";
  }

  function explicitFeedCode(region) {
    var source = region && region.source;
    var candidate;

    if (!source) {
      return "";
    }

    candidate =
      source.metOfficeWarningRegion ||
      source.weatherWarningRegion ||
      source.warningRegion ||
      "";

    return normaliseFeedCode(candidate);
  }

  function inferredFeedCode(region) {
    var regionId = String(region && region.id || "").toLowerCase();
    var regionName = String(region && region.name || "");
    var knownCode = ATLAS_REGION_FEEDS[regionId];
    var matchingRule;

    if (knownCode) {
      return knownCode;
    }

    matchingRule = NAME_RULES.find(function findRule(rule) {
      return rule.pattern.test(regionName + " " + regionId);
    });

    return matchingRule ? matchingRule.code : "UK";
  }

  function selectedWarningRegion() {
    var region = selectedRegionRecord();
    var code = explicitFeedCode(region) || inferredFeedCode(region);
    var feed = FEEDS[code] || FEEDS.UK;

    return {
      atlasId: region.id,
      atlasName: region.name,
      code: feed.code,
      label: feed.label,
      feedUrl: FEED_BASE + feed.code,
      warningPageUrl: WARNING_PAGE_URL
    };
  }

  function textFrom(node, selector) {
    var element = node && node.querySelector(selector);
    return element ? String(element.textContent || "").trim() : "";
  }

  function plainText(html) {
    var documentValue = new DOMParser().parseFromString(
      "<body>" + String(html || "") + "</body>",
      "text/html"
    );

    return String(documentValue.body.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function severityFrom(title) {
    var match = String(title || "").match(/\b(red|amber|yellow)\b/i);
    return match ? match[1].toLowerCase() : "general";
  }

  function parseWarningFeed(xmlText) {
    var xml = new DOMParser().parseFromString(xmlText, "application/xml");
    var parserError = xml.querySelector("parsererror");

    if (parserError) {
      throw new Error("Met Office warning feed returned invalid XML.");
    }

    return qsa("item", xml).map(function mapItem(item) {
      var title = textFrom(item, "title");
      var description = plainText(textFrom(item, "description"));
      var link = textFrom(item, "link");

      return {
        title: title || "Met Office weather warning",
        description: description,
        link: link || WARNING_PAGE_URL,
        published: textFrom(item, "pubDate"),
        severity: severityFrom(title)
      };
    });
  }

  function fetchWarningFeed(context) {
    return fetch(context.feedUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml"
      }
    }).then(function handleResponse(response) {
      if (!response.ok) {
        throw new Error("Met Office warning feed unavailable.");
      }

      return response.text();
    }).then(parseWarningFeed);
  }

  function setText(selector, value) {
    qsa(selector).forEach(function update(element) {
      element.textContent = value;
    });
  }

  function setOfficialLink(url) {
    qsa("[data-metoffice-warning-link]").forEach(function update(link) {
      link.href = url || WARNING_PAGE_URL;
    });
  }

  function clearWarnings() {
    qsa("[data-metoffice-warning-list]").forEach(function clear(list) {
      list.replaceChildren();
    });
  }

  function severityRank(severity) {
    return {
      general: 0,
      yellow: 1,
      amber: 2,
      red: 3
    }[String(severity || "general")] || 0;
  }

  function highestSeverity(items) {
    return (items || []).reduce(function chooseHighest(current, item) {
      var candidate = String(item && item.severity || "general");
      return severityRank(candidate) > severityRank(current)
        ? candidate
        : current;
    }, "general");
  }

  function severityLabel(severity) {
    var value = String(severity || "general");
    return value === "general"
      ? "Weather"
      : value.charAt(0).toUpperCase() + value.slice(1);
  }

  function applySeverityClass(element, severity) {
    if (!element) {
      return;
    }

    element.classList.remove(
      "is-general",
      "is-yellow",
      "is-amber",
      "is-red"
    );
    element.classList.add("is-" + String(severity || "general"));
  }

  function setElementHidden(element, hidden) {
    if (!element) {
      return;
    }

    element.hidden = Boolean(hidden);
  }

  function updateMapAndButtonWarnings(context, items) {
    var activeItems = Array.isArray(items) ? items : [];
    var active = activeItems.length > 0;
    var severity = highestSeverity(activeItems);
    var severityText = severityLabel(severity);
    var mapBadge = qs("[data-metoffice-warning-map]");
    var buttonBadge = qs("[data-metoffice-warning-button]");
    var weatherButton = qs(".map-quick-tool.is-weather");
    var mapLabel = qs("[data-metoffice-warning-map-label]");
    var description = active
      ? activeItems.length +
        " active " +
        severityText.toLowerCase() +
        " Met Office warning" +
        (activeItems.length === 1 ? "" : "s") +
        " for " +
        context.atlasName
      : "No active Met Office warning for " + context.atlasName;

    if (mapBadge) {
      applySeverityClass(mapBadge, severity);
      setElementHidden(mapBadge, !active);
      mapBadge.setAttribute("aria-label", description + ". Open Weather.");
      mapBadge.title = description;
    }

    if (mapLabel) {
      mapLabel.textContent = severityText + " warning";
    }

    if (buttonBadge) {
      applySeverityClass(buttonBadge, severity);
      setElementHidden(buttonBadge, !active);
      buttonBadge.textContent = "⚠";
      buttonBadge.title = description;
    }

    if (weatherButton) {
      weatherButton.setAttribute(
        "aria-label",
        active
          ? "Open selected region weather forecast. " + description + "."
          : "Open selected region weather forecast"
      );
    }
  }

  function detailsAlertsSection() {
    return qsa("[data-selected-panel] .osmpanes-section").find(
      function findAlertsSection(section) {
        var title = qs(".osmpanes-section-title", section);
        return title && String(title.textContent || "").trim() === "Alerts";
      }
    ) || null;
  }

  function removeDetailsWarning() {
    qsa("[data-metoffice-details-alert]").forEach(function remove(element) {
      element.remove();
    });
  }

  function createDetailsWarning(context, item, count) {
    var container = document.createElement("div");
    var iconWrap = document.createElement("span");
    var weatherIcon = document.createElement("img");
    var warningIcon = document.createElement("span");
    var content = document.createElement("span");
    var heading = document.createElement("strong");
    var link = document.createElement("a");
    var severity = String(item && item.severity || "general");
    var severityText = severityLabel(severity);

    container.className =
      "metoffice-details-alert is-" + severity;
    container.setAttribute("data-metoffice-details-alert", "");

    iconWrap.className = "metoffice-details-alert__icons";

    weatherIcon.src = "../../../data/icons/weather.svg?v=1.1.1";
    weatherIcon.alt = "";
    weatherIcon.setAttribute("aria-hidden", "true");

    warningIcon.className = "metoffice-details-alert__warning-icon";
    warningIcon.setAttribute("aria-hidden", "true");
    warningIcon.textContent = "⚠";

    iconWrap.appendChild(weatherIcon);
    iconWrap.appendChild(warningIcon);

    content.className = "metoffice-details-alert__content";

    heading.textContent =
      severityText +
      " weather warning" +
      (count > 1 ? " · " + count + " active" : "");

    link.href = item.link || WARNING_PAGE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent =
      String(item.title || "Open Met Office warning") +
      " · " +
      context.atlasName;

    content.appendChild(heading);
    content.appendChild(link);

    container.appendChild(iconWrap);
    container.appendChild(content);

    return container;
  }

  function renderDetailsWarning(context, items) {
    var section;
    var title;
    var activeItems = Array.isArray(items) ? items : [];

    if (detailsRendering) {
      return;
    }

    detailsRendering = true;

    try {
      removeDetailsWarning();

      if (!activeItems.length) {
        return;
      }

      section = detailsAlertsSection();

      if (!section) {
        return;
      }

      title = qs(".osmpanes-section-title", section);
      section.insertBefore(
        createDetailsWarning(context, activeItems[0], activeItems.length),
        title ? title.nextSibling : section.firstChild
      );
    } finally {
      detailsRendering = false;
    }
  }

  function renderSurfaceWarnings(context, items) {
    lastContext = context;
    lastItems = Array.isArray(items) ? items.slice() : [];
    updateMapAndButtonWarnings(context, lastItems);
    renderDetailsWarning(context, lastItems);
  }

  function observeDetailsPanel() {
    var panel = qs("[data-selected-panel]");

    if (!panel || detailsObserver) {
      return;
    }

    detailsObserver = new MutationObserver(function handleDetailsMutation() {
      if (detailsRendering || !lastContext) {
        return;
      }

      window.requestAnimationFrame(function rerenderDetailsWarning() {
        renderDetailsWarning(lastContext, lastItems);
      });
    });

    detailsObserver.observe(panel, {
      childList: true,
      subtree: true
    });
  }

  function createWarningItem(item) {
    var article = document.createElement("article");
    var title = document.createElement("strong");
    var description = document.createElement("p");
    var link = document.createElement("a");

    article.className =
      "metoffice-warning-item is-" + String(item.severity || "general");

    title.textContent = item.title;
    article.appendChild(title);

    if (item.description) {
      description.textContent = item.description;
      article.appendChild(description);
    }

    link.href = item.link || WARNING_PAGE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open this warning on the Met Office website";
    article.appendChild(link);

    return article;
  }

  function renderWarnings(context, items) {
    clearWarnings();
    setText(
      "[data-metoffice-warning-region]",
      context.atlasName + " · " + context.label
    );
    setOfficialLink(context.warningPageUrl);
    renderSurfaceWarnings(context, items);

    if (!items.length) {
      setText(
        "[data-metoffice-warning-status]",
        "No active warning was returned for " + context.label + "."
      );
      return;
    }

    setText(
      "[data-metoffice-warning-status]",
      items.length +
        " active Met Office warning" +
        (items.length === 1 ? "" : "s") +
        " for " +
        context.label +
        "."
    );

    qsa("[data-metoffice-warning-list]").forEach(function update(list) {
      items.slice(0, 3).forEach(function append(item) {
        list.appendChild(createWarningItem(item));
      });
    });
  }

  function renderUnavailable(context) {
    clearWarnings();
    renderSurfaceWarnings(context, []);
    setText(
      "[data-metoffice-warning-region]",
      context.atlasName + " · " + context.label
    );
    setText(
      "[data-metoffice-warning-status]",
      "The live feed could not be loaded in this browser. Open the official " +
        context.label +
        " warnings."
    );
    setOfficialLink(context.warningPageUrl);
  }

  function loadSelectedRegionWarnings(force) {
    var context = selectedWarningRegion();
    var cached = cache.get(context.code);

    setText(
      "[data-metoffice-warning-region]",
      context.atlasName + " · " + context.label
    );
    setText(
      "[data-metoffice-warning-status]",
      "Checking Met Office warnings for " + context.label + "…"
    );
    setOfficialLink(context.warningPageUrl);
    renderSurfaceWarnings(context, []);

    if (!force && cached && Date.now() - cached.time < CACHE_MS) {
      renderWarnings(context, cached.items);
      return Promise.resolve(cached.items);
    }

    return fetchWarningFeed(context)
      .then(function handleWarnings(items) {
        cache.set(context.code, {
          time: Date.now(),
          items: items
        });
        renderWarnings(context, items);
        return items;
      })
      .catch(function handleError(error) {
        console.warn("Met Office warning feed unavailable", error);
        renderUnavailable(context);
        return [];
      });
  }

  function wireControls() {
    document.addEventListener("click", function handleClick(event) {
      if (event.target.closest("[data-weather-panel-open]")) {
        window.setTimeout(function loadAfterPanelOpen() {
          loadSelectedRegionWarnings(false);
        }, 0);
        return;
      }

      if (event.target.closest("[data-metoffice-warning-refresh]")) {
        loadSelectedRegionWarnings(true);
        return;
      }

      if (event.target.closest("[data-region-id]")) {
        window.setTimeout(function reloadAfterRegionSelection() {
          loadSelectedRegionWarnings(false);
        }, 200);
      }
    });
  }

  function init() {
    var context = selectedWarningRegion();

    wireControls();
    observeDetailsPanel();
    setText(
      "[data-metoffice-warning-region]",
      context.atlasName + " · " + context.label
    );
    setOfficialLink(context.warningPageUrl);
    renderSurfaceWarnings(context, []);

    window.setTimeout(function initialWarningLoad() {
      loadSelectedRegionWarnings(false);
    }, 250);

    window.FieldOpsMetOfficeWarning = {
      VERSION: VERSION,
      version: VERSION,
      loadSelectedRegionWarnings: loadSelectedRegionWarnings,
      selectedWarningRegion: selectedWarningRegion
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}());

/* Destination: FieldOpsAtlas/Features/Weather/metoffice-warning.js */
/* End of file: FieldOpsAtlas/Features/Weather/metoffice-warning.js | bottom/end of file */
