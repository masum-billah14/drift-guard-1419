import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";
import { Lock, Globe2, KeyRound, FileCheck, Shield, Server, Eye, GitBranch } from "lucide-react";
import type { ComponentType } from "react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & Compliance — DriftGuard" },
      { name: "description", content: "Auth, encryption, sovereignty and compliance posture." },
      { property: "og:title", content: "DriftGuard Security posture" },
      { property: "og:description", content: "Auth, encryption at rest/in transit, GDPR-aligned data sovereignty." },
    ],
  }),
  component: SecurityPage,
});

type Pair = [string, string];

function SecurityPage() {
  const { bi } = useLang();
  const kpis: { k: string; l: Pair; tone: "primary" | "ok" }[] = [
    { k: "AES-256-GCM", l: ["encryption at rest", "স্টোরেজে এনক্রিপশন"], tone: "primary" },
    { k: "TLS 1.3", l: ["in transit", "ট্রানজিটে এনক্রিপশন"], tone: "primary" },
    { k: "EU / US", l: ["data residency", "ডেটা রেসিডেন্সি"], tone: "primary" },
    { k: "0 SEV", l: ["incidents 2026 YTD", "2026-এ এ পর্যন্ত ইনসিডেন্ট"], tone: "ok" },
  ];
  return (
    <DocShell
      eyebrow="SEC-01 · Trust document"
      title={bi("Security posture, out in the open", "নিরাপত্তা অবস্থান, খোলাখুলি")}
      subtitle={bi(
        "The questions procurement always asks — answered on one page, with no marketing gloss.",
        "প্রকিউরমেন্ট সবসময় যে প্রশ্নগুলো করে — এক পাতায় উত্তর, কোনো মার্কেটিং-চকচকে ছাড়াই।",
      )}
    >
      {/* Hero KPIs */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((s) => (
          <div key={s.k + s.l[0]} className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-panel to-panel/40 p-4">
            <div className="absolute right-3 top-3 opacity-20">
              <Shield className="h-14 w-14 text-primary" />
            </div>
            <div className={`font-mono-tech text-2xl font-semibold ${s.tone === "ok" ? "text-ok" : "text-primary"}`}>{s.k}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{bi(...s.l)}</div>
          </div>
        ))}
      </div>

      {/* Pillars */}
      <div className="grid gap-4 md:grid-cols-2">
        <Pillar icon={KeyRound} tag="AUTH" title={bi("Identity & session", "পরিচয় ও সেশন")}
          bullets={[
            ["SSO via SAML 2.0 & OIDC — Okta, Azure AD, Google", "SAML 2.0 ও OIDC দিয়ে SSO — Okta, Azure AD, Google"],
            ["MFA (WebAuthn) enforced for every admin", "প্রতিটি অ্যাডমিনের জন্য MFA (WebAuthn) বাধ্যতামূলক"],
            ["15-minute access tokens, refresh rotation, device binding", "15 মিনিটের অ্যাক্সেস টোকেন, রিফ্রেশ রোটেশন, ডিভাইস বাইন্ডিং"],
            ["Scoped personal access tokens for API automation", "API অটোমেশনের জন্য স্কোপড পার্সোনাল অ্যাক্সেস টোকেন"],
          ]} />
        <Pillar icon={Lock} tag="CRYPTO" title={bi("Encryption", "এনক্রিপশন")}
          bullets={[
            ["TLS 1.3 for every hop, HSTS preloaded", "প্রতিটি হপে TLS 1.3, HSTS প্রিলোডেড"],
            ["AES-256-GCM at rest — Postgres, object storage, backups", "স্টোরেজে AES-256-GCM — Postgres, অবজেক্ট স্টোরেজ, ব্যাকআপ"],
            ["Per-tenant DEK wrapped by KMS-managed master key", "প্রতি-টেন্যান্ট DEK, KMS-পরিচালিত মাস্টার কী দিয়ে মোড়ানো"],
            ["90-day key rotation, cryptographic erasure on offboarding", "90 দিনে কী রোটেশন, অফবোর্ডিংয়ে ক্রিপ্টোগ্রাফিক মুছে ফেলা"],
          ]} />
        <Pillar icon={Globe2} tag="RESIDENCY" title={bi("Data sovereignty", "ডেটা সার্বভৌমত্ব")}
          bullets={[
            ["Region pinned at provisioning (EU-Central-1 or US-East-1)", "প্রভিশনিংয়ের সময় রিজিয়ন পিন করা (EU-Central-1 বা US-East-1)"],
            ["Embeddings, prompts and LLM outputs stay in-region", "এমবেডিং, প্রম্পট ও LLM আউটপুট রিজিয়নের ভেতরেই থাকে"],
            ["Providers without regional guarantees are disqualified", "আঞ্চলিক গ্যারান্টি নেই এমন প্রোভাইডার বাতিল"],
            ["Cross-region transfers require signed data-processing addendum", "রিজিয়ন-বহি স্থানান্তরে স্বাক্ষরিত ডেটা-প্রসেসিং সংযোজন লাগে"],
          ]} />
        <Pillar icon={FileCheck} tag="COMPLIANCE" title={bi("Framework alignment", "ফ্রেমওয়ার্ক সামঞ্জস্য")}
          bullets={[
            ["GDPR — lawful basis per data category, DPIA shipped", "GDPR — প্রতি ডেটা ক্যাটাগরিতে বৈধ ভিত্তি, DPIA প্রস্তুত"],
            ["SOC 2 Type I on track for Q4 2026 (Prescient)", "SOC 2 Type I চলছে, লক্ষ্য Q4 2026 (Prescient)"],
            ["ISO 27001 controls mapped, gap analysis complete", "ISO 27001 কন্ট্রোল ম্যাপ করা, গ্যাপ বিশ্লেষণ সম্পন্ন"],
            ["Tenant-initiated deletion within 24 hours, signed receipt", "টেন্যান্ট-অনুরোধে মুছে ফেলা 24 ঘণ্টায়, স্বাক্ষরিত রশিদসহ"],
          ]} />
      </div>

      {/* Controls grid */}
      <section className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{bi("Technical controls", "প্রযুক্তিগত কন্ট্রোল")}</h2>
          <span className="font-mono-tech text-[10.5px] text-muted-foreground">18 {bi("controls", "কন্ট্রোল")} · v1.0</span>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {controls.map((c) => (
            <div key={c.name[0]} className="flex items-start gap-3 rounded-md border border-border bg-panel/50 p-3">
              <c.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="text-[13px] font-medium">{bi(...c.name)}</div>
                <div className="mt-0.5 text-[11.5px] text-muted-foreground">{bi(...c.detail)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DocShell>
  );
}

const controls: { icon: ComponentType<{ className?: string }>; name: Pair; detail: Pair }[] = [
  { icon: Server, name: ["Tenant isolation", "টেন্যান্ট আইসোলেশন"], detail: ["Postgres row-level security; every query tenant-scoped at the DB layer", "Postgres রো-লেভেল সিকিউরিটি; প্রতিটি কোয়েরি ডিবি লেয়ারে টেন্যান্ট-স্কোপড"] },
  { icon: KeyRound, name: ["Secret management", "সিক্রেট ম্যানেজমেন্ট"], detail: ["KMS-backed vault; zero plaintext credentials in build artifacts", "KMS-নির্ভর ভল্ট; বিল্ড আর্টিফ্যাক্টে কোনো প্লেইনটেক্সট ক্রেডেনশিয়াল নেই"] },
  { icon: FileCheck, name: ["Immutable audit log", "অপরিবর্তনীয় অডিট লগ"], detail: ["Every admin action & AI decision written to an append-only store", "প্রতিটি অ্যাডমিন পদক্ষেপ ও এআই সিদ্ধান্ত অ্যাপেন্ড-অনলি স্টোরে লেখা হয়"] },
  { icon: Shield, name: ["PII redaction in prompts", "প্রম্পটে PII মুছে ফেলা"], detail: ["Regex & NER-based scrubbing before any LLM call", "যেকোনো LLM কলের আগে Regex ও NER-নির্ভর পরিষ্কার"] },
  { icon: GitBranch, name: ["Supply-chain scanning", "সাপ্লাই-চেইন স্ক্যানিং"], detail: ["Snyk + GitHub Advanced Security on every PR, weekly dep bumps", "প্রতিটি PR-এ Snyk + GitHub Advanced Security, সাপ্তাহিক ডিপেন্ডেন্সি আপডেট"] },
  { icon: Lock, name: ["Backup encryption", "ব্যাকআপ এনক্রিপশন"], detail: ["Backups sealed with tenant DEK; restore rehearsed monthly", "ব্যাকআপ টেন্যান্ট DEK দিয়ে সিলড; মাসে রিস্টোর রিহার্সাল"] },
  { icon: Globe2, name: ["Egress allow-list", "ইগ্রেস অ্যালাউ-লিস্ট"], detail: ["Worker egress restricted to declared destinations only", "ওয়ার্কার ইগ্রেস শুধু ঘোষিত গন্তব্যে সীমাবদ্ধ"] },
  { icon: Eye, name: ["Anomaly on ourselves", "নিজেদের ওপরও অস্বাভাবিকতা নজরদারি"], detail: ["DriftGuard monitors its own control-plane with the same detector agents", "DriftGuard নিজের কন্ট্রোল-প্লেন একই ডিটেক্টর এজেন্ট দিয়ে পর্যবেক্ষণ করে"] },
];

function Pillar({
  icon: Icon,
  tag,
  title,
  bullets,
}: {
  icon: ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  bullets: Pair[];
}) {
  const { bi } = useLang();
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-panel/60 p-5 transition-colors hover:border-primary/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 ring-1 ring-primary/40">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{tag}</div>
          <h3 className="text-[15px] font-semibold">{title}</h3>
        </div>
      </div>
      <ul className="mt-4 space-y-1.5 text-[13px]">
        {bullets.map((b) => (
          <li key={b[0]} className="flex items-start gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span className="text-foreground/85">{bi(...b)}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
