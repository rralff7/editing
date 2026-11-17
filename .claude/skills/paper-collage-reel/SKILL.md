---
name: paper-collage-reel
description: Build and render a vertical (1080x1920) paper-collage explainer reel in Remotion. Cream paper, B&W photo cutouts on mustard/red colour blocks, condensed headline strips, taped quote cards, stat cards with rubber stamps, karaoke captions with a lime word highlight, every element popping in on a spoken word. Use when composing, previewing or rendering a script.json made with the explainer-script skill, or when changing this visual template.
---

# Paper-collage reel (Remotion template)

`template/` is a complete Remotion 4 project. Nothing is hard-coded per video: everything comes from
`public/timeline.json`, which `scripts/build_timeline.py` compiles from a `script.json` plus word timings.

```
script.json ─┐
words.json  ─┼─ build_timeline.py ──► public/timeline.json ──► Remotion ──► out/reel.mp4
vo.mp3      ─┘     (cues → ms, captions, credits, validation)
```

## 1. Start a project

```bash
SK=.claude/skills/paper-collage-reel
cp -r $SK/template reels/<slug>
cd reels/<slug> && npm i
```

- Fonts are bundled in `public/fonts` (Anton, Inter, IBM Plex Mono, Instrument Serif italic, Permanent Marker), so rendering needs no network.
- Put cutouts in `public/img/` (photo-cutouts skill), the narration in `public/vo.mp3` and `public/words.json` (voiceover-timing skill), and the script in `script.json`.
- `examples/demo-script.json` uses every element type, with fictional players and placeholder art. Read it before writing a new script.

## 2. Compile the timeline

```bash
# with narration
python3 $SK/scripts/build_timeline.py script.json --words public/words.json --audio vo.mp3 \
  --out public/timeline.json --srt out/captions.srt
# animatic, before any audio exists (timings estimated at --wpm 170)
python3 $SK/scripts/build_timeline.py script.json --estimate --out public/timeline.json
```

It stops with a precise message on unknown element types, missing `x`/`y`, or a `cue` word that is not
spoken in that scene. Fix the script, not the timeline. It warns when an image file is missing. The summary
prints `secondsPerElement`: aim for **1.2–2.0 s** (the reference adds a new visual every ~1.5 s).

## 3. Preview

```bash
npx remotion studio                       # interactive; scrub and check every cue
npx remotion render Reel out/stills --frames=0,90,300,600 --image-format=jpeg --scale=0.5
```
Look at stills before a full render. Tile them into one contact sheet so you can check them in one image:
`ffmpeg -pattern_type glob -i 'out/stills/*.jpeg' -vf "scale=300:-2,tile=6x2:padding=4:color=white" out/sheet.jpg`.

In sandboxed/cloud machines Remotion may not be able to download its browser. Point it at a local one:
`export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`.
`remotion.config.ts` reads that variable.

## 4. Render

```bash
npx remotion render Reel out/reel.mp4          # h264, CRF 18, yuv420p, AAC 192k (remotion.config.ts)
npx remotion still Reel out/cover.jpg --frame=<N>  # N = a frame just after the hook claim is fully built
```
A 40 s reel renders in about 2 minutes on 4 cores; a 3-minute reel takes about 8–10 minutes. Run long renders in the background.

## 5. QA checklist (do it every time)

1. **Frame 0** already shows the hook layout (portraits, labels): hook elements use `@start`. The claim headline may build word by word; pick the cover frame after it completes.
2. **Sync**: sample 8–10 frames; each element appears on its word, not before the narrator gets there.
3. **Overlap**: nothing collides with the credit strip (x > 960), the captions (y > 1400) or another element.
4. **Text fit**: headline parts do not wrap unexpectedly; quotes stay inside their card.
5. **Captions**: script spelling, ≤ 2 lines, lime highlight on the spoken word.
6. **Credits**: every real photo has a `credit`; the strip reads "Photos (edited): …".
7. **Audio**: `ffmpeg -i out/reel.mp4 -af loudnorm=print_format=summary -f null -` → about −14 LUFS, true peak ≤ −1 dBTP.
8. **Length**: duration matches the narration plus a 1.5 s tail; last frame mirrors the hook (loop).

## Design system (from the reference)

| Token | Value | Use |
|---|---|---|
| paper | `#d8cdbb`, light `#e4dac9`, grain + blotch noise | background stock |
| ink | `#1a1916` | text, tags, chips |
| mustard | `#b9881a` (deep `#6f5210`) | side A blocks / numbers |
| red | `#ad231b` (deep `#7a1611`) | side B blocks / numbers |
| lime | `#caf139` | caption highlight, chapter chip, emphasis strip |
| stamp | `#e8452f` | rubber stamps |
| cream / pink / white | `#f2ecd5` / `#f1e1db` / `#fbf8f1` | cards |
| Display | Anton, uppercase | headlines, big numbers |
| Mono | IBM Plex Mono 500/600, uppercase, tracked +2 | tags, labels, sources, credits |
| Serif | Instrument Serif italic | quotes |
| Hand | Permanent Marker | asides ("on Messi", "small for their sport") |
| Sans | Inter 600/800 | captions, brand name |

Motion vocabulary (`src/anim.ts`): springy **pop** (55% → 100%, slight rotation settle, about 6 frames),
headline **slam** (155% → 100% with blur, about 4 frames), **stamp** thud with a little shake, **wipe** for
header bars, typewriter quotes, count-up stats, marker-sweep highlights, and draw-on dividers and arrows. Scenes leave
with a 7-frame **whip left** while the next scene's first elements pop in.

Colour coding is semantic: pick one colour per side (A = mustard, B = red) and never swap it.

## Element reference

All element types, fields, the layout grid and measured layout recipes: [references/elements.md](references/elements.md).

## Changing the template

- Tokens: `src/theme.ts`. Fonts: `src/fonts.ts` + `public/fonts/` (keep LICENSES.md current).
- A new element type needs four changes: the type in `src/types.ts`, the component in `src/elements/*`, a case in `src/elements/index.tsx`, and adding it to `ELEMENT_TYPES` in `scripts/build_timeline.py`.
- Animations must be driven by `useCurrentFrame()` and `interpolate`/`spring`. CSS transitions do not render.
- Run `npx tsc --noEmit && npx eslint src` after changes.
- For Remotion API questions use the `remotion:remotion-best-practices` skill.
