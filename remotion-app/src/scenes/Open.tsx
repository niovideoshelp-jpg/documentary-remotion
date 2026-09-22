import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture, Vignette } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Display, Hand, Label, Rise, Tape } from "../components/Type";
import { DrawPath, Stage, scribbleEllipse, ArrowHead } from "../components/Draw";
import { TearReveal } from "../components/Transitions";
import { C, W, H } from "../lib/theme";
import { ease, keys, lerp, ramp, useT, drift } from "../lib/time";
import { liftFrom } from "../lib/cuts";

/* ------------------------------------------------------------------ S01
 * 0.0–7.6  "This is the Eurofighter Typhoon, a twin-engine fighter ... air combat."
 * Real photograph first; on the name the aircraft lifts off its own print as a
 * paper cutout, the name sits between photo and aircraft (depth sandwich).
 */
export const S01Typhoon: React.FC = () => {
  const t = useT();
  // photo drawn at its own aspect (2000x1333) slightly larger than the frame
  const pw = 2080;
  const ph = pw * (1333 / 2000);
  const rect = { x: (W - pw) / 2, y: (H - ph) / 2, w: pw, h: ph };
  const lift = liftFrom("typhoon-flight", rect);
  const up = ramp(t, 1.0, 1.9, ease.out);
  const camS = keys(t, [[0, 1.0], [1.0, 1.03], [4.2, 1.1], [7.4, 1.32]], ease.soft);
  const camX = keys(t, [[0, 0], [4.2, 20], [7.4, 150]], ease.soft);
  const camY = keys(t, [[0, 0], [7.4, -20]], ease.soft);
  const fly = ramp(t, 4.4, 7.4, ease.in); // aircraft pushes forward on "air combat"
  const name = ramp(t, 1.82, 2.5);
  const eng = ramp(t, 3.0, 3.75, ease.soft);
  const note = ramp(t, 3.3, 3.9);
  const combat = ramp(t, 5.6, 6.4);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Camera x={camX} y={camY} s={camS}>
        {/* background: the untouched photograph, pushed back once the aircraft lifts */}
        <Layer depth={0.45}>
          <AbsoluteFill style={{ filter: `blur(${up * 5}px) brightness(${1 - up * 0.42}) saturate(${1 - up * 0.3})` }}>
            <Img src={staticFile("photos/typhoon-flight.jpg")} style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h }} />
            <PrintTexture opacity={0.25} />
          </AbsoluteFill>
        </Layer>
        {/* name behind the aircraft */}
        <Layer depth={0.7}>
          <At x={W / 2 - 40 - fly * 80} y={H / 2 + 20}>
            <Rise p={ramp(t, 1.05, 1.6)}>
              <Label size={34} color={C.offWhite} weight={600} style={{ letterSpacing: "0.5em", marginBottom: 6 }}>
                Eurofighter
              </Label>
            </Rise>
            <br />
            <Rise p={name}>
              <Display size={340} color={C.offWhite} tracking={0.03} style={{ opacity: 0.94 }}>
                Typhoon
              </Display>
            </Rise>
          </At>
        </Layer>
        {/* the aircraft itself, lifted off the photo */}
        <Layer depth={1.05}>
          <Cutout
            name="typhoon-flight"
            x={lift.x + fly * 420 + drift(t, "ty", 4)}
            y={lift.y - fly * 60 + drift(t, "ty2", 3)}
            w={lift.w}
            scale={1 + up * 0.06 + fly * 0.18}
            rot={-fly * 3}
            opacity={up > 0 ? 1 : 0}
            shadow={up * 1.4}
            sticker={true}
            style={{ opacity: Math.min(1, up * 3) }}
          />
          {/* twin-engine: pencil ring around the two nozzles */}
          <Stage>
            <g transform={`translate(${fly * 420}, ${-fly * 60})`} opacity={1 - ramp(t, 4.6, 5.2)}>
              <DrawPath d={scribbleEllipse(lift.x - lift.w * 0.33, lift.y + lift.w * 0.035, 105, 80, "eng")} p={eng} color={C.red} width={5} />
            </g>
          </Stage>
          <At x={lift.x - lift.w * 0.33 + fly * 420} y={lift.y + lift.w * 0.035 + 135} rot={-4}>
            <div style={{ opacity: note * (1 - ramp(t, 4.6, 5.2)) }}>
              <Hand size={52} color={C.offWhite}>
                twin-engine
              </Hand>
            </div>
          </At>
        </Layer>
        {/* air combat: speed streaks across the sky */}
        <Layer depth={0.8}>
          <Stage>
            {Array.from({ length: 9 }, (_, i) => {
              const y = 220 + i * 78 + (i % 2) * 20;
              const st = 5.6 + i * 0.07;
              return (
                <DrawPath
                  key={i}
                  d={`M${2100 - i * 40},${y} L${-200 + i * 30},${y + 40}`}
                  p={ramp(t, st, st + 0.5, ease.in)}
                  q={ramp(t, st + 0.35, st + 0.9, ease.in)}
                  color="#f4efe4"
                  width={i % 3 === 0 ? 3 : 1.5}
                  opacity={0.55}
                />
              );
            })}
          </Stage>
        </Layer>
      </Camera>
      <At x={W / 2} y={H - 150}>
        <Rise p={combat} q={ramp(t, 6.9, 7.3)}>
          <Tape p={1} dark>
            Air combat
          </Tape>
        </Rise>
      </At>
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S02
 * 7.0–15.8 "Its original mission was pretty clear. Intercept threats, climb fast,
 * build speed, and take on other fighters in the air."
 * A flight-profile sketch on graph paper: the real aircraft rides a line that is
 * drawn as each task is spoken; the QRA intercept photo is the evidence.
 */
