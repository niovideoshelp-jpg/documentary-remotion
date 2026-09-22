import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture, Vignette } from "../components/Paper";
import { Cutout, Photo } from "../components/Photo";
import { At, Display, Hand, Label, Rise, Tape } from "../components/Type";
import { ArrowHead, DrawPath, Stage, handLine, scribbleEllipse } from "../components/Draw";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { WorldMap, viewAt, type Highlight } from "../map/WorldMap";
import { C, W, H } from "../lib/theme";
import { FPS, drift, ease, keys, lerp, ramp, useT } from "../lib/time";

/* ------------------------------------------------------------------ S14a
 * 143.8–149.6 "And there's one more thing. When we get into export contracts, we're
 * going to look at them case by case,"
 * The wide map again; the camera stops on one customer at a time.
 */
const CASES: Highlight[] = [
  { name: "Egypt", draw: [146.2, 146.8], fill: [146.5, 147.2], label: { text: "EGYPT", lon: 29.8, lat: 26.6, size: 60, at: 147.1 } },
  { name: "Qatar", draw: [148.2, 148.6], fill: [148.35, 148.9], label: { text: "QATAR", lon: 51.2, lat: 27.4, size: 40, at: 148.7 } },
  { name: "India", draw: [148.8, 149.4], fill: [149.0, 149.7], label: { text: "INDIA", lon: 78.5, lat: 22.5, size: 90, at: 149.5 } },
];

export const S14Cases: React.FC = () => {
  const t = useT();
  const lon = keys(t, [[143.8, 40], [145.6, 38], [146.4, 30.5], [148.1, 30.5], [148.3, 50.5], [148.75, 50.5], [149.0, 75], [150.4, 60]], ease.inOut);
  const lat = keys(t, [[143.8, 32], [145.6, 30], [146.4, 27], [148.1, 27], [148.3, 25.6], [148.75, 25.6], [149.0, 22], [150.4, 25]], ease.inOut);
  const z = keys(t, [[143.8, 0.3], [145.6, 0.36], [146.4, 0.62], [148.1, 0.66], [148.3, 1.1], [148.75, 1.15], [149.0, 0.55], [150.4, 0.4]], ease.inOut);
  const beat = ramp(t, 143.72, 144.2);
  return (
    <TearReveal t={t} start={143.72} dur={0.7} dir="ttb" seed="s14" slope={0.05}>
      <WorldMap t={t} view={viewAt(lon, lat, z)} highlights={CASES} />
      <At x={W / 2} y={H / 2}>
        <div style={{ opacity: (1 - ramp(t, 145.5, 146.0)) * beat }}>
          <Display size={120} color={C.offWhite}>
            Export contracts
          </Display>
        </div>
      </At>
    </TearReveal>
  );
};

/* ------------------------------------------------------------------ S14b
 * 149.4–160.6 "because the same fighter can look very different depending on the
 * customer. Radar, weapons, training, support, logistics packages, all of that can
 * change from one country to another."
 * Three operators' Rafales as prints; then one airframe exploded into its package,
 * each element arriving on its word; on "another" the package reshuffles.
 */
const PACKAGE = [
  { key: "radar", at: 153.4, word: "Radar", x: 470, y: 250 },
  { key: "weapons", at: 154.24, word: "Weapons", x: 1450, y: 250 },
  { key: "training", at: 154.98, word: "Training", x: 330, y: 800 },
  { key: "support", at: 155.68, word: "Support", x: 1590, y: 790 },
  { key: "logistics", at: 156.4, word: "Logistics", x: 960, y: 930 },
];

