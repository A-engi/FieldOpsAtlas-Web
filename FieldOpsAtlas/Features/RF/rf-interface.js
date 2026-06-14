/* ==========================================================================
   FieldOps Atlas RF interface
   File: FieldOpsAtlas/Features/RF/rf-interface.js
   Version: 1.1.75-interface-owned-service-strip

   Purpose:
   - Own RF interface shell behaviour.
   - Insert the invisible path-pane toggle and visible pane handle.
   - Insert the visible RF service strip for DTT/DAB/FM/Equipment links.
   - Do not render 6 GHz/path detail text.
   - Do not render a details mount or placeholder.
   - Keep the pane shell out of normal layout flow.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.75-interface-owned-service-strip";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const MAP_STAGE_SELECTOR = ".rf-map-stage";
  const NETWORK_SELECTOR = ".rf-network";
  const NETWORK_HEAD_SELECTOR = ".rf-network-head";

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
      .querySelectorAll(".rf-bottom")
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
