import { type LucideIcon, Construction } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderSectionProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  features?: string[];
  comingSoon?: boolean;
}

export function PlaceholderSection({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  features = [],
  comingSoon = true,
}: PlaceholderSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
      <div className={cn("flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-5")}>
        {Icon ? (
          <Icon className={cn("h-8 w-8", iconColor)} />
        ) : (
          <Construction className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-6">
        {description}
      </p>

      {features.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center max-w-lg">
          {features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs border border-border"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              {feature}
            </span>
          ))}
        </div>
      )}

      {comingSoon && (
        <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-xs font-medium">En développement</span>
        </div>
      )}
    </div>
  );
}
