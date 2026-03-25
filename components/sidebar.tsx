"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Instagram,
  BarChart3,
  CalendarDays,
  Users,
  HardDrive,
  LayoutDashboard,
  Settings,
  Bell,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Instagram",
    href: "/instagram",
    icon: Instagram,
    badge: "Nouveau",
  },
  {
    title: "Analyse",
    href: "/analyse",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Calendrier",
    href: "/calendrier",
    icon: CalendarDays,
    badge: null,
  },
  {
    title: "Concurrents",
    href: "/concurrents",
    icon: Users,
    badge: null,
  },
  {
    title: "Stockage",
    href: "/stockage",
    icon: HardDrive,
    badge: null,
  },
];

const bottomItems = [
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: "3",
  },
  {
    title: "Paramètres",
    href: "/parametres",
    icon: Settings,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <div>
          <p className="text-sidebar-foreground font-semibold text-sm leading-none">
            RodierCo
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">Content Studio</p>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                isActive
                  ? "bg-primary text-white font-medium shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                )}
              />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge
                  variant={isActive ? "outline" : "secondary"}
                  className={cn(
                    "text-[10px] px-1.5 py-0 h-4",
                    isActive
                      ? "border-white/40 text-white bg-white/10"
                      : "bg-primary/20 text-primary border-0"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              {isActive && (
                <ChevronRight className="h-3 w-3 text-white/70 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Navigation bas */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                isActive
                  ? "bg-primary text-white font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")} />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-400 text-white font-semibold text-xs">
            RC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-xs font-medium truncate">
              RodierCo Admin
            </p>
            <p className="text-muted-foreground text-[11px] truncate">
              admin@rodierco.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
