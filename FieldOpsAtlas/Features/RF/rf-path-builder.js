/* ===========================================================================
   FieldOps Atlas RF path builder
   File: FieldOpsAtlas/Features/RF/rf-path-builder.js
   Version: 1.1.116-generic-demo-builder

   Purpose:
   - Build a compact generic Path Details demo from available RF page/source data.
   - Use generic Site 1 / Site 2 labels so demo data is not confused with real data.
   - Count current/future source records without exposing real site/service/equipment names.
   - Leave the future site-pack file/model for a later build.
   - Leave pane shell, collapse behaviour, and sizing to rf-interface.js/css.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.116-generic-demo-builder";
  const SLOT_SELECTOR = "[data-rf-path-details]";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const RENDERED_EVENT = "fieldops:rf-path-details-rendered";
  const DISPLAY_LIMIT = 4;

  const DEMO_SITES = [
    { id: "site-1", name: "Site 1", role: "Generic TX site" },
    { id: "site-2", name: "Site 2", role: "Generic RX site" }
  ];

  const GLOBAL_SOURCES = {
    sites: ["FieldOpsRFSites", "FieldOpsSites", "FieldOpsSiteFiles"],
    frequencies: ["FieldOpsRFFrequencies", "FieldOpsFrequencies", "FieldOpsFrequencyFiles"],
    services: ["FieldOpsRFServices", "FieldOpsServices", "FieldOpsServiceFiles"],
    equipment: ["FieldOpsRFEquipment", "FieldOpsEquipment", "FieldOpsEquipmentFiles"]
  };

  function asList(value) {
    if (Array.isArray(value)) {
      return value;
    }

    if (value && Array.isArray(value.items)) {
      return value.items;
    }

    if (value && Array.isArray(value.sites)) {
      return value.sites;
    }

    if (value && Array.isArray(value.records)) {
      return value.records;
    }

    return [];
  }

  function cleanText(value) {
    return String(value ?? "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeHTML(value) {
    return cleanText(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function stableId(value, fallback) {
    const id = cleanText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return id || fallback;
  }

  function readGlobalLists(names) {
    return names.flatMap((name) => asList(window[name]));
  }

  function sourceCountLabel(count, fallback) {
    if (!count) {
      return fallback;
    }

    return `${count} source ${count === 1 ? "item" : "items"}`;
  }

  function normaliseSourceRecord(record, index, fallbackType) {
    return {
      id: stableId(record.id || record.slug || record.name || record.title || record.label, `${fallbackType}-${index + 1}`),
      type: fallbackType
    };
  }

  function collectQueuedSiteSources() {
    return asList(window.FieldOpsSearchQueue)
      .flatMap((group) => asList(group.items))
      .filter((item) => {
        const id = cleanText(item.id).toLowerCase();
        const keywords = asList(item.keywords).join(" ").toLowerCase();

        return id.startsWith("site-") || /\b(site|relay|transmitter|tx)\b/.test(keywords);
      })
      .map((item, index) => normaliseSourceRecord(item, index, "site"));
  }

  function collectSiteSources() {
    const siteSources = [
      ...readGlobalLists(GLOBAL_SOURCES.sites).map((record, index) => normaliseSourceRecord(record, index, "site")),
      ...collectQueuedSiteSources()
    ];

    const unique = new Map();

    siteSources.forEach((site) => {
      if (!unique.has(site.id)) {
        unique.set(site.id, site);
      }
    });

    return [...unique.values()];
  }

  function collectServiceSources(root) {
    const currentRows = [...root.querySelectorAll(".rf-service-row")].map((row, index) => ({
      id: stableId(row.getAttribute("href") || row.textContent, `service-${index + 1}`),
      type: "service"
    }));

    const futureRows = readGlobalLists(GLOBAL_SOURCES.services)
      .map((record, index) => normaliseSourceRecord(record, index, "service"));

    return [...currentRows, ...futureRows];
  }

  function collectEquipmentSources(root) {
    const currentRows = [...root.querySelectorAll(".rf-equipment-card")].map((card, index) => ({
      id: stableId(card.getAttribute("href") || card.textContent, `equipment-${index + 1}`),
      type: "equipment"
    }));

    const futureRows = readGlobalLists(GLOBAL_SOURCES.equipment)
      .map((record, index) => normaliseSourceRecord(record, index, "equipment"));

    return [...currentRows, ...futureRows];
  }

  function collectFrequencySources() {
    return readGlobalLists(GLOBAL_SOURCES.frequencies)
      .map((record, index) => normaliseSourceRecord(record, index, "frequency"));
  }

  function genericRows(sources, label, sourcedValue, emptyValue) {
    const rowCount = sources.length ? Math.min(sources.length, DISPLAY_LIMIT) : 1;

    return Array.from({ length: rowCount }, (_, index) => ({
      label: `${label} ${index + 1}`,
      value: sources.length ? sourcedValue : emptyValue
    }));
  }

  function buildGenericInfo(sourceCounts) {
    return [
      { label: "Mode", value: "Generic demo" },
      { label: "Sites", value: sourceCountLabel(sourceCounts.sites, "Site 1 / Site 2") },
      { label: "Pack", value: "Future build" },
      { label: "Data", value: "Current + future sources" }
    ];
  }

  function buildSitePack(root = document) {
    const sources = {
      sites: collectSiteSources(),
      services: collectServiceSources(root),
      equipment: collectEquipmentSources(root),
      frequencies: collectFrequencySources()
    };

    const sourceCounts = {
      sites: sources.sites.length,
      services: sources.services.length,
      equipment: sources.equipment.length,
      frequencies: sources.frequencies.length
    };

    return {
      id: "site-1-to-site-2",
      from: DEMO_SITES[0],
      to: DEMO_SITES[1],
      genericInfo: buildGenericInfo(sourceCounts),
      services: genericRows(sources.services, "Service", "Source item", "Future service file"),
      equipment: genericRows(sources.equipment, "Equipment", "Source item", "Future equipment file"),
      frequencies: genericRows(sources.frequencies, "Frequency", "Source item", "Future frequency file"),
      sourceCounts
    };
  }

  function renderSite(site, label) {
    return `
      <section class="rf-path-site">
        <small>${escapeHTML(label)}</small>
        <b>${escapeHTML(site.name)}</b>
        <span>${escapeHTML(site.role)}</span>
      </section>
    `;
  }

  function renderRows(rows) {
    return rows
      .slice(0, DISPLAY_LIMIT)
      .map((row) => `
        <div class="rf-path-info-row">
          <dt>${escapeHTML(row.label)}</dt>
          <dd>${escapeHTML(row.value)}</dd>
        </div>
      `)
      .join("");
  }

  function renderPathDetails(pack) {
    return `
      <article class="rf-path-pack" data-rf-path-builder-body data-rf-path-id="${escapeHTML(pack.id)}">
        <section class="rf-path-sites" aria-label="Generic RF sites">
          ${renderSite(pack.from, "From")}
          ${renderSite(pack.to, "To")}
        </section>

        <dl class="rf-path-info" aria-label="Generic path summary">
          ${renderRows(pack.genericInfo)}
        </dl>

        <dl class="rf-path-info" aria-label="Generic services">
          ${renderRows(pack.services)}
        </dl>

        <dl class="rf-path-info" aria-label="Generic equipment">
          ${renderRows(pack.equipment)}
        </dl>

        <dl class="rf-path-info" aria-label="Generic frequencies">
          ${renderRows(pack.frequencies)}
        </dl>
      </article>
    `;
  }

  function render(root = document) {
    const slot = root.querySelector(SLOT_SELECTOR);

    if (!slot) {
      return false;
    }

    const sitePack = buildSitePack(root);

    slot.replaceChildren();
    slot.insertAdjacentHTML("beforeend", renderPathDetails(sitePack));
    slot.dataset.rfPathBuilderLoaded = "true";
    slot.dataset.rfPathBuilderVersion = VERSION;

    document.dispatchEvent(new CustomEvent(RENDERED_EVENT, {
      detail: {
        version: VERSION,
        pathId: sitePack.id,
        source: "generic-demo-builder",
        sourceCounts: sitePack.sourceCounts
      }
    }));

    return true;
  }

  function init() {
    if (render()) {
      return;
    }

    document.addEventListener(PANE_READY_EVENT, () => {
      render();
    }, { once: true });
  }

  window.FieldOpsRFPathBuilder = {
    VERSION,
    buildSitePack,
    render
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
/* End of FieldOpsAtlas/Features/RF/rf-path-builder.js | bottom/end of file */
