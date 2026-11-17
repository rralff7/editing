/**
 * timeline.json contract. Produced by voiceover-timing/scripts/build_timeline.py
 * from script.json + word timings. All times are milliseconds from video start.
 * All positions are pixels on the 1080x1920 canvas.
 */

export type Word = { text: string; startMs: number; endMs: number };

export type Chapter = { index: number; total: number; label: string };

export type SeriesTag = { text: string; bg?: string; color?: string };

export type Meta = {
  title?: string;
  brand: string; // shown top-left next to the monogram
  monogram?: string; // 1-3 letters inside the logo tile
  logo?: string; // optional image in public/, replaces the monogram tile
  seriesTags?: SeriesTag[];
  backdrop?: "court" | "pitch" | "none";
  handle?: string; // e.g. "@yourbrand" for the end card follow tag
};

export type Anim =
  | "pop"
  | "slam"
  | "slide-up"
  | "slide-left"
  | "slide-right"
  | "drop"
  | "wipe"
  | "stamp"
  | "fade"
  | "none";

type Base = {
  id?: string;
  atMs: number; // resolved from `cue` by build_timeline.py
  exitMs?: number; // resolved from `exitCue`; element fades out here
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
  z?: number;
  anim?: Anim;
  credit?: string; // photo credit, aggregated into the scene credit strip
};

export type HeadlinePart = {
  text: string;
  bg?: string; // paper | mustard | red | ink | lime | white | none | #hex
  color?: string;
  br?: boolean; // line break before this part
  atMs: number;
};

export type HeadlineEl = Base & {
  type: "headline";
  parts: HeadlinePart[];
  size?: number;
  align?: "left" | "center";
};

export type TagEl = Base & {
  type: "tag";
  text: string;
  bg?: string;
  color?: string;
  size?: number;
};

export type TextEl = Base & {
  type: "text";
  text: string;
  font?: "display" | "mono" | "serif" | "hand" | "sans";
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
  typeMs?: number; // typewriter duration; omit for instant
};

export type PortraitEl = Base & {
  type: "portrait";
  src: string;
  block?: string; // color of the block behind the cutout, or "none"
  name?: string;
  nameBg?: string;
  grayscale?: boolean;
  sticker?: boolean; // white die-cut outline
  blockRatio?: number; // fraction of height covered by the block (from bottom)
};

export type ImageEl = Base & {
  type: "image";
  src: string;
  fit?: "cover" | "contain";
  grayscale?: boolean;
  sticker?: boolean;
  frame?: boolean; // white polaroid-style border
};

export type QuoteEl = Base & {
  type: "quote";
  text: string;
  by?: string;
  accent?: string; // handwritten aside, e.g. "on Messi"
  avatar?: string;
  size?: number;
  typeMs?: number;
  tape?: boolean;
};

export type StatEl = Base & {
  type: "stat";
  value: string;
  label?: string;
  suffix?: string;
  note?: string;
  color?: string;
  size?: number;
  countUp?: boolean;
};

export type StampEl = Base & {
  type: "stamp";
  text: string;
  sub?: string;
  color?: string;
  size?: number;
};

export type CardEl = Base & {
  type: "card";
  bg?: string; // white | cream | pink | glass | paper | #hex
  title?: string;
  kicker?: string;
  titleBg?: string;
  titleSize?: number;
  tape?: boolean;
};

export type GridItem = {
  label?: string;
  sub?: string;
  fill?: string; // color name, "empty" for outlined
  atMs?: number;
};

export type GridEl = Base & {
  type: "grid";
  items: GridItem[];
  cols: number;
  cell?: number;
  gap?: number;
  shape?: "circle" | "box";
  staggerMs?: number;
};

export type BarItem = { label: string; value: number; display?: string; color?: string };

export type BarsEl = Base & {
  type: "bars";
  items: BarItem[];
  max?: number;
  barH?: number;
  staggerMs?: number;
};

export type NoteEl = Base & {
  type: "note";
  text: string; // wrap ==phrases== to highlight them
  highlightAtMs?: number;
  size?: number;
  title?: string;
};

export type VsEl = Base & { type: "vs"; text?: string; bg?: string; size?: number };

export type DividerEl = Base & { type: "divider"; color?: string; jag?: number };

export type ArrowEl = Base & {
  type: "arrow";
  to: { x: number; y: number };
  bend?: number;
  color?: string;
};

export type Element =
  | HeadlineEl
  | TagEl
  | TextEl
  | PortraitEl
  | ImageEl
  | QuoteEl
  | StatEl
  | StampEl
  | CardEl
  | GridEl
  | BarsEl
  | NoteEl
  | VsEl
  | DividerEl
  | ArrowEl;

export type Scene = {
  id: string;
  startMs: number;
  endMs: number;
  chapter?: Chapter | null;
  chrome?: "full" | "minimal" | "none"; // minimal = brand only (no series tags / chapter chip)
  exit?: "slide-left" | "cut" | "fade";
  credits?: string;
  words: Word[];
  elements: Element[];
};

export type Timeline = {
  version: 1;
  fps: number;
  width: number;
  height: number;
  durationMs: number;
  audio?: string | null; // file in public/, e.g. "vo.mp3"
  meta: Meta;
  scenes: Scene[];
};
