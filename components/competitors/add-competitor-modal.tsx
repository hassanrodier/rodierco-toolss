"use client";

import { useState } from "react";
import { X, Plus, Search, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PLATFORM_CONFIG,
  ALL_PLATFORMS,
  type Platform,
  type Competitor,
  type PlatformData,
} from "@/lib/competitor-data";

interface AddCompetitorModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (competitor: Competitor) => void;
}

const GRADIENTS = [
  "from-violet-500 to-purple-400",
  "from-pink-500 to-rose-400",
  "from-amber-500 to-yellow-400",
  "from-emerald-500 to-green-400",
  "from-sky-500 to-cyan-400",
  "from-indigo-500 to-blue-400",
  "from-orange-500 to-amber-400",
  "from-teal-500 to-emerald-400",
];

/** Simulate fetching public profile data for a platform handle */
function mockFetchPlatform(platform: Platform, handle: string): PlatformData {
  const base = Math.floor(Math.random() * 40_000) + 5_000;
  const seed = handle.length;
  const hist = Array.from({ length: 12 }, (_, i) =>
    Math.round(base * 0.9 + (base * 0.1 * i) / 11 + (Math.sin(i + seed) * base * 0.02))
  );
  return {
    platform,
    handle,
    verified: false,
    followers: hist[11],
    following: Math.floor(Math.random() * 2000) + 100,
    postsCount: Math.floor(Math.random() * 800) + 50,
    avgEngagementRate: parseFloat((Math.random() * 5 + 2).toFixed(1)),
    avgLikes: Math.floor(Math.random() * 1500) + 200,
    avgComments: Math.floor(Math.random() * 80) + 10,
    postsPerMonth: Math.floor(Math.random() * 25) + 4,
    lastPostDate: "2026-03-24",
    growthHistory: hist,
    recentPosts: [],
  };
}

export function AddCompetitorModal({ open, onClose, onAdd }: AddCompetitorModalProps) {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set(["instagram"]));
  const [platformHandles, setPlatformHandles] = useState<Partial<Record<Platform, string>>>({});
  const [fetching, setFetching] = useState(false);
  const [fetched, setFetched] = useState(false);

  function reset() {
    setName(""); setHandle(""); setCategory(""); setNotes("");
    setSelectedPlatforms(new Set(["instagram"]));
    setPlatformHandles({});
    setFetching(false); setFetched(false);
  }

  function handleClose() { reset(); onClose(); }

  function togglePlatform(p: Platform) {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) { next.delete(p); } else { next.add(p); }
      return next;
    });
  }

  async function handleFetch() {
    setFetching(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate network
    setFetching(false);
    setFetched(true);
  }

  function handleSubmit() {
    if (!name.trim()) return;
    const initials = name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

    const platforms: PlatformData[] = Array.from(selectedPlatforms).map((p) => {
      const h = platformHandles[p] ?? handle ?? `@${name.toLowerCase().replace(/\s+/g, "_")}`;
      return mockFetchPlatform(p, h);
    });

    const competitor: Competitor = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      handle: handle.trim() || `@${name.toLowerCase().replace(/\s+/g, "_")}`,
      initials,
      gradient,
      category: category.trim() || "Bijoux",
      notes: notes.trim() || undefined,
      addedAt: new Date().toISOString().split("T")[0],
      platforms,
    };

    onAdd(competitor);
    handleClose();
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-card border-l border-border shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/10">
              <Plus className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-foreground font-semibold text-sm">Ajouter un concurrent</h2>
              <p className="text-muted-foreground text-xs mt-0.5">Suivez un profil sur plusieurs réseaux</p>
            </div>
          </div>
          <button onClick={handleClose} className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          <div className="space-y-2">
            <Label htmlFor="name">Nom affiché <span className="text-destructive">*</span></Label>
            <Input id="name" placeholder="Ex : Bijoux Luxe Paris" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handle">Handle principal</Label>
            <Input id="handle" placeholder="@bijoux_luxe_paris" value={handle} onChange={(e) => setHandle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie / niche</Label>
            <Input id="category" placeholder="Ex : Bijoux · Luxe" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          {/* Platform selection */}
          <div className="space-y-3">
            <Label>Plateformes à suivre</Label>
            <div className="grid grid-cols-3 gap-2">
              {ALL_PLATFORMS.map((p) => {
                const cfg = PLATFORM_CONFIG[p];
                const active = selectedPlatforms.has(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all",
                      active ? cn(cfg.bg, cfg.text, cfg.border, "font-semibold") : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-muted/30"
                    )}
                  >
                    <span className={cn("w-2 h-2 rounded-full shrink-0", active ? cfg.dot : "bg-muted-foreground")} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Per-platform handles */}
          {selectedPlatforms.size > 0 && (
            <div className="space-y-3">
              <Label>Handles par plateforme</Label>
              {Array.from(selectedPlatforms).map((p) => {
                const cfg = PLATFORM_CONFIG[p];
                return (
                  <div key={p} className="flex items-center gap-2">
                    <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-md border shrink-0 w-24 text-center", cfg.bg, cfg.text, cfg.border)}>
                      {cfg.label}
                    </span>
                    <Input
                      placeholder={`@handle_${p}`}
                      value={platformHandles[p] ?? ""}
                      onChange={(e) => setPlatformHandles((prev) => ({ ...prev, [p]: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Fetch button */}
          <button
            type="button"
            onClick={handleFetch}
            disabled={fetching || !name.trim()}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all",
              fetched
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {fetching ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Récupération des données publiques...</>
            ) : fetched ? (
              <><CheckCircle2 className="h-4 w-4" />Données récupérées</>
            ) : (
              <><Search className="h-4 w-4" />Récupérer les données publiques</>
            )}
          </button>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Ex : Concurrent direct — surveiller les nouveaux lancements…" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={handleClose}>Annuler</Button>
          <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={!name.trim()}>
            <Plus className="h-4 w-4" />Ajouter
          </Button>
        </div>
      </div>
    </>
  );
}
