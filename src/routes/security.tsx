import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";
import { Lock, Globe2, KeyRound, FileCheck, Shield, Server, Eye, GitBranch } from "lucide-react";
import type { ComponentType } from "react";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & Compliance — SecureAI" },
      { name: "description", content: "Auth, encryption, sovereignty and compliance posture." },
      { property: "og:title", content: "SecureAI Security posture" },
      { property: "og:description", content: "Auth, encryption at rest/in transit, GDPR-aligned data sovereignty." },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <DocShell
      eyebrow="SEC-01 · Trust document"
      title="Security posture, out in the open"
      subtitle="The questions procurement always asks — answered on one page, with no marketing gloss."
    >
      {/* Hero KPIs */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: "AES-256-GCM", l: "encryption at rest", tone: "primary" },
          { k: "TLS 1.3",     l: "in transit", tone: "primary" },
          { k: "EU / US",     l: "data residency", tone: "primary" },
          { k: "0 SEV",       l: "incidents 2026 YTD", tone: "ok" },
        ].map((s) => (
          <div key={s.l} className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-panel to-panel/40 p-4">
            <div className="absolute right-3 top-3 opacity-20">
              <Shield className="h-14 w-14 text-primary" />
            </div>
            <div className={`font-mono-tech text-2xl font-semibold ${s.tone === "ok" ? "text-ok" : "text-primary"}`}>{s.k}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Pillars */}
      <div className="grid gap-4 md:grid-cols-2">
        <Pillar icon={KeyRound} tag="AUTH" title="Identity & session"
          bullets={[
            "SSO via SAML 2.0 & OIDC — Okta, Azure AD, Google",
            "MFA (WebAuthn) enforced for every admin",
            "15-minute access tokens, refresh rotation, device binding",
            "Scoped personal access tokens for API automation",
          ]} />
        <Pillar icon={Lock} tag="CRYPTO" title="Encryption"
          bullets={[
            "TLS 1.3 for every hop, HSTS preloaded",
            "AES-256-GCM at rest — Postgres, object storage, backups",
            "Per-tenant DEK wrapped by KMS-managed master key",
            "90-day key rotation, cryptographic erasure on offboarding",
          ]} />
        <Pillar icon={Globe2} tag="RESIDENCY" title="Data sovereignty"
          bullets={[
            "Region pinned at provisioning (EU-Central-1 or US-East-1)",
            "Embeddings, prompts and LLM outputs stay in-region",
            "Providers without regional guarantees are disqualified",
            "Cross-region transfers require signed data-processing addendum",
          ]} />
        <Pillar icon={FileCheck} tag="COMPLIANCE" title="Framework alignment"
          bullets={[
            "GDPR — lawful basis per data category, DPIA shipped",
            "SOC 2 Type I on track for Q4 2026 (Prescient)",
            "ISO 27001 controls mapped, gap analysis complete",
            "Tenant-initiated deletion within 24 hours, signed receipt",
          ]} />
      </div>

      {/* Controls grid */}
      <section className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Technical controls</h2>
          <span className="font-mono-tech text-[10.5px] text-muted-foreground">18 controls · v1.0</span>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {controls.map((c) => (
            <div key={c.name} className="flex items-start gap-3 rounded-md border border-border bg-panel/50 p-3">
              <c.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="text-[13px] font-medium">{c.name}</div>
                <div className="mt-0.5 text-[11.5px] text-muted-foreground">{c.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Honest disclosure */}
      <section className="mt-8 rounded-lg border border-medium/40 bg-gradient-to-r from-medium/15 to-transparent p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-medium/20 text-medium">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-medium">Honest disclosure</div>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">
              This is the v1 demo build. Live LLM calls, real vector DB, real auth and encryption
              land in Phase 2. This page documents the target posture we are building toward and
              measures against on every release.
            </p>
          </div>
        </div>
      </section>
    </DocShell>
  );
}

const controls = [
  { icon: Server,    name: "Tenant isolation",       detail: "Postgres row-level security; every query tenant-scoped at the DB layer" },
  { icon: KeyRound,  name: "Secret management",      detail: "KMS-backed vault; zero plaintext credentials in build artifacts" },
  { icon: FileCheck, name: "Immutable audit log",    detail: "Every admin action & AI decision written to an append-only store" },
  { icon: Shield,    name: "PII redaction in prompts", detail: "Regex & NER-based scrubbing before any LLM call" },
  { icon: GitBranch, name: "Supply-chain scanning",  detail: "Snyk + GitHub Advanced Security on every PR, weekly dep bumps" },
  { icon: Lock,      name: "Backup encryption",      detail: "Backups sealed with tenant DEK; restore rehearsed monthly" },
  { icon: Globe2,    name: "Egress allow-list",      detail: "Worker egress restricted to declared destinations only" },
  { icon: Eye,       name: "Anomaly on ourselves",   detail: "SecureAI monitors its own control-plane with the same detector agents" },
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
  bullets: string[];
}) {
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
          <li key={b} className="flex items-start gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span className="text-foreground/85">{b}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
