# Migration from Thiscloud Center

[Español](migration-from-center.es.md) · [Documentation index](README.en.md)

Aurora has its own repository, [`mdesantis1984/thiscloud-ui`](https://github.com/mdesantis1984/thiscloud-ui), and owns the UI source and release contracts listed below. This guide records the historical separation from Thiscloud Center and the intended consumer boundary; it does **not** verify that Center has migrated its application, dependencies, or deployment.

## What Aurora owns

| Asset | Repository owner |
| --- | --- |
| Component catalog and download route | [`apps/catalog/`](../apps/catalog/) |
| Web/hybrid SDK | [`packages/ui-web/`](../packages/ui-web/) |
| Flutter UI incubation package | [`packages/ui_kit/`](../packages/ui_kit/) |
| Build, verification, packaging, and serving | [`scripts/`](../scripts/) |
| Container and origin configuration | [`Dockerfile`](../Dockerfile) and [`deploy/`](../deploy/) |
| CI, release, dependency, issue, and PR policy | [`.github/`](../.github/) |

These are locations **inside the Aurora repository**, not a private workstation path or a claim about Center's current working tree. The [architecture boundary](architecture.md) assigns product composition, navigation and persistence to consumers, not to this UI framework.

## What Center must decide and verify

Center should consume a versioned Aurora artifact rather than copy Aurora source, link repositories with `workspace:*`, import private modules, or own Aurora's catalog deployment. This is the **target dependency boundary**, not evidence that Center currently follows it. No Center repository or host was inspected for this guide.

The earlier migration record described historical UI commits on Center's then-current `main`; Center's present branch state is unverified. Before any separately authorized Center change, its maintainers must establish the current application baseline, identify duplicated UI working-tree ownership and dependency references, select an artifact version, and verify consumer behavior and rollback in Center's own review process. Do not delete or rewrite historical UI commits; changes to Center's working tree and product documentation require its own reviewed PRs. This page neither performs nor approves those changes.

## Historical release and current limits

The previous migration record describes the transfer of the `ui-web-v0.1.0-rc.1` tag and release assets without changing package bytes. The repository's [checksum registry](../packages/ui-web/release-checksums.json) retains an `0.1.0-rc.1` digest. This local record does not recheck the remote release or today's public endpoint bytes.

| Documented rc.1 route | Historical reference, not a current availability check |
| --- | --- |
| Catalog | `https://ui.thiscloud.com.ar` |
| Download | `https://ui.thiscloud.com.ar/downloads/thiscloud-ui-web-0.1.0-rc.1.tgz` |
| Release | `https://github.com/mdesantis1984/thiscloud-ui/releases/tag/ui-web-v0.1.0-rc.1` |

The [current package manifest](../packages/ui-web/package.json) identifies `0.1.0-rc.5` with `private: true`; the [repository entry point](../README.en.md) distinguishes this repository-only candidate from the documented public `rc.1`. Neither the checksum registry nor this guide proves that `rc.5` is published or that Center consumes any release. Verify the actual artifact and target environment before proposing a consumer migration; the [web getting-started guide](getting-started/web.en.md) covers local package testing, not a Center rollout.
