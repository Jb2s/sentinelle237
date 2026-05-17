export type Article = {
  id: string;
  title: string;
  source: string;
  sourceColor: string;
  category: string;
  readTime: string;
  excerpt: string;

  // vraie date
  date: string;

  // texte UI
  publishedAt: string;

  url?: string;
  content?: string;
};



export const articles: Article[] = [
  {
    id: "1",
    title:
      "Dubai First s'associe à Mastercard pour lancer une expérience bancaire mobile personnalisée au Moyen-Orient",
    source: "The Fintech Times",
    sourceColor: "from-primary-deep to-primary",
    category: "Banking",
    readTime: "5 min",
    excerpt:
      "Unique dans la région, ce programme offre aux porteurs Dubai First Cashback un accès à un tableau de bord personnalisé via l'app mobile.",
    
    date: "2026-05-17T10:00:00",

    publishedAt: "Il y a 1h",
  },

  {
    id: "2",
    title:
      "Le gouvernement britannique consulte sur les réformes réglementaires post-Brexit",
    source: "Finextra",
    sourceColor: "from-primary to-primary-glow",
    category: "Régulation",
    readTime: "7 min",
    excerpt:
      "La revue du Future Regulatory Framework examine l'évolution du cadre financier britannique.",

    date: "2026-05-17T08:00:00",

    publishedAt: "Il y a 2h",
  },

  {
    id: "3",
    title:
      "Durabilité crypto et solutions vertes mises en avant à la COP26",
    source: "CoinDesk",
    sourceColor: "from-primary-glow to-highlight",
    category: "Crypto · ESG",
    readTime: "9 min",
    excerpt:
      "Les nouvelles technologies crypto offrent une opportunité de rattrapage écologique.",

    date: "2026-05-16T15:00:00",

    publishedAt: "Hier",
  },

  {
    id: "4",
    title:
      "Le Comité de Bâle reconsidère ses propositions sur les crypto-actifs",
    source: "Banking Exchange",
    sourceColor: "from-primary-deep to-primary-glow",
    category: "Crypto · Régulation",
    readTime: "13 min",
    excerpt:
      "Le Comité de Bâle revoit ses règles sur les investissements crypto.",

    date: "2026-05-15T11:00:00",

    publishedAt: "15/05/2026",
  },
];

export const feeds = [
  { name: "99 Bitcoins", count: 5, color: "bg-highlight" },
  { name: "Accenture Banking Blog", count: 9, color: "bg-primary-glow" },
  { name: "American Banker", count: 250, color: "bg-primary" },
  { name: "Bank Automation News", count: 67, color: "bg-primary-deep" },
  { name: "Banking Exchange News", count: 30, color: "bg-primary" },
  { name: "Bitcoin Currency", count: 250, color: "bg-highlight" },
  { name: "Bitcoin Magazine", count: 245, color: "bg-primary-glow" },
  { name: "Bitcoinist", count: 250, color: "bg-primary" },
  { name: "Calculated Risk", count: 158, color: "bg-primary-deep" },
  { name: "Chris Skinner's blog", count: 54, color: "bg-primary-glow" },
  { name: "Cointelegraph", count: 250, color: "bg-primary" },
  { name: "Daily Fintech", count: 31, color: "bg-primary-glow" },
  { name: "Faisal Khan", count: 7, color: "bg-primary-deep" },
  { name: "Finance Fortune", count: 48, color: "bg-highlight" },
];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
