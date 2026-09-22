# Storyboard — Typhoon × Rafale / Introduction (v2)

Narration: `intro.mp3`, 186.83 s, 1920×1080 @ 30 fps (5605 frames). Word timings in `transcript.json`.
Scenes run on narration time and overlap; the incoming scene owns the transition.
Code: `remotion-app/src/scenes/*`, order and windows in `src/Documentary.tsx`.

Visual system: real photographs (never altered, only framed or lifted as paper cutouts), paper ground with fine grain,
programmatic maps (navy ocean `#243847`, neutral relief land, territory in print red `#B3261E`),
Anton for names, Fira Sans Condensed for labels, Kaushan Script only for a few margin notes.

| Time | Narration | Idea → composition | Motion / transition in |
|---|---|---|---|
| 0.0–7.6 | This is the Eurofighter Typhoon… twin-engine… air combat | Full-bleed German Typhoon photo; on the name the aircraft lifts off as a paper cutout and the photo gives way to a dark drafting sheet where the plan view is plotted; TYPHOON under the wing | Slow push; two red thrust lines from the nozzles on "twin-engine"; speed streaks on "air combat" |
| 7.0–15.8 | Original mission: intercept, climb, speed, other fighters | Typhoon side elevation plotted with real dimensions and a title block; the drawing then flies the mission profile; QRA Bear intercept photo pinned | Tear wipe; path + axis drawn on each verb; turning-fight track on "other fighters" |
| 14.8–24.8 | Evolved… targets on the ground | Underside plan plotted clean; air-combat print; on "ground" the red stores draw on, the Paveway release photo arrives, the fall line reaches the ground and only then the target marker appears | Vertical camera move (continuous with S02); whip out left |
| 24.2–35.8 | Dassault Rafale… idea different… do-it-all | Croatian Rafale nose-on; RAFALE behind the lifted aircraft; print pulled back onto a drafting table; three-view plate plotted with real dimensions, title block, "14 hardpoints" | Whip in from right; pull-back reveal; trace wipe |
| 35.3–45.6 | Air-to-air, precision strike, anti-ship… carrier | One airframe, three vectors drawn to Meteor, armed Rafale M, Exocet; the anti-ship vector opens the sea onto a Rafale over a carrier deck | Organic blot reveal from the vector's end |
| 44.9–59.4 | Two of the most important… same contracts… different ideas | Both aircraft over a dark Europe; they converge on one tender sheet that tears in two | Tear wipe; sheet split opens the map |
| 57.9–75.0 | Four-country program… France… go its own way… multi-billion contracts | Map: UK/DE/IT/ES traced → halo → liquid fill → names, linked to Eurofighter near Munich; consortium dims; France traced/filled, Paris; a Paris–Eurofighter link forms and snaps on "its own way", 1985; pull out to export customers with routes | Continuous map camera (push to France, pull out wide) |
| 73.8–80.9 | Developing, upgrading, selling | Both plan views plotted (develop), re-inked in red (upgrade), stamped EXPORT (sell) | Blot reveal |
| 79.9–87.4 | Fair… which versions | Both side views plotted at true scale on one metre ruler (15.96 m vs 15.27 m); version tabs flicked, T2/T3 and F3R picked | Tear upward; push in |
| 86.9–103.0 | Typhoon FGR4, Tranche 2/3, Centurion, CAPTOR-M | RAF FGR4 print, name, tranche tapes, Meteor + Project Centurion; push into the nose → CAPTOR hardware + mechanical-scan drawing | Blot reveals |
| 102.4–113.3 | Rafale C, single-seat, land-based, F3R, RBE2 AESA | Mirror of S10 on light paper; canopy ringed; RBE2 hardware + electronic-scan drawing | Whip from right; push into nose |
| 112.7–121.9 | Mature, well-known, documented | Real NAO report pages + both prints; three ink stamps on the words | Tear wipe |
| 121.3–144.2 | Not the newest… F4… advanced radars… comparable | Version timeline tracked by camera; chosen standards ringed; newer ones beyond a dashed scope line light up, then ghost; chosen pair lifted to one baseline | Blot reveal; long lateral tracking |
| 143.7–150.4 | One more thing… case by case | Wide map; camera stops on Egypt, Qatar, India | Tear from top |
| 149.4–160.6 | Same fighter… radar, weapons, training, support, logistics… country to country | Three customers' Rafales collapse into one airframe; package elements arrive on each word; reshuffle on "another" | Blot reveal |
| 160.6–169.8 | Offer… buyer… allowed to purchase | Two discs: offer and needs; the deal is only the overlap; export-approval line trims it | Tear wipe |
| 169.6–186.8 | Sources… slip through… original sources | Real documents pass under camera; underline and query mark; archive formation footage, fade | Blot reveal; tear to footage |

Radar drawings show scanning principles only (no ranges or angles claimed). Generic tender sheet is an illustrative prop, not a real document.

Sound: narration + two generated music cues ducked under speech + ~150 SFX cues each tied to a visible action (src/Sound.tsx); mastered to -14 LUFS in CI.
