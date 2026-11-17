---
name: photo-cutouts
description: Source freely licensed photos (Wikimedia Commons) with proper on-screen credits and turn them into black-and-white die-cut PNG cutouts for paper-collage reels. Covers license rules, credit lines, background removal, bust crops, and avatar/headshot prep. Use when a reel needs photos of people, places or objects, or when preparing images for the paper-collage-reel template.
---

# Photo cutouts with credits

The look: head-and-shoulders photos with the background removed, black & white with punchy contrast,
a white die-cut edge, sitting on a flat mustard or red block. Every photo is credited on screen in the
right-edge strip: "Photos (edited): Erik Drost, CC BY 2.0 · Bryan Berlin, CC BY-SA 4.0".

## 1. Licensing rules (non-negotiable)

- Use only images whose license allows **edited** reuse: **CC0, Public Domain, CC BY, CC BY-SA**.
- **Never** use NC (non-commercial: reels are promotional), ND (no derivatives: a cutout is a derivative), agency/editorial photos (Getty, AP, Reuters, club media), or screenshots of broadcasts.
- Credit = `Author, LICENSE` exactly as Commons lists it, plus "(edited)" (the template adds "Photos (edited):").
- CC BY-SA: the edited cutout is under CC BY-SA too. Keep `assets/credits.json` with the reel's source files.
- Real people: use photos in public/sporting contexts; don't make them appear to endorse anything (especially near a sponsor segment).

## 2. Find and download

```bash
SK=.claude/skills/photo-cutouts/scripts
python3 $SK/commons_fetch.py search "Lionel Messi 2022"                 # OK/NO license flag per result
python3 $SK/commons_fetch.py get "File:Lionel Messi 20180626.jpg" --out assets/raw/messi.jpg
```
- `get` refuses disallowed licenses and appends `{file, credit, author, license, page}` to `assets/credits.json`.
- Choosing a photo: the face is clearly lit and roughly frontal, the subject isn't cut off at the shoulders, a recent era fits the story, and ≥ 800 px tall. Action shots work for the hook's larger blocks; portraits for the smaller ones.
- Network: `commons.wikimedia.org` and `upload.wikimedia.org`. Wikimedia throttles anonymous scripts (HTTP 429). The script backs off and retries; set `COMMONS_CONTACT` (a URL or email the user chose to share) to identify the client per Wikimedia's policy, and don't run bulk downloads.

## 3. Make the cutout

```bash
pip install rembg Pillow
python3 $SK/make_cutout.py assets/raw/messi.jpg reels/<slug>/public/img/messi.png --crop bust
```
- `--crop bust` keeps head and shoulders (about as tall as it is wide); `full` keeps the whole subject; `none` keeps the frame.
- Default output keeps colour and the plain alpha edge. The template renders B&W and the white sticker edge in CSS (`portrait.grayscale` and `portrait.sticker` default to true).
- `--bake` bakes in B&W, contrast, grain and a proper dilated white border (cleaner on hair and fingers). Then set `"grayscale": false, "sticker": false` on that element.
- rembg downloads its model on first use (from GitHub). If background removal isn't possible, use a PNG that already has transparency, or a tight square crop with `image` + `frame: true` instead of `portrait`.

Avatars for quote cards (the small speaker photo) need no cutout: a square crop is enough.
`python3 -c "from PIL import Image,ImageOps;im=Image.open('assets/raw/wenger.jpg');ImageOps.fit(im,(320,320),centering=(0.5,0.3)).save('public/img/wenger.jpg')"`

## 4. Wire into the script

```json
{ "type": "portrait", "src": "img/messi.png", "block": "mustard", "name": "Lionel Messi",
  "x": 70, "y": 460, "w": 380, "h": 440, "credit": "Bryan Berlin, CC BY-SA 4.0", "cue": "Messi" }
```
Copy `credit` from `assets/credits.json`. `build_timeline.py` collects the credits used in each scene into that scene's strip
and warns if a `src` file is missing from `public/`.

## Checklist

- [ ] Every image is in `assets/credits.json` with an allowed license
- [ ] Every element showing a real photo has `credit`
- [ ] Cutouts ≤ 900 px on the long side (render speed), transparent background, no halo
- [ ] Same subject looks consistent across scenes (same era/photo where possible)
