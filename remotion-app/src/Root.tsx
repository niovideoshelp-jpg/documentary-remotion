import "./fonts";
import "./index.css";
import { Composition } from "remotion";
import { Documentary } from "./Documentary";
import { DURATION, FPS } from "./lib/time";
import { Part1, PART1_FRAMES } from "./part1/Part1";
import { Part2, PART2_FRAMES } from "./part2/Part2";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="TyphoonVsRafaleIntro" component={Documentary} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
    <Composition id="TyphoonVsRafalePart1" component={Part1} durationInFrames={PART1_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="TyphoonVsRafalePart2" component={Part2} durationInFrames={PART2_FRAMES} fps={FPS} width={1920} height={1080} />
  </>
);
