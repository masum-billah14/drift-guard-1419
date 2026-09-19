import { createFileRoute } from "@tanstack/react-router";
import { DocShell } from "@/components/doc-shell";
import { FileCheck2, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit report — DriftGuard" },
      { name: "description", content: "One-click security, privacy, and governance audit." },
    ],
  }),
  component: AuditPage,
});

const sections = [
  {
    name: "Security posture",
    items: [
      ["Encryption at rest (AES-256-GCM)", "pass"],
      ["Encryption in transit (TLS 1.3)", "pass"],
      ["MFA enforced for admins", "pass"],
      ["Secrets stored in KMS-backed vault", "pass"],
      ["Vulnerability scans in CI", "pass"],
    ],
  },
  {
    name: "Privacy",
    items: [
      ["PII hashed at ingest", "pass"],
      ["Tenant-initiated deletion ≤ 24h", "pass"],
      ["Data sovereignty (region pinning)", "pass"],
      ["DPIA documented per data category", "warn"],
    ],
  },
  {
    name: "Governance",
    items: [
      ["Every agent action audit-logged", "pass"],
      ["Human approval required for irreversible actions", "pass"],
      ["Model provider region-pinned", "pass"],
      ["SOC 2 Type I certification", "warn"],
    ],
  },
  {
    name: "Risk summary",
    items: [
      ["No unresolved criticals older than 24h", "pass"],
      ["No admins without MFA", "pass"],
      ["No integrations with expired credentials", "pass"],
    ],
  },
] as const;

function AuditPage() {
  const [generated, setGenerated] = useState(false);
  return (
    <DocShell
      title="Audit report"
      subtitle="One click. Generates a shareable security, privacy, and governance report."
    >
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-panel p-5">
        <FileCheck2 className="h-5 w-5 text-primary" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">DriftGuard compliance report</div>
          <div className="text-[11px] font-mono-tech text-muted-foreground">
            tenant: acme-prod · scope: last 90 days · format: PDF
          </div>
        </div>
        <button
          onClick={() => setGenerated(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Download className="h-4 w-4" /> {generated ? "Regenerate report" : "Generate report"}
        </button>
      </div>

      {generated && (
        <div className="mt-6 space-y-5">
          {sections.map((s) => (
            <section key={s.name} className="rounded-lg border border-border bg-panel p-5">
              <h2 className="text-sm font-semibold">{s.name}</h2>
              <ul className="mt-3 divide-y divide-border overflow-hidden rounded-md border border-border">
                {s.items.map(([label, status]) => (
                  <li key={label} className="flex items-center gap-3 bg-background px-3 py-2 text-[13px]">
                    {status === "pass" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-ok" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-medium" />
                    )}
                    <span className="min-w-0 flex-1">{label}</span>
                    <span
                      className={`rounded-sm px-1.5 py-0.5 font-mono-tech text-[10px] uppercase ring-1 ring-inset ${
                        status === "pass"
                          ? "bg-ok/10 text-ok ring-ok/30"
                          : "bg-medium/10 text-medium ring-medium/30"
                      }`}
                    >
                      {status === "pass" ? "PASS" : "REVIEW"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </DocShell>
  );
}
