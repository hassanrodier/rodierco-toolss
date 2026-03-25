"use client";

import { useState, useEffect } from "react";
import { X, Plus, Tag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  type Post,
  type PostType,
  type PostStatus,
  POST_TYPES,
  POST_TYPE_CONFIG,
  POST_STATUS_CONFIG,
} from "@/lib/instagram-types";

interface NewPostModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (post: Omit<Post, "id" | "createdAt">) => void;
  editPost?: Post | null;
}

const STATUS_OPTIONS: { value: PostStatus; label: string }[] = [
  { value: "backlog", label: "Backlog d'idées" },
  { value: "brouillon", label: "Brouillon" },
  { value: "programme", label: "Programmé" },
  { value: "publie", label: "Publié" },
];

const SUGGESTED_TAGS = [
  "Produit", "Éducatif", "Promo", "Lifestyle", "Tendance",
  "BTS", "Collab", "Réel", "Conseils", "Unboxing",
];

export function NewPostModal({ open, onClose, onSave, editPost }: NewPostModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [type, setType] = useState<PostType>("Réel");
  const [status, setStatus] = useState<PostStatus>("backlog");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setSubtitle(editPost.subtitle);
      setType(editPost.type);
      setStatus(editPost.status);
      setDate(editPost.date ?? "");
      setNotes(editPost.notes ?? "");
      setTags(editPost.tags ?? []);
    } else {
      resetForm();
    }
  }, [editPost, open]);

  function resetForm() {
    setTitle("");
    setSubtitle("");
    setType("Réel");
    setStatus("backlog");
    setDate("");
    setNotes("");
    setTags([]);
    setTagInput("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, subtitle, type, status, date: date || undefined, notes: notes || undefined, tags });
    handleClose();
  }

  function addTag(tag: string) {
    const clean = tag.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  if (!open) return null;

  const isEditing = !!editPost;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel latéral */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-card border-l border-border shadow-2xl">
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-foreground font-semibold text-sm">
                {isEditing ? "Modifier la publication" : "Nouvelle publication"}
              </h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                {isEditing ? "Modifiez les informations" : "Ajoutez une idée ou planifiez un post"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Titre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ex : Guide entretien des bijoux en or"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Sous-titre */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Sous-titre / Description courte</Label>
            <Input
              id="subtitle"
              placeholder="Ex : 3 astuces pour garder vos bijoux comme neufs"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          {/* Type de post */}
          <div className="space-y-2">
            <Label>Type de post</Label>
            <div className="grid grid-cols-2 gap-2">
              {POST_TYPES.map((t) => {
                const config = POST_TYPE_CONFIG[t];
                const isSelected = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm transition-all",
                      isSelected
                        ? cn(config.bg, config.color, "border", config.badge.split(" ")[2], "font-medium")
                        : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-muted/30"
                    )}
                  >
                    <span className={cn("w-2 h-2 rounded-full", config.dot)} />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label>Statut</Label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const config = POST_STATUS_CONFIG[s.value];
                const isSelected = status === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStatus(s.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all",
                      isSelected
                        ? cn(config.bg, config.color, config.border, "font-semibold")
                        : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-muted/30"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isSelected ? config.dot : "bg-muted-foreground")} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date de postage */}
          <div className="space-y-2">
            <Label htmlFor="date">Date de postage</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="[color-scheme:dark]"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes de production</Label>
            <Textarea
              id="notes"
              placeholder="Ex : Filmer en lumière naturelle, format 9:16, utiliser le preset Warm..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            {/* Tags existants */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive transition-colors ml-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Input tag custom */}
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => addTag(tagInput)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-5 border-t border-border">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleClose}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1 gap-2"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            <Sparkles className="h-4 w-4" />
            {isEditing ? "Enregistrer" : "Ajouter"}
          </Button>
        </div>
      </div>
    </>
  );
}
