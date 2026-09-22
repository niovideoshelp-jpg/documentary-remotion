import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  Paper,
  PaperCutout,
  DocumentaryPhoto,
  Label,
  palette,
  progress,
  clamp,
} from "../components/Visuals";
export const TyphoonOpening: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <DocumentaryPhoto src="photos/typhoon-flight.jpg">
      <div
        style={{
          position: "absolute",
          left: 140,
          bottom: 100,
          opacity: progress(f, 10, 30),
        }}
      >
        <div style={{ fontSize: 32, letterSpacing: 6, color: palette.paper }}>
          EUROFIGHTER
        </div>
        <div
          style={{
            fontFamily: "Anton",
            fontSize: 158,
            color: palette.paper,
            lineHeight: 1.12,
          }}
        >
          TYPHOON
        </div>
      </div>
    </DocumentaryPhoto>
  );
};
export const MissionScene: React.FC<{ ground?: boolean; rafale?: boolean }> = ({
  ground = false,
  rafale = false,
}) => {
  const f = useCurrentFrame();
  const labels = rafale
    ? ["AIR COMBAT", "PRECISION STRIKE", "ANTI-SHIP"]
    : ground
      ? ["AIR COMBAT", "GROUND ATTACK"]
      : ["INTERCEPT", "CLIMB", "ACCELERATE"];
  const starts = rafale ? [0, 55, 110] : ground ? [0, 160] : [55, 95, 127];
  return (
    <Paper>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 85,
          fontFamily: "Anton",
          fontSize: 82,
          color: palette.ink,
        }}
      >
        {rafale
          ? "ONE AIRFRAME. MANY MISSIONS."
          : ground
            ? "AN EXPANDING ROLE"
            : "BUILT FOR THE AIR"}
      </div>
      <PaperCutout
        src={rafale ? "photos/rafale-taxi.jpg" : "photos/typhoon-flight.jpg"}
        x={340}
        y={260}
        w={1230}
        h={540}
        angle={-2}
      />
      <svg width="1920" height="1080" style={{ position: "absolute" }}>
        {labels.map((l, i) => {
          const p = progress(f, starts[i], starts[i] + 32);
          const x = 340 + i * 560;
          const y = 900;
          return (
            <g key={l} opacity={p}>
              <path
                d={`M${630 + i * 290} 600 Q${x} 750 ${x} ${y - 65}`}
                fill="none"
                stroke={palette.red}
                strokeWidth="3"
                strokeDasharray="8 7"
                pathLength="1"
                strokeDashoffset={1 - p}
              />
              <circle cx={x} cy={y - 55} r="8" fill={palette.red} />
              <text
                x={x}
                y={y}
                fontFamily="Oswald"
                fontSize="42"
                textAnchor="middle"
                fill={palette.ink}
              >
                {l}
              </text>
            </g>
          );
        })}
      </svg>
    </Paper>
  );
};
export const RafaleOpening: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <DocumentaryPhoto src="photos/rafale-landing.jpg" focus="50% 43%">
      <div
        style={{
          position: "absolute",
          left: 130,
          bottom: 105,
          color: palette.paper,
          opacity: progress(f, 12, 35),
        }}
      >
        <div style={{ fontSize: 32, letterSpacing: 6 }}>DASSAULT</div>
        <div style={{ fontFamily: "Anton", fontSize: 160, lineHeight: 1.1 }}>
          RAFALE
        </div>
        <div
          style={{
            fontSize: 35,
            letterSpacing: 3,
            opacity: progress(f, 233, 255),
          }}
        >
          MULTIROLE BY DESIGN
        </div>
      </div>
    </DocumentaryPhoto>
  );
};
export const CarrierScene: React.FC = () => (
  <DocumentaryPhoto src="photos/rafale-carrier.jpg">
    <Label light x={130} y={875}>
      RAFALE M · NAVAL VARIANT
    </Label>
  </DocumentaryPhoto>
);
export const RivalScene: React.FC<{ baseline?: boolean }> = ({
  baseline = false,
}) => {
  const f = useCurrentFrame();
  return (
    <Paper dark>
      <div
        style={{
          position: "absolute",
          left: 125,
          top: 80,
          fontFamily: "Anton",
          fontSize: 76,
        }}
      >
        {baseline ? "A COMMON REFERENCE" : "TWO EUROPEAN FIGHTERS"}
      </div>
      <PaperCutout
        src="photos/typhoon-flight.jpg"
        x={150}
        y={270}
        w={740}
        h={470}
        angle={interpolate(f, [0, 300], [-3, -1], clamp)}
      />
      <PaperCutout
        src="photos/rafale-landing.jpg"
        x={1030}
        y={270}
        w={740}
        h={470}
        angle={2}
        delay={10}
      />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 805,
          fontFamily: "Anton",
          fontSize: 70,
        }}
      >
        TYPHOON{baseline ? " FGR4" : ""}
      </div>
      <div
        style={{
          position: "absolute",
          left: 1060,
          top: 805,
          fontFamily: "Anton",
          fontSize: 70,
        }}
      >
        RAFALE{baseline ? " C" : ""}
      </div>
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 935,
          width: 1320,
          height: 3,
          background: palette.red,
          scale: `${progress(f, 45, 100)} 1`,
        }}
      />
    </Paper>
  );
};
