import { ClientOnly, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Loader2, RefreshCw, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/severity";
import { workspaceOptions } from "@/lib/workspace";
import { deriveHosts, type EventRow } from "@/lib/workspace-model";

export function LocalTime({ value }: { value: string | null | undefined }) {
  if (!value) return <span>—</span>;
  return <ClientOnly fallback={<span>…</span>}><time dateTime={value}>{new Date(value).toLocaleString()}</time></ClientOnly>;
}
export function ConsoleLoading() {
  return <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground" role="status"><Loader2 className="h-4 w-4 animate-spin" />Loading workspace data…</div>;
}
export function ConsoleError({ error }: { error: Error }) {
  const router = useRouter();
  return <div className="space-y-3 p-8" role="alert"><h1 className="text-lg font-semibold">Workspace data unavailable</h1><p className="break-words text-sm text-critical">{error.message}</p><Button variant="outline" onClick={() => router.invalidate()}><RefreshCw />Try again</Button></div>;
}
export function ConsoleNotFound() { return <div className="p-8 text-muted-foreground">The requested workspace record was not found.</div>; }
export function WorkspaceEmpty() {
  return <div className="space-y-2 border-y border-border py-10 text-center"><Server className="mx-auto h-7 w-7 text-muted-foreground" /><h2 className="font-semibold">No logs have been received yet</h2><p className="text-sm text-muted-foreground">Incidents appear once a collector sends data.</p></div>;
}
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="min-w-0 border-t border-border pt-5"><h2 className="mb-3 text-sm font-semibold">{title}</h2>{children}</section>;
}
export function WorkspaceUpdated() {
  const { data, error, isFetching, refetch } = useSuspenseQuery(workspaceOptions());
  return <div className="space-y-1 text-[11px] font-mono-tech text-muted-foreground"><div className="flex flex-wrap items-center gap-2"><span>Last updated: <LocalTime value={data.fetchedAt} /></span><Button variant="ghost" size="icon" title="Refresh workspace data" aria-label="Refresh workspace data" disabled={isFetching} onClick={() => refetch()}><RefreshCw className={isFetching ? "animate-spin" : ""} /></Button></div>{error && <p className="text-critical" role="alert">Refresh failed: {error.message}. Showing the last successful read.</p>}</div>;
}
const cell = "whitespace-nowrap px-3 py-2 text-left";
export function EventsTable({ events }: { events: EventRow[] }) {
  if (!events.length) return <p className="py-4 text-sm text-muted-foreground">No events available.</p>;
  return <div className="overflow-x-auto rounded-md border border-border"><table className="w-full text-[12px]"><thead className="bg-panel text-[10px] uppercase text-muted-foreground"><tr>{["Time", "Host", "Platform", "Action", "Outcome", "User", "Source IP", "Service"].map((label) => <th key={label} className={cell}>{label}</th>)}</tr></thead><tbody className="divide-y divide-border">{events.map((event) => <tr key={event.event_id} className="hover:bg-accent/40"><td className={`${cell} font-mono-tech text-muted-foreground`}><LocalTime value={event.observed_at} /></td>{[event.host, event.platform, event.action, event.outcome, event.actor_username, event.source_ip, event.source_service].map((value, i) => <td key={i} className={`${cell} font-mono-tech`}>{value ?? "—"}</td>)}</tr>)}</tbody></table></div>;
}
export function HostsContent({ title }: { title: string }) {
  const { data } = useSuspenseQuery(workspaceOptions());
  const hosts = deriveHosts(data.events, Date.parse(data.fetchedAt));
  return <div className="mx-auto max-w-7xl space-y-5 p-4 md:p-6"><header><h1 className="text-2xl font-semibold">{title}</h1><WorkspaceUpdated /></header>{!data.events.length && !data.incidents.length && !data.verdicts.length ? <WorkspaceEmpty /> : <><div className="grid grid-cols-3 gap-3">{[["Hosts", hosts.length], ["Reporting", hosts.filter((host) => host.status === "reporting").length], ["Silent", hosts.filter((host) => host.status === "silent").length]].map(([label, value]) => <div key={label} className="rounded-md border border-border bg-panel p-3"><div className="text-[11px] text-muted-foreground">{label}</div><div className="mt-1 font-mono-tech text-2xl">{value}</div></div>)}</div><Section title="Hosts & collector status">{!hosts.length ? <p className="text-sm text-muted-foreground">No host names are present in the received events.</p> : <div className="overflow-x-auto rounded-md border border-border"><table className="w-full text-[12px]"><thead className="bg-panel text-[10px] uppercase text-muted-foreground"><tr>{["Host", "Platform", "Event count", "Last seen", "Collector status"].map((label) => <th className={cell} key={label}>{label}</th>)}</tr></thead><tbody className="divide-y divide-border">{hosts.map((host) => <tr key={host.host}><td className={`${cell} font-mono-tech`}>{host.host}</td><td className={cell}>{host.platform || "—"}</td><td className={`${cell} font-mono-tech`}>{host.count.toLocaleString()}</td><td className={`${cell} font-mono-tech`}><LocalTime value={host.lastSeen} /></td><td className={cell}><StatusPill status={host.status} /></td></tr>)}</tbody></table></div>}</Section></>}</div>;
}