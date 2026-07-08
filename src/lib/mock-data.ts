export type Severity = "critical" | "high" | "medium" | "low";
export type EventStatus = "open" | "investigating" | "resolved" | "auto-mitigated";

export interface SecurityEvent {
  id: string;
  timestamp: string; // ISO
  source_ip: string;
  source: string;
  event_type: string;
  risk_score: number; // 0-100
  severity: Severity;
  status: EventStatus;
  user?: string;
  location?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: "open" | "investigating" | "contained" | "resolved";
  opened_at: string;
  source_ip: string;
  affected_asset: string;
  ai_confidence: number;
  ai_reasoning: string;
  similar_incidents: Array<{ id: string; title: string; similarity: number; resolved: string }>;
  recommended_action: string;
  action_status: "pending" | "auto-resolved" | "escalated";
  timeline: Array<{ ts: string; actor: string; note: string }>;
}

export interface Agent {
  name: string;
  role: "Detector" | "Investigator" | "Responder";
  status: "active" | "idle" | "degraded";
  last_action: string;
  actions_today: number;
}

export interface AgentActivity {
  id: string;
  ts: string;
  agent: string;
  message: string;
  severity: Severity | "info";
}

export interface Kpis {
  active_threats: number;
  events_24h: number;
  mttd_seconds: number;
  mttr_seconds: number;
  false_positive_rate: number;
  auto_resolved_pct: number;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Analyst" | "Viewer";
  last_active: string;
  status: "active" | "invited" | "suspended";
}

const IPS = [
  "10.0.14.22",
  "192.168.4.117",
  "41.203.88.14",
  "185.220.101.47",
  "172.16.0.5",
  "89.248.171.23",
  "203.0.113.42",
  "104.28.14.9",
  "45.83.65.121",
  "10.0.14.88",
];

const SOURCES = ["auth-service", "edge-firewall", "prod-db-01", "api-gateway", "vpn-concentrator", "s3-billing", "k8s-cluster"];

const EVENT_TYPES = [
  "Failed login burst",
  "Successful login",
  "Impossible travel",
  "Privilege escalation attempt",
  "Anomalous S3 download",
  "Port scan detected",
  "Unusual outbound traffic",
  "MFA bypass attempt",
  "New device sign-in",
  "SQL injection pattern",
  "DNS tunneling suspected",
  "Config change",
];

const USERS = ["a.morales", "j.chen", "priya.k", "s.okafor", "t.rivera", "root", "svc-billing", "l.dubois"];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function severityFromScore(score: number): Severity {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}

// Deterministic pseudo-random so SSR/CSR match
function prng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const NOW = new Date("2026-07-08T14:32:00Z").getTime();

export const events: SecurityEvent[] = (() => {
  const rand = prng(42);
  const list: SecurityEvent[] = [];
  for (let i = 0; i < 42; i++) {
    const r = rand();
    // Bias toward lower risk so anomalies stand out
    const risk = Math.floor(
      i % 7 === 0 ? 70 + r * 30 : i % 3 === 0 ? 40 + r * 30 : r * 45,
    );
    const sev = severityFromScore(risk);
    const ts = new Date(NOW - i * 1000 * 60 * (3 + Math.floor(r * 12))).toISOString();
    const statusPool: EventStatus[] =
      sev === "critical"
        ? ["open", "investigating", "auto-mitigated"]
        : sev === "high"
          ? ["open", "investigating", "resolved", "auto-mitigated"]
          : ["resolved", "resolved", "auto-mitigated", "open"];
    list.push({
      id: `EVT-${(10450 - i).toString().padStart(5, "0")}`,
      timestamp: ts,
      source_ip: pick(IPS, i * 3 + Math.floor(r * 10)),
      source: pick(SOURCES, i + Math.floor(r * 5)),
      event_type: pick(EVENT_TYPES, i + 1),
      risk_score: risk,
      severity: sev,
      status: pick(statusPool, i),
      user: pick(USERS, i * 2 + Math.floor(r * 3)),
      location: pick(["Cape Town, ZA", "Frankfurt, DE", "Ashburn, US", "Singapore, SG", "Unknown"], i),
    });
  }
  return list;
})();

