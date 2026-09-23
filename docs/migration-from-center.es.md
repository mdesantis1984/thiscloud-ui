# Migración desde Thiscloud Center

[English](migration-from-center.md) · [Índice de documentación](README.md)

Aurora tiene su propio repositorio, [`mdesantis1984/thiscloud-ui`](https://github.com/mdesantis1984/thiscloud-ui), y es responsable del código de interfaz y de los contratos de publicación indicados abajo. Esta guía registra la separación histórica de Thiscloud Center y la frontera prevista para consumidores; **no** verifica que Center haya migrado su aplicación, dependencias o despliegue.

## Qué pertenece a Aurora

| Recurso | Responsable en el repositorio |
| --- | --- |
| Catálogo de componentes y ruta de descarga | [`apps/catalog/`](../apps/catalog/) |
| SDK web/híbrido | [`packages/ui-web/`](../packages/ui-web/) |
| Paquete Flutter en incubación | [`packages/ui_kit/`](../packages/ui_kit/) |
| Compilación, verificación, empaquetado y servidor | [`scripts/`](../scripts/) |
| Contenedor y configuración de origen | [`Dockerfile`](../Dockerfile) y [`deploy/`](../deploy/) |
| Políticas de CI, publicación, dependencias, issues y PR | [`.github/`](../.github/) |

Estas son ubicaciones **dentro del repositorio de Aurora**, no una ruta privada de una estación de trabajo ni una afirmación sobre el árbol de trabajo actual de Center. La [frontera arquitectónica](architecture.md) asigna la composición del producto, la navegación y la persistencia a los consumidores, no a este framework de interfaz.

## Qué debe decidir y verificar Center

Center debería consumir un artefacto versionado de Aurora en lugar de copiar su código fuente, vincular repositorios con `workspace:*`, importar módulos privados o gestionar el despliegue del catálogo de Aurora. Esta es la **frontera de dependencias objetivo**, no evidencia de que Center ya la cumpla. No se inspeccionó ningún repositorio ni host de Center para esta guía.

El registro anterior de migración describía commits históricos de interfaz en la rama `main` de Center de aquel momento; no se verificó el estado actual de sus ramas. Antes de cualquier cambio en Center autorizado por separado, sus responsables deben establecer la base actual de la aplicación, identificar código de interfaz duplicado y referencias de dependencias, seleccionar una versión del artefacto y verificar el comportamiento del consumidor y la reversión mediante el proceso de revisión de Center. No se deben eliminar ni reescribir los commits históricos de interfaz; los cambios en el árbol de trabajo y la documentación del producto de Center requieren sus propios PR revisados. Esta página no ejecuta ni aprueba esos cambios.

## Publicación histórica y límites actuales

El registro anterior de migración describe la transferencia del tag `ui-web-v0.1.0-rc.1` y sus archivos de publicación sin alterar los bytes del paquete. El [registro de checksums](../packages/ui-web/release-checksums.json) conserva un digest de `0.1.0-rc.1`. Este registro local no vuelve a comprobar la publicación remota ni los bytes de los endpoints públicos actuales.

| Ruta documentada para rc.1 | Referencia histórica, no comprobación actual de disponibilidad |
| --- | --- |
| Catálogo | `https://ui.thiscloud.com.ar` |
| Descarga | `https://ui.thiscloud.com.ar/downloads/thiscloud-ui-web-0.1.0-rc.1.tgz` |
| Publicación | `https://github.com/mdesantis1984/thiscloud-ui/releases/tag/ui-web-v0.1.0-rc.1` |

El [manifiesto actual del paquete](../packages/ui-web/package.json) identifica `0.1.0-rc.5` con `private: true`; la [entrada principal del repositorio](../README.md) distingue este candidato exclusivo del repositorio de la versión pública `rc.1` documentada. Ni el registro de checksums ni esta guía prueban que `rc.5` se haya publicado o que Center consuma alguna versión. Se debe verificar el artefacto real y el entorno objetivo antes de proponer una migración del consumidor; la [guía de inicio web](getting-started/web.md) trata las pruebas locales del paquete, no un despliegue de Center.
