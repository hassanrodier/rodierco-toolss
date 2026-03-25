import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Instagram,
  Video,
  Layers,
  Clock,
  Image,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlaceholderSection } from "@/components/placeholder-section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH = "Mars 2026";

// Semaine du 23 au 29 mars
const week = [
  {
    day: "Lun",
    date: 23,
    events: [],
  },
  {
    day: "Mar",
    date: 24,
    events: [
      { type: "Story", title: "Promo soldes", color: "bg-pink-400", icon: Clock },
    ],
  },
  {
    day: "Mer",
    date: 25,
    events: [],
    today: true,
  },
  {
    day: "Jeu",
    date: 26,
    events: [
      { type: "Carrousel", title: "5 erreurs bijoux", color: "bg-violet-400", icon: Layers },
    ],
  },
  {
    day: "Ven",
    date: 27,
    events: [
      { type: "Réel", title: "Unboxing printemps", color: "bg-blue-400", icon: Video },
    ],
  },
  {
    day: "Sam",
    date: 28,
    events: [],
  },
  {
    day: "Dim",
    date: 29,
    events: [
      { type: "Photo", title: "Pendentif or blanc", color: "bg-emerald-400", icon: Image },
    ],
  },
];

const upcoming = [
  { date: "26 mars", title: "Carrousel — 5 erreurs à éviter", type: "Carrousel", time: "18h00", color: "bg-violet-400" },
  { date: "27 mars", title: "Réel — Unboxing printemps 2026", type: "Réel", time: "12h00", color: "bg-blue-400" },
  { date: "29 mars", title: "Photo — Pendentif or blanc 18k", type: "Photo", time: "15h00", color: "bg-emerald-400" },
  { date: "1 avril", title: "Carrousel — Guide entretien bijoux", type: "Carrousel", time: "18h00", color: "bg-violet-400" },
  { date: "3 avril", title: "Story — Nouvelle collection", type: "Story", time: "09h00", color: "bg-pink-400" },
];

export default function CalendrierPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Calendrier de contenu"
        description="Planifiez et organisez vos publications à l'avance"
        icon={CalendarDays}
        iconColor="text-violet-400"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          Vue mensuelle
        </Button>
        <Button size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Planifier
        </Button>
      </PageHeader>

      {/* Vue semaine */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* En-tête du calendrier */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{MONTH}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">Semaine 13</span>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 divide-x divide-border">
          {week.map((day) => (
            <div key={day.day} className="min-h-[140px]">
              {/* En-tête jour */}
              <div
                className={cn(
                  "flex flex-col items-center py-3 border-b border-border",
                  day.today && "bg-primary/5"
                )}
              >
                <span className="text-muted-foreground text-xs">{day.day}</span>
                <span
                  className={cn(
                    "text-sm font-semibold mt-1 w-7 h-7 flex items-center justify-center rounded-full",
                    day.today
                      ? "bg-primary text-white"
                      : "text-foreground"
                  )}
                >
                  {day.date}
                </span>
              </div>

              {/* Événements */}
              <div className="p-2 space-y-1">
                {day.events.map((event, i) => {
                  const Icon = event.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-muted hover:bg-accent cursor-pointer transition-colors group"
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", event.color)} />
                      <span className="text-[11px] text-foreground truncate leading-tight">
                        {event.title}
                      </span>
                    </div>
                  );
                })}
                <button className="w-full flex items-center justify-center py-1 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                  <PlusCircle className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications à venir */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Prochaines publications
        </h2>
        <div className="space-y-2">
          {upcoming.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors cursor-pointer"
            >
              <span className={cn("w-2 h-2 rounded-full shrink-0", item.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm truncate">{item.title}</p>
              </div>
              <Badge variant="outline" className="shrink-0 text-[10px] text-muted-foreground border-border">
                {item.type}
              </Badge>
              <div className="text-right shrink-0">
                <p className="text-foreground text-xs font-medium">{item.date}</p>
                <p className="text-muted-foreground text-xs">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fonctionnalités à venir */}
      <PlaceholderSection
        title="Vue mensuelle & récurrence"
        description="La vue mensuelle complète, les publications récurrentes et l'intégration directe avec Instagram API sont en cours de développement."
        icon={CalendarDays}
        iconColor="text-violet-400"
        features={[
          "Vue mensuelle",
          "Publications récurrentes",
          "Intégration Instagram API",
          "Rappels automatiques",
          "Glisser-déposer",
        ]}
      />
    </div>
  );
}
