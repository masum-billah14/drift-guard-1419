import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";
import { Activity, Bot, Database, Zap, Cpu, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture — SecureAI" },
      { name: "description", content: "How SecureAI turns raw events into explainable AI-driven response." },
      { property: "og:title", content: "SecureAI Architecture" },
      { property: "og:description", content: "Event → embedding → vector lookup → LLM reasoning → response." },
    ],
  }),
  component: () => (
    <DocShell
      title="System architecture"
      subtitle="Every event flows through the same five stages. Each stage is inspectable, testable, and swappable."
    >
      <PipelineDiagram />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Layer icon={Activity} title="1. Event ingestion" tech="Fluent Bit · Kafka · webhooks">
          Cloud logs (AWS CloudTrail, GCP Audit), auth events (Okta, Azure AD), network telemetry
          (WAF, NetFlow), and application logs. Normalized into a common event envelope.
        </Layer>
        <Layer icon={Cpu} title="2. Embedding" tech="text-embedding-3-large · sentence-transformers fallback">
          Each event is embedded together with entity context (user, asset, time-of-day baseline).
          Embeddings are compact enough to store 30 days hot.
        </Layer>
        <Layer icon={Database} title="3. Vector retrieval" tech="pgvector · HNSW index">
          The Investigator agent retrieves the top-k most similar past incidents and their
          human-labelled resolutions. This grounds the LLM's reasoning in your history.
        </Layer>
        <Layer icon={Bot} title="4. LLM reasoning" tech="Gemini 2.5 · Claude Sonnet 4.5 (fallback)">
          A structured prompt asks: what happened, why it looks anomalous vs baseline, similar
          past cases, and a recommended action with confidence. Output is JSON-schema-validated.
        </Layer>
        <Layer icon={Zap} title="5. Response" tech="Policy engine · webhooks · SOAR">
          The Responder agent executes contained actions (block IP, revoke session, isolate pod)
          based on per-org policy, or escalates to a human with the full reasoning trail.
        </Layer>
        <Layer icon={ShieldCheck} title="Governance" tech="Audit log · human-in-the-loop">
          Every agent action is signed and logged. Auto-response is opt-in per severity and per
          action type. Humans always see the reasoning before approving irreversible actions.
        </Layer>
      </div>

      <section className="mt-10 rounded-lg border border-border bg-panel p-5">
        <h2 className="text-sm font-semibold">Stack summary</h2>
        <div className="mt-3 grid gap-1.5 text-[12.5px] font-mono-tech text-muted-foreground sm:grid-cols-2">
          <div>· Frontend — TanStack Start · React · Tailwind</div>
          <div>· Backend — Node · TypeScript · Kafka</div>
          <div>· LLMs — Gemini 2.5 primary, Claude 4.5 fallback</div>
          <div>· Vector DB — Postgres + pgvector (HNSW)</div>
          <div>· Object storage — S3-compatible (region-pinned)</div>
          <div>· Deploy — Cloudflare Workers edge · region eu-central-1</div>
        </div>
      </section>
    </DocShell>
  ),
});

function PipelineDiagram() {
  const nodes = [
    { label: "Event source", sub: "logs · auth · net" },
    { label: "Embedding", sub: "vectorize context" },
    { label: "Vector DB", sub: "similar incidents" },
    { label: "LLM reasoning", sub: "why · confidence" },
    { label: "Response", sub: "act or escalate" },
  ];
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-panel p-6">
      <div className="flex min-w-[720px] items-stretch gap-3">
        {nodes.map((n, i) => (
          <div key={n.label} className="flex flex-1 items-center gap-3">
            <div className="flex-1 rounded-md border border-border bg-background p-4 text-center">
              <div className="text-[10px] font-mono-tech uppercase tracking-wider text-muted-foreground">
                stage {i + 1}
              </div>
              <div className="mt-1 text-sm font-semibold">{n.label}</div>
              <div className="mt-1 text-[11px] font-mono-tech text-muted-foreground">{n.sub}</div>
            </div>
            {i < nodes.length - 1 && (
              <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0 text-primary">
                <path d="M4 10 H16 M12 6 L16 10 L12 14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-md border border-primary/30 bg-primary/5 p-3 text-[11.5px] text-muted-foreground">
        <span className="rounded-sm bg-primary/20 px-1.5 py-0.5 font-mono-tech text-[10px] text-primary">FEEDBACK</span>
        Human resolutions are re-embedded and stored — the system learns from every incident.
      </div>
    </div>
  );
}

function Layer({
  icon: Icon,
  title,
  tech,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tech: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="mt-1 text-[11px] font-mono-tech text-muted-foreground">{tech}</div>
      <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">{children}</p>
    </div>
  );
}
