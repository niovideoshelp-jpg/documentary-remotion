import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import speech from "./data/speech.json";
import { FPS, DURATION } from "./lib/time";

/*
 * Sound design. Every cue is tied to a visible action (see scenes). SFX are peak-
 * normalised to -3 dBFS (public/sfx), so the numbers below are the mix.
 * Music: two cues generated for this edit, ducked under the narration.
 */
type Cue = [at: number, file: string, vol: number, dur?: number];

const CUES: Cue[] = [
  // S01 Typhoon
  [0.95, "slide-1", 0.45], [1.75, "boom-1", 0.55], [3.0, "marker-1", 0.3], [3.3, "tape-1", 0.45], [4.4, "jet-flyby", 0.5],
  // S02 original mission
  [7.0, "tear-1", 0.55], [7.25, "pencil", 0.4, 1.8], [8.45, "marker-2", 0.28], [9.05, "whoosh-1", 0.4], [9.3, "slide-2", 0.45], [9.6, "tape-2", 0.4],
  [10.44, "whoosh-2", 0.35], [10.5, "tape-3", 0.35], [11.6, "jet-flyby", 0.32], [11.7, "tape-1", 0.35], [12.5, "marker-2", 0.28],
  // S03 ground role
  [14.75, "whoosh-3", 0.45], [15.3, "pencil", 0.35, 2.0], [17.6, "slide-3", 0.45], [18.6, "tape-2", 0.4], [20.4, "pencil", 0.35, 1.4],
  [20.9, "slide-1", 0.45], [21.0, "tape-3", 0.35], [21.6, "bomb", 0.5], [22.65, "stamp-2", 0.35], [22.8, "tape-1", 0.4], [24.15, "whip-1", 0.6],
  // S04 Rafale
  [24.3, "afterburner", 0.55], [26.05, "boom-2", 0.6], [28.0, "whoosh-1", 0.45], [28.6, "pencil", 0.4, 3.6], [31.0, "marker-1", 0.3], [31.2, "slide-2", 0.35], [32.9, "stamp-1", 0.5],
  // S05 missions + carrier
  [35.25, "tear-2", 0.55], [35.4, "pencil", 0.3, 1.0], [36.0, "slide-3", 0.4], [36.3, "tape-3", 0.35], [37.4, "slide-1", 0.4], [37.7, "tape-1", 0.35],
  [38.72, "slide-2", 0.4], [39.0, "tape-2", 0.35], [40.35, "whoosh-2", 0.45], [40.5, "carrier", 0.55],
  // S06 rivals
  [44.95, "tear-3", 0.55], [45.7, "whoosh-3", 0.35], [46.5, "whoosh-1", 0.35], [53.3, "slide-3", 0.45], [55.0, "riser", 0.22], [55.9, "split", 0.65],
  // S07 map
  [57.9, "whoosh-2", 0.35], [59.9, "pencil", 0.3, 1.6], [61.3, "liquid-1", 0.5], [61.75, "liquid-2", 0.4], [62.2, "marker-2", 0.25], [62.35, "ping-1", 0.35],
  [64.6, "pencil", 0.3, 1.2], [66.0, "liquid-1", 0.5], [66.95, "ping-2", 0.4], [67.0, "marker-1", 0.25], [67.95, "snap", 0.6], [68.2, "tape-1", 0.3],
  [69.4, "whoosh-3", 0.45], [70.3, "liquid-2", 0.3], [71.0, "ping-1", 0.3], [71.6, "boom-1", 0.4],
  // S08 develop / upgrade / sell
  [73.8, "whoosh-1", 0.4], [74.3, "pencil", 0.35, 2.4], [76.2, "tape-2", 0.3], [77.2, "marker-2", 0.35], [77.9, "tape-3", 0.3], [78.0, "stamp-1", 0.6], [78.25, "stamp-3", 0.6],
  // S09 fair comparison
  [79.95, "tear-1", 0.55], [80.2, "pencil", 0.35, 2.0], [80.5, "marker-1", 0.3], [82.0, "tape-1", 0.3], [84.3, "docs", 0.4], [86.5, "ping-2", 0.35], [86.75, "whoosh-2", 0.45],
  // S10 Typhoon FGR4
  [86.9, "whoosh-3", 0.3], [87.2, "slide-1", 0.4], [89.9, "boom-2", 0.5], [93.0, "tape-1", 0.45], [94.1, "tape-2", 0.45], [96.8, "slide-2", 0.4], [97.7, "tape-3", 0.45],
  [98.4, "whoosh-1", 0.5], [99.3, "servo", 0.45, 3.8],
  // S11 Rafale C
  [102.45, "whip-2", 0.6], [102.6, "slide-3", 0.4], [104.3, "boom-1", 0.5], [105.8, "marker-1", 0.4], [105.9, "tape-1", 0.35], [106.3, "tape-2", 0.35], [107.8, "tape-3", 0.35],
  [108.9, "whoosh-2", 0.5], [109.7, "aesa", 0.4, 3.8],
  // S12 mature standards
  [112.75, "tear-2", 0.55], [113.2, "docs", 0.5], [113.7, "slide-1", 0.4], [113.95, "slide-2", 0.4], [116.0, "stamp-1", 0.65], [116.75, "stamp-2", 0.65], [119.8, "stamp-3", 0.65],
  // S13 timeline
  [121.3, "whoosh-3", 0.4], [121.4, "pencil", 0.3, 1.6], [121.9, "marker-1", 0.35], [122.3, "marker-2", 0.35], [123.7, "whoosh-1", 0.35], [128.8, "ping-1", 0.45],
  [132.6, "ping-2", 0.45], [133.5, "whoosh-2", 0.35], [138.1, "slide-3", 0.45], [139.5, "tape-1", 0.4], [140.35, "tape-2", 0.4], [141.0, "riser", 0.2], [141.6, "tape-3", 0.4],
  // S14 case by case + package
  [143.72, "tear-3", 0.55], [143.75, "boom-2", 0.35], [146.2, "liquid-1", 0.35], [146.3, "ping-1", 0.35], [148.2, "ping-2", 0.35], [148.8, "ping-1", 0.35],
  [149.45, "whoosh-1", 0.4], [150.0, "slide-1", 0.4], [150.3, "slide-2", 0.4], [150.6, "slide-3", 0.4], [152.7, "whoosh-2", 0.35],
  [153.4, "tape-1", 0.4], [154.24, "tape-2", 0.4], [154.98, "tape-3", 0.4], [155.68, "tape-1", 0.4], [156.4, "tape-2", 0.4], [158.2, "whoosh-3", 0.4], [159.0, "marker-2", 0.2],
  // S15 deal
  [160.65, "tear-1", 0.55], [162.9, "whoosh-1", 0.3], [165.5, "whoosh-2", 0.3], [166.6, "liquid-2", 0.45], [168.0, "marker-1", 0.4],
  // S16 sources + close
  [169.7, "docs", 0.5], [170.0, "slide-1", 0.35], [170.25, "slide-2", 0.35], [170.5, "slide-3", 0.35], [171.0, "slide-1", 0.3], [173.6, "tape-3", 0.35],
  [177.1, "marker-2", 0.35], [179.6, "marker-1", 0.35], [180.55, "tear-2", 0.5], [180.9, "jet-flyby", 0.35],
];

