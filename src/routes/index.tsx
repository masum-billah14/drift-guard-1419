import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  ArrowRight,
  Activity,
  Bot,
  Zap,
  Database,
  Network,
  Lock,
  FileCheck2,
  Crown,
} from "lucide-react";
import { kpis } from "@/lib/marketing-data";
import { LiveBg } from "@/components/live-bg";
import { AppShell } from "@/components/app-shell";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DriftGuard — AI Security Operations Copilot for lean teams" },
      {
        name: "description",
        content:
          "SMEs get breached because they can't afford 24/7 SOC. DriftGuard's AI agents detect anomalies, explain why, and respond in seconds.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { bi } = useLang();
  return (
    <AppShell hideSidebar>
      <div className="min-h-[calc(100vh-3.5rem-2.5rem)] bg-background text-foreground">
        <section className="relative overflow-hidden border-b border-border">
          <LiveBg />
          <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-mono-tech text-primary backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ok" />
              </span>
              LIVE · v0.1 · Idea to Unicorn 2026
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              {bi(
                "SMEs get breached because they can't afford a",
                "ছোট ও মাঝারি ব্যবসা হ্যাক হয়ে যায়, কারণ তারা পারে না",
              )}{" "}
              <span
                className="glow-text bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, color-mix(in oklab, var(--primary) 90%, white), color-mix(in oklab, var(--ok) 85%, white))",
                }}
              >
                {bi("24/7 SOC.", "24/7 SOC রাখার খরচ।")}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {bi(
                "DriftGuard is an AI security copilot: autonomous agents that detect anomalies,",
                "DriftGuard একটি এআই সিকিউরিটি কপাইলট: স্বায়ত্তশাসিত এজেন্ট অস্বাভাবিকতা শনাক্ত করে,",
              )}{" "}
              <span className="text-foreground">
                {bi("explain their reasoning in plain language", "সহজ ভাষায় তার যুক্তি ব্যাখ্যা করে")}
              </span>
              {bi(
                ", and take contained response actions — so a team of two can hold the line.",
                " এবং নিয়ন্ত্রিত প্রতিক্রিয়া নেয় — ফলে মাত্র দুইজনের দলও পাহারা দিতে পারে।",
              )}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/demo-user"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_-8px_var(--primary)] transition-all hover:shadow-[0_0_60px_-4px_var(--primary)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {bi("View live demo", "লাইভ ডেমো দেখুন")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-md border border-ok/40 bg-ok/10 px-5 py-2.5 text-sm font-semibold text-ok backdrop-blur hover:bg-ok/20"
              >
                <Crown className="h-4 w-4" />
                {bi("Upgrade from $1/mo", "$1/মাস থেকে আপগ্রেড")}
              </Link>
              <Link
                to="/demo-admin"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-panel/60 px-5 py-2.5 text-sm font-medium backdrop-blur hover:border-primary/50 hover:bg-accent"
              >
                {bi("Enter as admin", "অ্যাডমিন হিসেবে প্রবেশ")}
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/70 bg-border/70 backdrop-blur sm:grid-cols-4">
              <Stat label={bi("Threats detected today", "আজ শনাক্ত হুমকি")} value="1,284" tone="critical" />
              <Stat label={bi("Avg response time", "গড় প্রতিক্রিয়া সময়")} value={`${kpis.mttr_seconds}s`} tone="primary" />
              <Stat label={bi("Auto-resolved", "স্বয়ংক্রিয় সমাধান")} value={`${Math.round(kpis.auto_resolved_pct * 100)}%`} tone="ok" />
              <Stat label={bi("False positive rate", "ফলস-পজিটিভ হার")} value={`${(kpis.false_positive_rate * 100).toFixed(1)}%`} tone="low" />
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-semibold tracking-tight">{bi("How it works", "কীভাবে কাজ করে")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{bi("Three autonomous agents, one accountable pipeline.", "তিনটি স্বায়ত্তশাসিত এজেন্ট, একটি জবাবদিহিমূলক পাইপলাইন।")}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Step
                n="01"
                icon={Activity}
                title={bi("Event", "ইভেন্ট")}
                body={bi(
                  "Logs, auth, network and cloud events stream in through connectors. We embed and store baselines in a vector DB.",
                  "লগ, অথ, নেটওয়ার্ক ও ক্লাউড ইভেন্ট কানেক্টরের মাধ্যমে আসে। আমরা সেগুলো এমবেড করে বেসলাইন ভেক্টর ডিবিতে সংরক্ষণ করি।",
                )}
              />
              <Step
                n="02"
                icon={Bot}
                title={bi("AI Detection", "এআই শনাক্তকরণ")}
                body={bi(
                  "A Detector agent flags anomalies. An Investigator agent retrieves similar past incidents and enriches with threat intel.",
                  "ডিটেক্টর এজেন্ট অস্বাভাবিকতা চিহ্নিত করে। ইনভেস্টিগেটর এজেন্ট অনুরূপ পুরোনো ইনসিডেন্ট খুঁজে থ্রেট ইন্টেল দিয়ে সমৃদ্ধ করে।",
                )}
              />
              <Step
                n="03"
                icon={Zap}
                title={bi("Response", "প্রতিক্রিয়া")}
                body={bi(
                  "A Responder agent executes contained actions (block IP, revoke session) or escalates to a human — with full reasoning trail.",
                  "রেসপন্ডার এজেন্ট নিয়ন্ত্রিত পদক্ষেপ (IP ব্লক, সেশন বাতিল) নেয় বা মানুষের কাছে এস্কেলেট করে — সম্পূর্ণ যুক্তির ট্রেইলসহ।",
                )}
              />
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-panel/30">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{bi("Pricing that fits SMEs", "এসএমই-দের উপযোগী মূল্য")}</h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  {bi(
                    "Legacy SOCs charge $10–15 per endpoint. DriftGuard costs roughly a tenth because AI agents do the work.",
                    "পুরোনো SOC-গুলো প্রতি এন্ডপয়েন্টে $10–15 নেয়। এআই এজেন্টরাই কাজ করে বলে DriftGuard-এর খরচ প্রায় এক-দশমাংশ।",
                  )}
                </p>
              </div>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {bi("See all plans", "সব প্ল্যান দেখুন")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PriceCard name={bi("Personal", "পার্সোনাল")} price="Free" unit={bi("forever", "চিরকালের জন্য")} range={bi("1 machine", "1টি মেশিন")} />
              <PriceCard name={bi("Team", "টিম")} price="$1" unit={bi("/machine/mo", "/মেশিন/মাস")} range={bi("5–20 machines", "5–20টি মেশিন")} popular />
              <PriceCard name={bi("Business", "বিজনেস")} price="$0.80" unit={bi("/machine/mo", "/মেশিন/মাস")} range={bi("up to 50 machines", "সর্বোচ্চ 50টি মেশিন")} />
              <PriceCard name={bi("Enterprise", "এন্টারপ্রাইজ")} price={bi("Custom", "কাস্টম")} unit={bi("flat rate", "ফ্ল্যাট রেট")} range={bi("Unlimited", "আনলিমিটেড")} />
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-semibold tracking-tight">{bi("Built for judges to inspect", "বিচারকদের যাচাইয়ের জন্য তৈরি")}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {bi(
                "Every architectural and governance decision is a page you can open, not a slide.",
                "প্রতিটি আর্কিটেকচার ও গভর্নেন্স সিদ্ধান্ত একটি পাতা, যা আপনি খুলে দেখতে পারেন — শুধু স্লাইড নয়।",
              )}
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <DocLink to="/architecture" icon={Network} title={bi("Architecture", "আর্কিটেকচার")} body={bi("Event → embedding → vector lookup → LLM reasoning → response.", "ইভেন্ট → এমবেডিং → ভেক্টর লুকআপ → LLM যুক্তি → প্রতিক্রিয়া।")} />
              <DocLink to="/data" icon={Database} title={bi("Data", "ডেটা")} body={bi("Sources, ingestion, retention and anonymization.", "সোর্স, ইনজেশন, সংরক্ষণ ও নামগোপন।")} />
              <DocLink to="/security" icon={Lock} title={bi("Security", "নিরাপত্তা")} body={bi("Auth, encryption, sovereignty, GDPR-aligned posture.", "অথ, এনক্রিপশন, ডেটা সার্বভৌমত্ব, GDPR-সামঞ্জস্যপূর্ণ অবস্থান।")} />
              <DocLink to="/audit" icon={FileCheck2} title={bi("Audit", "অডিট")} body={bi("One-click security/privacy/governance report.", "এক ক্লিকে সিকিউরিটি/প্রাইভেসি/গভর্নেন্স রিপোর্ট।")} />
              <DocLink to="/presentation" icon={Activity} title={bi("Presentation", "উপস্থাপনা")} body={bi("Problem, solution, market, impact.", "সমস্যা, সমাধান, বাজার, প্রভাব।")} />
              <DocLink to="/pitchdeck" icon={ShieldCheck} title={bi("Pitch deck", "পিচ ডেক")} body={bi("YC-style deck for the finals.", "ফাইনালের জন্য YC-স্টাইল ডেক।")} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "critical" | "primary" | "ok" | "low" }) {
  const toneMap = {
    critical: "text-critical",
    primary: "text-primary",
    ok: "text-ok",
    low: "text-low",
  } as const;
  return (
    <div className="bg-panel/70 p-5 backdrop-blur transition-colors hover:bg-panel">
      <div className={`text-2xl font-semibold tracking-tight font-mono-tech ${toneMap[tone]}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  body,
}: {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono-tech text-muted-foreground">{n}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-3 text-base font-semibold">{title}</div>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function PriceCard({
  name,
  price,
  unit,
  range,
  popular,
}: {
  name: string;
  price: string;
  unit: string;
  range: string;
  popular?: boolean;
}) {
  return (
    <div className={cn(
      "relative rounded-xl border bg-panel p-5",
      popular ? "border-primary/60 shadow-[0_0_40px_-16px_var(--primary)]" : "border-border"
    )}>
      {popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
          Most popular
        </div>
      )}
      <div className="text-sm font-semibold text-muted-foreground">{name}</div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight font-mono-tech">{price}</span>
        <span className="text-[11px] text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-1 text-[11px] font-mono-tech uppercase tracking-wider text-muted-foreground">{range}</div>
    </div>
  );
}

function DocLink({
  to,
  icon: Icon,
  title,
  body,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-lg border border-border bg-panel p-4 transition-colors hover:border-primary/50 hover:bg-accent"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">{title}</span>
        <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">{body}</p>
    </Link>
  );
}
