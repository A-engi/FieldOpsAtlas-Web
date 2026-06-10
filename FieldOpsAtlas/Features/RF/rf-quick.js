/* ==========================================================================
   FieldOps Atlas RF quick services
   Feature file: FieldOpsAtlas/Features/RF/rf-quick.js
   Version: 1.1.1-rf-quick-v1

   Purpose:
   - Add the RF-only DTT / DAB / FM / More quick row to the shared shell.
   - Keep service shortcuts separate from the shared root shell.
   ========================================================================== */

(function () {
  "use strict";

  const ICON_BASE = "../../../data/icons/";

  const quickItems = [
    {
      key: "dtt",
      label: "DTT",
      href: "./dtt.html",
      icon: "dtt.svg",
      className: "is-dtt"
    },
    {
      key: "dab",
      label: "DAB",
      href: "./dab.html",
      icon: "dab.svg",
      className: "is-dab"
    },
    {
      key: "fm",
      label: "FM",
      href: "./fm.html",
      icon: "fm.svg",
      className: "is-fm"
    },
    {
      key: "more",
      label: "More",
      href: "./services.html",
      icon: "more.svg",
      className: "is-more"
    }
  ];

  function currentService() {
    const app = document.querySelector(".phone");
    const service = app ? app.dataset.service : "";

    if (service) {
      return service;
    }

    const file = window.location.pathname.split("/").pop().replace(".html", "");

    if (["dtt", "dab", "fm", "services"].includes(file)) {
      return file === "services" ? "more" : file;
    }

    return "";
  }

  function quickChip(item, activeKey) {
    const activeClass = item.key === activeKey ? " is-current" : "";

    return `
      <a class="rf-quick-chip ${item.className}${activeClass}" href="${item.href}">
        <img src="${ICON_BASE}${item.icon}" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <span>${item.label}</span>
      </a>`;
  }

  function injectQuickRow() {
    const app = document.querySelector(".phone[data-page='rf']");
    const topShell = app ? app.querySelector(".top-shell") : null;

    if (!app || !topShell || topShell.querySelector(".rf-quick-access")) {
      return false;
    }

    const activeKey = currentService();

    topShell.insertAdjacentHTML(
      "beforeend",
      `
        <nav class="rf-quick-access" aria-label="RF service shortcuts">
          ${quickItems.map((item) => quickChip(item, activeKey)).join("")}
        </nav>
        <button class="rf-quick-toggle" type="button" aria-label="Collapse service buttons" aria-expanded="true"></button>
      `
    );

    const toggle = topShell.querySelector(".rf-quick-toggle");

    if (toggle) {
      toggle.addEventListener("click", function () {
        const collapsed = !app.classList.contains("rf-quick-collapsed");
        app.classList.toggle("rf-quick-collapsed", collapsed);
        toggle.setAttribute("aria-expanded", String(!collapsed));
        toggle.setAttribute("aria-label", collapsed ? "Expand service buttons" : "Collapse service buttons");
      });
    }

    return true;
  }

  function boot() {
    if (injectQuickRow()) {
      return;
    }

    requestAnimationFrame(function () {
      injectQuickRow();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
