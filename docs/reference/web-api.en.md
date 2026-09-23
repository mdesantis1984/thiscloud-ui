# Web API reference

[Español](web-api.md) · [Documentation index](../README.en.md)

This reference covers four surfaces of `@thiscloud/ui-web`: `TcSwitch`, `TcTextField`, the `ValidationControl` type, and `attachFormValidation`. Revision `0.1.0-rc.5` is a private package verifiable through a local archive; this repository page does not imply registry publication. `TcCheckbox` and `TcRadio` are also verified RC APIs: see the [package guide](../../packages/ui-web/README.md) for their contracts.

## Before use

From the repository root, see [local package preparation](../../packages/ui-web/README.md#supported-rc-api) and its imports; the generated archive is not a public download. Repository commands require Node.js 22 and pnpm 11.13.1, and its browser test requires local Chrome/Chromium. Consumers need Custom Elements, Shadow DOM, and, for native form association, form-associated custom elements and `ElementInternals`. The automated matrix covers Chromium with the packed package; validate every target browser or WebView separately.

```js
// In the consumer bundler entry point, after preparing the local package.
import '@thiscloud/ui-web';
import '@thiscloud/ui-web/tokens.css';
import { attachFormValidation } from '@thiscloud/ui-web';
```

The module import registers `<tc-switch>`, `<tc-checkbox>`, `<tc-radio>`, and `<tc-text-field>`; `tokens.css` exports styling tokens. For TypeScript types, use `import type { TcSwitch, TcTextField, ValidationControl, FormValidationResult } from '@thiscloud/ui-web'`. The [public declarations](../../packages/ui-web/index.d.ts) are the source of complete signatures.

## `TcSwitch` — `<tc-switch>`

```html
<tc-switch name="updates" label="Receive updates" value="yes" required
  required-message="Choose an option."></tc-switch>
```

| Typed property | Contract |
| --- | --- |
| `checked`, `defaultChecked`, `disabled`, `readOnly`, `required: boolean` | Selection, reset value, and interaction/validation states. |
| `label`, `name`, `value`, `requiredMessage: string` | Label, form data, and constraint message; `value` defaults to `on`. |
| `size: 'small' \| 'medium' \| 'large' \| string` | Size; defaults to `medium`. |
| `tone: 'primary' \| 'secondary' \| string` | Tone; defaults to `primary`. |

Properties correspond to lowercase HTML attributes except `readOnly` → `readonly`, `defaultChecked` (in-memory reset value), and `requiredMessage` → `required-message`. Additional `size` and `tone` strings are accepted by the declaration but are not verified visual variants. A checked switch contributes `value` to its form; unchecked or disabled switches contribute nothing. `required` requires selection unless disabled or readonly. Reset restores `defaultChecked`. User changes emit bubbling, composed `input` and `change`; setting `checked` in code does not. Activation uses pointer, Space, Enter, left/right arrows, and Delete as implemented; `readOnly` prevents toggling.

## `TcTextField` — `<tc-text-field>`

```html
<tc-text-field name="email" label="Email" type="email" required
  required-message="Email is required."
  type-mismatch-message="Enter a valid email." clearable></tc-text-field>
```

| Typed property | Contract |
| --- | --- |
| `value`, `defaultValue`, `name`, `label`, `helper`, `autocomplete: string` | Value, reset value, form data, and field copy. |
| `clearLabel`, `requiredMessage`, `typeMismatchMessage: string` | Clear-button label and consumer-supplied messages. |
| `type: 'text' \| 'email'` | Single-line input; defaults to `text`. |
| `variant: 'standard' \| 'filled' \| 'outlined'` | Visual variant; defaults to `outlined`. |
| `required`, `readOnly`, `disabled`, `clearable: boolean` | Constraints and optional clear button. |

Equivalent attributes use `readonly`, `clear-label`, `required-message`, and `type-mismatch-message`; `defaultValue` is an in-memory reset value. An HTML type other than `email` is interpreted as `text`; an unknown variant as `outlined`. The field contributes `value` when enabled and restores `defaultValue` on reset. Its native input inside Shadow DOM produces `input`; on committed changes the host emits bubbling, composed `change`. Clearing produces both events through the input; assigning `value` in code is not a user action. It supports required/email validation, not masks, multiline mode, other input types, or network submission. Messages are not translated automatically.

## `ValidationControl`

This is a TypeScript interface, **not** an HTML element or constructible object. `TcSwitch`, `TcTextField`, `TcCheckbox`, and `TcRadio` implement its validation surface:

```ts
interface ValidationControl {
  readonly validity: ValidityState;
  readonly validationMessage: string;
  readonly willValidate: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  focus(options?: FocusOptions): void;
}
```

The switch and selection controls require `ElementInternals` for this surface and throw a descriptive error without it; `TcTextField` can delegate validation to its inner `input`. Each control owns its error presentation. The interface does not promise framework adapters or remote validation.

## `attachFormValidation(form, options)`

Signature: `attachFormValidation(form: HTMLFormElement, options?: FormValidationOptions): FormValidationHandle`. It requires a native form. The handle exposes `validate(options?: { submitter?: HTMLElement | null; focus?: boolean }): FormValidationResult` and `dispose(): void`.

Add the form to the document and run the following consumer module after the DOM is ready. The import registers the elements; this example logs local results and does not submit data.

```html
<form id="profile" novalidate>
  <tc-text-field name="organization" label="Organization" required
    required-message="Organization is required."></tc-text-field>
  <button type="submit" name="intent" value="save">Save</button>
  <button type="submit" name="intent" value="draft" formnovalidate>Save draft</button>
  <button type="reset">Reset</button>
</form>
```

```js
import { attachFormValidation } from '@thiscloud/ui-web';

const form = document.querySelector('form#profile');
if (!(form instanceof HTMLFormElement)) throw new Error('The #profile form is required.');
const handle = attachFormValidation(form, {
  preventDefault: true,
  onValid({ formData }) { console.info([...formData.entries()]); },
  onInvalid({ invalidControls }) { console.info(invalidControls.length); },
  onSkipped({ reason }) { console.info(reason); },
  onReset({ form }) { console.info(form.id); },
});
const result = handle.validate({ focus: false });
console.info(result.status);
// When removing the view, call handle.dispose().
```

| `status` | Discriminated result (all include `form` and `submitter?`) |
| --- | --- |
| `'invalid'` | `invalidControls: ValidationControl[]` after a failed native constraint pass. |
| `'valid'` | `formData: FormData` includes the `name`/`value` pair of an eligible named submitter when provided; an unnamed one contributes no entry. |
| `'skipped'` | `reason: 'formnovalidate'` when the submitter skips constraints; this is not a valid result. |

`FormValidationOptions` accepts `preventDefault?: boolean` (default `false`) and callbacks `onInvalid`, `onValid`, `onSkipped` (each receives `FormValidationResult`), and `onReset({ form })`. `validate()` calls `reportValidity()` with `focus: true` (default), or `checkValidity()` with `focus: false`; it does not dispatch a `submit`. The helper observes form `submit`, cancels invalid submissions, and with `preventDefault: true` cancels all managed submissions **before** callbacks. With native validation enabled, the browser can block invalid submission before the `submit` event; use `novalidate` on the form or call `validate()` explicitly to receive a result through the helper. It does not set `novalidate` itself.

Attaching twice to the same form returns the same handle until `dispose()`. An uncancelled reset notifies `onReset` in a later task; `dispose()` removes listeners and cancels pending notifications, and `validate()` then throws. The helper does not send requests, mutate `FormData`, provide localized messages, or decide navigation: those remain application responsibilities. See the [native validation guide](../guides/native-form-validation.en.md) for a complete form and its limits.

## Evidence and scope

Signatures come from [`index.d.ts`](../../packages/ui-web/index.d.ts), imports from [`package.json`](../../packages/ui-web/package.json), and declared support from [`contracts/components.json`](../../contracts/components.json). The [packed-package test](../../scripts/test-ui-web-package.mjs) exercises controls and the helper in Chromium; it does not certify other browsers, screen readers, or every catalog demonstration. This reference describes repository API and does not change the package publication state.
