// Converts the Commons technical drawings (scripts/svg/*.svg) into flattened,
// view-separated stroke lists for the draw-on animation (src/data/drawings/*.json).
// Geometry is taken as-is from the source drawings: nothing is redrawn by hand.
const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");
const svgpath = require("svgpath");
const bounds = require("svg-path-bounds");

const SRC = path.join(__dirname, "svg");
const OUT = path.join(__dirname, "..", "remotion-app", "src", "data", "drawings");
fs.mkdirSync(OUT, { recursive: true });

const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: "" });

const styleOf = (attrs) => {
  const s = {};
  (attrs.style || "").split(";").forEach((kv) => {
    const [k, v] = kv.split(":").map((x) => x && x.trim());
    if (k) s[k] = v;
  });
  for (const k of ["stroke", "fill", "stroke-width", "display", "opacity", "visibility"]) if (attrs[k] != null && s[k] == null) s[k] = attrs[k];
  return s;
};

const shapeToD = (tag, a) => {
  const n = (k) => parseFloat(a[k] || 0);
  switch (tag) {
    case "path":
      return a.d;
    case "line":
      return `M${n("x1")},${n("y1")}L${n("x2")},${n("y2")}`;
    case "rect": {
      const x = n("x"), y = n("y"), w = n("width"), h = n("height");
      return `M${x},${y}H${x + w}V${y + h}H${x}Z`;
    }
    case "circle":
    case "ellipse": {
      const cx = n("cx"), cy = n("cy");
      const rx = tag === "circle" ? n("r") : n("rx");
      const ry = tag === "circle" ? n("r") : n("ry");
      return `M${cx - rx},${cy}A${rx},${ry} 0 1 0 ${cx + rx},${cy}A${rx},${ry} 0 1 0 ${cx - rx},${cy}Z`;
    }
    case "polyline":
    case "polygon": {
      const pts = (a.points || "").trim().split(/[\s,]+/).map(Number);
      let d = "";
      for (let i = 0; i + 1 < pts.length; i += 2) d += (i ? "L" : "M") + pts[i] + "," + pts[i + 1];
      return tag === "polygon" ? d + "Z" : d;
    }
  }
  return null;
};

const scaleOf = (tf) => {
  if (!tf) return 1;
  const p = svgpath("M0,0L1,0M0,0L0,1").transform(tf).abs().toString();
  const nums = p.match(/-?[\d.]+(e-?\d+)?/g).map(Number);
  const sx = Math.hypot(nums[2] - nums[0], nums[3] - nums[1]);
  const sy = Math.hypot(nums[6] - nums[4], nums[7] - nums[5]);
  return Math.sqrt(sx * sy) || 1;
};

function collect(nodes, tf, inherited, out) {
  for (const node of nodes) {
    const tag = Object.keys(node).find((k) => k !== ":@");
    if (!tag || tag === "#text") continue;
    if (["defs", "metadata", "sodipodi:namedview", "title", "desc", "clipPath", "mask", "pattern", "linearGradient", "radialGradient", "text"].includes(tag)) continue;
    const attrs = node[":@"] || {};
    const st = { ...inherited, ...styleOf(attrs) };
    if (st.display === "none" || st.visibility === "hidden" || st.opacity === "0") continue;
    const t = [tf, attrs.transform].filter(Boolean).join(" ");
    const d = shapeToD(tag, attrs);
    if (d) {
      const stroke = st.stroke && st.stroke !== "none" ? st.stroke : null;
      const fill = st.fill && st.fill !== "none" ? st.fill : tag === "path" && !stroke ? "#000" : null;
      if (!stroke && !fill) continue;
      let flat;
      try {
        flat = svgpath(d).transform(t).abs().round(2).toString();
      } catch {
        continue;
      }
      const w = parseFloat(st["stroke-width"] || "1") * scaleOf(t);
      const red = /^#cc0000$|^#ff0000$|red/i.test(stroke || "");
      // combined Inkscape paths can span several views: stroke-only paths are split per subpath
      const parts = stroke ? flat.split(/(?=M)/).filter((x) => x.length > 3) : [flat];
      for (const part of parts) {
        const [x0, y0, x1, y1] = bounds(part);
        if (!isFinite(x0)) continue;
        out.push({ d: part, bbox: [x0, y0, x1, y1], w: +w.toFixed(3), red, stroke: !!stroke, fill: !!fill && !stroke });
      }
    }
    collect(node[tag] || [], t, st, out);
  }
}

