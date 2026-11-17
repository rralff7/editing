// Source unique du calendrier : sert à générer CALENDRIER.md et la page du kit.
// Heures en heure du Cameroun (WAT, UTC+1).

export const START = "2026-11-23"; // lundi

export const STRATEGIE = {
  positionnement: "Le marketing vidéo expliqué simplement pour les entrepreneurs du Cameroun : comment transformer des vues en messages WhatsApp et en ventes.",
  cible: "Commerçants, prestataires et petites marques de Douala, Yaoundé et d'ailleurs au Mboa qui vendent déjà sur WhatsApp, Instagram ou Facebook, mais dont les vidéos plafonnent.",
  piliers: [
    ["Hooks & rétention", "Les 3 premières secondes, les relances, le rythme. Le cœur du style Kallaway."],
    ["Système & formats", "Comment produire tous les jours avec un téléphone, des formats qu'on répète."],
    ["Décryptages business", "Les « jeudis business » : une histoire d'entreprise du Mboa et la leçon à en tirer."],
    ["Vente & WhatsApp", "Prix, DM, appels à l'action : passer de la vue au client."],
  ],
  emprunts: [
    ["Grosse affirmation + détail concret", "Chaque hook pose une idée forte, puis une précision (un prix, un lieu, un chiffre) qui la rend crédible."],
    ["Relance toutes les 5 secondes", "Nouveau plan, nouveau texte, nouveau son : l'attention est relancée en permanence."],
    ["Cadres visuels", "Les méthodes sont présentées comme des étapes numérotées qu'on peut enregistrer et réutiliser."],
    ["Séries numérotées", "Partie 1, Partie 2, les jeudis business : chaque épisode donne une raison de s'abonner."],
    ["Décryptage d'histoires business", "Raconter ce qui est arrivé à une entreprise ou à un secteur, puis en tirer une leçon."],
    ["Esthétique sobre et premium", "Fond sombre, une seule couleur d'accent, typographie forte, aucun effet gadget."],
  ],
};

export const PROFIL = {
  nom: "[Ton prénom] | Marketing vidéo Cameroun",
  nomNote: "Le champ « Nom » est indexé par la recherche Instagram : mets-y ton métier, pas seulement ton prénom.",
  bios: [
    "Je t'aide à vendre avec la vidéo au Cameroun\nHooks · Formats · WhatsApp\nUn nouveau Reel chaque jour ↓",
    "Vidéo courte + WhatsApp = clients\nMéthodes simples pour les business du Mboa\nDouala · Yaoundé\nÉcris-moi ↓",
  ],
  lien: "Ton lien WhatsApp (wa.me/237XXXXXXXXX) avec un message prérempli, ou une page qui regroupe WhatsApp et tes offres.",
  photo: "Portrait net, cadré épaules, fond uni ou flou, regard caméra. Le même partout (Instagram, WhatsApp, TikTok).",
  alaune: [
    ["Commence ici", "commence-ici.png", "Qui tu es, ce que tu fais, pour qui. 3 stories maximum."],
    ["Hooks", "hooks.png", "Les Reels et carrousels sur les 3 premières secondes."],
    ["Avant / Après", "avant-apres.png", "Les vidéos refaites pour des commerçants (jour 10 et suivants)."],
    ["Avis", "avis.png", "Captures de retours clients et d'abonnés (avec leur accord)."],
    ["Contact", "contact.png", "Comment te joindre, tes offres, tes tarifs."],
  ],
  epingles: ["Jour 1 · Reel « Ta vidéo a 3 secondes pour survivre »", "Jour 2 · Carrousel « 7 hooks qui arrêtent le scroll »", "Jour 10 · Reel Avant / Après (ta meilleure preuve)"],
};

export const REGLES = [
  ["Les 30 premières minutes", "Reste disponible juste après chaque publication : réponds à chaque commentaire par une question pour relancer la discussion."],
  ["Réponds en vidéo", "Quand un commentaire pose une bonne question, réponds-y avec un Reel (option « Répondre avec un Reel »). C'est une idée gratuite et un signal fort."],
  ["5 hashtags maximum", "Instagram limite désormais les hashtags par publication. Choisis-en 3 à 5 précis, et mets tes mots-clés dans la première ligne de la légende : la recherche Instagram les lit."],
  ["Son tendance à bas volume", "Ajoute un son tendance de la bibliothèque Instagram, volume 5 à 15 % sous ta voix. Pour la vidéo motion design, la voix et les effets sont déjà mixés : la musique passe dessous."],
  ["Collabs locales", "Tague les commerçants que tu filmes et propose la fonction Collab : la vidéo s'affiche aussi chez eux."],
  ["Recycle partout", "Chaque Reel part aussi en statut WhatsApp, sur TikTok et sur Facebook. Exporte sans filigrane."],
  ["Ce qu'on mesure", "Dans les statistiques de chaque Reel : vues, taux de passage dans les 3 premières secondes, partages, enregistrements, abonnés gagnés. Le jour 14, tu compares."],
];

