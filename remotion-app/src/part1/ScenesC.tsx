import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, Vignette } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Label, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { Blueprint } from "../components/Blueprint";
import { KeyTitle, recede, springIn } from "../components/AnimeText";
import { DrawPath } from "../components/Draw";
import { C, F, W, H } from "../lib/theme";
import { ease, keys, ramp, useT } from "../lib/time";
import { Clip, ClipFull, ClipPrint, Tile } from "./kit";
import { Jet3D, PIRATE_POS, project as projectJet, useJetCamera } from "../components/Jet3D";

/* P17 194.1–207.5 who detects first: six factors named in the narration. */
const Static: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width="100%" height="100%" viewBox="0 0 72 40" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 180 }, (_, i) => (
        <rect key={i} x={(i % 18) * 4} y={Math.floor(i / 18) * 4} width={4} height={4} fill={`rgba(235,227,210,${random(`s${f}-${i}`) * 0.5})`} />
      ))}
    </svg>
  );
};
export const P17WhoFirst: React.FC = () => {
  const t = useT();
  const cells = [
    { at: 198.3, label: "Position", x: 360, y: 400 },
    { at: 199.1, label: "Altitude", x: 960, y: 400 },
    { at: 200.3, label: "Radar signature", x: 1560, y: 400 },
    { at: 201.9, label: "Electronic interference", x: 360, y: 790 },
    { at: 203.7, label: "Radar mode", x: 960, y: 790 },
    { at: 204.5, label: "Other platforms", x: 1560, y: 790 },
  ];
  return (
    <TearReveal t={t} start={194.1} dur={0.7} dir="ltr">
      <PaperGround dark>
        <Camera s={keys(t, [[194.1, 1.12], [197.8, 1.0], [207.5, 1.03]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={keys(t, [[194.1, 520], [197.3, 520], [198.1, 120]], ease.inOut)}>
              <div style={{ transform: `scale(${keys(t, [[194.1, 1.7], [197.3, 1.55], [198.1, 1]], ease.inOut)})` }}>
                <KeyTitle text="Who detects whom first?" t={t} at={194.3} size={78} neon="white" />
              </div>
            </At>
            {cells.map((c, i) => {
              const p = ramp(t, c.at - 0.15, c.at + 0.4);
              const s = springIn(t, c.at - 0.15, 0.8);
              return (
                <div key={c.label} style={{ position: "absolute", inset: 0, transform: `scale(${0.9 + s * 0.1})`, transformOrigin: `${c.x}px ${c.y}px` }}>
                  <Tile x={c.x} y={c.y} w={540} h={340} p={p} label={c.label}>
                    {i === 0 && (
                      <svg viewBox="0 0 560 330" style={{ width: "100%", height: "100%" }}>
                        <circle cx={200} cy={170} r={10} fill={C.red} />
                        <circle cx={380} cy={130} r={10} fill={C.offWhite} />
                        <line x1={200} y1={170} x2={380} y2={130} stroke={C.offWhite} strokeDasharray="8 8" opacity={0.6} />
                        {[60, 110].map((r) => (
                          <circle key={r} cx={200} cy={170} r={r} fill="none" stroke={C.red} opacity={0.35} />
                        ))}
                      </svg>
                    )}
                    {i === 1 && (
                      <svg viewBox="0 0 560 330" style={{ width: "100%", height: "100%" }}>
                        {Array.from({ length: 8 }, (_, k) => (
                          <line key={k} x1={80} y1={40 + k * 30} x2={k % 4 === 0 ? 130 : 110} y2={40 + k * 30} stroke={C.ink} strokeWidth={3} />
                        ))}
                        <path d="M160,260 C260,250 330,140 480,70" fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="12 8" />
                      </svg>
                    )}
                    {i === 2 && <Blueprint view="typhoonFront" x={280} y={140} width={300} p={1} color={C.offWhite} lineWidth={1.1} />}
                    {i === 3 && <Static />}
                    {i === 4 && (
                      <svg viewBox="0 0 560 330" style={{ width: "100%", height: "100%" }}>
                        {[-30, 0, 30].map((a, k) => (
                          <path key={a} d={`M120,160 L${120 + Math.cos(((a - 4) * Math.PI) / 180) * 380},${160 + Math.sin(((a - 4) * Math.PI) / 180) * 380} L${120 + Math.cos(((a + 4) * Math.PI) / 180) * 380},${160 + Math.sin(((a + 4) * Math.PI) / 180) * 380} Z`} fill="#f4d9b8" opacity={Math.floor(t * 3) % 3 === k ? 0.55 : 0.08} />
                        ))}
                      </svg>
                    )}
                    {i === 5 && <Clip src="aw-network" from={204.4} to={207.6} clipDur={5} />}
                  </Tile>
                </div>
              );
            })}
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* P18 207.4–217.6 no public head-to-head test under identical conditions. */
export const P18NoTest: React.FC = () => {
  const t = useT();
  const stamp = ramp(t, 210.8, 211.3);
  const s = 1.7 - ease.out(Math.min(1, stamp * 1.5)) * 0.7;
  return (
    <BlotReveal t={t} start={207.4} dur={0.7} cx={W / 2} cy={H / 2}>
      <PaperGround>
        <Camera x={keys(t, [[207.4, -80], [217.6, 80]], ease.soft)} s={keys(t, [[207.4, 1.08], [217.6, 1.0]], ease.soft)}>
          <Layer depth={0.9}>
            {[1, 2, 3].map((n, i) => (
              <Photo key={n} src={`gen/doc/nao-typhoon-${n}.jpg`} x={[560, 960, 1360][i]} y={[540, 500, 560][i]} w={460} h={650} rot={[-5, 1, 6][i]} border={0} seed={"nt" + n} reveal={ramp(t, 207.6 + i * 0.2, 208.2 + i * 0.2)} revealFrom="bottom" grade="contrast(1.03) sepia(0.1)" />
            ))}
          </Layer>
          <Layer>
            <At x={W / 2} y={560} rot={-7}>
              <div style={{ transform: `scale(${s})`, opacity: Math.min(1, stamp * 3) * 0.92, border: `7px solid ${C.red}`, padding: "10px 30px 4px", fontFamily: F.display, fontSize: 92, color: C.red, letterSpacing: "0.04em", filter: "url(#ink)", background: "rgba(20,20,20,0.35)" }}>
                NO HEAD-TO-HEAD TEST
              </div>
            </At>
            <At x={W / 2} y={880}>
              <Rise p={ramp(t, 211.8, 212.4)}>
                <Tape p={1} size={32} dark>
                  Identical conditions
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* P19 217.4–230.0 PIRATE, on a 3D Typhoon: the model turns to show the nose, the camera
 * pushes in to the sensor ahead of the windscreen (port side), and heat from a target ahead
 * arrives at it — nothing is transmitted. */
export const P19Pirate: React.FC = () => {
  const t = useT();
  const cam = useJetCamera(t, 217.4, { yaw: 132, pitch: 30, zoom: 0.9, focus: 0 }, [
    { at: 0, to: { yaw: 56, pitch: 27 }, dur: 3.6, ease: "inOutSine" },
    { at: 3.7, to: { yaw: 44, pitch: 15, zoom: 2.7, focus: 1 }, dur: 1.7, ease: "inOutQuart" },
    { at: 5.5, to: { yaw: 34, pitch: 12 }, dur: 7.2, ease: "linear" },
  ]);
  const CX = 820;
  const CY = 600;
  const SCALE = 64;
  const passive = ramp(t, 226.1, 226.7);
  const noEmit = ramp(t, 228.2, 228.8);
  const sensor = projectJet(PIRATE_POS, cam, CX, CY, SCALE);
  const nose = projectJet([9.5, -0.5, 0.66], cam, CX, CY, SCALE);
  const dir = Math.atan2(nose.y - sensor.y, nose.x - sensor.x);
  const leader = ramp(t, 221.6, 222.2);
  return (
    <TearReveal t={t} start={217.4} dur={0.7} dir="rtl">
      <PaperGround dark>
        <Jet3D cam={cam} cx={CX} cy={CY} scale={SCALE} sensorGlow={ramp(t, 221.2, 221.8) * (0.6 + passive * 0.4)} />
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
          {/* heat arriving from ahead of the nose: arcs close in on the sensor (passive) */}
          {passive > 0 &&
            [0, 1, 2, 3].map((i) => {
              const ph = (t * 0.8 + i * 0.25) % 1;
              const r = 40 + 620 * (1 - ph);
              const a0 = dir - 0.5;
              const a1 = dir + 0.5;
              return (
                <path
                  key={i}
                  d={`M${sensor.x + Math.cos(a0) * r},${sensor.y + Math.sin(a0) * r} A${r},${r} 0 0 1 ${sensor.x + Math.cos(a1) * r},${sensor.y + Math.sin(a1) * r}`}
                  fill="none"
                  stroke="#ff9a5a"
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={passive * Math.sin(ph * Math.PI) * 0.85}
                />
              );
            })}
          {/* leader from the name to the sensor head */}
          {leader > 0 && <line x1={1250} y1={330} x2={1250 + (sensor.x + 24 - 1250) * leader} y2={330 + (sensor.y - 12 - 330) * leader} stroke="#ffb27a" strokeWidth={2.5} strokeDasharray="3 9" strokeLinecap="round" />}
        </svg>
        <At x={CX} y={930}>
          <div style={{ opacity: ramp(t, 218.0, 218.5) * (1 - ramp(t, 221.0, 221.5)) }}>
            <Label size={34} color={C.ink} weight={700} style={{ letterSpacing: "0.34em" }}>
              Typhoon FGR4
            </Label>
          </div>
        </At>
        <At x={1500} y={250}>
          <KeyTitle text="PIRATE" t={t} at={221.2} size={140} neon="red" color="#ffb08a" />
        </At>
        <At x={1500} y={360}>
          <Rise p={ramp(t, 222.3, 222.9)}>
            <Label size={30} color={C.offWhite} weight={600}>
              Infrared search &amp; track
            </Label>
          </Rise>
        </At>
        <At x={1500} y={450}>
          <Rise p={passive}>
            <Tape p={1} size={34}>
              Passive
            </Tape>
          </Rise>
        </At>
        <At x={1500} y={530}>
          <Rise p={noEmit}>
            <Tape p={1} size={30} dark>
              No radar emissions
            </Tape>
          </Rise>
        </At>
        <Vignette strength={0.45} />
      </PaperGround>
    </TearReveal>
  );
};

/* P20 229.9–249.0 METEOR: energy kept to the end; both aircraft carry it. */
export const P20Meteor: React.FC = () => {
  const t = useT();
  const graph = ramp(t, 238.0, 240.8, ease.inOut);
  const endgame = ramp(t, 241.6, 242.4);
  const both = ramp(t, 244.1, 244.8);
  const gx = (u: number) => 760 + u * 980;
  const conv = Array.from({ length: 50 }, (_, i) => {
    const u = i / 49;
    const e = u < 0.12 ? u / 0.12 : Math.exp(-(u - 0.12) * 2.6);
    return `${i ? "L" : "M"}${gx(u)},${820 - e * 480}`;
  }).join("");
  const ram = Array.from({ length: 50 }, (_, i) => {
    const u = i / 49;
    const e = u < 0.12 ? u / 0.12 : 1 - (u - 0.12) * 0.18;
    return `${i ? "L" : "M"}${gx(u)},${820 - e * 480}`;
  }).join("");
  return (
    <BlotReveal t={t} start={229.9} dur={0.7} cx={W / 2} cy={H / 2}>
      <PaperGround dark>
        <Camera s={keys(t, [[229.9, 1.06], [244, 1.0], [249, 1.03]], ease.soft)}>
          <Layer>
            <AbsoluteFill style={{ opacity: ramp(t, 230.3, 230.8) * (1 - ramp(t, 235.0, 235.6)), transform: `scale(${1 + ramp(t, 235.0, 235.6) * 0.06})` }}>
              <At x={W / 2} y={150}>
                <KeyTitle text="Long-range air-to-air" t={t} at={230.7} size={90} />
              </At>
              <Blueprint view="typhoonTop" x={560} y={520} width={680} p={ramp(t, 230.5, 232.6, ease.linear)} color={C.ink} lineWidth={2} label="Typhoon" />
              <Blueprint view="rafaleTop" x={1360} y={520} width={620} p={ramp(t, 231.0, 233.1, ease.linear)} color={C.ink} lineWidth={2} label="Rafale" />
              <At x={W / 2} y={940}>
                <Rise p={ramp(t, 233.3, 233.8)}>
                  <Tape p={1} size={36} dark>
                    One shared capability
                  </Tape>
                </Rise>
              </At>
            </AbsoluteFill>
            <AbsoluteFill style={{ ...recede(both * 0.85, 6, 0.6, 0.06), transformOrigin: "960px 540px" }}>
              <Cutout name="meteor" x={400} y={380} w={620} rot={-4} opacity={ramp(t, 235.6, 236.0)} scale={0.85 + springIn(t, 235.6) * 0.15} />
              <At x={400} y={560}>
                <KeyTitle text="Meteor" t={t} at={235.7} size={120} neon="white" />
              </At>
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                <line x1={760} y1={820} x2={1780} y2={820} stroke={C.ink} strokeWidth={3} opacity={graph} />
                <line x1={760} y1={820} x2={760} y2={300} stroke={C.ink} strokeWidth={3} opacity={graph} />
                <rect x={gx(0.72)} y={300} width={gx(1) - gx(0.72)} height={520} fill={C.red} opacity={endgame * 0.12} />
                <DrawPath d={conv} p={graph} color={C.inkSoft} width={4} dash={10} />
                <DrawPath d={ram} p={graph} color={C.red} width={6} />
              </svg>
              <At x={gx(0.86)} y={270}>
                <Rise p={endgame}>
                  <Label size={24} color="#e8b3a6" weight={600}>
                    Final phase
                  </Label>
                </Rise>
              </At>
              <At x={780} y={280} anchor="left">
                <Label size={22} color={C.inkSoft} weight={600} style={{ opacity: graph }}>
                  Energy
                </Label>
              </At>
              <At x={1780} y={860} anchor="right">
                <Label size={22} color={C.inkSoft} weight={600} style={{ opacity: graph }}>
                  Flight time
                </Label>
              </At>
              <At x={gx(0.55)} y={gx(0) > 0 ? 330 : 330}>
                <Rise p={ramp(t, 239.0, 239.5)}>
                  <Tape p={1} size={28}>
                    Ramjet: energy retained
                  </Tape>
                </Rise>
              </At>
            </AbsoluteFill>
            {/* both fighters carry it: the tie stays */}
            <AbsoluteFill style={{ opacity: both }}>
              <Blueprint view="typhoonTop" x={560} y={470} width={640} p={ramp(t, 244.2, 245.8, ease.linear)} color={C.ink} lineWidth={2} label="Typhoon" />
              <Blueprint view="rafaleTop" x={1360} y={470} width={580} p={ramp(t, 244.4, 246.0, ease.linear)} color={C.ink} lineWidth={2} label="Rafale" />
              <Cutout name="meteor" x={560} y={860} w={300} sticker opacity={ramp(t, 246.9, 247.3)} />
              <Cutout name="meteor" x={1360} y={860} w={300} sticker opacity={ramp(t, 247.1, 247.5)} />
              <At x={W / 2} y={500}>
                <KeyTitle text="=" t={t} at={246.9} size={160} color={C.red} />
              </At>
            </AbsoluteFill>
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* P21 248.9–264.1 where the clearer difference is: interception vs radar architecture. */
export const P21Difference: React.FC = () => {
  const t = useT();
  const left = ramp(t, 252.3, 253.0, ease.inOut);
  const right = ramp(t, 252.6, 253.3, ease.inOut);
  const focus = ramp(t, 257.8, 258.5, ease.inOut);
  return (
    <TearReveal t={t} start={248.9} dur={0.7} dir="ltr">
      <PaperGround dark>
        <At x={W / 2} y={H / 2}>
          <KeyTitle text="The clearer difference" t={t} at={249.3} size={100} out={252.1} />
        </At>
        <AbsoluteFill style={{ clipPath: `inset(0 ${100 - left * 50}% 0 0)` }}>
          <AbsoluteFill style={{ filter: `blur(${focus * 3}px) brightness(${1 - focus * 0.35})` }}>
            <ClipFull src="rf-formation" t={t} from={252.2} to={264.2} clipDur={7} />
          </AbsoluteFill>
          <At x={W / 4} y={H - 170}>
            <KeyTitle text="Interception" t={t} at={255.5} size={76} />
          </At>
          <At x={W / 4} y={H - 90}>
            <Tape p={ramp(t, 256.6, 257.1)} size={30}>
              Air defence
            </Tape>
          </At>
          <At x={W / 4} y={120}>
            <Label size={30} color={C.offWhite} weight={600} style={{ letterSpacing: "0.4em", opacity: left }}>
              Typhoon
            </Label>
          </At>
        </AbsoluteFill>
        {right > 0 && (
          <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${100 - right * 50}%)` }}>
            <AbsoluteFill style={{ left: "25%", filter: `blur(${(1 - focus) * 6}px) brightness(${0.45 + focus * 0.55})` }}>
              {t < 258.6 && <ClipFull src="rr-approach" t={t} from={252.5} to={258.6} clipDur={6} />}
              {t >= 258.0 && (
                <AbsoluteFill style={{ opacity: ramp(t, 258.0, 258.6) }}>
                  <ClipFull src="rr-bank" t={t} from={258.0} to={264.2} clipDur={4} />
                </AbsoluteFill>
              )}
            </AbsoluteFill>
            <At x={W * 0.75} y={H - 170}>
              <KeyTitle text="Radar architecture" t={t} at={262.6} size={76} neon="red" />
            </At>
            <At x={W * 0.75} y={120}>
              <Label size={30} color={C.offWhite} weight={600} style={{ letterSpacing: "0.4em", opacity: focus }}>
                Rafale F3R
              </Label>
            </At>
          </AbsoluteFill>
        )}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, marginLeft: -2, background: C.offWhite, opacity: right }} />
      </PaperGround>
    </TearReveal>
  );
};

/* P22 264.0–end: none of it works in isolation — the wider network. */
const NODES = [
  { at: 268.5, label: "External sensors", x: 380, y: 250, clip: "aw-flyover" },
  { at: 270.5, label: "Electronic warfare", x: 1540, y: 250, clip: "" },
  { at: 272.3, label: "Other aircraft", x: 300, y: 820, clip: "rf-formation" },
  { at: 274.2, label: "Information to the pilot", x: 1620, y: 820, clip: "aw-screens" },
  { at: 276.4, label: "Weapons carried", x: 960, y: 900, clip: "" },
];
export const P22Network: React.FC = () => {
  const t = useT();
  const hub = { x: 960, y: 480 };
  const end = ramp(t, 279.0, 280.2, ease.inOut);
  return (
    <BlotReveal t={t} start={264.0} dur={0.8} cx={W / 2} cy={H / 2}>
      <PaperGround dark>
        <Camera s={keys(t, [[264, 1.1], [268, 1.0], [280.2, 0.94]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={140}>
              <KeyTitle text="Not in isolation" t={t} at={266.3} size={90} out={268.3} />
            </At>
            <Blueprint view="typhoonTop" x={hub.x - 210} y={hub.y} width={400} p={ramp(t, 264.3, 265.6, ease.linear)} color={C.ink} lineWidth={2} label="Typhoon" labelSize={26} />
            <Blueprint view="rafaleTop" x={hub.x + 210} y={hub.y} width={370} p={ramp(t, 264.5, 265.8, ease.linear)} color={C.ink} lineWidth={2} label="Rafale" labelSize={26} />
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
              {NODES.map((n) => {
                const p = ramp(t, n.at - 0.2, n.at + 0.5);
                const pulse = ((t - n.at) * 0.8) % 1;
                return (
                  <g key={n.label} opacity={p}>
                    <line x1={hub.x} y1={hub.y} x2={n.x} y2={n.y} stroke={C.offWhite} strokeWidth={2} strokeDasharray="10 8" opacity={0.6} />
                    {p >= 1 && <circle cx={hub.x + (n.x - hub.x) * pulse} cy={hub.y + (n.y - hub.y) * pulse} r={6} fill={C.red} />}
                  </g>
                );
              })}
            </svg>
            {NODES.map((n) => {
              const p = ramp(t, n.at - 0.2, n.at + 0.5);
              if (n.clip)
                return (
                  <React.Fragment key={n.label}>
                    <ClipPrint src={n.clip} t={t} from={n.at - 0.2} to={281} x={n.x} y={n.y - 30} w={400} h={225} rot={(n.x - 960) / 400} reveal={p} clipDur={6} />
                    <At x={n.x} y={n.y + 120}>
                      <Rise p={ramp(t, n.at + 0.2, n.at + 0.7)}>
                        <Tape p={1} size={28}>
                          {n.label}
                        </Tape>
                      </Rise>
                    </At>
                  </React.Fragment>
                );
              if (n.label === "Electronic warfare")
                return (
                  <React.Fragment key={n.label}>
                    <div style={{ position: "absolute", left: n.x - 200, top: n.y - 30 - 112, width: 400, height: 225, opacity: p, transform: `rotate(${(n.x - 960) / 400}deg) scale(${0.94 + 0.06 * ease.out(p)})`, border: "12px solid #e9dfca", boxShadow: "0 10px 16px rgba(0,0,0,0.5)", overflow: "hidden", background: "#111" }}>
                      <Static />
                    </div>
                    <At x={n.x} y={n.y + 120}>
                      <Rise p={ramp(t, n.at + 0.2, n.at + 0.7)}>
                        <Tape p={1} size={28}>
                          {n.label}
                        </Tape>
                      </Rise>
                    </At>
                  </React.Fragment>
                );
              return (
                <React.Fragment key={n.label}>
                  <Cutout name="meteor" x={n.x} y={n.y - 60} w={380} opacity={p} scale={0.85 + springIn(t, n.at - 0.2) * 0.15} />
                  <At x={n.x} y={n.y + 50}>
                    <Rise p={ramp(t, n.at + 0.2, n.at + 0.7)}>
                      <Tape p={1} size={28} dark>
                        {n.label}
                      </Tape>
                    </Rise>
                  </At>
                </React.Fragment>
              );
            })}
          </Layer>
        </Camera>
        <AbsoluteFill style={{ background: C.night, opacity: end }} />
      </PaperGround>
    </BlotReveal>
  );
};

