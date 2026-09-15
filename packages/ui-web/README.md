# Thiscloud UI Web Core

`@thiscloud/ui-web` 0.1.0-rc.4 is a private, framework-independent web/hybrid preview. Its source is MIT-licensed and its tarball is reusable for local consumer validation, but this revision has not been published to a registry or public download site.

## Supported RC API

| Surface | Public boundary |
| --- | --- |
| `TcCheckbox` | `<tc-checkbox>` custom element |
| `TcSwitch` | `<tc-switch>` custom element |
| `TcTextField` | `<tc-text-field>` custom element |
| `ValidationControl` | TypeScript type contract |
| `attachFormValidation(nativeForm, options)` | Native-form validation helper |

Prepare and install the repository-validated tarball in a consumer workspace:

```bash
pnpm release:prepare
pnpm add ./tmp/release/thiscloud-ui-web-0.1.0-rc.4.tgz
```

This package remains `private: true` to prevent accidental registry publication. Versioned tarballs and checksums are generated as repository evidence; public availability is a separate release step. The tarball also contains registration and CSS-token assets required to use the five boundaries above; they do not add catalog API routes. Flutter/native controls, the remaining catalog routes, cross-browser support claims, and manual assistive-technology certification are outside its public contract.

## Technical choice

This slice deliberately uses a platform-native custom element instead of a host framework. The agent chose form-associated custom elements and `ElementInternals` so the public control can participate in standard HTML forms without coupling to Flutter or the catalog runtime.

## Build and pack

From the repository root:

```bash
pnpm ui-catalog:build
pnpm ui-web:test
pnpm ui-web:browser-test
pnpm ui-web:pack
```

`ui-web:pack` writes a local package tarball under ignored `tmp/ui-web-pack/`; it does not publish anything. `pnpm release:prepare` creates the release tarball, verifies it against the append-only `release-checksums.json` registry, and writes the checksum and catalog download assets under ignored build directories.

## Known limitations

- The verified automated matrix is Chromium with the local packed-browser test; hybrid WebView consumers must validate their own target runtime.
- Consumers need custom elements, Shadow DOM, form-associated custom elements, and `ElementInternals` where their selected API needs it.
- Accessibility evidence is automated browser coverage and component semantics only; it is not a claim of manual assistive-technology validation.

## Use

```js
// In a bundler entry point (Vite, esbuild, webpack, etc.).
import '@thiscloud/ui-web';
import '@thiscloud/ui-web/tokens.css';
```

```html
<!-- In a standalone browser page, point at the served package files. -->
<link rel="stylesheet" href="/node_modules/@thiscloud/ui-web/dist/tokens.css">
<script type="module" src="/node_modules/@thiscloud/ui-web/dist/index.js"></script>
<tc-checkbox name="terms" label="Accept terms" value="accepted" required></tc-checkbox>
<tc-switch name="notifications" label="Enable notifications" value="enabled"></tc-switch>
<tc-text-field name="organization" label="Organization" helper="Used for workspace display." clearable></tc-text-field>
```

`tc-checkbox` and `tc-switch` are form-associated through `ElementInternals`: a checked control contributes its `value`; an unchecked or effectively disabled control contributes no value. `required` uses native form validity. A readonly unchecked required switch is valid and remains in form data if checked; Checkbox deliberately has no readonly API because native checkboxes do not define one. A disabled ancestor `fieldset` disables form participation. A native Flutter implementation is outside this web/hybrid slice.

Switch `size` accepts `small`, `medium` (default), or `large`; `tone` accepts `primary` (default) or `secondary`. Consumers can override the documented `--tc-switch-*` and `--tc-checkbox-*` CSS custom properties after importing `tokens.css`. The browser test runs the packed package in a blank host using `UI_WEB_CHROME` or the local Chrome path.

