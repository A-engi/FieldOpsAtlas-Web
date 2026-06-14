/* ==========================================================================
   FieldOps Atlas RF interface
   File: FieldOpsAtlas/Features/RF/rf-interface.js
   Version: 1.1.85-path-toggle-button

   Purpose:
   - Own the RF interface shell and static RF UI.
   - Create the RF title, RF/IP/MW/All graph filter controls, map holder, recent cards, Services panel, Equipment panel, and visible path pane shell.
   - Leave graph drawing to rf-graph.js.
   - Leave selected path data/body rendering to rf-path-builder.js.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.85-path-toggle-button";

  const HOME_SELECTOR = ".rf-home";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const MAP_STAGE_SELECTOR = ".rf-map-stage";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const PANE_TOGGLE_EVENT = "fieldops:rf-path-pane-toggle";
  const PANE_COLLAPSED_CLASS = "is-path-pane-collapsed";

  const MAIN_INTERFACE_TEMPLATE = String.raw`
<section class="rf-network" aria-labelledby="rfNetworkTitle" data-rf-interface-main>
  <div class="rf-network-head">
    <h1 class="rf-title" id="rfNetworkTitle">RF network map</h1>
    <div class="rf-tabs" aria-label="Network layer filter">
      <button class="rf-tab is-active" type="button">RF</button>
      <button class="rf-tab" type="button">IP</button>
      <button class="rf-tab" type="button">MW</button>
      <button class="rf-tab" type="button">All</button>
    </div>
  </div>
  <div class="rf-map-recent">
    <div class="rf-map-paper">
      <div
        class="rf-map-stage"
        id="rfMapStage"
        data-rf-graph
        role="img"
        aria-label="RF graph"
      ></div>
    </div>

    <section class="rf-recent" aria-labelledby="rfRecentTitle">
      <div class="rf-recent-head">
        <h2 class="rf-recent-title" id="rfRecentTitle">
          <span class="rf-clock" aria-hidden="true"></span>
          <span>Recently opened</span>
        </h2>
        <a class="rf-viewall" href="../RFPages/sites.html">View all</a>
      </div>

      <div class="rf-recent-grid">
        <a class="rf-recent-card" href="../RFPages/sites.html">
          <img src="../../../data/icons/sites.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
          <span>
            <span class="rf-recent-name">Hilltop<br>Relay</span>
            <span class="rf-status">Online</span>
          </span>
        </a>

        <a class="rf-recent-card" href="../RFPages/sites.html">
          <img src="../../../data/icons/sites.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
          <span>
            <span class="rf-recent-name">Ridgeway<br>Relay</span>
            <span class="rf-status">Online</span>
          </span>
        </a>

        <a class="rf-recent-card" href="../RFPages/sites.html">
          <img src="../../../data/icons/atlas-transmitter-gold.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
          <span>
            <span class="rf-recent-name">London<br>Core</span>
            <span class="rf-status">Online</span>
          </span>
        </a>

        <a class="rf-recent-card" href="../RFPages/sites.html">
          <img src="../../../data/icons/sites.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
          <span>
            <span class="rf-recent-name">Pinewood<br>Remote</span>
            <span class="rf-status">Online</span>
          </span>
        </a>
      </div>
    </section>
  </div>

  <section class="rf-interface-panels" aria-label="RF services and equipment panels" data-rf-interface-panels>
    <section class="rf-panel rf-services-panel" aria-labelledby="rfServicesPanelTitle">
      <h3 class="rf-panel-title" id="rfServicesPanelTitle">Services</h3>
      <div class="rf-services-table" role="table" aria-label="Service status">
        <div class="rf-services-table-head" role="row">
          <span role="columnheader">Service</span>
          <span role="columnheader">Type</span>
          <span role="columnheader">Status</span>
        </div>

        <a class="rf-service-row" href="../RFPages/dtt.html" role="row">
          <span role="cell">DTT MUX 1</span>
          <span role="cell">DTT</span>
          <b role="cell">Online</b>
        </a>

        <a class="rf-service-row" href="../RFPages/dab.html" role="row">
          <span role="cell">DAB National</span>
          <span role="cell">DAB</span>
          <b role="cell">Online</b>
        </a>

        <a class="rf-service-row" href="../RFPages/fm.html" role="row">
          <span role="cell">FM Service</span>
          <span role="cell">FM</span>
          <b role="cell">Online</b>
        </a>
      </div>
    </section>

    <section class="rf-panel rf-equipment-panel" aria-labelledby="rfEquipmentPanelTitle">
      <h3 class="rf-panel-title" id="rfEquipmentPanelTitle">Equipment</h3>
      <div class="rf-equipment-grid">
        <a class="rf-equipment-card" href="../RFPages/equipment.html">
          <strong>2</strong>
          <span>TX</span>
        </a>
        <a class="rf-equipment-card" href="../RFPages/sites.html">
          <strong>3</strong>
          <span>ANT</span>
        </a>
        <a class="rf-equipment-card" href="../RFPages/paths.html">
          <strong>2</strong>
          <span>Links</span>
        </a>
      </div>
    </section>
  </section>
</section>
`;

  const PATH_PANE_SHELL_TEMPLATE = String.raw`
<aside class="rf-path-pane" aria-label="Selected RF path details" data-rf-path-pane>
  <button
    class="rf-path-handle"
    type="button"
    aria-label="Collapse path details"
    aria-expanded="true"
    data-rf-path-handle
  >
    <img
      class="rf-path-handle-icon"
      src="../../../data/icons/path-pane-chevron-gold.svg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    >
  </button>
</aside>
`;

  function makeFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.cloneNode(true);
  }

  function resetHome(root = document) {
    const home = root.querySelector(HOME_SELECTOR);
    if (!home) {
      return null;
    }

    home.replaceChildren();
    delete home.dataset.rfInterfaceInit;
    return home;
  }

  function attachMainInterface(root = document) {
    const home = root.querySelector(HOME_SELECTOR);
    if (!home || home.dataset.rfInterfaceInit === "true") {
      return;
    }

    home.appendChild(makeFragment(MAIN_INTERFACE_TEMPLATE));
    home.dataset.rfInterfaceInit = "true";
  }

  function resetPathPane(mapPaper) {
    mapPaper
      .querySelectorAll(":scope > .rf-path-pane")
      .forEach((node) => node.remove());
    delete mapPaper.dataset.rfInterfacePathPane;
    mapPaper.classList.remove(PANE_COLLAPSED_CLASS);
  }

  function syncPathHandleState(mapPaper, handle) {
    const collapsed = mapPaper.classList.contains(PANE_COLLAPSED_CLASS);
    handle.setAttribute("aria-expanded", String(!collapsed));
    handle.setAttribute(
      "aria-label",
      collapsed ? "Expand path details" : "Collapse path details"
    );
  }

  function bindPathHandle(mapPaper, pane) {
    const handle = pane.querySelector("[data-rf-path-handle]");
    if (!handle) {
      return;
    }

    syncPathHandleState(mapPaper, handle);

    handle.addEventListener("click", () => {
      mapPaper.classList.toggle(PANE_COLLAPSED_CLASS);
      syncPathHandleState(mapPaper, handle);

      mapPaper.dispatchEvent(new CustomEvent(PANE_TOGGLE_EVENT, {
        bubbles: true,
        detail: {
          version: VERSION,
          collapsed: mapPaper.classList.contains(PANE_COLLAPSED_CLASS),
          pane: "path-details"
        }
      }));
    });
  }

  function attachPathPane(mapPaper) {
    if (!mapPaper || mapPaper.dataset.rfInterfacePathPane === "true") {
      return;
    }

    const mapStage = mapPaper.querySelector(MAP_STAGE_SELECTOR);
    if (!mapStage) {
      return;
    }

    resetPathPane(mapPaper);

    const paneFragment = makeFragment(PATH_PANE_SHELL_TEMPLATE);
    const pane = paneFragment.querySelector(".rf-path-pane");

    if (!pane) {
      return;
    }

    mapStage.insertAdjacentElement("afterend", pane);
    bindPathHandle(mapPaper, pane);
    mapPaper.dataset.rfInterfacePathPane = "true";

    mapPaper.dispatchEvent(new CustomEvent(PANE_READY_EVENT, {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-details"
      }
    }));
  }

  function initAll(root = document) {
    resetHome(root);
    attachMainInterface(root);

    root
      .querySelectorAll(MAP_PAPER_SELECTOR)
      .forEach(attachPathPane);
  }

  window.FieldOpsRFInterface = {
    VERSION,
    initAll
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})();

/* End of FieldOpsAtlas/Features/RF/rf-interface.js | bottom/end of file */