export const DM_SCRIPT = `Voici ton modèle de script (30 secondes) :

HOOK (0–3 s) : ______
→ Une phrase qui dit le sujet + une raison de rester.

PROBLÈME (3–10 s) : Tu… ? ______
→ La situation que ton client vit.

PREUVE (10–20 s) : Regarde / Mes clientes disent… ______
→ Le produit en action, un avis client.

OFFRE (20–27 s) : ______
→ Prix + délai + livraison. Toujours le prix.

APPEL (27–30 s) : Écris « ___ » sur WhatsApp.

Envoie-moi ta version, je te fais un retour.`;

export const VO_J1 = [
  ["0–3 s", "Ta vidéo a trois secondes pour survivre."],
  ["3–10 s", "Et la plupart des vidéos commencent comme ça : « Bonjour à tous, bienvenue sur ma page… » Résultat ? Scrollé."],
  ["10–14 s", "Le problème, ce n'est pas ton produit. C'est ta première phrase."],
  ["15–25 s", "La formule tient en trois temps. Un : le sujet. Dis de quoi tu parles, tout de suite. Deux : la tension. Ajoute un « mais ». Trois : la promesse. Dis ce qu'on gagne à rester."],
  ["25–39 s", "Exemple. Avant : « Bonjour à tous, aujourd'hui je vous présente mes nouveaux pagnes. » Après : « Ce pagne coûte huit mille francs, à Mboppi… mais ce n'est pas pour ça que mes clientes reviennent. Regarde la finition. » Même produit. Autre première phrase."],
  ["39–47 s", "Enregistre cette vidéo. La partie deux, sur les hooks visuels, arrive lundi. Abonne-toi pour ne pas la rater."],
];

const R = "Reel", C = "Carrousel";

