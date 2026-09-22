import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture, Vignette } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Display, Hand, Label, Rise, Tape } from "../components/Type";
import { ArrowHead, DrawPath, Stage, handLine } from "../components/Draw";
import { BlotReveal } from "../components/Transitions";
import { C, W, H } from "../lib/theme";
import { drift, ease, keys, lerp, ramp, useT } from "../lib/time";
import { liftFrom } from "../lib/cuts";

/* ------------------------------------------------------------------ S04
 * 24.2–35.8 "On the other side, we have the Dassault Rafale. And from the beginning,
 * the idea behind the Rafale was a little different. It was designed as a more
 * versatile do-it-all fighter."
 * Whip in from the right. A Croatian Rafale (F3R) nose-on, then the print is pulled
 * back onto a drafting sheet where Dassault's three-view drawing is traced.
 */
export const S04Rafale: React.FC = () => {
  const t = useT();
  const inP = ramp(t, 24.2, 24.8, ease.inOut);
  const whipBlur = Math.sin(inP * Math.PI) * 12;
  const pw = 2150;
  const ph = pw * (2560 / 3840);
  const rect = { x: (W - pw) / 2, y: (H - ph) / 2 - 20, w: pw, h: ph };
  const lift = liftFrom("rafale-croatia", rect);
  const up = ramp(t, 25.9, 26.8);
  const name = ramp(t, 26.1, 26.8);
  // 28.1 "the idea behind": pull back to the desk
  const back = ramp(t, 28.0, 29.6, ease.inOut);
  const draw = ramp(t, 29.2, 31.4, ease.soft);
  const versatile = ramp(t, 33.0, 33.7);
  const camS = keys(t, [[24.2, 1.08], [27.9, 1.0], [29.6, 1.0], [35.5, 1.07]], ease.soft);
  const camX = keys(t, [[24.2, 0], [29.6, 0], [35.5, -60]], ease.soft);
  // the photo print shrinks to a corner of the desk
  const px = lerp(W / 2, 1420, back);
  const py = lerp(H / 2, 760, back);
  const ps = lerp(1, 0.36, back);
  return (
    <AbsoluteFill style={{ transform: `translateX(${(1 - inP) * W}px)`, filter: whipBlur > 0.5 ? `blur(${whipBlur}px)` : undefined }}>
      <PaperGround>
        <Camera s={camS} x={camX}>
          {/* drafting sheet: the three-view drawing (Patrick Rogel, CC BY-SA) traced in */}
          <Layer depth={0.85}>
            <div
              style={{
                position: "absolute",
                left: 170,
                top: 225,
                width: 960,
                height: 645,
                opacity: back,
                clipPath: `inset(0 ${(1 - draw) * 100}% 0 0)`,
                mixBlendMode: "multiply",
              }}
            >
              <Img src={staticFile("src-photos/rafale-3view.jpg")} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "contrast(1.3) grayscale(1)" }} />
            </div>
            <Stage>
              {/* pencil lead following the trace edge */}
              {draw > 0 && draw < 1 && <line x1={170 + 960 * draw} y1={215} x2={170 + 960 * draw} y2={880} stroke={C.red} strokeWidth={2} opacity={0.6} />}
            </Stage>
          </Layer>
          {/* the photograph as a print */}
          <Layer depth={1}>
            <AbsoluteFill style={{ transform: `translate(${px - W / 2}px, ${py - H / 2}px) scale(${ps}) rotate(${back * 3}deg)`, transformOrigin: "50% 50%" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  clipPath: back > 0 ? `inset(${back * 16}% ${back * 7}% ${back * 16}% ${back * 7}%)` : undefined,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                }}
              >
                <AbsoluteFill style={{ background: C.night }} />
                <Img
                  src={staticFile("src-photos/rafale-croatia.jpg")}
                  style={{
                    position: "absolute",
                    left: rect.x,
                    top: rect.y,
                    width: rect.w,
                    height: rect.h,
                    filter: `brightness(${1 - up * 0.35 * (1 - back)}) blur(${up * 3 * (1 - back)}px)`,
                  }}
                />
                <PrintTexture opacity={0.3} />
                <At x={W / 2} y={H / 2 + 230}>
                  <Rise p={ramp(t, 25.6, 26.2)} q={back}>
                    <Label size={36} color={C.offWhite} weight={600} style={{ letterSpacing: "0.5em", marginBottom: 8 }}>
                      Dassault
                    </Label>
                  </Rise>
                  <br />
                  <Rise p={name} q={back}>
                    <Display size={360} color={C.offWhite} tracking={0.04}>
                      Rafale
                    </Display>
                  </Rise>
                </At>
                <Cutout
                  name="rafale-croatia"
                  x={lift.x + drift(t, "rc", 3)}
                  y={lift.y + drift(t, "rc2", 3)}
                  w={lift.w}
                  scale={1 + up * 0.08}
                  sticker={false}
                  shadow={up * 1.2}
                  opacity={up > 0 && back < 1 ? 1 : 0}
                  style={{ opacity: Math.min(1, up * 4) * (1 - back) }}
                />
              </div>
            </AbsoluteFill>
          </Layer>
          {/* "do-it-all": a single airframe, many jobs */}
          <Layer depth={1.1}>
            <Cutout name="rafale-vapor" x={lerp(1560, 1430, versatile)} y={300} w={620} rot={-4} opacity={versatile} scale={0.9 + versatile * 0.1} />
            <At x={1400} y={470} rot={-5}>
              <div style={{ opacity: ramp(t, 33.7, 34.3) }}>
                <Hand size={58}>do-it-all</Hand>
              </div>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S05
 * 35.3–45.6 "It can handle air-to-air combat, precision strikes, anti-ship missions,
 * and in its naval version, it can even operate directly from an aircraft carrier."
 * One airframe at the centre; three mission vectors are drawn to the real weapons
 * as they are named, then the anti-ship vector dives to sea and opens onto a
 * French Navy Rafale over a carrier deck.
 */
