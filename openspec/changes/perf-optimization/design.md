# Design: Performance Optimization — Lighthouse Metrics

## Technical Approach

Five independent slices that remove ~17MB from the initial client bundle, eliminate render-blocking requests, defer below-fold JavaScript, fix CTA invisibility, and stop wasteful background CPU usage. Each slice is isolated — no cross-slice dependencies.

---

## Architecture Decisions

### Decision: CSS class toggle over framer-motion for PageTransition

**Choice**: Replace `motion.div` with a plain `<div>` that conditionally applies a CSS `fade-in` class keyed on `pathname`.

**Alternatives considered**: Keep framer-motion but tree-shake (not possible — 8.5MB is the core); use React Spring (still a library dependency).

**Rationale**: The animation is a single opacity transition (80ms). CSS `@keyframes` handle this natively with zero JS cost. The existing `PageTransition.module.css` already has `fadeIn`/`fadeOut` keyframes and a `prefers-reduced-motion` media query. We add a `.fade-in` class and the component becomes a state-driven class toggle.

### Decision: next/font/local with CSS variable over inline font-face

**Choice**: Create `src/app/fonts.ts` exporting a `localFont` instance, apply via `className` on `<html>`, expose `--font-mono` CSS variable.

**Alternatives considered**: Manual `@font-face` in globals.css (no automatic hash-based filenames, no preload hints).

**Rationale**: `next/font/local` generates `_next/static/media/` paths with content hashes, adds `<link rel="preload">` automatically, and supports `display: "swap"` natively. CSS variable approach matches the existing `var(--font-mono)` usage throughout the codebase.

### Decision: next/dynamic with ssr:false for below-fold sections

**Choice**: Wrap `SkillsSection`, `FeaturedProjects`, `StatusSection`, `ServicesSection` in `dynamic(() => import(...), { ssr: false })`. Keep `GhostAvatar`, `Background`, `HomeTerminal` as static imports.

