import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture, Vignette } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Label, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { Blueprint } from "../components/Blueprint";
import { KeyTitle, recede, springIn } from "../components/AnimeText";
import { WorldMap, viewAt, type Highlight } from "../map/WorldMap";
import { C, W, H } from "../lib/theme";
import { ease, keys, ramp, useT } from "../lib/time";
import { Check, CirclePhoto, ClipFull, Fader, Strike } from "./kit";

/* P01 0–8.4 "Back in the 1980s, France, the UK, Germany, Italy and Spain were discussing
 * the development of a new European fighter." Five countries light up as they are named. */
const FIVE: Highlight[] = [
  { name: "France", draw: [1.5, 1.95], fill: [1.75, 2.3], origin: [2.35, 48.86], label: { text: "FRANCE", lon: 2.6, lat: 46.6, size: 70, at: 2.1 } },
  { name: "United Kingdom", draw: [2.2, 2.65], fill: [2.45, 3.0], origin: [-1.5, 52.5], label: { text: "UK", lon: -1.6, lat: 52.6, size: 60, at: 2.8 } },
  { name: "Germany", draw: [3.25, 3.7], fill: [3.5, 4.05], origin: [10.2, 51.0], label: { text: "GERMANY", lon: 10.3, lat: 51.0, size: 56, at: 3.85 } },
  { name: "Italy", draw: [3.9, 4.35], fill: [4.15, 4.7], origin: [12.0, 43.5], label: { text: "ITALY", lon: 13.2, lat: 42.6, size: 48, at: 4.5, rot: 50 } },
  { name: "Spain", draw: [4.5, 4.95], fill: [4.75, 5.3], origin: [-3.7, 40.3], label: { text: "SPAIN", lon: -3.6, lat: 40.0, size: 70, at: 5.1 } },
];

export const P01Eighties: React.FC = () => {
  const t = useT();
  const lon = keys(t, [[0, 6], [1.4, 5], [8.4, 4.5]], ease.inOut);
  const lat = keys(t, [[0, 47.5], [8.4, 46.5]], ease.inOut);
  const z = keys(t, [[0, 0.8], [1.4, 0.95], [8.4, 1.08]], ease.soft);
  const title = 1 - ramp(t, 1.2, 1.7, ease.inOut);
  return (
    <AbsoluteFill>
      <WorldMap t={t} view={viewAt(lon, lat, z)} highlights={FIVE} overlay={<AbsoluteFill style={{ background: C.night, opacity: 0.25 + title * 0.55 }} />} />
      <At x={W / 2} y={H / 2}>
        <div style={{ opacity: title }}>
          <KeyTitle text="1980" t={t} at={0.35} size={260} fill neon="white" />
        </div>
      </At>
      <At x={W / 2} y={H - 120}>
        <KeyTitle text="A new European fighter" t={t} at={6.6} size={72} />
      </At>
    </AbsoluteFill>
  );
};

