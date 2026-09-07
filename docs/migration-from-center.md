# Migration from Thiscloud Center

Thiscloud UI Aurora is now physically and operationally independent at `/mnt/MDS_DOC/Proyectos/ThisCloudServices/03-Repo/Thiscloud UI` and `github.com/mdesantis1984/thiscloud-ui`.

## Migrated ownership

| Asset | New owner |
| --- | --- |
| Component catalog and public download route | `apps/catalog/` |
| Web/hybrid SDK | `packages/ui-web/` |
| Flutter UI incubation package | `packages/ui_kit/` |
| Build, verification, packaging, and serving | `scripts/` |
| Container and origin configuration | `Dockerfile` and `deploy/` |
| CI, release, dependency, issue, and PR policy | `.github/` |

The historical `ui-web-v0.1.0-rc.1` tag and release assets were transferred without changing package bytes; the SHA-256 checksum still verifies.

## Center boundary

Thiscloud Center must consume a versioned Aurora artifact. It must not copy Aurora source, use `workspace:*` across repositories, import private modules, or own the Aurora catalog deployment.

The old Center repository still contains historical UI commits on its current `main`. Do not delete or rewrite that history. Restore Center's application foundation through its reviewed branch chain, remove duplicated UI working-tree ownership through explicit PRs, and update product documentation to reference this repository.

## Stable public endpoints

- Catalog: `https://ui.thiscloud.com.ar`
- Package download: `https://ui.thiscloud.com.ar/downloads/thiscloud-ui-web-0.1.0-rc.1.tgz`
- Independent release: `https://github.com/mdesantis1984/thiscloud-ui/releases/tag/ui-web-v0.1.0-rc.1`

The public domain remains stable while source, release, and deployment ownership move to Aurora.
