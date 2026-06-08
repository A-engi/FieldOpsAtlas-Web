/* RF Atlas demo map renderer
   Uses private/real graph data if it exists, otherwise falls back to demo nodes.
   Positions resize with the available map area. Marker and label sizes stay clamped. */

(() => {
  const FALLBACK_GRAPH = {
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
        x: 0.52,
        y: 0.86,
        size: "large",
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
      { from: "glasgow", to: "manchester", type: "main" },
      { from: "edinburgh", to: "manchester", type: "main" },
      { from: "manchester", to: "birmingham", type: "main" },
      { from: "birmingham", to: "london", type: "main" },
      { from: "london", to: "valley", type: "backup" },
      { from: "london", to: "pinewood", type: "backup" },
      { from: "london", to: "hilltop", type: "alert" },
      { from: "hilltop", to: "ridgeway", type: "backup" },
      { from: "ridgeway", to: "pinewood", type: "backup" }
    ],
    selectedPathId: "london-hilltop"
  };

  const typeLabel = (type) => ({
    core: "CORE",
    main: "MAIN",
    relay: "RELAY",
    remote: "REMOTE"
  }[type] || String(type || "SITE").toUpperCase());

  const validateGraph = (data) => (
    data &&
    Array.isArray(data.nodes) &&
    data.nodes.length > 0 &&
    Array.isArray(data.links)
  );

  const getGraphData = async () => {
    if (validateGraph(window.ATLAS_PRIVATE_GRAPH)) return window.ATLAS_PRIVATE_GRAPH;
    if (validateGraph(window.ATLAS_NETWORK_GRAPH)) return window.ATLAS_NETWORK_GRAPH;

    try {
      const response = await fetch("../../../data/rf-network-map.json", { cache: "no-store" });
      if (response.ok) {
        const json = await response.json();
        if (validateGraph(json)) return json;
      }
    } catch (_) {}

    return FALLBACK_GRAPH;
  };

  const svg = (tag, attrs = {}, children = []) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value !== null && value !== undefined) el.setAttribute(key, String(value));
    });
    children.forEach((child) => el.appendChild(child));
    return el;
  };

  const text = (value) => document.createTextNode(value);

  const makeMast = (x, y, scale = 1) => {
    const g = svg("g", { transform: `translate(${x} ${y}) scale(${scale})`, class: "mast" });
    g.append(
      svg("path", { d: "M0 -10v22M-7 12L0-10l7 22M-6 3H6M-4-4H4" }),
      svg("circle", { cx: 0, cy: -12, r: 2.2, fill: "currentColor", stroke: "none" }),
      svg("path", { d: "M-6-14C-12-8-12 0-6 6M6-14C12-8 12 0 6 6" }),
      svg("path", { d: "M-11-19C-21-9-21 5-11 15M11-19C21-9 21 5 11 15", opacity: 0.82 })
    );
    return g;
  };

  const makeSelectedHalo = (radius) => {
    /*
      Exact relay-halo-mesh geometry from the original hand-built SVG,
      scaled around the selected marker. This is the old broadcast-field look,
      not the newer plain outline.
    */
    const scale = Math.max(0.30, Math.min(0.43, (radius + 15) / 72));
    const mesh = svg("g", {
      class: "demo-original-halo",
      transform: `scale(${scale})`
    });

    mesh.append(
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
    );

    return mesh;
  };

  const markerRadius = (node, width) => {
    const tight = width < 330;
    if (node.size === "large") return tight ? 11.5 : 13;
    if (node.type === "relay") return tight ? 8.8 : 10.2;
    return tight ? 8.2 : 9.6;
  };

  const linkCurve = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const curve = Math.max(-28, Math.min(28, dx * 0.10));
    const bow = Math.max(-12, Math.min(12, dy * 0.06));
    return `M${x1} ${y1} C${x1 + curve} ${y1 + bow}, ${x2 - curve} ${y2 - bow}, ${x2} ${y2}`;
  };

  const render = (mount, graph) => {
    const rect = mount.getBoundingClientRect();
    const width = Math.max(220, Math.round(rect.width));
    const height = Math.max(120, Math.round(rect.height));
    const tight = width < 330;

    /*
      The positions use nearly all available stage space, but visual sizes are fixed.
      This prevents the graph becoming a giant sticker pile when the side panel is open.
    */
    const padX = tight ? 13 : 18;
    const padTop = Math.max(10, height * 0.045);
    const padBottom = Math.max(18, height * 0.105);

    const xOf = (node) => padX + node.x * (width - padX * 2);
    const yOf = (node) => padTop + node.y * (height - padTop - padBottom);

    const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
    const selectedLink =
      graph.links.find((link) => link.id === graph.selectedPathId) ||
      graph.links.find((link) => `${link.from}-${link.to}` === graph.selectedPathId) ||
      graph.links.find((link) => link.type === "alert") ||
      graph.links[0];

    const selectedIds = selectedLink ? new Set([selectedLink.from, selectedLink.to]) : new Set();

    const root = svg("svg", {
      viewBox: `0 0 ${width} ${height}`,
      role: "img",
      "aria-label": "Demo network map"
    });

    root.append(svg("rect", { class: "demo-map-bg", x: 0, y: 0, width, height }));

    const linkLayer = svg("g", { class: "demo-links" });
    graph.links.forEach((link) => {
      const a = nodes.get(link.from);
      const b = nodes.get(link.to);
      if (!a || !b) return;

      const x1 = xOf(a);
      const y1 = yOf(a);
      const x2 = xOf(b);
      const y2 = yOf(b);
      const d = linkCurve(x1, y1, x2, y2);

      const isSelectedPath = selectedLink && link.from === selectedLink.from && link.to === selectedLink.to;
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

    const dotLayer = svg("g", { class: "demo-route-dots" });
    graph.links.forEach((link) => {
      const a = nodes.get(link.from);
      const b = nodes.get(link.to);
      if (!a || !b) return;

      dotLayer.append(svg("circle", {
        class: `demo-route-dot ${link.type === "alert" ? "red" : link.type === "backup" ? "blue" : "green"}`,
        cx: (xOf(a) + xOf(b)) / 2,
        cy: (yOf(a) + yOf(b)) / 2,
        r: link.type === "alert" ? (tight ? 3.7 : 4.4) : (tight ? 2.6 : 3.2)
      }));
    });
    root.append(dotLayer);

    const nodeLayer = svg("g", { class: "demo-nodes" });
    graph.nodes.forEach((node) => {
      const x = xOf(node);
      const y = yOf(node);
      const radius = markerRadius(node, width);
      const isSelectedNode = selectedIds.has(node.id);
      const marker = svg("g", { class: `demo-node ${node.type}${isSelectedNode ? " is-selected" : ""}`, transform: `translate(${x} ${y})` });

      marker.append(
        svg("circle", {
          class: `halo ${node.type}${isSelectedNode ? " selected-halo" : ""}`,
          r: radius + (tight ? 5.7 : 6.8),
          fill: node.type === "relay" ? "#ff5d32" : "#e8d9a0"
        }),
        ...(isSelectedNode ? [
          makeSelectedHalo(radius)
        ] : []),
        svg("circle", {
          class: node.type,
          r: radius,
          "stroke-width": node.type === "relay" ? 1.8 : 1.55
        }),
        svg("circle", {
          class: "inner-ring",
          r: Math.max(3, radius - 3.4)
        }),
        makeMast(0, 0, node.size === "large" ? (tight ? 0.34 : 0.39) : (tight ? 0.25 : 0.30))
      );

      nodeLayer.append(marker);

      const label = (tight && node.labelTight) ? node.labelTight : (node.label || {});
      const fallbackSide = x > width * 0.72 ? -1 : 1;
      const anchor = label.anchor || (fallbackSide < 0 ? "end" : "start");
      const dx = label.dx ?? fallbackSide * (radius + 7);
      const dy = label.dy ?? -4;

      let labelX = x + dx;
      const labelY = y + dy;

      const minX = 4;
      const maxX = width - 4;
      labelX = Math.max(minX, Math.min(maxX, labelX));

      const labelText = svg("text", {
        class: `demo-label ${node.type}${tight ? " hide-type" : ""}`,
        x: labelX,
        y: labelY,
        "text-anchor": anchor
      });

      const name = svg("tspan", { class: "name", x: labelX, y: labelY });
      name.append(text(node.name || node.id));

      const type = svg("tspan", { class: "type", x: labelX, dy: tight ? 0 : 10 });
      type.append(text(typeLabel(node.type)));

      labelText.append(name, type);
      nodeLayer.append(labelText);
    });
    root.append(nodeLayer);

    const compass = svg("g", {
      class: "demo-compass",
      transform: `translate(${padX + 20} ${height - 38})`
    });
    compass.append(
      svg("circle", { r: 17 }),
      svg("path", { d: "M0-23V23M-23 0H23M-16-16L16 16M16-16L-16 16" }),
      svg("path", { d: "M0-17L4-4L17 0L4 4L0 17L-4 4L-17 0L-4-4Z" })
    );
    const n = svg("text", { x: -3, y: -24 });
    n.append(text("N"));
    compass.append(n);
    root.append(compass);

    const legendW = Math.min(220, width - padX * 2 - 4);
    const legendX = padX + 2;
    const legendY = height - 22;
    const legend = svg("g", { transform: `translate(${legendX} ${legendY})` });
    legend.append(svg("rect", {
      class: "demo-legend",
      x: 0,
      y: 0,
      width: legendW,
      height: 16,
      rx: 7
    }));

    [
      ["Core", "#106228"],
      ["Main", "#106228"],
      ["Relay", "#9f231a"],
      ["Remote", "#1b4d81"]
    ].forEach(([label, color], index) => {
      const itemX = 12 + index * (legendW / 4);
      legend.append(svg("circle", {
        cx: itemX,
        cy: 8,
        r: 3.2,
        fill: color,
        stroke: "#fff7de",
        "stroke-width": 0.8
      }));

      const t = svg("text", { class: "demo-legend-text", x: itemX + 7, y: 11 });
      t.append(text(label));
      legend.append(t);
    });
    root.append(legend);

    mount.replaceChildren(root);
  };

  const boot = async () => {
    const mount = document.querySelector("[data-demo-map]");
    if (!mount) return;

    const graph = await getGraphData();

    let raf = null;
    const draw = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => render(mount, graph));
    };

    const observer = new ResizeObserver(draw);
    observer.observe(mount);

    const toggle = document.querySelector(".rf-path-toggle");
    if (toggle) toggle.addEventListener("change", () => setTimeout(draw, 210));

    draw();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
