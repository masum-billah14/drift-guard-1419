# Connect DriftGuard to real workspace data

## Scope
Preserve the current theme and marketing pages. Use your supplied existing Supabase project directly, without Lovable Cloud, new infrastructure, service-role keys or database writes.

## Authentication
- Replace demo login with email/password sign-in and Create account; demo shortcuts redirect to `/login`.
- Protect `/app`, incident detail, chat, Admin, Audit and Data; display email and Sign out.
- Use existing Auth accounts only, assuming no extra profile information is needed.
- Clearly handle email confirmation and signup-without-session.
- Show your approval notice when all views are empty, alongside collector guidance. RLS-filtered empty views cannot distinguish an unapproved account from an approved empty workspace.

## Console data
- Query only `dg_incidents`, `dg_events`, `dg_verdicts`, with pagination and exact 24-hour counts.
- Real dashboard KPIs, hourly severity, recent events, incidents, RAG matches/deviations, evidence rows and actual pipeline stage results.
- Label actions "Recommended action" only; remove action-execution controls.
- Admin and Data become host/collector-status views derived from events.
- Audit merges incidents and cleared event-group verdicts chronologically.
- Remove fake agents/activity, users, rules, integrations, AI/vector configuration, pipeline health, compliance reports and unsupported performance metrics.
- Refresh every ten seconds, show last updated and local times, and provide loading/error/empty states.

## Chat
Remove sample logs. Use real incidents and verdicts for every question and follow-up. Validate the signed-in bearer token server-side and query the same protected views; never trust client-provided workspace context.

## Marketing preservation
Home imports promotional numbers from the console mock module. Move just those unchanged numbers into a marketing-only module and update the import, preserving its content and appearance. Keep all other marketing page files and sitemap unchanged.

## Technical details
- One `src/lib/supabase.ts` owns supplied public config, a persisted browser client and request-scoped server client factory.
- Client-only protected routes share a route guard and a single auth-state subscription; sign-out cancels and clears queries.
- Focused tests cover KPI formulas, ten-minute collector threshold, decision merging, action recommendations and read-only access.

## Verification
Run focused tests, inspect automatic build results and check public/auth redirects and desktop/mobile states. This externally managed project has no injectable authenticated test session; report authenticated data flows and hosted Auth settings as unverified if no session is available, without requesting passwords.
