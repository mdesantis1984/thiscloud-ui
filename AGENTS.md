# Repository Instructions

This repository is the independent source of truth for Thiscloud UI Aurora. It owns reusable UI packages, the catalog, release artifacts, and their verification. Product applications, including Thiscloud Center, are consumers and must remain outside this repository.

## Current Boundaries

- Web/hybrid RC1 exposes exactly `TcSwitch`, `TcTextField`, `ValidationControl`, and `attachFormValidation(nativeForm, options)`.
- The other 67 catalog routes are design demos and must not claim public APIs.
- Flutter `packages/ui_kit` remains an incubation package with no runtime component API.
- Catalog source is in `apps/catalog/`; generated `dist/` content is ignored.
- `pnpm check:web` is the required web verification command.
- `pnpm release:prepare` produces local release assets without publishing them.

## Delivery Rules

- Use Conventional Commits and branches matching `type/description`.
- Do not work directly on `main`.
- Every PR must link an issue carrying `status:approved` and have exactly one `type:*` label.
- Keep each PR at or below 400 changed lines. Ask before exceeding that limit.
- Keep tests and user-facing documentation with the behavior they verify.
- Feature work targets protected `develop`; reviewed release promotions merge `develop` into protected `main`.
- Merge only after required checks pass and maintainer authorization. Squash work-unit PRs into `develop`; use a merge commit for `develop` to `main` promotions so both protected branches retain shared ancestry.
- Direct pushes, force pushes, and branch deletion are forbidden on `main` and `develop`.
- Do not add AI attribution or `Co-Authored-By` trailers.

## Change Discipline

- Preserve the product boundary: no Center imports, product copy, application state, authentication, persistence, or network policy in Aurora packages.
- Public package exports and catalog API badges must describe implemented, tested behavior only.
- Never commit generated outputs, local metadata, secrets, package caches, or release archives.
- Pin runtime and CI tool versions. Update lockfiles in the same work unit as dependency changes.
- Update this file when repository structure, verification commands, or delivery rules change.
