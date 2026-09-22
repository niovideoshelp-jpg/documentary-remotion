import { Easing, interpolate, useCurrentFrame, random } from "remotion";

export const FPS = 30;
export const DURATION = 5605;

/** Global timeline time in seconds. Scenes are not wrapped in <Sequence>, so this is narration time. */
export const useT = () => useCurrentFrame() / FPS;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.45, 0, 0.25, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  linear: (x: number) => x,
};

/** 0→1 between t0 and t1 (seconds). */
export const ramp = (t: number, t0: number, t1: number, e: (x: number) => number = ease.out) =>
  interpolate(t, [t0, t1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e,
  });

/** Piecewise keyframes [[time, value], ...] with one easing per segment. */
export const keys = (t: number, k: [number, number][], e: (x: number) => number = ease.inOut) => {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) {
    const [t0, v0] = k[i];
    const [t1, v1] = k[i + 1];
    if (t <= t1) return v0 + (v1 - v0) * e((t - t0) / Math.max(1e-6, t1 - t0));
  }
  return k[k.length - 1][1];
};

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Small deterministic drift for "hand-held" life. */
export const drift = (t: number, seed: string, amp = 1, speed = 0.35) => {
  const a = random(seed) * Math.PI * 2;
  const b = random(seed + "b") * Math.PI * 2;
  return amp * (Math.sin(t * speed * 2 + a) * 0.6 + Math.sin(t * speed * 3.7 + b) * 0.4);
};

/** In [from, to) window? */
export const within = (t: number, from: number, to: number) => t >= from && t < to;
