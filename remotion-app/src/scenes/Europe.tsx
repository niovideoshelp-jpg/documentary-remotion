import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround, PrintTexture } from "../components/Paper";
import { Cutout, roughRect } from "../components/Photo";
import { At, Display, Label, Rise } from "../components/Type";
import { DrawPath, Stage } from "../components/Draw";
import { BlotReveal, TearReveal } from "../components/Transitions";
import { WorldMap, arc, viewAt, type Highlight, type View } from "../map/WorldMap";
import { P, PLACES } from "../map/projection";
import { C, F, W, H } from "../lib/theme";
import { drift, ease, keys, lerp, ramp, useT } from "../lib/time";

const europeView = (t: number): View => {
  const lon = keys(t, [[44.8, 7.5], [57.9, 7.5], [62.6, 6.0], [64.4, 3.2], [69.4, 3.0], [71.3, 42], [80, 46]], ease.inOut);
  const lat = keys(t, [[44.8, 47.6], [57.9, 47.6], [62.6, 47.2], [64.4, 46.4], [69.4, 46.4], [71.3, 28], [80, 27]], ease.inOut);
  const z = keys(t, [[44.8, 0.82], [57.9, 0.9], [62.6, 1.08], [64.4, 1.3], [69.4, 1.36], [71.3, 0.36], [80, 0.34]], ease.inOut);
  return viewAt(lon, lat, z);
};

/* ------------------------------------------------------------------ S06
 * 44.9–59.4 "So, we're talking about two of the most important combat aircraft ever
 * produced in Europe. But ... they compete for many of the same contracts today,
 * they came from very different ideas."
 * Both aircraft over a darkened map of Europe; they converge on one tender sheet,
 * which tears in two on "very different ideas" and opens the map.
 */
export const S06Rivals: React.FC = () => {
  const t = useT();
  const view = europeView(t);
  const dimMap = 0.62 - ramp(t, 49.4, 50.4) * 0.14;
  const ty = ramp(t, 45.7, 46.8);
  const rf = ramp(t, 46.5, 47.6);
  const deal = ramp(t, 53.3, 54.2);
  const split = ramp(t, 55.9, 57.5, ease.inOut);
  const gone = ramp(t, 57.2, 58.4, ease.in);
  const sheet = { x: 960, y: 560, w: 470, h: 600 };
  return (
    <TearReveal t={t} start={44.95} dur={0.9} dir="rtl" seed="s06">
      <AbsoluteFill>
        <WorldMap t={t} view={view} />
        <AbsoluteFill style={{ background: C.night, opacity: dimMap * (1 - gone) }} />
        <Camera s={keys(t, [[45, 1.04], [58, 1.0]], ease.soft)}>
          {/* the tender both aircraft chase: tears apart on "different ideas" */}
          <Layer depth={1}>
            {[0, 1].map((half) => {
              const dir = half ? 1 : -1;
              return (
                <div
                  key={half}
                  style={{
                    position: "absolute",
                    left: sheet.x - sheet.w / 2,
                    top: sheet.y - sheet.h / 2,
                    width: sheet.w,
                    height: sheet.h,
                    opacity: deal * (1 - gone),
                    transform: `translate(${dir * split * 520}px, ${dir * split * 90}px) rotate(${-2 + dir * split * 9}deg) scale(${0.9 + deal * 0.1})`,
                    clipPath: half
                      ? `polygon(${tearEdge(sheet.w, sheet.h, true)})`
                      : `polygon(${tearEdge(sheet.w, sheet.h, false)})`,
                    filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.5))",
                  }}
                >
                  <TenderSheet w={sheet.w} h={sheet.h} />
                </div>
              );
            })}
          </Layer>
          <Layer depth={1.1}>
            <Cutout
              name="typhoon-side"
              x={lerp(2300, 1250, ty) - deal * 60 - split * 700}
              y={lerp(330, 300, ty) - split * 150 + drift(t, "t6", 5)}
              w={760}
              rot={-2 - split * 6}
              opacity={ty}
            />
            <Cutout
              name="rafale-landing"
              x={lerp(2400, 700, rf) + deal * 60 + split * 700}
              y={820 + split * 150 + drift(t, "r6", 5)}
              w={760}
              rot={1 + split * 5}
              opacity={rf}
            />
          </Layer>
        </Camera>
        <At x={W / 2} y={120}>
          <Rise p={ramp(t, 49.5, 50.1)} q={ramp(t, 52.8, 53.2)}>
            <Label size={30} color={C.offWhite} weight={600} style={{ letterSpacing: "0.4em" }}>
              Built in Europe
            </Label>
          </Rise>
        </At>
      </AbsoluteFill>
    </TearReveal>
  );
};

