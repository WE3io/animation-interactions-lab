# Contributing

## Prerequisites

- Node.js 22+
- pnpm 10+

## Local workflow

1. Fork and create a branch from `main`.
2. Install dependencies: `pnpm install`.
3. Make focused changes.
4. Run quality checks:
   - `pnpm check`
   - `pnpm test`
5. Open a pull request with:
   - purpose
   - behavior changes
   - test evidence

## Project conventions

- Keep each interaction reusable under `src/interactions/<name>/`.
- Provide an example page under `src/pages/examples/<name>.astro`.
- Add or update Playwright regressions in `tests/` for behavior changes.
- Keep docs aligned with implementation.

## Scope management

- Prefer small, reviewable PRs.
- Do not include unrelated refactors.
- If behavior changes, update tests in the same PR.
