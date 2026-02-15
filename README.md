# Animation Interactions Lab

Reusable Astro components for animation interactions, each with an example page and lightweight regression tests.

Current interaction:
- Stacked cards (`/examples/stacked-cards`)

## Package manager

Use `pnpm` only.

## Setup

```bash
pnpm install
pnpm dev
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm test
pnpm test:ui
```

Note: first test run may require browser binaries:

```bash
pnpm exec playwright install chromium
```

## Interaction component API

`src/interactions/stacked-cards/StackedCardsSection.astro`

Props:
- `id?: string`
- `title?: string`
- `cards: StackedCardItem[]`
- `animation?: Partial<StackedCardsAnimationOptions>`
- `pinMode?: "sticky" | "gsap"` (default: `"gsap"`)
- `class?: string`

Slot:
- `pinned`

## Types

`src/interactions/stacked-cards/types.ts`

- `StackedCardItem`
- `StackedCardsAnimationOptions`
- `StackedCardsInitOptions`

## Behavior defaults

- Desktop: step-based wheel interaction using GSAP `Observer` + `ScrollTrigger`.
- `pinMode="gsap"` pins the full section during the interaction.
- Reduced-motion users get static, readable cards.
- Mobile (`max-width: 900px`) falls back to static card flow.

## Lifecycle

- Initialization is delayed until section visibility via `IntersectionObserver`.
- Cleanup is wired via `astro:before-swap`.
- Resize refresh re-evaluates static/enhanced mode.

## Regression tests

`tests/stacked-cards.spec.ts` covers:
- card layering order
- pin alignment while exiting interaction
- direction-change robustness
- mobile static fallback
