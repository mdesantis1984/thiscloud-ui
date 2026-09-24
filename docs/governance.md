# Repository governance and review evidence

[Español](governance.es.md) · [Documentation index](README.en.md)

The [contribution guide](../CONTRIBUTING.md) documents an issue-first workflow: an approved issue, a cohesive work unit on a typed branch from `develop`, focused verification and a PR for review. This page describes the repository's documented and executable rules, **not** a live audit of GitHub settings or an additional approval policy.

## Branch and ownership path

| Change | Documented route | Evidence |
| --- | --- | --- |
| Normal work, including docs | `docs/*` or another permitted typed branch into `develop` | [Contribution guide](../CONTRIBUTING.md), [PR validator](../scripts/validate-pr-policy.mjs) |
| Promotion | `develop` into `main`, without new implementation | [Contribution guide](../CONTRIBUTING.md), [PR validator](../scripts/validate-pr-policy.mjs) |
| Emergency fix | `fix/*` from `main` into `main`, then reconcile with `develop` | [Contribution guide](../CONTRIBUTING.md), [PR validator](../scripts/validate-pr-policy.mjs) |

[`CODEOWNERS`](../.github/CODEOWNERS) assigns the repository paths to `mdesantis1984`. It does not prove current permissions, required-review counts, merge settings or branch protection. Those settings require separate GitHub readback; follow the [contribution guide](../CONTRIBUTING.md) for the documented route rather than treating this page as proof of platform enforcement.

## Executable PR policy

The [PR policy workflow](../.github/workflows/pr-policy.yml) runs trusted policy code from the PR base on `pull_request_target`, with read-only token permissions. The [validator](../scripts/validate-pr-policy.mjs) checks the branch flow, exactly one `type:*` label, an approved linked issue for non-Dependabot PRs, and a `Delivery Impact` section consistent with the linked issue's classifications and concrete evidence. Check the actual issue body before opening a PR; approval metadata alone does not establish matching impact choices.

| Budget | Meaning |
| --- | --- |
| 1000 changed lines (additions + deletions) | Executable [PR validator](../scripts/validate-pr-policy.mjs) threshold for non-promotion PRs; over-budget PRs require `size:exception`, a rationale and administrator provenance. |
| Approximately 400 authored lines | Optional review-size guidance for planning cohesive slices; not a repository requirement or automated gate, and does not alter the enforced 1000-line threshold. |

The validator recognizes `dependabot[bot]` targeting `develop` from a `dependabot/*` branch as the issue-link exception; the label and size checks still apply. It also exempts `develop` → `main` promotions from the size threshold, not from their other metadata checks. The [contribution guide](../CONTRIBUTING.md) describes human review and merge intent; this workflow alone does not establish who can merge on GitHub.

## Scope and limits

Documentation and PR metadata do not grant write, merge, publication or deployment authority. Check the current [contribution guide](../CONTRIBUTING.md), [PR policy source](../scripts/validate-pr-policy.mjs) and [workflow](../.github/workflows/pr-policy.yml) before proposing a change; request platform-settings evidence separately when needed. Security reporting remains in the existing [security policy](../SECURITY.md); no new reporting channel or service commitment is declared here.
