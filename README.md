# Typhoon × Rafale — documentary introduction

Narrated 3:07 introduction edited in Remotion: documentary collage of real archive photographs,
paper cutouts, programmatic maps and editorial typography. 1920×1080, 30 fps, 5,605 frames.

- `STORYBOARD.md` — narration → idea → composition → motion → transition, scene by scene.
- `ASSETS.md` — every photograph, document and font with its licence and credit.
- `remotion-app/src` — `Documentary.tsx` (scene windows), `scenes/`, `components/` (Camera, Photo/Cutout, Paper, Type, Draw, Transitions, Radar), `map/` (WorldMap, projection).
- `scripts/preprocess.py` — CI-only asset work: background removal + paper border, shaded relief in the map projection, textures, document pages.
- `scripts/build-geo.cjs` — projects Natural Earth boundaries into `src/data/geo.json`.

## Rendering (GitHub Actions, never on the edit machine)

Push to the `rebuild` branch with a tag in the commit message:

- `[stills]` → review frames and contact sheets force-pushed to branch `review`.
- `[render]` → full video force-pushed to branch `render-output` (`typhoon-rafale-intro.mp4`).

Changes to `scripts/preprocess.py` or `public/src-photos/` rebuild generated assets on branch `gen-assets`.

Local preview: `cd remotion-app && npm ci && npm run dev`.