export const S14Package: React.FC = () => {
  const t = useT();
  const prints = ramp(t, 150.0, 151.2, ease.linear);
  const collapse = ramp(t, 152.7, 153.5, ease.inOut);
  const swap = ramp(t, 158.2, 159.2, ease.inOut);
  const camS = keys(t, [[149.4, 1.05], [152.7, 1.0], [157.5, 1.04], [160.6, 1.12]], ease.soft);
  const hub = { x: 960, y: 540 };
  return (
    <BlotReveal t={t} start={149.45} dur={0.9} cx={1500} cy={560} seed="s14b">
      <PaperGround>
        <Camera s={camS}>
          {/* same fighter, three customers: India, Egypt, Croatia */}
          <Layer depth={0.95}>
            {[
              { src: "src-photos/rafale-india.jpg", x: 520, y: 520, rot: -5, tag: "India" },
              { src: "src-photos/rafale-egypt.jpg", x: 980, y: 480, rot: 2, tag: "Egypt" },
              { src: "src-photos/rafale-croatia.jpg", x: 1420, y: 540, rot: 5, tag: "Croatia" },
            ].map((p, i) => {
              const e = ramp(prints, i * 0.28, i * 0.28 + 0.5);
              const x = lerp(p.x, hub.x, collapse);
              const y = lerp(p.y, hub.y, collapse);
              return (
                <React.Fragment key={p.src}>
                  <Photo src={p.src} x={x} y={y + (1 - e) * 80} w={500} h={333} rot={p.rot * (1 - collapse)} opacity={e * (1 - collapse)} seed={"cust" + i} zoom={1.1} />
                  <At x={x} y={y + 215}>
                    <div style={{ opacity: e * (1 - collapse) }}>
                      <Tape p={1} rot={-p.rot / 2}>
                        {p.tag}
                      </Tape>
                    </div>
                  </At>
                </React.Fragment>
              );
            })}
          </Layer>
          {/* the package around one airframe */}
          <Layer depth={1}>
            <Stage>
              {PACKAGE.map((it, i) => {
                const e = ramp(t, it.at - 0.1, it.at + 0.5);
                const tx = lerp(it.x, PACKAGE[(i + 2) % 5].x, swap);
                const ty = lerp(it.y, PACKAGE[(i + 2) % 5].y, swap);
                return <DrawPath key={it.key} d={handLine(hub.x, hub.y, tx, ty, 0.06, it.key)} p={e} q={swap > 0 && swap < 1 ? 0 : 0} color={C.inkSoft} width={2.5} dash={9} opacity={1 - swap * 0.6} />;
              })}
            </Stage>
            <Cutout name="rafale-india" x={hub.x} y={hub.y} w={lerp(300, 720, collapse)} opacity={collapse} rot={-2} />
            {PACKAGE.map((it, i) => {
              const e = ramp(t, it.at - 0.1, it.at + 0.45);
              const j = (i + 2) % 5;
              const x = lerp(it.x, PACKAGE[j].x, swap);
              const y = lerp(it.y, PACKAGE[j].y, swap) - Math.sin(swap * Math.PI) * 60;
              return <PackageItem key={it.key} kind={it.key} x={x} y={y} p={e} word={it.word} t={t} />;
            })}
          </Layer>
        </Camera>
        <At x={W / 2} y={120}>
          <Rise p={ramp(t, 159.0, 159.5)}>
            <Hand size={54}>country to country</Hand>
          </Rise>
        </At>
      </PaperGround>
    </BlotReveal>
  );
};

const PackageItem: React.FC<{ kind: string; x: number; y: number; p: number; word: string; t: number }> = ({ kind, x, y, p, word, t }) => {
  if (p <= 0) return null;
  const s = 0.8 + ease.out(p) * 0.2;
  const media: Record<string, React.ReactNode> = {
    radar: <Cutout name="rbe2" x={x} y={y} w={230} rot={-4} scale={s} opacity={p} />,
    weapons: <Cutout name="meteor" x={x} y={y} w={380} rot={5} scale={s} opacity={p} />,
    training: <Cutout name="pilot" x={x} y={y - 20} w={210} rot={-2} scale={s} opacity={p} />,
    support: <Cutout name="crew" x={x} y={y - 20} w={260} rot={2} scale={s} opacity={p} />,
    logistics: <Photo src="src-photos/logistics.jpg" x={x} y={y - 30} w={330} h={220} rot={-3} scale={s} opacity={p} seed="log" zoom={1.1} />,
  };
  return (
    <>
      {media[kind]}
      <At x={x + drift(t, kind, 2)} y={y + 140}>
        <Rise p={p}>
          <Tape p={1} rot={kind.length % 2 ? -2 : 2} dark={kind === "weapons" || kind === "logistics"}>
            {word}
          </Tape>
        </Rise>
      </At>
    </>
  );
};

