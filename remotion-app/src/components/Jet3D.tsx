import React, { useMemo } from "react";
import { createTimeline } from "animejs";

/*
 * A shaded low-poly Eurofighter Typhoon in true 3D (metres; x forward, y to starboard,
 * z up; length 15.96 m, span 10.95 m). Painter-sorted SVG polygons, so it renders
 * deterministically in Remotion. The camera (yaw, pitch, zoom, focus) is driven by an
 * Anime.js timeline that is seeked to the current time on every frame.
 */

type V = [number, number, number];
type Poly = { pts: V[]; fill: [number, number, number]; kind?: "glass" | "hole" | "sensor" };

// fuselage stations: x, half-width, bottom z, top z
const BODY: [number, number, number, number][] = [
  [8.0, 0.02, 0.28, 0.32],
  [7.2, 0.3, 0.02, 0.6],
  [6.2, 0.5, -0.28, 0.84],
  [5.2, 0.62, -0.42, 0.98],
  [4.2, 0.7, -0.5, 1.08],
  [3.0, 0.8, -0.55, 1.05],
  [1.5, 0.92, -0.62, 0.96],
  [0.0, 0.98, -0.66, 0.93],
  [-2.5, 1.0, -0.64, 0.9],
  [-5.0, 0.98, -0.58, 0.86],
  [-7.1, 0.9, -0.5, 0.72],
];
const CANOPY: [number, number, number, number][] = [
  [5.6, 0.04, 0.92, 0.97],
  [4.9, 0.36, 0.92, 1.36],
  [3.9, 0.42, 0.98, 1.47],
  [2.7, 0.34, 0.96, 1.3],
  [1.7, 0.08, 0.93, 0.99],
];
// chin intake: x, half-width, bottom z, top z (rectangular duct under the forward fuselage)
const INTAKE: [number, number, number, number][] = [
  [4.1, 0.66, -1.02, -0.42],
  [3.0, 0.72, -0.98, -0.48],
  [1.2, 0.78, -0.9, -0.56],
  [-0.4, 0.8, -0.76, -0.6],
];

const GREY: [number, number, number] = [196, 200, 203];
const DARK: [number, number, number] = [60, 64, 68];

const ring = (x: number, hw: number, zb: number, zt: number, n = 12): V[] => {
  const zc = (zb + zt) / 2;
  const hz = (zt - zb) / 2;
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [x, hw * Math.sign(c) * Math.abs(c) ** 0.7, zc + hz * Math.sign(s) * Math.abs(s) ** 0.85] as V;
  });
};
const loft = (st: [number, number, number, number][], fill: [number, number, number], n = 12, kind?: Poly["kind"]): Poly[] => {
  const rings = st.map(([x, hw, zb, zt]) => ring(x, hw, zb, zt, n));
  const out: Poly[] = [];
  for (let s = 0; s < rings.length - 1; s++)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      out.push({ pts: [rings[s][i], rings[s][j], rings[s + 1][j], rings[s + 1][i]], fill, kind });
    }
  return out;
};
const box = (st: [number, number, number, number][]): Poly[] => {
  const sq = ([x, hw, zb, zt]: [number, number, number, number]): V[] => [
    [x, -hw, zb],
    [x, hw, zb],
    [x, hw, zt],
    [x, -hw, zt],
  ];
  const r = st.map(sq);
  const out: Poly[] = [];
  for (let s = 0; s < r.length - 1; s++) for (let i = 0; i < 4; i++) out.push({ pts: [r[s][i], r[s][(i + 1) % 4], r[s + 1][(i + 1) % 4], r[s + 1][i]], fill: GREY });
  out.push({ pts: r[0], fill: [52, 56, 60], kind: "hole" }); // intake mouth: the front of the aircraft
  return out;
};
const mirror = (pts: V[]): V[] => pts.map(([x, y, z]) => [x, -y, z] as V);

export const PIRATE_POS: V = [5.9, -0.5, 0.66]; // port side, ahead of the windscreen

const MODEL: Poly[] = (() => {
  const wing: V[] = [
    [1.9, 0.95, -0.28],
    [-5.3, 5.47, -0.28],
    [-6.3, 5.47, -0.28],
    [-6.9, 0.95, -0.28],
  ];
  const canard: V[] = [
    [4.45, 0.7, 0.36],
    [3.35, 2.05, 0.36],
    [2.85, 2.05, 0.36],
    [3.0, 0.7, 0.36],
  ];
  const fin: V[] = [
    [-2.6, 0, 0.88],
    [-5.9, 0, 4.3],
    [-6.8, 0, 4.3],
    [-7.0, 0, 0.72],
  ];
  const nozzle = (y: number): Poly[] => {
    const r = ring(-7.1, 0.42, -0.36, 0.48, 10).map(([x, yy, z]) => [x, yy + y, z] as V);
    const back = r.map(([, yy, z]) => [-7.55, yy, z] as V);
    const sides: Poly[] = r.map((p, i) => ({ pts: [p, r[(i + 1) % 10], back[(i + 1) % 10], back[i]], fill: DARK }));
    return [...sides, { pts: back, fill: [18, 18, 18], kind: "hole" }];
  };
  return [
    ...loft(BODY, GREY),
    ...loft(CANOPY, [70, 86, 98], 10, "glass"),
    ...box(INTAKE),
    { pts: wing, fill: GREY },
    { pts: mirror(wing), fill: GREY },
    { pts: canard, fill: GREY },
    { pts: mirror(canard), fill: GREY },
    { pts: fin, fill: GREY },
    ...nozzle(0.46),
    ...nozzle(-0.46),
  ];
})();

