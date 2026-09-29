import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Network, Database, Lock, FileCheck2, BookOpen, Presentation, Rocket, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/architecture", label: "Architecture", icon: Network },
  { to: "/data", label: "Data", icon: Database },
  { to: "/security", label: "Security", icon: Lock },
  { to: "/audit", label: "Audit", icon: FileCheck2 },
  { to: "/presentation", label: "Presentation", icon: BookOpen },
  { to: "/pitchdeck", label: "Pitch deck", icon: Presentation },
  { to: "/pricing", label: "Upgrade", icon: Rocket, badge: "from $1" },
  { to: "/login", label: "Login", icon: LogIn },
];

export function TopNav() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="-mx-1 flex items-center gap-0.5 overflow-x-auto">
      {items.map((it) => {
        const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
        const isUpgrade = it.to === "/pricing";
        return (
          <Link
            key={it.to}
            to={it.to}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
              active
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : isUpgrade
                  ? "bg-ok/10 text-ok hover:bg-ok/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <it.icon className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">{it.label}</span>{" "}
            {it.badge && (
              <span className="rounded-full bg-ok/20 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-ok">
                {it.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
