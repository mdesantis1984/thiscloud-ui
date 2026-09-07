# thiscloud_ui

`thiscloud_ui` is the private, reusable Flutter UI framework for Thiscloud products. Version `0.1.0` is an incubation release and cannot be published because its manifest keeps `publish_to: none`.

## Package contract

| Item | Contract |
|---|---|
| Dart | `>=3.13.1 <4.0.0` |
| Flutter | `>=3.47.1`; release checks use exactly `3.47.1` |
| Runtime dependencies | Flutter and `flutter_localizations` SDK libraries only |
| Localization | Flutter code generation is enabled; resources arrive in a later work unit |
| Typeface | Bundled Inter v4.1 variable normal and italic assets |
| License | MIT for first-party source and documentation; SIL OFL 1.1 for Inter |

## Verify this shell

```sh
export PATH="$HOME/.cache/thiscloud-ui/flutter/3.47.1/bin:$PATH"
flutter --version
flutter pub get
sha256sum -c assets/fonts/SHA256SUMS
(cd example/catalog && flutter pub get && flutter analyze)
```

## Current boundary

This work unit contains package metadata, legal records, official font assets, and a minimal catalog shell. It intentionally provides no runtime API or components yet. Consumers remain responsible for product copy, state, routing, authentication, persistence, and application policy.

The package must not import a consumer such as Thiscloud Center. Public runtime and testing entry points, localization resources, components, tests, and release automation are added by later dependency-ordered work units.

## Legal records

- [`LICENSE`](LICENSE) covers first-party source and documentation.
- [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) identifies redistributed Inter bytes.
- [`PROVENANCE.md`](PROVENANCE.md) records sources and clean-room boundaries.
- [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt) is Inter's unmodified license from the official v4.1 release archive.
