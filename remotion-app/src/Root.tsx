import "./fonts";
import "./index.css";
import { Composition } from "remotion";
import { Documentary } from "./Documentary";
import { DURATION, FPS } from "./lib/time";
import { Part1, PART1_FRAMES } from "./part1/Part1";
import { Part2, PART2_FRAMES } from "./part2/Part2";
import { Part3, PART3_FRAMES } from "./part3/Part3";
import { Part4, PART4_FRAMES } from "./part4/Part4";
import { Final, FINAL_FRAMES } from "./final/Final";
import { IconSheet } from "./dev/IconSheet";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="TyphoonVsRafaleIntro" component={Documentary} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
    <Composition id="TyphoonVsRafalePart1" component={Part1} durationInFrames={PART1_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="TyphoonVsRafalePart2" component={Part2} durationInFrames={PART2_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="TyphoonVsRafalePart3" component={Part3} durationInFrames={PART3_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="TyphoonVsRafalePart4" component={Part4} durationInFrames={PART4_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="TyphoonVsRafaleFinal" component={Final} durationInFrames={FINAL_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="IconSheet" component={IconSheet} durationInFrames={30} fps={FPS} width={1920} height={1080} />
  </>
);
