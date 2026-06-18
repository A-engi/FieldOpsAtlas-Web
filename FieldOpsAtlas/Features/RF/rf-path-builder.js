/* ===========================================================================
   FieldOps Atlas RF path builder
   File: FieldOpsAtlas/Features/RF/rf-path-builder.js
   Version: 1.1.123-selected-path-pane

   Purpose:
   - Own the RF demo-safe topology model used by the RF graph renderer.
   - Keep graph drawing in rf-graph.js.
   - Keep the collapsible pane focused on one selected path, not a list of
     generic site cards.
   - Keep service/equipment/frequency detail in the selected path pane only.
   - Do not use private operational records or real internal data.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.123-selected-path-pane";
  const SLOT_SELECTOR = "[data-rf-path-details]";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const RENDERED_EVENT = "fieldops:rf-path-details-rendered";

  const SITES = [
    { id: "glasgow-core", name: "Glasgow", role: "Core", status: "Online", nodeType: "core", x: 0.16, y: 0.16 },
    { id: "edinburgh-core", name: "Edinburgh", role: "Core", status: "Online", nodeType: "core", x: 0.70, y: 0.16 },
    { id: "manchester-core", name: "Manchester", role: "Core", status: "Online", nodeType: "core", x: 0.44, y: 0.40, size: "large" },
    { id: "birmingham-core", name: "Birmingham", role: "Core", status: "Online", nodeType: "core", x: 0.44, y: 0.58 },
    { id: "london-core", name: "London", role: "Core site", status: "Online", nodeType: "core", x: 0.47, y: 0.78, size: "large" },
    { id: "valley-remote", name: "Valley", role: "Remote", status: "Online", nodeType: "remote", x: 0.14, y: 0.70 },
    { id: "pinewood-remote", name: "Pinewood", role: "Remote", status: "Online", nodeType: "remote", x: 0.46, y: 0.94 },
    { id: "hilltop-relay", name: "Hilltop", role: "Relay", status: "Active", nodeType: "relay", x: 0.78, y: 0.45, size: "large" },
    { id: "ridgeway-relay", name: "Ridgeway", role: "Relay", status: "Watch", nodeType: "relay", x: 0.83, y: 0.62 }
  ];

  const LINKS = [
    { id: "glasgow-manchester", from: "glasgow-core", to: "manchester-core", type: "main" },
    { id: "edinburgh-manchester", from: "edinburgh-core", to: "manchester-core", type: "main" },
    { id: "manchester-birmingham", from: "manchester-core", to: "birmingham-core", type: "main" },
    { id: "birmingham-london", from: "birmingham-core", to: "london-core", type: "main" },
    { id: "london-hilltop", from: "london-core", to: "hilltop-relay", type: "alert" },
    { id: "hilltop-ridgeway", from: "hilltop-relay", to: "ridgeway-relay", type: "alert" },
    { id: "london-ridgeway", from: "london-core", to: "ridgeway-relay", type: "main" },
    { id: "london-valley", from: "london-core", to: "valley-remote", type: "backup" },
    { id: "london-pinewood", from: "london-core", to: "pinewood-remote", type: "backup" },
    { id: "glasgow-edinburgh", from: "glasgow-core", to: "edinburgh-core", type: "backup" }
  ];

  const SELECTED_PATH = {
    id: "london-hilltop",
    status: "Active",
    from: {
      siteId: "london-core",
      name: "London",
      role: "Core Site",
      input: "Fibre Input"
    },
    to: {
      siteId: "hilltop-relay",
      name: "Hilltop",
      role: "Relay Site",
      input: "Off-air Antenna"
    },
    frequency: "234.928 MHz",
    channel: "DTT CH 39",
    bandwidth: "8 MHz",
    serviceCount: "6 links",
    services: [
      { type: "DTT", name: "BBC R1" },
      { type: "DTT", name: "BBC R2" },
      { type: "DTT", name: "BBC R3" },
      { type: "DTT", name: "BBC R4" },
      { type: "DTT", name: "BBC WS" },
      { type: "DAB", name: "BBC Radio Cymru" }
    ],
    metrics: [
      { label: "Path length", value: "37.6 km" },
      { label: "Azimuth", value: "123.4°" },
      { label: "Elevation", value: "1,245 m" },
      { label: "RX power", value: "-58.2 dBm" },
      { label: "Fade margin", value: "18.6 dB" },
      { label: "Availability", value: "99.98%" }
    ]
  };

  function cleanText(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
  }

  function escapeHTML(value) {
    return cleanText(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function siteById(id) {
    return SITES.find((site) => site.id === id) || null;
  }

  function graphNodeFromSite(site) {
    const labelSide = site.x > 0.72 ? -1 : 1;
    const label = {
      dx: labelSide < 0 ? -24 : 24,
      dy: -16,
      anchor: labelSide < 0 ? "end" : "start"
    };

    return {
      id: site.id,
      name: site.name,
      type: site.nodeType || "relay",
      size: site.size || (site.nodeType === "core" ? "large" : ""),
      x: site.x,
      y: site.y,
      label,
      labelTight: {
        dx: label.dx,
        dy: -13,
        anchor: label.anchor
      }
    };
  }

  function buildSites() {
    return SITES.map((site) => ({ ...site }));
  }

  function buildGraph() {
    if (
      window.ATLAS_RF_GRAPH &&
      Array.isArray(window.ATLAS_RF_GRAPH.nodes) &&
      window.ATLAS_RF_GRAPH.nodes.length > 0 &&
      Array.isArray(window.ATLAS_RF_GRAPH.links)
    ) {
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

    return {
      id: "rf-demo-network-map",
      selectedPathId: SELECTED_PATH.id,
      meta: {
        source: "FieldOpsRFPathBuilder",
        builderVersion: VERSION,
        mode: "demo-safe-rf-network",
        note: "Prototype-safe RF network map. Replace with real path records when available."
      },
      nodes: SITES.map(graphNodeFromSite),
      links: LINKS.map((link) => ({ ...link }))
    };
  }

  function endpointHTML(endpoint, direction) {
    return `
      <section class="rf-selected-endpoint is-${escapeHTML(direction)}">
        <small>${direction === "from" ? "From" : "To"}</small>
        <b>${escapeHTML(endpoint.name)}</b>
        <span>${escapeHTML(endpoint.role)}</span>
        <em>${escapeHTML(endpoint.input)}</em>
      </section>
    `;
  }

  function serviceHTML(service) {
    return `
      <li>
        <b>${escapeHTML(service.type)}</b>
        <span>${escapeHTML(service.name)}</span>
      </li>
    `;
  }

  function metricHTML(metric) {
    return `
      <div class="rf-path-metric">
        <dt>${escapeHTML(metric.label)}</dt>
        <dd>${escapeHTML(metric.value)}</dd>
      </div>
    `;
  }

  function buildSitePack() {
    const fromSite = siteById(SELECTED_PATH.from.siteId);
    const toSite = siteById(SELECTED_PATH.to.siteId);

    return {
      id: SELECTED_PATH.id,
      from: fromSite,
      to: toSite,
      selectedPath: SELECTED_PATH,
      siteCount: SITES.length,
      linkCount: LINKS.length
    };
  }

  function renderPathDetails(pack) {
    const path = pack.selectedPath;

    return `
      <article class="rf-path-pack rf-selected-path-pack" data-rf-path-builder-body data-rf-path-id="${escapeHTML(pack.id)}">
        <section class="rf-path-selected-head">
          <small>Selected path</small>
          <span class="rf-path-active-dot" aria-hidden="true"></span>
          <b>${escapeHTML(path.status)}</b>
        </section>

        ${endpointHTML(path.from, "from")}

        <section class="rf-path-frequency-card">
          <small>Frequency</small>
          <b>${escapeHTML(path.frequency)}</b>
          <span>${escapeHTML(path.channel)} <i aria-hidden="true">|</i> ${escapeHTML(path.bandwidth)}</span>
        </section>

        <section class="rf-service-bundle">
          <header>
            <small>Service bundle</small>
            <b>${escapeHTML(path.serviceCount)}</b>
          </header>
          <ul>
            ${path.services.map(serviceHTML).join("")}
          </ul>
        </section>

        ${endpointHTML(path.to, "to")}

        <dl class="rf-path-metrics">
          ${path.metrics.map(metricHTML).join("")}
        </dl>
      </article>
    `;
  }

  function render(root = document) {
    const slot = root.querySelector(SLOT_SELECTOR);
    if (!slot) return false;

    const pack = buildSitePack(root);
    slot.replaceChildren();
    slot.insertAdjacentHTML("beforeend", renderPathDetails(pack));
    slot.dataset.rfPathBuilderLoaded = "true";
    slot.dataset.rfPathBuilderVersion = VERSION;

    document.dispatchEvent(new CustomEvent(RENDERED_EVENT, {
      detail: {
        version: VERSION,
        pathId: pack.id,
        source: "selected-path-pane",
        graph: buildGraph(root)
      }
    }));

    return true;
  }

  function init() {
    if (render()) return;
    document.addEventListener(PANE_READY_EVENT, () => { render(); }, { once: true });
  }

  window.FieldOpsRFPathBuilder = {
    VERSION,
    buildSites,
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
