"use client";

import { useState } from "react";
import {
  X, ExternalLink, Users, Heart, TrendingUp, TrendingDown,
  Calendar, Video, Layers, Image as ImageIcon, Eye, MessageCircle,
  BarChart2, CheckCircle2, Minus, Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/competitors/sparkline";
import {
  PLATFORM_CONFIG,
  growth30d,
  relativeDate,
  type Competitor,
  type PlatformData,
  type Platform,
} from "@/lib/competitor-data";

interface CompetitorDetailPanelProps {
  competitor: Competitor;
  onClose: () => void;
}

function fmtNum(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString("fr-FR");
}

const POST_ICONS: Record<string, React.ElementType> = {
  reel: Video, video: Video, short: Video,
  carousel: Layers, image: ImageIcon,
};

function MetricBlock({ label, value, sub, color = "text-foreground" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3 text-center">
      <p className={cn("text-xl font-bold leading-none", color)}>{value}</p>
      {sub && <p className="text-muted-foreground text-[10px] mt-1">{sub}</p>}
      <p className="text-muted-foreground text-xs mt-1.5">{label}</p>
    </div>
  );
}

function PlatformTab({ data }: { data: PlatformData }) {
  const cfg = PLATFORM_CONFIG[data.platform];
  const g30 = (() => {
    const h = data.growthHistory;
    if (h.length < 5) return 0;
    const now = h[h.length - 1];
    const past = h[h.length - 5];
    return past > 0 ? ((now - past) / past) * 100 : 0;
  })();
  const isUp = g30 >= 0;

  return (
    <div className="space-y-5 py-2">
      {/* Handle + verified */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", cfg.text)}>{data.handle}</span>
          {data.verified && (
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
          )}
        </div>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="h-3 w-3" />
          Voir le profil
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-3 gap-2">
        <MetricBlock
          label="Abonnés"
          value={fmtNum(data.followers)}
          color="text-foreground"
        />
        <MetricBlock
          label="Engagement"
          value={`${data.avgEngagementRate}%`}
          color={data.avgEngagementRate >= 5 ? "text-emerald-400" : data.avgEngagementRate >= 3 ? "text-blue-400" : "text-amber-400"}
        />
        <MetricBlock
          label="Posts / mois"
          value={`${data.postsPerMonth}`}
          color="text-violet-400"
        />
      </div>

      {/* Growth trend */}
      <div className="rounded-xl border border-border bg-muted/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-foreground text-xs font-semibold">Croissance — 12 semaines</p>
          <div className={cn("flex items-center gap-1 text-xs font-bold", isUp ? "text-emerald-400" : "text-red-400")}>
            {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {isUp ? "+" : ""}{g30.toFixed(1)}% sur 30j
          </div>
        </div>
        <Sparkline
          data={data.growthHistory}
          width={380}
          height={52}
          className="w-full"
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground">{fmtNum(data.growthHistory[0])} il y a 12 sem.</span>
          <span className="text-[10px] text-muted-foreground">{fmtNum(data.growthHistory[data.growthHistory.length - 1])} aujourd'hui</span>
        </div>
      </div>

      {/* Avg metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2.5">
          <Heart className="h-4 w-4 text-pink-400 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-semibold">{fmtNum(data.avgLikes)}</p>
            <p className="text-muted-foreground text-xs">Likes moy.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2.5">
          <MessageCircle className="h-4 w-4 text-blue-400 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-semibold">{data.avgComments}</p>
            <p className="text-muted-foreground text-xs">Comments moy.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2.5">
          <Users className="h-4 w-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-semibold">{fmtNum(data.following)}</p>
            <p className="text-muted-foreground text-xs">Abonnements</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/10 px-3 py-2.5">
          <BarChart2 className="h-4 w-4 text-violet-400 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-semibold">{fmtNum(data.postsCount)}</p>
            <p className="text-muted-foreground text-xs">Publications totales</p>
          </div>
        </div>
      </div>

      {/* Recent posts */}
      {data.recentPosts.length > 0 && (
        <div>
          <p className="text-foreground text-xs font-semibold mb-3">Publications récentes</p>
          <div className="space-y-2">
            {data.recentPosts.map((post) => {
              const Icon = POST_ICONS[post.type] ?? ImageIcon;
              return (
                <div key={post.id} className="flex items-start gap-3 rounded-lg border border-border bg-muted/10 p-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-xs font-medium leading-snug truncate">{post.caption}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Heart className="h-3 w-3 text-pink-400" />{fmtNum(post.likes)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MessageCircle className="h-3 w-3 text-blue-400" />{post.comments}
                      </span>
                      {post.views && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Eye className="h-3 w-3 text-violet-400" />{fmtNum(post.views)}
                        </span>
                      )}
                      <span className={cn(
                        "ml-auto text-[11px] font-semibold",
                        post.engagementRate >= 7 ? "text-emerald-400" : post.engagementRate >= 4 ? "text-blue-400" : "text-muted-foreground"
                      )}>
                        {post.engagementRate}%
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{relativeDate(post.date)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CompetitorDetailPanel({ competitor, onClose }: CompetitorDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<Platform>(competitor.platforms[0].platform);
  const activePlatform = competitor.platforms.find((p) => p.platform === activeTab) ?? competitor.platforms[0];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-card border-l border-border shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br text-white font-bold text-sm shrink-0",
              competitor.gradient
            )}>
              {competitor.initials}
            </div>
            <div>
              <h2 className="text-foreground font-semibold text-base">{competitor.name}</h2>
              <p className="text-muted-foreground text-xs mt-0.5">{competitor.handle} · {competitor.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors mt-0.5">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Platform tabs */}
        <div className="flex gap-1 px-4 pt-4 pb-0">
          {competitor.platforms.map((p) => {
            const cfg = PLATFORM_CONFIG[p.platform];
            const active = p.platform === activeTab;
            return (
              <button
                key={p.platform}
                onClick={() => setActiveTab(p.platform)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium border-b-2 transition-all",
                  active
                    ? cn(cfg.text, "border-current bg-muted/30")
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                {cfg.label}
              </button>
            );
          })}
        </div>
        <div className="h-px bg-border mx-4" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <PlatformTab data={activePlatform} />
        </div>

        {/* Notes */}
        {competitor.notes && (
          <div className="px-4 py-3 border-t border-border bg-amber-400/5">
            <p className="text-amber-400 text-[11px] font-medium mb-0.5">Note interne</p>
            <p className="text-muted-foreground text-xs">{competitor.notes}</p>
          </div>
        )}
      </div>
    </>
  );
}
