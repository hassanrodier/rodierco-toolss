"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange, DateRangeValue } from "@/lib/analytics-data";

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}

const PRESETS: { label: string; value: DateRange; days: number }[] = [
  { label: "7 jours",  value: "7d",  days: 7 },
  { label: "14 jours", value: "14d", days: 14 },
  { label: "30 jours", value: "30d", days: 30 },
  { label: "90 jours", value: "90d", days: 90 },
];

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toDateStr(d);
}

function today(): string {
  return toDateStr(new Date());
}

export function buildRange(preset: DateRange, customStart?: string, customEnd?: string): DateRangeValue {
  const end = today();
  if (preset === "custom") {
    return { preset, start: customStart ?? end, end: customEnd ?? end };
  }
  const days = PRESETS.find((p) => p.value === preset)?.days ?? 30;
  return { preset, start: addDays(end, -days + 1), end };
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.start);
  const [customEnd, setCustomEnd] = useState(value.end);

  const activePreset = PRESETS.find((p) => p.value === value.preset);
  const label = activePreset ? activePreset.label : "Période personnalisée";

  function selectPreset(preset: DateRange) {
    const range = buildRange(preset);
    onChange(range);
    setCustomStart(range.start);
    setCustomEnd(range.end);
    if (preset !== "custom") setOpen(false);
  }

  function applyCustom() {
    if (customStart && customEnd && customStart <= customEnd) {
      onChange({ preset: "custom", start: customStart, end: customEnd });
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2.5 px-4 py-2 rounded-xl border text-sm transition-all",
          "bg-card border-border text-foreground hover:border-primary/40",
          open && "border-primary/50 bg-primary/5"
        )}
      >
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground text-xs hidden sm:block">
          {value.start} → {value.end}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 w-72 rounded-xl border border-border bg-card shadow-xl shadow-black/30 overflow-hidden">
            {/* Presets */}
            <div className="p-3 space-y-1">
              <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider px-2 mb-2">
                Périodes rapides
              </p>
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => selectPreset(p.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                    value.preset === p.value
                      ? "bg-primary text-white font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span>{p.label}</span>
                  {value.preset === p.value && (
                    <span className="text-[10px] text-white/70">
                      {value.start} → {value.end}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-border mx-3" />

            {/* Custom range */}
            <div className="p-3 space-y-3">
              <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider px-2">
                Période personnalisée
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground px-1">Début</label>
                  <input
                    type="date"
                    value={customStart}
                    max={customEnd}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className={cn(
                      "w-full rounded-lg border border-input bg-muted px-2 py-1.5 text-xs text-foreground",
                      "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                      "[color-scheme:dark]"
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground px-1">Fin</label>
                  <input
                    type="date"
                    value={customEnd}
                    min={customStart}
                    max={today()}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className={cn(
                      "w-full rounded-lg border border-input bg-muted px-2 py-1.5 text-xs text-foreground",
                      "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                      "[color-scheme:dark]"
                    )}
                  />
                </div>
              </div>
              <button
                onClick={applyCustom}
                disabled={!customStart || !customEnd || customStart > customEnd}
                className={cn(
                  "w-full py-2 rounded-lg text-sm font-medium transition-colors",
                  "bg-primary text-white hover:bg-primary/90",
                  "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                Appliquer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
