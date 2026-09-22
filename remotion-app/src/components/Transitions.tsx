import React from "react";
import { AbsoluteFill, random } from "remotion";
import { W, H } from "../lib/theme";
import { ease, ramp } from "../lib/time";

type Dir = "ltr" | "rtl" | "ttb" | "btt";

const tearProfile = (seed: string, n: number) => {
  const a = random(seed) * 6.28;
  const b = random(seed + "b") * 6.28;
  return Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return (
      Math.sin(u * 7.1 + a) * 26 +
      Math.sin(u * 23.3 + b) * 9 +
      (random(`${seed}-${i}`) - 0.5) * 12 +
      (random(`${seed}f${i}`) > 0.93 ? (random(`${seed}g${i}`) - 0.5) * 22 : 0)
    );
  });
};

/**
 * The previous picture is torn away along a ragged edge, revealing `children`.
 * The torn paper core shows as a thin light fibre band with a soft shadow.
 */
export const TearReveal: React.FC<{
  t: number;
  start: number;
  dur?: number;
  dir?: Dir;
  seed?: string;
  slope?: number;
  children: React.ReactNode;
}> = ({ t, start, dur = 0.9, dir = "ltr", seed = "tear", slope = 0.12, children }) => {
  const p = ramp(t, start, start + dur, ease.inOut);
  if (p <= 0) return null;
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const horizontal = dir === "ltr" || dir === "rtl";
  const len = horizontal ? H : W;
  const span = horizontal ? W : H;
  const n = 60;
  const prof = tearProfile(seed, n);
  const edge = -260 + p * (span + 520);
  const pts = prof.map((o, i) => {
    const u = (i / n) * len;
    const along = edge + o + (u - len / 2) * slope;
    return { u, v: dir === "rtl" || dir === "btt" ? span - along : along, o };
  });
  const toXY = (u: number, v: number) => (horizontal ? `${v.toFixed(1)},${u.toFixed(1)}` : `${u.toFixed(1)},${v.toFixed(1)}`);
  const back = dir === "rtl" || dir === "btt" ? span + 400 : -400;
  const clip = [toXY(0, back), ...pts.map((q) => toXY(q.u, q.v)), toXY(len, back)].join(" ");
  const sign = dir === "rtl" || dir === "btt" ? -1 : 1;
  const fibre = [
    ...pts.map((q) => toXY(q.u, q.v)),
    ...pts
      .slice()
      .reverse()
      .map((q, i) => toXY(q.u, q.v + sign * (7 + random(`${seed}w${i}`) * 9))),
  ].join(" ");
  const id = `tear-${seed}`;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <clipPath id={id} clipPathUnits="userSpaceOnUse">
            <polygon points={clip} />
          </clipPath>
        </defs>
      </svg>
      <AbsoluteFill style={{ clipPath: `url(#${id})` }}>{children}</AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <filter id={id + "s"} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx={-sign * 6} dy={3} stdDeviation={6} floodColor="#000" floodOpacity={0.45} />
          </filter>
        </defs>
        <polygon points={fibre} fill="#f2ede1" filter={`url(#${id}s)`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Soft organic mask reveal growing from a point (ink blot / liquid spread). */
export const BlotReveal: React.FC<{
  t: number;
  start: number;
  dur?: number;
  cx: number;
  cy: number;
  seed?: string;
  children: React.ReactNode;
}> = ({ t, start, dur = 1, cx, cy, seed = "blot", children }) => {
  const p = ramp(t, start, start + dur, ease.inOut);
  if (p <= 0) return null;
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const R = p * Math.hypot(W, H) * 1.05;
  const n = 72;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r =
      R *
      (1 +
        0.09 * Math.sin(a * 3 + random(seed) * 6 + p * 2) +
        0.05 * Math.sin(a * 7 + random(seed + "b") * 6 - p * 3) +
        0.03 * Math.sin(a * 13 + p * 5));
    return `${(cx + Math.cos(a) * r).toFixed(1)}px ${(cy + Math.sin(a) * r).toFixed(1)}px`;
  });
  return <AbsoluteFill style={{ clipPath: `polygon(${pts.join(",")})` }}>{children}</AbsoluteFill>;
};

/** Fast lateral push between scenes with a touch of directional smear. */
export const whip = (t: number, start: number, dur = 0.5) => {
  const p = ramp(t, start, start + dur, ease.inOut);
  const v = Math.sin(p * Math.PI); // speed profile
  return { p, blur: v * 14 };
};
