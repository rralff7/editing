import type { Element } from "../types";

export type ElProps<T extends Element> = {
  el: T;
  frame: number; // frames since el.atMs (negative = not yet visible)
  fps: number;
  /** Convert an absolute ms time to the same local frame space as `frame`. */
  msToLocal: (ms: number) => number;
};
