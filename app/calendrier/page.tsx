"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Video,
  Layers,
  Clock,
  Image as ImageIcon,
  CheckCircle2,
  CalendarClock,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DayPanel } from "@/components/calendar/day-panel";
import {
  buildCalendarGrid,
  formatMonth,
  groupByDate,
  toKey,
  CALENDAR_POSTS,
  type CalendarPost,
} from "@/lib/calendar-data";
import { POST_TYPE_CONFIG } from "@/lib/instagram-types";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const WEEK_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const TODAY = toKey(new Date());

const TYPE_ICONS = {
  Réel: Video,
  Carrousel: Layers,
  Story: Clock,
  Photo: ImageIcon,
};

// Visible tokens per cell before overflow
const MAX_TOKENS = 3;

// ─────────────────────────────────────────────────────────────────────────────
// Post Token
// ─────────────────────────────────────────────────────────────────────────────

function PostToken({ post }: { post: CalendarPost }) {
  const tc = POST_TYPE_CONFIG[post.type];
  const isPublished = post.status === "publie";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-1.5 py-[3px] rounded-md text-[11px] leading-none",
        "border-l-2 truncate w-full group-hover/cell:opacity-90 transition-opacity",
        tc.bg,
        isPublished ? "opacity-100" : "opacity-70",
      )}
      style={{ borderLeftColor: isPublished ? tc.color.replace("text-", "") : undefined }}
    >
      {/* Status dot */}
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          isPublished ? tc.dot : "border border-current bg-transparent",
          tc.color
        )}
        style={
          !isPublished
            ? { borderStyle: "dashed", borderWidth: "1.5px" }
            : undefined
        }
      />
      <span className={cn("truncate font-medium", tc.color)}>
        {post.title}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Day Cell
// ─────────────────────────────────────────────────────────────────────────────

interface DayCellProps {
  dayNum: number;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: CalendarPost[];
  isSelected: boolean;
  onClick: () => void;
}

