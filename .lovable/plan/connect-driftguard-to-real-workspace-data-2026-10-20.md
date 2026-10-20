# Connect DriftGuard to real workspace data

## Scope
Preserve the current theme and marketing pages. Use your supplied existing Supabase project directly, without Lovable Cloud, new infrastructure, service-role keys or database writes.

## Authentication
- Keep existing passwordless `/login` Analyst/Admin cards, demo shortcut routes, local demo roles and Exit demo behavior. Do not add Supabase Auth, route protection, sign-out or account approval notices.
- Replace invented personal names with "Analyst" and "Admin" and use "Live data from your connected collectors" instead of the demo tenant footer.
- Read the three views anonymously using the supplied public key; they are already public-readable.

## Console data
- Query only `dg_incidents`, `dg_events`, `dg_verdicts`, with pagination and exact 24-hour counts.
- Real dashboard KPIs, hourly severity, recent events, incidents, RAG matches/deviations, evidence rows and actual pipeline stage results.
- Label actions "Recommended action" only; remove action-execution controls.
- Admin and Data become host/collector-status views derived from events.
- Audit merges incidents and cleared event-group verdicts chronologically.
- Remove fake agents/activity, users, rules, integrations, AI/vector configuration, pipeline health, compliance reports and unsupported performance metrics.
- Refresh every ten seconds, show last updated and local times, and provide loading/error/empty states.

## Chat
Remove sample logs. Use real incidents and verdicts for every question and follow-up. The server queries the same views with the public key, without bearer validation; never trust client-provided workspace context.

## Marketing preservation
Home imports promotional numbers from the console mock module. Move just those unchanged numbers into a marketing-only module and update the import, preserving its content and appearance. Keep all other marketing page files and sitemap unchanged.

## Technical details
- One `src/lib/supabase.ts` owns supplied public config and an anonymous read-only client factory for browser and server reads.
- Existing demo access and navigation stay in place; public route loaders prime React Query from the real views.
- Focused tests cover KPI formulas, ten-minute collector threshold, decision merging, action recommendations and read-only access.

## Verification
Run focused tests, inspect automatic build results and verify live anonymous reads, dashboard, incident evidence, chat follow-ups and demo navigation in desktop/mobile browsers.
