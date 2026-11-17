import { Audio } from "@remotion/media";
import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { msToFrame } from "./anim";
import { Captions } from "./chrome/Captions";
import { Credits } from "./chrome/Credits";
import { Brand, ChapterChip, SeriesTags } from "./chrome/Header";
import { Paper } from "./chrome/Paper";
import { EXIT_FRAMES, SceneView } from "./SceneView";
import type { Timeline } from "./types";

export type ReelProps = { timelineFile: string; timeline?: Timeline };

export const Reel: React.FC<ReelProps> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneWords = useMemo(() => timeline?.scenes.map((s) => s.words) ?? [], [timeline]);
  if (!timeline) return <Paper />;

  const ms = (frame / fps) * 1000;
  const scenes = timeline.scenes;
  const idx = Math.max(0, scenes.findIndex((s) => ms >= s.startMs && ms < s.endMs));
  const cur = scenes[idx] ?? scenes[scenes.length - 1];
  const chrome = cur.chrome ?? "full";

  // Frame at which the current chapter label first appeared (for the chip's pop-in).
  let chapterStart = idx;
  while (chapterStart > 0 && scenes[chapterStart - 1].chapter?.label === cur.chapter?.label) chapterStart--;
  const chapterSince = frame - msToFrame(scenes[chapterStart].startMs, fps);

  return (
    <AbsoluteFill>
      <Paper backdrop={timeline.meta.backdrop ?? "court"} />
      {scenes.map((s) => {
        const from = msToFrame(s.startMs, fps);
        const dur = msToFrame(s.endMs, fps) - from + (s.exit === "cut" ? 0 : EXIT_FRAMES);
        return (
          <Sequence key={s.id} from={from} durationInFrames={Math.max(1, dur)} name={s.id} layout="none">
            <SceneView scene={s} />
          </Sequence>
        );
      })}
      {chrome !== "none" ? <Brand meta={timeline.meta} /> : null}
      {chrome === "full" ? <SeriesTags meta={timeline.meta} /> : null}
      {chrome === "full" && cur.chapter ? <ChapterChip chapter={cur.chapter} sinceFrame={chapterSince} /> : null}
      {chrome !== "none" ? <Credits text={cur.credits} /> : null}
      <Captions sceneWords={sceneWords} />
      {timeline.audio ? <Audio src={staticFile(timeline.audio)} /> : null}
    </AbsoluteFill>
  );
};
