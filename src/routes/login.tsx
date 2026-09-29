import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, UserCog, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — DriftGuard" },
      { name: "description", content: "Sign in to the DriftGuard security operations console — analyst or admin demo." },
      { property: "og:title", content: "Sign in — DriftGuard" },
      { property: "og:description", content: "Sign in to the DriftGuard security operations console — analyst or admin demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AppShell hideSidebar>
      <div className="relative mx-auto flex min-h-[calc(100vh-110px)] max-w-4xl flex-col items-center justify-center px-6 py-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-mono-tech text-primary">
          <Sparkles className="h-3 w-3" /> demo access
        </div>
        <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Sign in to <span className="text-primary">DriftGuard</span>
        </h1>
        <p className="mt-3 max-w-md text-center text-sm text-muted-foreground">
          Pick a demo role to explore the console. No password needed — each role opens a pre-seeded tenant.
        </p>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
          <Link
            to="/demo-user"
            className="group relative overflow-hidden rounded-xl border border-border bg-panel p-6 transition-all hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]"
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="text-lg font-semibold">Analyst demo</div>
            <div className="mt-1 text-[13px] text-muted-foreground">
              Security operations console: live incidents, AI triage, log copilot.
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary">
              Enter as a.morales <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link
            to="/demo-admin"
            className="group relative overflow-hidden rounded-xl border border-border bg-panel p-6 transition-all hover:border-ok/50 hover:shadow-[0_0_40px_-10px_hsl(var(--ok)/0.35)]"
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-ok/15 ring-1 ring-ok/40">
              <UserCog className="h-5 w-5 text-ok" />
            </div>
            <div className="text-lg font-semibold">Admin demo</div>
            <div className="mt-1 text-[13px] text-muted-foreground">
              Admin panel: hosts, users, alert rules, AI config, system health.
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ok">
              Enter as j.chen <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        <p className="mt-8 text-[11px] font-mono-tech text-muted-foreground">
          tenant: acme-prod · region: eu-central-1 · demo data only
        </p>
      </div>
    </AppShell>
  );
}
