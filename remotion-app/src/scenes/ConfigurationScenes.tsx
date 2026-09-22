import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  Paper,
  PaperCutout,
  Label,
  palette,
  progress,
  clamp,
} from "../components/Visuals";
export const Radar: React.FC<{ aesa: boolean }> = ({ aesa }) => {
  const f = useCurrentFrame();
  const angle = aesa
    ? ((Math.floor(f / 14) % 5) - 2) * 15
    : Math.sin(f / 35) * 36;
  return (
    <svg width="520" height="390" viewBox="0 0 520 390">
      <path
        d="M90 290 Q250 80 455 90"
        stroke="#a3a8a2"
        strokeWidth="2"
        fill="none"
      />
      <g transform={`translate(110 295) rotate(${angle})`}>
        <path d="M0 0L235 -220L290 -145Z" fill={palette.red} opacity=".15" />
        <path d="M0 0L268 -183" stroke={palette.red} strokeWidth="3" />
      </g>
      <g
        transform={
          aesa ? "translate(110 295)" : `translate(110 295) rotate(${angle})`
        }
      >
        <rect
          x="-12"
          y="-56"
          width="24"
          height="112"
          rx="2"
          fill={palette.ink}
        />
        {aesa &&
          Array.from({ length: 8 }, (_, i) => (
            <circle
              key={i}
              cx="0"
              cy={-44 + i * 12}
              r="3"
              fill={palette.paper}
            />
          ))}
      </g>
      <text x="40" y="370" fontFamily="Oswald" fontSize="20" fill={palette.ink}>
        SCAN PRINCIPLE · ILLUSTRATION
      </text>
    </svg>
  );
};
export const ConfigurationScene: React.FC<{ rafale?: boolean }> = ({
  rafale = false,
}) => {
  const f = useCurrentFrame();
  const radarAt = rafale ? 225 : 414;
  return (
    <Paper>
      <Label>COMPARISON REFERENCE / {rafale ? "02" : "01"}</Label>
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 155,
          fontFamily: "Anton",
          fontSize: 126,
          lineHeight: 1.05,
          opacity: progress(f, rafale ? 55 : 96, rafale ? 70 : 111),
        }}
      >
        {rafale ? "RAFALE C" : "TYPHOON FGR4"}
      </div>
      <PaperCutout
        src={rafale ? "photos/rafale-landing.jpg" : "photos/typhoon-refuel.jpg"}
        x={140}
        y={340}
        w={1070}
        h={580}
        angle={-1.4}
      />
      <div style={{ position: "absolute", left: 1320, top: 335, width: 450 }}>
        <div
          style={{
            fontFamily: "Anton",
            fontSize: 62,
            opacity: progress(f, rafale ? 158 : 183, rafale ? 173 : 198),
          }}
        >
          {rafale ? "F3R" : "TRANCHE 2 / 3"}
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 33,
            opacity: progress(f, rafale ? 98 : 323, rafale ? 113 : 338),
          }}
        >
          {rafale ? "SINGLE-SEAT · LAND-BASED" : "CENTURION CAPABILITIES"}
        </div>
        <div
          style={{
            marginTop: 44,
            fontFamily: "Anton",
            fontSize: 57,
            color: palette.red,
            opacity: progress(f, radarAt, radarAt + 18),
          }}
        >
          {rafale ? "RBE2 AESA" : "CAPTOR-M"}
        </div>
        <div
          style={{
            marginLeft: -65,
            opacity: progress(f, radarAt + 8, radarAt + 26),
          }}
        >
          <Radar aesa={rafale} />
        </div>
      </div>
    </Paper>
  );
};
export const ScopeScene: React.FC<{ future?: boolean }> = ({
  future = false,
}) => {
  const f = useCurrentFrame();
  return (
    <Paper>
      <Label>{future ? "CONFIGURATION MATTERS" : "SELECTED BASELINE"}</Label>
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 180,
          fontFamily: "Anton",
          fontSize: 94,
        }}
      >
        {future ? "A DEFINED COMPARISON" : "MATURE. DOCUMENTED. COMPARABLE."}
      </div>
      <PaperCutout
        src="photos/typhoon-flight.jpg"
        x={190}
        y={370}
        w={670}
        h={380}
        angle={-2}
      />
      <PaperCutout
        src="photos/rafale-landing.jpg"
        x={1060}
        y={370}
        w={670}
        h={380}
        angle={2}
      />
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 815,
          fontFamily: "Anton",
          fontSize: 60,
        }}
      >
        FGR4 · CAPTOR-M
      </div>
      <div
        style={{
          position: "absolute",
          left: 1090,
          top: 815,
          fontFamily: "Anton",
          fontSize: 60,
        }}
      >
        RAFALE C · F3R
      </div>
      {future && (
        <>
          <div
            style={{
              position: "absolute",
              left: 1100,
              top: 935,
              color: palette.red,
              fontSize: 32,
              opacity: progress(f, 146, 169),
            }}
          >
            → F4: OUTSIDE THIS BASELINE
          </div>
          <div
            style={{
              position: "absolute",
              left: 190,
              top: 935,
              color: palette.red,
              fontSize: 32,
              opacity: progress(f, 250, 273),
            }}
          >
            → NEWER RADARS: OUTSIDE THIS BASELINE
          </div>
        </>
      )}
    </Paper>
  );
};
export const DossiersScene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Paper dark>
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 140,
          fontFamily: "Anton",
          fontSize: 95,
        }}
      >
        DEFINE THE COMPARISON
      </div>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 240 + i * 840,
            top: 315,
            width: 600,
            height: 610,
            padding: 55,
            background: palette.paper,
            color: palette.ink,
            rotate: `${interpolate(f, [0, 170], [i ? 7 : -7, 0], clamp)}deg`,
            translate: `0px ${(1 - progress(f, i * 10, 32 + i * 10)) * 150}px`,
          }}
        >
          <div style={{ fontSize: 26, letterSpacing: 4 }}>
            REFERENCE {i ? "02" : "01"}
          </div>
          <div style={{ fontFamily: "Anton", fontSize: 84, marginTop: 60 }}>
            {i ? "RAFALE C" : "TYPHOON"}
          </div>
          <div style={{ fontSize: 38, color: palette.red }}>
            REFERENCE AIRCRAFT
          </div>
          <div style={{ height: 3, background: palette.ink, marginTop: 50 }} />
          <div style={{ fontSize: 33, marginTop: 25 }}>
            SELECTING THE STANDARD
          </div>
        </div>
      ))}
    </Paper>
  );
};
