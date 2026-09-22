import React from "react";
import { Img, random, staticFile } from "remotion";
import { PrintTexture } from "./Paper";

/** Irregular rectangle as a CSS polygon: every edge gets small hand-cut jitter. */
export const roughRect = (w: number, h: number, inset: number, amp: number, seed: string, n = 12) => {
  const pts: string[] = [];
  const j = (k: string) => (random(seed + k) - 0.5) * 2 * amp;
  const push = (x: number, y: number) => pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
  for (let i = 0; i < n; i++) push(inset + ((w - 2 * inset) * i) / n, inset + j("t" + i));
  for (let i = 0; i < n; i++) push(w - inset + j("r" + i), inset + ((h - 2 * inset) * i) / n);
  for (let i = 0; i < n; i++) push(w - inset - ((w - 2 * inset) * i) / n, h - inset + j("b" + i));
  for (let i = 0; i < n; i++) push(inset + j("l" + i), h - inset - ((h - 2 * inset) * i) / n);
  return `polygon(${pts.join(",")})`;
};

export type PhotoProps = {
  src: string; // relative to public/
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  scale?: number;
  /** paper border thickness; 0 = photo cut straight out of a page */
  border?: number;
  seed?: string;
  /** inner image zoom and pan (percent of frame) for slow Ken-Burns inside the frame */
  zoom?: number;
  panX?: number;
  panY?: number;
  objectPosition?: string;
  /** 0..1 reveal wipe (from `revealFrom` side) */
  reveal?: number;
  revealFrom?: "left" | "right" | "top" | "bottom";
  opacity?: number;
  shadow?: number;
  grade?: string;
  children?: React.ReactNode;
};

/** A real photograph presented as a physical print with an irregular paper edge. Content is never altered. */
export const Photo: React.FC<PhotoProps> = ({
  src,
  x,
  y,
  w,
  h,
  rot = 0,
  scale = 1,
  border = 12,
  seed = src,
  zoom = 1,
  panX = 0,
  panY = 0,
  objectPosition = "50% 50%",
  reveal = 1,
  revealFrom = "left",
  opacity = 1,
  shadow = 1,
  grade = "contrast(1.04) saturate(0.9)",
  children,
}) => {
  if (reveal <= 0 || opacity <= 0) return null;
  const r = (1 - reveal) * 100;
  const inset =
    revealFrom === "left"
      ? `inset(-5% ${r}% -5% -5%)`
      : revealFrom === "right"
        ? `inset(-5% -5% -5% ${r}%)`
        : revealFrom === "top"
          ? `inset(-5% -5% ${r}% -5%)`
          : `inset(${r}% -5% -5% -5%)`;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${scale})`,
        opacity,
        clipPath: reveal < 1 ? inset : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: shadow
            ? `drop-shadow(0 ${6 * shadow}px ${10 * shadow}px rgba(8,10,12,${0.32 * shadow})) drop-shadow(0 1px 1px rgba(8,10,12,0.25))`
            : undefined,
        }}
      >
        {border > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: roughRect(w, h, 0, 2.2, seed + "o", 16),
              background: "#efeadf",
            }}
          >
            <PrintTexture opacity={0.8} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: roughRect(w, h, border, border > 0 ? 1.4 : 2.4, seed + "i", 14),
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(src)}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition,
              transform: `translate(${panX}%, ${panY}%) scale(${zoom})`,
              filter: grade,
            }}
          />
          <PrintTexture opacity={0.28} />
          {children}
        </div>
      </div>
    </div>
  );
};

/** Background-removed subject on a hand-cut paper border (made in CI by scripts/preprocess.py). */
export const Cutout: React.FC<{
  name: string;
  x: number;
  y: number;
  w: number;
  rot?: number;
  scale?: number;
  flip?: boolean;
  sticker?: boolean;
  opacity?: number;
  shadow?: number;
  blur?: number;
  style?: React.CSSProperties;
}> = ({ name, x, y, w, rot = 0, scale = 1, flip, sticker = true, opacity = 1, shadow = 1, blur = 0, style }) => {
  if (opacity <= 0) return null;
  return (
    <Img
      src={staticFile(`gen/${sticker ? "sticker" : "cut"}/${name}.webp`)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${flip ? -scale : scale}, ${scale})`,
        opacity,
        filter: [
          shadow ? `drop-shadow(0 ${8 * shadow}px ${12 * shadow}px rgba(8,10,12,${0.35 * shadow}))` : "",
          blur ? `blur(${blur}px)` : "",
          "contrast(1.03) saturate(0.92)",
        ].join(" "),
        ...style,
      }}
    />
  );
};
