/* ==========================================================================
   FieldOps Atlas - shared Weather page registry
   ========================================================================== */

(() => {
  "use strict";

  window.FieldOpsWeatherPages = Object.freeze([
    {
      id: "rainviewer",
      label: "Radar",
      href: "index.html",
      aliases: ["rainviewer.html"]
    },
    {
      id: "openmeteo",
      label: "Weather risk",
      href: "openmeteo.html"
    },
    {
      id: "metoffice",
      label: "Met Office",
      href: "metoffice.html"
    },
    {
      id: "ea-rainfall",
      label: "EA rainfall",
      href: "ea-rainfall.html"
    },
    {
      id: "lightning",
      label: "EUMETSAT lightning",
      href: "lightning.html"
    },
    {
      id: "blitzortung",
      label: "Blitzortung",
      href: "blitzortung.html"
    },
    {
      id: "outages",
      label: "Electricity outages",
      href: "outages.html"
    },
    {
      id: "sp-outages",
      label: "SPEN outages",
      href: "sp-outages.html"
    }
  ]);
})();
