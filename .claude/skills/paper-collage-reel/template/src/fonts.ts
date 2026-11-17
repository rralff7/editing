import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT } from "./theme";

// Bundled in public/fonts (see public/fonts/LICENSES.md). No network needed at render time.
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

type Face = { family: string; file: string; weight: string; style?: string; ext?: boolean };

const faces: Face[] = [
  { family: FONT.display, file: "anton-latin-400-normal", weight: "400", ext: true },
  { family: FONT.sans, file: "inter-latin-600-normal", weight: "600", ext: true },
  { family: FONT.sans, file: "inter-latin-800-normal", weight: "800", ext: true },
  { family: FONT.mono, file: "ibm-plex-mono-latin-500-normal", weight: "500", ext: true },
  { family: FONT.mono, file: "ibm-plex-mono-latin-600-normal", weight: "600", ext: true },
  { family: FONT.serif, file: "instrument-serif-latin-400-italic", weight: "400", style: "italic", ext: true },
  { family: FONT.hand, file: "permanent-marker-latin-400-normal", weight: "400" },
];

export const fontsReady = Promise.all(
  faces.flatMap((f) => {
    const base = {
      family: f.family,
      weight: f.weight,
      style: f.style ?? "normal",
      display: "block" as const,
    };
    const loads = [loadFont({ ...base, url: staticFile(`fonts/${f.file}.woff2`), unicodeRange: LATIN })];
    if (f.ext) {
      loads.push(
        loadFont({
          ...base,
          url: staticFile(`fonts/${f.file.replace("-latin-", "-latin-ext-")}.woff2`),
          unicodeRange: LATIN_EXT,
        }),
      );
    }
    return loads;
  }),
);
