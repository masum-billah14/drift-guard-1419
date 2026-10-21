import type { Severity } from "@/lib/workspace-model";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

const sevTone: Record<Severity | "info", { bg: string; text: string; ring: string; dot: string }> = {
  critical: { bg: "bg-critical/15", text: "text-critical", ring: "ring-critical/40", dot: "bg-critical" },
  high: { bg: "bg-high/15", text: "text-high", ring: "ring-high/40", dot: "bg-high" },
  medium: { bg: "bg-medium/15", text: "text-medium", ring: "ring-medium/40", dot: "bg-medium" },
  low: { bg: "bg-low/15", text: "text-low", ring: "ring-low/40", dot: "bg-low" },
  info: { bg: "bg-muted", text: "text-muted-foreground", ring: "ring-border", dot: "bg-muted-foreground" },
};

const sevLabel: Record<Severity | "info", [string, string]> = {
  critical: ["CRITICAL", "সংকটাপন্ন"],
  high: ["HIGH", "উচ্চ"],
  medium: ["MEDIUM", "মধ্যম"],
  low: ["LOW", "নিম্ন"],
  info: ["INFO", "তথ্য"],
};

export function SeverityBadge({ severity, className }: { severity: Severity | "info"; className?: string }) {
  const { bi } = useLang();
  const s = sevTone[severity];
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
      {bi(sevLabel[severity][0], sevLabel[severity][1])}
    </span>
  );
}

export function SeverityDot({ severity, pulse }: { severity: Severity | "info"; pulse?: boolean }) {
  const s = sevTone[severity];
  return (
    <span className="relative inline-flex h-2 w-2">
      {pulse && severity === "critical" && (
        <span className={cn("absolute inset-0 rounded-full opacity-70 animate-ping", s.dot)} />
      )}
      <span className={cn("relative h-2 w-2 rounded-full", s.dot)} />
    </span>
  );
}

const statusLabel: Record<string, [string, string]> = {
  open: ["open", "খোলা"],
  investigating: ["investigating", "তদন্তাধীন"],
  review_required: ["review required", "পর্যালোচনা প্রয়োজন"],
  reporting: ["reporting", "রিপোর্ট করছে"],
  silent: ["silent", "নীরব"],
  resolved: ["resolved", "সমাধান হয়েছে"],
  contained: ["contained", "নিয়ন্ত্রিত"],
  "auto-mitigated": ["auto-mitigated", "স্বয়ংক্রিয় প্রশমিত"],
  "auto-resolved": ["auto-resolved", "স্বয়ংক্রিয় সমাধান"],
  pending: ["pending", "অপেক্ষমাণ"],
  escalated: ["escalated", "এস্কেলেট করা"],
  active: ["active", "সক্রিয়"],
  idle: ["idle", "নিষ্ক্রিয়"],
  degraded: ["degraded", "অবনত"],
  invited: ["invited", "আমন্ত্রিত"],
  suspended: ["suspended", "স্থগিত"],
};

const statusTone: Record<string, string> = {
  open: "bg-critical/10 text-critical ring-critical/30",
  investigating: "bg-high/10 text-high ring-high/30",
  review_required: "bg-medium/10 text-medium ring-medium/30",
  reporting: "bg-ok/10 text-ok ring-ok/30",
  silent: "bg-muted text-muted-foreground ring-border",
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

export function StatusPill({ status }: { status: string }) {
  const { bi } = useLang();
  const label = statusLabel[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ring-inset font-mono-tech",
        statusTone[status] ?? "bg-muted text-muted-foreground ring-border",
      )}
    >
      {label ? bi(label[0], label[1]) : status}
    </span>
  );
}
