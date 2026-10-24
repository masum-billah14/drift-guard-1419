import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DocShell } from "@/components/doc-shell";
import { ShieldCheck, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/pitchdeck")({
  head: () => ({
    meta: [
      { title: "Pitch deck — DriftGuard" },
      { name: "description", content: "9-slide investor deck for DriftGuard." },
    ],
  }),
  component: Deck,
});

type Pair = [string, string];

type Slide = {
  n: number;
  kicker: Pair;
  title: Pair;
  body: Pair;
  metric?: { v: string; l: Pair }[];
  kind?: "cover" | "ask";
};

const slides: Slide[] = [
  { n: 1, kicker: ["DriftGuard · Seed 2026", "DriftGuard · Seed 2026"], title: ["The security team for companies that don't have one.", "যেসব কোম্পানির সিকিউরিটি দল নেই, তাদের জন্যই সেই দল।"], body: ["AI agents that detect, explain, and respond — designed for the 200,000 SMEs regulators just told to grow up.", "শনাক্ত, ব্যাখ্যা ও প্রতিক্রিয়া জানানো এআই এজেন্ট — 200,000 এসএমই-এর জন্য তৈরি, যাদের নিয়ামকরা এখন সক্ষমতা দেখাতে বলছে।"], kind: "cover" },
  { n: 2, kicker: ["Problem", "সমস্যা"], title: ["204 days.", "204 দিন।"], body: ["That's how long the average breach goes undetected at an SME. A 24/7 SOC costs $1M+. Most SMEs run with zero coverage — and NIS2 & DORA just made that illegal.", "এসএমই-তে গড়ে একটি ব্রিচ এত দিন ধরাও পড়ে না। 24/7 SOC-এর খরচ $1M+। বেশিরভাগ এসএমই চলে শূন্য কভারেজে — আর NIS2 ও DORA এখন তা বেআইনি করেছে।"], metric: [{ v: "204", l: ["days to detect", "শনাক্তে দিন"] }, { v: "$4.4M", l: ["avg breach cost", "গড় ব্রিচ খরচ"] }, { v: "0", l: ["SOC headcount", "SOC জনবল"] }] },
  { n: 3, kicker: ["Solution", "সমাধান"], title: ["Three agents, one paper trail.", "তিনটি এজেন্ট, একটি লিখিত প্রমাণ-ট্রেইল।"], body: ["Detector spots anomalies against learned baselines. Investigator retrieves similar past incidents from vector memory. Responder acts on the safe stuff, escalates the rest — with full reasoning attached to every decision.", "ডিটেক্টর শেখা বেসলাইনের তুলনায় অস্বাভাবিকতা শনাক্ত করে। ইনভেস্টিগেটর ভেক্টর মেমরি থেকে অনুরূপ পুরোনো ইনসিডেন্ট খুঁজে আনে। রেসপন্ডার নিরাপদ বিষয়ে পদক্ষেপ নেয়, বাকিটা এস্কেলেট করে — প্রতিটি সিদ্ধান্তে সম্পূর্ণ যুক্তি সংযুক্ত।"], metric: [{ v: "seconds", l: ["MTTD", "MTTD"] }, { v: "82%", l: ["auto-resolved", "স্বয়ংক্রিয় সমাধান"] }, { v: "100%", l: ["explainable", "ব্যাখ্যাযোগ্য"] }] },
  { n: 4, kicker: ["Market", "বাজার"], title: ["€400M and growing 22% YoY.", "€400M, বছরে 22% প্রবৃদ্ধি।"], body: ["200,000 EU SMEs above the NIS2 threshold with no dedicated SOC. Regulation created a mandatory line item where none existed. LLMs made supplying it economical.", "NIS2 সীমার ওপরে থাকা 200,000 ইউরোপীয় এসএমই, যাদের নিজস্ব SOC নেই। নিয়মকানুন এমন বাধ্যতামূলক বাজেট আইটেম তৈরি করেছে, যা আগে ছিলই না। LLM সেটির সরবরাহ সাশ্রয়ী করেছে।"], metric: [{ v: "200k", l: ["EU SMEs > 50 FTE", "ইউরোপীয় এসএমই > 50 FTE"] }, { v: "€400M", l: ["EU TAM", "EU TAM"] }, { v: "22%", l: ["CAGR", "CAGR"] }] },
  { n: 5, kicker: ["Product", "প্রোডাক্ট"], title: ["Explainable by construction.", "গঠনেই ব্যাখ্যাযোগ্য।"], body: ["Every alert ships with a plain-language reasoning chain, MITRE ATT&CK tags, and a recommended action. The AI doesn't hide behind a black box — a Head of IT can approve or override in seconds.", "প্রতিটি অ্যালার্টে সহজ ভাষার যুক্তি-চেইন, MITRE ATT&CK ট্যাগ এবং প্রস্তাবিত পদক্ষেপ থাকে। এআই কালো বাক্সে লুকায় না — আইটি প্রধান কয়েক সেকেন্ডে অনুমোদন বা বাতিল করতে পারেন।"] },
  { n: 6, kicker: ["Traction", "ট্র্যাকশন"], title: ["10 design partners. 3 white-label LOIs.", "10টি ডিজাইন পার্টনার। 3টি হোয়াইট-লেবেল LOI।"], body: ["Committed pilots across fintech, healthcare, and manufacturing. Two MSPs in advanced conversation to resell under their own brand.", "ফিনটেক, হেলথকেয়ার ও ম্যানুফ্যাকচারিং জুড়ে প্রতিশ্রুত পাইলট। দুইজন MSP নিজেদের ব্র্যান্ডে পুনর্বিক্রির অগ্রিম আলোচনায়।"], metric: [{ v: "10", l: ["design partners", "ডিজাইন পার্টনার"] }, { v: "$180k", l: ["ARR Q4 target", "ARR Q4 লক্ষ্য"] }, { v: "3", l: ["MSP LOIs", "MSP LOI"] }] },
  { n: 7, kicker: ["Business model", "বিজনেস মডেল"], title: ["SaaS with a floor, usage on top.", "ন্যূনতম বেসসহ SaaS, ব্যবহার-ভিত্তিক চার্জ ওপরে।"], body: ["$1,999/mo base + $0.001 per event. Gross margin 82% at scale. Payback ≈ 4 months. Net dollar retention 138% projected on year-two cohorts.", "মাসে $1,999 বেস + প্রতি ইভেন্টে $0.001। স্কেলে গ্রস মার্জিন 82%। পেব্যাক ≈ 4 মাস। দ্বিতীয় বছরের কোহোর্টে নেট ডলার রিটেনশন 138% প্রাক্ষেপিত।"], metric: [{ v: "82%", l: ["gross margin", "গ্রস মার্জিন"] }, { v: "4 mo", l: ["payback", "পেব্যাক"] }, { v: "138%", l: ["NDR (proj)", "NDR (প্রাক্ষেপিত)"] }] },
  { n: 8, kicker: ["Team", "দল"], title: ["Built by people who've been the on-call.", "গড়েছেন তারাই, যারা নিজেরা অন-কলে ছিলেন।"], body: ["Security engineers from Cloudflare & Datadog. ML researchers from DeepMind. A repeat SaaS founder who has scaled a category before. 30 years combined in enterprise security.", "Cloudflare ও Datadog-এর সিকিউরিটি ইঞ্জিনিয়ার। DeepMind-এর ML গবেষক। আগে ক্যাটাগরি স্কেল করা অভিজ্ঞ SaaS ফাউন্ডার। এন্টারপ্রাইজ সিকিউরিটিতে মিলিত 30 বছর।"] },
  { n: 9, kicker: ["Ask", "চাহিদা"], title: ["$1.2M seed → $1M ARR + SOC 2 Type II.", "$1.2M সিড → $1M ARR + SOC 2 Type II।"], body: ["12-month runway to production LLM stack, 25 paying customers, SOC 2 Type II certification, and a Series A story with the numbers to back it.", "12 মাসের রানওয়ে: প্রোডাকশন LLM স্ট্যাক, 25জন পরিশোধকারী গ্রাহক, SOC 2 Type II সার্টিফিকেশন এবং সংখ্যায় সমর্থিত Series A গল্প।"], metric: [{ v: "$1.2M", l: ["seed round", "সিড রাউন্ড"] }, { v: "12 mo", l: ["runway", "রানওয়ে"] }, { v: "SOC 2", l: ["Type II", "Type II"] }], kind: "ask" },
];

