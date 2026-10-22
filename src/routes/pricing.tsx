import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ShieldCheck, Zap, Building2, Crown, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/i18n";
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

type Tier = {
  name: [string, string];
  icon: typeof ShieldCheck;
  price: [string, string];
  unit: [string, string];
  range: [string, string];
  blurb: [string, string];
  cta: [string, string];
  to: string;
  highlight?: boolean;
  badge?: [string, string];
  features: [string, string][];
};

const tiers: Tier[] = [
  {
    name: ["Personal", "পার্সোনাল"],
    icon: ShieldCheck,
    price: ["Free", "ফ্রি"],
    unit: ["forever", "চিরকালের জন্য"],
    range: ["1 machine", "1টি মেশিন"],
    blurb: ["Real AI detection for your own PC or laptop. No card required.", "আপনার নিজের পিসি বা ল্যাপটপের জন্য আসল এআই শনাক্তকরণ। কার্ড লাগবে না।"],
    cta: ["Start free", "ফ্রি শুরু করুন"],
    to: "/demo-user",
    features: [
      ["1 protected machine", "1টি সুরক্ষিত মেশিন"],
      ["AI anomaly detection", "এআই অস্বাভাবিকতা শনাক্তকরণ"],
      ["Log Copilot (100 queries/mo)", "লগ কপাইলট (মাসে 100টি প্রশ্ন)"],
      ["7-day event retention", "7 দিনের ইভেন্ট সংরক্ষণ"],
      ["Community support", "কমিউনিটি সাপোর্ট"],
    ],
  },
  {
    name: ["Team", "টিম"],
    icon: Zap,
    price: ["$1", "$1"],
    unit: ["/machine/mo", "/মেশিন/মাস"],
    range: ["5–20 machines", "5–20টি মেশিন"],
    blurb: ["Full SOC copilot for small teams — about 10% of CrowdStrike/Splunk pricing.", "ছোট দলের জন্য পূর্ণ SOC কপাইলট — CrowdStrike/Splunk-এর মূল্যের প্রায় 10%।"],
    cta: ["Start 14-day trial", "14 দিনের ট্রায়াল শুরু করুন"],
    to: "/demo-user",
    highlight: true,
    badge: ["Most popular", "সর্বাধিক জনপ্রিয়"],
    features: [
      ["5–20 protected machines", "5–20টি সুরক্ষিত মেশিন"],
      ["Detector + Investigator + Responder agents", "ডিটেক্টর + ইনভেস্টিগেটর + রেসপন্ডার এজেন্ট"],
      ["Unlimited Log Copilot queries", "আনলিমিটেড লগ কপাইলট প্রশ্ন"],
      ["Automated contained response", "স্বয়ংক্রিয় নিয়ন্ত্রিত প্রতিক্রিয়া"],
      ["90-day event retention", "90 দিনের ইভেন্ট সংরক্ষণ"],
      ["Email + chat support", "ইমেইল + চ্যাট সাপোর্ট"],
    ],
  },
  {
    name: ["Business", "বিজনেস"],
    icon: Building2,
    price: ["$0.80", "$0.80"],
    unit: ["/machine/mo", "/মেশিন/মাস"],
    range: ["up to 50 machines", "সর্বোচ্চ 50টি মেশিন"],
    blurb: ["Volume pricing plus compliance reporting for growing companies.", "বর্ধনশীল কোম্পানির জন্য ভলিউম মূল্য এবং কমপ্লায়েন্স রিপোর্টিং।"],
    cta: ["Talk to us", "আমাদের সাথে কথা বলুন"],
    to: "/demo-admin",
    features: [
      ["Up to 50 protected machines", "সর্বোচ্চ 50টি সুরক্ষিত মেশিন"],
      ["Everything in Team", "টিম প্ল্যানের সবকিছু"],
      ["One-click audit reports (GDPR, ISO 27001)", "এক ক্লিকে অডিট রিপোর্ট (GDPR, ISO 27001)"],
      ["Custom static rules & MITRE tuning", "কাস্টম স্ট্যাটিক রুল ও MITRE টিউনিং"],
      ["1-year event retention", "1 বছরের ইভেন্ট সংরক্ষণ"],
      ["Priority support (4h SLA)", "প্রায়োরিটি সাপোর্ট (4 ঘণ্টার SLA)"],
    ],
  },
  {
    name: ["Enterprise", "এন্টারপ্রাইজ"],
    icon: Crown,
    price: ["Custom", "কাস্টম"],
    unit: ["flat rate", "ফ্ল্যাট রেট"],
    range: ["Unlimited machines", "আনলিমিটেড মেশিন"],
    blurb: ["Unlimited endpoints, dedicated infra, and white-glove onboarding.", "আনলিমিটেড এন্ডপয়েন্ট, ডেডিকেটেড ইনফ্রা এবং বিশেষ অনবোর্ডিং।"],
    cta: ["Contact sales", "সেলসের সাথে যোগাযোগ"],
    to: "/demo-admin",
    features: [
      ["Unlimited machines", "আনলিমিটেড মেশিন"],
      ["Everything in Business", "বিজনেস প্ল্যানের সবকিছু"],
      ["EU data residency & SSO/SAML", "EU ডেটা রেসিডেন্সি ও SSO/SAML"],
      ["Dedicated vector store & fine-tuning", "ডেডিকেটেড ভেক্টর স্টোর ও ফাইন-টিউনিং"],
      ["Unlimited retention", "আনলিমিটেড সংরক্ষণ"],
      ["24/7 phone support (15min SLA)", "24/7 ফোন সাপোর্ট (15 মিনিটের SLA)"],
    ],
  },
];

