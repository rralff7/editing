// Date en toutes lettres pour le jour n du calendrier (ex. « mardi 1er décembre »).
import { START } from "../src/calendrier.mjs";
const JOURS_FR = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
export function dateOf(n) {
  const d = new Date(START + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n - 1);
  return `${JOURS_FR[d.getUTCDay()]} ${d.getUTCDate() === 1 ? "1er" : d.getUTCDate()} ${MOIS[d.getUTCMonth()]}`;
}
