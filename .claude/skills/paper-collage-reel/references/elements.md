# Element reference (script.json → timeline.json → Remotion)

Canvas is **1080 × 1920 px, 30 fps**. Every element is absolutely positioned with `x`, `y`
(top-left, px). Elements render in array order; later ones sit on top (or set `z`).

## Common fields (all elements)

| field | meaning |
|---|---|
| `type` | one of the types below (required) |
| `x`, `y` | top-left position in px (required) |
| `w`, `h` | size where the type uses it |
| `cue` | when it appears: a word or phrase from this scene's `vo` (`"Messi"`, `"per minute"`), `"word#2"` for the 2nd occurrence, `"@start"`, `"@+1.5"` (seconds after scene start), `"@end"`. Omitted = scene start. Phrases are matched in order, so repeated words resolve to the next occurrence after the previous cue. |
| `delay` | seconds added to the cue (may be negative) |
| `exitCue` / `exitDelay` | fade the element out at a word (swap a headline mid-scene) |
| `anim` | entrance: `pop` `slam` `stamp` `slide-up` `slide-left` `slide-right` `drop` `wipe` `fade` `none` |
| `rotate` | degrees; small values (−8…8) sell the collage look |
| `z` | stacking order |
| `credit` | photo credit (`"Erik Drost, CC BY 2.0"`), auto-collected into the right-edge strip |

