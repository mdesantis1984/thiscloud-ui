# Contributing

This repository is being built in small, reviewable work units. Read the
repository [`AGENTS.md`](AGENTS.md) and the relevant issue before changing
files.

## Workflow

1. Start from the current `main` or the immediate parent branch named by the
   feature chain.
2. Create a branch matching `type/description`, for example
   `feat/openapi-contract` or `docs/repository-baseline`.
3. Create a tracker issue for the work and obtain owner approval by having the
   `status:approved` label applied before creating child work.
4. Keep the child PR focused and at or below 400 changed lines.
5. Target the immediate parent branch, not `main`, for every child PR.
6. Include focused verification, or state why verification is not yet
   applicable when adding a baseline-only change.

The planned chain is: tracker, contracts/tooling, identity/access, client
shell, then sync/MCP/infrastructure gate. The tracker issue is the chain's
parent record; each child PR must target its immediate parent branch.

## Publication Gate

Before any push or publication:

1. The repository owner must create the GitHub repository as private.
2. The owner must verify the repository header or `Settings > General` shows
   `Private`; do not rely on the intended repository name or local Git state.
3. The owner must explicitly authorize publication after the visibility check.

Do not add a remote, push a branch, create a PR, or publish repository content
before all three checks pass. A tracker issue may be drafted locally, but issue
creation and approval are owner actions once the private repository exists.

## Commits

Use Conventional Commits, such as `docs: add repository baseline` or
`feat(api): add session contract`. Do not add AI attribution or
`Co-Authored-By` trailers.

## Review Checklist

- [ ] The change has one clear purpose and a linked issue.
- [ ] The diff is no larger than 400 changed lines for the child PR.
- [ ] Tests, documentation, and configuration are included with the work they
      verify or explain.
- [ ] Secrets and local environment files are not included.
- [ ] Verification results and any limitations are stated in the PR.
