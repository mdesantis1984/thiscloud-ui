# Accessibility of web controls

[Español](accessibility.md) · [Documentation index](../README.en.md)

When integrating `@thiscloud/ui-web`, give every control an understandable name, supply your application's error messages, and check keyboard use, focus, and contrast with your theme. This guide describes **four repository RC controls**, not WCAG certification or screen-reader test results. The `0.1.0-rc.5` package is private: tests consume a locally built archive, not a registry publication.

## Minimal integration

Register the elements and import tokens as shown in the [web API reference](../reference/web-api.en.md#before-use). Use `label` or a `<label for="...">` associated with the host `id`; `name` identifies form data, **not** the accessible name. Provide your own text for relevant constraints:

```html
<form id="preferences" novalidate>
  <tc-switch id="updates" name="updates" label="Receive updates"
    required required-message="Enable updates to continue."></tc-switch>
  <tc-checkbox id="consent" name="consent" label="I accept the terms"
    required required-message="Confirm the terms."></tc-checkbox>
  <fieldset>
    <legend>Environment</legend>
    <tc-radio name="environment" value="test" label="Test" required
      required-message="Choose an environment."></tc-radio>
    <tc-radio name="environment" value="live" label="Production"></tc-radio>
  </fieldset>
  <tc-text-field id="email" name="email" label="Email address" type="email"
    helper="We will use this address to reply." required
    required-message="Enter an email address." type-mismatch-message="Enter a valid email address."></tc-text-field>
  <button type="submit">Continue</button>
</form>
```

`novalidate` lets [`attachFormValidation`](native-form-validation.en.md#shortest-managed-path) observe invalid submissions when using the helper; the helper does not add it or send data. If you do not use the helper and want native submission blocking, remove `novalidate`. Adapt labels, instructions, constraints, and messages to the actual context; the example's copy is not automatically translated by the package.

## Verifiable semantics and behavior

| Control | Implemented in the package | Automated assertion in Chromium |
| --- | --- | --- |
| `TcSwitch` | [`index.js`](../../packages/ui-web/src/index.js) and [`switch.html`](../../packages/ui-web/src/switch.html): button with `switch` role, `aria-checked`, name from `label` or associated `<label>`; Space toggles, Enter/right arrow turns on, Delete/left arrow turns off. `readonly` prevents toggling without disabling the button; `disabled` disables it and excludes form data. `required` error after interaction or validation: `role="alert"` and `aria-describedby` on the button. | [`test-ui-web-package.mjs`](../../scripts/test-ui-web-package.mjs): role/name, external and dynamic labels, Space/arrows, focus and `reportValidity()` validation, `readonly`/`disabled`, reset. Does not test audible alert announcement. |
| `TcCheckbox` | [`checkbox.js`](../../packages/ui-web/src/checkbox.js) and [`checkbox.html`](../../packages/ui-web/src/checkbox.html): one native `checkbox` input, name from `label` or `<label>`; Space toggles. `indeterminate` is visual: it does not change `checked` or submit data on its own. Own or `fieldset` `disabled` excludes interaction/data; no declared `readonly`. A visible `required` error sits in the node linked by `aria-describedby`, with `aria-invalid` on the input. | [`test-ui-web-package.mjs`](../../scripts/test-ui-web-package.mjs): role/name, label and Space activation, focus, indeterminate state, error/`aria-invalid`, disabled and reset. Does not test error announcement with a screen reader. |
| `TcRadio` | [`radio.js`](../../packages/ui-web/src/radio.js) and [`radio.html`](../../packages/ui-web/src/radio.html): one native `radio` input per host; shared `name`, form and root form the group. Arrows traverse enabled members and move focus; one selection per group. `disabled` excludes data/interaction; no declared `readonly`. The group's `required` constraint presents its error on the first enabled member. | [`test-ui-web-package.mjs`](../../scripts/test-ui-web-package.mjs): role/name, external label, down arrow between enabled members, focus and tab-stop position (`tabIndex`), group `required` error, disabled and reset. The example's `fieldset`/`legend` is consumer-supplied context; check its announcement manually. |
| `TcTextField` | [`text-field.js`](../../packages/ui-web/src/text-field.js) and [`text-field.html`](../../packages/ui-web/src/text-field.html): one native text/email input with name from `label` or `<label>`, `helper` and error linked by `aria-describedby`. After interaction or validation, the error has `role="alert"` and the input has `aria-invalid`. `readonly` retains data without validating constraints; `disabled` excludes it. `clearable` needs an appropriate `clear-label` action name. | [`test-ui-web-package.mjs`](../../scripts/test-ui-web-package.mjs): textbox/name, helper/error associations, `reportValidity()` focus, `required`/email message, Enter/Tab, clear with focus return, `readonly`/`disabled`, and reset. Does not test audible announcement or quality of supplied labels. |

These tests exercise a **packed-package consumer in Chromium**. An implemented accessible name and a role/key assertion do not establish comprehensive accessibility. See the [web contract](../reference/web-api.en.md#validationcontrol) and [native validation guide](native-form-validation.en.md#controls-and-native-submission) for `checkValidity()`, `reportValidity()`, and `focus()`; `attachFormValidation` coordinates a native form, not application copy or business rules. Catalog demonstrations do not extend the package API.

## Theme and outstanding manual checks

The [`--tc-focus`, `--tc-field-focus`, `--tc-field-error`, and selection-color tokens](../reference/css-tokens.en.md#exported-contract) affect focus, error, and states. Inheritance enables consumer themes, but token and reduced-motion tests **do not** measure contrast for every combination or guarantee visibility against your backgrounds and states.

- [ ] In every target browser or WebView, traverse all four controls using only the keyboard: Tab, Space, radio arrows, and documented switch actions; observe order, visible focus, and disabled/read-only states where available.
- [ ] Inspect effective names and descriptions on the target platform; confirm external labels, `fieldset`/`legend`, helper text, clear button, and state changes with actual assistive technology.
- [ ] Submit empty and invalid data: inspect visible messages, focus, descriptions, and error announcements; check copy localized by **your application** and behavior after reset.
- [ ] Measure text, focus, error, and control contrast across every theme/state using your final tokens; check zoom and reduced motion.

These are **consumer validation steps**, not results obtained here. This guide has no manual assistive-technology tests or Safari/Firefox evidence; validate each target environment before claiming compatibility.
