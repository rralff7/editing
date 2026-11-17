import type { CSSProperties } from "react";
import { Easing, interpolate, spring } from "remotion";
import type { Anim } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Entrance style for an element that appears at local frame `f` = 0.
 * Motion vocabulary measured from the reference: fast (4-8 frame) springy pops,
 * headline words that "slam" down from 150%, stamps that thud in, wipes for blocks.
 */
export const enter = (f: number, fps: number, kind: Anim = "pop", rotate = 0): CSSProperties => {
  if (kind === "none") return { rotate: `${rotate}deg` };
  if (f < 0) return { opacity: 0, rotate: `${rotate}deg` };

  const fade = interpolate(f, [0, 3], [0, 1], clamp);

  switch (kind) {
    case "pop": {
      const s = spring({ frame: f, fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
      return {
        opacity: fade,
        scale: String(interpolate(s, [0, 1], [0.55, 1])),
        rotate: `${interpolate(s, [0, 1], [rotate - 5, rotate])}deg`,
      };
    }
    case "slam": {
      const s = spring({ frame: f, fps, config: { damping: 15, stiffness: 260, mass: 0.5 } });
      return {
        opacity: interpolate(f, [0, 2], [0, 1], clamp),
        scale: String(interpolate(s, [0, 1], [1.55, 1])),
        rotate: `${rotate}deg`,
        filter: `blur(${interpolate(f, [0, 3], [6, 0], clamp)}px)`,
      };
    }
    case "stamp": {
      const s = interpolate(f, [0, 5], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
      const shake = f >= 5 && f < 9 ? Math.sin(f * 3) * 2 : 0;
      return {
        opacity: interpolate(f, [0, 2], [0, 1], clamp),
        scale: String(interpolate(s, [0, 1], [2.2, 1])),
        rotate: `${rotate + shake}deg`,
      };
    }
    case "slide-up":
    case "slide-left":
    case "slide-right":
    case "drop": {
      const s = spring({ frame: f, fps, config: { damping: 16, stiffness: 180, mass: 0.7 } });
      const d = interpolate(s, [0, 1], [1, 0]);
      const t =
        kind === "slide-up"
          ? `0px ${d * 90}px`
          : kind === "drop"
            ? `0px ${-d * 120}px`
            : kind === "slide-left"
              ? `${d * 260}px 0px`
              : `${-d * 260}px 0px`;
      return { opacity: fade, translate: t, rotate: `${rotate}deg` };
    }
    case "wipe": {
      const p = interpolate(f, [0, 8], [100, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
      return { clipPath: `inset(0 ${p}% 0 0)`, rotate: `${rotate}deg` };
    }
    case "fade":
    default:
      return { opacity: interpolate(f, [0, 6], [0, 1], clamp), rotate: `${rotate}deg` };
  }
};

/** Exit fade for elements with exitMs. */
export const exitOpacity = (f: number): number => interpolate(f, [0, 5], [1, 0], clamp);

/** Number of characters to show for a typewriter effect. */
export const typed = (text: string, f: number, fps: number, typeMs?: number): string => {
  if (!typeMs) return text;
  const total = (typeMs / 1000) * fps;
  const n = Math.round(interpolate(f, [0, total], [0, text.length], clamp));
  return text.slice(0, n);
};

/** Count-up for stats like "43,591", "980+", ".627", "6'9\"". Non-numeric values pass through. */
export const countUp = (value: string, f: number, frames = 18): string => {
  const m = value.match(/^([^\d.]*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return value;
  const [, pre, num, post] = m;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  const target = parseFloat(num.replace(/,/g, ""));
  const p = interpolate(f, [0, frames], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cur = target * p;
  let out = cur.toFixed(decimals);
  if (num.includes(",")) out = Number(out).toLocaleString("en-US", { minimumFractionDigits: decimals });
  if (num.startsWith(".")) out = out.replace(/^0/, "");
  return `${pre}${out}${post}`;
};

export const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);
