# Performance Optimization — Delta Specs

## 1. PageTransition: CSS Transition

### Requirement: PageTransition Fade-In Behavior

The system SHALL replace framer-motion with a CSS class toggle for page transition opacity fade-in. The component MUST retain `mounted` and `reducedMotion` guards.

#### Scenario: Normal page load fade-in

- GIVEN the component mounts and `mounted` becomes `true`
- WHEN the `fade-in` CSS class is applied to the container
- THEN the container transitions `opacity: 0 → 1` over 80ms ease-out
- AND the animation uses `animation-fill-mode: forwards` to persist final state

#### Scenario: Reduced motion preference enabled

- GIVEN `prefers-reduced-motion: reduce` is active
- WHEN the component renders
- THEN no CSS animation or transition is applied
- AND content is displayed at full opacity immediately

#### Scenario: SSR / pre-mount render

- GIVEN the component is server-rendered or before `useEffect` runs
- WHEN the initial HTML is produced
- THEN children render inside a plain `<div>` with the container class
- AND no animation class is applied (avoids hydration mismatch)

#### Scenario: Route change triggers re-animation

- GIVEN the user navigates to a new route (pathname changes)
- WHEN `PageTransition` re-renders with the new `pathname`
- THEN the `fade-in` class is re-applied to the container
- AND the opacity transition replays from 0 → 1

### Requirement: framer-motion Dependency Removal

The system SHALL NOT include `framer-motion` in the production bundle. The `package.json` dependency and all `import { motion }` statements MUST be removed.

#### Scenario: Bundle size verification

- GIVEN the production build completes
- WHEN inspecting the client bundle
- THEN `framer-motion` contributes 0 bytes to the bundle
- AND the `motion` import is absent from `PageTransition.tsx`

---

## 2. Font Loading: Self-Hosted Berkeley Mono

### Requirement: next/font/local Configuration

The system SHALL serve Berkeley Mono via `next/font/local` with weights 400 and 700 only. The font MUST use `display: "swap"` and expose a CSS variable.

#### Scenario: Font loads from local WOFF2

- GIVEN the application starts
- WHEN the browser requests the font file
- THEN the request is served from `_next/static` (self-hosted)
- AND no external requests to `api.fontshare.com` are made for fonts

#### Scenario: FOUT with display swap

- GIVEN a slow network connection
- WHEN the page renders before the WOFF2 font loads
- THEN the browser falls back to the system monospace font
- AND once WOFF2 loads, text re-renders with Berkeley Mono without layout shift

#### Scenario: CSS variable propagation

- GIVEN the `localFont` object is applied to `<html>` or `<body>`
- WHEN components reference `var(--font-mono)` or the font variable
- THEN the CSS variable resolves to Berkeley Mono 400/700

### Requirement: External Font Request Removal

The system SHALL NOT include `<link href="https://api.fontshare.com/...">` in `layout.tsx`. No `preconnect` to fontshare is needed once self-hosting is active.

#### Scenario: Clean layout head

- GIVEN the production build of `layout.tsx`
- WHEN inspecting the `<head>` output
- THEN no `<link>` tags reference `api.fontshare.com`
- AND no `preconnect` hints exist for fontshare domains

---

## 3. Dynamic Imports: Below-Fold Sections

### Requirement: Code-Split Below-Fold Components

The system SHALL use `next/dynamic` to lazily load `SkillsSection`, `FeaturedProjects`, `StatusSection`, and `ServicesSection`. These components MUST NOT be included in the initial JavaScript chunk.

#### Scenario: Initial page load excludes below-fold JS

- GIVEN a user visits the home page
- WHEN the browser parses the initial HTML and JS bundle
- THEN `SkillsSection`, `FeaturedProjects`, `StatusSection`, and `ServicesSection` are NOT in the initial chunk
- AND `GhostAvatar`, `Background`, `HomeTerminal` remain static imports

#### Scenario: Dynamic section loads on scroll

- GIVEN the page has loaded without the below-fold sections
- WHEN the user scrolls near a section's viewport position
- THEN the browser fetches and renders the section's JavaScript
- AND a loading placeholder is shown during fetch (if configured)

#### Scenario: SSR disabled for dynamic sections

- GIVEN the server renders the page
- WHEN the dynamic sections are server-rendered
- THEN they render as empty or placeholder markup (no SSR)
- AND hydration occurs client-side when the chunk loads

### Requirement: Loading Placeholder

The system SHOULD render a loading state while dynamic chunks fetch. The placeholder SHOULD approximate the section's final dimensions to prevent layout shift.

#### Scenario: Slow network shows placeholder

