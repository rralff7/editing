import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { msToFrame } from "./anim";
import { ElementLayer } from "./elements";
import type { Scene } from "./types";

export const EXIT_FRAMES = 7;

/**
 * One layout. Rendered inside a <Sequence> that starts at scene.startMs, so the local
 * frame 0 = scene start. The scene keeps rendering EXIT_FRAMES past its end while it
 * slides out left, overlapping the next scene's first pops (as in the reference).
 */
export const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = msToFrame(scene.startMs, fps);
  const dur = msToFrame(scene.endMs, fps) - start;
  const exit = scene.exit ?? "slide-left";
  const ex = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) } as const;

  const style: React.CSSProperties =
    exit === "slide-left"
      ? { translate: `${interpolate(frame, [dur, dur + EXIT_FRAMES], [0, -1180], ex)}px 0px` }
      : exit === "fade"
        ? { opacity: interpolate(frame, [dur, dur + EXIT_FRAMES], [1, 0], ex) }
        : { opacity: frame >= dur ? 0 : 1 };

  return (
    <AbsoluteFill style={style}>
      {scene.elements.map((el, i) => {
        const at = msToFrame(el.atMs, fps) - start;
        const msToLocal = (ms: number) => msToFrame(ms, fps) - start - at;
        return (
          <ElementLayer
            key={el.id ?? i}
            el={el}
            frame={frame - at}
            exitFrame={el.exitMs !== undefined ? frame - (msToFrame(el.exitMs, fps) - start) : undefined}
            fps={fps}
            msToLocal={msToLocal}
          />
        );
      })}
    </AbsoluteFill>
  );
};
