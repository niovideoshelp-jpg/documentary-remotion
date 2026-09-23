import React, { useLayoutEffect, useRef } from "react";
import { createTimeline, stagger, eases, type Timeline } from "animejs";
import { C, F } from "../lib/theme";
import { ease, ramp } from "../lib/time";

/*
 * Anime.js inside Remotion: timelines are built once, paused, and *seeked* to the
 * current frame on every render, so every frame is deterministic.
 */
const useSeekedTimeline = (build: (tl: Timeline, root: HTMLElement) => void, ms: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<Timeline | null>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const timeline = createTimeline({ autoplay: false });
    build(timeline, ref.current);
    tl.current = timeline;
    timeline.seek(Math.max(0, ms));
    return () => {
      timeline.revert();
    };
    // built once per mount; seeking below follows the frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useLayoutEffect(() => {
    tl.current?.seek(Math.max(0, ms));
  }, [ms]);
  return ref;
};

type Glow = "red" | "white" | undefined;
const glowShadow = (g: Glow) =>
  g === "red"
    ? "0 0 6px rgba(255,110,80,0.55), 0 0 18px rgba(230,70,45,0.35), 0 0 42px rgba(200,50,30,0.18)"
    : "0 0 6px rgba(255,248,230,0.45), 0 0 18px rgba(255,240,210,0.22), 0 0 40px rgba(255,235,200,0.12)";

/**
 * Key word/title: letters rise in a staggered cascade (outline first when `fill`),
 * then the ink floods in from the left; `neon` adds a restrained glow that flickers on.
 * `at` = seconds when the word is spoken; `t` = current time.
 */
export const KeyTitle: React.FC<{
  text: string;
  t: number;
  at: number;
  size: number;
  color?: string;
  fill?: boolean;
  neon?: Glow;
  out?: number;
  font?: string;
  tracking?: number;
  style?: React.CSSProperties;
}> = ({ text, t, at, size, color = C.offWhite, fill, neon, out, font = F.display, tracking = 0.02, style }) => {
  const ms = (t - at) * 1000;
  const letters = [...text];
  const ref = useSeekedTimeline((tl, root) => {
    const lettersEls = root.querySelectorAll<HTMLElement>(".kt-l");
    tl.add(lettersEls, { opacity: [0, 1], translateY: ["70%", "0%"], rotate: [6, 0], duration: 750, delay: stagger(42), ease: "outExpo" }, 0);
    const fillEl = root.querySelector<HTMLElement>(".kt-fill");
    if (fillEl) tl.add(fillEl, { width: ["0%", "100%"], duration: 700, ease: "inOutQuart" }, 380 + letters.length * 20);
    const glowEl = root.querySelector<HTMLElement>(".kt-glow");
    if (glowEl) tl.add(glowEl, { opacity: [0, 0.85, 0.25, 0.9, 0.7], duration: 650, ease: "linear" }, 650 + letters.length * 20);
  }, ms);
  const o = out ? 1 - ramp(t, out, out + 0.45, ease.in) : 1;
  if (ms < -50 || o <= 0) return null;
  const base: React.CSSProperties = {
    fontFamily: font,
    fontSize: size,
    lineHeight: 0.95,
    letterSpacing: `${tracking}em`,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", opacity: o, ...style }}>
      {/* outline (or solid) letters */}
      <div style={{ ...base, color: fill ? "transparent" : color, WebkitTextStroke: fill ? `${Math.max(1.5, size / 90)}px ${color}` : undefined, filter: "url(#ink)" }}>
        {letters.map((ch, i) => (
          <span key={i} className="kt-l" style={{ display: "inline-block", whiteSpace: "pre" }}>
            {ch}
          </span>
        ))}
      </div>
      {fill && (
        <div className="kt-fill" style={{ position: "absolute", left: 0, top: 0, bottom: 0, overflow: "hidden" }}>
          <div style={{ ...base, color, filter: "url(#ink)" }}>{text}</div>
        </div>
      )}
      {neon && (
        <div className="kt-glow" style={{ position: "absolute", left: 0, top: 0, ...base, color: "transparent", textShadow: glowShadow(neon), pointerEvents: "none" }}>
          {text}
        </div>
      )}
    </div>
  );
};

/** Number that counts up on its cue (Anime.js easing), e.g. "15.96 m". */
export const CountUp: React.FC<{
  t: number;
  at: number;
  to: number;
  decimals?: number;
  suffix?: string;
  dur?: number;
  size: number;
  color?: string;
  neon?: Glow;
  style?: React.CSSProperties;
}> = ({ t, at, to, decimals = 0, suffix = "", dur = 0.9, size, color = C.offWhite, neon, style }) => {
  const p = ramp(t, at, at + dur, (x) => x);
  if (t < at) return null;
  const v = to * eases.outExpo(p);
  return (
    <div
      style={{
        fontFamily: F.display,
        fontSize: size,
        lineHeight: 0.95,
        color,
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        textShadow: neon ? glowShadow(neon) : undefined,
        opacity: Math.min(1, p * 4),
        filter: "url(#ink)",
        ...style,
      }}
    >
      {v.toFixed(decimals)}
      {suffix}
    </div>
  );
};

/** Anime.js elastic/spring easing for pop-ins (package items, pins). */
export const springIn = (t: number, t0: number, dur = 0.9) => {
  const p = ramp(t, t0, t0 + dur, (x) => x);
  return eases.outElastic(1, 0.55)(p);
};

/**
 * Depth: something already said stays in the scene but steps back — slight blur,
 * lower contrast, a touch smaller. `f` 0 = in focus, 1 = fully receded.
 */
export const recede = (f: number, blur = 5, dim = 0.45, shrink = 0.06): React.CSSProperties =>
  f <= 0
    ? {}
    : {
        filter: `blur(${f * blur}px) saturate(${1 - f * 0.4})`,
        opacity: 1 - f * dim,
        transform: `scale(${1 - f * shrink})`,
      };
