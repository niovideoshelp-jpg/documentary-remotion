import React, { useMemo } from "react";
import { AbsoluteFill, random, staticFile } from "remotion";
import geo from "../data/geo.json";
import { C, F, W, H } from "../lib/theme";
import { ease, ramp } from "../lib/time";
import { RELIEF, project } from "./projection";
import { PrintTexture, Vignette } from "../components/Paper";

type Country = { name: string; d: string; bbox: number[]; c: number[] };
const COUNTRIES = geo as Country[];
const byName = (n: string) => {
  const c = COUNTRIES.find((x) => x.name === n);
  if (!c) throw new Error("Unknown country " + n);
  return c;
};
const ALL_LAND = COUNTRIES.map((c) => c.d).join("");

export type Highlight = {
  name: string;
  /** border trace window [start, end] seconds */
  draw: [number, number];
  /** liquid fill window */
  fill: [number, number];
  /** where the colour starts to flow from (lon, lat); default = visual centre */
  origin?: [number, number];
  label?: { text: string; lon: number; lat: number; size: number; at: number; rot?: number; small?: string };
  /** fade the highlight back toward neutral (keeps a thin outline) */
  dim?: [number, number];
  /** fade the whole highlight out */
  out?: [number, number];
};

export type View = { cx: number; cy: number; z: number; r?: number };

/** Map view centred on a lon/lat with a zoom factor (screen px per canvas px). */
export const viewAt = (lon: number, lat: number, z: number, r = 0): View => {
  const [cx, cy] = project(lon, lat);
  return { cx, cy, z, r };
};

const blobPath = (ox: number, oy: number, R: number, p: number, seed: string, time: number) => {
  const n = 110;
  const amp = 0.16 * (1 - p * 0.7);
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r =
      R *
      (1 +
        amp * Math.sin(a * 3 + random(seed) * 6 + time * 1.7) +
        amp * 0.6 * Math.sin(a * 5 + random(seed + "b") * 6 - time * 2.3) +
        amp * 0.35 * Math.sin(a * 11 + time * 3.1) +
        amp * 0.2 * Math.sin(a * 19 - time * 4));
    d += `${i ? "L" : "M"}${(ox + Math.cos(a) * r).toFixed(1)},${(oy + Math.sin(a) * r).toFixed(1)}`;
  }
  return d + "Z";
};

