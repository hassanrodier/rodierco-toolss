import {
  Instagram,
  BarChart3,
  CalendarDays,
  Users,
  HardDrive,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/stat-card";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Gestionnaire Instagram",
    description: "Gérez vos publications, stories et reels Instagram",
    href: "/instagram",
    icon: Instagram,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-400/10",
    gradient: "from-pink-500/10 to-rose-500/5",
    border: "border-pink-500/20",
  },
  {
    title: "Analyse",
    description: "Suivez vos métriques et performances en temps réel",
    href: "/analyse",
    icon: BarChart3,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    gradient: "from-blue-500/10 to-cyan-500/5",
    border: "border-blue-500/20",
  },
  {
    title: "Calendrier de contenu",
    description: "Planifiez et organisez votre contenu à l'avance",
    href: "/calendrier",
    icon: CalendarDays,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-400/10",
    gradient: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/20",
  },
  {
    title: "Traqueur de concurrents",
    description: "Surveillez la stratégie et les publications de vos concurrents",
    href: "/concurrents",
    icon: Users,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-400/10",
    gradient: "from-amber-500/10 to-yellow-500/5",
    border: "border-amber-500/20",
  },
  {
    title: "Stockage de contenu",
    description: "Centralisez vos vidéos, carrousels et séquences stories",
    href: "/stockage",
    icon: HardDrive,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    gradient: "from-emerald-500/10 to-green-500/5",
    border: "border-emerald-500/20",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bonjour, RodierCo 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Voici un aperçu de votre activité de contenu
        </p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Abonnés totaux"
          value="24.8K"
          change="↑ +1.2K ce mois"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Vues totales"
          value="182.4K"
          change="↑ +22% vs mois dernier"
          changeType="positive"
          icon={Eye}
          iconColor="text-blue-400"
          iconBg="bg-blue-400/10"
        />
        <StatCard
          title="Interactions"
          value="9.3K"
          change="↓ -3% vs mois dernier"
          changeType="negative"
          icon={Heart}
          iconColor="text-pink-400"
          iconBg="bg-pink-400/10"
        />
        <StatCard
          title="Commentaires"
          value="1.1K"
          change="→ Stable"
          changeType="neutral"
          icon={MessageCircle}
          iconColor="text-amber-400"
          iconBg="bg-amber-400/10"
        />
      </div>

      {/* Sections */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className={cn(
                  "group relative flex flex-col p-5 rounded-xl border bg-gradient-to-br transition-all duration-200",
                  "hover:shadow-lg hover:scale-[1.01] hover:border-primary/40",
                  section.gradient,
                  section.border
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl", section.iconBg)}>
                    <Icon className={cn("h-5 w-5", section.iconColor)} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-foreground font-semibold text-sm mb-1">
                  {section.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {section.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Activité récente placeholder */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Activité récente
        </h2>
        <div className="space-y-3">
          {[
            { action: "Publication planifiée", detail: "Carrousel — Conseils bijoux", time: "Il y a 2h", color: "bg-violet-400" },
            { action: "Story publiée", detail: "Séquence promotionnelle × 5", time: "Il y a 4h", color: "bg-pink-400" },
            { action: "Analyse générée", detail: "Rapport hebdomadaire semaine 12", time: "Hier", color: "bg-blue-400" },
            { action: "Concurrent ajouté", detail: "@bijoux_luxe_paris", time: "Il y a 2 jours", color: "bg-amber-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <span className={cn("w-2 h-2 rounded-full shrink-0", item.color)} />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-foreground font-medium">{item.action}</span>
                <span className="text-muted-foreground text-sm"> — {item.detail}</span>
              </div>
              <span className="text-muted-foreground text-xs shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
