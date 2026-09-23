# Flutter: verify the incubating package

[Español](flutter.md) · [Documentation index](../README.en.md)

`thiscloud_ui` is a private Flutter package in this repository, not a widget library ready for integration. Its `pubspec.yaml` declares `publish_to: none`; `lib/thiscloud_ui.dart` and `lib/testing.dart` are empty entry points, with no published runtime components or testing helpers. This guide verifies the local package state; it does not install a public version.

## Quick path in the repository

1. From the **repository root**, confirm `packages/ui_kit` exists and Flutter **3.47.1** with Dart **3.13.1** is available. The manifest allows Dart `>=3.13.1 <4.0.0` and Flutter `>=3.47.1`, but the toolchain guard requires these exact versions.
2. If dependencies are already resolved in `packages/ui_kit/.dart_tool/package_config.json` and its local paths exist, run from the root:

   ```sh
   export PATH="$HOME/.cache/thiscloud-ui/flutter/3.47.1/bin:$PATH"
   cd packages/ui_kit
   flutter --version
   dart run tool/check_toolchain.dart
   dart format --output=none --set-exit-if-changed .
   flutter analyze --no-pub
   flutter test --no-pub
   dart run tool/check_boundaries.dart .
   dart run tool/check_public_api.dart .
   dart run tool/check_licenses.dart .
   ```

3. Expected result: pinned version, successful commands and no formatting, analysis, test, import, public API or license/font integrity violations. These are **repository** checks, not tests of a consuming application or a promise of usable widgets.

## Dependencies and first-time setup

`pubspec.yaml` declares only SDK `flutter` and `flutter_localizations` runtime dependencies and `flutter_test` for tests; the lockfile also lists transitive dependencies. In a fresh checkout without an SDK, local cache or prior resolution, this path **cannot** run without further setup. `flutter pub get` may download packages and change local state; `flutter pub get --offline` can also change it and fails if the cache is incomplete. Prepare dependencies according to your environment's policy before running checks; this guide does not install them for you.

`--no-pub` avoids implicit resolution in `flutter analyze` and `flutter test`. The `dart run` commands assume a resolved configuration: inspect its paths before use and do not mistake missing dependencies for component failures. From `packages/ui_kit`, `example/catalog` is a separate project with its own resolution; it is not a reusable widget contract.

## What the checks prove

| Check | Scope and limit |
| --- | --- |
| `check_toolchain.dart`, format and `flutter analyze --no-pub` | Pinned versions, style and static analysis; not widget behavior. |
| `flutter test --no-pub` | Current package tests, including guards; not certification of a component API. |
| `check_boundaries.dart .` | Package Dart imports: rejects app/product dependencies, deep imports and testing API outside tests; not every integration is covered. |
| `check_public_api.dart .` | Limits public barrels to `lib/thiscloud_ui.dart` and `lib/testing.dart`, detects deep imports/exports and public names outside the `Tc` convention; does not create a component. |
| `check_licenses.dart .` | Checksums of included legal files and Inter fonts; not an external license audit. |

## Decision for consumers

Do not add this package as a production dependency expecting `Tc*` widgets: the barrel does not yet declare a runtime component. To explore what the repository **does** provide, see the [package README](../../packages/ui_kit/README.md), [manifest](../../packages/ui_kit/pubspec.yaml) and [entry points](../../packages/ui_kit/lib/thiscloud_ui.dart). The web catalog and its demonstrations are not compatible Flutter widgets or proof of Flutter application support. Wait for a verified component contract and authorized publication before assuming external consumption.
