import {
  Users,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  BarChart2,
  Search,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlaceholderSection } from "@/components/placeholder-section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const competitors = [
  {
    name: "@bijoux_luxe_paris",
    followers: "48.2K",
    engagementRate: "3.8%",
    postsThisMonth: 14,
    trend: "up",
    trendValue: "+2.1K",
    tags: ["Bijoux", "Luxe"],
    avatar: "BL",
    avatarGradient: "from-amber-500 to-yellow-400",
  },
  {
    name: "@or_et_argent_france",
    followers: "31.5K",
    engagementRate: "5.2%",
    postsThisMonth: 22,
    trend: "up",
    trendValue: "+890",
    tags: ["Bijoux", "Artisanat"],
    avatar: "OA",
    avatarGradient: "from-slate-500 to-zinc-400",
  },
  {
    name: "@maison_joaillerie",
    followers: "62.1K",
    engagementRate: "2.9%",
    postsThisMonth: 8,
    trend: "down",
    trendValue: "-320",
    tags: ["Joaillerie", "Luxe"],
    avatar: "MJ",
    avatarGradient: "from-rose-500 to-pink-400",
  },
  {
    name: "@tendance_bijoux_fr",
    followers: "19.7K",
    engagementRate: "6.4%",
    postsThisMonth: 31,
    trend: "up",
    trendValue: "+1.2K",
    tags: ["Tendance", "Mode"],
    avatar: "TB",
    avatarGradient: "from-violet-500 to-purple-400",
  },
];

export default function ConcurrentsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Traqueur de concurrents"
        description="Surveillez la stratégie et les performances de vos concurrents"
        icon={Users}
        iconColor="text-amber-400"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          Rechercher
        </Button>
        <Button size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Ajouter un concurrent
        </Button>
      </PageHeader>

      {/* Résumé comparatif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-muted-foreground text-sm mb-1">Vos abonnés</p>
          <p className="text-2xl font-bold text-foreground">24.8K</p>
          <p className="text-xs text-muted-foreground mt-1">vs moyenne concurrents : 40.4K</p>
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "61%" }} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-muted-foreground text-sm mb-1">Votre taux d'engagement</p>
          <p className="text-2xl font-bold text-foreground">5.1%</p>
          <p className="text-xs text-emerald-400 mt-1">↑ Au-dessus de la moyenne (4.6%)</p>
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: "75%" }} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-muted-foreground text-sm mb-1">Publications ce mois</p>
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-xs text-red-400 mt-1">↓ En-dessous de la moyenne (18.75)</p>
          <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-red-400 rounded-full" style={{ width: "40%" }} />
          </div>
        </div>
      </div>

      {/* Liste des concurrents */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Concurrents suivis ({competitors.length})
        </h2>
        <div className="space-y-3">
          {competitors.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br text-white font-semibold text-xs shrink-0",
                  c.avatarGradient
                )}
              >
                {c.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-foreground text-sm font-medium">{c.name}</p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {c.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Métriques */}
              <div className="hidden md:flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">{c.followers}</p>
                  <p className="text-muted-foreground text-xs">abonnés</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">{c.engagementRate}</p>
                  <p className="text-muted-foreground text-xs">engagement</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">{c.postsThisMonth}</p>
                  <p className="text-muted-foreground text-xs">posts/mois</p>
                </div>
                <div className="flex items-center gap-1">
                  {c.trend === "up" ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs">{c.trendValue}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 text-xs">{c.trendValue}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fonctionnalités à venir */}
      <PlaceholderSection
        title="Veille concurrentielle avancée"
        description="L'analyse automatique des publications concurrentes, les alertes et les rapports comparatifs seront disponibles prochainement."
        icon={BarChart2}
        iconColor="text-amber-400"
        features={[
          "Alertes de publication",
          "Analyse de contenu IA",
          "Rapport comparatif",
          "Historique des posts",
          "Benchmark automatique",
        ]}
      />
    </div>
  );
}
