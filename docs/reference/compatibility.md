# Compatibilidad de la biblioteca web

[English](compatibility.en.md) · [Índice de documentación](../README.md)

Antes de integrar `@thiscloud/ui-web`, compruebe las capacidades de su navegador o WebView objetivo y pruebe los formularios en esa versión concreta. La evidencia automatizada del paquete generado cubre **Chromium**, no una matriz universal de navegadores, WebViews o tecnologías de asistencia. Consulte el [límite de soporte del paquete](../../packages/ui-web/SUPPORT.md) y la [referencia de API web](web-api.md).

## Qué está verificado y qué no

| Superficie | Evidencia del repositorio | Límite para el consumidor |
| --- | --- | --- |
| Paquete web local | [`package.json`](../../packages/ui-web/package.json) declara `@thiscloud/ui-web` `0.1.0-rc.5`, `private: true`, exports del módulo y de `tokens.css`. La [prueba del paquete generado](../../scripts/test-ui-web-package.mjs) crea un tarball, lo copia a un consumidor temporal y lo ejercita en Chromium. | Verificado localmente; **no** es una publicación de `rc.5` en un registro. El catálogo no equivale a instalar el paquete. |
| Controles y formularios | El [manifiesto](../../contracts/components.json), las [declaraciones](../../packages/ui-web/index.d.ts) y el [registro de elementos](../../packages/ui-web/src/index.js) distinguen `TcSwitch`, `TcCheckbox`, `TcRadio`, `TcTextField`, el tipo `ValidationControl` y el helper `attachFormValidation`. | Las entradas de catálogo adicionales no son API RC. Custom Elements y Shadow DOM son necesarios para estos controles; la asociación nativa con formularios depende de form-associated custom elements y `ElementInternals`. |
| Otros destinos | El [manifiesto](../../contracts/components.json) declara HTML y Go sobre el contrato web; Blazor figura como planificado. Flutter apunta a widgets nativos, pero su [paquete](../../packages/ui_kit/pubspec.yaml) declara `publish_to: none` y su [entrada de ejecución](../../packages/ui_kit/lib/thiscloud_ui.dart) no exporta widgets. | La declaración de destinos no demuestra pruebas de navegador/WebView para HTML o Go, ni un adaptador Blazor disponible o una API Flutter de widgets de ejecución. |

## Comprobación en el destino

1. Prepare el [paquete local para un consumidor](../getting-started/web.md#recorrido-2-probar-el-paquete-en-una-aplicacion); cargue su importación lateral en la aplicación objetivo. Compruebe en esa versión del navegador/WebView que se registren `tc-switch`, `tc-checkbox`, `tc-radio` y `tc-text-field`, y que se renderice su Shadow DOM.
2. Verifique Custom Elements, Shadow DOM, form-associated custom elements y `ElementInternals` en el entorno real, incluidos los WebViews integrados. La [implementación](../../packages/ui-web/src/index.js) requiere `ElementInternals` para validar `TcSwitch`; la [prueba en Chromium](../../scripts/test-ui-web-package.mjs) comprueba un error descriptivo si faltan internals y un fallback de validación del `input` nativo de `TcTextField`. Ese fallback **no** prueba asociación completa con formularios sin `ElementInternals`.
3. En un formulario nativo del consumidor, compruebe `FormData`, validación, envío, restablecimiento, foco y teclado de los controles usados; si usa `attachFormValidation`, siga la [guía de validación nativa](../guides/native-form-validation.md). Repita las pruebas tras cambios de versión del navegador, WebView o integración.
4. Documente las versiones y resultados de **cada** navegador/WebView elegido, y realice pruebas manuales de accesibilidad con sus tecnologías de asistencia objetivo. Safari, Firefox, WebViews híbridos y lectores de pantalla **no están verificados aquí**; tampoco se acredita soporte Flutter nativo ni compatibilidad universal.

## Alcance del resultado

Una ejecución exitosa de la [suite del paquete generado](../../scripts/test-ui-web-package.mjs) aporta evidencia para ese tarball y Chromium, no para la aplicación consumidora ni para otros motores. Para fallos reproducibles, siga las indicaciones de [SUPPORT.md](../../packages/ui-web/SUPPORT.md) e incluya versión del runtime y una página mínima. Esta referencia es documentación del repositorio, no un compromiso de soporte o publicación.
