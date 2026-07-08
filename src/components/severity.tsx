import type { Severity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const sevMap: Record<Severity | "info", { label: string; bg: string; text: string; ring: string; dot: string }> = {
  critical: { label: "CRITICAL", bg: "bg-critical/15", text: "text-critical", ring: "ring-critical/40", dot: "bg-critical" },
  high: { label: "HIGH", bg: "bg-high/15", text: "text-high", ring: "ring-high/40", dot: "bg-high" },
  medium: { label: "MEDIUM", bg: "bg-medium/15", text: "text-medium", ring: "ring-medium/40", dot: "bg-medium" },
  low: { label: "LOW", bg: "bg-low/15", text: "text-low", ring: "ring-low/40", dot: "bg-low" },
  info: { label: "INFO", bg: "bg-muted", text: "text-muted-foreground", ring: "ring-border", dot: "bg-muted-foreground" },
};

export function SeverityBadge({ severity, className }: { severity: Severity | "info"; className?: string }) {
  const s = sevMap[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wider ring-1 ring-inset font-mono-tech",
        s.bg,
        s.text,
        s.ring,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function SeverityDot({ severity, pulse }: { severity: Severity | "info"; pulse?: boolean }) {
  const s = sevMap[severity];
  return (
    <span className="relative inline-flex h-2 w-2">
      {pulse && severity === "critical" && (
        <span className={cn("absolute inset-0 rounded-full opacity-70 animate-ping", s.dot)} />
      )}
      <span className={cn("relative h-2 w-2 rounded-full", s.dot)} />
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-critical/10 text-critical ring-critical/30",
    investigating: "bg-high/10 text-high ring-high/30",
    resolved: "bg-ok/10 text-ok ring-ok/30",
    contained: "bg-ok/10 text-ok ring-ok/30",
    "auto-mitigated": "bg-low/10 text-low ring-low/30",
    "auto-resolved": "bg-ok/10 text-ok ring-ok/30",
    pending: "bg-medium/10 text-medium ring-medium/30",
    escalated: "bg-critical/10 text-critical ring-critical/30",
    active: "bg-ok/10 text-ok ring-ok/30",
    idle: "bg-muted text-muted-foreground ring-border",
    degraded: "bg-high/10 text-high ring-high/30",
    invited: "bg-low/10 text-low ring-low/30",
    suspended: "bg-muted text-muted-foreground ring-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ring-inset font-mono-tech",
        map[status] ?? "bg-muted text-muted-foreground ring-border",
      )}
    >
      {status}
    </span>
  );
}
