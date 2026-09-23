import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, Vignette } from "../components/Paper";
import { At, Label, Rise, Tape } from "../components/Type";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { KeyTitle, recede } from "../components/AnimeText";
import { DECOY_EXIT, Jet3D, useJetCamera, type V } from "../components/Jet3D";
import { C, W, H } from "../lib/theme";
import { ease, keys, lerp, ramp, useT } from "../lib/time";
import { Clip, Strike, Tile } from "../part1/kit";
import { Flares, GlowDefs, Icon, Illumination, Jamming, MissileTrack, RedactedDoc, RwrScope, Warn, curve } from "./kit2";

/* Q01 0–8.9 "Finding the enemy is one part of the problem. Realizing that the enemy has found
 * you and reacting in time is another." A radar-warning scope: we find, we are found, we react. */
export const Q01Scope: React.FC = () => {
  const t = useT();
  const R = 330;
  const found = ramp(t, 4.9, 5.3);
  // reacting: we turn hard right, so the threat's bearing slides round the rim
  const turn = ramp(t, 6.2, 7.6, ease.inOut);
  const bearing = (-40 - 95 * turn) * (Math.PI / 180);
  const tx = Math.cos(bearing) * R * 0.92;
  const ty = Math.sin(bearing) * R * 0.92;
  const blink = found > 0 ? 0.5 + 0.5 * Math.abs(Math.sin(t * 9)) : 0;
  return (
    <AbsoluteFill>
      <PaperGround dark>
        <Camera s={keys(t, [[0, 1.12], [3.3, 1.02], [8.8, 1.06]], ease.soft)}>
          <Layer>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={W} height={H}>
              <RwrScope x={W / 2} y={570} r={R} t={t} p={ramp(t, 0.05, 0.6)} sweep={1 - ramp(t, 3.1, 3.6)}>
                {/* our radar finds a contact */}
                <g opacity={ramp(t, 1.2, 1.5) * (1 - ramp(t, 3.3, 3.7))}>
                  <circle cx={Math.cos(-0.7) * R * 0.6} cy={Math.sin(-0.7) * R * 0.6} r={9} fill="#dff5e8" />
                  <rect x={Math.cos(-0.7) * R * 0.6 - 22} y={Math.sin(-0.7) * R * 0.6 - 22} width={44} height={44} fill="none" stroke="#dff5e8" strokeWidth={3} opacity={ramp(t, 1.9, 2.1)} />
                </g>
                {/* ...and is found: the threat's emitter shows on the rim, locked */}
                {t > 3.4 && (
                  <g opacity={ramp(t, 3.5, 3.8)}>
                    <line x1={0} y1={0} x2={tx} y2={ty} stroke="#ff6a52" strokeWidth={3} strokeDasharray="8 8" opacity={0.35 + blink * 0.5} />
                    <g transform={`translate(${tx},${ty}) rotate(45)`}>
                      <rect x={-18} y={-18} width={36} height={36} fill="#200806" stroke="#ff6a52" strokeWidth={4} />
                    </g>
                    <circle cx={tx} cy={ty} r={34 + blink * 10} fill="none" stroke="#ff6a52" strokeWidth={3} opacity={found * blink} />
                  </g>
                )}
                {/* countermeasures behind us as we break */}
                {t > 6.4 &&
                  Array.from({ length: 6 }, (_, i) => {
                    const a = t - (6.4 + i * 0.18);
                    if (a < 0) return null;
                    return <circle key={i} cx={(i % 2 ? 1 : -1) * (8 + a * 22)} cy={26 + a * 70} r={Math.max(0, 7 - a * 2.4)} fill="#ffd9a8" opacity={Math.max(0, 1 - a / 2.4)} />;
                  })}
              </RwrScope>
            </svg>
            <At x={W / 2} y={120}>
              <KeyTitle text="Finding the enemy" t={t} at={0.3} size={84} out={3.2} />
            </At>
            <At x={W / 2} y={120}>
              <KeyTitle text="Being found" t={t} at={4.4} size={92} neon="red" color="#ffb4a6" out={6.0} />
            </At>
            <At x={W / 2} y={120}>
              <KeyTitle text="Reacting in time" t={t} at={6.2} size={84} />
            </At>
            <At x={W / 2 + 330} y={570 - 250}>
              <div style={{ opacity: found * (1 - ramp(t, 6.2, 6.6)) }}>
                <Label size={30} color="#ff9a86" weight={700} style={{ letterSpacing: "0.3em" }}>
                  Lock
                </Label>
              </div>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </AbsoluteFill>
  );
};