export const incidents: Incident[] = [
  {
    id: "INC-2041",
    title: "Impossible travel: analyst account logged in from Frankfurt then Lagos in 4 minutes",
    severity: "critical",
    status: "investigating",
    opened_at: new Date(NOW - 1000 * 60 * 18).toISOString(),
    source_ip: "41.203.88.14",
    affected_asset: "auth-service / user:a.morales",
    ai_confidence: 0.94,
    ai_reasoning:
      "Two successful logins for a.morales occurred 4 min 12 s apart from geo-locations 5,200 km apart. The second login came from an ASN never previously seen for this user and matched a Tor exit node in our threat-intel feed. Baseline for this user shows 100% of logins in the last 90 days from Frankfurt IPs on ASN 3320.",
    similar_incidents: [
      { id: "INC-1877", title: "Impossible travel — svc-billing", similarity: 0.91, resolved: "Confirmed credential stuffing" },
      { id: "INC-1602", title: "Tor exit login — j.chen", similarity: 0.83, resolved: "Session revoked, MFA reset" },
      { id: "INC-1421", title: "New-country login — priya.k", similarity: 0.72, resolved: "False positive (travel)" },
    ],
    recommended_action: "Revoke active session, force MFA re-enrollment, block source IP for 24h.",
    action_status: "pending",
    timeline: [
      { ts: new Date(NOW - 1000 * 60 * 18).toISOString(), actor: "Detector Agent", note: "Anomaly flagged (confidence 0.94)" },
      { ts: new Date(NOW - 1000 * 60 * 17).toISOString(), actor: "Investigator Agent", note: "Correlated with 3 similar past incidents" },
      { ts: new Date(NOW - 1000 * 60 * 16).toISOString(), actor: "Investigator Agent", note: "Enriched with threat intel (Tor exit node)" },
      { ts: new Date(NOW - 1000 * 60 * 15).toISOString(), actor: "Responder Agent", note: "Awaiting human approval for session revoke" },
    ],
  },
  {
    id: "INC-2039",
    title: "Anomalous S3 download volume from svc-billing (17.4 GB in 6 min)",
    severity: "high",
    status: "open",
    opened_at: new Date(NOW - 1000 * 60 * 41).toISOString(),
    source_ip: "10.0.14.88",
    affected_asset: "s3-billing / bucket:invoices-prod",
    ai_confidence: 0.87,
    ai_reasoning:
      "svc-billing pulled 17.4 GB in 6 minutes; its 30-day p99 is 240 MB. Object access pattern is sequential across the invoices-prod bucket which is atypical for the billing pipeline (which reads by tenant_id).",
    similar_incidents: [
      { id: "INC-1988", title: "Bulk S3 read — data-export", similarity: 0.79, resolved: "Confirmed backup job (allowlisted)" },
    ],
    recommended_action: "Rotate svc-billing credentials, snapshot bucket access logs, page on-call.",
    action_status: "pending",
    timeline: [
      { ts: new Date(NOW - 1000 * 60 * 41).toISOString(), actor: "Detector Agent", note: "Volume anomaly (z-score 8.2)" },
      { ts: new Date(NOW - 1000 * 60 * 40).toISOString(), actor: "Investigator Agent", note: "Access pattern differs from baseline" },
    ],
  },
  {
    id: "INC-2036",
    title: "Failed login burst against VPN concentrator (312 attempts, 14 accounts)",
    severity: "high",
    status: "contained",
    opened_at: new Date(NOW - 1000 * 60 * 92).toISOString(),
    source_ip: "185.220.101.47",
    affected_asset: "vpn-concentrator",
    ai_confidence: 0.98,
    ai_reasoning:
      "312 failed auth attempts in 90 s from a single IP against 14 valid usernames. Password spray pattern (one password per user, rotating). Source IP is a known Tor exit.",
    similar_incidents: [
      { id: "INC-1902", title: "Password spray — VPN", similarity: 0.95, resolved: "IP blocked, no compromise" },
      { id: "INC-1734", title: "Credential stuffing — SSO", similarity: 0.88, resolved: "IP blocked, MFA held" },
    ],
    recommended_action: "Block source IP (auto-applied), notify affected users.",
    action_status: "auto-resolved",
    timeline: [
      { ts: new Date(NOW - 1000 * 60 * 92).toISOString(), actor: "Detector Agent", note: "Burst detected" },
      { ts: new Date(NOW - 1000 * 60 * 92).toISOString(), actor: "Responder Agent", note: "Auto-blocked 185.220.101.47 (policy: brute-force)" },
      { ts: new Date(NOW - 1000 * 60 * 90).toISOString(), actor: "Investigator Agent", note: "Confirmed no successful auth; incident contained" },
    ],
  },
  {
    id: "INC-2032",
    title: "Privilege escalation attempt on prod-db-01",
    severity: "critical",
    status: "resolved",
    opened_at: new Date(NOW - 1000 * 60 * 60 * 5).toISOString(),
    source_ip: "10.0.14.22",
    affected_asset: "prod-db-01",
    ai_confidence: 0.89,
    ai_reasoning:
      "User t.rivera attempted GRANT ALL on schema public — action outside their role's historical behavior. Query issued from a workstation, not a jump host.",
    similar_incidents: [
      { id: "INC-1554", title: "GRANT anomaly — analyst", similarity: 0.86, resolved: "Legitimate migration, approved retroactively" },
    ],
    recommended_action: "Revoke session, require approval for schema-level GRANTs.",
    action_status: "escalated",
    timeline: [
      { ts: new Date(NOW - 1000 * 60 * 60 * 5).toISOString(), actor: "Detector Agent", note: "Behavior anomaly" },
      { ts: new Date(NOW - 1000 * 60 * 60 * 5 + 60000).toISOString(), actor: "Investigator Agent", note: "Cross-checked with change-management" },
      { ts: new Date(NOW - 1000 * 60 * 60 * 4).toISOString(), actor: "Human (s.okafor)", note: "Approved — planned migration window" },
    ],
  },
  {
    id: "INC-2028",
    title: "DNS tunneling suspected from k8s-cluster egress",
    severity: "medium",
    status: "investigating",
    opened_at: new Date(NOW - 1000 * 60 * 60 * 8).toISOString(),
    source_ip: "172.16.0.5",
    affected_asset: "k8s-cluster",
    ai_confidence: 0.71,
    ai_reasoning:
      "High-entropy DNS queries to a low-reputation domain (avg 22 chars, entropy 4.1). Volume is low but sustained (every 45 s).",
    similar_incidents: [
      { id: "INC-1201", title: "DNS beaconing — dev cluster", similarity: 0.77, resolved: "Malicious sidecar removed" },
    ],
    recommended_action: "Isolate suspect pod, capture PCAP, review image provenance.",
    action_status: "pending",
    timeline: [
      { ts: new Date(NOW - 1000 * 60 * 60 * 8).toISOString(), actor: "Detector Agent", note: "Entropy-based anomaly" },
    ],
  },
];

