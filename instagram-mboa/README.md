# Instagram kit · 14 days (French, Cameroon)

A two-week Instagram content plan in French for Cameroonian entrepreneurs, inspired by Kallaway's short-form style (hook + concrete detail, rehooks, numbered frameworks, business-story breakdowns, minimal premium look). Palette: near-black navy, navy-blue glow and neon cyan (#00C8E6) with glowing outlines, matched to the reference post supplied; a subtle ndop-cloth texture keeps a Cameroonian detail.

## Ready to post (`out/`)

| What | Where | Size |
|---|---|---|
| Motion graphics Reel, day 1 ("Ta vidéo a 3 secondes pour survivre"), 47 s, French voiceover + sound effects | `out/video/reel-j01-3-secondes.mp4` | 1080×1920, 30 fps |
| Same Reel, sound effects only (to record your own voice over it) | `out/video/reel-j01-3-secondes-sans-voix.mp4` | 1080×1920, 30 fps |
| Carousel, day 2: 7 hooks qui arrêtent le scroll (11 slides) | `out/carrousels/c1-hooks/` | 1080×1350 |
| Carousel, day 5: Format > idée (10 slides) | `out/carrousels/c2-formats/` | 1080×1350 |
| Carousel, day 9: Anatomie d'une vidéo qui vend (10 slides) | `out/carrousels/c3-anatomie/` | 1080×1350 |
| Carousel, day 12: Poster chaque jour avec juste ton téléphone (10 slides) | `out/carrousels/c4-systeme/` | 1080×1350 |
| Covers for all 10 Reels (text kept inside the 3:4 grid crop) | `out/reels/` | 1080×1920 |
| Story highlight covers (5) | `out/highlights/` | 1080×1920 |

The full calendar (hooks, scripts, captions, hashtags, stories, production notes, bio, rules) is in [`CALENDRIER.md`](CALENDRIER.md).

## Re-rendering

Requires Node 18+, Python 3 with NumPy, ffmpeg, and Playwright with Chromium.

```bash
npm install
node scripts/render-carousels.mjs @yourhandle   # adds your @ to every slide footer
node scripts/render-covers.mjs @yourhandle
pip install kokoro-onnx soundfile               # free, open-source TTS (Apache-2.0), runs offline
# download kokoro-v1.0.onnx + voices-v1.0.bin from github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
python3 scripts/voix.py <model-dir> src/reel01-voix.json out/video/voix   # French voice, one WAV per line
node scripts/render-video.mjs                    # ~10 min: animation timed to the voice, SFX, mix, two MP4s
node scripts/build-docs.mjs                      # regenerates CALENDRIER.md
```

- Carousel copy: `src/carousels.js` (`*word*` = cyan italic, `[word]` = fill-in slot).
- Calendar data: `src/calendrier.mjs` (single source for the Markdown and the kit page).
- Video: `src/reel01.html` (GSAP timeline anchored to the measured length of each voice line; `window.CUES` drives the synthesized sound design in `scripts/sfx.py`, which also mixes the voice and ducks the effects under it).
- Voiceover text: `src/reel01-voix.json` (voice `ff_siwis`, speed 1.08 in `scripts/voix.py`).
