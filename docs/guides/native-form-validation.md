# Validación de formularios nativos

[English](native-form-validation.en.md) · [Índice de documentación](../README.md)

`attachFormValidation(form, options)` coordina la validación de un `HTMLFormElement`. No crea un formulario personalizado, no envía solicitudes y no reemplaza las restricciones nativas.

## Camino mínimo administrado

```html
<form id="profile" novalidate>
  <tc-text-field name="organization" label="Organización" required
    required-message="La organización es obligatoria."></tc-text-field>
  <tc-switch name="updates" label="Recibir novedades" value="yes"></tc-switch>
  <button type="submit" name="intent" value="save">Guardar</button>
  <button type="submit" formnovalidate>Guardar borrador</button>
</form>
```

```js
import { attachFormValidation } from '@thiscloud/ui-web';

const form = document.querySelector('#profile');
const validation = attachFormValidation(form, {
  preventDefault: true,
  onValid({ formData }) {
    // La aplicación decide cómo enviar formData.
  },
  onInvalid({ invalidControls }) {
    console.info(`${invalidControls.length} controles inválidos`);
  },
  onSkipped({ reason }) {
    console.info(reason);
  },
});

// Al retirar la vista:
validation.dispose();
```

`novalidate` permite que el helper observe el evento `submit` inválido y presente un resultado completo. Sin ese atributo, el navegador puede bloquear el evento antes de que llegue al helper. Si deseas conservar el envío nativo cuando el formulario sea válido, omite `preventDefault: true`.

## Resultados

| Estado | Datos | Significado |
| --- | --- | --- |
| `invalid` | `form`, `submitter`, `invalidControls` | Falló una única pasada de restricciones nativas |
| `valid` | `form`, `submitter`, `formData` | El formulario es válido; `formData` incluye el submitter suministrado |
| `skipped` | `form`, `submitter`, `reason: 'formnovalidate'` | El submitter pidió omitir restricciones; no se informa como válido |

`invalidControls` contiene controles de `form.elements`, incluidos controles asociados mediante `form="id"`. `FormData` conserva nombres repetidos, archivos, controles externos y el nombre/valor del submitter.

## Opciones y control imperativo

| Entrada | Predeterminado | Contrato |
| --- | --- | --- |
| `preventDefault` | `false` | Cancela cada submit administrado antes de ejecutar callbacks |
| `onInvalid(result)` | sin callback | Recibe el resultado inválido |
| `onValid(result)` | sin callback | Recibe el resultado y su `FormData` |
| `onSkipped(result)` | sin callback | Recibe el caso `formnovalidate` |
| `onReset({ form })` | sin callback | Se ejecuta en una tarea posterior a cada reset no cancelado |
| `validate({ submitter, focus })` | `submitter: null`, `focus: true` | Valida sin emitir un submit |
| `dispose()` | N/A | Elimina listeners y cancela callbacks de reset pendientes |

Con `focus: true`, `validate()` usa una llamada nativa a `reportValidity()` y conserva el foco administrado por el navegador sobre el primer control inválido. Con `focus: false`, usa una llamada a `checkValidity()` y no mueve el foco.

Adjuntar dos veces sobre el mismo formulario devuelve el mismo handle. Después de `dispose()`, `validate()` falla y una nueva llamada a `attachFormValidation` crea otro handle. Un reset cancelado no ejecuta `onReset`; uno aceptado restaura primero los valores predeterminados de los controles asociados.

## Controles y envío nativo

`tc-text-field` y `tc-switch` exponen `validity`, `validationMessage`, `willValidate`, `checkValidity()`, `reportValidity()` y `focus()`. Los mensajes localizados pertenecen al consumidor mediante `required-message` y, para campos de correo, `type-mismatch-message`.

Un Enter confiable en un `tc-text-field` habilitado y editable respeta el submitter predeterminado, `formnovalidate`, controles externos, composición IME y cancelación de `keydown`. Sin submitter, sólo solicita envío cuando existe un único campo que bloquea el envío implícito.

El switch necesita `ElementInternals` para su superficie de validación y falla con un mensaje descriptivo si no está disponible. El campo de texto puede delegar esa superficie a su `input` interno. El consumidor debe validar Custom Elements, Shadow DOM, form-associated custom elements y `ElementInternals` en cada navegador o WebView objetivo.

## Evidencia ejecutable

La firma pública vive en [`packages/ui-web/index.d.ts`](../../packages/ui-web/index.d.ts) y la implementación en [`packages/ui-web/src/form-validation.js`](../../packages/ui-web/src/form-validation.js). `pnpm ui-web:test` comprueba desde el paquete generado callbacks, foco, submitters, archivos, nombres repetidos, controles externos, reset, cancelación y disposición en Chromium.
