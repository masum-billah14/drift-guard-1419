import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { workspaceOptions, evidenceOptions } from "@/lib/workspace";
import { stage, text, object, incidentTitle, recommendedActions, type JsonValue } from "@/lib/workspace-model";
import { SeverityBadge, StatusPill } from "@/components/severity";
import { consoleHead } from "@/lib/route-meta";
import { ConsoleError, ConsoleLoading, ConsoleNotFound, WorkspaceUpdated, Section, LocalTime, EventsTable } from "@/components/workspace-ui";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/app/incidents/$id")({
  head: () => consoleHead("Incident investigation", "Evidence, baseline deviations, matched patterns and reviewed threat reasoning."),
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(workspaceOptions());
    const incident = data.incidents.find((inc) => inc.incident_key === params.id);
    if (!incident) throw notFound();
    await context.queryClient.ensureQueryData(evidenceOptions(incident.evidence_event_ids ?? []));
  }, pendingComponent: ConsoleLoading, errorComponent: ConsoleError, notFoundComponent: ConsoleNotFound, component: IncidentDetail,
});

const fieldLabels: Record<string, [string, string]> = {
  verdict: ["verdict", "রায়"],
  confidence: ["confidence", "আস্থা"],
  deviations: ["deviations", "বিচ্যুতি"],
  reasoning: ["reasoning", "যুক্তি"],
  final_verdict: ["final verdict", "চূড়ান্ত রায়"],
  is_false_positive: ["is false positive", "ফলস-পজিটিভ কি না"],
  threat_type: ["threat type", "হুমকির ধরন"],
  severity: ["severity", "তীব্রতা"],
  mitre_technique: ["MITRE technique", "MITRE কৌশল"],
  matched_patterns: ["matched patterns", "মিলিত প্যাটার্ন"],
  recommended_actions: ["recommended actions", "প্রস্তাবিত পদক্ষেপ"],
  source_ip: ["source IP", "সোর্স IP"],
  user_account: ["user account", "ইউজার অ্যাকাউন্ট"],
  confirmed_threat: ["confirmed threat", "নিশ্চিত হুমকি"],
  false_positive_reason: ["false positive reason", "ফলস-পজিটিভ কারণ"],
  summary: ["summary", "সারসংক্ষেপ"],
  host: ["host", "হোস্ট"],
  platform: ["platform", "প্ল্যাটফর্ম"],
  total_events: ["total events", "মোট ইভেন্ট"],
  failed_logins: ["failed logins", "ব্যর্থ লগইন"],
  successful_logins: ["successful logins", "সফল লগইন"],
  distinct_users: ["distinct users", "স্বতন্ত্র ইউজার"],
  success_after_failures: ["success after failures", "ব্যর্থতার পরে সফলতা"],
  account_lockouts: ["account lockouts", "অ্যাকাউন্ট লক"],
};

function Values({ values }: { values: JsonValue | undefined }) {
  const { bi } = useLang();
  if (!Array.isArray(values) || !values.length) return <p className="text-sm text-muted-foreground">{bi("None recorded.", "কিছু রেকর্ড হয়নি।")}</p>;
  return <ul className="space-y-2">{values.map((value, i) => <li key={i} className="whitespace-pre-wrap break-words border-l border-primary/40 pl-3 text-[13px]">{text(value)}</li>)}</ul>;
}

