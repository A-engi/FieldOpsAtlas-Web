/*
  FieldOps Atlas RF demo map renderer
  Version: 1.1.1

  Purpose:
  - Render the RF network map dynamically from graph data.
  - Use private/window graph data when present.
  - Fall back to safe demo graph data for local previews.
  - Keep the existing CSS class contract used by rf.css.

  Notes:
  - This file intentionally builds SVG dynamically. The RF map is not static.
  - Do not rename the generated SVG classes unless rf.css is updated at the same time.
*/

(() => {
  "use strict";

  // =========================================================
  // 01. Constants
  // =========================================================

  const VERSION = "1.1.1";
  const SVG_NS = ["http:", "", "www.w3.org", "2000", "svg"].join("/");
  const GRAPH_URL = "../../../data/rf-network-map.json";

  // =========================================================
  // 02. Safe fallback graph
  // =========================================================

  const FALLBACK_GRAPH = {
    selectedPathId: "london-hilltop",
    nodes: [
      {
        id: "glasgow",
        name: "Glasgow",
        type: "core",
        x: 0.12,
        y: 0.13,
        label: { dx: 15, dy: -7, anchor: "start" },
        labelTight: { dx: 16, dy: -8, anchor: "start" }
      },
      {
        id: "edinburgh",
        name: "Edinburgh",
        type: "core",
        x: 0.66,
        y: 0.13,
        label: { dx: 15, dy: -7, anchor: "start" },
        labelTight: { dx: 15, dy: -8, anchor: "start" }
      },
      {
        id: "manchester",
        name: "Manchester",
        type: "main",
        x: 0.34,
        y: 0.37,
        label: { dx: 14, dy: -2, anchor: "start" },
        labelTight: { dx: 14, dy: -3, anchor: "start" }
      },
      {
        id: "birmingham",
        name: "Birmingham",
        type: "main",
        x: 0.39,
        y: 0.58,
        label: { dx: 14, dy: 0, anchor: "start" },
        labelTight: { dx: -13, dy: 11, anchor: "end" }
      },
      {
        id: "london",
        name: "London",
        type: "core",
        size: "large",
        x: 0.52,
        y: 0.86,
        label: { dx: 0, dy: 23, anchor: "middle" },
        labelTight: { dx: 0, dy: 20, anchor: "middle" }
      },
      {
        id: "hilltop",
        name: "Hilltop",
        type: "relay",
        x: 0.75,
        y: 0.39,
        label: { dx: 15, dy: -5, anchor: "start" },
        labelTight: { dx: 14, dy: -6, anchor: "start" }
      },
      {
        id: "ridgeway",
        name: "Ridgeway",
        type: "relay",
        x: 0.88,
        y: 0.61,
        label: { dx: -14, dy: 0, anchor: "end" },
        labelTight: { dx: -13, dy: -2, anchor: "end" }
      },
      {
        id: "valley",
        name: "Valley",
        type: "remote",
        x: 0.14,
        y: 0.75,
        label: { dx: 15, dy: 11, anchor: "start" },
        labelTight: { dx: 14, dy: 10, anchor: "start" }
      },
      {
        id: "pinewood",
        name: "Pinewood",
        type: "remote",
        x: 0.88,
        y: 0.86,
        label: { dx: -14, dy: 15, anchor: "end" },
        labelTight: { dx: -13, dy: 12, anchor: "end" }
      }
    ],
    links: [
      { id: "glasgow-manchester", from: "glasgow", to: "manchester", type: "main" },
      { id: "edinburgh-manchester", from: "edinburgh", to: "manchester", type: "main" },
      { id: "manchester-birmingham", from: "manchester", to: "birmingham", type: "main" },
      { id: "birmingham-london", from: "birmingham", to: "london", type: "main" },
      { id: "london-valley", from: "london", to: "valley", type: "backup" },
      { id: "london-pinewood", from: "london", to: "pinewood", type: "backup" },
      { id: "london-hilltop", from: "london", to: "hilltop", type: "alert" },
      { id: "hilltop-ridgeway", from: "hilltop", to: "ridgeway", type: "backup" },
      { id: "ridgeway-pinewood", from: "ridgeway", to: "pinewood", type: "backup" }
    ]
  };

  // =========================================================
  // 03. Graph loading and validation
  // =========================================================

  function validateGraph(data) {
    return Boolean(
      data &&
      Array.isArray(data.nodes) &&
      data.nodes.length > 0 &&
      Array.isArray(data.links)
    );
  }

  async function getGraphData() {
    if (validateGraph(window.ATLAS_PRIVATE_GRAPH)) {
      return window.ATLAS_PRIVATE_GRAPH;
    }

    if (validateGraph(window.ATLAS_NETWORK_GRAPH)) {
      return window.ATLAS_NETWORK_GRAPH;
    }

    try {
      const response = await fetch(GRAPH_URL, { cache: "no-store" });

      if (response.ok) {
        const json = await response.json();

        if (validateGraph(json)) {
          return json;
        }
      }
    } catch {
      // Local previews and offline field checks should still render the demo map.
    }

    return FALLBACK_GRAPH;
  }

  // =========================================================
  // 04. DOM/SVG helpers
  // =========================================================

  function svg(tagName, attributes = {}, children = []) {
    const element = document.createElementNS(SVG_NS, tagName);

    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        element.setAttribute(key, String(value));
      }
    });

    children.forEach((child) => element.append(child));
    return element;
  }

  function text(value) {
    return document.createTextNode(value);
  }

  function typeLabel(type) {
    return {
      core: "CORE",
      main: "MAIN",
      relay: "RELAY",
      remote: "REMOTE"
    }[type] || String(type || "SITE").toUpperCase();
  }

  // =========================================================
  // 05. Geometry helpers
  // =========================================================

  function markerRadius(node, width) {
    const tight = width < 330;

    if (node.size === "large") {
      return tight ? 11.5 : 13;
    }

    if (node.type === "relay") {
      return tight ? 8.8 : 10.2;
    }

    return tight ? 8.2 : 9.6;
  }

  function linkCurve(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const curve = Math.max(-28, Math.min(28, dx * 0.10));
    const bow = Math.max(-12, Math.min(12, dy * 0.06));

    return [
      `M${x1} ${y1}`,
      `C${x1 + curve} ${y1 + bow},`,
      `${x2 - curve} ${y2 - bow},`,
      `${x2} ${y2}`
    ].join(" ");
  }

  function findSelectedLink(graph) {
    if (!graph.links.length) {
      return null;
    }

    return (
      graph.links.find((link) => link.id === graph.selectedPathId) ||
      graph.links.find((link) => `${link.from}-${link.to}` === graph.selectedPathId) ||
      graph.links.find((link) => link.type === "alert") ||
      graph.links[0]
    );
  }

  function getLayout(mount) {
    const rect = mount.getBoundingClientRect();
    const width = Math.max(220, Math.round(rect.width));
    const height = Math.max(120, Math.round(rect.height));
    const tight = width < 330;
    const padX = tight ? 13 : 18;
    const padTop = Math.max(10, height * 0.045);
    const padBottom = Math.max(18, height * 0.105);

    return {
      width,
      height,
      tight,
      padX,
      padTop,
      padBottom,
      xOf: (node) => padX + node.x * (width - padX * 2),
      yOf: (node) => padTop + node.y * (height - padTop - padBottom)
    };
  }

  // =========================================================
  // 06. SVG fragments
  // =========================================================

  function makeMast(x, y, scale = 1) {
    return svg("g", {
      class: "mast",
      transform: `translate(${x} ${y}) scale(${scale})`
    }, [
      svg("path", { d: "M0 -10v22M-7 12L0-10l7 22M-6 3H6M-4-4H4" }),
      svg("circle", {
        cx: 0,
        cy: -12,
        r: 2.2,
        fill: "currentColor",
        stroke: "none"
      }),
      svg("path", { d: "M-6-14C-12-8-12 0-6 6M6-14C12-8 12 0 6 6" }),
      svg("path", {
        d: "M-11-19C-21-9-21 5-11 15M11-19C21-9 21 5 11 15",
        opacity: 0.82
      })
    ]);
  }

  function makeSelectedHalo(radius) {
    /*
      Exact relay-halo-mesh geometry from the original hand-built SVG,
      scaled around the selected marker. This keeps the older
      broadcast-field look rather than a plain outline.
    */
    const scale = Math.max(0.30, Math.min(0.43, (radius + 15) / 72));

    return svg("g", {
      class: "demo-original-halo",
      transform: `scale(${scale})`
    }, [
      svg("circle", { class: "relay-halo-ring", r: 51 }),
      svg("circle", { class: "relay-halo-ring", r: 61 }),
      svg("circle", { class: "relay-halo-ring is-outer", r: 72 }),
      svg("path", {
        class: "relay-halo-line",
        d: "M42.3 7.5L72.9 12.8 M40.4 14.7L69.5 25.3 M32.9 27.6L56.7 47.6 M27.6 32.9L47.6 56.7 M14.7 40.4L25.3 69.5 M7.5 42.3L12.8 72.9 M-7.5 42.3L-12.8 72.9 M-14.7 40.4L-25.3 69.5 M-27.6 32.9L-47.6 56.7 M-32.9 27.6L-56.7 47.6 M-40.4 14.7L-69.5 25.3 M-42.3 7.5L-72.9 12.8 M-42.3 -7.5L-72.9 -12.8 M-40.4 -14.7L-69.5 -25.3 M-32.9 -27.6L-56.7 -47.6 M-27.6 -32.9L-47.6 -56.7 M-14.7 -40.4L-25.3 -69.5 M-7.5 -42.3L-12.8 -72.9 M7.5 -42.3L12.8 -72.9 M14.7 -40.4L25.3 -69.5 M27.6 -32.9L47.6 -56.7 M32.9 -27.6L56.7 -47.6 M40.4 -14.7L69.5 -25.3 M42.3 -7.5L72.9 -12.8"
      }),
      svg("path", {
        class: "relay-halo-line strong",
        d: "M38.0 0.0L82.0 0.0 M32.9 19.0L71.0 41.0 M19.0 32.9L41.0 71.0 M0.0 38.0L0.0 82.0 M-19.0 32.9L-41.0 71.0 M-32.9 19.0L-71.0 41.0 M-38.0 0.0L-82.0 0.0 M-32.9 -19.0L-71.0 -41.0 M-19.0 -32.9L-41.0 -71.0 M-0.0 -38.0L-0.0 -82.0 M19.0 -32.9L41.0 -71.0 M32.9 -19.0L71.0 -41.0 M-82 0L82 0 M0 -82L0 82"
      })
    ]);
  }

  function makeLabel(node, x, y, width, tight, radius) {
    const label = (tight && node.labelTight) ? node.labelTight : (node.label || {});
    const fallbackSide = x > width * 0.72 ? -1 : 1;
    const anchor = label.anchor || (fallbackSide < 0 ? "end" : "start");
    const dx = label.dx ?? fallbackSide * (radius + 7);
    const dy = label.dy ?? -4;
    const labelX = Math.max(4, Math.min(width - 4, x + dx));
    const labelY = y + dy;

    const labelText = svg("text", {
      class: `demo-label ${node.type}${tight ? " hide-type" : ""}`,
      x: labelX,
      y: labelY,
      "text-anchor": anchor
    });

    const name = svg("tspan", {
      class: "name",
      x: labelX,
      y: labelY
    });
    name.append(text(node.name || node.id));

    const type = svg("tspan", {
      class: "type",
      x: labelX,
      dy: tight ? 0 : 10
    });
    type.append(text(typeLabel(node.type)));

    labelText.append(name, type);
    return labelText;
  }

  // =========================================================
  // 07. Render layers
  // =========================================================

  function renderLinks(root, graph, nodes, layout, selectedLink) {
    const linkLayer = svg("g", { class: "demo-links" });

    graph.links.forEach((link) => {
      const fromNode = nodes.get(link.from);
      const toNode = nodes.get(link.to);

      if (!fromNode || !toNode) {
        return;
      }

      const x1 = layout.xOf(fromNode);
      const y1 = layout.yOf(fromNode);
      const x2 = layout.xOf(toNode);
      const y2 = layout.yOf(toNode);
      const d = linkCurve(x1, y1, x2, y2);
      const isSelectedPath =
        selectedLink &&
        link.from === selectedLink.from &&
        link.to === selectedLink.to;

      if (link.type !== "alert") {
        linkLayer.append(svg("path", {
          class: `demo-route demo-link-soft ${link.type === "backup" ? "is-backup" : "is-main"}`,
          d
        }));
      }

      linkLayer.append(svg("path", {
        class: `demo-route is-${link.type || "main"}${isSelectedPath ? " is-selected-path" : ""}`,
        d
      }));
    });

    root.append(linkLayer);
  }

  function renderRouteDots(root, graph, nodes, layout) {
    const dotLayer = svg("g", { class: "demo-route-dots" });

    graph.links.forEach((link) => {
      const fromNode = nodes.get(link.from);
      const toNode = nodes.get(link.to);

      if (!fromNode || !toNode) {
        return;
      }

      dotLayer.append(svg("circle", {
        class: `demo-route-dot ${link.type === "alert" ? "red" : link.type === "backup" ? "blue" : "green"}`,
        cx: (layout.xOf(fromNode) + layout.xOf(toNode)) / 2,
        cy: (layout.yOf(fromNode) + layout.yOf(toNode)) / 2,
        r: link.type === "alert" ? (layout.tight ? 3.7 : 4.4) : (layout.tight ? 2.6 : 3.2)
      }));
    });

    root.append(dotLayer);
  }

  function renderNodes(root, graph, layout, selectedIds) {
    const nodeLayer = svg("g", { class: "demo-nodes" });

    graph.nodes.forEach((node) => {
      const x = layout.xOf(node);
      const y = layout.yOf(node);
      const radius = markerRadius(node, layout.width);
      const isSelectedNode = selectedIds.has(node.id);

      const marker = svg("g", {
        class: `demo-node ${node.type}${isSelectedNode ? " is-selected" : ""}`,
        transform: `translate(${x} ${y})`
      });

      marker.append(
        svg("circle", {
          class: `halo ${node.type}${isSelectedNode ? " selected-halo" : ""}`,
          r: radius + (layout.tight ? 5.7 : 6.8),
          fill: node.type === "relay" ? "#ff5d32" : "#e8d9a0"
        }),
        ...(isSelectedNode ? [makeSelectedHalo(radius)] : []),
        svg("circle", {
          class: node.type,
          r: radius,
          "stroke-width": node.type === "relay" ? 1.8 : 1.55
        }),
        svg("circle", {
          class: "inner-ring",
          r: Math.max(3, radius - 3.4)
        }),
        makeMast(
          0,
          0,
          node.size === "large"
            ? (layout.tight ? 0.34 : 0.39)
            : (layout.tight ? 0.25 : 0.30)
        )
      );

      nodeLayer.append(marker);
      nodeLayer.append(makeLabel(node, x, y, layout.width, layout.tight, radius));
    });

    root.append(nodeLayer);
  }

  function renderCompass(root, layout) {
    const compass = svg("g", {
      class: "demo-compass",
      transform: `translate(${layout.padX + 20} ${layout.height - 38})`
    });

    compass.append(
      svg("circle", { r: 17 }),
      svg("path", { d: "M0-23V23M-23 0H23M-16-16L16 16M16-16L-16 16" }),
      svg("path", { d: "M0-17L4-4L17 0L4 4L0 17L-4 4L-17 0L-4-4Z" })
    );

    const north = svg("text", { x: -3, y: -24 });
    north.append(text("N"));

    compass.append(north);
    root.append(compass);
  }

  function renderLegend(root, layout) {
    const legendWidth = Math.min(220, layout.width - layout.padX * 2 - 4);
    const legendX = layout.padX + 2;
    const legendY = layout.height - 22;

    const legend = svg("g", {
      transform: `translate(${legendX} ${legendY})`
    });

    legend.append(svg("rect", {
      class: "demo-legend",
      x: 0,
      y: 0,
      width: legendWidth,
      height: 16,
      rx: 7
    }));

    [
      ["Core", "#106228"],
      ["Main", "#106228"],
      ["Relay", "#9f231a"],
      ["Remote", "#1b4d81"]
    ].forEach(([label, color], index) => {
      const itemX = 12 + index * (legendWidth / 4);

      legend.append(svg("circle", {
        cx: itemX,
        cy: 8,
        r: 3.2,
        fill: color,
        stroke: "#fff7de",
        "stroke-width": 0.8
      }));

      const labelText = svg("text", {
        class: "demo-legend-text",
        x: itemX + 7,
        y: 11
      });
      labelText.append(text(label));

      legend.append(labelText);
    });

    root.append(legend);
  }

  // =========================================================
  // 08. Main render
  // =========================================================

  function render(mount, graph) {
    const layout = getLayout(mount);
    const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
    const selectedLink = findSelectedLink(graph);
    const selectedIds = selectedLink ? new Set([selectedLink.from, selectedLink.to]) : new Set();

    const root = svg("svg", {
      viewBox: `0 0 ${layout.width} ${layout.height}`,
      role: "img",
      "aria-label": "Demo network map"
    });

    const title = svg("title");
    title.append(text("Demo network map"));
    root.append(title);

    root.append(svg("rect", {
      class: "demo-map-bg",
      x: 0,
      y: 0,
      width: layout.width,
      height: layout.height
    }));

    renderLinks(root, graph, nodes, layout, selectedLink);
    renderRouteDots(root, graph, nodes, layout);
    renderNodes(root, graph, layout, selectedIds);
    renderCompass(root, layout);
    renderLegend(root, layout);

    mount.replaceChildren(root);
    mount.dataset.mapVersion = VERSION;
  }

  // =========================================================
  // 09. Boot and redraw lifecycle
  // =========================================================

  function createRedraw(mount, graph) {
    let animationFrame = null;

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        render(mount, graph);
        animationFrame = null;
      });
    };
  }

  function bindResize(mount, redraw) {
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(redraw);
      observer.observe(mount);
      return observer;
    }

    window.addEventListener("resize", redraw, { passive: true });
    return null;
  }

  async function boot() {
    const mounts = Array.from(document.querySelectorAll("[data-demo-map]"));

    if (!mounts.length) {
      return;
    }

    const graph = await getGraphData();

    mounts.forEach((mount) => {
      const redraw = createRedraw(mount, graph);
      bindResize(mount, redraw);

      const toggle = document.querySelector(".rf-path-toggle");
      if (toggle) {
        toggle.addEventListener("change", () => window.setTimeout(redraw, 210));
      }

      redraw();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
