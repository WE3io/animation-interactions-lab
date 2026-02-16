# Releasing

This repository follows a lightweight release process for open-source maintenance.

## Release checklist

1. Ensure `main` is green in CI.
2. Pull latest changes.
3. Verify locally:
   - `pnpm install --frozen-lockfile`
   - `pnpm check`
   - `pnpm test`
4. Confirm docs are current (`README.md`, `docs/`, governance files).
5. Update version in `package.json` if publishing a new tagged release.
6. Commit release prep changes.
7. Create an annotated git tag: `vX.Y.Z`.
8. Push commit and tag.
9. Create GitHub Release notes:
   - Summary
   - Breaking changes
   - Migration notes (if any)
   - Validation evidence

## Versioning guidance

- Patch: fixes and non-breaking cleanup
- Minor: new interactions or non-breaking capabilities
- Major: breaking API/structure changes

## Suggested commands

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
git tag -a v0.1.0 -m "v0.1.0"
git push origin main --tags
```

## Rollback guidance

- If a release is faulty, publish a patch release that reverts/fixes behavior.
- Avoid deleting published tags unless absolutely necessary.
