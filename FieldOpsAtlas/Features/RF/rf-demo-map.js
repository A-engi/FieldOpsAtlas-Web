(() => {
  "use strict";

  const VERSION = "1.1.1";
  const SVG_NS = ["http:", "", "www.w3.org", "2000", "svg"].join("/");

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

  const typeLabel = (type) => ({
    core: "CORE",
    main: "MAIN",
    relay: "RELAY",
    remote: "REMOTE"
  }[type] || String(type || "SITE").toUpperCase());

  function createSvgElement(tagName, attributes = {}, children = []) {
    const element = document.createElementNS(SVG_NS, tagName);

    Object.entries(attributes).forEach(([name, value]) => {
      if (value !== null && value !== undefined) {
        element.setAttribute(name, String(value));
      }
    });

    children.forEach((child) => element.append(child));
    return element;
  }

  function createText(value) {
    return document.createTextNode(value);
  }

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
      const response = await fetch("../../../data/rf-network-map.json", {
        cache: "no-store"
      });

      if (response.ok) {
        const json = await response.json();

        if (validateGraph(json)) {
          return json;
        }
      }
    } catch {
      // Offline/local previews fall back to safe demo graph data.
    }

    return FALLBACK_GRAPH;
  }

  function getNodeRadius(node, width) {
    const tight = width < 330;

    if (node.size === "large") {
      return tight ? 11.5 : 13;
    }

    if (node.type === "relay") {
      return tight ? 8.8 : 10.2;
    }

    return tight ? 8.2 : 9.6;
  }

  function getLinkPath(x1, y1, x2, y2) {
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

  function makeMastIcon(scale = 1) {
    return createSvgElement("g", { class: "map-mast", transform: `scale(${scale})` }, [
      createSvgElement("path", { d: "M0 -10v22M-7 12L0-10l7 22M-6 3H6M-4-4H4" }),
      createSvgElement("circle", { cx: 0, cy: -12, r: 2.2 }),
      createSvgElement("path", { d: "M-6-14C-12-8-12 0-6 6M6-14C12-8 12 0 6 6" }),
      createSvgElement("path", {
        d: "M-11-19C-21-9-21 5-11 15M11-19C21-9 21 5 11 15",
        opacity: 0.82
      })
    ]);
  }

  function makeSelectedHalo(radius) {
    const scale = Math.max(0.30, Math.min(0.43, (radius + 15) / 72));

    return createSvgElement("g", {
      class: "map-selected-halo",
      transform: `scale(${scale})`
    }, [
      createSvgElement("circle", { class: "map-halo-ring", r: 51 }),
      createSvgElement("circle", { class: "map-halo-ring", r: 61 }),
      createSvgElement("circle", { class: "map-halo-ring is-outer", r: 72 }),
      createSvgElement("path", {
        class: "map-halo-line",
        d: "M42.3 7.5L72.9 12.8 M40.4 14.7L69.5 25.3 M32.9 27.6L56.7 47.6 M27.6 32.9L47.6 56.7 M14.7 40.4L25.3 69.5 M7.5 42.3L12.8 72.9 M-7.5 42.3L-12.8 72.9 M-14.7 40.4L-25.3 69.5 M-27.6 32.9L-47.6 56.7 M-32.9 27.6L-56.7 47.6 M-40.4 14.7L-69.5 25.3 M-42.3 7.5L-72.9 12.8 M-42.3 -7.5L-72.9 -12.8 M-40.4 -14.7L-69.5 -25.3 M-32.9 -27.6L-56.7 -47.6 M-27.6 -32.9L-47.6 -56.7 M-14.7 -40.4L-25.3 -69.5 M-7.5 -42.3L-12.8 -72.9 M7.5 -42.3L12.8 -72.9 M14.7 -40.4L25.3 -69.5 M27.6 -32.9L47.6 -56.7 M32.9 -27.6L56.7 -47.6 M40.4 -14.7L69.5 -25.3 M42.3 -7.5L72.9 -12.8"
      }),
      createSvgElement("path", {
        class: "map-halo-line is-strong",
        d: "M38.0 0.0L82.0 0.0 M32.9 19.0L71.0 41.0 M19.0 32.9L41.0 71.0 M0.0 38.0L0.0 82.0 M-19.0 32.9L-41.0 71.0 M-32.9 19.0L-71.0 41.0 M-38.0 0.0L-82.0 0.0 M-32.9 -19.0L-71.0 -41.0 M-19.0 -32.9L-41.0 -71.0 M-0.0 -38.0L-0.0 -82.0 M19.0 -32.9L41.0 -71.0 M32.9 -19.0L71.0 -41.0 M-82 0L82 0 M0 -82L0 82"
      })
    ]);
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

  function renderLinks(root, graph, nodesById, xOf, yOf, selectedLink) {
    const layer = createSvgElement("g", { class: "map-links" });

    graph.links.forEach((link) => {
      const fromNode = nodesById.get(link.from);
      const toNode = nodesById.get(link.to);

      if (!fromNode || !toNode) {
        return;
      }

      const isSelected =
        selectedLink &&
        selectedLink.from === link.from &&
        selectedLink.to === link.to;

      const path = createSvgElement("path", {
        class: `map-link is-${link.type || "main"}${isSelected ? " is-active" : ""}`,
        d: getLinkPath(xOf(fromNode), yOf(fromNode), xOf(toNode), yOf(toNode))
      });

      layer.append(path);
    });

    root.append(layer);
  }

  function renderRouteDots(root, graph, nodesById, xOf, yOf) {
    const layer = createSvgElement("g", { class: "map-route-dots" });

    graph.links.forEach((link) => {
      const fromNode = nodesById.get(link.from);
      const toNode = nodesById.get(link.to);

      if (!fromNode || !toNode) {
        return;
      }

      layer.append(createSvgElement("circle", {
        class: `map-route-dot is-${link.type || "main"}`,
        cx: (xOf(fromNode) + xOf(toNode)) / 2,
        cy: (yOf(fromNode) + yOf(toNode)) / 2,
        r: link.type === "alert" ? 4.4 : 3.2
      }));
    });

    root.append(layer);
  }

  function renderNodes(root, graph, xOf, yOf, selectedNodeIds, width) {
    const tight = width < 330;
    const layer = createSvgElement("g", { class: "map-sites" });

    graph.nodes.forEach((node) => {
      const x = xOf(node);
      const y = yOf(node);
      const radius = getNodeRadius(node, width);
      const isSelected = selectedNodeIds.has(node.id);

      const group = createSvgElement("g", {
        class: `map-site-group is-${node.type || "site"}${isSelected ? " is-selected" : ""}`,
        transform: `translate(${x} ${y})`,
        tabindex: "0",
        role: "img",
        "aria-label": `${node.name || node.id} ${typeLabel(node.type)} RF site`
      });

      group.append(
        createSvgElement("circle", {
          class: `map-site-halo is-${node.type || "site"}${isSelected ? " is-selected" : ""}`,
          r: radius + (tight ? 5.7 : 6.8)
        })
      );

      if (isSelected) {
        group.append(makeSelectedHalo(radius));
      }

      group.append(
        createSvgElement("circle", {
          class: `map-site is-${node.type || "site"}`,
          r: radius
        }),
        createSvgElement("circle", {
          class: "map-site-inner",
          r: Math.max(3, radius - 3.4)
        }),
        makeMastIcon(node.size === "large" ? (tight ? 0.34 : 0.39) : (tight ? 0.25 : 0.30))
      );

      layer.append(group);
      layer.append(makeLabel(node, x, y, radius, width, tight));
    });

    root.append(layer);
  }

  function makeLabel(node, x, y, radius, width, tight) {
    const label = (tight && node.labelTight) ? node.labelTight : (node.label || {});
    const fallbackSide = x > width * 0.72 ? -1 : 1;
    const anchor = label.anchor || (fallbackSide < 0 ? "end" : "start");
    const dx = label.dx ?? fallbackSide * (radius + 7);
    const dy = label.dy ?? -4;

    const labelX = Math.max(4, Math.min(width - 4, x + dx));
    const labelY = y + dy;

    const labelText = createSvgElement("text", {
      class: `map-label is-${node.type || "site"}${tight ? " is-tight" : ""}`,
      x: labelX,
      y: labelY,
      "text-anchor": anchor
    });

    const name = createSvgElement("tspan", {
      class: "map-label-name",
      x: labelX,
      y: labelY
    });
    name.append(createText(node.name || node.id));

    const type = createSvgElement("tspan", {
      class: "map-label-type",
      x: labelX,
      dy: tight ? 0 : 10
    });
    type.append(createText(typeLabel(node.type)));

    labelText.append(name, type);
    return labelText;
  }

  function renderCompass(root, x, y) {
    const compass = createSvgElement("g", {
      class: "map-compass",
      transform: `translate(${x} ${y})`
    });

    compass.append(
      createSvgElement("circle", { r: 17 }),
      createSvgElement("path", { d: "M0-23V23M-23 0H23M-16-16L16 16M16-16L-16 16" }),
      createSvgElement("path", { d: "M0-17L4-4L17 0L4 4L0 17L-4 4L-17 0L-4-4Z" })
    );

    const north = createSvgElement("text", { x: -3, y: -24 });
    north.append(createText("N"));
    compass.append(north);

    root.append(compass);
  }

  function renderLegend(root, width, height, padX) {
    const legendWidth = Math.min(220, width - padX * 2 - 4);
    const legend = createSvgElement("g", {
      class: "map-legend",
      transform: `translate(${padX + 2} ${height - 22})`
    });

    legend.append(createSvgElement("rect", {
      class: "map-legend-box",
      x: 0,
      y: 0,
      width: legendWidth,
      height: 16,
      rx: 7
    }));

    [
      ["Core", "core"],
      ["Main", "main"],
      ["Relay", "relay"],
      ["Remote", "remote"]
    ].forEach(([label, type], index) => {
      const x = 12 + index * (legendWidth / 4);
      const item = createSvgElement("g", { class: `map-legend-item is-${type}` });

      item.append(createSvgElement("circle", {
        class: "map-legend-dot",
        cx: x,
        cy: 8,
        r: 3.2
      }));

      const textNode = createSvgElement("text", {
        class: "map-legend-text",
        x: x + 7,
        y: 11
      });
      textNode.append(createText(label));

      item.append(textNode);
      legend.append(item);
    });

    root.append(legend);
  }

  function renderMap(mount, graph) {
    const rect = mount.getBoundingClientRect();
    const width = Math.max(220, Math.round(rect.width));
    const height = Math.max(120, Math.round(rect.height));
    const tight = width < 330;

    const padX = tight ? 13 : 18;
    const padTop = Math.max(10, height * 0.045);
    const padBottom = Math.max(18, height * 0.105);

    const xOf = (node) => padX + node.x * (width - padX * 2);
    const yOf = (node) => padTop + node.y * (height - padTop - padBottom);

    const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
    const selectedLink = findSelectedLink(graph);
    const selectedNodeIds = selectedLink ? new Set([selectedLink.from, selectedLink.to]) : new Set();

    const root = createSvgElement("svg", {
      viewBox: `0 0 ${width} ${height}`,
      role: "img",
      "aria-label": "Demo RF network map"
    });

    const title = createSvgElement("title");
    title.append(createText("Demo RF network map"));
    root.append(title);

    root.append(createSvgElement("rect", {
      class: "map-background",
      x: 0,
      y: 0,
      width,
      height
    }));

    renderLinks(root, graph, nodesById, xOf, yOf, selectedLink);
    renderRouteDots(root, graph, nodesById, xOf, yOf);
    renderNodes(root, graph, xOf, yOf, selectedNodeIds, width);
    renderCompass(root, padX + 20, height - 38);
    renderLegend(root, width, height, padX);

    mount.replaceChildren(root);
    mount.dataset.mapVersion = VERSION;
  }

  function createRedraw(mount, graph) {
    let animationFrame = null;

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        renderMap(mount, graph);
        animationFrame = null;
      });
    };
  }

  async function boot() {
    const mounts = Array.from(document.querySelectorAll("[data-demo-map]"));

    if (!mounts.length) {
      return;
    }

    const graph = await getGraphData();

    mounts.forEach((mount) => {
      const redraw = createRedraw(mount, graph);

      if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(redraw);
        observer.observe(mount);
      } else {
        window.addEventListener("resize", redraw, { passive: true });
      }

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
