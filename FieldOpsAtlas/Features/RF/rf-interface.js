/* ==========================================================================
   FieldOps Atlas RF interface
   File: FieldOpsAtlas/Features/RF/rf-interface.js
   Version: 1.1.76-interface-panels-restored

   Purpose:
   - Own RF interface shell behaviour.
   - Insert the invisible path-pane toggle and visible pane handle.
   - Insert the visible RF service strip for DTT/DAB/FM/Equipment links.
   - Restore the Services/Equipment panel row as interface-owned markup.
   - Do not render 6 GHz/path detail text.
   - Do not render a details mount or placeholder.
   - Keep the pane shell out of normal layout flow.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.76-interface-panels-restored";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const MAP_STAGE_SELECTOR = ".rf-map-stage";
  const NETWORK_SELECTOR = ".rf-network";
  const NETWORK_HEAD_SELECTOR = ".rf-network-head";
  const RECENT_SELECTOR = ".rf-recent";
  const CANVAS_SELECTOR = ".content-canvas";

  const PATH_TOGGLE_TEMPLATE = String.raw`
<input
  class="rf-path-toggle"
  id="rfPathPaneToggle"
  type="checkbox"
  checked
  aria-label="Toggle path details"
>
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
    const canvas = root.querySelector(CANVAS_SELECTOR);
    if (!canvas || canvas.dataset.rfInterfacePanels === "true") {
      return;
    }

    canvas
      .querySelectorAll(":scope > .rf-interface-panels")
      .forEach((panel) => panel.remove());

    const recent = canvas.querySelector(RECENT_SELECTOR);
    const panelFragment = makeFragment(INTERFACE_PANELS_TEMPLATE);
    const panel = panelFragment.querySelector(".rf-interface-panels");

    if (!panel) {
      return;
    }

    if (recent) {
      recent.insertAdjacentElement("afterend", panel);
    } else {
      canvas.appendChild(panel);
    }

    canvas.dataset.rfInterfacePanels = "true";
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
