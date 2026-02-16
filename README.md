# Animation Interactions Lab

<table style="background-color: #F4EAD0;color: #29004B;">
  <tr>
    <td width="132" style="border:none; background-color: #F4EAD0;" valign="middle">
      <a href="https://we3.io"><img src="./assets/WE3io-logo-200px.png" alt="WE3io" width="40" /></a>
    </td>
    <td style="border:none; background-color: #F4EAD0;">
      <strong>WE3</strong> builds products and companies with senior Product, Design, and Engineering teams. This repository is part of our open-source community offerings. <a href="https://we3.io/brief">Start your brief</a>.
    </td>
  </tr>
</table>

---

Reusable Astro components for animation interactions, with example pages and lightweight browser regression tests.

## Quick navigation

[What this is](#what-this-is) · [Who this is for](#who-this-is-for) · [Repository layout](#repository-layout) · [Setup](#setup) · [Quality](#quality) · [Contributing](#contributing)

---

## What this is

A pnpm-based Astro project that houses reusable animation interaction components under `src/interactions/*` and validates behavior with Playwright tests.

Current interaction:
- Stacked cards (`/examples/stacked-cards`)

## Who this is for

- Engineers building or maintaining animation interactions
- Contributors adding new reusable interaction components
- Teams that want deterministic interaction behavior with lightweight regression coverage

## Repository layout

```text
animation-interactions-lab/
├── .github/workflows/              # CI + docs QA automation
├── backlog/
│   ├── active/                     # Work in progress
│   └── done/                       # Completed work
├── docs/
│   ├── architecture.md             # Technical conventions
│   └── adding-an-interaction.md    # New interaction checklist
├── src/
│   ├── interactions/
│   │   └── stacked-cards/          # Reusable interaction implementation
│   ├── pages/
│   │   ├── examples/               # Demo routes per interaction
│   │   └── index.astro             # Interaction catalog entry page
│   └── env.d.ts
├── tests/                          # Playwright regression tests
├── package.json
└── pnpm-lock.yaml
```

## Package manager

This repo is pnpm-only.

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

First test run may require browser binaries:

```bash
pnpm exec playwright install chromium
```

## Component API (stacked cards)

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

Types:
- `src/interactions/stacked-cards/types.ts`

## Quality

- Type + Astro checks: `pnpm check`
- Browser regressions: `pnpm test`
- CI runs both on pull requests.

## Contributing

See `CONTRIBUTING.md` for local workflow and quality expectations.

## License

MIT. See `LICENSE`.
