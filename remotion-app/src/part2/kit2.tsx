import React from "react";
import { random } from "remotion";
import type { V } from "../components/Jet3D";
import { C, F } from "../lib/theme";
import { ease, ramp } from "../lib/time";

/*
 * Part 2 motion kit: radar-warning scope, flares, jamming, threat tracks, towed decoy,
 * redacted documents and small line icons. Everything is driven by narration time `t`.
 */

type Pj = (p: V) => { x: number; y: number; depth: number };

/** Glow gradients shared by the 3D overlays. Put once inside an <svg>. */
export const GlowDefs: React.FC = () => (
  <defs>
    <radialGradient id="flare-glow">
      <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
      <stop offset="30%" stopColor="#ffe2b0" stopOpacity={0.9} />
      <stop offset="65%" stopColor="#ff9a4a" stopOpacity={0.35} />
      <stop offset="100%" stopColor="#ff7a2a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="decoy-glow">
      <stop offset="0%" stopColor="#ffd9cf" stopOpacity={1} />
      <stop offset="50%" stopColor="#ff5a40" stopOpacity={0.45} />
      <stop offset="100%" stopColor="#ff5a40" stopOpacity={0} />
    </radialGradient>
  </defs>
);

/** Flares ejected in pairs from `origin`; they fall away aft and down, trailing smoke. */
export const Flares: React.FC<{ P: Pj; t: number; t0: number; origin: V; pairs?: number; life?: number; scale?: number }> = ({ P, t, t0, origin, pairs = 5, life = 3.2, scale = 1 }) => {
  const pos = (side: number, a: number): V => [origin[0] - 9 * a, origin[1] + side * (0.4 + 2.6 * a), origin[2] - 1.0 * a - 2.4 * a * a];
  const out: React.ReactNode[] = [];
  for (let i = 0; i < pairs; i++)
    for (const side of [-1, 1]) {
      const a = t - (t0 + i * 0.16 + (side > 0 ? 0.05 : 0));
      if (a <= 0 || a > life) continue;
      const k = 1 - a / life;
      const trail = Array.from({ length: 8 }, (_, j) => P(pos(side, Math.max(0, a - j * 0.09))));
      const head = trail[0];
      out.push(
        <g key={i + "" + side}>
          <polyline points={trail.map((q) => `${q.x},${q.y}`).join(" ")} fill="none" stroke={`rgba(225,222,215,${0.32 * k})`} strokeWidth={6 * scale} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={head.x} cy={head.y} r={(26 + 10 * random(`f${i}${side}${Math.floor(a * 20)}`)) * scale * (0.5 + 0.5 * k)} fill="url(#flare-glow)" opacity={k} />
          <circle cx={head.x} cy={head.y} r={4 * scale} fill="#fff" opacity={k} />
        </g>
      );
    }
  return <>{out}</>;
};

/** Jamming: arcs radiating from `from` toward `angle` (radians). Energy goes OUT. */
export const Jamming: React.FC<{ x: number; y: number; angle: number; p: number; t: number; spread?: number; reach?: number; color?: string }> = ({ x, y, angle, p, t, spread = 0.45, reach = 520, color = "#bfe3ff" }) => {
  if (p <= 0) return null;
  return (
    <g opacity={p}>
      {[0, 1, 2, 3].map((i) => {
        const ph = (t * 1.1 + i * 0.25) % 1;
        const r = 30 + reach * ph;
        const a0 = angle - spread;
        const a1 = angle + spread;
        return (
          <path
            key={i}
            d={`M${x + Math.cos(a0) * r},${y + Math.sin(a0) * r} A${r},${r} 0 0 1 ${x + Math.cos(a1) * r},${y + Math.sin(a1) * r}`}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="2 12"
            opacity={(1 - ph) * 0.9}
          />
        );
      })}
    </g>
  );
};

