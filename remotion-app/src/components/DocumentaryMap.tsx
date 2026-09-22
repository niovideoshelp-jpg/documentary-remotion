import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import countries from "../data/europe.json";
import { palette, progress, TextureOverlay } from "./Visuals";
const centers: Record<string, [number, number, string]> = {
  France: [735, 660, "FRANCE"],
  "United Kingdom": [675, 270, "UNITED KINGDOM"],
  Germany: [970, 435, "GERMANY"],
  Spain: [535, 900, "SPAIN"],
  Italy: [1080, 790, "ITALY"],
};
export const DocumentaryMap: React.FC<{
  highlights?: { country: string; at: number }[];
  zoom?: number;
  label?: string;
}> = ({ highlights = [], zoom = 1, label = "EUROPE" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: palette.ocean, overflow: "hidden" }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ scale: zoom, transformOrigin: "50% 50%" }}
      >
        <defs>
          <pattern
            id="mapprint"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 9L9 0"
              stroke="#172c35"
              strokeOpacity=".12"
              strokeWidth=".5"
            />
          </pattern>
        </defs>
        {countries.map((c) => (
          <path
            key={c.name}
            d={c.d}
            fill="#c9c9bd"
            stroke="#53616a"
            strokeWidth="1.1"
          />
        ))}
        {highlights.map(({ country, at }, i) => {
          const c = countries.find((x) => x.name === country);
          if (!c) return null;
          const draw = progress(f, at, at + 45),
            fill = progress(f, at + 53, at + 100),
            name = progress(f, at + 104, at + 119);
          const center = centers[country];
          const y = 1150 - fill * 1400;
          const id = `country-${i}`;
          return (
            <g key={country}>
              <defs>
                <clipPath id={id}>
                  <path d={c.d} />
                </clipPath>
              </defs>
              <g clipPath={`url(#${id})`}>
                <path
                  d={`M-100 1300V${y} Q150 ${y - 55} 400 ${y + 20} T900 ${y - 12} T1400 ${y + 25} T2100 ${y - 20} V1300Z`}
                  fill={palette.red}
                />
                <path d={c.d} fill="url(#mapprint)" opacity={fill} />
              </g>
              <path
                d={c.d}
                fill="none"
                stroke="#f4f0de"
                strokeWidth={3.5}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
                opacity={f >= at ? 1 : 0}
              />
              <path
                d={c.d}
                fill="none"
                stroke="#f4f0de"
                strokeWidth={9}
                opacity={progress(f, at + 45, at + 53) * 0.13}
              />
              {center && (
                <text
                  x={center[0]}
                  y={center[1]}
                  textAnchor="middle"
                  fill={palette.paper}
                  fontFamily="Anton"
                  fontSize={country === "United Kingdom" ? 31 : 45}
                  opacity={name}
                >
                  {center[2]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 128,
          bottom: 95,
          color: palette.paper,
          fontFamily: "Oswald",
          fontSize: 26,
          letterSpacing: 5,
        }}
      >
        {label}
      </div>
      <TextureOverlay />
    </AbsoluteFill>
  );
};
