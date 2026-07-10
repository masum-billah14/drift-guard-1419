import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SeverityBadge, StatusPill } from "@/components/severity";
import {
  agents,
  usersRows,
  hosts,
  alerts,
  staticRules,
  aiConfig,
  pipelineHealth,
  adminAudit,
  formatTs,
} from "@/lib/mock-data";
import {
  Server,
  Users,
  Bell,
  ShieldAlert,
  Bot,
  Sparkles,
  Activity,
  FileClock,
  Cpu,
  Database,
  Settings2,
  Search,
  Zap,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — SecureAI" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab =
  | "overview"
  | "hosts"
  | "users"
  | "alerts"
  | "rules"
  | "ai"
  | "integrations"
  | "health"
  | "audit";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; fr?: string }[] = [
  { id: "overview",     label: "Overview",       icon: Activity },
  { id: "hosts",        label: "Hosts",          icon: Server,      fr: "FR-1a" },
  { id: "users",        label: "Users",          icon: Users,       fr: "FR-1b" },
  { id: "alerts",       label: "Alerts",         icon: Bell,        fr: "FR-2"  },
  { id: "rules",        label: "Static rules",   icon: ShieldAlert, fr: "FR-3"  },
  { id: "ai",           label: "AI config",      icon: Sparkles,    fr: "FR-4"  },
  { id: "integrations", label: "Integrations",   icon: Plug,        fr: "FR-5"  },
  { id: "health",       label: "System health",  icon: Cpu,         fr: "FR-7"  },
  { id: "audit",        label: "Admin audit",    icon: FileClock,   fr: "FR-8"  },
];

function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <AppShell>
      <div className="border-b border-border bg-gradient-to-b from-panel/70 to-transparent">
        <div className="px-4 py-5 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-primary">
                Administration console
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">SecureAI · Admin</h1>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Manage fleet, alerts, detection rules, AI behavior, and platform health.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-panel px-3 py-2 text-[11px] font-mono-tech text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-ok animate-pulse" />
              tenant <span className="text-foreground">acme-prod</span>
              <span className="mx-2 h-3 w-px bg-border" />
              region <span className="text-foreground">eu-central-1</span>
            </div>
          </div>
        </div>
        <div className="flex overflow-x-auto px-2 md:px-4">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-2 px-3 py-2.5 text-[12.5px] transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                <span className="font-medium">{t.label}</span>
                {t.fr && (
                  <span className="rounded-sm bg-muted px-1 py-px font-mono-tech text-[9px] text-muted-foreground">
                    {t.fr}
                  </span>
                )}
                <span
                  className={cn(
                    "absolute inset-x-2 -bottom-px h-0.5 rounded-t-sm bg-primary transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 md:p-6">
        {tab === "overview" && <OverviewTab onNavigate={setTab} />}
        {tab === "hosts" && <HostsTab />}
        {tab === "users" && <UsersTab />}
        {tab === "alerts" && <AlertsTab />}
        {tab === "rules" && <RulesTab />}
        {tab === "ai" && <AITab />}
        {tab === "integrations" && <IntegrationsTab />}
        {tab === "health" && <HealthTab />}
        {tab === "audit" && <AuditTab />}
      </div>
    </AppShell>
  );
}

/* ---------------- reusable primitives ---------------- */

