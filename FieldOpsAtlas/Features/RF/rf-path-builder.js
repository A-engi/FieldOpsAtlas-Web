/* ==========================================================================
   FieldOps Atlas RF path builder
   File: FieldOpsAtlas/Features/RF/rf-path-builder.js
   Version: 1.1.90-textbox-slot

   Purpose:
   - Build the selected RF path model from topology, site, service, and path data.
   - Currently renders the demo selected-path values until topology/site/service data is wired.
   - Keep pane shell, controls, and styling in rf-interface.js / rf-interface.css.
   - Render the built path model into the existing RF interface pane.
   - Use the visible path details slot from rf-interface.js.
   - Keep the visible slot marker as the textbox label.
   - Paste the real path details body into that visible slot.
   - Remove duplicate path-builder bodies before rendering.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.90-textbox-slot";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const PANE_SELECTOR = ".rf-path-pane";
  const PATH_DETAILS_SLOT_SELECTOR = "[data-rf-path-details]";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const PATH_BUILDER_READY_CLASS = "is-path-builder-ready";

  const PATH_BUILDER_BODY_TEMPLATE = String.raw`
<div class="rf-path-pane-body">
  <header class="rf-path-pane-title">
    <img
      class="rf-path-title-wave"
      src="../../../data/icons/path-details-wave.svg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    >
    <span>Path details</span>
  </header>

  <section class="rf-path-site is-from" aria-label="Source site">
    <span class="rf-path-mast" aria-hidden="true">
      <img
        src="../../../data/icons/atlas-transmitter-gold.svg"
        alt=""
        loading="lazy"
        decoding="async"
      >
    </span>
    <span class="rf-path-site-copy">
      <small>From</small>
      <b>North Ridge</b>
      <b>TX Site</b>
    </span>
  </section>

  <section class="rf-path-mid" aria-label="Selected RF path">
    <img
      class="rf-path-signal-vertical"
      src="../../../data/icons/path-signal-glow.svg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    >

    <div class="rf-path-frequency">
      <strong>6.725 GHz</strong>
      <span>Horizontal</span>

      <dl class="rf-path-data">
        <div>
          <dt>Service</dt>
          <dd>DTT 1</dd>
        </div>
        <div>
          <dt>Band</dt>
          <dd>28 MHz</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>64QAM</dd>
        </div>
        <div>
          <dt>Power</dt>
          <dd>18 dBm</dd>
        </div>
        <div>
          <dt>Avail</dt>
          <dd>99.98%</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd><i aria-hidden="true"></i>Online</dd>
        </div>
      </dl>
    </div>
  </section>

  <section class="rf-path-site is-to" aria-label="Destination site">
    <span class="rf-path-mast" aria-hidden="true">
      <img
        src="../../../data/icons/atlas-transmitter-gold.svg"
        alt=""
        loading="lazy"
        decoding="async"
      >
    </span>
    <span class="rf-path-site-copy">
      <small>To</small>
      <b>Hilltop</b>
      <b>Relay Site</b>
    </span>
  </section>
</div>
`;

  function makeFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.cloneNode(true);
  }

  function getMapPaper(root = document) {
    return root.querySelector(MAP_PAPER_SELECTOR);
  }

  function getPane(root = document) {
    const mapPaper = getMapPaper(root);
    return mapPaper ? mapPaper.querySelector(PANE_SELECTOR) : null;
  }

  function getPathDetailsSlot(pane) {
    return pane ? pane.querySelector(PATH_DETAILS_SLOT_SELECTOR) : null;
  }

  function removeLegacyPathBuilderMounts(root = document) {
    root
      .querySelectorAll("[data-rf-path-builder-mount], [data-rf-path-builder-body]")
      .forEach((node) => node.remove());
  }

  function removeExistingBodies(pane, slot) {
    if (pane) {
      pane
        .querySelectorAll(":scope > .rf-path-pane-body")
        .forEach((body) => body.remove());
    }

    if (slot) {
      slot
        .querySelectorAll(":scope > .rf-path-pane-body")
        .forEach((body) => body.remove());
    }
  }

  function mountBodyInSlot(slot, body) {
    slot.appendChild(body);
  }

  function renderPathBuilder(root = document) {
    const mapPaper = getMapPaper(root);
    const pane = getPane(root);
    const slot = getPathDetailsSlot(pane);

    if (!mapPaper || !pane || !slot) {
      return false;
    }

    removeLegacyPathBuilderMounts(mapPaper);
    removeExistingBodies(pane, slot);

    const fragment = makeFragment(PATH_BUILDER_BODY_TEMPLATE);
    const body = fragment.querySelector(".rf-path-pane-body");

    if (!body) {
      return false;
    }

    body.dataset.rfPathBuilderLoaded = "true";
    body.dataset.rfPathBuilderVersion = VERSION;

    mountBodyInSlot(slot, body);
    slot.dataset.rfPathBuilderLoaded = "true";
    slot.dataset.rfPathBuilderVersion = VERSION;
    pane.dataset.rfPathBuilderLoaded = "true";
    pane.dataset.rfPathBuilderVersion = VERSION;
    mapPaper.classList.add(PATH_BUILDER_READY_CLASS);

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-path-builder-ready", {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-builder"
      }
    }));

    return true;
  }

  function init() {
    removeLegacyPathBuilderMounts();

    if (renderPathBuilder()) {
      return;
    }

    document.addEventListener(PANE_READY_EVENT, () => {
      renderPathBuilder();
    }, { once: true });
  }

  window.FieldOpsRFPathBuilder = {
    VERSION,
    renderPathBuilder
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* End of FieldOpsAtlas/Features/RF/rf-path-builder.js | bottom/end of file */
