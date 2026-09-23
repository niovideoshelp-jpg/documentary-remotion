import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { FPS } from "./lib/time";

/*
 * Sound design.
 * Each cue names the moment of the VISUAL event (a stamp landing, a photo settling,
 * the middle of a camera move). Every file is shifted so that its loudest point lands
 * on that moment (PEAK, measured per file with ffmpeg astats). Long textures (pencil,
 * servo, radar, afterburner, carrier) start on the event instead.
 * Files are peak-normalised to -3 dBFS; the mix sits well under the narration.
 */
const PEAK: Record<string, number> = {
  aesa: 0.33, afterburner: 2.88, bomb: 1.85, "boom-1": 0.19, "boom-2": 0.22, carrier: 0.47, docs: 0.17, "jet-flyby": 1.81,
  "liquid-1": 0.23, "liquid-2": 0.22, "marker-1": 0.85, "marker-2": 0.86, pencil: 0, "ping-1": 0.02, "ping-2": 0.08, riser: 2.62,
  servo: 0, "slide-1": 0.39, "slide-2": 0.12, "slide-3": 0.08, snap: 0.48, split: 0.86, "stamp-1": 0.02, "stamp-2": 0.34, "stamp-3": 0,
  "tape-1": 0.15, "tape-2": 0.04, "tape-3": 0.12, "tear-1": 0.43, "tear-2": 1.75, "tear-3": 1.39, "whip-1": 0.06, "whip-2": 0.07,
  "whoosh-1": 0.47, "whoosh-2": 0.41, "whoosh-3": 0.29,
};

// [visual event time, file, gain, start-mode duration (textures only)]
type Cue = [at: number, file: string, vol: number, dur?: number];
const SFX_GAIN = 0.25;
// engine noise and impacts carry far more energy than paper/pencil sounds: pull them further down
const HEAVY: Record<string, number> = { "jet-flyby": 0.3, afterburner: 0.3, carrier: 0.35, bomb: 0.4, "boom-1": 0.5, "boom-2": 0.5 };

