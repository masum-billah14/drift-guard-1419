import { queryOptions } from "@tanstack/react-query";
import { createReadClient } from "@/lib/supabase";
import type { Incident, EventRow, Verdict, Workspace } from "@/lib/workspace-model";

type View = "dg_incidents" | "dg_events" | "dg_verdicts";
const columns = {
  dg_incidents: "incident_key,signal_id,severity,status,classification,confidence_percent,false_positive_status,subject,source_ip,summary,recommended_action,evidence_event_ids,rag_context,investigation,created_at",
  dg_events: "event_id,observed_at,host,platform,category,action,outcome,actor_username,source_ip,source_service,payload,received_at",
  dg_verdicts: "id,target_id,details,created_at",
};
// Fetch through every page: Supabase's row cap must not silently truncate totals.
export async function readRows<T>(view: View, signal?: AbortSignal, ids?: string[]): Promise<T[]> {
  const client = createReadClient();
  const rows: T[] = [];
  let offset = 0;
  while (true) {
    let query = client.from(view).select(columns[view]).order(view === "dg_events" ? "observed_at" : "created_at", { ascending: false })
      .order(view === "dg_events" ? "event_id" : view === "dg_incidents" ? "incident_key" : "id", { ascending: false }).range(offset, offset + 499);
    if (ids) query = query.in("event_id", ids);
    if (signal) query = query.abortSignal(signal);
    const { data, error } = await query;
    if (error) throw new Error(`Could not read ${view}: ${error.message}`);
    const page = (data ?? []) as unknown as T[];
    rows.push(...page);
    if (page.length === 0) break;
    offset += page.length;
  }
  return rows;
}
async function count(view: View, since?: string, active = false, signal?: AbortSignal) {
  let query = createReadClient().from(view).select("*", { count: "exact", head: true });
  if (since) query = query.gte(view === "dg_events" ? "observed_at" : "created_at", since);
  if (active) query = query.in("status", ["investigating", "review_required"]);
  if (signal) query = query.abortSignal(signal);
  const { count, error } = await query;
  if (error) throw new Error(`Could not count ${view}: ${error.message}`);
  return count ?? 0;
}
export async function loadWorkspace(signal?: AbortSignal): Promise<Workspace> {
  const since = new Date(Date.now() - 86400000).toISOString();
  const [incidents, events, verdicts, active, events24h, incidents24h, verdicts24h] = await Promise.all([
    readRows<Incident>("dg_incidents", signal), readRows<EventRow>("dg_events", signal), readRows<Verdict>("dg_verdicts", signal),
    count("dg_incidents", undefined, true, signal), count("dg_events", since, false, signal),
    count("dg_incidents", since, false, signal), count("dg_verdicts", since, false, signal),
  ]);
  return { incidents, events, verdicts, counts: { active, events24h, incidents24h, verdicts24h }, fetchedAt: new Date().toISOString() };
}
export const workspaceOptions = () => queryOptions({
  queryKey: ["workspace"], queryFn: ({ signal }) => loadWorkspace(signal), staleTime: 5000, refetchInterval: 10000,
});
export const evidenceOptions = (ids: string[]) => queryOptions({
  queryKey: ["evidence", ids], queryFn: async ({ signal }) => {
    const rows: EventRow[] = [];
    for (let i = 0; i < ids.length; i += 100) rows.push(...await readRows<EventRow>("dg_events", signal, ids.slice(i, i + 100)));
    return rows;
  }, refetchInterval: 10000,
});