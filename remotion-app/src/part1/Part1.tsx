import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { FilmLook } from "../components/Paper";
import { SfxCue, type Cue } from "../Sound";
import { C } from "../lib/theme";
import { drift, useT } from "../lib/time";
import { P01Eighties, P02Agreement, P03Priorities, P04Leaves, P05Carrier, P06Family, P07Service, P08Progressive, P09NotExclusive } from "./ScenesA";
import { P10QRA, P11Factors, P12Engines, P13Behaviour, P14CleanLoaded, P15Radar, P16Flexible } from "./ScenesB";
import { P17WhoFirst, P18NoTest, P19Pirate, P20Meteor, P21Difference, P22Network } from "./ScenesC";

/* Part 1 — origins, service entry, QRA, engines, sensors, Meteor. Narration: audio/part1.mp3 (279.4 s). */
export const PART1_FRAMES = 8412;

const SCENES: { id: string; from: number; to: number; C: React.FC }[] = [
  { id: "P01 1980s", from: 0, to: 8.9, C: P01Eighties },
  { id: "P02 agreement", from: 8.3, to: 15.9, C: P02Agreement },
  { id: "P03 priorities", from: 15.4, to: 32.5, C: P03Priorities },
  { id: "P04 1985", from: 31.9, to: 38.7, C: P04Leaves },
  { id: "P05 carrier", from: 38.1, to: 46.1, C: P05Carrier },
  { id: "P06 family", from: 45.5, to: 59.9, C: P06Family },
  { id: "P07 service", from: 59.3, to: 71.9, C: P07Service },
  { id: "P08 progressive", from: 71.3, to: 79.9, C: P08Progressive },
  { id: "P09 not exclusive", from: 79.4, to: 91.9, C: P09NotExclusive },
  { id: "P10 QRA + NATO", from: 91.4, to: 105.7, C: P10QRA },
  { id: "P11 factors", from: 105.1, to: 114.0, C: P11Factors },
  { id: "P12 engines", from: 113.5, to: 139.4, C: P12Engines },
  { id: "P13 behaviour", from: 138.8, to: 151.5, C: P13Behaviour },
  { id: "P14 clean vs loaded", from: 151.0, to: 157.8, C: P14CleanLoaded },
  { id: "P15 radar", from: 157.3, to: 181.5, C: P15Radar },
  { id: "P16 flexibility", from: 181.0, to: 194.6, C: P16Flexible },
  { id: "P17 who first", from: 194.1, to: 207.9, C: P17WhoFirst },
  { id: "P18 no test", from: 207.4, to: 217.9, C: P18NoTest },
  { id: "P19 PIRATE", from: 217.4, to: 230.4, C: P19Pirate },
  { id: "P20 Meteor", from: 229.9, to: 249.4, C: P20Meteor },
  { id: "P21 difference", from: 248.9, to: 264.5, C: P21Difference },
  { id: "P22 network", from: 264.0, to: 281, C: P22Network },
];

// Effects only (no music, no jet-engine sounds). Transition whooshes peak mid-transition.
const CUES: Cue[] = [
  [0.7, "boom-1", 0.16], [2.0, "liquid-1", 0.18], [2.1, "ping-1", 0.12], [2.8, "ping-2", 0.12], [3.85, "ping-1", 0.12], [3.9, "liquid-2", 0.14], [4.5, "ping-2", 0.12], [5.1, "ping-1", 0.12],
  [8.69, "whoosh-1", 0.18], [11.85, "slide-3", 0.12], [12.3, "slide-1", 0.18], [12.9, "marker-1", 0.16], [13.7, "slide-2", 0.18], [14.3, "marker-2", 0.16],
  [15.84, "whoosh-3", 0.18], [16.0, "slide-3", 0.14], [26.6, "whoosh-1", 0.14],
  [32.29, "whoosh-2", 0.18], [33.4, "stamp-1", 0.24],
  [38.54, "whoosh-1", 0.18], [41.35, "whoosh-3", 0.12],
  [45.89, "whoosh-3", 0.18], [49.8, "whoosh-1", 0.12], [50.1, "slide-1", 0.18], [53.9, "slide-2", 0.18], [55.5, "slide-3", 0.18],
  [59.74, "whoosh-2", 0.18], [61.2, "ping-1", 0.16], [64.2, "ping-2", 0.16], [69.6, "ping-1", 0.16],
  [71.69, "whoosh-1", 0.18], [71.5, "pencil", 0.12, 1.9], [76.85, "stamp-2", 0.16], [77.4, "stamp-2", 0.16], [78.1, "stamp-2", 0.16],
  [79.84, "whoosh-3", 0.18], [79.6, "pencil", 0.12, 2.4], [88.6, "marker-2", 0.2],
  [91.73, "whoosh-2", 0.18], [97.13, "whoosh-1", 0.16], [103.1, "whoosh-3", 0.14], [104.4, "ping-1", 0.14],
  [105.49, "whoosh-3", 0.18], [107.1, "slide-3", 0.14], [108.1, "slide-2", 0.14], [109.3, "slide-3", 0.14], [110.4, "slide-2", 0.14],
  [113.89, "whoosh-2", 0.18], [117.9, "whoosh-1", 0.12], [118.4, "slide-1", 0.18], [127.8, "slide-2", 0.18], [134.6, "whoosh-3", 0.12],
  [139.24, "whoosh-1", 0.18], [139.0, "pencil", 0.12, 2.4], [143.3, "tape-1", 0.12], [143.9, "tape-2", 0.12], [144.9, "tape-3", 0.12], [145.7, "tape-1", 0.12], [146.5, "tape-2", 0.12],
  [151.35, "whip-1", 0.18], [155.7, "whip-2", 0.18],
  [157.69, "whoosh-3", 0.18], [161.6, "whoosh-3", 0.12], [166.2, "aesa", 0.14, 3.0], [174.0, "servo", 0.16, 3.0],
  [181.39, "whoosh-2", 0.18], [187.3, "ping-2", 0.12],
  [194.49, "whoosh-1", 0.18], [197.7, "slide-1", 0.12], [198.3, "slide-3", 0.12], [199.1, "slide-2", 0.12], [200.3, "slide-3", 0.12], [201.9, "slide-2", 0.12], [203.7, "slide-3", 0.12], [204.5, "slide-2", 0.12],
  [207.79, "whoosh-3", 0.18], [207.9, "docs", 0.18], [211.0, "stamp-3", 0.28],
  [217.79, "whoosh-2", 0.18], [221.3, "ping-1", 0.14],
  [230.29, "whoosh-1", 0.18], [231.0, "pencil", 0.1, 2.0], [235.3, "whoosh-3", 0.1], [235.7, "slide-3", 0.16], [238.0, "pencil", 0.12, 2.8], [247.0, "ping-2", 0.12],
  [249.29, "whoosh-3", 0.18], [252.6, "whip-1", 0.14], [258.1, "whoosh-1", 0.1],
  [264.44, "whoosh-2", 0.18], [264.3, "pencil", 0.12, 1.5], [268.5, "ping-1", 0.14], [270.5, "ping-2", 0.14], [272.3, "ping-1", 0.14], [274.2, "ping-2", 0.14], [276.4, "ping-1", 0.14],
];

export const Part1: React.FC = () => {
  const t = useT();
  const hx = drift(t, "hand-x", 3.2, 0.22);
  const hy = drift(t, "hand-y", 2.4, 0.19);
  const hr = drift(t, "hand-r", 0.12, 0.16);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Audio src={staticFile("audio/part1.mp3")} />
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
