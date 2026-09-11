# Documentación de Thiscloud UI Aurora

[Inicio en español](../README.md) · [English](../README.en.md) · [Catálogo en vivo](https://ui.thiscloud.com.ar)

Esta página organiza la documentación por audiencia y hace visible el estado de traducción. El español es la entrada principal del repositorio; las fuentes técnicas todavía no traducidas permanecen disponibles mientras avanzan las siguientes unidades de trabajo del [programa documental](documentation-plan.md).

## Elegir un recorrido

| Necesidad | Comenzar por | Idioma actual |
| --- | --- | --- |
| Conocer el producto y probar la RC web | [README principal](../README.md) | Español e inglés |
| Explorar componentes y demostraciones | [Catálogo](https://ui.thiscloud.com.ar) | Español e inglés |
| Integrar `@thiscloud/ui-web` | [Guía del paquete web](../packages/ui-web/README.md) | Inglés, traducción pendiente |
| Entender la frontera Flutter | [Guía de `thiscloud_ui`](../packages/ui_kit/README.md) | Inglés, traducción pendiente |
| Comprender decisiones y dependencias | [Arquitectura](architecture.md) | Inglés, traducción pendiente |
| Desplegar o revertir el catálogo | [Despliegue](deployment.md) | Inglés, traducción pendiente |
| Contribuir y revisar cambios | [Contribución](../CONTRIBUTING.md) y [gobierno](governance.md) | Inglés, traducción pendiente |
| Reportar una vulnerabilidad | [Política de seguridad](../SECURITY.md) | Inglés, traducción pendiente |

## Contrato documental

- Las APIs públicas se documentan sólo cuando tienen evidencia ejecutable.
- Las 67 demostraciones del catálogo no se presentan como componentes publicados.
- Los comandos deben poder copiarse y ejecutarse desde la ruta indicada.
- Las versiones viven en manifiestos y registros de publicación; la prosa no inventa estados.
- Los documentos español/inglés deben conservar la misma estructura y las mismas afirmaciones verificables.

## Estado del programa

| Unidad de trabajo | Estado |
| --- | --- |
| Entrada de producto con español como idioma principal y espejo inglés | En curso en issue #38 |
| Arquitectura, despliegue, seguridad y gobierno en español | Pendiente |
| Guías bilingües de los paquetes web y Flutter | Pendiente |
| Referencia pública generada y validación automática de enlaces | Pendiente |

El tracker [#27](https://github.com/mdesantis1984/thiscloud-ui/issues/27) permanece abierto hasta completar el programa. Cada fase usa un issue hijo aprobado para evitar cerrar el tracker antes de tiempo.
