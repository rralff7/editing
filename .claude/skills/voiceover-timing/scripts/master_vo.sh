#!/usr/bin/env bash
# Master a narration track for vertical social video, matching the reference:
# voice only, tight dynamics (LRA ~3 LU), -14 LUFS integrated, -1.5 dBTP peak.
# Timing is unchanged, so words.json stays valid.
#
#   master_vo.sh public/vo_raw.mp3 public/vo.mp3
set -euo pipefail
in="${1:?input audio}"
out="${2:?output audio}"

# Fold to mono then dual-mono stereo first: TTS is usually mono, and the video's audio track is
# stereo. Measuring loudness on mono and shipping stereo would come out ~3 LU too loud.
# Then: high-pass rumble, gentle de-ess-ish presence, light compression, 2-pass loudnorm.
chain="aformat=channel_layouts=mono,aformat=channel_layouts=stereo,highpass=f=80,equalizer=f=6500:t=q:w=2:g=-2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2"

stats=$(ffmpeg -hide_banner -nostats -i "$in" -af "$chain,loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
mi=$(echo "$stats" | python3 -c 'import sys,json;d=json.load(sys.stdin);print(d["input_i"],d["input_tp"],d["input_lra"],d["input_thresh"],d["target_offset"])')
read -r I TP LRA TH OFF <<<"$mi"

ffmpeg -hide_banner -v error -y -i "$in" \
  -af "$chain,loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true,aresample=48000" \
  -c:a libmp3lame -b:a 192k "$out"

ffmpeg -hide_banner -nostats -i "$out" -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input (Integrated|True Peak|LRA)"
