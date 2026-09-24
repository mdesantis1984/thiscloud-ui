# Contributing

[Español](CONTRIBUTING.es.md) · [Documentation](docs/README.en.md)

Changes to Thiscloud UI Aurora use an issue-first, reviewable workflow. Start with the approved issue and the relevant package documentation. This guide describes the repository workflow, not a live audit of GitHub branch-protection settings.

## Workflow

1. Propose or select an issue with one observable outcome, scope, acceptance evidence and [Delivery impact](.github/ISSUE_TEMPLATE/documentation.yml). Wait for the authorized owner to apply `status:approved` before implementation.
2. Branch from `develop` using `type/description` (for example, `docs/contribution-guide`). Implement one cohesive work unit with its applicable tests and documentation.
3. Run focused verification and `git diff --check`; record actual results, limitations, risk and a rollback boundary. Commit with a Conventional Commit message.
4. Open a PR to `develop` using the [PR template](.github/PULL_REQUEST_TEMPLATE.md). Include `Closes #<approved-issue-number>`, select one change type, apply exactly one matching `type:*` label and fill in chain context, verification and Delivery Impact with concrete evidence. The five impact classifications must match the linked issue's selections, not just the PR author's expectations.
5. Obtain current-base checks and explicit owner review before a merge; a passing check alone is not acceptance. Do not claim a release or publication from a repository-only change.

For ordinary work-unit PRs, the [validator](scripts/validate-pr-policy.mjs) counts additions plus deletions and rejects more than **1000** changed lines unless a repository administrator applies `size:exception` and the PR contains a concrete Size Exception Rationale. Smaller review slices (around 400 lines) can help reviewers but are optional guidance, not a gate. Split independently reviewable outcomes into ordered PRs; do not combine unrelated work to fill a budget.

## Branch model

- The [PR policy](scripts/validate-pr-policy.mjs) accepts typed work-unit branches into `develop`, `develop` into `main` for promotion, and `fix/description` into `main` for emergency fixes.
- The documented workflow reviews work units on `develop` before promotion to `main`. Promotion PRs may aggregate previously reviewed units and are exempt from the 1000-line gate; do not introduce new implementation there. Carry emergency fixes back to `develop` after release.
- [CODEOWNERS](.github/CODEOWNERS) identifies review ownership; it does not prove current GitHub permissions, merge methods or protection settings. Follow the current repository controls and obtain owner authorization for merges.

## Verification

From the repository root, run focused checks for the surface you changed. For web and catalog work, the current [package scripts](package.json) expose:

```bash
pnpm check:web
pnpm check:release
git diff --check
```

Run `check:web` and `check:release` sequentially; both build or consume catalog output. They do not verify Markdown links or translation parity. Flutter changes additionally require the pinned SDK and package checks in [`packages/ui_kit/README.md`](packages/ui_kit/README.md). For docs-only changes, inspect local links and matching Spanish/English claims; report which executable checks ran and which were not applicable. Do not add generated artifacts or secrets.

## Commits

Use `type(scope): outcome`, for example `docs(maintainers): clarify contribution steps`. Keep tests and documentation with the work unit and identify the files or behavior that can be reverted without undoing unrelated work.

## Review checklist

- [ ] The PR links an approved issue; Delivery Impact matches its selections and cites concrete evidence.
- [ ] The PR has exactly one `type:*` label and a valid branch, target and Conventional Commit.
- [ ] The PR meets the 1000-line gate or documents an administrator-approved exception.
- [ ] Actual checks, limitations, risk and rollback boundary are explicit; new base changes receive fresh checks.
- [ ] No secrets, generated outputs or unrelated product code are included; owner review remains pending until explicitly given.
