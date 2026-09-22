import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture, Vignette } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Display, Label, Rise, Tape } from "../components/Type";
import { ArrowHead, DrawPath, Stage, handLine } from "../components/Draw";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { Blueprint, Dimension, TitleBlock } from "../components/Blueprint";
import { GraphPaper } from "./Open";
import { C, W, H } from "../lib/theme";
import { drift, ease, keys, lerp, ramp, useT } from "../lib/time";
import { liftFrom } from "../lib/cuts";

/* ------------------------------------------------------------------ S04
 * 24.2–36.0 "On the other side, we have the Dassault Rafale. And from the beginning,
 * the idea behind the Rafale was a little different. It was designed as a more
 * versatile do-it-all fighter."
 * Whip in: a Croatian Rafale nose-on, the name between photo and aircraft. On "the idea
 * behind" the photo becomes a print on a drafting table and the three-view plate is
 * plotted with real dimensions; "do-it-all" lands on the number of hardpoints.
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
  const back = ramp(t, 28.0, 29.5, ease.inOut);
  const side = ramp(t, 28.6, 30.6, ease.linear);
  const plan = ramp(t, 29.6, 32.0, ease.linear);
  const front = ramp(t, 30.4, 32.2, ease.linear);
  const dims = ramp(t, 31.0, 31.7);
  const hard = ramp(t, 32.9, 33.6);
  const camS = keys(t, [[24.2, 1.08], [27.9, 1.0], [29.5, 1.06], [32.0, 1.0], [35.9, 1.05]], ease.soft);
  const camX = keys(t, [[24.2, 0], [29.5, -120], [32.0, 0], [35.9, 60]], ease.soft);
  const camY = keys(t, [[24.2, 0], [29.5, -130], [32.0, 40], [35.9, 60]], ease.soft);
  const px = lerp(W / 2, 1560, back);
  const py = lerp(H / 2, 610, back);
  const printOut = ramp(t, 32.3, 32.8, ease.inOut);
  const ps = lerp(1, 0.27, back);
  return (
    <AbsoluteFill style={{ transform: `translateX(${(1 - inP) * W}px)`, filter: whipBlur > 0.5 ? `blur(${whipBlur}px)` : undefined }}>
      <PaperGround>
        <Camera s={camS} x={camX * back} y={camY * back}>
          <Layer depth={0.95}>
            <div style={{ opacity: back }}>
              <GraphPaper />
            </div>
          </Layer>
          {/* three-view plate (Dassault Rafale 3-view line drawing, Kaboldy, CC BY-SA 3.0) */}
          <Layer depth={1}>
            <Blueprint view="rafaleSide" x={660} y={270} width={1000} p={side} lineWidth={1.5} />
            <Blueprint view="rafaleTop" x={560} y={740} width={760} p={plan} lineWidth={1.4} />
            <Blueprint view="rafaleFront" x={1470} y={300} width={260} rot={-90} p={front} lineWidth={1.4} />
            <Stage>
              <Dimension x1={179} y1={448} x2={1141} y2={448} label="15.27 m" p={dims} />
              <Dimension x1={975} y1={480} x2={975} y2={1000} label="10.90 m" p={ramp(t, 31.3, 32.0)} side={-1} />
            </Stage>
            <TitleBlock x={1240} y={800} kicker="Dassault Aviation · three views" title="Rafale" rows={[["Length", "15.27 m"], ["Span", "10.90 m"], ["Height", "5.34 m"]]} p={ramp(t, 31.2, 31.9)} width={560} />
            <At x={1085} y={610} anchor="left">
              <div style={{ display: "flex", alignItems: "baseline", gap: 18, opacity: hard, transform: `scale(${0.9 + hard * 0.1})`, transformOrigin: "left center" }}>
                <Display size={190} color={C.red}>
                  14
                </Display>
                <Label size={30} color={C.ink} weight={600}>
                  hardpoints
                </Label>
              </div>
            </At>
          </Layer>
          {/* the photograph, later a print on the table */}
          <Layer depth={1.02}>
            <AbsoluteFill style={{ transform: `translate(${px - W / 2}px, ${py - H / 2}px) scale(${ps}) rotate(${back * 4}deg)`, transformOrigin: "50% 50%", opacity: 1 - printOut }}>
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", clipPath: back > 0 ? `inset(${back * 14}% ${back * 6}% ${back * 14}% ${back * 6}%)` : undefined, boxShadow: "0 30px 50px rgba(0,0,0,0.45)" }}>
                <AbsoluteFill style={{ background: C.night }} />
                <Img src={staticFile("src-photos/rafale-croatia.jpg")} style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, filter: `brightness(${1 - up * 0.35 * (1 - back)}) blur(${up * 3 * (1 - back)}px)` }} />
                <PrintTexture opacity={0.3} />
                <At x={W / 2} y={H / 2 + 230}>
                  <Rise p={name} q={back}>
                    <Display size={360} color={C.offWhite} tracking={0.04}>
                      Rafale
                    </Display>
                  </Rise>
                  <br />
                  <Rise p={ramp(t, 26.4, 26.9)} q={back}>
                    <Label size={36} color={C.offWhite} weight={600} style={{ letterSpacing: "0.5em", marginTop: 4 }}>
                      Dassault
                    </Label>
                  </Rise>
                </At>
                <Cutout name="rafale-croatia" x={lift.x + drift(t, "rc", 3)} y={lift.y + drift(t, "rc2", 3)} w={lift.w} scale={1 + up * 0.08} sticker={false} shadow={up * 1.2} opacity={up > 0 && back < 1 ? 1 : 0} style={{ opacity: Math.min(1, up * 4) * (1 - back) }} />
              </div>
            </AbsoluteFill>
          </Layer>
        </Camera>
      </PaperGround>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S05
 * 35.25–45.9 "It can handle air-to-air combat, precision strikes, anti-ship missions,
 * and in its naval version, it can even operate directly from an aircraft carrier."
 * The Rafale plan view on a dark sheet; one vector per mission reaches the real
 * weapon as it is named; the anti-ship vector dives into the sea and opens the carrier deck.
 */
