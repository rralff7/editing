---
name: explainer-reel
description: End-to-end pipeline for a vertical voiceover-driven explainer reel in the paper-collage style (cream paper, B&W cutouts on colour blocks, condensed headline strips, quote and stat cards, karaoke captions), from topic to finished MP4, cover and caption. Use when the user asks to make, produce or reproduce a reel/short/TikTok "like this one", or a comparison/rivalry/"X is Y's Z" explainer video.
---

# Explainer reel: topic → MP4

This skill coordinates five others. Run the steps in order; each has a clear artifact.

| # | Step | Skill | Artifact |
|---|---|---|---|
| 0 | Study the reference (if the user gave one) | `reel-breakdown` | `work/ref-<slug>/style.md` |
| 1 | Angle, research, script | `explainer-script` | `facts.md`, `script.json`, `caption.txt` |
| 2 | Animatic (no audio) | `paper-collage-reel` | stills contact sheet |
| 3 | Photos + credits | `photo-cutouts` | `public/img/*.png`, `assets/credits.json` |
| 4 | Narration + word timings | `voiceover-timing` | `public/vo.mp3`, `public/words.json` |
| 5 | Compile, preview, render | `paper-collage-reel` | `out/reel.mp4`, `out/cover.jpg`, `out/captions.srt` |
| 6 | QA + publish pack | this skill | checklist below passed |

## Setup (once per reel)

```bash
SLUG=<short-name>
cp -r .claude/skills/paper-collage-reel/template reels/$SLUG
cd reels/$SLUG && npm i && cd -
mkdir -p reels/$SLUG/assets
```
Keep `script.json`, `facts.md`, `caption.txt` and `assets/` in `reels/$SLUG/`. `node_modules/` and `out/` are git-ignored.

## Step-by-step

1. **Brief.** Confirm the topic and the two sides, length (60–90 s cut or 150–180 s full), brand name, monogram and an optional logo, and voice provider. If the user has no preference, use the defaults: 150–180 s, ElevenLabs, brand placeholder "Your Brand".
2. **Script.** Follow `explainer-script`. Every fact goes in `facts.md` with source and date. Validate with `build_timeline.py --estimate`.
3. **Animatic.** `build_timeline.py script.json --estimate --out public/timeline.json`, render 10–12 stills, tile them, and fix layout collisions now (cheap) rather than after the voiceover.
4. **Photos.** `photo-cutouts`: allowed licenses only; set a `credit` on every photo element.
5. **Voiceover.** `voiceover-timing` → `vo_raw.mp3` + `words.json` → `master_vo.sh` → `vo.mp3`.
6. **Compile.** `build_timeline.py script.json --words public/words.json --audio vo.mp3 --out public/timeline.json --srt out/captions.srt`.
7. **Preview** in Remotion Studio or with stills; check sync on 3–4 cues.
8. **Render** `npx remotion render Reel out/reel.mp4` (in the background for long reels) and `npx remotion still Reel out/cover.jpg --frame=<N>` (N = just after the hook claim is fully on screen).
9. **QA** (below), then hand over `out/reel.mp4`, `out/cover.jpg`, `caption.txt`, `out/captions.srt`.

## QA checklist

- [ ] Frame 0 already shows the hook layout; the cover frame shows the complete claim
- [ ] A new visual at least every ~2 s; no static stretch > 3 s
- [ ] Elements land on their words (±2 frames) and captions match the narration
- [ ] Nothing in the platform UI zones: bottom 360 px except captions at y 1430–1560, right rail below y 1050
- [ ] Colour coding consistent (side A mustard, side B red) from start to end
- [ ] Every stat has its source/as-of date on screen (`note`) or in the caption; every quote is verbatim with speaker and date
- [ ] Every real photo is credited and licensed CC0/PD/CC BY/CC BY-SA
- [ ] Loudness ≈ −14 LUFS, true peak ≤ −1 dBTP; no music needed
- [ ] Ending restates the hook (loop)
- [ ] Output: 1080×1920, 30 fps, H.264 yuv420p, AAC; ≤ 3 min for Reels (≤ 60 s for Shorts if the short cut is needed)

## Sponsor slot (optional)

The reference has an 11 s "commercial break" at ~53 % of runtime: a dark full-screen card, "we'll be right back", a
countdown chip and the product demo. Produce it as its own clip (or a scene with `"chrome": "none"` and
card/image elements), keep it clearly labelled, and splice with ffmpeg concat if it's a separate video.

## Environment notes (cloud sessions)

Hosts used by this pipeline: package registries (npm/PyPI, allowed by default), `api.elevenlabs.io` (TTS, key via
the credential tool), `commons.wikimedia.org` + `upload.wikimedia.org` (photos), `huggingface.co` (Whisper
model, only for align_words/breakdown transcripts), GitHub release assets (rembg model), and Instagram hosts
(reference download only). Remotion renders with the preinstalled headless Chrome: `export
REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`.
