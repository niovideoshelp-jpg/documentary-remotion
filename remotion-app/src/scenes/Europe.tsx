import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { PaperGround } from "../components/Paper";
import { Cutout, roughRect } from "../components/Photo";
import { Blueprint } from "../components/Blueprint";
import { At, Label, Rise } from "../components/Type";
import { KeyTitle } from "../components/AnimeText";
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
              x={lerp(2300, 1460, ty) - deal * 40 + split * 700}
              y={lerp(330, 250, ty) - split * 150 + drift(t, "t6", 5)}
              w={760}
              rot={-2 - split * 6}
              opacity={ty}
            />
            <Cutout
              name="rafale-landing"
              x={lerp(2400, 470, rf) + deal * 40 - split * 700}
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

/** An illustrative procurement sheet (generic prop, no real terms): typed, folded, marked up. */
const TenderSheet: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const bars = [0.94, 0.82, 0.9, 0.62, 0.96, 0.7, 0.86, 0.5, 0.78, 0.66];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#e7dcc3", clipPath: roughRect(w, h, 0, 2.4, "tender") }}>
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("gen/paper2.jpg")})`, backgroundSize: "700px", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile("gen/sheet.jpg")})`, backgroundSize: `${w * 3.2}px ${h * 1.6}px`, backgroundPosition: "38% 20%", mixBlendMode: "multiply", opacity: 0.9 }} />
      {/* horizontal fold: the sheet came out of an envelope */}
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.36, height: 2, background: "rgba(60,45,30,0.25)", boxShadow: "0 3px 6px rgba(255,250,235,0.5)" }} />
      <div style={{ position: "absolute", left: 40, top: 40, right: 40, color: "#2a2520" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.label, fontWeight: 600, fontSize: 15, letterSpacing: "0.28em", opacity: 0.75, filter: "url(#ink-fine)" }}>
          <span>REQUEST FOR PROPOSAL</span>
          <span>REF. — / —</span>
        </div>
        <div style={{ height: 2, background: "#2a2520", opacity: 0.7, margin: "10px 0 14px" }} />
        <div style={{ fontFamily: F.condensed, fontSize: 84, lineHeight: 0.9, letterSpacing: "0.01em", filter: "url(#ink)" }}>MULTIROLE</div>
        <div style={{ fontFamily: F.condensed, fontSize: 84, lineHeight: 0.9, letterSpacing: "0.01em", filter: "url(#ink)" }}>FIGHTER</div>
        <div style={{ fontFamily: F.tape, fontSize: 30, letterSpacing: "0.14em", marginTop: 8, color: "#8e2a1c", filter: "url(#ink)" }}>SUPPLY CONTRACT</div>
        {bars.map((wd, i) => (
          <div
            key={i}
            style={{
              height: i === 3 || i === 7 ? 13 : 7,
              marginTop: i === 0 ? 30 : 15,
              width: `${wd * 100}%`,
              background: i === 3 || i === 7 ? "#1d1a17" : "#7d7466",
              opacity: i === 3 || i === 7 ? 0.9 : 0.55,
              borderRadius: 2,
              filter: "url(#ink)",
              transform: `rotate(${(i % 3) * 0.15 - 0.15}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

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
  // the Eurofighter node stays visible while Paris is linked to it and breaks away
  const nodeP = links * (1 - ramp(t, 63.3, 64.0));
  const linksOut = ramp(t, 63.3, 64.0);
  const paris = ramp(t, 66.95, 67.4);
  const routes = (i: number, t0: number) => ramp(t, t0 + i * 0.16, t0 + i * 0.16 + 0.9, ease.soft);
  const munich = P("munich");
  const parisXY = P("paris");
  // screen position of a canvas point for HTML overlays
  const toScreen = ([x, y]: [number, number]) => [(x - view.cx) * view.z + W / 2, (y - view.cy) * view.z + H / 2];
  const [fx, fy] = toScreen(parisXY);
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
            {nodeP > 0 && (
              <g opacity={nodeP}>
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
      <At x={W / 2} y={H - 130}>
        <KeyTitle text="US$ billions" t={t} at={71.55} size={120} neon="white" out={73.6} />
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
/** Heavy ink stamp that lands on a drawing. */
const ExportStamp: React.FC<{ p: number; x: number; y: number; rot: number }> = ({ p, x, y, rot }) => {
  if (p <= 0) return null;
  const s = lerp(1.7, 1, ease.out(Math.min(1, p * 1.5)));
  return (
    <At x={x} y={y} rot={rot}>
      <div style={{ transform: `scale(${s})`, opacity: Math.min(1, p * 3) * 0.9, border: `6px solid ${C.red}`, padding: "6px 22px 2px", fontFamily: F.display, fontSize: 70, color: C.red, letterSpacing: "0.06em" }}>
        EXPORT
      </div>
    </At>
  );
};

/* ------------------------------------------------------------------ S08
 * 73.8–80.9 "and they represent two very different approaches to developing, upgrading,
 * and selling a modern combat aircraft."
 * Both plan views plotted side by side; each verb acts on the drawings: plotted
 * (develop), outlined in red (upgrade), stamped for export (sell).
 */
export const S08Approaches: React.FC = () => {
  const t = useT();
  const camS = keys(t, [[73.8, 1.12], [76.0, 1.02], [80.9, 1.08]], ease.soft);
  const camY = keys(t, [[73.8, -30], [80.9, 20]], ease.soft);
  const develop = ramp(t, 74.3, 76.6, ease.linear);
  const upgrade = ramp(t, 77.2, 77.9);
  const sell = ramp(t, 78.0, 78.4);
  const verb = (w: string, at: number, x: number, color: string) => (
    <At x={x} y={930}>
      <KeyTitle text={w} t={t} at={at} size={110} color={color} fill={color === C.red} neon={color === C.red ? "red" : undefined} />
    </At>
  );
  return (
    <BlotReveal t={t} start={73.8} dur={0.9} cx={W / 2} cy={H / 2} seed="s08">
      <PaperGround>
        <Camera s={camS} y={camY}>
          <Layer depth={0.95}>
            <GraphPaperLite />
          </Layer>
          <Layer>
            {/* upgrade: the same airframes, re-inked in red over the originals */}
            <Blueprint view="typhoonTop" x={500} y={430} width={780} p={develop} lineWidth={1.4} />
            <Blueprint view="rafaleTop" x={1420} y={430} width={700} p={ramp(t, 74.5, 76.8, ease.linear)} lineWidth={1.4} />
            <Blueprint view="typhoonTop" x={500} y={430} width={780} p={upgrade} color={C.red} lineWidth={1.1} opacity={0.75} />
            <Blueprint view="rafaleTop" x={1420} y={430} width={700} p={upgrade} color={C.red} lineWidth={1.1} opacity={0.75} />
            <At x={500} y={720}>
              <Label size={26} color={C.inkSoft} weight={600} style={{ opacity: ramp(t, 75.4, 75.9) }}>
                Eurofighter Typhoon
              </Label>
            </At>
            <At x={1420} y={720}>
              <Label size={26} color={C.inkSoft} weight={600} style={{ opacity: ramp(t, 75.6, 76.1) }}>
                Dassault Rafale
              </Label>
            </At>
            <ExportStamp p={sell} x={560} y={470} rot={-8} />
            <ExportStamp p={ramp(t, 78.25, 78.65)} x={1450} y={470} rot={6} />
          </Layer>
          <Layer depth={1.06}>
            {verb("Develop", 76.2, 520, C.ink)}
            {verb("Upgrade", 77.15, 960, C.ink)}
            {verb("Sell", 77.9, 1360, C.red)}
          </Layer>
        </Camera>
      </PaperGround>
    </BlotReveal>
  );
};

const GraphPaperLite: React.FC = () => (
  <Stage>
    {Array.from({ length: 44 }, (_, i) => (
      <line key={"v" + i} x1={i * 48 - 100} y1={-200} x2={i * 48 - 100} y2={1300} stroke="#cfd6d9" strokeOpacity={i % 5 === 0 ? 0.09 : 0.04} />
    ))}
    {Array.from({ length: 30 }, (_, i) => (
      <line key={"h" + i} x1={-200} y1={i * 48 - 150} x2={2200} y2={i * 48 - 150} stroke="#cfd6d9" strokeOpacity={i % 5 === 0 ? 0.09 : 0.04} />
    ))}
  </Stage>
);
