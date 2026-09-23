# Referencia de API web

[English](web-api.en.md) · [Índice de documentación](../README.md)

Esta referencia describe cuatro superficies de `@thiscloud/ui-web`: `TcSwitch`, `TcTextField`, el tipo `ValidationControl` y `attachFormValidation`. La revisión `0.1.0-rc.5` es un paquete privado verificable mediante un archivo local; esta página del repositorio no implica publicación en un registro. `TcCheckbox` y `TcRadio` también son API RC verificadas: consulte la [guía del paquete](../../packages/ui-web/README.md) para sus contratos.

## Antes de usarla

Desde la raíz del repositorio, consulte la [preparación del paquete local](../../packages/ui-web/README.md#supported-rc-api) y sus importaciones; el archivo generado no es una descarga pública. Se requieren Node.js 22 y pnpm 11.13.1 para los comandos del repositorio y Chrome/Chromium local para su prueba de navegador. En el consumidor se necesitan Custom Elements, Shadow DOM y, para la asociación nativa de controles con formularios, form-associated custom elements y `ElementInternals`. La matriz automatizada cubre Chromium con el paquete generado; valide por separado cada navegador o WebView objetivo.

```js
// En la entrada del consumidor con bundler, después de preparar el paquete local.
import '@thiscloud/ui-web';
import '@thiscloud/ui-web/tokens.css';
import { attachFormValidation } from '@thiscloud/ui-web';
```

La importación del módulo registra `<tc-switch>`, `<tc-checkbox>`, `<tc-radio>` y `<tc-text-field>`; `tokens.css` exporta los tokens de estilos. Para los tipos de TypeScript, use `import type { TcSwitch, TcTextField, ValidationControl, FormValidationResult } from '@thiscloud/ui-web'`. La [declaración pública](../../packages/ui-web/index.d.ts) es la fuente de firmas completas.

## `TcSwitch` — `<tc-switch>`

```html
<tc-switch name="updates" label="Recibir novedades" value="yes" required
  required-message="Seleccione una opción."></tc-switch>
```

| Propiedad tipada | Contrato |
| --- | --- |
| `checked`, `defaultChecked`, `disabled`, `readOnly`, `required: boolean` | Selección, valor al restablecer y estados de interacción/validación. |
| `label`, `name`, `value`, `requiredMessage: string` | Etiqueta, dato de formulario y mensaje de restricción; `value` vale `on` si no se define. |
| `size: 'small' \| 'medium' \| 'large' \| string` | Tamaño; predeterminado `medium`. |
| `tone: 'primary' \| 'secondary' \| string` | Tono; predeterminado `primary`. |

Las propiedades corresponden a atributos HTML con los mismos nombres en minúsculas, salvo `readOnly` → `readonly`, `defaultChecked` (valor de restablecimiento en memoria) y `requiredMessage` → `required-message`. Las cadenas adicionales de `size` y `tone` son admitidas por la declaración, pero no representan variantes visuales verificadas. El switch marcado aporta `value` al formulario; desmarcado o deshabilitado no aporta valor. `required` exige que esté marcado, excepto cuando está deshabilitado o es de solo lectura. Restablecer recupera `defaultChecked`. Un cambio del usuario emite `input` y `change` con burbujeo y composición; cambiar `checked` desde código no los emite. La activación usa puntero, Espacio, Enter, flechas izquierda/derecha y Suprimir según la implementación; un estado `readOnly` no alterna.

## `TcTextField` — `<tc-text-field>`

```html
<tc-text-field name="email" label="Correo electrónico" type="email" required
  required-message="El correo es obligatorio."
  type-mismatch-message="Ingrese un correo válido." clearable></tc-text-field>
```

| Propiedad tipada | Contrato |
| --- | --- |
| `value`, `defaultValue`, `name`, `label`, `helper`, `autocomplete: string` | Valor, valor de restablecimiento, dato y texto del campo. |
| `clearLabel`, `requiredMessage`, `typeMismatchMessage: string` | Etiqueta del botón de limpieza y mensajes aportados por el consumidor. |
| `type: 'text' \| 'email'` | Entrada de una línea; predeterminado `text`. |
| `variant: 'standard' \| 'filled' \| 'outlined'` | Variante visual; predeterminada `outlined`. |
| `required`, `readOnly`, `disabled`, `clearable: boolean` | Restricciones y botón opcional de limpieza. |

Los atributos equivalentes usan `readonly`, `clear-label`, `required-message` y `type-mismatch-message`; `defaultValue` es el valor de restablecimiento en memoria. Un tipo HTML distinto de `email` se interpreta como `text`; una variante desconocida se interpreta como `outlined`. El campo aporta `value` si está habilitado y restaura `defaultValue` al restablecer. La entrada nativa dentro del Shadow DOM produce `input`; al confirmar un cambio el host emite `change` con burbujeo y composición. El botón de limpieza produce ambos eventos mediante la entrada; asignar `value` desde código no constituye una acción del usuario. La entrada tiene validación `required` y de correo, no máscaras, modo multilínea, otros tipos ni envío de red. Los mensajes no se traducen automáticamente.

## `ValidationControl`

Es una interfaz TypeScript, **no** un elemento HTML ni un objeto que se construya. `TcSwitch`, `TcTextField`, `TcCheckbox` y `TcRadio` implementan su superficie de validación:

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

El switch y los controles de selección necesitan `ElementInternals` para esta superficie y arrojan un error descriptivo sin él; `TcTextField` puede delegar la validación a su `input` interno. Cada control administra su presentación de error. La interfaz no promete adaptadores de framework ni validación remota.

## `attachFormValidation(form, options)`

Firma: `attachFormValidation(form: HTMLFormElement, options?: FormValidationOptions): FormValidationHandle`. Requiere un formulario nativo. El handle expone `validate(options?: { submitter?: HTMLElement | null; focus?: boolean }): FormValidationResult` y `dispose(): void`.

Agregue el formulario al documento y ejecute el siguiente módulo del consumidor después de que el DOM esté listo. La importación registra los elementos; el ejemplo registra resultados locales y no envía datos.

```html
<form id="profile" novalidate>
  <tc-text-field name="organization" label="Organización" required
    required-message="La organización es obligatoria."></tc-text-field>
  <button type="submit" name="intent" value="save">Guardar</button>
  <button type="submit" name="intent" value="draft" formnovalidate>Guardar borrador</button>
  <button type="reset">Restablecer</button>
</form>
```

```js
import { attachFormValidation } from '@thiscloud/ui-web';

const form = document.querySelector('form#profile');
if (!(form instanceof HTMLFormElement)) throw new Error('Se requiere el formulario #profile.');
const handle = attachFormValidation(form, {
  preventDefault: true,
  onValid({ formData }) { console.info([...formData.entries()]); },
  onInvalid({ invalidControls }) { console.info(invalidControls.length); },
  onSkipped({ reason }) { console.info(reason); },
  onReset({ form }) { console.info(form.id); },
});
const result = handle.validate({ focus: false });
console.info(result.status);
// Al retirar la vista, invoque handle.dispose().
```

| `status` | Resultado discriminado (todos incluyen `form` y `submitter?`) |
| --- | --- |
| `'invalid'` | `invalidControls: ValidationControl[]` tras una pasada nativa fallida. |
| `'valid'` | `formData: FormData` incorpora el par `name`/`value` de un submitter apto con nombre si se proporcionó; uno sin nombre no aporta entrada. |
| `'skipped'` | `reason: 'formnovalidate'` si el submitter omite las restricciones; no es un resultado válido. |

`FormValidationOptions` acepta `preventDefault?: boolean` (predeterminado `false`) y los callbacks `onInvalid`, `onValid`, `onSkipped` (cada uno recibe `FormValidationResult`) y `onReset({ form })`. `validate()` usa `reportValidity()` con `focus: true` (predeterminado), o `checkValidity()` con `focus: false`; no emite un `submit`. El helper observa el `submit` del formulario, cancela los inválidos y, con `preventDefault: true`, cancela todos los envíos administrados **antes** de los callbacks. Con validación nativa activada, el navegador puede bloquear un envío inválido antes del evento `submit`; para recibir el resultado mediante el helper, use `novalidate` en el formulario o invoque `validate()` explícitamente. No establece `novalidate` por sí mismo.

Adjuntar dos veces al mismo formulario devuelve el mismo handle hasta `dispose()`. Un reset no cancelado notifica `onReset` en una tarea posterior; `dispose()` elimina listeners y cancela notificaciones pendientes, y después `validate()` falla. El helper no envía solicitudes, no modifica `FormData`, no proporciona mensajes localizados y no decide la navegación: la aplicación conserva esas responsabilidades. Consulte la [guía de validación nativa](../guides/native-form-validation.md) para un formulario completo y sus límites.

## Evidencia y alcance

Las firmas proceden de [`index.d.ts`](../../packages/ui-web/index.d.ts), las importaciones de [`package.json`](../../packages/ui-web/package.json) y el soporte declarado de [`contracts/components.json`](../../contracts/components.json). La [prueba del paquete generado](../../scripts/test-ui-web-package.mjs) ejercita los controles y el helper en Chromium; no certifica otros navegadores, lectores de pantalla ni todas las demostraciones del catálogo. Esta referencia describe API del repositorio y no cambia el estado de publicación del paquete.
