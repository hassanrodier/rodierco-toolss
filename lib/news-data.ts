// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type NewsCategory =
  | "all"
  | "collections"
  | "market"
  | "business"
  | "watches"
  | "craft"
  | "trends";

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl: string;       // Real RSS endpoint — replace mock data with fetch(rssUrl)
  country: string;
  lang: "fr" | "en";
  color: string;
  bg: string;
  border: string;
  text: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sourceId: string;
  category: NewsCategory;
  tags: string[];
  publishedAt: string;   // ISO date string
  url: string;
  readingTime: number;   // minutes
  imageKeyword?: string; // placeholder gradient key
}

// ─────────────────────────────────────────────────────────────────────────────
// Sources configuration
// Replace rssUrl fetch mocks with:  const res = await fetch(source.rssUrl)
// ─────────────────────────────────────────────────────────────────────────────

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: "jck",
    name: "JCK Magazine",
    url: "https://www.jckonline.com",
    rssUrl: "https://www.jckonline.com/feed/",
    country: "US", lang: "en",
    color: "#f59e0b", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400",
  },
  {
    id: "national-jeweler",
    name: "National Jeweler",
    url: "https://www.nationaljeweler.com",
    rssUrl: "https://www.nationaljeweler.com/feed",
    country: "US", lang: "en",
    color: "#3b82f6", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400",
  },
  {
    id: "pro-jeweller",
    name: "Professional Jeweller",
    url: "https://www.professionaljeweller.com",
    rssUrl: "https://www.professionaljeweller.com/feed/",
    country: "UK", lang: "en",
    color: "#8b5cf6", bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400",
  },
  {
    id: "watchpro",
    name: "WatchPro",
    url: "https://www.watchpro.com",
    rssUrl: "https://www.watchpro.com/feed/",
    country: "UK", lang: "en",
    color: "#6366f1", bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400",
  },
  {
    id: "hodinkee",
    name: "Hodinkee",
    url: "https://www.hodinkee.com",
    rssUrl: "https://www.hodinkee.com/feed",
    country: "US", lang: "en",
    color: "#10b981", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400",
  },
  {
    id: "journal-luxe",
    name: "Journal du Luxe",
    url: "https://journalduluxe.fr",
    rssUrl: "https://journalduluxe.fr/feed/",
    country: "FR", lang: "fr",
    color: "#ec4899", bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400",
  },
  {
    id: "officiel-bijou",
    name: "L'Officiel du Bijou",
    url: "https://www.officieldubijou.com",
    rssUrl: "https://www.officieldubijou.com/feed/",
    country: "FR", lang: "fr",
    color: "#f97316", bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400",
  },
  {
    id: "europa-star",
    name: "Europa Star",
    url: "https://www.europastar.com",
    rssUrl: "https://www.europastar.com/feed/",
    country: "CH", lang: "en",
    color: "#ef4444", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400",
  },
];

