# Localizar los controles web en una aplicación

[English](localization.en.md) · [Índice de documentación](../README.md)

La aplicación aporta las etiquetas, ayudas y mensajes de validación de `@thiscloud/ui-web` en el idioma elegido. El cambio de idioma del catálogo es una función del catálogo, no una API de localización del paquete. Este ejemplo usa un control RC del [paquete web](../../packages/ui-web/README.md#supported-rc-api) preparado localmente; no implica una publicación en un registro.

## Camino mínimo

En una página consumidora, después de instalar el archivo local y registrar los elementos desde la entrada con bundler, use el mismo control para ambos idiomas. La aplicación decide cuándo llamar a `showLanguage` (por ejemplo, desde su propio selector) y actualiza el texto; el paquete no escucha cambios de idioma.

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

showLanguage('es'); // La aplicación puede invocar showLanguage('en') desde su selector.
```

El ejemplo sólo cambia cadenas y `lang` en esta página; no implementa un selector, almacenamiento ni traducción de otros controles. Mantenga sin traducir `tc-text-field`, `name`, `type`, `label`, `helper`, `clear-label`, `required-message`, `type-mismatch-message`, los nombres de propiedades, las rutas de importación y los tokens CSS. Traduzca los **valores de texto**; los nombres de campo y la política de validación son decisiones de la aplicación. Consulte la [validación de formularios nativos](native-form-validation.md) para el alcance de `attachFormValidation`.

## Evidencia y límites

| Superficie | Evidencia actual | Límite |
| --- | --- | --- |
| Catálogo ES/EN | Los [diccionarios ES](../../apps/catalog/assets/i18n/es.json) y [EN](../../apps/catalog/assets/i18n/en.json) aportan su texto; [catalog.js](../../apps/catalog/catalog.js) acepta `en`/`es` guardados en `thiscloud-ui-locale`, usa `es` si falta una preferencia válida, carga JSON, actualiza `document.documentElement.lang` y vuelve a renderizar al cambiar. | La preferencia se guarda después de un cambio de idioma exitoso, no durante la carga inicial; si falla la carga, aparece un error, no una traducción alternativa automática. Nada de esto configura el idioma del paquete en otra aplicación. |
| Comprobación | [verify-ui-catalog.mjs](../../scripts/verify-ui-catalog.mjs) compara rutas de claves ES/EN; la [prueba del paquete en Chromium](../../scripts/test-ui-web-package.mjs) comprueba cambios visibles del catálogo y mensajes proporcionados por el consumidor. | La paridad de claves no demuestra calidad, cobertura de toda la interfaz ni persistencia tras recargar. Las pruebas de cambios de idioma corresponden al catálogo, no a una API de locale del SDK. |
| Controles RC | [TcTextField](../../packages/ui-web/src/text-field.js) acepta `label`, `helper`, `clear-label`, `required-message` y `type-mismatch-message`; [Checkbox](../../packages/ui-web/src/checkbox.js), [Radio](../../packages/ui-web/src/radio.js) y [Switch](../../packages/ui-web/src/index.js) aceptan `label` y `required-message`. | El campo usa el mensaje nativo del navegador cuando falta un mensaje de validación; el botón de limpieza usa `Clear` si falta `clear-label`. Switch usa `Choose an option.` por defecto; Checkbox recurre al mensaje nativo y Radio al nativo o `Choose an option.` si este está vacío. Ninguno promete idioma español por defecto. |

## Comprobación manual del consumidor

- [ ] Cambie ES ↔ EN con el selector **de su aplicación**; compruebe `lang`, etiqueta, ayuda, botón de limpieza y mensajes `required`/correo después de activar la validación.
- [ ] Pruebe sin mensajes suministrados en cada navegador objetivo: el texto nativo depende del navegador y de su idioma; no atribuya esa traducción al paquete.
- [ ] Revise con hablantes y tecnologías de asistencia la calidad de la traducción y la pronunciación/nombre de controles; no se verifican aquí automáticamente.
- [ ] Si necesita RTL, formatos de números y fechas o pluralización, diséñelos y valídelos en la aplicación: estos archivos y pruebas no establecen soporte para ellos.
