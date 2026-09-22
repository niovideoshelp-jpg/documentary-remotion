import {
  staticFile,
  delayRender,
  continueRender,
  cancelRender,
} from "remotion";
if (typeof document !== "undefined") {
  const handle = delayRender("Bundled editorial fonts");
  Promise.all([
    new FontFace(
      "Anton",
      `url("${staticFile("fonts/Anton-Regular.ttf")}")`,
    ).load(),
    new FontFace("Oswald", `url("${staticFile("fonts/Oswald.ttf")}")`, {
      weight: "200 700",
    }).load(),
  ])
    .then((fonts) => {
      fonts.forEach((font) => document.fonts.add(font));
      continueRender(handle);
    })
    .catch(cancelRender);
}
