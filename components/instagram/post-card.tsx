"use client";

import {
  Video,
  Layers,
  Clock,
  Image,
  MoreHorizontal,
  Trash2,
  Edit3,
  CalendarDays,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Post, POST_TYPE_CONFIG, POST_STATUS_CONFIG } from "@/lib/instagram-types";

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onEdit: (post: Post) => void;
}

const TYPE_ICONS = {
  Réel: Video,
  Carrousel: Layers,
  Story: Clock,
  Photo: Image,
};

export function PostCard({ post, onDelete, onEdit }: PostCardProps) {
  const typeConfig = POST_TYPE_CONFIG[post.type];
  const TypeIcon = TYPE_ICONS[post.type];

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card p-4 transition-all duration-200",
        "hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5",
        "border-border hover:border-primary/30"
      )}
    >
      {/* Header : type + actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-lg",
              typeConfig.bg
            )}
          >
            <TypeIcon className={cn("h-3.5 w-3.5", typeConfig.color)} />
          </div>
          <span
            className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
              typeConfig.badge
            )}
          >
            {post.type}
          </span>
        </div>

        {/* Actions au survol */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(post)}
            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-muted transition-colors"
          >
            <Edit3 className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>

      {/* Titre */}
      <h3 className="text-foreground text-sm font-semibold leading-snug mb-1">
        {post.title}
      </h3>

      {/* Sous-titre */}
      {post.subtitle && (
        <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">
          {post.subtitle}
        </p>
      )}

      {/* Notes */}
      {post.notes && (
        <p className="text-muted-foreground/70 text-[11px] italic leading-relaxed mb-3 line-clamp-2 border-l-2 border-border pl-2">
          {post.notes}
        </p>
      )}

      {/* Footer : tags + date */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {post.tags && post.tags.length > 0 ? (
            post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-muted-foreground/50">Aucun tag</span>
          )}
        </div>

        {/* Date */}
        {formattedDate && (
          <div className="flex items-center gap-1 shrink-0">
            <CalendarDays className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