const GraphPaper: React.FC<{ offY?: number }> = ({ offY = 0 }) => (
  <Stage>
    {Array.from({ length: 60 }, (_, i) => (
      <line key={"v" + i} x1={i * 48 - 480} y1={-1200} x2={i * 48 - 480} y2={2400} stroke="#6f8ea3" strokeOpacity={i % 5 === 0 ? 0.28 : 0.12} strokeWidth={i % 5 === 0 ? 1.4 : 1} />
    ))}
    {Array.from({ length: 70 }, (_, i) => (
      <line key={"h" + i} x1={-600} y1={i * 48 - 1200 + (offY % 48)} x2={2600} y2={i * 48 - 1200 + (offY % 48)} stroke="#6f8ea3" strokeOpacity={i % 5 === 0 ? 0.28 : 0.12} strokeWidth={i % 5 === 0 ? 1.4 : 1} />
    ))}
  </Stage>
);

// flight path in stage coordinates: take-off run → steep climb → dash → turning fight
const PATH = "M1740,880 L1400,880 C1280,880 1220,760 1160,560 C1110,390 1040,300 880,290 L420,290 C280,290 220,380 280,450 C340,520 450,470 420,390";
const pathPoint = (u: number) => {
  // piecewise sampling of PATH using an offscreen SVG when available
  if (typeof document === "undefined") return { x: 0, y: 0, a: 0 };
  const el = getPath();
  const L = el.getTotalLength();
  const p = el.getPointAtLength(u * L);
  const p2 = el.getPointAtLength(Math.min(L, u * L + 4));
  return { x: p.x, y: p.y, a: ((Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI + 360) % 360 };
};
let cached: SVGPathElement | null = null;
const getPath = () => {
  if (!cached) {
    cached = document.createElementNS("http://www.w3.org/2000/svg", "path");
    cached.setAttribute("d", PATH);
  }
  return cached;
};

export const S02Mission: React.FC = () => {
  const t = useT();
  // progress along the path, paced to the words
  const u = keys(
    t,
    [
      [7.6, 0.0],
      [9.3, 0.08],
      [10.44, 0.2],
      [11.64, 0.45],
      [12.5, 0.66],
      [14.2, 1.0],
    ],
    ease.soft,
  );
  const pt = pathPoint(u);
  const leave = ramp(t, 14.75, 15.75, ease.inOut); // camera tilts down into S03
  const camX = keys(t, [[7.0, 80], [9.3, 0], [12.5, -180], [14.6, -240]], ease.soft);
  const camY = lerp(0, 1080, leave);
  const intercept = ramp(t, 9.3, 10.0);
  const climb = ramp(t, 10.44, 11.1);
  const speed = ramp(t, 11.64, 12.3);
  const fight = ramp(t, 12.5, 13.8, ease.soft);
  return (
    <TearReveal t={t} start={7.0} dur={0.95} dir="ltr" seed="s02">
      <PaperGround>
        <Camera x={camX} y={camY}>
          <Layer depth={0.9}>
            <GraphPaper />
          </Layer>
          <Layer>
            <Stage>
              {/* ground line & runway ticks */}
              <DrawPath d="M1860,905 L20,905" p={ramp(t, 7.3, 8.3)} color={C.pencil} width={3} />
              {Array.from({ length: 9 }, (_, i) => (
                <DrawPath key={i} d={`M${1720 - i * 40},918 L${1696 - i * 40},918`} p={ramp(t, 7.6 + i * 0.03, 7.9 + i * 0.03)} color={C.pencil} width={4} />
              ))}
              {/* altitude axis, drawn once "climb fast" is spoken */}
              <DrawPath d="M1800,905 L1800,210" p={climb} color={C.pencil} width={2.5} />
              <ArrowHead x={1800} y={210} angle={-90} color={C.pencil} p={climb} size={16} />
              {/* flight path trail */}
              <DrawPath d={PATH} p={u} color={C.red} width={5} dash={14} />
              {/* turning fight: second, opposing track loops against ours */}
              <DrawPath d="M160,210 C300,200 400,260 380,350 C360,440 230,450 200,370 C180,310 260,280 320,320" p={fight} color={C.inkSoft} width={3.5} dash={9} />
              <ArrowHead x={320} y={320} angle={30} color={C.inkSoft} p={ramp(t, 13.5, 13.9)} size={14} />
            </Stage>
          </Layer>
          {/* evidence: RAF QRA Typhoon intercepting a Russian Tu-95 Bear */}
          <Layer depth={1.08}>
            <Photo
              src="src-photos/typhoon-bear.jpg"
              x={550}
              y={560}
              w={560}
              h={400}
              rot={-2.5}
              reveal={intercept}
              revealFrom="bottom"
              seed="bear"
              zoom={1.1 + (t - 9.3) * 0.012}
              opacity={1 - ramp(t, 12.2, 12.8) * 0.75}
            />
            <At x={550} y={800}>
              <Rise p={ramp(t, 9.75, 10.3)} q={ramp(t, 12.2, 12.6)}>
                <Tape p={1} rot={-2}>
                  Intercept
                </Tape>
              </Rise>
            </At>
          </Layer>
          {/* the aircraft, a real RAF Typhoon side view */}
          <Layer depth={1.1}>
            <Cutout
              name="typhoon-pair"
              x={pt.x}
              y={pt.y - 30}
              w={330 + speed * 30}
              rot={pt.a - 180}
              opacity={ramp(t, 7.5, 7.9)}
            />
            <Stage>
              {/* speed lines behind the aircraft once "build speed" is said */}
              {[0, 1, 2].map((i) => (
                <line
                  key={i}
                  x1={pt.x + 220 + i * 30}
                  y1={pt.y - 40 + i * 22}
                  x2={pt.x + 220 + i * 30 + 160 * speed * (1 - fight * 0.7)}
                  y2={pt.y - 40 + i * 22}
                  stroke={C.ink}
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={speed * (1 - fight) * 0.7}
                />
              ))}
            </Stage>
          </Layer>
          <Layer>
            <At x={1160} y={470} rot={6}>
              <div style={{ opacity: climb * (1 - ramp(t, 12.4, 12.9)) }}>
                <Hand size={46}>climb fast</Hand>
              </div>
            </At>
            <At x={740} y={220} rot={-2}>
              <div style={{ opacity: speed * (1 - ramp(t, 13.3, 13.8)) }}>
                <Hand size={46}>build speed</Hand>
              </div>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* ------------------------------------------------------------------ S03
 * 14.75–24.9 "But over time, the Typhoon evolved. It stopped being just an air
 * combat specialist and gradually took on missions against targets on the ground."
 * The camera keeps tilting down from the sky sketch to the ground: the air-combat
 * print is joined, then overtaken, by the real Paveway release photograph.
 */
export const S03Ground: React.FC = () => {
  const t = useT();
  const arrive = ramp(t, 14.75, 15.75, ease.inOut);
  const y0 = lerp(1080, 0, arrive);
  const air = ramp(t, 15.3, 16.2);
  const just = ramp(t, 18.25, 18.9);
  const ground = ramp(t, 20.4, 21.3);
  const targets = ramp(t, 21.9, 22.8);
  const camS = keys(t, [[15.5, 1.0], [20.3, 1.03], [24.2, 1.22]], ease.soft);
  const camX = keys(t, [[15.5, 0], [20.3, -20], [24.2, 170]], ease.soft);
  const out = ramp(t, 24.2, 24.8, ease.in);
  return (
    <AbsoluteFill style={{ transform: `translate(${-out * W}px, ${y0}px)`, filter: out > 0 ? `blur(${Math.sin(out * Math.PI) * 10}px)` : undefined }}>
      <PaperGround>
        <Camera x={camX} s={camS}>
          <Layer depth={0.9}>
            <GraphPaper offY={0} />
          </Layer>
          <Layer depth={0.95}>
            {/* air combat: the original identity, a real RAF pair in flight */}
            <Photo
              src="src-photos/typhoon-pair.jpg"
              x={lerp(760, 560, ground)}
              y={lerp(470, 420, ground)}
              w={lerp(820, 640, ground)}
              h={lerp(586, 457, ground)}
              rot={lerp(-1.5, -4, ground)}
              reveal={air}
              revealFrom="left"
              seed="pair"
              zoom={1.05 + (t - 15) * 0.006}
              opacity={1 - ground * 0.25}
            />
            <At x={lerp(760, 560, ground)} y={lerp(830, 700, ground)} rot={-2}>
              <Rise p={ramp(t, 18.7, 19.4)}>
                <Tape p={1}>Air combat</Tape>
              </Rise>
            </At>
            {/* "just": the specialist label gets a hand-drawn plus */}
            <At x={lerp(1240, 900, ground)} y={lerp(470, 760, ground)} rot={-8}>
              <div style={{ opacity: just }}>
                <Hand size={110}>+</Hand>
              </div>
            </At>
          </Layer>
          <Layer depth={1.1}>
            {/* ground attack: RAF Typhoon releasing a Paveway */}
            <Photo
              src="src-photos/typhoon-drop.jpg"
              x={1250}
              y={560}
              w={880}
              h={629}
              rot={2}
              reveal={ground}
              revealFrom="top"
              seed="drop"
              zoom={1.15 + (t - 20) * 0.015}
              panX={-2}
            />
            <Stage>
              {/* the bomb's fall line to a ground target */}
              <DrawPath d="M1215,580 C1230,720 1270,860 1320,960" p={targets} color={C.red} width={4} dash={10} />
              <DrawPath d={scribbleEllipse(1325, 985, 70, 26, "tgt", 1.05)} p={ramp(t, 22.5, 23.1)} color={C.red} width={4.5} />
            </Stage>
            <At x={1325} y={1030}>
              <Rise p={ramp(t, 22.8, 23.3)}>
                <Tape p={1} dark rot={1.5}>
                  Ground attack
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </AbsoluteFill>
  );
};
