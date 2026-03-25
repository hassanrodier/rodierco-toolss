"use client";

import { useState, useMemo } from "react";
import {
  Instagram,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  Video,
  Layers,
  Clock,
  Image,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/instagram/post-card";
import { NewPostModal } from "@/components/instagram/new-post-modal";
import { cn } from "@/lib/utils";
import {
  type Post,
  type PostStatus,
  type PostType,
  POST_STATUS_CONFIG,
  POST_TYPE_CONFIG,
  POST_TYPES,
  INITIAL_POSTS,
} from "@/lib/instagram-types";

const COLUMNS: PostStatus[] = ["backlog", "brouillon", "programme", "publie"];

const TYPE_FILTER_ICONS: Record<PostType, React.ElementType> = {
  Réel: Video,
  Carrousel: Layers,
  Story: Clock,
  Photo: Image,
};

export default function InstagramPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<PostType | null>(null);

  // --- Actions CRUD ---
  function handleAddPost(data: Omit<Post, "id" | "createdAt">) {
    const newPost: Post = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPosts((prev) => [newPost, ...prev]);
  }

  function handleEditPost(data: Omit<Post, "id" | "createdAt">) {
    if (!editPost) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === editPost.id ? { ...p, ...data } : p))
    );
    setEditPost(null);
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function openEdit(post: Post) {
    setEditPost(post);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditPost(null);
  }

  // --- Filtres ---
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.subtitle.toLowerCase().includes(search.toLowerCase());
      const matchType = !filterType || post.type === filterType;
      return matchSearch && matchType;
    });
  }, [posts, search, filterType]);

  const postsByStatus = useMemo(() => {
    return COLUMNS.reduce((acc, status) => {
      acc[status] = filteredPosts.filter((p) => p.status === status);
      return acc;
    }, {} as Record<PostStatus, Post[]>);
  }, [filteredPosts]);

  const totalPosts = posts.length;
  const stats = {
    publie: posts.filter((p) => p.status === "publie").length,
    programme: posts.filter((p) => p.status === "programme").length,
    brouillon: posts.filter((p) => p.status === "brouillon").length,
    backlog: posts.filter((p) => p.status === "backlog").length,
  };

  return (
    <>
      <div className="flex flex-col h-full space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-pink-400/10">
              <Instagram className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Gestionnaire Instagram
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {totalPosts} publication{totalPosts > 1 ? "s" : ""} au total
              </p>
            </div>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            Nouvelle idée
          </Button>
        </div>

        {/* ── Stats rapides ── */}
        <div className="grid grid-cols-4 gap-3">
          {COLUMNS.map((status) => {
            const config = POST_STATUS_CONFIG[status];
            const count = stats[status];
            return (
              <div
                key={status}
                className={cn(
                  "rounded-xl border p-4 flex items-center gap-3",
                  config.border,
                  config.headerBg
                )}
              >
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", config.dot)} />
                <div className="min-w-0">
                  <p className={cn("text-xl font-bold", config.color)}>{count}</p>
                  <p className="text-muted-foreground text-xs truncate">{config.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Barre de recherche & filtres ── */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une publication..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filtre par type */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilterType(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs transition-colors",
                  !filterType
                    ? "bg-primary text-white font-medium"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                Tous
              </button>
              {POST_TYPES.map((t) => {
                const config = POST_TYPE_CONFIG[t];
                const Icon = TYPE_FILTER_ICONS[t];
                return (
                  <button
                    key={t}
                    onClick={() => setFilterType(filterType === t ? null : t)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors",
                      filterType === t
                        ? cn(config.bg, config.color, "font-semibold")
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Tableau Kanban ── */}
        <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
          {COLUMNS.map((status) => {
            const config = POST_STATUS_CONFIG[status];
            const columnPosts = postsByStatus[status];

            return (
              <div key={status} className="flex flex-col min-h-0">
                {/* En-tête de colonne */}
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl border mb-3",
                    config.headerBg,
                    config.border
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", config.dot)} />
                    <span className={cn("text-sm font-semibold", config.color)}>
                      {config.label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                      config.bg,
                      config.color
                    )}
                  >
                    {columnPosts.length}
                  </span>
                </div>

                {/* Cartes */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-0.5 pb-4">
                  {columnPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-border text-center">
                      <LayoutGrid className="h-6 w-6 text-muted-foreground/30 mb-2" />
                      <p className="text-muted-foreground/50 text-xs">
                        Aucune publication
                      </p>
                    </div>
                  ) : (
                    columnPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onDelete={handleDelete}
                        onEdit={openEdit}
                      />
                    ))
                  )}

                  {/* Bouton d'ajout rapide en bas de chaque colonne */}
                  <button
                    onClick={() => {
                      setEditPost(null);
                      setModalOpen(true);
                    }}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed text-xs transition-all",
                      "border-border text-muted-foreground/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Ajouter
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal ── */}
      <NewPostModal
        open={modalOpen}
        onClose={closeModal}
        onSave={editPost ? handleEditPost : handleAddPost}
        editPost={editPost}
      />
    </>
  );
}
