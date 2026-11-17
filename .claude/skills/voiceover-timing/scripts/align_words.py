#!/usr/bin/env python3
"""
Word timings for a voiceover you already have (your own recording, or TTS that returned no
timestamps). Runs faster-whisper with word_timestamps and writes words.json for
build_timeline.py --words. build_timeline aligns these to the script text, so recogniser
spelling mistakes do not reach the captions.

  pip install faster-whisper
  python align_words.py public/vo.mp3 --script script.json --out public/words.json

The first run downloads the model from huggingface.co (~250 MB for small.en).
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("audio")
    ap.add_argument("--script", help="script.json; its text primes the recogniser with names and terms")
    ap.add_argument("--out", default="public/words.json")
    ap.add_argument("--model", default="small.en", help="tiny.en | base.en | small.en | medium.en | large-v3")
    ap.add_argument("--lang", default="en")
    args = ap.parse_args()

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit("pip install faster-whisper")

    prompt = None
    if args.script:
        script = json.loads(Path(args.script).read_text(encoding="utf-8"))
        prompt = " ".join(s.get("vo", "") for s in script.get("scenes", []))[-900:]

    model = WhisperModel(args.model, device="auto", compute_type="int8")
    segments, info = model.transcribe(
        args.audio,
        language=args.lang,
        word_timestamps=True,
        initial_prompt=prompt,
        vad_filter=False,
        beam_size=5,
    )
    words = []
    for seg in segments:
        for w in seg.words or []:
            t = w.word.strip()
            if t:
                words.append({"text": t, "startMs": round(w.start * 1000), "endMs": round(w.end * 1000)})
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps(words, indent=1, ensure_ascii=False), encoding="utf-8")
    secs = info.duration
    print(json.dumps({"words": len(words), "out": args.out, "seconds": round(secs, 2), "wpm": round(len(words) / (secs / 60), 1) if secs else None}))


if __name__ == "__main__":
    main()
