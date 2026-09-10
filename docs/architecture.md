# Aurora repository boundary

Thiscloud UI Aurora is a producer of versioned UI artifacts. Thiscloud Center and other products are consumers. Source-level workspace coupling between those repositories is forbidden.

## Ownership

| Area | Aurora owns | Consumers own |
| --- | --- | --- |
| Components | Rendering, interaction, accessibility semantics, public types | Product composition and workflows |
| Styling | Tokens, component variants, themes, density | Product-specific branding choices |
| Forms | Control participation and validation primitives | Submission, API calls, errors, and persistence |
| Localization | Catalog copy and component-neutral contracts | Product copy and domain terminology |
| Distribution | Packages, checksums, catalog image | Version selection and upgrade validation |

## Dependency direction

```text
Thiscloud UI Aurora -> versioned package or image -> Thiscloud product
```

Aurora must never import product repositories. Consumers must never import Aurora source paths, private modules, generated catalog files, or local workspace links.

## Release contract

- Web releases use `ui-web-v<semver>` tags and immutable tarball/checksum pairs recorded in the append-only `packages/ui-web/release-checksums.json` registry.
- The catalog image is built from the same revision and contains the same package assets.
- RC API claims are accepted only when packed-consumer browser tests pass.
- Flutter artifacts remain unpublished until the package exposes a verified runtime API.

## Deployment boundary

`ui.thiscloud.com.ar` terminates outside the container and proxies to the catalog's internal port. Public redirects must never expose that port. The runtime container is static, non-root, read-only compatible, and contains no credentials.
