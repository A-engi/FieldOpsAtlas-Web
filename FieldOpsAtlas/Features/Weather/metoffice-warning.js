(function fieldOpsMetOfficeWarning() {
  "use strict";

  var VERSION = "1.0.7-active-warning-only";
  var CACHE_MS = 10 * 60 * 1000;
  var REGION_STORAGE_KEY = "fieldops-osmmaps-selected-region-v1";
  var WARNING_PAGE_URL =
    "https://weather.metoffice.gov.uk/warnings-and-advice/uk-warnings";
  var FEED_BASE =
    "https://weather.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/";

  var cache = new Map();
  var lastContext = null;
  var lastItems = [];
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
    "west-wales": "wl",
    "south-wales": "wl"
  };

  var NAME_RULES = [
    { code: "os", pattern: /\b(orkney|shetland)\b/i },
    { code: "he", pattern: /\b(highlands?|eilean siar|western isles)\b/i },
    { code: "gr", pattern: /\b(grampian|aberdeen|aberdeenshire|moray)\b/i },
    { code: "st", pattern: /\b(strathclyde|glasgow|argyll|ayrshire)\b/i },
    { code: "ta", pattern: /\b(tayside|fife|perth|dundee|stirling)\b/i },
    { code: "dg", pattern: /\b(lothian|borders|dumfries|galloway|edinburgh)\b/i },
    { code: "ni", pattern: /\b(northern ireland|ulster|belfast)\b/i },
    { code: "wl", pattern: /\b(wales|welsh)\b/i },
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
    })
      .then(function handleResponse(response) {
        if (!response.ok) {
          throw new Error("Met Office warning feed unavailable.");
        }

        return response.text();
      })
      .then(parseWarningFeed);
  }

  function setText(selector, value) {
    qsa(selector).forEach(function update(element) {
      element.textContent = value;
    });
  }

  function setHidden(selector, hidden) {
    qsa(selector).forEach(function update(element) {
      element.hidden = Boolean(hidden);
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

  function resetWeatherButton() {
    qsa("[data-metoffice-warning-button]").forEach(function resetBadge(badge) {
      applySeverityClass(badge, "general");
      badge.hidden = true;
      badge.textContent = "";
      badge.removeAttribute("title");
    });

    qsa(".map-weather-active-label").forEach(function resetLabel(label) {
      label.hidden = true;
    });

    qsa("[data-weather-panel-open]").forEach(function resetButton(button) {
      button.classList.remove("has-weather-warning");
      button.setAttribute(
        "aria-label",
        "Open selected region weather forecast"
      );
      button.removeAttribute("title");
    });
  }

  function updateWeatherButtonWarnings(context, items) {
    var activeItems = Array.isArray(items) ? items : [];
    var severity;
    var description;

    if (!activeItems.length) {
      resetWeatherButton();
      return;
    }

    severity = highestSeverity(activeItems);
    description =
      activeItems.length +
      " active " +
      severityLabel(severity).toLowerCase() +
      " Met Office warning" +
      (activeItems.length === 1 ? "" : "s") +
      " for " +
      context.atlasName;

    qsa("[data-metoffice-warning-button]").forEach(function updateBadge(badge) {
      applySeverityClass(badge, severity);
      badge.hidden = false;
      badge.textContent = "⚠";
      badge.title = description;
    });

    qsa(".map-weather-active-label").forEach(function updateLabel(label) {
      label.hidden = false;
    });

    qsa("[data-weather-panel-open]").forEach(function updateButton(button) {
      button.classList.add("has-weather-warning");
      button.setAttribute(
        "aria-label",
        "Open selected region weather forecast. " + description + "."
      );
      button.title = description;
    });
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

  function removeEmptyAlertsFallback(section) {
    var removed = false;

    qsa(".osmpanes-line", section).forEach(function removeFallback(line) {
      if (
        String(line.textContent || "").trim().toLowerCase() ===
        "no active alerts."
      ) {
        line.remove();
        removed = true;
      }
    });

    if (removed) {
      section.dataset.metofficeRemovedEmptyAlert = "true";
    }
  }

  function restoreEmptyAlertsFallback(section) {
    var title;
    var line;

    if (
      !section ||
      section.dataset.metofficeRemovedEmptyAlert !== "true"
    ) {
      return;
    }

    if (
      qsa(".osmpanes-line", section).some(function hasFallback(item) {
        return String(item.textContent || "").trim().toLowerCase() ===
          "no active alerts.";
      })
    ) {
      delete section.dataset.metofficeRemovedEmptyAlert;
      return;
    }

    title = qs(".osmpanes-section-title", section);
    line = document.createElement("p");
    line.className = "osmpanes-line";
    line.textContent = "No active alerts.";

    section.insertBefore(
      line,
      title ? title.nextSibling : section.firstChild
    );
    delete section.dataset.metofficeRemovedEmptyAlert;
  }

  function createDetailsWarning(context, item, count) {
    var container = document.createElement("div");
    var iconWrap = document.createElement("span");
    var weatherIcon = document.createElement("img");
    var warningIcon = document.createElement("span");
    var content = document.createElement("span");
    var heading = document.createElement("strong");
    var reasonText = document.createElement("span");
    var link = document.createElement("a");
    var severity = String(item && item.severity || "general");

    container.className = "metoffice-details-alert is-" + severity;
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
      severityLabel(severity) +
      " weather warning" +
      (count > 1 ? " · " + count + " active" : "");

    reasonText.className = "metoffice-details-alert__reason";
    reasonText.textContent =
      String(item.description || "").trim() ||
      "An active Met Office warning applies to " + context.label + ".";

    link.href = item.link || WARNING_PAGE_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = String(item.title || "Open Met Office warning");

    content.appendChild(heading);
    content.appendChild(reasonText);
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

    section = detailsAlertsSection();

    if (!section) {
      return;
    }

    detailsRendering = true;

    try {
      removeDetailsWarning();

      if (!activeItems.length) {
        restoreEmptyAlertsFallback(section);
        return;
      }

      removeEmptyAlertsFallback(section);
      title = qs(".osmpanes-section-title", section);
      section.insertBefore(
        createDetailsWarning(context, activeItems[0], activeItems.length),
        title ? title.nextSibling : section.firstChild
      );
    } finally {
      detailsRendering = false;
    }
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
    link.textContent = "Open warning";
    article.appendChild(link);

    return article;
  }

  function renderWarningCard(context, items) {
    var activeItems = Array.isArray(items) ? items : [];

    clearWarnings();
    setText(
      "[data-metoffice-warning-region]",
      context.atlasName + " · " + context.label
    );
    setOfficialLink(context.warningPageUrl);

    if (!activeItems.length) {
      setHidden("[data-metoffice-warning-card]", true);
      setText("[data-metoffice-warning-status]", "No active warnings.");
      return;
    }

    setHidden("[data-metoffice-warning-card]", false);
    setText(
      "[data-metoffice-warning-status]",
      activeItems.length +
        " active warning" +
        (activeItems.length === 1 ? "" : "s") +
        "."
    );

    qsa("[data-metoffice-warning-list]").forEach(function update(list) {
      activeItems.slice(0, 3).forEach(function append(item) {
        list.appendChild(createWarningItem(item));
      });
    });
  }

  function renderWarnings(context, items) {
    lastContext = context;
    lastItems = Array.isArray(items) ? items.slice() : [];

    updateWeatherButtonWarnings(context, lastItems);
    renderWarningCard(context, lastItems);
    renderDetailsWarning(context, lastItems);
  }

  function renderUnavailable(context) {
    renderWarnings(context, []);
  }

  function loadSelectedRegionWarnings(force) {
    var context = selectedWarningRegion();
    var cached = cache.get(context.code);

    if (!force && cached && Date.now() - cached.time < CACHE_MS) {
      renderWarnings(context, cached.items);
      return Promise.resolve(cached.items);
    }

    resetWeatherButton();
    setHidden("[data-metoffice-warning-card]", true);

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
      if (
        event.target.closest("[data-open-details]") ||
        event.target.closest("[data-expand-details]")
      ) {
        window.setTimeout(function addWarningToDetails() {
          renderDetailsWarning(
            lastContext || selectedWarningRegion(),
            lastItems
          );
        }, 120);
      }

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
    }, true);
  }

  function init() {
    resetWeatherButton();
    setHidden("[data-metoffice-warning-card]", true);
    wireControls();

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