export const agents: Agent[] = [
  { name: "Sentinel-D1", role: "Detector", status: "active", last_action: "Flagged INC-2041 (impossible travel)", actions_today: 214 },
  { name: "Sentinel-D2", role: "Detector", status: "active", last_action: "Baseline updated for auth-service", actions_today: 189 },
  { name: "Insight-I1", role: "Investigator", status: "active", last_action: "Correlated 3 similar incidents for INC-2041", actions_today: 87 },
  { name: "Insight-I2", role: "Investigator", status: "idle", last_action: "Closed lookup batch #4471", actions_today: 62 },
  { name: "Guardian-R1", role: "Responder", status: "active", last_action: "Auto-blocked 185.220.101.47", actions_today: 24 },
  { name: "Guardian-R2", role: "Responder", status: "degraded", last_action: "Retrying webhook to PagerDuty", actions_today: 11 },
];

export const agentActivity: AgentActivity[] = [
  { id: "a1", ts: new Date(NOW - 1000 * 30).toISOString(), agent: "Sentinel-D1", message: "Flagged login from unusual IP for a.morales — confidence 94%", severity: "critical" },
  { id: "a2", ts: new Date(NOW - 1000 * 62).toISOString(), agent: "Insight-I1", message: "Retrieved 3 similar past incidents from vector store (avg similarity 0.82)", severity: "info" },
  { id: "a3", ts: new Date(NOW - 1000 * 95).toISOString(), agent: "Guardian-R1", message: "Auto-blocked 185.220.101.47 (policy: brute-force, 24h)", severity: "high" },
  { id: "a4", ts: new Date(NOW - 1000 * 180).toISOString(), agent: "Sentinel-D2", message: "Baseline updated: auth-service p99 = 240ms", severity: "info" },
  { id: "a5", ts: new Date(NOW - 1000 * 240).toISOString(), agent: "Insight-I2", message: "S3 access pattern deviation for svc-billing (z=8.2)", severity: "high" },
  { id: "a6", ts: new Date(NOW - 1000 * 320).toISOString(), agent: "Sentinel-D1", message: "12 events processed — no anomalies", severity: "low" },
  { id: "a7", ts: new Date(NOW - 1000 * 410).toISOString(), agent: "Guardian-R2", message: "PagerDuty webhook retry #2 succeeded", severity: "info" },
  { id: "a8", ts: new Date(NOW - 1000 * 500).toISOString(), agent: "Insight-I1", message: "Enriched INC-2039 with threat-intel (no matches)", severity: "medium" },
];

