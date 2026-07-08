import { createFileRoute, Link } from "@tanstack/react-router";
import {
  agentActivity,
  agents,
  events,
  incidents,
  kpis,
  severityTimeSeries,
  formatRelative,
  formatTs,
} from "@/lib/mock-data";
import { SeverityBadge, SeverityDot, StatusPill } from "@/components/severity";
import { ArrowUpRight, TrendingDown, TrendingUp, Activity } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const openIncidents = incidents.filter((i) => i.status !== "resolved");
  const recent = events.slice(0, 14);

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Active threats"
          value={kpis.active_threats.toString()}
          delta="+2"
          trend="up"
          tone="critical"
        />
        <Kpi
          label="Events (24h)"
          value={kpis.events_24h.toLocaleString()}
          delta="+12%"
          trend="up"
          tone="primary"
        />
        <Kpi
          label="Mean time to detect"
          value={`${kpis.mttd_seconds}s`}
          delta="-8s"
          trend="down"
          tone="ok"
        />
        <Kpi
          label="Mean time to respond"
          value={`${kpis.mttr_seconds}s`}
          delta="-42s"
          trend="down"
          tone="ok"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          {/* Chart */}
          <Panel title="Anomaly severity — last 24h" subtitle="hourly buckets, UTC">
            <SeverityChart data={severityTimeSeries} />
            <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-mono-tech text-muted-foreground">
              <Legend color="bg-critical" label="critical" />
              <Legend color="bg-high" label="high" />
              <Legend color="bg-medium" label="medium" />
              <Legend color="bg-low" label="low" />
            </div>
          </Panel>

          {/* Open incidents */}
          <Panel
            id="incidents"
            title={`Open incidents (${openIncidents.length})`}
            subtitle="Sorted by severity · AI reasoning attached"
          >
            <div className="divide-y divide-border overflow-hidden rounded-md border border-border">
              {openIncidents.map((inc) => (
                <Link
                  key={inc.id}
                  to="/app/incidents/$id"
                  params={{ id: inc.id }}
                  className="flex items-start gap-3 bg-panel p-3 transition-colors hover:bg-accent"
                >
                  <SeverityDot severity={inc.severity} pulse />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-tech text-[11px] text-muted-foreground">{inc.id}</span>
                      <SeverityBadge severity={inc.severity} />
                      <StatusPill status={inc.status} />
                      <span className="ml-auto text-[11px] font-mono-tech text-muted-foreground">
                        {formatRelative(inc.opened_at)}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-sm font-medium">{inc.title}</div>
                    <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
                      <span className="font-mono-tech">{inc.source_ip}</span>
                      <span className="mx-1.5">·</span>
                      <span className="font-mono-tech">{inc.affected_asset}</span>
                      <span className="mx-1.5">·</span>
                      confidence <span className="font-mono-tech">{(inc.ai_confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </Panel>

          {/* Event stream */}
          <Panel title="Live event stream" subtitle="Last 14 events · mock ingestion">
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-[12px]">
                <thead className="bg-panel text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Timestamp</th>
                    <th className="px-3 py-2 text-left font-medium">Source</th>
                    <th className="px-3 py-2 text-left font-medium">Event</th>
                    <th className="px-3 py-2 text-left font-medium">Source IP</th>
                    <th className="px-3 py-2 text-right font-medium">Risk</th>
                    <th className="px-3 py-2 text-left font-medium">Severity</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {recent.map((e) => (
                    <tr key={e.id} className="hover:bg-accent/40">
                      <td className="px-3 py-2 font-mono-tech text-muted-foreground">{formatTs(e.timestamp)}</td>
                      <td className="px-3 py-2 font-mono-tech">{e.source}</td>
                      <td className="px-3 py-2">{e.event_type}</td>
                      <td className="px-3 py-2 font-mono-tech text-muted-foreground">{e.source_ip}</td>
                      <td className="px-3 py-2 text-right font-mono-tech font-semibold">{e.risk_score}</td>
                      <td className="px-3 py-2"><SeverityBadge severity={e.severity} /></td>
                      <td className="px-3 py-2"><StatusPill status={e.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Right panel: agent activity */}
        <aside className="space-y-4">
          <Panel title="AI agent activity" subtitle="Live · autonomous">
            <ul className="space-y-3">
              {agentActivity.map((a) => (
                <li key={a.id} className="flex gap-2.5">
                  <div className="mt-1.5"><SeverityDot severity={a.severity} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono-tech text-muted-foreground">
                      <span className="text-foreground">{a.agent}</span>
                      <span>·</span>
                      <span>{formatRelative(a.ts)}</span>
                    </div>
                    <p className="mt-0.5 text-[12.5px] leading-snug">{a.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Agents online" subtitle={`${agents.length} agents · 1 degraded`}>
            <ul className="space-y-2">
              {agents.map((ag) => (
                <li key={ag.name} className="flex items-center gap-2.5 rounded-md border border-border bg-panel p-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${ag.status === "active" ? "bg-ok" : ag.status === "degraded" ? "bg-high" : "bg-muted-foreground"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className="font-mono-tech font-medium">{ag.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{ag.role}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{ag.last_action}</div>
                  </div>
                  <div className="text-right text-[10px] font-mono-tech text-muted-foreground">
                    <div>{ag.actions_today}</div>
                    <div>today</div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  id,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="rounded-lg border border-border bg-panel/50 p-4">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] font-mono-tech text-muted-foreground">{subtitle}</p>}
        </div>
        <Activity className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </header>
      {children}
    </section>
  );
}

function Kpi({
  label,
  value,
  delta,
  trend,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  tone: "critical" | "primary" | "ok";
}) {
  const toneMap = { critical: "text-critical", primary: "text-primary", ok: "text-ok" } as const;
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-lg border border-border bg-panel p-4">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold font-mono-tech ${toneMap[tone]}`}>{value}</div>
      <div className="mt-1 flex items-center gap-1 text-[11px] font-mono-tech text-muted-foreground">
        <TrendIcon className={`h-3 w-3 ${trend === "down" ? "text-ok" : "text-critical"}`} />
        <span>{delta} vs yesterday</span>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

function SeverityChart({
  data,
}: {
  data: Array<{ hour: string; critical: number; high: number; medium: number; low: number }>;
}) {
  const w = 800;
  const h = 180;
  const pad = { l: 28, r: 8, t: 8, b: 22 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d.critical + d.high + d.medium + d.low));
  const bw = iw / data.length - 3;

  const yTicks = [0, 0.5, 1].map((f) => ({ v: Math.round(max * f), y: pad.t + ih - ih * f }));

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[600px]" preserveAspectRatio="none">
        {yTicks.map((t) => (
          <g key={t.v}>
            <line x1={pad.l} x2={w - pad.r} y1={t.y} y2={t.y} stroke="var(--color-border)" strokeDasharray="2 3" />
            <text x={4} y={t.y + 4} fontSize="9" fill="var(--color-muted-foreground)" fontFamily="var(--font-mono)">
              {t.v}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.l + i * (iw / data.length) + 1.5;
          const total = d.critical + d.high + d.medium + d.low;
          const scale = (v: number) => (v / max) * ih;
          let y = pad.t + ih;
          const layers = [
            { v: d.low, c: "var(--color-low)" },
            { v: d.medium, c: "var(--color-medium)" },
            { v: d.high, c: "var(--color-high)" },
            { v: d.critical, c: "var(--color-critical)" },
          ];
          return (
            <g key={i}>
              {layers.map((L, k) => {
                const bh = scale(L.v);
                y -= bh;
                return <rect key={k} x={x} y={y} width={bw} height={bh} fill={L.c} rx={1} />;
              })}
              {i % 3 === 0 && (
                <text
                  x={x + bw / 2}
                  y={h - 6}
                  fontSize="9"
                  textAnchor="middle"
                  fill="var(--color-muted-foreground)"
                  fontFamily="var(--font-mono)"
                >
                  {d.hour}
                </text>
              )}
              <title>{`${d.hour} — total ${total}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
