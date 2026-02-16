# Adding an Interaction

Checklist for adding a new animation interaction.

## 1. Create implementation

- Add `src/interactions/<name>/`
- Add:
  - `<Name>Section.astro` (or equivalent)
  - runtime modules (`boot.ts`, `init*.ts`) as needed
  - `<name>.css`
  - `types.ts`

## 2. Add example route

- Create `src/pages/examples/<name>.astro`
- Link from `src/pages/index.astro`

## 3. Add regression tests

- Create/extend `tests/<name>.spec.ts`
- Cover critical behavior and fallbacks

## 4. Update docs

- Update `README.md`
- Update architecture notes if conventions changed

## 5. Validate

- `pnpm check`
- `pnpm test`
