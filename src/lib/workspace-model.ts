export type Severity = "critical" | "high" | "medium" | "low";
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };
export interface Incident {
  incident_key: string; signal_id: string | null; severity: Severity;
  status: "investigating" | "review_required"; classification: string | null;
  confidence_percent: number | null; false_positive_status: string | null; subject: string | null;
  source_ip: string | null; summary: string | null; recommended_action: string | null;
  evidence_event_ids: string[] | null; rag_context: JsonObject | null;
  investigation: JsonObject | null; created_at: string;
}
export interface EventRow {
  event_id: string; observed_at: string; host: string | null; platform: "linux" | "windows" | null;
  category: string | null; action: string | null; outcome: string | null;
  actor_username: string | null; source_ip: string | null; source_service: string | null;
  payload: JsonObject | null; received_at: string;
}
export interface Verdict { id: string; target_id: string; details: JsonObject | null; created_at: string }
export interface Workspace {
  incidents: Incident[]; events: EventRow[]; verdicts: Verdict[];
  counts: { active: number; events24h: number; incidents24h: number; verdicts24h: number };
  fetchedAt: string;
}
export function object(value: JsonValue | undefined): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
export function stage(incident: Incident, key: string) { return object(incident.investigation?.[key]); }
export function text(value: JsonValue | undefined): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}
export function incidentTitle(incident: Incident) {
  const threat = stage(incident, "stage2").threat_type;
  return [threat && text(threat), incident.subject].filter(Boolean).join(" - ") || incident.incident_key;
}
export function recommendedActions(incident: Incident): string[] {
  const raw = incident.recommended_action?.split(",").map((v) => v.trim()).filter(Boolean);
  if (raw?.length) return raw;
  const actions = stage(incident, "stage2_review").recommended_actions ?? stage(incident, "stage2").recommended_actions;
  return Array.isArray(actions) ? actions.map(text) : [];
}
export function metrics(counts: Workspace["counts"]) {
  const groups = counts.incidents24h + counts.verdicts24h;
  return { ...counts, groups, clearedShare: groups ? counts.verdicts24h / groups * 100 : 0 };
}
export function collectorStatus(lastSeen: string, now: number) {
  return now - Date.parse(lastSeen) < 10 * 60 * 1000 ? "reporting" : "silent";
}
export function deriveHosts(events: EventRow[], now: number) {
  const map = new Map<string, { host: string; platforms: Set<string>; count: number; lastSeen: string }>();
  for (const event of events) {
    if (!event.host) continue;
    const host = map.get(event.host) ?? { host: event.host, platforms: new Set<string>(), count: 0, lastSeen: event.observed_at };
    host.count++;
    if (event.platform) host.platforms.add(event.platform);
    if (Date.parse(event.observed_at) > Date.parse(host.lastSeen)) host.lastSeen = event.observed_at;
    map.set(event.host, host);
  }
  return [...map.values()].map((host) => ({ ...host, platform: [...host.platforms].join(", "), status: collectorStatus(host.lastSeen, now) }))
    .sort((a, b) => Date.parse(b.lastSeen) - Date.parse(a.lastSeen));
}
export function auditDecisions(incidents: Incident[], verdicts: Verdict[]) {
  return [
    ...incidents.map((inc) => ({ key: `incident:${inc.incident_key}`, target: inc.incident_key, decision: "incident", time: inc.created_at,
      reason: text(stage(inc, "stage2_review").summary ?? stage(inc, "stage2").reasoning ?? inc.summary) })),
    ...verdicts.map((verdict) => ({ key: `verdict:${verdict.id}`, target: verdict.target_id, decision: text(verdict.details?.status), time: verdict.created_at, reason: text(verdict.details?.reason) })),
  ].sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
}
export function severityBuckets(incidents: Incident[], now: number) {
  const end = Math.floor(now / 3600000) * 3600000;
  const buckets = Array.from({ length: 25 }, (_, i) => ({ time: end - (24 - i) * 3600000, critical: 0, high: 0, medium: 0, low: 0 }));
  for (const inc of incidents) {
    const time = Date.parse(inc.created_at);
    if (time < now - 86400000 || time > now) continue;
    const bucket = buckets.find((b) => b.time === Math.floor(time / 3600000) * 3600000);
    if (bucket && inc.severity in bucket) bucket[inc.severity]++;
  }
  return buckets;
}