/* Q02 8.3–24.9 SPECTRA on a 3D Rafale: warning sensors pick up a radar and a missile; flares and
 * jamming answer; the missile goes for the flares. */
export const Q02Spectra: React.FC = () => {
  const t = useT();
  const cam = useJetCamera(t, 8.3, { yaw: 112, pitch: 22, zoom: 0.8, focus: 0 }, [
    { at: 0, to: { yaw: 50, pitch: 20 }, dur: 6, ease: "inOutSine" },
    { at: 6.4, to: { yaw: 30, pitch: 25, zoom: 0.88 }, dur: 10.2, ease: "linear" },
  ]);
  const CX = 860;
  const CY = 590;
  const SC = 58;
  const emitter: [number, number] = [2050, 60];
  const mStart: [number, number] = [-80, 1040];
  const tail: V = [-7, -1.2, -0.6];
  const flareEnd: V = [-13.9, -2.7, -3.3];
  return (
    <TearReveal t={t} start={8.3} dur={0.7} dir="ltr">
      <PaperGround dark>
        <Jet3D
          cam={cam}
          cx={CX}
          cy={CY}
          scale={SC}
          model="rafale"
          sensor={false}
          focusPt={[0, 0, 0]}
          overlay={(P) => {
            const c = P([0, 0, 0]);
            const tl = P(tail);
            const fe = P(flareEnd);
            const toEm = Math.atan2(emitter[1] - c.y, emitter[0] - c.x);
            const toM = Math.atan2(mStart[1] - c.y, mStart[0] - c.x);
            const path = curve([mStart, [260, 900], [tl.x - 120, tl.y + 150], [fe.x + 40, fe.y - 10], [fe.x - 60, fe.y + 40]]);
            return (
              <>
                <GlowDefs />
                <Illumination from={emitter} to={[c.x, c.y]} p={ramp(t, 16.9, 17.6)} />
                <Jamming x={c.x} y={c.y} angle={toEm} p={ramp(t, 19.3, 19.8)} t={t} />
                <Flares P={P} t={t} t0={19.0} origin={[-5.8, 0, -0.5]} pairs={4} />
                <Flares P={P} t={t} t0={23.2} origin={[-5.8, 0, -0.5]} pairs={4} />
                <MissileTrack path={path} p={ramp(t, 18.0, 24.7, ease.linear)} opacity={1 - ramp(t, 24.4, 24.8)} />
                <Warn x={c.x} y={c.y} angle={toEm} p={ramp(t, 17.5, 17.9)} label="Radar" t={t} />
                <Warn x={c.x} y={c.y} angle={toM} p={ramp(t, 18.2, 18.6)} label="Missile" t={t} />
              </>
            );
          }}
        />
        <At x={CX} y={960}>
          <div style={{ opacity: ramp(t, 9.2, 9.7) * (1 - ramp(t, 16.4, 16.9)) }}>
            <Label size={34} color={C.ink} weight={700} style={{ letterSpacing: "0.34em" }}>
              Rafale
            </Label>
          </div>
        </At>
        <At x={1520} y={200}>
          <KeyTitle text="SPECTRA" t={t} at={12.0} size={130} neon="red" color="#ffb4a6" />
        </At>
        <At x={1520} y={300}>
          <Rise p={ramp(t, 14.1, 14.6)}>
            <Label size={30} color={C.offWhite} weight={600}>
              Integrated self-protection
            </Label>
          </Rise>
        </At>
        <At x={1520} y={390}>
          <Rise p={ramp(t, 17.5, 18.0)}>
            <Tape p={1} size={32}>
              Warning sensors
            </Tape>
          </Rise>
        </At>
        <At x={1520} y={460}>
          <Rise p={ramp(t, 18.8, 19.3)}>
            <Tape p={1} size={32} dark>
              Countermeasures
            </Tape>
          </Rise>
        </At>
        <Vignette strength={0.45} />
      </PaperGround>
    </TearReveal>
  );
};

/* Q03 24.8–38.7 DASS on a 3D Typhoon: warning, jamming from the wingtip pods, flares; then, on RAF
 * aircraft, the towed decoy reels out of the starboard pod and draws the radar off the jet. */
