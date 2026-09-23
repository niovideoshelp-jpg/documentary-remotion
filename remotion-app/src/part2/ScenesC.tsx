import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture, Vignette } from "../components/Paper";
import { Photo } from "../components/Photo";
import { At, Label, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { KeyTitle, springIn } from "../components/AnimeText";
import { WorldMap, viewAt, type Highlight } from "../map/WorldMap";
import { C, F, W, H } from "../lib/theme";
import { ease, keys, ramp, useT } from "../lib/time";
import { Check, CirclePhoto, ClipFull, Strike } from "../part1/kit";
import { Jet3D } from "../components/Jet3D";

/* Q14 176.4–189.5 "more versatile" doesn't settle it; the upgraded Typhoon FGR4 has a broad arsenal too. */
export const Q14Versatile: React.FC = () => {
  const t = useT();
  const clip = ramp(t, 182.7, 183.3, ease.inOut);
  return (
    <BlotReveal t={t} start={176.4} dur={0.7} cx={W / 2} cy={H / 2}>
      <PaperGround dark>
        <Camera s={keys(t, [[176.4, 1.08], [182.8, 1.0]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={400}>
              <Rise p={ramp(t, 178.2, 178.7)}>
                <Label size={36} color={C.inkSoft} weight={700} style={{ letterSpacing: "0.34em" }}>
                  Rafale
                </Label>
              </Rise>
            </At>
            <At x={W / 2} y={540}>
              <KeyTitle text="More versatile" t={t} at={178.9} size={140} />
            </At>
            <Strike x1={W / 2 - 520} x2={W / 2 + 520} y={540} p={ramp(t, 180.1, 180.6)} width={16} />
            <At x={W / 2} y={720}>
              <Rise p={ramp(t, 180.9, 181.4)}>
                <Tape p={1} size={34} dark>
                  Doesn’t settle it
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
      {clip > 0 && (
        <AbsoluteFill style={{ opacity: clip }}>
          <ClipFull src="p2/tr-typhoon-taxi" t={t} from={182.7} to={189.6} clipDur={4.5} trim={2.0} push={0.05} />
          <At x={W / 2} y={H - 170}>
            <KeyTitle text="Typhoon FGR4" t={t} at={183.9} size={110} neon="white" />
          </At>
          <At x={W / 2} y={H - 80}>
            <Rise p={ramp(t, 187.8, 188.3)}>
              <Tape p={1} size={32}>
                A broad arsenal too
              </Tape>
            </Rise>
          </At>
        </AbsoluteFill>
      )}
    </BlotReveal>
  );
};

/* Q15 189.3–200.5 put a specific mission on the table: target, weapon, conditions. */
export const Q15Dossier: React.FC = () => {
  const t = useT();
  const land = springIn(t, 190.3, 1.0);
  const stamp = ramp(t, 192.3, 192.7);
  const qs = [
    { at: 194.6, q: "Target?", x: 520, rot: -4 },
    { at: 195.7, q: "Weapon?", x: 960, rot: 2 },
    { at: 197.8, q: "Conditions?", x: 1400, rot: -1.5 },
  ];
  return (
    <TearReveal t={t} start={189.3} dur={0.6} dir="ttb">
      <PaperGround>
        <Camera s={keys(t, [[189.3, 1.1], [193.2, 1.0], [200.5, 1.03]], ease.soft)}>
          <Layer>
            {/* the mission folder lands on the table */}
            <div
              style={{
                position: "absolute",
                left: W / 2 - 520,
                top: 230,
                width: 1040,
                height: 300,
                background: "#b89b6c",
                borderRadius: "10px 10px 6px 6px",
                boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
                transform: `translateY(${(1 - land) * -500}px) rotate(${(1 - land) * -8 - 1}deg)`,
                opacity: ramp(t, 189.8, 190.2),
              }}
            >
              <PrintTexture opacity={0.5} />
              <div style={{ position: "absolute", left: 60, top: 70, fontFamily: F.label, fontWeight: 700, fontSize: 30, letterSpacing: "0.3em", color: "#3a2e1c" }}>OPERATION ORDER</div>
              <div style={{ position: "absolute", left: 60, top: 130, width: 520, height: 12, background: "rgba(58,46,28,0.35)" }} />
              <div style={{ position: "absolute", left: 60, top: 160, width: 420, height: 12, background: "rgba(58,46,28,0.35)" }} />
              <div
                style={{
                  position: "absolute",
                  right: 60,
                  top: 70,
                  border: `7px solid ${C.red}`,
                  padding: "6px 24px 0",
                  fontFamily: F.display,
                  fontSize: 88,
                  color: C.red,
                  transform: `rotate(-8deg) scale(${1.6 - ease.out(Math.min(1, stamp * 1.4)) * 0.6})`,
                  opacity: Math.min(1, stamp * 3) * 0.9,
                  filter: "url(#ink)",
                }}
              >
                MISSION
              </div>
            </div>
            {qs.map((k) => {
              const p = ramp(t, k.at - 0.2, k.at + 0.35);
              return (
                <div
                  key={k.q}
                  style={{
                    position: "absolute",
                    left: k.x - 190,
                    top: 640,
                    width: 380,
                    height: 230,
                    background: "#f1ebdd",
                    boxShadow: "0 18px 36px rgba(0,0,0,0.5)",
                    transform: `rotate(${k.rot}deg) translateY(${(1 - ease.out(p)) * 80}px) rotateX(${(1 - ease.out(p)) * 70}deg)`,
                    opacity: p,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: F.display,
                    fontSize: 72,
                    color: "#1c1c1b",
                    textTransform: "uppercase",
                  }}
                >
                  {k.q}
                </div>
              );
            })}
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* Q16 200.4–208.2 one difference is clearer across the two aircraft families. */
export const Q16Families: React.FC = () => {
  const t = useT();
  const glowM = ramp(t, 203.6, 204.2);
  const rafale = [
    { src: "photos/rafale-landing.jpg", tag: "C", pos: "58% 58%", zoom: 1.5, at: 201.0 },
    { src: "src-photos/rafale-india-takeoff.jpg", tag: "B", pos: "55% 45%", zoom: 1.3, at: 201.3 },
    { src: "src-photos/rafale-m-flight.jpg", tag: "M", pos: "50% 50%", zoom: 1.25, at: 201.6 },
  ];
  return (
    <BlotReveal t={t} start={200.4} dur={0.7} cx={W / 2} cy={H / 2}>
      <PaperGround dark>
        <Camera s={keys(t, [[200.4, 1.08], [208.2, 1.0]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={140}>
              <KeyTitle text="The families as a whole" t={t} at={205.2} size={80} />
            </At>
            <At x={330} y={420}>
              <Label size={40} color={C.ink} weight={700} style={{ letterSpacing: "0.3em" }}>
                Rafale
              </Label>
            </At>
            {rafale.map((r, i) => (
              <React.Fragment key={r.tag}>
                <div style={{ position: "absolute", inset: 0, filter: i === 2 && glowM > 0 ? `drop-shadow(0 0 ${glowM * 24}px rgba(255,120,90,0.8))` : undefined }}>
                  <CirclePhoto src={r.src} x={720 + i * 380} y={420} d={280} p={springIn(t, r.at - 0.2, 0.9)} pos={r.pos} zoom={r.zoom} />
                </div>
                <At x={720 + i * 380} y={600}>
                  <div style={{ fontFamily: F.display, fontSize: 64, color: i === 2 ? C.red : C.ink, opacity: ramp(t, r.at, r.at + 0.3) }}>{r.tag}</div>
                </At>
              </React.Fragment>
            ))}
            <At x={330} y={830}>
              <Label size={40} color={C.ink} weight={700} style={{ letterSpacing: "0.3em" }}>
                Typhoon
              </Label>
            </At>
            <CirclePhoto src="src-photos/typhoon-front.jpg" x={720} y={830} d={240} p={springIn(t, 202.0, 0.9)} pos="50% 45%" zoom={1.3} />
            <CirclePhoto src="src-photos/typhoon-side.jpg" x={1100} y={830} d={240} p={springIn(t, 202.3, 0.9)} pos="50% 50%" zoom={1.2} />
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* Q17 208.1–226.9 the Rafale M goes to sea; there is no naval Typhoon in service; for a navy that is decisive. */
const Full: React.FC<{ src: string; t: number; t0: number; t1: number; pos?: string; z0?: number; z1?: number }> = ({ src, t, t0, t1, pos = "50% 50%", z0 = 1.08, z1 = 1.18 }) => (
  <AbsoluteFill style={{ background: C.night, overflow: "hidden" }}>
    <Img src={staticFile(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z0 + (z1 - z0) * ramp(t, t0, t1, (x) => x)})`, transformOrigin: pos, filter: "contrast(1.06) saturate(0.82) sepia(0.08)" }} />
    <PrintTexture opacity={0.2} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,6,6,0.62) 0%, rgba(6,6,6,0) 38%)" }} />
    <Vignette strength={0.45} />
  </AbsoluteFill>
);
export const Q17Naval: React.FC = () => {
  const t = useT();
  const s2 = ramp(t, 211.2, 211.7);
  const board = ramp(t, 214.7, 215.2);
  const need = ramp(t, 218.6, 219.1);
  const stamp = ramp(t, 225.7, 226.1);
  const st = 1.7 - ease.out(Math.min(1, stamp * 1.5)) * 0.7;
  return (
    <TearReveal t={t} start={208.1} dur={0.7} dir="ltr">
      {/* Charles de Gaulle launching a Rafale M, then a catapult shot */}
      <Full src="src-photos/cdg-2016.jpg" t={t} t0={208.1} t1={211.8} pos="88% 60%" z0={1.9} z1={2.2} />
      <At x={W / 2} y={H - 140}>
        <div style={{ opacity: 1 - s2 }}>
          <KeyTitle text="Operational naval version" t={t} at={209.3} size={90} neon="white" />
        </div>
      </At>
      {s2 > 0 && (
        <AbsoluteFill style={{ opacity: s2 }}>
          <Full src="src-photos/rafale-m-launch.jpg" t={t} t0={211.2} t1={215.2} pos="45% 55%" z0={1.1} z1={1.2} />
          <At x={W / 2} y={H - 170}>
            <KeyTitle text="Rafale M" t={t} at={211.7} size={130} neon="white" />
          </At>
          <At x={W / 2} y={H - 70}>
            <Rise p={ramp(t, 213.5, 214.0)}>
              <Tape p={1} size={32}>
                Operates from aircraft carriers
              </Tape>
            </Rise>
          </At>
        </AbsoluteFill>
      )}
      {board > 0 && (
        <AbsoluteFill style={{ opacity: board }}>
          <PaperGround dark>
            <Camera s={keys(t, [[214.7, 1.06], [226.9, 1.0]], ease.soft)}>
              <Layer>
                <AbsoluteFill style={{ opacity: 1 - need * 0.8, filter: need > 0 ? `blur(${need * 4}px)` : undefined }}>
                  <Jet3D cam={{ yaw: 62 + 6 * Math.sin(t * 0.4), pitch: 30, zoom: 0.4 + 0.6 * springIn(t, 214.9, 1.0), focus: 0 }} cx={560} cy={480} scale={34} model="rafale" sensor={false} />
                  <At x={560} y={760}>
                    <Label size={34} color={C.ink} weight={700} style={{ letterSpacing: "0.32em", opacity: ramp(t, 215.3, 215.7) }}>
                      Rafale M
                    </Label>
                  </At>
                  <Check x={820} y={260} p={ramp(t, 215.4, 215.8)} size={80} />
                  <Jet3D cam={{ yaw: 62 + 6 * Math.sin(t * 0.4 + 1), pitch: 30, zoom: 0.4 + 0.6 * springIn(t, 215.3, 1.0), focus: 0 }} cx={1360} cy={480} scale={34} model="typhoon" sensor={false} />
                  <At x={1360} y={760}>
                    <Label size={34} color={C.ink} weight={700} style={{ letterSpacing: "0.32em", opacity: ramp(t, 215.7, 216.1) }}>
                      Typhoon
                    </Label>
                  </At>
                  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                    {ramp(t, 216.6, 217.0) > 0 && (
                      <g stroke={C.red} strokeWidth={12} strokeLinecap="round" opacity={ramp(t, 216.6, 217.0)} filter="url(#ink)">
                        <line x1={1560} y1={220} x2={1660} y2={320} />
                        <line x1={1660} y1={220} x2={1560} y2={320} />
                      </g>
                    )}
                  </svg>
                  <At x={1360} y={860}>
                    <Rise p={ramp(t, 216.9, 217.4)}>
                      <Tape p={1} size={32} dark>
                        No naval version in service
                      </Tape>
                    </Rise>
                  </At>
                </AbsoluteFill>
                {need > 0 && (
                  <AbsoluteFill style={{ opacity: need }}>
                    <CirclePhoto src="src-photos/cdg-2019.jpg" x={W / 2} y={470} d={440} p={springIn(t, 219.0, 1.0)} pos="45% 60%" zoom={1.3} />
                    <At x={W / 2} y={770}>
                      <Rise p={ramp(t, 220.8, 221.3)}>
                        <Label size={34} color={C.ink} weight={700} style={{ letterSpacing: "0.3em" }}>
                          A navy that needs a carrier fighter
                        </Label>
                      </Rise>
                    </At>
                    <At x={W / 2} y={470}>
                      <div style={{ transform: `rotate(-8deg) scale(${st})`, opacity: Math.min(1, stamp * 3) * 0.95, border: `8px solid ${C.red}`, padding: "10px 36px 2px", fontFamily: F.display, fontSize: 130, color: C.red, background: "rgba(20,20,20,0.45)", filter: "url(#ink)" }}>DECISIVE</div>
                    </At>
                  </AbsoluteFill>
                )}
              </Layer>
            </Camera>
          </PaperGround>
        </AbsoluteFill>
      )}
    </TearReveal>
  );
};

/* Q18 226.8–235.0 this comparison uses the Rafale C: land-based, like the Typhoon. */
export const Q18Land: React.FC = () => {
  const t = useT();
  return (
    <BlotReveal t={t} start={226.8} dur={0.7} cx={W / 2} cy={H / 2}>
      <AbsoluteFill style={{ background: C.night }}>
        <AbsoluteFill style={{ clipPath: "inset(0 50% 0 0)" }}>
          <AbsoluteFill style={{ left: "-25%" }}>
            <Img src={staticFile("photos/rafale-landing.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 60%", transform: `scale(${1.25 + ramp(t, 226.8, 235, (x) => x) * 0.08})`, filter: "contrast(1.05) saturate(0.82) sepia(0.08)" }} />
            <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,6,6,0.65) 0%, rgba(6,6,6,0) 40%)" }} />
          </AbsoluteFill>
          <At x={W / 4} y={H - 170}>
            <KeyTitle text="Rafale C" t={t} at={230.3} size={100} neon="white" />
          </At>
        </AbsoluteFill>
        <AbsoluteFill style={{ clipPath: "inset(0 0 0 50%)" }}>
          <AbsoluteFill style={{ left: "25%", filter: `blur(${(1 - ramp(t, 233.0, 233.6)) * 6}px) brightness(${0.45 + 0.55 * ramp(t, 233.0, 233.6)})` }}>
            {/* RAF Typhoon FGR4 on the ramp at RAF Leuchars (MOD) */}
            <Img src={staticFile("src-photos/typhoon-leuchars.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 55%", transform: `scale(${1.12 + ramp(t, 227, 235.2, (x) => x) * 0.08})`, filter: "contrast(1.05) saturate(0.82) sepia(0.08)" }} />
            <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(6,6,6,0.65) 0%, rgba(6,6,6,0) 40%)" }} />
          </AbsoluteFill>
          <At x={W * 0.75} y={H - 170}>
            <KeyTitle text="Typhoon" t={t} at={233.8} size={100} neon="white" />
          </At>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, marginLeft: -2, background: C.offWhite, opacity: 0.9 }} />
        <At x={W / 2} y={110}>
          <Rise p={ramp(t, 232.3, 232.8)}>
            <Tape p={1} size={34}>
              Land bases
            </Tape>
          </Rise>
        </At>
        <PrintTexture opacity={0.18} />
      </AbsoluteFill>
    </BlotReveal>
  );
};

/* Q19 234.9–243.6 anti-ship: Exocet in the Rafale family; but look at the specific configuration. */
export const Q19Exocet: React.FC = () => {
  const t = useT();
  return (
    <TearReveal t={t} start={234.9} dur={0.7} dir="rtl">
      <PaperGround dark>
        <Camera s={keys(t, [[234.9, 1.1], [243.6, 1.0]], ease.soft)}>
          <Layer>
            <Photo src="src-photos/exocet.jpg" x={760} y={520} w={1000} h={640} rot={-1.5} reveal={ramp(t, 235.1, 235.8)} revealFrom="left" zoom={1.1} seed="exo" />
            <At x={1560} y={360}>
              <Rise p={ramp(t, 237.1, 237.6)}>
                <Label size={34} color={C.inkSoft} weight={700} style={{ letterSpacing: "0.3em" }}>
                  Anti-ship
                </Label>
              </Rise>
            </At>
            <At x={1560} y={470}>
              <KeyTitle text="Exocet" t={t} at={238.5} size={130} neon="red" color="#ffb4a6" />
            </At>
            <At x={1560} y={620}>
              <Rise p={ramp(t, 241.8, 242.3)}>
                <Tape p={1} size={32} dark>
                  Specific configuration
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* Q20 243.5–end integrated into the family ≠ on every country's Rafale: version, integrations, package. */
const CUSTOMERS: [string, number][] = [
  ["France", 246.3],
  ["Egypt", 246.7],
  ["Qatar", 247.0],
  ["India", 247.3],
  ["Greece", 247.6],
  ["Croatia", 247.9],
  ["United Arab Emirates", 248.2],
  ["Indonesia", 248.5],
  ["Republic of Serbia", 248.8],
];
const HL: Highlight[] = CUSTOMERS.map(([name, at]) => ({ name, draw: [at, at + 0.4], fill: [at + 0.15, at + 0.6] }));
export const Q20Customers: React.FC = () => {
  const t = useT();
  const lon = keys(t, [[243.5, 35], [250, 50], [260.4, 52]], ease.inOut);
  const lat = keys(t, [[243.5, 38], [250, 24], [260.4, 24]], ease.inOut);
  const z = keys(t, [[243.5, 0.55], [249.5, 0.3], [260.4, 0.29]], ease.inOut);
  const panel = ramp(t, 253.4, 253.9);
  const end = ramp(t, 259.6, 260.4);
  const factors = [
    { at: 254.4, text: "Version" },
    { at: 255.4, text: "Integrations completed" },
    { at: 257.7, text: "Package purchased" },
  ];
  return (
    <BlotReveal t={t} start={243.5} dur={0.8} cx={W / 2} cy={H / 2}>
      <WorldMap t={t} view={viewAt(lon, lat, z)} highlights={HL} overlay={<AbsoluteFill style={{ background: C.night, opacity: panel * 0.55 }} />} />
      <At x={W / 2} y={130}>
        <KeyTitle text="Every Rafale?" t={t} at={247.8} size={100} neon="white" />
      </At>
      <At x={W / 2} y={230}>
        <Rise p={ramp(t, 246.2, 246.7) * (1 - panel)}>
          <Label size={28} color={C.ink} weight={700} style={{ letterSpacing: "0.26em" }}>
            Rafale operators and customers
          </Label>
        </Rise>
      </At>
      <AbsoluteFill style={{ opacity: panel }}>
        {factors.map((f, i) => (
          <At key={f.text} x={W / 2} y={470 + i * 120}>
            <Rise p={ramp(t, f.at, f.at + 0.45)}>
              <Tape p={1} size={44} dark={i === 1}>
                {f.text}
              </Tape>
            </Rise>
          </At>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.night, opacity: end }} />
    </BlotReveal>
  );
};
