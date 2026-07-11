import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, Bot, Settings, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopNav } from "@/components/top-nav";

type Role = "admin" | "analyst";

function getRole(): Role {
  if (typeof window === "undefined") return "analyst";
  return (window.localStorage.getItem("secureai:role") as Role) ?? "analyst";
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [role, setRole] = useState<Role>("analyst");
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    setRole(getRole());
    const tick = () => setNow(new Date().toUTCString().slice(17, 25) + " UTC");
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const sidebarItems =
    role === "admin"
      ? [{ to: "/admin", label: "Admin panel", icon: Settings }]
      : [{ to: "/app", label: "Console", icon: LayoutDashboard }];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="sticky top-0 z-30 w-full border-b border-border bg-background/90 px-4 py-1.5 backdrop-blur">
        <TopNav />
      </div>
      <div className="flex min-h-0 flex-1">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/40">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight">SecureAI</div>
            <div className="truncate text-[10px] font-mono-tech text-muted-foreground">SOC-Copilot v0.1</div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 p-2">
          <div className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {role === "admin" ? "Admin" : "Operations"}
          </div>
          {sidebarItems.map((item) => {
            const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/40 p-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-ok opacity-60 animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-ok" />
            </span>
            <div className="min-w-0 text-[11px]">
              <div className="font-medium">All systems operational</div>
              <div className="font-mono-tech text-muted-foreground">6 agents online</div>
            </div>
          </div>
          <Link
            to="/"
            className="mt-2 flex items-center gap-2 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Exit demo
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="border-b border-border/60 bg-background/70 px-4 py-1.5">
            <TopNav />
          </div>
          <div className="flex h-14 items-center gap-3 px-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Bot className="hidden h-4 w-4 shrink-0 text-primary md:block" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Security Operations Console</div>
                <div className="truncate text-[11px] font-mono-tech text-muted-foreground">
                  tenant: acme-prod · region: eu-central-1
                </div>
              </div>
            </div>
            <div className="hidden items-center gap-3 text-[11px] font-mono-tech text-muted-foreground sm:flex">
              <span>{now}</span>
              <span className="h-4 w-px bg-border" />
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                live
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-panel px-2 py-1 text-[11px]">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-medium">{role === "admin" ? "Admin" : "Analyst"}</span>
              <span className="hidden font-mono-tech text-muted-foreground sm:inline">
                {role === "admin" ? "j.chen" : "a.morales"}
              </span>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
