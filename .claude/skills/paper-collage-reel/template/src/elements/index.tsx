import React from "react";
import { enter, exitOpacity } from "../anim";
import type { Anim, Element } from "../types";
import { Bars, Card, Grid, Note, Stat } from "./DataEls";
import { Image, Portrait, Quote } from "./MediaEls";
import { Arrow, Divider, Vs } from "./ShapeEls";
import { Headline, Stamp, Tag, Text } from "./TextEls";
import type { ElProps } from "./props";

/** Entrance used when an element does not set `anim`. Headline/grid/bars/divider/arrow animate internally. */
const DEFAULT_ANIM: Record<Element["type"], Anim> = {
  headline: "none",
  tag: "pop",
  text: "fade",
  portrait: "pop",
  image: "pop",
  quote: "pop",
  stat: "pop",
  stamp: "stamp",
  card: "slide-up",
  grid: "none",
  bars: "none",
  note: "slide-up",
  vs: "pop",
  divider: "none",
  arrow: "none",
};

const Body: React.FC<ElProps<Element>> = (p) => {
  const { el } = p;
  switch (el.type) {
    case "headline":
      return <Headline {...p} el={el} />;
    case "tag":
      return <Tag {...p} el={el} />;
    case "text":
      return <Text {...p} el={el} />;
    case "portrait":
      return <Portrait {...p} el={el} />;
    case "image":
      return <Image {...p} el={el} />;
    case "quote":
      return <Quote {...p} el={el} />;
    case "stat":
      return <Stat {...p} el={el} />;
    case "stamp":
      return <Stamp {...p} el={el} />;
    case "card":
      return <Card {...p} el={el} />;
    case "grid":
      return <Grid {...p} el={el} />;
    case "bars":
      return <Bars {...p} el={el} />;
    case "note":
      return <Note {...p} el={el} />;
    case "vs":
      return <Vs {...p} el={el} />;
    case "divider":
      return <Divider {...p} el={el} />;
    case "arrow":
      return <Arrow {...p} el={el} />;
    default:
      return null;
  }
};

/** Positions an element on the canvas and applies its entrance/exit. */
export const ElementLayer: React.FC<{
  el: Element;
  frame: number; // frames since el.atMs
  exitFrame?: number; // frames since el.exitMs
  fps: number;
  msToLocal: (ms: number) => number;
}> = ({ el, frame, exitFrame, fps, msToLocal }) => {
  // Headlines with per-part cues can start before el.atMs; render them whenever any part is due.
  const earliest = el.type === "headline" ? Math.min(0, ...el.parts.map((p) => msToLocal(p.atMs))) : 0;
  if (frame < earliest) return null;
  // Anything cued at 0 ms is already in place on frame 0, which doubles as the thumbnail.
  const anim = el.atMs <= 0 ? "none" : (el.anim ?? DEFAULT_ANIM[el.type]);
  const style = enter(frame, fps, anim, el.rotate ?? 0);
  const out = exitFrame !== undefined && exitFrame >= 0 ? exitOpacity(exitFrame) : 1;
  if (out <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        width: el.type === "headline" || el.type === "tag" || el.type === "stamp" || el.type === "text" ? el.w : undefined,
        zIndex: el.z ?? 1,
        transformOrigin: "center center",
        ...style,
        opacity: (typeof style.opacity === "number" ? style.opacity : 1) * out,
      }}
    >
      <Body el={el} frame={frame} fps={fps} msToLocal={msToLocal} />
    </div>
  );
};
