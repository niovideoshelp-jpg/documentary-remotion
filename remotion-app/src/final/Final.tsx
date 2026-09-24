import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture } from "../components/Paper";
import { At, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { KeyTitle } from "../components/AnimeText";
import { HandArrow, HandCircle, HandNote, HandUnder, Ink, MARKER, MARKER_RED, PhotoStage } from "../components/Annot";
import { PartShell, coverPt, type SceneDef } from "../components/Shell";
import { DrawIcon, IconCard } from "../components/Icons";
import { Exploded, type Part } from "../components/Exploded";
import { WorldMap, viewAt } from "../map/WorldMap";
import { PLACES, project } from "../map/projection";
import type { Cue } from "../Sound";
import { C, W, H } from "../lib/theme";
import { ease, keys, ramp, useT } from "../lib/time";

/* Final — the author's own reading. Narration: audio/final.mp3 (158.6 s).
 * No 3D: photos with hand-drawn annotation and maps. */
export const FINAL_FRAMES = 4790;

const toScreen = (lon: number, lat: number, v: { cx: number; cy: number; z: number }): [number, number] => {
  const [x, y] = project(lon, lat);
  return [(x - v.cx) * v.z + W / 2, (y - v.cy) * v.z + H / 2];
};

/* T01 0–25.1 "if I were a country outside the Eurofighter program, I'd lean toward the Rafale";
 * the F3R: AESA radar, Meteor, SPECTRA, broad integrated weapons. */
const T01: React.FC = () => {
  const t = useT();
  // rafale-landing.jpg 3404×2266, pos 58% 58%
  const P = (u: number, v: number) => coverPt(u, v, 3404, 2266, 0.58, 0.58);
  const [rx, ry] = P(0.25, 0.535);
  const [ax, ay] = P(0.55, 0.52);
  const list = [
    { at: 16.8, text: "AESA radar", icon: "aesa" },
    { at: 18.4, text: "Meteor", icon: "missile" },
    { at: 19.2, text: "SPECTRA", icon: "shield" },
    { at: 20.4, text: "Integrated weapons", icon: "bomb" },
  ] as const;
  const listOn = ramp(t, 13.4, 14.0);
  return (
    <AbsoluteFill>
      <PhotoStage src="photos/rafale-landing.jpg" t={t} t0={0} t1={25.1} pos="58% 58%" z0={1.0} z1={1.1} dim={0.12 + listOn * 0.4}>
        <HandNote x={120} y={170} p={ramp(t, 0.6, 1.8) * (1 - listOn)} size={52} color="#e8e1d2">
          within the limits of this comparison
        </HandNote>
        <HandNote x={120} y={260} p={ramp(t, 6.1, 7.3) * (1 - listOn)} size={58}>
          a buyer outside the Eurofighter program
        </HandNote>
        <Ink>
          <HandCircle cx={ax} cy={ay} rx={760} ry={220} p={ramp(t, 8.9, 9.8) * (1 - listOn)} seed="pick" />
          <HandCircle cx={rx} cy={ry} rx={110} ry={62} p={ramp(t, 16.7, 17.4)} seed="aesa" />
          <HandArrow x1={rx + 120} y1={ry - 150} x2={rx + 20} y2={ry - 60} p={ramp(t, 16.9, 17.5)} seed="aesaA" color={MARKER_RED} />
        </Ink>
        <HandNote x={ax + 250} y={ay + 250} p={ramp(t, 9.2, 10.0) * (1 - listOn)} size={70} color="#ffd3c8">
          my pick: Rafale
        </HandNote>
        <HandNote x={ax - 200} y={ay + 330} p={ramp(t, 10.7, 11.9) * (1 - listOn)} size={48}>
          not only for the aircraft itself
        </HandNote>
      </PhotoStage>
      {list.map((k, i) => (
        <IconCard key={k.text} name={k.icon} x={1180 + (i % 2) * 340} y={330 + Math.floor(i / 2) * 340} w={310} h={310} p={ramp(t, k.at - 0.25, k.at + 0.9)} label={k.text} />
      ))}
      <At x={W / 2} y={H - 120}>
        <div style={{ opacity: listOn }}>
          <KeyTitle text="Rafale F3R" t={t} at={13.7} size={96} neon="white" out={22.3} />
        </div>
      </At>
      <At x={W / 2} y={H - 120}>
        <Rise p={ramp(t, 22.6, 23.1)}>
          <Tape p={1} size={36} dark>
            and one more point
          </Tape>
        </Rise>
      </At>
    </AbsoluteFill>
  );
};

/* T02 24.8–52.0 one country (France) vs a program split between four governments. */
const T02: React.FC = () => {
  const t = useT();
  const view = viewAt(keys(t, [[24.8, 2.6], [41.8, 2.8], [43.4, 6], [52, 6]], ease.inOut), keys(t, [[24.8, 46.6], [41.8, 46.8], [43.4, 47], [52, 47]], ease.inOut), keys(t, [[24.8, 1.6], [41.8, 1.8], [43.4, 1.0], [52, 1.04]], ease.inOut));
  const [px, py] = toScreen(2.35, 48.86, view);
  const pt = (k: keyof typeof PLACES) => toScreen(PLACES[k][0], PLACES[k][1], view);
  const four = ramp(t, 42.6, 43.3);
  const [bx, by] = pt("berlin");
  const others = (["london", "rome", "madrid", "paris"] as const).slice(0, 3);
  return (
    <TearReveal t={t} start={24.8} dur={0.7} dir="ltr">
      <WorldMap
        t={t}
        view={view}
        highlights={[
          { name: "France", draw: [26.0, 26.5], fill: [26.2, 26.9], dim: [43.0, 43.6] },
          { name: "United Kingdom", draw: [44.6, 45.0], fill: [44.8, 45.3] },
          { name: "Germany", draw: [45.7, 46.1], fill: [45.9, 46.4] },
          { name: "Italy", draw: [46.3, 46.7], fill: [46.5, 47.0] },
          { name: "Spain", draw: [46.8, 47.2], fill: [47.0, 47.5] },
        ]}
      />
      <AbsoluteFill style={{ opacity: 1 - four }}>
        <HandNote x={px + 190} y={py - 170} p={ramp(t, 29.8, 30.8)} size={56}>
          decisions
        </HandNote>
        <HandNote x={px + 230} y={py - 70} p={ramp(t, 30.9, 32.0)} size={56}>
          industrial infrastructure
        </HandNote>
        <HandNote x={px + 250} y={py + 30} p={ramp(t, 32.5, 33.6)} size={56}>
          technologies
        </HandNote>
        <Ink>
          <HandCircle cx={px - 40} cy={py + 120} rx={230} ry={200} p={ramp(t, 39.9, 40.8)} seed="fr" color={MARKER} />
        </Ink>
        <HandNote x={px - 240} y={py + 380} p={ramp(t, 40.3, 41.3)} size={58} color="#ffd3c8">
          one country · simpler
        </HandNote>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: four }}>
        <Ink>
          {others.map((k, i) => {
            const [x, y] = pt(k);
            return <HandArrow key={k} x1={bx} y1={by} x2={x + (bx - x) * 0.12} y2={y + (by - y) * 0.12} p={ramp(t, 49.4 + i * 0.3, 50.2 + i * 0.3)} seed={"p" + k} color={MARKER_RED} bow={0.12} />;
          })}
        </Ink>
        <HandNote x={bx + 50} y={by + 70} p={ramp(t, 48.2, 49.2)} size={50} color="#ffd3c8">
          one partner’s decision
        </HandNote>
        <At x={W / 2} y={110}>
          <KeyTitle text="A program split four ways" t={t} at={43.3} size={80} />
        </At>
      </AbsoluteFill>
    </TearReveal>
  );
};

