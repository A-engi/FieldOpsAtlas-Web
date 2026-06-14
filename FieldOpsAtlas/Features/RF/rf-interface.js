/* ==========================================================================
   FieldOps Atlas RF panes
   File: FieldOpsAtlas/Features/RF/rf-panes.js
   Version: 1.1.37-shell-only

   Purpose:
   - Own only the RF path pane shell.
   - Insert the invisible toggle and visible pane handle.
   - Do not render 6 GHz/path detail text.
   - Do not render a details mount or placeholder.
   - Keep the pane shell out of normal layout flow.
   ========================================================================== */

(() => {
  "use strict";

  const VERSION = "1.1.37-shell-only";
  const MAP_PAPER_SELECTOR = ".rf-map-paper";
  const MAP_STAGE_SELECTOR = ".rf-map-stage";

  const PATH_TOGGLE_TEMPLATE = String.raw`
<input
  class="rf-path-toggle"
  id="rfPathPaneToggle"
  type="checkbox"
  checked
  aria-label="Toggle path details"
>
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

  function attachPathPane(mapPaper) {
    if (!mapPaper || mapPaper.dataset.rfPaneInit === "true") {
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
    mapPaper.dataset.rfPaneInit = "true";

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

    root
      .querySelectorAll(MAP_PAPER_SELECTOR)
      .forEach(attachPathPane);
  }

  window.FieldOpsRFPanes = {
    VERSION,
    initAll
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll(), { once: true });
  } else {
    initAll();
  }
})();
