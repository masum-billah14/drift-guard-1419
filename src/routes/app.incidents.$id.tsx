import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getIncident, formatTs, formatRelative, type Incident } from "@/lib/mock-data";
import { SeverityBadge, StatusPill } from "@/components/severity";
import { ArrowLeft, Brain, CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/incidents/$id")({
  loader: ({ params }) => {
    const inc = getIncident(params.id);
    if (!inc) throw notFound();
    return { inc };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.inc.id} — ${loaderData.inc.title.slice(0, 60)}` : "Incident — DriftGuard" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-8">
      <Link to="/app" className="text-sm text-primary hover:underline">← Back to dashboard</Link>
      <h1 className="mt-4 text-xl font-semibold">Incident not found</h1>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8 text-critical">{error.message}</div>,
  component: IncidentDetail,
});

function IncidentDetail() {
  const { inc } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
      <Link to="/app" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
      </Link>

      {/* Summary */}
      <section className="rounded-lg border border-border bg-panel p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono-tech text-[12px] text-muted-foreground">{inc.id}</span>
          <SeverityBadge severity={inc.severity} />
          <StatusPill status={inc.status} />
          <span className="ml-auto text-[11px] font-mono-tech text-muted-foreground">
            opened {formatRelative(inc.opened_at)} · {formatTs(inc.opened_at)}
          </span>
        </div>
        <h1 className="mt-3 text-xl font-semibold tracking-tight">{inc.title}</h1>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Source IP" value={inc.source_ip} mono />
          <Field label="Affected asset" value={inc.affected_asset} mono />
          <Field label="AI confidence" value={`${(inc.ai_confidence * 100).toFixed(0)}%`} mono />
        </dl>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          {/* AI reasoning — the differentiator */}
          <section className="rounded-lg border border-primary/40 bg-primary/5 p-5 ring-1 ring-primary/20">
            <header className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/40">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">AI reasoning</h2>
                <p className="text-[11px] font-mono-tech text-muted-foreground">
                  Investigator agent · {(inc.ai_confidence * 100).toFixed(0)}% confidence
                </p>
              </div>
            </header>

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Why flagged</div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-foreground/90">{inc.ai_reasoning}</p>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Similar past incidents (vector retrieval)
                </div>
                <ul className="mt-2 space-y-1.5">
                  {inc.similar_incidents.map((s: Incident["similar_incidents"][number]) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-3 rounded-md border border-border bg-panel px-3 py-2 text-[12.5px]"
                    >
                      <span className="font-mono-tech text-muted-foreground">{s.id}</span>
                      <span className="min-w-0 flex-1 truncate">{s.title}</span>
                      <span className="rounded-sm bg-low/15 px-1.5 py-0.5 font-mono-tech text-[10px] text-low ring-1 ring-inset ring-low/30">
                        sim {(s.similarity * 100).toFixed(0)}%
                      </span>
                      <span className="hidden text-[11px] text-muted-foreground sm:inline">{s.resolved}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-md border border-border bg-background p-3">
                <div className="flex items-center gap-2 text-[11px] font-mono-tech text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Recommended action
                </div>
                <p className="mt-1 text-[13px]">{inc.recommended_action}</p>
                <div className="mt-2">
                  <StatusPill status={inc.action_status} />
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[12.5px] font-semibold text-primary-foreground hover:bg-primary/90">
                <CheckCircle2 className="h-4 w-4" /> Approve response
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-3 py-2 text-[12.5px] font-medium hover:bg-accent">
                <AlertTriangle className="h-4 w-4 text-high" /> Escalate
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-3 py-2 text-[12.5px] font-medium hover:bg-accent">
                <XCircle className="h-4 w-4 text-muted-foreground" /> Mark false positive
              </button>
            </div>
          </section>
        </div>

        {/* Timeline */}
        <aside className="rounded-lg border border-border bg-panel/50 p-4">
          <h3 className="text-sm font-semibold">Timeline</h3>
          <ol className="mt-3 space-y-4 border-l border-border pl-4">
            {inc.timeline.map((t: Incident["timeline"][number], i: number) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                <div className="text-[11px] font-mono-tech text-muted-foreground">{formatTs(t.ts)}</div>
                <div className="mt-0.5 text-[12.5px]">
                  <span className="font-semibold">{t.actor}</span> — {t.note}
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-[13px] ${mono ? "font-mono-tech" : ""}`}>{value}</dd>
    </div>
  );
}
