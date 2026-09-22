import React, { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";

export type Cam = { x: number; y: number; s: number; r: number };
const Ctx = createContext<Cam>({ x: 0, y: 0, s: 1, r: 0 });

/**
 * Virtual camera. x/y = pan in stage pixels (positive = camera moves right/down),
 * s = zoom, r = roll in degrees. Children use <Layer depth> for parallax.
 */
export const Camera: React.FC<Partial<Cam> & { children: React.ReactNode }> = ({
  x = 0,
  y = 0,
  s = 1,
  r = 0,
  children,
}) => (
  <Ctx.Provider value={{ x, y, s, r }}>
    <AbsoluteFill style={{ overflow: "hidden" }}>{children}</AbsoluteFill>
  </Ctx.Provider>
);

/** depth 1 = moves with the camera; <1 = further away (less motion); >1 = foreground. */
export const Layer: React.FC<{ depth?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  depth = 1,
  children,
  style,
}) => {
  const { x, y, s, r } = useContext(Ctx);
  const scale = 1 + (s - 1) * depth;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "50% 50%",
        transform: `scale(${scale}) rotate(${r * depth}deg) translate(${-x * depth}px, ${-y * depth}px)`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
