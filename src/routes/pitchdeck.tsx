import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DocShell } from "@/components/doc-shell";
import { ShieldCheck, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pitchdeck")({
  head: () => ({
    meta: [
      { title: "Pitch deck — SecureAI" },
      { name: "description", content: "9-slide investor deck for SecureAI." },
    ],
  }),
  component: Deck,
});

type Slide = {
  n: number;
  kicker: string;
  title: string;
  body: string;
  metric?: { v: string; l: string }[];
  kind?: "cover" | "ask";
};

const slides: Slide[] = [
  { n: 1, kicker: "SecureAI · Seed 2026", title: "The security team for companies that don't have one.", body: "AI agents that detect, explain, and respond — designed for the 200,000 SMEs regulators just told to grow up.", kind: "cover" },
  { n: 2, kicker: "Problem", title: "204 days.", body: "That's how long the average breach goes undetected at an SME. A 24/7 SOC costs $1M+. Most SMEs run with zero coverage — and NIS2 & DORA just made that illegal.", metric: [{ v: "204", l: "days to detect" }, { v: "$4.4M", l: "avg breach cost" }, { v: "0", l: "SOC headcount" }] },
  { n: 3, kicker: "Solution", title: "Three agents, one paper trail.", body: "Detector spots anomalies against learned baselines. Investigator retrieves similar past incidents from vector memory. Responder acts on the safe stuff, escalates the rest — with full reasoning attached to every decision.", metric: [{ v: "seconds", l: "MTTD" }, { v: "82%", l: "auto-resolved" }, { v: "100%", l: "explainable" }] },
  { n: 4, kicker: "Market", title: "€400M and growing 22% YoY.", body: "200,000 EU SMEs above the NIS2 threshold with no dedicated SOC. Regulation created a mandatory line item where none existed. LLMs made supplying it economical.", metric: [{ v: "200k", l: "EU SMEs > 50 FTE" }, { v: "€400M", l: "EU TAM" }, { v: "22%", l: "CAGR" }] },
  { n: 5, kicker: "Product", title: "Explainable by construction.", body: "Every alert ships with a plain-language reasoning chain, MITRE ATT&CK tags, and a recommended action. The AI doesn't hide behind a black box — a Head of IT can approve or override in seconds." },
  { n: 6, kicker: "Traction", title: "10 design partners. 3 white-label LOIs.", body: "Committed pilots across fintech, healthcare, and manufacturing. Two MSPs in advanced conversation to resell under their own brand.", metric: [{ v: "10", l: "design partners" }, { v: "$180k", l: "ARR Q4 target" }, { v: "3", l: "MSP LOIs" }] },
  { n: 7, kicker: "Business model", title: "SaaS with a floor, usage on top.", body: "$1,999/mo base + $0.001 per event. Gross margin 82% at scale. Payback ≈ 4 months. Net dollar retention 138% projected on year-two cohorts.", metric: [{ v: "82%", l: "gross margin" }, { v: "4 mo", l: "payback" }, { v: "138%", l: "NDR (proj)" }] },
  { n: 8, kicker: "Team", title: "Built by people who've been the on-call.", body: "Security engineers from Cloudflare & Datadog. ML researchers from DeepMind. A repeat SaaS founder who has scaled a category before. 30 years combined in enterprise security." },
  { n: 9, kicker: "Ask", title: "$1.2M seed → $1M ARR + SOC 2 Type II.", body: "12-month runway to production LLM stack, 25 paying customers, SOC 2 Type II certification, and a Series A story with the numbers to back it.", metric: [{ v: "$1.2M", l: "seed round" }, { v: "12 mo", l: "runway" }, { v: "SOC 2", l: "Type II" }], kind: "ask" },
];

function Deck() {
  const [i, setI] = useState(0);
  const s = slides[i];
  const prev = () => setI((v) => Math.max(0, v - 1));
  const next = () => setI((v) => Math.min(slides.length - 1, v + 1));

  return (
    <DocShell
      eyebrow="Investor materials"
      title="Pitch deck"
      subtitle="Nine slides. Click a number below or use ← / →. Each slide is one idea."
    >
      {/* Slide stage */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-panel via-background to-panel">
        {/* grid decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(var(--color-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid)_1px,transparent_1px)] [background-size:24px_24px]" />
        {s.kind === "cover" && (
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        )}
        {s.kind === "ask" && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-primary/10" />
        )}

        <div className="relative flex min-h-[520px] flex-col p-8 md:p-14">
          {/* header */}
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/40">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-primary">
              {s.kicker}
            </div>
            <div className="ml-auto font-mono-tech text-[11px] text-muted-foreground">
              {String(s.n).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>
          </div>

          {/* title & body */}
          <div className="mt-10 flex-1">
            <h2
              className={cn(
                "font-semibold tracking-tight",
                s.kind === "cover" ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl",
              )}
            >
              {s.title}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/85 md:text-lg">
              {s.body}
            </p>

            {s.metric && (
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {s.metric.map((m) => (
                  <div key={m.l} className="rounded-lg border border-border/70 bg-background/60 p-5 backdrop-blur">
                    <div className="font-mono-tech text-3xl font-bold tracking-tight text-primary md:text-4xl">{m.v}</div>
                    <div className="mt-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTAs on cover / ask */}
          {(s.kind === "cover" || s.kind === "ask") && (
            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                to="/demo-user"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Try the live demo <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/presentation"
                className="rounded-md border border-border bg-panel px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Read the full story
              </Link>
            </div>
          )}

          {/* nav */}
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={i === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-3 py-1.5 text-[12px] text-muted-foreground transition hover:text-foreground disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <div className="flex flex-1 items-center justify-center gap-1">
              {slides.map((sl, idx) => (
                <button
                  key={sl.n}
                  onClick={() => setI(idx)}
                  aria-label={`Go to slide ${sl.n}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === i ? "w-8 bg-primary" : "w-4 bg-border hover:bg-muted-foreground/50",
                  )}
                />
              ))}
            </div>
            <button
              onClick={next}
              disabled={i === slides.length - 1}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-3 py-1.5 text-[12px] text-muted-foreground transition hover:text-foreground disabled:opacity-30"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail rail */}
      <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-9">
        {slides.map((sl, idx) => (
          <button
            key={sl.n}
            onClick={() => setI(idx)}
            className={cn(
              "rounded-md border p-2 text-left transition",
              idx === i
                ? "border-primary/60 bg-primary/10"
                : "border-border bg-panel/50 hover:border-border/80 hover:bg-panel",
            )}
          >
            <div className="font-mono-tech text-[10px] text-muted-foreground">{String(sl.n).padStart(2, "0")}</div>
            <div className="mt-1 truncate text-[11px] font-medium">{sl.kicker}</div>
          </button>
        ))}
      </div>
    </DocShell>
  );
}