function IncidentDetail() {
  const { bi } = useLang();
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(workspaceOptions());
  const inc = data.incidents.find((value) => value.incident_key === id);
  const { data: evidence, error: evidenceError, dataUpdatedAt } = useSuspenseQuery(evidenceOptions(inc?.evidence_event_ids ?? []));
  if (!inc) return <ConsoleNotFound />;
  const summary = stage(inc, "event_summary");
  const actions = recommendedActions(inc);
  const detailFields = [["Source IP", "সোর্স IP", inc.source_ip], ["Affected asset", "প্রভাবিত সম্পদ", summary.host], ["Confidence", "আস্থা", inc.confidence_percent === null ? null : `${inc.confidence_percent}%`], ["Classification", "শ্রেণিবিন্যাস", inc.classification], ["False-positive status", "ফলস-পজিটিভ স্ট্যাটাস", inc.false_positive_status]];
  const evidenceKeys = ["host", "platform", "source_ip", "total_events", "failed_logins", "successful_logins", "distinct_users", "success_after_failures", "account_lockouts"];
  const timelineStages: [[string, string], string][] = [
    [["Baseline comparison", "বেসলাইন তুলনা"], "stage1"],
    [["False-positive check", "ফলস-পজিটিভ পরীক্ষা"], "stage1_review"],
    [["Attack-pattern match", "আক্রমণ-প্যাটার্ন মিল"], "stage2"],
    [["Threat review", "হুমকি পর্যালোচনা"], "stage2_review"],
  ];
  return <div className="mx-auto max-w-6xl space-y-5 p-4 md:p-6"><Link to="/app" className="text-sm text-primary">← {bi("Back to console", "কনসোলে ফিরুন")}</Link><WorkspaceUpdated />
    <header className="space-y-3 border-b border-border pb-5"><div className="flex flex-wrap gap-2"><span className="font-mono-tech text-[12px] text-muted-foreground">{inc.incident_key}</span><SeverityBadge severity={inc.severity} /><StatusPill status={inc.status} />{inc.signal_id && <span className="text-[12px] text-primary">MITRE {inc.signal_id}</span>}</div><h1 className="break-words text-xl font-semibold">{incidentTitle(inc)}</h1><dl className="grid gap-3 text-sm sm:grid-cols-3">{detailFields.map(([en, bn, value]) => <div key={en}><dt className="text-[10px] uppercase text-muted-foreground">{bi(en, bn)}</dt><dd className="break-words font-mono-tech">{text(value)}</dd></div>)}</dl><div className="text-[11px] text-muted-foreground">{bi("Incident logged:", "ইনসিডেন্ট রেকর্ড:")} <LocalTime value={inc.created_at} /></div>{inc.summary && <p className="text-sm">{inc.summary}</p>}</header>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="min-w-0 space-y-5"><Section title={bi("AI reasoning", "এআই যুক্তি")}><p className="whitespace-pre-wrap break-words text-sm">{text(stage(inc, "stage2").reasoning)}</p>{stage(inc, "stage2_review").summary && <p className="mt-3 whitespace-pre-wrap break-words text-sm">{text(stage(inc, "stage2_review").summary)}</p>}</Section>
      <Section title={bi("Matched attack patterns", "মিলিত আক্রমণ প্যাটার্ন")}><Values values={inc.rag_context?.matched_patterns} /></Section><Section title={bi("Deviations from normal baseline", "স্বাভাবিক বেসলাইন থেকে বিচ্যুতি")}><Values values={inc.rag_context?.baseline_deviations} /></Section>
      <Section title={bi("Recommended action", "প্রস্তাবিত পদক্ষেপ")}>{actions.length ? <ul className="space-y-2">{actions.map((action, i) => <li key={i} className="break-words font-mono-tech text-sm">{bi("Recommended action:", "প্রস্তাবিত পদক্ষেপ:")} {action.replaceAll("_", " ")}</li>)}</ul> : <p className="text-sm text-muted-foreground">{bi("No recommended action recorded.", "কোনো প্রস্তাবিত পদক্ষেপ রেকর্ড হয়নি।")}</p>}</Section>
      <Section title={bi("Event-group evidence", "ইভেন্ট-গ্রুপ প্রমাণ")}><dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">{evidenceKeys.filter((key) => summary[key] !== undefined).map((key) => <div key={key}><dt className="text-[10px] uppercase text-muted-foreground">{fieldLabels[key] ? bi(...fieldLabels[key]) : key.replaceAll("_", " ")}</dt><dd className="break-words font-mono-tech text-sm">{text(summary[key])}</dd></div>)}</dl><div className="mt-3 text-[11px] text-muted-foreground">{bi("Window:", "সময়সীমা:")} <LocalTime value={typeof summary.window_start === "string" ? summary.window_start : null} /> — <LocalTime value={typeof summary.window_end === "string" ? summary.window_end : null} /></div>{summary.users_with_failures && <p className="mt-2 break-words text-sm">{bi("Users with failures:", "ব্যর্থতাসহ ইউজার:")} {text(summary.users_with_failures)}</p>}{summary.services && <p className="mt-2 break-words text-sm">{bi("Services:", "সার্ভিস:")} {text(summary.services)}</p>}</Section>
      <Section title={bi("Sample events", "নমুনা ইভেন্ট")}>{Array.isArray(summary.sample_events) && summary.sample_events.length ? <div className="space-y-3">{summary.sample_events.map((value, i) => { const event = object(value); return <div key={i} className="border-l border-border pl-3"><div className="break-words font-mono-tech text-[11px] text-muted-foreground"><LocalTime value={typeof event.time === "string" ? event.time : null} /> · {text(event.user)} · {text(event.action)} · {text(event.outcome)} · {text(event.service)}</div><pre className="mt-1 whitespace-pre-wrap break-words text-[12px]">{text(event.raw)}</pre></div>; })}</div> : <p className="text-sm text-muted-foreground">{bi("No sample events recorded.", "কোনো নমুনা ইভেন্ট রেকর্ড হয়নি।")}</p>}</Section>
      <Section title={`${bi("Full evidence events", "সম্পূর্ণ প্রমাণ ইভেন্ট")} (${evidence.length})`}><div className="mb-2 text-[11px] text-muted-foreground">{bi("Last updated:", "সর্বশেষ আপডেট:")} <LocalTime value={new Date(dataUpdatedAt).toISOString()} /></div>{evidenceError && <p role="alert" className="text-sm text-critical">{bi("Evidence refresh failed:", "প্রমাণ রিফ্রেশ ব্যর্থ:")} {evidenceError.message}</p>}<EventsTable events={evidence} />{(inc.evidence_event_ids?.length ?? 0) > evidence.length && <p className="mt-2 text-sm text-muted-foreground">{bi("Some referenced evidence events are no longer available in the public view.", "কিছু নির্দিষ্ট প্রমাণ ইভেন্ট পাবলিক ভিউতে আর পাওয়া যায় না।")}</p>}</Section></div>
    <aside className="min-w-0"><Section title={bi("Investigation timeline", "তদন্তের টাইমলাইন")}><ol className="space-y-5 border-l border-border pl-4">{timelineStages.map(([[labelEn, labelBn], key]) => { const result = stage(inc, key); return <li key={key}><h3 className="text-sm font-semibold">{bi(labelEn, labelBn)}</h3>{Object.keys(result).length ? <dl className="mt-2 space-y-2">{Object.entries(result).map(([field, value]) => <div key={field}><dt className="text-[10px] uppercase text-muted-foreground">{fieldLabels[field] ? bi(...fieldLabels[field]) : field.replaceAll("_", " ")}</dt><dd className="whitespace-pre-wrap break-words text-[12px]">{text(value)}</dd></div>)}</dl> : <p className="text-[12px] text-muted-foreground">{bi("No stage result recorded.", "কোনো ধাপের ফলাফল রেকর্ড হয়নি।")}</p>}</li>; })}<li><h3 className="text-sm font-semibold">{bi("Incident logged", "ইনসিডেন্ট রেকর্ড")}</h3><div className="mt-1 text-[11px] font-mono-tech text-muted-foreground"><LocalTime value={inc.created_at} /></div></li></ol></Section></aside></div></div>;
}
