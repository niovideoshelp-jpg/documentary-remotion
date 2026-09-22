import cuts from "../data/cuts.json";

type CutMeta = { crop: number[]; region: number[] };
const META = cuts as Record<string, CutMeta>;

/**
 * Where a cutout sits over its own photograph when the photo is drawn in `rect`
 * (full photo, no cover-cropping). Returns centre + width for <Cutout>.
 */
export const liftFrom = (key: string, rect: { x: number; y: number; w: number; h: number }) => {
  const m = META[key];
  if (!m) return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, w: rect.w * 0.8 };
  const [c0, c1, c2, c3] = m.crop;
  const [r0, r1, r2, r3] = m.region;
  const fx0 = c0 + r0 * (c2 - c0);
  const fx1 = c0 + r2 * (c2 - c0);
  const fy0 = c1 + r1 * (c3 - c1);
  const fy1 = c1 + r3 * (c3 - c1);
  return {
    x: rect.x + ((fx0 + fx1) / 2) * rect.w,
    y: rect.y + ((fy0 + fy1) / 2) * rect.h,
    w: (fx1 - fx0) * rect.w,
  };
};
