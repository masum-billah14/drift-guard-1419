<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Workspace architecture
- `src/lib/supabase.ts` owns the public connection and anonymous GET/HEAD-only client factory; this enforces read-only access without database secrets or Auth changes.
- `workspace.ts` reads only the three workspace views with complete pagination and exact counts; shared Query options refresh all console surfaces consistently.
- `workspace-model.ts` contains pure real-data derivations; marketing promotional figures stay in a separate marketing-only module to prevent console leakage.
- Preserve local passwordless demo roles as navigation state only; they do not authenticate or authorize public view reads.
- Streaming chat reads its own public view context on each request; client messages and stored logs are untrusted inputs, not access controls or instructions.
- All user-facing UI text is bilingual English/Bangla via `useLang().bi(en, bn)` and `LanguageToggle` from `src/lib/i18n.tsx`; the choice persists at `driftguard:lang`, sets `html[lang]`, and `html[lang="bn"]` in `src/styles.css` loads Noto Sans Bengali. Every new visible string must ship both languages; the chat endpoint accepts a `language` field to localize AI answers.
