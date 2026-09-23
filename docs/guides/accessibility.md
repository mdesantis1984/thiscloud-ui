# Accesibilidad de los controles web

[English](accessibility.en.md) · [Índice de documentación](../README.md)

Al integrar `@thiscloud/ui-web`, asigne un nombre comprensible a cada control, aporte los mensajes de error de su aplicación y compruebe teclado, foco y contraste con su tema. Esta guía describe **cuatro controles RC del repositorio**, no una certificación WCAG ni un resultado de pruebas con lectores de pantalla. El paquete `0.1.0-rc.5` es privado: las pruebas consumen un archivo generado localmente, no una publicación en un registro.

## Integración mínima

Registre los elementos e importe los tokens según la [referencia de API web](../reference/web-api.md#antes-de-usarla). Use `label` o un `<label for="...">` asociado al `id` del host; `name` identifica el dato del formulario, **no** reemplaza el nombre accesible. Proporcione texto propio para las restricciones relevantes:

```html
<form id="preferences" novalidate>
  <tc-switch id="updates" name="updates" label="Recibir novedades"
    required required-message="Active las novedades para continuar."></tc-switch>
  <tc-checkbox id="consent" name="consent" label="Acepto las condiciones"
    required required-message="Confirme las condiciones."></tc-checkbox>
  <fieldset>
    <legend>Entorno</legend>
    <tc-radio name="environment" value="test" label="Pruebas" required
      required-message="Elija un entorno."></tc-radio>
    <tc-radio name="environment" value="live" label="Producción"></tc-radio>
  </fieldset>
  <tc-text-field id="email" name="email" label="Correo electrónico" type="email"
    helper="Usaremos este correo para responder." required
    required-message="Ingrese un correo." type-mismatch-message="Ingrese un correo válido."></tc-text-field>
  <button type="submit">Continuar</button>
</form>
```

`novalidate` permite a [`attachFormValidation`](native-form-validation.md#camino-mínimo-administrado) observar los envíos inválidos cuando se usa el helper; el helper no lo agrega ni envía datos. Si no usa el helper y desea el bloqueo de envío nativo, quite `novalidate`. Adapte etiquetas, instrucciones, restricciones y mensajes al contexto real; el texto del ejemplo no es una traducción automática del paquete.

## Semántica y comportamiento verificables

| Control | Implementado en el paquete | Aserción automatizada en Chromium |
| --- | --- | --- |
| `TcSwitch` | [`index.js`](../../packages/ui-web/src/index.js) y [`switch.html`](../../packages/ui-web/src/switch.html): botón con rol `switch`, `aria-checked`, nombre por `label` o `<label>` asociado; Espacio alterna, Enter/flecha derecha activa y Suprimir/flecha izquierda desactiva. `readonly` impide alternar sin deshabilitar el botón; `disabled` deshabilita el botón y excluye el dato. Error `required` tras interacción o validación: `role="alert"` y `aria-describedby` en el botón. | [`test-ui-web-package.mjs`](../../scripts/test-ui-web-package.mjs): rol/nombre, etiquetas externas y dinámicas, Espacio/flechas, foco y validación con `reportValidity()`, `readonly`/`disabled`, restablecimiento. No prueba anuncio audible del alerta. |
| `TcCheckbox` | [`checkbox.js`](../../packages/ui-web/src/checkbox.js) y [`checkbox.html`](../../packages/ui-web/src/checkbox.html): un `input` nativo `checkbox`, nombre por `label` o `<label>`; Espacio alterna. `indeterminate` es visual: no cambia `checked` ni aporta datos por sí mismo. `disabled` propio o de `fieldset` excluye interacción/datos; no hay `readonly` declarado. Error `required` visible en el nodo enlazado por `aria-describedby`, con `aria-invalid` en la entrada. | [`test-ui-web-package.mjs`](../../scripts/test-ui-web-package.mjs): rol/nombre, activación por etiqueta y Espacio, foco, estado indeterminado, error/`aria-invalid`, deshabilitación y restablecimiento. No prueba anuncio del error con lector de pantalla. |
| `TcRadio` | [`radio.js`](../../packages/ui-web/src/radio.js) y [`radio.html`](../../packages/ui-web/src/radio.html): un `input` nativo `radio` por host; mismo `name`, formulario y raíz forman el grupo. Flechas recorren miembros habilitados y mueven el foco; una selección por grupo. `disabled` excluye datos/interacción; no hay `readonly` declarado. La restricción `required` del grupo presenta el error en el primer miembro habilitado. | [`test-ui-web-package.mjs`](../../scripts/test-ui-web-package.mjs): rol/nombre, etiqueta externa, flecha abajo entre miembros habilitados, foco y posición de tabulación (`tabIndex`), error `required` del grupo, deshabilitación y restablecimiento. El `fieldset`/`legend` del ejemplo es contexto provisto por el consumidor; compruebe su anuncio manualmente. |
| `TcTextField` | [`text-field.js`](../../packages/ui-web/src/text-field.js) y [`text-field.html`](../../packages/ui-web/src/text-field.html): un `input` nativo de texto/correo con nombre por `label` o `<label>`, `helper` y error enlazados por `aria-describedby`. Tras interacción o validación, el error tiene `role="alert"` y la entrada `aria-invalid`. `readonly` conserva el dato sin validar restricciones; `disabled` lo excluye. `clearable` requiere una etiqueta de acción `clear-label` adecuada. | [`test-ui-web-package.mjs`](../../scripts/test-ui-web-package.mjs): textbox/nombre, asociaciones de ayuda/error, foco en `reportValidity()`, mensaje `required`/correo, Enter/Tab, limpieza con retorno del foco, `readonly`/`disabled` y restablecimiento. No prueba anuncio audible ni calidad de las etiquetas aportadas. |

Las pruebas citadas ejercitan el **consumidor del paquete empaquetado en Chromium**. Un nombre accesible implementado y una aserción de rol/tecla no demuestran accesibilidad integral. Consulte el [contrato web](../reference/web-api.md#validationcontrol) y la [guía de validación nativa](native-form-validation.md#controles-y-envío-nativo) para las llamadas `checkValidity()`, `reportValidity()` y `focus()`; `attachFormValidation` coordina un formulario nativo, no genera textos ni reglas de negocio. Las demostraciones del catálogo no amplían la API del paquete.

## Tema y comprobación manual pendiente

Los tokens [`--tc-focus`, `--tc-field-focus`, `--tc-field-error` y colores de selección](../reference/css-tokens.md#contrato-exportado) afectan foco, error y estados. La herencia permite temas del consumidor, pero las pruebas de tokens y movimiento reducido **no** miden el contraste de cada combinación, ni garantizan la visibilidad en su fondo y estados.

- [ ] En cada navegador o WebView objetivo, recorra los cuatro controles sólo con teclado: Tab, Espacio, flechas del radio y acciones documentadas del switch; observe orden, foco visible y estados deshabilitado/solo lectura donde existan.
- [ ] Inspeccione nombre y descripción efectivos en la plataforma de destino; confirme etiquetas externas, `fieldset`/`legend`, ayuda, botón de limpieza y cambios de estado con una tecnología de asistencia real.
- [ ] Envíe datos vacíos e inválidos: revise mensaje visible, foco, descripción y anuncio de error; compruebe los textos localizados que **su aplicación** aporta y el comportamiento tras reset.
- [ ] Mida contraste de texto, foco, error y controles en cada tema/estado con sus tokens finales; revise aumento de zoom y movimiento reducido.

Estos son **pasos de validación del consumidor**, no resultados obtenidos aquí. No hay prueba manual de tecnología de asistencia ni evidencia de Safari/Firefox en esta guía; valide cada entorno objetivo antes de declararlo compatible.
