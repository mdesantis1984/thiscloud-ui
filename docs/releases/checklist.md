# Web release checklist

[Español](checklist.es.md) · [Documentation index](../README.en.md) · [Version and artifact identity](versioning.md)

Repository-only **future operator checklist**, not authorization to publish. Execute no tag, registry, deployment or host operation merely because local checks pass. Use the [version guide](versioning.md) for the source of truth; record the responsible owner, approved issue, revision, version and evidence for each gate.

## 1. Prepare and review locally

- [ ] Confirm the approved issue, scope, change owner, version and migration/support/release-note impact. Update package-local `README.md`, `CHANGELOG.md`, `MIGRATION.md`, `SUPPORT.md` and affected API/consumer docs where relevant; root release guides are **not** included in the web tarball. If an existing checksum entry conflicts with new package bytes, stop: never replace the entry or published bytes under the same version.
- [ ] From the repository root, check installed prerequisites and run applicable focused checks, `pnpm check:web` **then** `pnpm check:release`, `pnpm release:verify`, and `git diff --check`. The two full checks share catalog output and must run sequentially. `check:release` prepares local tarball/checksum and catalog download copies; it does **not** publish. Record the archive name, version, checksum and actual test outcomes; inspect the packed package documentation and report skipped checks. Run Flutter checks only when affected and with its own prerequisites.
- [ ] Review the cohesive work unit, rollback boundary, bilingual claims, risks and actual checks. Obtain explicit owner acceptance; a locally prepared archive or passing CI is not a publication approval.

## 2. Promote the reviewed revision

- [ ] Use the approved issue-first branch and PR flow into `develop`, then separately authorize and review the protected `develop` → `main` promotion. Recheck current branch settings and fresh required checks against the actual base; do not treat the local tracking ref, old CI or a previous PR as proof of integration. Do not bypass protections, push `main` directly or introduce new implementation in a promotion PR.
- [ ] Before any tag operation, separately approve the exact version and `main` commit. The checked-in workflow responds to a **pushed** `ui-web-v*` tag: it requires `ui-web-v<version>` to equal `packages/ui-web/package.json` at the tagged commit and the commit to be an ancestor of `main`. Pushing that tag can initiate publication; tag creation or a dry local build is not equivalent. Stop if ancestry, tag identity, previous publication, permissions or authorization is uncertain; never move an existing published tag.

## 3. Publish only with separate authority

- [ ] The authorized tag-triggered `.github/workflows/release.yml` runs on a private self-hosted runner: it installs dependencies, runs `check:web` then `check:release`, creates a **draft** GitHub Release with `thiscloud-ui-web-<version>.tgz` and `.tgz.sha256`, pushes GHCR tags `:<tag>` and `:sha-<commit>`, then changes the release to a published prerelease. Each stage can fail independently; a draft, uploaded assets, image tag or passed workflow step does **not** prove the entire sequence completed.
- [ ] Read back the exact tag/commit, workflow conclusion, release draft/prerelease state, two asset names and metadata, and the authorized registry manifest identity. A tag is mutable: resolve and record a verified full `ghcr.io/mdesantis1984/thiscloud-ui@sha256:<64 hex digits>` for the actual image, separately from the tarball SHA-256. Do not infer either digest from an image tag, checksum filename or local build. GitHub asset metadata alone does not prove download availability.
- [ ] With separate authorization for external artifact access, download the released tarball and checksum into a controlled location and independently verify the tarball bytes against the registered checksum and the checksum file; check the catalog-served bytes and public documentation links when that service is actually in scope. This guide does not execute or certify those requests. Record the actual source, time, bytes and result; no asset download, registry access or public endpoint test was performed for this documentation.

## 4. Abort or hand off recovery

- [ ] If checks fail, the version is reused with different bytes, the tag points elsewhere, authorization is absent, or only a draft/partial GHCR publish exists: **stop**, retain the exact evidence and identify what was already published. Do not automatically delete assets, force-push/move tags, prune images, edit old registry entries, or retry as though the operation were atomic. Escalate to the owner for a separately approved new-version or recovery plan.
- [ ] Deployment is a distinct authorized operation: verify the target environment, current and previously verified full image digests, package artifact identity and operator before touching a service. Restoring a prior digest needs a separately approved procedure and live checks. A published prerelease is not a deployed catalog or proof of recovery. Record post-publication readback and owner review without closing the issue solely on local checks.
