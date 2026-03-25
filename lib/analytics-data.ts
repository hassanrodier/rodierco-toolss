// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DailyMetric {
  date: string; // "YYYY-MM-DD"
  label: string; // "1 Mar"
  value: number;
}

export interface PostPerformance {
  id: string;
  title: string;
  type: "Réel" | "Carrousel" | "Story" | "Photo";
  date: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
  coverColor: string;
}

export interface AnalyticsSummary {
  impressions: { total: number; change: number; changeType: "up" | "down" | "flat" };
  engagementRate: { value: number; change: number; changeType: "up" | "down" | "flat" };
  followers: { total: number; change: number; growth: number; changeType: "up" | "down" | "flat" };
  reach: { total: number; change: number; changeType: "up" | "down" | "flat" };
}

export type DateRange = "7d" | "14d" | "30d" | "90d" | "custom";

export interface DateRangeValue {
  preset: DateRange;
  start: string;
  end: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function formatLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data generator — mirrors Metricool API response structure
// Replace each function with a real fetch() call to Metricool API:
//   GET https://app.metricool.com/api/v2/analytics/stats
//   GET https://app.metricool.com/api/v2/analytics/evolution
//   GET https://app.metricool.com/api/v2/posts/best
// Auth: Authorization: Bearer <METRICOOL_API_TOKEN>
// ─────────────────────────────────────────────────────────────────────────────

export function generateImpressions(start: string, end: string): DailyMetric[] {
  const rand = seededRandom(42);
  const result: DailyMetric[] = [];
  let cur = start;
  while (cur <= end) {
    const base = 4500 + rand() * 8000;
    const weekend = new Date(cur).getDay() % 6 === 0 ? 0.6 : 1;
    result.push({
      date: cur,
      label: formatLabel(cur),
      value: Math.round(base * weekend),
    });
    cur = addDays(cur, 1);
  }
  return result;
}

export function generateEngagement(start: string, end: string): DailyMetric[] {
  const rand = seededRandom(77);
  const result: DailyMetric[] = [];
  let cur = start;
  let trend = 3.8;
  while (cur <= end) {
    trend += (rand() - 0.48) * 0.3;
    trend = Math.max(1.5, Math.min(8.5, trend));
    result.push({
      date: cur,
      label: formatLabel(cur),
      value: parseFloat(trend.toFixed(2)),
    });
    cur = addDays(cur, 1);
  }
  return result;
}

export function generateFollowers(start: string, end: string): DailyMetric[] {
  const rand = seededRandom(13);
  const result: DailyMetric[] = [];
  let cur = start;
  let count = 23_200;
  while (cur <= end) {
    count += Math.round(rand() * 80 - 5);
    result.push({
      date: cur,
      label: formatLabel(cur),
      value: count,
    });
    cur = addDays(cur, 1);
  }
  return result;
}

export function generateReach(start: string, end: string): DailyMetric[] {
  const rand = seededRandom(99);
  const result: DailyMetric[] = [];
  let cur = start;
  while (cur <= end) {
    const base = 3000 + rand() * 5500;
    const weekend = new Date(cur).getDay() % 6 === 0 ? 0.7 : 1;
    result.push({
      date: cur,
      label: formatLabel(cur),
      value: Math.round(base * weekend),
    });
    cur = addDays(cur, 1);
  }
  return result;
}

export function computeSummary(
  impressions: DailyMetric[],
  engagement: DailyMetric[],
  followers: DailyMetric[]
): AnalyticsSummary {
  const totalImpr = impressions.reduce((s, d) => s + d.value, 0);
  const prevImpr = Math.round(totalImpr * 0.85);
  const avgEngage = engagement.reduce((s, d) => s + d.value, 0) / (engagement.length || 1);
  const prevEngage = avgEngage * 0.94;
  const lastFollowers = followers[followers.length - 1]?.value ?? 24_800;
  const firstFollowers = followers[0]?.value ?? 23_200;
  const followerGrowth = lastFollowers - firstFollowers;
  const totalReach = Math.round(totalImpr * 0.72);
  const prevReach = Math.round(totalReach * 0.88);

  return {
    impressions: {
      total: totalImpr,
      change: Math.round(((totalImpr - prevImpr) / prevImpr) * 100),
      changeType: "up",
    },
    engagementRate: {
      value: parseFloat(avgEngage.toFixed(2)),
      change: parseFloat(((avgEngage - prevEngage) / prevEngage * 100).toFixed(1)),
      changeType: avgEngage >= prevEngage ? "up" : "down",
    },
    followers: {
      total: lastFollowers,
      change: followerGrowth,
      growth: parseFloat(((followerGrowth / firstFollowers) * 100).toFixed(1)),
      changeType: followerGrowth >= 0 ? "up" : "down",
    },
    reach: {
      total: totalReach,
      change: Math.round(((totalReach - prevReach) / prevReach) * 100),
      changeType: "up",
    },
  };
}

export const TOP_POSTS: PostPerformance[] = [
  {
    id: "1",
    title: "5 erreurs à éviter quand on achète des bijoux",
    type: "Carrousel",
    date: "2026-03-18",
    impressions: 18_430,
    reach: 14_200,
    likes: 1_247,
    comments: 89,
    shares: 312,
    saves: 547,
    engagementRate: 8.4,
    coverColor: "from-violet-500 to-purple-600",
  },
  {
    id: "2",
    title: "Unboxing collection printemps 2026",
    type: "Réel",
    date: "2026-03-22",
    impressions: 14_810,
    reach: 11_400,
    likes: 943,
    comments: 63,
    shares: 218,
    saves: 189,
    engagementRate: 7.1,
    coverColor: "from-pink-500 to-rose-600",
  },
  {
    id: "3",
    title: "Tutoriel : superposer les colliers",
    type: "Réel",
    date: "2026-03-10",
    impressions: 12_200,
    reach: 9_800,
    likes: 782,
    comments: 54,
    shares: 178,
    saves: 421,
    engagementRate: 6.6,
    coverColor: "from-pink-500 to-orange-500",
  },
  {
    id: "4",
    title: "Guide entretien des bijoux en or",
    type: "Carrousel",
    date: "2026-03-05",
    impressions: 9_650,
    reach: 7_900,
    likes: 621,
    comments: 48,
    shares: 197,
    saves: 389,
    engagementRate: 6.2,
    coverColor: "from-amber-500 to-yellow-500",
  },
  {
    id: "5",
    title: "Séquence stories — Soldes printemps",
    type: "Story",
    date: "2026-03-24",
    impressions: 7_340,
    reach: 6_100,
    likes: 312,
    comments: 28,
    shares: 84,
    saves: 56,
    engagementRate: 5.5,
    coverColor: "from-blue-500 to-cyan-500",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Metricool Service stub — swap mock calls with real fetch calls
// ─────────────────────────────────────────────────────────────────────────────
// const METRICOOL_BASE = "https://app.metricool.com/api/v2";
//
// async function metricoolFetch(path: string, token: string) {
//   const res = await fetch(`${METRICOOL_BASE}${path}`, {
//     headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//   });
//   if (!res.ok) throw new Error(`Metricool API error: ${res.status}`);
//   return res.json();
// }
//
// export async function getMetricoolAnalytics(token: string, start: string, end: string) {
//   const [stats, evolution, best] = await Promise.all([
//     metricoolFetch(`/analytics/stats?from=${start}&to=${end}&platform=instagram`, token),
//     metricoolFetch(`/analytics/evolution?from=${start}&to=${end}&platform=instagram`, token),
//     metricoolFetch(`/posts/best?from=${start}&to=${end}&platform=instagram&limit=5`, token),
//   ]);
//   return { stats, evolution, best };
// }
