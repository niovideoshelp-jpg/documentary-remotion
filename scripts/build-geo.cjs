// Projects Natural Earth country boundaries (public/world.json) into the
// project's Mercator frame and writes simplified SVG paths to src/data/geo.json.
// The same projection constants live in src/map/projection.ts and scripts/preprocess.py.
const fs = require("fs");
const path = require("path");
const app = path.join(__dirname, "..", "remotion-app");
const world = JSON.parse(fs.readFileSync(path.join(app, "public", "world.json"), "utf8"));

const K = 48, LON0 = -25, LAT_TOP = 66;
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const project = ([lon, lat]) => [(lon - LON0) * K, (merc(LAT_TOP) - merc(lat)) * K * (180 / Math.PI)];
const EXT = { lon: [-26, 112], lat: [-13, 67] };

// Countries that the edit highlights get finer geometry.
const DETAIL = new Set(["United Kingdom", "Germany", "Italy", "Spain", "France", "Qatar", "India", "Egypt", "Saudi Arabia", "Greece", "Croatia", "Indonesia", "United Arab Emirates", "Republic of Serbia", "Oman", "Kuwait", "Austria", "Turkey"]);

function dp(points, tol) {
  if (points.length < 4) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a], [bx, by] = points[b];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    let max = 0, idx = -1;
    for (let i = a + 1; i < b; i++) {
      // closed rings start and end on the same point: fall back to point distance
      const d = len === 0
        ? Math.hypot(points[i][0] - ax, points[i][1] - ay)
        : Math.abs(dy * points[i][0] - dx * points[i][1] + bx * ay - by * ax) / len;
      if (d > max) { max = d; idx = i; }
    }
    if (max > tol) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return points.filter((_, i) => keep[i]);
}

const out = [];
for (const f of world.features) {
  if (!f.geometry) continue;
  const name = f.properties.name;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const tol = DETAIL.has(name) ? 0.35 : 0.9;
  let d = "";
  let bbox = [Infinity, Infinity, -Infinity, -Infinity];
  let area = 0, best = null;
  for (const poly of polys) {
    const outer = poly[0];
    const inExt = outer.some(([x, y]) => x > EXT.lon[0] && x < EXT.lon[1] && y > EXT.lat[0] && y < EXT.lat[1]);
    if (!inExt) continue;
    for (const ring of poly) {
      const pts = dp(ring.map(project), tol);
      if (pts.length < 3) continue;
      // drop specks below ~2 px²
      let a = 0;
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
        a += x1 * y2 - x2 * y1;
      }
      if (Math.abs(a) / 2 < 2) continue;
      if (ring === outer && Math.abs(a) > area) { area = Math.abs(a); best = pts; }
      d += "M" + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
      for (const [x, y] of pts) {
        bbox = [Math.min(bbox[0], x), Math.min(bbox[1], y), Math.max(bbox[2], x), Math.max(bbox[3], y)];
      }
    }
  }
  if (!d) continue;
  // pole of the largest ring's bbox as a rough visual centre; labels are tuned by hand in the scenes
  const c = best ? best.reduce((s, p) => [s[0] + p[0] / best.length, s[1] + p[1] / best.length], [0, 0]) : [0, 0];
  out.push({ name, d, bbox: bbox.map((v) => Math.round(v)), c: c.map((v) => Math.round(v)) });
}
fs.writeFileSync(path.join(app, "src", "data", "geo.json"), JSON.stringify(out));
console.log(out.length, "countries", fs.statSync(path.join(app, "src", "data", "geo.json")).size, "bytes");
