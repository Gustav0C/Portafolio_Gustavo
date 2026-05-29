# Code Context

## Files Retrieved
1. `src/app/layout.tsx` (lines 9-70, 72-226) - global architecture, metadata/SEO baseline, JSON-LD injection, shared nav/footer, and global client wrappers.
2. `src/app/page.tsx` (lines 5-19, 21-60) - home page metadata/content pattern.
3. `src/app/perfil/page.tsx` (lines 5-19, 21-189) - static profile content with in-component data structures.
4. `src/app/contacto/page.tsx` (lines 6-68, 70-150) - client-side form logic, validation, simulated submit flow.
5. `src/app/proyectos/page.tsx` (lines 1-35, 37-296, 303-613) - largest feature: client-side data lifecycle, GitHub scraping logic, admin login UX, CRUD UI.
6. `src/app/api/projects/route.ts` (lines 5-25, 27-34, 36-56, 58-99) - file-based persistence, auth checks, runtime write behavior.
7. `src/app/api/sitemap/route.ts` (lines 3-57) - custom sitemap endpoint implementation.
8. `next.config.ts` (lines 3-7, 8-42, 43-80) - security headers/CSP, image host policy; also involved in build tracing warning.
9. `src/app/proyectos/layout.tsx` (lines 3-17, 19-53), `src/app/perfil/layout.tsx` (3-17, 19-53), `src/app/contacto/layout.tsx` (3-16, 18-52) - route-level metadata + repeated breadcrumb JSON-LD patterns.
10. `src/components/NavLinks.tsx` (lines 7-33) - route map and active-link behavior.
11. `src/components/ThemeToggle.tsx` (lines 9-29, 31-49) and `src/components/ThemeProvider.tsx` (lines 12-40) - duplicated theming mechanisms; provider appears unused.
12. `src/components/PageTransition.tsx` (lines 7-21) - global framer-motion page animation wrapper.
13. `src/components/SchemaScript.tsx` (lines 3-15) - reusable JSON-LD helper, currently unused.
14. `src/app/layout.module.css` (lines 47-64, 116-127), `src/app/proyectos/page.module.css` (lines 17-44, 281-308), `src/app/contacto/page.module.css` (lines 51-55) - a11y-relevant interaction/focus patterns.
15. `package.json` (lines 5-10, 11-25) - scripts/dependencies; no tests script.
16. `README.md` (lines 19-35) - docs are mostly template-level; partial env var docs.
17. `data/projects.json` (lines 1-38) and `src/data/projects.json` (lines 1-38) - duplicated data source files with diverging entries.

## Key Code

### 1) Architecture snapshot
- App Router structure is straightforward (`src/app/*`), with static pages plus two API routes.
- Shared shell in `src/app/layout.tsx` wraps all pages with:
  - `NavLinks`, `ThemeToggle`, and `PageTransition` (`layout.tsx` lines 168-183).
- `/proyectos` is the most complex and drives most risks (monolithic client component + external API calls + admin flow).

### 2) Maintainability hotspots
- `src/app/proyectos/page.tsx` is overloaded:
  - UI + domain type + icon mapping + GitHub parsing + auth UX + persistence orchestration all in one file (lines 26-296 and 303-613).
- Theme logic duplication:
  - `ThemeToggle` implements storage and DOM mutation directly (lines 19-29).
  - `ThemeProvider` duplicates same concern (lines 24-33) and appears unused in app wiring.
- Repeated structured data scripting:
  - Multiple raw `dangerouslySetInnerHTML` scripts in root and each page layout (`layout.tsx` lines 87-163; route layouts lines 27-49).
  - Reusable `SchemaScript` exists but is not used (`src/components/SchemaScript.tsx` lines 7-15).
- Metadata duplication:
  - `/perfil` metadata appears both in `perfil/layout.tsx` and `perfil/page.tsx` with similar content.

### 3) Performance and rendering
- `/proyectos` is fully client-side (`"use client"`, line 1) and fetches list after mount (`useEffect`, lines 327-344), so cards are not server-rendered initially.
- Bundle weight pressure on that route from broad icon imports and heavy client logic in one file.
- Global `PageTransition` animation wraps all pages (`layout.tsx` line 182 + `PageTransition.tsx` lines 12-17), introducing JS execution on every route.
- Build evidence:
  - `next build` emits tracing warning from `next.config.ts` import chain into `api/projects/route.ts` due to fs/path usage.

### 4) SEO and discoverability
- Good baseline: rich metadata + OG + Twitter at root (`layout.tsx` lines 9-70).
- Structured data is present but highly manual and duplicated.
- Sitemap is served at `/api/sitemap` (`src/app/api/sitemap/route.ts`), not default `sitemap.xml` convention, reducing crawler discoverability unless explicitly linked.
- Placeholder verification remains (`layout.tsx` line 65).

### 5) Accessibility
- Positive:
  - Buttons/links generally have text or `aria-label` in project cards (lines 565-593).
  - Theme toggle has descriptive `aria-label` (ThemeToggle line 35).
- Gaps:
  - Mobile nav hides links completely at <=640px with no alternate menu (`layout.module.css` lines 116-120).
  - Error messaging in forms lacks explicit `aria-live`/`aria-describedby` linkage (`contacto/page.tsx` lines 97-143; `proyectos/page.tsx` lines 495, 514).
  - Keyboard/focus states are inconsistent: some controls have only hover styles (e.g., `.navLink`, `.link`, `.deleteBtn` in CSS without dedicated focus-visible styles).

