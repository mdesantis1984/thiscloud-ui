# Web package version and artifact identity

[Español](versioning.es.md) · [Documentation index](../README.en.md) · [Release checklist](checklist.md)

Repository-only maintainer guide. Read the version from `packages/ui-web/package.json`; neither the root `package.json` version nor a catalog demo identifies a published web package. A prepared archive is not a GitHub Release, registry publication, deployed image or supported runtime.

## Choose and document a version

1. Start with an approved issue and a reviewed change to `develop`. Classify public API, compatibility, migration and release-note impact; update `packages/ui-web/CHANGELOG.md`, `MIGRATION.md`, `SUPPORT.md` and the relevant API and consumer documentation together with the behavior. The package's `private: true` flag does not establish npm publication.
2. Follow the existing `SUPPORT.md` boundary: after 1.0, incompatible public API changes require a major version; before 1.0, document breaking RC changes in `MIGRATION.md`. Document a deprecated public API's replacement and removal version when one exists. SemVer describes compatibility intent; it does not automatically select a bump or guarantee browser support. Obtain an explicit owner decision if the appropriate next version or support promise is unclear.
3. Set the approved version in `packages/ui-web/package.json`. The release tag is `ui-web-v<version>`; the archive is `thiscloud-ui-web-<version>.tgz`, with a sibling `.tgz.sha256`. Do not substitute the root manifest's version or a GHCR tag for the package version. Document the bytes before proposing publication.

## Bind the actual bytes

`scripts/prepare-release.mjs` packs `@thiscloud/ui-web`, normalizes gzip deterministically and checks SHA-256 against `packages/ui-web/release-checksums.json`. It writes both files to `tmp/release/` and copies identical bytes to `apps/catalog/dist/downloads/`; `scripts/test-release-assets.mjs` checks the copies and registry. A changed tarball for an already registered version fails; use a newly approved version and append its **verified** digest instead of rewriting/removing a historical entry. When `RELEASE_REGISTRY_BASE` names a valid baseline commit, preparation also checks that existing entries have not changed or disappeared; without it, do not claim baseline append-only enforcement from that one local command.

The package manifest's `files` list includes package-local `README.md`, `CHANGELOG.md`, `MIGRATION.md` and `SUPPORT.md`, but **not** root `docs/releases/`. Changes to these guides alone do not change an already packed archive. Before releasing changed consumer guidance, update the appropriate package-local documentation in the approved release work unit, then verify the *new* packed bytes and version; never silently replace published assets. The registry SHA-256 describes a **tarball**, not its `.sha256` file or an OCI image manifest. A GitHub asset's metadata digest, when available, is evidence about that individual asset; check downloaded bytes separately in an authorized publication audit. Pin deployments by a verified full `ghcr.io/mdesantis1984/thiscloud-ui@sha256:<64 hex digits>` manifest reference, not by either tarball checksum or mutable image tag.

## Keep states distinct

The checked-in private package manifest says `0.1.0-rc.5`; local registry entries alone do not publish it. GitHub release/tag metadata read on 2026-09-24 recorded `ui-web-v0.1.0-rc.1` as a published prerelease with two uploaded assets. This is a **GitHub publication record**, not proof of currently served downloads, npm availability, current GHCR digest or running deployment. Older `SUPPORT.md` and `MIGRATION.md` still say there is no prior public release; those statements conflict with that scoped GitHub record and need their own approved correction before reuse as a present-tense release claim. Recheck publication evidence at the time of an actual release; do not treat this dated observation as a permanent availability guarantee.

Continue with the [release checklist](checklist.md). A published version/tag/asset or registered tarball identity must not be moved, deleted or overwritten to repair a mismatch; stop and plan an approved new version or separately reviewed recovery.
