---
name: voiceover-timing
description: Produce the narration track for a voiceover-driven reel and per-word timestamps (words.json) that drive karaoke captions and word-cued animations. Covers ElevenLabs TTS with timestamps, aligning an existing recording with faster-whisper, and loudness mastering to -14 LUFS. Use when generating, recording, re-timing or mastering the voiceover for an explainer/paper-collage reel.
---

# Voiceover + word timings

Deliverables in the Remotion project's `public/`:
- `vo.mp3`: the mastered narration, one continuous take of every scene's `vo`
- `words.json`: `[{"text": "Stephen", "startMs": 0, "endMs": 310}, ...]` for the whole take

`build_timeline.py --words public/words.json` aligns these to the script, so recogniser spelling
never reaches the captions, and resolves every element cue.

## Voice direction (matches the reference)

- One narrator, confident documentary/sports-analyst tone, mid-low pitch, **no music bed**.
- Brisk: **~165–175 wpm** with short natural pauses at full stops (~0.3 s), none between clauses.
- Neutral, not hype. Emphasis comes from the words and the visuals, not shouting.

## Option A: ElevenLabs with timestamps (recommended)

```bash
export ELEVENLABS_API_KEY=...            # never paste keys into chat or commit them
python3 .claude/skills/voiceover-timing/scripts/tts_elevenlabs.py script.json \
  --voice-id <voice_id> --speed 1.06 --out-dir reels/<slug>/public      # -> vo_raw.mp3 + words.json
.claude/skills/voiceover-timing/scripts/master_vo.sh reels/<slug>/public/vo_raw.mp3 reels/<slug>/public/vo.mp3
```

- One request returns audio **and** character timings. The script turns them into words.json and chunks long scripts at scene boundaries with `previous_text`/`next_text` so the delivery stays continuous.
- Pick a voice with the ElevenLabs connector (`creative_list_voices`) or in the ElevenLabs app. Use the same voice for every episode of a series.
- Settings that work: stability 0.40–0.50, similarity 0.8, style 0.1–0.2, speed 1.03–1.10. The script prints the resulting wpm; re-run with a different `--speed` to land in range.
- **Cloud sessions**: the host is `api.elevenlabs.io`. Ask for the key with the credential tool (header `xi-api-key`) instead of an environment variable. The proxy then injects it and the script can run without `ELEVENLABS_API_KEY`.
- Generation spends the user's credits: generate once, listen to it, then fix only the scenes that need it.

## Option B: you already have audio (own recording, other TTS, ElevenLabs connector)

```bash
pip install faster-whisper
python3 .claude/skills/voiceover-timing/scripts/align_words.py public/vo_raw.mp3 --script script.json --out public/words.json
.claude/skills/voiceover-timing/scripts/master_vo.sh public/vo_raw.mp3 public/vo.mp3
```

- Read the script exactly as written. Ad-libs are tolerated (the aligner interpolates) but cues on words you skipped will land late.
- The first run downloads the Whisper model from `huggingface.co`. If that host is blocked, transcribe on a machine that can reach it, or use Option A.
- The ElevenLabs connector's `creative_generate_speech` returns audio without timestamps. Download it, then run this option on it.

## Mastering

`master_vo.sh` applies a high-pass at 80 Hz, a slight 6.5 kHz dip, 3:1 compression and two-pass loudnorm to
**−14 LUFS, −1.5 dBTP**. That gives an LRA of about 3 LU, which matches the reference (−14.1 LUFS / LRA 3.2). Timing is unchanged, so
words.json stays valid. Do not trim silence after timing: that shifts every word.

## Checks

- `python3 -c "import json;w=json.load(open('public/words.json'));print(len(w), w[-1]['endMs']/1000)"`: word count ≈ script word count, and duration as expected.
- After `build_timeline.py`, scrub Remotion Studio around 3–4 cues; elements should land on their word (±2 frames). If everything is consistently early or late, adjust `--cue-lead-ms`.
- Optional quiet bed: if you add music, keep it ≤ −28 LUFS under the voice and duck it. The reference has none.