**Alternatives considered**: `loading: <Skeleton />` (adds complexity for minimal benefit since sections are below fold and user won't see the placeholder).

**Rationale**: `ssr: false` means these components produce empty markup on the server, so no hydration mismatch. The browser only fetches their JS chunks when the user scrolls near them. This removes the 8.7MB `tech-stack-icons` from the initial chunk entirely.

### Decision: 21 individual inline SVGs over dynamic sprite or external package

**Choice**: Create `src/components/TechIcon.tsx` with a `Record<IconName, ReactNode>` mapping 21 icon names to inline SVG elements.

**Alternatives considered**: SVG sprite sheet (still one big file); keep tech-stack-icons but lazy-load (still 8.7MB in bundle).

**Rationale**: Each SVG is 1-3KB. Total ~40-60KB vs 8.7MB. Tree-shaking is irrelevant since the package isn't tree-shakeable. Inline SVGs also enable CSS filter for grayscale variant.

### Decision: document.visibilityState guard on rAF loop

**Choice**: Check `document.visibilityState` before each `requestAnimationFrame` call. Add a `visibilitychange` listener that restarts the loop when the tab becomes visible.

**Alternatives considered**: None — this is the standard browser API for this pattern.

**Rationale**: The current loop runs continuously even when the tab is hidden, wasting CPU. Browsers already throttle rAF to ~1fps when hidden, but the draw function still executes. A visibility check is zero-cost when visible and completely stops execution when hidden.

---

## Data Flow

```
┌─ Slice 1: PageTransition ──────────────────────────────┐
│  pathname changes → setMounted(true) → CSS class toggle │
│  mounted=false → plain <div> (SSR safe)                 │
│  reducedMotion=true → plain <div> (no animation)        │
│  mounted=true + !reducedMotion → <div className=fade-in>│
└────────────────────────────────────────────────────────┘

┌─ Slice 2: Font Loading ────────────────────────────────┐
│  fonts.ts → localFont(WOFF2) → exports className        │
│  layout.tsx → <html className={font.className}>          │
│  CSS variable: --font-mono resolves to Berkeley Mono     │
│  No external requests to api.fontshare.com               │
└────────────────────────────────────────────────────────┘

┌─ Slice 3: Dynamic Imports ─────────────────────────────┐
│  page.tsx → static: GhostAvatar, Background, HomeTerminal│
│  page.tsx → dynamic: SkillsSection, FeaturedProjects,    │
│             StatusSection, ServicesSection (ssr: false)  │
│  Browser fetches chunks on scroll intersection           │
└────────────────────────────────────────────────────────┘

┌─ Slice 4: TechIcon ────────────────────────────────────┐
│  SkillsSection → <TechIcon name="react" variant="grayscale"/> │
│  TechIcon → Record<string, SVG> lookup → inline <svg>    │
│  Grayscale: CSS filter: grayscale(1) on the <svg>        │
└────────────────────────────────────────────────────────┘

┌─ Slice 5: Background Visibility ───────────────────────┐
│  draw() → if hidden, return (don't requestAnimationFrame)│
│  visibilitychange → if visible, restart rAF loop          │
│  useEffect cleanup cancels pending animation frame        │
└────────────────────────────────────────────────────────┘
```

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/PageTransition.tsx` | Modify | Remove framer-motion import, add CSS class toggle keyed on `pathname` + `mounted` |
| `src/components/PageTransition.module.css` | Modify | Add `.fade-in` class with `animation: fadeIn 80ms ease-out forwards`, keep existing keyframes |
| `src/app/page.module.css` | Modify | Line 49: change `4500ms` → `500ms` in `.cta` animation delay |
| `src/app/fonts.ts` | Create | `localFont` config for Berkeley Mono weights 400/700, `display: "swap"`, CSS variable `--font-mono` |
| `src/app/layout.tsx` | Modify | Remove `<link href="https://api.fontshare.com/...">`, apply font `className` to `<html>` |
| `src/app/page.tsx` | Modify | Convert 4 below-fold imports to `next/dynamic` with `ssr: false` |
| `src/components/TechIcon.tsx` | Create | 21-icon SVG mapping component with `name` + `variant` props |
| `src/components/SkillsSection.tsx` | Modify | Replace `StackIcon` import with `TechIcon`, update JSX |
| `src/components/Background.tsx` | Modify | Add `visibilityState` check in draw loop, add `visibilitychange` listener |
| `next.config.ts` | Modify | Remove `font-src` and `style-src` entries for `api.fontshare.com` (CSP cleanup) |
| `package.json` | Modify | Remove `framer-motion` and `tech-stack-icons` dependencies |

---

## Interfaces / Contracts

### TechIcon Component

```typescript
// src/components/TechIcon.tsx

type IconName =
  | "react" | "nextjs" | "typescript" | "js"
  | "html5" | "css3" | "tailwindcss" | "nodejs"
  | "expressjs" | "python" | "postgresql" | "mongodb"
  | "redis" | "docker" | "git" | "vercel"
  | "aws" | "vitejs" | "eslint" | "prettier";

interface TechIconProps {
  name: IconName;
  variant?: "color" | "grayscale";
  className?: string;
  "aria-hidden"?: boolean;
}
```

### fonts.ts Export

```typescript
// src/app/fonts.ts
import localFont from "next/font/local";

const berkeleyMono = localFont({
  src: [
    { path: "../../public/fonts/berkeley-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/berkeley-mono-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-mono",
});

export default berkeleyMono;
```

### Dynamic Import Pattern

```typescript
// src/app/page.tsx — below-fold imports
import dynamic from "next/dynamic";

const SkillsSection = dynamic(() => import("@/components/SkillsSection"), { ssr: false });
const FeaturedProjects = dynamic(() => import("@/components/FeaturedProjects"), { ssr: false });
const StatusSection = dynamic(() => import("@/components/StatusSection"), { ssr: false });
const ServicesSection = dynamic(() => import("@/components/ServicesSection"), { ssr: false });

// Static imports remain unchanged
import GhostAvatar from "@/components/GhostAvatar";
import Background from "@/components/Background";
import HomeTerminal from "@/components/HomeTerminal";
```

### Background Visibility Guard

```typescript
// In Background.tsx — modify the draw callback (line ~192)
const draw = useCallback(() => {
  // ... existing drawing logic ...

  // Guard: stop rAF loop when tab is hidden
  if (document.visibilityState === "visible") {
    animationRef.current = requestAnimationFrame(drawRef.current);
  }
}, [/* deps */]);

// New useEffect for visibilitychange listener
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible" && !animationRef.current) {
      animationRef.current = requestAnimationFrame(drawRef.current);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };
}, [draw]);
```

---

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | TechIcon renders SVG for each name, handles unknown name | Vitest + render, check for `<svg>` element |
| Unit | PageTransition class toggle behavior | Vitest + render, mock `usePathname`, verify class application |
| Integration | Dynamic imports produce separate chunks | Build output analysis (`npm run build` + check `.next/static/chunks/`) |
| E2E | CTA visible within 1s | Lighthouse CI or manual check |
| E2E | No external font requests | Network tab verification |
| Manual | Background pauses when tab hidden | Browser DevTools Performance tab |

---

## Migration / Rollout

No data migration required. Each slice is independent:

1. **Slice 1** (PageTransition + CTA): Self-contained CSS/JS change. Revert by restoring framer-motion import.
2. **Slice 2** (Font): Requires downloading WOFF2 files to `public/fonts/`. Revert by restoring `<link>` tag.
3. **Slice 3** (Dynamic imports): Pure import change. Revert by converting back to static imports.
4. **Slice 4** (TechIcon): Requires creating component + SVG assets. Revert by restoring StackIcon import.
5. **Slice 5** (Background): Single useEffect addition. Revert by removing the visibility check.

Recommended order: Slice 1 → Slice 5 → Slice 3 → Slice 2 → Slice 4 (easiest first, font/SVG last due to asset sourcing).

---

## Open Questions

- [ ] **WOFF2 source**: Where to obtain Berkeley Mono WOFF2 files? Fontshare provides download links — need to verify exact URLs for weights 400 and 700.
- [ ] **SVG sourcing**: Should we use SimpleIcons CDN URLs as reference and manually create inline SVGs, or extract from the tech-stack-icons package source?
- [ ] **Reveal component interaction with dynamic imports**: The `Reveal` component wraps each below-fold section. Does it handle `ssr: false` children gracefully, or does it need adjustment?
