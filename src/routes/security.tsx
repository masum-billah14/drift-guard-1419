import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";
import { Lock, Globe2, KeyRound, FileCheck } from "lucide-react";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & Compliance — SecureAI" },
      { name: "description", content: "Auth, encryption, sovereignty and compliance posture." },
      { property: "og:title", content: "SecureAI Security posture" },
      { property: "og:description", content: "Auth, encryption at rest/in transit, GDPR-aligned data sovereignty." },
    ],
  }),
  component: () => (
    <DocShell
      title="Security posture"
      subtitle="Designed for teams that have to answer these questions in every vendor review."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card icon={KeyRound} title="Authentication">
          SSO via SAML 2.0 and OIDC (Okta, Azure AD, Google). MFA enforced for all admins.
          Session tokens are short-lived (15 min) with refresh rotation. API access via scoped
          personal access tokens.
        </Card>
        <Card icon={Lock} title="Encryption">
          TLS 1.3 in transit. AES-256-GCM at rest for object storage and Postgres. Per-tenant
          data-encryption keys wrapped by a KMS-managed master key. Key rotation every 90 days.
        </Card>
        <Card icon={Globe2} title="Data sovereignty">
          Tenants choose their region at provisioning (EU or US). Data — including embeddings
          and LLM inputs — never leaves the chosen region. LLM providers are region-pinned;
          providers without regional guarantees are not used.
        </Card>
        <Card icon={FileCheck} title="Compliance">
          Designed with GDPR-aligned principles: lawful basis documented per data category,
          DPIA template shipped, tenant-initiated deletion within 24h. SOC 2 Type I planned
          for Q4 2026.
        </Card>
      </div>

      <section className="mt-8 rounded-lg border border-border bg-panel p-5">
        <h2 className="text-sm font-semibold">Detailed controls</h2>
        <ul className="mt-3 space-y-2 text-[13px]">
          <li>· Row-level security in Postgres; every query is tenant-scoped.</li>
          <li>· Secrets stored in a KMS-backed vault; no plaintext env credentials in build artifacts.</li>
          <li>· All admin actions are audit-logged and exposed in the audit report.</li>
          <li>· LLM prompts are logged with redaction for known PII patterns.</li>
          <li>· Vulnerability scans in CI (Snyk / GitHub Advanced Security); dependency updates weekly.</li>
          <li>· Backups encrypted with tenant DEK; restore rehearsed monthly.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-lg border border-medium/40 bg-medium/10 p-4 text-[12.5px]">
        <span className="font-semibold text-medium">Honest disclosure —</span>{" "}
        This is the v1 demo build. Live LLM calls, real vector DB, real auth and encryption are
        planned for Phase 2. This page documents the target posture we're building toward.
      </section>
    </DocShell>
  ),
});

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">{children}</p>
    </div>
  );
}
