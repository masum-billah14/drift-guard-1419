import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { workspaceOptions, evidenceOptions } from "@/lib/workspace";
import { stage, text, object, incidentTitle, recommendedActions, type JsonValue } from "@/lib/workspace-model";
import { SeverityBadge, StatusPill } from "@/components/severity";
import { consoleHead } from "@/lib/route-meta";
import { ConsoleError, ConsoleLoading, ConsoleNotFound, WorkspaceUpdated, Section, LocalTime, EventsTable } from "@/components/workspace-ui";

export const Route = createFileRoute("/app/incidents/$id")({
  head: () => consoleHead("Incident investigation", "Evidence, baseline deviations, matched patterns and reviewed threat reasoning."),
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(workspaceOptions());
    const incident = data.incidents.find((inc) => inc.incident_key === params.id);
    if (!incident) throw notFound();
    await context.queryClient.ensureQueryData(evidenceOptions(incident.evidence_event_ids ?? []));
  }, pendingComponent: ConsoleLoading, errorComponent: ConsoleError, notFoundComponent: ConsoleNotFound, component: IncidentDetail,
});
function Values({ values }: { values: JsonValue | undefined }) {
  if (!Array.isArray(values) || !values.length) return <p className="text-sm text-muted-foreground">None recorded.</p>;
  return <ul className="space-y-2">{values.map((value, i) => <li key={i} className="whitespace-pre-wrap break-words border-l border-primary/40 pl-3 text-[13px]">{text(value)}</li>)}</ul>;
}
function IncidentDetail() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(workspaceOptions());
  const inc = data.incidents.find((value) => value.incident_key === id);
  const { data: evidence, error: evidenceError, dataUpdatedAt } = useSuspenseQuery(evidenceOptions(inc?.evidence_event_ids ?? []));
  if (!inc) return <ConsoleNotFound />;
  const summary = stage(inc, "event_summary");
  const actions = recommendedActions(inc);
  return <div className="mx-auto max-w-6xl space-y-5 p-4 md:p-6"><Link to="/app" className="text-sm text-primary">← Back to console</Link><WorkspaceUpdated />
    <header className="space-y-3 border-b border-border pb-5"><div className="flex flex-wrap gap-2"><span className="font-mono-tech text-[12px] text-muted-foreground">{inc.incident_key}</span><SeverityBadge severity={inc.severity} /><StatusPill status={inc.status} />{inc.signal_id && <span className="text-[12px] text-primary">MITRE {inc.signal_id}</span>}</div><h1 className="break-words text-xl font-semibold">{incidentTitle(inc)}</h1><dl className="grid gap-3 text-sm sm:grid-cols-3">{[["Source IP", inc.source_ip], ["Affected asset", summary.host], ["Confidence", inc.confidence_percent === null ? null : `${inc.confidence_percent}%`], ["Classification", inc.classification], ["False-positive status", inc.false_positive_status]].map(([label, value]) => <div key={String(label)}><dt className="text-[10px] uppercase text-muted-foreground">{String(label)}</dt><dd className="break-words font-mono-tech">{text(value)}</dd></div>)}</dl><div className="text-[11px] text-muted-foreground">Incident logged: <LocalTime value={inc.created_at} /></div>{inc.summary && <p className="text-sm">{inc.summary}</p>}</header>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="min-w-0 space-y-5"><Section title="AI reasoning"><p className="whitespace-pre-wrap break-words text-sm">{text(stage(inc, "stage2").reasoning)}</p>{stage(inc, "stage2_review").summary && <p className="mt-3 whitespace-pre-wrap break-words text-sm">{text(stage(inc, "stage2_review").summary)}</p>}</Section>
      <Section title="Matched attack patterns"><Values values={inc.rag_context?.matched_patterns} /></Section><Section title="Deviations from normal baseline"><Values values={inc.rag_context?.baseline_deviations} /></Section>
      <Section title="Recommended action">{actions.length ? <ul className="space-y-2">{actions.map((action, i) => <li key={i} className="break-words font-mono-tech text-sm">Recommended action: {action.replaceAll("_", " ")}</li>)}</ul> : <p className="text-sm text-muted-foreground">No recommended action recorded.</p>}</Section>
      <Section title="Event-group evidence"><dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">{["host", "platform", "source_ip", "total_events", "failed_logins", "successful_logins", "distinct_users", "success_after_failures", "account_lockouts"].filter((key) => summary[key] !== undefined).map((key) => <div key={key}><dt className="text-[10px] uppercase text-muted-foreground">{key.replaceAll("_", " ")}</dt><dd className="break-words font-mono-tech text-sm">{text(summary[key])}</dd></div>)}</dl><div className="mt-3 text-[11px] text-muted-foreground">Window: <LocalTime value={typeof summary.window_start === "string" ? summary.window_start : null} /> — <LocalTime value={typeof summary.window_end === "string" ? summary.window_end : null} /></div>{summary.users_with_failures && <p className="mt-2 break-words text-sm">Users with failures: {text(summary.users_with_failures)}</p>}{summary.services && <p className="mt-2 break-words text-sm">Services: {text(summary.services)}</p>}</Section>
      <Section title="Sample events">{Array.isArray(summary.sample_events) && summary.sample_events.length ? <div className="space-y-3">{summary.sample_events.map((value, i) => { const event = object(value); return <div key={i} className="border-l border-border pl-3"><div className="break-words font-mono-tech text-[11px] text-muted-foreground"><LocalTime value={typeof event.time === "string" ? event.time : null} /> · {text(event.user)} · {text(event.action)} · {text(event.outcome)} · {text(event.service)}</div><pre className="mt-1 whitespace-pre-wrap break-words text-[12px]">{text(event.raw)}</pre></div>; })}</div> : <p className="text-sm text-muted-foreground">No sample events recorded.</p>}</Section>
      <Section title={`Full evidence events (${evidence.length})`}><div className="mb-2 text-[11px] text-muted-foreground">Last updated: <LocalTime value={new Date(dataUpdatedAt).toISOString()} /></div>{evidenceError && <p role="alert" className="text-sm text-critical">Evidence refresh failed: {evidenceError.message}</p>}<EventsTable events={evidence} />{(inc.evidence_event_ids?.length ?? 0) > evidence.length && <p className="mt-2 text-sm text-muted-foreground">Some referenced evidence events are no longer available in the public view.</p>}</Section></div>
    <aside className="min-w-0"><Section title="Investigation timeline"><ol className="space-y-5 border-l border-border pl-4">{[["Baseline comparison", "stage1"], ["False-positive check", "stage1_review"], ["Attack-pattern match", "stage2"], ["Threat review", "stage2_review"]].map(([label, key]) => { const result = stage(inc, key); return <li key={key}><h3 className="text-sm font-semibold">{label}</h3>{Object.keys(result).length ? <dl className="mt-2 space-y-2">{Object.entries(result).map(([field, value]) => <div key={field}><dt className="text-[10px] uppercase text-muted-foreground">{field.replaceAll("_", " ")}</dt><dd className="whitespace-pre-wrap break-words text-[12px]">{text(value)}</dd></div>)}</dl> : <p className="text-[12px] text-muted-foreground">No stage result recorded.</p>}</li>; })}<li><h3 className="text-sm font-semibold">Incident logged</h3><div className="mt-1 text-[11px] font-mono-tech text-muted-foreground"><LocalTime value={inc.created_at} /></div></li></ol></Section></aside></div></div>;
}
