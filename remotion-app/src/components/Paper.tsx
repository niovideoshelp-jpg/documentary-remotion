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