export const CATEGORY_CONFIG: Record<NewsCategory, { label: string; color: string; dot: string }> = {
  all:         { label: "Tout",                  color: "text-foreground",   dot: "bg-muted-foreground" },
  collections: { label: "Nouvelles créations",   color: "text-pink-400",     dot: "bg-pink-400" },
  market:      { label: "Marché & Prix",          color: "text-amber-400",    dot: "bg-amber-400" },
  business:    { label: "Industrie & Affaires",   color: "text-blue-400",     dot: "bg-blue-400" },
  watches:     { label: "Horlogerie",             color: "text-indigo-400",   dot: "bg-indigo-400" },
  craft:       { label: "Artisanat & Savoir-faire",color: "text-orange-400",  dot: "bg-orange-400" },
  trends:      { label: "Tendances",              color: "text-violet-400",   dot: "bg-violet-400" },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as NewsCategory[];

// ─────────────────────────────────────────────────────────────────────────────
// Mock articles — replace with real RSS fetch in app/api/rss/route.ts
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: "a1",
    title: "Cartier présente sa collection Panthère de Cartier Été 2026",
    summary: "La maison parisienne dévoile une nouvelle série de pièces emblématiques mettant en scène la panthère signature dans des déclinaisons en or blanc, jaune et rose, ornées de diamants et d'émeraudes de Colombie.",
    sourceId: "journal-luxe", category: "collections",
    tags: ["Cartier", "Haute joaillerie", "Lancement"],
    publishedAt: "2026-03-25T09:30:00Z", url: "#", readingTime: 3,
  },
  {
    id: "a2",
    title: "L'or atteint un record historique à 3 180 $/oz — impact sur la joaillerie",
    summary: "La hausse du cours de l'or pèse sur les marges des joailliers indépendants. Plusieurs grandes maisons ont déjà annoncé des ajustements de prix de 8 à 12 % sur leurs collections printemps-été.",
    sourceId: "national-jeweler", category: "market",
    tags: ["Or", "Prix", "Marchés"],
    publishedAt: "2026-03-25T07:15:00Z", url: "#", readingTime: 4,
  },
  {
    id: "a3",
    title: "Rolex lance la Submariner 41mm en or Everose avec cadran brun",
    summary: "Attendue depuis deux ans par la communauté des collectionneurs, la nouvelle Submariner Ref. 126618 s'offre un cadran brun inédit et un bracelet Oyster affiné. La production limitée est annoncée pour juin 2026.",
    sourceId: "hodinkee", category: "watches",
    tags: ["Rolex", "Submariner", "Nouveau modèle"],
    publishedAt: "2026-03-25T06:00:00Z", url: "#", readingTime: 5,
  },
  {
    id: "a4",
    title: "LVMH Watches & Jewelry : chiffre d'affaires Q1 2026 en hausse de 9 %",
    summary: "Le pôle montres et joaillerie du groupe LVMH affiche une croissance organique de 9 % au premier trimestre 2026, portée par Bulgari et TAG Heuer. La région Asie-Pacifique reste le premier marché avec 38 % des ventes.",
    sourceId: "jck", category: "business",
    tags: ["LVMH", "Résultats", "Bulgari"],
    publishedAt: "2026-03-24T16:45:00Z", url: "#", readingTime: 4,
  },
  {
    id: "a5",
    title: "L'art de la marqueterie de paille appliquée à la haute horlogerie",
    summary: "Audemars Piguet et son atelier d'artisanat genevois explorent une technique ancestrale japonaise de marqueterie de paille de seigle pour habiller les cadrans de la Royal Oak Concept. Un travail qui nécessite 200 heures par pièce.",
    sourceId: "europa-star", category: "craft",
    tags: ["Artisanat", "Audemars Piguet", "Cadran"],
    publishedAt: "2026-03-24T14:00:00Z", url: "#", readingTime: 6,
  },
  {
    id: "a6",
    title: "Tendance 2026 : les bijoux « quiet luxury » dominent le marché du millénial",
    summary: "Discrétion et matières nobles s'imposent dans les préférences des 30-40 ans. Les petites maisons spécialisées dans les pièces épurées en or massif sans diamants enregistrent une croissance de 34 % sur les six derniers mois.",
    sourceId: "pro-jeweller", category: "trends",
    tags: ["Tendance", "Quiet luxury", "Millénials"],
    publishedAt: "2026-03-24T11:30:00Z", url: "#", readingTime: 3,
  },
  {
    id: "a7",
    title: "Boucheron inaugure sa plus grande boutique à Tokyo Ginza",
    summary: "La maison du 26 place Vendôme ouvre un flagship de 600 m² dans le quartier Ginza de Tokyo. Conçu par l'architecte Kengo Kuma, l'espace intègre un salon de joaillerie privé et un atelier de personnalisation à la demande.",
    sourceId: "journal-luxe", category: "business",
    tags: ["Boucheron", "Tokyo", "Flagship"],
    publishedAt: "2026-03-24T08:00:00Z", url: "#", readingTime: 3,
  },
  {
    id: "a8",
    title: "Diamants synthétiques : la part de marché atteint 18 % en Europe en 2025",
    summary: "Selon le dernier rapport Bain & Company, les diamants de synthèse représentent désormais 18 % des ventes en volume sur le marché européen de la joaillerie, contre 11 % en 2023. Les prix continuent de baisser, -22 % sur douze mois.",
    sourceId: "national-jeweler", category: "market",
    tags: ["Diamant synthétique", "CVD", "Marché"],
    publishedAt: "2026-03-23T17:00:00Z", url: "#", readingTime: 5,
  },
  {
    id: "a9",
    title: "Patek Philippe 5726A : la pièce la plus recherchée de la saison chez Christie's",
    summary: "L'Annuelle Calendrier Réf. 5726A en acier a atteint 185 000 CHF lors de la dernière vente Christie's Geneva, soit 3,1 fois son estimation. La demande pour les Patek steel continue de surpasser l'offre disponible.",
    sourceId: "watchpro", category: "watches",
    tags: ["Patek Philippe", "Vente aux enchères", "Annuel Calendar"],
    publishedAt: "2026-03-23T15:30:00Z", url: "#", readingTime: 4,
  },
  {
    id: "a10",
    title: "Van Cleef & Arpels x Hermès : collaboration inédite pour l'automne 2026",
    summary: "Les deux maisons du luxe français s'associent pour une collection capsule de 12 pièces mêlant le cuir d'Hermès et les pierres précieuses de Van Cleef & Arpels. Une première dans l'histoire des deux maisons.",
    sourceId: "officiel-bijou", category: "collections",
    tags: ["Van Cleef", "Hermès", "Collab"],
    publishedAt: "2026-03-23T10:00:00Z", url: "#", readingTime: 3,
  },
  {
    id: "a11",
    title: "Ciselure sur or : comment les artisans de la Place Vendôme transmettent leur savoir",
    summary: "Plongée dans les ateliers secrets du 1er arrondissement parisien où une poignée d'artisans perpétuent les techniques de ciselure à froid sur or 18 carats. Un métier en pénurie que les grandes maisons cherchent à préserver.",
    sourceId: "officiel-bijou", category: "craft",
    tags: ["Ciselure", "Place Vendôme", "Savoir-faire"],
    publishedAt: "2026-03-22T14:00:00Z", url: "#", readingTime: 7,
  },
  {
    id: "a12",
    title: "Swatch Group affiche une baisse de 6 % de ses ventes — le bas de gamme sous pression",
    summary: "Le géant horloger helvétique a publié des résultats 2025 en recul, notamment pour ses marques d'entrée de gamme Tissot et Swatch. La direction pointe la concurrence des smartwatches et la baisse du tourisme chinois.",
    sourceId: "europa-star", category: "business",
    tags: ["Swatch Group", "Résultats", "Horlogerie suisse"],
    publishedAt: "2026-03-22T09:00:00Z", url: "#", readingTime: 4,
  },
  {
    id: "a13",
    title: "Les bagues de fiançailles en saphir : tendance durable ou phénomène éphémère ?",
    summary: "Depuis la bague de Kate Middleton, le saphir bleu royal s'est imposé comme alternative au diamant. Les ventes de bagues de fiançailles sans diamant ont augmenté de 41 % en 2025 selon l'étude GIA.",
    sourceId: "jck", category: "trends",
    tags: ["Saphir", "Fiançailles", "Gemmes colorées"],
    publishedAt: "2026-03-22T07:30:00Z", url: "#", readingTime: 4,
  },
  {
    id: "a14",
    title: "Omega Speedmaster Moonwatch 50e anniversaire de la mission Apollo",
    summary: "Pour marquer les 50 ans d'Apollo-Soyuz, Omega présente une Speedmaster en titane Grade 2, cadran sectoriel gris anthracite et aiguilles luminescentes bleues. Édition limitée à 1975 exemplaires, disponible en juillet.",
    sourceId: "hodinkee", category: "watches",
    tags: ["Omega", "Speedmaster", "Édition limitée"],
    publishedAt: "2026-03-21T18:00:00Z", url: "#", readingTime: 5,
  },
  {
    id: "a15",
    title: "Chanel Fine Jewelry : la direction artistique confiée à Pauline Ducruet",
    summary: "La maison de la rue Cambon a annoncé la nomination de Pauline Ducruet à la direction artistique de sa division joaillerie. L'ancienne créatrice de la marque Alter Designs arrive avec un mandat de modernisation de la ligne N°5.",
    sourceId: "journal-luxe", category: "business",
    tags: ["Chanel", "Direction artistique", "Nomination"],
    publishedAt: "2026-03-21T12:00:00Z", url: "#", readingTime: 3,
  },
  {
    id: "a16",
    title: "Prix des rubis de Birmanie : +28 % en un an sous l'effet des sanctions",
    summary: "Les nouvelles sanctions américaines sur les minerais birmans font flamber le cours des rubis de Mogok, considérés comme les plus beaux au monde. Les joailliers européens se tournent vers les rubis du Mozambique et de Madagascar.",
    sourceId: "pro-jeweller", category: "market",
    tags: ["Rubis", "Birmanie", "Gemmes"],
    publishedAt: "2026-03-21T09:15:00Z", url: "#", readingTime: 5,
  },
  {
    id: "a17",
    title: "La granulation étrusque revisitée par les jeunes créateurs contemporains",
    summary: "Technique vieille de 2 800 ans, la granulation étrusque connaît un regain d'intérêt auprès des orfèvres de la nouvelle génération. Tour d'horizon de cinq créateurs qui réinterprètent ce procédé ancestral avec des matériaux actuels.",
    sourceId: "officiel-bijou", category: "craft",
    tags: ["Granulation", "Étrusque", "Orfèvrerie"],
    publishedAt: "2026-03-20T15:00:00Z", url: "#", readingTime: 6,
  },
  {
    id: "a18",
    title: "Richard Mille RM UP-01 Ferrari : la montre la plus plate du monde entre dans l'Histoire",
    summary: "Avec seulement 1,75 mm d'épaisseur, le calibre RMC1 de la RM UP-01 Ferrari bat un nouveau record mondial. Le prix de départ de 1,8 million d'euros pour cette montre n'a pas empêché les 150 exemplaires prévus d'être réservés en 48h.",
    sourceId: "watchpro", category: "watches",
    tags: ["Richard Mille", "Record", "Ultra-plat"],
    publishedAt: "2026-03-20T11:00:00Z", url: "#", readingTime: 4,
  },
  {
    id: "a19",
    title: "Bulgari ouvre son premier hôtel parisien en intégrant un salon de haute joaillerie",
    summary: "Le groupe LVMH inaugure en mai 2026 le Bulgari Hotel Paris, rue de Rivoli. L'établissement comprend un salon de joaillerie semi-privé sur 300 m² où les clients de l'hôtel peuvent accéder à des pièces exclusives non disponibles en boutique.",
    sourceId: "national-jeweler", category: "business",
    tags: ["Bulgari", "Paris", "Hôtel"],
    publishedAt: "2026-03-19T14:30:00Z", url: "#", readingTime: 3,
  },
  {
    id: "a20",
    title: "Layering de bijoux : comment la tendance superposition s'est imposée durablement",
    summary: "Du streetwear au red carpet, la tendance superposition de colliers, bracelets et bagues s'est définitivement installée dans les usages. Analyse d'un phénomène qui bouste les ventes de pièces d'entrée de gamme des grandes maisons.",
    sourceId: "jck", category: "trends",
    tags: ["Layering", "Tendance", "Superposition"],
    publishedAt: "2026-03-19T09:00:00Z", url: "#", readingTime: 4,
  },
  {
    id: "a21",
    title: "Acqua di Parma lance une ligne de bijoux en olfaction sensorielle",
    summary: "La maison italienne franchit une nouvelle frontière en lançant des bijoux diffuseurs de parfum micro-encapsulé. Ces pièces en argent 925 permettent de porter un sillage olfactif discret pendant 48 heures.",
    sourceId: "pro-jeweller", category: "collections",
    tags: ["Innovation", "Parfum", "Bijoux tech"],
    publishedAt: "2026-03-18T16:00:00Z", url: "#", readingTime: 3,
  },
  {
    id: "a22",
    title: "Platine : la demande industrielle tire les cours vers de nouveaux sommets",
    summary: "La transition énergétique et le développement des piles à hydrogène font exploser la demande en platine. Les joailliers font face à un double phénomène : hausse des prix et réduction de l'offre disponible.",
    sourceId: "europa-star", category: "market",
    tags: ["Platine", "Métaux précieux", "Énergie"],
    publishedAt: "2026-03-18T10:30:00Z", url: "#", readingTime: 5,
  },
  {
    id: "a23",
    title: "WATCHES & WONDERS 2026 : les 10 montres les plus attendues du salon genevois",
    summary: "Du 1er au 7 avril, le salon Watches & Wonders réunit 50 maisons horlogères à Genève. Notre sélection des pièces qui devraient faire sensation : nouveau Lange, Jaeger-LeCoultre Master Ultra Thin Perpetual et Girard-Perregaux Tourbillon.",
    sourceId: "hodinkee", category: "watches",
    tags: ["Watches & Wonders", "Salon", "Genève"],
    publishedAt: "2026-03-17T12:00:00Z", url: "#", readingTime: 7,
  },
  {
    id: "a24",
    title: "Émaillage grand feu sur or : un atelier breton remet l'art en lumière",
    summary: "À Quimper, l'atelier Keranfloc'h perpétue l'émaillage grand feu sur or massif, technique disparue des grandes maisons dans les années 1980. Leurs pièces, produites à 20 exemplaires par an, sont devenues des objets de collection.",
    sourceId: "officiel-bijou", category: "craft",
    tags: ["Émaillage", "Bretagne", "Artisanat"],
    publishedAt: "2026-03-16T14:00:00Z", url: "#", readingTime: 6,
  },
  {
    id: "a25",
    title: "Richemont : Cartier, la locomotive qui tire le groupe suisse vers les sommets",
    summary: "Les résultats semestriels du groupe Richemont confirment la domination de Cartier, qui représente désormais 52 % du chiffre d'affaires total. IWC et Vacheron Constantin enregistrent également des croissances à deux chiffres.",
    sourceId: "watchpro", category: "business",
    tags: ["Richemont", "Cartier", "Résultats"],
    publishedAt: "2026-03-15T08:00:00Z", url: "#", readingTime: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getSource(id: string): NewsSource {
  return NEWS_SOURCES.find((s) => s.id === id) ?? NEWS_SOURCES[0];
}

export function relativeNewsDate(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000); // minutes
  if (diff < 60) return `Il y a ${diff} min`;
  if (diff < 1440) return `Il y a ${Math.floor(diff / 60)}h`;
  if (diff < 2880) return "Hier";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function filterArticles(
  articles: NewsArticle[],
  category: NewsCategory,
  sourceIds: string[],
  search: string
): NewsArticle[] {
  return articles.filter((a) => {
    if (category !== "all" && a.category !== category) return false;
    if (sourceIds.length > 0 && !sourceIds.includes(a.sourceId)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!a.title.toLowerCase().includes(q) && !a.summary.toLowerCase().includes(q) && !a.tags.some((t) => t.toLowerCase().includes(q))) return false;
    }
    return true;
  });
}
