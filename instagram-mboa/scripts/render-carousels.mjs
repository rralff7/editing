// Rend chaque slide en PNG 1080×1350 (format portrait Instagram 4:5).
// Usage : node scripts/render-carousels.mjs [@tonhandle]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "out/carrousels");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
const handle = process.argv[2] || "";
await page.goto(pathToFileURL(resolve(root, "src/carousel.html")).href + (handle ? `?handle=${encodeURIComponent(handle)}` : ""));
await page.waitForSelector("body[data-ready]");

// Vérifie que rien ne déborde : contenu principal trop haut ou texte hors cadre.
const problems = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll(".slide").forEach((s) => {
    const m = s.querySelector("main");
    if (m.scrollHeight > m.clientHeight + 1) out.push(`${s.dataset.file}: main déborde de ${m.scrollHeight - m.clientHeight}px`);
    const sb = s.getBoundingClientRect();
    s.querySelectorAll("main *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > sb.right - 60 || r.left < sb.left + 60)) out.push(`${s.dataset.file}: <${el.tagName.toLowerCase()} class="${el.className}"> sort de la marge`);
    });
  });
  return [...new Set(out)];
});
if (problems.length) console.log("ATTENTION\n" + problems.join("\n"));

const slides = await page.locator(".slide").all();
for (const s of slides) {
  const file = resolve(outDir, await s.getAttribute("data-file"));
  mkdirSync(dirname(file), { recursive: true });
  await s.screenshot({ path: file });
}
console.log(`${slides.length} slides rendues dans ${outDir}`);
await browser.close();
