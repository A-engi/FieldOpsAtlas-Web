/* ==========================================================================
   FieldOps Atlas RF interface
   File: FieldOpsAtlas/Features/RF/rf-interface.js
   Version: 1.1.77-interface-owns-all-ui

   Purpose:
   - Own RF interface shell behaviour and UI markup.
   - Insert RF title/tabs, map holder, service strip, recent cards, Services/Equipment panels, and path pane shell.
   - Do not render 6 GHz/path detail text.
   - Do not calculate selected path data.
   - Keep path data rendering in rf-path-builder.js.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.77-interface-owns-all-ui";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const MAP_STAGE_SELECTOR = ".rf-map-stage";
  const NETWORK_SELECTOR = ".rf-network";
  const NETWORK_HEAD_SELECTOR = ".rf-network-head";
  const RECENT_SELECTOR = ".rf-recent";
  const CANVAS_SELECTOR = ".content-canvas";
  const HOME_SELECTOR = ".rf-home";
  const MAP_RECENT_SELECTOR = ".rf-map-recent";

  const PATH_TOGGLE_TEMPLATE = String.raw`
<input
  class="rf-path-toggle"
  id="rfPathPaneToggle"
  type="checkbox"
  checked
  aria-label="Toggle path details"
>
`;



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
        data-rf-topology
        role="img"
        aria-label="RF topology"
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
</section>
`;

  const SERVICE_STRIP_TEMPLATE = String.raw`
<section class="rf-service-strip" aria-labelledby="rfServicesTitle" data-rf-service-strip>
  <h2 class="rf-service-title" id="rfServicesTitle">Services</h2>
  <div class="rf-service-links">
    <a class="rf-service-link is-dtt" href="../RFPages/dtt.html">
      <b>DTT</b>
      <span>MUX 1</span>
    </a>
    <a class="rf-service-link is-dab" href="../RFPages/dab.html">
      <b>DAB</b>
      <span>National</span>
    </a>
    <a class="rf-service-link is-fm" href="../RFPages/fm.html">
      <b>FM</b>
      <span>Service</span>
    </a>
    <a class="rf-service-link is-equipment" href="../RFPages/equipment.html">
      <b>EQ</b>
      <span>Kit</span>
    </a>
  </div>
</section>
`;

  const INTERFACE_PANELS_TEMPLATE = String.raw`
<section class="rf-interface-panels" aria-label="RF services and equipment panels" data-rf-interface-panels>
  <div class="rf-bottom">
    <section class="rf-small" aria-labelledby="rfServicesPanelTitle">
      <h3 class="rf-small-title" id="rfServicesPanelTitle">Services</h3>
      <div class="rf-table">
        <a href="../RFPages/dtt.html">
          <span>DTT MUX 1</span>
          <b>Online</b>
        </a>
        <a href="../RFPages/dab.html">
          <span>DAB National</span>
          <b>Online</b>
        </a>
        <a href="../RFPages/fm.html">
          <span>FM Radio</span>
          <b>Online</b>
        </a>
      </div>
    </section>

    <section class="rf-small" aria-labelledby="rfEquipmentPanelTitle">
      <h3 class="rf-small-title" id="rfEquipmentPanelTitle">Equipment</h3>
      <div class="rf-equipment-list">
        <a class="rf-equipment-item" href="../RFPages/equipment.html">
          <span>TX</span>
          <b>Transmitters</b>
        </a>
        <a class="rf-equipment-item" href="../RFPages/sites.html">
          <span>ANT</span>
          <b>Sites</b>
        </a>
      </div>
    </section>
  </div>
</section>
`;


  const PATH_PANE_SHELL_TEMPLATE = String.raw`
<aside class="rf-path-pane" aria-label="Selected RF path details" data-rf-path-pane>
  <label class="rf-path-handle" for="rfPathPaneToggle" aria-label="Collapse path details">
    <img
      class="rf-path-handle-icon"
      src="../../../data/icons/path-pane-chevron-gold.svg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    >
  </label>
</aside>
`;

  function makeFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.cloneNode(true);
  }


  function attachMainInterface(root = document) {
    const home = root.querySelector(HOME_SELECTOR);
    if (!home || home.dataset.rfInterfaceMain === "true") {
      return;
    }

    home
      .querySelectorAll(":scope > .rf-network, :scope > .rf-interface-panels")
      .forEach((node) => node.remove());

    const fragment = makeFragment(MAIN_INTERFACE_TEMPLATE);
    home.appendChild(fragment);
    home.dataset.rfInterfaceMain = "true";
  }

  function removeLegacyPaneMounts(root) {
    root
      .querySelectorAll("[data-rf-path-pane-mount]")
      .forEach((mount) => mount.remove());
  }

  function removeLegacyInlinePanes(mapPaper) {
    mapPaper
      .querySelectorAll(":scope > .rf-path-toggle, :scope > .rf-path-pane")
      .forEach((node) => node.remove());
  }


  function removeLegacyServicePanels(root) {
    root
      .querySelectorAll(".content-canvas > .rf-bottom")
      .forEach((panel) => panel.remove());
  }

  function attachServiceStrip(root = document) {
    const network = root.querySelector(NETWORK_SELECTOR);
    if (!network || network.dataset.rfInterfaceServiceStrip === "true") {
      return;
    }

    const networkHead = network.querySelector(NETWORK_HEAD_SELECTOR);
    if (!networkHead) {
      return;
    }

    network
      .querySelectorAll(":scope > .rf-service-strip")
      .forEach((strip) => strip.remove());

    const stripFragment = makeFragment(SERVICE_STRIP_TEMPLATE);
    const strip = stripFragment.querySelector(".rf-service-strip");

    if (!strip) {
      return;
    }

    networkHead.insertAdjacentElement("afterend", strip);
    network.dataset.rfInterfaceServiceStrip = "true";
  }


  function attachInterfacePanels(root = document) {
    const network = root.querySelector(NETWORK_SELECTOR);
    if (!network || network.dataset.rfInterfacePanels === "true") {
      return;
    }

    network
      .querySelectorAll(":scope > .rf-interface-panels")
      .forEach((panel) => panel.remove());

    const mapRecent = network.querySelector(MAP_RECENT_SELECTOR);
    const panelFragment = makeFragment(INTERFACE_PANELS_TEMPLATE);
    const panel = panelFragment.querySelector(".rf-interface-panels");

    if (!panel) {
      return;
    }

    if (mapRecent) {
      mapRecent.insertAdjacentElement("afterend", panel);
    } else {
      network.appendChild(panel);
    }

    network.dataset.rfInterfacePanels = "true";
  }

  function attachPathPane(mapPaper) {
    if (!mapPaper || mapPaper.dataset.rfInterfaceInit === "true") {
      return;
    }

    const mapStage = mapPaper.querySelector(MAP_STAGE_SELECTOR);
    if (!mapStage) {
      return;
    }

    removeLegacyInlinePanes(mapPaper);

    const toggleFragment = makeFragment(PATH_TOGGLE_TEMPLATE);
    const paneFragment = makeFragment(PATH_PANE_SHELL_TEMPLATE);
    const toggle = toggleFragment.querySelector(".rf-path-toggle");
    const pane = paneFragment.querySelector(".rf-path-pane");

    if (!toggle || !pane) {
      return;
    }

    mapPaper.insertBefore(toggle, mapStage);
    mapStage.insertAdjacentElement("afterend", pane);
    mapPaper.dataset.rfInterfaceInit = "true";

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-pane-shell-ready", {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-details"
      }
    }));
  }

  function initAll(root = document) {
    attachMainInterface(root);
    removeLegacyPaneMounts(root);
    removeLegacyServicePanels(root);
    attachServiceStrip(root);
    attachInterfacePanels(root);

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
