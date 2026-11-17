"""Synthétise le design sonore de la vidéo à partir d'une liste de repères (cues.json).
Tous les sons sont générés ici : aucun droit d'auteur.
Usage : python3 scripts/sfx.py cues.json duree_secondes sortie.wav [voix.json]
voix.json (optionnel) : [{"file": "v1.wav", "t": 0.2}, ...] → la voix est mixée par-dessus,
et les effets baissent automatiquement quand la voix parle.
"""
import json, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def lowpass(x, cutoff):
    """Passe-bas à un pôle, fréquence de coupure variable (tableau ou scalaire)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def tick():
    n = int(0.05 * SR); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 1900 * t) * env_exp(n, 0.008) + 0.6 * np.sin(2 * np.pi * 950 * t) * env_exp(n, 0.012)
    click = rng.standard_normal(n) * env_exp(n, 0.0015)
    return 0.55 * (body + 0.5 * click)


def pop():
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = 420 + 650 * (1 - np.exp(-t / 0.02))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return 0.5 * np.sin(ph) * env_exp(n, 0.035) * np.minimum(1, t / 0.002)


def whoosh(d=0.5, lo=250, hi=4200):
    n = int(d * SR); t = np.arange(n) / SR
    shape = np.sin(np.pi * t / d) ** 2
    x = lowpass(rng.standard_normal(n), lo + (hi - lo) * shape)
    x = lowpass(x - lowpass(x, 120), 9000)  # retire le grave sourd
    return 0.9 * x * shape / (np.abs(x).max() + 1e-9)


def swipe():
    return 0.7 * whoosh(0.3, 900, 6500)


def key():
    n = int(0.03 * SR)
    x = rng.standard_normal(n) * env_exp(n, 0.0025)
    x = np.diff(np.concatenate([[0], x]))  # passe-haut : clic sec
    t = np.arange(n) / SR
    return 0.22 * (x / (np.abs(x).max() + 1e-9) + 0.4 * np.sin(2 * np.pi * 2400 * t) * env_exp(n, 0.004)) * rng.uniform(0.6, 1.0)


def thud():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t / 0.06)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.13)
    hit = lowpass(rng.standard_normal(n) * env_exp(n, 0.006), 2500)
    return np.tanh(1.6 * (body + 1.5 * hit)) * 0.85


def ding():
    n = int(1.3 * SR); t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * 1318.5 * t) + 0.35 * np.sin(2 * np.pi * 2637 * t) * env_exp(n, 0.15)
         + 0.12 * np.sin(2 * np.pi * 3955.5 * t) * env_exp(n, 0.08))
    return 0.32 * x * env_exp(n, 0.38) * np.minimum(1, t / 0.003)


def buzz():
    n = int(0.32 * SR); t = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * 146 * t)) + np.sign(np.sin(2 * np.pi * 155 * t))
    return 0.22 * lowpass(x, 1400) * env_exp(n, 0.12) * np.minimum(1, t / 0.004)


SOUNDS = {"tick": tick, "pop": pop, "whoosh": whoosh, "swipe": swipe, "key": key, "thud": thud, "ding": ding, "buzz": buzz}
PAN = {"whoosh": (0.7, 1.0), "swipe": (1.0, 0.75), "key": (0.9, 1.0)}


def load_mono48(path):
    with wave.open(path) as w:
        assert w.getframerate() == SR, path
        x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(float) / 32768
        if w.getnchannels() == 2:
            x = x.reshape(-1, 2).mean(axis=1)
    return x


def main():
    cues = json.load(open(sys.argv[1]))
    dur = float(sys.argv[2])
    n = int(dur * SR)
    fx = np.zeros((n + SR, 2))
    for c in cues:
        s = SOUNDS[c["type"]]() * c.get("gain", 1)
        i = int(c["t"] * SR)
        l, r = PAN.get(c["type"], (1.0, 1.0))
        fx[i:i + len(s), 0] += s[: len(fx) - i] * l
        fx[i:i + len(s), 1] += s[: len(fx) - i] * r
    fx = fx[:n]
    if len(sys.argv) > 4:
        voice = np.zeros(n)
        for v in json.load(open(sys.argv[4])):
            x = load_mono48(v["file"])
            i = int(v["t"] * SR)
            voice[i:i + len(x)] += x[: n - i]
        voice *= 0.5 / (np.abs(voice).max() + 1e-9)
        env = np.convolve(np.abs(voice), np.ones(2400) / 2400, mode="same")
        duck = 1 - 0.55 * np.clip(env / 0.05, 0, 1)
        fx *= 0.32 / (np.abs(fx).max() + 1e-9)
        out = fx * duck[:, None] + voice[:, None]
    else:
        out = fx
    out *= 0.89 / np.abs(out).max()
    pcm = (out * 32767).astype("<i2")
    with wave.open(sys.argv[3], "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    main()
