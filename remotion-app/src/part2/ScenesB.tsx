import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, Vignette } from "../components/Paper";
import { Photo } from "../components/Photo";
import { At, Label, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { Blueprint } from "../components/Blueprint";
import { DrawPath } from "../components/Draw";
import { KeyTitle, recede, springIn } from "../components/AnimeText";
import { C, W, H } from "../lib/theme";
import { ease, keys, lerp, ramp, useT } from "../lib/time";
import { Check, ClipFull, Strike } from "../part1/kit";
import { Icon } from "./kit2";

/* Q07 86.0–92.2 ground attack: RAF Typhoon releases a Paveway IV, then the impact (MOD footage). */
export const Q07Ground: React.FC = () => {
  const t = useT();
  return (
    <TearReveal t={t} start={86.0} dur={0.6} dir="ltr">
      <ClipFull src="p2/pv-impact" t={t} from={86.0} to={92.3} clipDur={9} push={0.06} />
      <At x={W / 2} y={H - 170}>
        <KeyTitle text="Ground attack" t={t} at={87.1} size={110} neon="white" />
      </At>
      <At x={W / 2} y={H - 80}>
        <Rise p={ramp(t, 90.1, 90.6)}>
          <Tape p={1} size={32}>
            A broad range of weapons
          </Tape>
        </Rise>
      </At>
    </TearReveal>
  );
};

/* A weapon card: photo print with its name on a tape. */
const Card: React.FC<{ t: number; at: number; src: string; name: string; x: number; y: number; w: number; h: number; pos?: string; zoom?: number; rot?: number; dark?: boolean }> = ({
  t,
  at,
  src,
  name,
  x,
  y,
  w,
  h,
  pos = "50% 50%",
  zoom = 1.1,
  rot = 0,
  dark,
}) => {
  const r = ramp(t, at - 0.2, at + 0.4);
  const s = springIn(t, at - 0.2, 0.8);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${0.92 + 0.08 * s})`, transformOrigin: `${x}px ${y}px` }}>
      <Photo src={src} x={x} y={y} w={w} h={h} rot={rot} reveal={r} revealFrom="bottom" seed={"c" + name} zoom={zoom} objectPosition={pos} />
      <At x={x} y={y + h / 2 + 8}>
        <Rise p={ramp(t, at + 0.1, at + 0.5)}>
          <Tape p={1} size={30} dark={dark}>
            {name}
          </Tape>
        </Rise>
      </At>
    </div>
  );
};

/* Q08 92.0–99.2 the British Typhoon: Paveway IV, Brimstone, Storm Shadow. */
export const Q08TyphoonKit: React.FC = () => {
  const t = useT();
  return (
    <BlotReveal t={t} start={92.0} dur={0.7} cx={W / 2} cy={H / 2}>
      <PaperGround>
        <Camera s={keys(t, [[92, 1.06], [99.2, 1.0]], ease.soft)} x={keys(t, [[92, -60], [99.2, 40]], ease.soft)}>
          <Layer>
            <Blueprint view="typhoonUnder" x={560} y={500} width={820} p={ramp(t, 92.2, 94.2, ease.linear)} redP={ramp(t, 95.0, 97.8, ease.linear)} lineWidth={2} label="Typhoon FGR4" />
            <Card t={t} at={95.0} src="src-photos/typhoon-paveway.jpg" name="Paveway IV" x={1440} y={210} w={560} h={250} rot={-2} />
            <Card t={t} at={96.4} src="src-photos/brimstone.jpg" name="Brimstone" x={1440} y={520} w={560} h={250} pos="50% 60%" zoom={1.25} rot={1.5} dark />
            <Card t={t} at={97.5} src="src-photos/stormshadow.jpg" name="Storm Shadow" x={1440} y={830} w={560} h={250} pos="50% 8%" zoom={1.3} rot={-1} />
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* Q09 99.1–112.4 the Rafale F3R: guided bombs, AASM, SCALP, Talios for identification, tracking and designation. */
export const Q09RafaleKit: React.FC = () => {
  const t = useT();
  const tags = [
    { at: 109.0, text: "Identification" },
    { at: 110.5, text: "Tracking" },
    { at: 111.2, text: "Designation" },
  ];
  return (
    <TearReveal t={t} start={99.1} dur={0.6} dir="rtl">
      <PaperGround>
        <Camera s={keys(t, [[99.1, 1.06], [106.5, 1.0], [108.6, 1.04], [112.4, 1.06]], ease.soft)} x={keys(t, [[99.1, 60], [106.5, 0], [108.6, 140], [112.4, 160]], ease.inOut)}>
          <Layer>
            <AbsoluteFill style={{ ...recede(ramp(t, 108.4, 109.0) * 0.6, 4, 0.5, 0.04), transformOrigin: "480px 520px" }}>
              <Blueprint view="rafaleTop" x={470} y={490} width={640} p={ramp(t, 99.3, 101.4, ease.linear)} lineWidth={2} label="Rafale F3R" />
            </AbsoluteFill>
            <Card t={t} at={102.4} src="src-photos/rafale-weaponry.jpg" name="Guided bombs" x={1130} y={300} w={440} h={270} pos="62% 72%" zoom={1.5} rot={-2} />
            <Card t={t} at={103.9} src="src-photos/aasm.jpg" name="AASM" x={1610} y={300} w={440} h={270} pos="50% 82%" zoom={1.35} rot={1.5} dark />
            <Card t={t} at={105.6} src="src-photos/rafale-weaponry.jpg" name="SCALP" x={1130} y={690} w={440} h={270} pos="8% 86%" zoom={2.2} rot={1} dark />
            <Card t={t} at={106.8} src="src-photos/talios.jpg" name="Talios" x={1610} y={690} w={440} h={270} pos="84% 84%" zoom={1.9} rot={-1.5} />
            <At x={1610} y={930}>
              <div style={{ display: "flex", gap: 16 }}>
                {tags.map((g, i) => (
                  <Tape key={g.text} p={ramp(t, g.at, g.at + 0.35)} size={26} dark={i === 1}>
                    {g.text}
                  </Tape>
                ))}
              </div>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* Q10 112.3–121.3 not "who carries more" — what mission the weapons allow. */
export const Q10Mission: React.FC = () => {
  const t = useT();
  const pile = ramp(t, 114.4, 115.9, ease.linear);
  const up = ramp(t, 116.4, 117.1, ease.inOut);
  return (
    <BlotReveal t={t} start={112.3} dur={0.7} cx={W / 2} cy={H / 2}>
      <PaperGround dark>
        <Camera s={keys(t, [[112.3, 1.08], [121.3, 1.0]], ease.soft)}>
          <Layer>
            <AbsoluteFill style={{ ...recede(up * 0.75, 6, 0.55, 0.08), transformOrigin: "960px 470px" }}>
              <div style={{ position: "absolute", left: 360, top: 330, width: 1200, display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
                {Array.from({ length: 14 }, (_, i) => (
                  <div key={i} style={{ opacity: pile * 14 > i ? 1 : 0, transform: `translateY(${pile * 14 > i ? 0 : 20}px) rotate(${(random("w" + i) - 0.5) * 16}deg)` }}>
                    <Icon kind="missile" size={120} color={i % 5 === 3 ? "#ff7a62" : C.ink} />
                  </div>
                ))}
              </div>
              <At x={W / 2} y={200}>
                <KeyTitle text="Who carries more" t={t} at={114.6} size={90} />
              </At>
              <Strike x1={W / 2 - 400} x2={W / 2 + 400} y={200} p={ramp(t, 116.0, 116.5)} width={12} />
            </AbsoluteFill>
            <At x={W / 2} y={560}>
              <KeyTitle text="Mission" t={t} at={117.9} size={220} fill neon="red" color={C.red} />
            </At>
            <At x={W / 2} y={760}>
              <Rise p={ramp(t, 119.3, 119.8)}>
                <Tape p={1} size={34}>
                  What the weapons let the aircraft do
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* ---- a road seen from above, shared by Brimstone (map look) and Talios (pod look) ---- */
const ROAD: [number, number][] = [
  [-100, 900],
  [300, 760],
  [700, 690],
  [1100, 560],
  [1500, 470],
  [2050, 300],
];
const roadAt = (u: number): [number, number, number] => {
  const n = ROAD.length - 1;
  const f = Math.max(0, Math.min(0.9999, u)) * n;
  const i = Math.floor(f);
  const k = f - i;
  const [x0, y0] = ROAD[i];
  const [x1, y1] = ROAD[i + 1];
  return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, Math.atan2(y1 - y0, x1 - x0)];
};
// vehicles: start u, speed (u per second); the third is armoured
const VEH = [
  { u0: 0.12, v: 0.018, tank: false },
  { u0: 0.2, v: 0.018, tank: false },
  { u0: 0.3, v: 0.018, tank: true },
  { u0: 0.62, v: 0, tank: false },
];
const vehAt = (i: number, t: number, t0: number) => roadAt(VEH[i].u0 + VEH[i].v * (t - t0));
const Ground: React.FC<{ t: number; t0: number; flir?: boolean }> = ({ t, t0, flir }) => {
  const road = ROAD.map((q) => q.join(",")).join(" ");
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect width={W} height={H} fill={flir ? "#2a2a2a" : "#2d332b"} />
      {Array.from({ length: 40 }, (_, i) => (
        <ellipse key={i} cx={random("gx" + i) * W} cy={random("gy" + i) * H} rx={60 + random("gr" + i) * 180} ry={40 + random("gq" + i) * 120} fill={flir ? `rgba(255,255,255,${0.02 + random("ga" + i) * 0.05})` : `rgba(${80 + random("gc" + i) * 40},${90 + random("gd" + i) * 30},70,0.18)`} />
      ))}
      {/* field boundaries */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={random("fx" + i) * W} y1={0} x2={random("fz" + i) * W} y2={H} stroke={flir ? "rgba(255,255,255,0.06)" : "rgba(200,200,170,0.08)"} strokeWidth={3} />
      ))}
      <polyline points={road} fill="none" stroke={flir ? "#5a5a5a" : "#8c8676"} strokeWidth={46} strokeLinejoin="round" />
      <polyline points={road} fill="none" stroke={flir ? "#6a6a6a" : "#a39c8a"} strokeWidth={4} strokeDasharray="30 30" strokeLinejoin="round" />
      {VEH.map((vh, i) => {
        const [x, y, a] = vehAt(i, t, t0);
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${(a * 180) / Math.PI})`}>
            <rect x={-26} y={-13} width={52} height={26} rx={4} fill={flir ? "#f2f2f2" : "#d9d4c6"} />
            {vh.tank ? (
              <>
                <circle cx={-2} cy={0} r={9} fill={flir ? "#bdbdbd" : "#8f8a7c"} />
                <rect x={4} y={-2.5} width={30} height={5} fill={flir ? "#bdbdbd" : "#8f8a7c"} />
              </>
            ) : (
              <rect x={6} y={-10} width={16} height={20} rx={2} fill={flir ? "#cfcfcf" : "#a7a191"} />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* Q11 121.2–136.2 Brimstone: small ground targets, moving vehicles and armour; a mobile-target option for the Typhoon. */
export const Q11Brimstone: React.FC = () => {
  const t = useT();
  const T0 = 121.2;
  const boxes = ramp(t, 125.8, 126.3);
  const track = ramp(t, 128.0, 128.4);
  return (
    <TearReveal t={t} start={121.2} dur={0.7} dir="ttb">
      <AbsoluteFill>
        <Camera s={keys(t, [[121.2, 1.0], [128, 1.12], [136.2, 1.16]], ease.soft)} x={keys(t, [[121.2, 0], [128, -120], [136.2, -40]], ease.inOut)}>
          <Ground t={t} t0={T0} />
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {VEH.map((_, i) => {
              const [x, y] = vehAt(i, t, T0);
              const locked = i === 2;
              const o = locked ? Math.max(boxes, track) : boxes * (1 - track * 0.7);
              const s = locked && track > 0 ? 44 + 6 * Math.sin(t * 8) : 40;
              return <rect key={i} x={x - s} y={y - s} width={s * 2} height={s * 2} fill="none" stroke={locked && track > 0 ? "#ff6a52" : C.ink} strokeWidth={3} strokeDasharray={locked && track > 0 ? undefined : "10 6"} opacity={o} />;
            })}
            {track > 0 &&
              (() => {
                const [x, y] = vehAt(2, t, T0);
                const trail = Array.from({ length: 12 }, (_, j) => vehAt(2, t - j * 0.25, T0));
                return (
                  <>
                    <polyline points={trail.map((q) => `${q[0]},${q[1]}`).join(" ")} fill="none" stroke="#ff6a52" strokeWidth={3} strokeDasharray="4 8" opacity={track} />
                    <line x1={x} y1={y - 44} x2={x} y2={y - 120} stroke="#ff6a52" strokeWidth={2} opacity={track} />
                  </>
                );
              })()}
          </svg>
          {(() => {
            const [x, y] = vehAt(2, t, T0);
            return (
              <At x={x} y={y - 150}>
                <Rise p={ramp(t, 129.4, 129.9)}>
                  <Tape p={1} size={28} dark>
                    Armoured · moving
                  </Tape>
                </Rise>
              </At>
            );
          })()}
        </Camera>
        <Vignette strength={0.5} />
        <Photo src="src-photos/brimstone.jpg" x={330} y={230} w={440} h={260} rot={-2} reveal={ramp(t, 121.4, 122.0)} revealFrom="left" zoom={1.25} objectPosition="50% 60%" seed="brim" />
        <At x={330} y={410}>
          <KeyTitle text="Brimstone" t={t} at={121.4} size={80} neon="white" />
        </At>
        <At x={W - 360} y={H - 170}>
          <Rise p={ramp(t, 125.8, 126.3)}>
            <Tape p={1} size={30}>
              Small ground targets
            </Tape>
          </Rise>
        </At>
        <At x={W / 2} y={H - 100}>
          <KeyTitle text="Mobile targets" t={t} at={134.3} size={96} neon="red" color="#ffb4a6" />
        </At>
        <At x={W - 360} y={110}>
          <Rise p={ramp(t, 131.6, 132.1)}>
            <Label size={34} color={C.ink} weight={700} style={{ letterSpacing: "0.3em" }}>
              Typhoon
            </Label>
          </Rise>
        </At>
      </AbsoluteFill>
    </TearReveal>
  );
};

/* Q12 136.1–152.4 Talios locates, tracks and designates; AASM, including terminal laser guidance. */
export const Q12Talios: React.FC = () => {
  const t = useT();
  const T0 = 121.2; // same traffic as Brimstone, seen through the pod
  const toDiagram = ramp(t, 143.3, 143.9, ease.inOut);
  const locate = ramp(t, 140.4, 141.1, ease.inOut);
  const trk = ramp(t, 141.3, 141.6);
  const lsr = ramp(t, 141.9, 142.2);
  const [vx, vy] = vehAt(1, t, T0 + 18);
  const cx = lerp(W / 2, vx, locate);
  const cy = lerp(H / 2, vy, locate);
  // AASM diagram
  const release = 145.6;
  const glide = ramp(t, release, 150.2, ease.linear);
  const terminal = ramp(t, 150.4, 151.8, ease.inOut);
  const ax = 330;
  const ay = 300;
  const tx = 1560;
  const ty = 820;
  const traj = `M${ax + 60},${ay + 30} C${ax + 500},${ay - 60} ${tx - 520},${ay + 40} ${tx - 190},${ty - 260}`;
  const final = `M${tx - 190},${ty - 260} L${tx},${ty}`;
  return (
    <BlotReveal t={t} start={136.1} dur={0.7} cx={W / 2} cy={H / 2}>
      <AbsoluteFill style={{ opacity: 1 - toDiagram }}>
        {/* targeting-pod view */}
        <AbsoluteFill style={{ transform: `scale(${2.1 - locate * 0.3}) translate(${W / 2 - cx}px, ${H / 2 - cy}px)`, filter: "contrast(1.25) brightness(0.95)" }}>
          <Ground t={t} t0={T0 + 18} flir />
        </AbsoluteFill>
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 220 }, (_, i) => (
            <rect key={i} x={random(`nx${i}${Math.floor(t * 30)}`) * W} y={random(`ny${i}${Math.floor(t * 30)}`) * H} width={2} height={2} fill="rgba(255,255,255,0.25)" />
          ))}
          <g stroke="rgba(255,255,255,0.85)" strokeWidth={2.5} fill="none">
            <line x1={W / 2 - 260} y1={H / 2} x2={W / 2 - 60} y2={H / 2} />
            <line x1={W / 2 + 60} y1={H / 2} x2={W / 2 + 260} y2={H / 2} />
            <line x1={W / 2} y1={H / 2 - 200} x2={W / 2} y2={H / 2 - 60} />
            <line x1={W / 2} y1={H / 2 + 60} x2={W / 2} y2={H / 2 + 200} />
            {trk > 0 && <rect x={W / 2 - 70} y={H / 2 - 70} width={140} height={140} opacity={trk} />}
          </g>
          {lsr > 0 && <circle cx={W / 2} cy={H / 2} r={10 + 6 * Math.abs(Math.sin(t * 20))} fill="#ffffff" opacity={lsr} />}
          <text x={80} y={120} fill="rgba(255,255,255,0.85)" fontFamily="Fira Sans Condensed, sans-serif" fontWeight={600} fontSize={30} letterSpacing={4}>
            TALIOS · IR
          </text>
          <text x={W - 80} y={120} textAnchor="end" fill="rgba(255,255,255,0.85)" fontFamily="Fira Sans Condensed, sans-serif" fontWeight={600} fontSize={30} letterSpacing={4}>
            {lsr > 0 ? "LASER" : trk > 0 ? "TRACK" : locate > 0 ? "SLEW" : "WIDE"}
          </text>
        </svg>
        <At x={W / 2} y={H - 120}>
          <div style={{ display: "flex", gap: 22 }}>
            <Tape p={ramp(t, 140.4, 140.8)} size={32}>
              Locate
            </Tape>
            <Tape p={ramp(t, 141.3, 141.7)} size={32} dark>
              Track
            </Tape>
            <Tape p={ramp(t, 141.9, 142.3)} size={32}>
              Designate
            </Tape>
          </div>
        </At>
        <At x={W / 2} y={170}>
          <KeyTitle text="Talios" t={t} at={137.6} size={110} neon="white" />
        </At>
      </AbsoluteFill>
      {toDiagram > 0 && (
        <AbsoluteFill style={{ opacity: toDiagram }}>
          <PaperGround dark>
            <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <line x1={0} y1={ty + 6} x2={W} y2={ty + 6} stroke={C.inkSoft} strokeWidth={3} />
              {/* the pod keeps the laser on the target */}
              <line x1={ax + 40} y1={ay + 40} x2={tx} y2={ty} stroke="#ff4a3a" strokeWidth={2} strokeDasharray="4 6" opacity={ramp(t, 149.8, 150.4)} />
              <DrawPath d={traj} p={glide} color={C.ink} width={4} dash={14} />
              <DrawPath d={final} p={terminal} color="#ff6a52" width={6} />
              <g transform={`translate(${tx},${ty})`} opacity={ramp(t, 144.2, 144.6)}>
                <rect x={-26} y={-26} width={52} height={20} fill={C.ink} />
                <path d="M-40,-44 L-40,-54 L-30,-54 M30,-54 L40,-54 L40,-44" stroke="#ff6a52" strokeWidth={3} fill="none" />
              </g>
            </svg>
            <Blueprint view="rafaleSide" x={ax} y={ay} width={300} p={ramp(t, 143.5, 145.0, ease.linear)} lineWidth={1.6} label="Rafale" labelSize={24} />
            <At x={W / 2 + 60} y={170}>
              <KeyTitle text="AASM" t={t} at={147.8} size={120} neon="white" />
            </At>
            <At x={tx - 240} y={ty - 380}>
              <Rise p={ramp(t, 150.4, 150.9)}>
                <Tape p={1} size={32} dark>
                  Terminal laser guidance
                </Tape>
              </Rise>
            </At>
            <At x={W / 2 + 60} y={270}>
              <Rise p={ramp(t, 144.4, 144.9)}>
                <Label size={28} color={C.inkSoft} weight={700} style={{ letterSpacing: "0.26em" }}>
                  F3R standard
                </Label>
              </Rise>
            </At>
          </PaperGround>
        </AbsoluteFill>
      )}
    </BlotReveal>
  );
};

