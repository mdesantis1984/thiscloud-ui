# Empezar con la biblioteca web

[English](web.en.md) · [Índice de documentación](../README.md)

Usa el catálogo para explorar las demostraciones o instala un tarball generado localmente para probar `@thiscloud/ui-web` en tu propia aplicación. Son recorridos distintos: el catálogo no instala el paquete y el tarball de `0.1.0-rc.5` no es una publicación pública.

## Antes de comenzar

- Desde la raíz de este repositorio: Node.js 22, pnpm 11.13.1, dependencias ya disponibles y Chrome/Chromium para la comprobación automatizada del paquete. La compilación no instala dependencias; si faltan, detente y resuelve el entorno por separado.
- Para integrar el paquete: una aplicación web con bundler que resuelva importaciones de JavaScript y CSS, y un navegador con Custom Elements y Shadow DOM. Los controles de selección asociados a formularios requieren form-associated custom elements y `ElementInternals`; verifica esas capacidades en cada navegador o WebView objetivo.
- No se garantiza compatibilidad entre navegadores ni se acredita aquí una evaluación manual con tecnologías de asistencia. La matriz automatizada del paquete usa Chromium.

## Recorrido 1: ver el catálogo local

En la **raíz del repositorio**, con las dependencias presentes:

```bash
pnpm ui-catalog:build
pnpm ui-catalog:serve
```

Abre `http://127.0.0.1:8095/framework-preview.html` en la misma máquina. El resultado esperado es el catálogo bilingüe con seis límites de API verificados y 65 demostraciones de diseño; esas demostraciones no son 65 componentes publicados. Si el puerto 8095 ya está ocupado, reutiliza la instancia existente o asigna otro con `UI_CATALOG_PORT` antes de iniciar el servidor; no abras una segunda instancia en el mismo puerto.

## Recorrido 2: probar el paquete en una aplicación

En la **raíz del repositorio**, con las dependencias presentes, prepara el archivo local y su checksum:

```bash
pnpm release:prepare
```

El resultado esperado es `tmp/release/thiscloud-ui-web-0.1.0-rc.5.tgz` y su archivo `.sha256`. Es un artefacto local ignorado por Git, no una descarga pública de `rc.5`. Copia el `.tgz` al directorio de trabajo de tu aplicación consumidora. Desde **ese directorio**, con pnpm configurado:

```bash
pnpm add ./thiscloud-ui-web-0.1.0-rc.5.tgz
```

En la entrada JavaScript procesada por el bundler de esa aplicación:

```js
import '@thiscloud/ui-web';
import '@thiscloud/ui-web/tokens.css';
```

En el HTML que carga esa entrada:

```html
<tc-checkbox name="terms" label="Accept terms" value="accepted" required></tc-checkbox>
<tc-radio name="environment" value="production" label="Production"></tc-radio>
<tc-switch name="notifications" label="Notifications"></tc-switch>
<tc-text-field name="organization" label="Organization"></tc-text-field>
```

Al cargar la aplicación en un navegador compatible, deben definirse `tc-checkbox`, `tc-radio`, `tc-switch` y `tc-text-field`. Los otros dos límites verificados son el tipo TypeScript `ValidationControl` y el helper `attachFormValidation`; no corresponden a otras etiquetas HTML. Consulta la [guía del paquete](../../packages/ui-web/README.md) para el comportamiento de los controles y la [guía de validación nativa](../guides/native-form-validation.md) para integrar el helper con un formulario.

## Límites y diagnóstico

| Síntoma | Comprueba |
| --- | --- |
| `pnpm` o la compilación falla por dependencias ausentes | Usa Node.js 22 y pnpm 11.13.1; el recorrido presupone dependencias locales y no ejecuta una instalación del repositorio. |
| El import CSS o el nombre del paquete no se resuelven | Ejecuta `pnpm add` en la aplicación consumidora y usa un bundler que admita los exports `.` y `./tokens.css` del paquete. |
| La etiqueta aparece sin comportamiento | Confirma que se ejecutó el import lateral de `@thiscloud/ui-web` y que el navegador implementa Custom Elements y Shadow DOM. |
| Un control de selección falla al validar | Comprueba form-associated custom elements y `ElementInternals` en el navegador/WebView objetivo; no supongas soporte universal. |

`@thiscloud/ui-web` está marcado `private: true` en este checkout `0.1.0-rc.5`. La [entrada principal](../../README.md) distingue la versión pública anterior `rc.1` de este candidato local; no instales `rc.5` desde un registro ni interpretes el catálogo como prueba de publicación. Flutter y las demás rutas de demostración quedan fuera del contrato web verificado.