- GIVEN a slow 3G connection
- WHEN a below-fold section is triggered by scroll
- THEN a placeholder element with matching dimensions is visible
- AND the actual section replaces it once loaded

---

## 4. CTA Animation Timing

### Requirement: Staggered Hero Reveal Sequence

The system SHALL use the following animation delays for hero elements: title 100ms, subtitle 250ms, CTA buttons 500ms. All elements use `fadeInUp 0.5s ease-out` with `forwards` fill mode.

#### Scenario: CTA visible within 1 second

- GIVEN the page loads
- WHEN the animation timeline completes
- THEN the CTA buttons are fully visible at 1000ms (500ms delay + 500ms duration)
- AND the title is visible at 600ms, subtitle at 750ms

#### Scenario: Reduced motion skips animations

- GIVEN `prefers-reduced-motion: reduce` is active
- WHEN the page renders
- THEN all hero elements display at full opacity immediately
- AND no `animation-delay` or `fadeInUp` is applied

#### Scenario: No 4.5-second CTA invisibility

- GIVEN a normal page load
- WHEN inspecting the CTA's animation property
- THEN the delay is 500ms (not 4500ms)
- AND the CTA is interactive and visible within the first second

---

## 5. Background Visibility Guard

### Requirement: rAF Pause on Tab Hidden

The system SHALL pause the `requestAnimationFrame` draw loop when `document.visibilityState` is `"hidden"`. The loop MUST resume when the tab becomes visible again.

#### Scenario: Tab hidden pauses animation

- GIVEN the Background component's rAF loop is running
- WHEN the user switches to another tab (visibilityState becomes "hidden")
- THEN `requestAnimationFrame` is NOT called for the next frame
- AND no CPU cycles are consumed by the draw loop

#### Scenario: Tab visible resumes animation

- GIVEN the rAF loop is paused because the tab is hidden
- WHEN the user switches back (visibilityState becomes "visible")
- THEN the rAF loop restarts via a `visibilitychange` event listener
- AND the animation continues from the current state

#### Scenario: Initial load starts loop normally

- GIVEN the Background component mounts
- WHEN `visibilityState` is `"visible"` (default)
- THEN the rAF loop starts immediately via `requestAnimationFrame`
- AND the dot pattern animates as expected

#### Scenario: Multiple visibility toggles

- GIVEN the user switches tabs 5 times rapidly
- WHEN each `visibilitychange` fires
- THEN the rAF loop correctly pauses and resumes each time
- AND no duplicate loops accumulate (each resume cancels any pending frame)

---

## 6. TechIcon Component

### Requirement: SVG Icon Mapping Interface

The system SHALL provide a `TechIcon` component that maps an icon name string to an inline SVG. The component MUST support the following 21 icon names: `react`, `nextjs`, `typescript`, `js`, `html5`, `css3`, `tailwindcss`, `nodejs`, `expressjs`, `python`, `postgresql`, `mongodb`, `redis`, `docker`, `git`, `vercel`, `aws`, `vitejs`, `eslint`, `prettier`.

#### Scenario: Render known icon

- GIVEN `<TechIcon name="react" />` is rendered
- WHEN the component mounts
- THEN an inline SVG for the React logo is displayed
- AND the SVG is approximately 1-3KB in size

#### Scenario: Unknown icon name

- GIVEN `<TechIcon name="unknown-tech" />` is rendered
- WHEN the component mounts
- THEN it renders a fallback (empty or placeholder) without crashing

#### Scenario: Grayscale variant

- GIVEN `<TechIcon name="react" variant="grayscale" />` is rendered
- WHEN the SVG is painted
- THEN the icon displays in grayscale (desaturated)
- AND the base shape and proportions match the color variant

### Requirement: tech-stack-icons Dependency Removal

The system SHALL NOT include `tech-stack-icons` in the production bundle. The `package.json` dependency MUST be removed.

#### Scenario: Bundle size reduction

- GIVEN the production build completes
- WHEN inspecting the client bundle
- THEN `tech-stack-icons` contributes 0 bytes
- AND 21 inline SVGs total approximately 40-60KB (vs. 8.7MB previous)

### Requirement: SkillsSection Integration

The system SHALL replace `<StackIcon name={...} />` with `<TechIcon name={...} />` in `SkillsSection.tsx`. The `variant="grayscale"` prop MUST be preserved.

#### Scenario: Skills section renders all icons

- GIVEN the SkillsSection component renders
- WHEN all skill categories display
- THEN each skill shows its corresponding TechIcon in grayscale
- AND no `StackIcon` or `tech-stack-icons` import exists in the file
