# Documentación de Thiscloud UI Aurora

[Inicio en español](../README.md) · [English documentation](README.en.md) · [Catálogo en vivo](https://ui.thiscloud.com.ar)

Esta página organiza la documentación por audiencia y hace visible el estado de traducción. El español es la entrada principal del repositorio; las fuentes técnicas todavía no traducidas permanecen disponibles mientras avanzan las siguientes unidades de trabajo del [programa documental](documentation-plan.md).

## Elegir un recorrido

| Necesidad | Comenzar por | Idioma actual |
| --- | --- | --- |
| Conocer el producto y probar la RC web | [README principal](../README.md) | Español e inglés |
| Explorar componentes y demostraciones | [Catálogo](https://ui.thiscloud.com.ar) | Español e inglés |
| Personalizar los tokens CSS exportados | [Referencia de tokens CSS](reference/css-tokens.md) | Español e inglés |
| Coordinar la validación de formularios nativos | [Validación de formularios nativos](guides/native-form-validation.md) | Español e inglés |
| Revisar semántica, teclado y límites de accesibilidad de los cuatro controles RC | [Accesibilidad de los controles web](guides/accessibility.md) | Español e inglés; guía del repositorio, no certificación |
| Probar el catálogo local o integrar `@thiscloud/ui-web` | [Empezar con la biblioteca web](getting-started/web.md) | Español e inglés; documentación del repositorio |
| Consultar cuatro contratos de la API web | [Referencia de API web](reference/web-api.md) | Español e inglés; documentación del repositorio |
| Validar compatibilidad del paquete web en el navegador o WebView objetivo | [Referencia de compatibilidad](reference/compatibility.md) | Español e inglés; evidencia local en Chromium, sin matriz universal |
| Verificar la incubación Flutter | [Inicio con Flutter](getting-started/flutter.md) | Español e inglés; paquete privado |
| Localizar etiquetas y mensajes de controles web | [Localización de controles](guides/localization.md) | Español e inglés; guía del repositorio, no API de locale |
| Comprender decisiones y dependencias | [Arquitectura](architecture.md) | Inglés, traducción pendiente |
| Desplegar o revertir el catálogo | [Despliegue](deployment.md) | Inglés, traducción pendiente |
| Contribuir y revisar cambios | [Contribución](../CONTRIBUTING.md) y [gobierno](governance.md) | Inglés, traducción pendiente |
| Reportar una vulnerabilidad | [Política de seguridad](../SECURITY.md) | Inglés, traducción pendiente |
| Revisar normas de colaboración y el contacto por conducta | [Código de conducta](../CODE_OF_CONDUCT.es.md) | Español e inglés; solicitud pública solo si aparece el formulario |

## Contrato documental

- Las APIs públicas se documentan sólo cuando tienen evidencia ejecutable.
- Las 65 demostraciones del catálogo no se presentan como componentes publicados.
- Los comandos deben poder copiarse y ejecutarse desde la ruta indicada.
- Las versiones viven en manifiestos y registros de publicación; la prosa no inventa estados.
- Los documentos español/inglés deben conservar la misma estructura y las mismas afirmaciones verificables.

## Estado del programa

| Unidad de trabajo | Estado |
| --- | --- |
| Entrada de producto con español como idioma principal y espejo inglés | Disponible |
| Guías bilingües de tokens CSS y validación de formularios nativos | Disponible |
| Guía bilingüe de accesibilidad de controles RC | Disponible en el repositorio; comprobaciones manuales y navegadores objetivo a cargo del consumidor |
| Referencia bilingüe de cuatro contratos de la API web | Disponible en el repositorio; no es una publicación del paquete |
| Arquitectura, despliegue, seguridad y gobierno en español | Pendiente |
| Inicio web bilingüe (catálogo local y tarball consumidor) | Disponible en el repositorio; no es una publicación del paquete |
| Guía bilingüe de la frontera Flutter (`publish_to: none`) | Disponible en el repositorio; paquete sin widgets de ejecución |
| Referencia pública generada y validación automática de enlaces | Pendiente |
| Código de conducta bilingüe y formulario de solicitud pública de contacto privado | Texto del repositorio; no acredita un canal privado ni la disponibilidad del formulario |

El tracker [#27](https://github.com/mdesantis1984/thiscloud-ui/issues/27) permanece abierto hasta completar el programa. Cada fase usa un issue hijo aprobado para evitar cerrar el tracker antes de tiempo.
