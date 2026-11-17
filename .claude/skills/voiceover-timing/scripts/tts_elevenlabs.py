#!/usr/bin/env python3
"""
Generate the voiceover with ElevenLabs and get exact per-word timings in one call
(/v1/text-to-speech/{voice}/with-timestamps). Writes:

  <out-dir>/vo_raw.mp3   the narration (all scenes, one continuous take), unmastered
  <out-dir>/words.json   [{"text","startMs","endMs"}] for build_timeline.py --words

  export ELEVENLABS_API_KEY=...          # or let a credential-injecting proxy add it
  python tts_elevenlabs.py script.json --voice-id <id> --out-dir public

One continuous take sounds better than per-scene clips (consistent pitch/energy, natural
sentence linking). Long scripts are split at scene boundaries into chunks of <= --max-chars,
stitched with previous_text/next_text for continuity, and concatenated with ffmpeg.

Standard library + ffmpeg/ffprobe only.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format={fmt}"


def scene_texts(script_path: str) -> list[str]:
    script = json.loads(Path(script_path).read_text(encoding="utf-8"))
    return [s.get("vo", "").strip() for s in script.get("scenes", []) if s.get("vo", "").strip()]


def chunk(texts: list[str], max_chars: int) -> list[str]:
    out, cur = [], ""
    for t in texts:
        if cur and len(cur) + 1 + len(t) > max_chars:
            out.append(cur)
            cur = t
        else:
            cur = f"{cur} {t}".strip()
    if cur:
        out.append(cur)
    return out


def call(text: str, args, prev: str | None, nxt: str | None) -> dict:
    body = {
        "text": text,
        "model_id": args.model,
        "voice_settings": {
            "stability": args.stability,
            "similarity_boost": args.similarity,
            "style": args.style,
            "use_speaker_boost": True,
            "speed": args.speed,
        },
    }
    if prev:
        body["previous_text"] = prev
    if nxt:
        body["next_text"] = nxt
    key = os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")
    req = urllib.request.Request(
        API.format(voice=args.voice_id, fmt=args.format),
        data=json.dumps(body).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs HTTP {e.code}: {e.read().decode(errors='replace')[:600]}")


def words_from_alignment(al: dict, offset_ms: float) -> list[dict]:
    chars = al["characters"]
    st = al["character_start_times_seconds"]
    en = al["character_end_times_seconds"]
    words, cur, s, e = [], "", None, None
    for c, a, b in zip(chars, st, en):
        if c.isspace():
            if cur:
                words.append({"text": cur, "startMs": round(s * 1000 + offset_ms), "endMs": round(e * 1000 + offset_ms)})
            cur, s = "", None
            continue
        if s is None:
            s = a
        cur += c
        e = b
    if cur:
        words.append({"text": cur, "startMs": round(s * 1000 + offset_ms), "endMs": round(e * 1000 + offset_ms)})
    return words


def duration_ms(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return float(out) * 1000


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script", help="script.json (uses each scene's `vo`)")
    ap.add_argument("--voice-id", default=os.environ.get("ELEVENLABS_VOICE_ID"), help="ElevenLabs voice id")
    ap.add_argument("--model", default="eleven_multilingual_v2")
    ap.add_argument("--speed", type=float, default=1.06, help="0.7-1.2; the reference pace is brisk (~170 wpm)")
    ap.add_argument("--stability", type=float, default=0.45)
    ap.add_argument("--similarity", type=float, default=0.8)
    ap.add_argument("--style", type=float, default=0.15)
    ap.add_argument("--format", default="mp3_44100_192")
    ap.add_argument("--max-chars", type=int, default=2400)
    ap.add_argument("--out-dir", default="public")
    ap.add_argument("--audio-name", default="vo_raw.mp3", help="master it to vo.mp3 with master_vo.sh")
    args = ap.parse_args()
    if not args.voice_id:
        sys.exit("--voice-id (or ELEVENLABS_VOICE_ID) is required. List voices in the ElevenLabs app or via its MCP connector.")

    texts = scene_texts(args.script)
    if not texts:
        sys.exit("no vo text in script")
    chunks = chunk(texts, args.max_chars)
    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    words: list[dict] = []
    offset = 0.0
    with tempfile.TemporaryDirectory() as td:
        parts = []
        for i, text in enumerate(chunks):
            prev = chunks[i - 1][-400:] if i > 0 else None
            nxt = chunks[i + 1][:400] if i + 1 < len(chunks) else None
            res = call(text, args, prev, nxt)
            p = Path(td) / f"part{i:02d}.mp3"
            p.write_bytes(base64.b64decode(res["audio_base64"]))
            al = res.get("alignment") or res.get("normalized_alignment")
            words += words_from_alignment(al, offset)
            offset += duration_ms(p)
            parts.append(p)
            print(json.dumps({"chunk": i + 1, "of": len(chunks), "chars": len(text), "endMs": round(offset)}), file=sys.stderr)
        vo = out / args.audio_name
        if len(parts) == 1:
            vo.write_bytes(parts[0].read_bytes())
        else:
            lst = Path(td) / "list.txt"
            lst.write_text("".join(f"file '{p}'\n" for p in parts))
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(vo)], check=True)
    (out / "words.json").write_text(json.dumps(words, indent=1, ensure_ascii=False), encoding="utf-8")
    secs = offset / 1000
    print(json.dumps({"audio": str(out / args.audio_name), "words": str(out / "words.json"), "seconds": round(secs, 2),
                      "wpm": round(len(words) / (secs / 60), 1) if secs else None}))


if __name__ == "__main__":
    main()
