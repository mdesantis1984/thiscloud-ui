# Documentation Program

| Field | Value |
| --- | --- |
| Status | Active roadmap; phase exits require separate evidence |
| Owner | `@mdesantis1984` |
| Tracker | [#27](https://github.com/mdesantis1984/thiscloud-ui/issues/27) |
| Repository baseline | Private `@thiscloud/ui-web` `0.1.0-rc.5` (`packages/ui-web/package.json`) |
| Documented public release | `@thiscloud/ui-web` `0.1.0-rc.1` (repository release records; current remote availability not checked here) |
| Plan baseline reviewed | 2026-09-24 (repository files; not a live GitHub settings or publication audit) |

## Purpose

Build a documentation system that stays aligned with executable behavior and gives each audience a clear entry point. This plan is a roadmap, not proof that planned GitHub features, checks, or releases are active. Approved issues and local work units record progress; remote issue, PR, milestone, Project, and release state requires separate readback. This English-only roadmap is linked from the Spanish-first documentation index; a Spanish counterpart is not yet provided.

## Outcomes

- A new consumer can install and use each supported public API without reading source code.
- A contributor can set up, change, test, and document one work unit without guessing commands or boundaries.
- A maintainer can prepare, publish, verify, and roll back a release from one checklist.
- Public API, version, compatibility, and deployment claims are checked against executable sources.
- Temporary local progress and any later GitHub delivery record stay distinct from durable documentation of current behavior and policy.

## Documentation Contract

- Executable configuration and tested code take precedence over prose.
- Every fact has one canonical source; other pages link to it instead of copying it.
- Behavior, tests, user-facing documentation, and release notes change in the same work unit.
- Nothing is pushed until the affected work unit passes local verification; any unavailable check is documented before review.
- Paired consumer pages use the existing Spanish base filename and English `.en.md` suffix; maintainer pages currently use English base filenames and gain `.es.md` peers as their independent work units land.
- Technical identifiers, package names, commands, API names, and paths are never translated.
- Headings answer reader questions; examples show the shortest supported path before edge cases.
- Unsupported behavior and verification limits are stated next to supported behavior.
- Local-only tool instructions and automation configuration are never tracked in the public repository.

## Audiences

| Audience | First page | Needed result |
| --- | --- | --- |
| Package consumer | Root README | Select the correct package, install it, and find API and support limits |
| Catalog visitor | Live catalog | Discover verified APIs without confusing demos with shipped components |
| Contributor | `CONTRIBUTING.md` | Create an approved, bounded, verified work unit |
| Maintainer | Existing deployment guide; other release runbooks planned | Verify local release assets and deployment boundaries; publication and rollback need separate authorization and evidence |
| Security reporter | `SECURITY.md` | Report privately with the required evidence |

## Sources Of Truth

| Fact | Executable source | Documentation output |
| --- | --- | --- |
| Web package version and exports | `packages/ui-web/package.json` | Root README, package README, support matrix, release notes |
| Web runtime API | `packages/ui-web/src/index.js` | API reference and examples |
| TypeScript contract | `packages/ui-web/index.d.ts` | API signatures and typed examples |
| Verified package behavior | `scripts/test-ui-web-package.mjs` | Support limits, accessibility evidence, examples |
| Catalog routes and API badges | `apps/catalog/catalog.js` | Catalog component status and route reference |
| Bilingual catalog copy | `apps/catalog/assets/i18n/{en,es}.json` | English and Spanish catalog pages |
| Root commands | `package.json` | Setup, testing, packaging, and release runbooks |
| Flutter contract | `packages/ui_kit/pubspec.yaml`, public barrels, and guards | Flutter status, setup, boundaries, and future API reference |
| Release artifacts | `scripts/prepare-release.mjs` and `.github/workflows/release.yml` | Release checklist and GitHub Release notes |
| Deployment behavior | `Dockerfile`, `deploy/compose.yaml`, and `deploy/nginx.conf` | Current `docs/deployment.md`; paired deployment/rollback guidance remains #48 work |
| Contribution policy | `.github/workflows/pr-policy.yml` | Contributing and governance documentation |

## Current Paths And Planned Structure

The inspected `develop` snapshot `e1fc9f72973633439ff103471ff9ab9a9b75c760` uses `README.md` / `README.en.md` at the root and `docs/README.md` / `docs/README.en.md` for the Spanish-first documentation map. Consumer guides and references follow the same Spanish base / English `.en.md` convention. Existing maintainer URLs remain English base paths; Spanish maintainer peers and the conduct-policy pair remain issue #47 delivery work relative to that snapshot. These paths do not prove later integration, publication, or live service state.

```text
README.md                         Spanish-first landing page (repository)
README.en.md                      English landing page (repository)
CONTRIBUTING.md                   English contribution guide (repository)
SECURITY.md                       English security policy (repository)
docs/
  README.md                       Spanish-first documentation map (repository)
  README.en.md                    English documentation map (repository)
  architecture.md                 English maintainer page (repository)
  governance.md                   English maintainer page (repository)
  deployment.md                   English deployment guide (repository)
  migration-from-center.md        English historical migration guide (repository)
  getting-started/
    web.md                        Spanish web guide (repository)
    web.en.md                     English web guide (repository)
    flutter.md / flutter.en.md    Paired Flutter incubation guides (repository)
  reference/
    web-api.md / web-api.en.md    Paired web API reference (repository)
    css-tokens.md / css-tokens.en.md
    compatibility.md / compatibility.en.md
  guides/
    native-form-validation.md / native-form-validation.en.md
    accessibility.md / accessibility.en.md
    localization.md / localization.en.md
```

The following is the **planned topic outline**, not existing paths or clickable links. Keep the original roadmap topics and proposed exit work without renaming current files to match them:

```text
docs/
  architecture/
    repository-boundary.md        Producer/consumer ownership and dependencies
    web-package.md                Package entrypoint, build, and registration flow
    catalog.md                    Routes, assets, build profiles, and serving flow
    flutter-package.md            Barrels, import guards, and incubation boundary
  contributing/
    setup.md                      Pinned toolchains and local prerequisites
    testing.md                    Focused and full verification commands
    documentation-style.md        Structure, language, examples, and review rules
  releases/
    versioning.md                 SemVer, tags, deprecation, and migration policy
    checklist.md                  Prepare, verify, publish, and post-release steps
  operations/
    catalog-deployment.md         Build and deploy the catalog image
    rollback.md                   Immutable image rollback and verification
  governance/
    github-workflow.md            Issues, PRs, labels, Projects, and milestones
  decisions/
    README.md                     Index of durable architecture decisions
```

Package READMEs, `CHANGELOG.md`, `MIGRATION.md`, and `SUPPORT.md` retain their package scope; no relocation is implied here.

## GitHub Operating Model

| GitHub feature | Repository evidence / state | Boundary |
| --- | --- | --- |
| Issues | Implemented in repository | YAML forms classify delivery impact and evidence; live issue state is not audited here |
| Labels and pull requests | Executable PR policy | One `type:*`, approved linked issue, five `Delivery Impact` classifications and evidence; 1000 changed-line gate, with bounded exception/promotion behavior. Live enforcement and other labels are not certified here |
| Milestones and Projects | Planned / unknown remotely | Inventory and adoption require current settings and owner decisions; no mandatory assignment rule is established by this plan |
| Discussions and Wiki | Unknown remotely | Previous audit findings below are historical; no current settings claim |
| Releases | Workflow exists | Tag-triggered workflow verifies assets and publishes only in its authorized context; no new release or external availability is established by this plan |
| Actions | Partial repository implementation | PR metadata validation exists; automated Markdown links, version/API claims and bilingual parity remain planned in #49 |
| Security | Policy documented | `SECURITY.md` directs vulnerability reporting privately; current GitHub availability requires separate readback |

## Baseline Audit

Historical observations as of 2026-09-10 (not current GitHub settings readback):

- The public repository has Issues and Projects enabled, Discussions disabled, and Wiki disabled.
- Projects could not be inventoried with the current token because it lacks `read:project`; inventory is required before creating or replacing a Project.
- There are no repository milestones.
- YAML Issue Forms existed for bugs, features, and trackers; documentation and impact forms have since been added in repository source. Live form availability is not established here.
- `main` and `develop` require the web, Flutter, and PR-policy checks and reject force pushes and deletion.
- The published prerelease `ui-web-v0.1.0-rc.1` contains the package tarball and SHA-256 checksum.
- The earlier audit reported 71 percent community-profile health and no Code of Conduct. The inspected snapshot still lacks the conduct-policy pair planned in #47; current community-profile health and remote availability require separate verification.
- At that audit, API and release facts were duplicated manually across root, package, catalog, security, and migration documents; this is not a new drift assessment.
- Catalog READMEs mix durable guidance with historical stage transcripts and inconsistent list formatting.
- At that audit, CI had no dedicated internal-link, Markdown, version-consistency, or public-API documentation check. The current repository scripts still do not establish automated Markdown link/parity enforcement; that work belongs to #49.
- The documented project-specific Flutter cache path was absent on the verification host; Phase 3 must standardize setup before treating that path as canonical.

## Change Documentation Matrix

| Change | Required documentation in the same PR |
| --- | --- |
| Public web API | API reference, typed signature, runnable example, catalog API badge, changelog, support statement |
| Breaking or deprecated API | All public API documents plus migration path, replacement, and removal version |
| CSS token | Token reference, default/fallback behavior, example, changelog |
| Catalog route or copy | Matching EN/ES keys, route status, accessibility notes, catalog maintainer guide |
| Browser behavior | Compatibility matrix, tested runtime evidence, known limitations |
| Flutter public API | Runtime/testing barrels, API reference, example, guards, changelog |
| Build or test command | Contributor setup/testing guide and CI workflow summary |
| Release process | Versioning policy, release checklist, workflow documentation |
| Container or routing | Deployment runbook, health checks, rollback steps, security boundary |
| Governance | Contribution guide, GitHub workflow guide, templates, and enforcing workflow |
| Internal refactor | Documentation-impact statement of `none` with evidence that public behavior did not change |

## Release Documentation Workflow

1. If a release milestone is adopted, record its scope and assigned issues; verify current platform state first.
2. Require each issue and PR to classify API, documentation, migration, compatibility, and release-note impact.
3. Read the release version from `packages/ui-web/package.json`; do not type a competing version into automation.
4. Update package changelog, migration guide, support matrix, API reference, examples, and catalog status with the behavior change.
5. Run available checks, `pnpm check:web`, then `pnpm check:release`, Flutter checks when applicable, and `git diff --check`; record documentation checks that remain planned rather than claiming they passed.
6. Tag only a commit contained in `main`; let the release workflow build and publish artifacts from that revision.
7. Verify the GitHub Release, tarball, checksum, catalog download, container image, health endpoint, and public documentation links.
8. After authorized publication, verify external assets and status; update any adopted milestone/Project and this plan using actual readback.

## Automation Backlog

- Add `scripts/check-docs.mjs` to validate local Markdown links, documented file paths, and command names against `package.json`.
- Compare documented web exports with `index.d.ts`, runtime exports, packed-package evidence, and catalog API badges.
- Reject stale supported-version and download references when the package version changes.
- Keep the existing EN/ES catalog key-parity check and add parity checks for paired public Markdown pages.
- Add Markdown formatting and spelling checks with repository-owned configuration and pinned versions.
- Fail CI if local-only instruction files are tracked.
- Retain the existing PR-policy `Delivery Impact` classifications; do not mistake them for automated validation of the documentation itself.
- Validate release notes and required documentation before accepting a `ui-web-v*` tag.

## Delivery Phases

| Phase | Work unit | Exit criteria |
| --- | --- | --- |
| 0 | Protect public-repository boundaries | Local-only instruction files are ignored and untracked; public links to them are removed; this plan is reviewed |
| 1 | Replace the information architecture | Root landing pages and documentation indexes route each audience without duplicated setup instructions |
| 2 | Rebuild consumer documentation | Web quick start, API, tokens, forms, accessibility, localization, and compatibility match packed behavior |
| 3 | Rebuild contributor and maintainer documentation | Setup, tests, architecture, releases, deployment, and rollback match scripts and CI |
| 4 | Extend GitHub documentation governance | Documentation-aware YAML forms, labels, milestone rules, Project fields, Discussions categories, PR template, and Code of Conduct are active |
| 5 | Enforce documentation contracts | Link, version, API, language-parity, privacy, and PR metadata checks are required in CI |
| 6 | Integrate release documentation | Release workflow verifies docs, notes, artifacts, catalog, and post-release state from one version source |

These exit criteria are targets, **not statements that all listed controls exist or that a phase has exited**. The inspected repository has Spanish-first landing pages and paired consumer guides, issue forms, PR metadata checks and a tag-triggered release workflow; it does not yet show the #49 Markdown link, version, API or language-parity CI checks. Phase-exit status, subsequent integration and current GitHub settings require scoped readback rather than a conclusion from missing local evidence. Approved issue-first work and reviewable PRs follow the current 1000-line executable PR gate; ~400 lines is optional review-size guidance, not an automated limit.

## Planned Completion Criteria (Not Yet All Enforced)

- The approved issue states observable acceptance criteria and documentation impact.
- The PR links its approved issue; issue closure, milestones, and Project items are confirmed only when applicable and read back.
- Public behavior, type declarations, tests, examples, and reference documentation agree.
- English and Spanish consumer pages agree on facts and differ only in translated prose.
- Commands and paths were executed or checked against their executable source.
- Internal links, version references, API claims, and Markdown checks pass in CI once the planned #49 enforcement exists; until then, record manual checks and limits.
- Release-note and migration impact are explicit, including `none` when justified.
- No local-only instructions, generated output, credentials, or local paths are tracked.
- Any adopted release milestone, Project status, GitHub Release, and durable documentation reflect the same shipped revision after authorized publication and readback.

## Plan Maintenance

- Review this plan at relevant work-unit and release milestones until all phases are complete.
- Update the baseline release and verification date immediately after publication verification.
- Record completed implementation in issues, PRs, and Releases; do not turn this plan into a changelog.
- Archive this plan after Phase 6 and keep the resulting documentation contract in the contribution and release guides.
