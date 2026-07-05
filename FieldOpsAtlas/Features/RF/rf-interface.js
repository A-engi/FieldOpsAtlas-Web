/* ===========================================================================
   FieldOps Atlas RF interface
   File: FieldOpsAtlas/Features/RF/rf-interface.js
   Version: 1.1.123-scene-selector
   Purpose:
   - Own the RF interface shell and static RF UI.
   - Create the RF title, RF/IP/MW/All graph filter controls, graph holder,
     recent cards, Services panel, Equipment panel, and collapsible path pane.
   - Keep graph drawing in rf-graph.js.
   - Provide the [data-rf-path-details] mount required by rf-path-builder.js.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.123-scene-selector";
  const HOME_SELECTOR = ".rf-home";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const MAP_STAGE_SELECTOR = ".rf-map-stage";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const PANE_TOGGLE_EVENT = "fieldops:rf-path-pane-toggle";
  const PANE_COLLAPSED_CLASS = "is-path-pane-collapsed";

  const MAIN_INTERFACE_TEMPLATE = String.raw`
    <section class="rf-network" aria-label="RF network map">
      <header class="rf-network-head">
        <h1 class="rf-title">RF network map</h1>
        <div class="rf-tabs" role="group" aria-label="RF graph filters">
          <button class="rf-tab is-active" type="button" data-rf-filter="rf">RF</button>
          <button class="rf-tab" type="button" data-rf-filter="ip">IP</button>
          <button class="rf-tab" type="button" data-rf-filter="mw">MW</button>
          <button class="rf-tab" type="button" data-rf-filter="all">All</button>
        </div>
      </header>

      <section class="rf-map-recent" aria-label="RF graph and recently opened" data-rf-scene-scope>
        <article class="rf-map-paper" aria-label="RF graph topology">
          <img
            class="rf-map-background"
            src="../../../data/icons/rf-current-background.svg?v=1.1.119-cream-graph"
            alt=""
            aria-hidden="true"
          >
          <div class="rf-map-stage" data-rf-graph aria-label="RF graph"></div>
        </article>

        <div class="rf-scene-control" data-rf-scene-selector>
          <label class="rf-scene-label" for="rfSceneSelect">Scene</label>
          <span class="rf-scene-select-shell">
            <select
              id="rfSceneSelect"
              class="rf-scene-select"
              data-rf-scene-select
              aria-label="Select 3D scene"
            >
              <option value="mount-a_b-full-scene">mount-a_b-full-scene</option>
              <option value="mount-a_b-comp-scene" selected>mount-a_b-comp-scene</option>
              <option value="mount-a_a-comp-scene">mount-a_a-comp-scene</option>
              <option value="mount-a-full-scene">mount a</option>
              <option value="mount-b-full-scene">mount b</option>
              <option value="mount-a-comp-scene">mount a comp</option>
              <option value="mount-b-comp-scene">mount b comp</option>
              <option value="transmitter-scene">transmitter</option>
            </select>
          </span>
        </div>

        <section class="rf-recent" aria-label="Recently opened">
          <div class="rf-recent-head">
            <h2 class="rf-recent-title"><span class="rf-clock" aria-hidden="true"></span> Recently opened</h2>
            <a class="rf-viewall" href="../RFPages/sites.html">View all</a>
          </div>

          <div class="rf-recent-grid">
            <a class="rf-recent-card" href="../RFPages/sites.html#hilltop">
              <img src="../../../data/icons/sites.svg?v=1.1.1" alt="" aria-hidden="true">
              <span>
                <span class="rf-recent-name">Hilltop Relay</span>
                <span class="rf-status">Online</span>
              </span>
            </a>

            <a class="rf-recent-card" href="../RFPages/sites.html#ridgeway">
              <img src="../../../data/icons/sites.svg?v=1.1.1" alt="" aria-hidden="true">
              <span>
                <span class="rf-recent-name">Ridgeway Relay</span>
                <span class="rf-status">Online</span>
              </span>
            </a>

            <a class="rf-recent-card" href="../RFPages/sites.html#london-core">
              <img src="../../../data/icons/atlas-transmitter-gold.svg?v=1.1.1" alt="" aria-hidden="true">
              <span>
                <span class="rf-recent-name">London Core</span>
                <span class="rf-status">Online</span>
              </span>
            </a>

            <a class="rf-recent-card" href="../RFPages/sites.html#pinewood">
              <img src="../../../data/icons/sites.svg?v=1.1.1" alt="" aria-hidden="true">
              <span>
                <span class="rf-recent-name">Pinewood Remote</span>
                <span class="rf-status">Online</span>
              </span>
            </a>
          </div>
        </section>
      </section>

      <section class="rf-interface-panels" aria-label="RF panels">
        <article class="rf-panel" aria-label="Services">
          <h2 class="rf-panel-title">Services</h2>

          <div class="rf-services-table">
            <div class="rf-services-table-head" aria-hidden="true">
              <span>Service</span>
              <span>Type</span>
              <span>Status</span>
            </div>

            <a class="rf-service-row" href="../RFPages/dtt.html">
              <span>DTT MUX 1</span>
              <b>DTT</b>
              <b>Online</b>
            </a>

            <a class="rf-service-row" href="../RFPages/dab.html">
              <span>DAB National</span>
              <b>DAB</b>
              <b>Online</b>
            </a>

            <a class="rf-service-row" href="../RFPages/fm.html">
              <span>FM Service</span>
              <b>FM</b>
              <b>Online</b>
            </a>
          </div>
        </article>

        <article class="rf-panel" aria-label="Equipment">
          <h2 class="rf-panel-title">Equipment</h2>

          <div class="rf-equipment-grid">
            <a class="rf-equipment-card" href="../RFPages/equipment.html#tx">
              <strong>2</strong>
              <span>TX</span>
            </a>

            <a class="rf-equipment-card" href="../RFPages/equipment.html#ant">
              <strong>3</strong>
              <span>ANT</span>
            </a>

            <a class="rf-equipment-card" href="../RFPages/paths.html">
              <strong>2</strong>
              <span>Links</span>
            </a>
          </div>
        </article>
      </section>
    </section>
  `;

  const PATH_PANE_SHELL_TEMPLATE = String.raw`
    <aside class="rf-path-pane" aria-label="RF path details">
      <button
        class="rf-path-handle"
        type="button"
        data-rf-path-handle
        aria-controls="rfPathDetailsMount"
        aria-expanded="true"
        aria-label="Collapse path details"
      >
        <img
          class="rf-path-handle-icon"
          src="../../../data/icons/path-pane-signal-chevron-gold.svg?v=1.1.118-rail-dots"
          alt=""
          aria-hidden="true"
        >
      </button>

      <div class="rf-path-blank">
        <h2 class="rf-path-blank-title">Path details</h2>
        <div id="rfPathDetailsMount" class="rf-path-details" data-rf-path-details></div>
      </div>
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
    home.dataset.rfInterfaceVersion = VERSION;
  }

  function resetPathPane(mapPaper) {
    mapPaper
      .querySelectorAll(":scope > .rf-path-pane")
      .forEach((node) => node.remove());

    delete mapPaper.dataset.rfInterfacePathPane;
    mapPaper.classList.remove(PANE_COLLAPSED_CLASS);
  }

  function removeLegacyPathContent(pane) {
    if (!pane) {
      return;
    }

    pane
      .querySelectorAll(
        ":scope > .rf-path-pane-body, " +
        ":scope > [data-rf-path-builder-mount], " +
        ":scope > [data-rf-path-builder-body], " +
        ":scope > .rf-path-placeholder"
      )
      .forEach((node) => node.remove());
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

    removeLegacyPathContent(pane);
    bindPathHandle(mapPaper, pane);

    mapPaper.dataset.rfInterfacePathPane = "true";
    mapPaper.dataset.rfInterfacePathPaneVersion = VERSION;

    mapPaper.dispatchEvent(new CustomEvent(PANE_READY_EVENT, {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-details"
      }
    }));
  }

  function wireTabs(root = document) {
    root.querySelectorAll(".rf-tabs").forEach((tabs) => {
      if (tabs.dataset.rfInterfaceTabs === VERSION) {
        return;
      }

      tabs.dataset.rfInterfaceTabs = VERSION;

      tabs.addEventListener("click", (event) => {
        const button = event.target.closest(".rf-tab");

        if (!button) {
          return;
        }

        tabs.querySelectorAll(".rf-tab").forEach((tab) => {
          tab.classList.toggle("is-active", tab === button);
        });
      });
    });
  }

  function initAll(root = document) {
    resetHome(root);
    attachMainInterface(root);

    root
      .querySelectorAll(MAP_PAPER_SELECTOR)
      .forEach(attachPathPane);

    wireTabs(root);

    document.dispatchEvent(new CustomEvent("fieldops:rf-interface-ready", {
      detail: { version: VERSION }
    }));
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

/* Destination: FieldOpsAtlas/Features/RF/rf-interface.js */
/* End of file: FieldOpsAtlas/Features/RF/rf-interface.js */