export const S05Missions: React.FC = () => {
  const t = useT();
  const inP = ramp(t, 35.25, 35.95, ease.inOut);
  const a2a = ramp(t, 36.0, 36.7);
  const strike = ramp(t, 37.4, 38.1);
  const ship = ramp(t, 38.72, 39.4);
  const camX = keys(t, [[35.3, -40], [36.4, 30], [37.8, 60], [39.3, 40], [40.4, 120]], ease.soft);
  const camY = keys(t, [[35.3, 0], [36.4, -40], [37.8, 0], [39.3, 60], [41.0, 180]], ease.soft);
  const camS = keys(t, [[35.3, 1.14], [39.4, 1.18], [41.2, 1.6]], ease.soft);
  const origin = { x: 700, y: 560 };
  const tgt = { a: { x: 1330, y: 250 }, s: { x: 1440, y: 575 }, x: { x: 1250, y: 880 } };
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${(1 - inP) * 100}%)` }}>
      <PaperGround dark>
        <Camera x={camX} y={camY} s={camS}>
          <Layer depth={0.9}>
            <Stage>
              {/* faint range rings around the aircraft: one centre, many directions */}
              {[220, 420, 620].map((r, i) => (
                <DrawPath key={r} d={`M${origin.x + r},${origin.y} A${r},${r} 0 1 1 ${origin.x + r - 0.1},${origin.y - 1}`} p={ramp(t, 35.4 + i * 0.12, 36.3 + i * 0.12)} color="#c9c2b2" width={1.2} opacity={0.35} />
              ))}
              <DrawPath d={handLine(origin.x + 160, origin.y - 60, tgt.a.x - 180, tgt.a.y + 30, 0.1, "a")} p={a2a} color={C.offWhite} width={3.5} dash={12} />
              <ArrowHead x={tgt.a.x - 180} y={tgt.a.y + 30} angle={-27} color={C.offWhite} p={a2a} />
              <DrawPath d={handLine(origin.x + 200, origin.y + 10, tgt.s.x - 300, tgt.s.y, -0.06, "s")} p={strike} color={C.offWhite} width={3.5} dash={12} />
              <ArrowHead x={tgt.s.x - 300} y={tgt.s.y} angle={3} color={C.offWhite} p={strike} />
              <DrawPath d={handLine(origin.x + 150, origin.y + 70, tgt.x.x - 230, tgt.x.y - 40, -0.1, "x")} p={ship} color={C.red} width={4} dash={12} />
              <ArrowHead x={tgt.x.x - 230} y={tgt.x.y - 40} angle={32} color={C.red} p={ship} />
            </Stage>
          </Layer>
          <Layer depth={1}>
            <Cutout name="rafale-m-flight" x={origin.x} y={origin.y} w={560} rot={-3} opacity={ramp(t, 35.3, 35.8)} />
            {/* air-to-air: MBDA Meteor */}
            <Cutout name="meteor" x={tgt.a.x + 60} y={tgt.a.y} w={520} rot={-6} opacity={a2a} scale={0.85 + a2a * 0.15} />
            <At x={tgt.a.x + 60} y={tgt.a.y + 150}>
              <Rise p={ramp(t, 36.3, 36.8)}>
                <Tape p={1} rot={-2}>
                  Air-to-air
                </Tape>
              </Rise>
            </At>
            {/* precision strike: armed Rafale M over the desert (US DoD) */}
            <Photo src="src-photos/rafale-m-armed.jpg" x={tgt.s.x + 60} y={tgt.s.y} w={440} h={286} rot={2} reveal={strike} revealFrom="left" seed="strk" zoom={1.25} />
            <At x={tgt.s.x + 60} y={tgt.s.y + 175}>
              <Rise p={ramp(t, 37.7, 38.2)}>
                <Tape p={1} rot={1.5}>
                  Precision strike
                </Tape>
              </Rise>
            </At>
            {/* anti-ship: MBDA Exocet AM39 */}
            <Cutout name="exocet" x={tgt.x.x + 40} y={tgt.x.y} w={380} rot={4} opacity={ship} scale={0.85 + ship * 0.15} />
            <At x={tgt.x.x + 40} y={tgt.x.y + 150}>
              <Rise p={ramp(t, 39.0, 39.5)}>
                <Tape p={1} rot={-1} dark>
                  Anti-ship
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
      {/* naval version: the sea opens from where the anti-ship vector points */}
      <BlotReveal t={t} start={40.35} dur={1.1} cx={1180} cy={870} seed="sea">
        <AbsoluteFill style={{ background: C.night }}>
          <Img
            src={staticFile("src-photos/rafale-deck.jpg")}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${keys(t, [[40.3, 1.25], [45.6, 1.06]], ease.soft)}) translate(${keys(t, [[40.3, -30], [45.6, 10]], ease.soft)}px, 0)`,
              filter: "contrast(1.05) saturate(0.88)",
            }}
          />
          <PrintTexture opacity={0.3} />
          <Vignette strength={0.45} />
          <At x={W / 2} y={H - 170}>
            <Rise p={ramp(t, 40.62, 41.2)} q={ramp(t, 44.7, 45.1)}>
              <Tape p={1} dark size={34}>
                Rafale M
              </Tape>
            </Rise>
          </At>
          <At x={W / 2} y={H - 110}>
            <Rise p={ramp(t, 43.5, 44.0)} q={ramp(t, 44.7, 45.1)}>
              <Label size={24} color={C.offWhite} weight={600}>
                Carrier operations
              </Label>
            </Rise>
          </At>
        </AbsoluteFill>
      </BlotReveal>
    </AbsoluteFill>
  );
};
