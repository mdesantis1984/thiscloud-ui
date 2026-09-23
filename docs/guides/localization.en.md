# Localize web controls in an application

[Español](localization.md) · [Documentation index](../README.en.md)

The application supplies the labels, helper text and validation messages for `@thiscloud/ui-web` in the selected language. The catalog language switch is a catalog feature, not a package localization API. This example uses an RC control from the locally prepared [web package](../../packages/ui-web/README.md#supported-rc-api); it does not imply registry publication.

## Minimal path

In a consumer page, after installing the local tarball and registering the elements from a bundler entry, use the same control for both languages. The application decides when to call `showLanguage` (for example, from its own selector) and updates the text; the package does not listen for language changes.

```html
<tc-text-field name="email" type="email" required clearable></tc-text-field>
```

```js
import '@thiscloud/ui-web';

const field = document.querySelector('tc-text-field');
const copy = {
  es: { label: 'Correo electrónico', helper: 'Ingrese un correo de contacto.',
    'clear-label': 'Borrar correo', 'required-message': 'El correo es obligatorio.',
    'type-mismatch-message': 'Ingrese un correo válido.' },
  en: { label: 'Email address', helper: 'Enter a contact email.',
    'clear-label': 'Clear email', 'required-message': 'Email is required.',
    'type-mismatch-message': 'Enter a valid email address.' },
};

function showLanguage(language) {
  if (!Object.hasOwn(copy, language)) return;
  document.documentElement.lang = language;
  for (const [attribute, text] of Object.entries(copy[language])) field.setAttribute(attribute, text);
}

showLanguage('es'); // The application can call showLanguage('en') from its selector.
```

This example only changes strings and `lang` on this page; it does not implement a selector, storage or translation of other controls. Do not translate `tc-text-field`, `name`, `type`, `label`, `helper`, `clear-label`, `required-message`, `type-mismatch-message`, property names, import paths or CSS tokens. Translate the **text values**; field names and validation policy are application decisions. See [native form validation](native-form-validation.en.md) for the scope of `attachFormValidation`.

## Evidence and limits

| Surface | Current evidence | Limit |
| --- | --- | --- |
| ES/EN catalog | The [ES](../../apps/catalog/assets/i18n/es.json) and [EN](../../apps/catalog/assets/i18n/en.json) dictionaries supply its copy; [catalog.js](../../apps/catalog/catalog.js) accepts stored `en`/`es` in `thiscloud-ui-locale`, uses `es` without a valid preference, loads JSON, updates `document.documentElement.lang` and rerenders on switch. | The preference is stored after a successful language switch, not during the initial load; a failed load displays an error, not an automatic alternate translation. None of this sets the package language in another application. |
| Verification | [verify-ui-catalog.mjs](../../scripts/verify-ui-catalog.mjs) compares ES/EN key paths; the [Chromium package test](../../scripts/test-ui-web-package.mjs) checks visible catalog switching and consumer-supplied messages. | Key parity does not prove quality, coverage of the entire UI or persistence after reload. Language-switch assertions are about the catalog, not an SDK locale API. |
| RC controls | [TcTextField](../../packages/ui-web/src/text-field.js) accepts `label`, `helper`, `clear-label`, `required-message` and `type-mismatch-message`; [Checkbox](../../packages/ui-web/src/checkbox.js), [Radio](../../packages/ui-web/src/radio.js) and [Switch](../../packages/ui-web/src/index.js) accept `label` and `required-message`. | The field uses the browser's native message when a validation message is absent; the clear button uses `Clear` without `clear-label`. Switch defaults to `Choose an option.`; Checkbox falls back to the native message and Radio to the native message or `Choose an option.` if it is empty. None promises Spanish by default. |

## Consumer manual checks

- [ ] Switch ES ↔ EN using **your application's** selector; check `lang`, label, helper, clear button and required/email messages after triggering validation.
- [ ] Try missing supplied messages in every target browser: native text depends on the browser and its language; do not attribute that translation to the package.
- [ ] Review translation quality and control pronunciation/names with speakers and assistive technologies; these are not automatically verified here.
- [ ] If RTL, number/date formatting or pluralization are needed, design and validate them in the application: these files and tests do not establish support for them.