/* T03 51.8–92.0 inside Europe: production spread across the partners — each makes specific parts. */
const SITES = [
  { name: "Warton", lon: -2.88, lat: 53.74, part: "front fuselage", at: 62.3, dx: 40, dy: 50 },
  { name: "Manching", lon: 11.53, lat: 48.72, part: "centre fuselage", at: 62.8, dx: 40, dy: -50 },
  { name: "Turin", lon: 7.65, lat: 45.19, part: "left wing", at: 63.3, dx: 40, dy: 50 },
  { name: "Getafe", lon: -3.72, lat: 40.3, part: "right wing", at: 63.8, dx: 40, dy: -80 },
];
// Typhoon top view, nose left: port (left) wing is the lower half of the drawing
const WORKSHARE: Part[] = [
  { key: "front", poly: [[0, 0], [0.36, 0], [0.36, 1], [0, 1]], dx: -150, dy: 0, tint: "#8fb3d9", label: "United Kingdom", sub: "front fuselage · Warton", ly: -40, lx: -40, at: 85.6 },
  { key: "centre", poly: [[0.36, 0.41], [0.72, 0.41], [0.72, 0.59], [0.36, 0.59]], dx: 0, dy: 0, tint: "#e0b04a", label: "Germany", sub: "centre fuselage · Manching", ly: 0, at: 85.85 },
  { key: "right", poly: [[0.36, 0], [1, 0], [1, 0.41], [0.36, 0.41]], dx: 50, dy: -110, tint: "#e0624e", label: "Spain", sub: "right wing · Getafe", ly: -20, lx: 60, at: 86.1 },
  { key: "left", poly: [[0.36, 0.59], [1, 0.59], [1, 1], [0.36, 1]], dx: 50, dy: 110, tint: "#7fbf8a", label: "Italy", sub: "left wing · Turin", ly: 20, lx: 60, at: 86.35 },
  { key: "rear", poly: [[0.72, 0.41], [1, 0.41], [1, 0.59], [0.72, 0.59]], dx: 130, dy: 0 },
];
const T03: React.FC = () => {
  const t = useT();
  const view = viewAt(keys(t, [[51.8, 4], [91.8, 4.5]], ease.inOut), keys(t, [[51.8, 47.5], [91.8, 47.5]], ease.inOut), keys(t, [[51.8, 0.8], [62, 0.85], [91.8, 0.88]], ease.inOut));
  const board = ramp(t, 77.6, 78.2, ease.inOut);
  const tapes = [
    { at: 66.9, text: "Factories", icon: "factory" },
    { at: 67.9, text: "Suppliers", icon: "gear" },
    { at: 68.8, text: "Expertise", icon: "chip" },
    { at: 70.2, text: "Jobs", icon: "people" },
  ] as const;
  return (
    <BlotReveal t={t} start={51.8} dur={0.8} cx={W / 2} cy={H / 2}>
      <WorldMap
        t={t}
        view={view}
        highlights={[
          { name: "United Kingdom", draw: [52.0, 52.2], fill: [52.0, 52.3] },
          { name: "Germany", draw: [52.0, 52.2], fill: [52.0, 52.3] },
          { name: "Italy", draw: [52.0, 52.2], fill: [52.0, 52.3] },
          { name: "Spain", draw: [52.0, 52.2], fill: [52.0, 52.3] },
        ]}
      />
      <At x={W / 2} y={110}>
        <KeyTitle text="Inside Europe" t={t} at={52.3} size={96} neon="white" out={61.6} />
      </At>
      <At x={W / 2} y={110}>
        <KeyTitle text="Production shared" t={t} at={62.0} size={86} />
      </At>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {SITES.map((s) => {
          const [x, y] = toScreen(s.lon, s.lat, view);
          return <DrawIcon key={s.name} name="factory" x={x} y={y - 10} size={64} p={ramp(t, s.at, s.at + 0.8)} />;
        })}
      </svg>
      {SITES.map((s) => {
        const [x, y] = toScreen(s.lon, s.lat, view);
        return (
          <React.Fragment key={s.name}>
            <HandNote x={x + s.dx} y={y + s.dy} p={ramp(t, s.at + 0.2, s.at + 0.9)} size={46}>
              {s.name}
            </HandNote>
          </React.Fragment>
        );
      })}
      <AbsoluteFill style={{ opacity: 1 - board }}>
        {tapes.map((k, i) => (
          <IconCard key={k.text} name={k.icon} x={260 + (i % 2) * 270} y={420 + Math.floor(i / 2) * 270} w={240} h={240} p={ramp(t, k.at - 0.25, k.at + 0.8)} label={k.text} />
        ))}
      </AbsoluteFill>
      {board > 0 && (
        <AbsoluteFill style={{ opacity: board }}>
          <PaperGround dark>
            <Exploded t={t} view="typhoonTop" x={W / 2} y={560} width={1060} draw={ramp(t, 77.9, 80.4, ease.linear)} explode={ramp(t, 84.4, 85.8)} parts={WORKSHARE} />
            <At x={W / 2} y={110}>
              <KeyTitle text="Each partner, specific parts" t={t} at={84.5} size={76} />
            </At>
            <At x={W / 2} y={110}>
              <KeyTitle text="Not every part everywhere" t={t} at={79.0} size={76} out={84.2} />
            </At>
            <At x={W / 2} y={1000}>
              <Rise p={ramp(t, 88.3, 88.8)}>
                <Tape p={1} size={32} dark>
                  A larger European industrial structure
                </Tape>
              </Rise>
            </At>
          </PaperGround>
        </AbsoluteFill>
      )}
    </BlotReveal>
  );
};