/* P02 8.3–15.5 "agreement on one thing: air-to-air and surface attack missions." */
export const P02Agreement: React.FC = () => {
  const t = useT();
  const a = springIn(t, 12.2, 0.9);
  const b = springIn(t, 13.6, 0.9);
  return (
    <TearReveal t={t} start={8.3} dur={0.7} dir="ltr">
      <PaperGround>
        <Camera s={keys(t, [[8.3, 1.06], [15.5, 1.0]], ease.soft)}>
          <Layer>
            {/* the statement holds centre stage, then makes room for the two mission types */}
            <At x={W / 2} y={keys(t, [[8.3, 520], [11.5, 520], [12.2, 170]], ease.inOut)}>
              <div style={{ transform: `scale(${keys(t, [[8.3, 1.75], [11.5, 1.6], [12.2, 1]], ease.inOut)})` }}>
                <KeyTitle text="Agreed on one thing" t={t} at={8.7} size={84} />
              </div>
            </At>
            <At x={W / 2} y={640}>
              <div style={{ opacity: ramp(t, 10.5, 10.9) * (1 - ramp(t, 11.5, 11.9)) }}>
                <Label size={34} color={C.inkSoft} weight={600} style={{ letterSpacing: "0.3em" }}>
                  One aircraft · two roles
                </Label>
              </div>
            </At>
            <Cutout name="meteor" x={580} y={540} w={760} rot={-6} opacity={ramp(t, 12.2, 12.5)} scale={0.8 + a * 0.2} />
            <At x={600} y={760}>
              <Rise p={ramp(t, 12.3, 12.8)}>
                <Tape p={1} size={40}>
                  Air-to-air
                </Tape>
              </Rise>
            </At>
            <Check x={880} y={420} p={ramp(t, 12.7, 13.1)} />
            <Cutout name="paveway" x={1340} y={530} w={700} rot={4} opacity={ramp(t, 13.6, 13.9)} scale={0.8 + b * 0.2} />
            <At x={1330} y={790}>
              <Rise p={ramp(t, 13.7, 14.2)}>
                <Tape p={1} size={40} dark>
                  Surface attack
                </Tape>
              </Rise>
            </At>
            <Check x={1600} y={400} p={ramp(t, 14.1, 14.5)} />
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* P03 15.4–32.0 priorities as a mixing desk: France keeps air and ground level (and lighter);
 * the four push air superiority to the top. */
export const P03Priorities: React.FC = () => {
  const t = useT();
  // France: the two channels hunt for a mix, then settle level
  const hunt = 1 - ramp(t, 18.8, 22.3, ease.inOut);
  const frAir = 0.55 + Math.sin((t - 15.8) * 2.2) * 0.22 * hunt;
  const frGround = 0.55 - Math.sin((t - 15.8) * 2.2) * 0.22 * hunt;
  const push = ramp(t, 25.6, 30.6, ease.inOut);
  const fourAir = 0.55 + 0.38 * push;
  const fourGround = 0.55 - 0.27 * push;
  const four = ramp(t, 25.5, 26.3);
  const frIn = ramp(t, 19.8, 20.5);
  return (
    <BlotReveal t={t} start={15.4} dur={0.8} cx={W / 2} cy={H / 2}>
      <PaperGround>
        <Camera x={keys(t, [[15.4, 0], [24.8, 0], [26.6, 480], [32, 520]], ease.inOut)} s={keys(t, [[15.4, 1.1], [18.5, 1.0], [24.8, 1.0], [26.6, 1.0]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={140}>
              <KeyTitle text="How much priority?" t={t} at={15.6} size={84} out={19.6} />
            </At>
            {/* France */}
            <AbsoluteFill style={{ ...recede(ramp(t, 25.6, 26.4) * 0.7), transformOrigin: "760px 560px" }}>
              <Fader x={640} y={540} h={420} level={frAir} p={ramp(t, 15.8, 16.4)} label="Air" />
              <Fader x={880} y={540} h={420} level={frGround} p={ramp(t, 16.0, 16.6)} label="Ground" color={C.ink} />
              <At x={760} y={230}>
                <div style={{ opacity: frIn }}>
                  <KeyTitle text="France" t={t} at={19.85} size={96} color={C.red} fill />
                </div>
              </At>
              <At x={760} y={905}>
                <Rise p={ramp(t, 20.9, 21.4)}>
                  <Tape p={1} size={34}>
                    Lighter
                  </Tape>
                </Rise>
              </At>
              <At x={760} y={975}>
                <Rise p={ramp(t, 22.2, 22.7)}>
                  <Label size={26} color={C.inkSoft} weight={600}>
                    Balanced emphasis
                  </Label>
                </Rise>
              </At>
            </AbsoluteFill>
            {/* UK, Germany, Italy, Spain */}
            <AbsoluteFill style={{ opacity: four }}>
              <Fader x={1360} y={540} h={420} level={fourAir} p={four} label="Air" />
              <Fader x={1600} y={540} h={420} level={fourGround} p={four} label="Ground" color={C.ink} />
              <At x={1480} y={230}>
                <Label size={34} color={C.ink} weight={600} style={{ letterSpacing: "0.3em" }}>
                  UK · Germany · Italy · Spain
                </Label>
              </At>
              <At x={1480} y={915}>
                <KeyTitle text="Air superiority" t={t} at={30.4} size={80} color={C.red} fill neon="red" />
              </At>
            </AbsoluteFill>
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* P04 31.9–38.2 "In 1985, France left the joint program and moved forward with its own aircraft." */
const SPLIT: Highlight[] = [
  ...FIVE.filter((h) => h.name !== "France").map((h) => ({ ...h, draw: [31.9, 32.1] as [number, number], fill: [31.9, 32.1] as [number, number], label: h.label ? { ...h.label, at: 31.9 } : undefined, dim: [33.6, 34.4] as [number, number] })),
  { ...FIVE[0], draw: [31.9, 32.1], fill: [31.9, 32.1], label: { text: "FRANCE", lon: 2.6, lat: 46.6, size: 84, at: 33.7 } },
];
export const P04Leaves: React.FC = () => {
  const t = useT();
  const lon = keys(t, [[31.9, 5], [33.6, 5], [35.5, 2.6]], ease.inOut);
  const lat = keys(t, [[31.9, 47], [35.5, 46.6]], ease.inOut);
  const z = keys(t, [[31.9, 1.0], [33.6, 1.0], [35.5, 1.45], [38.2, 1.52]], ease.inOut);
  return (
    <TearReveal t={t} start={31.9} dur={0.7} dir="rtl">
      <WorldMap t={t} view={viewAt(lon, lat, z)} highlights={SPLIT} />
      <At x={W / 2} y={H - 170}>
        <KeyTitle text="1985" t={t} at={32.6} size={170} fill neon="white" />
      </At>
      <At x={W / 2} y={140}>
        <Rise p={ramp(t, 36.7, 37.2)}>
          <Tape p={1} size={36} dark>
            Its own aircraft
          </Tape>
        </Rise>
      </At>
    </TearReveal>
  );
};

/* P05 38.1–45.6 carrier aviation requirement */
export const P05Carrier: React.FC = () => {
  const t = useT();
  const s = keys(t, [[38.1, 1.15], [41.2, 1.05]], ease.soft);
  const deck = ramp(t, 41.0, 41.7, ease.inOut);
  return (
    <BlotReveal t={t} start={38.1} dur={0.8} cx={W / 2} cy={H * 0.62}>
      <AbsoluteFill style={{ background: C.night }}>
        {/* Charles de Gaulle (R91): aerial three-quarter, then broadside with a Rafale M launching */}
        <Img src={staticFile("src-photos/cdg-2019.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s}) translateX(${keys(t, [[38.1, 30], [41.5, -20]], ease.soft)}px)`, filter: "contrast(1.05) saturate(0.8) sepia(0.1)" }} />
        <AbsoluteFill style={{ opacity: deck }}>
          <Img src={staticFile("src-photos/cdg-2016.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 62%", transform: `scale(${keys(t, [[41, 1.5], [45.6, 1.32]], ease.soft)})`, transformOrigin: "62% 62%", filter: "contrast(1.08) saturate(0.82) sepia(0.08)" }} />
        </AbsoluteFill>
        <PrintTexture opacity={0.25} />
        <Vignette strength={0.55} />
        <At x={W / 2} y={150}>
          <KeyTitle text="Requirement" t={t} at={39.7} size={90} out={41.0} />
        </At>
        <At x={W / 2} y={H - 150}>
          <KeyTitle text="French carrier aviation" t={t} at={43.7} size={90} />
        </At>
      </AbsoluteFill>
    </BlotReveal>
  );
};

/* P06 45.5–59.4 the Rafale family: C, B, M */
const FAMILY = [
  { key: "C", at: 50.1, src: "photos/rafale-landing.jpg", tag: "Single-seat · land", x: 380 },
  { key: "B", at: 53.9, src: "src-photos/rafale-india-takeoff.jpg", tag: "Two-seat", x: 960 },
  { key: "M", at: 55.5, src: "src-photos/rafale-m-flight.jpg", tag: "Carrier", x: 1540 },
];
export const P06Family: React.FC = () => {
  const t = useT();
  const board = ramp(t, 49.5, 50.1, ease.inOut);
  return (
    <TearReveal t={t} start={45.5} dur={0.7} dir="ltr">
      {/* real Rafale in flight while the narration names the family */}
      {board < 1 && <ClipFull src="rr-bank" t={t} from={45.5} to={50.2} clipDur={4} push={0.08} />}
      <AbsoluteFill style={{ opacity: board }}>
      <PaperGround>
        <Camera s={keys(t, [[49.5, 1.04], [51, 1.0], [59.4, 1.03]], ease.soft)} x={keys(t, [[49.8, -100], [53.6, 0], [55.5, 90], [59.4, 0]], ease.inOut)}>
          <Layer>
            <At x={W / 2} y={150}>
              <KeyTitle text="The Rafale family" t={t} at={49.5} size={96} />
            </At>
            {FAMILY.map((f, i) => {
              const r = ramp(t, f.at - 0.15, f.at + 0.45);
              const next = FAMILY[i + 1];
              const back = next ? ramp(t, next.at, next.at + 0.5) * (1 - ramp(t, 57.2, 57.8)) * 0.6 : 0;
              return (
                <AbsoluteFill key={f.key} style={{ ...recede(back, 4, 0.4, 0.05), transformOrigin: `${f.x}px 560px` }}>
                  <Photo src={f.src} x={f.x} y={580} w={560} h={373} rot={[-3, 1.5, 3][i]} reveal={r} revealFrom="bottom" seed={"fam" + f.key} zoom={1.15} />
                  <At x={f.x - 215} y={340}>
                    <div style={{ opacity: r }}>
                      <KeyTitle text={f.key} t={t} at={f.at} size={140} color={C.red} fill neon="red" />
                    </div>
                  </At>
                  <At x={f.x} y={825}>
                    <Rise p={ramp(t, f.at + 0.3, f.at + 0.8)}>
                      <Tape p={1} size={34} dark={i === 1}>
                        {f.tag}
                      </Tape>
                    </Rise>
                  </At>
                </AbsoluteFill>
              );
            })}
          </Layer>
        </Camera>
      </PaperGround>
      </AbsoluteFill>
      {board < 1 && (
        <At x={W / 2} y={H - 150}>
          <div style={{ opacity: 1 - board }}>
            <KeyTitle text="The Rafale family" t={t} at={47.9} size={100} neon="white" />
          </div>
        </At>
      )}
    </TearReveal>
  );
};

/* P07 59.3–71.4 entry into service. One long timeline; the camera glides along it. Years stay
 * white on the axis; each milestone grows a dotted stem to a round photo. */
const YX = (year: number) => 200 + (year - 2001) * 460;
const AXIS_Y = 560;
const MARKS = [
  { year: 2004, at: 61.2, src: "src-photos/rafale-m-flight.jpg", pos: "50% 50%", zoom: 1.25, tag: "Rafale · French Navy", up: true },
  { year: 2006, at: 64.2, src: "photos/rafale-landing.jpg", pos: "58% 58%", zoom: 1.5, tag: "Rafale · French Air Force", up: false },
  { year: 2003, at: 69.6, src: "src-photos/typhoon-front.jpg", pos: "50% 45%", zoom: 1.3, tag: "Typhoon · RAF", up: false },
];
export const P07Service: React.FC = () => {
  const t = useT();
  const axis = ramp(t, 59.3, 60.3, ease.out);
  const fx = keys(t, [[59.3, YX(2003.0)], [60.9, YX(2004.2)], [63.4, YX(2004.4)], [64.4, YX(2005.7)], [68.6, YX(2005.6)], [69.8, YX(2004.7)], [71.4, YX(2004.7)]], ease.inOut);
  const s = keys(t, [[59.3, 0.86], [61.5, 1.0], [64.0, 1.0], [64.8, 1.04], [68.6, 1.04], [69.8, 0.8], [71.4, 0.78]], ease.inOut);
  const D = 290;
  return (
    <BlotReveal t={t} start={59.3} dur={0.8} cx={W / 2} cy={H / 2}>
      <PaperGround>
        <AbsoluteFill style={{ transform: `translate(${W / 2}px, ${AXIS_Y}px) scale(${s}) translate(${-fx}px, ${-AXIS_Y}px)`, transformOrigin: "0 0" }}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
            <line x1={YX(2000.4)} y1={AXIS_Y} x2={YX(2000.4) + (YX(2008.6) - YX(2000.4)) * axis} y2={AXIS_Y} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
            {Array.from({ length: 8 }, (_, i) => 2001 + i).map((y) => {
              const vis = ramp(axis, (YX(y) - YX(2000.4)) / (YX(2008.6) - YX(2000.4)) - 0.02, (YX(y) - YX(2000.4)) / (YX(2008.6) - YX(2000.4)) + 0.05);
              const m = MARKS.find((q) => q.year === y);
              const on = m ? ramp(t, m.at - 0.2, m.at + 0.3) : 0;
              return (
                <g key={y} opacity={vis}>
                  <line x1={YX(y)} y1={AXIS_Y - 16} x2={YX(y)} y2={AXIS_Y + 16} stroke={C.ink} strokeWidth={3} />
                  <circle cx={YX(y)} cy={AXIS_Y} r={on * 11} fill={C.ink} />
                  <text
                    x={YX(y)}
                    y={m && !m.up ? AXIS_Y - 34 : AXIS_Y + 56}
                    textAnchor="middle"
                    fontFamily="Anton, 'Bebas Neue', sans-serif"
                    fontSize={34 + on * 34}
                    fill={C.ink}
                    opacity={0.62 + on * 0.38}
                    style={{ filter: on > 0 ? `drop-shadow(0 0 ${on * 10}px rgba(255,246,228,0.45))` : undefined }}
                  >
                    {y}
                  </text>
                </g>
              );
            })}
            {MARKS.map((m) => {
              const stem = ramp(t, m.at - 0.1, m.at + 0.45, ease.inOut);
              const y0 = m.up ? AXIS_Y - 70 : AXIS_Y + 70;
              const y1 = m.up ? AXIS_Y - 230 : AXIS_Y + 230;
              return stem > 0 ? <line key={m.year} x1={YX(m.year)} y1={y0} x2={YX(m.year)} y2={y0 + (y1 - y0) * stem} stroke={C.ink} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" /> : null;
            })}
          </svg>
          {MARKS.map((m, i) => {
            const cy = m.up ? AXIS_Y - 230 - D / 2 : AXIS_Y + 230 + D / 2;
            const p = springIn(t, m.at + 0.3, 0.9);
            return (
              <React.Fragment key={m.year}>
                <CirclePhoto src={m.src} x={YX(m.year)} y={cy} d={D} p={p} pos={m.pos} zoom={m.zoom} />
                <At x={YX(m.year) + D / 2 + 30} y={cy} anchor="left">
                  <Rise p={ramp(t, m.at + 0.6, m.at + 1.1)}>
                    <Tape p={1} size={30} dark={i === 2}>
                      {m.tag}
                    </Tape>
                  </Rise>
                </At>
              </React.Fragment>
            );
          })}
        </AbsoluteFill>
      </PaperGround>
    </BlotReveal>
  );
};

/* P08 71.3–79.5 Typhoon: air defence first, ground attack added progressively. */
export const P08Progressive: React.FC = () => {
  const t = useT();
  const steps = [76.85, 77.4, 78.1];
  const stepN = steps.filter((s) => t >= s).length;
  return (
    <TearReveal t={t} start={71.3} dur={0.7} dir="btt">
      <PaperGround>
        <Camera s={keys(t, [[71.3, 1.05], [79.5, 1.0]], ease.soft)}>
          <Layer>
            <Blueprint view="typhoonUnder" x={620} y={500} width={860} p={ramp(t, 71.5, 73.4, ease.linear)} redP={ramp(t, 76.8, 78.6, ease.linear)} lineWidth={2} label="Typhoon" />
            <div style={{ position: "absolute", left: 1150, top: 330 }}>
              <div style={{ opacity: ramp(t, 73.8, 74.3) }}>
                <Label size={28} color={C.inkSoft} weight={600}>
                  Air defence
                </Label>
                <div style={{ width: 600 * ease.out(ramp(t, 74.0, 74.9)), height: 46, background: C.ink, marginTop: 10, filter: "url(#ink)" }} />
              </div>
              <div style={{ opacity: ramp(t, 75.2, 75.7), marginTop: 50 }}>
                <Label size={28} color={C.inkSoft} weight={600}>
                  Ground attack
                </Label>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 190, height: 46, background: i < stepN ? C.red : "transparent", border: `2px solid ${C.red}`, transform: `scaleX(${i < stepN ? springIn(t, steps[i], 0.6) : 1})`, transformOrigin: "left", filter: "url(#ink)" }} />
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 30, opacity: ramp(t, 77.4, 77.9) }}>
                <Tape p={1} size={30} dark>
                  Expanded over time
                </Tape>
              </div>
            </div>
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* P09 79.4–91.5 not "exclusively" one or the other */
export const P09NotExclusive: React.FC = () => {
  const t = useT();
  return (
    <BlotReveal t={t} start={79.4} dur={0.8} cx={W / 2} cy={H / 2}>
      <PaperGround>
        <Camera s={keys(t, [[79.4, 1.06], [91.5, 1.0]], ease.soft)}>
          <Layer depth={0.9}>
            <AbsoluteFill style={{ ...recede(ramp(t, 84.9, 85.6) * 0.8), transformOrigin: "960px 540px" }}>
              <Blueprint view="typhoonTop" x={520} y={500} width={700} p={ramp(t, 79.6, 81.8, ease.linear)} lineWidth={2} label="Typhoon" />
              <Blueprint view="rafaleTop" x={1400} y={500} width={640} p={ramp(t, 80.0, 82.2, ease.linear)} lineWidth={2} label="Rafale" />
            </AbsoluteFill>
          </Layer>
          <Layer>
            <At x={W / 2} y={300}>
              <KeyTitle text="Exclusively" t={t} at={85.2} size={150} />
            </At>
            <Strike x1={W / 2 - 420} x2={W / 2 + 420} y={300} p={ramp(t, 88.4, 88.9)} width={14} />
            <At x={W / 2} y={780}>
              <div style={{ display: "flex", gap: 30 }}>
                <Tape p={ramp(t, 86.3, 86.8)} size={36}>
                  Air combat
                </Tape>
                <Tape p={ramp(t, 89.7, 90.2)} size={36} dark>
                  Multirole
                </Tape>
              </div>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