const HighlightLayer: React.FC<{ h: Highlight; t: number; z: number; part: "fill" | "line" }> = ({ h, t, z, part }) => {
  const c = byName(h.name);
  const id = "hl-" + h.name.replace(/\W/g, "");
  const out = h.out ? ramp(t, h.out[0], h.out[1], ease.inOut) : 0;
  if (out >= 1) return null;
  const draw = ramp(t, h.draw[0], h.draw[1], ease.soft);
  const fill = ramp(t, h.fill[0], h.fill[1], ease.inOut);
  const dim = h.dim ? ramp(t, h.dim[0], h.dim[1], ease.inOut) : 0;
  const [ox, oy] = h.origin ? project(h.origin[0], h.origin[1]) : [c.c[0], c.c[1]];
  const [x0, y0, x1, y1] = c.bbox;
  const R = Math.max(...[[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => Math.hypot(x - ox, y - oy))) * 1.12;

  if (part === "fill") {
    if (fill <= 0) return null;
    return (
      <g opacity={1 - out}>
        <defs>
          <clipPath id={id + "c"}>
            <path d={c.d} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}c)`}>
          {/* leading meniscus: lighter, slightly ahead of the body of colour */}
          <path d={blobPath(ox, oy, R * Math.min(1, fill * 1.08), fill, h.name + "m", t)} fill="#d4574a" opacity={fill < 1 ? 0.55 : 0} />
          <path d={blobPath(ox, oy, R * fill, fill, h.name, t)} fill={C.redPrint} />
          {/* print texture: halftone dots once the colour has settled */}
          <rect x={x0 - 10} y={y0 - 10} width={x1 - x0 + 20} height={y1 - y0 + 20} fill="url(#halftone)" opacity={ramp(t, h.fill[1] - 0.3, h.fill[1] + 0.8) * 0.55} />
          <path d={c.d} fill={C.land} opacity={dim * 0.72} />
        </g>
      </g>
    );
  }

  const sw = 2.6 / z;
  const label = h.label;
  const lp = label ? ramp(t, label.at, label.at + 0.7) : 0;
  return (
    <g opacity={1 - out}>
      {draw > 0 && (
        <>
          {/* soft halo, India-reference style but restrained */}
          <path
            d={c.d}
            pathLength={1}
            fill="none"
            stroke="#fff7ea"
            strokeWidth={9 / z}
            strokeDasharray={`${draw} 2`}
            strokeLinejoin="round"
            opacity={ramp(t, h.draw[1] - 0.2, h.draw[1] + 0.5) * 0.4 * (1 - dim * 0.8)}
            filter="url(#halo)"
          />
          <path
            d={c.d}
            pathLength={1}
            fill="none"
            stroke="#fbf6ec"
            strokeWidth={sw * (1 - dim * 0.45)}
            strokeDasharray={`${draw} 2`}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={1 - dim * 0.35}
          />
        </>
      )}
      {label && lp > 0 && <MapLabel {...label} p={lp} dim={dim} />}
    </g>
  );
};

const MapLabel: React.FC<NonNullable<Highlight["label"]> & { p: number; dim: number }> = ({ text, lon, lat, size, rot = 0, small, p, dim }) => {
  const [x, y] = project(lon, lat);
  const e = ease.out(p);
  const id = "lbl-" + text.replace(/\W/g, "");
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={1 - dim * 0.6}>
      <defs>
        <clipPath id={id}>
          <rect x={-size * 6} y={-size * 1.9} width={size * 12} height={size * 2.05} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(0, ${(1 - e) * size * 1.1})`}>
          {small && (
            <text y={-size * 0.95} textAnchor="middle" fontFamily={F.label} fontWeight={600} fontSize={size * 0.26} letterSpacing={size * 0.05} fill="#f6efe2">
              {small}
            </text>
          )}
          <text
            y={0}
            textAnchor="middle"
            fontFamily={F.display}
            fontSize={size}
            letterSpacing={size * 0.02}
            fill="#f7f1e6"
            style={{ paintOrder: "stroke" }}
            stroke="rgba(60,10,8,0.25)"
            strokeWidth={size * 0.02}
          >
            {text}
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * Documentary map: navy ocean, neutral relief land, highlighted territory drawn
 * (border → halo → liquid fill → texture → name). `children` render in canvas
 * coordinates on top of the map (routes, dots). Geography is never deformed.
 */
export const WorldMap: React.FC<{
  t: number;
  view: View;
  highlights?: Highlight[];
  children?: (z: number) => React.ReactNode;
  overlay?: React.ReactNode;
  neutral?: number; // 0..1 desaturate/wash land (for deemphasis)
}> = ({ t, view, highlights = [], children, overlay }) => {
  const { cx, cy, z, r = 0 } = view;
  const vw = W / z;
  const vh = H / z;
  const vb = `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`;
  const europeVisible = z > 0.28;
  const defs = useMemo(
    () => (
      <defs>
        <clipPath id="land">
          <path d={ALL_LAND} />
        </clipPath>
        <pattern id="halftone" width={5.5} height={5.5} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx={2.75} cy={2.75} r={1.05} fill="#6e120d" opacity={0.55} />
        </pattern>
      </defs>
    ),
    [],
  );
  return (
    <AbsoluteFill style={{ background: C.ocean, overflow: "hidden" }}>
      <svg
        width={W}
        height={H}
        viewBox={vb}
        style={{ position: "absolute", inset: 0, transform: `rotate(${r}deg) scale(${r ? 1.06 : 1})` }}
      >
        {defs}
        <defs>
          <filter id="halo" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={5 / z} />
          </filter>
        </defs>
        {/* land */}
        <path d={ALL_LAND} fill={C.land} />
        {highlights.map((h) => (
          <HighlightLayer key={h.name + "f"} h={h} t={t} z={z} part="fill" />
        ))}
        <g clipPath="url(#land)" style={{ mixBlendMode: "multiply" }}>
          <image href={staticFile("gen/relief-wide.jpg")} x={RELIEF.wide.x} y={RELIEF.wide.y} width={RELIEF.wide.w} height={RELIEF.wide.h} preserveAspectRatio="none" />
          {europeVisible && (
            <image href={staticFile("gen/relief-europe.jpg")} x={RELIEF.europe.x} y={RELIEF.europe.y} width={RELIEF.europe.w} height={RELIEF.europe.h} preserveAspectRatio="none" />
          )}
        </g>
        {/* national borders, quiet */}
        <path d={ALL_LAND} fill="none" stroke="#6f6b63" strokeWidth={0.9 / z} strokeOpacity={0.55} strokeLinejoin="round" />
        {highlights.map((h) => (
          <HighlightLayer key={h.name + "l"} h={h} t={t} z={z} part="line" />
        ))}
        {children?.(z)}
      </svg>
      {overlay}
      <PrintTexture opacity={0.3} />
      <Vignette strength={0.42} />
    </AbsoluteFill>
  );
};

/** Great-circle-ish arc (quadratic bow) between two canvas points. */
export const arc = (a: [number, number], b: [number, number], bow = 0.22) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return `M${a[0]},${a[1]} Q${mx + dy * bow},${my - Math.abs(dx) * bow} ${b[0]},${b[1]}`;
};
