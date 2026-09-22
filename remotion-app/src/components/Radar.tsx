import React from "react";
import { C } from "../lib/theme";

/*
 * Scan-principle illustrations, not performance data: no ranges or angles are claimed.
 * Mechanical: a dish on a gimbal physically sweeps, the beam follows it smoothly.
 * AESA: a fixed array of modules; the beam jumps between directions electronically.
 */

const Beam: React.FC<{ x: number; y: number; angle: number; len: number; spread: number; color: string; opacity: number }> = ({
  x,
  y,
  angle,
  len,
  spread,
  color,
  opacity,
}) => {
  const a1 = ((angle - spread) * Math.PI) / 180;
  const a2 = ((angle + spread) * Math.PI) / 180;
  const id = `bg${Math.round(x)}${Math.round(angle * 10)}`;
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={id} cx={x} cy={y} r={len} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color} stopOpacity={0.75} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path
        d={`M${x},${y} L${x + Math.cos(a1) * len},${y + Math.sin(a1) * len} A${len},${len} 0 0 1 ${x + Math.cos(a2) * len},${y + Math.sin(a2) * len} Z`}
        fill={`url(#${id})`}
      />
      <line x1={x} y1={y} x2={x + Math.cos((angle * Math.PI) / 180) * len * 0.92} y2={y + Math.sin((angle * Math.PI) / 180) * len * 0.92} stroke={color} strokeWidth={2} strokeDasharray="6 8" opacity={0.8} />
    </g>
  );
};

/** Side-section of a nose radome with a gimballed dish sweeping. `sweep` in seconds. */
export const MechanicalScan: React.FC<{ x: number; y: number; scale?: number; time: number; p: number }> = ({ x, y, scale = 1, time, p }) => {
  const angle = Math.sin(time * 2.2) * 32; // physical sweep, continuous
  const face = Math.cos((angle * Math.PI) / 180);
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={p}>
      {/* radome outline (pencil) */}
      <path d="M-150,-150 C60,-150 210,-70 300,0 C210,70 60,150 -150,150" fill="none" stroke="#e9e2d3" strokeWidth={3} strokeDasharray="10 7" opacity={0.7} />
      <line x1={-150} y1={-170} x2={-150} y2={170} stroke="#e9e2d3" strokeWidth={3} opacity={0.6} />
      <Beam x={0} y={0} angle={angle} len={720} spread={6} color="#f4d9b8" opacity={0.9} />
      {/* gimbal + dish: rotates as a rigid body */}
      <g transform={`rotate(${angle})`}>
        <line x1={-110} y1={0} x2={-18} y2={0} stroke="#d8d0bf" strokeWidth={10} />
        <circle cx={-110} cy={0} r={16} fill="#d8d0bf" />
        <ellipse cx={0} cy={0} rx={Math.max(10, 26 * face)} ry={118} fill="#bdb5a5" stroke="#f3eee2" strokeWidth={3} />
        <line x1={0} y1={-118} x2={0} y2={118} stroke="#8b8476" strokeWidth={2} />
      </g>
      <path d={`M-110,-60 A70,70 0 0 1 -110,60`} fill="none" stroke={C.red} strokeWidth={3} opacity={0.85} transform={`rotate(${angle * 0.6}, -110, 0)`} />
    </g>
  );
};

/** Fixed flat array of T/R modules; beam hops between directions with no moving parts. */
export const ElectronicScan: React.FC<{ x: number; y: number; scale?: number; time: number; p: number }> = ({ x, y, scale = 1, time, p }) => {
  const dirs = [-28, 14, -6, 30, -18, 4, 24, -32];
  const k = Math.floor(time * 3.2) % dirs.length;
  const local = (time * 3.2) % 1;
  const angle = dirs[k];
  const flash = Math.max(0, 1 - local * 3);
  const rows = 11;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={p}>
      <path d="M-150,-150 C60,-150 210,-70 300,0 C210,70 60,150 -150,150" fill="none" stroke="#e9e2d3" strokeWidth={3} strokeDasharray="10 7" opacity={0.7} />
      <line x1={-150} y1={-170} x2={-150} y2={170} stroke="#e9e2d3" strokeWidth={3} opacity={0.6} />
      <Beam x={6} y={0} angle={angle} len={720} spread={5} color="#ffd2bf" opacity={0.95} />
      {/* array face: fixed, tilted back slightly, modules light with a phase gradient */}
      <g transform="rotate(0)">
        <rect x={-14} y={-124} width={20} height={248} fill="#3b4147" stroke="#f3eee2" strokeWidth={2} />
        {Array.from({ length: rows }, (_, i) => {
          const u = (i - (rows - 1) / 2) / ((rows - 1) / 2);
          const phase = 0.5 + 0.5 * Math.sin(u * (angle / 10) + time * 20);
          return <rect key={i} x={-10} y={-118 + i * 21.6} width={12} height={16} fill={C.red} opacity={0.35 + 0.65 * phase * (0.5 + flash * 0.5)} />;
        })}
      </g>
    </g>
  );
};
