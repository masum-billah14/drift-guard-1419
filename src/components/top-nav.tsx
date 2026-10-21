import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Network, Database, Lock, FileCheck2, BookOpen, Presentation, Rocket, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang, LanguageToggle } from "@/lib/i18n";

export function TopNav() {
  const { bi } = useLang();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const items = [
    { to: "/", label: bi("Home", "হোম"), icon: Home, exact: true },
    { to: "/architecture", label: bi("Architecture", "আর্কিটেকচার"), icon: Network },
    { to: "/data", label: bi("Data", "ডেটা"), icon: Database },
    { to: "/security", label: bi("Security", "নিরাপত্তা"), icon: Lock },
    { to: "/audit", label: bi("Audit", "অডিট"), icon: FileCheck2 },
    { to: "/presentation", label: bi("Presentation", "উপস্থাপনা"), icon: BookOpen },
    { to: "/pitchdeck", label: bi("Pitch deck", "পিচ ডেক"), icon: Presentation },
    { to: "/login", label: bi("Login", "লগইন"), icon: LogIn },
    { to: "/pricing", label: bi("Upgrade", "আপগ্রেড"), icon: Rocket, badge: bi("from $1", "$1 থেকে শুরু"), highlight: true },
  ];
  return (
    <nav className="-mx-1 flex items-center gap-0.5 overflow-x-auto">
      {items.map((it) => {
        const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
        const isUpgrade = Boolean(it.highlight);
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
      <div className="ml-1 shrink-0 pl-0.5">
        <LanguageToggle />
      </div>
    </nav>
  );
}
