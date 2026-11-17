import React from "react";
import { C, FONT, LAYOUT } from "../theme";

/** Vertical photo-credit strip on the right edge, reads bottom-to-top. */
export const Credits: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.creditsX,
        top: LAYOUT.creditsY,
        height: LAYOUT.creditsH,
        padding: "0 7px",
        display: "flex",
        justifyContent: "center",
        background: "rgba(246,241,231,0.55)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          writingMode: "vertical-rl",
          rotate: "180deg",
          fontFamily: FONT.mono,
          fontWeight: 500,
          fontSize: 16.5,
          lineHeight: 1.35,
          color: C.inkSoft,
          padding: "14px 0",
          maxHeight: LAYOUT.creditsH,
          overflow: "hidden",
        }}
      >
        {text}
      </div>
    </div>
  );
};
