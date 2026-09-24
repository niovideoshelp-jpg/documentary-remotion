import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture } from "../components/Paper";
import { At, Label, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { DrawPath } from "../components/Draw";
import { KeyTitle, springIn } from "../components/AnimeText";
import { HandArrow, HandCircle, HandNote, HandUnder, Ink, MARKER, MARKER_RED, PhotoStage } from "../components/Annot";
import { PartShell, coverPt, type SceneDef } from "../components/Shell";
import { WorldMap, viewAt, type Highlight } from "../map/WorldMap";
import { PLACES, project } from "../map/projection";
import type { Cue } from "../Sound";
import { C, F, W, H } from "../lib/theme";
import { ease, keys, ramp, useT } from "../lib/time";

/* Part 4 — buying one: exports, cost, buyer independence, modernization.
 * Narration: audio/part4.mp3 (207.7 s). No 3D: photos with hand-drawn annotation, maps, boards. */
export const PART4_FRAMES = 6260;

const toScreen = (lon: number, lat: number, v: { cx: number; cy: number; z: number }): [number, number] => {
  const [x, y] = project(lon, lat);
  return [(x - v.cx) * v.z + W / 2, (y - v.cy) * v.z + H / 2];
};

/** Two photos side by side, each on half the frame. */
const Split: React.FC<{ t: number; a: string; b: string; apos?: string; bpos?: string; t0: number; t1: number; dim?: number }> = ({ t, a, b, apos = "50% 50%", bpos = "50% 50%", t0, t1, dim = 0 }) => {
  const k = ramp(t, t0, t1, (x) => x);
  const half = (src: string, pos: string, left: boolean) => (
    <AbsoluteFill style={{ clipPath: left ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}>
      <AbsoluteFill style={{ left: left ? "-25%" : "25%" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1.12 + k * 0.06})`, filter: "contrast(1.05) saturate(0.82) sepia(0.08)" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: C.night }}>
      {half(a, apos, true)}
      {half(b, bpos, false)}
      <AbsoluteFill style={{ background: `rgba(10,10,10,${dim})` }} />
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, marginLeft: -2, background: C.offWhite, opacity: 0.9 }} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,6,6,0.6) 0%, rgba(6,6,6,0) 34%)" }} />
      <PrintTexture opacity={0.18} />
    </AbsoluteFill>
  );
};

/* S01 0–16.6 what they can do vs what a buyer asks: cost, support network, independence. */
const S01: React.FC = () => {
  const t = useT();
  const board = ramp(t, 5.0, 5.6, ease.inOut);
  const land = springIn(t, 5.4, 1.0);
  const stamp = ramp(t, 15.3, 15.7);
  const qs = [
    { at: 10.0, q: "Cost?", x: 520, rot: -4 },
    { at: 11.6, q: "Support network?", x: 960, rot: 2 },
    { at: 13.0, q: "Independence?", x: 1400, rot: -1.5 },
  ];
  return (
    <AbsoluteFill>
      <Split t={t} a="photos/rafale-landing.jpg" apos="58% 58%" b="src-photos/typhoon-leuchars.jpg" bpos="50% 55%" t0={0} t1={5.6} dim={0.15} />
      <HandNote x={W / 2} y={200} p={ramp(t, 1.6, 2.6)} size={72} anchor="center">
        what they can do
      </HandNote>
      {board > 0 && (
        <AbsoluteFill style={{ opacity: board }}>
          <PaperGround>
            <Camera s={keys(t, [[5, 1.08], [9.4, 1.0], [16.6, 1.03]], ease.soft)}>
              <Layer>
                <div style={{ position: "absolute", left: W / 2 - 520, top: 200, width: 1040, height: 320, background: "#b89b6c", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", transform: `translateY(${(1 - land) * -500}px) rotate(${(1 - land) * -8 - 1}deg)` }}>
                  <PrintTexture opacity={0.5} />
                  <div style={{ position: "absolute", left: 60, top: 70, fontFamily: F.label, fontWeight: 700, fontSize: 30, letterSpacing: "0.3em", color: "#3a2e1c" }}>FIGHTER PURCHASE</div>
                  <div style={{ position: "absolute", left: 60, top: 130, width: 520, height: 12, background: "rgba(58,46,28,0.35)" }} />
                  <div style={{ position: "absolute", left: 60, top: 160, width: 420, height: 12, background: "rgba(58,46,28,0.35)" }} />
                  <div style={{ position: "absolute", right: 60, top: 80, border: `7px solid ${C.red}`, padding: "6px 24px 0", fontFamily: F.display, fontSize: 88, color: C.red, transform: `rotate(-8deg) scale(${1.6 - ease.out(Math.min(1, stamp * 1.4)) * 0.6})`, opacity: Math.min(1, stamp * 3) * 0.9, filter: "url(#ink)" }}>
                    SIGNED
                  </div>
                </div>
                {qs.map((k) => {
                  const p = ramp(t, k.at - 0.2, k.at + 0.35);
                  return (
                    <div key={k.q} style={{ position: "absolute", left: k.x - 200, top: 640, width: 400, height: 220, background: "#f1ebdd", boxShadow: "0 18px 36px rgba(0,0,0,0.5)", transform: `rotate(${k.rot}deg) translateY(${(1 - ease.out(p)) * 80}px)`, opacity: p, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: F.display, fontSize: 60, lineHeight: 1, color: "#1c1c1b", textTransform: "uppercase", padding: 20, boxSizing: "border-box" }}>
                      {k.q}
                    </div>
                  );
                })}
              </Layer>
            </Camera>
          </PaperGround>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* S02 16.5–38.0 exports: Typhoon customers, then Rafale customers from Egypt in 2015. */
const TY: [string, number][] = [
  ["Saudi Arabia", 25.5],
  ["Oman", 26.8],
  ["Kuwait", 27.3],
  ["Qatar", 27.8],
];
const RA: [string, number][] = [
  ["Egypt", 31.1],
  ["India", 33.8],
  ["Qatar", 34.7],
  ["Greece", 35.3],
  ["Croatia", 35.8],
];
const S02: React.FC = () => {
  const t = useT();
  const hl: Highlight[] = [
    ...TY.map(([name, at]) => ({ name, draw: [at - 0.2, at + 0.2] as [number, number], fill: [at, at + 0.5] as [number, number], out: [28.4, 28.9] as [number, number] })),
    ...RA.map(([name, at]) => ({ name, draw: [at - 0.2, at + 0.2] as [number, number], fill: [at, at + 0.5] as [number, number] })),
  ];
  const view = viewAt(keys(t, [[16.5, 40], [24, 48], [29.5, 40], [33, 52], [38, 40]], ease.inOut), keys(t, [[16.5, 34], [24, 25], [29.5, 30], [33, 26], [38, 34]], ease.inOut), keys(t, [[16.5, 0.34], [24, 0.62], [29.5, 0.5], [33, 0.36], [38, 0.42]], ease.inOut));
  const [ex, ey] = toScreen(30.5, 26.5, view);
  return (
    <TearReveal t={t} start={16.5} dur={0.7} dir="ltr">
      <WorldMap t={t} view={view} highlights={hl} />
      <At x={W / 2} y={110}>
        <KeyTitle text="Typhoon exports" t={t} at={23.6} size={80} out={28.3} />
      </At>
      <At x={W / 2} y={110}>
        <KeyTitle text="Rafale exports" t={t} at={28.9} size={80} />
      </At>
      <At x={W / 2} y={110}>
        <KeyTitle text="Customers abroad" t={t} at={20.1} size={80} out={23.3} />
      </At>
      <HandNote x={ex + 80} y={ey + 60} p={ramp(t, 31.6, 32.3)} size={60}>
        2015 · first
      </HandNote>
    </TearReveal>
  );
};

/* S03 37.7–52.8 Qatar flies both; deals turn on politics, financing, weapons packages, relationships. */
const S03: React.FC = () => {
  const t = useT();
  const items = [
    { at: 46.6, text: "Politics" },
    { at: 47.5, text: "Financing" },
    { at: 48.4, text: "Weapons packages" },
    { at: 49.4, text: "Military relationships" },
  ];
  const dim = ramp(t, 45.8, 46.4) * 0.55;
  return (
    <BlotReveal t={t} start={37.7} dur={0.8} cx={W / 2} cy={H / 2}>
      <Split t={t} a="src-photos/rafale-qatar.jpg" apos="45% 60%" b="src-photos/typhoon-qatar.jpg" bpos="45% 60%" t0={37.7} t1={52.8} dim={0.1 + dim} />
      <HandNote x={W / 2} y={160} p={ramp(t, 37.9, 38.7)} size={84} anchor="center">
        Qatar flies both
      </HandNote>
      <At x={W / 4} y={H - 110}>
        <Label size={34} color={C.ink} weight={700} style={{ letterSpacing: "0.3em", opacity: ramp(t, 38.6, 39.1) }}>
          Rafale
        </Label>
      </At>
      <At x={(W * 3) / 4} y={H - 110}>
        <Label size={34} color={C.ink} weight={700} style={{ letterSpacing: "0.3em", opacity: ramp(t, 38.9, 39.4) }}>
          Typhoon
        </Label>
      </At>
      <HandNote x={W / 2} y={320} p={ramp(t, 44.0, 45.0) * (1 - ramp(t, 45.8, 46.3))} size={52} anchor="center" color="#ffd3c8">
        not only radar or agility
      </HandNote>
      {items.map((k, i) => (
        <At key={k.text} x={W / 2} y={380 + i * 110}>
          <Rise p={ramp(t, k.at, k.at + 0.4)}>
            <Tape p={1} size={44} dark={i % 2 === 1}>
              {k.text}
            </Tape>
          </Rise>
        </At>
      ))}
    </BlotReveal>
  );
};

/* S04 52.7–90.7 cost: Spain 2022 and Serbia 2024; different buyers, different packages; not comparable. */
const S04: React.FC = () => {
  const t = useT();
  const view = viewAt(keys(t, [[52.7, 8], [58.8, 6], [64.5, 10]], ease.inOut), keys(t, [[52.7, 44], [64.5, 43]], ease.inOut), keys(t, [[52.7, 1.1], [64.5, 1.05]], ease.inOut));
  const [sx, sy] = toScreen(-3.7, 40.2, view);
  const [bx, by] = toScreen(20.8, 44.1, view);
  const pack = ramp(t, 75.5, 76.1);
  const stamp = ramp(t, 84.4, 84.8);
  const list = [
    { at: 78.3, text: "training" },
    { at: 79.1, text: "spare parts" },
    { at: 80.1, text: "infrastructure" },
    { at: 81.0, text: "support" },
    { at: 81.7, text: "engines" },
    { at: 82.2, text: "weapons" },
  ];
  return (
    <TearReveal t={t} start={52.7} dur={0.7} dir="rtl">
      <WorldMap
        t={t}
        view={view}
        highlights={[
          { name: "Spain", draw: [54.6, 55.0], fill: [54.8, 55.4], label: { text: "SPAIN", lon: -3.6, lat: 40.0, size: 64, at: 55.0 } },
          { name: "Republic of Serbia", draw: [59.5, 59.9], fill: [59.7, 60.3], label: { text: "SERBIA", lon: 20.8, lat: 44.0, size: 40, at: 59.9 } },
        ]}
        overlay={<AbsoluteFill style={{ background: C.night, opacity: pack * 0.72 }} />}
      />
      <At x={W / 2} y={110}>
        <KeyTitle text="Cost" t={t} at={52.8} size={110} neon="white" />
      </At>
      <AbsoluteFill style={{ opacity: 1 - pack }}>
        <HandNote x={sx - 60} y={sy + 150} p={ramp(t, 56.2, 57.3)} size={52}>
          2022 · 20 Eurofighters
        </HandNote>
        <HandNote x={sx - 60} y={sy + 230} p={ramp(t, 56.8, 57.8)} size={60} color="#ffd3c8">
          a little over €2 bn
        </HandNote>
        <HandNote x={bx - 40} y={by - 200} p={ramp(t, 62.6, 63.8)} size={52}>
          2024 · 12 Rafales
        </HandNote>
        <HandNote x={bx - 40} y={by - 120} p={ramp(t, 61.0, 62.1)} size={60} color="#ffd3c8">
          ~$2.7 bn
        </HandNote>
        <HandNote x={W / 2} y={H - 110} p={ramp(t, 66.0, 67.0) * (1 - ramp(t, 68.3, 68.7))} size={56} anchor="center">
          Rafale much more expensive?
        </HandNote>
        <HandNote x={sx - 60} y={sy + 310} p={ramp(t, 69.2, 70.4)} size={42} color="#e8e1d2">
          already flies & builds it
        </HandNote>
        <HandNote x={bx - 40} y={by - 40} p={ramp(t, 73.5, 74.6)} size={42} color="#e8e1d2">
          a completely new aircraft
        </HandNote>
      </AbsoluteFill>
      {pack > 0 && (
        <AbsoluteFill style={{ opacity: pack }}>
          <HandNote x={W / 2} y={250} p={ramp(t, 76.2, 77.0)} size={62} anchor="center">
            what each contract includes
          </HandNote>
          {list.map((k, i) => (
            <At key={k.text} x={560 + (i % 3) * 400} y={460 + Math.floor(i / 3) * 150}>
              <Rise p={ramp(t, k.at, k.at + 0.4)}>
                <Tape p={1} size={40} dark={i % 2 === 1}>
                  {k.text}
                </Tape>
              </Rise>
            </At>
          ))}
          <At x={W / 2} y={880}>
            <div style={{ transform: `rotate(-6deg) scale(${1.6 - ease.out(Math.min(1, stamp * 1.4)) * 0.6})`, opacity: Math.min(1, stamp * 3) * 0.95, border: `7px solid ${C.red}`, padding: "8px 30px 0", fontFamily: F.display, fontSize: 80, color: C.red, background: "rgba(20,20,20,0.45)", filter: "url(#ink)" }}>NOT COMPARABLE</div>
          </At>
        </AbsoluteFill>
      )}
    </TearReveal>
  );
};

/* S05 90.6–113.2 independence: four partner governments; Germany and the Saudi sale. */
const S05: React.FC = () => {
  const t = useT();
  const view = viewAt(keys(t, [[90.6, 6], [105.5, 8], [107.5, 26], [113.2, 27]], ease.inOut), keys(t, [[90.6, 47], [105.5, 47], [107.5, 38], [113.2, 38]], ease.inOut), keys(t, [[90.6, 1.0], [105.5, 1.08], [107.5, 0.62], [113.2, 0.65]], ease.inOut));
  const caps: [string, number][] = [
    ["london", 97.2],
    ["berlin", 98.3],
    ["rome", 99.1],
    ["madrid", 99.6],
  ];
  const pt = (k: keyof typeof PLACES) => toScreen(PLACES[k][0], PLACES[k][1], view);
  const links = ramp(t, 103.5, 105.0, ease.linear);
  const [bx, by] = pt("berlin");
  const [rx, ry] = pt("riyadh");
  return (
    <BlotReveal t={t} start={90.6} dur={0.8} cx={W / 2} cy={H / 2}>
      <WorldMap
        t={t}
        view={view}
        highlights={[
          { name: "United Kingdom", draw: [97.0, 97.4], fill: [97.2, 97.8] },
          { name: "Germany", draw: [98.1, 98.5], fill: [98.3, 98.9] },
          { name: "Italy", draw: [98.9, 99.3], fill: [99.1, 99.7] },
          { name: "Spain", draw: [99.4, 99.8], fill: [99.6, 100.2] },
          { name: "Saudi Arabia", draw: [109.1, 109.5], fill: [109.3, 109.9] },
        ]}
      />
      <At x={W / 2} y={110}>
        <KeyTitle text="Buyer independence" t={t} at={92.8} size={84} out={96.8} />
      </At>
      <Ink>
        {caps.map(([k, at]) => {
          const [x, y] = pt(k as keyof typeof PLACES);
          return <circle key={k} cx={x} cy={y} r={9 * ramp(t, at, at + 0.3)} fill={MARKER} />;
        })}
        {/* several governments, all with a say: every capital linked to every other */}
        {caps.flatMap(([a], i) =>
          caps.slice(i + 1).map(([b], j) => {
            const [x1, y1] = pt(a as keyof typeof PLACES);
            const [x2, y2] = pt(b as keyof typeof PLACES);
            return <DrawPath key={a + b} d={`M${x1},${y1} L${x2},${y2}`} p={ramp(links * 6, i * 2 + j, i * 2 + j + 1)} color={MARKER} width={3} dash={10} />;
          })
        )}
        <HandArrow x1={bx} y1={by} x2={rx - 20} y2={ry - 30} p={ramp(t, 110.4, 111.2)} seed="sa" color={MARKER_RED} bow={0.2} />
      </Ink>
      <HandNote x={W / 2 + 200} y={210} p={ramp(t, 101.2, 102.0) * (1 - ramp(t, 105.8, 106.3))} size={56}>
        huge industrial base
      </HandNote>
      <HandNote x={W / 2 + 200} y={300} p={ramp(t, 103.5, 104.4) * (1 - ramp(t, 105.8, 106.3))} size={56} color="#ffd3c8">
        several governments decide
      </HandNote>
      <HandNote x={bx + 40} y={by - 70} p={ramp(t, 110.5, 111.4)} size={48} color="#ffd3c8">
        Germany’s position
      </HandNote>
    </BlotReveal>
  );
};

/* S06 113.0–143.4 the Rafale: industry concentrated in France; French approval still needed; one government, not four. */
const S06: React.FC = () => {
  const t = useT();
  const view = viewAt(keys(t, [[113, 2.4], [129.8, 2.6], [131.2, 6], [143.4, 6]], ease.inOut), keys(t, [[113, 46.6], [129.8, 46.6], [131.2, 47], [143.4, 47]], ease.inOut), keys(t, [[113, 1.9], [129.8, 2.0], [131.2, 1.0], [143.4, 1.02]], ease.inOut));
  const [px, py] = toScreen(2.35, 48.86, view);
  const approvals = [
    { at: 124.8, text: "exports" },
    { at: 125.6, text: "technology" },
    { at: 126.4, text: "upgrades" },
  ];
  const four = ramp(t, 131.4, 132.2);
  const pt = (k: keyof typeof PLACES) => toScreen(PLACES[k][0], PLACES[k][1], view);
  return (
    <TearReveal t={t} start={113.0} dur={0.7} dir="ltr">
      <WorldMap
        t={t}
        view={view}
        highlights={[
          { name: "France", draw: [116.8, 117.2], fill: [117.0, 117.7] },
          { name: "United Kingdom", draw: [131.4, 131.8], fill: [131.6, 132.1], out: [142.8, 143.3] },
          { name: "Germany", draw: [131.6, 132.0], fill: [131.8, 132.3], out: [142.8, 143.3] },
          { name: "Italy", draw: [131.8, 132.2], fill: [132.0, 132.5], out: [142.8, 143.3] },
          { name: "Spain", draw: [132.0, 132.4], fill: [132.2, 132.7], out: [142.8, 143.3] },
        ]}
      />
      <At x={W / 2} y={110}>
        <KeyTitle text="The Rafale is different" t={t} at={113.2} size={80} out={121.6} />
      </At>
      <AbsoluteFill style={{ opacity: 1 - four }}>
        <HandNote x={px + 120} y={py - 160} p={ramp(t, 119.2, 119.9)} size={60}>
          Dassault
        </HandNote>
        <HandNote x={px + 160} y={py - 60} p={ramp(t, 120.0, 120.7)} size={60}>
          Safran
        </HandNote>
        <HandNote x={px + 200} y={py + 40} p={ramp(t, 120.8, 121.5)} size={60}>
          Thales
        </HandNote>
        <At x={W / 2} y={H - 250}>
          <Rise p={ramp(t, 123.6, 124.1)}>
            <Label size={30} color={C.ink} weight={700} style={{ letterSpacing: "0.26em" }}>
              French approval still needed for
            </Label>
          </Rise>
        </At>
        <At x={W / 2} y={H - 160}>
          <div style={{ display: "flex", gap: 22 }}>
            {approvals.map((a, i) => (
              <Tape key={a.text} p={ramp(t, a.at, a.at + 0.35)} size={38} dark={i === 1}>
                {a.text}
              </Tape>
            ))}
          </div>
        </At>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: four }}>
        <Ink>
          {(["london", "berlin", "rome", "madrid"] as const).map((k, i) => {
            const [x, y] = pt(k);
            return <circle key={k} cx={x} cy={y} r={10 * ramp(t, 132.0 + i * 0.15, 132.3 + i * 0.15)} fill={MARKER} />;
          })}
          {(() => {
            const [x, y] = pt("paris");
            return <HandCircle cx={x} cy={y} rx={60} ry={46} p={ramp(t, 134.7, 135.4)} seed="paris" />;
          })()}
        </Ink>
        <HandNote x={1400} y={260} p={ramp(t, 132.6, 133.4)} size={70}>
          4 governments
        </HandNote>
        <HandNote x={1400} y={370} p={ramp(t, 134.8, 135.6)} size={70} color="#ffd3c8">
          vs 1
        </HandNote>
        <At x={W / 2} y={H - 130}>
          <Rise p={ramp(t, 139.1, 139.6)}>
            <Tape p={1} size={36} dark>
              Fewer governments that can interfere
            </Tape>
          </Rise>
        </At>
      </AbsoluteFill>
    </TearReveal>
  );
};

/* S07 143.3–160.7 neither is fully independent: Indian-built fuselage sections, but no control of engine, radar, software. */
const S07: React.FC = () => {
  const t = useT();
  // rafale-india-takeoff.jpg 3000×2000, pos 55% 45%
  const P = (u: number, v: number) => coverPt(u, v, 3000, 2000, 0.55, 0.45);
  const [fx, fy] = P(0.55, 0.45);
  const [nx, ny] = P(0.745, 0.3);
  const [ex, ey] = P(0.36, 0.525);
  const [cx, cy] = P(0.625, 0.315);
  return (
    <BlotReveal t={t} start={143.3} dur={0.8} cx={W / 2} cy={H / 2}>
      <PhotoStage src="src-photos/rafale-india-takeoff.jpg" t={t} t0={143.3} t1={160.7} pos="55% 45%" z0={1.0} z1={1.06} dim={0.18}>
        <Ink>
          <HandCircle cx={fx} cy={fy} rx={230} ry={90} p={ramp(t, 150.2, 151.0)} seed="fus" color={MARKER} />
          <HandCircle cx={ex} cy={ey} rx={120} ry={70} p={ramp(t, 155.9, 156.5)} seed="eng" />
          <HandCircle cx={nx} cy={ny} rx={90} ry={60} p={ramp(t, 156.7, 157.3)} seed="rad" />
          <HandArrow x1={cx + 200} y1={cy - 170} x2={cx + 20} y2={cy - 30} p={ramp(t, 157.5, 158.1)} seed="sw" color={MARKER_RED} />
        </Ink>
        <HandNote x={fx - 60} y={fy + 150} p={ramp(t, 150.4, 151.4)} size={54}>
          fuselage sections · India
        </HandNote>
        <HandNote x={ex - 140} y={ey + 100} p={ramp(t, 156.0, 156.7)} size={52} color="#ffd3c8">
          ✗ engine
        </HandNote>
        <HandNote x={nx + 40} y={ny - 90} p={ramp(t, 156.8, 157.5)} size={52} color="#ffd3c8">
          ✗ radar
        </HandNote>
        <HandNote x={cx + 210} y={cy - 200} p={ramp(t, 157.6, 158.3)} size={52} color="#ffd3c8">
          ✗ software
        </HandNote>
      </PhotoStage>
      <At x={W / 2} y={H - 140}>
        <KeyTitle text="No complete independence" t={t} at={143.8} size={86} neon="white" out={148.8} />
      </At>
      <At x={W / 2} y={H - 110}>
        <Rise p={ramp(t, 158.6, 159.1)}>
          <Tape p={1} size={34} dark>
            ✗ the entire program
          </Tape>
        </Rise>
      </At>
    </BlotReveal>
  );
};

/* S08 160.5–187.6 modernization: Rafale F4.1 qualified 2023 and in service; Typhoon ECRS Mk2 later this decade. */
const S08: React.FC = () => {
  const t = useT();
  const X = (y: number) => 260 + (y - 2020) * 150;
  const axis = ramp(t, 160.7, 161.8, ease.inOut);
  const today = ramp(t, 179.8, 180.5);
  return (
    <TearReveal t={t} start={160.5} dur={0.7} dir="rtl">
      <PaperGround dark>
        <Camera s={keys(t, [[160.5, 1.05], [187.6, 1.0]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={110}>
              <KeyTitle text="Modernization" t={t} at={160.7} size={96} />
            </At>
            <Ink>
              <DrawPath d={`M${X(2019.6)},540 L${X(2030.6)},540`} p={axis} color={MARKER} width={4} />
              {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                <g key={y} opacity={ramp(axis, (y - 2020) / 11, (y - 2020) / 11 + 0.1)}>
                  <line x1={X(y)} y1={528} x2={X(y)} y2={552} stroke={MARKER} strokeWidth={3} />
                  <text x={X(y)} y={590} textAnchor="middle" fontFamily={F.label} fontWeight={600} fontSize={26} fill={C.inkSoft}>
                    {y}
                  </text>
                </g>
              ))}
              {/* Rafale F4.1: qualified 2023, in service */}
              <DrawPath d={`M${X(2023)},540 L${X(2023)},360`} p={ramp(t, 165.4, 165.9)} color="#ffd3c8" width={4} />
              <circle cx={X(2023)} cy={540} r={12 * ramp(t, 165.6, 165.9)} fill="#ffd3c8" />
              <DrawPath d={`M${X(2023)},470 L${X(2030.4)},470`} p={ramp(t, 167.0, 168.2)} color="#ffd3c8" width={10} />
              {/* Typhoon ECRS Mk2: later this decade */}
              <DrawPath d={`M${X(2027)},620 L${X(2030.4)},620`} p={ramp(t, 176.3, 177.6)} color={MARKER} width={10} dash={16} />
              {/* today */}
              <DrawPath d={`M${X(2026)},330 L${X(2026)},760`} p={today} color={MARKER_RED} width={4} dash={12} />
            </Ink>
            <HandNote x={X(2023) - 20} y={320} p={ramp(t, 163.3, 164.4)} size={58} color="#ffd3c8" anchor="center">
              Rafale F4.1
            </HandNote>
            <HandNote x={X(2023) + 30} y={425} p={ramp(t, 166.6, 167.6)} size={42} color="#ffd3c8">
              qualified 2023 · in service
            </HandNote>
            <HandNote x={X(2027)} y={690} p={ramp(t, 171.6, 173.4)} size={52}>
              Typhoon · ECRS Mk2 radar
            </HandNote>
            <HandNote x={X(2027)} y={770} p={ramp(t, 176.4, 177.6)} size={42} color="#e8e1d2">
              later in the decade
            </HandNote>
            <HandNote x={X(2026)} y={820} p={ramp(t, 180.2, 180.9)} size={48} color="#ffc0b2" anchor="center">
              today
            </HandNote>
            <At x={W / 2} y={960}>
              <Rise p={ramp(t, 184.6, 185.1)}>
                <Tape p={1} size={34} dark>
                  Rafale · more advanced today
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* S09 187.4–end in short: cost not comparable; Typhoon = larger network; Rafale = centralised supplier; autonomy weighs too. */
const S09: React.FC = () => {
  const t = useT();
  const rows = [
    { at: 188.2, k: "Cost", v: "too hard to compare fairly" },
    { at: 192.1, k: "Typhoon", v: "larger multinational industrial network" },
    { at: 195.8, k: "Rafale", v: "more centralised supplier relationship" },
  ];
  const autonomy = ramp(t, 199.5, 200.1);
  const end = ramp(t, 207.0, 207.7);
  return (
    <BlotReveal t={t} start={187.4} dur={0.8} cx={W / 2} cy={H / 2}>
      <PaperGround>
        <Camera s={keys(t, [[187.4, 1.06], [207.7, 1.0]], ease.soft)}>
          <Layer>
            <AbsoluteFill style={{ opacity: 1 - autonomy * 0.75 }}>
              {rows.map((r, i) => (
                <React.Fragment key={r.k}>
                  <At x={420} y={290 + i * 180} anchor="left">
                    <KeyTitle text={r.k} t={t} at={r.at} size={76} color={i === 2 ? "#ffb4a6" : C.offWhite} />
                  </At>
                  <HandNote x={780} y={290 + i * 180} p={ramp(t, r.at + 0.4, r.at + 1.6)} size={52}>
                    {r.v}
                  </HandNote>
                </React.Fragment>
              ))}
            </AbsoluteFill>
            <AbsoluteFill style={{ opacity: autonomy }}>
              <At x={W / 2} y={440}>
                <KeyTitle text="Political autonomy" t={t} at={201.3} size={120} neon="red" color="#ffb4a6" />
              </At>
              <Ink>
                <HandUnder x1={W / 2 - 480} x2={W / 2 + 480} y={520} p={ramp(t, 202.9, 203.6)} />
              </Ink>
              <HandNote x={W / 2} y={680} p={ramp(t, 204.0, 206.8)} size={62} anchor="center">
                ≈ radar, weapons or range
              </HandNote>
            </AbsoluteFill>
          </Layer>
        </Camera>
        <AbsoluteFill style={{ background: C.night, opacity: end }} />
      </PaperGround>
    </BlotReveal>
  );
};

const SCENES: SceneDef[] = [
  { id: "S01 questions", from: 0, to: 17.1, C: S01 },
  { id: "S02 exports", from: 16.5, to: 38.4, C: S02 },
  { id: "S03 Qatar", from: 37.7, to: 53.3, C: S03 },
  { id: "S04 cost", from: 52.7, to: 91.2, C: S04 },
  { id: "S05 independence", from: 90.6, to: 113.6, C: S05 },
  { id: "S06 France", from: 113.0, to: 143.9, C: S06 },
  { id: "S07 India", from: 143.3, to: 161.1, C: S07 },
  { id: "S08 modernization", from: 160.5, to: 188.0, C: S08 },
  { id: "S09 summary", from: 187.4, to: 209, C: S09 },
];

const CUES: Cue[] = [
  [1.6, "marker-1", 0.12], [5.2, "whoosh-1", 0.14], [5.8, "docs", 0.14], [10.0, "slide-3", 0.12], [11.6, "slide-2", 0.12], [13.0, "slide-3", 0.12], [15.3, "stamp-3", 0.22],
  [16.85, "whoosh-2", 0.18], [25.5, "liquid-1", 0.1], [26.8, "ping-1", 0.08], [27.3, "ping-2", 0.08], [27.8, "ping-1", 0.08], [31.1, "liquid-2", 0.1], [31.6, "marker-1", 0.1], [33.8, "ping-2", 0.08], [34.7, "ping-1", 0.08], [35.3, "ping-2", 0.08], [35.8, "ping-1", 0.08],
  [38.1, "whoosh-3", 0.18], [38.0, "marker-2", 0.12], [46.6, "tape-1", 0.1], [47.5, "tape-2", 0.1], [48.4, "tape-3", 0.1], [49.4, "tape-1", 0.1],
  [53.05, "whoosh-1", 0.18], [55.0, "liquid-1", 0.1], [56.2, "marker-1", 0.1], [59.9, "liquid-2", 0.1], [61.0, "marker-1", 0.1], [75.8, "whoosh-3", 0.1], [78.3, "tape-1", 0.08], [79.1, "tape-2", 0.08], [80.1, "tape-3", 0.08], [81.0, "tape-1", 0.08], [81.7, "tape-2", 0.08], [82.2, "tape-3", 0.08], [84.4, "stamp-3", 0.22],
  [91.0, "whoosh-2", 0.18], [97.2, "ping-1", 0.08], [98.3, "ping-2", 0.08], [99.1, "ping-1", 0.08], [99.6, "ping-2", 0.08], [103.5, "pencil", 0.1, 1.5], [107.0, "whoosh-1", 0.1], [110.4, "marker-2", 0.14],
  [113.35, "whoosh-3", 0.18], [117.0, "liquid-1", 0.12], [119.2, "marker-1", 0.08], [120.0, "marker-1", 0.08], [120.8, "marker-1", 0.08], [124.8, "tape-1", 0.08], [125.6, "tape-2", 0.08], [126.4, "tape-3", 0.08], [131.4, "whoosh-1", 0.1], [134.7, "marker-2", 0.12],
  [143.7, "whoosh-2", 0.18], [150.2, "marker-1", 0.12], [155.9, "marker-2", 0.1], [156.7, "marker-2", 0.1], [157.5, "marker-1", 0.1],
  [160.85, "whoosh-1", 0.18], [160.7, "pencil", 0.1, 1.2], [165.4, "ping-1", 0.1], [167.0, "pencil", 0.08, 1.2], [176.3, "pencil", 0.08, 1.3], [179.8, "marker-2", 0.12],
  [187.8, "whoosh-3", 0.18], [188.2, "slide-1", 0.1], [192.1, "slide-2", 0.1], [195.8, "slide-3", 0.1], [199.8, "whoosh-1", 0.1], [202.9, "marker-2", 0.12],
];

export const Part4: React.FC = () => <PartShell audio="audio/part4.mp3" scenes={SCENES} cues={CUES} />;