export const Q03Dass: React.FC = () => {
  const t = useT();
  const cam = useJetCamera(t, 24.8, { yaw: 64, pitch: 22, zoom: 0.84, focus: 0 }, [
    { at: 0, to: { yaw: 36, pitch: 24 }, dur: 9.2, ease: "linear" },
    { at: 9.4, to: { yaw: -138, pitch: 16, zoom: 0.95, focus: 1 }, dur: 2.4, ease: "inOutCubic" },
  ]);
  const CX = 860;
  const CY = 590;
  const SC = 58;
  const emitter: [number, number] = [2050, 80];
  const L = 16 * ease.inOut(ramp(t, 35.4, 37.6));
  const cable = (s: number): V => [DECOY_EXIT[0] - L * s, DECOY_EXIT[1] + 0.5 * s * (L / 16), DECOY_EXIT[2] - 1.1 * Math.sin((s * Math.PI) / 2) * (L / 16)];
  const toDecoy = ramp(t, 37.5, 38.2, ease.inOut);
  return (
    <TearReveal t={t} start={24.8} dur={0.7} dir="rtl">
      <PaperGround dark>
        <Jet3D
          cam={cam}
          cx={CX}
          cy={CY}
          scale={SC}
          model="typhoon"
          sensor={false}
          focusPt={[-11, 4.2, -0.8]}
          overlay={(P) => {
            const c = P([0, 0, 0]);
            const pods = [P([-5, 5.47, -0.3]), P([-5, -5.47, -0.3])];
            const dec = P(cable(1));
            const aim: [number, number] = [lerp(c.x, dec.x, toDecoy), lerp(c.y, dec.y, toDecoy)];
            const toEm = Math.atan2(emitter[1] - c.y, emitter[0] - c.x);
            const jam = ramp(t, 31.0, 31.5) * (1 - ramp(t, 34.0, 34.5));
            const pts = Array.from({ length: 24 }, (_, i) => P(cable(i / 23)));
            return (
              <>
                <GlowDefs />
                <Illumination from={emitter} to={aim} p={ramp(t, 29.6, 30.2) * (1 - ramp(t, 33.9, 34.3)) + ramp(t, 36.9, 37.4)} />
                {pods.map((q, i) => (
                  <Jamming key={i} x={q.x} y={q.y} angle={toEm} p={jam} t={t + i * 0.3} spread={0.35} reach={420} />
                ))}
                <Flares P={P} t={t} t0={32.8} origin={[-5.6, 0, -0.5]} pairs={4} />
                {t > 25.4 && t < 34.4 && <Warn x={c.x} y={c.y} angle={toEm} p={ramp(t, 30.1, 30.5) * (1 - ramp(t, 33.9, 34.3))} label="Radar" t={t} />}
                {L > 0.2 && (
                  <g>
                    <polyline points={pts.map((q) => `${q.x},${q.y}`).join(" ")} fill="none" stroke="rgba(235,227,210,0.85)" strokeWidth={2} />
                    <circle cx={dec.x} cy={dec.y} r={40} fill="url(#decoy-glow)" opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 6))} />
                    <rect x={dec.x - 16} y={dec.y - 6} width={32} height={12} rx={6} fill="#d8dcdf" stroke="#2a2d30" strokeWidth={1.5} />
                  </g>
                )}
              </>
            );
          }}
        />
        <At x={CX} y={960}>
          <div style={{ opacity: ramp(t, 25.6, 26.1) * (1 - ramp(t, 33.9, 34.3)) }}>
            <Label size={34} color={C.ink} weight={700} style={{ letterSpacing: "0.34em" }}>
              Typhoon
            </Label>
          </div>
        </At>
        <AbsoluteFill style={{ opacity: 1 - ramp(t, 34.0, 34.5) }}>
          <At x={1520} y={200}>
            <KeyTitle text="DASS" t={t} at={26.8} size={140} neon="white" />
          </At>
          <At x={1520} y={300}>
            <Rise p={ramp(t, 27.4, 27.9)}>
              <Label size={28} color={C.offWhite} weight={600}>
                Defensive aids sub-system
              </Label>
            </Rise>
          </At>
          {[
            { at: 30.2, text: "Warning", dark: false },
            { at: 31.0, text: "Electronic jamming", dark: true },
            { at: 32.7, text: "Defensive measures", dark: false },
          ].map((k, i) => (
            <At key={k.text} x={1520} y={390 + i * 70}>
              <Rise p={ramp(t, k.at, k.at + 0.45)}>
                <Tape p={1} size={32} dark={k.dark}>
                  {k.text}
                </Tape>
              </Rise>
            </At>
          ))}
        </AbsoluteFill>
        <At x={W / 2} y={130}>
          <KeyTitle text="RAF Typhoon" t={t} at={34.5} size={80} />
        </At>
        <At x={W / 2} y={960}>
          <Rise p={ramp(t, 37.2, 37.7)}>
            <Tape p={1} size={36} dark>
              Towed decoy
            </Tape>
          </Rise>
        </At>
        <Vignette strength={0.45} />
      </PaperGround>
    </TearReveal>
  );
};

