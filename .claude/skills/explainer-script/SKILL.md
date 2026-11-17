---
name: explainer-script
description: Research and write the script for a voiceover-driven comparison/explainer reel (the "X is [sport]'s Y" format) as a script.json that drives the paper-collage-reel template, covering narration, chapters, on-screen elements, word cues, sources and the post caption. Use when planning, writing, fact-checking or restructuring such a reel, or turning a topic or argument into scenes.
---

# Explainer reel script

Output: **`script.json`** (scenes with narration + cued elements) and **`caption.txt`** (post text).
The format is reverse-engineered from a 178 s Instagram reel comparing Curry/Messi and
LeBron/Ronaldo. Read [references/playbook.md](references/playbook.md) for the beat-by-beat anatomy before writing.

## 1. Pick the angle (the claim is the whole video)

- One **provocative, defensible equation**: "A is [domain]'s B. C is its D." It has two sides, two archetypes, and one named lens ("magicians vs engines").
- It has to be supportable with **quotes, numbers and origin stories** from credible sources. If you can't find three hard facts per side, change the angle.
- Name the archetypes with two short nouns. They become the colour-coded labels for the whole video (side A = mustard, side B = red).

## 2. Research and fact sheet (before writing a single line)

Make `facts.md`: every number, date, quote and record with **source + URL + as-of date**. Rules:
- Stats change. Write the "as of" date into the stat's `note` and into the caption ("Stats as of 15 Nov 2026").
- Quotes: exact wording, speaker, month and year. Paraphrases never go in quote cards.
- Prefer primary or reference sources (league sites, Basketball-Reference, FBref, Transfermarkt, major outlets).
- Use WebSearch/WebFetch for this. Never invent or "round to sound right". If a fact can't be verified, cut it.

## 3. Structure (default 150–180 s; a 60–90 s cut keeps hook + 2 chapters + close)

| Beat | Time | Job |
|---|---|---|
| Hook | 0–15 s | Claim as an equation, visible in **frame 0**. Thesis line. Roadmap: one tag per chapter word ("How they play. How they're built. How they think. And the war that made them.") |
| Chapter 1 | ~30 s | Archetypes in action: expert quote per side, one efficiency stat vs one volume stat ("A wins per minute, B wins the totals") |
| Chapter 2 | ~25 s | Origins: contrasting backstories with artifacts (scouting report, magazine cover, first-person quote) |
| Bridge | ~8 s | A surprising symmetry (born 37 days apart, both still playing) |
| Chapter 3 | ~20 s | Mindset: each subject's own quote on "who is the greatest", labelled (deflection / self-belief) |
| Optional sponsor | ~10 s | Clearly marked break, at ≈ 50–55 % runtime, when viewers are invested |
| Chapter 4 | ~55 s | The rivalry: head-to-head evidence, records broken back and forth, a quote about pushing each other; then the parallel in the other domain; then "since it ended" (nobody has dominated since) |
| Twist + close | ~15 s | "Are they the same? No." Name the real difference, then reframe ("Not twins. Mirrors."). The final layout **repeats the frame-0 equation** so the reel loops |

## 4. Narration rules

- **3–9 words per sentence**, one idea per sentence. Fragments are fine ("Thirty-seven days apart.").
- Every sentence earns a **new on-screen element**: a stat, a quote, a tag or a stamp. Aim for a new visual every **1.2–2 s**.
- Numbers: write them as the narrator should say them **and** show them as digits in the element (`vo`: "forty-three thousand, five hundred ninety-one", `stat.value`: "43,591"). Short numbers can stay as digits in `vo`.
- Set up quotes with a colon: "In his words:" then the quote, so the card types on while it is spoken.
- Pace: ~165–175 wpm. 178 s ≈ 480–520 words.
- No filler intros ("Hey guys"), no "in this video". The first word is the claim.

## 5. Write script.json

```json
{
  "meta": { "title": "...", "brand": "Your Brand", "monogram": "YB", "backdrop": "court",
            "seriesTags": [ {"text": "Steph is Messi", "bg": "mustard", "color": "ink"},
                            {"text": "LeBron is Ronaldo", "bg": "red"} ] },
  "settings": { "fps": 30 },
  "scenes": [
    { "id": "hook", "chrome": "minimal",
      "vo": "Stephen Curry is basketball's Lionel Messi.",
      "elements": [
        { "type": "portrait", "src": "img/curry.png", "block": "mustard", "x": 70, "y": 300, "w": 430, "h": 470,
          "credit": "Erik Drost, CC BY 2.0" },
        { "type": "headline", "x": 70, "y": 520, "size": 100, "parts": [
          { "text": "Stephen Curry", "cue": "Curry" }, { "text": "is", "cue": "is" },
          { "text": "basketball's", "cue": "basketball's", "br": true },
          { "text": "Lionel", "cue": "Lionel", "br": true }, { "text": "Messi.", "bg": "mustard", "cue": "Messi" } ] } ] },
    { "id": "magicians", "chapter": { "index": 1, "total": 4, "label": "How they play" },
      "vo": "Steph and Messi are the magicians.", "elements": [ ... ] }
  ]
}
```

- One scene = one layout. Change layout when the topic changes (about every 6–15 s); otherwise keep **building** on the current layout.
- `cue` = the exact word (or phrase) in that scene's `vo` that triggers the element. Cue the **noun or number**, not filler words.
- `chapter` must be repeated on every scene in that chapter. The hook uses `"chrome": "minimal"`.
- Positions and every element field are documented in `.claude/skills/paper-collage-reel/references/elements.md`, which also has measured layout recipes for each beat above.
- Each real photo needs a `credit` (photo-cutouts skill records them in `assets/credits.json`).

Validate early: `python3 .claude/skills/paper-collage-reel/scripts/build_timeline.py script.json --estimate --out /tmp/tl.json`.
It fails on any cue that isn't spoken in its scene.

## 6. caption.txt

```
<one-line restatement of the claim>

<2 lines: the lenses / chapters, in plain words>

<question CTA that forces a side: "Magician or engine: who are you taking?">

Photo credits are on screen in every scene (Wikimedia Commons, edited). Stats as of <date>.

#tag1 #tag2 #tag3 #tag4 #tag5
```

## Originality

Reproduce the **format**, not someone else's video: your own brand name and monogram, your own angle,
script, research and visual choices. Never reuse another creator's logo, wording or footage.
