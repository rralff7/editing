// Rend la vidéo motion design image par image (1080×1920, 30 i/s) puis l'encode en MP4 H.264 + AAC.
// Usage : node scripts/render-video.mjs            → vidéo complète
//         node scripts/render-video.mjs --stills 1.5,7.6   → quelques images de contrôle
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "out/video");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve(root, "src/reel01.html")).href);
await page.waitForSelector("body[data-ready]");
const { fps, duration, cues } = await page.evaluate(() => ({ fps: window.FPS, duration: window.DURATION, cues: window.CUES }));

const stillsArg = process.argv.indexOf("--stills");
if (stillsArg > 0) {
  const dir = process.argv[stillsArg + 2] || resolve(out, "stills");
  mkdirSync(dir, { recursive: true });
  for (const t of process.argv[stillsArg + 1].split(",").map(Number)) {
    await page.evaluate((f) => window.renderFrame(f), Math.round(t * fps));
    await page.screenshot({ path: resolve(dir, `t${t.toFixed(1)}.png`) });
  }
  console.log("Images de contrôle :", dir);
  await browser.close();
  process.exit(0);
}

// 1. Son : repères exportés depuis la timeline → synthèse
const cuesFile = resolve(out, "cues.json");
writeFileSync(cuesFile, JSON.stringify(cues, null, 1));
const wav = resolve(out, "sfx.wav");
execFileSync("python3", ["-I", resolve(root, "scripts/sfx.py"), cuesFile, String(duration), wav], { stdio: "inherit" });

// 2. Images → ffmpeg
const mp4 = resolve(out, "reel-j01-3-secondes.mp4");
const ff = spawn("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
  "-i", wav,
  "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-profile:v", "high",
  "-r", String(fps), "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", mp4,
], { stdio: ["pipe", "inherit", "inherit"] });

const total = Math.round(duration * fps);
for (let f = 0; f < total; f++) {
  await page.evaluate((i) => window.renderFrame(i), f);
  const buf = await page.screenshot({ type: "png" });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 90 === 0) console.log(`image ${f}/${total}`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log("Vidéo :", mp4);
