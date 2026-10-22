import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HostsContent, ConsoleLoading, ConsoleError, ConsoleNotFound } from "@/components/workspace-ui";
import { workspaceOptions } from "@/lib/workspace";
import { consoleHead } from "@/lib/route-meta";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/data")({
  head: () => consoleHead("Data sources", "Connected hosts and collector status based on received events."),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceOptions()),
  pendingComponent: ConsoleLoading, errorComponent: ConsoleError, notFoundComponent: ConsoleNotFound,
  component: DataPage,
});

function DataPage() {
  const { bi } = useLang();
  return <AppShell hideSidebar><HostsContent title={bi("Data sources & collectors", "ডেটা সোর্স ও কালেক্টর")} /></AppShell>;
}
