#!/usr/bin/env python3
"""
Compile script.json + word timings into public/timeline.json for the Remotion template.

  # real voiceover (words.json from voiceover-timing/scripts/tts_elevenlabs.py or align_words.py)
  python build_timeline.py script.json --words words.json --audio vo.mp3 --out public/timeline.json

  # animatic: no audio yet, timings estimated from text at --wpm
  python build_timeline.py script.json --estimate --out public/timeline.json

What it does
  * Tokenises each scene's `vo` line, aligns the tokens to the timed words (difflib), and
    interpolates anything the recogniser missed, so captions always show the script's spelling.
  * Scene boundaries = first word of each scene (minus --scene-lead-ms).
  * Resolves every `cue` / `exitCue` / per-part / per-item cue to milliseconds.
  * Aggregates photo `credit` fields into the scene's vertical credit strip.
  * Validates: unknown element types, unresolved cues, missing image files.
  * Optionally writes an .srt (--srt) for the platform's own caption track.

Only the standard library is used.
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path

ELEMENT_TYPES = {
    "headline", "tag", "text", "portrait", "image", "quote", "stat", "stamp",
    "card", "grid", "bars", "note", "vs", "divider", "arrow",
}
IMAGE_FIELDS = ("src", "avatar")
CONTENT_RIGHT = 960


class ScriptError(Exception):
    pass


def norm(tok: str) -> str:
    t = unicodedata.normalize("NFKD", tok).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]", "", t)


def tokenize(text: str) -> list[str]:
    return [t for t in re.split(r"\s+", text.strip()) if t]


# ---------------------------------------------------------------- timing sources

def estimate_words(tokens: list[str], wpm: float) -> list[dict]:
    """Rough speech timing for animatics. Calibrated so plain prose lands near `wpm`."""
    base = 60000.0 / wpm
    out, t = [], 0.0
    for tok in tokens:
        n = max(1, len(norm(tok)))
        dur = min(780.0, max(170.0, base * (0.45 + 0.11 * n)))
        out.append({"text": tok, "startMs": round(t), "endMs": round(t + dur)})
        t += dur + 25
        if re.search(r"[.?!]['\"”’)]?$", tok):
            t += 330
        elif re.search(r"[,;:—–-]['\"”’)]?$", tok):
            t += 170
    return out


def align(script_tokens: list[str], timed: list[dict]) -> list[dict]:
    """Map script tokens onto timed words; interpolate gaps."""
    a = [norm(t) for t in script_tokens]
    b = [norm(w["text"]) for w in timed]
    times: list[tuple[float, float] | None] = [None] * len(a)
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            w = timed[blk.b + k]
            times[blk.a + k] = (float(w["startMs"]), float(w["endMs"]))
    # Unmatched runs: spread them across the gap between known neighbours (or the matching
    # region of the recogniser output, e.g. "43,591" vs "forty three thousand ...").
    i = 0
    total_end = float(timed[-1]["endMs"]) if timed else 0.0
    while i < len(a):
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < len(a) and times[j] is None:
            j += 1
        lo = times[i - 1][1] if i > 0 else (float(timed[0]["startMs"]) if timed else 0.0)
        hi = times[j][0] if j < len(a) else total_end
        if hi <= lo:
            hi = lo + 200.0 * (j - i)
        step = (hi - lo) / (j - i)
        for k in range(i, j):
            s = lo + step * (k - i)
            times[k] = (s, s + step * 0.9)
        i = j
    return [{"text": t, "startMs": round(s), "endMs": round(e)} for t, (s, e) in zip(script_tokens, times)]


# ---------------------------------------------------------------- cue resolution

class CueResolver:
    def __init__(self, scene_id: str, words: list[dict], start: float, end: float, lead: float, settle: float = 0.0):
        self.scene_id = scene_id
        self.words = words
        self.norms = [norm(w["text"]) for w in words]
        self.start, self.end, self.lead = start, end, lead
        self.settle = settle  # '@start' elements wait this long so the old scene can slide out first
        self.cursor = 0

    def _find(self, phrase: list[str], frm: int) -> int:
        n = len(phrase)
        for i in range(frm, len(self.norms) - n + 1):
            if self.norms[i:i + n] == phrase:
                return i
        return -1

    def resolve(self, cue, delay: float = 0.0, what: str = "element") -> float:
        if cue is None or cue == "@start":
            t = self.start + self.settle
        elif isinstance(cue, (int, float)):
            t = self.start + float(cue) * 1000
        elif cue == "@end":
            t = self.end - 400
        elif isinstance(cue, str) and cue.startswith("@+"):
            t = self.start + float(cue[2:]) * 1000
        else:
            nth = None
            text = str(cue)
            m = re.match(r"^(.*)#(\d+)$", text)
            if m:
                text, nth = m.group(1), int(m.group(2))
            phrase = [norm(p) for p in tokenize(text)]
            phrase = [p for p in phrase if p]
            if not phrase:
                raise ScriptError(f"[{self.scene_id}] empty cue for {what}")
            if nth:
                idx, frm = -1, 0
                for _ in range(nth):
                    idx = self._find(phrase, frm)
                    if idx < 0:
                        break
                    frm = idx + 1
            else:
                idx = self._find(phrase, self.cursor)
                if idx < 0:
                    idx = self._find(phrase, 0)
            if idx < 0:
                spoken = " ".join(w["text"] for w in self.words)
                raise ScriptError(
                    f"[{self.scene_id}] cue '{cue}' for {what} is not spoken in this scene.\n"
                    f"  vo: {spoken}\n  Use a word from the vo line, '@start', '@+1.5' or 'word#2'."
                )
            self.cursor = idx + len(phrase)
            t = self.words[idx]["startMs"] - self.lead
        t += delay * 1000
        return float(max(self.start, min(t, self.end)))


# ---------------------------------------------------------------- build

def build(script: dict, timed_words: list[dict] | None, args) -> dict:
    meta = script.get("meta", {})
    settings = script.get("settings", {})
    fps = int(settings.get("fps", 30))
    scenes_in = script.get("scenes", [])
    if not scenes_in:
        raise ScriptError("script.json has no scenes")
    if not meta.get("brand"):
        raise ScriptError("meta.brand is required (your channel / brand name)")

    tokens_per_scene = [tokenize(s.get("vo", "")) for s in scenes_in]
    flat = [t for toks in tokens_per_scene for t in toks]
    if not flat:
        raise ScriptError("no voiceover text in any scene")

    if timed_words is None:
        aligned = estimate_words(flat, args.wpm)
    else:
        aligned = align(flat, timed_words)

    # split back into scenes
    per_scene, k = [], 0
    for toks in tokens_per_scene:
        per_scene.append(aligned[k:k + len(toks)])
        k += len(toks)

    # scene boundaries
    starts = []
    for i, words in enumerate(per_scene):
        if i == 0:
            starts.append(0.0)
        elif words:
            prev_end = next((p[-1]["endMs"] for p in reversed(per_scene[:i]) if p), 0)
            starts.append(max(float(prev_end), words[0]["startMs"] - args.scene_lead_ms))
        else:
            # silent scene: give it its explicit hold time after the previous scene's words
            prev_end = next((p[-1]["endMs"] for p in reversed(per_scene[:i]) if p), 0)
            starts.append(float(prev_end) + 100)
    last_end = float(aligned[-1]["endMs"]) + args.tail_ms
    ends = starts[1:] + [last_end]
    for i, s in enumerate(scenes_in):
        hold = float(s.get("holdMs", 0))
        if hold and ends[i] - starts[i] < hold:
            shift = hold - (ends[i] - starts[i])
            for j in range(i + 1, len(starts)):
                starts[j] += shift
            for j in range(len(per_scene)):
                if j > i:
                    for w in per_scene[j]:
                        w["startMs"] += shift
                        w["endMs"] += shift
            ends = starts[1:] + [last_end + shift]
            last_end += shift

    public = Path(args.public_dir) if args.public_dir else None
    warnings: list[str] = []
    scenes_out = []
    seen_ids = set()
    for i, s in enumerate(scenes_in):
        sid = s.get("id") or f"scene-{i + 1:02d}"
        if sid in seen_ids:
            raise ScriptError(f"duplicate scene id '{sid}'")
        seen_ids.add(sid)
        start, end = starts[i], ends[i]
        settle = 0.0 if i == 0 or s.get("exit") == "cut" else args.settle_ms
        res = CueResolver(sid, per_scene[i], start, end, args.cue_lead_ms, settle)
        credits = []
        if s.get("credits"):
            credits.append(s["credits"])
        els = []
        for j, el in enumerate(s.get("elements", [])):
            el = dict(el)
            typ = el.get("type")
            what = f"element #{j + 1} ({typ})"
            if typ not in ELEMENT_TYPES:
                raise ScriptError(f"[{sid}] {what}: unknown type. Use one of: {', '.join(sorted(ELEMENT_TYPES))}")
            if "x" not in el or "y" not in el:
                raise ScriptError(f"[{sid}] {what}: x and y are required (px on the 1080x1920 canvas)")
            el["atMs"] = round(res.resolve(el.pop("cue", None), float(el.pop("delay", 0)), what))
            if "exitCue" in el:
                el["exitMs"] = round(res.resolve(el.pop("exitCue"), float(el.pop("exitDelay", 0)), what + " exit"))
            if typ == "headline":
                if not el.get("parts"):
                    if "text" in el:
                        el["parts"] = [{"text": el.pop("text")}]
                    else:
                        raise ScriptError(f"[{sid}] {what}: needs parts[] or text")
                el.setdefault("w", CONTENT_RIGHT - el["x"])
                for p in el["parts"]:
                    cue = p.pop("cue", None)
                    p["atMs"] = round(res.resolve(cue, float(p.pop("delay", 0)), what + " part") if cue else el["atMs"])
            if typ == "grid":
                for it in el.get("items", []):
                    if "cue" in it:
                        it["atMs"] = round(res.resolve(it.pop("cue"), float(it.pop("delay", 0)), what + " item"))
            if typ == "note" and "highlightCue" in el:
                el["highlightAtMs"] = round(res.resolve(el.pop("highlightCue"), 0, what + " highlight"))
            if el.get("credit"):
                credits.append(el["credit"])
            for f in IMAGE_FIELDS:
                v = el.get(f)
                if v and public and not re.match(r"^https?://", v) and not (public / v).exists():
                    warnings.append(f"[{sid}] {what}: public/{v} does not exist yet")
            els.append(el)
        uniq = list(dict.fromkeys(credits))
        scene_out = {
            "id": sid,
            "startMs": round(start),
            "endMs": round(end),
            "chapter": s.get("chapter"),
            "chrome": s.get("chrome", "full"),
            "exit": s.get("exit", "slide-left"),
            "credits": ("Photos (edited): " + " · ".join(uniq)) if uniq else None,
            "words": per_scene[i],
            "elements": els,
        }
        scenes_out.append(scene_out)

    return {
        "version": 1,
        "fps": fps,
        "width": 1080,
        "height": 1920,
        "durationMs": round(last_end),
        "audio": args.audio,
        "meta": meta,
        "scenes": scenes_out,
    }, warnings


def write_srt(tl: dict, path: Path):
    def ts(ms):
        h, ms = divmod(int(ms), 3600000)
        m, ms = divmod(ms, 60000)
        s, ms = divmod(ms, 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    cues, cur = [], []
    for sc in tl["scenes"]:
        for w in sc["words"]:
            cur.append(w)
            if len(cur) >= 7 or re.search(r"[.?!,:;]['\"”’)]?$", w["text"]):
                cues.append(cur)
                cur = []
        if cur:
            cues.append(cur)
            cur = []
    with path.open("w", encoding="utf-8") as fh:
        for n, c in enumerate(cues, 1):
            fh.write(f"{n}\n{ts(c[0]['startMs'])} --> {ts(c[-1]['endMs'] + 150)}\n{' '.join(w['text'] for w in c)}\n\n")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script", help="script.json")
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--words", help="words.json: [{text,startMs,endMs}] for the whole voiceover")
    src.add_argument("--estimate", action="store_true", help="no audio: estimate timings (animatic)")
    ap.add_argument("--audio", default=None, help="audio file name inside public/ (e.g. vo.mp3)")
    ap.add_argument("--out", default="public/timeline.json")
    ap.add_argument("--public-dir", default=None, help="check image paths against this folder (default: the --out folder)")
    ap.add_argument("--wpm", type=float, default=170, help="speech rate for --estimate (reference reel ≈ 170)")
    ap.add_argument("--cue-lead-ms", type=float, default=60, help="show elements this much before their word")
    ap.add_argument("--scene-lead-ms", type=float, default=120, help="cut to a new scene this much before its first word")
    ap.add_argument("--tail-ms", type=float, default=1500, help="hold after the last word")
    ap.add_argument("--settle-ms", type=float, default=150, help="delay for '@start' elements after a scene change")
    ap.add_argument("--srt", default=None, help="also write an .srt caption file here")
    args = ap.parse_args()

    script = json.loads(Path(args.script).read_text(encoding="utf-8"))
    timed = None
    if args.words:
        timed = json.loads(Path(args.words).read_text(encoding="utf-8"))
        if isinstance(timed, dict):
            timed = timed.get("words", [])
        if not timed:
            sys.exit("words.json is empty")
    out = Path(args.out)
    if args.public_dir is None:
        args.public_dir = str(out.parent)
    try:
        tl, warnings = build(script, timed, args)
    except ScriptError as e:
        sys.exit(f"script error: {e}")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(tl, indent=1, ensure_ascii=False), encoding="utf-8")
    if args.srt:
        Path(args.srt).parent.mkdir(parents=True, exist_ok=True)
        write_srt(tl, Path(args.srt))
    for w in warnings:
        print("warning:", w, file=sys.stderr)
    n_el = sum(len(s["elements"]) for s in tl["scenes"])
    print(json.dumps({
        "out": str(out),
        "durationSec": round(tl["durationMs"] / 1000, 2),
        "scenes": len(tl["scenes"]),
        "elements": n_el,
        "secondsPerElement": round(tl["durationMs"] / 1000 / max(1, n_el), 2),
        "timing": "estimated" if args.estimate else "words.json",
        "warnings": len(warnings),
    }))


if __name__ == "__main__":
    main()
