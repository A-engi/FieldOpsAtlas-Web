/* ===========================================================================
   FieldOps Atlas RF path builder
   File: FieldOpsAtlas/Features/RF/rf-path-builder.js
   Version: 1.1.119-demo-graph-ready

   Purpose:
   - Own the RF demo model used by both Path Details and the Graph renderer.
   - Provide one ready demo graph through FieldOpsRFPathBuilder.buildGraph().
   - Keep graph drawing in rf-graph.js.
   - Keep the demo graph clearly marked as placeholder data.
   - Do not imply real topology can be derived before site/path records exist.
   - Count current/future source records for Path Details only.
   - Leave pane shell, collapse behaviour, and sizing to rf-interface.js/css.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.119-demo-graph-ready";
  const SLOT_SELECTOR = "[data-rf-path-details]";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const RENDERED_EVENT = "fieldops:rf-path-details-rendered";
  const DATA_READY_EVENT = "fieldops:rf-path-data-ready";
  const DISPLAY_LIMIT = 4;

  const DEMO_SITES = [
    { id: "site-1", name: "Site 1", role: "Generic source site" },
    { id: "site-2", name: "Site 2", role: "Generic relay site" },
    { id: "site-3", name: "Site 3", role: "Generic receive site" }
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

  function searchProviderItems(page) {
    const providers = window.FieldOpsSearch && window.FieldOpsSearch.providers;
    return asList(providers && providers[page]);
  }

  function queuedItems() {
    return [
      ...asList(window.FieldOpsSearchQueue).flatMap((group) => asList(group.items)),
      ...searchProviderItems("rf")
    ];
  }

  function collectQueuedSiteSources() {
    return queuedItems()
      .filter((item) => {
        const id = cleanText(item.id).toLowerCase();
        const keywords = asList(item.keywords).join(" ").toLowerCase();

        return id.startsWith("site-") || /\b(site|relay|transmitter|tx|rx)\b/.test(keywords);
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
      { label: "Mode", value: "Demo placeholder" },
      { label: "Sites", value: sourceCountLabel(sourceCounts.sites, "Site 1 / Site 2 / Site 3") },
      { label: "Graph", value: "Ready demo model" },
      { label: "Data", value: "Awaiting real path records" }
    ];
  }

  function collectSources(root = document) {
    return {
      sites: collectSiteSources(),
      services: collectServiceSources(root),
      equipment: collectEquipmentSources(root),
      frequencies: collectFrequencySources()
    };
  }

  function sourceCountsFrom(sources) {
    return {
      sites: sources.sites.length,
      services: sources.services.length,
      equipment: sources.equipment.length,
      frequencies: sources.frequencies.length
    };
  }

  function buildSitePack(root = document) {
    const sources = collectSources(root);
    const sourceCounts = sourceCountsFrom(sources);

    return {
      id: "site-1-to-site-3",
      from: DEMO_SITES[0],
      via: DEMO_SITES[1],
      to: DEMO_SITES[2],
      genericInfo: buildGenericInfo(sourceCounts),
      services: genericRows(sources.services, "Service", "Source item", "Future service file"),
      equipment: genericRows(sources.equipment, "Equipment", "Source item", "Future equipment file"),
      frequencies: genericRows(sources.frequencies, "Frequency", "Source item", "Future frequency file"),
      sourceCounts
    };
  }

  function buildGraph(root = document) {
    if (isUsableGraph(window.ATLAS_RF_GRAPH)) {
      return {
        ...window.ATLAS_RF_GRAPH,
        meta: {
          ...(window.ATLAS_RF_GRAPH.meta || {}),
          source: "window.ATLAS_RF_GRAPH",
          builderVersion: VERSION,
          mode: "external-model"
        }
      };
    }

    const sitePack = buildSitePack(root);

    return {
      id: "rf-demo-graph-ready",
      selectedPathId: "demo-main-path",
      meta: {
        source: "FieldOpsRFPathBuilder",
        builderVersion: VERSION,
        mode: "demo-placeholder",
        note: "Invented demo graph. Replace with real site/path records when available.",
        readyFor: "real-rf-path-model",
        sourceCounts: sitePack.sourceCounts
      },
      nodes: [
        {
          id: sitePack.from.id,
          name: sitePack.from.name,
          type: "core",
          size: "large",
          x: 0.14,
          y: 0.72,
          label: { dx: 0, dy: 54, anchor: "middle" },
          labelTight: { dx: 0, dy: 50, anchor: "middle" }
        },
        {
          id: sitePack.via.id,
          name: sitePack.via.name,
          type: "relay",
          x: 0.50,
          y: 0.32,
          label: { dx: 0, dy: -42, anchor: "middle" },
          labelTight: { dx: 0, dy: -38, anchor: "middle" }
        },
        {
          id: sitePack.to.id,
          name: sitePack.to.name,
          type: "remote",
          size: "large",
          x: 0.86,
          y: 0.72,
          label: { dx: 0, dy: 54, anchor: "middle" },
          labelTight: { dx: 0, dy: 50, anchor: "middle" }
        },
        {
          id: "demo-service",
          name: "Service",
          type: "main",
          x: 0.30,
          y: 0.14,
          label: { dx: 0, dy: -34, anchor: "middle" },
          labelTight: { dx: 0, dy: -32, anchor: "middle" }
        },
        {
          id: "demo-equipment",
          name: "Equipment",
          type: "main",
          x: 0.70,
          y: 0.14,
          label: { dx: 0, dy: -34, anchor: "middle" },
          labelTight: { dx: 0, dy: -32, anchor: "middle" }
        }
      ],
      links: [
        { id: "demo-main-path", from: sitePack.from.id, to: sitePack.to.id, type: "alert" },
        { id: "demo-hop-a", from: sitePack.from.id, to: sitePack.via.id, type: "backup" },
        { id: "demo-hop-b", from: sitePack.via.id, to: sitePack.to.id, type: "backup" },
        { id: "demo-service-feed", from: "demo-service", to: sitePack.via.id, type: "main" },
        { id: "demo-equipment-feed", from: "demo-equipment", to: sitePack.via.id, type: "main" }
      ]
    };
  }

  function isUsableGraph(data) {
    return Boolean(
      data &&
      Array.isArray(data.nodes) &&
      data.nodes.length > 0 &&
      Array.isArray(data.links)
    );
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
          ${pack.via ? renderSite(pack.via, "Via") : ""}
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

  function dispatchDataReady(sitePack, graph) {
    document.dispatchEvent(new CustomEvent(DATA_READY_EVENT, {
      detail: {
        version: VERSION,
        pathId: sitePack.id,
        graph,
        sourceCounts: sitePack.sourceCounts
      }
    }));
  }

  function render(root = document) {
    const slot = root.querySelector(SLOT_SELECTOR);

    if (!slot) {
      return false;
    }

    const sitePack = buildSitePack(root);
    const graph = buildGraph(root);

    slot.replaceChildren();
    slot.insertAdjacentHTML("beforeend", renderPathDetails(sitePack));
    slot.dataset.rfPathBuilderLoaded = "true";
    slot.dataset.rfPathBuilderVersion = VERSION;
    slot.dataset.rfPathBuilderGraphSource = graph.meta?.source || "FieldOpsRFPathBuilder";

    document.dispatchEvent(new CustomEvent(RENDERED_EVENT, {
      detail: {
        version: VERSION,
        pathId: sitePack.id,
        source: "demo-graph-ready",
        sourceCounts: sitePack.sourceCounts
      }
    }));

    dispatchDataReady(sitePack, graph);
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
    buildGraph,
    render
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* Destination: FieldOpsAtlas/Features/RF/rf-path-builder.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-path-builder.js */