/* T04 91.8–104.2 a shared industrial program connecting Europe's largest military economies. */
const T04: React.FC = () => {
  const t = useT();
  return (
    <TearReveal t={t} start={91.8} dur={0.7} dir="rtl">
      <PhotoStage src="src-photos/typhoon-pair.jpg" t={t} t0={91.8} t1={104.2} pos="50% 50%" z0={1.04} z1={1.14} dim={0.2}>
        <HandNote x={W / 2} y={200} p={ramp(t, 99.3, 100.5)} size={70} anchor="center">
          a shared industrial program
        </HandNote>
      </PhotoStage>
      <At x={W / 2} y={H - 160}>
        <KeyTitle text="European defence cooperation" t={t} at={92.4} size={80} neon="white" />
      </At>
      <At x={W / 2} y={H - 70}>
        <Rise p={ramp(t, 95.2, 95.7)}>
          <Tape p={1} size={32}>
            Typhoon · fits extremely well
          </Tape>
        </Rise>
      </At>
    </TearReveal>
  );
};

/* T05 104.0–119.3 for an outside buyer: simpler to manage, less fragmentation, radar advantage. */
const T05: React.FC = () => {
  const t = useT();
  // rafale-qatar.jpg 1920×1280, pos 45% 60%
  const [nx, ny] = coverPt(0.12, 0.53, 1920, 1280, 0.45, 0.6);
  return (
    <BlotReveal t={t} start={104.0} dur={0.8} cx={W / 2} cy={H / 2}>
      <PhotoStage src="src-photos/rafale-qatar.jpg" t={t} t0={104} t1={119.3} pos="45% 60%" z0={1.02} z1={1.1} dim={0.2}>
        <HandNote x={120} y={180} p={ramp(t, 104.4, 105.6)} size={54} color="#e8e1d2">
          a buyer outside that structure
        </HandNote>
        <HandNote x={1100} y={260} p={ramp(t, 107.4, 108.6)} size={62}>
          simpler to manage
        </HandNote>
        <HandNote x={1100} y={360} p={ramp(t, 109.7, 110.9)} size={54}>
          less political fragmentation
        </HandNote>
        <Ink>
          <HandCircle cx={nx + 30} cy={ny} rx={120} ry={70} p={ramp(t, 118.2, 118.9)} seed="radar2" />
        </Ink>
        <HandNote x={nx - 40} y={ny - 130} p={ramp(t, 118.4, 119.2)} size={56} color="#ffd3c8">
          radar
        </HandNote>
      </PhotoStage>
      <At x={W / 2} y={H - 120}>
        <Rise p={ramp(t, 115.5, 116.0)}>
          <Tape p={1} size={34} dark>
            Important technical advantages
          </Tape>
        </Rise>
      </At>
    </BlotReveal>
  );
};

