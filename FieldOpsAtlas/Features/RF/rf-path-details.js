/* ==========================================================================
   FieldOps Atlas RF path details
   File: FieldOpsAtlas/Features/RF/rf-path-details.js
   Version: 1.1.41-render-on-pane-ready-once

   Purpose:
   - Own the visible Path details content only.
   - Render the zigzag signal SVG and 6 GHz/service detail rows.
   - Render once when the pane shell is ready.
   - Do not wait for the RF map render event.
   - Do not create an empty mount or placeholder.
   - Remove duplicate detail bodies before rendering.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.41-render-on-pane-ready-once";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const PANE_SELECTOR = ".rf-path-pane";
  const PANE_READY_EVENT = "fieldops:rf-pane-shell-ready";
  const DETAILS_READY_CLASS = "is-path-details-ready";

  const PATH_DETAILS_BODY_TEMPLATE = String.raw`
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

  function removeLegacyDetailMounts(root = document) {
    root
      .querySelectorAll("[data-rf-path-details-mount], [data-rf-path-details-body]")
      .forEach((node) => node.remove());
  }

  function removeExistingBodies(pane) {
    if (!pane) {
      return;
    }

    pane
      .querySelectorAll(":scope > .rf-path-pane-body")
      .forEach((body) => body.remove());
  }

  function renderDetails(root = document) {
    const mapPaper = getMapPaper(root);
    const pane = getPane(root);

    if (!mapPaper || !pane) {
      return false;
    }

    removeLegacyDetailMounts(mapPaper);
    removeExistingBodies(pane);

    const fragment = makeFragment(PATH_DETAILS_BODY_TEMPLATE);
    const body = fragment.querySelector(".rf-path-pane-body");

    if (!body) {
      return false;
    }

    body.dataset.rfDetailsLoaded = "true";
    body.dataset.rfDetailsVersion = VERSION;

    pane.appendChild(body);
    pane.dataset.rfDetailsLoaded = "true";
    pane.dataset.rfDetailsVersion = VERSION;
    mapPaper.classList.add(DETAILS_READY_CLASS);

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-path-details-ready", {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-details"
      }
    }));

    return true;
  }

  function init() {
    removeLegacyDetailMounts();

    if (renderDetails()) {
      return;
    }

    document.addEventListener(PANE_READY_EVENT, () => {
      renderDetails();
    }, { once: true });
  }

  window.FieldOpsRFPathDetails = {
    VERSION,
    renderDetails
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
