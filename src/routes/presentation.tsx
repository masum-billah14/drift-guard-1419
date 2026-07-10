import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";
import { AlertTriangle, Sparkles, Users, TrendingUp, Target } from "lucide-react";
import type { ComponentType } from "react";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "The story — SecureAI" },
      { name: "description", content: "Problem, solution, users, market, and impact." },
      { property: "og:title", content: "SecureAI — the story" },
      { property: "og:description", content: "Why lean IT teams need an AI security copilot, and what happens when they have one." },
    ],
  }),
  component: PresentationPage,
});

const chapters = [
  {
    n: "01",
    tag: "Problem",
    icon: AlertTriangle,
    accent: "critical" as const,
    title: "SMEs run enterprise infrastructure with zero-person SOCs",
    lede: "204 days average time to detect a breach. By then, it's not detection — it's forensics.",
    body: "Small and mid-sized businesses run the same infrastructure the enterprise does — SSO, cloud, remote workers, APIs — but without the enterprise's 24/7 Security Operations Center. A senior analyst costs $150k+; a team of five, a million. So most SMEs run with none, or with a part-time contractor.",
    stat: { v: "204", u: "days", l: "median time-to-detect (IBM 2024)" },
  },
  {
    n: "02",
    tag: "Solution",
    icon: Sparkles,
    accent: "primary" as const,
    title: "Three agents that see, think, and act — with a paper trail",
    lede: "Detector spots. Investigator explains. Responder acts. All auditable.",
    body: "SecureAI is an AI security copilot. Three specialised agents work continuously: a Detector spots anomalies against learned baselines; an Investigator retrieves similar past incidents from a vector DB and explains its reasoning; a Responder takes contained actions — block an IP, revoke a session — or escalates to a human with the full chain of thought.",
    stat: { v: "10×", u: "faster", l: "team-of-two holds the line team-of-ten used to" },
  },
  {
    n: "03",
    tag: "Users",
    icon: Users,
    accent: "high" as const,
    title: "Head of IT at a 50–500 person company",
    lede: "The security team of one. They approve or override in seconds, not investigate for an hour.",
    body: "They pick SecureAI because it explains itself — every alert comes with plain-language reasoning, MITRE ATT&CK tags, and a recommended action. No dashboard-diving. No SIEM query language. No 30-tab investigation.",
    stat: { v: "1", u: "person", l: "typical security headcount at target customers" },
  },
  {
    n: "04",
    tag: "Market",
    icon: TrendingUp,
    accent: "medium" as const,
    title: "~200k EU SMEs, and NIS2/DORA now make coverage mandatory",
    lede: "Regulation created the demand. LLMs made the supply economical.",
    body: "There are ~200,000 SMEs in the EU alone with more than 50 employees and no dedicated SOC. NIS2 and DORA now require them to demonstrate detection and response capability. LLMs finally make explainable, agent-driven security economically viable at that scale — the same automation enterprises pay $500k/year for, delivered as SaaS at $2k/month.",
    stat: { v: "€400M", u: "TAM", l: "EU SME SOC-as-service segment, 2026" },
  },
  {
    n: "05",
    tag: "Impact",
    icon: Target,
    accent: "ok" as const,
    title: "Days to seconds — for the segment that today has nothing",
    lede: "A defensible moat built from every customer's incident history.",
    body: "A 10× reduction in mean-time-to-detect for a segment with no current coverage. Fewer breaches becoming national news. Shared threat intelligence that no single SME could ever produce alone — federated across the customer base, sanitised, and fed back into the detector.",
    stat: { v: "seconds", u: "MTTD", l: "vs 204 days industry baseline" },
  },
];

const accentClass = {
  critical: "text-critical border-critical/40 bg-critical/10",
  high:     "text-high border-high/40 bg-high/10",
  medium:   "text-medium border-medium/40 bg-medium/10",
  primary:  "text-primary border-primary/40 bg-primary/10",
  ok:       "text-ok border-ok/40 bg-ok/10",
};

function PresentationPage() {
  return (
    <DocShell
      eyebrow="Narrative · v1.0"
      title="Problem → Solution → Users → Market → Impact"
      subtitle="The whole business, in five chapters. Twelve minutes to read; two minutes if you skim the numbers."
    >
      <div className="space-y-6">
        {chapters.map((c, i) => (
          <Chapter key={c.n} c={c} last={i === chapters.length - 1} />
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-8 text-center">
        <div className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-primary">Bottom line</div>
        <p className="mx-auto mt-3 max-w-2xl text-lg font-semibold tracking-tight md:text-2xl">
          "Enterprise-grade security operations, delivered as software, priced for a company
          that doesn't have a CISO yet."
        </p>
      </div>
    </DocShell>
  );
}

function Chapter({ c, last }: { c: (typeof chapters)[number]; last: boolean }) {
  const Icon: ComponentType<{ className?: string }> = c.icon;
  return (
    <article className="relative grid gap-6 md:grid-cols-[80px_1fr_260px]">
      {/* rail */}
      <div className="hidden md:flex md:flex-col md:items-center">
        <div className={`grid h-14 w-14 place-items-center rounded-full border ${accentClass[c.accent]} font-mono-tech text-lg font-bold`}>
          {c.n}
        </div>
        {!last && <div className="mt-2 w-px flex-1 bg-border" />}
      </div>

      {/* body */}
      <div className="rounded-lg border border-border bg-panel/60 p-6 md:p-7">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${accentClass[c.accent].split(" ")[0]}`} />
          <span className={`rounded-sm border px-1.5 py-0.5 font-mono-tech text-[10px] uppercase tracking-[0.15em] ${accentClass[c.accent]}`}>
            {c.tag}
          </span>
          <span className="md:hidden font-mono-tech text-[10px] text-muted-foreground">{c.n}</span>
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">{c.title}</h2>
        <p className="mt-2 text-[14px] font-medium text-primary/90">{c.lede}</p>
        <p className="mt-3 text-[14px] leading-relaxed text-foreground/80">{c.body}</p>
      </div>

      {/* stat pull-quote */}
      <div className={`hidden md:flex md:flex-col md:justify-center rounded-lg border p-5 ${accentClass[c.accent]}`}>
        <div className="font-mono-tech text-4xl font-bold leading-none">{c.stat.v}</div>
        <div className="mt-1 font-mono-tech text-[11px] uppercase tracking-wider opacity-80">{c.stat.u}</div>
        <div className="mt-3 text-[12px] leading-snug opacity-90">{c.stat.l}</div>
      </div>
    </article>
  );
}
