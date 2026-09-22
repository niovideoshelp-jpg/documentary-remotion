import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, random } from "remotion";
import { C } from "../lib/theme";

const paper = staticFile("gen/paper.jpg");

/** Paper ground. `dark` is an ink-toned sheet for night/technical scenes. */
export const PaperGround: React.FC<{ dark?: boolean; tint?: string; children?: React.ReactNode }> = ({
  dark,
  tint,
  children,
}) => (
  <AbsoluteFill
    style={{
      background: tint ?? (dark ? "#1f2529" : C.paper),
      overflow: "hidden",
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage: `url(${paper})`,
        backgroundSize: "1024px 1024px",
        mixBlendMode: dark ? "overlay" : "multiply",
        opacity: dark ? 0.35 : 0.9,
      }}
    />
    {children}
    <Vignette strength={dark ? 0.55 : 0.28} />
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.3 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(10,12,14,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Printed-matter texture laid over an image (multiply paper + fine grain). */
export const PrintTexture: React.FC<{ opacity?: number }> = ({ opacity = 0.45 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `url(${paper})`,
      backgroundSize: "700px 700px",
      mixBlendMode: "multiply",
      opacity,
      pointerEvents: "none",
    }}
  />
);

/** Global film/print grain; changes every 2 frames with a random offset. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.16 }) => {
  const f = useCurrentFrame();
  const step = Math.floor(f / 2);
  const i = step % 4;
  const ox = Math.floor(random(`gx${step}`) * 960);
  const oy = Math.floor(random(`gy${step}`) * 960);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile(`gen/grain-${i}.png`)})`,
        backgroundSize: "960px 960px",
        backgroundPosition: `${ox}px ${oy}px`,
        mixBlendMode: "overlay",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * Finishing layer over the whole edit: print texture, grain, specks of dust and the odd
 * hair (a few frames each), a faint exposure flicker and a warm print tone. Kept subtle.
 */
export const FilmLook: React.FC = () => {
  const f = useCurrentFrame();
  const flicker = (random(`fl${f}`) - 0.5) * 0.035;
  const specks = Array.from({ length: 7 }, (_, i) => {
    const life = Math.floor(f / 3) * 7 + i; // each speck lives ~3 frames
    if (random(`sp${life}`) > 0.42) return null;
    const x = random(`sx${life}`) * 1920;
    const y = random(`sy${life}`) * 1080;
    const r = 0.8 + random(`sr${life}`) * 2.4;
    const dark = random(`sd${life}`) > 0.35;
    return <circle key={i} cx={x} cy={y} r={r} fill={dark ? "#15120e" : "#fbf7ee"} opacity={0.35 + random(`so${life}`) * 0.35} />;
  });
  const hairLife = Math.floor(f / 5);
  const hair =
    random(`hair${hairLife}`) > 0.88 ? (
      <path
        d={`M${random(`hx${hairLife}`) * 1920},${random(`hy${hairLife}`) * 1080} q${(random(`h1${hairLife}`) - 0.5) * 80},${40 + random(`h2${hairLife}`) * 60} ${(random(`h3${hairLife}`) - 0.5) * 60},${90 + random(`h4${hairLife}`) * 80}`}
        stroke="#1a1612"
        strokeWidth={1.1}
        fill="none"
        opacity={0.35}
      />
    ) : null;
  return (
    <>
      <AbsoluteFill style={{ backgroundImage: `url(${paper})`, backgroundSize: "900px 900px", mixBlendMode: "multiply", opacity: 0.14, pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "#f3d9b0", mixBlendMode: "soft-light", opacity: 0.16, pointerEvents: "none" }} />
      <Grain opacity={0.16} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {specks}
        {hair}
      </svg>
      <AbsoluteFill style={{ background: flicker > 0 ? "#fff" : "#000", opacity: Math.abs(flicker), pointerEvents: "none" }} />
      <Vignette strength={0.22} />
    </>
  );
};