export const kpis: Kpis = {
  active_threats: 4,
  events_24h: 18742,
  mttd_seconds: 47,
  mttr_seconds: 312,
  false_positive_rate: 0.038,
  auto_resolved_pct: 0.71,
};

export const usersRows: UserRow[] = [
  { id: "u1", name: "Amara Morales", email: "a.morales@acme.io", role: "Analyst", last_active: "2 min ago", status: "active" },
  { id: "u2", name: "Jian Chen", email: "j.chen@acme.io", role: "Admin", last_active: "12 min ago", status: "active" },
  { id: "u3", name: "Priya Kulkarni", email: "priya.k@acme.io", role: "Analyst", last_active: "1 h ago", status: "active" },
  { id: "u4", name: "Samuel Okafor", email: "s.okafor@acme.io", role: "Admin", last_active: "3 h ago", status: "active" },
  { id: "u5", name: "Tomás Rivera", email: "t.rivera@acme.io", role: "Analyst", last_active: "yesterday", status: "active" },
  { id: "u6", name: "Léa Dubois", email: "l.dubois@acme.io", role: "Viewer", last_active: "3 d ago", status: "invited" },
  { id: "u7", name: "Deprecated Service", email: "svc-old@acme.io", role: "Viewer", last_active: "30 d ago", status: "suspended" },
];

// Time series for severity chart (24h, hourly buckets)
export const severityTimeSeries = (() => {
  const rand = prng(7);
  const out: Array<{ hour: string; critical: number; high: number; medium: number; low: number }> = [];
  for (let h = 23; h >= 0; h--) {
    const d = new Date(NOW - h * 3600_000);
    const label = `${d.getUTCHours().toString().padStart(2, "0")}:00`;
    out.push({
      hour: label,
      critical: Math.max(0, Math.floor(rand() * 3) - (h > 20 ? 0 : 1)),
      high: Math.floor(rand() * 5) + (h < 6 ? 2 : 0),
      medium: Math.floor(rand() * 9) + 2,
      low: Math.floor(rand() * 18) + 5,
    });
  }
  return out;
})();

export function getIncident(id: string): Incident | undefined {
  return incidents.find((i) => i.id.toLowerCase() === id.toLowerCase());
}

export function formatRelative(iso: string): string {
  const diff = NOW - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function formatTs(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replace("T", " ").slice(0, 19) + "Z";
}
