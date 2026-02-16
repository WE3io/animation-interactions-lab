# Architecture

## Goal

Maintain reusable, testable animation interactions with clear separation between implementation and examples.

## Structure

- `src/interactions/<interaction>/`: reusable interaction code (component, runtime, styles, types)
- `src/pages/examples/<interaction>.astro`: interaction demos
- `tests/*.spec.ts`: browser regressions for behavior

## Interaction contract

Each interaction should include:

1. Astro component entry point
2. Runtime/boot modules as needed
3. Local style module
4. Typed options
5. Example page
6. Regression tests for key behavior

## Quality gates

- `pnpm check` must pass
- `pnpm test` must pass
- docs must reflect behavior changes