/* Q04 38.6–64.3 on paper both are sophisticated; but little is published: the spec sheets get
 * redacted, only "general capabilities" stay readable; against every radar, missile, SAM: ? */
export const Q04Docs: React.FC = () => {
  const t = useT();
  const redact = ramp(t, 45.6, 48.2, ease.linear);
  const back = ramp(t, 59.2, 59.9);
  const hl = ramp(t, 51.6, 52.1);
  const icons = [
    { kind: "radar" as const, at: 60.9, label: "Radar" },
    { kind: "missile" as const, at: 61.7, label: "Missile" },
    { kind: "sam" as const, at: 62.4, label: "Air defence" },
  ];
  return (
    <BlotReveal t={t} start={38.6} dur={0.8} cx={W / 2} cy={H / 2}>
      <PaperGround>
        <Camera s={keys(t, [[38.6, 1.08], [45.4, 1.0], [48.4, 1.06], [59.2, 1.0]], ease.soft)}>
          <Layer>
            <AbsoluteFill style={{ ...recede(back, 6, 0.6, 0.1), opacity: 1 - back * 0.9, transformOrigin: "960px 560px" }}>
              <RedactedDoc x={640} y={590} w={560} h={740} p={ramp(t, 38.9, 39.5)} redact={redact} title="SPECTRA" rot={-3} open={[0, 1, 2]} highlight={hl} />
              <RedactedDoc x={1280} y={600} w={560} h={740} p={ramp(t, 39.2, 39.8)} redact={redact} title="DASS" rot={2.5} open={[0, 1, 2]} highlight={hl} />
              <At x={W / 2} y={130}>
                <KeyTitle text="On paper" t={t} at={39.0} size={96} out={42.5} />
              </At>
              <At x={W / 2} y={130}>
                <KeyTitle text="Least transparent" t={t} at={45.7} size={96} neon="white" out={51.3} />
              </At>
              <At x={W / 2} y={975}>
                <Rise p={ramp(t, 41.0, 41.5) * (1 - ramp(t, 42.6, 43.0))}>
                  <Tape p={1} size={34}>
                    Highly sophisticated
                  </Tape>
                </Rise>
              </At>
              <At x={W / 2} y={130}>
                <Rise p={hl * (1 - ramp(t, 58.9, 59.3))}>
                  <Tape p={1} size={36} dark>
                    General capabilities only
                  </Tape>
                </Rise>
              </At>
            </AbsoluteFill>
            {/* against every radar, missile, air defence system: no public answer */}
            <AbsoluteFill style={{ opacity: back }}>
              <At x={W / 2} y={200}>
                <KeyTitle text="How would each perform?" t={t} at={59.4} size={80} />
              </At>
              {icons.map((ic, i) => {
                const p = ramp(t, ic.at - 0.15, ic.at + 0.35);
                return (
                  <At key={ic.label} x={560 + i * 400} y={560}>
                    <div style={{ opacity: p, transform: `translateY(${(1 - ease.out(p)) * 40}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                      <Icon kind={ic.kind} size={170} />
                      <Label size={30} color={C.ink} weight={700} style={{ letterSpacing: "0.24em" }}>
                        {ic.label}
                      </Label>
                      <div style={{ fontFamily: "Anton, sans-serif", fontSize: 90, color: C.red, opacity: ramp(t, ic.at + 0.3, ic.at + 0.6) }}>?</div>
                    </div>
                  </At>
                );
              })}
            </AbsoluteFill>
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

/* Q05 64.1–70.7 not enough public information to declare one universally superior. */
export const Q05Superior: React.FC = () => {
  const t = useT();
  return (
    <TearReveal t={t} start={64.1} dur={0.6} dir="ltr">
      <PaperGround dark>
        <Camera s={keys(t, [[64.1, 1.1], [70.7, 1.0]], ease.soft)}>
          <Layer>
            <At x={560} y={440}>
              <KeyTitle text="SPECTRA" t={t} at={64.6} size={130} color="#ffb4a6" />
            </At>
            <At x={1380} y={440}>
              <KeyTitle text="DASS" t={t} at={64.9} size={130} />
            </At>
            <At x={W / 2} y={440}>
              <div style={{ fontFamily: "Anton, sans-serif", fontSize: 200, color: C.red, opacity: ramp(t, 65.6, 66.0), transform: `scale(${0.7 + 0.3 * ease.out(ramp(t, 65.6, 66.2))})` }}>?</div>
            </At>
            <At x={W / 2} y={760}>
              <KeyTitle text="Universally superior" t={t} at={68.3} size={96} />
            </At>
            <Strike x1={W / 2 - 500} x2={W / 2 + 500} y={760} p={ramp(t, 69.4, 69.9)} width={14} />
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* Q06 70.6–86.1 no system makes a jet invulnerable; survival also rests on planning, intelligence,
 * electronic support and the threats actually present. */
const Spectrum: React.FC<{ t: number }> = ({ t }) => (
  <svg viewBox="0 0 600 300" style={{ width: "100%", height: "100%" }}>
    {Array.from({ length: 60 }, (_, i) => {
      const peak = Math.exp(-(((i - 18) / 3) ** 2)) * 0.9 + Math.exp(-(((i - 41) / 2.2) ** 2)) * 0.7;
      const h = 12 + (peak + 0.12 * random(`s${i}${Math.floor(t * 12)}`)) * 200;
      return <rect key={i} x={20 + i * 9.4} y={250 - h} width={6} height={h} fill={peak > 0.3 ? "#ff7a62" : "rgba(235,227,210,0.7)"} />;
    })}
    <line x1={20} y1={250} x2={580} y2={250} stroke="rgba(235,227,210,0.6)" strokeWidth={2} />
  </svg>
);
const RouteMap: React.FC<{ p: number; rings?: boolean }> = ({ p, rings }) => (
  <svg viewBox="0 0 600 300" style={{ width: "100%", height: "100%" }}>
    <rect x={0} y={0} width={600} height={300} fill="#1f2a30" />
    {[
      [300, 150, 90],
      [430, 90, 60],
      [200, 60, 50],
    ].map(([x, y, r], i) => (
      <g key={i} opacity={rings ? 1 : 0.35}>
        <circle cx={x} cy={y} r={r} fill="rgba(201,64,46,0.18)" stroke="#e0503b" strokeWidth={2.5} strokeDasharray="6 6" />
        <circle cx={x} cy={y} r={5} fill="#e0503b" />
      </g>
    ))}
    <path d="M30,270 C140,260 190,220 250,262 C320,300 420,240 470,200 C520,165 540,120 575,70" fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="10 8" pathLength={1} strokeDashoffset={0} opacity={p} />
    <circle cx={575} cy={70} r={8} fill={C.ink} opacity={p} />
  </svg>
);
export const Q06Survive: React.FC = () => {
  const t = useT();
  const up = ramp(t, 75.2, 76.0, ease.inOut);
  const cells = [
    { at: 79.1, label: "Planning", x: 560, y: 520 },
    { at: 80.0, label: "Intelligence", x: 1360, y: 520 },
    { at: 81.1, label: "Electronic support", x: 560, y: 860 },
    { at: 83.4, label: "Threats in the area", x: 1360, y: 860 },
  ];
  return (
    <BlotReveal t={t} start={70.6} dur={0.8} cx={W / 2} cy={H / 2}>
      <PaperGround dark>
        <Camera s={keys(t, [[70.6, 1.08], [75, 1.0], [86.1, 1.02]], ease.soft)}>
          <Layer>
            <At x={W / 2} y={lerp(520, 150, up)}>
              <div style={{ transform: `scale(${lerp(1.5, 0.72, up)})` }}>
                <KeyTitle text="Invulnerable" t={t} at={72.4} size={120} />
              </div>
            </At>
            <Strike x1={W / 2 - lerp(470, 225, up)} x2={W / 2 + lerp(470, 225, up)} y={lerp(520, 150, up)} p={ramp(t, 74.2, 74.7)} width={lerp(16, 9, up)} />
            <At x={W / 2} y={265}>
              <Rise p={ramp(t, 77.2, 77.7)}>
                <Label size={30} color={C.inkSoft} weight={700} style={{ letterSpacing: "0.3em" }}>
                  Survivability also depends on
                </Label>
              </Rise>
            </At>
            {cells.map((c, i) => (
              <Tile key={c.label} x={c.x} y={c.y} w={720} h={300} p={ramp(t, c.at - 0.15, c.at + 0.4)} label={c.label}>
                {i === 0 && <RouteMap p={ramp(t, 79.2, 80.4)} />}
                {i === 1 && <Clip src="aw-screens" from={79.8} to={86.3} clipDur={5} />}
                {i === 2 && <Spectrum t={t} />}
                {i === 3 && <RouteMap p={1} rings />}
              </Tile>
            ))}
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};
