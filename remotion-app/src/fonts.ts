import { staticFile, delayRender, continueRender, cancelRender } from "remotion";

const faces: [string, string, FontFaceDescriptors?][] = [
  ["Anton", "fonts/Anton-Regular.ttf"],
  ["Bebas Neue", "fonts/BebasNeue-Regular.ttf"],
  ["Special Gothic Condensed One", "fonts/SpecialGothicCondensedOne-Regular.ttf"],
  ["Fira Sans Condensed", "fonts/FiraSansCondensed-Regular.ttf", { weight: "400" }],
  ["Fira Sans Condensed", "fonts/FiraSansCondensed-Medium.ttf", { weight: "500" }],
  ["Fira Sans Condensed", "fonts/FiraSansCondensed-SemiBold.ttf", { weight: "600" }],
  ["Kaushan Script", "fonts/KaushanScript-Regular.ttf"],
  ["Oswald", "fonts/Oswald.ttf", { weight: "200 700" }],
];

if (typeof document !== "undefined") {
  const handle = delayRender("Bundled editorial fonts");
  Promise.all(faces.map(([family, file, d]) => new FontFace(family, `url("${staticFile(file)}")`, d).load()))
    .then((loaded) => {
      loaded.forEach((font) => document.fonts.add(font));
      continueRender(handle);
    })
    .catch(cancelRender);
}
