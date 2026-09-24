import React from "react";
import { C, F } from "../lib/theme";
import { ease, ramp } from "../lib/time";

/*
 * Line icons drawn on a 100×100 grid. Animated in three beats: outlines draw on
 * (stroke), accent parts fill in, then a small settle. `p` 0→1 drives everything.
 * s = stroke paths, f = filled accent paths (appear after the lines).
 */
type IconDef = { s: string[]; f?: string[] };

export const ICONS = {
  // parabolic dish on a pedestal, sending two arcs
  radar: {
    s: ["M22,70 C24,44 44,26 70,24", "M22,70 L70,24", "M46,47 L58,59", "M40,86 L62,86 M50,86 L50,64 L42,56", "M74,14 C82,18 86,24 88,32", "M80,6 C90,12 96,22 97,34"],
    f: ["M46,47 m-4,0 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0"],
  },
  // electronically scanned array: fixed face, module grid
  aesa: {
    s: ["M50,10 A40,40 0 1,1 49.9,10 Z", "M22,30 L78,30 M14,44 L86,44 M14,58 L86,58 M22,72 L78,72", "M30,18 L30,82 M44,11 L44,89 M58,11 L58,89 M72,18 L72,82"],
    f: ["M58,44 L72,44 L72,58 L58,58 Z"],
  },
  // missile, side view, nose right
  missile: {
    s: ["M10,50 L22,44 L78,44 C86,44 92,47 96,50 C92,53 86,56 78,56 L22,56 Z", "M22,44 L14,32 L26,32 L34,44", "M22,56 L14,68 L26,68 L34,56", "M62,44 L58,38 L66,38 L70,44 M62,56 L58,62 L66,62 L70,56"],
    f: ["M78,44 C86,44 92,47 96,50 C92,53 86,56 78,56 Z"],
  },
  // guided bomb with tail kit and nose seeker
  bomb: {
    s: ["M20,50 C20,40 30,36 44,36 L76,38 C86,40 92,45 94,50 C92,55 86,60 76,62 L44,64 C30,64 20,60 20,50 Z", "M20,50 L8,38 L8,62 Z", "M60,37 L56,28 L66,28 L68,37 M60,63 L56,72 L66,72 L68,63"],
    f: ["M86,42 C90,45 93,48 94,50 C93,52 90,55 86,58 Z"],
  },
  shield: {
    s: ["M50,8 L86,20 L86,48 C86,70 70,86 50,94 C30,86 14,70 14,48 L14,20 Z", "M34,50 L46,62 L68,38"],
  },
  // pilot helmet, profile, visor down
  helmet: {
    s: ["M24,66 C18,40 34,14 60,14 C80,14 92,30 90,52 L90,70 L70,74 L64,86 L36,86 C30,80 26,74 24,66 Z", "M52,40 C62,34 78,34 90,40 L90,56 C78,60 62,60 52,54 Z", "M36,86 L40,70 L64,70"],
    f: ["M52,40 C62,34 78,34 90,40 L90,56 C78,60 62,60 52,54 Z"],
  },
  // folded map with a planned route and pin
  map: {
    s: ["M8,22 L34,12 L66,22 L92,12 L92,78 L66,88 L34,78 L8,88 Z", "M34,12 L34,78 M66,22 L66,88", "M18,70 C30,64 34,52 46,50 C58,48 60,36 74,32"],
    f: ["M74,20 C80,20 84,24 84,30 C84,36 74,46 74,46 C74,46 64,36 64,30 C64,24 68,20 74,20 Z"],
  },
  mountains: {
    s: ["M4,84 L34,34 L50,58 L64,40 L96,84 Z", "M26,48 L34,56 L42,48", "M58,48 L64,54 L70,48", "M10,94 L90,94"],
  },
  // two arrows flanking a target
  tactics: {
    s: ["M12,80 C12,40 30,24 56,24", "M12,80 C40,80 60,64 60,40", "M50,18 L58,24 L50,30", "M54,46 L60,38 L66,46"],
    f: ["M78,24 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0"],
  },
  eye: {
    s: ["M6,50 C22,24 78,24 94,50 C78,76 22,76 6,50 Z", "M50,34 A16,16 0 1,1 49.9,34 Z"],
    f: ["M50,43 a7,7 0 1,0 0.1,0 Z"],
  },
  cloud: {
    s: ["M24,62 C12,62 8,50 16,44 C14,32 28,26 36,32 C40,20 60,18 66,32 C80,28 90,40 84,50 C92,54 90,64 80,64 Z", "M18,76 L58,76 M30,86 L76,86"],
  },
  target: {
    s: ["M50,14 A36,36 0 1,1 49.9,14 Z", "M50,30 A20,20 0 1,1 49.9,30 Z", "M50,2 L50,22 M50,78 L50,98 M2,50 L22,50 M78,50 L98,50"],
    f: ["M50,44 a6,6 0 1,0 0.1,0 Z"],
  },
  gear: {
    s: [
      "M44,8 L56,8 L58,20 L68,24 L78,16 L86,24 L78,34 L82,44 L94,46 L94,56 L82,58 L78,68 L86,78 L78,86 L68,78 L58,82 L56,94 L44,94 L42,82 L32,78 L22,86 L14,78 L22,68 L18,58 L6,56 L6,46 L18,44 L22,34 L14,24 L22,16 L32,24 L42,20 Z",
      "M50,36 A15,15 0 1,1 49.9,36 Z",
    ],
  },
  hangar: {
    s: ["M6,86 L6,52 C6,26 94,26 94,52 L94,86", "M2,86 L98,86", "M26,86 L26,58 L74,58 L74,86", "M26,68 L74,68 M26,77 L74,77"],
  },
  wrench: {
    s: ["M62,10 C48,10 40,24 46,36 L12,70 C8,74 8,82 14,86 C18,90 24,90 28,86 L62,52 C74,58 90,50 90,36 L78,46 L66,40 L64,28 L74,16 C70,12 66,10 62,10 Z"],
  },
  // turbofan seen from the front
  turbine: {
    s: ["M50,6 A44,44 0 1,1 49.9,6 Z", "M50,20 A30,30 0 1,1 49.9,20 Z", "M50,20 C58,32 58,42 50,50 M80,50 C68,58 58,58 50,50 M50,80 C42,68 42,58 50,50 M20,50 C32,42 42,42 50,50 M71,29 C68,44 62,48 50,50 M71,71 C56,68 52,62 50,50 M29,71 C32,56 38,52 50,50 M29,29 C44,32 48,38 50,50"],
    f: ["M50,43 a7,7 0 1,0 0.1,0 Z"],
  },
  // pilot wings (training)
  wings: {
    s: ["M50,40 C40,40 30,34 6,34 C12,44 26,52 42,52", "M50,40 C60,40 70,34 94,34 C88,44 74,52 58,52", "M12,42 L36,44 M18,48 L38,49 M88,42 L64,44 M82,48 L62,49", "M50,32 A12,12 0 1,1 49.9,32 Z"],
    f: ["M50,38 a6,6 0 1,0 0.1,0 Z"],
  },
  padlock: {
    s: ["M24,46 L76,46 L76,90 L24,90 Z", "M34,46 L34,32 C34,12 66,12 66,32 L66,46", "M50,62 L50,74"],
    f: ["M50,56 a6,6 0 1,0 0.1,0 Z"],
  },
  factory: {
    s: ["M6,90 L6,50 L30,62 L30,50 L54,62 L54,50 L78,62 L78,20 L90,20 L90,90 Z", "M2,90 L98,90", "M16,74 L24,74 M40,74 L48,74 M64,74 L72,74"],
  },
  people: {
    s: ["M34,34 A12,12 0 1,1 33.9,34 Z", "M12,86 C12,64 22,56 34,56 C46,56 56,64 56,86", "M68,30 A10,10 0 1,1 67.9,30 Z", "M58,56 C62,50 66,48 70,48 C82,48 90,56 90,78"],
  },
  chip: {
    s: ["M26,26 L74,26 L74,74 L26,74 Z", "M38,38 L62,38 L62,62 L38,62 Z", "M36,26 L36,12 M50,26 L50,12 M64,26 L64,12 M36,74 L36,88 M50,74 L50,88 M64,74 L64,88 M26,36 L12,36 M26,50 L12,50 M26,64 L12,64 M74,36 L88,36 M74,50 L88,50 M74,64 L88,64"],
  },
  // small fixed-wing drone, top view, nose right
  drone: {
    s: ["M20,50 L80,50 C86,50 90,49 92,50 C90,51 86,50 80,50", "M52,50 L48,18 L56,18 L60,50 L56,82 L48,82 Z", "M24,50 L14,38 M24,50 L14,62", "M10,44 L10,56"],
  },
  // generic swept-wing fighter, top view, nose right (not a specific type)
  fighter: {
    s: ["M96,50 L74,44 L52,40 L30,10 L22,10 L30,42 L14,44 L8,32 L2,32 L4,50 L2,68 L8,68 L14,56 L30,58 L22,90 L30,90 L52,60 L74,56 Z"],
  },
  document: {
    s: ["M20,6 L64,6 L82,24 L82,94 L20,94 Z", "M64,6 L64,24 L82,24", "M32,42 L70,42 M32,54 L70,54 M32,66 L60,66 M32,78 L66,78"],
  },
  question: {
    s: ["M50,4 A46,46 0 1,1 49.9,4 Z", "M36,38 C36,26 44,20 52,20 C62,20 68,28 66,36 C64,44 52,46 52,58 L52,62"],
    f: ["M52,72 a5,5 0 1,0 0.1,0 Z"],
  },
  check: {
    s: ["M50,4 A46,46 0 1,1 49.9,4 Z", "M28,52 L44,68 L74,34"],
  },
} satisfies Record<string, IconDef>;
export type IconName = keyof typeof ICONS;