const SPEECH = speech as [number, number][];
/** Music gain: low under the voice, lifting in the pauses, smoothed at the edges. */
const duck = (t: number) => {
  let d = Infinity;
  for (const [s, e] of SPEECH) {
    if (t >= s - 0.15 && t <= e + 0.25) return 0.15;
    d = Math.min(d, Math.abs(t - (s - 0.15)), Math.abs(t - (e + 0.25)));
  }
  return 0.15 + 0.13 * Math.min(1, d / 0.6);
};

const Music: React.FC<{ file: string; from: number; to: number; fadeIn: number; fadeOut: number; trim?: number }> = ({ file, from, to, fadeIn, fadeOut, trim = 0 }) => (
  <Sequence from={Math.round(from * FPS)} durationInFrames={Math.round((to - from) * FPS)} layout="none">
    <Audio
      src={staticFile(`music/${file}.mp3`)}
      startFrom={Math.round(trim * FPS)}
      volume={(f) => {
        const t = from + f / FPS;
        const env = interpolate(t, [from, from + fadeIn, to - fadeOut, to], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return env * duck(t);
      }}
    />
  </Sequence>
);

export const Soundtrack: React.FC = () => (
  <>
    <Audio src={staticFile("audio/intro.mp3")} />
    <Music file="score-a" from={0} to={82.5} fadeIn={1.2} fadeOut={3.0} />
    <Music file="score-b" from={79.6} to={DURATION / FPS} fadeIn={2.5} fadeOut={2.2} />
    {/* archival room tone, barely there */}
    <Audio src={staticFile("sfx/projector.mp3")} loop volume={0.03} />
    {CUES.map(([at, file, vol, dur], i) => (
      <Sequence key={i} from={Math.round(at * FPS)} durationInFrames={dur ? Math.round(dur * FPS) : undefined} layout="none">
        <Audio
          src={staticFile(`sfx/${file}.mp3`)}
          volume={dur ? (f) => vol * interpolate(f, [0, 4, dur * FPS - 8, dur * FPS], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : vol}
        />
      </Sequence>
    ))}
  </>
);