Anything cued at 0 ms (the hook's `@start`) is already on screen in frame 0, so frame 0 works as the thumbnail.

## Types

### `headline`: condensed all-caps text on paper strips
```json
{ "type": "headline", "x": 70, "y": 300, "size": 92, "parts": [
  { "text": "Stephen Curry", "cue": "Curry" },
  { "text": "is", "cue": "is" },
  { "text": "basketball's", "cue": "basketball's", "br": true },
  { "text": "Lionel" , "cue": "Lionel", "br": true },
  { "text": "Messi.", "bg": "mustard", "cue": "Messi" } ] }
```
Each part is its own strip and **slams** in on its cue (parts without a cue appear with the element).
`bg`: `white` (default) · `paper` · `mustard` · `red` · `ink` · `lime` · `none` · any `#hex`. `br` starts a new line.
`size` default 92 (section titles), 100–110 for the hook claim. Shorthand: `"text": "THE WAR"` instead of `parts`.

### `tag`: mono label chip
`{ "type": "tag", "text": "Lionel Messi", "bg": "ink", "x": 90, "y": 880 }`. Use it for kickers ("Clutch claim"), labels, or "8 YEARS · 8 CHAMPIONS".

### `text`: free text
`font`: `hand` (default, marker asides like "small for their sport") · `display` · `mono` · `serif` · `sans`; `size`, `color`, `align`, `typeMs` (typewriter).

### `portrait`: B&W cutout on a colour block (the signature element)
```json
{ "type": "portrait", "src": "img/messi.png", "block": "mustard", "name": "Lionel Messi",
  "x": 70, "y": 460, "w": 380, "h": 440, "credit": "Bryan Berlin, CC BY-SA 4.0", "cue": "Messi" }
```
The block covers the bottom `blockRatio` (0.72) of the box; the head breaks out above it. The image is drawn
`object-fit: contain`, bottom-centred. `grayscale` and `sticker` (white die-cut edge) default to `true`;
set both `false` if the PNG was made with `make_cutout.py --bake`. `nameBg` colours the name tag. `block: "none"` drops the block.

### `image`: any picture
`fit` (`cover`/`contain`), `grayscale`, `sticker`, `frame` (white polaroid border). Use it for logos, magazine covers and screenshots.

### `quote`: taped paper card, italic serif quote typed on
```json
{ "type": "quote", "text": "like a PlayStation", "by": "Arsène Wenger · Apr 2010", "accent": "on Messi",
  "avatar": "img/wenger.jpg", "x": 490, "y": 590, "w": 450, "cue": "Wenger" }
```
`size` (default 66), `typeMs` (700), `tape` (true). The avatar sits over the top-right corner.

### `stat`: big number
`value` (`"43,591"`, `"980+"`, `".627"`, `"6'9\""`), `label` (mono, above), `suffix` (mono, beside, e.g. "RONALDO"),
`note` (source line, below), `color` (`redDeep` default, `mustardDeep` for side A), `size` (150), `countUp` (true for numeric values).

### `stamp`: rubber-stamp callout
`text` ("MOST EVER", "#1", "3-1 COMEBACK"), `sub` (tiny line), `color` (`stamp`), `size` (52), default `rotate` it −8…8.

### `card`: paper panel, optional header bar
`w`, `h`, `bg` (`white` `cream` `pink` `paper` `glass` or hex), `kicker` (mono line), `title` (condensed), `titleBg`, `titleSize`, `tape`.
Put other elements on top of it (later in the array). Two cards side by side make the comparison layout (see below).

### `grid`: tokens (trophies, seasons, champions, finals)
```json
{ "type": "grid", "x": 120, "y": 530, "cols": 5, "cell": 110, "gap": 30, "shape": "circle", "staggerMs": 90,
  "items": [ { "label": "M", "sub": "2009", "fill": "mustard" }, { "label": "R", "sub": "2008", "fill": "red" },
             { "sub": "2018", "fill": "empty" } ] }
```
`shape`: `circle` (label inside, sub below) or `box` (sub above, e.g. year over team code). `fill: "empty"` = dashed placeholder.
Items pop in sequence (`staggerMs`) or on their own `cue`.

### `bars`: horizontal bar comparison
`items: [{label, value, display, color}]`, `w`, `max`, `barH`, `staggerMs`. Bars grow and show `display` at the end.

### `note`: typed paper note with highlighter
`text` with `==phrase==` marks, `title` (mono heading with rule), `highlightCue` (when the lime marker sweeps), `w`, `size`.
Use it for scouting reports, headlines and documents.

### `vs`: round badge
`text`: `VS` (default) · `=` (red) · `?` · `≠`; `size`, `bg`.

### `divider`: torn jagged vertical line that draws on
`h`, `jag`, `color`. Use it for split-screen "same or different?" moments.

### `arrow`: hand-drawn curved arrow
`x,y` → `to: {x, y}`, `bend` (+/− px), `color`.

## Scene fields

| field | meaning |
|---|---|
| `id` | unique slug |
| `vo` | exactly what the narrator says during this scene (captions show this spelling) |
| `chapter` | `{ "index": 1, "total": 4, "label": "How they play" }`, shown as the lime chip. Repeat it on every scene of the chapter. |
| `chrome` | `full` (brand + series tags + chapter), `minimal` (brand only: hook), `none` |
| `exit` | `slide-left` (default, 7-frame whip left) · `fade` · `cut` |
| `credits` | extra credit text for the strip |
| `holdMs` | minimum scene length (for silent beats) |

`meta`: `brand`, `monogram`, `logo` (file in public/), `seriesTags: [{text, bg, color}]`, `backdrop` (`court` · `pitch` · `none`), `title`, `handle`.

## Layout grid (px)

```
y   0 ┌──────────────────────────────────────────────┐
  110 │ [logo] BRAND                                  │  chrome
  196 │ [SERIES TAG A][SERIES TAG B]                  │
  248 │ [1 / 4][CHAPTER LABEL]                        │
  300 │ SECTION HEADLINE (size 92)          ┃credit  │  content zone
      │                                     ┃strip   │  x 70 → 960
      │   portraits / cards / stats / grids ┃995-1050│  y 300 → 1390
      │                                     ┃y250-   │
 1390 │                                     ┃1010    │
 1430 │      karaoke captions (2 lines max)          │  captions
 1560 │                                               │
      │      faint court sketch (no content here)    │  platform UI zone
 1920 └──────────────────────────────────────────────┘
```

Keep every element inside x 70–960 and y 220–1390. The bottom ~360 px is covered by Instagram/TikTok
caption UI and the right ~120 px below y 1050 by the like/comment rail.

## Layout recipes (measured from the reference)

| Beat | Elements |
|---|---|
| **Hook claim (frame 0)** | tag (70,222) · 4 portraits 430×470 in a 2×2 grid at (70,300)(530,300)(70,860)(530,860), top row `mustard`, bottom row `red` · headline parts overlaid at (70,520) and (70,1080), size 100, cued word by word |
| **Roadmap** | 4 `tag`s in a row at y≈1300, one per chapter word ("PLAY", "BUILT", "THINK", "WAR"), each cued to its word |
| **Archetype intro** | headline (70,300) `bg` = side colour · portrait (70,460) 380×440 · quote (490,590) w450 · second portrait (70,900) |
| **Per-minute vs totals** | card (70,300) 440×1060 cream, kicker "The magicians win", title "Per minute", `titleBg` mustard · card (510,300) 440×1060 pink, title "Totals", red · stats at (100,500)/(540,500) size 130 · stamp "MOST EVER" under the stat |
| **Origin contrast** | headline "The body was" + part "the obstacle." (mustard) · card (70,420) 880×200 with two small portraits + `stat` heights · note cards (70,700) and (520,700) |
| **Quote wall** | headline question (70,300) · four quote cards 2×2 at (70,430)(520,430)(70,860)(520,860) w 420 with avatars · stamps "DEFLECTION" / "SELF-BELIEF" |
| **Rivalry record** | headline "The war" + tag (sport) · two portraits flanking a big `stat` ("9 SEASONS") · card + `grid` of trophies below |
| **Record line** | card (70,420) 880×420 · stats 38 → 40 → 50 staggered along it · arrow between them |
| **Since it ended** | headline · grid of `box` tokens (team codes with years) · stamp "8 YEARS · 8 CHAMPIONS" · hand text "not again for years." |
| **Twist** | headline "Are they the same?" + stamp "NO." · card `glass` (70,420) 880×780 · divider (510,420) · portraits each side |
| **Final equation (loop)** | headline "Not twins." + part "Mirrors." (lime) · two `card`s full width (mustard-tint / red-tint) each with portrait · `vs "="` · portrait · headline "Steph" / "is Messi." Mirrors the hook so the reel loops |
