import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture, Vignette } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Label, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { Blueprint } from "../components/Blueprint";
import { CountUp, KeyTitle, recede } from "../components/AnimeText";
import { ElectronicScan, MechanicalScan } from "../components/Radar";
import { WorldMap, arc, viewAt, type Highlight } from "../map/WorldMap";
import { P, project } from "../map/projection";
import { DrawPath } from "../components/Draw";
import { C, F, W, H } from "../lib/theme";
import { ease, keys, lerp, ramp, useT } from "../lib/time";
import { Bar, ClipFull, Tile } from "./kit";

/* P10 91.4–105.2 British use: QRA scramble (cockpit footage), NATO air policing. */
const BALTIC: Highlight[] = [
  { name: "Estonia", draw: [103.5, 103.9], fill: [103.7, 104.2] },
  { name: "Latvia", draw: [103.6, 104.0], fill: [103.8, 104.3] },
  { name: "Lithuania", draw: [103.7, 104.1], fill: [103.9, 104.4], label: { text: "BALTIC", lon: 24.5, lat: 56.9, size: 56, at: 104.4 } },
];
export const P10QRA: React.FC = () => {
  const t = useT();
  const toMap = ramp(t, 102.7, 103.4, ease.inOut);
  const lon = keys(t, [[102.7, 4], [105.2, 12]], ease.inOut);
  const lat = keys(t, [[102.7, 55], [105.2, 56]], ease.inOut);
  return (
    <TearReveal t={t} start={91.4} dur={0.6} dir="ltr">
      <AbsoluteFill>
        <ClipFull src="rf-takeoff" t={t} from={91.4} to={97.0} clipDur={6} />
        {t >= 96.8 && (
          <BlotReveal t={t} start={96.8} dur={0.6} cx={W / 2} cy={H / 2}>
            <ClipFull src="rf-lowlevel" t={t} from={96.8} to={103.6} clipDur={6} />
          </BlotReveal>
        )}
        <At x={W / 2} y={H - 150}>
          <KeyTitle text="Air defence" t={t} at={93.6} size={100} out={96.6} />
        </At>
        <At x={W / 2} y={H - 150}>
          <KeyTitle text="Quick Reaction Alert" t={t} at={100.9} size={100} neon="white" out={102.7} />
        </At>
        {t > 102.6 && (
          <AbsoluteFill style={{ opacity: toMap }}>
            <WorldMap t={t} view={viewAt(lon, lat, 0.7)} highlights={BALTIC}>
              {(z) => <DrawPath d={arc(P("london"), project(24.75, 59.44), 0.18)} p={ramp(t, 103.4, 104.4)} color="#f7f1e6" width={3 / z} dash={10 / z} />}
            </WorldMap>
            <At x={W / 2} y={H - 140}>
              <KeyTitle text="NATO air policing" t={t} at={103.6} size={90} />
            </At>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </TearReveal>
  );
};

/* P11 105.1–113.6 what matters on QRA: reaction time, availability, climb, interception. */
export const P11Factors: React.FC = () => {
  const t = useT();
  const cells = [
    { at: 107.1, label: "Reaction time", x: 560, y: 330 },
    { at: 108.1, label: "Availability", x: 1360, y: 330 },
    { at: 109.3, label: "Climb performance", x: 560, y: 760 },
    { at: 110.4, label: "Interception", x: 1360, y: 760 },
  ];
  const clock = (p: number) => (
    <svg viewBox="-100 -100 200 200" style={{ position: "absolute", inset: 0, margin: "auto", width: 260, height: 260 }}>
      <circle r={80} fill="none" stroke={C.ink} strokeWidth={5} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} y1={-80} x2={0} y2={-68} stroke={C.ink} strokeWidth={4} transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-62} stroke={C.red} strokeWidth={6} strokeLinecap="round" transform={`rotate(${p * 360 * 2})`} />
      <circle r={7} fill={C.red} />
    </svg>
  );
  return (
    <BlotReveal t={t} start={105.1} dur={0.7} cx={W / 2} cy={H / 2}>
      <PaperGround dark>
        <Camera s={keys(t, [[105.1, 1.06], [113.6, 1.0]], ease.soft)}>
          <Layer>
            {cells.map((c, i) => {
              const p = ramp(t, 105.5 + i * 0.12, 106.0 + i * 0.12);
              const fill = ramp(t, c.at - 0.15, c.at + 0.4);
              const dim = cells[i + 1] ? ramp(t, cells[i + 1].at, cells[i + 1].at + 0.4) * 0.5 * (1 - ramp(t, 111.7, 112.2)) : 0;
              return (
                <Tile key={c.label} x={c.x} y={c.y} w={720} h={380} p={p} label={fill > 0.3 ? c.label : ""} dim={dim}>
                  <AbsoluteFill style={{ opacity: fill, transform: `scale(${1.08 - 0.08 * ease.out(fill)})` }}>
                  {i === 0 && clock(ramp(t, c.at, 113.6, (x) => x))}
                  {i === 1 && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.display, fontSize: 170, color: C.ink, filter: "url(#ink)" }}>24/7</div>
                  )}
                  {i === 2 && <ClipFull src="rf-climb" t={t} from={109.1} to={114.1} clipDur={6} />}
                  {i === 3 && <Img src={staticFile("src-photos/typhoon-su27.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05) saturate(0.8)" }} />}
                  </AbsoluteFill>
                </Tile>
              );
            })}
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* P12 113.5–138.9 engines: EJ200 ~90 kN each (~180 kN), M88 pair ~147 kN. */
export const P12Engines: React.FC = () => {
  const t = useT();
  const bars = ramp(t, 134.3, 135.2);
  const photosBack = ramp(t, 134.2, 134.9) * 0.75;
  const board = ramp(t, 117.6, 118.2, ease.inOut);
  return (
    <TearReveal t={t} start={113.5} dur={0.7} dir="rtl">
      {board < 1 && <ClipFull src="pv-fly" t={t} from={113.5} to={118.4} clipDur={6} push={0.08} />}
      {board < 1 && (
        <At x={W / 2} y={H - 150}>
          <div style={{ opacity: 1 - board }}>
            <KeyTitle text="Engines" t={t} at={114.4} size={120} neon="white" />
          </div>
        </At>
      )}
      <AbsoluteFill style={{ opacity: board }}>
      <PaperGround>
        <Camera s={keys(t, [[117.6, 1.05], [127.5, 1.0], [134.2, 1.02], [138.9, 1.0]], ease.soft)} x={keys(t, [[113.5, -60], [126.8, -60], [128.4, 60], [134.2, 0]], ease.inOut)}>
          <Layer>
            <At x={W / 2} y={120}>
              <KeyTitle text="Engines" t={t} at={117.7} size={96} out={133.9} />
            </At>
            <AbsoluteFill style={{ ...recede(photosBack, 6, 0.55, 0.08), transformOrigin: "960px 520px" }}>
              <Photo src="src-photos/ej200-ab.jpg" x={560} y={470} w={720} h={480} rot={-2} reveal={ramp(t, 118.2, 118.9)} revealFrom="left" seed="ej" />
              <At x={560} y={760}>
                <KeyTitle text="EJ200" t={t} at={118.5} size={90} />
              </At>
              <At x={560} y={880}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                  <CountUp t={t} at={120.9} to={90} suffix=" kN" size={80} color={C.red} neon="red" />
                  <div style={{ opacity: ramp(t, 124.2, 124.6), fontFamily: F.display, fontSize: 60, color: C.inkSoft }}>× 2 ≈</div>
                  <CountUp t={t} at={125.2} to={180} suffix=" kN" size={80} color={C.red} neon="red" />
                </div>
              </At>
              <Photo src="src-photos/m88.jpg" x={1380} y={470} w={680} h={450} rot={2} reveal={ramp(t, 127.6, 128.3)} revealFrom="right" seed="m88" />
              <At x={1380} y={760}>
                <KeyTitle text="M88 × 2" t={t} at={128.5} size={90} />
              </At>
              <At x={1380} y={880}>
                <CountUp t={t} at={131.9} to={147} suffix=" kN" size={80} color={C.ink} />
              </At>
            </AbsoluteFill>
            <AbsoluteFill style={{ opacity: bars }}>
              <Bar x={260} y={380} w={1100} value={180} max={200} p={ramp(t, 134.9, 136.0)} label="Typhoon · 2 × EJ200" color={C.red} right={<CountUp t={t} at={135.0} to={180} suffix=" kN" size={70} color={C.red} neon="red" />} />
              <Bar x={260} y={560} w={1100} value={147} max={200} p={ramp(t, 135.2, 136.3)} label="Rafale · 2 × M88" color={C.ink} right={<CountUp t={t} at={135.3} to={147} suffix=" kN" size={70} />} />
              <At x={W / 2} y={820}>
                <KeyTitle text="Maximum thrust" t={t} at={135.6} size={80} />
              </At>
            </AbsoluteFill>
          </Layer>
        </Camera>
      </PaperGround>
      </AbsoluteFill>
    </TearReveal>
  );
};

