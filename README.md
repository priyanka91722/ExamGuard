# ExamGuard

An editorial investigation workspace for academic exam-leak review. Built with React 19, TypeScript, Vite, Tailwind CSS v4, Lucide, and TanStack Start routing.

## Run locally

```sh
bun install
bun run dev
bun run test
bun run build
```

Use a current Node.js LTS release and Bun. Commit `bun.lock` to keep installations reproducible. Connect this repository through Lovable's GitHub integration or use a normal GitHub repository; never commit private credentials.

## Pages and workflow

- `/`: Case statistics and recent suspected incidents.
- `/cases`: Search by subject, source, examination or case ID; filter by subject and status.
- `/cases/:caseId`: Side-by-side evidence and review-status updates.
- `/comparison`: Paste documents or load labelled sample text, compare, inspect highlighted passages, and edit or clear.

All sample incidents are fictional demonstration data. Demonstration review changes live only in the current browser session's in-memory cache and reset on refresh. There is no database, login, crawler or generated backend.

## Similarity

The pure local algorithm in `src/features/comparison/similarity.ts` tokenizes Unicode words, applies NFKC normalization and lowercase, ignores punctuation, and compares sets of unique three-word n-grams. For documents under three words it uses the shortest document's word count. Sørensen–Dice score = `2 × shared grams / (reference grams + evidence grams) × 100`, rounded to a whole percentage. Overlapping matching ranges are merged for highlighting. Empty inputs are blocked. This measures lexical overlap, not semantic similarity or proof of a leak.

## Future Java Spring Boot integration

Copy `.env.example` to `.env.local`. Leave `VITE_API_BASE_URL` unset for demo mode. Set it to the API root, e.g. `https://your-service.example/api`, to use the typed service in `src/services/api.ts`.

Expected endpoints:

- `GET /cases` → `ExamCase[]`
- `GET /cases/{id}` → `ExamCase`
- `PATCH /cases/{id}/status` with `{ "status": "Needs review" | "Investigating" | "Resolved" }` → JSON or HTTP 204

`ExamCase` is defined in `src/features/cases/data.ts`. Timestamps are ISO 8601 and displayed explicitly in UTC. Enable CORS for the deployed frontend origin on the future service. Environment variables prefixed with `VITE_` are public: never put secrets there. Configure authorization before using real confidential evidence; the prepared service deliberately does not implement authentication.

## Deploy on Vercel

1. Import the GitHub repository into Vercel.
2. Select framework **Other**, install command `bun install`, and build command `bun run build`.
3. Set environment variable `NITRO_PRESET=vercel`. The existing deployment adapter supports target auto-detection; this explicit value makes the intended target clear outside Lovable.
4. Leave the output-directory override unset. Nitro emits Vercel Build Output API artifacts in `.vercel/output`, including page rendering and asset routing; do not point Vercel to `.output` or add SPA rewrites.
5. Optionally set `VITE_API_BASE_URL` when the Spring Boot service is available. Redeploy after environment changes.

The app retains the platform's TanStack Start bootstrap rather than substituting a SPA router. Lovable builds keep their managed deployment target. A real Vercel deployment still needs a GitHub repository connection and a Vercel account; it has not been deployed from this workspace.
