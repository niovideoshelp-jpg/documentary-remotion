import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { roughRect } from "../components/Photo";
import { PrintTexture } from "../components/Paper";
import { C, F } from "../lib/theme";
import { FPS, ease, ramp } from "../lib/time";

/*
 * Part 1 motion kit: video prints, full-bleed clips, ticks, balances, bars, graphs.
 * Everything is driven by narration time `t` (seconds).
 */

/** A real video clip (public/video/p1) playing from narration time `from`. Rate fits the clip to the window. */
export const Clip: React.FC<{ src: string; from: number; to: number; clipDur?: number; trim?: number; style?: React.CSSProperties; grade?: string }> = ({
  src,
  from,
  to,
  clipDur = 6,
  trim = 0,
  style,
  grade = "contrast(1.05) saturate(0.82) sepia(0.08)",
}) => {
  const span = to - from;
  const rate = Math.min(1, Math.max(0.45, (clipDur - trim) / span));
  return (
    <Sequence from={Math.round(from * FPS)} durationInFrames={Math.max(1, Math.round(span * FPS))} layout="none">
      <OffthreadVideo
        src={staticFile(`video/p1/${src}.mp4`)}
        muted
        startFrom={Math.round(trim * FPS)}
        playbackRate={rate}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: grade, ...style }}
      />
    </Sequence>
  );
};

/** A video presented as a physical print with a hand-cut paper edge, like <Photo>. */
export const ClipPrint: React.FC<{
  src: string;
  t: number;
  from: number;
  to: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  reveal?: number;
  clipDur?: number;
  trim?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ src, t, from, to, x, y, w, h, rot = 0, reveal = 1, clipDur, trim, opacity = 1, style }) => {
  if (t < from - 0.05 || t > to + 0.05 || reveal <= 0) return null;
  const border = 12;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.94 + 0.06 * ease.out(reveal)})`,
        opacity: opacity * Math.min(1, reveal * 2),
        filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.5))",
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, clipPath: roughRect(w, h, 0, 2.2, src + "o", 16), background: "#e9dfca" }}>
        <PrintTexture opacity={0.8} />
      </div>
      <div style={{ position: "absolute", inset: 0, clipPath: roughRect(w, h, border, 1.4, src + "i", 14), overflow: "hidden" }}>
        <Clip src={src} from={from} to={to} clipDur={clipDur} trim={trim} />
        <PrintTexture opacity={0.22} />
      </div>
    </div>
  );
};

/** Full-bleed clip with a slow push, dark vignette and print grain. */
export const ClipFull: React.FC<{ src: string; t: number; from: number; to: number; clipDur?: number; trim?: number; push?: number }> = ({ src, t, from, to, clipDur, trim, push = 0.06 }) => {
  const p = ramp(t, from, to, (x) => x);
  return (
    <AbsoluteFill style={{ background: C.night, transform: `scale(${1.02 + p * push})` }}>
      <Clip src={src} from={from} to={to} clipDur={clipDur} trim={trim} />
      <PrintTexture opacity={0.18} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(8,8,8,0.55) 100%)" }} />
      {/* scrims where captions sit, so light words never land on a light sky */}
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,6,6,0.62) 0%, rgba(6,6,6,0) 36%), linear-gradient(180deg, rgba(6,6,6,0.4) 0%, rgba(6,6,6,0) 18%)" }} />
    </AbsoluteFill>
  );
};

/** A photo in a circle with a white rim; pops in on a soft spring. */
export const CirclePhoto: React.FC<{ src: string; x: number; y: number; d: number; p: number; pos?: string; zoom?: number }> = ({ src, x, y, d, p, pos = "50% 50%", zoom = 1.15 }) => {
  if (p <= 0) return null;
  const e = ease.out(Math.min(1, p));
  return (
    <div
      style={{
        position: "absolute",
        left: x - d / 2,
        top: y - d / 2,
        width: d,
        height: d,
        borderRadius: "50%",
        overflow: "hidden",
        border: `${Math.round(d * 0.028)}px solid #f3eee2`,
        boxShadow: "0 14px 30px rgba(0,0,0,0.55)",
        transform: `scale(${0.6 + 0.4 * e})`,
        opacity: Math.min(1, p * 2.5),
        background: "#111",
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom + (1 - e) * 0.15})`, filter: "contrast(1.05) saturate(0.85) sepia(0.06)" }} />
    </div>
  );
};

/** A mixing-desk fader: `level` 0..1 sets the knob; the lit track shows the share. */
export const Fader: React.FC<{ x: number; y: number; h: number; level: number; p: number; label: string; color?: string }> = ({ x, y, h, level, p, label, color = C.red }) => {
  if (p <= 0) return null;
  const e = ease.out(Math.min(1, p));
  const ky = y + h / 2 - level * h;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: e }}>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={x - 44} x2={x - (i % 5 === 0 ? 20 : 28)} y1={y - h / 2 + (i * h) / 10} y2={y - h / 2 + (i * h) / 10} stroke={C.inkSoft} strokeWidth={2} opacity={0.7} />
        ))}
        <rect x={x - 7} y={y - h / 2} width={14} height={h} rx={7} fill="#0e0f10" stroke="rgba(235,227,210,0.35)" strokeWidth={2} />
        <rect x={x - 5} y={ky} width={10} height={y + h / 2 - ky} rx={5} fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        <g transform={`translate(${x},${ky})`}>
          <rect x={-46} y={-22} width={92} height={44} rx={6} fill="#e9e3d6" stroke="#0e0f10" strokeWidth={2} />
          {[-10, 0, 10].map((o) => (
            <line key={o} x1={-30} x2={30} y1={o} y2={o} stroke="#6b6559" strokeWidth={2} />
          ))}
        </g>
      </svg>
      <div style={{ position: "absolute", left: x, top: y + h / 2 + 46, transform: "translateX(-50%)", fontFamily: F.label, fontWeight: 700, fontSize: 30, letterSpacing: "0.24em", textTransform: "uppercase", color: C.ink, whiteSpace: "nowrap", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>{label}</div>
    </div>
  );
};

/** Hand-drawn check mark that draws itself. */
export const Check: React.FC<{ x: number; y: number; p: number; size?: number; color?: string }> = ({ x, y, p, size = 60, color = C.red }) =>
  p <= 0 ? null : (
    <svg width={size * 1.4} height={size * 1.2} viewBox="0 0 70 60" style={{ position: "absolute", left: x - size * 0.7, top: y - size * 0.6, overflow: "visible" }}>
      <path d="M6,32 L26,52 L64,6" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${ease.out(p)} 2`} filter="url(#ink)" />
    </svg>
  );

