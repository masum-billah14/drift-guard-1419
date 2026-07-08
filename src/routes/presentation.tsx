import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Presentation — SecureAI" },
      { name: "description", content: "Problem, solution, users, market, and impact." },
      { property: "og:title", content: "SecureAI — the story" },
      { property: "og:description", content: "Why lean IT teams need an AI security copilot, and what happens when they have one." },
    ],
  }),
  component: () => (
    <DocShell title="The story" subtitle="Problem → Solution → Users → Market → Impact">
      <Block n="01" title="Problem" tag="Why this exists">
        Small and mid-sized businesses run the same infrastructure the enterprise does — SSO,
        cloud, remote workers, APIs — but without the enterprise's 24/7 Security Operations
        Center. A senior analyst costs $150k+, a team of five costs a million. So most SMEs
        run with none, or with a part-time contractor. The result: breaches take an average of
        204 days to detect. By then, the damage is done.
      </Block>
      <Block n="02" title="Solution" tag="What we built">
        SecureAI is an AI security copilot. Three specialised agents work continuously: a
        Detector spots anomalies against learned baselines; an Investigator retrieves similar
        past incidents from a vector DB and explains its reasoning; a Responder takes contained
        actions — block an IP, revoke a session — or escalates to a human with the full trail.
        A team of two can hold the line a team of ten used to.
      </Block>
      <Block n="03" title="Users" tag="Who this is for">
        Head of IT at a 50–500 person company. They're the security team of one. They pick
        SecureAI because it explains itself: every alert comes with plain-language reasoning
        and a recommended action, so they can approve or override in seconds — not spend an
        hour investigating.
      </Block>
      <Block n="04" title="Market" tag="Why now">
        There are ~200,000 SMEs in the EU alone with more than 50 employees and no dedicated
        SOC. NIS2 and DORA regulations now require them to demonstrate detection and response
        capability. LLMs finally make explainable, agent-driven security economically viable
        at that scale — the same automation the enterprise pays $500k/year for, delivered as
        SaaS at $2k/month.
      </Block>
      <Block n="05" title="Impact" tag="If we're right">
        A 10× reduction in mean-time-to-detect (from days to seconds) for the segment that
        currently has no coverage at all. Fewer breaches becoming national news. A defensible
        moat built from every customer's incident history, feeding shared threat intelligence
        that no single SME could produce alone.
      </Block>
    </DocShell>
  ),
});

function Block({ n, title, tag, children }: { n: string; title: string; tag: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-lg border border-border bg-panel p-6">
      <div className="flex items-baseline gap-3">
        <span className="font-mono-tech text-xs text-muted-foreground">{n}</span>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <span className="ml-auto rounded-sm bg-primary/15 px-1.5 py-0.5 font-mono-tech text-[10px] uppercase tracking-wider text-primary ring-1 ring-primary/30">
          {tag}
        </span>
      </div>
      <p className="mt-4 text-[14.5px] leading-relaxed text-foreground/90">{children}</p>
    </section>
  );
}
