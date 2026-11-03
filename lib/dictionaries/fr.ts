import type { Dictionary } from "../i18n";

// Français (fr) — vouvoiement constant, sans anglicismes évitables.
// Contrat : forme des clés identique à en (tests/seo.test.ts), valeurs en français.
const fr: Dictionary = {
  brand: "FractionCalc",
  tagline: "Chaque calcul de fraction s'exécute dans votre navigateur.",
  metaDesc: "Calculatrices de fractions gratuites : additionner, soustraire, multiplier, diviser, simplifier et convertir en décimaux ou en nombres mixtes. Tout s'exécute dans votre navigateur — vos nombres ne quittent jamais votre appareil.",

  nav: {
    tools: "Tous les outils",
    categories: "Catégories",
    about: "À propos",
    menu: "Menu",
    language: "Langue",
  },

  home: {
    heroTitle: "Des fractions qui ont enfin du sens — additionner, simplifier, convertir",
    heroSub: "FractionCalc est un ensemble de calculatrices de fractions : addition et soustraction avec le PPCM des dénominateurs détaillé, multiplication avec simplification en croix, réduction par le PGCD et conversion entre fractions, décimaux et nombres mixtes. Tout dans votre navigateur — rapide, gratuit, sans inscription, rien n'est envoyé.",
    browseAll: "Voir tous les outils",
    pinned: "Épinglés",
    pin: "Épingler",
    unpin: "Désépingler",
    popular: "Populaires en ce moment",
    categoriesTitle: "Catégories",
    featuredTitle: "Outils populaires",
    trustLocal: "Vos nombres restent sur votre appareil",
    trustFree: "Gratuit, sans compte",
    trustFast: "Instantané, fonctionne hors ligne",
    rotating: [
      "1/2 + 1/3 = 5/6 — avec le PPCM et chaque étape sous les yeux",
      "8/12 → 2/3 : simplifiez toute fraction par son PGCD",
      "0.333 → 1/3 : les décimaux redeviennent des fractions, période marquée",
      "2 1/3 ↔ 7/3 : nombres mixtes et fractions impropres, dans les deux sens",
    ],
    statsLabels: { tools: "outils", languages: "langues", uploads: "envois", accounts: "comptes" },
    eyebrow: "Gratuit, pour toujours",
    heroCtaSecondary: "Comment ça marche",
    statsTools: "{n} outils",
    statsLanguages: "{n} langues",
    statsUploads: "0 envoi",
    statsAccounts: "0 compte",
    categoriesSub: "Des calculatrices de fractions pour chaque opération, toutes sur votre appareil.",
    popularSub: "Les outils que l'on ouvre le plus.",
    privacyTitle: "Vos nombres ne quittent jamais votre appareil.",
    privacySub:
      "Il n'y a aucune étape d'envoi. Les outils sont du JavaScript exécuté dans votre navigateur — ce n'est pas une promesse de politique de confidentialité, c'est ainsi qu'ils sont conçus.",
    privacyPoint1T: "Traitement local",
    privacyPoint1D: "Les fractions et les nombres que vous saisissez sont traités en mémoire pendant la frappe. Rien n'est transmis, nulle part.",
    privacyPoint2T: "Aucun compte",
    privacyPoint2D: "Pas d'inscription, pas d'e-mail, pas d'historique conservé. Ouvrez un outil et utilisez-le.",
    privacyPoint3T: "Honnête par conception",
    privacyPoint3D:
      "Si quelque chose ne peut réellement pas être fait dans le navigateur, nous le disons au lieu de le faire semblant.",
    privacyLink: "Lire la note de confidentialité complète",
    endTitle: "Choisissez un outil. Il fonctionne, tout simplement.",
    endSub: "Quinze langues, zéro envoi, rien à installer.",
  },

  tools: {
    title: "Tous les outils",
    subtitle: "Cherchez parmi {count} outils gratuits dans le navigateur. Sans envoi, sans inscription.",
    filterPlaceholder: "Rechercher un outil…",
    count: "{count} outils",
    empty: "Aucun outil ne correspond à « {query} ».",
  },

  categories: {
    pdf: { name: "PDF", desc: "Fusionnez, divisez, convertissez et modifiez des fichiers PDF sans les envoyer nulle part." },
    image: { name: "Image", desc: "Compressez, redimensionnez, recadrez et convertissez des images directement dans votre navigateur." },
    text: { name: "Texte", desc: "Comptez, nettoyez, triez et transformez du texte instantanément, pendant la saisie." },
    developer: { name: "Développement", desc: "Formateurs, encodeurs, décodeurs et générateurs pour le quotidien du développeur." },
    seo: { name: "SEO", desc: "Balises meta, données structurées, aperçu SERP et autres assistants de référencement." },
    security: { name: "Sécurité", desc: "Mots de passe, empreintes et vérifications — générés et contrôlés sur votre appareil." },
    utility: { name: "Fractions", desc: "Additionner, soustraire, multiplier, simplifier et convertir des fractions — exact, étape par étape, dans votre navigateur." },
  },

  tool: {
    howTo: "Mode d'emploi",
    faq: "Questions fréquentes",
    related: "Outils associés",
    nextStep: "Étapes suivantes",
    copyLink: "Copier le lien",
    privacyNote:
      "Cet outil s'exécute entièrement dans votre navigateur. Vos données ne quittent jamais votre appareil — elles ne sont envoyées à aucun serveur.",
    inCategory: "Plus d'outils dans {category}",
    backToCategory: "Tous les outils {category}",
  },

  common: {
    openTool: "Ouvrir l'outil",
    copy: "Copier",
    copied: "Copié",
    download: "Télécharger",
    reset: "Réinitialiser",
    swap: "Inverser",
    clear: "Effacer",
    error: "Une erreur est survenue. Vérifiez votre saisie et réessayez.",
    input: "Entrée",
    output: "Résultat",
    settings: "Options",
    dropFiles: "Déposez des fichiers ici ou cliquez pour choisir",
    dropFile: "Déposez un fichier ici ou cliquez pour choisir",
    processing: "Traitement…",
    fileSize: "Taille",
    sample: "Essayer un exemple",
    uppercase: "MAJUSCULES",
  },

  unit: {
    from: "De",
    to: "Vers",
    amount: "Quantité",
    result: "Résultat",
    common: "Conversions courantes",
    formula: "Formule",
    allUnits: "Toutes les unités",
  },

  text: {
    stats: {
      words: "Mots",
      characters: "Caractères",
      charsNoSpaces: "Sans espaces",
      sentences: "Phrases",
      paragraphs: "Paragraphes",
      lines: "Lignes",
      readingTime: "Temps de lecture",
      readingMinutes: "{n} min de lecture",
    },
  },

  footer: {
    line: "Calculatrices de fractions. Rien de ce que vous saisissez ici ne quitte votre appareil.",
    privacy: "Confidentialité",
    terms: "Conditions",
    about: "À propos",
    badges: "Badges",
    language: "Langue",
  },

  badge: {
    title: "Badges FractionCalc",
    desc: "Affichez un badge FractionCalc sur votre site, votre README ou votre documentation. Il renvoie ici et indique que les outils de fractions derrière lui s'exécutent entièrement dans le navigateur.",
    voluntary: "L'intégration est entièrement volontaire — prenez un badge si le projet vous plaît. Aucune autorisation nécessaire.",
    md: "Markdown (README)",
    html: "HTML (site web)",
    thanks: "Merci de faire passer le mot — chaque intégration aide plus de personnes à découvrir des outils qui respectent leurs fichiers.",
  },

  embed: {
    title: "Intégrer cet outil",
    desc: "Ajoutez cet outil à votre site en une ligne — il s'exécute dans le navigateur du visiteur.",
  },

    mcp: {
    title: "Serveur MCP — outils accessibles aux IA",
    desc1: "FractionCalc embarque un serveur MCP (Model Context Protocol) : des assistants IA comme Claude ou Cursor peuvent exécuter les mêmes calculatrices de fractions que celles de ce site — la même logique testée, sans réimplémentation.",
    desc2: "Les outils exécutent les fonctions pures du site lui-même pour l'arithmétique des fractions, la simplification et la conversion fraction↔décimal. L'exécution a lieu sur la machine du client IA via npx — rien n'est envoyé à nos serveurs.",
    toolsTitle: "Outils exécutables ({n})",
    requiresNode: "Nécessite Node.js 18+. Le serveur tourne localement en stdio ; seuls les appels que vous lancez sont calculés sur votre machine.",
    privacy: "Nécessite Node.js 18+. Le serveur tourne localement en stdio ; seuls les appels que vous lancez sont calculés sur votre machine.",
  },

    notFound: {
    title: "Page introuvable",
    body: "L'outil que vous cherchez n'existe pas. Parcourez plutôt tous les outils.",
    home: "Retour à l'accueil",
  },
};

export default fr;
