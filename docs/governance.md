# Repository governance

Thiscloud UI Aurora is public for transparent consumption and review. Repository write and merge authority remains limited to `mdesantis1984`.

## Protected branches

| Branch | Purpose | Accepted changes |
| --- | --- | --- |
| `develop` | Integration | Approved, verified work-unit PRs |
| `main` | Production | Promotion from `develop` or bounded emergency fixes |

Both branches require pull requests, passing status checks, linear history, resolved conversations, and protection from force pushes or deletion. Direct pushes are prohibited.

## Review authority

`CODEOWNERS` assigns the entire repository to `mdesantis1984`, and no other account receives write access. GitHub does not allow a PR author to approve their own PR. Because this is currently a single-maintainer repository, branch protection requires green checks but does not require a numeric approval that would deadlock maintainer-authored changes.

For an external contribution, only the maintainer can merge it or provide a review with repository authority. If another maintainer is added later, enable one required CODEOWNER approval and retain stale-review dismissal.

## Promotion rule

A promotion PR from `develop` to `main` contains only commits already reviewed as bounded work units. It may exceed the 400-line aggregate budget, but it must not introduce new implementation changes. Release tags are accepted only when their commit is contained in `main`.

## Repository settings

- Visibility: public.
- Merge strategy: squash for work-unit PRs; no direct pushes.
- Issues: enabled and required before PR creation.
- Wiki: disabled; versioned documentation lives in this repository.
- Dependabot alerts, security updates, and private vulnerability reporting: enabled.
- Actions: read-only token permissions by default; release publication elevates only the required job.
