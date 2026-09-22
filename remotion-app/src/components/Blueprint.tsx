import React from "react";
import typhoonLines from "../data/drawings/typhoon-lines.json";
import rafale3view from "../data/drawings/rafale-3view.json";
import rafaleTop from "../data/drawings/rafale-top.json";
import { C, F } from "../lib/theme";
import { ease } from "../lib/time";

/*
 * Technical drawings from Wikimedia Commons, animated as if plotted stroke by stroke.
 * Geometry comes unchanged from the source files (see scripts/build-drawings.cjs):
 *  - Eurofighter Typhoon line drawing (Inductiveload, public domain)
 *  - Dassault Rafale 3-view line drawing (Kaboldy, CC BY-SA 3.0) — a two-seat Rafale B
 *  - Dassault Rafale silhouette-top (Sting, public domain)
 */
type Path = { d: string; w: number; r?: number; f?: number };
type View = { bbox: number[]; paths: Path[] };
type Drawing = { name: string; bbox: number[]; views: View[] };

const DRAWINGS = {
  typhoon: typhoonLines as Drawing,
  rafale: rafale3view as Drawing,
  rafaleTop: rafaleTop as Drawing,
};

// Named views (index into views[], as clustered by the build script)
export const VIEWS = {
  typhoonSide: { d: "typhoon", i: pickView("typhoon", (b) => b[0] > 400 && b[3] < 260) },
  typhoonTop: { d: "typhoon", i: pickView("typhoon", (b) => b[0] > 400 && b[1] > 180) },
  typhoonUnder: { d: "typhoon", i: pickView("typhoon", (b) => b[0] < 100 && b[3] < 420) },
  typhoonFront: { d: "typhoon", i: pickView("typhoon", (b) => b[1] > 350 && b[0] > 80 && b[2] < 520) },
  rafaleSide: { d: "rafale", i: pickView("rafale", (b) => b[1] < 100 && b[2] - b[0] > 900) },
  rafaleTop: { d: "rafale", i: pickView("rafale", (b) => b[1] > 400 && b[2] < 1200 && b[3] - b[1] > 700) },
  rafaleFront: { d: "rafale", i: pickView("rafale", (b) => b[0] > 1200) },
  rafaleSilTop: { d: "rafaleTop", i: 0 },
} as const;
export type ViewName = keyof typeof VIEWS;

function pickView(d: keyof typeof DRAWINGS, test: (b: number[]) => boolean) {
  const i = DRAWINGS[d].views.findIndex((v) => test(v.bbox));
  return Math.max(0, i);
}

export const viewBox = (name: ViewName) => {
  const v = DRAWINGS[VIEWS[name].d].views[VIEWS[name].i];
  return v.bbox;
};

/**
 * Plots a drawing view. `p` 0→1 draws outlines first, then detail; `redP` draws the
 * red-marked stores (weapons) separately; `fill` lays a paper-coloured silhouette under
 * the lines (for flight over busy backgrounds).
 */