/** A radar illuminating the aircraft: a narrow red wedge from an off-screen emitter. */
export const Illumination: React.FC<{ from: [number, number]; to: [number, number]; p: number; width?: number }> = ({ from, to, p, width = 70 }) => {
  if (p <= 0) return null;
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const nx = -Math.sin(a) * width;
  const ny = Math.cos(a) * width;
  const ex = from[0] + (to[0] - from[0]) * ease.out(p);
  const ey = from[1] + (to[1] - from[1]) * ease.out(p);
  return (
    <g opacity={Math.min(1, p * 2)}>
      <path d={`M${from[0]},${from[1]} L${ex + nx},${ey + ny} L${ex - nx},${ey - ny} Z`} fill="rgba(226,70,50,0.16)" />
      <line x1={from[0]} y1={from[1]} x2={ex} y2={ey} stroke="rgba(255,120,95,0.8)" strokeWidth={2} strokeDasharray="10 10" />
    </g>
  );
};

/** Missile track: follows `path` (screen points) as `p` goes 0→1; red head, dashed wake. */
export const MissileTrack: React.FC<{ path: [number, number][]; p: number; opacity?: number }> = ({ path, p, opacity = 1 }) => {
  if (p <= 0) return null;
  const n = path.length - 1;
  const f = Math.min(1, p) * n;
  const i = Math.min(n - 1, Math.floor(f));
  const u = f - i;
  const hx = path[i][0] + (path[i + 1][0] - path[i][0]) * u;
  const hy = path[i][1] + (path[i + 1][1] - path[i][1]) * u;
  const pts = [...path.slice(0, i + 1), [hx, hy]];
  const a = Math.atan2(path[i + 1][1] - path[i][1], path[i + 1][0] - path[i][0]);
  return (
    <g opacity={opacity}>
      <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke="rgba(255,120,95,0.75)" strokeWidth={3} strokeDasharray="12 10" strokeLinecap="round" />
      <g transform={`translate(${hx},${hy}) rotate(${(a * 180) / Math.PI})`}>
        <path d="M14,0 L-12,-6 L-8,0 L-12,6 Z" fill={C.red} stroke="#ffd0c4" strokeWidth={1.5} />
      </g>
    </g>
  );
};

/** Catmull-Rom sampled curve through control points (screen space). */
export const curve = (pts: [number, number][], n = 40): [number, number][] => {
  const out: [number, number][] = [];
  for (let k = 0; k <= n; k++) {
    const g = (k / n) * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(g));
    const u = g - i;
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cr = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    out.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]);
  }
  return out;
};

/** Warning chevron + tag near the aircraft, pointing toward a threat. */
export const Warn: React.FC<{ x: number; y: number; angle: number; p: number; label: string; t: number }> = ({ x, y, angle, p, label, t }) => {
  if (p <= 0) return null;
  const blink = 0.55 + 0.45 * Math.abs(Math.sin(t * 7));
  const d = 120;
  const cx = x + Math.cos(angle) * d;
  const cy = y + Math.sin(angle) * d;
  return (
    <g opacity={ease.out(Math.min(1, p))}>
      <g transform={`translate(${cx},${cy}) rotate(${(angle * 180) / Math.PI})`} opacity={blink}>
        <path d="M-10,-22 L14,0 L-10,22" fill="none" stroke="#ff6a52" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform={`translate(${cx + Math.cos(angle) * 46},${cy + Math.sin(angle) * 46})`}>
        <rect x={-label.length * 8.5 - 12} y={-19} width={label.length * 17 + 24} height={38} rx={4} fill="rgba(12,12,12,0.85)" stroke="#ff6a52" strokeWidth={2} />
        <text textAnchor="middle" y={9} fontFamily={F.label} fontWeight={700} fontSize={24} letterSpacing={2} fill="#ffd8cf">
          {label.toUpperCase()}
        </text>
      </g>
    </g>
  );
};