function Deck() {
  const { bi } = useLang();
  const [i, setI] = useState(0);
  const s = slides[i];
  const prev = () => setI((v) => Math.max(0, v - 1));
  const next = () => setI((v) => Math.min(slides.length - 1, v + 1));

  return (
    <DocShell
      eyebrow={bi("Investor materials", "ইনভেস্টর উপকরণ")}
      title={bi("Pitch deck", "পিচ ডেক")}
      subtitle={bi("Nine slides. Click a number below or use ← / →. Each slide is one idea.", "নয়টি স্লাইড। নিচের নম্বরে ক্লিক করুন বা ← / → ব্যবহার করুন। প্রতিটি স্লাইডে একটি ভাবনা।")}
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
              {bi(...s.kicker)}
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
              {bi(...s.title)}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/85 md:text-lg">
              {bi(...s.body)}
            </p>

            {s.metric && (
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {s.metric.map((m) => (
                  <div key={m.l[0]} className="rounded-lg border border-border/70 bg-background/60 p-5 backdrop-blur">
                    <div className="font-mono-tech text-3xl font-bold tracking-tight text-primary md:text-4xl">{m.v}</div>
                    <div className="mt-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">{bi(...m.l)}</div>
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
                {bi("Try the live demo", "লাইভ ডেমো দেখুন")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/presentation"
                className="rounded-md border border-border bg-panel px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                {bi("Read the full story", "পুরো গল্পটি পড়ুন")}
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
              <ChevronLeft className="h-3.5 w-3.5" /> {bi("Prev", "আগের")}
            </button>
            <div className="flex flex-1 items-center justify-center gap-1">
              {slides.map((sl, idx) => (
                <button
                  key={sl.n}
                  onClick={() => setI(idx)}
                  aria-label={`${bi("Go to slide", "স্লাইডে যান")} ${sl.n}`}
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
              {bi("Next", "পরের")} <ChevronRight className="h-3.5 w-3.5" />
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
            <div className="mt-1 truncate text-[11px] font-medium">{bi(...sl.kicker)}</div>
          </button>
        ))}
      </div>
    </DocShell>
  );
}
