// ─────────────────────────────────────────────────────────────────────────────
// Platform configuration
// ─────────────────────────────────────────────────────────────────────────────

export type Platform = "instagram" | "tiktok" | "youtube" | "twitter" | "facebook";

export const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; color: string; bg: string; border: string; text: string; dot: string }
> = {
  instagram: {
    label: "Instagram",
    color: "#e1306c",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-400",
    dot: "bg-pink-400",
  },
  tiktok: {
    label: "TikTok",
    color: "#69c9d0",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    text: "text-sky-400",
    dot: "bg-sky-400",
  },
  youtube: {
    label: "YouTube",
    color: "#ff0000",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-400",
  },
  twitter: {
    label: "Twitter / X",
    color: "#1d9bf0",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    text: "text-slate-300",
    dot: "bg-slate-400",
  },
  facebook: {
    label: "Facebook",
    color: "#1877f2",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
};

export const ALL_PLATFORMS = Object.keys(PLATFORM_CONFIG) as Platform[];

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface RecentPost {
  id: string;
  type: "video" | "image" | "carousel" | "reel" | "short";
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  date: string;
  engagementRate: number;
}

export interface PlatformData {
  platform: Platform;
  handle: string;
  verified: boolean;
  followers: number;
  following: number;
  postsCount: number;
  avgEngagementRate: number;
  avgLikes: number;
  avgComments: number;
  postsPerMonth: number;
  lastPostDate: string;
  /** 12 weekly follower snapshots (oldest → newest) */
  growthHistory: number[];
  recentPosts: RecentPost[];
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  initials: string;
  gradient: string;
  category: string;
  notes?: string;
  addedAt: string;
  platforms: PlatformData[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function totalFollowers(c: Competitor): number {
  return c.platforms.reduce((s, p) => s + p.followers, 0);
}

export function bestEngagement(c: Competitor): number {
  return Math.max(...c.platforms.map((p) => p.avgEngagementRate));
}

export function totalPostsPerMonth(c: Competitor): number {
  return c.platforms.reduce((s, p) => s + p.postsPerMonth, 0);
}

export function growth30d(c: Competitor): number {
  const bests = c.platforms.map((p) => {
    const h = p.growthHistory;
    if (h.length < 5) return 0;
    const now = h[h.length - 1];
    const past = h[h.length - 5]; // ~4 weeks ago
    return past > 0 ? ((now - past) / past) * 100 : 0;
  });
  return Math.max(...bests);
}

export function lastPost(c: Competitor): string {
  return c.platforms
    .map((p) => p.lastPostDate)
    .sort()
    .reverse()[0];
}

export function relativeDate(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return `Il y a ${diff}j`;
  if (diff < 30) return `Il y a ${Math.floor(diff / 7)}sem`;
  return `Il y a ${Math.floor(diff / 30)}mois`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data — 7 competitors, jewellery / luxury niche
//
// Real data sources to replace mocks:
//   Instagram  → Instagram Graph API  (public endpoint: /<username>?fields=...)
//   TikTok     → TikTok for Developers Research API
//   YouTube    → YouTube Data API v3  GET /channels?part=statistics
//   Twitter/X  → Twitter API v2       GET /users/by/username/:username
//   Facebook   → Meta Graph API       GET /v19.0/<page-id>?fields=...
// ─────────────────────────────────────────────────────────────────────────────

export const INITIAL_COMPETITORS: Competitor[] = [
  // ── 1 ────────────────────────────────────────────────────────────────────
  {
    id: "c1",
    name: "Bijoux Luxe Paris",
    handle: "@bijoux_luxe_paris",
    initials: "BL",
    gradient: "from-amber-500 to-yellow-400",
    category: "Bijoux · Luxe",
    addedAt: "2026-01-10",
    platforms: [
      {
        platform: "instagram",
        handle: "@bijoux_luxe_paris",
        verified: false,
        followers: 48_200,
        following: 892,
        postsCount: 1_247,
        avgEngagementRate: 3.8,
        avgLikes: 1_834,
        avgComments: 67,
        postsPerMonth: 14,
        lastPostDate: "2026-03-25",
        growthHistory: [44_100, 44_600, 45_000, 45_400, 45_900, 46_200, 46_700, 47_100, 47_400, 47_700, 47_950, 48_200],
        recentPosts: [
          { id: "r1", type: "reel", caption: "Collection printemps — sneak peek ✨", likes: 2_341, comments: 89, shares: 210, views: 28_400, date: "2026-03-25", engagementRate: 4.9 },
          { id: "r2", type: "carousel", caption: "5 façons de porter votre jonc or", likes: 1_820, comments: 64, shares: 145, date: "2026-03-22", engagementRate: 4.1 },
          { id: "r3", type: "image", caption: "Bague saphir — nouvelle pièce", likes: 1_560, comments: 51, shares: 98, date: "2026-03-19", engagementRate: 3.7 },
        ],
      },
      {
        platform: "tiktok",
        handle: "@bijoux_luxe_paris",
        verified: false,
        followers: 32_500,
        following: 213,
        postsCount: 345,
        avgEngagementRate: 5.2,
        avgLikes: 1_690,
        avgComments: 92,
        postsPerMonth: 10,
        lastPostDate: "2026-03-24",
        growthHistory: [27_100, 27_800, 28_500, 29_100, 29_900, 30_400, 30_900, 31_400, 31_900, 32_100, 32_300, 32_500],
        recentPosts: [
          { id: "t1", type: "short", caption: "GRWM bijoux soirée 💍", likes: 4_100, comments: 213, shares: 890, views: 91_200, date: "2026-03-24", engagementRate: 6.2 },
          { id: "t2", type: "video", caption: "Unboxing ma nouvelle collection", likes: 2_800, comments: 145, shares: 412, views: 65_000, date: "2026-03-20", engagementRate: 5.8 },
        ],
      },
    ],
  },

  // ── 2 ────────────────────────────────────────────────────────────────────
  {
    id: "c2",
    name: "Or & Argent France",
    handle: "@or_et_argent_france",
    initials: "OA",
    gradient: "from-slate-400 to-zinc-300",
    category: "Bijoux · Artisanat",
    addedAt: "2026-01-15",
    platforms: [
      {
        platform: "instagram",
        handle: "@or_et_argent_france",
        verified: false,
        followers: 31_500,
        following: 1_102,
        postsCount: 987,
        avgEngagementRate: 5.2,
        avgLikes: 1_638,
        avgComments: 78,
        postsPerMonth: 22,
        lastPostDate: "2026-03-25",
        growthHistory: [30_800, 30_900, 31_000, 31_100, 31_100, 31_200, 31_200, 31_300, 31_350, 31_400, 31_450, 31_500],
        recentPosts: [
          { id: "oa1", type: "image", caption: "Artisanat local — pièce unique", likes: 1_920, comments: 92, shares: 130, date: "2026-03-25", engagementRate: 6.4 },
          { id: "oa2", type: "reel", caption: "Fabrication d'un collier en or", likes: 2_300, comments: 110, shares: 210, views: 32_000, date: "2026-03-23", engagementRate: 7.1 },
          { id: "oa3", type: "carousel", caption: "Entretien de vos bijoux en argent", likes: 1_540, comments: 61, shares: 95, date: "2026-03-21", engagementRate: 5.3 },
        ],
      },
      {
        platform: "youtube",
        handle: "OrEtArgentFrance",
        verified: false,
        followers: 18_700,
        following: 0,
        postsCount: 124,
        avgEngagementRate: 4.1,
        avgLikes: 767,
        avgComments: 148,
        postsPerMonth: 4,
        lastPostDate: "2026-03-18",
        growthHistory: [17_200, 17_400, 17_600, 17_800, 17_900, 18_000, 18_100, 18_200, 18_350, 18_500, 18_600, 18_700],
        recentPosts: [
          { id: "yt1", type: "video", caption: "Tuto : créer une bague en argent chez soi", likes: 1_240, comments: 287, shares: 89, views: 42_000, date: "2026-03-18", engagementRate: 4.8 },
          { id: "yt2", type: "video", caption: "Histoire de l'orfèvrerie française", likes: 890, comments: 198, shares: 56, views: 31_500, date: "2026-03-05", engagementRate: 4.0 },
        ],
      },
    ],
  },

  // ── 3 ────────────────────────────────────────────────────────────────────
  {
    id: "c3",
    name: "Maison Joaillerie",
    handle: "@maison_joaillerie",
    initials: "MJ",
    gradient: "from-rose-600 to-pink-500",
    category: "Joaillerie · Luxe",
    addedAt: "2026-01-20",
    platforms: [
      {
        platform: "instagram",
        handle: "@maison_joaillerie",
        verified: true,
        followers: 62_100,
        following: 312,
        postsCount: 2_104,
        avgEngagementRate: 2.9,
        avgLikes: 1_801,
        avgComments: 52,
        postsPerMonth: 8,
        lastPostDate: "2026-03-23",
        growthHistory: [63_800, 63_600, 63_400, 63_200, 63_000, 62_800, 62_700, 62_500, 62_400, 62_300, 62_200, 62_100],
        recentPosts: [
          { id: "mj1", type: "image", caption: "Collier diamants — édition limitée", likes: 2_100, comments: 62, shares: 89, date: "2026-03-23", engagementRate: 3.6 },
          { id: "mj2", type: "carousel", caption: "Notre histoire — 80 ans de joaillerie", likes: 1_780, comments: 48, shares: 67, date: "2026-03-20", engagementRate: 2.9 },
        ],
      },
      {
        platform: "twitter",
        handle: "@maison_joaillerie",
        verified: true,
        followers: 8_400,
        following: 240,
        postsCount: 3_210,
        avgEngagementRate: 1.2,
        avgLikes: 101,
        avgComments: 18,
        postsPerMonth: 20,
        lastPostDate: "2026-03-25",
        growthHistory: [8_600, 8_580, 8_570, 8_555, 8_540, 8_520, 8_500, 8_490, 8_470, 8_450, 8_430, 8_400],
        recentPosts: [
          { id: "tw1", type: "image", caption: "Notre nouvelle vitrine Faubourg Saint-Honoré", likes: 124, comments: 21, shares: 34, date: "2026-03-25", engagementRate: 2.1 },
        ],
      },
    ],
  },

  // ── 4 ────────────────────────────────────────────────────────────────────
  {
    id: "c4",
    name: "Tendance Bijoux FR",
    handle: "@tendance_bijoux_fr",
    initials: "TB",
    gradient: "from-violet-600 to-purple-400",
    category: "Bijoux · Mode · Tendance",
    notes: "Croissance rapide — forte présence TikTok",
    addedAt: "2026-02-01",
    platforms: [
      {
        platform: "instagram",
        handle: "@tendance_bijoux_fr",
        verified: false,
        followers: 19_700,
        following: 2_104,
        postsCount: 634,
        avgEngagementRate: 6.4,
        avgLikes: 1_261,
        avgComments: 98,
        postsPerMonth: 31,
        lastPostDate: "2026-03-25",
        growthHistory: [15_200, 15_800, 16_300, 16_900, 17_400, 17_800, 18_100, 18_500, 18_900, 19_200, 19_450, 19_700],
        recentPosts: [
          { id: "tb1", type: "reel", caption: "Tendance 2026 : le retour des dormeuses", likes: 3_120, comments: 178, shares: 390, views: 51_000, date: "2026-03-25", engagementRate: 8.2 },
          { id: "tb2", type: "carousel", caption: "5 bijoux tendance à avoir cet été", likes: 1_980, comments: 122, shares: 245, date: "2026-03-24", engagementRate: 6.9 },
          { id: "tb3", type: "reel", caption: "Stack de bracelets — comment composer ?", likes: 2_100, comments: 143, shares: 312, views: 38_000, date: "2026-03-22", engagementRate: 7.1 },
        ],
      },
      {
        platform: "tiktok",
        handle: "@tendance_bijoux_fr",
        verified: false,
        followers: 24_100,
        following: 510,
        postsCount: 421,
        avgEngagementRate: 7.8,
        avgLikes: 1_880,
        avgComments: 145,
        postsPerMonth: 28,
        lastPostDate: "2026-03-25",
        growthHistory: [14_800, 15_900, 17_100, 18_200, 19_400, 20_300, 21_100, 21_900, 22_600, 23_200, 23_700, 24_100],
        recentPosts: [
          { id: "tt1", type: "short", caption: "#bijoux tendance printemps 2026", likes: 8_900, comments: 432, shares: 1_200, views: 198_000, date: "2026-03-25", engagementRate: 10.2 },
          { id: "tt2", type: "video", caption: "POV : tu commandes sur notre boutique", likes: 6_700, comments: 312, shares: 890, views: 142_000, date: "2026-03-24", engagementRate: 9.1 },
        ],
      },
    ],
  },

  // ── 5 ────────────────────────────────────────────────────────────────────
  {
    id: "c5",
    name: "Joaillerie Parisienne",
    handle: "@joaillerie_parisienne",
    initials: "JP",
    gradient: "from-cyan-500 to-teal-400",
    category: "Joaillerie · Paris",
    addedAt: "2026-02-10",
    platforms: [
      {
        platform: "instagram",
        handle: "@joaillerie_parisienne",
        verified: false,
        followers: 27_300,
        following: 678,
        postsCount: 812,
        avgEngagementRate: 4.5,
        avgLikes: 1_229,
        avgComments: 59,
        postsPerMonth: 12,
        lastPostDate: "2026-03-24",
        growthHistory: [25_100, 25_400, 25_700, 25_900, 26_200, 26_400, 26_600, 26_800, 27_000, 27_100, 27_200, 27_300],
        recentPosts: [
          { id: "jp1", type: "image", caption: "Fenêtre sur cours — atelier Marais", likes: 1_420, comments: 67, shares: 89, date: "2026-03-24", engagementRate: 5.1 },
          { id: "jp2", type: "reel", caption: "Création d'un pendentif sur mesure", likes: 2_180, comments: 98, shares: 167, views: 28_700, date: "2026-03-21", engagementRate: 6.5 },
          { id: "jp3", type: "carousel", caption: "Collection Île de France — 12 pièces", likes: 1_080, comments: 43, shares: 71, date: "2026-03-18", engagementRate: 4.0 },
        ],
      },
    ],
  },

  // ── 6 ────────────────────────────────────────────────────────────────────
  {
    id: "c6",
    name: "Les Bijoux Artisan",
    handle: "@les_bijoux_artisan",
    initials: "BA",
    gradient: "from-emerald-500 to-green-400",
    category: "Artisanat · Créateurs",
    addedAt: "2026-02-15",
    platforms: [
      {
        platform: "instagram",
        handle: "@les_bijoux_artisan",
        verified: false,
        followers: 14_800,
        following: 1_890,
        postsCount: 523,
        avgEngagementRate: 7.1,
        avgLikes: 1_051,
        avgComments: 87,
        postsPerMonth: 19,
        lastPostDate: "2026-03-25",
        growthHistory: [13_900, 14_000, 14_100, 14_100, 14_200, 14_300, 14_400, 14_500, 14_600, 14_700, 14_750, 14_800],
        recentPosts: [
          { id: "ba1", type: "reel", caption: "Ma technique de ciselure sur argent", likes: 2_400, comments: 134, shares: 210, views: 44_000, date: "2026-03-25", engagementRate: 8.9 },
          { id: "ba2", type: "image", caption: "Créations du mois — sélection mars", likes: 980, comments: 72, shares: 88, date: "2026-03-23", engagementRate: 6.1 },
        ],
      },
      {
        platform: "youtube",
        handle: "LesBijouxArtisan",
        verified: false,
        followers: 9_200,
        following: 0,
        postsCount: 87,
        avgEngagementRate: 5.8,
        avgLikes: 534,
        avgComments: 201,
        postsPerMonth: 3,
        lastPostDate: "2026-03-15",
        growthHistory: [8_100, 8_200, 8_300, 8_450, 8_550, 8_650, 8_750, 8_850, 8_950, 9_050, 9_150, 9_200],
        recentPosts: [
          { id: "yt2", type: "video", caption: "Comment créer une bague en or — cours complet", likes: 1_100, comments: 312, shares: 78, views: 28_000, date: "2026-03-15", engagementRate: 6.2 },
        ],
      },
    ],
  },

  // ── 7 ────────────────────────────────────────────────────────────────────
  {
    id: "c7",
    name: "Luxury Gems Paris",
    handle: "@luxury_gems_paris",
    initials: "LG",
    gradient: "from-indigo-500 to-blue-400",
    category: "Bijoux · High-end",
    notes: "Concurrent direct — surveiller les lancements",
    addedAt: "2026-03-01",
    platforms: [
      {
        platform: "instagram",
        handle: "@luxury_gems_paris",
        verified: true,
        followers: 38_900,
        following: 421,
        postsCount: 1_890,
        avgEngagementRate: 4.2,
        avgLikes: 1_634,
        avgComments: 78,
        postsPerMonth: 18,
        lastPostDate: "2026-03-25",
        growthHistory: [33_200, 34_000, 34_800, 35_500, 36_100, 36_700, 37_200, 37_700, 38_100, 38_400, 38_700, 38_900],
        recentPosts: [
          { id: "lg1", type: "reel", caption: "Parure diamants noirs — édition limitée", likes: 3_400, comments: 124, shares: 289, views: 62_000, date: "2026-03-25", engagementRate: 5.2 },
          { id: "lg2", type: "carousel", caption: "Sélection printemps 2026 — 15 pièces", likes: 2_100, comments: 67, shares: 189, date: "2026-03-23", engagementRate: 3.8 },
          { id: "lg3", type: "image", caption: "Boucles d'oreilles émeraude — nouvelle collection", likes: 1_890, comments: 54, shares: 123, date: "2026-03-21", engagementRate: 3.5 },
        ],
      },
      {
        platform: "tiktok",
        handle: "@luxury_gems_paris",
        verified: true,
        followers: 41_200,
        following: 89,
        postsCount: 234,
        avgEngagementRate: 6.1,
        avgLikes: 2_513,
        avgComments: 198,
        postsPerMonth: 12,
        lastPostDate: "2026-03-24",
        growthHistory: [28_100, 29_800, 31_200, 32_500, 33_800, 35_000, 36_200, 37_400, 38_500, 39_500, 40_400, 41_200],
        recentPosts: [
          { id: "lt1", type: "short", caption: "Parure diamants sous 360° 💎", likes: 12_400, comments: 567, shares: 2_100, views: 312_000, date: "2026-03-24", engagementRate: 9.3 },
        ],
      },
      {
        platform: "twitter",
        handle: "@luxury_gems_paris",
        verified: true,
        followers: 5_600,
        following: 182,
        postsCount: 1_240,
        avgEngagementRate: 2.1,
        avgLikes: 118,
        avgComments: 24,
        postsPerMonth: 15,
        lastPostDate: "2026-03-25",
        growthHistory: [4_800, 4_900, 4_950, 5_000, 5_100, 5_200, 5_250, 5_300, 5_380, 5_450, 5_530, 5_600],
        recentPosts: [
          { id: "lt2", type: "image", caption: "Notre nouvelle boutique Vendôme est ouverte !", likes: 312, comments: 45, shares: 89, date: "2026-03-25", engagementRate: 3.1 },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sort helpers
// ─────────────────────────────────────────────────────────────────────────────

export type SortKey =
  | "name"
  | "followers"
  | "engagement"
  | "posts_per_month"
  | "growth"
  | "last_post";

export type SortDir = "asc" | "desc";

export function sortCompetitors(
  list: Competitor[],
  key: SortKey,
  dir: SortDir
): Competitor[] {
  const sorted = [...list].sort((a, b) => {
    let va: number | string;
    let vb: number | string;
    switch (key) {
      case "name":
        va = a.name.toLowerCase();
        vb = b.name.toLowerCase();
        break;
      case "followers":
        va = totalFollowers(a);
        vb = totalFollowers(b);
        break;
      case "engagement":
        va = bestEngagement(a);
        vb = bestEngagement(b);
        break;
      case "posts_per_month":
        va = totalPostsPerMonth(a);
        vb = totalPostsPerMonth(b);
        break;
      case "growth":
        va = growth30d(a);
        vb = growth30d(b);
        break;
      case "last_post":
        va = lastPost(a);
        vb = lastPost(b);
        break;
    }
    if (va < vb) return dir === "asc" ? -1 : 1;
    if (va > vb) return dir === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}
