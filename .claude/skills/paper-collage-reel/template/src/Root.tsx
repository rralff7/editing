import React from "react";
import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { fontsReady } from "./fonts";
import { Reel, ReelProps } from "./Reel";
import type { Timeline } from "./types";

const calculateMetadata: CalculateMetadataFunction<ReelProps> = async ({ props, abortSignal }) => {
  const res = await fetch(staticFile(props.timelineFile), { signal: abortSignal });
  if (!res.ok) throw new Error(`Could not load public/${props.timelineFile} (${res.status}). Run build_timeline.py first.`);
  const timeline = (await res.json()) as Timeline;
  await fontsReady;
  return {
    durationInFrames: Math.max(1, Math.ceil((timeline.durationMs / 1000) * timeline.fps)),
    fps: timeline.fps,
    width: timeline.width,
    height: timeline.height,
    props: { ...props, timeline },
    defaultOutName: timeline.meta.title ? timeline.meta.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "reel",
  };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{ timelineFile: "timeline.json" } satisfies ReelProps}
    calculateMetadata={calculateMetadata}
  />
);
