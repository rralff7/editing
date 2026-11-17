// Assemble la page du kit (src/kit-page.html + données du calendrier) dans le dossier donné.
// Usage : node scripts/build-page.mjs <dossier-de-sortie>
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { STRATEGIE, PROFIL, REGLES, DM_SCRIPT, VO_J1, JOURS } from "../src/calendrier.mjs";
import { dateOf } from "./dates.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(process.argv[2]);
const data = {
  strategie: STRATEGIE, profil: PROFIL, regles: REGLES, dm: DM_SCRIPT, vo: VO_J1,
  jours: JOURS.map((j) => ({ ...j, date: dateOf(j.n) })),
};
const html = readFileSync(resolve(root, "src/kit-page.html"), "utf8").replace("__DATA__", JSON.stringify(data).replace(/</g, "\\u003c"));
writeFileSync(resolve(out, "kit-instagram-mboa.html"), html);
console.log("Page écrite :", resolve(out, "kit-instagram-mboa.html"));
