import React from "react";
import { AbsoluteFill } from "remotion";
import { PaperGround } from "../components/Paper";
import { DrawIcon, ICONS, type IconName } from "../components/Icons";
import { C, F } from "../lib/theme";

/** Review sheet of the icon set (CI stills only). */
export const IconSheet: React.FC = () => (
  <AbsoluteFill>
    <PaperGround dark>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {(Object.keys(ICONS) as IconName[]).map((k, i) => {
          const x = 140 + (i % 9) * 205;
          const y = 150 + Math.floor(i / 9) * 300;
          return (
            <g key={k}>
              <DrawIcon name={k} x={x} y={y} size={150} p={1} />
              <text x={x} y={y + 120} textAnchor="middle" fontFamily={F.label} fontSize={26} fill={C.inkSoft}>
                {k}
              </text>
            </g>
          );
        })}
      </svg>
    </PaperGround>
  </AbsoluteFill>
);
