import type { PostType, PostStatus } from "@/lib/instagram-types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CalendarPost {
  id: string;
  date: string;   // "YYYY-MM-DD"
  time: string;   // "HH:MM"
  title: string;
  subtitle?: string;
  type: PostType;
  status: PostStatus;
  tags?: string[];
  engagementRate?: number;
  impressions?: number;
  likes?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns "YYYY-MM-DD" */
export function toKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** First day (Monday-based) of the calendar grid for a given month */
export function getCalendarStart(year: number, month: number): Date {
  const firstOfMonth = new Date(year, month, 1);
  const dow = firstOfMonth.getDay(); // 0=Sun … 6=Sat
  const offset = (dow + 6) % 7;     // shift so Mon=0
  const start = new Date(firstOfMonth);
  start.setDate(start.getDate() - offset);
  return start;
}

/** Builds an array of 42 day objects (6 complete weeks) for the calendar grid */
export function buildCalendarGrid(year: number, month: number): Array<{
  date: Date;
  key: string;
  dayNum: number;
  isCurrentMonth: boolean;
}> {
  const start = getCalendarStart(year, month);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return {
      date: d,
      key: toKey(d),
      dayNum: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
    };
  });
}

/** Formats a date as "lundi 25 mars 2026" */
export function formatLongDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Formats a month as "Mars 2026" */
export function formatMonth(date: Date): string {
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data — Mars / Avril 2026
// ─────────────────────────────────────────────────────────────────────────────

export const CALENDAR_POSTS: CalendarPost[] = [
  // ── Mars — publiés ────────────────────────────────────────────────────────
  {
    id: "cal-1",
    date: "2026-03-01",
    time: "09:00",
    title: "Teaser collection printemps",
    subtitle: "Premier aperçu — ambiance et couleurs de la nouvelle saison",
    type: "Story",
    status: "publie",
    tags: ["Teaser"],
    impressions: 5_840,
    likes: 312,
    engagementRate: 5.3,
  },
  {
    id: "cal-2",
    date: "2026-03-03",
    time: "18:00",
    title: "5 erreurs à éviter quand on achète des bijoux",
    subtitle: "Guide pratique pour nos abonnés — conseils et astuces",
    type: "Carrousel",
    status: "publie",
    tags: ["Éducatif"],
    impressions: 18_430,
    likes: 1_247,
    engagementRate: 8.4,
  },
  {
    id: "cal-3",
    date: "2026-03-03",
    time: "12:00",
    title: "GRWM bijoux soirée",
    subtitle: "Get Ready With Me — look soirée avec nos bestsellers",
    type: "Réel",
    status: "publie",
    tags: ["Lifestyle"],
    impressions: 11_200,
    likes: 820,
    engagementRate: 7.3,
  },
  {
    id: "cal-4",
    date: "2026-03-05",
    time: "15:00",
    title: "Pendentif or blanc 18 carats",
    subtitle: "Photo produit sur fond minimaliste — nouvelle pièce signature",
    type: "Photo",
    status: "publie",
    tags: ["Produit"],
    impressions: 7_300,
    likes: 489,
    engagementRate: 6.7,
  },
  {
    id: "cal-5",
    date: "2026-03-07",
    time: "10:00",
    title: "Séquence BTS shooting",
    subtitle: "Coulisses de notre shooting photo collection printemps",
    type: "Story",
    status: "publie",
    tags: ["BTS"],
    impressions: 4_200,
    likes: 198,
    engagementRate: 4.7,
  },
  {
    id: "cal-6",
    date: "2026-03-08",
    time: "18:00",
    title: "Bague trilogy diamants",
    subtitle: "Zoom sur notre nouvelle bague trilogy — 3 diamants naturels",
    type: "Réel",
    status: "publie",
    tags: ["Produit"],
    impressions: 9_800,
    likes: 734,
    engagementRate: 7.5,
  },
  {
    id: "cal-7",
    date: "2026-03-10",
    time: "12:00",
    title: "Guide entretien des bijoux en or",
    subtitle: "3 astuces simples pour garder vos bijoux comme neufs",
    type: "Carrousel",
    status: "publie",
    tags: ["Éducatif"],
    impressions: 9_650,
    likes: 621,
    engagementRate: 6.4,
  },
  {
    id: "cal-8",
    date: "2026-03-12",
    time: "18:00",
    title: "Collab @bijoux_by_lea",
    subtitle: "Notre partenariat avec @bijoux_by_lea — showcase collection",
    type: "Réel",
    status: "publie",
    tags: ["Collab"],
    impressions: 14_100,
    likes: 1_050,
    engagementRate: 7.4,
  },
  {
    id: "cal-9",
    date: "2026-03-12",
    time: "10:00",
    title: "Chevalière gravée or jaune",
    subtitle: "Nouvelle chevalière personnalisable — gravure offerte",
    type: "Photo",
    status: "publie",
    tags: ["Produit", "Promo"],
    impressions: 6_300,
    likes: 402,
    engagementRate: 6.4,
  },
  {
    id: "cal-10",
    date: "2026-03-14",
    time: "09:00",
    title: "Stories flash — -20% week-end",
    subtitle: "Promotion exclusive valable 48h — codes promo inclus",
    type: "Story",
    status: "publie",
    tags: ["Promo"],
    impressions: 8_400,
    likes: 510,
    engagementRate: 6.1,
  },
  {
    id: "cal-11",
    date: "2026-03-15",
    time: "18:00",
    title: "Tutoriel : superposer les colliers",
    subtitle: "Tendance layering — 3 looks avec nos colliers bestsellers",
    type: "Carrousel",
    status: "publie",
    tags: ["Tendance", "Éducatif"],
    impressions: 12_200,
    likes: 782,
    engagementRate: 6.4,
  },
  {
    id: "cal-12",
    date: "2026-03-17",
    time: "18:00",
    title: "Réel tendance — GRWM bijoux or",
    subtitle: "Tuto layering et association de pièces en or jaune et blanc",
    type: "Réel",
    status: "publie",
    tags: ["Tendance", "Lifestyle"],
    impressions: 10_500,
    likes: 698,
    engagementRate: 6.6,
  },
  {
    id: "cal-13",
    date: "2026-03-17",
    time: "09:30",
    title: "Behind the scenes — atelier",
    subtitle: "Visite de notre atelier de joaillerie parisien",
    type: "Story",
    status: "publie",
    tags: ["BTS"],
    impressions: 5_100,
    likes: 270,
    engagementRate: 5.3,
  },
  {
    id: "cal-14",
    date: "2026-03-19",
    time: "15:00",
    title: "Alliance solitaire platine",
    subtitle: "Zoom sur notre alliance solitaire en platine 950 — diamant 0.5ct",
    type: "Photo",
    status: "publie",
    tags: ["Produit"],
    impressions: 7_800,
    likes: 523,
    engagementRate: 6.7,
  },
  {
    id: "cal-15",
    date: "2026-03-21",
    time: "18:00",
    title: "Histoire de la joaillerie française",
    subtitle: "500 ans de savoir-faire — de Versailles à aujourd'hui",
    type: "Carrousel",
    status: "publie",
    tags: ["Éducatif"],
    impressions: 11_000,
    likes: 730,
    engagementRate: 6.6,
  },
  {
    id: "cal-16",
    date: "2026-03-21",
    time: "10:00",
    title: "Séquence engagement — témoignages",
    subtitle: "Vos plus belles demandes en mariage avec nos bagues",
    type: "Story",
    status: "publie",
    tags: ["UGC"],
    impressions: 6_700,
    likes: 390,
    engagementRate: 5.8,
  },
  {
    id: "cal-17",
    date: "2026-03-22",
    time: "18:00",
    title: "Unboxing collection printemps 2026",
    subtitle: "Découvrez toutes les nouvelles pièces — édition limitée",
    type: "Réel",
    status: "publie",
    tags: ["Produit", "Unboxing"],
    impressions: 14_810,
    likes: 943,
    engagementRate: 7.1,
  },
  {
    id: "cal-18",
    date: "2026-03-24",
    time: "09:00",
    title: "Séquence promo — soldes printemps",
    subtitle: "5 stories animées — codes promo et sélection produits",
    type: "Story",
    status: "publie",
    tags: ["Promo"],
    impressions: 7_340,
    likes: 312,
    engagementRate: 5.5,
  },
  {
    id: "cal-19",
    date: "2026-03-24",
    time: "15:00",
    title: "Earrings dormeuses or rose",
    subtitle: "Nouvelle collection dormeuses — 3 tailles disponibles",
    type: "Photo",
    status: "publie",
    tags: ["Produit"],
    impressions: 6_900,
    likes: 445,
    engagementRate: 6.4,
  },
  {
    id: "cal-20",
    date: "2026-03-25",
    time: "18:00",
    title: "Réel J'ai testé 30 bijoux en 30 jours",
    subtitle: "Bilan de mon défi bijoux quotidiens — les pièces incontournables",
    type: "Réel",
    status: "publie",
    tags: ["Challenge"],
    impressions: 13_400,
    likes: 889,
    engagementRate: 7.2,
  },
  // ── Mars — programmés ─────────────────────────────────────────────────────
  {
    id: "cal-21",
    date: "2026-03-26",
    time: "18:00",
    title: "5 erreurs bijoux — suite & fin",
    subtitle: "Volume 2 : erreurs d'entretien et de conservation",
    type: "Carrousel",
    status: "programme",
    tags: ["Éducatif"],
  },
  {
    id: "cal-22",
    date: "2026-03-28",
    time: "18:00",
    title: "GRWM mariage — look complet",
    subtitle: "Bijoux de mariage du matin au soir — notre sélection",
    type: "Réel",
    status: "programme",
    tags: ["Mariage", "Lifestyle"],
  },
  {
    id: "cal-23",
    date: "2026-03-28",
    time: "10:00",
    title: "Compte à rebours — nouvelle collection",
    subtitle: "J-3 avant le lancement de la collection Été 2026",
    type: "Story",
    status: "programme",
    tags: ["Teaser"],
  },
  {
    id: "cal-24",
    date: "2026-03-29",
    time: "15:00",
    title: "Sautoir perles de culture",
    subtitle: "Notre sautoir signatures — perles Akoya 8-9mm",
    type: "Photo",
    status: "programme",
    tags: ["Produit"],
  },
  {
    id: "cal-25",
    date: "2026-03-31",
    time: "18:00",
    title: "Récap mars — nos coups de cœur",
    subtitle: "Les 5 pièces les plus aimées du mois par notre communauté",
    type: "Carrousel",
    status: "programme",
    tags: ["Récap"],
  },
  // ── Avril — programmés ────────────────────────────────────────────────────
  {
    id: "cal-26",
    date: "2026-04-01",
    time: "12:00",
    title: "Lancement collection Été 2026",
    subtitle: "Découvrez nos 12 nouvelles pièces — inspirées de la Méditerranée",
    type: "Réel",
    status: "programme",
    tags: ["Lancement"],
  },
  {
    id: "cal-27",
    date: "2026-04-02",
    time: "09:00",
    title: "Stories lancement — coulisses",
    subtitle: "Révélation progressive des pièces de la nouvelle collection",
    type: "Story",
    status: "programme",
    tags: ["Lancement", "BTS"],
  },
  {
    id: "cal-28",
    date: "2026-04-03",
    time: "18:00",
    title: "Tendances joaillerie printemps 2026",
    subtitle: "Les 7 tendances incontournables de la saison — guide complet",
    type: "Carrousel",
    status: "programme",
    tags: ["Tendance", "Éducatif"],
  },
  {
    id: "cal-29",
    date: "2026-04-05",
    time: "15:00",
    title: "Bracelet jonc or — 5 façons de le porter",
    subtitle: "Styling tips pour porter notre jonc signature au quotidien",
    type: "Photo",
    status: "programme",
    tags: ["Tendance"],
  },
  {
    id: "cal-30",
    date: "2026-04-07",
    time: "18:00",
    title: "Interview — notre artisan joaillier",
    subtitle: "Rencontre avec Jean-Paul, créateur de nos pièces signature depuis 1998",
    type: "Réel",
    status: "programme",
    tags: ["BTS", "Artisan"],
  },
];

/** Returns posts grouped by date key */
export function groupByDate(posts: CalendarPost[]): Record<string, CalendarPost[]> {
  return posts.reduce((acc, post) => {
    if (!acc[post.date]) acc[post.date] = [];
    acc[post.date].push(post);
    return acc;
  }, {} as Record<string, CalendarPost[]>);
}
