import React from "react";
import { AbsoluteFill } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround } from "../components/Paper";
import { Photo } from "../components/Photo";
import { At, Label, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { Blueprint } from "../components/Blueprint";
import { DrawPath } from "../components/Draw";
import { KeyTitle } from "../components/AnimeText";
import { HandArrow, HandCircle, HandNote, HandUnder, Ink, MARKER, MARKER_RED, PhotoStage } from "../components/Annot";
import { PartShell, coverPt, type SceneDef } from "../components/Shell";
import { WorldMap, viewAt, type Highlight } from "../map/WorldMap";
import { project } from "../map/projection";
import type { Cue } from "../Sound";
import { C, F, W, H } from "../lib/theme";
import { ease, keys, ramp, useT } from "../lib/time";
import { ClipFull, Strike } from "../part1/kit";

/* Part 3 — combat record: operations, the first RAF Typhoon air-to-air kill, ground attack,
 * and the 2025 Rafale loss. Narration: audio/part3.mp3 (164.2 s). No 3D: photos with hand-drawn
 * annotation, blueprints and maps. */
export const PART3_FRAMES = 4950;

// map → screen for a view
const toScreen = (lon: number, lat: number, v: { cx: number; cy: number; z: number }): [number, number] => {
  const [x, y] = project(lon, lat);
  return [(x - v.cx) * v.z + W / 2, (y - v.cy) * v.z + H / 2];
};

// hand sketches (marker style)
const DRONE = "M-70,0 L70,0 M-8,-80 L-8,80 M-70,0 L-92,-26 M-70,0 L-92,26 M70,0 L84,0";
const FIGHTER = "M95,0 L25,-12 L-15,-78 L-38,-78 L-28,-14 L-70,-10 L-82,-34 L-94,-34 L-88,0 L-94,34 L-82,34 L-70,10 L-28,14 L-38,78 L-15,78 L25,12 Z";
const Sketch: React.FC<{ d: string; x: number; y: number; s?: number; p: number; color?: string; rot?: number }> = ({ d, x, y, s = 1, p, color = MARKER, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <DrawPath d={d} p={p} color={color} width={4.5 / s} />
  </g>
);

/* R01 0–4.7 the Rafale in combat since 2007 */
const R01: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <ClipFull src="rr-bank" t={t} from={0} to={4.8} clipDur={4.0} trim={1.9} push={0.07} />
      <At x={W / 2} y={H - 170}>
        <KeyTitle text="In combat since 2007" t={t} at={2.4} size={100} neon="white" />
      </At>
    </AbsoluteFill>
  );
};

/* R02 4.4–12.4 operations, lit in the order spoken */
const OPS: Highlight[] = [
  { name: "Afghanistan", draw: [6.8, 7.2], fill: [7.0, 7.6], label: { text: "AFGHANISTAN", lon: 66, lat: 34.5, size: 34, at: 7.2 } },
  { name: "Libya", draw: [8.1, 8.5], fill: [8.3, 8.9], label: { text: "LIBYA", lon: 17.5, lat: 27, size: 44, at: 8.5 } },
  { name: "Mali", draw: [9.0, 9.4], fill: [9.2, 9.8], label: { text: "MALI", lon: -2.5, lat: 18, size: 44, at: 9.4 } },
  { name: "Iraq", draw: [9.8, 10.2], fill: [10.0, 10.6], label: { text: "IRAQ", lon: 43.5, lat: 33, size: 34, at: 10.2 } },
  { name: "Syria", draw: [10.7, 11.1], fill: [10.9, 11.5], label: { text: "SYRIA", lon: 38.5, lat: 35.2, size: 30, at: 11.1 } },
];
const R02: React.FC = () => {
  const t = useT();
  const lon = keys(t, [[4.4, 30], [12.4, 32]], ease.inOut);
  const lat = keys(t, [[4.4, 28], [12.4, 27]], ease.inOut);
  const z = keys(t, [[4.4, 0.52], [12.4, 0.47]], ease.soft);
  return (
    <TearReveal t={t} start={4.4} dur={0.7} dir="ltr">
      <WorldMap t={t} view={viewAt(lon, lat, z)} highlights={OPS} />
      <At x={W / 2} y={110}>
        <KeyTitle text="Rafale operations" t={t} at={5.0} size={80} />
      </At>
    </TearReveal>
  );
};

