// Same constants as scripts/build-geo.cjs and scripts/preprocess.py (K = canvas px per degree of longitude).
export const K = 48;
const LON0 = -25;
const LAT_TOP = 66;
const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

export const project = (lon: number, lat: number): [number, number] => [
  (lon - LON0) * K,
  (merc(LAT_TOP) - merc(lat)) * K * (180 / Math.PI),
];

export const RELIEF = {
  wide: { x: 0, y: 0, w: 6480, h: 4839 },
  europe: { x: 528, y: 438.8247576672232, w: 2688, h: 2140 },
};

// Places used by the edit (lon, lat).
export const PLACES = {
  london: [-0.13, 51.51],
  munich: [11.58, 48.14],
  rome: [12.5, 41.9],
  madrid: [-3.7, 40.42],
  paris: [2.35, 48.86],
  berlin: [13.4, 52.52],
  cairo: [31.24, 30.04],
  doha: [51.53, 25.29],
  delhi: [77.21, 28.61],
  athens: [23.73, 37.98],
  zagreb: [15.98, 45.81],
  jakarta: [106.85, -6.21],
  abudhabi: [54.37, 24.45],
  belgrade: [20.46, 44.79],
  riyadh: [46.72, 24.71],
  muscat: [58.41, 23.59],
  kuwait: [47.98, 29.38],
  vienna: [16.37, 48.21],
  ankara: [32.85, 39.93],
} as const satisfies Record<string, readonly [number, number]>;

export const P = (k: keyof typeof PLACES) => project(PLACES[k][0], PLACES[k][1]);
