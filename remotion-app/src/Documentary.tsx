import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmLook } from "./components/Paper";
import { Soundtrack } from "./Sound";
import { C } from "./lib/theme";
import { drift, useT } from "./lib/time";
import { S01Typhoon, S02Mission, S03Ground } from "./scenes/Open";
import { S04Rafale, S05Missions } from "./scenes/Rafale";
import { S06Rivals, S07Map, S08Approaches } from "./scenes/Europe";
import { S09Fair, S10FGR4, S11RafaleC, S12Mature, S13Timeline } from "./scenes/Versions";
import { S14Cases, S14Package, S15Deal, S16Sources } from "./scenes/Deals";

/*
 * Scenes run on narration time (seconds) and overlap: the later scene is drawn on
 * top and owns the transition (tear, blot, whip, camera tilt). See STORYBOARD.md.
 */
export const SCENES: { id: string; from: number; to: number; C: React.FC }[] = [
  { id: "01 Typhoon", from: 0, to: 7.95, C: S01Typhoon },
  { id: "02 Original mission", from: 7.0, to: 15.8, C: S02Mission },
  { id: "03 Ground role", from: 14.75, to: 24.85, C: S03Ground },
  { id: "04 Rafale", from: 24.2, to: 36.1, C: S04Rafale },
  { id: "05 Missions + carrier", from: 35.25, to: 45.9, C: S05Missions },
  { id: "06 European rivals", from: 44.95, to: 58.9, C: S06Rivals },
  { id: "07 Europe map + exports", from: 57.9, to: 74.8, C: S07Map },
  { id: "08 Approaches", from: 73.8, to: 80.9, C: S08Approaches },
  { id: "09 Fair comparison", from: 79.95, to: 87.85, C: S09Fair },
  { id: "10 Typhoon FGR4", from: 86.9, to: 103.1, C: S10FGR4 },
  { id: "11 Rafale C", from: 102.45, to: 113.7, C: S11RafaleC },
  { id: "12 Mature standards", from: 112.75, to: 122.25, C: S12Mature },
  { id: "13 Versions timeline", from: 121.3, to: 144.45, C: S13Timeline },
  { id: "14 Case by case", from: 143.72, to: 150.4, C: S14Cases },
  { id: "14b Package", from: 149.45, to: 161.6, C: S14Package },
  { id: "15 Deal", from: 160.65, to: 170.6, C: S15Deal },
  { id: "16 Sources + close", from: 169.7, to: 187, C: S16Sources },
];

export const Documentary: React.FC = () => {
  const t = useT();
  // operator's hand: a slow, tiny drift over everything so no frame is ever perfectly locked
  const hx = drift(t, "hand-x", 3.2, 0.22);
  const hy = drift(t, "hand-y", 2.4, 0.19);
  const hr = drift(t, "hand-r", 0.12, 0.16);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Soundtrack />
      {/* letterpress: slightly broken glyph edges, shared by all type */}
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
        {SCENES.filter((s) => t >= s.from && t < s.to).map((s) => (
          <AbsoluteFill key={s.id}>
            <s.C />
          </AbsoluteFill>
        ))}
      </AbsoluteFill>
      <FilmLook />
    </AbsoluteFill>
  );
};
