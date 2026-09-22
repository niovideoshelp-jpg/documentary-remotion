# Typhoon × Rafale — documentary introduction

English narration supplied by the owner, edited as a 3:07 introduction in Remotion. 1920×1080, 30 fps, 5,605 frames. The original voice track is retained.

## Run

```sh
cd remotion-app
npm ci
npm run dev -- --no-open
```

Composition: `TyphoonVsRafaleIntro`. `MapReview` isolates the geographic reveal for inspection.

```sh
npx remotion render TyphoonVsRafaleIntro out/intro.mp4 --codec=h264
```

## Project

- `STORYBOARD.md`: narrative plan, composition and transitions for 20 scenes.
- `TRANSCRIPT.md` and `transcript.json`: transcript and original word-level ASR times.
- `ASSETS.md`: documentary image provenance and licensing.
- `remotion-app/src/scenes`: aircraft, configuration and editorial sequences.
- `remotion-app/src/components`: paper, photography, texture, radar and geography.
- `remotion-app/public`: original narration, bundled fonts, photographs and archive video.

All animation is driven by the Remotion frame clock. The country reveal uses actual projected boundaries with an SVG territorial clip and a progressive liquid fill. The photographs are archive illustrations; they do not certify the exact configuration of the reference aircraft. Radar drawings illustrate scanning principles, not measured ranges or classified specifications.

The narration chooses the comparison scope. Newer variants are shown separately, not substituted into the chosen FGR4/CAPTOR-M and Rafale C F3R/RBE2 AESA baseline.

No license is granted for the owner's narration. Third-party assets retain the terms documented in `ASSETS.md`.