function clusterViews(items, gap) {
  const parent = items.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const near = (a, b) => a[0] - gap <= b[2] && b[0] - gap <= a[2] && a[1] - gap <= b[3] && b[1] - gap <= a[3];
  // sweep by x to keep this O(n log n)-ish
  const order = items.map((p, i) => [p.bbox[0], i]).sort((a, b) => a[0] - b[0]);
  for (let s = 0; s < order.length; s++) {
    const i = order[s][1];
    for (let u = s + 1; u < order.length && order[u][0] <= items[i].bbox[2] + gap; u++) {
      const j = order[u][1];
      if (near(items[i].bbox, items[j].bbox)) parent[find(i)] = find(j);
    }
  }
  const groups = new Map();
  items.forEach((p, i) => {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(p);
  });
  return [...groups.values()];
}

for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith(".svg"))) {
  const name = file.replace(/\.svg$/, "");
  const tree = parser.parse(fs.readFileSync(path.join(SRC, file), "utf8"));
  const svg = tree.find((n) => n.svg);
  const items = [];
  collect(svg.svg, "", {}, items);
  if (!items.length) continue;
  const all = items.reduce((b, p) => [Math.min(b[0], p.bbox[0]), Math.min(b[1], p.bbox[1]), Math.max(b[2], p.bbox[2]), Math.max(b[3], p.bbox[3])], [Infinity, Infinity, -Infinity, -Infinity]);
  const gap = Math.max(all[2] - all[0], all[3] - all[1]) * (name.startsWith("typhoon") ? 0.002 : 0.012);
  // drop sheet frames/backgrounds that would glue every view together
  const W = all[2] - all[0], H = all[3] - all[1];
  const kept = items.filter((p) => !((p.bbox[2] - p.bbox[0]) > W * 0.7 && (p.bbox[3] - p.bbox[1]) > H * 0.7 && items.length > 5));
  // hand-checked view regions where the source places views close together
  const REGIONS = {
    "typhoon-lines": [
      (c) => c[1] < 200 && c[0] > 395 && !(c[0] < 480 && c[1] > 145), // side
    ],
  };
  const pre = [];
  let rest = kept;
  for (const test of REGIONS[name] || []) {
    const ctr = (p) => [(p.bbox[0] + p.bbox[2]) / 2, (p.bbox[1] + p.bbox[3]) / 2];
    pre.push(rest.filter((p) => test(ctr(p))));
    rest = rest.filter((p) => !test(ctr(p)));
  }
  const views = [...pre, ...clusterViews(rest, gap)]
    .filter((g) => g.length)
    .map((paths) => {
      const bbox = paths.reduce((b, p) => [Math.min(b[0], p.bbox[0]), Math.min(b[1], p.bbox[1]), Math.max(b[2], p.bbox[2]), Math.max(b[3], p.bbox[3])], [Infinity, Infinity, -Infinity, -Infinity]);
      const area = (p) => (p.bbox[2] - p.bbox[0]) * (p.bbox[3] - p.bbox[1]);
      // plotter order: the few big outline strokes first, then detail from left to right
      const sorted = [...paths].sort((a, b) => area(b) - area(a));
      const lead = sorted.slice(0, Math.max(3, Math.round(paths.length * 0.04)));
      const rest = sorted.slice(lead.length).sort((a, b) => a.bbox[0] + a.bbox[2] - (b.bbox[0] + b.bbox[2]));
      return { bbox: bbox.map((v) => +v.toFixed(1)), paths: [...lead, ...rest].map(({ d, w, red, fill }) => ({ d, w, ...(red ? { r: 1 } : {}), ...(fill ? { f: 1 } : {}) })) };
    })
    .filter((v) => v.paths.length > 2 || kept.length < 5)
    .sort((a, b) => b.paths.length - a.paths.length);
  fs.writeFileSync(path.join(OUT, name + ".json"), JSON.stringify({ name, bbox: all.map((v) => +v.toFixed(1)), views }));
  console.log(name, items.length, "items,", views.length, "views:", views.map((v) => `${v.paths.length}@[${v.bbox.map(Math.round).join(",")}]`).join(" "));
}
