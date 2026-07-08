import { createFileRoute, Link } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";

export const Route = createFileRoute("/pitchdeck")({
  head: () => ({
    meta: [
      { title: "Pitch deck — SecureAI" },
      { name: "description", content: "YC-style deck for SecureAI." },
    ],
  }),
  component: Deck,
});

const slides = [
  { n: 1, title: "SecureAI", body: "An AI security copilot for teams too small for a SOC.", kind: "cover" },
  { n: 2, title: "Problem", body: "SMEs get breached because a 24/7 SOC costs $1M+. They can't afford it. Median time-to-detect: 204 days." },
  { n: 3, title: "Solution", body: "Autonomous agents that detect, explain, and respond — with a human always in the loop for irreversible actions." },
  { n: 4, title: "Market", body: "~200k EU SMEs > 50 employees. NIS2 & DORA now mandate detection & response. TAM $8B, growing 22% YoY." },
  { n: 5, title: "Product", body: "Detector, Investigator, and Responder agents backed by a vector DB of past incidents. Every alert is explainable." },
  { n: 6, title: "Traction (projected)", body: "10 design partners committed. $180k ARR at pilot end of Q4 2026. LOIs from 3 MSPs to white-label." },
  { n: 7, title: "Business model", body: "SaaS $1,999/mo base + $0.001/event. Gross margin 82% at scale. Payback ~4 months." },
  { n: 8, title: "Team", body: "Security engineers + ML researchers + a repeat SaaS founder. 30 years combined in enterprise security." },
  { n: 9, title: "Ask", body: "$1.2M seed to reach $1M ARR and SOC 2 Type II in 12 months.", kind: "ask" },
];

function Deck() {
  return (
    <DocShell title="Pitch deck" subtitle="Scroll or use ↓ / ↑ — 9 slides.">
      <div className="space-y-6">
        {slides.map((s) => (
          <article
            key={s.n}
            className={
              "relative min-h-[320px] overflow-hidden rounded-xl border p-10 " +
              (s.kind === "cover"
                ? "border-primary/40 bg-gradient-to-br from-primary/10 via-panel to-background"
                : s.kind === "ask"
                  ? "border-primary/50 bg-primary/10"
                  : "border-border bg-panel")
            }
          >
            <div className="absolute right-6 top-6 font-mono-tech text-[11px] text-muted-foreground">
              {s.n} / {slides.length}
            </div>
            <h2
              className={
                s.kind === "cover"
                  ? "text-5xl font-bold tracking-tight sm:text-6xl"
                  : "text-3xl font-semibold tracking-tight sm:text-4xl"
              }
            >
              {s.title}
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">{s.body}</p>
            {s.kind === "cover" && (
              <div className="mt-8 flex gap-2">
                <Link
                  to="/demo-user"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Live demo
                </Link>
                <Link
                  to="/presentation"
                  className="rounded-md border border-border bg-panel px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Read the story
                </Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </DocShell>
  );
}
