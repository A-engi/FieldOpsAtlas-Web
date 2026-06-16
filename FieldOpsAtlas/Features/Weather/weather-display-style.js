/* FieldOps Atlas Weather display style v0.1.2
   Destination: FieldOpsAtlas/Features/Weather/weather-display-style.js

   Purpose:
   Shared Weather display constants only. This file is not API configuration.
   Provider/API scripts should read Weather display choices from here instead
   of defining separate rainfall palettes locally.
*/

(function initialiseFieldOpsWeatherDisplayStyle(global) {
  "use strict";

  const FIELDOPS_WEATHER_DISPLAY_STYLE = Object.freeze({
    version: "0.1.2",
    updated: "2026-06-16",

    rainViewer: Object.freeze({
      provider: "RainViewer",
      useNativeColours: true,
      repaintRadarPixels: false,
      useAllFrames: true,
      groupFramesHourly: false,
      defaultOpacity: 0.95,
      defaultFrameMode: "observed",
      freeColourScheme: 2
    }),

    metOffice: Object.freeze({
      provider: "Met Office",

      surfaces: Object.freeze({
        landDisplay: "#B3D0AE",
        seaDisplay: "#9ABED6",
        overlayLand: "transparent",
        overlaySea: "transparent"
      }),

      classificationOrder: Object.freeze([
        "transparent/no-data",
        "sea/background",
        "land",
        "rainfall"
      ]),

      rainfallBands: Object.freeze([
        Object.freeze({ id: "gt32", label: ">32 mm/h", shortLabel: ">32", colour: "#B30500" }),
        Object.freeze({ id: "16-32", label: "16-32 mm/h", shortLabel: "16-32", colour: "#FC0600" }),
        Object.freeze({ id: "8-16", label: "8-16 mm/h", shortLabel: "8-16", colour: "#FD9619" }),
        Object.freeze({ id: "4-8", label: "4-8 mm/h", shortLabel: "4-8", colour: "#FCCA15" }),
        Object.freeze({ id: "2-4", label: "2-4 mm/h", shortLabel: "2-4", colour: "#0FA200" }),
        Object.freeze({ id: "1-2", label: "1-2 mm/h", shortLabel: "1-2", colour: "#0FBCFF" }),
        Object.freeze({ id: "0.5-1", label: "0.5-1 mm/h", shortLabel: "0.5-1", colour: "#3A63F7" }),
        Object.freeze({ id: "lt0.5", label: "<0.5 mm/h", shortLabel: "<0.5", colour: "#0100FB" })
      ])
    })
  });

  global.FIELDOPS_WEATHER_DISPLAY_STYLE = FIELDOPS_WEATHER_DISPLAY_STYLE;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = FIELDOPS_WEATHER_DISPLAY_STYLE;
  }
})(typeof window !== "undefined" ? window : globalThis);

/* End of file: FieldOpsAtlas/Features/Weather/weather-display-style.js */
