import React from "react";
import { AbsoluteFill } from "remotion";
import { Blueprint, viewHeight, type ViewName } from "./Blueprint";
import { C, F } from "../lib/theme";
import { ease, ramp } from "../lib/time";

/*
 * An exploded blueprint: one real line drawing cut into sections (polygons in drawing
 * fractions, u along the length, v across), each sliding out along its own vector,
 * with a tinted underlay and a label. Used for work-share and "who controls what".
 */
export type Part = {
  key: string;
  poly: [number, number][]; // (u, v) in 0..1 of the drawing box
  dx: number;
  dy: number;
  tint?: string; // omit = untinted
  label?: string;
  sub?: string;
  lx?: number; // label offset from the section centre (px)
  ly?: number;
  at?: number; // when this section's tint/label arrive (s)
};

export const Exploded: React.FC<{
  t: number;
  view: ViewName;
  x: number;
  y: number;
  width: number;
  draw: number; // 0..1 line draw-on
  explode: number; // 0..1 separation
  parts: Part[];
  lineWidth?: number;
}> = ({ t, view, x, y, width, draw, explode, parts, lineWidth = 1.8 }) => {
  const h = viewHeight(view, width);
  const left = x - width / 2;
  const top = y - h / 2;
  const P = ([u, v]: [number, number]): [number, number] => [left + u * width, top + v * h];
  const e = ease.inOut(Math.min(1, explode));
  return (
    <AbsoluteFill>
      {parts.map((pt) => {
        const pts = pt.poly.map(P);
        const clip = `polygon(${pts.map(([a, b]) => `${a}px ${b}px`).join(",")})`;
        const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length;
        const cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
        const on = pt.at !== undefined ? ramp(t, pt.at, pt.at + 0.5) : 1;
        return (
          <AbsoluteFill key={pt.key} style={{ transform: `translate(${pt.dx * e}px, ${pt.dy * e}px)` }}>
            {pt.tint && (
              <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
                <polygon points={pts.map((q) => q.join(",")).join(" ")} fill={pt.tint} opacity={0.24 * on * e} />
              </svg>
            )}
            <AbsoluteFill style={{ clipPath: clip }}>
              <Blueprint view={view} x={x} y={y} width={width} p={draw} lineWidth={lineWidth} color={pt.tint && on * e > 0.5 ? pt.tint : C.ink} />
            </AbsoluteFill>
            {pt.label && (
              <div
                style={{
                  position: "absolute",
                  left: cx + (pt.lx ?? 0),
                  top: cy + (pt.ly ?? 0),
                  transform: `translate(-50%, calc(-50% + ${(1 - on) * 12}px))`,
                  opacity: on * e,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  textShadow: "0 1px 2px rgba(0,0,0,0.85), 0 0 12px rgba(0,0,0,0.6)",
                }}
              >
                <div style={{ fontFamily: F.tape, fontSize: 36, letterSpacing: "0.08em", textTransform: "uppercase", color: pt.tint ?? C.ink }}>{pt.label}</div>
                {pt.sub && <div style={{ fontFamily: F.label, fontWeight: 600, fontSize: 24, letterSpacing: "0.18em", textTransform: "uppercase", color: C.inkSoft, marginTop: 2 }}>{pt.sub}</div>}
              </div>
            )}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
