"use client";

import { useState, useMemo } from "react";
import {
  Newspaper, Search, RefreshCw, ExternalLink,
  Clock, BookOpen, Tag, Rss, Filter, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  MOCK_ARTICLES, NEWS_SOURCES, CATEGORY_CONFIG, ALL_CATEGORIES,
  filterArticles, getSource, relativeNewsDate,
  type NewsCategory, type NewsArticle,
} from "@/lib/news-data";

// ─────────────────────────────────────────────────────────────────────────────
// Article card
// ─────────────────────────────────────────────────────────────────────────────

const CARD_ACCENTS: Record<string, string> = {
  collections: "border-l-pink-400",
  market:      "border-l-amber-400",
  business:    "border-l-blue-400",
  watches:     "border-l-indigo-400",
  craft:       "border-l-orange-400",
  trends:      "border-l-violet-400",
  all:         "border-l-border",
};

function ArticleCard({ article }: { article: NewsArticle }) {
  const source = getSource(article.sourceId);
  const catCfg = CATEGORY_CONFIG[article.category];
  const accent = CARD_ACCENTS[article.category] ?? "border-l-border";

  return (
    <article className={cn(
      "group flex flex-col rounded-2xl border border-border bg-card overflow-hidden",
      "hover:border-primary/30 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5",
      "transition-all duration-200 border-l-4",
      accent
    )}>
      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Top row: source + date */}
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border",
            source.bg, source.text, source.border
          )}>
            <Rss className="h-2.5 w-2.5" />
            {source.name}
            <span className="text-[10px] opacity-60">{source.country}</span>
          </span>
          <span className="text-muted-foreground text-xs shrink-0 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {relativeNewsDate(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-foreground font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 flex-1">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          {/* Category + tags */}
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className={cn("text-[10px] font-semibold flex items-center gap-1", catCfg.color)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", catCfg.dot)} />
              {catCfg.label}
            </span>
            {article.tags.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border truncate max-w-[80px]">
                {t}
              </span>
            ))}
          </div>

          {/* Read time + link */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              {article.readingTime} min
            </span>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-6 h-6 rounded-md opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Featured article (first card — larger)
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedCard({ article }: { article: NewsArticle }) {
  const source = getSource(article.sourceId);
  const catCfg = CATEGORY_CONFIG[article.category];
  const accent = CARD_ACCENTS[article.category] ?? "border-l-border";

  return (
    <article className={cn(
      "group rounded-2xl border border-border bg-card overflow-hidden col-span-full",
      "hover:border-primary/30 hover:shadow-xl hover:shadow-black/20 transition-all duration-200",
      "border-l-4", accent
    )}>
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Accent band */}
        <div className="hidden sm:flex flex-col justify-center items-center w-2 shrink-0" />

        <div className="flex flex-col flex-1 p-6 gap-4">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              À la une
            </span>
            <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border", source.bg, source.text, source.border)}>
              <Rss className="h-2.5 w-2.5" />{source.name}
            </span>
            <span className="ml-auto text-muted-foreground text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />{relativeNewsDate(article.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-foreground font-bold text-lg leading-snug group-hover:text-primary transition-colors">
            {article.title}
          </h2>

          {/* Summary */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {article.summary}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-xs font-semibold flex items-center gap-1.5", catCfg.color)}>
                <span className={cn("w-2 h-2 rounded-full", catCfg.dot)} />
                {catCfg.label}
              </span>
              {article.tags.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">{t}</span>
              ))}
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              Lire l'article <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function ActualitesPage() {
  const [category, setCategory] = useState<NewsCategory>("all");
  const [activeSources, setActiveSources] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showSourceFilter, setShowSourceFilter] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const articles = useMemo(
    () => filterArticles(MOCK_ARTICLES, category, activeSources, search),
    [category, activeSources, search, refreshKey]
  );

  function toggleSource(id: string) {
    setActiveSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-400/10">
            <Newspaper className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Veille du secteur</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Bijouterie · Joaillerie · Horlogerie — {NEWS_SOURCES.length} sources RSS
            </p>
          </div>
        </div>

        {/* Refresh */}
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Actualiser
        </button>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {ALL_CATEGORIES.map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all border",
                active
                  ? "bg-card border-primary/40 font-semibold shadow-sm"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/20 bg-muted/20"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
              <span className={active ? cfg.color : ""}>{cfg.label}</span>
              {active && (
                <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {articles.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Search + source filter ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher titre, sujet, tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Source filter toggle */}
        <button
          onClick={() => setShowSourceFilter((v) => !v)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-colors",
            showSourceFilter || activeSources.length > 0
              ? "border-primary/40 text-primary bg-primary/5"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Filter className="h-3.5 w-3.5" />
          Sources
          {activeSources.length > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold">
              {activeSources.length}
            </span>
          )}
        </button>

        {activeSources.length > 0 && (
          <button onClick={() => setActiveSources([])} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="h-3 w-3" /> Réinitialiser
          </button>
        )}
      </div>

      {/* ── Source chips ── */}
      {showSourceFilter && (
        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-border bg-muted/20">
          <p className="w-full text-xs text-muted-foreground mb-1">Filtrer par source :</p>
          {NEWS_SOURCES.map((src) => {
            const active = activeSources.includes(src.id);
            return (
              <button
                key={src.id}
                onClick={() => toggleSource(src.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all",
                  active
                    ? cn(src.bg, src.text, src.border, "font-semibold")
                    : "border-border text-muted-foreground hover:text-foreground bg-muted/30"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", active ? src.text.replace("text-", "bg-") : "bg-muted-foreground")} />
                {src.name}
                <span className="text-[10px] opacity-60">{src.lang.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Stats strip ── */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span><span className="text-foreground font-semibold">{articles.length}</span> article{articles.length > 1 ? "s" : ""}</span>
        <span className="h-3 w-px bg-border" />
        <span>{NEWS_SOURCES.length} sources actives</span>
        <span className="h-3 w-px bg-border" />
        <span>Dernière maj : il y a 5 min</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-medium">En direct</span>
        </span>
      </div>

      {/* ── Articles ── */}
      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border">
          <Newspaper className="h-10 w-10 text-muted-foreground/20 mb-4" />
          <p className="text-foreground font-medium mb-1">Aucun article trouvé</p>
          <p className="text-muted-foreground text-sm">Modifiez vos filtres ou votre recherche</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Featured */}
          {featured && <FeaturedCard article={featured} />}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── RSS note ── */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
        <Rss className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <span className="text-foreground font-medium">Données de démonstration</span>
          {" — "}Les articles affichés sont des exemples. Pour les flux RSS réels, l'API Next.js est disponible sur{" "}
          <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[11px]">GET /api/rss</code>.
          {" "}Les sources et leurs endpoints sont configurables dans{" "}
          <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[11px]">lib/news-data.ts</code>.
        </span>
      </div>
    </div>
  );
}
