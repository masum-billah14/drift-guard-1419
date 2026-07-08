import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { agents, usersRows } from "@/lib/mock-data";
import { StatusPill } from "@/components/severity";
import { Settings2, Users, Bot } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — SecureAI" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <AppShell>
      <div className="space-y-6 p-4 md:p-6">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">Administration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Users, agents, and system configuration.</p>
        </header>

        <Section icon={Users} title="Users" subtitle={`${usersRows.length} accounts · 2 admins`}>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-[12.5px]">
              <thead className="bg-panel text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Role</th>
                  <th className="px-3 py-2 text-left font-medium">Last active</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {usersRows.map((u) => (
                  <tr key={u.id} className="hover:bg-accent/40">
                    <td className="px-3 py-2 font-medium">{u.name}</td>
                    <td className="px-3 py-2 font-mono-tech text-muted-foreground">{u.email}</td>
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2 font-mono-tech text-muted-foreground">{u.last_active}</td>
                    <td className="px-3 py-2"><StatusPill status={u.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section icon={Bot} title="Agents" subtitle="Detector · Investigator · Responder">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((ag) => (
              <div key={ag.name} className="rounded-md border border-border bg-panel p-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${ag.status === "active" ? "bg-ok" : ag.status === "degraded" ? "bg-high" : "bg-muted-foreground"}`} />
                  <span className="font-mono-tech text-[13px] font-semibold">{ag.name}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">{ag.role}</span>
                </div>
                <div className="mt-2 text-[12px] text-muted-foreground">{ag.last_action}</div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono-tech text-muted-foreground">
                  <span>actions today: {ag.actions_today}</span>
                  <button className="rounded-sm border border-border px-2 py-0.5 hover:bg-accent">restart</button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Settings2} title="System configuration" subtitle="Thresholds & integrations">
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle label="Auto-response on critical incidents" desc="Block IPs and revoke sessions without human approval" defaultOn />
            <Toggle label="Auto-response on high incidents" desc="Requires 2-agent consensus before action" />
            <Toggle label="Escalate to PagerDuty (critical)" defaultOn />
            <Toggle label="Slack notifications (all severities)" defaultOn />
          </div>
          <div className="mt-4 rounded-md border border-border bg-panel p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Integrations</div>
            <ul className="mt-2 grid gap-1.5 text-[12.5px] font-mono-tech sm:grid-cols-2">
              <li>· AWS CloudTrail — connected</li>
              <li>· Okta SSO — connected</li>
              <li>· Cloudflare WAF — connected</li>
              <li>· PagerDuty — connected</li>
              <li>· Splunk HEC — not configured</li>
              <li>· Google Workspace — not configured</li>
            </ul>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-panel/40 p-4">
      <header className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && <p className="text-[11px] font-mono-tech text-muted-foreground">{subtitle}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function Toggle({ label, desc, defaultOn }: { label: string; desc?: string; defaultOn?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-panel p-3">
      <input type="checkbox" defaultChecked={defaultOn} className="mt-1 h-4 w-4 accent-primary" />
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        {desc && <div className="mt-0.5 text-[11.5px] text-muted-foreground">{desc}</div>}
      </div>
    </label>
  );
}
