## Goal
Make the doc/judging links a persistent top bar accessible from every route, and slim the left sidebar down per role.

## Changes

### 1. New global top bar — `src/components/top-nav.tsx`
- Horizontal bar rendered inside `AppShell`'s header (above/next to the tenant title), visible on every route including landing, `/app`, `/admin`, and all doc pages.
- Links: Architecture, Data, Security, Audit, Presentation, Pitch deck.
- Active state highlighted via `pathname.startsWith`.
- Responsive: scrolls horizontally on narrow screens.

### 2. `src/components/app-shell.tsx`
- Add `<TopNav />` into the sticky header so it appears on every screen wrapped by AppShell.
- Rework left sidebar by role:
  - **Analyst**: only `Console` (and `Exit demo` footer). Remove Data/Architecture/Security/Audit and the entire Judging section — they now live in the top bar.
  - **Admin**: only `Admin panel` (and `Exit demo`). No Console, no Operations, no Judging.
- Keep the "All systems operational" status block and role badge.

### 3. Landing page `src/routes/index.tsx`
- Currently not wrapped in AppShell. Wrap its header area with the same `<TopNav />` (or render AppShell) so the bar is reachable from `/` too, matching the "accessed from any tab" requirement.

### 4. Doc pages
- No changes needed — `DocShell` already uses `AppShell`, so they inherit the new top bar and the trimmed sidebar automatically.

## Result
- Top bar is the single entry point for Architecture / Data / Security / Audit / Presentation / Pitch deck, available on every page.
- Analyst sidebar shows only Console.
- Admin sidebar shows only Admin panel.
