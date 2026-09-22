import "./fonts";
import "./index.css";
import { Composition } from "remotion";
import { Documentary } from "./Documentary";
import { DURATION, FPS } from "./lib/time";

export const RemotionRoot: React.FC = () => (
  <Composition id="TyphoonVsRafaleIntro" component={Documentary} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
);
