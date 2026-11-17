import React, { useMemo } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, LAYOUT } from "../theme";
import type { Word } from "../types";

type Page = { words: Word[]; startMs: number; endMs: number };

const MAX_WORDS = 6;
const MAX_CHARS = 34;
const HOLD_MS = 700; // how long a page lingers after its last word if nothing follows

/** Split scene words into short caption pages: break on punctuation, ≤6 words, ≤34 chars. */
export const paginate = (sceneWords: Word[][]): Page[] => {
  const pages: Page[] = [];
  for (const words of sceneWords) {
    let cur: Word[] = [];
    const flush = () => {
      if (cur.length) pages.push({ words: cur, startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs + HOLD_MS });
      cur = [];
    };
    for (const w of words) {
      const chars = cur.map((x) => x.text).join(" ").length + w.text.length + 1;
      if (cur.length >= MAX_WORDS || (cur.length > 0 && chars > MAX_CHARS)) flush();
      cur.push(w);
      if (/[.?!:;,]["”’)]?$/.test(w.text)) flush();
    }
    flush();
  }
  for (let i = 0; i < pages.length - 1; i++) {
    pages[i].endMs = Math.min(pages[i].endMs, pages[i + 1].startMs);
  }
  return pages;
};

/** Karaoke captions: current phrase centred, the spoken word on a lime marker. */
export const Captions: React.FC<{ sceneWords: Word[][] }> = ({ sceneWords }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(() => paginate(sceneWords), [sceneWords]);
  const ms = (frame / fps) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.endMs);
  if (!page) return null;

  const sinceStart = ((ms - page.startMs) / 1000) * fps;
  let active = -1;
  page.words.forEach((w, i) => {
    if (ms >= w.startMs) active = i;
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: LAYOUT.captionsY,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 16,
        rowGap: 6,
        fontFamily: FONT.sans,
        fontWeight: 600,
        fontSize: 52,
        lineHeight: 1.18,
        color: C.ink,
        opacity: interpolate(sinceStart, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      {page.words.map((w, i) => (
        <span
          key={i}
          style={{
            padding: "0 10px",
            margin: "0 -10px",
            borderRadius: 6,
            background: i === active ? C.lime : "transparent",
          }}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
};
