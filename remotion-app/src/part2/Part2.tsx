import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { FilmLook } from "../components/Paper";
import { SfxCue, type Cue } from "../Sound";
import { C } from "../lib/theme";
import { drift, useT } from "../lib/time";
import { Q01Scope, Q02Spectra, Q03Dass, Q04Docs, Q05Superior, Q06Survive } from "./ScenesA";
import { Q07Ground, Q08TyphoonKit, Q09RafaleKit, Q10Mission, Q11Brimstone, Q12Talios, Q13StandOff } from "./ScenesB";
import { Q14Versatile, Q15Dossier, Q16Families, Q17Naval, Q18Land, Q19Exocet, Q20Customers } from "./ScenesC";

/* Part 2 — self-protection, ground attack, stand-off weapons, naval Rafale, configurations.
 * Narration: audio/part2.mp3 (260.4 s). */
export const PART2_FRAMES = 7830;

const SCENES: { id: string; from: number; to: number; C: React.FC }[] = [
  { id: "Q01 scope", from: 0, to: 9.0, C: Q01Scope },
  { id: "Q02 SPECTRA", from: 8.3, to: 25.5, C: Q02Spectra },
  { id: "Q03 DASS", from: 24.8, to: 39.3, C: Q03Dass },
  { id: "Q04 documents", from: 38.6, to: 64.8, C: Q04Docs },
  { id: "Q05 superior", from: 64.1, to: 71.3, C: Q05Superior },
  { id: "Q06 survivability", from: 70.6, to: 86.7, C: Q06Survive },
  { id: "Q07 ground attack", from: 86.0, to: 92.7, C: Q07Ground },
  { id: "Q08 Typhoon weapons", from: 92.0, to: 99.8, C: Q08TyphoonKit },
  { id: "Q09 Rafale weapons", from: 99.1, to: 113.0, C: Q09RafaleKit },
  { id: "Q10 mission", from: 112.3, to: 121.9, C: Q10Mission },
  { id: "Q11 Brimstone", from: 121.2, to: 136.8, C: Q11Brimstone },
  { id: "Q12 Talios + AASM", from: 136.1, to: 153.1, C: Q12Talios },
  { id: "Q13 stand-off", from: 152.4, to: 177.1, C: Q13StandOff },
  { id: "Q14 versatile", from: 176.4, to: 190.0, C: Q14Versatile },
  { id: "Q15 dossier", from: 189.3, to: 201.1, C: Q15Dossier },
  { id: "Q16 families", from: 200.4, to: 208.8, C: Q16Families },
  { id: "Q17 naval", from: 208.1, to: 227.5, C: Q17Naval },
  { id: "Q18 land-based", from: 226.8, to: 235.6, C: Q18Land },
  { id: "Q19 Exocet", from: 234.9, to: 244.2, C: Q19Exocet },
  { id: "Q20 customers", from: 243.5, to: 262, C: Q20Customers },
];

