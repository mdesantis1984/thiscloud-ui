# Automation

| Workflow | Trigger | Contract |
| --- | --- | --- |
| `ci.yml` | Pull requests | Verifies web/catalog, release assets, deployment config, and Flutter boundaries on `ubuntu-latest` |
| `ci-push.yml` | `main`/`develop` pushes | Verifies web/catalog, release assets, deployment config, and Flutter boundaries on `[self-hosted, Linux, X64, private-thiscloud-ui]` |
| `pr-policy.yml` | Pull request metadata changes | Enforces branch naming, approved issue linkage, one `type:*` label, and the 1000-line budget on `ubuntu-latest` |
| `release.yml` | `ui-web-v*` tag | Creates verified release assets and publishes the matching GHCR catalog image on `[self-hosted, Linux, X64, private-thiscloud-ui]` |

External actions are pinned to commit SHAs. Dependabot updates those pins through reviewable pull requests. Workflows use read-only permissions unless a job explicitly needs release or package publication rights.

Repository protection requires CI and policy checks on both `main` and `develop`. Promotion PRs from `develop` to `main` may exceed 1000 aggregate lines only because each included work unit was already reviewed under that limit.

Pull-request workflows do not run on the private self-hosted runner. Trusted `push` and tag workflows use it only after the runner meets the documented repository access and toolchain prerequisites.
