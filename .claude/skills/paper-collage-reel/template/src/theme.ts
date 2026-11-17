/** Design tokens sampled from the reference reel (paper-collage sports explainer). */

export const W = 1080;
export const H = 1920;

export const C = {
  paper: "#d8cdbb", // background stock
  paperLight: "#e4dac9",
  ink: "#1a1916",
  inkSoft: "#4a443a",
  white: "#fbf8f1",
  cream: "#f2ecd5",
  pink: "#f1e1db",
  glass: "#e3e8ea",
  mustard: "#b9881a", // side A
  mustardDeep: "#6f5210",
  red: "#ad231b", // side B
  redDeep: "#7a1611",
  lime: "#caf139", // caption highlight, chapter chip, accents
  stamp: "#e8452f",
} as const;

export type ColorName = keyof typeof C;

export const FONT = {
  display: "Anton", // condensed all-caps headlines and big numbers
  mono: "Plex Mono", // tags, labels, sources, credits
  serif: "Instrument Serif", // italic quotes
  hand: "Permanent Marker", // handwritten asides
  sans: "Inter", // captions, brand name
} as const;

/** Resolve a color name ("mustard") or pass through a CSS color ("#123456"). */
export const col = (c?: string, fallback: string = C.ink): string => {
  if (!c) return fallback;
  if (c === "none") return "transparent";
  return (C as Record<string, string>)[c] ?? c;
};

/** Text color that reads on a given background name. */
export const onColor = (bg?: string): string => {
  switch (bg) {
    case "ink":
    case "red":
    case "redDeep":
    case "mustardDeep":
    case "inkSoft":
      return C.white;
    default:
      return C.ink;
  }
};

/** Fixed layout slots (px). Keep content inside SAFE so platform UI never covers it. */
export const LAYOUT = {
  marginX: 70, // left edge of everything
  contentRight: 960, // keep clear of the credit strip
  headerY: 110, // brand row (logo tile top)
  seriesY: 196, // series tag row
  chapterY: 248, // chapter chip row
  contentTop: 300, // first headline goes here
  contentBottom: 1390,
  captionsY: 1430, // top of caption block (2 lines max)
  creditsX: 995, // vertical credit strip
  creditsY: 250,
  creditsH: 760,
};

export const PAPER_SHADOW = "0 3px 0 rgba(0,0,0,0.06), 0 10px 22px rgba(40,30,15,0.22)";
export const HARD_SHADOW = "0 2px 0 rgba(0,0,0,0.08), 0 6px 14px rgba(40,30,15,0.25)";
