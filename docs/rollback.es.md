# Guía de reversión del catálogo

[English](rollback.md) · [Índice de documentación](README.md) · [Guía de despliegue](deployment.es.md)

Procedimiento disponible solo en el repositorio para que un **operador autorizado** restaure una imagen del catálogo previamente verificada. No se ejecutó ninguna reversión para esta documentación. Ejecútelo desde la raíz del repositorio en el mismo host, shell y entorno autorizados del despliegue existente. No use otro nombre de proyecto Compose para probar una reversión en producción.

## Detenerse antes de modificar

1. Identifique el host real, `deploy/compose.yaml`, el proyecto Compose existente, el servicio `catalog`, el entorno/puerto efectivos y la persona responsable a partir de un registro de despliegue aprobado. Confirme que el servicio previsto pertenece al proyecto y atiende el tráfico esperado. El nombre predeterminado `thiscloud-ui` del archivo **no** demuestra la identidad del proyecto activo. Si se desconoce la identidad, autorización, sesión o configuración, deténgase. No imprima la configuración Compose expandida ni secretos.
2. Registre **antes** de modificar los identificadores GHCR completos y verificados de las imágenes **actual y anterior** (`ghcr.io/mdesantis1984/thiscloud-ui@sha256:` más 64 caracteres hexadecimales, sin que el resumen sea todo ceros), las versiones del paquete y los valores SHA-256 correspondientes de sus archivos tarball. Verifique que la imagen anterior esté disponible y sea compatible con la configuración, el proxy y el entorno conservados. El resumen de la imagen **no es** la suma del tarball. Validar el formato no prueba procedencia, acceso ni disponibilidad; las etiquetas son mutables y Compose las acepta. La entrada actual del registro de sumas del repositorio no prueba un artefacto anterior desplegado.
3. Obtenga autorización independiente para una interrupción y designe a la persona responsable de gestionar fallas. Si faltan la imagen anterior verificada o el registro del artefacto correspondiente, deténgase sin modificar nada. Conserve la identidad del proyecto, la configuración, los volúmenes y el límite de tráfico existentes. Este procedimiento no incluye `down`, limpieza global del host ni eliminación de volúmenes.

Defina los seis valores siguientes a partir del **registro de despliegue aprobado**, más el nombre del proyecto **existente** y el puerto de host en loopback, en el mismo shell antes de ejecutar los bloques. Nunca use marcadores de posición ni resúmenes supuestos. Estos comandos son para un futuro operador; **no** se ejecutaron para esta documentación.

```bash
set -euo pipefail
: "${COMPOSE_PROJECT_NAME:?Set the existing recorded Compose project name}"
: "${UI_CATALOG_PORT:?Set the existing recorded loopback host port}"
: "${CURRENT_IMAGE_REF:?Set the verified current image reference}"
: "${PREVIOUS_IMAGE_REF:?Set the verified previous image reference}"
: "${CURRENT_VERSION:?Set the recorded current package version}"
: "${PREVIOUS_VERSION:?Set the recorded previous package version}"
: "${CURRENT_ARTIFACT_SHA256:?Set the recorded current tarball SHA-256}"
: "${PREVIOUS_ARTIFACT_SHA256:?Set the recorded previous tarball SHA-256}"
[[ "$COMPOSE_PROJECT_NAME" =~ ^[a-z0-9][a-z0-9_-]*$ ]] || exit 1
[[ "$UI_CATALOG_PORT" =~ ^[1-9][0-9]{0,4}$ ]] && (( 10#$UI_CATALOG_PORT <= 65535 )) || exit 1
for ref in "$CURRENT_IMAGE_REF" "$PREVIOUS_IMAGE_REF"; do
  [[ "$ref" =~ ^ghcr\.io/mdesantis1984/thiscloud-ui@sha256:[[:xdigit:]]{64}$ && "${ref##*:}" =~ [1-9a-fA-F] ]] || exit 1
done
for version in "$CURRENT_VERSION" "$PREVIOUS_VERSION"; do
  [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$ ]] || exit 1
done
for digest in "$CURRENT_ARTIFACT_SHA256" "$PREVIOUS_ARTIFACT_SHA256"; do
  [[ "$digest" =~ ^[[:xdigit:]]{64}$ && "$digest" =~ [1-9a-fA-F] ]] || exit 1
done
export UI_IMAGE_REF="$CURRENT_IMAGE_REF" UI_CATALOG_PORT
docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml config --quiet
docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml ps --all catalog
```

