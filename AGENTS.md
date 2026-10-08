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

## ExamGuard architecture
- Keep the TanStack Start/Vite bootstrap and separate content routes, because the platform owns routing and deployment integration.
- Keep demonstration records and the pure comparison algorithm outside UI modules, so evidence logic is independently testable.
- Route case access through a typed API service using VITE_API_BASE_URL, with explicit demonstration fallback, so Spring Boot integration does not require UI changes.
- Store demonstration review changes only in the in-memory query cache, because no backend or durable storage is requested.
- Express visual roles through global semantic tokens and use the shared Button for actions, so the editorial system remains consistent.
