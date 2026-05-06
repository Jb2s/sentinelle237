export type Article = {
  id: string;
  title: string;
  source: string;
  sourceColor: string;
  category: string;
  readTime: string;
  excerpt: string;
  publishedAt: string;
};

export const articles: Article[] = [
  {
    id: "1",
    title: "Dubai First s'associe à Mastercard pour lancer une expérience bancaire mobile personnalisée au Moyen-Orient",
    source: "The Fintech Times",
    sourceColor: "from-primary-deep to-primary",
    category: "Banking",
    readTime: "5 min",
    excerpt:
      "Unique dans la région, ce programme offre aux porteurs Dubai First Cashback un accès à un tableau de bord personnalisé via l'app mobile, avec partage de localisation opt-in et offres ciblées.",
    publishedAt: "Il y a 1h",
  },
  {
    id: "2",
    title: "Le gouvernement britannique consulte sur les réformes réglementaires post-Brexit",
    source: "Finextra",
    sourceColor: "from-primary to-primary-glow",
    category: "Régulation",
    readTime: "7 min",
    excerpt:
      "La revue du Future Regulatory Framework (FRF) examine comment le cadre des services financiers britannique doit évoluer pour refléter la nouvelle position du Royaume-Uni hors UE.",
    publishedAt: "Il y a 2h",
  },
  {
    id: "3",
    title: "Durabilité crypto et solutions vertes mises en avant à la COP26",
    source: "CoinDesk",
    sourceColor: "from-primary-glow to-highlight",
    category: "Crypto · ESG",
    readTime: "9 min",
    excerpt:
      "Sur la disparité entre l'implémentation des initiatives climat dans les énergies traditionnelles et la communauté crypto, les nouvelles technologies offrent une opportunité de rattrapage.",
    publishedAt: "Il y a 3h",
  },
  {
    id: "4",
    title: "Le Comité de Bâle reconsidère ses propositions sur les crypto-actifs après le retour du marché",
    source: "Banking Exchange",
    sourceColor: "from-primary-deep to-primary-glow",
    category: "Crypto · Régulation",
    readTime: "13 min",
    excerpt:
      "Le Comité deee Bâle sur la supervision bancaire revoit ses règles punitives sur les investissements en crypto-actifs des institutions financières, suite à un pushback substantiel des associations.",
    publishedAt: "Il y a 5h",
  },
  {
    id: "5",
    title: "Stripe étend Capital aux PME européennes et atteint 5 milliards de financements",
    source: "Sifted",
    sourceColor: "from-primary to-primary-deep",
    category: "Paiements",
    readTime: "6 min",
    excerpt:
      "Stripe Capital franchit une nouvelle étape avec un déploiement européen accéléré, ciblant les marchands de plateformes intégrées et soutenant la croissance des PME numériques.",
    publishedAt: "Il y a 6h",
  },
  {
    id: "6",
    title: "Les néobanques européennes consolident — Revolut et N26 publient leurs résultats",
    source: "Fintech Futures",
    sourceColor: "from-primary-glow to-primary",
    category: "Néobanques",
    readTime: "8 min",
    excerpt:
      "Avec une rentabilité confirmée chez Revolut et une stabilisation des comptes actifs chez N26, le secteur entre dans une phase de maturité industrielle après dix ans d'hyper-croissance.",
    publishedAt: "Il y a 8h",
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
