import React from "react";
import { random, staticFile } from "remotion";
import { C, F } from "../lib/theme";
import { ease } from "../lib/time";

/** Line of type that rises out of an invisible slot (mask reveal). p: 0..1 in, q: 0..1 out. */
export const Rise: React.FC<{
  p: number;
  q?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  inner?: React.CSSProperties;
}> = ({ p, q = 0, children, style, inner }) => {
  if (p <= 0 || q >= 1) return null;
  const y = (1 - ease.out(p)) * 105 - ease.in(q) * 105;
  return (
    <div style={{ overflow: "hidden", display: "inline-block", paddingBottom: "0.06em", ...style }}>
      <div style={{ transform: `translateY(${y}%)`, ...inner }}>{children}</div>
    </div>
  );
};

/** Big condensed display word. */
export const Display: React.FC<{
  children: React.ReactNode;
  size: number;
  color?: string;
  tracking?: number;
  style?: React.CSSProperties;
}> = ({ children, size, color = C.offWhite, tracking = 0.01, style }) => (
  <div
    style={{
      fontFamily: F.display,
      fontSize: size,
      lineHeight: 0.92,
      letterSpacing: `${tracking}em`,
      color,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      filter: "url(#ink)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small editorial label: condensed caps, tracked. */
export const Label: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 26, color = C.ink, weight = 500, style }) => (
  <div
    style={{
      fontFamily: F.label,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      whiteSpace: "nowrap",
      filter: "url(#ink-fine)",
      textShadow: "0 1px 2px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.6)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Handwritten margin note. Used sparingly. */
export const Hand: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 40,
  color = C.red,
  style,
}) => (
  <div style={{ fontFamily: F.hand, fontSize: size, color, whiteSpace: "nowrap", ...style }}>{children}</div>
);

/** Positioned wrapper, centred on x,y. */
export const At: React.FC<{ x: number; y: number; children: React.ReactNode; rot?: number; anchor?: "center" | "left" | "right"; style?: React.CSSProperties }> = ({
  x,
  y,
  children,
  rot = 0,
  anchor = "center",
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(${anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0"}, -50%) rotate(${rot}deg)`,
      textAlign: anchor === "right" ? "right" : anchor === "left" ? "left" : "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Torn ends for a strip of tape (deterministic per label). */
const tornEnds = (seed: string) => {
  const pts: string[] = [];
  const n = 7;
  const j = (k: string) => 4 + random(seed + k) * 9;
  for (let i = 0; i <= n; i++) pts.push(`${i % 2 ? j("l" + i) : j("l" + i) * 0.3}px ${(i / n) * 100}%`);
  for (let i = n; i >= 0; i--) pts.push(`calc(100% - ${i % 2 ? j("r" + i) : j("r" + i) * 0.3}px) ${(i / n) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

/** A strip of real masking tape (or black cloth tape) carrying a label. */
export const Tape: React.FC<{ children: React.ReactNode; p: number; rot?: number; dark?: boolean; size?: number }> = ({
  children,
  p,
  rot = -1.5,
  dark,
  size = 30,
}) => {
  if (p <= 0) return null;
  const e = ease.out(p);
  const seed = String(children);
  return (
    <div style={{ display: "inline-block", transform: `rotate(${rot}deg) scale(${0.94 + 0.06 * e})`, filter: "drop-shadow(0 3px 3px rgba(20,14,8,0.45)) drop-shadow(0 0 1px rgba(20,14,8,0.35))" }}>
      <div
        style={{
          position: "relative",
          clipPath: `${tornEnds(seed)}`,
          padding: `${size * 0.3}px ${size * 0.85}px ${size * 0.22}px`,
          background: dark ? "#1f1c19" : "#f3ead6",
          opacity: e,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${staticFile("gen/tape.jpg")})`,
            backgroundSize: "256px",
            mixBlendMode: dark ? "overlay" : "multiply",
            opacity: dark ? 0.55 : 0.55,
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: F.tape,
            fontSize: size,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: dark ? "#f1e9d8" : "#1a1612",
            whiteSpace: "nowrap",
            clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`,
            filter: "url(#ink)",
            opacity: 0.96,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