/** A line icon that draws itself: strokes first, then the accent fills. */
export const DrawIcon: React.FC<{ name: IconName; x: number; y: number; size?: number; p: number; color?: string; accent?: string; width?: number }> = ({
  name,
  x,
  y,
  size = 120,
  p,
  color = C.ink,
  accent = C.red,
  width = 3.4,
}) => {
  if (p <= 0) return null;
  const def: IconDef = ICONS[name];
  const s = ramp(p, 0, 0.75, ease.inOut);
  const f = ramp(p, 0.6, 1, ease.out);
  const k = size / 100;
  return (
    <g transform={`translate(${x - size / 2},${y - size / 2}) scale(${k})`} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.55))" }}>
      {def.f?.map((d, i) => (
        <path key={"f" + i} d={d} fill={accent} opacity={f} />
      ))}
      {def.s.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${Math.min(1, s * 1.15 - i * 0.05)} 2`} />
      ))}
    </g>
  );
};

/** Icon + caption card: a framed tile that pops in, icon draws, label settles. */
export const IconCard: React.FC<{ name: IconName; x: number; y: number; p: number; label: string; w?: number; h?: number; accent?: string; dim?: number }> = ({ name, x, y, p, label, w = 300, h = 300, accent = C.red, dim = 0 }) => {
  if (p <= 0) return null;
  const e = ease.out(Math.min(1, p * 1.6));
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: e * (1 - dim * 0.6), transform: `translateY(${(1 - e) * 30}px) scale(${0.94 + 0.06 * e})`, filter: dim > 0 ? `blur(${dim * 3}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(235,227,210,0.28)", background: "rgba(18,18,18,0.55)", borderRadius: 6 }} />
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <DrawIcon name={name} x={w / 2} y={h * 0.43} size={Math.min(w, h) * 0.46} p={ramp(p, 0.15, 1)} accent={accent} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: h * 0.1, textAlign: "center", fontFamily: F.tape, fontSize: Math.max(24, w * 0.085), letterSpacing: "0.1em", textTransform: "uppercase", color: C.offWhite, opacity: ramp(p, 0.5, 1), textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>{label}</div>
    </div>
  );
};

