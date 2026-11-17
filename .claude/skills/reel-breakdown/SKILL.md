---
name: reel-breakdown
description: Analyze a reference short-form video (Instagram Reel, TikTok, YouTube Short, or a local file) to extract a reproducible style spec covering layout, typography, colour palette, motion, pacing, captions, audio mix and narrative structure. Use when the user shares a video link and wants to "make a video like this", reverse-engineer an edit, or compare a render against the reference.
---

# Reference reel breakdown

Goal: turn "a video like that" into numbers and rules another skill can build from.

## 1. Run the extractor

```bash
.claude/skills/reel-breakdown/scripts/breakdown.sh "<url or file>" work/ref-<slug>
```
It writes contact sheets (1 frame/s, timestamped), motion strips around cuts at 15 fps, 720p stills, a dominant
and accent colour palette, a hard-cut count and shot length, loudness (LUFS/LRA/true peak), a silence-gap count,
a spectrogram, and, when a Whisper model is available, word timings and the transcript.

**Network.** Instagram needs `www.instagram.com`, `i.instagram.com` and the reel's video CDN host
(`scontent-<pop>.cdninstagram.com`, which varies by region). Run `yt-dlp -J <url>` first and read the format URLs to see which CDN host
is used, then allow exactly those hosts. In a cloud session, propose them through the environment tools.
If the platform needs a login, ask the user to download the file and pass the path instead.

## 2. Look, in this order

1. `sheets/*.jpg`: the whole video at a glance. Note layout changes (scenes), recurring elements, and how often something new appears.
2. `frames/*.jpg`: typography (condensed / mono / serif / hand), exact positions, borders, shadows, textures.
3. `strips/*.jpg`: motion. Pop vs slide vs cut, overshoot, how many frames an entrance takes, how scenes exit.
4. `palette.txt`: base colours (paper/background) and accents (the semantic colours).
5. `audio.txt` + `spectrum.png`: dark vertical gaps throughout mean voice only; a continuous band means a music bed. Note the LUFS target.
6. `pacing.txt`: hard cuts vs in-layout builds.
7. Transcript / caption text (from the sheets if no transcript): sentence length, words per minute, hook wording, structure.

For a detail, sample densely:
`ffmpeg -ss 14.6 -t 2 -i ref.mp4 -vf "fps=10,scale=180:-2,tile=10x2" -frames:v 1 detail.jpg`.

## 3. Write the style spec (`work/ref-<slug>/style.md`)

Cover each heading with concrete values (px on 1080×1920, hex, frames, seconds):
- **Format**: resolution, fps, duration, safe areas used
- **Layout grid**: header rows, content zone, caption block, persistent chrome
- **Typography**: families/weights per role, sizes, case, tracking, highlight treatment
- **Palette**: background, ink, semantic accents and what each one means
- **Elements**: list each recurring component (cards, tags, stamps, cutouts, charts) with its look
- **Motion**: entrance types and durations, scene transition, timing relative to narration
- **Pacing**: seconds per layout, seconds per new element, wpm
- **Audio**: voice/music/SFX, loudness, dynamics
- **Structure**: beat timeline (time → beat → what's on screen → why it works)
- **Gaps**: anything the current template can't do yet, so it can be added as a new element

## 4. Map it to the toolkit

- Matches the paper-collage format → use **explainer-reel** (script → voiceover → cutouts → paper-collage-reel).
- Different look → copy `paper-collage-reel/template`, change `src/theme.ts` (tokens) and `src/chrome/*`, and add element types for the gaps (see that skill's "Changing the template").

A worked example of the finished analysis, for the reel this toolkit was built from, is in
`.claude/skills/explainer-script/references/playbook.md`.

## Ethics

Study the reference; don't clone it. Never reuse another creator's footage, logo, brand name, script or
voice. Reproduce the format with original content.
