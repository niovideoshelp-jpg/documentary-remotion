import React from "react";
import { AbsoluteFill } from "remotion";
import { W, H } from "../lib/theme";
import { ease, ramp } from "../lib/time";

type Dir = "ltr" | "rtl" | "ttb" | "btt";

/**
 * Soft directional wipe: the incoming scene is revealed behind a wide feathered edge,
 * sliding a few pixels and resolving from a slight defocus. (Replaces the paper tear;
 * the name is kept so scenes need no changes.)
 */
export const TearReveal: React.FC<{
  t: number;
  start: number;
  dur?: number;
  dir?: Dir;
  seed?: string;
  slope?: number;
  children: React.ReactNode;
}> = ({ t, start, dur = 0.9, dir = "ltr", children }) => {
  const p = ramp(t, start, start + dur * 1.1, ease.inOut);
  if (p <= 0) return null;
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const feather = 28;
  const pos = -feather + p * (100 + feather);
  const angle = { ltr: 90, rtl: 270, ttb: 180, btt: 0 }[dir];
  const mask = `linear-gradient(${angle}deg, #000 ${pos}%, rgba(0,0,0,0) ${pos + feather}%)`;
  const push = (1 - ease.out(p)) * 70;
  const tx = dir === "ltr" ? -push : dir === "rtl" ? push : 0;
  const ty = dir === "ttb" ? -push : dir === "btt" ? push : 0;
  return (
    <AbsoluteFill
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        transform: `translate(${tx}px, ${ty}px) scale(${1 + (1 - p) * 0.02})`,
        filter: `blur(${(1 - p) * 7}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Radial rack-focus reveal from a point: soft iris, slight scale settle, blur resolving. */
export const BlotReveal: React.FC<{
  t: number;
  start: number;
  dur?: number;
  cx: number;
  cy: number;
  seed?: string;
  children: React.ReactNode;
}> = ({ t, start, dur = 1, cx, cy, children }) => {
  const p = ramp(t, start, start + dur * 1.1, ease.inOut);
  if (p <= 0) return null;
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const R = p * Math.hypot(W, H) * 1.1;
  const mask = `radial-gradient(circle at ${cx}px ${cy}px, #000 ${Math.max(0, R - 380)}px, rgba(0,0,0,0) ${R}px)`;
  return (
    <AbsoluteFill
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        transform: `scale(${1.05 - 0.05 * ease.out(p)})`,
        transformOrigin: `${cx}px ${cy}px`,
        filter: `blur(${(1 - p) * 9}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Fast lateral push between scenes with a touch of directional smear. */
export const whip = (t: number, start: number, dur = 0.5) => {
  const p = ramp(t, start, start + dur, ease.inOut);
  const v = Math.sin(p * Math.PI); // speed profile
  return { p, blur: v * 14 };
};