const tearEdge = (w: number, h: number, right: boolean) => {
  const pts: string[] = [];
  const n = 26;
  const edge = Array.from({ length: n + 1 }, (_, i) => {
    const y = (i / n) * h;
    const x = w / 2 + Math.sin(i * 1.7) * 9 + Math.sin(i * 4.3) * 5 + (i % 3) * 3;
    return [x, y];
  });
  if (right) {
    edge.forEach(([x, y]) => pts.push(`${x}px ${y}px`));
    pts.push(`${w}px ${h}px`, `${w}px 0px`);
  } else {
    pts.push(`0px 0px`);
    edge.forEach(([x, y]) => pts.push(`${x}px ${y}px`));
    pts.push(`0px ${h}px`);
  }
  return pts.join(",");
};

/** An illustrative procurement sheet (generic prop, no real terms). */
const TenderSheet: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div style={{ position: "absolute", inset: 0, background: "#efe9dc", clipPath: roughRect(w, h, 0, 2, "tender") }}>
    <PrintTexture opacity={0.9} />
    <div style={{ position: "absolute", left: 44, top: 46, right: 44 }}>
      <div style={{ fontFamily: F.label, fontWeight: 600, fontSize: 18, letterSpacing: "0.3em", color: C.inkSoft }}>REQUEST FOR PROPOSAL</div>
      <div style={{ fontFamily: F.display, fontSize: 78, color: C.ink, marginTop: 10, lineHeight: 0.95 }}>FIGHTER{"\n"}</div>
      <div style={{ fontFamily: F.display, fontSize: 78, color: C.red, lineHeight: 0.95 }}>CONTRACT</div>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{ height: 11, marginTop: i === 0 ? 34 : 16, width: `${[92, 80, 88, 60, 94, 70, 85, 50, 76][i]}%`, background: i === 3 || i === 7 ? C.ink : "#b9b2a4", opacity: i === 3 || i === 7 ? 0.85 : 0.7 }} />
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ S07
 * 57.9–75.0 "The Typhoon grew out of a joint program involving four European
 * countries. The Rafale ... was developed essentially by France after Paris decided
 * to go its own way. Today, the two fighters compete for multi-billion dollar contracts,"
 * Map sequence: neutral → borders traced → soft halo → liquid red fill → names.
 */
const CONSORTIUM: Highlight[] = ([
  { name: "United Kingdom", draw: [59.9, 60.9], fill: [61.3, 62.2], origin: [-1.5, 52.5], label: { text: "UK", lon: -1.6, lat: 52.6, size: 64, at: 62.35 } },
  { name: "Germany", draw: [60.1, 61.1], fill: [61.45, 62.35], origin: [10.2, 51.0], label: { text: "GERMANY", lon: 10.3, lat: 51.0, size: 62, at: 62.45 } },
  { name: "Italy", draw: [60.3, 61.3], fill: [61.6, 62.5], origin: [12.0, 43.5], label: { text: "ITALY", lon: 13.2, lat: 42.6, size: 54, at: 62.55, rot: 50 } },
  { name: "Spain", draw: [60.5, 61.5], fill: [61.75, 62.65], origin: [-3.7, 40.3], label: { text: "SPAIN", lon: -3.6, lat: 40.0, size: 78, at: 62.65 } },
] as Highlight[]).map((h) => ({ ...h, dim: [63.3, 64.2] as [number, number] }));

const FRANCE: Highlight = {
  name: "France",
  draw: [64.6, 65.8],
  fill: [66.0, 66.95],
  origin: [2.35, 48.86],
  label: { text: "FRANCE", lon: 2.6, lat: 46.4, size: 84, at: 66.95 },
};

// export customers (operators or confirmed buyers), revealed as the camera pulls out
const TYPHOON_EXPORT = ["Austria", "Saudi Arabia", "Oman", "Kuwait", "Turkey"];
const RAFALE_EXPORT = ["Egypt", "India", "Greece", "Croatia", "Indonesia", "United Arab Emirates", "Republic of Serbia"];
const BOTH = ["Qatar"];
const exportHl = (names: string[], t0: number, step: number): Highlight[] =>
  names.map((name, i) => ({ name, draw: [t0 + i * step, t0 + i * step + 0.5], fill: [t0 + i * step + 0.35, t0 + i * step + 1.0], out: [74.4, 75.0] }));
