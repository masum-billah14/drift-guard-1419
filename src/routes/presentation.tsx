import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";
import { AlertTriangle, Sparkles, Users, TrendingUp, Target } from "lucide-react";
import type { ComponentType } from "react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "The story — DriftGuard" },
      { name: "description", content: "Problem, solution, users, market, and impact." },
      { property: "og:title", content: "DriftGuard — the story" },
      { property: "og:description", content: "Why lean IT teams need an AI security copilot, and what happens when they have one." },
    ],
  }),
  component: PresentationPage,
});

type Pair = [string, string];

const chapters: { n: string; tag: Pair; icon: ComponentType<{ className?: string }>; accent: "critical" | "primary" | "high" | "medium" | "ok"; title: Pair; lede: Pair; body: Pair; stat: { v: string; u: Pair; l: Pair } }[] = [
  {
    n: "01",
    tag: ["Problem", "সমস্যা"],
    icon: AlertTriangle,
    accent: "critical",
    title: ["SMEs run enterprise infrastructure with zero-person SOCs", "এসএমই চালায় এন্টারপ্রাইজ ইনফ্রাস্ট্রাকচার, কিন্তু SOC থাকে শূন্য জনের"],
    lede: ["204 days average time to detect a breach. By then, it's not detection — it's forensics.", "ব্রিচ ধরতে গড়ে 204 দিন লাগে। ততদিনে সেটা আর শনাক্তকরণ নয় — ফরেনসিক।"],
    body: [
      "Small and mid-sized businesses run the same infrastructure the enterprise does — SSO, cloud, remote workers, APIs — but without the enterprise's 24/7 Security Operations Center. A senior analyst costs $150k+; a team of five, a million. So most SMEs run with none, or with a part-time contractor.",
      "ছোট ও মাঝারি ব্যবসাগুলো চালায় একই ইনফ্রাস্ট্রাকচার — SSO, ক্লাউড, রিমোট কর্মী, API — কিন্তু এন্টারপ্রাইজের 24/7 সিকিউরিটি অপারেশন সেন্টার ছাড়া। একজন সিনিয়র বিশ্লেষকের বেতন $150k+; পাঁচজনের দলে প্রায় দশ লাখ। তাই বেশিরভাগ এসএমই চালায় একদম কোনো রক্ষী ছাড়া, বা খণ্ডকালীন ঠিকাদার দিয়ে।",
    ],
    stat: { v: "204", u: ["days", "দিন"], l: ["median time-to-detect (IBM 2024)", "শনাক্তে মধ্যম সময় (IBM 2024)"] },
  },
  {
    n: "02",
    tag: ["Solution", "সমাধান"],
    icon: Sparkles,
    accent: "primary",
    title: ["Three agents that see, think, and act — with a paper trail", "তিনটি এজেন্ট দেখে, ভাবে ও পদক্ষেপ নেয় — লিখিত প্রমাণসহ"],
    lede: ["Detector spots. Investigator explains. Responder acts. All auditable.", "ডিটেক্টর শনাক্ত করে। ইনভেস্টিগেটর ব্যাখ্যা করে। রেসপন্ডার পদক্ষেপ নেয়। সবই অডিটযোগ্য।"],
    body: [
      "DriftGuard is an AI security copilot. Three specialised agents work continuously: a Detector spots anomalies against learned baselines; an Investigator retrieves similar past incidents from a vector DB and explains its reasoning; a Responder takes contained actions — block an IP, revoke a session — or escalates to a human with the full chain of thought.",
      "DriftGuard একটি এআই সিকিউরিটি কপাইলট। তিনটি বিশেষায়িত এজেন্ট অবিরাম কাজ করে: ডিটেক্টর শেখা বেসলাইনের তুলনায় অস্বাভাবিকতা শনাক্ত করে; ইনভেস্টিগেটর ভেক্টর ডিবি থেকে অনুরূপ পুরোনো ইনসিডেন্ট খুঁজে তার যুক্তি ব্যাখ্যা করে; রেসপন্ডার নিয়ন্ত্রিত পদক্ষেপ নেয় — IP ব্লক, সেশন বাতিল — অথবা সম্পূর্ণ যুক্তি-চেইনসহ মানুষের কাছে এস্কেলেট করে।",
    ],
    stat: { v: "10×", u: ["faster", "দ্রুততর"], l: ["team-of-two holds the line team-of-ten used to", "যা আগে দশজনের দল করত, এখন দুইজনের দল তা করে"] },
  },
  {
    n: "03",
    tag: ["Users", "ব্যবহারকারী"],
    icon: Users,
    accent: "high",
    title: ["Head of IT at a 50–500 person company", "50–500 জনের কোম্পানির আইটি প্রধান"],
    lede: ["The security team of one. They approve or override in seconds, not investigate for an hour.", "একজনের সিকিউরিটি দল। তারা কয়েক সেকেন্ডে অনুমোদন বা বাতিল করে, ঘণ্টার পর ঘণ্টা তদন্ত করে না।"],
    body: [
      "They pick DriftGuard because it explains itself — every alert comes with plain-language reasoning, MITRE ATT&CK tags, and a recommended action. No dashboard-diving. No SIEM query language. No 30-tab investigation.",
      "তারা DriftGuard বেছে নেয় কারণ এটি নিজেই ব্যাখ্যা করে — প্রতিটি অ্যালার্টে সহজ ভাষার যুক্তি, MITRE ATT&CK ট্যাগ এবং প্রস্তাবিত পদক্ষেপ থাকে। ড্যাশবোর্ডে ডোবানো লাগে না। SIEM কোয়েরি ভাষা লাগে না। 30টি ট্যাবের তদন্তও লাগে না।",
    ],
    stat: { v: "1", u: ["person", "জন"], l: ["typical security headcount at target customers", "লক্ষ্য গ্রাহকের সাধারণ সিকিউরিটি জনবল"] },
  },
  {
    n: "04",
    tag: ["Market", "বাজার"],
    icon: TrendingUp,
    accent: "medium",
    title: ["~200k EU SMEs, and NIS2/DORA now make coverage mandatory", "প্রায় 200k ইউরোপীয় এসএমই, আর NIS2/DORA এখন কভারেজ বাধ্যতামূলক করেছে"],
    lede: ["Regulation created the demand. LLMs made the supply economical.", "নিয়মকানুন চাহিদা তৈরি করেছে। LLM সরবরাহকে সাশ্রয়ী করেছে।"],
    body: [
      "There are ~200,000 SMEs in the EU alone with more than 50 employees and no dedicated SOC. NIS2 and DORA now require them to demonstrate detection and response capability. LLMs finally make explainable, agent-driven security economically viable at that scale — the same automation enterprises pay $500k/year for, delivered as SaaS at $2k/month.",
      "শুধু ইউরোপীয় ইউনিয়নেই প্রায় 200,000 এসএমই আছে 50+ কর্মী নিয়ে, যাদের নিজস্ব কোনো SOC নেই। NIS2 ও DORA এখন তাদের কাছে শনাক্তকরণ ও প্রতিক্রিয়া সক্ষমতা প্রমাণ করতে বলছে। LLM অবশেষে ব্যাখ্যাযোগ্য, এজেন্ট-নির্ভর নিরাপত্তাকে ওই স্কেলে অর্থনৈতিকভাবে সম্ভব করেছে — এন্টারপ্রাইজরা যে অটোমেশনের জন্য বছরে $500k দেয়, সেটি SaaS হিসেবে মাসে $2k-তে।",
    ],
    stat: { v: "€400M", u: ["TAM", "TAM"], l: ["EU SME SOC-as-service segment, 2026", "ইউরোপীয় এসএমই SOC-as-service সেগমেন্ট, 2026"] },
  },
  {
    n: "05",
    tag: ["Impact", "প্রভাব"],
    icon: Target,
    accent: "ok",
    title: ["Days to seconds — for the segment that today has nothing", "দিন থেকে সেকেন্ড — যে সেগমেন্টের আজ কিছুই নেই"],
    lede: ["A defensible moat built from every customer's incident history.", "প্রতিটি গ্রাহকের ইনসিডেন্ট-ইতিহাস থেকে গড়া একটি রক্ষণযোগ্য প্রতিরক্ষা।"],
    body: [
      "A 10× reduction in mean-time-to-detect for a segment with no current coverage. Fewer breaches becoming national news. Shared threat intelligence that no single SME could ever produce alone — federated across the customer base, sanitised, and fed back into the detector.",
      "বর্তমানে কোনো কভারেজ নেই এমন সেগমেন্টের জন্য গড় শনাক্ত-সময়ে 10× হ্রাস। কম ব্রিচ হবে জাতীয় সংবাদ। এমন শেয়ার্ড থ্রেট ইন্টেলিজেন্স যা কোনো একক এসএমই কখনোই নিজে বানাতে পারত না — গ্রাহক-বেস জুড়ে সংযুক্ত, পরিশুদ্ধ এবং ডিটেক্টরে ফেরত খাওয়ানো।",
    ],
    stat: { v: "seconds", u: ["MTTD", "MTTD"], l: ["vs 204 days industry baseline", "শিল্পের 204 দিনের বেসলাইনের তুলনায়"] },
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
  const { bi } = useLang();
  return (
    <DocShell
      eyebrow="Narrative · v1.0"
      title={bi("Problem → Solution → Users → Market → Impact", "সমস্যা → সমাধান → ব্যবহারকারী → বাজার → প্রভাব")}
      subtitle={bi(
        "The whole business, in five chapters. Twelve minutes to read; two minutes if you skim the numbers.",
        "পুরো ব্যবসা, পাঁচটি অধ্যায়ে। পড়তে বারো মিনিট; সংখ্যা উড়িয়ে দিলে দুই মিনিট।",
      )}
    >
      <div className="space-y-6">
        {chapters.map((c, i) => (
          <Chapter key={c.n} c={c} last={i === chapters.length - 1} />
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-8 text-center">
        <div className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-primary">{bi("Bottom line", "মূল কথা")}</div>
        <p className="mx-auto mt-3 max-w-2xl text-lg font-semibold tracking-tight md:text-2xl">
          {bi(
            "\"Enterprise-grade security operations, delivered as software, priced for a company that doesn't have a CISO yet.\"",
            "\"এন্টারপ্রাইজ-গ্রেড সিকিউরিটি অপারেশন, সফটওয়্যার হিসেবে সরবরাহ, এমন কোম্পানির মূল্যে যার এখনো CISO নেই।\"",
          )}
        </p>
      </div>
    </DocShell>
  );
}

function Chapter({ c, last }: { c: (typeof chapters)[number]; last: boolean }) {
  const { bi } = useLang();
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
            {bi(...c.tag)}
          </span>
          <span className="md:hidden font-mono-tech text-[10px] text-muted-foreground">{c.n}</span>
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">{bi(...c.title)}</h2>
        <p className="mt-2 text-[14px] font-medium text-primary/90">{bi(...c.lede)}</p>
        <p className="mt-3 text-[14px] leading-relaxed text-foreground/80">{bi(...c.body)}</p>
      </div>

      {/* stat pull-quote */}
      <div className={`hidden md:flex md:flex-col md:justify-center rounded-lg border p-5 ${accentClass[c.accent]}`}>
        <div className="font-mono-tech text-4xl font-bold leading-none">{c.stat.v}</div>
        <div className="mt-1 font-mono-tech text-[11px] uppercase tracking-wider opacity-80">{bi(...c.stat.u)}</div>
        <div className="mt-3 text-[12px] leading-snug opacity-90">{bi(...c.stat.l)}</div>
      </div>
    </article>
  );
}
