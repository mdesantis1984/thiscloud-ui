# Flutter: verificar el paquete en incubación

[English](flutter.en.md) · [Índice de documentación](../README.md)

`thiscloud_ui` es un paquete Flutter privado de este repositorio, no una biblioteca de widgets lista para integrar. Su `pubspec.yaml` declara `publish_to: none`; los archivos `lib/thiscloud_ui.dart` y `lib/testing.dart` son puntos de entrada vacíos, sin componentes de ejecución ni helpers de pruebas publicados. Esta guía permite comprobar el estado del paquete local, no instalar una versión pública.

## Recorrido rápido en el repositorio

1. Desde la **raíz del repositorio**, compruebe que existe `packages/ui_kit` y que dispone del SDK Flutter **3.47.1** con Dart **3.13.1**. El manifiesto admite Dart `>=3.13.1 <4.0.0` y Flutter `>=3.47.1`, pero el control de toolchain exige estas versiones exactas.
2. Si las dependencias ya están resueltas en `packages/ui_kit/.dart_tool/package_config.json` y sus rutas locales existen, ejecute desde la raíz:

   ```sh
   export PATH="$HOME/.cache/thiscloud-ui/flutter/3.47.1/bin:$PATH"
   cd packages/ui_kit
   flutter --version
   dart run tool/check_toolchain.dart
   dart format --output=none --set-exit-if-changed .
   flutter analyze --no-pub
   flutter test --no-pub
   dart run tool/check_boundaries.dart .
   dart run tool/check_public_api.dart .
   dart run tool/check_licenses.dart .
   ```

3. Resultado esperado: versión fijada, comandos con salida exitosa y ninguna infracción de formato, análisis, pruebas, imports, API pública o integridad de licencias y fuentes. Son controles del **repositorio**, no pruebas de una aplicación consumidora ni promesa de widgets utilizables.

## Dependencias y primera instalación

`pubspec.yaml` sólo declara `flutter` y `flutter_localizations` como dependencias de ejecución del SDK y `flutter_test` para pruebas; el lockfile también registra dependencias transitivas. En una copia nueva sin SDK, caché local o resolución previa, este recorrido **no** funciona sin preparación adicional. `flutter pub get` puede descargar paquetes y modificar el estado local; `flutter pub get --offline` también puede modificarlo y falla si la caché está incompleta. Prepare las dependencias según la política de su entorno antes de ejecutar los controles; esta guía no realiza instalaciones.

`--no-pub` evita resolución implícita en `flutter analyze` y `flutter test`. Los comandos `dart run` presuponen la configuración resuelta: verifique sus rutas antes de usarlos y no interprete una falta de dependencias como fallo de los componentes. Desde `packages/ui_kit`, el ejemplo `example/catalog` es un proyecto distinto con su propia resolución; no equivale a un contrato de widgets reutilizables.

## Qué comprueban los controles

| Control | Alcance y límite |
| --- | --- |
| `check_toolchain.dart`, formato y `flutter analyze --no-pub` | Versiones fijadas, estilo y análisis estático; no demuestran comportamiento de widgets. |
| `flutter test --no-pub` | Pruebas actuales del paquete, incluidos los guards; no certifica una API de componentes. |
| `check_boundaries.dart .` | Imports Dart del paquete: impide dependencias de aplicación/producto, imports profundos y uso de la API de pruebas fuera de tests; no comprueba todas las integraciones. |
| `check_public_api.dart .` | Limita barrels públicos a `lib/thiscloud_ui.dart` y `lib/testing.dart`, y detecta exports/imports profundos y nombres públicos fuera de la convención `Tc`; no crea un componente. |
| `check_licenses.dart .` | Comprueba checksums de archivos legales y fuentes Inter incluidos; no sustituye una auditoría de licencias externa. |

## Decisión para consumidores

No agregue este paquete como dependencia de producción esperando widgets `Tc*`: todavía no existe un componente de ejecución declarado en el barrel. Para explorar lo que **sí** ofrece el repositorio, revise el [README del paquete](../../packages/ui_kit/README.md), el [manifiesto](../../packages/ui_kit/pubspec.yaml) y los [puntos de entrada](../../packages/ui_kit/lib/thiscloud_ui.dart). El catálogo web y sus demostraciones no son widgets Flutter compatibles ni prueban soporte de una aplicación Flutter. Espere a un contrato de componentes verificado y a una publicación autorizada antes de asumir consumo externo.
