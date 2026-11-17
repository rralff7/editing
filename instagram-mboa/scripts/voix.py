"""Génère la voix off française avec Kokoro (open source, Apache 2.0, gratuit, hors ligne).
Une phrase = un fichier WAV 48 kHz, silences de début et de fin retirés.
Écrit aussi durees.json ({id: secondes}) pour caler l'animation sur la voix.

Installation : pip install kokoro-onnx soundfile
Modèle (≈350 Mo, une seule fois) :
  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
Usage : python3 scripts/voix.py <dossier_du_modele> src/reel01-voix.json out/video/voix
"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

VOICE, SPEED = "ff_siwis", 1.08


def trim(x, sr, thr=0.012):
    env = np.convolve(np.abs(x), np.ones(240) / 240, mode="same")
    idx = np.where(env > thr)[0]
    if not len(idx):
        return x
    a = max(0, idx[0] - int(0.03 * sr))
    b = min(len(x), idx[-1] + int(0.09 * sr))
    return x[a:b]


def main():
    model_dir, lines_file, out_dir = sys.argv[1:4]
    os.makedirs(out_dir, exist_ok=True)
    k = Kokoro(os.path.join(model_dir, "kokoro-v1.0.onnx"), os.path.join(model_dir, "voices-v1.0.bin"))
    durations = {}
    for line in json.load(open(lines_file, encoding="utf-8")):
        text = line["text"].replace("«", "").replace("»", "")
        samples, sr = k.create(text, voice=VOICE, speed=SPEED, lang="fr-fr")
        samples = trim(np.asarray(samples, dtype=np.float32), sr)
        tmp = os.path.join(out_dir, line["id"] + ".24k.wav")
        out = os.path.join(out_dir, line["id"] + ".wav")
        sf.write(tmp, samples, sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-ar", "48000", "-ac", "1", out], check=True)
        os.remove(tmp)
        durations[line["id"]] = round(len(samples) / sr, 3)
        print(f'{line["id"]:4s} {durations[line["id"]]:5.2f} s  {line["text"]}')
    json.dump(durations, open(os.path.join(out_dir, "durees.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
