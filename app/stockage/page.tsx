import {
  HardDrive,
  Video,
  Layers,
  Clock,
  Image,
  Upload,
  Search,
  Filter,
  FolderOpen,
  Film,
  Grid3X3,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceholderSection } from "@/components/placeholder-section";
import { cn } from "@/lib/utils";

const categories = [
  {
    label: "Tous",
    count: 47,
    active: true,
  },
  {
    label: "Vidéos",
    count: 18,
    active: false,
  },
  {
    label: "Carrousels",
    count: 14,
    active: false,
  },
  {
    label: "Stories",
    count: 15,
    active: false,
  },
];

const storageItems = [
  {
    title: "Unboxing collection printemps 2026",
    type: "Vidéo",
    icon: Video,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    size: "248 Mo",
    duration: "2:34",
    date: "22 mars 2026",
    tags: ["Réel", "Produit"],
    status: "Prêt",
  },
  {
    title: "Carrousel — 5 erreurs bijoux",
    type: "Carrousel",
    icon: Layers,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-400/10",
    size: "12.4 Mo",
    duration: "8 slides",
    date: "20 mars 2026",
    tags: ["Éducatif"],
    status: "Planifié",
  },
  {
    title: "Séquence stories — Soldes",
    type: "Stories",
    icon: Clock,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-400/10",
    size: "34.8 Mo",
    duration: "5 stories",
    date: "18 mars 2026",
    tags: ["Promo", "Stories"],
    status: "Publié",
  },
  {
    title: "Pendentif or blanc 18 carats",
    type: "Photo",
    icon: Image,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
    size: "5.2 Mo",
    duration: "1 photo",
    date: "15 mars 2026",
    tags: ["Produit"],
    status: "Publié",
  },
  {
    title: "Réel tendance — GRWM bijoux",
    type: "Vidéo",
    icon: Video,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    size: "185 Mo",
    duration: "1:12",
    date: "12 mars 2026",
    tags: ["Réel", "Lifestyle"],
    status: "Brouillon",
  },
  {
    title: "Carrousel — Guide entretien",
    type: "Carrousel",
    icon: Layers,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-400/10",
    size: "8.7 Mo",
    duration: "6 slides",
    date: "10 mars 2026",
    tags: ["Éducatif"],
    status: "Brouillon",
  },
];

const statusStyles: Record<string, string> = {
  "Publié": "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  "Planifié": "bg-blue-400/10 text-blue-400 border-blue-400/20",
  "Prêt": "bg-violet-400/10 text-violet-400 border-violet-400/20",
  "Brouillon": "bg-muted text-muted-foreground border-border",
};

export default function StockagePage() {
  const totalSize = "2.1 Go";
  const usedPercent = 42;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Stockage de contenu"
        description="Centralisez vos vidéos, carrousels et séquences stories"
        icon={HardDrive}
        iconColor="text-emerald-400"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          Rechercher
        </Button>
        <Button size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Importer
        </Button>
      </PageHeader>

      {/* Stockage utilisé */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-400/10">
              <HardDrive className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-foreground text-sm font-medium">Stockage utilisé</p>
              <p className="text-muted-foreground text-xs">
                {totalSize} utilisé sur 5 Go
              </p>
            </div>
          </div>
          <span className="text-foreground text-sm font-semibold">{usedPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Film className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs text-muted-foreground">Vidéos : 1.4 Go</span>
          </div>
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs text-muted-foreground">Carrousels : 420 Mo</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-pink-400" />
            <span className="text-xs text-muted-foreground">Stories : 280 Mo</span>
          </div>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat.label}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
              cat.active
                ? "bg-primary text-white font-medium"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {cat.label}
            <span
              className={cn(
                "text-[11px] px-1.5 py-0 rounded-full",
                cat.active ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
              )}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Zone d'import */}
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted mx-auto mb-3">
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-foreground text-sm font-medium mb-1">
          Déposez vos fichiers ici
        </p>
        <p className="text-muted-foreground text-xs mb-3">
          MP4, MOV, JPG, PNG, PDF — Max 500 Mo par fichier
        </p>
        <Button variant="outline" size="sm">Parcourir</Button>
      </div>

      {/* Grille de contenu */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            Contenu récent
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{storageItems.length} fichiers</span>
          </div>
        </div>
        <div className="space-y-2">
          {storageItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", item.iconBg)}>
                  <Icon className={cn("h-4 w-4", item.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm truncate">{item.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-muted-foreground text-xs">{item.type}</span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs">{item.duration}</span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs">{item.size}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", statusStyles[item.status])}
                  >
                    {item.status}
                  </Badge>
                  <p className="text-muted-foreground text-[11px] mt-1">{item.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fonctionnalités à venir */}
      <PlaceholderSection
        title="Stockage cloud & organisation avancée"
        description="La vue grille, les dossiers intelligents, les tags automatiques et la prévisualisation de contenu seront disponibles prochainement."
        icon={FolderOpen}
        iconColor="text-emerald-400"
        features={[
          "Vue grille / liste",
          "Dossiers intelligents",
          "Tags automatiques IA",
          "Prévisualisation",
          "Partage de liens",
          "Versioning",
        ]}
      />
    </div>
  );
}
