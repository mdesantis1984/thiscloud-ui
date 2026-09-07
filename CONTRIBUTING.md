# Contributing

Changes to Thiscloud UI Aurora use an issue-first, reviewable workflow. Read [`AGENTS.md`](AGENTS.md) and the relevant issue before editing the repository.

## Workflow

1. Create or select an issue that describes one observable outcome.
2. Wait for the owner to apply `status:approved`.
3. Create a branch named `type/description` from the intended parent branch.
4. Implement one cohesive work unit with its tests and documentation.
5. Run the focused verification and `git diff --check`.
6. Commit using Conventional Commits.
7. Open a PR linking the approved issue and apply exactly one `type:*` label.
8. Merge only after required checks and owner approval.

Use chained PRs when a change cannot remain below 400 changed lines without mixing concerns. Each child targets its immediate parent and remains independently reviewable.

## Verification

Web and catalog changes require:

```bash
pnpm install --frozen-lockfile
pnpm check:web
git diff --check
```

Flutter changes additionally require the pinned SDK and package checks documented in [`packages/ui_kit/README.md`](packages/ui_kit/README.md).

## Commits

Use `type(scope): outcome`, for example `feat(web): add select control contract` or `ci(release): publish verified package assets`. Never add AI attribution or `Co-Authored-By` trailers.

## Review checklist

- [ ] The PR links an approved issue.
- [ ] The PR has exactly one `type:*` label.
- [ ] The branch and commit names follow repository conventions.
- [ ] The change stays within the 400-line review budget.
- [ ] Verification evidence and runtime limitations are explicit.
- [ ] No secrets, generated outputs, or unrelated product code are included.
