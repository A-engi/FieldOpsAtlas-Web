/* ===========================================================================
   FieldOps Atlas RF path builder
   File: FieldOpsAtlas/Features/RF/rf-path-builder.js
   Version: 1.1.125-network-topology

   Purpose:
   - Own the prototype-safe RF topology model used by the RF graph renderer.
   - Keep graph drawing in rf-graph.js.
   - Keep the collapsible pane focused on one selected path.
   - Keep all values demo-only and free of private operational data.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.125-network-topology";
  const SLOT_SELECTOR = "[data-rf-path-details]";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const RENDERED_EVENT = "fieldops:rf-path-details-rendered";

  const SITES = [
    {
      id: "glasgow-core",
      name: "Glasgow",
      role: "Core",
      status: "Online",
      nodeType: "core",
      x: 0.13,
      y: 0.10,
      label: { dx: 0, dy: -54, anchor: "middle" }
    },
    {
      id: "edinburgh-core",
      name: "Edinburgh",
      role: "Core",
      status: "Online",
      nodeType: "core",
      x: 0.72,
      y: 0.10,
      label: { dx: 0, dy: -54, anchor: "middle" }
    },
    {
      id: "manchester-core",
      name: "Manchester",
      role: "Core",
      status: "Online",
      nodeType: "core",
      size: "large",
      x: 0.43,
      y: 0.34,
      label: { dx: 48, dy: -5, anchor: "start" }
    },
    {
      id: "birmingham-core",
      name: "Birmingham",
      role: "Core",
      status: "Online",
      nodeType: "core",
      x: 0.43,
      y: 0.54,
      label: { dx: 48, dy: -5, anchor: "start" }
    },
    {
      id: "london-core",
      name: "London",
      role: "Core",
      status: "Online",
      nodeType: "core",
      size: "large",
      x: 0.44,
      y: 0.77,
      label: { dx: 0, dy: 70, anchor: "middle" }
    },
    {
      id: "valley-remote",
      name: "Valley",
      role: "Remote",
      status: "Online",
      nodeType: "remote",
      x: 0.08,
      y: 0.69,
      label: { dx: -8, dy: 58, anchor: "middle" }
    },
    {
      id: "pinewood-remote",
      name: "Pinewood",
      role: "Remote",
      status: "Online",
      nodeType: "remote",
      x: 0.46,
      y: 0.96,
      label: { dx: 0, dy: 62, anchor: "middle" }
    },
    {
      id: "hilltop-relay",
      name: "Hilltop",
      role: "Relay",
      status: "Active",
      nodeType: "relay",
      size: "large",
      x: 0.80,
      y: 0.43,
      label: { dx: 48, dy: -5, anchor: "start" }
    },
    {
      id: "ridgeway-relay",
      name: "Ridgeway",
      role: "Relay",
      status: "Watch",
      nodeType: "relay",
      x: 0.82,
      y: 0.63,
      label: { dx: 48, dy: -5, anchor: "start" }
    }
  ];

  const LINKS = [
    { id: "glasgow-edinburgh", from: "glasgow-core", to: "edinburgh-core", type: "standby" },
    { id: "glasgow-manchester", from: "glasgow-core", to: "manchester-core", type: "main" },
    { id: "edinburgh-manchester", from: "edinburgh-core", to: "manchester-core", type: "main" },
    { id: "manchester-birmingham", from: "manchester-core", to: "birmingham-core", type: "main" },
    { id: "birmingham-london", from: "birmingham-core", to: "london-core", type: "standby" },
    {
      id: "london-hilltop",
      from: "london-core",
      to: "hilltop-relay",
      type: "main",
      bundleCount: 3,
      badge: "×6"
    },
    { id: "hilltop-ridgeway", from: "hilltop-relay", to: "ridgeway-relay", type: "alert" },
    { id: "london-ridgeway", from: "london-core", to: "ridgeway-relay", type: "standby" },
    { id: "london-valley", from: "london-core", to: "valley-remote", type: "fm" },
    { id: "london-pinewood", from: "london-core", to: "pinewood-remote", type: "fm" }
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
    return {
      id: site.id,
      name: site.name,
      role: site.role,
      type: site.nodeType || "relay",
      size: site.size || (site.nodeType === "core" ? "large" : ""),
      x: site.x,
      y: site.y,
      label: site.label ? { ...site.label } : null
    };
  }

  function buildSites() {
    return SITES.map((site) => ({ ...site, label: site.label ? { ...site.label } : null }));
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

  function endpointIconHTML(direction) {
    const tone = direction === "from" ? "tx" : "rx";

    return `
      <span class="rf-endpoint-icon is-${tone}" aria-hidden="true">
        <svg viewBox="0 0 48 48" focusable="false">
          <circle class="rf-endpoint-icon-bg" cx="24" cy="24" r="20"></circle>
          <circle class="rf-endpoint-icon-ring" cx="24" cy="24" r="23"></circle>
          <path class="rf-endpoint-icon-mast" d="M24 14L17 34H31Z"></path>
          <path class="rf-endpoint-icon-line" d="M24 18V34M20.5 27H27.5"></path>
          <path class="rf-endpoint-icon-wave" d="M14.2 17.8C10.8 21.2 10.8 26.8 14.2 30.2M33.8 17.8C37.2 21.2 37.2 26.8 33.8 30.2"></path>
        </svg>
      </span>
    `;
  }

  function endpointHTML(endpoint, direction) {
    return `
      <section class="rf-selected-endpoint is-${escapeHTML(direction)}">
        <small>${direction === "from" ? "From" : "To"}</small>
        ${endpointIconHTML(direction)}
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
    return {
      id: SELECTED_PATH.id,
      from: siteById(SELECTED_PATH.from.siteId),
      to: siteById(SELECTED_PATH.to.siteId),
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

    const pack = buildSitePack();
    slot.replaceChildren();
    slot.insertAdjacentHTML("beforeend", renderPathDetails(pack));
    slot.dataset.rfPathBuilderLoaded = "true";
    slot.dataset.rfPathBuilderVersion = VERSION;

    document.dispatchEvent(new CustomEvent(RENDERED_EVENT, {
      detail: {
        version: VERSION,
        pathId: pack.id,
        source: "network-topology",
        graph: buildGraph()
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
