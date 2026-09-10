# Contributing

Changes to Thiscloud UI Aurora use an issue-first, reviewable workflow. Read this guide, the relevant package documentation, and the approved issue before editing the repository.

## Workflow

1. Create or select an issue that describes one observable outcome.
2. Wait for the owner to apply `status:approved`.
3. Create a branch named `type/description` from `develop`.
4. Implement one cohesive work unit with its tests and documentation.
5. Run the focused verification locally and `git diff --check` before pushing.
6. Commit using Conventional Commits.
7. Open a PR linking the approved issue and apply exactly one `type:*` label.
8. Merge only after required checks and owner approval.

Use chained PRs when a change cannot remain below 400 changed lines without mixing concerns. Each child remains independently reviewable; merge the chain into `develop` in dependency order before promotion.

## Branch model

- `develop` is the protected integration branch and target for normal work-unit PRs.
- `main` is the protected production branch and accepts reviewed promotions from `develop` or bounded emergency fixes.
- A `develop` to `main` promotion may aggregate work units that were already reviewed individually; do not add new implementation changes to that PR.
- Squash work-unit PRs into `develop`, but merge promotion PRs into `main` with a merge commit so future promotions retain a clean common ancestor.
- Emergency fixes branch from `main`, use `fix/description`, and must be applied back to `develop` after release.
- Only `mdesantis1984` has repository write and merge authority. External contributors work through forks and PRs.

## Verification

Web and catalog changes require:

```bash
pnpm install --frozen-lockfile
pnpm check:web
git diff --check
```

Flutter changes additionally require the pinned SDK and package checks documented in [`packages/ui_kit/README.md`](packages/ui_kit/README.md).

## Commits

Use `type(scope): outcome`, for example `feat(web): add select control contract` or `ci(release): publish verified package assets`.

## Review checklist

- [ ] The PR links an approved issue.
- [ ] The PR has exactly one `type:*` label.
- [ ] The branch and commit names follow repository conventions.
- [ ] The change stays within the 400-line review budget.
- [ ] Verification evidence and runtime limitations are explicit.
- [ ] No secrets, generated outputs, or unrelated product code are included.