The boolean controls expose `checked`, `defaultChecked`, `disabled`, `required`, `label`, `name`, and `value`; Switch additionally exposes `readOnly`, `size`, and `tone`. Checkbox exposes the property-only visual state `indeterminate`, which never creates form data and clears on user activation. Form reset restores `defaultChecked` and clears stale validation UI. Setting state programmatically does not emit events. A user pointer or supported keyboard interaction that changes state emits one bubbling and composed `input`/`change` pair.

`label` supplies the visible and accessible name. When it is absent, an associated HTML `<label for="…">` or wrapping `<label>` supplies the accessible name. Associated-label activation focuses the inner native control. The public declaration file is included in the package for TypeScript consumers.

This SDK is intentionally browser-only. It does not claim universal compatibility: consumers must validate support for custom elements, Shadow DOM, and form-associated custom elements/`ElementInternals` in their target browsers.

`tc-text-field` is a single-line form-associated text or email field. It supports `standard`, `filled`, and `outlined` variants, floating labels, helper text, a clear button, required/email validity, reset, readonly, and disabled states. Consumers supply localized `required-message` and `type-mismatch-message`; the SDK does not include locale copy. Masks, multiline input, adornments other than clear, debounce, and arbitrary input types are outside this slice.

## Native form validation

`tc-checkbox`, `tc-text-field`, and `tc-switch` expose the native validation surface used by form controls: `validity`, `validationMessage`, `willValidate`, `checkValidity()`, `reportValidity()`, and `focus()`. Each control owns its own touched and error presentation. Checkbox and Switch accept optional `required-message` copy. Both boolean controls require `ElementInternals` and throw a descriptive error when the browser lacks it; TextField uses its native input when internals are unavailable.

`attachFormValidation(nativeForm, options)` is an optional, form-scoped helper. It does not create a custom form element, alter `novalidate`, inspect shadow roots, mutate `FormData`, submit requests, or provide localization. It is idempotent for a form and returns a handle with `validate()` and `dispose()`.

`validate({ submitter, focus } = {})` delegates constraint checks to the native form. `focus` defaults to `true` and uses one native `reportValidity()` call; `focus: false` uses one native `checkValidity()` call and does not move focus. It returns one of these results:

- `{ status: 'invalid', invalidControls }` after one native `reportValidity()` pass and browser-managed first-invalid focus;
- `{ status: 'valid', formData }`, where `formData` is `new FormData(form, submitter)` when a submitter is supplied; or
- `{ status: 'skipped', reason: 'formnovalidate' }` when the submitter has `formnovalidate`. Skipped constraints are not reported as valid.

The helper observes submit events. Invalid managed submissions are prevented before `onInvalid` runs; when `preventDefault: true`, every managed submission is prevented before its callback runs, even if that callback throws. Valid submissions are prevented only when `preventDefault: true` is supplied. Applications own any network submission through `onValid(result)`. A catalog form should retain `novalidate`, use `preventDefault: true`, and invoke the helper's local callbacks. A native form without `novalidate` can suppress an invalid submit before the helper sees it; call `validate()` explicitly when that form needs a summary. During each explicit validation call, the helper temporarily observes `invalid` on the current `form.elements` controls, including externally associated controls, then removes those listeners.

A trusted Enter key in an enabled, writable `tc-text-field` follows native implicit-submission constraints. Readonly fields do not implicitly submit. It uses the form's first submit control, including an externally owned one, and respects effectively disabled submitters (including a disabled `fieldset`) and `formnovalidate`. Without a submit control, it submits only when the form has one blocking text-entry field; forms with multiple text-entry fields, including native numeric/date/time fields, are not submitted automatically. Preventing the keydown or composing with an IME leaves submission to the consumer.

Options are `preventDefault` (default `false`), `onInvalid(result)`, `onValid(result)`, `onSkipped(result)`, and `onReset({ form })`. Each uncancelled native reset receives its own later-task callback after form-associated controls restore their defaults; a cancelled reset receives none. `dispose()` cancels every pending reset callback and removes this helper's listeners; attaching again after disposal creates a new handle.