/* P13 138.8–151.0 numbers alone say little: weight, altitude, fuel, weapons, drag. */
export const P13Behaviour: React.FC = () => {
  const t = useT();
  const words = [
    { w: "Weight", at: 143.3, x: 360, y: 250 },
    { w: "Altitude", at: 143.9, x: 1560, y: 250 },
    { w: "Fuel load", at: 144.9, x: 330, y: 820 },
    { w: "Weapons", at: 145.7, x: 1590, y: 820 },
    { w: "Drag", at: 146.5, x: 960, y: 950 },
  ];
  const sink = ramp(t, 143.3, 144.2, ease.inOut) * 30;
  const drag = ramp(t, 146.5, 147.2);
  return (
    <BlotReveal t={t} start={138.8} dur={0.8} cx={W / 2} cy={H / 2}>
      <PaperGround>
        <Camera s={keys(t, [[138.8, 1.1], [142.5, 1.0], [151, 1.04]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={160}>
              <KeyTitle text="Actual performance?" t={t} at={141.5} size={90} out={143.1} />
            </At>
            <Blueprint view="typhoonUnder" x={W / 2} y={520 + sink} width={900} p={ramp(t, 139.0, 141.4, ease.linear)} redP={ramp(t, 144.9, 146.2, ease.linear)} lineWidth={1.4} fill={C.paper} fillP={1} />
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
              {/* drag: airflow lines bending round the airframe */}
              {Array.from({ length: 9 }, (_, i) => {
                const y = 300 + i * 55;
                const off = ((t * 900 + i * 173) % 2400) - 300;
                return <path key={i} d={`M${2100 - off},${y} C${1500 - off},${y} ${1300 - off},${y + (i < 4 ? -30 : 30)} ${700 - off},${y + (i < 4 ? -30 : 30)}`} fill="none" stroke={C.inkSoft} strokeWidth={2} strokeDasharray="30 20" opacity={drag * 0.6} />;
              })}
            </svg>
            {words.map((w) => (
              <At key={w.w} x={w.x} y={w.y}>
                <Rise p={ramp(t, w.at, w.at + 0.4)}>
                  <Tape p={1} size={40} dark={w.w === "Weapons" || w.w === "Weight"}>
                    {w.w}
                  </Tape>
                </Rise>
              </At>
            ))}
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* P14 151.0–157.4 clean airshow display vs loaded for combat (split screen). */
export const P14CleanLoaded: React.FC = () => {
  const t = useT();
  const split = ramp(t, 151.0, 151.7, ease.inOut);
  const right = ramp(t, 155.4, 156.0, ease.inOut);
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${(1 - split) * 100}%)` }}>
      <PaperGround dark>
        <AbsoluteFill style={{ clipPath: `inset(0 ${lerp(0, 50, right)}% 0 0)` }}>
          <Img src={staticFile("src-photos/rafale-vapor.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${keys(t, [[151, 1.15], [157.4, 1.05]], ease.soft)})`, filter: "contrast(1.05) saturate(0.85)" }} />
          <PrintTexture opacity={0.2} />
          <At x={lerp(W / 2, W / 4, right)} y={H - 140}>
            <Tape p={ramp(t, 152.7, 153.2)} size={36}>
              Airshow · clean
            </Tape>
          </At>
        </AbsoluteFill>
        {right > 0 && (
          <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${lerp(100, 50, right)}%)` }}>
            <AbsoluteFill style={{ left: "25%" }}>
              <ClipFull src="rr-loaded" t={t} from={155.3} to={157.5} clipDur={7} />
            </AbsoluteFill>
            <At x={W * 0.75} y={H - 140}>
              <Tape p={ramp(t, 155.8, 156.3)} size={36} dark>
                Loaded for combat
              </Tape>
            </At>
          </AbsoluteFill>
        )}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, marginLeft: -2, background: C.offWhite, opacity: right }} />
        <Vignette strength={0.4} />
      </PaperGround>
    </AbsoluteFill>
  );
};

/* P15 157.3–181.0 radar: RBE2 AESA (electronic) vs CAPTOR-M (mechanical); advantage Rafale. */
export const P15Radar: React.FC = () => {
  const t = useT();
  const adv = ramp(t, 178.5, 179.3);
  const board = ramp(t, 161.3, 161.9, ease.inOut);
  return (
    <TearReveal t={t} start={157.3} dur={0.7} dir="ttb">
      {board < 1 && <ClipFull src="rr-approach" t={t} from={157.3} to={162.0} clipDur={6} push={0.1} />}
      {board < 1 && (
        <At x={W / 2} y={H - 150}>
          <div style={{ opacity: 1 - board }}>
            <KeyTitle text="Sensors" t={t} at={158.0} size={120} neon="white" />
          </div>
        </At>
      )}
      <AbsoluteFill style={{ opacity: board }}>
      <PaperGround dark>
        <Camera s={keys(t, [[161.3, 1.05], [162.5, 1.0], [178.4, 1.0], [181, 1.06]], ease.soft)} x={keys(t, [[162, 0], [163.4, -110], [169.9, -110], [171, 110], [176.5, 110], [178.4, 0]], ease.inOut)}>
          <Layer>
            <At x={W / 2} y={150}>
              <KeyTitle text="Radar" t={t} at={161.9} size={130} neon="white" out={163.3} />
            </At>
            {/* Rafale F3R: AESA (left) */}
            <AbsoluteFill style={{ opacity: ramp(t, 163.0, 163.6), ...recede(ramp(t, 170.2, 170.8) * 0.6 * (1 - ramp(t, 176.5, 177.2)), 4, 0.5, 0.04), transformOrigin: "560px 560px" }}>
              <Cutout name="rbe2" x={340} y={560} w={340} rot={-3} />
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                <ElectronicScan x={640} y={560} scale={0.9} time={t} p={ramp(t, 166.2, 166.8)} />
              </svg>
              <At x={560} y={830}>
                <KeyTitle text="RBE2 AESA" t={t} at={167.8} size={80} neon={adv > 0 ? "red" : "white"} />
              </At>
              <At x={560} y={910}>
                <Label size={24} color="#e8b3a6" weight={600}>
                  Rafale F3R · electronically scanned
                </Label>
              </At>
            </AbsoluteFill>
            {/* Typhoon FGR4: CAPTOR-M (right) */}
            <AbsoluteFill style={{ opacity: ramp(t, 170.3, 170.9), ...recede(adv * 0.7, 5, 0.55, 0.05), transformOrigin: "1400px 560px" }}>
              <Cutout name="captor" x={1180} y={560} w={380} rot={3} />
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                <MechanicalScan x={1480} y={560} scale={0.9} time={t} p={ramp(t, 173.9, 174.5)} />
              </svg>
              <At x={1400} y={830}>
                <KeyTitle text="CAPTOR-M" t={t} at={175.0} size={80} />
              </At>
              <At x={1400} y={910}>
                <Label size={24} color="#c9c2b2" weight={600}>
                  Typhoon FGR4 · mechanically scanned
                </Label>
              </At>
            </AbsoluteFill>
            <At x={560} y={230}>
              <Rise p={adv}>
                <Tape p={1} size={36}>
                  Technological advantage
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
      </AbsoluteFill>
    </TearReveal>
  );
};

/* P16 181.0–194.2 AESA: one fixed array steers its beam electronically, interleaving search and
 * tracking; but that does not give a fixed detection distance. */
const ARRAY = { x: 380, y: 560, r: 175 };
const MODULES = (() => {
  const out: { x: number; y: number }[] = [];
  for (let gy = -ARRAY.r; gy <= ARRAY.r; gy += 22) for (let gx = -ARRAY.r; gx <= ARRAY.r; gx += 22) if (Math.hypot(gx, gy) < ARRAY.r - 12) out.push({ x: gx, y: gy });
  return out;
})();
const beamPath = (angle: number, len: number, half = 3) => {
  const a1 = ((angle - half) * Math.PI) / 180;
  const a2 = ((angle + half) * Math.PI) / 180;
  const { x, y } = ARRAY;
  return `M${x},${y} L${x + Math.cos(a1) * len},${y + Math.sin(a1) * len} L${x + Math.cos(a2) * len},${y + Math.sin(a2) * len} Z`;
};
const Target: React.FC<{ x: number; y: number; p: number; lock: number }> = ({ x, y, p, lock }) =>
  p <= 0 ? null : (
    <g opacity={p} transform={`translate(${x},${y})`}>
      {/* a small aircraft glyph heading left, towards the radar */}
      <path d="M-22,0 L10,-4 L14,-18 L20,-18 L20,-3 L26,-2 L26,2 L20,3 L20,18 L14,18 L10,4 Z" fill={C.offWhite} />
      <g opacity={lock} stroke={C.red} strokeWidth={3} fill="none">
        <path d="M-40,-28 L-40,-40 L-28,-40 M28,-40 L40,-40 L40,-28 M40,28 L40,40 L28,40 M-28,40 L-40,40 L-40,28" />
      </g>
    </g>
  );
export const P16Flexible: React.FC = () => {
  const t = useT();
  const on = ramp(t, 181.3, 182.0);
  const tracks = ramp(t, 186.8, 187.4);
  const noRange = ramp(t, 189.7, 190.4);
  // search: a smooth sweep; tracking: two beams taking turns on two targets (time-shared)
  const search = -6 + 26 * Math.sin((t - 181) * 1.25);
  const t1 = { x: 1450 + Math.sin(t * 0.7) * 50, y: 330 + Math.cos(t * 0.5) * 40 };
  const t2 = { x: 1620 + Math.cos(t * 0.6) * 40, y: 760 + Math.sin(t * 0.8) * 40 };
  const ang = (p: { x: number; y: number }) => (Math.atan2(p.y - ARRAY.y, p.x - ARRAY.x) * 180) / Math.PI;
  const share = Math.sin(t * 5);
  const b1 = tracks * (0.15 + 0.55 * Math.max(0, share));
  const b2 = tracks * (0.15 + 0.55 * Math.max(0, -share));
  // the steering angle drives a phase gradient across the fixed array face
  const steer = (tracks > 0 && Math.abs(share) > 0.3 ? (share > 0 ? ang(t1) : ang(t2)) : search) * (Math.PI / 180);
  const range = 900 + Math.sin(t * 1.7) * 170 + Math.sin(t * 0.9 + 1) * 90;
  return (
    <BlotReveal t={t} start={181.0} dur={0.7} cx={ARRAY.x} cy={ARRAY.y}>
      <PaperGround dark>
        <Camera s={keys(t, [[181, 1.08], [189.6, 1.0], [194.2, 1.04]], ease.soft)}>
          <Layer>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
              <g opacity={on * (1 - noRange * 0.45)}>
                <path d={beamPath(search, 1500, 5)} fill="#f4d9b8" opacity={0.28 * (1 - tracks * 0.35)} />
                {tracks > 0 && <path d={beamPath(ang(t1), Math.hypot(t1.x - ARRAY.x, t1.y - ARRAY.y), 2)} fill="#ff8a70" opacity={b1} />}
                {tracks > 0 && <path d={beamPath(ang(t2), Math.hypot(t2.x - ARRAY.x, t2.y - ARRAY.y), 2)} fill="#ff8a70" opacity={b2} />}
              </g>
              {/* the array does not move: each module's phase steers the beam */}
              <g opacity={on}>
                <circle cx={ARRAY.x} cy={ARRAY.y} r={ARRAY.r} fill="#22272b" stroke={C.offWhite} strokeWidth={3} />
                {MODULES.map((m, i) => {
                  const ph = (m.x * Math.cos(steer) + m.y * Math.sin(steer)) * 0.045 - t * 9;
                  const v = 0.25 + 0.75 * Math.max(0, Math.cos(ph));
                  return <rect key={i} x={ARRAY.x + m.x - 8} y={ARRAY.y + m.y - 8} width={16} height={16} fill={`rgba(244,217,184,${v * 0.85})`} />;
                })}
              </g>
              <Target x={t1.x} y={t1.y} p={ramp(t, 186.8, 187.3)} lock={ramp(t, 187.3, 187.7) * (0.4 + Math.max(0, share) * 0.6)} />
              <Target x={t2.x} y={t2.y} p={ramp(t, 187.0, 187.5)} lock={ramp(t, 187.5, 187.9) * (0.4 + Math.max(0, -share) * 0.6)} />
              {/* no fixed detection range: the edge of detection will not settle */}
              {noRange > 0 && (
                <path
                  d={`M${ARRAY.x + Math.cos(-0.6) * range},${ARRAY.y + Math.sin(-0.6) * range} A${range},${range} 0 0 1 ${ARRAY.x + Math.cos(0.6) * range},${ARRAY.y + Math.sin(0.6) * range}`}
                  fill="none"
                  stroke={C.offWhite}
                  strokeWidth={3}
                  strokeDasharray="16 12"
                  opacity={noRange * 0.7}
                />
              )}
            </svg>
            <At x={ARRAY.x} y={ARRAY.y + ARRAY.r + 60}>
              <Rise p={ramp(t, 182.3, 182.8)}>
                <Label size={26} color={C.inkSoft} weight={600} style={{ letterSpacing: "0.2em" }}>
                  Fixed array · steered electronically
                </Label>
              </Rise>
            </At>
            <At x={1180} y={940}>
              <div style={{ display: "flex", gap: 24 }}>
                <Tape p={ramp(t, 188.1, 188.6)} size={36}>
                  Search
                </Tape>
                <Tape p={ramp(t, 188.8, 189.3)} size={36} dark>
                  Track
                </Tape>
              </div>
            </At>
            <At x={W / 2 + 180} y={150}>
              <KeyTitle text="Flexibility" t={t} at={184.1} size={100} out={189.5} />
            </At>
            <At x={W / 2 + 180} y={150}>
              <KeyTitle text="No fixed detection range" t={t} at={191.6} size={86} neon="white" />
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};
