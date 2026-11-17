#!/usr/bin/env python3
"""
Find and download freely licensed photos from Wikimedia Commons, recording the credit line
that must appear on screen ("Author, CC BY 2.0"). Credits are appended to credits.json,
which you copy into each element's `credit` field (build_timeline.py prints them in the
vertical credit strip).

  python commons_fetch.py search "Lionel Messi 2022"            # list candidates + licenses
  python commons_fetch.py get "File:Some photo.jpg" --out assets/raw/messi.jpg

Only licenses that allow edited derivatives are accepted: CC0, Public domain, CC BY, CC BY-SA.
NC/ND and non-free files are refused. Needs network access to commons.wikimedia.org and
upload.wikimedia.org. Wikimedia throttles anonymous scripts: set COMMONS_CONTACT (a URL or
email the user chose to share) to add contact info to the User-Agent per their bot policy.
Standard library only.
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://commons.wikimedia.org/w/api.php"
UA = "paper-collage-reel/1.0 (asset fetch script; https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)"
OK_LICENSE = re.compile(r"^(cc0|public domain|pd\b|cc by(-sa)? \d(\.\d)?)", re.I)


def fetch(url: str, timeout: int = 60, tries: int = 5) -> bytes:
    """GET with Wikimedia-friendly retries (429/503 -> honour Retry-After, back off)."""
    ua = UA + (f" contact:{os.environ['COMMONS_CONTACT']}" if os.environ.get("COMMONS_CONTACT") else "")
    for i in range(tries):
        req = urllib.request.Request(url, headers={"User-Agent": ua})
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code not in (429, 503) or i == tries - 1:
                raise
            wait = float(e.headers.get("Retry-After") or 0) or 2 ** (i + 1)
            print(f"commons: HTTP {e.code}, retrying in {wait:.0f}s", file=sys.stderr)
            time.sleep(min(wait, 60))
    raise RuntimeError("unreachable")


def get(params: dict) -> dict:
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json", "formatversion": "2"})
    return json.loads(fetch(url))


def strip_html(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def info(page: dict) -> dict:
    ii = (page.get("imageinfo") or [{}])[0]
    md = ii.get("extmetadata", {})
    lic = strip_html(md.get("LicenseShortName", {}).get("value", ""))
    author = strip_html(md.get("Artist", {}).get("value", "")) or strip_html(md.get("Credit", {}).get("value", ""))
    author = re.sub(r"\s+", " ", author)[:80]
    return {
        "title": page.get("title"),
        "width": ii.get("width"),
        "height": ii.get("height"),
        "license": lic,
        "licenseUrl": md.get("LicenseUrl", {}).get("value"),
        "author": author,
        "allowed": bool(OK_LICENSE.match(lic)) and not re.search(r"\b(nc|nd)\b", lic, re.I),
        "url": ii.get("url"),
        "thumb": ii.get("thumburl"),
        "page": ii.get("descriptionurl"),
    }


def cmd_search(a):
    data = get({
        "action": "query", "generator": "search", "gsrsearch": f"{a.query} filetype:bitmap",
        "gsrnamespace": 6, "gsrlimit": a.limit, "prop": "imageinfo",
        "iiprop": "url|size|extmetadata", "iiurlwidth": a.width,
    })
    pages = sorted(data.get("query", {}).get("pages", []), key=lambda p: p.get("index", 0))
    for p in pages:
        d = info(p)
        flag = "OK " if d["allowed"] else "NO "
        print(f"{flag} {d['title']}  [{d['width']}x{d['height']}]  {d['license']}  by {d['author']}")
    if not pages:
        print("no results")


def cmd_get(a):
    title = a.title if a.title.startswith("File:") else "File:" + a.title
    data = get({"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": a.width})
    page = data["query"]["pages"][0]
    if page.get("missing"):
        sys.exit(f"not found: {title}")
    d = info(page)
    if not d["allowed"] and not a.force:
        sys.exit(f"refused: license '{d['license']}' does not allow edited reuse. Pick another file (or --force if you have other rights).")
    # Wikimedia asks scripts to use thumbnails in standard sizes (https://w.wiki/GHai) and
    # throttles original downloads. The API hands out thumb.wikimedia.org URLs; the same path
    # is served by upload.wikimedia.org, so only one host needs to be allowed.
    if a.original or not d["thumb"]:
        src = d["url"]
    else:
        src = d["thumb"].replace("https://thumb.wikimedia.org/", "https://upload.wikimedia.org/").split("?")[0]
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(fetch(src, timeout=300))
    try:
        from PIL import Image, ImageOps

        with Image.open(out) as im:
            im = ImageOps.exif_transpose(im)
            if im.width > a.width:
                im.thumbnail((a.width, a.width * 4), Image.LANCZOS)
                im.convert("RGB").save(out, quality=92)
    except ImportError:
        print("note: install Pillow to downscale large originals", file=sys.stderr)
    credit = f"{d['author'] or 'Unknown'}, {d['license']}"
    rec = {"file": str(out), "credit": credit, **{k: d[k] for k in ("title", "author", "license", "licenseUrl", "page")}}
    cj = Path(a.credits)
    allc = json.loads(cj.read_text()) if cj.exists() else []
    allc = [c for c in allc if c.get("file") != rec["file"]] + [rec]
    cj.parent.mkdir(parents=True, exist_ok=True)
    cj.write_text(json.dumps(allc, indent=1, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(rec, ensure_ascii=False))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("search")
    s.add_argument("query")
    s.add_argument("--limit", type=int, default=12)
    s.add_argument("--width", type=int, default=1280)
    g = sub.add_parser("get")
    g.add_argument("title", help='"File:Name.jpg"')
    g.add_argument("--out", required=True)
    g.add_argument("--width", type=int, default=1280, help="standard thumb width: 500, 960, 1280 or 1920")
    g.add_argument("--original", action="store_true", help="download the full original (rate-limited by Wikimedia)")
    g.add_argument("--credits", default="assets/credits.json")
    g.add_argument("--force", action="store_true")
    a = ap.parse_args()
    {"search": cmd_search, "get": cmd_get}[a.cmd](a)


if __name__ == "__main__":
    main()