function Pricing() {
  const { bi } = useLang();
  return (
    <AppShell hideSidebar>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-mono-tech text-primary">
              <Zap className="h-3 w-3" />
              {bi("~10% of the cost of CrowdStrike · Splunk · Sentinel", "CrowdStrike · Splunk · Sentinel-এর খরচের প্রায় 10%")}
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              {bi("Enterprise SOC power,", "এন্টারপ্রাইজ SOC ক্ষমতা,")}{" "}
              <span className="bg-gradient-to-r from-primary to-ok bg-clip-text text-transparent">
                {bi("SME pricing.", "এসএমই মূল্য।")}
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {bi(
                "Incumbent tools charge $10–15 per machine per month. Our AI agents do the detection, investigation and response — so we charge a tenth of that.",
                "প্রচলিত টুল প্রতি মেশিনে মাসে $10–15 নেয়। আমাদের এআই এজেন্টরাই শনাক্তকরণ, তদন্ত ও প্রতিক্রিয়া করে — তাই আমরা তার এক-দশমাংশ নিই।",
              )}
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((t) => (
              <div
                key={bi(...t.name)}
                className={cn(
                  "relative flex flex-col rounded-xl border p-5 transition-transform hover:-translate-y-1",
                  t.highlight
                    ? "border-primary/60 bg-panel shadow-[0_0_50px_-12px_var(--primary)]"
                    : "border-border bg-panel/70",
                )}
              >
                {t.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    {bi(...t.badge)}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className={cn("grid h-8 w-8 place-items-center rounded-md", t.highlight ? "bg-primary/20 ring-1 ring-primary/50" : "bg-accent")}>
                    <t.icon className={cn("h-4 w-4", t.highlight ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <span className="text-sm font-semibold">{bi(...t.name)}</span>
                </div>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className={cn("text-3xl font-bold tracking-tight font-mono-tech", t.highlight && "text-primary")}>
                    {bi(...t.price)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{bi(...t.unit)}</span>
                </div>
                <div className="mt-1 text-[11px] font-mono-tech uppercase tracking-wider text-muted-foreground">
                  {bi(...t.range)}
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{bi(...t.blurb)}</p>

                <ul className="mt-4 flex-1 space-y-2 border-t border-border pt-4">
                  {t.features.map((f) => (
                    <li key={f[0]} className="flex items-start gap-2 text-[13px]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok" />
                      <span>{bi(...f)}</span>
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
                  {bi(...t.cta)} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-border bg-panel/70 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{bi("How is it this cheap?", "এত সস্তা কীভাবে?")}</span>{" "}
              {bi(
                "Legacy SOCs bill you for the humans watching dashboards. Our agents do that work, so a two-person team gets 24/7 coverage at a tenth of the price. Every plan includes the full reasoning trail and audit export.",
                "পুরোনো SOC-গুলো ড্যাশবোর্ড দেখা মানুষের বিল আপনাকে দেয়। সেই কাজ আমাদের এজেন্টরা করে, তাই দুইজনের দলও এক-দশমাংশ দামে 24/7 কভারেজ পায়। প্রতিটি প্ল্যানে সম্পূর্ণ যুক্তির ট্রেইল ও অডিট এক্সপোর্ট অন্তর্ভুক্ত।",
              )}
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