const CUES: Cue[] = [
  // S01 Typhoon: lift, title, fly-off
  [1.3, "slide-1", 0.22], [2.05, "boom-1", 0.22], [6.1, "jet-flyby", 0.28],
  // S02 plate + flight
  [7.52, "whoosh-3", 0.2], [7.25, "pencil", 0.16, 1.8], [9.35, "whoosh-1", 0.2], [9.7, "slide-2", 0.2], [10.9, "whoosh-2", 0.18], [12.0, "jet-flyby", 0.2], [12.8, "whoosh-3", 0.16],
  // S03 tilt, underside, drop
  [15.25, "whoosh-3", 0.2], [15.3, "pencil", 0.15, 2.0], [17.95, "slide-3", 0.2], [20.4, "pencil", 0.15, 1.4], [21.25, "slide-1", 0.2], [22.65, "bomb", 0.28], [24.5, "whip-1", 0.28],
  // S04 Rafale
  [24.4, "afterburner", 0.26, 3.6], [26.5, "boom-2", 0.22], [28.75, "whoosh-1", 0.2], [28.6, "pencil", 0.16, 3.6], [33.15, "stamp-1", 0.3],
  // S05 missions + carrier
  [35.69, "whoosh-2", 0.2], [35.4, "pencil", 0.14, 1.0], [36.25, "slide-3", 0.18], [37.7, "slide-2", 0.18], [39.0, "slide-1", 0.18], [40.95, "whoosh-2", 0.2], [40.6, "carrier", 0.26, 3.4],
  // S06 rivals
  [45.45, "whoosh-1", 0.2], [46.2, "whoosh-3", 0.16], [47.0, "whoosh-1", 0.16], [53.75, "slide-3", 0.2], [56.7, "split", 0.32],
  // S07 map
  [58.4, "whoosh-2", 0.16], [59.9, "pencil", 0.13, 1.6], [61.75, "liquid-1", 0.24], [62.1, "liquid-2", 0.18], [62.55, "ping-1", 0.16],
  [64.6, "pencil", 0.13, 1.2], [66.45, "liquid-1", 0.24], [67.2, "ping-2", 0.18], [70.35, "whoosh-3", 0.22], [71.3, "ping-1", 0.14], [71.95, "boom-1", 0.16],
  // S08 develop / upgrade / sell
  [74.8, "whoosh-1", 0.18], [74.3, "pencil", 0.14, 2.4], [77.55, "marker-2", 0.16], [78.27, "stamp-1", 0.32], [78.52, "stamp-3", 0.3],
  // S09 fair comparison
  [80.45, "whoosh-3", 0.2], [80.2, "pencil", 0.14, 2.0], [84.6, "docs", 0.2], [86.7, "ping-2", 0.16], [87.1, "whoosh-2", 0.2],
  // S10 Typhoon FGR4
  [87.4, "whoosh-3", 0.16], [90.4, "boom-2", 0.18], [97.15, "slide-2", 0.18], [99.0, "whoosh-1", 0.22], [99.69, "whoosh-1", 0.14], [99.5, "servo", 0.2, 3.6],
  // S11 Rafale C
  [102.75, "whip-2", 0.26], [104.65, "boom-1", 0.18], [106.15, "marker-1", 0.16], [109.5, "whoosh-2", 0.22], [110.09, "whoosh-3", 0.14], [109.9, "aesa", 0.18, 3.5],
  // S12 mature standards
  [113.25, "whoosh-2", 0.2], [113.8, "docs", 0.22], [116.3, "stamp-1", 0.32], [117.05, "stamp-2", 0.32], [120.1, "stamp-3", 0.32],
  // S13 timeline
  [121.8, "whoosh-3", 0.18], [121.4, "pencil", 0.13, 1.6], [122.35, "marker-1", 0.14], [124.5, "whoosh-1", 0.16], [129.1, "ping-1", 0.2],
  [132.9, "ping-2", 0.2], [134.4, "whoosh-2", 0.16], [138.75, "slide-3", 0.2],
  // S14 case by case + package
  [144.1, "whoosh-1", 0.2], [146.8, "liquid-2", 0.18], [147.4, "ping-1", 0.16], [148.9, "ping-2", 0.16], [149.8, "ping-1", 0.16],
  [149.95, "whoosh-1", 0.18], [150.3, "slide-1", 0.16], [150.6, "slide-2", 0.16], [150.9, "slide-3", 0.16], [153.1, "whoosh-2", 0.16],
  [153.6, "slide-3", 0.14], [154.44, "slide-2", 0.14], [155.18, "slide-3", 0.14], [155.88, "slide-2", 0.14], [156.6, "slide-1", 0.14], [158.7, "whoosh-3", 0.18],
  // S15 deal
  [161.15, "whoosh-3", 0.18], [163.4, "whoosh-1", 0.14], [166.0, "whoosh-2", 0.14], [167.0, "liquid-2", 0.2], [168.4, "marker-1", 0.16],
  // S16 sources + close
  [170.2, "whoosh-3", 0.16], [170.3, "docs", 0.22], [177.45, "marker-2", 0.16], [179.9, "marker-1", 0.16], [181.05, "whoosh-2", 0.2], [182.6, "jet-flyby", 0.2],
];

const SfxCue: React.FC<{ cue: Cue }> = ({ cue: [at, file, v, dur] }) => {
  const vol = v * SFX_GAIN * (HEAVY[file] ?? 1);
  const start = dur ? at : at - (PEAK[file] ?? 0);
  const frame = Math.round(start * FPS);
  // a cue that would start before 0 is trimmed instead of shifted
  const trim = frame < 0 ? -frame : 0;
  const len = dur ? Math.round(dur * FPS) : undefined;
  return (
    <Sequence from={Math.max(0, frame)} durationInFrames={len} layout="none">
      <Audio
        src={staticFile(`sfx/${file}.mp3`)}
        startFrom={trim}
        volume={len ? (f) => vol * interpolate(f, [0, 5, len - 10, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : vol}
      />
    </Sequence>
  );
};

export const Soundtrack: React.FC = () => (
  <>
    <Audio src={staticFile("audio/intro.mp3")} />
    {/* no music bed: the owner adds their own score */}
    {CUES.map((c, i) => (
      <SfxCue key={i} cue={c} />
    ))}
  </>
);
