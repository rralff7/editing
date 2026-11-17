import React from "react";
import { Img, staticFile } from "remotion";
import { enter, typed } from "../anim";
import { C, FONT, PAPER_SHADOW, col } from "../theme";
import type { ImageEl, PortraitEl, QuoteEl } from "../types";
import type { ElProps } from "./props";

const src = (s: string) => (/^https?:\/\//.test(s) ? s : staticFile(s));

/** White die-cut edge + soft drop shadow, for transparent PNG cutouts. */
const STICKER =
  "drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 8px 10px rgba(30,20,10,0.35))";
const BW = "grayscale(1) contrast(1.18) brightness(1.04)";

export const Tape: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: "absolute",
      width: 130,
      height: 38,
      background: "rgba(214,190,140,0.72)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      rotate: "-8deg",
      ...style,
    }}
  />
);

/** B&W cutout on a colour block; the head breaks out above the block like the reference. */
export const Portrait: React.FC<ElProps<PortraitEl>> = ({ el, frame, fps }) => {
  const w = el.w ?? 360;
  const h = el.h ?? 420;
  const ratio = el.blockRatio ?? 0.72;
  const filters = [el.grayscale === false ? "" : BW, el.sticker === false ? "" : STICKER].join(" ").trim();
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {el.block !== "none" ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: h * ratio,
            background: col(el.block ?? "mustard"),
            boxShadow: "0 6px 14px rgba(40,30,15,0.18)",
          }}
        />
      ) : null}
      <Img
        src={src(el.src)}
        style={{
          position: "absolute",
          left: "4%",
          width: "92%",
          bottom: 0,
          height: "100%",
          objectFit: "contain",
          objectPosition: "center bottom",
          filter: filters || undefined,
        }}
      />
      {el.name ? (
        <div
          style={{
            position: "absolute",
            left: w * 0.12,
            bottom: -26,
            fontFamily: FONT.mono,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            padding: "9px 14px 8px",
            background: col(el.nameBg ?? "ink"),
            color: C.white,
            whiteSpace: "nowrap",
            boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
            ...enter(frame - 6, fps, "slide-right"),
          }}
        >
          {el.name}
        </div>
      ) : null}
    </div>
  );
};

export const Image: React.FC<ElProps<ImageEl>> = ({ el }) => {
  const filters = [el.grayscale ? BW : "", el.sticker ? STICKER : ""].join(" ").trim();
  return (
    <div
      style={{
        width: el.w,
        height: el.h,
        padding: el.frame ? 10 : 0,
        background: el.frame ? C.white : undefined,
        boxShadow: el.frame ? PAPER_SHADOW : undefined,
        boxSizing: "border-box",
      }}
    >
      <Img
        src={src(el.src)}
        style={{ width: "100%", height: "100%", objectFit: el.fit ?? "cover", filter: filters || undefined }}
      />
    </div>
  );
};

/** Taped paper card with an italic serif quote typed out, mono attribution, handwritten aside. */
export const Quote: React.FC<ElProps<QuoteEl>> = ({ el, frame, fps }) => {
  const size = el.size ?? 66;
  return (
    <div
      style={{
        position: "relative",
        width: el.w ?? 470,
        background: C.white,
        boxShadow: PAPER_SHADOW,
        padding: "34px 34px 26px",
        boxSizing: "border-box",
      }}
    >
      {el.tape !== false ? <Tape style={{ left: -30, top: -20 }} /> : null}
      {el.avatar ? (
        <Img
          src={src(el.avatar)}
          style={{
            position: "absolute",
            right: 22,
            top: -78,
            width: 112,
            height: 112,
            objectFit: "cover",
            filter: BW,
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          }}
        />
      ) : null}
      <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: size, lineHeight: 1.02, color: C.ink, minHeight: size * 1.02 }}>
        “{typed(el.text, frame - 4, fps, el.typeMs ?? 700)}
        {typed(el.text, frame - 4, fps, el.typeMs ?? 700).length === el.text.length ? "”" : ""}
      </div>
      {el.by ? (
        <div
          style={{
            fontFamily: FONT.mono,
            fontWeight: 500,
            fontSize: 19,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: C.inkSoft,
            marginTop: 16,
          }}
        >
          {el.by}
        </div>
      ) : null}
      {el.accent ? (
        <div style={{ fontFamily: FONT.hand, fontSize: 32, color: C.mustardDeep, marginTop: 6, ...enter(frame - 14, fps, "fade") }}>
          {el.accent}
        </div>
      ) : null}
    </div>
  );
};
