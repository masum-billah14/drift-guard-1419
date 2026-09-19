import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ShieldCheck, Zap, Building2, Crown, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — DriftGuard | Enterprise SOC power at 10% of the cost" },
      {
        name: "description",
        content:
          "Free for personal machines. $1/machine/month for small teams, volume pricing to 50 machines, and unlimited Enterprise. Roughly 10% of the price of CrowdStrike or Splunk.",
      },
    ],
  }),
  component: Pricing,
});

const tiers = [
  {
    name: "Personal",
    icon: ShieldCheck,
    price: "Free",
    unit: "forever",
    range: "1 machine",
    blurb: "Real AI detection for your own PC or laptop. No card required.",
    cta: "Start free",
    to: "/demo-user",
    features: [
      "1 protected machine",
      "AI anomaly detection",
      "Log Copilot (100 queries/mo)",
      "7-day event retention",
      "Community support",
    ],
  },
  {
    name: "Team",
    icon: Zap,
    price: "$1",
    unit: "/machine/mo",
    range: "5–20 machines",
    blurb: "Full SOC copilot for small teams — about 10% of CrowdStrike/Splunk pricing.",
    cta: "Start 14-day trial",
    to: "/demo-user",
    highlight: true,
    badge: "Most popular",
    features: [
      "5–20 protected machines",
      "Detector + Investigator + Responder agents",
      "Unlimited Log Copilot queries",
      "Automated contained response",
      "90-day event retention",
      "Email + chat support",
    ],
  },
  {
    name: "Business",
    icon: Building2,
    price: "$0.80",
    unit: "/machine/mo",
    range: "up to 50 machines",
    blurb: "Volume pricing plus compliance reporting for growing companies.",
    cta: "Talk to us",
    to: "/demo-admin",
    features: [
      "Up to 50 protected machines",
      "Everything in Team",
      "One-click audit reports (GDPR, ISO 27001)",
      "Custom static rules & MITRE tuning",
      "1-year event retention",
      "Priority support (4h SLA)",
    ],
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: "Custom",
    unit: "flat rate",
    range: "Unlimited machines",
    blurb: "Unlimited endpoints, dedicated infra, and white-glove onboarding.",
    cta: "Contact sales",
    to: "/demo-admin",
    features: [
      "Unlimited machines",
      "Everything in Business",
      "EU data residency & SSO/SAML",
      "Dedicated vector store & fine-tuning",
      "Unlimited retention",
      "24/7 phone support (15min SLA)",
    ],
  },
];

function Pricing() {
  return (
    <AppShell hideSidebar>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-mono-tech text-primary">
              <Zap className="h-3 w-3" />
              ~10% of the cost of CrowdStrike · Splunk · Sentinel
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Enterprise SOC power,{" "}
              <span className="bg-gradient-to-r from-primary to-ok bg-clip-text text-transparent">
                SME pricing.
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Incumbent tools charge $10–15 per machine per month. Our AI agents do the
              detection, investigation and response — so we charge a tenth of that.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={cn(
                  "relative flex flex-col rounded-xl border p-5 transition-transform hover:-translate-y-1",
                  t.highlight
                    ? "border-primary/60 bg-panel shadow-[0_0_50px_-12px_var(--primary)]"
                    : "border-border bg-panel/70",
                )}
              >
                {t.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    {t.badge}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className={cn("grid h-8 w-8 place-items-center rounded-md", t.highlight ? "bg-primary/20 ring-1 ring-primary/50" : "bg-accent")}>
                    <t.icon className={cn("h-4 w-4", t.highlight ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <span className="text-sm font-semibold">{t.name}</span>
                </div>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className={cn("text-3xl font-bold tracking-tight font-mono-tech", t.highlight && "text-primary")}>
                    {t.price}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{t.unit}</span>
                </div>
                <div className="mt-1 text-[11px] font-mono-tech uppercase tracking-wider text-muted-foreground">
                  {t.range}
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{t.blurb}</p>

                <ul className="mt-4 flex-1 space-y-2 border-t border-border pt-4">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={t.to}
                  className={cn(
                    "mt-5 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                    t.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border bg-accent/50 hover:bg-accent",
                  )}
                >
                  {t.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-border bg-panel/70 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">How is it this cheap?</span>{" "}
              Legacy SOCs bill you for the humans watching dashboards. Our agents do that work,
              so a two-person team gets 24/7 coverage at a tenth of the price. Every plan includes
              the full reasoning trail and audit export.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
