"use client";

import { useState, useMemo } from "react";
import {
  Users, Plus, TrendingUp, TrendingDown, Minus,
  CheckCircle2, ChevronUp, ChevronDown, ChevronsUpDown,
  ExternalLink, Trash2, BarChart2, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkline } from "@/components/competitors/sparkline";
import { AddCompetitorModal } from "@/components/competitors/add-competitor-modal";
import { CompetitorDetailPanel } from "@/components/competitors/competitor-detail-panel";
import {
  PLATFORM_CONFIG, ALL_PLATFORMS, sortCompetitors,
  totalFollowers, bestEngagement, totalPostsPerMonth, growth30d, lastPost, relativeDate,
  INITIAL_COMPETITORS,
  type Competitor, type Platform, type SortKey, type SortDir,
} from "@/lib/competitor-data";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtNum(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString("fr-FR");
}

// ─── SortHeader ─────────────────────────────────────────────────────────────

function SortHeader({
  label, sortKey, current, dir, onSort,
  className,
}: {
  label: string; sortKey: SortKey; current: SortKey | null; dir: SortDir;
  onSort: (k: SortKey) => void; className?: string;
}) {
  const active = current === sortKey;
  const Icon = active ? (dir === "asc" ? ChevronUp : ChevronDown) : ChevronsUpDown;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {label}
      <Icon className="h-3 w-3 shrink-0" />
    </button>
  );
}

// ─── Engagement badge ────────────────────────────────────────────────────────

function EngageBadge({ rate }: { rate: number }) {
  const color = rate >= 6 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    : rate >= 4 ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
    : rate >= 2 ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
    : "text-red-400 bg-red-400/10 border-red-400/20";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border", color)}>
      {rate.toFixed(1)}%
    </span>
  );
}

// ─── GrowthCell ──────────────────────────────────────────────────────────────

function GrowthCell({ competitor }: { competitor: Competitor }) {
  const g = growth30d(competitor);
  const allData = competitor.platforms.reduce<number[]>((acc, p) => {
    if (p.growthHistory.length > acc.length) return p.growthHistory;
    return acc;
  }, []);
  const TrendIcon = g > 0.5 ? TrendingUp : g < -0.5 ? TrendingDown : Minus;
  const color = g > 0.5 ? "text-emerald-400" : g < -0.5 ? "text-red-400" : "text-muted-foreground";

  return (
    <div className="flex items-center gap-2">
      <Sparkline data={allData} width={60} height={24} />
      <div className={cn("flex items-center gap-0.5 text-xs font-semibold", color)}>
        <TrendIcon className="h-3 w-3" />
        {g > 0 ? "+" : ""}{g.toFixed(1)}%
      </div>
    </div>
  );
}

// ─── Platform badges ─────────────────────────────────────────────────────────