/* T06 119.1–138.9 my view: Typhoon makes sense for Europe; for an outside buyer, the Rafale weighs more. */
const T06: React.FC = () => {
  const t = useT();
  const right = ramp(t, 127.7, 128.4, ease.inOut);
  const half = (src: string, pos: string, left: boolean, focus: number) => (
    <AbsoluteFill style={{ clipPath: left ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}>
      <AbsoluteFill style={{ left: left ? "-25%" : "25%", filter: `brightness(${0.45 + 0.55 * focus}) blur(${(1 - focus) * 4}px)` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1.14 + ramp(t, 119, 139, (x) => x) * 0.06})`, filter: "contrast(1.05) saturate(0.82) sepia(0.08)" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
  const ticks = [
    { at: 131.5, text: "combat capability" },
    { at: 133.1, text: "modernization" },
    { at: 134.1, text: "supplier relationship" },
  ];
  return (
    <TearReveal t={t} start={119.1} dur={0.7} dir="ltr">
      <AbsoluteFill style={{ background: C.night }}>
        {half("src-photos/typhoon-leuchars.jpg", "50% 55%", true, 1 - right * 0.6)}
        {half("photos/rafale-landing.jpg", "58% 58%", false, 0.4 + right * 0.6)}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, marginLeft: -2, background: C.offWhite, opacity: 0.9 }} />
        <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,6,6,0.65) 0%, rgba(6,6,6,0) 40%)" }} />
        <PrintTexture opacity={0.18} />
      </AbsoluteFill>
      <HandNote x={W / 4} y={200} p={ramp(t, 121.6, 122.8)} size={52} anchor="center">
        Europe’s defence & industry
      </HandNote>
      <HandNote x={W / 4} y={290} p={ramp(t, 125.6, 126.8)} size={60} anchor="center" color="#ffd3c8">
        makes sense
      </HandNote>
      <HandNote x={(W * 3) / 4} y={200} p={ramp(t, 129.6, 130.6)} size={52} anchor="center">
        an outside buyer
      </HandNote>
      {ticks.map((k, i) => (
        <HandNote key={k.text} x={W / 2 + 120} y={320 + i * 90} p={ramp(t, k.at, k.at + 0.8)} size={48}>
          {k.text}
        </HandNote>
      ))}
      <At x={W / 4} y={H - 110}>
        <KeyTitle text="Typhoon" t={t} at={125.6} size={90} />
      </At>
      <At x={(W * 3) / 4} y={H - 110}>
        <KeyTitle text="Rafale" t={t} at={135.8} size={90} neon="red" color="#ffb4a6" />
      </At>
      <Ink>
        <HandUnder x1={W * 0.75 - 170} x2={W * 0.75 + 170} y={H - 50} p={ramp(t, 136.6, 137.4)} />
      </Ink>
    </TearReveal>
  );
};

/* T07 138.7–end my own reading; now your opinion; sources in the description. */
const T07: React.FC = () => {
  const t = useT();
  const ask = ramp(t, 147.0, 147.6);
  const end = ramp(t, 157.9, 158.6);
  return (
    <BlotReveal t={t} start={138.7} dur={0.8} cx={W / 2} cy={H / 2}>
      <PaperGround dark>
        <Camera s={keys(t, [[138.7, 1.06], [158.6, 1.0]], ease.soft)}>
          <Layer>
            <AbsoluteFill style={{ opacity: 1 - ask }}>
              <At x={W / 2} y={420}>
                <KeyTitle text="Just my own reading" t={t} at={139.2} size={110} neon="white" />
              </At>
              <HandNote x={W / 2} y={580} p={ramp(t, 140.6, 141.8)} size={60} anchor="center" color="#ffd3c8">
                not a military analyst
              </HandNote>
              <HandNote x={W / 2} y={700} p={ramp(t, 143.2, 145.6)} size={52} anchor="center" color="#e8e1d2">
                someone who follows this closely
              </HandNote>
            </AbsoluteFill>
            <AbsoluteFill style={{ opacity: ask }}>
              {[
                { src: "photos/rafale-landing.jpg", pos: "58% 58%", x: 560, name: "Rafale", at: 148.9 },
                { src: "src-photos/typhoon-leuchars.jpg", pos: "50% 55%", x: 1360, name: "Typhoon", at: 149.4 },
              ].map((k) => (
                <React.Fragment key={k.name}>
                  <div style={{ position: "absolute", left: k.x - 320, top: 250, width: 640, height: 400, overflow: "hidden", border: "10px solid #f3eee2", boxShadow: "0 20px 40px rgba(0,0,0,0.55)", opacity: ramp(t, k.at - 0.4, k.at), transform: `rotate(${k.x < W / 2 ? -2 : 2}deg)` }}>
                    <Img src={staticFile(k.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: k.pos, filter: "contrast(1.05) saturate(0.82) sepia(0.08)" }} />
                  </div>
                  <At x={k.x} y={720}>
                    <KeyTitle text={k.name} t={t} at={k.at} size={80} />
                  </At>
                </React.Fragment>
              ))}
              <At x={W / 2} y={150}>
                <KeyTitle text="Which one would you choose?" t={t} at={147.6} size={86} neon="white" />
              </At>
              <HandNote x={W / 2} y={470} p={ramp(t, 152.8, 153.5)} size={140} anchor="center" rot={0}>
                ?
              </HandNote>
              <At x={W / 2} y={900}>
                <Rise p={ramp(t, 154.4, 154.9)}>
                  <Tape p={1} size={36} dark>
                    Sources in the description
                  </Tape>
                </Rise>
              </At>
            </AbsoluteFill>
          </Layer>
        </Camera>
        <AbsoluteFill style={{ background: C.night, opacity: end }} />
      </PaperGround>
    </BlotReveal>
  );
};

const SCENES: SceneDef[] = [
  { id: "T01 my pick", from: 0, to: 25.5, C: T01 },
  { id: "T02 one vs four", from: 24.8, to: 52.4, C: T02 },
  { id: "T03 production", from: 51.8, to: 92.4, C: T03 },
  { id: "T04 cooperation", from: 91.8, to: 104.6, C: T04 },
  { id: "T05 outside buyer", from: 104.0, to: 119.7, C: T05 },
  { id: "T06 summary", from: 119.1, to: 139.3, C: T06 },
  { id: "T07 your turn", from: 138.7, to: 160, C: T07 },
];

const CUES: Cue[] = [
  [0.6, "marker-1", 0.1], [6.1, "marker-1", 0.1], [8.9, "marker-2", 0.14], [13.6, "whoosh-1", 0.1], [16.8, "marker-2", 0.1], [18.4, "marker-1", 0.08], [19.2, "marker-1", 0.08], [20.4, "marker-1", 0.08],
  [25.15, "whoosh-2", 0.18], [26.2, "liquid-1", 0.1], [29.8, "marker-1", 0.08], [30.9, "marker-1", 0.08], [32.5, "marker-1", 0.08], [39.9, "marker-2", 0.12], [43.0, "whoosh-1", 0.1], [44.8, "ping-1", 0.08], [45.9, "ping-2", 0.08], [46.5, "ping-1", 0.08], [47.0, "ping-2", 0.08], [49.4, "pencil", 0.1, 1.5],
  [52.2, "whoosh-3", 0.18], [62.3, "pencil", 0.1, 2.0], [66.9, "tape-1", 0.08], [67.9, "tape-2", 0.08], [68.8, "tape-3", 0.08], [70.2, "tape-1", 0.08], [74.1, "pencil", 0.08, 1.2], [85.6, "marker-1", 0.08],
  [92.15, "whoosh-2", 0.18], [99.3, "marker-1", 0.1],
  [104.4, "whoosh-1", 0.18], [107.4, "marker-1", 0.08], [109.7, "marker-1", 0.08], [118.2, "marker-2", 0.12],
  [119.45, "whoosh-3", 0.18], [121.6, "marker-1", 0.08], [129.6, "marker-1", 0.08], [131.5, "marker-1", 0.08], [133.1, "marker-1", 0.08], [134.1, "marker-1", 0.08], [136.6, "marker-2", 0.12],
  [139.1, "whoosh-1", 0.18], [147.2, "whoosh-3", 0.1], [150.5, "slide-1", 0.1], [151.3, "slide-2", 0.1], [154.4, "tape-1", 0.08],
];

export const Final: React.FC = () => <PartShell audio="audio/final.mp3" scenes={SCENES} cues={CUES} />;
