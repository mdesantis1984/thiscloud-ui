# Automation

| Workflow | Trigger | Contract |
| --- | --- | --- |
| `ci.yml` | Pull requests and `main` pushes | Verifies web/catalog, release assets, deployment config, and Flutter boundaries |
| `pr-policy.yml` | Pull request metadata changes | Enforces branch naming, approved issue linkage, one `type:*` label, and the 400-line budget |
| `release.yml` | `ui-web-v*` tag | Creates verified release assets and publishes the matching GHCR catalog image |

External actions are pinned to commit SHAs. Dependabot updates those pins through reviewable pull requests. Workflows use read-only permissions unless a job explicitly needs release or package publication rights.
