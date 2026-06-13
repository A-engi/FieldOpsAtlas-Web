/* ==========================================================================
   FieldOps Atlas RF path details
   File: FieldOpsAtlas/Features/RF/rf-path-details.js
   Version: 1.1.37-path-details-direct-render

   Purpose:
   - Own the visible Path details content only.
   - Render the zigzag signal SVG and 6 GHz/service detail rows.
   - Append the details body directly into .rf-path-pane.
   - Do not create an empty mount or placeholder.
   - Remove duplicate detail bodies before and after rendering.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.37-path-details-direct-render";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const MAP_STAGE_SELECTOR = ".rf-map-stage";
  const PANE_SELECTOR = ".rf-path-pane";
  const MAP_READY_EVENT = "fieldops:rf-network-map-rendered";
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

  function getParts(root = document) {
    const mapPaper = root.querySelector(MAP_PAPER_SELECTOR);
    const mapStage = mapPaper ? mapPaper.querySelector(MAP_STAGE_SELECTOR) : null;
    const pane = mapPaper ? mapPaper.querySelector(PANE_SELECTOR) : null;

    return {
      mapPaper,
      mapStage,
      pane
    };
  }

  function enforceSingleDetailsBody(pane) {
    if (!pane) {
      return;
    }

    const bodies = Array.from(pane.querySelectorAll(":scope > .rf-path-pane-body"));
    if (bodies.length <= 1) {
      return;
    }

    bodies.slice(0, -1).forEach((body) => body.remove());
  }

  function bindDuplicateGuard(pane) {
    if (!pane || pane.dataset.rfDetailsGuard === "true") {
      return;
    }

    pane.dataset.rfDetailsGuard = "true";

    const observer = new MutationObserver(() => {
      enforceSingleDetailsBody(pane);
    });

    observer.observe(pane, {
      childList: true
    });
  }

  function renderDetails(root = document) {
    const { mapPaper, pane } = getParts(root);

    if (!mapPaper || !pane) {
      return false;
    }

    const fragment = makeFragment(PATH_DETAILS_BODY_TEMPLATE);
    const body = fragment.querySelector(".rf-path-pane-body");

    if (!body) {
      return false;
    }

    pane
      .querySelectorAll(":scope > .rf-path-pane-body")
      .forEach((existingBody) => existingBody.remove());

    body.dataset.rfDetailsLoaded = "true";
    pane.appendChild(body);
    pane.dataset.rfDetailsLoaded = "true";
    mapPaper.classList.add(DETAILS_READY_CLASS);

    bindDuplicateGuard(pane);
    enforceSingleDetailsBody(pane);

    mapPaper.dispatchEvent(new CustomEvent("fieldops:rf-path-details-ready", {
      bubbles: true,
      detail: {
        version: VERSION,
        pane: "path-details"
      }
    }));

    return true;
  }

  function renderWhenMapIsReady() {
    const { mapStage, pane } = getParts();

    if (!pane) {
      return false;
    }

    if (mapStage?.dataset.rfNetworkMapLoaded === "true") {
      return renderDetails();
    }

    return false;
  }

  function scheduleRender() {
    window.requestAnimationFrame(() => {
      renderWhenMapIsReady();
    });
  }

  function init() {
    if (renderWhenMapIsReady()) {
      return;
    }

    document.addEventListener(PANE_READY_EVENT, scheduleRender);
    document.addEventListener(MAP_READY_EVENT, scheduleRender);
  }

  window.FieldOpsRFPathDetails = {
    VERSION,
    renderDetails,
    renderWhenMapIsReady
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