export type JetCam = { yaw: number; pitch: number; zoom: number; focus: number };
type Key = { at: number; to: Partial<JetCam>; dur: number; ease?: string };

/** Camera path as Anime.js keyframes (times in seconds from `t0`). */
export const useJetCamera = (t: number, t0: number, start: JetCam, keysIn: Key[]): JetCam => {
  const cam = useMemo(() => ({ ...start }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const tl = useMemo(() => {
    const timeline = createTimeline({ autoplay: false });
    for (const k of keysIn) timeline.add(cam, { ...k.to, duration: k.dur * 1000, ease: k.ease ?? "inOutCubic" }, k.at * 1000);
    return timeline;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  tl.seek(Math.max(0, (t - t0) * 1000));
  return { ...cam };
};

const rad = (d: number) => (d * Math.PI) / 180;

export const project = (p: V, cam: JetCam, cx: number, cy: number, scale: number, focus: V = PIRATE_POS) => {
  const tf = (q: V) => {
    const [x, y, z] = q;
    const cy_ = Math.cos(rad(cam.yaw));
    const sy = Math.sin(rad(cam.yaw));
    const x1 = x * cy_ - y * sy;
    const y1 = x * sy + y * cy_;
    const cp = Math.cos(rad(cam.pitch));
    const sp = Math.sin(rad(cam.pitch));
    const x2 = x1 * cp + z * sp;
    const z2 = -x1 * sp + z * cp;
    const D = 42;
    const k = (scale * cam.zoom * D) / (D - x2);
    return { sx: y1 * k, sy: -z2 * k, depth: D - x2, x2, y1, z2 };
  };
  const a = tf(p);
  const f = tf(focus);
  return { x: cx + a.sx - f.sx * cam.focus, y: cy + a.sy - f.sy * cam.focus, depth: a.depth };
};

export const Jet3D: React.FC<{ cam: JetCam; cx: number; cy: number; scale: number; sensorGlow?: number; opacity?: number }> = ({ cam, cx, cy, scale, sensorGlow = 0, opacity = 1 }) => {
  const L = (() => {
    const v = [0.55, -0.45, 0.7];
    const m = Math.hypot(...v);
    return v.map((c) => c / m);
  })();
  const polys = MODEL.map((poly) => {
    const pr = poly.pts.map((p) => project(p, cam, cx, cy, scale));
    // world-space normal, rotated with the camera, for simple two-sided shading
    const [a, b, c] = poly.pts;
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    let n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    const m = Math.hypot(n[0], n[1], n[2]) || 1;
    n = n.map((q) => q / m);
    const cyw = Math.cos(rad(cam.yaw));
    const syw = Math.sin(rad(cam.yaw));
    const nx1 = n[0] * cyw - n[1] * syw;
    const ny1 = n[0] * syw + n[1] * cyw;
    const cp = Math.cos(rad(cam.pitch));
    const sp = Math.sin(rad(cam.pitch));
    const nr = [nx1 * cp + n[2] * sp, ny1, -nx1 * sp + n[2] * cp];
    const lit = Math.abs(nr[0] * L[0] + nr[1] * L[1] + nr[2] * L[2]);
    const shade = poly.kind === "hole" ? 1 : 0.42 + 0.58 * lit;
    const [r, g, bb] = poly.fill.map((ch) => Math.round(ch * shade));
    const depth = pr.reduce((s, q) => s + q.depth, 0) / pr.length;
    return { d: pr.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)},${q.y.toFixed(1)}`).join("") + "Z", fill: `rgb(${r},${g},${bb})`, depth, kind: poly.kind };
  }).sort((p, q) => q.depth - p.depth);
  const s = project(PIRATE_POS, cam, cx, cy, scale);
  const sr = Math.max(5, 0.16 * scale * cam.zoom);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity }}>
      <defs>
        <radialGradient id="ir-glow">
          <stop offset="0%" stopColor="#ffd2a8" stopOpacity={1} />
          <stop offset="45%" stopColor="#ff8a4a" stopOpacity={0.7} />
          <stop offset="100%" stopColor="#ff6a2a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.55))" }}>
        {polys.map((p, i) => (
          <path key={i} d={p.d} fill={p.fill} stroke={p.kind === "glass" ? "rgba(160,190,210,0.35)" : "rgba(20,22,24,0.45)"} strokeWidth={0.7} strokeLinejoin="round" />
        ))}
      </g>
      {/* PIRATE sensor head */}
      <circle cx={s.x} cy={s.y} r={sr * (1.6 + sensorGlow * 2.2)} fill="url(#ir-glow)" opacity={0.25 + sensorGlow * 0.75} />
      <circle cx={s.x} cy={s.y} r={sr} fill="#2a2f33" stroke="#ffb27a" strokeWidth={1.5 + sensorGlow * 2} />
    </svg>
  );
};
