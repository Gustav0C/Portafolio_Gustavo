# Tasks: Performance Optimization — Lighthouse Metrics

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 300-380 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Slice 1) → PR 2 (Slice 2) → PR 3 (Slice 3) → PR 4 (Slice 4) → PR 5 (Slice 5) |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Remove framer-motion, replace PageTransition with CSS, fix CTA delay | PR 1 | Standalone CSS/JS change |
| 2 | Self-host Berkeley Mono via next/font/local | PR 2 | Requires font files in public/fonts/ |
| 3 | Dynamic imports for below-fold sections | PR 3 | Pure import change |
| 4 | Replace tech-stack-icons with inline SVGs | PR 4 | Largest slice, ~200 lines |
| 5 | Add visibilityState guard to Background rAF loop | PR 5 | Small, isolated |

## Phase 1: framer-motion Removal + CTA Delay

- [x] 1.1 Modify `src/components/PageTransition.tsx`: remove `import { motion } from "framer-motion"`, replace `<motion.div>` with `<div>`, apply CSS class `fade-in` conditionally based on `mounted` and `reducedMotion` state.
- [x] 1.2 Update `src/components/PageTransition.module.css`: add `.fade-in { animation: fadeIn 80ms ease-out forwards; }` (keep existing `fadeIn` keyframe).
- [x] 1.3 Change `src/app/page.module.css` line 49: replace `4500ms` with `500ms` in `.cta` animation delay.
- [x] 1.4 Remove `framer-motion` from `package.json` dependencies.
- [x] 1.5 Verify: run `npm run build` and `npm run lint`, ensure no TypeScript errors.

## Phase 2: Self-Host Font

- [ ] 2.1 Download Berkeley Mono WOFF2 files (weights 400, 700) from Fontshare API CSS URLs and place in `public/fonts/berkeley-mono-400.woff2` and `berkeley-mono-700.woff2`. **BLOCKED: Fontshare API returns empty CSS — requires manual download.**
- [x] 2.2 Create `src/app/fonts.ts` with `localFont` config exporting `berkeleyMono` (weights 400/700, `display: "swap"`, CSS variable `--font-mono`).
- [x] 2.3 Modify `src/app/layout.tsx`: remove `<link href="https://api.fontshare.com/...">` and any `preconnect` hints, apply `font.className` to `<html>` element.
- [x] 2.4 Update `next.config.ts`: remove `font-src` and `style-src` CSP entries for `api.fontshare.com`.
- [ ] 2.5 Verify: run `npm run build`, check that no external font requests appear in Network tab, ensure font renders correctly.

## Phase 3: Dynamic Imports

- [x] 3.1 Modify `src/app/page.tsx`: convert `SkillsSection`, `FeaturedProjects`, `StatusSection`, `ServicesSection` to `next/dynamic` (code splitting). Note: `ssr: false` removed because page.tsx is a Server Component (exports metadata).
- [x] 3.2 Keep static imports for `GhostAvatar`, `Background`, `HomeTerminal`.
- [x] 3.3 Verify: run `npm run build`, inspect `.next/static/chunks/` to confirm separate chunks for each dynamic component.

## Phase 4: SVG Icon Replacement

- [x] 4.1 Create `src/components/TechIcon.tsx` with `IconName` type (21 names) and `Record<IconName, ReactNode>` mapping to inline SVGs (1-3KB each).
- [x] 4.2 Source official brand SVGs (react, nextjs, typescript, js, html5, css3, tailwindcss, nodejs, expressjs, python, postgresql, mongodb, redis, docker, git, vercel, aws, vitejs, eslint, prettier) — extract from `node_modules/tech-stack-icons` package.
- [x] 4.3 Implement grayscale variant via CSS `filter: grayscale(1)` on `<svg>` element.
- [x] 4.4 Modify `src/components/SkillsSection.tsx`: replace `<StackIcon name={...} />` with `<TechIcon name={...} variant="grayscale" />`.
- [x] 4.5 Remove `tech-stack-icons` from `package.json` dependencies.
- [x] 4.6 Verify: run `npm run build` and `npm run lint`, ensure all 21 icons render, check bundle size reduction.

## Phase 5: Background Visibility Guard

- [x] 5.1 Modify `src/components/Background.tsx`: in the draw callback (line ~192), wrap `requestAnimationFrame` with `if (document.visibilityState === "visible")`.
- [x] 5.2 Add `useEffect` with `visibilitychange` listener that restarts rAF loop when tab becomes visible and `animationRef.current` is null.
- [x] 5.3 Ensure cleanup cancels pending animation frame and removes event listener.
- [x] 5.4 Verify: run `npm run build`, manually test tab switching in browser (animation should pause when hidden, resume when visible).

## Phase 6: Testing and Verification

- [ ] 6.1 Write unit test for `TechIcon` component: renders SVG for each name, handles unknown name gracefully.
- [ ] 6.2 Write unit test for `PageTransition`: class toggle behavior with mocked `usePathname`.
- [x] 6.3 Run full test suite (`npm test`), ensure all pass. — 35/35 tests pass.
- [ ] 6.4 Run Lighthouse audit to verify LCP < 2.5s, TBT < 200ms, FCP < 1.8s, Speed Index < 3.4s.
- [ ] 6.5 Manual verification: no external font requests, CTA visible within 1s, background pauses when tab hidden.