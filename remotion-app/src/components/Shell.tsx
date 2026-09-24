import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { FilmLook } from "./Paper";
import { SfxCue, type Cue } from "../Sound";
import { C } from "../lib/theme";
import { drift, useT } from "../lib/time";

export type SceneDef = { id: string; from: number; to: number; C: React.FC };

/** Shared frame for a narrated part: narration, room tone, effects, ink filters, handheld drift, film look. */
export const PartShell: React.FC<{ audio: string; scenes: SceneDef[]; cues: Cue[] }> = ({ audio, scenes, cues }) => {
  const t = useT();
  const hx = drift(t, "hand-x", 3.2, 0.22);
  const hy = drift(t, "hand-y", 2.4, 0.19);
  const hr = drift(t, "hand-r", 0.12, 0.16);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Audio src={staticFile(audio)} />
      <Audio src={staticFile("sfx/projector.mp3")} loop volume={0.018} />
      {cues.map((c, i) => (
        <SfxCue key={i} cue={c} />
      ))}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="ink" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={2.6} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-fine" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={1} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={1.3} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <AbsoluteFill style={{ transform: `translate(${hx}px, ${hy}px) rotate(${hr}deg) scale(1.018)`, filter: "contrast(1.04) saturate(0.88) sepia(0.06)" }}>
        {scenes
          .filter((s) => t >= s.from && t < s.to)
          .map((s) => (
            <AbsoluteFill key={s.id}>
              <s.C />
            </AbsoluteFill>
          ))}
      </AbsoluteFill>
      <FilmLook />
    </AbsoluteFill>
  );
};

/** Screen position of a point given in image fractions (u, v) for an objectFit:cover image. */
export const coverPt = (u: number, v: number, iw: number, ih: number, posX = 0.5, posY = 0.5, W = 1920, H = 1080): [number, number] => {
  const s = Math.max(W / iw, H / ih);
  const dw = iw * s;
  const dh = ih * s;
  const ox = (W - dw) * posX;
  const oy = (H - dh) * posY;
  return [ox + u * dw, oy + v * dh];
};