/** Radar-warning receiver scope: own aircraft at the centre, threats on the bearing rim. */
export const RwrScope: React.FC<{ x: number; y: number; r: number; t: number; p: number; sweep?: number; children?: React.ReactNode }> = ({ x, y, r, t, p, sweep = 0, children }) => {
  if (p <= 0) return null;
  const e = ease.out(Math.min(1, p));
  return (
    <g opacity={e} transform={`translate(${x},${y}) scale(${0.9 + 0.1 * e})`}>
      <circle r={r} fill="#0c1110" stroke="rgba(175,235,200,0.6)" strokeWidth={3} />
      {[0.33, 0.66].map((k) => (
        <circle key={k} r={r * k} fill="none" stroke="rgba(175,235,200,0.22)" strokeWidth={2} />
      ))}
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const l = i % 3 === 0 ? 22 : 10;
        return <line key={i} x1={Math.cos(a) * r} y1={Math.sin(a) * r} x2={Math.cos(a) * (r - l)} y2={Math.sin(a) * (r - l)} stroke="rgba(175,235,200,0.5)" strokeWidth={2} />;
      })}
      {sweep > 0 && (
        <g opacity={sweep}>
          <path d={`M0,0 L${Math.cos(t * 2.4) * r},${Math.sin(t * 2.4) * r} A${r},${r} 0 0 0 ${Math.cos(t * 2.4 - 0.5) * r},${Math.sin(t * 2.4 - 0.5) * r} Z`} fill="rgba(160,240,190,0.16)" />
          <line x1={0} y1={0} x2={Math.cos(t * 2.4) * r} y2={Math.sin(t * 2.4) * r} stroke="rgba(170,245,200,0.8)" strokeWidth={2} />
        </g>
      )}
      {/* own aircraft */}
      <path d="M0,-26 L6,-6 L22,4 L22,9 L5,5 L4,16 L10,22 L-10,22 L-4,16 L-5,5 L-22,9 L-22,4 L-6,-6 Z" fill="#dff5e8" />
      {children}
    </g>
  );
};

/** A page of text lines; `redact` 0..1 slams black bars over them in order. */
export const RedactedDoc: React.FC<{ x: number; y: number; w: number; h: number; p: number; redact: number; title: string; open?: number[]; rot?: number; highlight?: number }> = ({
  x,
  y,
  w,
  h,
  p,
  redact,
  title,
  open = [],
  rot = 0,
  highlight = 0,
}) => {
  if (p <= 0) return null;
  const lines = 16;
  const e = ease.out(Math.min(1, p));
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        background: "#ece6d8",
        boxShadow: "0 22px 40px rgba(0,0,0,0.55)",
        transform: `rotate(${rot}deg) translateY(${(1 - e) * 60}px)`,
        opacity: e,
        padding: "46px 54px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: 40, color: "#1c1c1b", letterSpacing: "0.02em", textTransform: "uppercase" }}>{title}</div>
      <div style={{ height: 3, background: "#1c1c1b", margin: "14px 0 26px" }} />
      {Array.from({ length: lines }, (_, i) => {
        const len = 0.55 + random(`l${i}${title}`) * 0.43;
        const isOpen = open.includes(i);
        const k = isOpen ? 0 : ramp(redact * (lines + 2), i, i + 1.2);
        return (
          <div key={i} style={{ position: "relative", height: 20, marginBottom: 14, width: `${len * 100}%` }}>
            <div style={{ position: "absolute", inset: "6px 0", background: isOpen && highlight > 0 ? `rgba(201,64,46,${0.25 * highlight})` : "rgba(28,28,27,0.28)" }} />
            <div style={{ position: "absolute", left: -4, top: -2, bottom: -2, width: `${k * 102}%`, background: "#0b0b0b" }} />
          </div>
        );
      })}
    </div>
  );
};

/** Small line icons (stroke only). */
export const Icon: React.FC<{ kind: "radar" | "missile" | "sam"; size?: number; color?: string }> = ({ kind, size = 120, color = C.ink }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <g fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
      {kind === "radar" && (
        <>
          <path d="M22,62 A34,34 0 0 1 70,20" />
          <path d="M28,58 L64,26" />
          <path d="M46,42 L60,74 M40,86 L80,86 M60,74 L60,86" />
          <path d="M72,14 A18,18 0 0 1 86,30 M78,6 A28,28 0 0 1 94,24" />
        </>
      )}
      {kind === "missile" && (
        <>
          <path d="M14,70 L70,26 Q80,18 88,12 Q84,22 76,32 L20,76 Z" />
          <path d="M26,62 L16,58 L12,68 M30,70 L28,80 L20,78" />
          <path d="M60,38 L54,30 M66,44 L72,50" />
        </>
      )}
      {kind === "sam" && (
        <>
          <path d="M10,80 L90,80 M20,80 L20,70 L80,70 L80,80" />
          <circle cx={30} cy={86} r={5} />
          <circle cx={70} cy={86} r={5} />
          <path d="M34,70 L70,34 L78,40 L42,70" />
          <path d="M70,34 L76,24 L82,32" />
        </>
      )}
    </g>
  </svg>
);
