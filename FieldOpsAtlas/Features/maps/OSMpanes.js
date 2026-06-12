/* ==========================================================================
   FieldOps Atlas OSM panes
   File: FieldOpsAtlas/Features/maps/OSMpanes.js
   Version: 1.0.2
   Purpose:
   - Own Leaflet popup markup.
   - Own collapsed and expanded selected-walk details pane markup.
   - Own temporary region-loaded toast markup.
   - Own details copy buttons.
   - Own coming soon panel for buttons without a real action yet.
   ========================================================================== */

(function fieldOpsOSMpanes() {
  "use strict";

  var copySvg = [
    '<span class="osmpanes-copy-icon" aria-hidden="true">',
    '<svg viewBox="0 0 24 24" focusable="false">',
    '<rect x="8" y="8" width="11" height="11" rx="2"></rect>',
    '<path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path>',
    '</svg>',
    '</span>'
  ].join("");

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
      return value
        .map(function mapItem(item) {
          if (typeof item === "string") {
            return item.trim();
          }

          if (item && typeof item === "object") {
            return String(item.name || item.label || item.title || item.service || item.id || "").trim();
          }

          return "";
        })
        .filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      return value.split(/[,;\n]/).map(function splitLine(item) {
        return item.trim();
      }).filter(Boolean);
    }

    return [];
  }

  function hasWalkthrough(walkthrough) {
    if (!walkthrough || typeof walkthrough !== "object") {
      return false;
    }

    return Boolean(
      String(walkthrough.type || "").trim() ||
      String(walkthrough.url || "").trim() ||
      String(walkthrough.notes || "").trim()
    );
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

  function sectionHtml(title, bodyHtml) {
    return [
      '<section class="osmpanes-section">',
      '<h3 class="osmpanes-section-title">',
      escapeHtml(title),
      '</h3>',
      bodyHtml,
      '</section>'
    ].join("");
  }

  function copyRowHtml(label, value) {
    return sectionHtml(label, [
      '<div class="osmpanes-copy-row">',
      '<span class="osmpanes-value">',
      escapeHtml(value),
      '</span>',
      '<button class="osmpanes-icon-button" type="button" data-copy-value="',
      escapeHtml(value),
      '" aria-label="Copy ',
      escapeHtml(label),
      '">',
      copySvg,
      '</button>',
      '</div>'
    ].join(""));
  }

  function popupHtml(walk) {
    return [
      '<article class="osmpanes-popup">',
      '<h2 class="osmpanes-popup-title">',
      escapeHtml(walk.name),
      '</h2>',
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
      '<h2 class="osmpanes-title">',
      escapeHtml(region.name),
      '</h2>',
      '<p class="osmpanes-subtitle">',
      Number(walkCount || 0),
      ' walks loaded',
      '</p>',
      '</div>',
      '<button class="osmpanes-button" type="button" data-region-open>Region</button>',
      '</div>'
    ].join("");
  }

  function collapsedWalkHtml(walk) {
    return [
      '<div class="osmpanes-title-row osmpanes-title-row--three">',
      '<h2 class="osmpanes-title">',
      escapeHtml(walk.name),
      '</h2>',
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
      '<p class="osmpanes-line">',
      escapeHtml(region.name),
      '</p>',
      region.notes ? '<p class="osmpanes-line">' + escapeHtml(region.notes) + '</p>' : "",
      region.id ? '<p class="osmpanes-line">ID: ' + escapeHtml(region.id) + '</p>' : ""
    ].join(""));
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
    var accessLines = [
      walk.accessNotes,
      walk.address,
      walk.gridRef ? "Grid: " + walk.gridRef : ""
    ].filter(function onlyText(item) {
      return String(item || "").trim();
    });
    var notes = valueOrFallback(walk.notes || walk.description, "No notes recorded.");
    var weatherText = valueOrFallback(options && options.weatherText, "Weather not loaded.");
    var alerts = walk.alerts && walk.alerts.length ? walk.alerts : [];

    return [
      '<article>',
      '<div class="osmpanes-title-row osmpanes-title-row--three">',
      '<h2 class="osmpanes-title">',
      escapeHtml(walk.name),
      '</h2>',
      '<button class="osmpanes-button" type="button" data-collapse-details="',
      escapeHtml(walk.id),
      '">Collapse</button>',
      '<button class="osmpanes-button osmpanes-button--quiet" type="button" data-close-pane>Close</button>',
      '</div>',
      '<div class="osmpanes-grid">',
      regionSectionHtml(region),
      copyRowHtml("Coordinates", coordinates),
      copyRowHtml("w3w", what3words),
      sectionHtml("Access info", accessLines.length ? listHtml(accessLines, "No access info recorded.") : '<p class="osmpanes-line">No access info recorded.</p>'),
      sectionHtml("Services", listHtml(walk.services, "No services recorded.")),
      optionalExtraSections(walk),
      sectionHtml("Weather", [
        '<div class="osmpanes-actions">',
        '<button class="osmpanes-button" type="button" data-load-weather="',
        escapeHtml(walk.id),
        '">Weather</button>',
        '<p class="osmpanes-weather-output" data-weather-output>',
        escapeHtml(weatherText),
        '</p>',
        '</div>'
      ].join("")),
      sectionHtml("Alerts", listHtml(alerts, "No active alerts.")),
      sectionHtml("Notes", '<p class="osmpanes-line">' + escapeHtml(notes) + '</p>'),
      '</div>',
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

  function setWeatherText(message) {
    var output = document.querySelector("[data-weather-output]");
    if (output) {
      output.textContent = message;
    }
  }

  function ensureComingSoonPanel() {
    var panel = document.querySelector("[data-coming-soon-panel]");

    if (panel) {
      return panel;
    }

    panel = document.createElement("section");
    panel.className = "osmpanes-coming-soon";
    panel.setAttribute("data-coming-soon-panel", "");
    panel.hidden = true;
    panel.innerHTML = [
      '<button class="osmpanes-coming-soon__backdrop" type="button" data-coming-soon-close aria-label="Close coming soon"></button>',
      '<article class="osmpanes-coming-soon__card" role="dialog" aria-modal="true" aria-label="Coming soon">',
      '<h2 class="osmpanes-coming-soon__title" data-coming-soon-title>Coming soon</h2>',
      '<p class="osmpanes-coming-soon__text" data-coming-soon-text>This action is not wired yet.</p>',
      '<button class="osmpanes-button" type="button" data-coming-soon-close>Close</button>',
      '</article>'
    ].join("");

    document.body.appendChild(panel);
    return panel;
  }

  function showComingSoon(label) {
    var panel = ensureComingSoonPanel();
    var title = panel.querySelector("[data-coming-soon-title]");
    var text = panel.querySelector("[data-coming-soon-text]");
    var cleanLabel = valueOrFallback(label, "This action");

    if (title) {
      title.textContent = cleanLabel;
    }

    if (text) {
      text.textContent = cleanLabel + " is coming soon.";
    }

    panel.hidden = false;
  }

  function hideComingSoon() {
    var panel = document.querySelector("[data-coming-soon-panel]");
    if (panel) {
      panel.hidden = true;
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

  document.addEventListener("click", function onDocumentClick(event) {
    var copyButton = event.target.closest("[data-copy-value]");
    var comingSoonClose = event.target.closest("[data-coming-soon-close]");

    if (copyButton) {
      copyText(copyButton.getAttribute("data-copy-value")).then(function copied() {
        copyButton.setAttribute("aria-label", copied ? "Copied" : "Copy failed");
        copyButton.dataset.copied = copied ? "true" : "false";

        window.setTimeout(function resetCopyLabel() {
          copyButton.removeAttribute("data-copied");
        }, 900);
      });
    }

    if (comingSoonClose) {
      hideComingSoon();
    }
  });

  window.FieldOpsOSMpanes = {
    popupHtml: popupHtml,
    renderEmpty: renderEmpty,
    renderRegionToast: renderRegionToast,
    renderCollapsed: renderCollapsed,
    renderDetails: renderDetails,
    setWeatherText: setWeatherText,
    formatCoordinates: formatCoordinates,
    showComingSoon: showComingSoon,
    hideComingSoon: hideComingSoon,
    hide: hide
  };
}());
