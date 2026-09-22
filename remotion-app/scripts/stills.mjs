// Review frames for the edit, rendered in CI (see .github/workflows/render.yml).
// One bundle, one browser, many stills; then labelled contact sheets via ffmpeg.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const TIMES = (process.env.STILL_TIMES ||
  "0.5 2.6 3.9 6.2 7.45 10.0 12.2 13.9 15.3 19.0 23.3 24.5 24.6 26.9 30.0 34.3 35.6 39.5 40.8 43.9 45.3 48.0 54.5 56.8 58.5 61.0 62.9 65.3 67.2 68.6 72.3 74.1 78.8 80.4 83.0 86.0 87.4 91.5 94.9 98.4 100.9 102.75 106.4 108.3 111.3 113.2 117.4 120.8 122.8 126.0 129.6 133.4 136.5 142.2 144.1 147.3 149.7 151.4 156.8 159.4 161.0 164.5 167.2 169.2 170.3 174.2 178.4 181.0 184.5 186.6")
  .split(/\s+/)
  .filter(Boolean)
  .map(Number);

const out = path.resolve("out/review");
fs.mkdirSync(path.join(out, "frames"), { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome");
const composition = await selectComposition({ serveUrl, id: "TyphoonVsRafaleIntro", puppeteerInstance: browser });
const files = [];
for (const t of TIMES) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * 30));
  const file = path.join(out, "frames", `t${t.toFixed(2).padStart(6, "0")}.jpg`);
  await renderStill({ composition, serveUrl, frame, output: file, imageFormat: "jpeg", jpegQuality: 88, scale: 0.5, puppeteerInstance: browser });
  files.push(file);
  console.log("still", t);
}
await browser.close({ silent: true });

// contact sheets, 3 x 4, each frame labelled with its narration time
const per = 12;
for (let i = 0; i < files.length; i += per) {
  const group = files.slice(i, i + per);
  const args = [];
  group.forEach((f) => args.push("-i", f));
  const labelled = group
    .map((f, j) => `[${j}]scale=640:360,drawtext=text='${path.basename(f, ".jpg").slice(1)}':x=10:y=10:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.6[v${j}]`)
    .join(";");
  const pads = group.length < per ? Array.from({ length: per - group.length }, (_, k) => `color=black:s=640x360:d=1[p${k}]`).join(";") + ";" : "";
  const inputs = group.map((_, j) => `[v${j}]`).join("") + Array.from({ length: per - group.length }, (_, k) => `[p${k}]`).join("");
  const filter = `${pads}${labelled};${inputs}xstack=inputs=${per}:layout=${layout(4, 3)}`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args, "-filter_complex", filter, "-frames:v", "1", path.join(out, `sheet-${String(i / per + 1).padStart(2, "0")}.jpg`)]);
}
function layout(cols, rows) {
  const cells = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push(`${c * 640}_${r * 360}`);
  return cells.join("|");
}
console.log("done", files.length);
