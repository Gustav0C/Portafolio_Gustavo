# Proposal: Performance Optimization — Lighthouse Metrics

## Intent

Lighthouse reports critical performance issues: LCP 13.5s (target <2.5s), TBT 980ms (target <200ms), Speed Index 7.3s (target <3.4s), FCP 2.3s (target <1.8s). Root causes are identified: 8.5MB framer-motion bundle, render-blocking font, no code-splitting, CTA invisible for 4.5s, and continuous background animation. This change addresses them in ordered slices.

## Scope

### In Scope
- **Slice 1**: Remove framer-motion, replace PageTransition with CSS; reduce CTA animation delay from 4500ms to 500ms
- **Slice 2**: Self-host Berkeley Mono (400/700 only) via `next/font`, remove external `<link>` to api.fontshare.com
- **Slice 3**: Add `next/dynamic` for below-fold components (SkillsSection, FeaturedProjects, StatusSection, ServicesSection)
- **Slice 4**: Replace `tech-stack-icons` (8.7MB) with 21 individual inline SVGs
- **Slice 5**: Add `document.visibilityState` guard to Background rAF loop

### Out of Scope
- Image optimization (no images currently in LCP path)
- API route optimization
- Structured data / SEO changes
- Redesign or visual changes to the dot pattern background
- Font subsetting beyond weight reduction (400/700 only)

## Capabilities

### New Capabilities
None — this is a pure performance refactor with no new feature behavior.

### Modified Capabilities
None — no spec-level behavior changes. All changes are implementation-level performance fixes.

## Approach

### Slice 1: framer-motion removal + CTA delay fix

**framer-motion** (8.5MB → 0):
- `PageTransition.tsx`: Replace `motion.div` with a plain `<div>` + CSS class toggle. The component already has `mounted` and `reducedMotion` guards — keep those. Add a CSS class `fade-in` that transitions `opacity: 0 → 1` over 80ms. Remove `import { motion } from "framer-motion"`.
- `PageTransition.module.css`: Add `.fade-in { animation: fadeIn 80ms ease-out forwards; }` with `@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`.
- `package.json`: Remove `framer-motion` dependency.

**CTA delay** (4500ms → 500ms):
- `page.module.css:49`: Change `animation: fadeInUp 0.5s ease-out 4500ms forwards` → `animation: fadeInUp 0.5s ease-out 500ms forwards`.
- Rationale: 4.5s makes CTA invisible through the entire hero. 500ms preserves the staggered reveal (title 100ms, subtitle 250ms, CTA 500ms) without blocking interaction.

### Slice 2: Self-host font via next/font

- Download Berkeley Mono WOFF2 (weights 400, 700) — obtain from Fontshare download or existing css response.
- Create `src/app/fonts.ts` exporting `localFont` from `next/font/local` with `weight: ["400", "700"]` and `display: "swap"`.
- `layout.tsx`: Remove the `<link href="https://api.fontshare.com/...">` tag. Apply the font CSS variable to `<html>` or `<body>` via the `className` from `localFont`.
- Add `<link rel="preconnect" href="https://api.fontshare.com">` only if keeping external fallback; with self-hosting, no external font requests remain.

### Slice 3: Dynamic imports for below-fold sections

- `page.tsx`: Convert `SkillsSection`, `FeaturedProjects`, `StatusSection`, `ServicesSection` from eager imports to `next/dynamic` with `{ ssr: false }` or `{ loading: () => <Placeholder /> }`.
- Keep `GhostAvatar`, `Background`, `HomeTerminal` as static imports (above the fold).
- This defers 8.7MB tech-stack-icons (via SkillsSection) and project API fetch (via FeaturedProjects) until their sections scroll into view.

### Slice 4: Replace tech-stack-icons with inline SVGs

- Create `src/components/TechIcon.tsx` — a simple component mapping icon name → inline SVG.
- Manually source 21 SVGs (react, nextjs, typescript, js, html5, css3, tailwindcss, nodejs, expressjs, python, postgresql, mongodb, redis, docker, git, vercel, aws, vitejs, eslint, prettier).
- `SkillsSection.tsx`: Replace `<StackIcon name={...} />` with `<TechIcon name={...} />`.
- Remove `tech-stack-icons` from `package.json`.
- Each SVG is ~1-3KB; 21 icons ≈ 40-60KB total vs. 8.7MB single file.

### Slice 5: Background rAF visibility guard

- `Background.tsx`: In the draw loop (line 192), wrap `requestAnimationFrame` with a `document.visibilityState === "visible"` check. When tab is hidden, stop the loop. Resume on `visibilitychange` event.
- Add `useEffect` listener for `visibilitychange` that restarts the rAF loop when the tab becomes visible again.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/PageTransition.tsx` | Modified | Remove framer-motion, add CSS transition class |
| `src/components/PageTransition.module.css` | Modified | Add fadeIn keyframe |
| `src/app/page.module.css` | Modified | CTA delay 4500ms → 500ms |
| `src/app/layout.tsx` | Modified | Remove font `<link>`, apply next/font className |
| `src/app/fonts.ts` | New | Self-hosted Berkeley Mono via next/font/local |
| `src/app/page.tsx` | Modified | Dynamic imports for 4 below-fold sections |
| `src/components/SkillsSection.tsx` | Modified | Import TechIcon instead of StackIcon |
| `src/components/TechIcon.tsx` | New | 21 inline SVG icon mappings |
| `src/components/Background.tsx` | Modified | Add visibilityState guard on rAF loop |
| `package.json` | Modified | Remove framer-motion, tech-stack-icons |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Visual regression from CSS transition replacing framer-motion | Low | The animation is opacity 0→1 over 80ms — trivially replicable in CSS |
| Font FOUT with self-hosted WOFF2 | Medium | Use `display: "swap"` in next/font config; test with slow connection |
| Dynamic import flash of empty content | Low | Add skeleton/loading placeholder matching section dimensions |
| SVG icon fidelity differs from tech-stack-icons | Medium | Use official brand SVGs from SimpleIcons where available; verify grayscale rendering |
| Background stops animating when switching tabs | Low | This is the desired behavior — saves CPU. Resume on tab focus. |

## Rollback Plan

Each slice is independent and revertable:
1. **Slice 1**: Revert `PageTransition.tsx` to framer-motion import, restore CTA delay. `npm install framer-motion`.
2. **Slice 2**: Remove `src/app/fonts.ts`, restore `<link>` tag in layout.tsx.
3. **Slice 3**: Convert dynamic imports back to static imports in page.tsx.
4. **Slice 4**: Restore `StackIcon` import, delete `TechIcon.tsx`, `npm install tech-stack-icons`.
5. **Slice 5**: Remove visibilityState guard from Background.tsx.

## Dependencies

- WOFF2 font files for Berkeley Mono (weights 400, 700) — must be sourced before Slice 2
- 21 brand SVG files — manual collection before Slice 4

## Success Criteria

- [ ] LCP < 2.5s (from 13.5s)
- [ ] TBT < 200ms (from 980ms)
- [ ] FCP < 1.8s (from 2.3s)
- [ ] Speed Index < 3.4s (from 7.3s)
- [ ] `framer-motion` removed from bundle (0 bytes)
- [ ] `tech-stack-icons` removed from bundle (0 bytes)
- [ ] No external font requests on page load
- [ ] CTA buttons visible within 1s of page load
- [ ] Background animation pauses when tab is hidden
- [ ] No visual regressions in hero section, skills section, or page transitions
