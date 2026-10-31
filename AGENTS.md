<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## BookNook client

Next.js 16 App Router frontend (single package, `package-lock.json` → use npm). No test runner and no CI exist — don't look for `npm test`.

### Verify changes

- `npx tsc --noEmit` — typecheck (there is no `typecheck` script)
- `npm run lint` — ESLint flat config, whole repo
- `npm run build` — full build; also runs the TypeScript check, so it's the strongest single step
- Order: lint → tsc → build
- Known baseline: `npm run lint` currently fails with 3 pre-existing `react-hooks/set-state-in-effect` errors in `app/components/{Banner,Footer,Navbar}.tsx`. Not your regression — but don't add new ones.

### Code layout (differs from Next.js defaults)

- `app/` is at the repo root (no `src/`). `app/page.tsx` renders `app/components/Banner.tsx` (imported as `Home`); `app/layout.tsx` mounts `Navbar` + `Footer` globally, so don't re-add them per page.
- `lib/` holds auth: `lib/auth.ts` (better-auth server + MongoDB adapter, database name hardcoded to `booknook`), `lib/auth-client.ts`, and the catch-all handler `app/api/auth/[...all]/route.ts` via `toNextJsHandler(auth)`. New API routes go under `app/api/<name>/route.ts`.
- `@/*` path alias → repo root.
- Navbar already links to `/books`, `/add-book`, `/my-books`, `/my-borrows` — those routes don't exist yet (404). Creating them is likely the next task.

### Toolchain quirks

- `cacheComponents: true` + `partialPrefetching: true` in `next.config.ts`: uncached dynamic reads (DB, `cookies()`, `headers()`) must sit behind a `<Suspense>` boundary or be wrapped in `"use cache"`, or the build errors. See `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`.
- React Compiler is enabled (`reactCompiler: true`) — components must be pure; no side effects during render.
- Tailwind 4 has **no** `tailwind.config`/`postcss.config`. It's wired in `next.config.ts` via `turbopack.rules` → `@tailwindcss/turbopack`; daisyUI loads through `@plugin "daisyui"` in `app/globals.css`. Do not add a PostCSS config.
- `<Image>` remote hosts are allowlisted in `next.config.ts` `images.remotePatterns` (only `images.unsplash.com` today) — other hosts fail at build/runtime.
- Theme switching is custom, not daisyUI themes: `html[data-theme]` + CSS variables in `app/globals.css`, persisted in `localStorage["booknook-theme"]`. Several components also hardcode hex colors.

### Auth / environment

- `.env` is gitignored and no `.env.example` exists. Required keys: `MONGO_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`. On a fresh clone you must create it; `lib/auth.ts` blindly casts `MONGO_URL`, so a missing/invalid value only fails when the auth route is hit.
- Env vars are server-only unless `NEXT_PUBLIC_`-prefixed. `lib/auth-client.ts` reads `process.env.BETTER_AUTH_URL` from browser code, where it is `undefined` — the client relies on the same-origin fallback. Don't assume it's set client-side.
- `lib/auth-client.ts` exports `authClient` (built with a baseURL) **and** `signIn/signUp/useSession` destructured from a second `createAuthClient()` call. Two client instances exist; follow existing import style rather than "fixing" one side casually.

### AGENTS.md managed blocks

The block above (and, since `experimental.agentFeedback: true` is on, a `<!-- BEGIN:nextjs-agent-feedback -->` block that may appear after you run `next dev`) is written and restored by `next dev`. Keep the marker pairs intact and place project notes outside them.
