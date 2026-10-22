import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { workspaceOptions } from "@/lib/workspace";
import { metrics, severityBuckets, incidentTitle, stage, text } from "@/lib/workspace-model";
import { consoleHead } from "@/lib/route-meta";
import { SeverityBadge, StatusPill } from "@/components/severity";
import { ConsoleError, ConsoleLoading, ConsoleNotFound, WorkspaceUpdated, WorkspaceEmpty, EventsTable, Section, LocalTime } from "@/components/workspace-ui";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/app/")({
  head: () => consoleHead("Console", "Live incident triage and collector events."),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceOptions()),
  pendingComponent: ConsoleLoading, errorComponent: ConsoleError, notFoundComponent: ConsoleNotFound, component: Dashboard,
});

function Dashboard() {
  const { bi } = useLang();
  const { data } = useSuspenseQuery(workspaceOptions());
  const kpi = metrics(data.counts);
  const buckets = severityBuckets(data.incidents, Date.parse(data.fetchedAt));
  const maximum = Math.max(1, ...buckets.map((b) => b.critical + b.high + b.medium + b.low));
  const kpiCards = [
    [bi("Active incidents", "সক্রিয় ইনসিডেন্ট"), kpi.active.toLocaleString()],
    [bi("Events (24h)", "ইভেন্ট (24 ঘণ্টা)"), kpi.events24h.toLocaleString()],
    [bi("Incidents (24h)", "ইনসিডেন্ট (24 ঘণ্টা)"), kpi.incidents24h.toLocaleString()],
    [bi("Event groups analyzed (24h)", "বিশ্লেষিত ইভেন্ট গ্রুপ (24 ঘণ্টা)"), kpi.groups.toLocaleString()],
    [bi("Cleared by double-check (24h)", "দ্বি-পরীক্ষায় পরিষ্কার (24 ঘণ্টা)"), `${kpi.verdicts24h.toLocaleString()} · ${kpi.clearedShare.toFixed(1)}%`],
  ];
  return <div className="space-y-5 p-4 md:p-6"><header className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-xl font-semibold">{bi("Security Operations Console", "সিকিউরিটি অপারেশন কনসোল")}</h1><WorkspaceUpdated /></header>
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{kpiCards.map(([label, value]) => <div key={label} className="rounded-lg border border-border bg-panel p-4"><div className="text-[10px] uppercase text-muted-foreground">{label}</div><div className="mt-2 break-words font-mono-tech text-2xl font-semibold text-primary">{value}</div></div>)}</div>
    {!data.events.length && !data.incidents.length && !data.verdicts.length && <WorkspaceEmpty />}
    <Section title={bi("Incident severity — last 24h", "ইনসিডেন্ট তীব্রতা — শেষ 24 ঘণ্টা")}><div className="overflow-x-auto"><svg viewBox="0 0 800 180" className="w-full min-w-[600px]" role="img" aria-label={bi("Incidents grouped by hour and severity", "ঘণ্টা ও তীব্রতা অনুযায়ী ইনসিডেন্ট")}>{buckets.map((bucket, i) => { let y = 150; return <g key={bucket.time}>{(["low", "medium", "high", "critical"] as const).map((severity) => { const height = bucket[severity] / maximum * 135; y -= height; return <rect key={severity} x={i * 31 + 10} y={y} width={24} height={height} fill={`var(--color-${severity})`} />; })}<title>{new Date(bucket.time).toISOString()} — {bucket.critical + bucket.high + bucket.medium + bucket.low} {bi("incidents", "ইনসিডেন্ট")}</title>{i % 4 === 0 && <ClientOnly><text x={i * 31 + 22} y={171} textAnchor="middle" fontSize="10" fill="var(--color-muted-foreground)">{new Date(bucket.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</text></ClientOnly>}</g>; })}</svg></div><div className="flex flex-wrap gap-3">{(["critical", "high", "medium", "low"] as const).map((severity) => <SeverityBadge key={severity} severity={severity} />)}</div></Section>
    <Section title={`${bi("Incidents", "ইনসিডেন্ট")} (${data.incidents.length})`}>{!data.incidents.length ? <p className="text-sm text-muted-foreground">{bi("No incidents recorded. Incidents appear once collector events are analyzed.", "কোনো ইনসিডেন্ট রেকর্ড হয়নি। কালেক্টর ইভেন্ট বিশ্লেষিত হলে ইনসিডেন্ট দেখা যাবে।")}</p> : <div className="divide-y divide-border border-y border-border">{data.incidents.map((inc) => <Link key={inc.incident_key} to="/app/incidents/$id" params={{ id: inc.incident_key }} className="block space-y-2 p-3 hover:bg-accent"><div className="flex flex-wrap items-center gap-2"><span className="font-mono-tech text-[11px] text-muted-foreground">{inc.incident_key}</span><SeverityBadge severity={inc.severity} /><StatusPill status={inc.status} />{inc.signal_id && <span className="font-mono-tech text-[11px] text-primary">MITRE {inc.signal_id}</span>}<span className="ml-auto text-[11px] text-muted-foreground"><LocalTime value={inc.created_at} /></span></div><h3 className="break-words text-sm font-medium">{incidentTitle(inc)}</h3><p className="break-words font-mono-tech text-[12px] text-muted-foreground">{inc.source_ip ?? "—"} · {text(stage(inc, "event_summary").host)} · {bi("confidence", "আস্থা")} {inc.confidence_percent === null ? "—" : `${inc.confidence_percent}%`}</p></Link>)}</div>}</Section>
    <Section title={bi("Recent events", "সাম্প্রতিক ইভেন্ট")}><EventsTable events={data.events.slice(0, 50)} /></Section>
  </div>;
}
