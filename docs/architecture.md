# Aurora architecture and consumer boundary

[Español](architecture.es.md) · [Documentation index](README.en.md)

Thiscloud UI Aurora produces reusable UI artifacts; Thiscloud products consume versioned artifacts, not repository source. The [repository overview](../README.en.md) and [web package guide](../packages/ui-web/README.md) distinguish the public web `0.1.0-rc.1` from the private, repository-validated `0.1.0-rc.5`. A catalog demonstration is not a published API.

## Ownership

| Area | Aurora owns | Consumer owns |
| --- | --- | --- |
| Components | Tokens, rendering, interaction, accessibility semantics and public types | Product composition, navigation, analytics and business policy |
| Styling | Component variants, tokens, themes and density | Product-specific branding choices |
| Forms | Control participation and validation primitives | Submission, asynchronous effects, API calls, domain errors and persistence |
| Localization | Component-neutral contracts and catalog demonstration copy | Product copy and domain terminology |
| Distribution | Package assets, local checksums and catalog build | Version selection and target-runtime validation |

These boundaries follow the [web package API and form behavior](../packages/ui-web/README.md) and the [repository contract](../AGENTS.md). The validation helper does not send requests or supply locale copy; the consumer retains both responsibilities.

## Dependency direction

```text
Aurora source -> versioned package assets -> product consumer
```

Aurora does not import product repositories. Consumers use package exports rather than Aurora source paths, private modules, generated catalog files or workspace links; the [web package exports](../packages/ui-web/package.json) and [consumer guide](getting-started/web.en.md) describe the supported entry points.

## Portable component contract

[`contracts/components.json`](../contracts/components.json) declares target runtimes and support per entry in the `Inputs/Forms` family. It separates components from type contracts and helpers. Consult each entry's `support` value rather than interpreting catalog routes as implemented controls:

| Target | Declared runtime | Current boundary |
| --- | --- | --- |
| Web | `web-component` | Four release-candidate controls in the private `@thiscloud/ui-web` repository revision |
| HTML | `web-component`, inherits web | Direct package use in a browser |
| Go | `server-rendered-web-component`, inherits web | Server-rendered markup plus web package assets; no Go UI runtime claim |
| Blazor | `razor-web-component-wrapper`, inherits web | Thin Razor/JS interop wrapper planned, not shipped |
| Flutter | `native-widget` | Native widgets planned; private `thiscloud_ui` is not a published runtime widget package |

`release-candidate` records the manifest's current package evidence, not public publication. `planned` is not a support claim; `not-applicable` denotes no runtime representation for that target. The [manifest](../contracts/components.json), [web package guide](../packages/ui-web/README.md) and [Flutter package metadata](../packages/ui_kit/pubspec.yaml) are the sources for these states. From the repository root, `pnpm contracts:check` validates the manifest and declarations through the [package scripts](../package.json); new properties and events need implementation and tests before their support state changes.

## Distribution and verification

The [web package guide](../packages/ui-web/README.md) documents local packing, Chromium packed-consumer evidence and target-browser limitations. Its `0.1.0-rc.5` tarball and checksum are repository evidence, not a registry publication; see [release checksums](../packages/ui-web/release-checksums.json) and the [repository overview](../README.en.md) for public `rc.1` versus repository-only `rc.5`. Flutter's [`publish_to: none`](../packages/ui_kit/pubspec.yaml) remains a private incubation boundary. For catalog deployment details, use the separate [deployment guide](deployment.md); no deployment or release authorization follows from this architecture description.
