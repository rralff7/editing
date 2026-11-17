# Instagram kit · 14 days (French, Cameroon)

A two-week Instagram content plan in French for Cameroonian entrepreneurs, inspired by Kallaway's short-form style (hook + concrete detail, rehooks, numbered frameworks, business-story breakdowns, minimal premium look). The brand is original: deep ndop indigo, a subtle ndop-cloth texture, and Cameroon-flag gold as the only accent.

## Ready to post (`out/`)

| What | Where | Size |
|---|---|---|
| Motion graphics Reel, day 1 ("Ta vidéo a 3 secondes pour survivre"), 36 s, with sound effects | `out/video/reel-j01-3-secondes.mp4` | 1080×1920, 30 fps |
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
node scripts/render-video.mjs                    # ~5 min: renders 1,080 frames, synthesizes the SFX, encodes MP4
node scripts/build-docs.mjs                      # regenerates CALENDRIER.md
```

- Carousel copy: `src/carousels.js` (`*word*` = gold italic, `[word]` = fill-in slot).
- Calendar data: `src/calendrier.mjs` (single source for the Markdown and the kit page).
- Video: `src/reel01.html` (GSAP timeline; `window.CUES` drives the sound design in `scripts/sfx.py`, all sounds synthesized, no licensed audio).
