# Thiscloud UI Aurora documentation

[Español](README.md) · [English home](../README.en.md) · [Live catalog](https://ui.thiscloud.com.ar)

This page organizes documentation by audience and makes translation status visible. Spanish is the repository's default entrance; repository consumer guides provide an English counterpart one click away.

## Choose a path

| Need | Start here | Current language |
| --- | --- | --- |
| Understand the product and try the web RC | [Main README](../README.en.md) | Spanish and English |
| Explore components and demonstrations | [Catalog](https://ui.thiscloud.com.ar) | Spanish and English |
| Customize the exported CSS tokens | [CSS token reference](reference/css-tokens.en.md) | Spanish and English |
| Coordinate native form validation | [Native form validation](guides/native-form-validation.en.md) | Spanish and English |
| Review semantics, keyboard behavior, and accessibility limits of the four RC controls | [Accessibility of web controls](guides/accessibility.en.md) | Spanish and English; repository guide, not certification |
| Try the local catalog or integrate `@thiscloud/ui-web` | [Get started with the web library](getting-started/web.en.md) | Spanish and English; repository documentation |
| Look up four web API contracts | [Web API reference](reference/web-api.en.md) | Spanish and English; repository documentation |
| Validate web package compatibility in the target browser or WebView | [Compatibility reference](reference/compatibility.en.md) | Spanish and English; local Chromium evidence, no universal matrix |
| Verify Flutter incubation | [Flutter getting started](getting-started/flutter.en.md) | Spanish and English; private package |
| Localize web control labels and messages | [Control localization](guides/localization.en.md) | Spanish and English; repository guide, not a locale API |
| Understand decisions and dependencies | [Architecture](architecture.md) | English; Spanish pending |
| Deploy or roll back the catalog | [Deployment](deployment.md) | English; Spanish pending |
| Contribute and review changes | [Contributing](../CONTRIBUTING.md) and [governance](governance.md) | English; Spanish pending |
| Report a vulnerability | [Security policy](../SECURITY.md) | English; Spanish pending |

## Documentation contract

- Public APIs are documented only when executable evidence exists.
- The 65 catalog demonstrations are not presented as published components.
- Commands must run from the stated path.
- Versions come from manifests and publication records; prose does not invent status.
- Spanish and English documents retain the same structure and verifiable claims.

## Program status

| Work unit | Status |
| --- | --- |
| Spanish-first product entrance with an English pair | Available |
| Bilingual CSS token and native form validation guides | Available |
| Bilingual RC control accessibility guide | Available in the repository; consumer must check manually and in target browsers |
| Bilingual reference for four web API contracts | Available in the repository; not a package publication |
| Spanish architecture, deployment, security, and governance | Pending |
| Bilingual web getting started (local catalog and consumer tarball) | Available in the repository; not a package publication |
| Bilingual Flutter boundary guide (`publish_to: none`) | Available in the repository; package has no runtime widgets |
| Generated public reference and automated link validation | Pending |

Tracker [#27](https://github.com/mdesantis1984/thiscloud-ui/issues/27) remains open until the program is complete. Each phase uses an approved child issue so that the tracker cannot close early.
