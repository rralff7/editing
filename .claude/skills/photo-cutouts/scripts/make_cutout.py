#!/usr/bin/env python3
"""
Turn a photo into a collage cutout PNG for the paper-collage template.

  pip install rembg Pillow         # rembg downloads its u2net model on first use
  python make_cutout.py assets/raw/messi.jpg public/img/messi.png --crop bust

Steps
  1. Remove the background (rembg). Skipped when the input already has transparency.
  2. Crop to the subject: --crop bust (head + shoulders, the reference look), full, or none.
  3. Resize so the long side is <= --max px (keeps renders fast).
  4. Optional --bake: black & white + contrast + grain + white die-cut border baked into
     the PNG. Without --bake the template does B&W and the sticker edge in CSS
     (portrait.grayscale / portrait.sticker default true) - keep it that way unless you
     need a thicker or cleaner border; then set "grayscale": false, "sticker": false.
"""
from __future__ import annotations

import argparse
import io
import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


def remove_bg(im: Image.Image) -> Image.Image:
    try:
        from rembg import remove
    except ImportError:
        sys.exit("Background removal needs: pip install rembg  (or pass an input PNG that already has transparency)")
    buf = io.BytesIO()
    im.convert("RGB").save(buf, format="PNG")
    return Image.open(io.BytesIO(remove(buf.getvalue()))).convert("RGBA")


def has_alpha(im: Image.Image) -> bool:
    if im.mode != "RGBA":
        return False
    lo, _ = im.getchannel("A").getextrema()
    return lo < 250


def crop(im: Image.Image, mode: str) -> Image.Image:
    bbox = im.getchannel("A").point(lambda a: 255 if a > 20 else 0).getbbox()
    if not bbox or mode == "none":
        return im
    x0, y0, x1, y1 = bbox
    if mode == "bust":
        w = x1 - x0
        y1 = min(y1, y0 + int(w * 1.05))  # head + shoulders: roughly as tall as wide
    pad = 6
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1)))


def bake(im: Image.Image, border: int) -> Image.Image:
    alpha = im.getchannel("A")
    rgb = ImageOps.grayscale(im.convert("RGB"))
    rgb = ImageOps.autocontrast(rgb, cutoff=1)
    rgb = ImageEnhance.Contrast(rgb).enhance(1.15).filter(ImageFilter.UnsharpMask(radius=2, percent=80))
    noise = Image.effect_noise(rgb.size, 40)  # film grain, centred on mid-grey
    rgb = Image.blend(rgb, noise, 0.06)
    subject = Image.merge("RGBA", (rgb, rgb, rgb, alpha))
    if border <= 0:
        return subject
    canvas = Image.new("RGBA", (im.width + border * 2, im.height + border * 2), (0, 0, 0, 0))
    a = Image.new("L", canvas.size, 0)
    a.paste(alpha, (border, border))
    grown = a.filter(ImageFilter.MaxFilter(border * 2 + 1)).filter(ImageFilter.GaussianBlur(0.8))
    white = Image.new("RGBA", canvas.size, (255, 255, 255, 255))
    canvas.paste(white, (0, 0), grown)
    canvas.alpha_composite(subject, (border, border))
    return canvas


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--crop", choices=["bust", "full", "none"], default="bust")
    ap.add_argument("--max", type=int, default=900)
    ap.add_argument("--bake", action="store_true", help="bake B&W + grain + white border into the PNG")
    ap.add_argument("--border", type=int, default=10)
    a = ap.parse_args()

    im = Image.open(a.src)
    im = ImageOps.exif_transpose(im).convert("RGBA")
    if not has_alpha(im):
        im = remove_bg(im)
    im = crop(im, a.crop)
    im.thumbnail((a.max, a.max), Image.LANCZOS)
    if a.bake:
        im = bake(im, a.border)
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    im.save(a.out, optimize=True)
    print(f"{a.out}  {im.width}x{im.height}")


if __name__ == "__main__":
    main()
