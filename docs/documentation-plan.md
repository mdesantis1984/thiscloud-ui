# Documentation Program

| Field | Value |
| --- | --- |
| Status | Active |
| Owner | `@mdesantis1984` |
| Tracker | [#27](https://github.com/mdesantis1984/thiscloud-ui/issues/27) |
| Code baseline | `@thiscloud/ui-web` `0.1.0-rc.2` |
| Published release | `@thiscloud/ui-web` `0.1.0-rc.1` |
| Last verified | 2026-09-10 |

## Purpose

Build a documentation system that stays aligned with executable behavior, gives each audience a clear entry point, and records every change from approved issue through release. This plan is the roadmap; GitHub Issues, pull requests, milestones, Projects, and Releases are the live delivery record.

## Outcomes

- A new consumer can install and use each supported public API without reading source code.
- A contributor can set up, change, test, and document one work unit without guessing commands or boundaries.
- A maintainer can prepare, publish, verify, and roll back a release from one checklist.
- Public API, version, compatibility, and deployment claims are checked against executable sources.
- Temporary progress stays in GitHub; durable repository documents describe only current behavior and policy.

## Documentation Contract

- Executable configuration and tested code take precedence over prose.
- Every fact has one canonical source; other pages link to it instead of copying it.
- Behavior, tests, user-facing documentation, and release notes change in the same work unit.
- Nothing is pushed until the affected work unit passes local verification; any unavailable check is documented before review.
- Public consumer content is available in English and Spanish when the catalog exposes the same content bilingually.
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
| Maintainer | Release and operations runbooks | Publish and verify immutable artifacts, then recover safely |
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
| Deployment behavior | `Dockerfile`, `deploy/compose.yaml`, and `deploy/nginx.conf` | Deployment and rollback runbooks |
| Contribution policy | `.github/workflows/pr-policy.yml` | Contributing and governance documentation |

## Target Structure

```text
README.md                         English public landing page
README.es.md                      Spanish public landing page
CONTRIBUTING.md                   Short contribution entry point
SECURITY.md                       Supported versions and private reporting
CODE_OF_CONDUCT.md                Community participation policy
docs/
  README.md                       Documentation map by audience and task
  README.es.md                    Spanish documentation map
  getting-started/
    web.md                        Install, import, browser prerequisites
    web.es.md                     Spanish web quick start
    flutter.md                    Current incubation status and setup
  reference/
    web-api.md                    Verified exports, elements, properties, events
    css-tokens.md                 Supported token contract
    compatibility.md              Tested platforms and explicit limitations
  guides/
    native-form-validation.md     Validation helper and control integration
    accessibility.md              Evidence, semantics, and test boundaries
    localization.md               EN/ES catalog rules and invariant identifiers
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

Package READMEs remain package-scoped quick starts. `CHANGELOG.md`, `MIGRATION.md`, and `SUPPORT.md` remain beside the package they describe. The catalog READMEs become concise maintainer guides; completed work-unit history moves to GitHub issues, milestones, and release notes.

## GitHub Operating Model

| GitHub feature | Purpose | Required use |
| --- | --- | --- |
| Issues | Define one observable outcome before implementation | YAML Issue Forms capture problem, scope, acceptance criteria, documentation impact, release impact, and evidence |
| Labels | Make type, status, area, and release impact queryable | Exactly one `type:*`; one status; add `area:web`, `area:catalog`, `area:flutter`, `area:docs`, or `area:release` |
| Milestones | Define a version or documentation phase | Every planned issue belongs to one milestone; release only after required issues close |
| Projects | Show delivery state across issues and PRs | Track status, package, target release, documentation impact, and blocked-by relationships |
| Pull requests | Provide the reviewable change and verification record | Close an approved issue, state documentation impact, list changed docs, show checks, and identify release-note impact |
| Discussions | Separate support and design conversation from executable work | Enable Q&A and Ideas; accepted outcomes become scoped Issues before code changes |
| Releases | Publish the user-visible version record | Include highlights, install command, API changes, migrations, support limits, artifacts, checksum, and full changelog link |
| Actions | Reject documentation drift | Check links, versions, API claims, bilingual parity, tracked local-only instruction files, and required PR metadata |
| Security | Keep vulnerability evidence private | Use private vulnerability reporting and advisories, never public issues for vulnerabilities |
| Wiki | Avoid an unversioned second source | Keep disabled; version durable documentation with the code |

## Baseline Audit

As of 2026-09-10:

- The public repository has Issues and Projects enabled, Discussions disabled, and Wiki disabled.
- Projects could not be inventoried with the current token because it lacks `read:project`; inventory is required before creating or replacing a Project.
- There are no repository milestones.
- YAML Issue Forms exist for bugs, features, and trackers; extend them with documentation and release impact while preserving their required evidence fields.
- `main` and `develop` require the web, Flutter, and PR-policy checks and reject force pushes and deletion.
- The published prerelease `ui-web-v0.1.0-rc.1` contains the package tarball and SHA-256 checksum.
- GitHub reports 71 percent community-profile health; a Code of Conduct is absent.
- Current API and release facts are duplicated manually across root, package, catalog, security, and migration documents.
- Catalog READMEs mix durable guidance with historical stage transcripts and inconsistent list formatting.
- CI has no dedicated internal-link, Markdown, version-consistency, or public-API documentation check.
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

1. Create a release milestone and assign every intended issue before implementation.
2. Require each issue and PR to classify API, documentation, migration, compatibility, and release-note impact.
3. Read the release version from `packages/ui-web/package.json`; do not type a competing version into automation.
4. Update package changelog, migration guide, support matrix, API reference, examples, and catalog status with the behavior change.
5. Run documentation checks, `pnpm check:web`, `pnpm check:release`, Flutter checks when applicable, and `git diff --check`.
6. Tag only a commit contained in `main`; let the release workflow build and publish artifacts from that revision.
7. Verify the GitHub Release, tarball, checksum, catalog download, container image, health endpoint, and public documentation links.
8. Close the milestone, update the Project, and refresh this plan's baseline release and verification date while the program remains active.

## Automation Backlog

- Add `scripts/check-docs.mjs` to validate local Markdown links, documented file paths, and command names against `package.json`.
- Compare documented web exports with `index.d.ts`, runtime exports, packed-package evidence, and catalog API badges.
- Reject stale supported-version and download references when the package version changes.
- Keep the existing EN/ES catalog key-parity check and add parity checks for paired public Markdown pages.
- Add Markdown formatting and spelling checks with repository-owned configuration and pinned versions.
- Fail CI if local-only instruction files are tracked.
- Extend PR policy to require a documentation-impact selection and release-note classification.
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

Each phase uses an approved tracker issue and reviewable child issues. Each child branch and PR must deliver one independently useful outcome and remain within the 400-line review budget; split larger phases into dependency-ordered PRs.

## Definition Of Done

- The approved issue states observable acceptance criteria and documentation impact.
- The PR closes the issue and links its milestone and Project item.
- Public behavior, type declarations, tests, examples, and reference documentation agree.
- English and Spanish consumer pages agree on facts and differ only in translated prose.
- Commands and paths were executed or checked against their executable source.
- Internal links, version references, API claims, and Markdown checks pass in CI.
- Release-note and migration impact are explicit, including `none` when justified.
- No local-only instructions, generated output, credentials, or local paths are tracked.
- The release milestone, Project status, GitHub Release, and durable documentation reflect the same shipped revision.

## Plan Maintenance

- Review this plan in every release milestone until all phases are complete.
- Update the baseline release and verification date immediately after publication verification.
- Record completed implementation in issues, PRs, and Releases; do not turn this plan into a changelog.
- Archive this plan after Phase 6 and keep the resulting documentation contract in the contribution and release guides.