export const JOURS = [
  {
    n: 1, type: R, format: "Reel motion design", pilier: "Hooks & rétention", statut: "pret", heure: "19h30",
    titre: "Ta vidéo a 3 secondes pour survivre", objectif: "Vues + enregistrements",
    assets: { video: "out/video/reel-j01-3-secondes.mp4", cover: "out/reels/cover-j01.png" },
    hook: { dit: "Ta vidéo a trois secondes pour survivre. (Voix off incluse.)", ecran: "Ta vidéo a 3 secondes pour survivre.", visuel: "Un compte à rebours 3, 2, 1 dans un cercle qui se vide." },
    beats: [
      ["0–3 s", "Hook : « Ta vidéo a 3 secondes pour survivre » + compte à rebours."],
      ["3–10 s", "Un téléphone affiche « Bonjour à tous, bienvenue sur ma page… » : le pouce scrolle, tampon « SCROLLÉ »."],
      ["10–14 s", "Bascule : « Le problème n'est pas ton produit. C'est ta première phrase. »"],
      ["15–25 s", "La formule en 3 cartes : Sujet → Tension → Promesse."],
      ["25–39 s", "Avant / Après avec la vendeuse de pagnes de Mboppi."],
      ["39–47 s", "Appel : enregistre + partie 2 lundi. Fin sur fond vide pour que la vidéo boucle."],
    ],
    legende: "Ta vidéo a 3 secondes pour convaincre. Après, c'est le scroll.\n\nLa formule pour ta première phrase :\n1. Sujet : dis de quoi tu parles, tout de suite.\n2. Tension : ajoute un « mais ».\n3. Promesse : dis ce qu'on gagne à rester.\n\nExemple : « Ce pagne coûte 8 000 FCFA à Mboppi… mais ce n'est pas pour ça que mes clientes reviennent. Regarde la finition. »\n\nEnregistre cette vidéo pour ton prochain tournage. Partie 2 (les hooks visuels) lundi prochain.",
    hashtags: "#marketingcameroun #entrepreneurcamerounais #douala #reelsinstagram #vendreenligne",
    story: "Sondage : « Ta dernière vidéo commençait par « Bonjour à tous » ? Oui / Non », puis partage du Reel.",
    prod: "Vidéo fournie (47 s) en deux versions : avec voix off française + effets sonores, ou effets seuls si tu veux poser ta propre voix. Ajoute une musique tendance à 5–10 % du volume. Couverture : cover-j01.png. Épingle ce Reel en haut du profil.",
    inspi: "Cadre en 3 étapes animé + boucle finale qui relance la vidéo (plus de revisionnages).",
  },
  {
    n: 2, type: C, format: "Carrousel 11 slides", pilier: "Hooks & rétention", statut: "pret", heure: "12h30",
    titre: "7 hooks qui arrêtent le scroll", objectif: "Enregistrements + partages",
    assets: { carousel: "out/carrousels/c1-hooks" },
    hook: { ecran: "7 hooks qui arrêtent le scroll", visuel: "Un grand 7 doré sur fond indigo." },
    beats: [
      ["Slide 1", "Couverture."], ["Slide 2", "Tu as 3 secondes. Pas 30."], ["Slides 3–9", "Les 7 hooks : modèle + exemple camerounais + pourquoi ça marche."],
      ["Slide 10", "Le test avant de poster (4 cases)."], ["Slide 11", "Appel : enregistre, envoie, abonne-toi, commente le numéro."],
    ],
    legende: "7 premières phrases à copier pour ton business (exemples 100 % Kamer).\n\nGarde ce post : la prochaine fois que tu ne sais pas comment commencer ta vidéo, ouvre-le et choisis-en un.\n\nMon préféré pour les commerçants : le n°1, le choc des prix.\n\nLequel tu testes cette semaine ? Écris son numéro en commentaire.",
    hashtags: "#hooks #marketingdigital #entrepreneurcamerounais #cameroun #créateurdecontenu",
    story: "Quiz : « Quel hook marche le mieux pour une boutique ? » 4 choix, puis partage du carrousel.",
    prod: "11 images prêtes (1080×1350). Ajoute une musique au carrousel, Instagram le permet.",
    inspi: "Contenu « à enregistrer » : des modèles réutilisables, numérotés.",
  },
  {
    n: 3, type: R, format: "Reel face caméra + plans de coupe", pilier: "Vente & WhatsApp", statut: "tourner", heure: "19h30",
    titre: "Arrête de filmer ton produit", objectif: "Vues",
    assets: { cover: "out/reels/cover-j03.png" },
    hook: { dit: "Arrête de filmer ton produit. Filme ça à la place.", ecran: "ARRÊTE DE FILMER TON PRODUIT.", visuel: "Plan fixe d'un produit posé sur une table ; tu mets la main devant l'objectif, coupe sur un gros plan de mains au travail." },
    beats: [
      ["0–3 s", "Hook + main devant la caméra → coupe."],
      ["3–10 s", "« Un produit posé sur une table, ça ne retient personne. Ce qui retient : le mouvement, le son, les mains. »"],
      ["10–22 s", "3 plans rapides avec le son réel : la couturière qui coupe le tissu, le poisson braisé qui grésille, les tresses en accéléré."],
      ["22–28 s", "« Les gens n'achètent pas un objet. Ils achètent le savoir-faire qu'ils voient. »"],
      ["28–32 s", "Appel : « Demain, filme tes mains au travail et tague-moi. »"],
    ],
    legende: "Ton produit posé sur une table ne vendra jamais autant que tes mains au travail.\n\nCe qui arrête le scroll :\n→ le mouvement\n→ le son réel (ciseaux, grésillement, tresses)\n→ le geste d'expert\n\nLes gens n'achètent pas un objet. Ils achètent le savoir-faire qu'ils voient.\n\nDéfi : demain, filme 10 secondes de tes mains au travail. Tague-moi, je partage les meilleures en story.",
    hashtags: "#marketingcameroun #petitbusiness #douala #yaounde #vendresurinstagram",
    story: "Coulisses du tournage + boîte à questions : « Tu vends quoi ? Je te dis quoi filmer. »",
    prod: "Filme les 3 plans de coupe chez des commerçants de ton quartier, avec leur accord. Tague-les : ils repartageront.",
    inspi: "Hook visuel + affirmation forte, puis exemples rapides pour garder le rythme.",
  },
  {
    n: 4, type: R, format: "Reel histoire (fond vert)", pilier: "Décryptages business", statut: "tourner", heure: "19h30",
    titre: "Où sont passés les call-box ?", objectif: "Partages + abonnés",
    assets: { cover: "out/reels/cover-j04.png" },
    hook: { dit: "Il y avait un call-box à chaque carrefour. Où sont-ils passés ? Et ce qui leur est arrivé peut arriver à ton business.", ecran: "OÙ SONT PASSÉS LES CALL-BOX ?", visuel: "Toi devant une photo de call-box (parasol, table, téléphones), avec le fond vert de CapCut." },
    beats: [
      ["0–4 s", "Hook + relance : « ce qui leur est arrivé peut arriver à ton business »."],
      ["4–15 s", "L'histoire : le call-box, c'était le téléphone du quartier. Puis les téléphones et les forfaits sont devenus abordables."],
      ["15–22 s", "Le retournement : beaucoup se sont adaptés (crédit, transfert d'argent, Mobile Money)."],
      ["22–30 s", "La leçon : ce n'est pas le besoin qui disparaît, c'est la façon de vendre. Aujourd'hui, l'attention est dans la vidéo courte."],
      ["30–33 s", "Appel : « Chaque jeudi, une histoire de business du Mboa. Abonne-toi. »"],
    ],
    legende: "Il y avait un call-box à chaque carrefour. Puis presque plus rien.\n\nCe n'est pas le besoin qui a disparu : on téléphone plus que jamais. C'est la façon de vendre qui a changé. Ceux qui se sont adaptés sont encore là.\n\nAujourd'hui, l'attention est dans la vidéo courte. Si ton business n'y est pas, tu prends le même chemin.\n\nChaque jeudi : une histoire de business du Mboa. Abonne-toi pour la prochaine.",
    hashtags: "#businesscameroun #entrepreneuriat #cameroun #237 #histoire",
    story: "Sondage : « Tu te souviens du call-box de ton quartier ? » + une photo d'époque si tu en as une.",
    prod: "Vérifie l'histoire avec ce que tu as vu toi-même. Encore mieux : interviewe 30 secondes un ancien tenancier de call-box. Ne donne aucun chiffre que tu ne peux pas sourcer.",
    inspi: "Décryptage d'histoire business : grosse affirmation, détail concret, puis la leçon. Lance la série « jeudis business ».",
  },
  {
    n: 5, type: C, format: "Carrousel 10 slides", pilier: "Système & formats", statut: "pret", heure: "12h30",
    titre: "Format > idée : 6 formats qui marchent au Mboa", objectif: "Enregistrements",
    assets: { carousel: "out/carrousels/c2-formats" },
    hook: { ecran: "Format > idée", visuel: "La grille des 6 formats en aperçu." },
    beats: [
      ["Slide 1", "Couverture."], ["Slide 2", "Une idée = 1 vidéo. Un format = 50 vidéos."], ["Slides 3–8", "6 formats : structure, exemple local, objectif."],
      ["Slide 9", "Ta semaine type."], ["Slide 10", "Appel : choisis un format, poste-le 3 fois."],
    ],
    legende: "Tu n'as pas un problème d'idées. Tu as un problème de format.\n\nUne idée = 1 vidéo. Un format = 50 vidéos.\n\nCes 6 formats marchent pour une boutique, un resto, un salon ou un service. Choisis-en un et poste-le 3 fois cette semaine.\n\nLequel tu prends ? Écris son numéro en commentaire.",
    hashtags: "#stratégiedecontenu #marketingdigital #entrepreneurcamerounais #reelsinstagram #cameroun",
    story: "Sondage : « Tu manques plutôt d'idées ou de temps ? » Réponds aux résultats le lendemain.",
    prod: "10 images prêtes (1080×1350).",
    inspi: "« Le format avant l'idée » : penser en structures répétables.",
  },
  {
    n: 6, type: R, format: "Reel sketch humour", pilier: "Vente & WhatsApp", statut: "tourner", heure: "13h00",
    titre: "Le client qui écrit « Prix ? »", objectif: "Partages + commentaires",
    assets: { cover: "out/reels/cover-j06.png" },
    hook: { dit: "(Son de notification.)", ecran: "POV : tu vends sur Instagram au Cameroun", visuel: "Gros plan sur l'écran : un message « Prix ? »." },
    beats: [
      ["0–3 s", "Notification. Message : « Prix ? ». Tu souris et tu réponds vite."],
      ["3–8 s", "Tu envoies le prix, les photos, la livraison, les couleurs. Le client : « Vu »."],
      ["8–12 s", "Deux jours plus tard : « Dernier prix ? ». Tu fais une remise. « Vu »."],
      ["12–18 s", "Une semaine plus tard : « C'est toujours dispo ? ». Tu fixes la caméra."],
      ["18–26 s", "Toi, sérieux : « Affiche ton prix dans la vidéo et dans la légende. Tu attires ceux qui ont le budget. Les curieux se filtrent tout seuls. »"],
      ["26–30 s", "Appel : « Commente PRIX si tu vis ça chaque semaine. »"],
    ],
    legende: "Celui qui écrit « Prix ? » puis disparaît… tout vendeur au Cameroun le connaît.\n\nLa vraie leçon : affiche ton prix. Dans la vidéo, dans la légende, dans tes stories.\n→ tu attires ceux qui ont le budget\n→ tu passes moins de temps avec les curieux\n→ tu inspires confiance\n\nCommente « PRIX » si tu vis ça chaque semaine. Et tague le vendeur qui doit voir ça.",
    hashtags: "#vendreenligne #humour #douala #entrepreneurcamerounais #237",
    story: "Curseur emoji : « Combien de « Prix ? » sans suite tu reçois par semaine ? »",
    prod: "Tu joues les deux rôles. Change de haut pour le client. Filme les messages en vrai sur ton téléphone (faux contact), pas en capture.",
    inspi: "Contenu qu'on reconnaît (donc qu'on partage) avec une vraie leçon à la fin.",
  },
  {
    n: 7, type: R, format: "Reel face caméra + écran", pilier: "Système & formats", statut: "tourner", heure: "18h00",
    titre: "30 idées de vidéos en 20 minutes", objectif: "Enregistrements",
    assets: { cover: "out/reels/cover-j07.png" },
    hook: { dit: "Tes 30 prochaines vidéos sont déjà dans ton WhatsApp.", ecran: "30 IDÉES EN 20 MIN (AVEC WHATSAPP)", visuel: "Tu fais défiler tes discussions WhatsApp (floutées)." },
    beats: [
      ["0–3 s", "Hook + défilement WhatsApp."],
      ["3–10 s", "« Chaque question qu'un client t'a posée, c'est une vidéo. Cherche : combien, comment, livrez, dispo. »"],
      ["10–18 s", "Enregistrement d'écran : tu notes chaque question dans une liste."],
      ["18–26 s", "« Vous livrez à Bafoussam ? » devient le hook « Voici comment on livre à Bafoussam »."],
      ["26–30 s", "Appel : « Enregistre et fais-le ce soir. »"],
    ],
    legende: "Tes 30 prochaines vidéos sont déjà dans ton WhatsApp.\n\n1. Ouvre WhatsApp, cherche : « combien », « comment », « livrez », « dispo ».\n2. Note chaque question de client dans une liste.\n3. Transforme chaque question en hook.\n\n20 minutes. 30 idées. Plus jamais de page blanche.\n\nEnregistre et fais-le ce soir.",
    hashtags: "#idéesdecontenu #whatsappbusiness #entrepreneurcamerounais #marketingcameroun #créateurdecontenu",
    story: "Bilan de la semaine 1 + boîte à questions : « Qu'est-ce que tu veux que je décrypte la semaine prochaine ? »",
    prod: "Floute toujours les noms, photos et numéros de tes clients (outil de flou dans CapCut).",
    inspi: "Un système concret et rapide, montré à l'écran.",
  },
  {
    n: 8, type: R, format: "Reel face caméra + motion design", pilier: "Hooks & rétention", statut: "tourner", heure: "19h30",
    titre: "5 hooks sans dire un mot (Partie 2)", objectif: "Vues + abonnés",
    assets: { cover: "out/reels/cover-j08.png" },
    hook: { dit: "Ton hook ne doit pas seulement s'entendre. Il doit se voir.", ecran: "PARTIE 2 : LES HOOKS VISUELS", visuel: "Tu coupes le son du téléphone face caméra (icône muet à l'écran)." },
    beats: [
      ["0–3 s", "Hook + rappel de la partie 1."],
      ["3–7 s", "1. Bouge dès la première image : entre dans le cadre."],
      ["7–11 s", "2. L'objet inattendu : un régime de plantain pour parler de marketing."],
      ["11–15 s", "3. L'écran partagé avant / après."],
      ["15–19 s", "4. Le texte qui contredit l'image : un plat magnifique + « Ce plat m'a fait perdre 50 000 FCFA »."],
      ["19–23 s", "5. Le gros plan sonore : huile qui grésille, ciseaux, moteur."],
      ["23–27 s", "Appel : « Partie 3 : comment garder les gens jusqu'à la fin. Abonne-toi. »"],
    ],
    legende: "Partie 2 : les hooks VISUELS. Parce que beaucoup de gens regardent sans le son.\n\n1. Bouge dès la première image\n2. Montre un objet inattendu\n3. Écran partagé avant / après\n4. Un texte qui contredit l'image\n5. Un gros plan avec un son fort\n\nTu as raté la partie 1 ? Elle est épinglée sur mon profil.",
    hashtags: "#hooks #montagevideo #reelsinstagram #marketingcameroun #créateurdecontenu",
    story: "Repartage de la partie 1 + « La partie 2 est en ligne ».",
    prod: "Reprends le style de la vidéo du jour 1 pour les titres (fond indigo, texte doré) : CapCut, texte, police grasse.",
    inspi: "Série numérotée : chaque épisode donne une raison de s'abonner.",
  },
  {
    n: 9, type: C, format: "Carrousel 10 slides", pilier: "Décryptages business", statut: "pret", heure: "12h30",
    titre: "Anatomie d'une vidéo qui vend", objectif: "Enregistrements + commentaires",
    assets: { carousel: "out/carrousels/c3-anatomie" },
    hook: { ecran: "Anatomie d'une vidéo qui vend", visuel: "La frise 0 → 30 s découpée en 5 couches." },
    beats: [
      ["Slide 1", "Couverture."], ["Slide 2", "Les 5 couches."], ["Slides 3–7", "Hook, problème, preuve, offre, appel, avec l'exemple de la pâtissière."],
      ["Slide 8", "Bonus : relance toutes les 5 s."], ["Slide 9", "Le piège n°1 : cacher le prix."], ["Slide 10", "Appel : commente « SCRIPT »."],
    ],
    legende: "Une vidéo qui vend, ce n'est pas de la chance. C'est 5 couches, dans le bon ordre :\nHook (0–3 s) → Problème → Preuve → Offre → Appel.\n\nEt le piège n°1 au Cameroun : cacher son prix.\n\nÉcris « SCRIPT » en commentaire : je t'envoie le modèle vierge en DM.",
    hashtags: "#vendreenligne #copywriting #entrepreneurcamerounais #marketingdigital #yaounde",
    story: "Montre le modèle de script vierge (flou) : « Commente SCRIPT sous le post pour le recevoir. »",
    prod: "Réponds à chaque « SCRIPT » en DM avec le modèle fourni (section Messages). Chaque conversation compte pour ton compte.",
    inspi: "Décryptage seconde par seconde, comme une autopsie de vidéo virale.",
  },
  {
    n: 10, type: R, format: "Reel avant / après", pilier: "Vente & WhatsApp", statut: "tourner", heure: "19h30",
    titre: "J'ai refait la vidéo d'une vendeuse de Mboppi", objectif: "Abonnés + messages",
    assets: { cover: "out/reels/cover-j10.png" },
    hook: { dit: "Cette vendeuse de pagnes faisait [X] vues par vidéo. J'ai refait sa vidéo avec le même téléphone.", ecran: "MÊME TÉLÉPHONE. MÊME PRODUIT. AUTRE VIDÉO.", visuel: "Écran partagé avant / après dès la première image." },
    beats: [
      ["0–3 s", "Écran partagé + hook."],
      ["3–10 s", "L'avant : plan fixe, « Bonjour à tous », pas de prix, musique trop forte."],
      ["10–22 s", "Les 5 changements, un par coupe : prix dans le hook, gros plan sur le tissu, elle porte le pagne, prix + livraison à l'écran, « Écris PAGNE sur WhatsApp »."],
      ["22–28 s", "Le résultat : ses vrais chiffres après 48 h (vues, messages)."],
      ["28–32 s", "Appel : « Commente REFAIS, je refais la vidéo d'un abonné chaque semaine. »"],
    ],
    legende: "Même téléphone. Même produit. Autre vidéo.\n\nJ'ai refait la vidéo de [prénom], vendeuse de pagnes à Mboppi. Les 5 changements :\n1. Le prix dans la première phrase\n2. Gros plan sur le tissu\n3. Elle porte le pagne au lieu de le plier\n4. Prix + livraison écrits à l'écran\n5. Un appel clair : « Écris PAGNE sur WhatsApp »\n\nRésultat après 48 h : [tes vrais chiffres].\n\nCommente « REFAIS » : chaque semaine, je refais la vidéo d'un abonné.",
    hashtags: "#avantaprès #marketingcameroun #douala #vendreenligne #entrepreneurcamerounais",
    story: "Coulisses du tournage avec la vendeuse + sondage « Avant ou Après ? ».",
    prod: "Trouve une commerçante (marché, quartier, entourage) et propose de refaire sa vidéo gratuitement contre l'accord de publier. Publie en Collab : la vidéo apparaît sur les deux comptes. Ne publie que des chiffres réels.",
    inspi: "La transformation : la preuve par l'exemple transforme un spectateur en client.",
  },
  {
    n: 11, type: R, format: "Reel histoire", pilier: "Décryptages business", statut: "tourner", heure: "19h30",
    titre: "Pourquoi le Kamer vend sur WhatsApp", objectif: "Partages + abonnés",
    assets: { cover: "out/reels/cover-j11.png" },
    hook: { dit: "Au Cameroun, la plupart des petits commerces vendent sur WhatsApp, pas sur un site web. Et ce n'est pas un retard. C'est une stratégie.", ecran: "POURQUOI LE KAMER VEND SUR WHATSAPP", visuel: "Tu fais défiler tes statuts WhatsApp remplis de produits." },
    beats: [
      ["0–4 s", "Hook + défilement des statuts."],
      ["4–14 s", "« Au marché, on achète à quelqu'un, pas à une enseigne. On discute, on négocie, on fait confiance. WhatsApp, c'est le marché dans ton téléphone. »"],
      ["14–22 s", "« Le paiement suit : Mobile Money, Orange Money. Pas besoin de carte bancaire ni de panier en ligne. »"],
      ["22–30 s", "La leçon : « Ton Instagram ne remplace pas WhatsApp. Il y amène les gens. Chaque vidéo = une raison d'écrire. »"],
      ["30–33 s", "Appel : « Chaque jeudi, une histoire de business du Mboa. Abonne-toi. »"],
    ],
    legende: "La plupart des petits commerces du Cameroun n'ont pas de site web. Et ce n'est pas un retard.\n\nIci, on achète à une personne, pas à une enseigne. On discute, on négocie, on paie en Mobile Money. WhatsApp, c'est le marché dans ton téléphone.\n\nLa leçon pour ton business : Instagram attire, WhatsApp conclut. Chaque vidéo doit donner une raison d'écrire.\n\nÉpisode 2 des « jeudis business ». L'épisode 1 (les call-box) est sur mon profil.",
    hashtags: "#whatsappbusiness #businesscameroun #mobilemoney #entrepreneuriat #237",
    story: "Sondage : « Tu préfères commander sur WhatsApp ou sur un site ? »",
    prod: "Montre de vrais statuts (les tiens, ou ceux d'un commerçant qui accepte). Floute les numéros.",
    inspi: "Expliquer un phénomène que tout le monde voit mais que personne n'explique.",
  },
  {
    n: 12, type: C, format: "Carrousel 10 slides", pilier: "Système & formats", statut: "pret", heure: "12h30",
    titre: "Poster chaque jour avec juste ton téléphone", objectif: "Enregistrements + partages",
    assets: { carousel: "out/carrousels/c4-systeme" },
    hook: { ecran: "Poster chaque jour avec juste ton téléphone", visuel: "7 cercles dorés cochés, du lundi au dimanche." },
    beats: [
      ["Slide 1", "Couverture."], ["Slide 2", "Le vrai problème, c'est le matin."], ["Slides 3–7", "Les 5 étapes : écris, prépare, tourne, monte, programme."],
      ["Slide 8", "Le kit minimum."], ["Slide 9", "Ta semaine en 4 h 30."], ["Slide 10", "Appel."],
    ],
    legende: "Poster tous les jours ne demande pas plus de temps. Ça demande un système.\n\n1 séance le dimanche → 7 vidéos prêtes.\nLe kit : ton téléphone, une fenêtre, une power bank (délestage oblige).\n\nDis-moi en commentaire : combien de vidéos tu as postées le mois dernier ? Sans jugement.",
    hashtags: "#créateurdecontenu #productivité #entrepreneurcamerounais #marketingcameroun #cameroun",
    story: "Montre ton vrai setup (fenêtre, trépied) : « Ton setup ressemble à quoi ? »",
    prod: "10 images prêtes (1080×1350).",
    inspi: "Un système de production simple, découpé en étapes.",
  },
  {
    n: 13, type: R, format: "Reel face caméra liste", pilier: "Vente & WhatsApp", statut: "tourner", heure: "13h00",
    titre: "3 phrases qui tuent tes ventes", objectif: "Commentaires + partages",
    assets: { cover: "out/reels/cover-j13.png" },
    hook: { dit: "Si tu écris une de ces 3 phrases à tes clients, tu perds de l'argent.", ecran: "3 PHRASES QUI TUENT TES VENTES", visuel: "Tu tends ton téléphone vers la caméra avec le message affiché." },
    beats: [
      ["0–3 s", "Hook."],
      ["3–10 s", "1. « Prix en inbox. » Le client pressé part. À la place : le prix, ou une fourchette."],
      ["10–18 s", "2. « Dispo. » (et rien d'autre). À la place : « Oui, disponible en noir et en beige. Livraison demain à Douala. Je vous le réserve ? »"],
      ["18–25 s", "3. « Passez en boutique. » Tu perds ceux qui ne peuvent pas se déplacer. À la place : livraison, vidéo du produit, paiement Mobile Money."],
      ["25–29 s", "Appel : « Laquelle tu as déjà écrite ? Avoue en commentaire. »"],
    ],
    legende: "3 phrases qui font fuir tes clients en DM :\n✗ « Prix en inbox »\n✗ « Dispo » (et rien d'autre)\n✗ « Passez en boutique »\n\nCe qui marche : le prix, les options, la livraison, et une question qui fait avancer (« Je vous le réserve ? »).\n\nLaquelle tu as déjà écrite ? Avoue en commentaire.",
    hashtags: "#serviceclient #vendreenligne #douala #yaounde #entrepreneurcamerounais",
    story: "Quiz : « Quelle réponse fait vendre ? » A ou B.",
    prod: "Écris chaque phrase en gros à l'écran, barrée en rouge, puis la bonne version en vert (comme dans la vidéo du jour 1).",
    inspi: "Liste d'erreurs : la peur de mal faire retient l'attention.",
  },
  {
    n: 14, type: R, format: "Reel face caméra bilan", pilier: "Communauté", statut: "tourner", heure: "18h00",
    titre: "14 jours, 14 posts : mes chiffres", objectif: "Abonnés + confiance",
    assets: { cover: "out/reels/cover-j14.png" },
    hook: { dit: "J'ai posté 14 jours d'affilée. Voici mes vrais chiffres.", ecran: "14 JOURS · 14 POSTS · MES VRAIS CHIFFRES", visuel: "Capture de tes statistiques Instagram." },
    beats: [
      ["0–3 s", "Hook + capture des statistiques."],
      ["3–12 s", "Les chiffres : vues totales, nouveaux abonnés, meilleur post. Que des chiffres réels."],
      ["12–22 s", "3 leçons : ce qui a marché, ce qui n'a pas marché, ce que tu changes."],
      ["22–28 s", "La suite : annonce la prochaine série."],
      ["28–32 s", "Appel : « Dis-moi en commentaire ce que tu veux que je décrypte. »"],
    ],
    legende: "14 jours. 14 posts. Voici mes vrais chiffres.\n\n→ Vues : [X]\n→ Nouveaux abonnés : [X]\n→ Meilleur post : [titre], parce que [raison]\n\nCe que je garde : [ ]\nCe que j'arrête : [ ]\n\nTu veux que je décrypte quoi la semaine prochaine ? Dis-le en commentaire, je choisis parmi vos réponses.",
    hashtags: "#buildinpublic #créateurdecontenu #entrepreneurcamerounais #marketingcameroun #cameroun",
    story: "Boîte à questions : « Pose ta question sur le marketing » → réponses en Reels la semaine suivante.",
    prod: "Remplis les [X] avec tes statistiques réelles du jour 14. La transparence crée la confiance, même si les chiffres sont petits.",
    inspi: "Construire en public : montrer ses vrais résultats.",
  },
];
