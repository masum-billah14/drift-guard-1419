import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  ArrowRight,
  Activity,
  Bot,
  Zap,
  Database,
  Network,
  Lock,
  FileCheck2,
} from "lucide-react";
import { kpis } from "@/lib/mock-data";
import { LiveBg } from "@/components/live-bg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SecureAI — AI Security Operations Copilot for lean teams" },
      {
        name: "description",
        content:
          "SMEs get breached because they can't afford 24/7 SOC. SecureAI's AI agents detect anomalies, explain why, and respond in seconds.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/40">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight">SecureAI</span>
          </Link>
          <nav className="hidden gap-5 text-[13px] text-muted-foreground md:flex">
            <Link to="/architecture" className="hover:text-foreground">Architecture</Link>
            <Link to="/data" className="hover:text-foreground">Data</Link>
            <Link to="/security" className="hover:text-foreground">Security</Link>
            <Link to="/presentation" className="hover:text-foreground">Presentation</Link>
            <Link to="/pitchdeck" className="hover:text-foreground">Pitch deck</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/demo-user"
              className="rounded-md border border-border bg-panel px-3 py-1.5 text-[13px] font-medium hover:bg-accent"
            >
              Analyst demo
            </Link>
            <Link
              to="/demo-admin"
              className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Admin demo
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <LiveBg />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-mono-tech text-primary backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ok" />
            </span>
            LIVE · v0.1 · Idea to Unicorn 2026
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            SMEs get breached because they can't afford a{" "}
            <span
              className="glow-text bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, color-mix(in oklab, var(--primary) 90%, white), color-mix(in oklab, var(--ok) 85%, white))",
              }}
            >
              24/7 SOC.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            SecureAI is an AI security copilot: autonomous agents that detect anomalies,
            <span className="text-foreground"> explain their reasoning in plain language</span>,
            and take contained response actions — so a team of two can hold the line.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/demo-user"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_-8px_var(--primary)] transition-all hover:shadow-[0_0_60px_-4px_var(--primary)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              View live demo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/demo-admin"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-panel/60 px-5 py-2.5 text-sm font-medium backdrop-blur hover:border-primary/50 hover:bg-accent"
            >
              Enter as admin
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 backdrop-blur sm:grid-cols-4">
            <Stat label="Threats detected today" value="1,284" tone="critical" />
            <Stat label="Avg response time" value={`${kpis.mttr_seconds}s`} tone="primary" />
            <Stat label="Auto-resolved" value={`${Math.round(kpis.auto_resolved_pct * 100)}%`} tone="ok" />
            <Stat label="False positive rate" value={`${(kpis.false_positive_rate * 100).toFixed(1)}%`} tone="low" />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground">Three autonomous agents, one accountable pipeline.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Step
              n="01"
              icon={Activity}
              title="Event"
              body="Logs, auth, network and cloud events stream in through connectors. We embed and store baselines in a vector DB."
            />
            <Step
              n="02"
              icon={Bot}
              title="AI Detection"
              body="A Detector agent flags anomalies. An Investigator agent retrieves similar past incidents and enriches with threat intel."
            />
            <Step
              n="03"
              icon={Zap}
              title="Response"
              body="A Responder agent executes contained actions (block IP, revoke session) or escalates to a human — with full reasoning trail."
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Built for judges to inspect</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every architectural and governance decision is a page you can open, not a slide.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <DocLink to="/architecture" icon={Network} title="Architecture" body="Event → embedding → vector lookup → LLM reasoning → response." />
            <DocLink to="/data" icon={Database} title="Data" body="Sources, ingestion, retention and anonymization." />
            <DocLink to="/security" icon={Lock} title="Security" body="Auth, encryption, sovereignty, GDPR-aligned posture." />
            <DocLink to="/audit" icon={FileCheck2} title="Audit" body="One-click security/privacy/governance report." />
            <DocLink to="/presentation" icon={Activity} title="Presentation" body="Problem, solution, market, impact." />
            <DocLink to="/pitchdeck" icon={ShieldCheck} title="Pitch deck" body="YC-style deck for the finals." />
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "critical" | "primary" | "ok" | "low" }) {
  const toneMap = {
    critical: "text-critical",
    primary: "text-primary",
    ok: "text-ok",
    low: "text-low",
  } as const;
  return (
    <div className="bg-panel/70 p-5 backdrop-blur transition-colors hover:bg-panel">
      <div className={`text-2xl font-semibold tracking-tight font-mono-tech ${toneMap[tone]}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  body,
}: {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono-tech text-muted-foreground">{n}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-3 text-base font-semibold">{title}</div>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function DocLink({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-lg border border-border bg-panel p-4 transition-colors hover:border-primary/50 hover:bg-accent"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">{title}</span>
        <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">{body}</p>
    </Link>
  );
}
