import React from "react";
import { interpolate } from "remotion";
import { countUp, enter } from "../anim";
import { C, FONT, PAPER_SHADOW, col, onColor } from "../theme";
import type { BarsEl, CardEl, GridEl, NoteEl, StatEl } from "../types";
import { Tape } from "./MediaEls";
import type { ElProps } from "./props";

const monoLabel: React.CSSProperties = {
  fontFamily: FONT.mono,
  fontWeight: 600,
  letterSpacing: 2.2,
  textTransform: "uppercase",
  lineHeight: 1.2,
};

/** Big number with mono label above, optional side suffix and source note. */
export const Stat: React.FC<ElProps<StatEl>> = ({ el, frame }) => {
  const size = el.size ?? 150;
  const value = el.countUp === false ? el.value : countUp(el.value, frame);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {el.label ? <div style={{ ...monoLabel, fontSize: 21, color: C.ink, marginBottom: 2 }}>{el.label}</div> : null}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: size,
            lineHeight: 0.98,
            letterSpacing: -1,
            color: col(el.color ?? "redDeep"),
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>
        {el.suffix ? (
          <div style={{ ...monoLabel, fontSize: 19, color: col(el.color ?? "redDeep"), paddingBottom: size * 0.1 }}>{el.suffix}</div>
        ) : null}
      </div>
      {el.note ? (
        <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 17, color: C.inkSoft, marginTop: 6, maxWidth: el.w, lineHeight: 1.35 }}>
          {el.note}
        </div>
      ) : null}
    </div>
  );
};

/** Paper panel, optionally with a coloured header bar (kicker + condensed title). */
export const Card: React.FC<ElProps<CardEl>> = ({ el, frame, fps }) => {
  const bg = el.bg ?? "white";
  const titleBg = el.titleBg ?? "ink";
  return (
    <div
      style={{
        position: "relative",
        width: el.w,
        height: el.h,
        background: bg === "glass" ? "linear-gradient(160deg, #eef2f3 0%, #dfe5e8 45%, #eef1f2 100%)" : col(bg),
        boxShadow: PAPER_SHADOW,
        border: bg === "glass" ? "10px solid #c9d0d4" : undefined,
        boxSizing: "border-box",
        overflow: "visible",
      }}
    >
      {el.tape ? <Tape style={{ right: -20, top: -18, rotate: "9deg" }} /> : null}
      {el.title || el.kicker ? (
        <div
          style={{
            background: col(titleBg),
            color: onColor(titleBg),
            padding: "18px 22px 14px",
            ...enter(frame - 2, fps, "wipe"),
          }}
        >
          {el.kicker ? <div style={{ ...monoLabel, fontSize: 20, opacity: 0.9 }}>{el.kicker}</div> : null}
          {el.title ? (
            <div style={{ fontFamily: FONT.display, fontSize: el.titleSize ?? 80, lineHeight: 1.02, textTransform: "uppercase" }}>
              {el.title}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

/** Grid of tokens (trophy years, champions, finals). Items pop in sequence or on their own cue. */
export const Grid: React.FC<ElProps<GridEl>> = ({ el, frame, fps, msToLocal }) => {
  const cell = el.cell ?? 96;
  const gap = el.gap ?? 14;
  const stagger = ((el.staggerMs ?? 90) / 1000) * fps;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${el.cols}, ${cell}px)`, gap }}>
      {el.items.map((it, i) => {
        const f = it.atMs !== undefined ? frame - msToLocal(it.atMs) : frame - i * stagger;
        const empty = !it.fill || it.fill === "empty";
        const fill = empty ? "transparent" : col(it.fill);
        const circle = (el.shape ?? "circle") === "circle";
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            {!circle && it.sub ? <div style={{ ...monoLabel, fontSize: 15, color: C.inkSoft, alignSelf: "flex-start" }}>{it.sub}</div> : null}
            <div
              style={{
                width: cell,
                height: circle ? cell : cell * 0.62,
                borderRadius: circle ? "50%" : 4,
                background: fill,
                border: empty ? `3px dashed rgba(26,25,22,0.25)` : circle ? "4px solid rgba(255,255,255,0.85)" : `3px solid ${C.ink}`,
                boxShadow: empty ? undefined : "0 3px 8px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT.display,
                fontSize: circle ? cell * 0.42 : cell * 0.4,
                color: empty ? "rgba(26,25,22,0.3)" : onColor(it.fill),
                boxSizing: "border-box",
                ...(empty ? {} : enter(f, fps, "pop")),
              }}
            >
              {it.label}
            </div>
            {circle && it.sub ? <div style={{ ...monoLabel, fontSize: 15, color: C.inkSoft }}>{it.sub}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

/** Horizontal bars that grow left-to-right with a big value at the end. */
export const Bars: React.FC<ElProps<BarsEl>> = ({ el, frame, fps }) => {
  const w = el.w ?? 560;
  const barH = el.barH ?? 34;
  const max = el.max ?? Math.max(...el.items.map((i) => i.value));
  const stagger = ((el.staggerMs ?? 260) / 1000) * fps;
  const track = w - 170;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: w }}>
      {el.items.map((it, i) => {
        const f = frame - i * stagger;
        const grow = interpolate(f, [0, 14], [0, it.value / max], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ opacity: f < 0 ? 0 : 1 }}>
            <div style={{ ...monoLabel, fontSize: 18, color: C.ink }}>{it.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: track * grow, height: barH, background: col(it.color ?? "ink") }} />
              <div style={{ fontFamily: FONT.display, fontSize: barH * 1.9, lineHeight: 1, color: col(it.color ?? "ink") }}>
                {it.display ?? String(it.value)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Typed paper note (scouting report, headline clipping). ==phrases== get a lime marker sweep. */
export const Note: React.FC<ElProps<NoteEl>> = ({ el, frame, fps, msToLocal }) => {
  const hf = el.highlightAtMs !== undefined ? frame - msToLocal(el.highlightAtMs) : frame - Math.round(fps / 2);
  const sweep = interpolate(hf, [0, 10], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const parts = el.text.split(/(==[^=]+==)/g);
  return (
    <div style={{ width: el.w ?? 440, background: C.white, boxShadow: PAPER_SHADOW, padding: "26px 28px", boxSizing: "border-box", position: "relative" }}>
      <Tape style={{ left: "38%", top: -20, rotate: "3deg" }} />
      {el.title ? <div style={{ ...monoLabel, fontSize: 18, color: C.inkSoft, borderBottom: `2px solid ${C.ink}`, paddingBottom: 8, marginBottom: 12 }}>{el.title}</div> : null}
      <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: el.size ?? 24, lineHeight: 1.45, color: C.ink, whiteSpace: "pre-wrap" }}>
        {parts.map((p, i) =>
          p.startsWith("==") ? (
            <span
              key={i}
              style={{
                backgroundImage: `linear-gradient(${C.lime}, ${C.lime})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${sweep}% 88%`,
                backgroundPosition: "0 60%",
              }}
            >
              {p.slice(2, -2)}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
    </div>
  );
};
