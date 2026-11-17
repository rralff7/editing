// Rend les couvertures de Reels (1080×1920) et les couvertures de stories à la une.
// Usage : node scripts/render-covers.mjs [@tonhandle]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const handle = process.argv[2] || "";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve(root, "src/covers.html")).href + (handle ? `?handle=${encodeURIComponent(handle)}` : ""));
await page.waitForSelector("body[data-ready]");
await page.evaluate(() => document.fonts.ready);
const els = await page.locator("[data-file]").all();
for (const el of els) {
  const file = resolve(root, "out", await el.getAttribute("data-file"));
  mkdirSync(dirname(file), { recursive: true });
  await el.screenshot({ path: file });
}
console.log(`${els.length} couvertures rendues`);
await browser.close();
