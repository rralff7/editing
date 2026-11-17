// Rend la vidéo motion design image par image (1080×1920, 30 i/s), calée sur la voix off.
// Prérequis : python3 scripts/voix.py <modele> src/reel01-voix.json out/video/voix
// Sorties : reel-j01-3-secondes.mp4 (voix + effets) et reel-j01-3-secondes-sans-voix.mp4 (effets seuls).
// Usage : node scripts/render-video.mjs                         → vidéos complètes
//         node scripts/render-video.mjs --stills 1.5,7.6 [dir]  → quelques images de contrôle
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "out/video");
const voixDir = resolve(out, "voix");
mkdirSync(out, { recursive: true });

const duresFile = resolve(voixDir, "durees.json");
const voDur = existsSync(duresFile) ? JSON.parse(readFileSync(duresFile, "utf8")) : null;
if (!voDur) console.log("Pas de voix off trouvée : rendu avec des durées estimées, sans voix.");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
if (voDur) await page.addInitScript((d) => { window.VO_DUR = d; }, voDur);
await page.goto(pathToFileURL(resolve(root, "src/reel01.html")).href);
await page.waitForSelector("body[data-ready]");
const { fps, duration, cues, voAt } = await page.evaluate(() => ({ fps: window.FPS, duration: window.DURATION, cues: window.CUES, voAt: window.VO_AT }));
console.log(`Durée : ${duration} s`);

const stillsArg = process.argv.indexOf("--stills");
if (stillsArg > 0) {
  const dir = process.argv[stillsArg + 2] || resolve(out, "stills");
  mkdirSync(dir, { recursive: true });
  for (const t of process.argv[stillsArg + 1].split(",").map(Number)) {
    await page.evaluate((f) => window.renderFrame(f), Math.round(t * fps));
    await page.screenshot({ path: resolve(dir, `t${t.toFixed(1).padStart(4, "0")}.png`) });
  }
  console.log("Images de contrôle :", dir, JSON.stringify(voAt));
  await browser.close();
  process.exit(0);
}

// 1. Son : effets synthétisés, puis mix avec la voix
const cuesFile = resolve(out, "cues.json");
writeFileSync(cuesFile, JSON.stringify(cues, null, 1));
const sfxWav = resolve(out, "sfx.wav");
const py = (args) => execFileSync("python3", ["-I", resolve(root, "scripts/sfx.py"), ...args], { stdio: "inherit" });
py([cuesFile, String(duration), sfxWav]);
let mixWav = null;
if (voDur) {
  const placements = Object.entries(voAt).map(([id, t]) => ({ file: resolve(voixDir, `${id}.wav`), t }));
  const placeFile = resolve(out, "voix-placement.json");
  writeFileSync(placeFile, JSON.stringify(placements, null, 1));
  mixWav = resolve(out, "mix.wav");
  py([cuesFile, String(duration), mixWav, placeFile]);
}

// 2. Images → vidéo muette intermédiaire
const silent = resolve(out, ".video-seule.mp4");
const ff = spawn("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-profile:v", "high", "-r", String(fps), silent,
], { stdio: ["pipe", "inherit", "inherit"] });
const total = Math.round(duration * fps);
for (let f = 0; f < total; f++) {
  await page.evaluate((i) => window.renderFrame(i), f);
  const buf = await page.screenshot({ type: "png" });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 150 === 0) console.log(`image ${f}/${total}`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();

// 3. Assemblage : volume normalisé pour les réseaux sociaux (-14 LUFS)
const mux = (wav, mp4) => execFileSync("ffmpeg", [
  "-y", "-loglevel", "error", "-i", silent, "-i", wav,
  "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000",
  "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", mp4,
], { stdio: "inherit" });
if (mixWav) {
  mux(mixWav, resolve(out, "reel-j01-3-secondes.mp4"));
  mux(sfxWav, resolve(out, "reel-j01-3-secondes-sans-voix.mp4"));
} else {
  mux(sfxWav, resolve(out, "reel-j01-3-secondes.mp4"));
}
console.log("Vidéos prêtes dans", out);
