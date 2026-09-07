# Repository Instructions

This repository is the local baseline for Thiscloud Center. It remains
documentation- and policy-first; the UI catalog prototype now has a local,
reproducible publication toolchain.

## Current Boundaries

- RC1 client surface is web/hybrid-first: `TcSwitch`/`<tc-switch>`, `TcTextField`/`<tc-text-field>`, the `ValidationControl` type contract, and `attachFormValidation(nativeForm, options)`. Flutter/native remains deferred.
- Planned API: TypeScript modular monolith with capability-owned modules.
- Planned contract: OpenAPI between the client and API.
- UI catalog source is at `docs/prototypes/thiscloud-ui-framework/`:
  `framework-preview.html`, `catalog.css`, and `catalog.js` remain readable.
- The catalog has four verified RC API routes (Switch, TextField, Field, Form); its other 67 routes are design demos with no public `Tc*` or `tc.ui.*` API.
- `pnpm ui-catalog:dev-build`, `pnpm ui-catalog:build`,
  `pnpm ui-catalog:verify`, `pnpm ui-catalog:test-server`, and
  `pnpm ui-catalog:serve` are available after `pnpm install`.
- `pnpm ui-web:test` verifies the packed public web-core in an isolated browser host;
  `pnpm ui-web:pack` creates a local tarball only under ignored `tmp/ui-web-pack/`.
- The catalog build writes generated minified and production-obfuscated output
  to `docs/prototypes/thiscloud-ui-framework/dist/`; that directory is ignored
  and must not be force-added.
- No broader application build, test, lint, format, type-check, deployment, or
  CI command is claimed by this baseline.

## Delivery Rules

- Use Conventional Commits.
- Work on feature branches; do not work directly on `main`.
- Use the feature-branch chain: tracker, then each child PR targets its
  immediate parent branch.
- Keep each child PR at or below 400 changed lines. Ask before exceeding that
  limit.
- After each completed phase, verify it, create a Conventional Commit, push
  the branch, and open or update the applicable chained child PR. Merge only
  after required checks pass and owner approval; no `develop` branch is used.
- Do not add AI attribution or `Co-Authored-By` trailers.

## Change Discipline

- Add only files justified by the current architecture and approved scope.
- Do not invent commands, dependencies, CI checks, infrastructure, or runtime
  configuration before the corresponding implementation exists.
- Keep tests and documentation with the behavior they verify or explain.
- Update this file when repository structure or delivery rules change.