/** Strike-through line drawn across a word. */
export const Strike: React.FC<{ x1: number; x2: number; y: number; p: number; color?: string; width?: number }> = ({ x1, x2, y, p, color = C.red, width = 10 }) =>
  p <= 0 ? null : (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path d={`M${x1},${y + 6} Q${(x1 + x2) / 2},${y - 10} ${x2},${y - 4}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={`${ease.out(p)} 2`} filter="url(#ink)" />
    </svg>
  );

/** A balance beam on a fulcrum; `tilt` in degrees (+ = right side down). */
export const Balance: React.FC<{ x: number; y: number; w: number; tilt: number; p: number; left: React.ReactNode; right: React.ReactNode; color?: string }> = ({ x, y, w, tilt, p, left, right, color = C.ink }) => {
  if (p <= 0) return null;
  const e = ease.out(p);
  const half = w / 2;
  const rad = (tilt * Math.PI) / 180;
  const lx = x - Math.cos(rad) * half;
  const ly = y - Math.sin(rad) * half;
  const rx = x + Math.cos(rad) * half;
  const ry = y + Math.sin(rad) * half;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: e }} width={1} height={1}>
        <path d={`M${x - 50},${y + 150} L${x},${y + 8} L${x + 50},${y + 150} Z`} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={color} strokeWidth={7} strokeLinecap="round" />
        <circle cx={x} cy={y} r={9} fill={C.paper} stroke={color} strokeWidth={4} />
        {[
          [lx, ly],
          [rx, ry],
        ].map(([px, py], i) => (
          <g key={i}>
            <line x1={px} y1={py} x2={px - 70} y2={py + 90} stroke={color} strokeWidth={2} />
            <line x1={px} y1={py} x2={px + 70} y2={py + 90} stroke={color} strokeWidth={2} />
            <path d={`M${px - 90},${py + 90} Q${px},${py + 130} ${px + 90},${py + 90} Z`} fill="none" stroke={color} strokeWidth={4} />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: lx, top: ly + 60, transform: "translate(-50%,-100%)", opacity: e }}>{left}</div>
      <div style={{ position: "absolute", left: rx, top: ry + 60, transform: "translate(-50%,-100%)", opacity: e }}>{right}</div>
    </>
  );
};

/** Horizontal bar that grows to `value / max` of `w`, with a label and value slot. */
export const Bar: React.FC<{ x: number; y: number; w: number; h?: number; value: number; max: number; p: number; color?: string; label: string; right?: React.ReactNode }> = ({
  x,
  y,
  w,
  h = 54,
  value,
  max,
  p,
  color = C.red,
  label,
  right,
}) => {
  if (p <= 0) return null;
  const len = (value / max) * w * ease.out(p);
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ fontFamily: F.label, fontWeight: 600, fontSize: 30, letterSpacing: "0.16em", textTransform: "uppercase", color: C.ink, marginBottom: 10, filter: "url(#ink-fine)" }}>{label}</div>
      <div style={{ position: "relative", width: w, height: h, borderLeft: `3px solid ${C.ink}` }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: len, background: color, boxShadow: `0 0 18px ${color}55`, filter: "url(#ink)" }} />
        <div style={{ position: "absolute", left: len + 18, top: "50%", transform: "translateY(-50%)" }}>{right}</div>
      </div>
    </div>
  );
};

/** Tile with a caption for grids of factors. */
export const Tile: React.FC<{ x: number; y: number; w: number; h: number; p: number; label: string; children?: React.ReactNode; dim?: number }> = ({ x, y, w, h, p, label, children, dim = 0 }) => {
  if (p <= 0) return null;
  const e = ease.out(p);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        transform: `translateY(${(1 - e) * 40}px) scale(${0.9 + 0.1 * e})`,
        opacity: e * (1 - dim * 0.55),
        filter: dim > 0 ? `blur(${dim * 3}px)` : undefined,
        border: `2px solid rgba(235,227,210,0.55)`,
        background: "rgba(20,20,20,0.55)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 14px 8px", background: "linear-gradient(0deg, rgba(10,10,10,0.9), rgba(10,10,10,0))", fontFamily: F.tape, fontSize: 30, letterSpacing: "0.08em", textTransform: "uppercase", color: C.offWhite, filter: "url(#ink)" }}>
        {label}
      </div>
    </div>
  );
};