/* ------------------------------------------------------------------ S15
 * 160.6–169.8 "In the end, every deal depends both on what the manufacturer is willing
 * to offer and on what the buyer wants and is actually allowed to purchase."
 * Two paper discs overlap; the deal is only their overlap, then an export-approval
 * boundary trims it further.
 */
export const S15Deal: React.FC = () => {
  const t = useT();
  const offer = ramp(t, 162.9, 163.9, ease.out);
  const buyer = ramp(t, 165.5, 166.5, ease.out);
  const deal = ramp(t, 166.6, 167.4);
  const allowed = ramp(t, 168.0, 168.8, ease.soft);
  const camS = keys(t, [[160.6, 1.3], [169.8, 1.18]], ease.soft);
  const L = { x: lerp(560, 780, offer), y: 540 };
  const R = { x: lerp(1360, 1140, buyer), y: 540 };
  const r = 330;
  // export-approval boundary: a line cutting through the overlap
  const cutX = lerp(1400, 1000, allowed);
  return (
    <TearReveal t={t} start={160.65} dur={0.9} dir="rtl" seed="s15" slope={0.2}>
      <PaperGround dark>
        <Camera s={camS}>
          <Layer>
            <Stage>
              <defs>
                <clipPath id="dealL">
                  <circle cx={L.x} cy={L.y} r={r} />
                </clipPath>
                <clipPath id="dealAllowed">
                  <rect x={-100} y={-100} width={cutX + 100} height={1300} />
                </clipPath>
              </defs>
              <circle cx={L.x} cy={L.y} r={r * ease.out(Math.min(1, offer * 1.3))} fill="#e9e2d3" opacity={0.14} stroke="#e9e2d3" strokeWidth={3} />
              <circle cx={R.x} cy={R.y} r={r * ease.out(Math.min(1, buyer * 1.3))} fill="#e9e2d3" opacity={0.14} stroke="#e9e2d3" strokeWidth={3} />
              {/* the deal: only where both overlap (and, later, where approval allows) */}
              <g clipPath="url(#dealL)" opacity={deal}>
                <g clipPath={allowed > 0 ? "url(#dealAllowed)" : undefined}>
                  <circle cx={R.x} cy={R.y} r={r} fill={C.redPrint} />
                </g>
                <circle cx={R.x} cy={R.y} r={r} fill="url(#hatch)" opacity={allowed} />
              </g>
              <defs>
                <pattern id="hatch" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1={0} y1={0} x2={0} y2={14} stroke="#e9e2d3" strokeWidth={2} opacity={0.35} />
                </pattern>
              </defs>
              <DrawPath d={`M${cutX},120 L${cutX},960`} p={allowed} color="#f7c9b8" width={4} dash={14} />
            </Stage>
          </Layer>
          <Layer depth={1.08}>
            <At x={L.x - 120} y={L.y}>
              <Rise p={ramp(t, 163.4, 163.9)}>
                <Display size={78} color={C.offWhite}>
                  Offer
                </Display>
              </Rise>
              <br />
              <Rise p={ramp(t, 163.6, 164.1)}>
                <Label size={22} color="#c9c2b2" weight={600}>
                  Manufacturer
                </Label>
              </Rise>
            </At>
            <At x={R.x + 130} y={R.y}>
              <Rise p={ramp(t, 166.3, 166.8)}>
                <Display size={78} color={C.offWhite}>
                  Needs
                </Display>
              </Rise>
              <br />
              <Rise p={ramp(t, 166.5, 167.0)}>
                <Label size={22} color="#c9c2b2" weight={600}>
                  Buyer
                </Label>
              </Rise>
            </At>
            <At x={(L.x + R.x) / 2 - 40 * allowed} y={L.y}>
              <Rise p={deal}>
                <Display size={64} color={C.offWhite}>
                  Deal
                </Display>
              </Rise>
            </At>
            <At x={cutX + 20} y={150} anchor="left">
              <Rise p={ramp(t, 168.4, 168.9)}>
                <Label size={24} color="#f7c9b8" weight={600}>
                  Export approval
                </Label>
              </Rise>
            </At>
          </Layer>
        </Camera>
      </PaperGround>
    </TearReveal>
  );
};

