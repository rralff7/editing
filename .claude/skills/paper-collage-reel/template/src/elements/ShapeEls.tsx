import React from "react";
import { interpolate } from "remotion";
import { C, FONT, col } from "../theme";
import type { ArrowEl, DividerEl, VsEl } from "../types";
import type { ElProps } from "./props";

const draw = (frame: number, frames = 12) =>
  interpolate(frame, [0, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Round badge: "VS", "=", "≠", "+". */
export const Vs: React.FC<ElProps<VsEl>> = ({ el }) => {
  const size = el.size ?? 96;
  const bg = el.bg ?? (el.text === "=" ? "stamp" : "ink");
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: col(bg),
        color: C.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT.display,
        fontSize: size * 0.46,
        border: `${size * 0.06}px solid ${C.white}`,
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
        boxSizing: "border-box",
      }}
    >
      {el.text ?? "VS"}
    </div>
  );
};

/** Jagged "torn" vertical line that draws top-to-bottom. */
export const Divider: React.FC<ElProps<DividerEl>> = ({ el, frame }) => {
  const h = el.h ?? 700;
  const jag = el.jag ?? 16;
  const pts: string[] = [];
  for (let y = 0, i = 0; y <= h; y += 34, i++) pts.push(`${(i % 2 ? 1 : -1) * jag * (0.6 + ((i * 37) % 7) / 10)},${y}`);
  const len = h * 1.6;
  return (
    <svg width={jag * 4} height={h} viewBox={`${-jag * 2} 0 ${jag * 4} ${h}`} style={{ overflow: "visible" }}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={col(el.color, C.ink)}
        strokeWidth={5}
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * draw(frame)}
      />
    </svg>
  );
};

/** Hand-drawn curved arrow from (x,y) to `to`, drawn on. */
export const Arrow: React.FC<ElProps<ArrowEl>> = ({ el, frame }) => {
  const dx = el.to.x - el.x;
  const dy = el.to.y - el.y;
  const bend = el.bend ?? 60;
  const len = Math.hypot(dx, dy) || 1;
  const cx = dx / 2 - (dy / len) * bend;
  const cy = dy / 2 + (dx / len) * bend;
  const ang = Math.atan2(dy - cy, dx - cx);
  const head = 22;
  const a1 = `${dx - head * Math.cos(ang - 0.45)},${dy - head * Math.sin(ang - 0.45)}`;
  const a2 = `${dx - head * Math.cos(ang + 0.45)},${dy - head * Math.sin(ang + 0.45)}`;
  const c = col(el.color ?? "ink");
  const total = len * 1.3;
  const p = draw(frame, 10);
  return (
    <svg width={1} height={1} style={{ overflow: "visible", position: "absolute", left: 0, top: 0 }}>
      <path d={`M0,0 Q${cx},${cy} ${dx},${dy}`} fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeDasharray={total} strokeDashoffset={total * p} />
      <polyline points={`${a1} ${dx},${dy} ${a2}`} fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={p < 0.05 ? 1 : 0} />
    </svg>
  );
};
