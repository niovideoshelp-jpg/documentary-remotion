import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { PrintTexture, Vignette } from "./Paper";
import { DrawPath, handLine, handLineEndAngle, scribbleEllipse } from "./Draw";
import { C, F } from "../lib/theme";
import { ease, ramp } from "../lib/time";

/*
 * Hand-drawn annotation over real photos: marker circles, arrows, underlines and
 * handwritten notes that write themselves on. The photo itself is never altered.
 */

export const MARKER = "#f2ede2"; // chalk-white marker
export const MARKER_RED = "#e2543e";

/** Full-frame photo with a slow push and a readable grade; annotations go in children. */
export const PhotoStage: React.FC<{
  src: string;
  t: number;
  t0: number;
  t1: number;
  pos?: string;
  z0?: number;
  z1?: number;
  dim?: number;
  children?: React.ReactNode;
}> = ({ src, t, t0, t1, pos = "50% 50%", z0 = 1.04, z1 = 1.12, dim = 0.25, children }) => {
  const k = ramp(t, t0, t1, (x) => x);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z0 + (z1 - z0) * k})`, transformOrigin: pos }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "contrast(1.06) saturate(0.8) sepia(0.08)" }} />
        <AbsoluteFill style={{ background: `rgba(10,10,10,${dim})` }} />
        {/* annotations ride with the photo so they stay pinned to the airframe */}
        {children}
      </AbsoluteFill>
      <PrintTexture opacity={0.18} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,6,6,0.6) 0%, rgba(6,6,6,0) 34%)" }} />
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

/** An SVG layer the size of the frame, for strokes. */
export const Ink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.6))" }}>
    {children}
  </svg>
);

export const HandCircle: React.FC<{ cx: number; cy: number; rx: number; ry?: number; p: number; seed?: string; color?: string; width?: number }> = ({ cx, cy, rx, ry, p, seed = "c", color = MARKER_RED, width = 5 }) => (
  <DrawPath d={scribbleEllipse(cx, cy, rx, ry ?? rx * 0.7, seed)} p={ease.inOut(Math.min(1, p))} color={color} width={width} />
);

export const HandArrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; bow?: number; seed?: string; color?: string; width?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  p,
  bow = 0.18,
  seed = "a",
  color = MARKER,
  width = 4.5,
}) => {
  if (p <= 0) return null;
  const d = handLine(x1, y1, x2, y2, bow, seed);
  const a = handLineEndAngle(x1, y1, x2, y2, bow, seed);
  const head = ramp(p, 0.85, 1);
  return (
    <g>
      <DrawPath d={d} p={ease.inOut(Math.min(1, p / 0.9))} color={color} width={width} />
      {head > 0 && (
        <path d="M-22,-12 L0,0 L-22,12" transform={`translate(${x2},${y2}) rotate(${a}) scale(${head})`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </g>
  );
};

export const HandUnder: React.FC<{ x1: number; x2: number; y: number; p: number; color?: string; width?: number; seed?: string }> = ({ x1, x2, y, p, color = MARKER_RED, width = 6, seed = "u" }) => (
  <DrawPath d={handLine(x1, y, x2, y - 4, 0.03, seed)} p={ease.out(Math.min(1, p))} color={color} width={width} />
);

/** A handwritten note that writes itself on, left to right. */
export const HandNote: React.FC<{ x: number; y: number; p: number; children: React.ReactNode; size?: number; color?: string; rot?: number; anchor?: "left" | "center" | "right" }> = ({
  x,
  y,
  p,
  children,
  size = 54,
  color = MARKER,
  rot = -3,
  anchor = "left",
}) => {
  if (p <= 0) return null;
  const tx = anchor === "left" ? "0" : anchor === "center" ? "-50%" : "-100%";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${tx}, -50%) rotate(${rot}deg)`,
        fontFamily: F.hand,
        fontSize: size,
        lineHeight: 1.1,
        color,
        whiteSpace: "nowrap",
        clipPath: `inset(-20% ${(1 - ease.inOut(Math.min(1, p))) * 100}% -20% -5%)`,
        textShadow: "0 2px 3px rgba(0,0,0,0.75), 0 0 14px rgba(0,0,0,0.55)",
      }}
    >
      {children}
    </div>
  );
};

/** Short tick marks along a dimension, hand-drawn. */
export const HandSpan: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string; seed?: string }> = ({ x1, y1, x2, y2, p, color = MARKER, seed = "s" }) => {
  const e = Math.min(1, p);
  const nx = -(y2 - y1);
  const ny = x2 - x1;
  const m = Math.hypot(nx, ny) || 1;
  const ux = (nx / m) * 16;
  const uy = (ny / m) * 16;
  return (
    <g>
      <DrawPath d={handLine(x1, y1, x2, y2, 0.02, seed)} p={e} color={color} width={3.5} />
      <DrawPath d={`M${x1 - ux},${y1 - uy} L${x1 + ux},${y1 + uy}`} p={ramp(e, 0, 0.2)} color={color} width={3.5} />
      <DrawPath d={`M${x2 - ux},${y2 - uy} L${x2 + ux},${y2 + uy}`} p={ramp(e, 0.8, 1)} color={color} width={3.5} />
    </g>
  );
};