### 6) Testing and quality gates
- No automated test suite found; scripts include only `dev/build/start/lint` (`package.json` lines 5-10).
- Lint result: 1 warning (`src/app/api/sitemap/route.ts` unused `request`, line 3).

### 7) Developer experience
- Good: TypeScript strict mode and Next core-web-vitals ESLint config are enabled.
- Friction:
  - Build warning about multiple lockfiles/workspace root inference.
  - README is still mostly create-next-app template and references `next/font` Geist although project uses external Fontshare link in `layout.tsx` lines 82-85.
  - Data persistence model is ambiguous: both `data/projects.json` and `src/data/projects.json` exist; API route includes legacy fallback logic (`route.ts` lines 19-25).

## Architecture
- **UI layer**: App Router pages (`/`, `/perfil`, `/proyectos`, `/contacto`) under `src/app`.
- **Shared presentation**: Root layout + CSS modules + reusable nav/theme/transition components.
- **Data flow (`/proyectos`)**:
  1. Client fetches `/api/projects` on mount (`proyectos/page.tsx` lines 327-344).
  2. API route reads JSON from disk (`api/projects/route.ts` lines 44-49).
  3. Admin actions post full project array back to same endpoint (`proyectos/page.tsx` lines 369-376, 399-406).
  4. API validates minimally and overwrites JSON file (`route.ts` lines 75-95).
- **External dependencies**:
  - GitHub REST + README fetch/parsing from browser (`proyectos/page.tsx` lines 112-252, 261-277).
- **Security model**:
  - Bearer token checked server-side (`route.ts` lines 27-34, 67-69), token persisted in `localStorage` client-side (`proyectos/page.tsx` lines 298-301, 444).

## Technical Assessment (concise)

### Overall
Solid baseline portfolio built on current Next.js + TS strict mode, but architecture is becoming brittle around `/proyectos`. Biggest opportunities are **splitting concerns, moving critical data work server-side, improving crawlability/accessibility, and adding minimal automated tests**.

### Top risks
1. **Monolithic client feature (`/proyectos`)** impacts maintainability, performance, and testability.
2. **SEO discoverability gap** due to sitemap path and manual metadata/schema duplication.
3. **A11y regression risk** from hidden mobile navigation and inconsistent focus/error semantics.
4. **No test coverage**, so regressions in parsing/auth/data writes are likely.

## Prioritized Backlog (Top 10)

| # | Improvement | Impact | Effort | Evidence |
|---|---|---|---|---|
| 1 | Refactor `src/app/proyectos/page.tsx` into feature modules (fetch/parsing/auth/ui components/hooks). | High | Medium | `proyectos/page.tsx` lines 37-296 + 303-613 show mixed concerns in one file. |
| 2 | Move GitHub metadata/README parsing from browser to server/API route (cacheable, safer, smaller client bundle). | High | Medium | Browser fetch chain in lines 112-252 and 261-277. |
| 3 | Switch sitemap to Next metadata route (`src/app/sitemap.ts`) and add `robots.ts` referencing it. | High | Low | Current endpoint is `/api/sitemap` (`api/sitemap/route.ts` lines 3-57). |
| 4 | Make `/proyectos` data SSR/SSG-first (server component or route handlers with revalidation) and hydrate only admin controls client-side. | High | Medium | Entire page is client (`line 1`) and loads projects only after mount (`327-344`). |
| 5 | Add focused tests: unit tests for README parser + API contract tests for `/api/projects` auth/validation + one e2e smoke. | High | Medium | No `test` script in `package.json` lines 5-10; no tests found. |
| 6 | Consolidate theme management: remove unused provider or wire provider properly and use single source of truth. | Medium | Low | Duplication across `ThemeToggle.tsx` lines 19-29 and `ThemeProvider.tsx` lines 24-33; provider unused. |
| 7 | Extract and centralize JSON-LD/schema generation via `SchemaScript` helper and typed builders. | Medium | Low | Repeated raw scripts in `layout.tsx` lines 87-163 and route layouts lines 27-49; helper unused. |
| 8 | Fix mobile navigation accessibility: provide a menu button/drawer instead of hiding links. | Medium | Medium | `.navLinks { display:none }` at <=640px (`layout.module.css` lines 116-120). |
| 9 | Improve form and error accessibility (`aria-live`, `aria-invalid`, `aria-describedby`, focus management after submit/errors). | Medium | Low | Error rendering is visual-only in `contacto/page.tsx` lines 111,127,142 and `proyectos/page.tsx` lines 495,514. |
| 10 | Clean DX debt: resolve lockfile root warning, remove legacy `src/data/projects.json` fallback, update README to actual stack/workflow. | Medium | Low | Build warning + fallback logic in `api/projects/route.ts` lines 19-25; docs mismatch in `README.md` lines 32-35. |

## Start Here
Open `src/app/proyectos/page.tsx` first. It is the highest-leverage file because it concentrates architecture, performance, security-adjacent client behavior, and maintainability debt in one place. Breaking it apart unlocks most of the backlog items.