function PlatformBadges({ competitor }: { competitor: Competitor }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {competitor.platforms.map((p) => {
        const cfg = PLATFORM_CONFIG[p.platform];
        return (
          <span key={p.platform} className={cn("text-[10px] px-1.5 py-0.5 rounded-md border font-medium", cfg.bg, cfg.text, cfg.border)}>
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ConcurrentsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>(INITIAL_COMPETITORS);
  const [sortKey, setSortKey] = useState<SortKey>("followers");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Competitor | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function handleDelete(id: string) {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  const filtered = useMemo(() => {
    let list = competitors;
    if (platformFilter) {
      list = list.filter((c) => c.platforms.some((p) => p.platform === platformFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return sortCompetitors(list, sortKey, sortDir);
  }, [competitors, sortKey, sortDir, platformFilter, search]);

  // Summary stats
  const totalF = competitors.reduce((s, c) => s + totalFollowers(c), 0);
  const avgEngage = competitors.length
    ? competitors.reduce((s, c) => s + bestEngagement(c), 0) / competitors.length
    : 0;
  const topGrowth = [...competitors].sort((a, b) => growth30d(b) - growth30d(a))[0];

  return (
    <>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-400/10">
              <Users className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Traqueur de concurrents</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {competitors.length} concurrent{competitors.length > 1 ? "s" : ""} suivis sur {new Set(competitors.flatMap((c) => c.platforms.map((p) => p.platform))).size} plateformes
              </p>
            </div>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />Ajouter un concurrent
          </Button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Abonnés cumulés", value: fmtNum(totalF), color: "text-foreground", dot: "bg-amber-400" },
            { label: "Engagement moy.", value: `${avgEngage.toFixed(1)}%`, color: "text-emerald-400", dot: "bg-emerald-400" },
            { label: "Plateformes suivies", value: String(new Set(competitors.flatMap((c) => c.platforms.map((p) => p.platform))).size), color: "text-blue-400", dot: "bg-blue-400" },
            { label: "Meilleure croissance", value: topGrowth ? `+${growth30d(topGrowth).toFixed(1)}%` : "—", sub: topGrowth?.name, color: "text-violet-400", dot: "bg-violet-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3">
              <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", s.dot)} />
              <div className="min-w-0">
                <p className={cn("text-xl font-bold leading-none", s.color)}>{s.value}</p>
                {(s as any).sub && <p className="text-[11px] text-muted-foreground truncate mt-0.5">{(s as any).sub}</p>}
                <p className="text-muted-foreground text-xs mt-0.5 truncate">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un concurrent…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Platform filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setPlatformFilter(null)}
              className={cn("px-3 py-1.5 rounded-lg text-xs transition-colors", !platformFilter ? "bg-primary text-white font-medium" : "bg-muted text-muted-foreground hover:text-foreground")}
            >
              Tous
            </button>
            {ALL_PLATFORMS.map((p) => {
              const cfg = PLATFORM_CONFIG[p];
              const active = platformFilter === p;
              return (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(active ? null : p)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors",
                    active ? cn(cfg.bg, cfg.text, "font-semibold") : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-[2fr_140px_110px_100px_90px_130px_90px_48px] gap-3 px-4 py-3 border-b border-border bg-muted/20">
            <SortHeader label="Concurrent" sortKey="name" current={sortKey} dir={sortDir} onSort={handleSort} />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Plateformes</span>
            <SortHeader label="Abonnés" sortKey="followers" current={sortKey} dir={sortDir} onSort={handleSort} className="justify-end" />
            <SortHeader label="Engagement" sortKey="engagement" current={sortKey} dir={sortDir} onSort={handleSort} className="justify-center" />
            <SortHeader label="Posts/mois" sortKey="posts_per_month" current={sortKey} dir={sortDir} onSort={handleSort} className="justify-center" />
            <SortHeader label="Croissance 30j" sortKey="growth" current={sortKey} dir={sortDir} onSort={handleSort} />
            <SortHeader label="Dernier post" sortKey="last_post" current={sortKey} dir={sortDir} onSort={handleSort} className="justify-end" />
            <span />
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-8 w-8 text-muted-foreground/20 mb-3" />
              <p className="text-muted-foreground text-sm">Aucun concurrent trouvé</p>
            </div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={c.id}
                onClick={() => setSelected((prev) => (prev?.id === c.id ? null : c))}
                className={cn(
                  "grid grid-cols-[2fr_140px_110px_100px_90px_130px_90px_48px] gap-3 px-4 py-3.5 items-center cursor-pointer transition-colors border-b border-border/60 last:border-0",
                  selected?.id === c.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/30"
                )}
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br text-white font-bold text-xs shrink-0", c.gradient)}>
                    {c.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-semibold truncate">{c.name}</p>
                    <p className="text-muted-foreground text-xs truncate">{c.handle} · {c.category}</p>
                  </div>
                </div>

                {/* Platforms */}
                <PlatformBadges competitor={c} />

                {/* Followers */}
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">{fmtNum(totalFollowers(c))}</p>
                  <p className="text-muted-foreground text-xs">{c.platforms.length} réseau{c.platforms.length > 1 ? "x" : ""}</p>
                </div>

                {/* Engagement */}
                <div className="flex justify-center">
                  <EngageBadge rate={bestEngagement(c)} />
                </div>

                {/* Posts/month */}
                <div className="text-center">
                  <p className="text-foreground text-sm font-semibold">{totalPostsPerMonth(c)}</p>
                  <p className="text-muted-foreground text-[10px]">/ mois</p>
                </div>

                {/* Growth */}
                <GrowthCell competitor={c} />

                {/* Last post */}
                <div className="text-right">
                  <p className="text-foreground text-xs">{relativeDate(lastPost(c))}</p>
                </div>

                {/* Delete */}
                <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="flex items-center justify-center w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all text-muted-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Source note ── */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
          <BarChart2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <span className="text-foreground font-medium">Sources de données publiques</span>
            {" — "}Données simulées. Pour les données réelles, connectez les APIs :
            Instagram Graph · TikTok Research API · YouTube Data API v3 · Twitter API v2 · Facebook Graph API.
          </span>
        </div>
      </div>

      <AddCompetitorModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={(c) => setCompetitors((prev) => [c, ...prev])} />
      {selected && <CompetitorDetailPanel competitor={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