/* Q13 152.4–176.4 Storm Shadow = SCALP; stand-off strike on pre-planned targets; not exclusive to either side. */
export const Q13StandOff: React.FC = () => {
  const t = useT();
  const photo = ramp(t, 157.6, 158.2) * (1 - ramp(t, 163.4, 163.9));
  const diagram = ramp(t, 163.5, 164.1);
  const both = ramp(t, 171.7, 172.2);
  // stand-off geometry
  const launch: [number, number] = [620, 560];
  const target: [number, number] = [1480, 470];
  const fly = ramp(t, 165.2, 166.6, ease.inOut);
  const missile = ramp(t, 166.3, 170.6, ease.linear);
  const turn = ramp(t, 169.4, 171.0, ease.inOut);
  const jetX = lerp(160, launch[0], fly) - turn * 260;
  const jetY = lerp(640, launch[1], fly) + turn * 90;
  const jetA = lerp(-10, 190, turn);
  const mPath = `M${launch[0] + 30},${launch[1]} C${900},${700} ${1120},${360} ${target[0]},${target[1]}`;
  return (
    <TearReveal t={t} start={152.4} dur={0.7} dir="ltr">
      <PaperGround dark>
        <Camera s={keys(t, [[152.4, 1.08], [157.5, 1.0], [163.5, 1.04], [171.7, 1.0]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={H / 2}>
              <KeyTitle text="Long-range strike" t={t} at={153.3} size={120} out={157.3} />
            </At>
            <AbsoluteFill style={{ opacity: photo }}>
              <Photo src="src-photos/stormshadow.jpg" x={W / 2} y={520} w={980} h={560} zoom={1.25} objectPosition="50% 10%" reveal={ramp(t, 157.6, 158.3)} revealFrom="bottom" seed="ss" />
              <At x={380} y={520}>
                <KeyTitle text="Storm Shadow" t={t} at={157.9} size={76} />
              </At>
              <At x={1560} y={520}>
                <KeyTitle text="SCALP" t={t} at={160.0} size={90} color="#ffb4a6" />
              </At>
              <At x={W / 2} y={880}>
                <Rise p={ramp(t, 161.5, 162.0)}>
                  <Tape p={1} size={36} dark>
                    Same missile family
                  </Tape>
                </Rise>
              </At>
            </AbsoluteFill>
            {diagram > 0 && (
              <AbsoluteFill style={{ opacity: diagram * (1 - both * 0.75) }}>
                <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                  {/* the defended area: air-defence coverage around the target */}
                  {[
                    [1450, 480, 250],
                    [1640, 330, 170],
                    [1300, 700, 180],
                  ].map(([x, y, r], i) => (
                    <g key={i} opacity={ramp(t, 164.0 + i * 0.15, 164.5 + i * 0.15)}>
                      <circle cx={x} cy={y} r={r} fill="rgba(201,64,46,0.14)" stroke="#e0503b" strokeWidth={3} strokeDasharray="10 8" />
                      <circle cx={x} cy={y} r={6} fill="#e0503b" />
                    </g>
                  ))}
                  <g transform={`translate(${target[0]},${target[1]})`} opacity={ramp(t, 167.0, 167.4)}>
                    <circle r={26} fill="none" stroke={C.ink} strokeWidth={3} />
                    <path d="M-40,0 L-14,0 M14,0 L40,0 M0,-40 L0,-14 M0,14 L0,40" stroke={C.ink} strokeWidth={3} />
                  </g>
                  <DrawPath d={mPath} p={missile} color={C.ink} width={3.5} dash={12} />
                  <g transform={`translate(${jetX},${jetY}) rotate(${jetA})`} opacity={ramp(t, 164.8, 165.2)}>
                    <path d="M30,0 L-6,-6 L-14,-26 L-22,-26 L-18,-6 L-26,-4 L-26,4 L-18,6 L-22,26 L-14,26 L-6,6 Z" fill={C.ink} />
                  </g>
                </svg>
                <At x={launch[0]} y={launch[1] + 90}>
                  <Rise p={ramp(t, 165.4, 165.9)}>
                    <Tape p={1} size={28}>
                      Launch from outside
                    </Tape>
                  </Rise>
                </At>
                <At x={target[0]} y={target[1] - 90}>
                  <Rise p={ramp(t, 167.4, 167.9)}>
                    <Tape p={1} size={28} dark>
                      Pre-planned target
                    </Tape>
                  </Rise>
                </At>
                <At x={1450} y={820}>
                  <Rise p={ramp(t, 170.4, 170.9)}>
                    <Label size={28} color="#ff9a86" weight={700} style={{ letterSpacing: "0.24em" }}>
                      Heavily defended area
                    </Label>
                  </Rise>
                </At>
              </AbsoluteFill>
            )}
            {both > 0 && (
              <AbsoluteFill style={{ opacity: both }}>
                {[
                  { x: 620, name: "Typhoon", w: "Storm Shadow", at: 172.7 },
                  { x: 1300, name: "Rafale", w: "SCALP", at: 173.0 },
                ].map((k) => (
                  <React.Fragment key={k.name}>
                    <At x={k.x} y={420}>
                      <KeyTitle text={k.name} t={t} at={k.at} size={96} />
                    </At>
                    <At x={k.x} y={530}>
                      <Label size={32} color={C.inkSoft} weight={700} style={{ letterSpacing: "0.24em" }}>
                        {k.w}
                      </Label>
                    </At>
                    <Check x={k.x + 220} y={410} p={ramp(t, k.at + 0.4, k.at + 0.8)} size={70} />
                  </React.Fragment>
                ))}
                <At x={W / 2} y={760}>
                  <KeyTitle text="Not exclusive" t={t} at={174.0} size={110} neon="red" color="#ffb4a6" />
                </At>
              </AbsoluteFill>
            )}
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};
