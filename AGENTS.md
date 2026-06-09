# Agent Guide — portafolio-gscp

## Stack

- **Next.js 16.2.4** (App Router, Turbopack), **React 19.2.4**, **TypeScript** strict mode.
- `@/*` maps to `./src/*`.
- No `opencode.json` — uses `.atl/skill-registry.md` and `skills-lock.json` for skill routing.

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| All tests | `npm test` or `vitest run` |
| Single test file | `npx vitest run src/features/projects/github.test.ts` |
| Watch tests | `npm run test:watch` |
| Typecheck | `npx tsc --noEmit` |

## Architecture

```
src/
├── app/                    # App Router pages + API routes
│   ├── layout.tsx          # Root shell: nav, footer, JSON-LD, ThemeToggle, PageTransition
│   ├── page.tsx            # Home
│   ├── perfil/             # Static profile page
│   ├── proyectos/          # Projects listing (client-side, most complex page)
│   ├── contacto/           # Contact form page
│   ├── sitemap.ts          # Dynamic sitemap (Next metadata route)
│   ├── robots.ts           # Dynamic robots.txt (Next metadata route)
│   └── api/
│       ├── projects/       # GET (list), POST (save, auth required)
│       ├── projects/import/ # POST (GitHub import, auth required)
│       ├── contact/        # POST (honeypot + rate limit + nodemailer)
│       └── sitemap/        # 308 redirect to /sitemap.xml (legacy compat)
├── features/projects/      # Domain logic extracted from monolithic page
│   ├── types.ts            # Project, ProjectsApiResponse interfaces
│   ├── github.ts           # URL parsing, README scraping, tech extraction
│   ├── github.test.ts      # Unit tests for parseGitHubRepoUrl
│   ├── api.ts              # Client-side fetch wrappers (projects CRUD, import, auth)
│   └── tech-icons.ts       # lucide-react icon mapping per technology
├── components/             # Shared UI components (NavLinks, ThemeToggle, PageTransition, MobileNav, etc.)
├── lib/                    # email.ts (nodemailer), rate-limit.ts (in-memory)
└── test/setup.ts           # @testing-library/jest-dom/vitest global setup
```

## Gotchas

### `/proyectos` is a monolith (single `"use client"` component)
Everything — data fetch, GitHub scraping, auth UX, CRUD — lives in one 306-line component. The feature logic was extracted to `src/features/projects/` but the page itself still imports and orchestrates it all client-side. Tests exist for the GitHub URL parser (`github.test.ts`) and the import route (`route.test.ts`) but not for the page component or the README parser.

### Duplicated data sources
Both `data/projects.json` (API default) and `src/data/projects.json` (legacy) exist with diverging entries. The API route falls back to the legacy file if the default doesn't exist. When writing tests or fixtures, write to `data/projects.json` and be aware the fallback exists.

### Theme logic is duplicated
`ThemeToggle` handles localStorage + DOM class directly. `ThemeProvider` duplicates the same concern and is **not wired** into the layout. Do not add a third theme mechanism — consolidate into one.

### JSON-LD is manual and repeated
The root layout (`layout.tsx`) injects three `<script type="application/ld+json">` blocks with `dangerouslySetInnerHTML`. Every child layout duplicates breadcrumb JSON-LD. A reusable `SchemaScript` component exists but is **unused**. Prefer `SchemaScript` for new structured data.

### CSP is defined in next.config.ts
Security headers (CSP, X-Frame-Options, etc.) are set via `async headers()` in `next.config.ts`. If you change external resource loading (fonts, images, APIs), update the CSP `script-src`, `connect-src`, `font-src`, or `img-src` directives accordingly.

### Contact form defenses
`POST /api/contact` uses three anti-bot layers: hidden honeypot field, timing check (minimum 3s), and in-memory rate limit (3 requests/minute per IP). In Vercel serverless, rate limit resets per-instance — acceptable for this use case. Env vars required: `SMTP_USER`, `SMTP_PASS`.

### Admin auth flow
`Ctrl + Alt + 9` reveals the admin token prompt on `/proyectos`. Token is stored in `localStorage`. Server checks `PROJECTS_ADMIN_TOKEN` env var. Writes are **disabled in production** (`NODE_ENV === "production"` returns 403).

### Design system reference
See `DESIGN.md` for full design tokens. Berkeley Mono is the sole typeface (via Fontshare), not Geist as the README states. No shadows, no gradients — flat terminal aesthetic.

### SEO files — two layers exist
Dynamic: `src/app/sitemap.ts` + `src/app/robots.ts` (Next.js metadata route conventions).
Static legacy: `public/sitemap.xml` + `public/robots.txt`.
Both exist and serve different paths. The dynamic `robots.ts` references `/sitemap.xml` which resolves to the **static** `public/sitemap.xml`, not the dynamic `sitemap.ts`.

## Testing

- **Runner**: Vitest 4 via `jsdom` for component tests, `node` for API tests.
- **Two test files**: `MobileNav.test.tsx` (component), `import/route.test.ts` (API contract), `github.test.ts` (unit).
- Component tests use `@testing-library/react` + `fireEvent`, mock `next/navigation` and `next/link`.
- API tests use `vi.mock` at the module boundary, create `Request` objects directly, reset env with `beforeEach`/`afterEach`.
- No test for the monolithic `/proyectos` page component or the README parser (`github.ts` functions).
- Run `npx tsc --noEmit` and `npm run lint` before pushing; both are fast and catch real issues.
