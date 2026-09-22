import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture, Vignette } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Display, Label, Rise, Tape } from "../components/Type";
import { ArrowHead, DrawPath, Stage } from "../components/Draw";
import { TearReveal } from "../components/Transitions";
import { Blueprint, Dimension, TitleBlock } from "../components/Blueprint";
import { C, W, H } from "../lib/theme";
import { ease, keys, lerp, ramp, useT, drift } from "../lib/time";
import { liftFrom } from "../lib/cuts";

/* ------------------------------------------------------------------ S01
 * 0.0–7.95 "This is the Eurofighter Typhoon, a twin-engine fighter that was designed
 * above all for air combat."
 * The real photograph; on the name the aircraft lifts off as a paper cutout and the
 * photo gives way to a dark drafting sheet where the Typhoon's plan view is plotted
 * behind it. Twin engines are shown by their two thrust lines, not a decorative ring.
 */
export const S01Typhoon: React.FC = () => {
  const t = useT();
  const pw = 2080;
  const ph = pw * (1333 / 2000);
  const rect = { x: (W - pw) / 2, y: (H - ph) / 2, w: pw, h: ph };
  const lift = liftFrom("typhoon-flight", rect);
  const up = ramp(t, 1.0, 1.7, ease.out);
  const photoGone = ramp(t, 1.05, 1.9, ease.inOut);
  const settle = ramp(t, 1.15, 2.3, ease.inOut);
  const fly = ramp(t, 4.6, 7.6, ease.in);
  const k = lerp(1, 0.5, settle);
  const ax = lerp(lift.x, 1010, settle) + fly * 520 + drift(t, "ty", 4);
  const ay = lerp(lift.y, 400, settle) - fly * 70 + drift(t, "ty2", 3);
  const sc = k * (1 + up * 0.05 + fly * 0.16);
  // twin nozzles relative to the cutout centre, measured on the source photograph
  const nz = { x: ax - lift.w * 0.41 * sc, y: ay - lift.w * 0.026 * sc };
  const camS = keys(t, [[0, 1.0], [1.0, 1.03], [4.4, 1.08], [7.9, 1.26]], ease.soft);
  const camX = keys(t, [[0, 0], [4.4, 16], [7.9, 170]], ease.soft);
  const thrust = ramp(t, 3.0, 3.6, ease.out);
  const thrustOut = ramp(t, 4.7, 5.2);
  const name = ramp(t, 1.82, 2.5);
  const g = sc / 0.5;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Camera x={camX} s={camS}>
        {/* dark drafting sheet with the Typhoon plan view plotted large behind the aircraft */}
        <Layer depth={0.4}>
          <PaperGround dark>
            <Blueprint view="typhoonTop" x={960} y={470} width={1700} rot={180} p={ramp(t, 1.4, 4.4, ease.linear)} color="#d9d0bd" lineWidth={1.3} opacity={0.3} />
          </PaperGround>
        </Layer>
        {/* the untouched photograph, before the lift */}
        <Layer depth={0.45}>
          <AbsoluteFill style={{ opacity: 1 - photoGone }}>
            <Img src={staticFile("photos/typhoon-flight.jpg")} style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.w, height: rect.h, transform: `scale(${1 + photoGone * 0.06})` }} />
            <PrintTexture opacity={0.25} />
          </AbsoluteFill>
        </Layer>
        <Layer depth={0.72}>
          <At x={W / 2 - fly * 90} y={790}>
            <Rise p={name}>
              <Display size={300} color={C.offWhite} tracking={0.03}>
                Typhoon
              </Display>
            </Rise>
            <br />
            <Rise p={ramp(t, 2.1, 2.6)}>
              <Label size={34} color="#cfc6b3" weight={600} style={{ letterSpacing: "0.5em", marginTop: 4 }}>
                Eurofighter
              </Label>
            </Rise>
          </At>
        </Layer>
        <Layer depth={1.05}>
          {/* twin-engine: one thrust line out of each nozzle */}
          <Stage>
            {[-1, 1].map((s) => (
              <DrawPath key={s} d={`M${nz.x - 12},${nz.y + s * 13 * g} L${nz.x - 12 - 260 * g},${nz.y + s * 13 * g}`} p={thrust} q={thrustOut} color={C.red} width={5} />
            ))}
            {[-1, 1].map((s) => (
              <ArrowHead key={"a" + s} x={nz.x - 12 - 260 * g * thrust} y={nz.y + s * 13 * g} angle={180} p={thrust * (1 - thrustOut)} size={14} />
            ))}
          </Stage>
          <Cutout name="typhoon-flight" x={ax} y={ay} w={lift.w} scale={sc} rot={-fly * 3} shadow={up * 1.4} opacity={up > 0 ? 1 : 0} />
          <At x={nz.x - 150 * g} y={nz.y + 70}>
            <Rise p={ramp(t, 3.3, 3.8)} q={thrustOut}>
              <Tape p={1} dark rot={-2}>
                Twin-engine
              </Tape>
            </Rise>
          </At>
        </Layer>
        <Layer depth={0.8}>
          <Stage>
            {Array.from({ length: 9 }, (_, i) => {
              const y = 200 + i * 80 + (i % 2) * 20;
              const st = 5.6 + i * 0.07;
              return <DrawPath key={i} d={`M${2100 - i * 40},${y} L${-200 + i * 30},${y + 40}`} p={ramp(t, st, st + 0.5, ease.in)} q={ramp(t, st + 0.35, st + 0.9, ease.in)} color="#f4efe4" width={i % 3 === 0 ? 3 : 1.5} opacity={0.5} />;
            })}
          </Stage>
        </Layer>
      </Camera>
      <At x={W / 2} y={H - 120}>
        <Rise p={ramp(t, 5.75, 6.3)} q={ramp(t, 7.0, 7.4)}>
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
 * The Typhoon is plotted as an engineering plate (real dimensions), then the drawing
 * itself takes off and flies the mission profile across the graph paper.
 */
