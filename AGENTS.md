# Repository Instructions

This repository is the local baseline for Thiscloud Center. It is intentionally
documentation- and policy-first; application sources, manifests, and runnable
tooling will be introduced in later feature branches.

## Current Boundaries

- Planned client: Flutter for web, mobile, and desktop.
- Planned API: TypeScript modular monolith with capability-owned modules.
- Planned contract: OpenAPI between the client and API.
- This baseline does not claim that any build, test, lint, format, type-check,
  code-generation, deployment, or CI command is available.

## Delivery Rules

- Use Conventional Commits.
- Work on feature branches; do not work directly on `main`.
- Use the feature-branch chain: tracker, then each child PR targets its
  immediate parent branch.
- Keep each child PR at or below 400 changed lines. Ask before exceeding that
  limit.
- Do not add AI attribution or `Co-Authored-By` trailers.

## Change Discipline

- Add only files justified by the current architecture and approved scope.
- Do not invent commands, dependencies, CI checks, infrastructure, or runtime
  configuration before the corresponding implementation exists.
- Keep tests and documentation with the behavior they verify or explain.
- Update this file when repository structure or delivery rules change.