const EXPORTS: Highlight[] = [
  ...exportHl(TYPHOON_EXPORT, 70.3, 0.16),
  ...exportHl(RAFALE_EXPORT, 70.45, 0.16),
  ...exportHl(BOTH, 71.2, 0),
];
const TYPHOON_TO = ["riyadh", "muscat", "kuwait", "doha", "vienna", "ankara"] as const;
const RAFALE_TO = ["cairo", "delhi", "athens", "zagreb", "jakarta", "abudhabi", "belgrade", "doha"] as const;

export const S07Map: React.FC = () => {
  const t = useT();
  const view = europeView(t);
  const inDim = 1 - ramp(t, 57.9, 58.9, ease.inOut);
  const links = ramp(t, 62.2, 63.0);
  const linksOut = ramp(t, 63.3, 64.0);
  const paris = ramp(t, 66.95, 67.4);
  const own = ramp(t, 67.85, 68.7, ease.soft);
  const routes = (i: number, t0: number) => ramp(t, t0 + i * 0.16, t0 + i * 0.16 + 0.9, ease.soft);
  const munich = P("munich");
  const parisXY = P("paris");
  // screen position of a canvas point for HTML overlays
  const toScreen = ([x, y]: [number, number]) => [(x - view.cx) * view.z + W / 2, (y - view.cy) * view.z + H / 2];
  const [mx, my] = toScreen(munich);
  const [fx, fy] = toScreen(parisXY);
  const expo = ramp(t, 70.0, 70.8);
  return (
    <AbsoluteFill>
      <WorldMap
        t={t}
        view={view}
        highlights={[...CONSORTIUM, FRANCE, ...EXPORTS]}
        overlay={<AbsoluteFill style={{ background: C.night, opacity: 0.48 * inDim }} />}
      >
        {(z) => (
          <g>
            {/* consortium: capitals tied to the joint company near Munich */}
            {(["london", "madrid", "rome"] as const).map((k, i) => (
              <DrawPath key={k} d={arc(P(k), munich, 0.12)} p={links * ramp(t, 62.2 + i * 0.1, 62.9 + i * 0.1)} q={linksOut} color="#f7f1e6" width={2.6 / z} dash={9 / z} />
            ))}
            {links > 0 && linksOut < 1 && (
              <g opacity={links * (1 - linksOut)}>
                <circle cx={munich[0]} cy={munich[1]} r={7 / z} fill="#f7f1e6" stroke={C.ink} strokeWidth={2 / z} />
                <text x={munich[0] + 14 / z} y={munich[1] - 14 / z} fontFamily={F.label} fontWeight={600} fontSize={20 / z} letterSpacing={3 / z} fill="#f7f1e6">
                  EUROFIGHTER
                </text>
              </g>
            )}
            {/* Paris goes its own way */}
            {paris > 0 && (
              <g opacity={paris * (1 - ramp(t, 69.4, 70.0))}>
                <circle cx={parisXY[0]} cy={parisXY[1]} r={6.5 / z} fill="#f7f1e6" stroke={C.ink} strokeWidth={2 / z} />
                <text x={parisXY[0] + 13 / z} y={parisXY[1] + 7 / z} fontFamily={F.label} fontWeight={600} fontSize={20 / z} letterSpacing={3 / z} fill="#f7f1e6">
                  PARIS
                </text>
              </g>
            )}
            <DrawPath
              d={`M${parisXY[0] - 8},${parisXY[1] + 6} C${parisXY[0] - 90},${parisXY[1] + 20} ${parisXY[0] - 180},${parisXY[1] - 30} ${parisXY[0] - 230},${parisXY[1] - 120}`}
              p={own}
              q={ramp(t, 69.3, 69.9)}
              color="#f7f1e6"
              width={3.2 / z}
            />
            {/* export routes: Typhoon from the consortium, Rafale from France */}
            {TYPHOON_TO.map((k, i) => (
              <DrawPath key={"ty" + k} d={arc(munich, P(k), 0.18)} p={routes(i, 70.4)} q={ramp(t, 74.3, 75.0)} color="#f7f1e6" width={2.4 / z} dash={10 / z} />
            ))}
            {RAFALE_TO.map((k, i) => (
              <DrawPath key={"rf" + k} d={arc(parisXY, P(k), -0.16)} p={routes(i, 70.55)} q={ramp(t, 74.3, 75.0)} color="#ffd9c9" width={2.4 / z} />
            ))}
            {[...new Set([...TYPHOON_TO, ...RAFALE_TO])].map((k, i) => {
              const [x, y] = P(k as keyof typeof PLACES);
              const p = ramp(t, 71.0 + i * 0.06, 71.4 + i * 0.06) * (1 - ramp(t, 74.3, 74.9));
              return p > 0 ? <circle key={k} cx={x} cy={y} r={(5 * p) / z} fill="#f7f1e6" stroke={C.ink} strokeWidth={1.5 / z} /> : null;
            })}
          </g>
        )}
      </WorldMap>
      {/* who ships where: each aircraft at its point of origin */}
      <Cutout name="typhoon-pair" x={mx + 90} y={my - 70} w={240} rot={-3} opacity={expo * (1 - ramp(t, 74.3, 74.9))} />
      <Cutout name="rafale-landing" x={fx - 150} y={fy + 60} w={250} rot={2} opacity={expo * (1 - ramp(t, 74.3, 74.9))} />
      <At x={W / 2} y={H - 130}>
        <Rise p={ramp(t, 71.6, 72.3)} q={ramp(t, 73.6, 74.1)}>
          <Display size={120} color={C.offWhite}>
            US$ <span style={{ color: "#f0b8a8" }}>billions</span>
          </Display>
        </Rise>
      </At>
      <At x={fx + 20} y={fy + 70} anchor="left">
        <Rise p={ramp(t, 68.2, 68.7)} q={ramp(t, 69.3, 69.8)}>
          <Label size={30} color={C.offWhite} weight={600}>
            1985
          </Label>
        </Rise>
      </At>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S08
 * 73.5–80.5 "and they represent two very different approaches to developing,
 * upgrading, and selling a modern combat aircraft."
 * Typographic spread: three verbs, each filled with a real photograph of that stage.
 */
const Verb: React.FC<{ word: string; img: string; p: number; y: number; pos?: string }> = ({ word, img, p, y, pos = "50% 50%" }) => (
  <At x={W / 2} y={y}>
    <Rise p={p}>
      <div style={{ position: "relative" }}>
        <Display size={205} color="transparent" tracking={0.02} style={{ WebkitTextStroke: `2px ${C.ink}`, position: "absolute", left: 5, top: 5, opacity: 0.25 }}>
          {word}
        </Display>
        <Display
          size={205}
          tracking={0.02}
          color="transparent"
          style={{
            backgroundImage: `url(${staticFile(img)})`,
            backgroundSize: "cover",
            backgroundPosition: pos,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            filter: "contrast(1.2) brightness(0.8)",
          }}
        >
          {word}
        </Display>
      </div>
    </Rise>
  </At>
);

export const S08Approaches: React.FC = () => {
  const t = useT();
  const split = ramp(t, 74.3, 75.3, ease.inOut);
  const camS = keys(t, [[73.6, 1.0], [80.4, 1.08]], ease.soft);
  return (
    <BlotReveal t={t} start={73.55} dur={1.0} cx={W / 2} cy={H / 2} seed="s08">
      <PaperGround>
        <Camera s={camS}>
          <Layer depth={0.9}>
            <Stage>
              <DrawPath d="M960,60 L960,1020" p={split} color={C.pencil} width={2} dash={10} opacity={0.5} />
            </Stage>
            <Cutout name="typhoon-side" x={lerp(-300, 330, split)} y={250} w={560} rot={-3} opacity={split} />
            <Cutout name="rafale-landing" x={lerp(2200, 1600, split)} y={850} w={560} rot={2} opacity={split} />
          </Layer>
          <Layer depth={1.05}>
            <Verb word="Develop" img="src-photos/rafale-3view.jpg" p={ramp(t, 76.2, 76.8)} y={330} />
            <Verb word="Upgrade" img="src-photos/captor.jpg" p={ramp(t, 77.15, 77.75)} y={540} pos="40% 50%" />
            <Verb word="Sell" img="src-photos/rafale-india.jpg" p={ramp(t, 77.9, 78.5)} y={750} pos="50% 45%" />
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};
