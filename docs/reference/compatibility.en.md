# Web library compatibility

[Español](compatibility.md) · [Documentation index](../README.en.md)

Before integrating `@thiscloud/ui-web`, check the capabilities of your target browser or WebView and test forms on that specific version. Automated evidence for the packed package covers **Chromium**, not a universal browser, WebView, or assistive-technology matrix. See the [package support boundary](../../packages/ui-web/SUPPORT.md) and the [web API reference](web-api.en.md).

## What is verified and what is not

| Surface | Repository evidence | Consumer boundary |
| --- | --- | --- |
| Local web package | [`package.json`](../../packages/ui-web/package.json) declares `@thiscloud/ui-web` `0.1.0-rc.5`, `private: true`, and module and `tokens.css` exports. The [packed package test](../../scripts/test-ui-web-package.mjs) creates a tarball, copies it into a temporary consumer, and exercises it in Chromium. | Verified locally; **not** a registry publication of `rc.5`. The catalog is not a package installation. |
| Controls and forms | The [manifest](../../contracts/components.json), [declarations](../../packages/ui-web/index.d.ts), and [element registration](../../packages/ui-web/src/index.js) distinguish `TcSwitch`, `TcCheckbox`, `TcRadio`, `TcTextField`, the `ValidationControl` type, and the `attachFormValidation` helper. | Additional catalog entries are not RC API. Custom Elements and Shadow DOM are needed for these controls; native form association depends on form-associated custom elements and `ElementInternals`. |
| Other targets | The [manifest](../../contracts/components.json) declares HTML and Go on the web contract; Blazor is planned. Flutter targets native widgets, but its [package](../../packages/ui_kit/pubspec.yaml) declares `publish_to: none` and its [runtime entry point](../../packages/ui_kit/lib/thiscloud_ui.dart) exports no widgets. | Target declarations do not establish browser/WebView tests for HTML or Go, an available Blazor adapter, or a Flutter runtime widget API. |

## Check the target runtime

1. Prepare the [local package for a consumer](../getting-started/web.en.md#path-2-try-the-package-in-an-application); load its side-effect import in the target application. Check on that browser/WebView version that `tc-switch`, `tc-checkbox`, `tc-radio`, and `tc-text-field` register and their Shadow DOM renders.
2. Check Custom Elements, Shadow DOM, form-associated custom elements, and `ElementInternals` in the actual environment, including embedded WebViews. The [implementation](../../packages/ui-web/src/index.js) requires `ElementInternals` to validate `TcSwitch`; the [Chromium test](../../scripts/test-ui-web-package.mjs) checks a descriptive error without internals and a native `input` validation fallback for `TcTextField`. That fallback **does not** prove full form association without `ElementInternals`.
3. In a native consumer form, check `FormData`, validation, submission, reset, focus, and keyboard behavior for the controls you use; if using `attachFormValidation`, follow the [native validation guide](../guides/native-form-validation.en.md). Repeat after browser, WebView, or integration upgrades.
4. Record versions and results for **each** chosen browser/WebView, and perform manual accessibility tests with your target assistive technologies. Safari, Firefox, hybrid WebViews, and screen readers **are not verified here**; native Flutter support and universal compatibility are not established either.

## Scope of the result

A successful run of the [packed package suite](../../scripts/test-ui-web-package.mjs) provides evidence for that tarball and Chromium, not for the consumer application or other engines. For reproducible failures, follow [SUPPORT.md](../../packages/ui-web/SUPPORT.md) and include the runtime version and a minimal page. This is repository documentation, not a support or publication commitment.