/** Clean technical callout: dot on the subject, a leader line, then the label. */
export const Callout: React.FC<{ x: number; y: number; lx: number; ly: number; p: number; children: React.ReactNode; color?: string; align?: "left" | "right" }> = ({ x, y, lx, ly, p, children, color = C.offWhite, align }) => {
  if (p <= 0) return null;
  const dot = ramp(p, 0, 0.25);
  const line = ramp(p, 0.15, 0.7, ease.inOut);
  const lab = ramp(p, 0.55, 1, ease.out);
  const side = align ?? (lx >= x ? "left" : "right");
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.7))" }}>
        <circle cx={x} cy={y} r={7 * dot} fill={color} />
        <circle cx={x} cy={y} r={16 * dot} fill="none" stroke={color} strokeWidth={2} opacity={0.6} />
        <line x1={x} y1={y} x2={x + (lx - x) * line} y2={y + (ly - y) * line} stroke={color} strokeWidth={2.5} />
      </svg>
      <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(${side === "left" ? "8px" : "calc(-100% - 8px)"}, -50%)`, opacity: lab, whiteSpace: "nowrap" }}>{children}</div>
    </>
  );
};

/** Thin clean ring that draws round a point (maps, diagrams). */
export const Ring: React.FC<{ cx: number; cy: number; r: number; p: number; color?: string; width?: number }> = ({ cx, cy, r, p, color = C.red, width = 4 }) =>
  p <= 0 ? null : <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={width} pathLength={1} strokeDasharray={`${ease.inOut(Math.min(1, p))} 2`} transform={`rotate(-90 ${cx} ${cy})`} />;

/** Straight arrow that draws on. */
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string; width?: number; dash?: boolean }> = ({ x1, y1, x2, y2, p, color = C.offWhite, width = 4, dash }) => {
  if (p <= 0) return null;
  const e = ease.inOut(Math.min(1, p));
  const ex = x1 + (x2 - x1) * e;
  const ey = y1 + (y2 - y1) * e;
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash ? "10 10" : undefined} />
      <path d="M-18,-10 L0,0 L-18,10" transform={`translate(${ex},${ey}) rotate(${a})`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={ramp(p, 0.6, 1)} />
    </g>
  );
};
