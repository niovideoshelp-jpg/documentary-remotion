import React from "react";
import { random } from "remotion";
import { C, W, H } from "../lib/theme";

/** Path that draws itself (trim-path). p: 0..1 drawn, q: 0..1 erased from the start. */
export const DrawPath: React.FC<{
  d: string;
  p: number;
  q?: number;
  color?: string;
  width?: number;
  dash?: number;
  opacity?: number;
  cap?: "round" | "butt";
  filter?: string;
}> = ({ d, p, q = 0, color = C.red, width = 4, dash, opacity = 1, cap = "round", filter }) => {
  if (p <= 0 || q >= 1) return null;
  if (dash) {
    // dashed line: reveal with a mask so the dash pattern stays fixed
    const id = `m${Math.abs(hash(d))}`;
    return (
      <g opacity={opacity}>
        <mask id={id} maskUnits="userSpaceOnUse">
          <path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={width * 3} strokeDasharray={`${p - q} 2`} strokeDashoffset={-q} />
        </mask>
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={`${dash} ${dash * 0.9}`} strokeLinecap="butt" mask={`url(#${id})`} filter={filter} />
      </g>
    );
  }
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap={cap}
      strokeLinejoin="round"
      strokeDasharray={`${Math.max(0, p - q)} 2`}
      strokeDashoffset={-q}
      opacity={opacity}
      filter={filter}
    />
  );
};

export const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
};

/** Hand-drawn ellipse with overshoot, as a marker would circle something. */
export const scribbleEllipse = (cx: number, cy: number, rx: number, ry: number, seed: string, turns = 1.12) => {
  const n = 64;
  const pts: string[] = [];
  const a0 = random(seed) * Math.PI * 2;
  for (let i = 0; i <= n; i++) {
    const a = a0 + (i / n) * Math.PI * 2 * turns;
    const wob = 1 + Math.sin(a * 3 + random(seed + "w") * 6) * 0.025 + (i / n) * 0.05;
    pts.push(`${(cx + Math.cos(a) * rx * wob).toFixed(1)},${(cy + Math.sin(a) * ry * wob).toFixed(1)}`);
  }
  return "M" + pts.join("L");
};

/** Slightly bowed hand line between two points. */
export const handLine = (x1: number, y1: number, x2: number, y2: number, bow = 0.08, seed = "l") => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const k = bow * (0.7 + random(seed) * 0.6);
  return `M${x1},${y1} Q${mx - dy * k},${my + dx * k} ${x2},${y2}`;
};

/** Full-stage SVG for overlays in stage coordinates. */
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>
    {children}
  </svg>
);

/** Arrow head at the end of a path direction. */
export const ArrowHead: React.FC<{ x: number; y: number; angle: number; size?: number; color?: string; p?: number }> = ({
  x,
  y,
  angle,
  size = 18,
  color = C.red,
  p = 1,
}) =>
  p <= 0 ? null : (
    <path
      d={`M${-size},${-size * 0.55} L0,0 L${-size},${size * 0.55}`}
      transform={`translate(${x},${y}) rotate(${angle}) scale(${p})`}
      fill="none"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