// Effects only (no music, no jet-engine sounds). Transition whooshes peak mid-transition.
const CUES: Cue[] = [
  [0.3, "boom-1", 0.14], [1.9, "ping-1", 0.12], [3.6, "ping-2", 0.14], [5.0, "marker-2", 0.14], [6.4, "whip-1", 0.12],
  [8.65, "whoosh-1", 0.18], [12.1, "stamp-2", 0.12], [17.5, "ping-1", 0.12], [18.2, "ping-2", 0.12], [19.0, "snap", 0.12], [23.2, "snap", 0.1],
  [25.15, "whoosh-2", 0.18], [26.8, "stamp-2", 0.12], [30.2, "ping-1", 0.12], [31.0, "aesa", 0.1, 2.5], [32.8, "snap", 0.12], [34.3, "whoosh-3", 0.12], [35.4, "servo", 0.12, 2.2],
  [39.0, "whoosh-3", 0.18], [39.1, "docs", 0.16], [45.7, "stamp-1", 0.14], [46.4, "stamp-2", 0.12], [47.2, "stamp-2", 0.12], [51.6, "marker-1", 0.12], [59.4, "whoosh-1", 0.1], [60.9, "ping-1", 0.1], [61.7, "ping-2", 0.1], [62.4, "ping-1", 0.1],
  [64.4, "whoosh-2", 0.18], [65.6, "ping-2", 0.12], [69.4, "marker-2", 0.16],
  [71.0, "whoosh-1", 0.18], [74.2, "marker-2", 0.16], [79.1, "slide-3", 0.12], [80.0, "slide-2", 0.12], [81.1, "slide-3", 0.12], [83.4, "slide-2", 0.12],
  [86.3, "whoosh-3", 0.18],
  [92.35, "whoosh-2", 0.18], [92.2, "pencil", 0.1, 1.9], [95.0, "slide-1", 0.14], [96.4, "slide-2", 0.14], [97.5, "slide-3", 0.14],
  [99.4, "whoosh-1", 0.18], [99.3, "pencil", 0.1, 2.0], [102.4, "slide-1", 0.12], [103.9, "slide-2", 0.12], [105.6, "slide-3", 0.12], [106.8, "slide-1", 0.12], [109.0, "tape-1", 0.1], [110.5, "tape-2", 0.1], [111.2, "tape-3", 0.1],
  [112.65, "whoosh-3", 0.18], [116.0, "marker-2", 0.16], [117.9, "boom-2", 0.12],
  [121.55, "whoosh-2", 0.18], [125.8, "ping-1", 0.1], [128.0, "ping-2", 0.12],
  [136.45, "whoosh-1", 0.18], [140.4, "servo", 0.1, 0.9], [141.3, "ping-1", 0.12], [141.9, "ping-2", 0.12], [143.6, "whoosh-3", 0.1], [143.5, "pencil", 0.1, 1.5],
  [152.75, "whoosh-2", 0.18], [157.9, "slide-1", 0.14], [161.5, "tape-1", 0.1], [163.8, "whoosh-1", 0.1], [166.3, "whip-1", 0.12], [172.7, "marker-1", 0.1], [173.4, "marker-2", 0.1],
  [176.75, "whoosh-3", 0.18], [180.1, "marker-2", 0.16], [183.0, "whoosh-2", 0.12],
  [189.6, "whoosh-1", 0.16], [190.4, "docs", 0.14], [192.3, "stamp-3", 0.24], [194.6, "slide-3", 0.12], [195.7, "slide-2", 0.12], [197.8, "slide-3", 0.12],
  [200.75, "whoosh-2", 0.18], [205.4, "ping-1", 0.1], [205.8, "ping-2", 0.1], [206.2, "ping-1", 0.1],
  [208.45, "whoosh-3", 0.18], [211.4, "whoosh-1", 0.12], [214.9, "whoosh-2", 0.12], [214.8, "pencil", 0.1, 1.8], [216.6, "marker-2", 0.14], [218.8, "whoosh-3", 0.1], [225.8, "stamp-3", 0.26],
  [227.15, "whoosh-1", 0.18], [233.0, "whip-2", 0.12],
  [235.25, "whoosh-2", 0.18], [238.5, "stamp-2", 0.1],
  [243.9, "whoosh-3", 0.18], [246.3, "liquid-1", 0.12], [247.3, "liquid-2", 0.1], [248.2, "liquid-1", 0.1], [254.4, "tape-1", 0.1], [255.4, "tape-2", 0.1], [257.7, "tape-3", 0.1],
];

export const Part2: React.FC = () => {
  const t = useT();
  const hx = drift(t, "hand-x", 3.2, 0.22);
  const hy = drift(t, "hand-y", 2.4, 0.19);
  const hr = drift(t, "hand-r", 0.12, 0.16);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Audio src={staticFile("audio/part2.mp3")} />
      <Audio src={staticFile("sfx/projector.mp3")} loop volume={0.018} />
      {CUES.map((c, i) => (
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
