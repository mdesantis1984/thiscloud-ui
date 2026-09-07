# Thiscloud UI Aurora

Thiscloud UI Aurora is the independent design-system repository for Thiscloud products. It owns reusable web/hybrid and Flutter UI foundations, the public component catalog, and versioned release artifacts. Product applications such as Thiscloud Center consume Aurora; they are not implemented here.

## Current release

The verified web/hybrid RC is `@thiscloud/ui-web` `0.1.0-rc.1`. Its public API contains `TcSwitch`, `TcTextField`, `ValidationControl`, and `attachFormValidation(nativeForm, options)`. The other 67 catalog routes are design demonstrations, not shipped component APIs. The Flutter package remains an incubation shell.

## Quick start

Requirements: Node.js 22, pnpm 11.12.0, and Chrome or Chromium for browser verification.

```bash
pnpm install --frozen-lockfile
pnpm check:web
pnpm ui-catalog:serve
```

The catalog is then available at `http://127.0.0.1:8095`. Production builds are written to ignored `apps/catalog/dist/`.

## Repository map

| Path | Ownership |
| --- | --- |
| `apps/catalog/` | Bilingual component catalog and public download experience |
| `packages/ui-web/` | Framework-independent web/hybrid SDK |
| `packages/ui_kit/` | Flutter UI package incubation boundary |
| `scripts/` | Build, verification, packaging, and local serving |
| `deploy/` | Reproducible container runtime configuration |
| `.github/` | Issue-first contribution, CI, release, and dependency automation |

## Release artifacts

```bash
pnpm release:prepare
```

This creates a versioned tarball and SHA-256 checksum in ignored `tmp/release/`, and places the same files under the generated catalog download directory. Tagged releases publish those artifacts and a catalog container image.

## Boundaries

- Aurora contains no product authentication, routing, persistence, API client, or business policy.
- Consumers use versioned artifacts; they must not depend on workspace paths or Aurora internals.
- Public API claims require executable browser or Flutter evidence in the same work unit.
- `ui.thiscloud.com.ar` serves only the catalog and release downloads.

See [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SECURITY.md`](SECURITY.md), and [`docs/architecture.md`](docs/architecture.md) before changing the repository.
