#!/usr/bin/env bash
# Pull a reference short-form video apart so its style can be reproduced.
#
#   breakdown.sh <url-or-file> <workdir>
#
# Produces in <workdir>:
#   ref.mp4, info.json        source + yt-dlp metadata (caption text, uploader, duration)
#   probe.txt                 resolution, fps, codecs, duration
#   sheets/sheet_NN.jpg       1 frame/second contact sheets, 30 s each, timestamped
#   cuts.txt, pacing.txt      hard-cut timestamps and average shot length
#   strips/strip_NN.jpg       15 fps strips around the first cuts (motion / transition style)
#   frames/f_<t>.jpg          720p stills at 10%, 30%, 50%, 70%, 90% for typography/colour
#   palette.txt               dominant colours (hex) across those stills
#   audio.txt                 loudness (LUFS/LRA/true peak) + silence-gap count
#   spectrum.png              spectrogram: dark vertical gaps = voice-only, no music bed
#   words.json                word timings, if faster-whisper and its model are available
#
# Needs: ffmpeg, ffprobe, python3 (+ Pillow); yt-dlp for URLs. Instagram needs the hosts
# www.instagram.com, i.instagram.com and the reel's scontent-*.cdninstagram.com CDN host.
set -euo pipefail
src="${1:?url or file}"
wd="${2:?workdir}"
mkdir -p "$wd"/{sheets,strips,frames}
cd "$wd"

if [[ -f "$src" ]]; then
  cp "$src" ref.mp4
else
  command -v yt-dlp >/dev/null || { echo "pip install yt-dlp" >&2; exit 3; }
  yt-dlp --no-warnings -J "$src" > info.json
  yt-dlp --no-warnings --load-info-json info.json -f "bv*+ba/b" --merge-output-format mp4 -o "ref.%(ext)s" >/dev/null
fi

ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels -of compact ref.mp4 | tee probe.txt
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 ref.mp4)
n=$(python3 -c "import math;print(math.ceil($dur/30))")

# 1 fps contact sheets
for ((i=0; i<n; i++)); do
  ss=$((i*30))
  ffmpeg -v error -y -ss "$ss" -t 30 -i ref.mp4 -vf "fps=1,scale=240:-2,drawtext=text='%{eif\:t+$ss\:d}s':x=6:y=6:fontsize=28:fontcolor=yellow:box=1:boxcolor=black@0.7,tile=10x3:padding=4:color=white" -frames:v 1 "sheets/sheet_$(printf %02d "$i").jpg"
done

# hard cuts + pacing
ffmpeg -v info -i ref.mp4 -vf "select='gt(scene,0.30)',showinfo" -an -f null - 2>&1 | grep -oE "pts_time:[0-9.]+" | cut -d: -f2 > cuts.txt || true
python3 - "$dur" <<'EOF' > pacing.txt
import sys
dur = float(sys.argv[1])
cuts = [float(x) for x in open("cuts.txt") if x.strip()]
shots = len(cuts) + 1
print(f"duration_s={dur:.1f} hard_cuts={len(cuts)} avg_shot_s={dur/shots:.2f}")
print("note: collage/motion-graphics reels build inside one layout, so few hard cuts + many element pops is normal")
EOF
cat pacing.txt

# motion strips around the first 4 cuts (or at 0 s if none)
i=0
for t in $(head -4 cuts.txt; [[ -s cuts.txt ]] || echo 0.5); do
  ss=$(python3 -c "print(max(0, $t-0.4))")
  ffmpeg -v error -y -ss "$ss" -t 1.2 -i ref.mp4 -vf "fps=15,scale=180:-2,tile=9x2:padding=2:color=white" -frames:v 1 "strips/strip_$(printf %02d "$i").jpg"
  i=$((i+1))
done

# stills + palette
for p in 10 30 50 70 90; do
  t=$(python3 -c "print(round($dur*$p/100,2))")
  ffmpeg -v error -y -ss "$t" -i ref.mp4 -frames:v 1 -vf scale=720:-2 "frames/f_$t.jpg"
done
python3 - <<'EOF' > palette.txt
import colorsys
from collections import Counter
from glob import glob
from PIL import Image
base, accent = Counter(), Counter()
for f in glob("frames/*.jpg"):
    px = Image.open(f).convert("RGB").resize((180, 320)).getdata()
    for r, g, b in px:
        h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        key = (r // 12 * 12, g // 12 * 12, b // 12 * 12)
        (accent if s > 0.45 and 0.15 < l < 0.85 else base)[key] += 1
tot = sum(base.values()) + sum(accent.values())
print("# base (backgrounds, paper, ink)")
for (r, g, b), c in base.most_common(6):
    print(f"#{r:02x}{g:02x}{b:02x}  {100*c/tot:5.1f}%")
print("# accents (saturated: blocks, highlights, stamps)")
for (r, g, b), c in accent.most_common(8):
    print(f"#{r:02x}{g:02x}{b:02x}  {100*c/tot:5.1f}%")
EOF
cat palette.txt

# audio
{
  ffmpeg -hide_banner -nostats -i ref.mp4 -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input (Integrated|True Peak|LRA)"
  gaps=$(ffmpeg -hide_banner -nostats -i ref.mp4 -af "silencedetect=n=-50dB:d=0.25" -f null - 2>&1 | grep -c silence_start || true)
  echo "gaps_below_-50dB=$gaps  (many gaps => voice-only track; ~0 => continuous music bed)"
} | tee audio.txt
ffmpeg -v error -y -i ref.mp4 -lavfi "showspectrumpic=s=1200x360:legend=0:scale=log" spectrum.png

# optional transcript with word timings
if python3 -c "import faster_whisper" 2>/dev/null; then
  ffmpeg -v error -y -i ref.mp4 -vn -ac 1 -ar 16000 audio.wav
  python3 - 2>/dev/null <<'EOF' || echo "transcription skipped: whisper model unavailable (allow huggingface.co, or transcribe elsewhere)"
import json
from faster_whisper import WhisperModel
m = WhisperModel("small.en", compute_type="int8")
segs, info = m.transcribe("audio.wav", word_timestamps=True)
words = [{"text": w.word.strip(), "startMs": round(w.start*1000), "endMs": round(w.end*1000)} for s in segs for w in (s.words or [])]
json.dump(words, open("words.json", "w"), indent=1)
open("transcript.txt", "w").write(" ".join(w["text"] for w in words))
print(f"words={len(words)} wpm={len(words)/(info.duration/60):.0f}")
EOF
fi
echo "done: $wd"