/* R03 12.0–23.8 a long history, across several standards — our reference is the F3R */
const STANDARDS = ["F1", "F2", "F3", "F3R", "F4"];
const R03: React.FC = () => {
  const t = useT();
  return (
    <BlotReveal t={t} start={12.0} dur={0.8} cx={W / 2} cy={H / 2}>
      <PhotoStage src="src-photos/rafale-mali.jpg" t={t} t0={12} t1={23.8} pos="30% 50%" z0={1.08} z1={1.18} dim={0.02}>
        {STANDARDS.map((s, i) => (
          <HandNote key={s} x={1420} y={260 + i * 130} p={ramp(t, 16.6 + i * 0.5, 17.1 + i * 0.5)} size={84} rot={-2 + i}>
            {s}
          </HandNote>
        ))}
        <Ink>
          <HandCircle cx={1500} cy={260 + 3 * 130} rx={120} ry={62} p={ramp(t, 20.8, 21.5)} seed="f3r" />
          <HandArrow x1={1250} y1={880} x2={1400} y2={680} p={ramp(t, 22.0, 22.6)} seed="ref" color={MARKER_RED} />
        </Ink>
        <HandNote x={880} y={910} p={ramp(t, 22.2, 22.9)} size={56} color="#ffd3c8">
          our reference
        </HandNote>
      </PhotoStage>
      <At x={W / 2} y={H - 150}>
        <div style={{ opacity: 1 - ramp(t, 15.8, 16.3) }}>
          <KeyTitle text="A long operational history" t={t} at={12.6} size={84} />
        </div>
      </At>
      <At x={560} y={140}>
        <Rise p={ramp(t, 17.6, 18.1)}>
          <Tape p={1} size={30} dark>
            Different versions and standards
          </Tape>
        </Rise>
      </At>
    </BlotReveal>
  );
};

/* R04 23.5–35.4 the Typhoon: Libya 2011, then Iraq and Syria */
const TY_OPS: Highlight[] = [
  { name: "Libya", draw: [28.4, 28.8], fill: [28.6, 29.2], label: { text: "LIBYA", lon: 17.5, lat: 27, size: 50, at: 28.8 } },
  { name: "Iraq", draw: [33.5, 33.9], fill: [33.7, 34.3], label: { text: "IRAQ", lon: 43.5, lat: 33, size: 40, at: 33.9 } },
  { name: "Syria", draw: [34.0, 34.4], fill: [34.2, 34.8], label: { text: "SYRIA", lon: 38.5, lat: 35.2, size: 34, at: 34.4 } },
];
const R04: React.FC = () => {
  const t = useT();
  const map = ramp(t, 26.1, 26.7, ease.inOut);
  const lon = keys(t, [[26.1, 16], [30.6, 17], [32.4, 32], [35.4, 33]], ease.inOut);
  const lat = keys(t, [[26.1, 28], [30.6, 28], [32.4, 32], [35.4, 32]], ease.inOut);
  const z = keys(t, [[26.1, 0.8], [30.6, 0.86], [32.4, 0.82], [35.4, 0.86]], ease.inOut);
  return (
    <TearReveal t={t} start={23.5} dur={0.7} dir="rtl">
      <PhotoStage src="src-photos/typhoon-libya.jpg" t={t} t0={23.5} t1={26.8} pos="62% 50%" z0={1.1} z1={1.2} dim={0.2}>
        <HandNote x={260} y={220} p={ramp(t, 25.0, 25.7)} size={60}>
          a few years later
        </HandNote>
      </PhotoStage>
      <At x={W / 2} y={H - 150}>
        <div style={{ opacity: 1 - map }}>
          <KeyTitle text="Typhoon" t={t} at={23.9} size={110} neon="white" />
        </div>
      </At>
      {map > 0 && (
        <AbsoluteFill style={{ opacity: map }}>
          <WorldMap t={t} view={viewAt(lon, lat, z)} highlights={TY_OPS} />
          <At x={W / 2} y={H - 150}>
            <KeyTitle text="2011" t={t} at={29.0} size={130} neon="white" out={31.0} />
          </At>
          <At x={W / 2} y={110}>
            <Rise p={ramp(t, 27.2, 27.7)}>
              <Label size={32} color={C.ink} weight={700} style={{ letterSpacing: "0.3em" }}>
                First combat deployment
              </Label>
            </Rise>
          </At>
        </AbsoluteFill>
      )}
    </TearReveal>
  );
};