**Control humano:** compare la identidad del servicio/contenedor existente, el puerto efectivo y la imagen actual real con el registro mediante lecturas autorizadas. `ps` y `config --quiet` no prueban los bytes de la imagen ni la titularidad. Si falta `catalog` o hay diferencias, deténgase. Conserve el directorio del proyecto, los archivos de entorno, los archivos Compose complementarios y las opciones existentes; estos ejemplos usan solo `deploy/compose.yaml` y **no deben usarse** si el despliegue real necesita archivos u opciones que no puedan reproducirse exactamente. El archivo vincula `127.0.0.1:${UI_CATALOG_PORT:-8080}:8080`; verifique por separado el proxy externo y TLS.

## Restaurar la imagen registrada

Solo después del control humano: obtenga la imagen anterior **antes** de modificar el servicio en ejecución y solicite una actualización acotada de `catalog`, sujeta a salud, en el **mismo** proyecto. `pull` puede contactar GHCR y `up` puede recrear el servicio; ambos requieren autorización independiente. `--no-build` impide recurrir a una compilación local. No use `--remove-orphans` ni inicie otro conjunto de contenedores.

```bash
export UI_IMAGE_REF="$PREVIOUS_IMAGE_REF"
docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml config --quiet
docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml pull catalog
timeout 120s docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml up -d --wait --no-build --no-deps catalog
docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml ps catalog
```

Si falla `pull`, **no ejecute `up`**. Si `up` vence el plazo, falla o deja el servicio sin salud, **deténgase y escale**: el servicio en ejecución podría haber cambiado. No reintente a ciegas, no ejecute `down` ni declare restaurado el servicio anterior. La comprobación de salud de la imagen del repositorio consulta `/healthz` (Nginx responde `ok`); `up --wait` por sí solo no verifica el artefacto ni la ruta externa.

## Verificar, detenerse y limpiar de forma selectiva

En el **mismo shell**, compruebe la salud en loopback, la respuesta del catálogo y los bytes del tarball **anterior** contra el SHA-256 y la versión aprobados previamente. Estas solicitudes acotadas **no** comprueban el proxy público. El directorio temporal pertenece solo a esta verificación; la trampa elimina únicamente el archivo descargado y su directorio, nunca contenedores, imágenes ni volúmenes del proyecto.

```bash
for attempt in {1..15}; do
  if [[ "$(curl --fail --silent --show-error --max-time 3 "http://127.0.0.1:${UI_CATALOG_PORT}/healthz")" == ok ]]; then break; fi
  if (( attempt == 15 )); then exit 1; fi
  sleep 2
done
curl --fail --silent --show-error --max-time 10 --output /dev/null "http://127.0.0.1:${UI_CATALOG_PORT}/downloads"
filename="thiscloud-ui-web-${PREVIOUS_VERSION}.tgz"
verify_dir="$(mktemp -d)"
trap 'rm -f -- "$verify_dir/$filename"; rmdir -- "$verify_dir"' EXIT
curl --fail --silent --show-error --max-time 20 --output "$verify_dir/$filename" "http://127.0.0.1:${UI_CATALOG_PORT}/downloads/${filename}"
( cd "$verify_dir" && printf '%s  %s\n' "$PREVIOUS_ARTIFACT_SHA256" "$filename" | sha256sum --check --status )
```

El éxito exige confirmar la **imagen registrada** mediante lecturas autorizadas del entorno, `catalog` saludable, la respuesta prevista del catálogo, la versión y los bytes anteriores coincidentes y, si corresponde, la ruta externa comprobada por separado. Una suma coincidente no prueba procedencia de la imagen ni disponibilidad pública. Ante diferencias, artefacto ausente, servicio equivocado o falla de preparación/salud, deténgase, conserve evidencia sin exponer secretos y solicite a la persona responsable diagnosticar el estado real; una reversión fallida puede dejar modificado el entorno. No declare recuperación ni realice otra modificación automáticamente. Si falla la trampa, resuelva únicamente el directorio temporal propio tras confirmar su ruta. Elimine recursos anteriores del proyecto **detenidos y descartables** solo con otra autorización; mantenga intactos los contenedores activos y los datos persistentes.
