import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";
import { Database, Cpu, Archive, Shield } from "lucide-react";

export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      { title: "Data — SecureAI" },
      { name: "description", content: "Data sources, ingestion, embedding, and retention." },
      { property: "og:title", content: "SecureAI Data Pipeline" },
      { property: "og:description", content: "How events become vectors, and what is stored." },
    ],
  }),
  component: () => (
    <DocShell
      title="Data sources & pipeline"
      subtitle="What we ingest, how we transform it, what we keep, and for how long."
    >
      <section className="rounded-lg border border-border bg-panel p-5">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Sources</h2>
        </div>
        <ul className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2">
          {[
            ["Server logs", "syslog, journald, application logs"],
            ["Auth events", "Okta, Azure AD, Google Workspace SSO"],
            ["Cloud audit", "AWS CloudTrail, GCP Audit Logs"],
            ["Network telemetry", "WAF, NetFlow, VPC flow logs"],
            ["Transaction logs", "billing, payment, API gateways"],
            ["Endpoint signals", "EDR alerts, MDM device posture"],
          ].map(([k, v]) => (
            <li key={k} className="rounded-md border border-border bg-background p-3">
              <div className="text-[13px] font-medium">{k}</div>
              <div className="mt-0.5 text-[11px] font-mono-tech text-muted-foreground">{v}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-panel p-5">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Event → vector pipeline</h2>
        </div>
        <ol className="mt-3 space-y-2 text-[13px]">
          <li><span className="mr-2 font-mono-tech text-muted-foreground">01</span>Normalize into a common event envelope: <code className="mono">{"{ ts, actor, asset, action, meta }"}</code>.</li>
          <li><span className="mr-2 font-mono-tech text-muted-foreground">02</span>Enrich with per-entity baselines (login geo, request rate, working hours).</li>
          <li><span className="mr-2 font-mono-tech text-muted-foreground">03</span>Embed <code className="mono">event + baseline delta</code> with <code className="mono">text-embedding-3-large</code>.</li>
          <li><span className="mr-2 font-mono-tech text-muted-foreground">04</span>Upsert into pgvector with HNSW index; tag with tenant + severity + resolution.</li>
          <li><span className="mr-2 font-mono-tech text-muted-foreground">05</span>Anomaly candidates are pushed to the Detector agent's queue.</li>
        </ol>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-panel p-5">
        <div className="flex items-center gap-2">
          <Archive className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">What is stored (per tenant)</h2>
        </div>
        <div className="mt-3 grid gap-3 text-[13px] md:grid-cols-2">
          <Row label="Raw events" value="30 days hot · 1 year cold (S3, encrypted)" />
          <Row label="Embeddings" value="30 days hot · summarized after" />
          <Row label="Incidents + resolutions" value="Retained 3 years for learning" />
          <Row label="AI reasoning traces" value="90 days · linkable to incident" />
          <Row label="PII" value="Hashed at ingest · configurable per field" />
          <Row label="Deletion" value="Tenant delete purges all indices ≤ 24h" />
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Responsible AI</h2>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">
          Tenant data is never used to train shared models. LLM calls are region-pinned and
          logged. Users can opt any log source out of embedding entirely.
        </p>
      </section>
    </DocShell>
  ),
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 rounded-md border border-border bg-background px-3 py-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="ml-auto font-mono-tech text-[12px]">{value}</span>
    </div>
  );
}