/* R05 35.1–57.6 December 2021: RAF Typhoon shoots down a hostile drone over Syria with ASRAAM. */
const R05: React.FC = () => {
  const t = useT();
  const shot = ramp(t, 41.1, 41.7, ease.inOut);
  // asraam-launch.jpg is 1920×1440; pos 50% 55%
  const [mx, my] = coverPt(0.25, 0.668, 1920, 1440, 0.5, 0.55);
  const quote = ramp(t, 49.6, 50.2);
  return (
    <BlotReveal t={t} start={35.1} dur={0.8} cx={W / 2} cy={H / 2}>
      <PhotoStage src="src-photos/typhoon-shader.jpg" t={t} t0={35.1} t1={41.7} pos="50% 50%" z0={1.06} z1={1.16} dim={0.2}>
        <HandNote x={180} y={200} p={ramp(t, 36.0, 36.7)} size={62}>
          Op SHADER
        </HandNote>
        <HandNote x={180} y={290} p={ramp(t, 38.8, 39.5)} size={46} color="#e8e1d2">
          how it has actually been used
        </HandNote>
      </PhotoStage>
      {shot > 0 && (
        <AbsoluteFill style={{ opacity: shot }}>
          <PhotoStage src="src-photos/asraam-launch.jpg" t={t} t0={41.1} t1={57.6} pos="50% 55%" z0={1.02} z1={1.1} dim={0.12 + quote * 0.3}>
            <HandNote x={120} y={170} p={ramp(t, 41.6, 42.4)} size={70} color="#ffd3c8">
              December 2021
            </HandNote>
            <Ink>
              <HandCircle cx={mx} cy={my} rx={175} ry={46} p={ramp(t, 48.3, 49.0)} seed="asraam" />
              {/* the target, sketched ahead of the missile */}
              <Sketch d={DRONE} x={150} y={600} s={0.6} p={ramp(t, 46.0, 46.8)} color="#ffd3c8" />
              <HandArrow x1={mx - 190} y1={my - 20} x2={230} y2={640} p={ramp(t, 48.6, 49.3)} seed="shot" color={MARKER_RED} bow={-0.15} />
            </Ink>
            <HandNote x={90} y={500} p={ramp(t, 46.2, 46.9)} size={46} color="#ffd3c8">
              hostile drone
            </HandNote>
            <HandNote x={620} y={250} p={ramp(t, 47.1, 47.7)} size={52}>
              over Syria
            </HandNote>
            <HandNote x={mx - 60} y={my + 90} p={ramp(t, 48.5, 49.2) * (1 - quote)} size={60} color="#ffd3c8">
              ASRAAM
            </HandNote>
          </PhotoStage>
          <AbsoluteFill style={{ opacity: quote }}>
            <At x={W / 2} y={H - 220}>
              <KeyTitle text="First operational air-to-air engagement" t={t} at={52.7} size={70} neon="white" />
            </At>
            <At x={W / 2} y={H - 130}>
              <Rise p={ramp(t, 55.4, 55.9)}>
                <Label size={30} color={C.ink} weight={700} style={{ letterSpacing: "0.22em" }}>
                  by an RAF Typhoon — UK Ministry of Defence
                </Label>
              </Rise>
            </At>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </BlotReveal>
  );
};

/* R06 57.3–74.6 significant (fighter + weapon, used for real), but a drone is not a balanced fight. */
const R06: React.FC = () => {
  const t = useT();
  return (
    <TearReveal t={t} start={57.3} dur={0.7} dir="ltr">
      <PaperGround dark>
        <Camera s={keys(t, [[57.3, 1.06], [66.5, 1.0], [74.6, 1.03]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={140}>
              <KeyTitle text="Real-world use" t={t} at={58.0} size={96} out={65.4} />
            </At>
            <HandNote x={560} y={330} p={ramp(t, 61.2, 61.8)} size={58}>
              ✓ the fighter
            </HandNote>
            <HandNote x={1060} y={330} p={ramp(t, 62.1, 62.7)} size={58}>
              ✓ its weapons system
            </HandNote>
            <At x={W / 2} y={140}>
              <KeyTitle text="Context" t={t} at={65.5} size={96} neon="white" />
            </At>
            {/* left: a drone; right: two modern fighters */}
            <Ink>
              <Sketch d={DRONE} x={720} y={620} s={0.8} p={ramp(t, 67.6, 68.3)} color="#ffd3c8" rot={180} />
              <Sketch d={FIGHTER} x={1640} y={620} s={1.3} p={ramp(t, 70.0, 70.9)} color="#ffd3c8" rot={180} />
              <HandArrow x1={1320} y1={760} x2={1500} y2={760} p={ramp(t, 71.9, 72.6)} seed="bal1" bow={0.05} />
              <HandArrow x1={1500} y1={800} x2={1320} y2={800} p={ramp(t, 72.2, 72.9)} seed="bal2" bow={0.05} />
            </Ink>
            <Blueprint view="typhoonTop" x={380} y={620} width={330} p={ramp(t, 66.8, 67.9, ease.linear)} lineWidth={1.6} />
            <AbsoluteFill style={{ opacity: ramp(t, 69.3, 69.7) }}>
              <Blueprint view="typhoonTop" x={1200} y={620} width={330} p={ramp(t, 69.3, 70.4, ease.linear)} lineWidth={1.6} />
            </AbsoluteFill>
            <HandNote x={720} y={790} p={ramp(t, 67.9, 68.5)} size={46} color="#ffd3c8" anchor="center">
              drone
            </HandNote>
            <HandNote x={1640} y={830} p={ramp(t, 70.5, 71.2)} size={46} color="#ffd3c8" anchor="center">
              modern fighter
            </HandNote>
            <HandNote x={1420} y={900} p={ramp(t, 72.0, 72.8)} size={50} anchor="center">
              balanced
            </HandNote>
            <Ink>
              <DrawPath d="M905,595 L1015,595" p={ramp(t, 68.3, 68.5)} color={MARKER_RED} width={12} />
              <DrawPath d="M905,645 L1015,645" p={ramp(t, 68.45, 68.65)} color={MARKER_RED} width={12} />
              <DrawPath d="M1000,555 L920,690" p={ramp(t, 68.6, 68.9)} color={MARKER_RED} width={12} />
            </Ink>
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* R07 74.3–88.8 ground attack: March 2021, RAF Typhoon FGR4s fire Storm Shadow at an ISIS cave complex near Erbil. */
const R07: React.FC = () => {
  const t = useT();
  const map = ramp(t, 77.5, 78.1, ease.inOut);
  const view = viewAt(keys(t, [[77.5, 42], [80, 44.6]], ease.inOut), keys(t, [[77.5, 33], [80, 34.6]], ease.inOut), keys(t, [[77.5, 1.2], [80.5, 1.9], [88.8, 2.0]], ease.inOut));
  const [ex, ey] = toScreen(44.01, 36.19, view);
  return (
    <BlotReveal t={t} start={74.3} dur={0.8} cx={W / 2} cy={H / 2}>
      <PhotoStage src="src-photos/typhoon-akrotiri.jpg" t={t} t0={74.3} t1={78.1} pos="50% 55%" z0={1.05} z1={1.14} dim={0.2}>
        <HandNote x={W / 2} y={200} p={ramp(t, 76.0, 76.7)} size={70} anchor="center">
          ground attack
        </HandNote>
      </PhotoStage>
      {map > 0 && (
        <AbsoluteFill style={{ opacity: map }}>
          <WorldMap t={t} view={view} highlights={[{ name: "Iraq", draw: [77.6, 78.2], fill: [77.8, 78.5] }]} />
          <Ink>
            <HandCircle cx={ex} cy={ey} rx={70} ry={52} p={ramp(t, 86.6, 87.3)} seed="erbil" color={MARKER} />
          </Ink>
          <HandNote x={ex + 80} y={ey - 60} p={ramp(t, 86.8, 87.5)} size={64}>
            Erbil
          </HandNote>
          <HandNote x={ex + 80} y={ey + 50} p={ramp(t, 84.5, 85.4)} size={44} color="#ffd3c8">
            cave complex used by ISIS
          </HandNote>
          <At x={W / 2} y={120}>
            <KeyTitle text="March 2021" t={t} at={78.1} size={90} neon="white" />
          </At>
          <Photo src="src-photos/stormshadow-side.jpg" x={420} y={860} w={560} h={220} rot={-3} reveal={ramp(t, 82.6, 83.2)} revealFrom="left" zoom={1.1} objectPosition="45% 40%" seed="ss3" />
          <At x={420} y={985}>
            <Rise p={ramp(t, 82.9, 83.4)}>
              <Tape p={1} size={30} dark>
                Storm Shadow · Typhoon FGR4
              </Tape>
            </Rise>
          </At>
        </AbsoluteFill>
      )}
    </BlotReveal>
  );
};

/* R08 88.5–109.9 both have fought; but experience isn't a tally of countries or weapons. */
const Tally: React.FC<{ x: number; y: number; n: number; p: number }> = ({ x, y, n, p }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const g = Math.floor(i / 5);
      const k = i % 5;
      const px = x + g * 110 + k * 18;
      const d = k === 4 ? `M${px - 78},${y + 44} L${px + 6},${y - 44}` : `M${px},${y - 40} L${px + 3},${y + 40}`;
      return <DrawPath key={i} d={d} p={ramp(p * n, i, i + 1)} color={MARKER} width={5} />;
    })}
  </g>
);
const R08: React.FC = () => {
  const t = useT();
  const shift = ramp(t, 101.8, 102.5, ease.inOut);
  return (
    <TearReveal t={t} start={88.5} dur={0.7} dir="rtl">
      <PaperGround dark>
        <Camera s={keys(t, [[88.5, 1.06], [95, 1.0], [109.9, 1.02]], ease.soft)}>
          <Layer>
            <AbsoluteFill style={{ opacity: 1 - shift * 0.8 }}>
              <Photo src="src-photos/rafale-mali.jpg" x={560} y={330} w={620} h={380} rot={-2} reveal={ramp(t, 88.8, 89.4)} revealFrom="left" seed="r8a" zoom={1.2} objectPosition="30% 50%" />
              <Photo src="src-photos/typhoon-libya.jpg" x={1360} y={330} w={620} h={380} rot={2} reveal={ramp(t, 89.1, 89.7)} revealFrom="right" seed="r8b" zoom={1.25} objectPosition="62% 50%" />
              <Ink>
                <Tally x={330} y={720} n={13} p={ramp(t, 98.0, 99.8, ease.linear)} />
                <Tally x={1130} y={720} n={9} p={ramp(t, 100.5, 101.6, ease.linear)} />
              </Ink>
              <HandNote x={330} y={620} p={ramp(t, 99.0, 99.7)} size={42} color="#ffd3c8">
                countries
              </HandNote>
              <HandNote x={1130} y={620} p={ramp(t, 100.7, 101.4)} size={42} color="#ffd3c8">
                weapons released
              </HandNote>
              <Strike x1={300} x2={1640} y={720} p={ramp(t, 101.6, 102.1)} width={12} />
            </AbsoluteFill>
            {[
              { at: 103.6, text: "the threat environment" },
              { at: 104.8, text: "the mission" },
              { at: 106.7, text: "the conditions" },
            ].map((k, i) => (
              <HandNote key={k.text} x={W / 2} y={380 + i * 160} p={ramp(t, k.at, k.at + 0.8) * shift} size={80} anchor="center" rot={-2 + i * 1.5}>
                {k.text}
              </HandNote>
            ))}
            <At x={W / 2} y={120}>
              <KeyTitle text="Combat experience" t={t} at={95.7} size={80} />
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* R09 109.7–144.4 losses: India–Pakistan, May 2025; the AP report; at least one Rafale — not every claim. */
const R09: React.FC = () => {
  const t = useT();
  const card = ramp(t, 120.9, 121.5);
  const lon = keys(t, [[109.7, 72], [115, 72]], ease.inOut);
  const lat = keys(t, [[109.7, 28], [115, 28]], ease.inOut);
  const z = keys(t, [[109.7, 0.8], [116, 0.95], [121, 1.0]], ease.soft);
  const claims = [
    [520, 380, -6],
    [1330, 330, 4],
    [760, 760, 3],
    [1240, 720, -5],
    [980, 250, -2],
  ];
  return (
    <BlotReveal t={t} start={109.7} dur={0.8} cx={W / 2} cy={H / 2}>
      <WorldMap
        t={t}
        view={viewAt(lon, lat, z)}
        highlights={[
          { name: "India", draw: [113.8, 114.3], fill: [114.0, 114.6], label: { text: "INDIA", lon: 78.5, lat: 22.5, size: 80, at: 114.3 } },
          { name: "Pakistan", draw: [114.5, 115.0], fill: [114.7, 115.2], label: { text: "PAKISTAN", lon: 69.5, lat: 29.5, size: 50, at: 115.0 }, dim: [115.4, 116] },
        ]}
        overlay={<AbsoluteFill style={{ background: C.night, opacity: card * 0.7 }} />}
      />
      <At x={W / 2} y={110}>
        <KeyTitle text="Losses" t={t} at={110.9} size={100} neon="red" color="#ffb4a6" out={115.2} />
      </At>
      <At x={W / 2} y={110}>
        <KeyTitle text="May 2025" t={t} at={115.5} size={96} neon="white" />
      </At>
      <AbsoluteFill style={{ opacity: 1 - card }}>
        {claims.map(([x, y, r], i) => (
          <HandNote key={i} x={x} y={y} p={ramp(t, 117.2 + i * 0.45, 117.7 + i * 0.45)} size={52} color="#ffd3c8" rot={r} anchor="center">
            claim?
          </HandNote>
        ))}
      </AbsoluteFill>
      {card > 0 && (
        <AbsoluteFill style={{ opacity: card }}>
          <div style={{ position: "absolute", left: 360, top: 250, width: 1200, height: 470, background: "#ece6d8", boxShadow: "0 24px 50px rgba(0,0,0,0.55)", transform: `rotate(-1deg) translateY(${(1 - ease.out(card)) * 40}px)`, padding: "44px 60px", boxSizing: "border-box" }}>
            <div style={{ fontFamily: F.label, fontWeight: 700, fontSize: 26, letterSpacing: "0.3em", color: "#6b6559", textTransform: "uppercase" }}>Reported to the Associated Press</div>
            <div style={{ fontFamily: F.display, fontSize: 64, color: "#1c1c1b", textTransform: "uppercase", marginTop: 18, opacity: ramp(t, 123.2, 123.7) }}>Gen. Jérôme Bellanger</div>
            <div style={{ fontFamily: F.label, fontWeight: 600, fontSize: 30, color: "#3a3833", marginTop: 6, opacity: ramp(t, 122.2, 122.7) }}>Chief of the French Air and Space Force</div>
            <div style={{ fontFamily: F.label, fontWeight: 500, fontSize: 40, color: "#1c1c1b", marginTop: 36, opacity: ramp(t, 127.3, 127.9) }}>saw evidence of the loss of an Indian Rafale</div>
          </div>
          <Ink>
            <HandUnder x1={880} x2={1300} y={640} p={ramp(t, 133.8, 134.5)} seed="one" />
          </Ink>
          <HandNote x={760} y={820} p={ramp(t, 133.9, 134.7)} size={70} color="#ffd3c8" anchor="center">
            at least one
          </HandNote>
          <HandNote x={760} y={940} p={ramp(t, 138.3, 139.2)} size={56} anchor="center">
            ≠ every shoot-down claim
          </HandNote>
        </AbsoluteFill>
      )}
    </BlotReveal>
  );
};

/* R10 144.2–end information fog; and the causes of a loss are hard to pin down. */
const R10: React.FC = () => {
  const t = useT();
  const causes = ramp(t, 151.5, 152.1);
  const cards = [
    { at: 145.2, text: "Military information", x: 700, y: 420, r: -5 },
    { at: 147.7, text: "Propaganda", x: 1150, y: 500, r: 4 },
    { at: 148.7, text: "Conflicting accounts", x: 900, y: 640, r: -2 },
  ];
  const reasons = [
    { at: 157.2, text: "pilot experience" },
    { at: 158.7, text: "mission planning" },
    { at: 159.8, text: "terrain" },
    { at: 160.7, text: "tactics" },
    { at: 161.3, text: "intelligence" },
  ];
  const end = ramp(t, 163.5, 164.2);
  return (
    <TearReveal t={t} start={144.2} dur={0.7} dir="ltr">
      <PaperGround dark>
        <AbsoluteFill style={{ opacity: 1 - causes }}>
          {cards.map((c) => {
            const p = ramp(t, c.at - 0.2, c.at + 0.3);
            return (
              <div key={c.text} style={{ position: "absolute", left: c.x - 330, top: c.y - 90, width: 660, height: 180, background: "#ece6d8", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", transform: `rotate(${c.r}deg) scale(${0.9 + 0.1 * ease.out(p)})`, opacity: p, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontSize: 62, textTransform: "uppercase", color: "#1c1c1b" }}>
                {c.text}
              </div>
            );
          })}
          <At x={W / 2} y={880}>
            <Rise p={ramp(t, 150.4, 150.9)}>
              <Tape p={1} size={34} dark>
                At the same time
              </Tape>
            </Rise>
          </At>
        </AbsoluteFill>
        {causes > 0 && (
          <AbsoluteFill style={{ opacity: causes }}>
            <PhotoStage src="src-photos/rafale-vapor.jpg" t={t} t0={151.5} t1={164.2} pos="50% 50%" z0={1.1} z1={1.2} dim={0.45}>
              <HandNote x={260} y={220} p={ramp(t, 153.8, 154.6)} size={70} color="#ffd3c8">
                why?
              </HandNote>
              {reasons.map((r, i) => (
                <HandNote key={r.text} x={1180} y={300 + i * 110} p={ramp(t, r.at, r.at + 0.6)} size={60} rot={-2 + (i % 2) * 2}>
                  {r.text}
                </HandNote>
              ))}
              <HandNote x={1180} y={300 + 5 * 110} p={ramp(t, 162.4, 163.2)} size={46} color="#e8e1d2">
                …or other factors
              </HandNote>
            </PhotoStage>
          </AbsoluteFill>
        )}
        <AbsoluteFill style={{ background: C.night, opacity: end }} />
      </PaperGround>
    </TearReveal>
  );
};

const SCENES: SceneDef[] = [
  { id: "R01 since 2007", from: 0, to: 5.1, C: R01 },
  { id: "R02 operations", from: 4.4, to: 12.7, C: R02 },
  { id: "R03 standards", from: 12.0, to: 24.1, C: R03 },
  { id: "R04 Typhoon ops", from: 23.5, to: 35.8, C: R04 },
  { id: "R05 ASRAAM", from: 35.1, to: 57.9, C: R05 },
  { id: "R06 context", from: 57.3, to: 74.9, C: R06 },
  { id: "R07 Erbil", from: 74.3, to: 89.1, C: R07 },
  { id: "R08 counting", from: 88.5, to: 110.3, C: R08 },
  { id: "R09 loss", from: 109.7, to: 144.8, C: R09 },
  { id: "R10 fog", from: 144.2, to: 166, C: R10 },
];

const CUES: Cue[] = [
  [2.4, "whoosh-1", 0.1],
  [4.75, "whoosh-1", 0.18], [7.0, "liquid-1", 0.12], [8.3, "ping-1", 0.1], [9.2, "ping-2", 0.1], [10.0, "ping-1", 0.1], [10.9, "ping-2", 0.1],
  [12.4, "whoosh-3", 0.18], [16.6, "marker-1", 0.12], [20.9, "marker-2", 0.14],
  [23.85, "whoosh-2", 0.18], [26.4, "whoosh-1", 0.12], [28.6, "liquid-2", 0.12], [33.7, "ping-1", 0.1],
  [35.5, "whoosh-3", 0.18], [36.0, "marker-1", 0.1], [41.4, "whoosh-1", 0.12], [46.0, "pencil", 0.1, 0.8], [48.3, "marker-2", 0.14], [52.7, "whip-1", 0.1],
  [57.65, "whoosh-2", 0.18], [61.2, "marker-1", 0.1], [62.1, "marker-1", 0.1], [66.8, "pencil", 0.1, 1.2], [68.3, "stamp-2", 0.12], [70.0, "pencil", 0.1, 1.0],
  [74.7, "whoosh-3", 0.18], [77.8, "whoosh-1", 0.12], [82.6, "slide-1", 0.12], [86.6, "marker-2", 0.14],
  [88.85, "whoosh-1", 0.18], [98.0, "pencil", 0.1, 3.6], [101.6, "marker-2", 0.16], [103.6, "marker-1", 0.1], [104.8, "marker-1", 0.1], [106.7, "marker-1", 0.1],
  [110.1, "whoosh-2", 0.18], [114.0, "liquid-1", 0.12], [117.2, "ping-1", 0.08], [118.1, "ping-2", 0.08], [121.1, "docs", 0.16], [133.8, "marker-2", 0.14], [138.3, "marker-1", 0.1],
  [144.55, "whoosh-3", 0.18], [146.1, "slide-3", 0.12], [147.7, "slide-2", 0.12], [148.7, "slide-3", 0.12], [151.7, "whoosh-1", 0.12], [157.2, "marker-1", 0.08], [159.8, "marker-1", 0.08], [161.3, "marker-1", 0.08],
];

export const Part3: React.FC = () => <PartShell audio="audio/part3.mp3" scenes={SCENES} cues={CUES} />;