/* ------------------------------------------------------------------ S16
 * 169.6–186.83 "And as always, all the sources used to research this video will be
 * linked in the description. Even with careful research, details can still slip through
 * or information can be interpreted differently. So if you want to dig deeper into any
 * particular point, I definitely recommend checking the original sources as well."
 * Real documentation slides past; one page is read closely, then the camera lets go
 * to the archive formation footage.
 */
export const S16Sources: React.FC = () => {
  const t = useT();
  const camX = keys(t, [[169.7, -160], [175.2, 120], [180.6, 240]], ease.soft);
  const camS = keys(t, [[169.7, 1.0], [175.2, 1.05], [177.0, 1.5], [180.6, 1.7]], ease.soft);
  const camY = keys(t, [[169.7, 0], [175.2, 0], [177.0, -40]], ease.soft);
  const under = ramp(t, 177.1, 177.8, ease.soft);
  const q = ramp(t, 179.6, 180.2);
  return (
    <>
      <BlotReveal t={t} start={169.7} dur={0.9} cx={W / 2} cy={H / 2} seed="s16">
        <PaperGround tint="#d6cdbb">
          <Camera x={camX} y={camY} s={camS}>
            <Layer depth={0.9}>
              {[1, 2, 3].map((n, i) => (
                <Photo
                  key={n}
                  src={`gen/doc/nao-typhoon-${n}.jpg`}
                  x={[520, 1000, 1480][i]}
                  y={[540, 500, 560][i]}
                  w={500}
                  h={707}
                  rot={[-4, 1.5, 5][i]}
                  border={0}
                  seed={"src" + n}
                  grade="contrast(1.03) sepia(0.1)"
                  reveal={ramp(t, 170.0 + i * 0.25, 170.7 + i * 0.25)}
                  revealFrom="bottom"
                />
              ))}
            </Layer>
            <Layer depth={1.05}>
              <Photo src="src-photos/typhoon-front.jpg" x={260} y={860} w={380} h={253} rot={-7} seed="s16a" reveal={ramp(t, 171.0, 171.6)} />
              <Photo src="src-photos/rafale-deck.jpg" x={1740} y={250} w={380} h={253} rot={6} seed="s16b" reveal={ramp(t, 171.3, 171.9)} />
              <Stage>
                {/* careful reading: underline and a query mark on the middle page */}
                <DrawPath d="M880,380 C960,386 1050,378 1130,384" p={under} color={C.red} width={4} />
                <DrawPath d={scribbleEllipse(1160, 330, 36, 36, "q", 1.05)} p={q} color={C.red} width={4} />
              </Stage>
              <At x={1160} y={332}>
                <div style={{ opacity: q }}>
                  <Hand size={46}>?</Hand>
                </div>
              </At>
            </Layer>
          </Camera>
          <At x={W / 2} y={H - 110}>
            <Rise p={ramp(t, 173.6, 174.2)} q={ramp(t, 176.4, 176.9)}>
              <Tape p={1} dark size={30}>
                Sources in the description
              </Tape>
            </Rise>
          </At>
          <Stage>
            <ArrowHead x={W / 2} y={H - 40} angle={90} color={C.ink} p={ramp(t, 174.0, 174.4) * (1 - ramp(t, 176.4, 176.9))} size={22} />
          </Stage>
        </PaperGround>
      </BlotReveal>
      <Closing />
    </>
  );
};

/* 180.6–186.83: archive formation (USAF, public domain), slow, then fade. */
const Closing: React.FC = () => {
  const t = useT();
  const start = 180.55;
  if (t < start) return null;
  const s = keys(t, [[start, 1.12], [186.8, 1.0]], ease.soft);
  const out = ramp(t, 185.6, 186.8, ease.inOut);
  return (
    <TearReveal t={t} start={start} dur={0.9} dir="ltr" seed="close">
      <AbsoluteFill style={{ background: C.night }}>
        <Sequence from={Math.round(start * FPS)} layout="none">
          <AbsoluteFill style={{ transform: `scale(${s})` }}>
            <OffthreadVideo src={staticFile("video/closing-formation.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
        <PrintTexture opacity={0.28} />
        <Vignette strength={0.5} />
        <AbsoluteFill style={{ background: C.night, opacity: out }} />
      </AbsoluteFill>
    </TearReveal>
  );
};
