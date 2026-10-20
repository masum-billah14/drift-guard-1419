import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { HostsContent, ConsoleLoading, ConsoleError, ConsoleNotFound } from "@/components/workspace-ui";
import { workspaceOptions } from "@/lib/workspace";
import { consoleHead } from "@/lib/route-meta";
export const Route = createFileRoute("/admin")({
  head: () => consoleHead("Admin", "Hosts and collector reporting from received events."),
  loader: ({ context }) => context.queryClient.ensureQueryData(workspaceOptions()),
  pendingComponent: ConsoleLoading, errorComponent: ConsoleError, notFoundComponent: ConsoleNotFound,
  component: () => <AppShell><HostsContent title="DriftGuard · Admin" /></AppShell>,
});
