import React from "react";
import { AbsoluteFill } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Display, Label, Rise, Tape } from "../components/Type";
import { DrawPath, Stage, scribbleEllipse } from "../components/Draw";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { Blueprint, viewBox } from "../components/Blueprint";
import { GraphPaper } from "./Open";
import { ElectronicScan, MechanicalScan } from "../components/Radar";
import { C, F, W, H } from "../lib/theme";
import { ease, keys, lerp, ramp, useT } from "../lib/time";

/* ------------------------------------------------------------------ S09
 * 79.9–87.4 "And to make this comparison as fair as possible, I had to decide exactly
 * which versions we're going to use."
 * Both aircraft set to one scale on a shared ruler; then each airframe's version
 * index is flicked through like file tabs.
 */
const TYPHOON_TABS = ["Tranche 1", "Tranche 2", "Tranche 3", "Tranche 4"];
const RAFALE_TABS = ["F1", "F2", "F3", "F3R", "F4"];

const TabRow: React.FC<{ tabs: string[]; x: number; y: number; p: number; cursor: number; pick: number[]; pickP: number }> = ({ tabs, x, y, p, cursor, pick, pickP }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: "column", gap: 10 }}>
    {tabs.map((tab, i) => {
      const e = ramp(p, i * 0.1, i * 0.1 + 0.5);
      const on = Math.max(0, 1 - Math.abs(cursor - i) * 1.4);
      const picked = pick.includes(i) ? pickP : 0;
      return (
        <div
          key={tab}
          style={{
            opacity: e,
            transform: `translateX(${(1 - e) * 40 - on * 14 - picked * 22}px)`,
            background: picked > 0.5 ? C.red : on > 0.5 ? C.ink : "#e3dccd",
            color: picked > 0.5 || on > 0.5 ? C.offWhite : C.ink,
            padding: "8px 22px 6px",
            fontFamily: F.label,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            borderRadius: "6px 0 0 6px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.18)",
            width: 250,
          }}
        >
          {tab}
        </div>
      );
    })}
  </div>
);

// one scale for both aircraft: 70 px per metre, noses on the ruler zero
const PX_M = 70;
const X0 = 170;
const sideWidth = (view: "typhoonSide" | "rafaleSide", metres: number) => {
  const [x0, , x1] = viewBox(view);
  const pad = (x1 - x0) * 0.02;
  const k = (metres * PX_M) / (x1 - x0);
  return { width: (x1 - x0 + 2 * pad) * k, left: X0 - pad * k };
};

