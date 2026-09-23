import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture, Vignette } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Label, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { Blueprint } from "../components/Blueprint";
import { KeyTitle, recede, springIn } from "../components/AnimeText";
import { DrawPath } from "../components/Draw";
import { C, F, W, H } from "../lib/theme";
import { ease, keys, ramp, useT } from "../lib/time";
import { Clip, ClipFull, ClipPrint, Tile } from "./kit";

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
    { at: 198.3, label: "Position", x: 330, y: 380 },
    { at: 199.1, label: "Altitude", x: 960, y: 380 },
    { at: 200.3, label: "Radar signature", x: 1590, y: 380 },
    { at: 201.9, label: "Electronic interference", x: 330, y: 800 },
    { at: 203.7, label: "Radar mode", x: 960, y: 800 },
    { at: 204.5, label: "Other platforms", x: 1590, y: 800 },
  ];
  return (
    <TearReveal t={t} start={194.1} dur={0.7} dir="ltr">
      <PaperGround dark>
        <Camera s={keys(t, [[194.1, 1.12], [197.8, 1.0], [207.5, 1.03]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={120}>
              <KeyTitle text="Who detects whom first?" t={t} at={194.3} size={78} neon="white" />
            </At>
            {cells.map((c, i) => {
              const p = ramp(t, c.at - 0.15, c.at + 0.4);
              const s = springIn(t, c.at - 0.15, 0.8);
              return (
                <div key={c.label} style={{ position: "absolute", inset: 0, transform: `scale(${0.9 + s * 0.1})`, transformOrigin: `${c.x}px ${c.y}px` }}>
                  <Tile x={c.x} y={c.y} w={560} h={330} p={p} label={c.label}>
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

/* P19 217.4–230.0 PIRATE: passive infrared search and track. */
export const P19Pirate: React.FC = () => {
  const t = useT();
  const zoom = keys(t, [[217.4, 1.0], [220.8, 1.0], [222.0, 1.9], [230, 2.0]], ease.inOut);
  const passive = ramp(t, 226.2, 226.8);
  const noEmit = ramp(t, 227.6, 228.2);
  return (
    <TearReveal t={t} start={217.4} dur={0.7} dir="rtl">
      <AbsoluteFill style={{ background: C.night }}>
        {/* RAF Typhoon, nose-on: PIRATE sits ahead of the windscreen, port side */}
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "46% 48%" }}>
          <Img src={staticFile("src-photos/typhoon-front.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: `contrast(1.08) saturate(${1 - passive * 0.9}) brightness(${1 - passive * 0.25})` }} />
          <PrintTexture opacity={0.2} />
        </AbsoluteFill>
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
          {/* heat from a target reaches the sensor; nothing is transmitted */}
          {passive > 0 &&
            [0, 1, 2, 3].map((i) => {
              const ph = ((t * 0.9 + i * 0.25) % 1);
              const r = 900 * (1 - ph);
              return <circle key={i} cx={880} cy={520} r={r} fill="none" stroke="#ff9a5a" strokeWidth={4} opacity={passive * ph * 0.8} />;
            })}
        </svg>
        <At x={1450} y={250}>
          <KeyTitle text="PIRATE" t={t} at={221.2} size={140} neon="red" color="#ffb08a" />
        </At>
        <At x={1450} y={360}>
          <Rise p={ramp(t, 222.3, 222.9)}>
            <Label size={30} color={C.offWhite} weight={600}>
              Infrared search &amp; track
            </Label>
          </Rise>
        </At>
        <At x={1450} y={450}>
          <Rise p={passive}>
            <Tape p={1} size={34}>
              Passive
            </Tape>
          </Rise>
        </At>
        <At x={1450} y={530}>
          <Rise p={noEmit}>
            <Tape p={1} size={30} dark>
              No radar emissions
            </Tape>
          </Rise>
        </At>
        <Vignette strength={0.5} />
      </AbsoluteFill>
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
            <AbsoluteFill style={{ ...recede(both * 0.85, 6, 0.6, 0.06), transformOrigin: "960px 540px" }}>
              <Cutout name="meteor" x={400} y={380} w={560} rot={-4} opacity={ramp(t, 235.6, 236.0)} scale={0.85 + springIn(t, 235.6) * 0.15} />
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
              <Blueprint view="typhoonTop" x={560} y={500} width={640} p={ramp(t, 244.2, 245.8, ease.linear)} color={C.ink} lineWidth={1.2} />
              <Blueprint view="rafaleTop" x={1360} y={500} width={580} p={ramp(t, 244.4, 246.0, ease.linear)} color={C.ink} lineWidth={1.2} />
              <Cutout name="meteor" x={560} y={800} w={300} sticker opacity={ramp(t, 246.9, 247.3)} />
              <Cutout name="meteor" x={1360} y={800} w={300} sticker opacity={ramp(t, 247.1, 247.5)} />
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
  const right = ramp(t, 257.8, 258.5, ease.inOut);
  return (
    <TearReveal t={t} start={248.9} dur={0.7} dir="ltr">
      <PaperGround dark>
        <At x={W / 2} y={H / 2}>
          <KeyTitle text="The clearer difference" t={t} at={249.3} size={100} out={252.1} />
        </At>
        <AbsoluteFill style={{ clipPath: `inset(0 ${100 - left * 50}% 0 0)` }}>
          <ClipFull src="rf-formation" t={t} from={252.2} to={264.2} clipDur={7} />
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
            <AbsoluteFill style={{ left: "25%" }}>
              <ClipFull src="rr-bank" t={t} from={257.7} to={264.2} clipDur={4} />
            </AbsoluteFill>
            <At x={W * 0.75} y={H - 170}>
              <KeyTitle text="Radar architecture" t={t} at={262.6} size={76} neon="red" />
            </At>
            <At x={W * 0.75} y={120}>
              <Label size={30} color={C.offWhite} weight={600} style={{ letterSpacing: "0.4em" }}>
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
  { at: 270.5, label: "Electronic warfare", x: 1540, y: 250, clip: "aw-scope" },
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
            <Blueprint view="typhoonTop" x={hub.x - 170} y={hub.y} width={300} p={ramp(t, 264.3, 265.6, ease.linear)} color={C.ink} lineWidth={1.1} />
            <Blueprint view="rafaleTop" x={hub.x + 170} y={hub.y} width={280} p={ramp(t, 264.5, 265.8, ease.linear)} color={C.ink} lineWidth={1.1} />
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

