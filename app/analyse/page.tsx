import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  Target,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { PlaceholderSection } from "@/components/placeholder-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const topPosts = [
  {
    title: "5 erreurs à éviter quand on achète des bijoux",
    type: "Carrousel",
    views: "12.4K",
    likes: "847",
    comments: "63",
    trend: "up",
  },
  {
    title: "Unboxing collection printemps 2026",
    type: "Réel",
    views: "9.1K",
    likes: "612",
    comments: "41",
    trend: "up",
  },
  {
    title: "Nouveau pendentif or blanc 18 carats",
    type: "Photo",
    views: "5.3K",
    likes: "389",
    comments: "28",
    trend: "down",
  },
];

export default function AnalysePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Analyse"
        description="Suivez vos performances et métriques de contenu"
        icon={BarChart3}
        iconColor="text-blue-400"
      >
        <Button variant="outline" size="sm">
          Exporter le rapport
        </Button>
        <Button size="sm" className="gap-2">
          <Target className="h-4 w-4" />
          Définir des objectifs
        </Button>
      </PageHeader>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Portée totale"
          value="182.4K"
          change="↑ +22% vs mois dernier"
          changeType="positive"
          icon={Eye}
          iconColor="text-blue-400"
          iconBg="bg-blue-400/10"
        />
        <StatCard
          title="Taux d'engagement"
          value="5.1%"
          change="↑ +0.8% vs mois dernier"
          changeType="positive"
          icon={Heart}
          iconColor="text-pink-400"
          iconBg="bg-pink-400/10"
        />
        <StatCard
          title="Nouveaux abonnés"
          value="+1 243"
          change="↑ +18% vs mois dernier"
          changeType="positive"
          icon={UserPlus}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
        />
        <StatCard
          title="Partages"
          value="2.8K"
          change="↓ -5% vs mois dernier"
          changeType="negative"
          icon={Share2}
          iconColor="text-amber-400"
          iconBg="bg-amber-400/10"
        />
      </div>

      {/* Graphique placeholder */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-foreground">
            Évolution de la portée — 30 derniers jours
          </h2>
          <div className="flex gap-2">
            {["7j", "30j", "90j"].map((period, i) => (
              <button
                key={period}
                className={cn(
                  "px-3 py-1 rounded-md text-xs transition-colors",
                  i === 1
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        {/* Graphique simulé */}
        <div className="h-48 flex items-end gap-1.5 px-2">
          {[40, 55, 35, 65, 70, 50, 80, 75, 60, 90, 85, 95, 70, 88, 65, 75, 82, 78, 91, 85, 70, 88, 94, 80, 86, 92, 75, 88, 95, 100].map(
            (h, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-t transition-all",
                  i === 29
                    ? "bg-primary"
                    : "bg-primary/30 hover:bg-primary/50"
                )}
                style={{ height: `${h}%` }}
              />
            )
          )}
        </div>
        <div className="flex justify-between mt-2 px-2">
          <span className="text-muted-foreground text-xs">1 mars</span>
          <span className="text-muted-foreground text-xs">25 mars</span>
        </div>
      </div>

      {/* Top publications */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Meilleures publications ce mois
        </h2>
        <div className="space-y-3">
          {topPosts.map((post, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
            >
              <span className="text-muted-foreground text-sm font-mono w-5 shrink-0">
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium truncate">
                  {post.title}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {post.type}
                </p>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">{post.views}</p>
                  <p className="text-muted-foreground text-xs">vues</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">{post.likes}</p>
                  <p className="text-muted-foreground text-xs">likes</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">{post.comments}</p>
                  <p className="text-muted-foreground text-xs">comments</p>
                </div>
                {post.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400 shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fonctionnalités avancées placeholder */}
      <PlaceholderSection
        title="Analyse approfondie"
        description="Les rapports détaillés, l'analyse de l'audience et les recommandations IA seront disponibles prochainement."
        icon={BarChart3}
        iconColor="text-blue-400"
        features={[
          "Analyse démographique",
          "Heatmap d'engagement",
          "Recommandations IA",
          "Export PDF/CSV",
          "Alertes de performance",
        ]}
      />
    </div>
  );
}