export const Blueprint: React.FC<{
  view: ViewName;
  x: number;
  y: number;
  width: number;
  p: number;
  redP?: number;
  color?: string;
  redColor?: string;
  lineWidth?: number;
  rot?: number;
  opacity?: number;
  fill?: string;
  fillP?: number;
  flip?: boolean;
  anchor?: "center" | "left";
  highlight?: { box: number[]; color: string; p: number }; // drawing-unit box tinted
}> = ({ view, x, y, width, p, redP = 0, color = C.ink, redColor = C.red, lineWidth = 1.6, rot = 0, opacity = 1, fill, fillP = 0, flip, anchor = "center", highlight }) => {
  const v = DRAWINGS[VIEWS[view].d].views[VIEWS[view].i];
  const [x0, y0, x1, y1] = v.bbox;
  const pad = (x1 - x0) * 0.02;
  const vw = x1 - x0 + pad * 2;
  const vh = y1 - y0 + pad * 2;
  const k = width / vw; // px per drawing unit
  const height = vh * k;
  const sw = lineWidth / k;
  const black = v.paths.filter((q) => !q.r);
  const red = v.paths.filter((q) => q.r);
  const n = black.length;
  if (p <= 0 && redP <= 0 && fillP <= 0) return null;
  const seg = (i: number, total: number, prog: number) => {
    // each stroke gets a short window; windows overlap so the plotter keeps several pens moving
    const start = (i / Math.max(1, total)) * 0.8;
    return Math.max(0, Math.min(1, (prog - start) / 0.2));
  };
  return (
    <svg
      width={width}
      height={height}
      viewBox={`${x0 - pad} ${y0 - pad} ${vw} ${vh}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        overflow: "visible",
        opacity,
        transform: `translate(${anchor === "center" ? "-50%" : "0"}, -50%) rotate(${rot}deg) scaleX(${flip ? -1 : 1})`,
      }}
    >
      {fill && fillP > 0 && (
        <g opacity={fillP}>
          {black.filter((q) => q.f).map((q, i) => (
            <path key={"f" + i} d={q.d} fill={fill} />
          ))}
          {/* outline strokes widened into a solid backing so the drawing reads over anything */}
          {black.slice(0, Math.max(4, Math.round(n * 0.04))).map((q, i) => (
            <path key={"b" + i} d={q.d} fill={fill} stroke={fill} strokeWidth={sw * 6} strokeLinejoin="round" />
          ))}
        </g>
      )}
      {highlight && highlight.p > 0 && (
        <rect x={highlight.box[0]} y={highlight.box[1]} width={highlight.box[2] - highlight.box[0]} height={highlight.box[3] - highlight.box[1]} fill={highlight.color} opacity={highlight.p * 0.85} style={{ mixBlendMode: "multiply" }} />
      )}
      {black.map((q, i) => {
        const s = seg(i, n, ease.soft(Math.min(1, p)));
        if (s <= 0) return null;
        return q.f ? (
          <path key={i} d={q.d} fill={color} opacity={s} />
        ) : (
          <path
            key={i}
            d={q.d}
            pathLength={1}
            fill="none"
            stroke={color}
            strokeWidth={Math.max(sw * 0.6, Math.min(sw * 1.4, q.w * 0.9 || sw))}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={s >= 1 ? undefined : `${s} 2`}
          />
        );
      })}
      {red.map((q, i) => {
        const s = seg(i, red.length, Math.min(1, redP));
        if (s <= 0) return null;
        return <path key={"r" + i} d={q.d} pathLength={1} fill="none" stroke={redColor} strokeWidth={sw * 1.25} strokeLinecap="round" strokeDasharray={s >= 1 ? undefined : `${s} 2`} />;
      })}
    </svg>
  );
};

/** Size of a view when drawn at `width` px (for layout maths). */
export const viewHeight = (view: ViewName, width: number) => {
  const [x0, y0, x1, y1] = viewBox(view);
  const pad = (x1 - x0) * 0.02;
  return ((y1 - y0 + pad * 2) / (x1 - x0 + pad * 2)) * width;
};

/** Engineering dimension line with arrow ticks and a value, drawn on. */
export const Dimension: React.FC<{ x1: number; y1: number; x2: number; y2: number; label: string; p: number; color?: string; side?: 1 | -1; size?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  label,
  p,
  color = C.inkSoft,
  side = 1,
  size = 26,
}) => {
  if (p <= 0) return null;
  const e = ease.out(p);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy * side;
  const ny = ux * side;
  const mx = x1 + dx / 2;
  const my = y1 + dy / 2;
  const hx = mx + (x1 - mx) * e;
  const hy = my + (y1 - my) * e;
  const tx = mx + (x2 - mx) * e;
  const ty = my + (y2 - my) * e;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const tick = 10;
  return (
    <g>
      {/* extension lines */}
      <line x1={x1 - nx * 14} y1={y1 - ny * 14} x2={x1 + nx * 14 * e} y2={y1 + ny * 14 * e} stroke={color} strokeWidth={1.4} opacity={0.8} />
      <line x1={x2 - nx * 14} y1={y2 - ny * 14} x2={x2 + nx * 14 * e} y2={y2 + ny * 14 * e} stroke={color} strokeWidth={1.4} opacity={0.8} />
      <line x1={hx} y1={hy} x2={tx} y2={ty} stroke={color} strokeWidth={1.6} />
      {e > 0.95 && (
        <>
          <path d={`M${x1 + ux * tick + nx * 5},${y1 + uy * tick + ny * 5} L${x1},${y1} L${x1 + ux * tick - nx * 5},${y1 + uy * tick - ny * 5}`} fill="none" stroke={color} strokeWidth={1.6} />
          <path d={`M${x2 - ux * tick + nx * 5},${y2 - uy * tick + ny * 5} L${x2},${y2} L${x2 - ux * tick - nx * 5},${y2 - uy * tick - ny * 5}`} fill="none" stroke={color} strokeWidth={1.6} />
        </>
      )}
      <g transform={`translate(${mx + nx * (size * 0.9)},${my + ny * (size * 0.9)}) rotate(${Math.abs(angle) > 90 ? angle + 180 : angle})`} opacity={ease.out(Math.max(0, (p - 0.5) * 2))}>
        <rect x={-label.length * size * 0.3 - 8} y={-size * 0.75} width={label.length * size * 0.6 + 16} height={size * 1.1} fill={C.paper} opacity={0.85} />
        <text textAnchor="middle" y={size * 0.2} fontFamily={F.label} fontWeight={600} fontSize={size} letterSpacing={2} fill={color}>
          {label}
        </text>
      </g>
    </g>
  );
};

/** Drawing-sheet title block (bottom-right of a technical plate). */
export const TitleBlock: React.FC<{ x: number; y: number; title: string; kicker: string; rows: [string, string][]; p: number; dark?: boolean; width?: number }> = ({
  x,
  y,
  title,
  kicker,
  rows,
  p,
  dark,
  width = 520,
}) => {
  if (p <= 0) return null;
  const ink = dark ? "#e9e2d3" : C.ink;
  const e = ease.out(p);
  return (
    <div style={{ position: "absolute", left: x, top: y, width, border: `2px solid ${ink}`, color: ink, fontFamily: F.label, clipPath: `inset(0 ${(1 - e) * 100}% 0 0)` }}>
      <div style={{ padding: "10px 16px 6px", borderBottom: `1.5px solid ${ink}`, fontSize: 18, fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.8 }}>{kicker}</div>
      <div style={{ padding: "8px 16px 4px", fontFamily: F.display, fontSize: 64, lineHeight: 1, letterSpacing: "0.02em", textTransform: "uppercase" }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${rows.length}, 1fr)`, borderTop: `1.5px solid ${ink}` }}>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ padding: "6px 12px 8px", borderLeft: i ? `1.5px solid ${ink}` : undefined }}>
            <div style={{ fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7 }}>{k}</div>
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "0.04em" }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
