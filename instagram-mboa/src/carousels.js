// Contenu des 4 carrousels. Syntaxe : *mot* = italique or, [mot] = emplacement à remplir.
// HANDLE : mets ton @ ici (ex. "@tonnom") pour l'afficher en bas de chaque slide, puis relance le rendu.
window.HANDLE = "";

const CTA_ACTIONS = (save, send, follow) => [
  { icon: "save", text: save },
  { icon: "send", text: send },
  { icon: "follow", text: follow },
];

window.CAROUSELS = [
  // ───────────────────────────── C1 ─────────────────────────────
  {
    id: "c1-hooks",
    label: "Guide · Hooks",
    series: "Les 3 premières secondes",
    slides: [
      {
        type: "cover", visual: "seven",
        eyebrow: "À enregistrer avant ton prochain tournage",
        title: "7 hooks qui *arrêtent* le scroll",
        sub: "7 premières phrases à copier pour ton business. Exemples 100 % Mboa.",
      },
      {
        type: "statement",
        title: "Tu as *3 secondes.* Pas 30.",
        body: "Personne ne reste pour ton produit. Les gens restent pour ta première phrase. Si elle ne dit pas de quoi tu parles et pourquoi rester, ils scrollent.",
        kicker: "Un bon hook = un sujet clair + une raison de rester.",
      },
      {
        type: "item", index: 1, total: 7, name: "Le choc des prix",
        rows: [
          { label: "Modèle", style: "formula", text: "Ce [produit] coûte [petit prix]. Celui-ci coûte [gros prix]. Voici la différence." },
          { label: "Exemple", style: "quote", text: "Ce sac coûte 5 000 FCFA à Mboppi. Celui-ci coûte 45 000. Regarde les coutures." },
          { label: "Pourquoi ça marche", style: "body", text: "Le cerveau veut comprendre l'écart. Il reste jusqu'à la réponse." },
        ],
      },
      {
        type: "item", index: 2, total: 7, name: "L'erreur qui coûte cher",
        rows: [
          { label: "Modèle", style: "formula", text: "Si tu fais encore [cette erreur], tu perds [conséquence]." },
          { label: "Exemple", style: "quote", text: "Si tu réponds encore « prix en inbox », tu perds des clients tous les jours." },
          { label: "Pourquoi ça marche", style: "body", text: "Personne ne veut perdre de l'argent. La peur de l'erreur retient mieux qu'une promesse." },
        ],
      },
      {
        type: "item", index: 3, total: 7, name: "Le secret du métier",
        rows: [
          { label: "Modèle", style: "formula", text: "Ce que les [vendeurs de X] ne te diront jamais sur [sujet]." },
          { label: "Exemple", style: "quote", text: "Ce que les vendeurs de mèches ne te diront jamais sur la « vraie » brésilienne." },
          { label: "Pourquoi ça marche", style: "body", text: "Tu promets une info d'initié. La curiosité fait le reste." },
        ],
      },
      {
        type: "item", index: 4, total: 7, name: "Le défi",
        rows: [
          { label: "Modèle", style: "formula", text: "J'ai [fait un truc difficile] pendant [durée]. Voici ce qui s'est passé." },
          { label: "Exemple", style: "quote", text: "J'ai posté une vidéo par jour pendant 30 jours pour mon resto à Bastos. Voici les chiffres." },
          { label: "Pourquoi ça marche", style: "body", text: "Une histoire avec un début et une fin : on veut connaître la fin." },
        ],
      },
      {
        type: "item", index: 5, total: 7, name: "La question qui pique",
        rows: [
          { label: "Modèle", style: "formula", text: "Pourquoi [situation frustrante que ton client vit] ?" },
          { label: "Exemple", style: "quote", text: "Pourquoi ta page a 5 000 abonnés mais personne n'achète ?" },
          { label: "Pourquoi ça marche", style: "body", text: "Ta cible se reconnaît en une seconde. Elle reste pour la réponse." },
        ],
      },
      {
        type: "item", index: 6, total: 7, name: "Le POV",
        rows: [
          { label: "Modèle", style: "formula", text: "POV : [situation que ton client vit chaque semaine]." },
          { label: "Exemple", style: "quote", text: "POV : ta cliente te dit « je repasse demain » pour la 4e fois." },
          { label: "Pourquoi ça marche", style: "body", text: "L'humour qu'on reconnaît se partage. Et un partage, c'est de la portée gratuite." },
        ],
      },
      {
        type: "item", index: 7, total: 7, name: "Le résultat d'abord",
        rows: [
          { label: "Modèle", style: "formula", text: "Voici [le résultat final]. Et voici comment on l'a fait." },
          { label: "Exemple", style: "quote", text: "Voici une robe cousue en 48 h pour un mariage à Yaoundé. Et voici comment on l'a faite." },
          { label: "Pourquoi ça marche", style: "body", text: "Tu montres la fin d'abord. Les gens restent pour comprendre le chemin." },
        ],
      },
      {
        type: "checklist",
        title: "Le test *avant* de poster",
        items: [
          "On comprend le sujet en une phrase.",
          "Il y a une tension : un écart, un « mais », une question.",
          "L'image bouge dès la première seconde.",
          "Le texte à l'écran dit la même chose que ta voix.",
        ],
        note: "4 cases cochées ? Poste. Sinon, réécris la première phrase.",
      },
      {
        type: "cta",
        title: "Garde ce guide *sous la main.*",
        actions: CTA_ACTIONS(
          "Enregistre ce post pour ton prochain tournage.",
          "Envoie-le à un entrepreneur qui commence encore par « Bonjour à tous ».",
          "Abonne-toi : chaque semaine, une méthode pour vendre avec la vidéo au Cameroun."
        ),
        prompt: "Quel hook tu testes en premier ? Écris son numéro en commentaire.",
      },
    ],
  },

  // ───────────────────────────── C2 ─────────────────────────────
  {
    id: "c2-formats",
    label: "Stratégie · Formats",
    series: "Le système de contenu",
    slides: [
      {
        type: "cover", visual: "tiles",
        eyebrow: "Arrête de chercher des idées",
        title: "*Format* > idée",
        sub: "6 formats de vidéo qui marchent au Mboa. Remplis-les avec ton business, poste, répète.",
      },
      {
        type: "statement",
        title: "Ton problème n'est pas *l'idée.*",
        body: "Un format, c'est une structure que tu peux répéter 50 fois. Les comptes qui grandissent vite ne réinventent rien chaque matin : ils remplissent les mêmes formats avec de nouveaux sujets.",
        kicker: "Une idée = 1 vidéo. Un format = 50 vidéos.",
      },
      {
        type: "item", index: 1, total: 6, name: "Le vrai prix", tag: "Confiance + ventes",
        rows: [
          { label: "Structure", style: "chips", text: ["Prix affiché", "Ce qu'il y a derrière", "Pourquoi ça vaut le coup"] },
          { label: "Exemple", style: "quote", text: "Pourquoi mon gâteau d'anniversaire coûte 25 000 FCFA, et pas 10 000." },
          { label: "Idéal pour", style: "body", text: "Pâtisserie, couture, coiffure, tout produit qu'on trouve « trop cher »." },
        ],
      },
      {
        type: "item", index: 2, total: 6, name: "Avant / Après", tag: "Vues",
        rows: [
          { label: "Structure", style: "chips", text: ["Résultat final (1 s)", "L'avant", "Le travail en accéléré", "La réaction"] },
          { label: "Exemple", style: "quote", text: "Une coiffure, un canapé nettoyé, une boutique réaménagée à Akwa." },
          { label: "Astuce", style: "body", text: "Montre l'après en premier, une seconde. Puis reviens au début." },
        ],
      },
      {
        type: "item", index: 3, total: 6, name: "Les coulisses", tag: "Vues + attachement",
        rows: [
          { label: "Structure", style: "chips", text: ["Une étape", "Le geste en gros plan", "Le son réel", "Le produit fini"] },
          { label: "Exemple", style: "quote", text: "5 h du matin : la préparation des beignets avant l'ouverture à Mokolo." },
          { label: "Astuce", style: "body", text: "Garde le son d'origine : l'huile, les ciseaux, la machine. C'est ton meilleur hook." },
        ],
      },
      {
        type: "item", index: 4, total: 6, name: "Mythe vs réalité", tag: "Commentaires",
        rows: [
          { label: "Structure", style: "chips", text: ["L'idée reçue", "« Faux. »", "La preuve", "Ton conseil"] },
          { label: "Exemple", style: "quote", text: "« Le pagne, c'est pour les cérémonies. » Faux. Voici 3 façons de le porter au bureau." },
          { label: "Astuce", style: "body", text: "Un avis tranché fait commenter. Les commentaires poussent ta vidéo." },
        ],
      },
      {
        type: "item", index: 5, total: 6, name: "Je teste pour toi", tag: "Enregistrements",
        rows: [
          { label: "Structure", style: "chips", text: ["Le test annoncé", "3 options", "Le verdict honnête"] },
          { label: "Exemple", style: "quote", text: "J'ai testé 3 façons d'envoyer un colis Douala–Yaoundé. Voici la plus fiable." },
          { label: "Astuce", style: "body", text: "Donne un vrai gagnant. « Ça dépend », personne ne l'enregistre." },
        ],
      },
      {
        type: "item", index: 6, total: 6, name: "La question client", tag: "Ventes",
        rows: [
          { label: "Structure", style: "chips", text: ["La vraie question (capture)", "Ta réponse en 20 s", "L'appel à l'action"] },
          { label: "Exemple", style: "quote", text: "« Vous livrez à Bafoussam ? » Oui. Voici comment ça marche, et combien ça coûte." },
          { label: "Astuce", style: "body", text: "Floute toujours le nom et le numéro du client." },
        ],
      },
      {
        type: "schedule",
        title: "Ta semaine *type*",
        rows: [
          ["Lun", "Avant / Après"],
          ["Mar", "La question client"],
          ["Mer", "Les coulisses"],
          ["Jeu", "Mythe vs réalité"],
          ["Ven", "Le vrai prix"],
          ["Sam", "Je teste pour toi"],
        ],
        note: "Même format chaque semaine, sujet différent. Ton audience sait quoi attendre.",
      },
      {
        type: "cta",
        title: "Choisis *un* format. Poste-le 3 fois.",
        actions: CTA_ACTIONS(
          "Enregistre ce post pour ta séance de tournage.",
          "Partage-le à l'ami qui « n'a jamais d'idées ».",
          "Abonne-toi pour la suite : les hooks qui vont avec chaque format."
        ),
        prompt: "Lequel tu vas tester ? Écris son numéro en commentaire.",
      },
    ],
  },

  // ───────────────────────────── C3 ─────────────────────────────
  {
    id: "c3-anatomie",
    label: "Décryptage · Vente",
    series: "Des vues aux clients",
    slides: [
      {
        type: "cover", visual: "timeline",
        eyebrow: "30 secondes, 5 couches",
        title: "Anatomie d'une vidéo qui *vend*",
        sub: "Ce qui se passe, seconde par seconde, dans une vidéo qui transforme les vues en messages WhatsApp.",
      },
      {
        type: "overview",
        title: "Les *5 couches*",
        body: "On suit un exemple réel tout au long : une pâtissière à Yaoundé qui vend des gâteaux d'anniversaire.",
      },
      {
        type: "item", index: 1, total: 5, name: "Le hook", tag: "0 – 3 s",
        rows: [
          { label: "Son rôle", style: "body", text: "Arrêter le pouce." },
          { label: "Tu dis", style: "quote", text: "Ce gâteau a été commandé à 22 h pour le lendemain 8 h." },
          { label: "Tu montres", style: "body", text: "Le gâteau fini qui tourne, en gros plan." },
        ],
      },
      {
        type: "item", index: 2, total: 5, name: "Le problème", tag: "3 – 10 s",
        rows: [
          { label: "Son rôle", style: "body", text: "Faire dire au client : « Ça, c'est moi. »" },
          { label: "Tu dis", style: "quote", text: "Tu as oublié l'anniversaire ? Ailleurs, on te demande 48 h." },
          { label: "Tu montres", style: "body", text: "Un téléphone avec le rappel « Anniv' maman demain »." },
        ],
      },
      {
        type: "item", index: 3, total: 5, name: "La preuve", tag: "10 – 20 s",
        rows: [
          { label: "Son rôle", style: "body", text: "Rendre la promesse crédible." },
          { label: "Tu dis", style: "quote", text: "On l'a fait cette nuit. Regarde." },
          { label: "Tu montres", style: "body", text: "La préparation en accéléré, puis 2 avis clients reçus sur WhatsApp." },
        ],
      },
      {
        type: "item", index: 4, total: 5, name: "L'offre", tag: "20 – 27 s",
        rows: [
          { label: "Son rôle", style: "body", text: "Dire exactement quoi acheter." },
          { label: "Tu dis", style: "quote", text: "Commande avant 23 h, livré le lendemain. À partir de 15 000 FCFA." },
          { label: "Tu montres", style: "body", text: "Le prix écrit à l'écran. Toujours." },
        ],
      },
      {
        type: "item", index: 5, total: 5, name: "L'appel", tag: "27 – 30 s",
        rows: [
          { label: "Son rôle", style: "body", text: "Dire exactement quoi faire." },
          { label: "Tu dis", style: "quote", text: "Écris « GÂTEAU » sur WhatsApp. Le numéro est dans ma bio." },
          { label: "Tu montres", style: "body", text: "Le mot-clé en gros, pendant 3 secondes minimum." },
        ],
      },
      {
        type: "checklist", bullets: "arrow",
        title: "Bonus : relance *toutes les 5 s*",
        lead: "Le hook fait entrer. Les relances font rester.",
        items: [
          "Change de plan.",
          "Fais apparaître un nouveau texte.",
          "Ajoute un son : un couteau, un grésillement, un clic.",
          "Pose une question : « Tu sais ce qui change tout ? »",
          "Zoome sur le détail.",
        ],
      },
      {
        type: "statement", tone: "warning",
        title: "Le piège n°1 au Kamer : *cacher le prix.*",
        body: "« Prix en inbox » fait fuir l'acheteur pressé et attire les curieux. Un prix affiché filtre et rassure. Si ton prix varie, donne une fourchette.",
        kicker: "« Entre 15 000 et 30 000 FCFA selon la taille. »",
      },
      {
        type: "cta",
        title: "Ta prochaine vidéo, *couche par couche.*",
        actions: CTA_ACTIONS(
          "Enregistre ce post avant d'écrire ton prochain script.",
          "Envoie-le à quelqu'un qui écrit encore « prix en inbox ».",
          "Abonne-toi : on décortique une vidéo qui vend chaque semaine."
        ),
        prompt: "Écris « SCRIPT » en commentaire : je t'envoie le modèle vierge en DM.",
      },
    ],
  },

  // ───────────────────────────── C4 ─────────────────────────────
  {
    id: "c4-systeme",
    label: "Système · Production",
    series: "Le système de contenu",
    slides: [
      {
        type: "cover", visual: "week",
        eyebrow: "Sans équipe, sans caméra, sans gros forfait",
        title: "Poster *chaque jour* avec juste ton téléphone",
        sub: "Le système en 5 étapes pour sortir 7 vidéos par semaine, même avec les délestages.",
      },
      {
        type: "statement",
        title: "Le vrai problème, c'est *le matin.*",
        body: "Tu te lèves, tu cherches une idée, tu filmes, tu montes, tu postes. Tout le même jour. Au bout de 3 jours, tu lâches. La solution : séparer les étapes et tout faire en série.",
        kicker: "Une séance par semaine. 7 vidéos prêtes.",
      },
      {
        type: "item", index: 1, total: 5, name: "Écris", tag: "Dimanche · 30 min",
        rows: [
          { label: "Action", style: "body", text: "Écris 7 hooks d'un coup. Prends-les dans les questions de tes clients sur WhatsApp : chaque question = une vidéo." },
          { label: "Astuce", style: "tip", text: "Garde une note « Idées » dans ton téléphone. Ajoutes-y chaque question reçue." },
        ],
      },
      {
        type: "item", index: 2, total: 5, name: "Prépare", tag: "Samedi soir · 15 min",
        rows: [
          { label: "Action", style: "body", text: "Charge le téléphone et la power bank. Nettoie l'objectif. Prépare 2 ou 3 hauts différents." },
          { label: "Astuce", style: "tip", text: "Délestage annoncé ? Tourne de jour : la lumière de la fenêtre suffit, pas besoin de courant." },
        ],
      },
      {
        type: "item", index: 3, total: 5, name: "Tourne", tag: "Dimanche · 1 h",
        rows: [
          { label: "Action", style: "body", text: "Face à une fenêtre, entre 9 h et 11 h ou après 15 h. Loin des motos et du groupe électrogène. Change de haut toutes les 2 vidéos." },
          { label: "Astuce", style: "tip", text: "Filme en 1080p, 30 images/s. La 4K mange ton stockage et ta data pour rien." },
        ],
      },
      {
        type: "item", index: 4, total: 5, name: "Monte", tag: "Lundi · 1 h",
        rows: [
          { label: "Action", style: "body", text: "Monte les 7 vidéos à la suite dans CapCut ou Edits. Le montage de base marche sans connexion." },
          { label: "Astuce", style: "tip", text: "Les sous-titres automatiques demandent internet : génère-les tous en une seule fois." },
        ],
      },
      {
        type: "item", index: 5, total: 5, name: "Programme", tag: "Lundi soir · 20 min",
        rows: [
          { label: "Action", style: "body", text: "Programme toute la semaine en une seule connexion : Wi-Fi ou forfait nuit. Instagram te laisse planifier tes Reels à l'avance." },
          { label: "Astuce", style: "tip", text: "Recycle chaque vidéo en statut WhatsApp, TikTok et Facebook. Exporte-la sans filigrane." },
        ],
      },
      {
        type: "checklist", bullets: "dot",
        title: "Le kit *minimum*",
        items: [
          "Ton téléphone (celui que tu as déjà).",
          "Un petit trépied ou une pile de livres.",
          "Une fenêtre, pas de lumière dans le dos.",
          "Des écouteurs avec micro, ou un micro-cravate.",
          "Une power bank chargée.",
        ],
        note: "Pas besoin de plus pour commencer. Le matériel ne fait pas les vues.",
      },
      {
        type: "schedule",
        title: "Ta semaine *en 4 h 30*",
        rows: [
          ["Sam", "Préparer · 15 min"],
          ["Dim", "Écrire + tourner · 1 h 30"],
          ["Lun", "Monter + programmer · 1 h 20"],
          ["Mar → Sam", "Répondre aux commentaires · 15 min/jour"],
        ],
        note: "Environ 4 h 30 par semaine pour 7 vidéos : moins de 40 minutes par jour.",
      },
      {
        type: "cta",
        title: "Commence ce *dimanche.*",
        actions: CTA_ACTIONS(
          "Enregistre ce post et cale ta première séance.",
          "Envoie-le à ton binôme : tournez ensemble, c'est plus facile.",
          "Abonne-toi : chaque semaine, un système simple pour vendre avec la vidéo."
        ),
        prompt: "Combien de vidéos tu as postées le mois dernier ? Dis-le en commentaire, sans honte.",
      },
    ],
  },
];
