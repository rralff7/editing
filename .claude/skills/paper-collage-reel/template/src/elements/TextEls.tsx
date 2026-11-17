import React from "react";
import { enter, typed } from "../anim";
import { C, FONT, PAPER_SHADOW, col, onColor } from "../theme";
import type { HeadlineEl, StampEl, TagEl, TextEl } from "../types";
import type { ElProps } from "./props";

/** Condensed all-caps headline built from paper strips; each part slams in on its own cue. */
export const Headline: React.FC<ElProps<HeadlineEl>> = ({ el, frame, fps, msToLocal }) => {
  const size = el.size ?? 92;
  const lines: HeadlineEl["parts"][] = [[]];
  el.parts.forEach((p) => {
    if (p.br && lines[lines.length - 1].length) lines.push([]);
    lines[lines.length - 1].push(p);
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: size * 0.1, alignItems: el.align === "center" ? "center" : "flex-start" }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", gap: size * 0.11, justifyContent: el.align === "center" ? "center" : "flex-start" }}>
          {line.map((p, i) => {
            const bg = p.bg ?? "white";
            const f = frame - msToLocal(p.atMs);
            return (
              <div
                key={i}
                style={{
                  fontFamily: FONT.display,
                  fontSize: size,
                  lineHeight: 1.04,
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  padding: bg === "none" ? 0 : `${size * 0.05}px ${size * 0.15}px ${size * 0.02}px`,
                  background: col(bg),
                  color: p.color ? col(p.color) : onColor(bg),
                  boxShadow: bg === "none" ? undefined : PAPER_SHADOW,
                  whiteSpace: "nowrap",
                  transformOrigin: "left bottom",
                  ...enter(f, fps, p.atMs <= 0 ? "none" : "slam"),
                }}
              >
                {p.text}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Tag: React.FC<ElProps<TagEl>> = ({ el }) => {
  const bg = el.bg ?? "ink";
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: FONT.mono,
        fontWeight: 600,
        fontSize: el.size ?? 22,
        letterSpacing: 2.4,
        textTransform: "uppercase",
        lineHeight: 1,
        padding: "9px 14px 8px",
        background: col(bg),
        color: el.color ? col(el.color) : onColor(bg),
        whiteSpace: "nowrap",
        boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
      }}
    >
      {el.text}
    </div>
  );
};

const FAMILY: Record<NonNullable<TextEl["font"]>, React.CSSProperties> = {
  display: { fontFamily: FONT.display, textTransform: "uppercase", lineHeight: 1.02 },
  mono: { fontFamily: FONT.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, lineHeight: 1.3 },
  serif: { fontFamily: FONT.serif, fontStyle: "italic", lineHeight: 1.05 },
  hand: { fontFamily: FONT.hand, lineHeight: 1.15 },
  sans: { fontFamily: FONT.sans, fontWeight: 600, lineHeight: 1.2 },
};

export const Text: React.FC<ElProps<TextEl>> = ({ el, frame, fps }) => (
  <div
    style={{
      ...FAMILY[el.font ?? "hand"],
      fontSize: el.size ?? 40,
      color: col(el.color, C.ink),
      textAlign: el.align ?? "left",
      whiteSpace: "pre-wrap",
    }}
  >
    {typed(el.text, frame, fps, el.typeMs)}
  </div>
);

/** Rubber-stamp callout ("MOST EVER", "#1"). */
export const Stamp: React.FC<ElProps<StampEl>> = ({ el }) => {
  const c = col(el.color ?? "stamp");
  const size = el.size ?? 52;
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        border: `${Math.max(4, size * 0.09)}px solid ${c}`,
        borderRadius: size * 0.16,
        padding: `${size * 0.04}px ${size * 0.28}px ${size * 0.02}px`,
        color: c,
        background: "rgba(255,250,245,0.35)",
        mixBlendMode: "multiply",
      }}
    >
      <div style={{ fontFamily: FONT.display, fontSize: size, lineHeight: 1.05, textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {el.text}
      </div>
      {el.sub ? (
        <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: size * 0.3, letterSpacing: 1.5, textTransform: "uppercase", marginTop: -2, marginBottom: 4 }}>
          {el.sub}
        </div>
      ) : null}
    </div>
  );
};