export const S05Missions: React.FC = () => {
  const t = useT();
  const a2a = ramp(t, 36.0, 36.6);
  const strike = ramp(t, 37.4, 38.0);
  const ship = ramp(t, 38.72, 39.3);
  const camX = keys(t, [[35.3, -60], [36.4, 10], [37.8, 40], [39.3, 60], [40.4, 150]], ease.soft);
  const camY = keys(t, [[35.3, 0], [36.4, -50], [37.8, 0], [39.3, 70], [41.0, 200]], ease.soft);
  const camS = keys(t, [[35.3, 1.1], [39.4, 1.14], [41.2, 1.6]], ease.soft);
  const nose = { x: 880, y: 560 };
  const tgt = { a: { x: 1400, y: 260 }, s: { x: 1500, y: 580 }, x: { x: 1330, y: 880 } };
  return (
    <TearReveal t={t} start={35.25} dur={0.8} dir="rtl" seed="s05">
      <PaperGround dark>
        <Camera x={camX} y={camY} s={camS}>
          <Layer depth={0.95}>
            <Blueprint view="rafaleTop" x={620} y={560} width={560} rot={180} p={ramp(t, 35.4, 36.4, ease.linear)} color="#e7dfcf" lineWidth={1.3} />
            <Stage>
              <DrawPath d={handLine(nose.x + 10, nose.y - 30, tgt.a.x - 250, tgt.a.y + 30, 0.1, "a")} p={a2a} color={C.offWhite} width={3.5} dash={12} />
              <ArrowHead x={tgt.a.x - 250} y={tgt.a.y + 30} angle={-32} color={C.offWhite} p={a2a} />
              <DrawPath d={handLine(nose.x + 20, nose.y, tgt.s.x - 260, tgt.s.y, -0.05, "s")} p={strike} color={C.offWhite} width={3.5} dash={12} />
              <ArrowHead x={tgt.s.x - 260} y={tgt.s.y} angle={3} color={C.offWhite} p={strike} />
              <DrawPath d={handLine(nose.x + 10, nose.y + 30, tgt.x.x - 230, tgt.x.y - 40, -0.1, "x")} p={ship} color={C.red} width={4} dash={12} />
              <ArrowHead x={tgt.x.x - 230} y={tgt.x.y - 40} angle={36} color={C.red} p={ship} />
            </Stage>
          </Layer>
          <Layer depth={1.05}>
            <Cutout name="meteor" x={tgt.a.x} y={tgt.a.y} w={460} rot={-6} opacity={a2a} scale={0.85 + a2a * 0.15} />
            <At x={tgt.a.x} y={tgt.a.y + 130}>
              <Rise p={ramp(t, 36.3, 36.8)}>
                <Tape p={1} rot={-2}>
                  Air-to-air
                </Tape>
              </Rise>
            </At>
            <Photo src="src-photos/rafale-m-armed.jpg" x={tgt.s.x} y={tgt.s.y} w={420} h={273} rot={2} reveal={strike} revealFrom="left" seed="strk" zoom={1.25} />
            <At x={tgt.s.x} y={tgt.s.y + 170}>
              <Rise p={ramp(t, 37.7, 38.2)}>
                <Tape p={1} rot={1.5}>
                  Precision strike
                </Tape>
              </Rise>
            </At>
            <Cutout name="exocet" x={tgt.x.x} y={tgt.x.y} w={340} rot={4} opacity={ship} scale={0.85 + ship * 0.15} />
            <At x={tgt.x.x} y={tgt.x.y + 140}>
              <Rise p={ramp(t, 39.0, 39.5)}>
                <Tape p={1} rot={-1} dark>
                  Anti-ship
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
        <BlotReveal t={t} start={40.35} dur={1.1} cx={1180} cy={870} seed="sea">
          <AbsoluteFill style={{ background: C.night }}>
            <Img
              src={staticFile("src-photos/rafale-deck.jpg")}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${keys(t, [[40.3, 1.25], [45.9, 1.06]], ease.soft)}) translate(${keys(t, [[40.3, -30], [45.9, 10]], ease.soft)}px, 0)`,
                filter: "contrast(1.05) saturate(0.88)",
              }}
            />
            <PrintTexture opacity={0.3} />
            <Vignette strength={0.45} />
            <At x={W / 2} y={H - 150}>
              <Rise p={ramp(t, 40.62, 41.2)} q={ramp(t, 44.7, 45.1)}>
                <Tape p={1} dark size={34}>
                  Rafale M
                </Tape>
              </Rise>
            </At>
          </AbsoluteFill>
        </BlotReveal>
      </PaperGround>
    </TearReveal>
  );
};
