import {
  Instagram,
  Image,
  Video,
  Layers,
  Clock,
  CheckCircle2,
  PlusCircle,
  Filter,
  Upload,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const posts = [
  {
    type: "Carrousel",
    title: "5 erreurs à éviter quand on achète des bijoux",
    status: "Planifié",
    statusType: "scheduled",
    date: "26 mars 2026 — 18h00",
    icon: Layers,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    type: "Réel",
    title: "Unboxing collection printemps 2026",
    status: "Brouillon",
    statusType: "draft",
    date: "27 mars 2026 — 12h00",
    icon: Video,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    type: "Story",
    title: "Séquence promo — Soldes bijoux",
    status: "Publié",
    statusType: "published",
    date: "24 mars 2026 — 09h30",
    icon: Clock,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    type: "Photo",
    title: "Nouveau pendentif or blanc 18 carats",
    status: "Publié",
    statusType: "published",
    date: "22 mars 2026 — 15h00",
    icon: Image,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

const statusStyles: Record<string, string> = {
  published: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  scheduled: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  draft: "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<string, string> = {
  published: "Publié",
  scheduled: "Planifié",
  draft: "Brouillon",
};

export default function InstagramPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Gestionnaire Instagram"
        description="Créez, planifiez et publiez votre contenu Instagram"
        icon={Instagram}
        iconColor="text-pink-400"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
        <Button size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouvelle publication
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Publications ce mois"
          value="12"
          change="↑ +4 vs mois dernier"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
        />
        <StatCard
          title="Stories publiées"
          value="38"
          change="↑ +12 vs mois dernier"
          changeType="positive"
          icon={Clock}
          iconColor="text-blue-400"
          iconBg="bg-blue-400/10"
        />
        <StatCard
          title="Réels"
          value="5"
          change="→ Stable"
          changeType="neutral"
          icon={Video}
          iconColor="text-pink-400"
          iconBg="bg-pink-400/10"
        />
        <StatCard
          title="Carrousels"
          value="7"
          change="↑ +2 vs mois dernier"
          changeType="positive"
          icon={Layers}
          iconColor="text-violet-400"
          iconBg="bg-violet-400/10"
        />
      </div>

      {/* Zone de création rapide */}
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted mx-auto mb-4">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-foreground font-medium mb-1">Importer du contenu</p>
        <p className="text-muted-foreground text-sm mb-4">
          Glissez-déposez vos médias ou cliquez pour parcourir
        </p>
        <Button variant="outline" size="sm">
          Parcourir les fichiers
        </Button>
      </div>

      {/* Liste des publications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            Publications récentes et planifiées
          </h2>
          <span className="text-xs text-muted-foreground">{posts.length} éléments</span>
        </div>
        <div className="space-y-3">
          {posts.map((post, i) => {
            const Icon = post.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg shrink-0", post.bg)}>
                  <Icon className={cn("h-5 w-5", post.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">
                    {post.title}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {post.type} · {post.date}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn("shrink-0 text-xs", statusStyles[post.statusType])}
                >
                  {statusLabels[post.statusType]}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