export const S09Fair: React.FC = () => {
  const t = useT();
  const ty = sideWidth("typhoonSide", 15.96);
  const rf = sideWidth("rafaleSide", 15.27);
  const ruler = ramp(t, 80.5, 81.6, ease.soft);
  const tabsT = ramp(t, 84.3, 85.2, ease.linear);
  const tabsR = ramp(t, 84.5, 85.4, ease.linear);
  const cursorT = keys(t, [[84.8, 0], [85.9, 3.6], [86.6, 1.5]], ease.inOut);
  const cursorR = keys(t, [[84.9, 0], [85.9, 4.4], [86.6, 3]], ease.inOut);
  const pickP = ramp(t, 86.5, 86.9);
  const exit = ramp(t, 86.7, 87.5, ease.in);
  const lenT = ramp(t, 82.0, 82.6);
  const lenR = ramp(t, 82.3, 82.9);
  return (
    <TearReveal t={t} start={79.95} dur={0.9} dir="btt" seed="s09">
      <PaperGround>
        <Camera s={keys(t, [[80, 1.05], [84, 1.0]], ease.soft) * (1 + exit * 0.9)} x={exit * -200} y={exit * -240}>
          <Layer depth={0.95}>
            <GraphPaper />
          </Layer>
          <Layer>
            <Blueprint view="typhoonSide" x={ty.left} y={300} width={ty.width} anchor="left" p={ramp(t, 80.2, 82.0, ease.linear)} lineWidth={1.5} />
            <Blueprint view="rafaleSide" x={rf.left} y={780} width={rf.width} anchor="left" p={ramp(t, 80.5, 82.3, ease.linear)} lineWidth={1.5} />
            <Stage>
              {/* the shared metre ruler */}
              <DrawPath d={`M${X0},560 L${X0 + 16 * PX_M},560`} p={ruler} color={C.ink} width={3} />
              {Array.from({ length: 17 }, (_, m) => (
                <g key={m} opacity={ruler > m / 16 ? 1 : 0}>
                  <line x1={X0 + m * PX_M} y1={560} x2={X0 + m * PX_M} y2={m % 5 === 0 ? 590 : 575} stroke={C.ink} strokeWidth={2} />
                  {m % 5 === 0 && (
                    <text x={X0 + m * PX_M} y={620} textAnchor="middle" fontFamily={F.label} fontWeight={600} fontSize={24} fill={C.inkSoft}>
                      {m} m
                    </text>
                  )}
                </g>
              ))}
              <line x1={X0} y1={120} x2={X0} y2={960} stroke={C.red} strokeWidth={2} strokeDasharray="8 8" opacity={ruler * 0.8} />
              <line x1={X0 + 15.96 * PX_M} y1={170} x2={X0 + 15.96 * PX_M} y2={545} stroke={C.red} strokeWidth={2} strokeDasharray="8 8" opacity={lenT * 0.8} />
              <line x1={X0 + 15.27 * PX_M} y1={575} x2={X0 + 15.27 * PX_M} y2={930} stroke={C.red} strokeWidth={2} strokeDasharray="8 8" opacity={lenR * 0.8} />
            </Stage>
            <At x={X0 + 15.96 * PX_M + 14} y={150} anchor="left">
              <Rise p={lenT}>
                <Display size={58} color={C.red}>
                  15.96 m
                </Display>
              </Rise>
            </At>
            <At x={X0 + 15.27 * PX_M + 14} y={950} anchor="left">
              <Rise p={lenR}>
                <Display size={58} color={C.red}>
                  15.27 m
                </Display>
              </Rise>
            </At>
            <At x={X0} y={140} anchor="left">
              <Label size={26} color={C.inkSoft} weight={600} style={{ opacity: ramp(t, 81.0, 81.5) }}>
                Typhoon
              </Label>
            </At>
            <At x={X0} y={980} anchor="left">
              <Label size={26} color={C.inkSoft} weight={600} style={{ opacity: ramp(t, 81.2, 81.7) }}>
                Rafale
              </Label>
            </At>
          </Layer>
          <Layer depth={1.05}>
            <TabRow tabs={TYPHOON_TABS} x={1640} y={110} p={tabsT} cursor={cursorT} pick={[1, 2]} pickP={pickP} />
            <TabRow tabs={RAFALE_TABS} x={1640} y={600} p={tabsR} cursor={cursorR} pick={[3]} pickP={pickP} />
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* ------------------------------------------------------------------ S10
 * 86.9–103.0 "For the Eurofighter, our reference will be the British Typhoon FGR4,
 * especially upgraded Tranche 2 and Tranche 3 aircraft, incorporating capabilities
 * introduced through the Centurion program and using the mechanically scanned CAPTOR-M radar."
 */
export const S10FGR4: React.FC = () => {
  const t = useT();
  const push = ramp(t, 98.4, 99.6, ease.in);
  const camS = keys(t, [[87, 1.12], [98.3, 1.0]], ease.soft) * (1 + push * 2.2);
  const nose = { x: 700, y: 610 };
  return (
    <BlotReveal t={t} start={86.9} dur={0.9} cx={760} cy={300} seed="s10">
      <PaperGround dark>
        <Camera s={camS} x={push * (nose.x - W / 2)} y={push * (nose.y - H / 2)}>
          <Layer depth={1}>
            {/* RAF Typhoon FGR4 (MOD, OGL) */}
            <Photo src="src-photos/typhoon-front.jpg" x={700} y={560} w={1060} h={707} rot={-1.2} seed="fgr4" zoom={1.04 + (t - 87) * 0.004} border={14} />
          </Layer>
          <Layer depth={1.12}>
            <At x={1300} y={250} anchor="left">
              <Rise p={ramp(t, 89.1, 89.6)}>
                <Label size={28} color="#c9c2b2" weight={600} style={{ letterSpacing: "0.35em" }}>
                  Royal Air Force
                </Label>
              </Rise>
            </At>
            <At x={1296} y={345} anchor="left">
              <Rise p={ramp(t, 89.9, 90.6)}>
                <Display size={140} color={C.offWhite}>
                  Typhoon
                </Display>
              </Rise>
            </At>
            <At x={1296} y={470} anchor="left">
              <Rise p={ramp(t, 90.2, 90.9)}>
                <Display size={140} color={C.redPrint}>
                  FGR4
                </Display>
              </Rise>
            </At>
            <At x={1310} y={600} anchor="left">
              <Tape p={ramp(t, 93.0, 93.5)} rot={-2}>
                Tranche 2
              </Tape>
            </At>
            <At x={1560} y={606} anchor="left">
              <Tape p={ramp(t, 94.1, 94.6)} rot={1.5}>
                Tranche 3
              </Tape>
            </At>
            {/* Centurion brought Meteor, Storm Shadow and Brimstone to the RAF fleet */}
            <Cutout name="meteor" x={1560} y={800} w={560} rot={-4} opacity={ramp(t, 96.8, 97.5)} scale={0.9 + ramp(t, 96.8, 97.5) * 0.1} />
            <At x={1560} y={930}>
              <Tape p={ramp(t, 97.7, 98.2)} dark rot={-1}>
                Project Centurion
              </Tape>
            </At>
          </Layer>
        </Camera>
        <RadarPanel t={t} start={99.3} end={103.2} kind="mech" title="CAPTOR-M" titleAt={100.74} sub="Mechanically scanned" subAt={99.8} photo="captor" />
      </PaperGround>
    </BlotReveal>
  );
};

/** Technical panel: the real radar hardware beside a scan-principle drawing. */
const RadarPanel: React.FC<{ t: number; start: number; end: number; kind: "mech" | "aesa"; title: string; titleAt: number; sub: string; subAt: number; photo: string }> = ({
  t,
  start,
  end,
  kind,
  title,
  titleAt,
  sub,
  subAt,
  photo,
}) => {
  if (t < start) return null;
  const s = keys(t, [[start, 1.1], [end, 1.0]], ease.soft);
  return (
    <BlotReveal t={t} start={start} dur={0.7} cx={W / 2} cy={H / 2} seed={"rp" + kind}>
      <PaperGround dark>
        <Camera s={s}>
          <Layer depth={0.9}>
            <Stage>
              {kind === "mech" ? (
                <MechanicalScan x={1060} y={560} scale={1.15} time={t} p={ramp(t, start + 0.2, start + 0.8)} />
              ) : (
                <ElectronicScan x={1060} y={560} scale={1.15} time={t} p={ramp(t, start + 0.2, start + 0.8)} />
              )}
            </Stage>
          </Layer>
          <Layer depth={1.08}>
            <Cutout name={photo} x={470} y={560} w={kind === "mech" ? 640 : 470} rot={-3} opacity={ramp(t, start + 0.1, start + 0.6)} />
            <At x={470} y={870}>
              <Rise p={ramp(t, titleAt, titleAt + 0.5)}>
                <Display size={96} color={C.offWhite}>
                  {title}
                </Display>
              </Rise>
            </At>
            <At x={470} y={950}>
              <Rise p={ramp(t, subAt, subAt + 0.5)}>
                <Label size={26} color="#e8b3a6" weight={600}>
                  {sub}
                </Label>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* ------------------------------------------------------------------ S11
 * 102.4–113.3 "On the French side, we'll use the Rafale C, the single-seat land-based
 * version in the F3R standard, equipped with the RBE2 AESA radar."
 * Mirror of S10 on light paper: whip in from the right.
 */
export const S11RafaleC: React.FC = () => {
  const t = useT();
  const inP = ramp(t, 102.45, 103.05, ease.inOut);
  const push = ramp(t, 108.9, 110.0, ease.in);
  const photo = { x: 1180, y: 540, w: 1120, h: 746 };
  // nose of the Rafale C in the Langley photo sits left of centre
  const nose = { x: photo.x - photo.w * 0.36, y: photo.y + photo.h * 0.02 };
  const canopy = { x: photo.x - photo.w * 0.12, y: photo.y - photo.h * 0.08 };
  const camS = keys(t, [[102.5, 1.08], [108.8, 1.0]], ease.soft) * (1 + push * 2.2);
  return (
    <AbsoluteFill style={{ transform: `translateX(${(1 - inP) * W}px)`, filter: inP < 1 ? `blur(${Math.sin(inP * Math.PI) * 12}px)` : undefined }}>
      <PaperGround>
        <Camera s={camS} x={push * (nose.x - W / 2)} y={push * (nose.y - H / 2)}>
          <Layer depth={1}>
            {/* French Air and Space Force Rafale C at Langley, 2015 (USAF, public domain) */}
            <Photo src="photos/rafale-landing.jpg" x={photo.x} y={photo.y} w={photo.w} h={photo.h} rot={1.2} seed="rafc" zoom={1.05 + (t - 102) * 0.004} objectPosition="50% 50%" />
            <Stage>
              <DrawPath d={scribbleEllipse(canopy.x, canopy.y, 120, 60, "canopy")} p={ramp(t, 105.8, 106.5, ease.soft)} q={ramp(t, 108.4, 108.8)} color={C.red} width={5} />
            </Stage>
          </Layer>
          <Layer depth={1.12}>
            <At x={600} y={250} anchor="right">
              <Rise p={ramp(t, 102.9, 103.4)}>
                <Label size={22} color={C.inkSoft} weight={600} style={{ letterSpacing: "0.22em" }}>
                  French Air and Space Force
                </Label>
              </Rise>
            </At>
            <At x={604} y={350} anchor="right">
              <Rise p={ramp(t, 104.3, 105.0)}>
                <Display size={150} color={C.ink}>
                  Rafale <span style={{ color: C.red }}>C</span>
                </Display>
              </Rise>
            </At>
            <At x={600} y={500} anchor="right">
              <Tape p={ramp(t, 105.8, 106.3)} rot={-1.5}>
                Single-seat
              </Tape>
            </At>
            <At x={600} y={575} anchor="right">
              <Tape p={ramp(t, 106.3, 106.8)} rot={1}>
                Land-based
              </Tape>
            </At>
            <At x={600} y={680} anchor="right">
              <Rise p={ramp(t, 107.8, 108.4)}>
                <Display size={120} color={C.red}>
                  F3R
                </Display>
              </Rise>
            </At>
          </Layer>
        </Camera>
        <RadarPanel t={t} start={109.7} end={113.4} kind="aesa" title="RBE2 AESA" titleAt={110.1} sub="Electronically scanned" subAt={111.1} photo="rbe2" />
      </PaperGround>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S12
 * 112.7–121.9 "I chose these two versions for a simple reason. They're mature,
 * well-known configurations with capabilities that are relatively well-documented."
 * Desk of real public documentation (UK National Audit Office report) with both
 * aircraft prints; three ink stamps land on the words.
 */
const Stamp: React.FC<{ text: string; p: number; x: number; y: number; rot: number }> = ({ text, p, x, y, rot }) => {
  if (p <= 0) return null;
  const s = lerp(1.6, 1, ease.out(Math.min(1, p * 1.6)));
  return (
    <At x={x} y={y} rot={rot}>
      <div
        style={{
          transform: `scale(${s})`,
          opacity: Math.min(1, p * 3) * 0.88,
          border: `6px solid ${C.red}`,
          padding: "8px 24px 4px",
          fontFamily: F.display,
          fontSize: 86,
          color: C.red,
          letterSpacing: "0.04em",
          mixBlendMode: "multiply",
        }}
      >
        {text}
      </div>
    </At>
  );
};

export const S12Mature: React.FC = () => {
  const t = useT();
  const camX = keys(t, [[112.8, -60], [121.9, 60]], ease.soft);
  const camS = keys(t, [[112.8, 1.12], [121.9, 1.0]], ease.soft);
  const docs = ramp(t, 113.2, 114.4);
  return (
    <TearReveal t={t} start={112.75} dur={0.9} dir="ltr" seed="s12" slope={-0.15}>
      <PaperGround tint="#d9d1c0">
        <Camera x={camX} s={camS}>
          <Layer depth={0.85}>
            {[1, 2, 3].map((n, i) => (
              <Photo
                key={n}
                src={`gen/doc/nao-typhoon-${n}.jpg`}
                x={lerp(960, [520, 960, 1400][i], docs)}
                y={lerp(1400, [560, 520, 580][i], docs)}
                w={520}
                h={735}
                rot={[-6, 2, 7][i]}
                border={0}
                seed={"doc" + n}
                grade="contrast(1.02) sepia(0.12)"
                shadow={0.8}
              />
            ))}
          </Layer>
          <Layer depth={1.05}>
            <Photo src="src-photos/typhoon-front.jpg" x={640} y={330} w={520} h={347} rot={-4} seed="p1" reveal={ramp(t, 113.7, 114.4)} revealFrom="top" />
            <Photo src="photos/rafale-landing.jpg" x={1300} y={800} w={560} h={373} rot={3} seed="p2" reveal={ramp(t, 113.95, 114.6)} revealFrom="bottom" />
            <Stamp text="MATURE" p={ramp(t, 116.0, 116.5)} x={1150} y={330} rot={-8} />
            <Stamp text="WELL-KNOWN" p={ramp(t, 116.75, 117.25)} x={720} y={700} rot={5} />
            <Stamp text="DOCUMENTED" p={ramp(t, 119.8, 120.3)} x={1040} y={520} rot={-3} />
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* ------------------------------------------------------------------ S13
 * 121.3–144.2 "That doesn't necessarily mean we're comparing the absolute newest version
 * ... F4 standard ... more advanced radars. So the goal here isn't to take the newest
 * possible version ... It's to compare two solid, relevant, and reasonably comparable configurations."
 * A long version timeline tracked by the camera: chosen standards ringed; newer
 * standards beyond a dashed line; then the two chosen aircraft are set side by side.
 */
const LANE_T = 360;
const LANE_R = 720;
const MARK_T = [
  { x: 360, text: "Tranche 1" },
  { x: 760, text: "Tranche 2" },
  { x: 1120, text: "Tranche 3" },
  { x: 1480, text: "Centurion" },
  { x: 2560, text: "New AESA radars", future: true },
];
const MARK_R = [
  { x: 360, text: "F1" },
  { x: 700, text: "F2" },
  { x: 1040, text: "F3" },
  { x: 1440, text: "F3R" },
  { x: 2480, text: "F4", future: true },
];

export const S13Timeline: React.FC = () => {
  const t = useT();
  const camX = keys(
    t,
    [
      [121.3, 180],
      [123.7, 180],
      [125.3, 1320],
      [133.5, 1320],
      [135.3, 170],
      [138.0, 170],
    ],
    ease.inOut,
  );
  const build = ramp(t, 121.4, 123.0, ease.soft);
  const f4 = ramp(t, 128.8, 129.4);
  const radar = ramp(t, 132.6, 133.3);
  const ghost = ramp(t, 134.3, 135.4);
  const lift = ramp(t, 138.1, 139.4, ease.inOut);
  const solid = ramp(t, 139.5, 139.9);
  const relevant = ramp(t, 140.35, 140.75);
  const comparable = ramp(t, 141.6, 142.0);
  const exit = ramp(t, 143.7, 144.3, ease.in);
  const lanes = 1 - lift * 0.85;
  const ring = ramp(t, 121.9, 122.8, ease.soft);
  return (
    <BlotReveal t={t} start={121.3} dur={0.9} cx={W / 2} cy={H / 2} seed="s13">
      <PaperGround>
        <Camera x={camX - 180} s={1 - exit * 0.08}>
          <Layer>
            <div style={{ opacity: lanes }}>
              <Stage>
                <DrawPath d={`M200,${LANE_T} L3000,${LANE_T}`} p={build} color={C.ink} width={3} />
                <DrawPath d={`M200,${LANE_R} L3000,${LANE_R}`} p={build} color={C.ink} width={3} />
                {/* the edge of our chosen scope */}
                <DrawPath d="M1980,170 L1980,900" p={ramp(t, 124.2, 125.0)} color={C.red} width={3} dash={12} />
                <DrawPath d={scribbleEllipse(1120, LANE_T, 430, 70, "chT")} p={ring} color={C.red} width={5} />
                <DrawPath d={scribbleEllipse(1440, LANE_R, 130, 64, "chR")} p={ramp(t, 122.3, 123.1, ease.soft)} color={C.red} width={5} />
              </Stage>
              {MARK_T.map((m, i) => (
                <Marker key={m.text} x={m.x} y={LANE_T} text={m.text} p={ramp(build, i * 0.15, i * 0.15 + 0.4)} future={m.future} hot={m.future ? radar : 0} ghost={m.future ? ghost : 0} above />
              ))}
              {MARK_R.map((m, i) => (
                <Marker key={m.text} x={m.x} y={LANE_R} text={m.text} p={ramp(build, i * 0.15, i * 0.15 + 0.4)} future={m.future} hot={m.future ? f4 : 0} ghost={m.future ? ghost : 0} />
              ))}
              <At x={120 + 0} y={LANE_T} anchor="left">
                <Label size={24} color={C.inkSoft} weight={600} style={{ opacity: build, transform: "rotate(-90deg)", transformOrigin: "0 0" }}>
                  Typhoon
                </Label>
              </At>
              <At x={120} y={LANE_R + 40} anchor="left">
                <Label size={24} color={C.inkSoft} weight={600} style={{ opacity: build, transform: "rotate(-90deg)", transformOrigin: "0 0" }}>
                  Rafale
                </Label>
              </At>
            </div>
          </Layer>
        </Camera>
        {/* the chosen pair, set side by side at the same scale */}
        <AbsoluteFill style={{ transform: `translateX(${exit * -W}px)` }}>
          <Cutout name="typhoon-side" x={lerp(1110, 540, lift)} y={lerp(LANE_T - 150, 520, lift)} w={lerp(320, 700, lift)} opacity={lift} />
          <Cutout name="rafale-landing" x={lerp(1260, 1380, lift)} y={lerp(LANE_R + 150, 540, lift)} w={lerp(320, 700, lift)} opacity={lift} />
          <Stage>
            <DrawPath d="M240,690 L1700,690" p={ramp(t, 139.0, 140.0, ease.soft)} color={C.ink} width={3} />
          </Stage>
          <At x={W / 2} y={800}>
            <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
              <Tape p={solid} rot={-2}>
                Solid
              </Tape>
              <Tape p={relevant} rot={1}>
                Relevant
              </Tape>
              <Tape p={comparable} rot={-1} dark>
                Comparable
              </Tape>
            </div>
          </At>
        </AbsoluteFill>
      </PaperGround>
    </BlotReveal>
  );
};

const Marker: React.FC<{ x: number; y: number; text: string; p: number; future?: boolean; hot: number; ghost: number; above?: boolean }> = ({ x, y, text, p, future, hot, ghost, above }) => {
  if (p <= 0) return null;
  const fill = future ? (hot > 0 ? C.red : "#e3dccd") : C.ink;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 14,
          top: y - 14,
          width: 28,
          height: 28,
          borderRadius: 14,
          background: fill,
          border: `3px solid ${C.ink}`,
          transform: `scale(${p * (1 + hot * 0.25)})`,
          opacity: 1 - ghost * 0.6,
        }}
      />
      <At x={x} y={y + (above ? -62 : 62)}>
        <div style={{ opacity: p * (future ? 0.45 + hot * 0.55 : 1) * (1 - ghost * 0.55), transform: `scale(${1 + hot * 0.25})` }}>
          <Display size={future ? 64 : 58} color={future && hot > 0 ? C.red : C.ink} style={{ fontFamily: F.condensed }}>
            {text}
          </Display>
        </div>
      </At>
    </>
  );
};
