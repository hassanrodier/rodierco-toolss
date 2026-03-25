"use client";

import {
  X,
  Clock,
  Video,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  CalendarClock,
  Tag,
  BarChart2,
  Eye,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatLongDate, type CalendarPost } from "@/lib/calendar-data";
import { POST_TYPE_CONFIG } from "@/lib/instagram-types";

interface DayPanelProps {
  dateKey: string;
  posts: CalendarPost[];
  onClose: () => void;
}

const TYPE_ICONS = {
  Réel: Video,
  Carrousel: Layers,
  Story: Clock,
  Photo: ImageIcon,
};

const STATUS_CONFIG = {
  publie: {
    label: "Publié",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  programme: {
    label: "Programmé",
    icon: CalendarClock,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  brouillon: {
    label: "Brouillon",
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
  },
  backlog: {
    label: "Backlog",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
};

function fmtNum(v: number) {
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString("fr-FR");
}

export function DayPanel({ dateKey, posts, onClose }: DayPanelProps) {
  const longDate = formatLongDate(dateKey);
  const capitalised = longDate.charAt(0).toUpperCase() + longDate.slice(1);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-card border-l border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
              Publications du jour
            </p>
            <h2 className="text-foreground font-semibold text-base leading-snug">
              {capitalised}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {posts.length} publication{posts.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors mt-0.5"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Posts list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarClock className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Aucune publication ce jour</p>
            </div>
          ) : (
            posts
              .slice()
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((post) => {
                const tc = POST_TYPE_CONFIG[post.type];
                const sc = STATUS_CONFIG[post.status];
                const TypeIcon = TYPE_ICONS[post.type];
                const StatusIcon = sc.icon;

                return (
                  <div
                    key={post.id}
                    className="rounded-xl border border-border bg-background p-4 space-y-3"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg shrink-0", tc.bg)}>
                          <TypeIcon className={cn("h-4 w-4", tc.color)} />
                        </div>
                        <div>
                          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", tc.badge)}>
                            {post.type}
                          </span>
                        </div>
                      </div>

                      {/* Status + Time */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium", sc.bg, sc.color, sc.border)}>
                          <StatusIcon className="h-3 w-3" />
                          {sc.label}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-[11px]">{post.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <p className="text-foreground text-sm font-semibold leading-snug">
                        {post.title}
                      </p>
                      {post.subtitle && (
                        <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                          {post.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1.5">
                        <Tag className="h-3 w-3 text-muted-foreground/50" />
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Performance (only for published) */}
                    {post.status === "publie" && post.impressions && (
                      <div className="flex items-center gap-4 pt-2 border-t border-border/60">
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5 text-blue-400" />
                          <span className="text-foreground text-xs font-semibold">{fmtNum(post.impressions)}</span>
                          <span className="text-muted-foreground text-xs">impressions</span>
                        </div>
                        {post.likes && (
                          <div className="flex items-center gap-1.5">
                            <Heart className="h-3.5 w-3.5 text-pink-400" />
                            <span className="text-foreground text-xs font-semibold">{fmtNum(post.likes)}</span>
                            <span className="text-muted-foreground text-xs">likes</span>
                          </div>
                        )}
                        {post.engagementRate && (
                          <div className="flex items-center gap-1.5 ml-auto">
                            <BarChart2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span className={cn(
                              "text-xs font-semibold",
                              post.engagementRate >= 7 ? "text-emerald-400" :
                              post.engagementRate >= 5 ? "text-blue-400" : "text-muted-foreground"
                            )}>
                              {post.engagementRate}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </div>
    </>
  );
}