function DayCell({ dayNum, dateKey, isCurrentMonth, isToday, posts, isSelected, onClick }: DayCellProps) {
  const visible = posts.slice(0, MAX_TOKENS);
  const overflow = posts.length - MAX_TOKENS;
  const hasContent = posts.length > 0;

  const published = posts.filter((p) => p.status === "publie").length;
  const scheduled = posts.filter((p) => p.status === "programme").length;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group/cell relative flex flex-col min-h-[110px] p-2 rounded-xl border cursor-pointer",
        "transition-all duration-150",
        // Base
        isCurrentMonth
          ? "bg-card border-border"
          : "bg-muted/10 border-border/30",
        // Today
        isToday && !isSelected && "border-primary/50 bg-primary/[0.04] ring-1 ring-primary/20",
        // Selected
        isSelected && "border-primary bg-primary/10 ring-2 ring-primary/30",
        // Hover (only if not selected)
        !isSelected && "hover:border-primary/30 hover:bg-card/80",
        // Faded for other months
        !isCurrentMonth && "opacity-50"
      )}
    >
      {/* Day number row */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={cn(
            "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full leading-none transition-colors",
            isToday
              ? "bg-primary text-white"
              : isCurrentMonth
              ? "text-foreground"
              : "text-muted-foreground/40"
          )}
        >
          {dayNum}
        </span>

        {/* Mini counters */}
        {hasContent && (
          <div className="flex items-center gap-1">
            {published > 0 && (
              <span className="flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[10px] text-muted-foreground">{published}</span>
              </span>
            )}
            {scheduled > 0 && (
              <span className="flex items-center gap-0.5 ml-0.5">
                <span className="w-1.5 h-1.5 rounded-full border border-blue-400 bg-transparent shrink-0" />
                <span className="text-[10px] text-muted-foreground">{scheduled}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tokens */}
      <div className="flex flex-col gap-[3px] flex-1">
        {visible.map((post) => (
          <PostToken key={post.id} post={post} />
        ))}

        {overflow > 0 && (
          <div className="flex items-center gap-1 px-1.5 py-[3px]">
            <span className="text-[10px] text-muted-foreground font-medium">
              +{overflow} autre{overflow > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Add hover button */}
      {isCurrentMonth && hasContent === false && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
          <Plus className="h-4 w-4 text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Legend
// ─────────────────────────────────────────────────────────────────────────────

function Legend() {
  const types = Object.entries(POST_TYPE_CONFIG) as [
    keyof typeof POST_TYPE_CONFIG,
    (typeof POST_TYPE_CONFIG)[keyof typeof POST_TYPE_CONFIG]
  ][];

  return (
    <div className="flex items-center gap-5 flex-wrap">
      {/* Types */}
      {types.map(([type, config]) => {
        const Icon = TYPE_ICONS[type];
        return (
          <div key={type} className="flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", config.dot)} />
            <span className="text-xs text-muted-foreground">{type}</span>
          </div>
        );
      })}

      {/* Separator */}
      <div className="h-4 w-px bg-border" />

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-xs text-muted-foreground">Publié</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CalendarClock className="h-3.5 w-3.5 text-blue-400" />
        <span className="text-xs text-muted-foreground">Programmé</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function CalendrierPage() {
  // Default to today's month, or March 2026 if that's more interesting
  const [viewDate, setViewDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Build 6-week grid for the current month view
  const grid = useMemo(() => buildCalendarGrid(year, month), [year, month]);

  // Group all posts by date
  const postsByDate = useMemo(() => groupByDate(CALENDAR_POSTS), []);

  // Month stats
  const monthStats = useMemo(() => {
    const firstDay = toKey(new Date(year, month, 1));
    const lastDay = toKey(new Date(year, month + 1, 0));
    const monthPosts = CALENDAR_POSTS.filter(
      (p) => p.date >= firstDay && p.date <= lastDay
    );
    return {
      total: monthPosts.length,
      published: monthPosts.filter((p) => p.status === "publie").length,
      scheduled: monthPosts.filter((p) => p.status === "programme").length,
      activeDays: new Set(monthPosts.map((p) => p.date)).size,
    };
  }, [year, month]);

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setSelectedDay(null);
  }

  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    setSelectedDay(null);
  }

  function goToday() {
    setViewDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    setSelectedDay(TODAY);
  }

  const selectedPosts = selectedDay ? (postsByDate[selectedDay] ?? []) : [];

  return (
    <>
      <div className="flex flex-col gap-6 h-full">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-violet-400/10">
              <CalendarDays className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Calendrier de contenu</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Planifiez et suivez vos publications Instagram
              </p>
            </div>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Planifier
          </Button>
        </div>

        {/* ── Month stats strip ── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Publications totales", value: monthStats.total, color: "text-foreground", dot: "bg-violet-400" },
            { label: "Publiées", value: monthStats.published, color: "text-emerald-400", dot: "bg-emerald-400" },
            { label: "Programmées", value: monthStats.scheduled, color: "text-blue-400", dot: "bg-blue-400" },
            { label: "Jours actifs", value: monthStats.activeDays, color: "text-violet-400", dot: "bg-violet-400/50" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", s.dot)} />
              <div>
                <p className={cn("text-lg font-bold leading-none", s.color)}>{s.value}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Calendar card ── */}
        <div className="flex-1 rounded-2xl border border-border bg-card overflow-hidden flex flex-col">

          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={prevMonth}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>

              <h2 className="text-foreground font-semibold text-base capitalize min-w-[160px] text-center">
                {formatMonth(viewDate)}
              </h2>

              <button
                onClick={nextMonth}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                onClick={goToday}
                className="ml-1 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted transition-colors"
              >
                Aujourd'hui
              </button>
            </div>

            {/* Legend */}
            <Legend />
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className={cn(
                  "py-2.5 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider",
                  (day === "Sam" || day === "Dim") && "text-muted-foreground/50"
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid — 6 rows × 7 cols */}
          <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1.5 p-2">
            {grid.map((cell) => (
              <DayCell
                key={cell.key}
                dayNum={cell.dayNum}
                dateKey={cell.key}
                isCurrentMonth={cell.isCurrentMonth}
                isToday={cell.key === TODAY}
                posts={postsByDate[cell.key] ?? []}
                isSelected={selectedDay === cell.key}
                onClick={() =>
                  setSelectedDay((prev) => (prev === cell.key ? null : cell.key))
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Day panel ── */}
      {selectedDay && (
        <DayPanel
          dateKey={selectedDay}
          posts={selectedPosts}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </>
  );
}
