import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { workspaceOptions } from "@/lib/workspace";
import { auditDecisions } from "@/lib/workspace-model";
import { consoleHead } from "@/lib/route-meta";
import { ConsoleError, ConsoleLoading, ConsoleNotFound, WorkspaceUpdated, WorkspaceEmpty, LocalTime } from "@/components/workspace-ui";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/audit")({
  head: () => consoleHead("Decision audit", "Recorded incident and cleared event-group decisions."),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceOptions()),
  pendingComponent: ConsoleLoading, errorComponent: ConsoleError, notFoundComponent: ConsoleNotFound, component: AuditPage,
});

function AuditPage() {
  const { bi } = useLang();
  const { data } = useSuspenseQuery(workspaceOptions());
  const decisions = auditDecisions(data.incidents, data.verdicts);
  const headers = [bi("Time", "সময়"), bi("Target", "লক্ষ্য"), bi("Decision", "সিদ্ধান্ত"), bi("Reason", "কারণ")];
  return <AppShell hideSidebar><div className="mx-auto max-w-6xl space-y-5 p-4 md:p-6"><header><h1 className="text-2xl font-semibold">{bi("Decision audit", "সিদ্ধান্ত অডিট")}</h1><WorkspaceUpdated /></header>{!data.events.length && !decisions.length ? <WorkspaceEmpty /> : !decisions.length ? <p className="text-sm text-muted-foreground">{bi("No analysis decisions recorded yet.", "এখনো কোনো বিশ্লেষণ সিদ্ধান্ত রেকর্ড হয়নি।")}</p> : <div className="overflow-x-auto rounded-md border border-border"><table className="w-full text-[12px]"><thead className="bg-panel text-[10px] uppercase text-muted-foreground"><tr>{headers.map((label) => <th key={label} className="px-3 py-2 text-left">{label}</th>)}</tr></thead><tbody className="divide-y divide-border">{decisions.map((decision) => <tr key={decision.key}><td className="whitespace-nowrap px-3 py-3 font-mono-tech"><LocalTime value={decision.time} /></td><td className="px-3 py-3 font-mono-tech">{decision.target}</td><td className="px-3 py-3 text-primary">{decision.decision}</td><td className="min-w-64 whitespace-pre-wrap break-words px-3 py-3">{decision.reason}</td></tr>)}</tbody></table></div>}</div></AppShell>;
}
