// Génère CALENDRIER.md à partir de src/calendrier.mjs.
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { STRATEGIE, PROFIL, REGLES, DM_SCRIPT, VO_J1, JOURS } from "../src/calendrier.mjs";
import { dateOf } from "./dates.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const L = [];
L.push("# Calendrier de contenu Instagram · 14 jours", "");
L.push(`Du ${dateOf(1)} au ${dateOf(14)} 2026. Heures du Cameroun (WAT).`, "");
L.push("## Stratégie", "", `**Positionnement.** ${STRATEGIE.positionnement}`, "", `**Cible.** ${STRATEGIE.cible}`, "");
L.push("**Piliers**", "", ...STRATEGIE.piliers.map(([a, b]) => `- **${a}** : ${b}`), "");
L.push("**Ce qu'on reprend du style Kallaway**", "", ...STRATEGIE.emprunts.map(([a, b]) => `- **${a}.** ${b}`), "");

L.push("## Vue d'ensemble", "", "| Jour | Date | Format | Titre | Heure | Statut |", "|---|---|---|---|---|---|");
for (const j of JOURS) L.push(`| ${j.n} | ${dateOf(j.n)} | ${j.format} | ${j.titre} | ${j.heure} | ${j.statut === "pret" ? "**Prêt à poster**" : "À tourner"} |`);
L.push("");

for (const j of JOURS) {
  L.push(`## Jour ${j.n} · ${dateOf(j.n)} · ${j.titre}`, "");
  L.push(`**${j.format}** · ${j.pilier} · Objectif : ${j.objectif} · Publier à **${j.heure}** · ${j.statut === "pret" ? "✅ Prêt à poster" : "🎬 À tourner"}`, "");
  const a = j.assets;
  if (a.video) L.push(`Fichier : \`${a.video}\``);
  if (a.carousel) L.push(`Images : \`${a.carousel}/01.png\` … (dans l'ordre)`);
  if (a.cover) L.push(`Couverture : \`${a.cover}\``);
  L.push("");
  L.push("**Hook**", "");
  if (j.hook.dit) L.push(`- Tu dis : ${j.hook.dit}`);
  L.push(`- Texte à l'écran : ${j.hook.ecran}`, `- Visuel : ${j.hook.visuel}`, "");
  L.push(j.type === "Carrousel" ? "**Déroulé**" : "**Script**", "", ...j.beats.map(([t, b]) => `- **${t}** · ${b}`), "");
  L.push("**Légende**", "", "```", j.legende, "", j.hashtags, "```", "");
  L.push(`**Story du jour.** ${j.story}`, "", `**Production.** ${j.prod}`, "", `**Technique.** ${j.inspi}`, "");
}

L.push("## Ton profil", "", `- **Nom** : ${PROFIL.nom} (${PROFIL.nomNote})`, "- **Bio, option A** :", "```", PROFIL.bios[0], "```", "- **Bio, option B** :", "```", PROFIL.bios[1], "```");
L.push(`- **Lien** : ${PROFIL.lien}`, `- **Photo** : ${PROFIL.photo}`, "- **Stories à la une** (couvertures dans `out/highlights/`) :", ...PROFIL.alaune.map(([a, f, b]) => `  - ${a} (\`${f}\`) : ${b}`));
L.push("- **Posts épinglés** :", ...PROFIL.epingles.map((e) => `  - ${e}`), "");
L.push("## Règles du jeu", "", ...REGLES.map(([a, b]) => `- **${a}.** ${b}`), "");
L.push("## Message à envoyer à ceux qui commentent « SCRIPT » (jour 9)", "", "```", DM_SCRIPT, "```", "");
L.push("## Voix off optionnelle pour la vidéo du jour 1", "", "Enregistre-la avec ta propre voix dans CapCut, par-dessus la vidéo.", "", ...VO_J1.map(([t, v]) => `- **${t}** · ${v}`), "");

writeFileSync(resolve(root, "CALENDRIER.md"), L.join("\n"));
console.log("CALENDRIER.md écrit");
