import React from "react";
import { AbsoluteFill } from "remotion";
import { C, H, W } from "../theme";

const LINE = "rgba(70,58,42,0.20)";

/** Hand-drawn half court, seen from mid-court: baseline, lane, hoop with net. */
const Court: React.FC = () => (
  <g fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M -20 1600 C 300 1584, 700 1556, 1100 1530" />
    <path d="M 330 1588 L 300 1990" />
    <path d="M 760 1560 L 800 1990" />
    <path d="M 392 1588 L 392 1660 L 700 1646 L 700 1566" />
    <circle cx={548} cy={1730} r={52} />
    <path d="M 512 1700 L 584 1766 M 584 1700 L 512 1766 M 500 1730 L 596 1730 M 548 1678 L 548 1782" strokeWidth={3} />
    <path d="M 548 1660 L 548 1678" />
    <path d="M 120 1990 C 160 1860, 280 1800, 330 1790" />
    <path d="M 980 1990 C 940 1860, 830 1790, 770 1784" />
  </g>
);

/** Hand-drawn pitch: halfway line and centre circle. */
const Pitch: React.FC = () => (
  <g fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round">
    <path d="M -20 1640 C 300 1630, 700 1622, 1100 1612" />
    <ellipse cx={540} cy={1720} rx={230} ry={120} />
    <circle cx={540} cy={1720} r={7} fill={LINE} />
    <path d="M 40 1990 L 120 1560 M 1040 1990 L 960 1550" />
  </g>
);

/** Cream paper stock: warm base, lighter centre, fibre grain, faint backdrop sketch. */
export const Paper: React.FC<{ backdrop?: "court" | "pitch" | "none" }> = ({ backdrop = "court" }) => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="pp-light" cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor={C.paperLight} stopOpacity={0.95} />
          <stop offset="60%" stopColor={C.paperLight} stopOpacity={0.35} />
          <stop offset="100%" stopColor="#b9ad98" stopOpacity={0.45} />
        </radialGradient>
        <filter id="pp-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={7} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.10" />
          </feComponentTransfer>
        </filter>
        <filter id="pp-blotch" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves={2} seed={3} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.12 0" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#pp-light)" />
      <rect width={W} height={H} filter="url(#pp-blotch)" />
      {backdrop === "court" ? <Court /> : backdrop === "pitch" ? <Pitch /> : null}
      <rect width={W} height={H} filter="url(#pp-grain)" />
    </svg>
  </AbsoluteFill>
);