export const GraphPaper: React.FC = () => (
  <Stage>
    {Array.from({ length: 60 }, (_, i) => (
      <line key={"v" + i} x1={i * 48 - 480} y1={-1300} x2={i * 48 - 480} y2={2500} stroke="#6f8ea3" strokeOpacity={i % 5 === 0 ? 0.26 : 0.11} strokeWidth={i % 5 === 0 ? 1.4 : 1} />
    ))}
    {Array.from({ length: 80 }, (_, i) => (
      <line key={"h" + i} x1={-600} y1={i * 48 - 1296} x2={2600} y2={i * 48 - 1296} stroke="#6f8ea3" strokeOpacity={i % 5 === 0 ? 0.26 : 0.11} strokeWidth={i % 5 === 0 ? 1.4 : 1} />
    ))}
  </Stage>
);

// take-off run → steep climb → dash → turning fight (stage coordinates, flying right-to-left)
const PATH = "M1760,880 L1450,880 C1330,880 1265,760 1205,600 C1150,450 1085,375 960,372 L720,372 C585,372 500,430 530,505 C565,585 690,560 672,470";
let cached: SVGPathElement | null = null;
const pathPoint = (u: number) => {
  if (typeof document === "undefined") return { x: 1760, y: 880, a: 180 };
  if (!cached) {
    cached = document.createElementNS("http://www.w3.org/2000/svg", "path");
    cached.setAttribute("d", PATH);
  }
  const L = cached.getTotalLength();
  const p = cached.getPointAtLength(u * L);
  const p2 = cached.getPointAtLength(Math.min(L, u * L + 4));
  return { x: p.x, y: p.y, a: ((Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI + 360) % 360 };
};

export const S02Mission: React.FC = () => {
  const t = useT();
  const plot = ramp(t, 7.25, 9.0, ease.linear);
  const dims = ramp(t, 8.5, 9.1);
  const plate = 1 - ramp(t, 9.05, 9.55, ease.inOut); // plate pose → flight pose
  const u = keys(t, [[9.3, 0.0], [10.44, 0.2], [11.64, 0.46], [12.5, 0.68], [14.3, 1.0]], ease.soft);
  const pt = pathPoint(u);
  const leave = ramp(t, 14.75, 15.75, ease.inOut);
  const camX = keys(t, [[7.0, 60], [9.2, 0], [12.4, -120], [14.6, -170]], ease.soft);
  const camS = keys(t, [[7.0, 1.06], [9.1, 1.0]], ease.soft);
  const climb = ramp(t, 10.44, 11.1);
  const speed = ramp(t, 11.64, 12.3);
  const fight = ramp(t, 12.5, 13.8, ease.soft);
  const rot = Math.max(-35, Math.min(35, ((pt.a - 180 + 540) % 360) - 180));
  const planeX = lerp(pt.x, 960, plate);
  const planeY = lerp(pt.y - 22, 470, plate);
  const planeW = lerp(400, 1180, plate);
  return (
    <TearReveal t={t} start={7.0} dur={0.95} dir="ltr" seed="s02">
      <PaperGround>
        <Camera x={camX} y={lerp(0, 1080, leave)} s={camS}>
          <Layer depth={0.9}>
            <GraphPaper />
          </Layer>
          <Layer>
            <Stage>
              <DrawPath d="M1860,905 L20,905" p={ramp(t, 9.1, 9.9)} color={C.pencil} width={3} />
              <DrawPath d="M1820,905 L1820,200" p={climb} color={C.pencil} width={2.5} />
              <ArrowHead x={1820} y={200} angle={-90} color={C.pencil} p={climb} size={16} />
              <DrawPath d={PATH} p={u} color={C.red} width={5} dash={14} />
              <DrawPath d="M300,300 C420,250 520,300 520,380 C520,470 400,500 350,440" p={fight} color={C.inkSoft} width={3.5} dash={9} />
              <ArrowHead x={350} y={440} angle={220} color={C.inkSoft} p={ramp(t, 13.5, 13.9)} size={14} />
              {/* plate dimensions (real figures) */}
              <g opacity={1 - ramp(t, 9.0, 9.35)}>
                <Dimension x1={393} y1={715} x2={1528} y2={715} label="15.96 m" p={dims} />
                <Dimension x1={1592} y1={270} x2={1592} y2={668} label="5.28 m" p={ramp(t, 8.7, 9.2)} side={-1} />
              </g>
            </Stage>
            <TitleBlock x={1270} y={760} kicker="Eurofighter · side elevation" title="Typhoon" rows={[["Length", "15.96 m"], ["Span", "10.95 m"], ["Engines", "2 × EJ200"]]} p={ramp(t, 8.3, 9.0) * (1 - ramp(t, 9.0, 9.4))} width={560} />
          </Layer>
          {/* the evidence: RAF QRA Typhoon alongside a Russian Tu-95 (MOD, OGL) */}
          <Layer depth={1.06}>
            <Photo src="src-photos/typhoon-bear.jpg" x={400} y={235} w={430} h={307} rot={-3} reveal={ramp(t, 9.3, 9.9)} revealFrom="bottom" seed="bear" opacity={1 - ramp(t, 12.3, 12.8) * 0.7} />
            <At x={400} y={420}>
              <Rise p={ramp(t, 9.6, 10.1)} q={ramp(t, 12.3, 12.7)}>
                <Tape p={1} rot={-2}>
                  Intercept
                </Tape>
              </Rise>
            </At>
          </Layer>
          {/* the drawing itself flies the profile */}
          <Layer depth={1.1}>
            <Blueprint view="typhoonSide" x={planeX} y={planeY} width={planeW} rot={rot * (1 - plate)} p={plot} color={C.ink} lineWidth={lerp(1.5, 1.8, plate)} fill={C.paper} fillP={1} />
            <Stage>
              {[0, 1, 2].map((i) => (
                <line key={i} x1={pt.x + 210 + i * 26} y1={pt.y - 50 + i * 22} x2={pt.x + 210 + i * 26 + 170 * speed * (1 - fight * 0.8)} y2={pt.y - 50 + i * 22} stroke={C.ink} strokeWidth={3} strokeLinecap="round" opacity={speed * (1 - fight) * 0.65 * (1 - plate)} />
              ))}
            </Stage>
          </Layer>
          <Layer>
            <At x={1100} y={520} rot={6}>
              <Rise p={climb} q={ramp(t, 12.4, 12.9)}>
                <Tape p={1} rot={4}>
                  Climb
                </Tape>
              </Rise>
            </At>
            <At x={820} y={300}>
              <Rise p={speed} q={ramp(t, 13.4, 13.8)}>
                <Tape p={1} rot={-2} dark>
                  Speed
                </Tape>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* ------------------------------------------------------------------ S03
 * 14.75–24.85 "But over time, the Typhoon evolved. It stopped being just an air combat
 * specialist and gradually took on missions against targets on the ground as well."
 * Continuous tilt down the sheet: the underside plan is plotted clean, the air-combat
 * photo is pinned; on "targets on the ground" the red stores are drawn on, the Paveway
 * release photo arrives, and only after the bomb's line reaches the ground is the target marked.
 */
export const S03Ground: React.FC = () => {
  const t = useT();
  const arrive = ramp(t, 14.75, 15.75, ease.inOut);
  const plot = ramp(t, 15.3, 17.4, ease.linear);
  const stores = ramp(t, 20.4, 21.8, ease.linear);
  const air = ramp(t, 17.6, 18.3);
  const drop = ramp(t, 20.9, 21.6);
  const fall = ramp(t, 21.9, 22.65, ease.in);
  const hit = ramp(t, 22.65, 23.1);
  const camS = keys(t, [[15.5, 1.0], [20.3, 1.02], [22.6, 1.1], [24.2, 1.2]], ease.soft);
  const camX = keys(t, [[15.5, 0], [20.3, 0], [22.6, 160], [24.2, 260]], ease.soft);
  const camY = keys(t, [[15.5, 0], [20.3, 0], [22.6, 90], [24.2, 110]], ease.soft);
  const out = ramp(t, 24.2, 24.8, ease.in);
  const photo = { x: 1330, y: 470, w: 700, h: 500 };
  const bomb = { x: photo.x + (0.51 - 0.5) * photo.w, y: photo.y + (0.73 - 0.5) * photo.h };
  const target = { x: 1450, y: 905 };
  return (
    <AbsoluteFill style={{ transform: `translate(${-out * W}px, ${lerp(1080, 0, arrive)}px)`, filter: out > 0 ? `blur(${Math.sin(out * Math.PI) * 10}px)` : undefined }}>
      <PaperGround>
        <Camera x={camX} y={camY} s={camS}>
          <Layer depth={0.9}>
            <GraphPaper />
          </Layer>
          <Layer>
            {/* underside plan: clean first, stores added in red when ground attack is named */}
            <Blueprint view="typhoonUnder" x={560} y={450} width={820} p={plot} redP={stores} lineWidth={1.5} />
            <At x={560} y={780}>
              <Rise p={ramp(t, 16.6, 17.2)}>
                <Label size={24} color={C.inkSoft} weight={600}>
                  Typhoon · underside
                </Label>
              </Rise>
            </At>
            <At x={560} y={835}>
              <Rise p={ramp(t, 21.0, 21.5)}>
                <Tape p={1} dark rot={-1}>
                  + air-to-ground stores
                </Tape>
              </Rise>
            </At>
          </Layer>
          <Layer depth={1.06}>
            <Photo src="src-photos/typhoon-pair.jpg" x={1360} y={300} w={420} h={300} rot={3} reveal={air} revealFrom="top" seed="pair" opacity={1 - drop * 0.9} />
            <At x={1360} y={490}>
              <Rise p={ramp(t, 18.6, 19.1)} q={drop}>
                <Tape p={1}>Air combat</Tape>
              </Rise>
            </At>
            {/* RAF Typhoon releasing a Paveway (MOD, OGL) — kept at 1:1 so the bomb position is exact */}
            <Photo src="src-photos/typhoon-drop.jpg" x={photo.x} y={photo.y} w={photo.w} h={photo.h} rot={0} reveal={drop} revealFrom="top" seed="drop" />
            <Stage>
              <DrawPath d="M1080,905 L1840,905" p={ramp(t, 21.4, 21.9)} color={C.pencil} width={3} />
              {Array.from({ length: 16 }, (_, i) => (
                <line key={i} x1={1090 + i * 47} y1={905} x2={1072 + i * 47} y2={930} stroke={C.pencil} strokeWidth={2} opacity={ramp(t, 21.5 + i * 0.02, 21.7 + i * 0.02) * 0.6} />
              ))}
              <DrawPath d={`M${bomb.x},${bomb.y + 8} C${bomb.x + 20},${bomb.y + 120} ${target.x - 40},${target.y - 140} ${target.x},${target.y - 6}`} p={fall} color={C.red} width={4} dash={10} />
              {/* target marker appears only once the line has arrived */}
              {hit > 0 && (
                <g transform={`translate(${target.x},${target.y}) scale(${0.6 + ease.out(hit) * 0.4})`} opacity={hit}>
                  <circle r={30} fill="none" stroke={C.red} strokeWidth={4} />
                  {[0, 90, 180, 270].map((a) => (
                    <line key={a} x1={0} y1={-44} x2={0} y2={-18} stroke={C.red} strokeWidth={4} transform={`rotate(${a})`} />
                  ))}
                </g>
              )}
            </Stage>
            <At x={target.x} y={target.y + 70}>
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
