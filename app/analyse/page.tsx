"use client";

import { useState, useMemo } from "react";
import {
  BarChart3,
  Eye,
  Heart,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Video,
  Layers,
  Clock,
  Image as ImageIcon,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { BarChart } from "@/components/analytics/bar-chart";
import { AreaChart } from "@/components/analytics/area-chart";
import { DateRangePicker, buildRange } from "@/components/analytics/date-range-picker";
import {
  generateImpressions,
  generateEngagement,
  generateFollowers,
  generateReach,
  computeSummary,
  TOP_POSTS,
  type DateRangeValue,
  type PostPerformance,
} from "@/lib/analytics-data";
import { cn } from "@/lib/utils";

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtNum(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString("fr-FR");
}

function fmtPct(v: number) {
  return `${v.toFixed(2)}%`;
}

const POST_TYPE_CONFIG = {
  Réel: { icon: Video, color: "text-pink-400", bg: "bg-pink-400/10", dot: "bg-pink-400" },
  Carrousel: { icon: Layers, color: "text-violet-400", bg: "bg-violet-400/10", dot: "bg-violet-400" },
  Story: { icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
  Photo: { icon: ImageIcon, color: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
};

// ── KPI Card ──────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  changeType: "up" | "down" | "flat";
  changeSuffix?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  accentColor: string;
}

function KpiCard({ label, value, change, changeType, changeSuffix = "%", icon: Icon, iconColor, iconBg, accentColor }: KpiCardProps) {
  const TrendIcon = changeType === "up" ? TrendingUp : changeType === "down" ? TrendingDown : Minus;
  const trendColor = changeType === "up" ? "text-emerald-400" : changeType === "down" ? "text-red-400" : "text-muted-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 hover:border-primary/20 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{label}</p>
        <div className={cn("flex items-center justify-center w-9 h-9 rounded-xl", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
        <div className={cn("flex items-center gap-1 mt-2", trendColor)}>
          <TrendIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs font-medium">
            {changeType === "up" ? "+" : ""}{change}{changeSuffix} vs période précédente
          </span>
        </div>
      </div>
      {/* Micro sparkline accent */}
      <div className="h-0.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(Math.abs(change) * 3, 100)}%`, background: accentColor }}
        />
      </div>
    </div>
  );
}

// ── Chart Card ────────────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children, action }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-foreground font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-muted-foreground text-xs mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ── Top Post Row ──────────────────────────────────────────────────────────────

function TopPostRow({ post, rank }: { post: PostPerformance; rank: number }) {
  const tc = POST_TYPE_CONFIG[post.type];
  const TypeIcon = tc.icon;
  const date = new Date(post.date).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-border/60 last:border-0 group hover:bg-muted/20 -mx-2 px-2 rounded-lg transition-colors">
      {/* Rank */}
      <span className="text-muted-foreground/50 text-sm font-mono w-5 shrink-0">#{rank}</span>

      {/* Color swatch + type */}
      <div className={cn("flex items-center justify-center w-9 h-9 rounded-xl shrink-0", tc.bg)}>
        <TypeIcon className={cn("h-4 w-4", tc.color)} />
      </div>

      {/* Title + date */}
      <div className="flex-1 min-w-0">
        <p className="text-foreground text-sm font-medium truncate">{post.title}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{post.type} · {date}</p>
      </div>

      {/* Metrics */}
      <div className="hidden xl:flex items-center gap-5 shrink-0">
        <div className="text-right w-16">
          <div className="flex items-center justify-end gap-1 text-foreground text-sm font-semibold">
            <Eye className="h-3 w-3 text-blue-400" />
            {fmtNum(post.impressions)}
          </div>
          <p className="text-muted-foreground text-[10px]">impressions</p>
        </div>
        <div className="text-right w-12">
          <div className="flex items-center justify-end gap-1 text-foreground text-sm font-semibold">
            <ThumbsUp className="h-3 w-3 text-pink-400" />
            {fmtNum(post.likes)}
          </div>
          <p className="text-muted-foreground text-[10px]">likes</p>
        </div>
        <div className="text-right w-12">
          <div className="flex items-center justify-end gap-1 text-foreground text-sm font-semibold">
            <MessageCircle className="h-3 w-3 text-violet-400" />
            {post.comments}
          </div>
          <p className="text-muted-foreground text-[10px]">coms</p>
        </div>
        <div className="text-right w-12">
          <div className="flex items-center justify-end gap-1 text-foreground text-sm font-semibold">
            <Share2 className="h-3 w-3 text-emerald-400" />
            {post.shares}
          </div>
          <p className="text-muted-foreground text-[10px]">partages</p>
        </div>
        <div className="text-right w-12">
          <div className="flex items-center justify-end gap-1 text-foreground text-sm font-semibold">
            <Bookmark className="h-3 w-3 text-amber-400" />
            {post.saves}
          </div>
          <p className="text-muted-foreground text-[10px]">saves</p>
        </div>
      </div>

      {/* Engagement badge */}
      <div className={cn(
        "shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
        post.engagementRate >= 7 ? "bg-emerald-400/10 text-emerald-400" :
        post.engagementRate >= 5 ? "bg-blue-400/10 text-blue-400" :
        "bg-muted text-muted-foreground"
      )}>
        <TrendingUp className="h-3 w-3" />
        {post.engagementRate}%
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AnalysePage() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(() =>
    buildRange("30d")
  );
  const [activeEngTab, setActiveEngTab] = useState<"engagement" | "reach">("engagement");

  const impressions = useMemo(
    () => generateImpressions(dateRange.start, dateRange.end),
    [dateRange]
  );
  const engagement = useMemo(
    () => generateEngagement(dateRange.start, dateRange.end),
    [dateRange]
  );
  const followers = useMemo(
    () => generateFollowers(dateRange.start, dateRange.end),
    [dateRange]
  );
  const reach = useMemo(
    () => generateReach(dateRange.start, dateRange.end),
    [dateRange]
  );
  const summary = useMemo(
    () => computeSummary(impressions, engagement, followers),
    [impressions, engagement, followers]
  );

  return (
    <div className="space-y-7">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-400/10">
            <BarChart3 className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analyse des performances</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Source :{" "}
              <span className="text-blue-400 font-medium">Metricool</span>
              {" · "}Instagram
            </p>
          </div>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Total impressions"
          value={fmtNum(summary.impressions.total)}
          change={summary.impressions.change}
          changeType={summary.impressions.changeType}
          icon={Eye}
          iconColor="text-blue-400"
          iconBg="bg-blue-400/10"
          accentColor="#60a5fa"
        />
        <KpiCard
          label="Taux d'engagement moyen"
          value={fmtPct(summary.engagementRate.value)}
          change={summary.engagementRate.change}
          changeType={summary.engagementRate.changeType}
          changeSuffix="%"
          icon={Heart}
          iconColor="text-pink-400"
          iconBg="bg-pink-400/10"
          accentColor="#f472b6"
        />
        <KpiCard
          label="Abonnés totaux"
          value={fmtNum(summary.followers.total)}
          change={summary.followers.change}
          changeType={summary.followers.changeType}
          changeSuffix=""
          icon={Users}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
          accentColor="#34d399"
        />
        <KpiCard
          label="Portée (reach)"
          value={fmtNum(summary.reach.total)}
          change={summary.reach.change}
          changeType={summary.reach.changeType}
          icon={TrendingUp}
          iconColor="text-violet-400"
          iconBg="bg-violet-400/10"
          accentColor="#a78bfa"
        />
      </div>

      {/* ── Row 2 : Impressions + Engagement ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard
          title="Impressions par jour"
          subtitle={`${fmtNum(summary.impressions.total)} au total sur la période`}
        >
          <BarChart
            data={impressions}
            color="#60a5fa"
            formatValue={fmtNum}
            maxBars={30}
          />
        </ChartCard>

        <ChartCard
          title={activeEngTab === "engagement" ? "Taux d'engagement" : "Portée quotidienne"}
          subtitle={
            activeEngTab === "engagement"
              ? `Moyenne : ${fmtPct(summary.engagementRate.value)}`
              : `Portée totale : ${fmtNum(summary.reach.total)}`
          }
          action={
            <div className="flex gap-1 bg-muted rounded-lg p-0.5">
              {(["engagement", "reach"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveEngTab(tab)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs transition-colors",
                    activeEngTab === tab
                      ? "bg-card text-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === "engagement" ? "Engagement" : "Portée"}
                </button>
              ))}
            </div>
          }
        >
          <AreaChart
            data={activeEngTab === "engagement" ? engagement : reach}
            color={activeEngTab === "engagement" ? "#f472b6" : "#a78bfa"}
            formatValue={activeEngTab === "engagement" ? fmtPct : fmtNum}
            autoMin={activeEngTab === "engagement"}
            maxPoints={30}
          />
        </ChartCard>
      </div>

      {/* ── Row 3 : Follower growth (full width) ── */}
      <ChartCard
        title="Croissance des abonnés"
        subtitle={`+${fmtNum(summary.followers.change)} abonnés sur la période · ${summary.followers.growth}% de croissance`}
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold">+{summary.followers.growth}%</span>
          </div>
        }
      >
        <AreaChart
          data={followers}
          color="#34d399"
          formatValue={fmtNum}
          autoMin
          fillOpacity={0.12}
          maxPoints={90}
        />
      </ChartCard>

      {/* ── Row 4 : Top posts ── */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-foreground font-semibold text-sm">Publications les plus performantes</h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              Classées par impressions · données Metricool
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
            Voir sur Metricool
          </button>
        </div>

        <div>
          {/* Header */}
          <div className="flex items-center gap-4 pb-2 border-b border-border/60 text-[11px] text-muted-foreground uppercase tracking-wider">
            <span className="w-5 shrink-0" />
            <span className="w-9 shrink-0" />
            <span className="flex-1">Publication</span>
            <div className="hidden xl:flex items-center gap-5 shrink-0">
              <span className="w-16 text-right">Impressions</span>
              <span className="w-12 text-right">Likes</span>
              <span className="w-12 text-right">Coms</span>
              <span className="w-12 text-right">Partages</span>
              <span className="w-12 text-right">Saves</span>
            </div>
            <span className="shrink-0 w-14 text-right">Eng.</span>
          </div>

          {TOP_POSTS.map((post, i) => (
            <TopPostRow key={post.id} post={post} rank={i + 1} />
          ))}
        </div>
      </div>

      {/* ── Metricool note ── */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-400/10 shrink-0 mt-0.5">
          <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          <span className="text-foreground font-medium">Source : Metricool API</span>
          {" — "}Les données affichées sont des données de démonstration. Pour connecter votre compte Metricool,
          définissez la variable d'environnement{" "}
          <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[11px]">METRICOOL_API_TOKEN</code>
          {" "}et remplacez les appels mock dans{" "}
          <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[11px]">lib/analytics-data.ts</code>.
        </p>
      </div>
    </div>
  );
}
