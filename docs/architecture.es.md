# Arquitectura de Aurora y frontera con los consumidores

[English](architecture.md) · [Índice de documentación](README.md)

Thiscloud UI Aurora produce artefactos de interfaz reutilizables; los productos Thiscloud consumen artefactos versionados, no el código fuente del repositorio. La [presentación del repositorio](../README.md) y la [guía del paquete web](../packages/ui-web/README.md) distinguen la versión web pública `0.1.0-rc.1` de la revisión privada `0.1.0-rc.5`, validada en el repositorio. Una demostración del catálogo no es una API publicada.

## Responsabilidades

| Área | Aurora se encarga de | El consumidor se encarga de |
| --- | --- | --- |
| Componentes | Tokens, renderizado, interacción, semántica de accesibilidad y tipos públicos | Composición de productos, navegación, analítica y reglas de negocio |
| Estilos | Variantes, tokens, temas y densidad de componentes | Decisiones de marca específicas del producto |
| Formularios | Participación de controles y primitivas de validación | Envío, efectos asíncronos, llamadas a API, errores de dominio y persistencia |
| Localización | Contratos neutrales de componentes y textos de demostración del catálogo | Textos del producto y terminología del dominio |
| Distribución | Recursos del paquete, sumas de verificación locales y compilación del catálogo | Selección de versiones y validación del entorno de ejecución de destino |

Estas fronteras se basan en la [API y el comportamiento de formularios del paquete web](../packages/ui-web/README.md) y el [contrato del repositorio](../AGENTS.md). El asistente de validación no envía solicitudes ni proporciona textos localizados; ambas responsabilidades corresponden al consumidor.

## Dirección de dependencias

```text
Código fuente de Aurora -> recursos de paquete versionados -> producto consumidor
```

Aurora no importa repositorios de productos. Los consumidores usan las exportaciones del paquete, no rutas de código fuente de Aurora, módulos privados, archivos generados del catálogo ni enlaces al espacio de trabajo; las [exportaciones del paquete web](../packages/ui-web/package.json) y la [guía de consumo](getting-started/web.md) describen los puntos de entrada disponibles.

## Contrato portable de componentes

[`contracts/components.json`](../contracts/components.json) declara los entornos de ejecución y el soporte por entrada de la familia `Inputs/Forms`. Distingue componentes de contratos de tipos y asistentes. Hay que consultar el valor `support` de cada entrada, sin interpretar las rutas del catálogo como controles implementados:

| Destino | Entorno declarado | Frontera actual |
| --- | --- | --- |
| Web | `web-component` | Cuatro controles en estado de candidato de publicación en la revisión privada de `@thiscloud/ui-web` |
| HTML | `web-component`, hereda web | Uso directo del paquete en un navegador |
| Go | `server-rendered-web-component`, hereda web | Marcado generado en el servidor y recursos del paquete web; no implica un entorno de interfaz propio de Go |
| Blazor | `razor-web-component-wrapper`, hereda web | Adaptador ligero Razor/JS interop planificado, no distribuido |
| Flutter | `native-widget` | Widgets nativos planificados; el paquete privado `thiscloud_ui` no publica widgets de ejecución |

`release-candidate` registra la evidencia actual del paquete en el manifiesto, no su publicación. `planned` no implica soporte; `not-applicable` indica que el destino no representa ese contrato en ejecución. El [manifiesto](../contracts/components.json), la [guía del paquete web](../packages/ui-web/README.md) y los [metadatos del paquete Flutter](../packages/ui_kit/pubspec.yaml) respaldan estos estados. Desde la raíz del repositorio, `pnpm contracts:check` valida el manifiesto y las declaraciones mediante los [scripts del paquete](../package.json); las nuevas propiedades y eventos necesitan implementación y pruebas antes de cambiar de estado.

## Distribución y verificación

La [guía del paquete web](../packages/ui-web/README.md) documenta el empaquetado local, la evidencia de consumo en Chromium y los límites de compatibilidad con navegadores de destino. El tarball y la suma de verificación de `0.1.0-rc.5` son evidencia del repositorio, no una publicación en un registro; consulte el [registro de sumas de verificación](../packages/ui-web/release-checksums.json) y la [presentación del repositorio](../README.md) para distinguir `rc.1` pública de `rc.5` disponible solo en el repositorio. Flutter conserva su frontera de incubación privada con [`publish_to: none`](../packages/ui_kit/pubspec.yaml). Los detalles del despliegue del catálogo figuran en la [guía de despliegue](deployment.md); esta descripción de arquitectura no autoriza un despliegue ni una publicación.