function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "critical" | "high" | "ok";
}) {
  const toneRing =
    tone === "critical"
      ? "ring-critical/40"
      : tone === "high"
        ? "ring-high/40"
        : tone === "ok"
          ? "ring-ok/40"
          : "ring-border";
  return (
    <div className={cn("rounded-md border border-border bg-panel p-3 ring-1", toneRing)}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono-tech text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Panel({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-panel/40">
      <header className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="ml-auto">{action}</div>}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function SearchBar({ placeholder = "Search…" }: { placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] text-muted-foreground focus-within:border-primary/50">
      <Search className="h-3.5 w-3.5" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-56 bg-transparent placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
}

function Dot({ color }: { color: "ok" | "high" | "critical" | "muted" }) {
  const cls =
    color === "ok"
      ? "bg-ok"
      : color === "high"
        ? "bg-high"
        : color === "critical"
          ? "bg-critical"
          : "bg-muted-foreground";
  return <span className={cn("inline-block h-2 w-2 rounded-full", cls)} />;
}

/* ---------------- tabs ---------------- */

function OverviewTab({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const criticalAlerts = alerts.filter((a) => a.severity === "critical").length;
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Monitored hosts" value={hosts.length} hint={`${hosts.filter((h) => h.status !== "healthy").length} not healthy`} tone={hosts.some((h) => h.status === "offline") ? "high" : "ok"} />
        <Stat label="Open critical alerts" value={criticalAlerts} hint="requires action" tone={criticalAlerts ? "critical" : "ok"} />
        <Stat label="Detection rules" value={staticRules.filter((r) => r.enabled).length} hint={`${staticRules.length - staticRules.filter((r) => r.enabled).length} disabled`} />
        <Stat label="AI agents online" value={agents.filter((a) => a.status === "active").length + "/" + agents.length} hint="Detector · Investigator · Responder" tone="ok" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="What needs you now" subtitle="Highest-signal items across the platform">
          <ul className="space-y-2 text-[13px]">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id} className="flex items-start gap-3 rounded-md border border-border/60 bg-background p-2.5">
                <SeverityBadge severity={a.severity} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{a.title}</div>
                  <div className="mt-0.5 font-mono-tech text-[11px] text-muted-foreground">
                    {a.id} · {a.host} · {formatTs(a.ts)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Fleet snapshot" subtitle="Agent-reported host health">
          <div className="space-y-2">
            {hosts.slice(0, 5).map((h) => (
              <div key={h.id} className="flex items-center gap-3 rounded-md border border-border/60 bg-background p-2.5 text-[12.5px]">
                <Dot color={h.status === "healthy" ? "ok" : h.status === "degraded" ? "high" : "muted"} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono-tech">{h.hostname}</div>
                  <div className="text-[10.5px] text-muted-foreground">{h.os} · {h.role}</div>
                </div>
                <div className="font-mono-tech text-[11px] text-muted-foreground">
                  cpu {h.cpu}% · mem {h.mem}%
                </div>
              </div>
            ))}
            <button onClick={() => onNavigate("hosts")} className="w-full rounded-md border border-dashed border-border py-1.5 text-[11px] text-muted-foreground hover:text-foreground">
              View all hosts →
            </button>
          </div>
        </Panel>
        <Panel title="Pipeline health" subtitle="Ingestion, indexing & agents">
          <div className="space-y-1.5">
            {pipelineHealth.map((c) => (
              <div key={c.component} className="flex items-center gap-2 text-[12px]">
                <Dot color={c.status === "ok" ? "ok" : "high"} />
                <span className="min-w-0 flex-1 truncate">{c.component}</span>
                <span className="font-mono-tech text-[10.5px] text-muted-foreground">{c.latency_ms}ms</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function HostsTab() {
  return (
    <Panel
      title="Managed hosts"
      subtitle={`${hosts.length} endpoints reporting · agent v1.8.2 rolling out`}
      action={
        <div className="flex items-center gap-2">
          <SearchBar placeholder="Search hostname or IP" />
          <button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
            + Enroll host
          </button>
        </div>
      }
    >
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-[12.5px]">
          <thead className="bg-panel text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Host</th>
              <th className="px-3 py-2 text-left font-medium">OS / role</th>
              <th className="px-3 py-2 text-left font-medium">Agent</th>
              <th className="px-3 py-2 text-left font-medium">CPU</th>
              <th className="px-3 py-2 text-left font-medium">Mem</th>
              <th className="px-3 py-2 text-left font-medium">Last seen</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium">Baseline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {hosts.map((h) => (
              <tr key={h.id} className="hover:bg-accent/40">
                <td className="px-3 py-2">
                  <div className="font-mono-tech font-medium">{h.hostname}</div>
                  <div className="font-mono-tech text-[10.5px] text-muted-foreground">{h.ip}</div>
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  <div>{h.os}</div>
                  <div className="text-[10.5px] uppercase tracking-wider">{h.role}</div>
                </td>
                <td className="px-3 py-2 font-mono-tech text-muted-foreground">{h.agent_version}</td>
                <td className="px-3 py-2"><MiniBar value={h.cpu} /></td>
                <td className="px-3 py-2"><MiniBar value={h.mem} /></td>
                <td className="px-3 py-2 font-mono-tech text-[11px] text-muted-foreground">{h.last_seen.slice(11, 19)}Z</td>
                <td className="px-3 py-2">
                  <StatusPill status={h.status === "healthy" ? "active" : h.status === "degraded" ? "degraded" : "inactive"} />
                </td>
                <td className="px-3 py-2 text-[11.5px] text-muted-foreground">{h.baseline_summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function MiniBar({ value }: { value: number }) {
  const tone = value > 80 ? "bg-critical" : value > 60 ? "bg-high" : "bg-ok";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full", tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="font-mono-tech text-[10.5px] text-muted-foreground">{value}%</span>
    </div>
  );
}

function UsersTab() {
  return (
    <Panel
      title="Users & access"
      subtitle={`${usersRows.length} accounts · role-based access, MFA required for admins`}
      action={
        <div className="flex items-center gap-2">
          <SearchBar placeholder="Search users" />
          <button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
            + Invite user
          </button>
        </div>
      }
    >
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-[12.5px]">
          <thead className="bg-panel text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Email</th>
              <th className="px-3 py-2 text-left font-medium">Role</th>
              <th className="px-3 py-2 text-left font-medium">MFA</th>
              <th className="px-3 py-2 text-left font-medium">Last active</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {usersRows.map((u) => (
              <tr key={u.id} className="hover:bg-accent/40">
                <td className="px-3 py-2 font-medium">{u.name}</td>
                <td className="px-3 py-2 font-mono-tech text-muted-foreground">{u.email}</td>
                <td className="px-3 py-2">
                  <span className={cn("rounded-sm border px-1.5 py-px text-[10.5px] font-mono-tech uppercase tracking-wider", u.role === "Admin" ? "border-primary/50 text-primary" : "border-border text-muted-foreground")}>
                    {u.role}
                  </span>
                </td>
                <td className="px-3 py-2"><Dot color="ok" /> <span className="ml-1 font-mono-tech text-[11px]">webauthn</span></td>
                <td className="px-3 py-2 font-mono-tech text-muted-foreground">{u.last_active}</td>
                <td className="px-3 py-2"><StatusPill status={u.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function AlertsTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="New" value={alerts.filter((a) => a.status === "new").length} tone="critical" />
        <Stat label="Triaged" value={alerts.filter((a) => a.status === "triaged").length} />
        <Stat label="Suppressed" value={alerts.filter((a) => a.status === "suppressed").length} />
        <Stat label="Closed 24h" value={alerts.filter((a) => a.status === "closed").length} tone="ok" />
      </div>
      <Panel
        title="Alert queue"
        subtitle="Every alert links to an incident, a host, and its MITRE ATT&CK tags"
        action={<SearchBar placeholder="Filter alerts" />}
      >
        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a.id} className="rounded-md border border-border/60 bg-background p-3">
              <div className="flex items-start gap-3">
                <SeverityBadge severity={a.severity} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-medium">{a.title}</span>
                    <span className="font-mono-tech text-[10.5px] text-muted-foreground">
                      {a.id} → {a.incident_id}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono-tech">{a.host}</span>
                    <span>·</span>
                    <span className="font-mono-tech">{formatTs(a.ts)}</span>
                    {a.assigned_to && (
                      <>
                        <span>·</span>
                        <span>assigned <span className="text-foreground">{a.assigned_to}</span></span>
                      </>
                    )}
                  </div>
                  {a.mitre.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {a.mitre.map((m) => (
                        <span key={m.id} className="rounded-sm border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono-tech text-[10.5px] text-primary">
                          MITRE {m.id} · {m.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <StatusPill status={a.status === "new" ? "degraded" : a.status === "closed" ? "active" : a.status === "suppressed" ? "inactive" : "active"} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function RulesTab() {
  return (
    <Panel
      title="Static detection rules"
      subtitle="Deterministic signatures that run alongside the AI detector"
      action={
        <div className="flex items-center gap-2">
          <SearchBar placeholder="Search rules" />
          <button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90">
            + New rule
          </button>
        </div>
      }
    >
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-[12.5px]">
          <thead className="bg-panel text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Rule</th>
              <th className="px-3 py-2 text-left font-medium">Category</th>
              <th className="px-3 py-2 text-left font-medium">Severity</th>
              <th className="px-3 py-2 text-left font-medium">Hits 7d</th>
              <th className="px-3 py-2 text-left font-medium">False positives</th>
              <th className="px-3 py-2 text-left font-medium">Updated</th>
              <th className="px-3 py-2 text-left font-medium">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {staticRules.map((r) => (
              <tr key={r.id} className="hover:bg-accent/40">
                <td className="px-3 py-2">
                  <div className="font-medium">{r.name}</div>
                  <div className="font-mono-tech text-[10.5px] text-muted-foreground">{r.id}</div>
                </td>
                <td className="px-3 py-2 font-mono-tech text-muted-foreground">{r.category}</td>
                <td className="px-3 py-2"><SeverityBadge severity={r.severity} /></td>
                <td className="px-3 py-2 font-mono-tech">{r.hits_7d}</td>
                <td className="px-3 py-2 font-mono-tech text-muted-foreground">{(r.fp_rate * 100).toFixed(1)}%</td>
                <td className="px-3 py-2 font-mono-tech text-muted-foreground">{r.updated}</td>
                <td className="px-3 py-2">
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <span className={cn("h-4 w-7 rounded-full p-0.5 transition-colors", r.enabled ? "bg-primary" : "bg-muted")}>
                      <span className={cn("block h-3 w-3 rounded-full bg-background transition-transform", r.enabled && "translate-x-3")} />
                    </span>
                    <span className="text-[11px] text-muted-foreground">{r.enabled ? "on" : "off"}</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function AITab() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title="Model routing" subtitle="Primary / fallback and embeddings">
        <div className="space-y-3 text-[13px]">
          <KV k="Primary reasoning" v={aiConfig.model} accent />
          <KV k="Fallback" v={aiConfig.fallback_model} />
          <KV k="Embeddings" v={aiConfig.embedding_model} />
        </div>
      </Panel>
      <Panel title="Vector memory" subtitle={`${aiConfig.vector_store.backend} · ${aiConfig.vector_store.dimension}-d`}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border bg-background p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Incidents indexed</div>
            <div className="mt-1 font-mono-tech text-xl font-semibold">{aiConfig.vector_store.incidents_indexed.toLocaleString()}</div>
          </div>
          <div className="rounded-md border border-border bg-background p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Playbooks indexed</div>
            <div className="mt-1 font-mono-tech text-xl font-semibold">{aiConfig.vector_store.playbooks_indexed}</div>
          </div>
        </div>
      </Panel>
      <Panel title="Autonomy thresholds" subtitle="When the system acts on its own">
        <div className="space-y-2 text-[13px]">
          <KV k="Auto-mitigate ≥" v={aiConfig.thresholds.auto_mitigate_confidence.toFixed(2)} accent />
          <KV k="Escalate below" v={aiConfig.thresholds.escalate_below_confidence.toFixed(2)} />
          <KV k="Critical risk ≥" v={String(aiConfig.thresholds.critical_risk_score)} />
        </div>
      </Panel>
      <div className="lg:col-span-3">
        <Panel title="Guardrails" subtitle="Hard rules the AI cannot override">
          <ul className="grid gap-2 md:grid-cols-2">
            {aiConfig.guardrails.map((g) => (
              <li key={g} className="flex items-start gap-2 rounded-md border border-border/60 bg-background p-3 text-[13px]">
                <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <div className="lg:col-span-3">
        <Panel title="Agents" subtitle="Detector · Investigator · Responder">
          <div className="grid gap-3 md:grid-cols-3">
            {agents.map((ag) => (
              <div key={ag.name} className="rounded-md border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono-tech text-[13px] font-semibold">{ag.name}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">{ag.role}</span>
                </div>
                <div className="mt-2 text-[12px] text-muted-foreground">{ag.last_action}</div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono-tech text-muted-foreground">
                  <span>actions today: {ag.actions_today}</span>
                  <StatusPill status={ag.status === "active" ? "active" : ag.status === "degraded" ? "degraded" : "inactive"} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KV({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2">
      <span className="text-[11.5px] text-muted-foreground">{k}</span>
      <span className={cn("font-mono-tech text-[12.5px]", accent && "text-primary")}>{v}</span>
    </div>
  );
}

function IntegrationsTab() {
  const items = [
    { name: "AWS CloudTrail",  cat: "log source",  status: "connected" as const, note: "1.4k events/s" },
    { name: "Okta SSO",        cat: "identity",    status: "connected" as const, note: "42 events/s" },
    { name: "Cloudflare WAF",  cat: "network",     status: "connected" as const, note: "action-capable" },
    { name: "CrowdStrike EDR", cat: "endpoint",    status: "connected" as const, note: "620 events/s" },
    { name: "PagerDuty",       cat: "notifier",    status: "connected" as const, note: "critical only" },
    { name: "Slack",           cat: "notifier",    status: "connected" as const, note: "#sec-alerts" },
    { name: "Splunk HEC",      cat: "log source",  status: "not-configured" as const },
    { name: "Google Workspace",cat: "identity",    status: "not-configured" as const },
  ];
  return (
    <Panel title="Integrations" subtitle="Data sources & response channels">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <div key={i.name} className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
            <div className={cn("grid h-9 w-9 place-items-center rounded-md ring-1", i.status === "connected" ? "bg-ok/10 ring-ok/30 text-ok" : "bg-muted ring-border text-muted-foreground")}>
              <Plug className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium">{i.name}</div>
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{i.cat}{i.note ? ` · ${i.note}` : ""}</div>
            </div>
            <button className="rounded-sm border border-border px-2 py-0.5 text-[11px] hover:bg-accent">
              {i.status === "connected" ? "manage" : "connect"}
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function HealthTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Pipeline status" value={pipelineHealth.every((c) => c.status === "ok") ? "OK" : "Degraded"} tone={pipelineHealth.every((c) => c.status === "ok") ? "ok" : "high"} />
        <Stat label="Events / min" value="128k" hint="rolling 5m" />
        <Stat label="LLM latency p50" value="780ms" hint="investigator agent" />
        <Stat label="Storage used" value="62%" hint="hot tier · 30d retention" />
      </div>
      <Panel title="Pipeline components" subtitle="Ingest → index → agents → notifiers">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-[12.5px]">
            <thead className="bg-panel text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Component</th>
                <th className="px-3 py-2 text-left font-medium">Throughput</th>
                <th className="px-3 py-2 text-left font-medium">Latency</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {pipelineHealth.map((c) => (
                <tr key={c.component}>
                  <td className="px-3 py-2 font-medium">{c.component}</td>
                  <td className="px-3 py-2 font-mono-tech text-muted-foreground">{c.throughput}</td>
                  <td className="px-3 py-2 font-mono-tech">{c.latency_ms}ms</td>
                  <td className="px-3 py-2">
                    <span className={cn("inline-flex items-center gap-1.5 font-mono-tech text-[11px]", c.status === "ok" ? "text-ok" : "text-high")}>
                      <Dot color={c.status === "ok" ? "ok" : "high"} />
                      {c.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[11.5px] text-muted-foreground">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function AuditTab() {
  return (
    <Panel
      title="Admin audit log"
      subtitle="Every configuration change and automated action, immutably logged"
      action={<SearchBar placeholder="Filter by actor or target" />}
    >
      <ol className="relative space-y-1 border-l border-border/70 pl-5">
        {adminAudit.map((e) => (
          <li key={e.ts} className="relative rounded-md border border-border/60 bg-background p-3">
            <span className="absolute -left-[27px] top-4 grid h-4 w-4 place-items-center rounded-full border border-border bg-background">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13px]">
              <span className="font-mono-tech text-[11px] text-muted-foreground">{formatTs(e.ts)}</span>
              <span className="font-mono-tech text-primary">{e.actor}</span>
              <span>{e.action}</span>
              <span className="font-mono-tech text-[11px] text-muted-foreground">→ {e.target}</span>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
