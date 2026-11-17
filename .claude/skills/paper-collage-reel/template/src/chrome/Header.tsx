import React from "react";
import { Img, staticFile, useVideoConfig } from "remotion";
import { enter } from "../anim";
import { C, FONT, LAYOUT, col, onColor } from "../theme";
import type { Chapter, Meta } from "../types";

const mono: React.CSSProperties = {
  fontFamily: FONT.mono,
  fontWeight: 600,
  fontSize: 21,
  letterSpacing: 2.2,
  textTransform: "uppercase",
  lineHeight: 1,
  padding: "8px 12px 7px",
  whiteSpace: "nowrap",
};

export const Brand: React.FC<{ meta: Meta }> = ({ meta }) => (
  <div
    style={{
      position: "absolute",
      left: LAYOUT.marginX,
      top: LAYOUT.headerY,
      display: "flex",
      alignItems: "center",
      gap: 18,
    }}
  >
    {meta.logo ? (
      <Img src={staticFile(meta.logo)} style={{ width: 64, height: 64, borderRadius: 14, objectFit: "cover" }} />
    ) : (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: C.ink,
          color: C.lime,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT.display,
          fontSize: 34,
          fontStyle: "italic",
          letterSpacing: -1,
        }}
      >
        {meta.monogram ?? meta.brand.slice(0, 2).toUpperCase()}
      </div>
    )}
    <div style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, letterSpacing: 3.5, color: C.ink }}>
      {meta.brand.toUpperCase()}
    </div>
  </div>
);

export const SeriesTags: React.FC<{ meta: Meta }> = ({ meta }) => {
  if (!meta.seriesTags?.length) return null;
  return (
    <div style={{ position: "absolute", left: LAYOUT.marginX, top: LAYOUT.seriesY, display: "flex" }}>
      {meta.seriesTags.map((t, i) => (
        <div key={i} style={{ ...mono, background: col(t.bg ?? "ink"), color: t.color ? col(t.color) : onColor(t.bg ?? "ink") }}>
          {t.text}
        </div>
      ))}
    </div>
  );
};

/** "1 / 4  HOW THEY PLAY" chip. Pops when the chapter changes (`sinceFrame` = frames since change). */
export const ChapterChip: React.FC<{ chapter: Chapter; sinceFrame: number }> = ({ chapter, sinceFrame }) => {
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.marginX,
        top: LAYOUT.chapterY,
        display: "flex",
        transformOrigin: "left center",
        ...enter(sinceFrame, fps, "slide-right"),
      }}
    >
      <div style={{ ...mono, background: C.ink, color: C.white }}>
        {chapter.index} / {chapter.total}
      </div>
      <div style={{ ...mono, background: C.lime, color: C.ink }}>{chapter.label}</div>
    </div>
  );
};
