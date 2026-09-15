# Native form validation

[Español](native-form-validation.md) · [Documentation index](../README.en.md)

`attachFormValidation(form, options)` coordinates validation for one `HTMLFormElement`. It does not create a custom form, send requests, or replace native constraints.

## Shortest managed path

```html
<form id="profile" novalidate>
  <tc-text-field name="organization" label="Organization" required
    required-message="Organization is required."></tc-text-field>
  <tc-switch name="updates" label="Receive updates" value="yes"></tc-switch>
  <button type="submit" name="intent" value="save">Save</button>
  <button type="submit" formnovalidate>Save draft</button>
</form>
```

```js
import { attachFormValidation } from '@thiscloud/ui-web';

const form = document.querySelector('#profile');
const validation = attachFormValidation(form, {
  preventDefault: true,
  onValid({ formData }) {
    // The application decides how to submit formData.
  },
  onInvalid({ invalidControls }) {
    console.info(`${invalidControls.length} invalid controls`);
  },
  onSkipped({ reason }) {
    console.info(reason);
  },
});

// When removing the view:
validation.dispose();
```

`novalidate` lets the helper observe an invalid `submit` event and present a complete result. Without it, the browser can block the event before it reaches the helper. To retain native submission when the form is valid, omit `preventDefault: true`.

## Results

| Status | Data | Meaning |
| --- | --- | --- |
| `invalid` | `form`, `submitter`, `invalidControls` | One native constraint pass failed |
| `valid` | `form`, `submitter`, `formData` | The form is valid; `formData` includes the supplied submitter |
| `skipped` | `form`, `submitter`, `reason: 'formnovalidate'` | The submitter skipped constraints; the result is not reported as valid |

`invalidControls` contains controls from `form.elements`, including controls associated through `form="id"`. `FormData` preserves duplicate names, files, external controls, and the submitter name/value.

## Options and imperative control

| Input | Default | Contract |
| --- | --- | --- |
| `preventDefault` | `false` | Cancels every managed submit before callbacks run |
| `onInvalid(result)` | no callback | Receives the invalid result |
| `onValid(result)` | no callback | Receives the result and its `FormData` |
| `onSkipped(result)` | no callback | Receives the `formnovalidate` case |
| `onReset({ form })` | no callback | Runs in a later task after each uncancelled reset |
| `validate({ submitter, focus })` | `submitter: null`, `focus: true` | Validates without dispatching a submit |
| `dispose()` | N/A | Removes listeners and cancels pending reset callbacks |

With `focus: true`, `validate()` uses one native `reportValidity()` call and retains browser-managed focus on the first invalid control. With `focus: false`, it uses one `checkValidity()` call and does not move focus.

Attaching twice to the same form returns the same handle. After `dispose()`, `validate()` fails and a new `attachFormValidation` call creates a new handle. A cancelled reset does not call `onReset`; an accepted reset first restores the associated controls' defaults.

## Controls and native submission

`tc-text-field` and `tc-switch` expose `validity`, `validationMessage`, `willValidate`, `checkValidity()`, `reportValidity()`, and `focus()`. Localized messages belong to the consumer through `required-message` and, for email fields, `type-mismatch-message`.

A trusted Enter in an enabled, editable `tc-text-field` respects the default submitter, `formnovalidate`, external controls, IME composition, and `keydown` cancellation. Without a submitter, it requests submission only when there is one blocking text-entry field.

The switch requires `ElementInternals` for its validation surface and fails with a descriptive message when unavailable. The text field can delegate that surface to its internal `input`. Consumers must validate Custom Elements, Shadow DOM, form-associated custom elements, and `ElementInternals` in every target browser or WebView.

## Executable evidence

The public signature lives in [`packages/ui-web/index.d.ts`](../../packages/ui-web/index.d.ts), and the implementation lives in [`packages/ui-web/src/form-validation.js`](../../packages/ui-web/src/form-validation.js). `pnpm ui-web:test` checks callbacks, focus, submitters, files, duplicate names, external controls, reset, cancellation, and disposal from the packed Chromium package.
