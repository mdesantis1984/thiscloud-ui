# Despliegue del catálogo

[English](deployment.md) · [Índice de documentación](README.md)

Este repositorio construye una imagen de Nginx sin privilegios que contiene el catálogo y el par de paquete web y suma de comprobación de la misma revisión. Estas instrucciones describen el comportamiento incluido en el repositorio; no acreditan que se haya publicado una imagen, desplegado un sitio ni probado una reversión. Ejecute los comandos desde la raíz del repositorio únicamente con autorización independiente para cargas de Docker o despliegues.

## Construir y verificar

Esta comprobación **local** opcional requiere dependencias instaladas, Docker, el puerto local `18080` disponible y autorización para construir e iniciar un contenedor desechable. `pnpm check:release` prepara y verifica artefactos locales; `docker build` puede descargar dependencias de construcción. Ninguno de los dos publica una imagen ni la habilita para producción. La función de limpieza intenta eliminar solo el contenedor desechable creado aquí y sus volúmenes anónimos; `|| true` oculta los errores de eliminación, por lo que el éxito del proceso no acredita la limpieza. No utilice esta función con contenedores existentes ni datos persistentes.

```bash
set -euo pipefail
pnpm check:release
docker build --tag thiscloud-ui:local .
container_id=
cleanup() { test -z "${container_id:-}" || docker rm --force --volumes "$container_id" >/dev/null 2>&1 || true; }
trap cleanup EXIT
container_id="$(docker run --rm --detach \
  --cpus 0.50 --memory 128m --memory-swap 128m --pids-limit 64 \
  --read-only --cap-drop ALL --security-opt no-new-privileges=true \
  --tmpfs /tmp:rw,noexec,nosuid,size=16m,mode=1777 \
  --tmpfs /var/cache/nginx:rw,noexec,nosuid,size=16m,uid=101,gid=101 \
  --tmpfs /var/run:rw,noexec,nosuid,size=1m,uid=101,gid=101 \
  --log-driver local --log-opt max-size=10m --log-opt max-file=3 \
  --publish 127.0.0.1:18080:8080 thiscloud-ui:local)"
for attempt in {1..15}; do
  if curl --fail --silent --output /dev/null http://127.0.0.1:18080/healthz; then
    break
  fi
  if [ "$attempt" -eq 15 ]; then
    docker logs "$container_id" || true
    exit 1
  fi
  sleep 1
done
curl --fail http://127.0.0.1:18080/downloads
cleanup
trap - EXIT
```

Después de una ejecución local autorizada, verifique que el ID del contenedor creado ya no exista antes de dar por completada la limpieza. Si la eliminación falló o se desconoce su estado, informe que la limpieza está incompleta y resuelva únicamente lo relativo a ese contenedor identificado y bajo su control; no realice una limpieza general del host ni elimine volúmenes existentes.

## Ejecución con digest fijado

Antes de cualquier despliegue autorizado, obtenga el **digest verificado del manifiesto de la imagen** correspondiente a la versión prevista y conserve el digest verificado anterior para la recuperación. Asigne a `UI_IMAGE_DIGEST` sus 64 caracteres hexadecimales, sin `sha256:`. Una cadena de 64 ceros es un **ejemplo sintáctico que no se puede descargar**, nunca una referencia de publicación. La validación manual siguiente rechaza ese ejemplo y los valores incorrectos; no verifica la procedencia ni la disponibilidad de la imagen. Una etiqueta de publicación puede cambiar. Compose acepta etiquetas y digests y **no** exige usar un digest; el operador debe hacerlo.

El archivo Compose incluido vincula el catálogo a `127.0.0.1` (puerto predeterminado del host `8080`). La guía existente describe un proxy perimetral que gestiona TLS; aquí no se ha verificado su configuración ni su enrutamiento en servicio. Las credenciales del registro pertenecen a un almacén autorizado de credenciales de ejecución, no a este repositorio ni al archivo Compose. Los comandos siguientes son un **procedimiento para el operador**, no comandos ejecutados por este cambio documental:

```bash
set -euo pipefail
: "${UI_IMAGE_DIGEST:?Set a verified GHCR image digest (64 hex characters)}"
[[ "$UI_IMAGE_DIGEST" =~ ^[[:xdigit:]]{64}$ && "$UI_IMAGE_DIGEST" =~ [1-9a-fA-F] ]] || { printf '%s\n' 'Invalid image digest' >&2; exit 1; }
export UI_IMAGE_REF="ghcr.io/mdesantis1984/thiscloud-ui@sha256:${UI_IMAGE_DIGEST}"
docker compose -f deploy/compose.yaml config --quiet
docker compose -f deploy/compose.yaml pull
timeout 120s docker compose -f deploy/compose.yaml up -d --wait --remove-orphans
docker compose -f deploy/compose.yaml ps
```

Para una comprobación **solo sintáctica**, esta referencia de longitud completa no se puede descargar de forma intencional; nunca la utilice con `pull` ni `up`:

```bash
UI_IMAGE_REF='ghcr.io/mdesantis1984/thiscloud-ui@sha256:0000000000000000000000000000000000000000000000000000000000000000' docker compose -f deploy/compose.yaml config --quiet
```

`config --quiet` comprueba la definición local de Compose sin imprimir la configuración expandida; no puede resolver ni verificar un digest del registro. No utilice la imagen construida localmente, una etiqueta mutable (incluida `latest`) ni el ejemplo de digest con ceros para desplegar. `pull` y `up` requieren autorización independiente y acceso al entorno de destino; aquí no se ejecutan. `timeout 120s` limita la espera de disponibilidad, pero un vencimiento del plazo o un fallo de salud **no** constituyen un despliegue satisfactorio: deténgase e investigue antes de continuar.

El servicio **incluido en el repositorio** establece medio núcleo de CPU, límite estricto de 128 MiB de memoria, reserva de 32 MiB, límite de 128 MiB de memoria más intercambio (sin intercambio adicional), 64 PIDs, 10 segundos de espera al detenerse y registros locales limitados a `10m` × `3`. También utiliza una raíz de solo lectura, elimina todas las capacidades, establece `no-new-privileges`, dispone de tmpfs acotados para `/tmp`, `/var/cache/nginx` y `/var/run`, y la imagen se ejecuta como UID/GID `101`. `restart: unless-stopped` es la política de ejecución continua ya existente, no una autorización para iniciar el servicio aquí. Un operador autorizado debe inspeccionar los límites efectivos, la salud y el uso del disco en el entorno de destino; las comprobaciones estáticas no acreditan el estado de ejecución.

## Salud y parada selectiva

La imagen define `/healthz`; Nginx entrega `/`, `/downloads` y `/downloads/` como la página del catálogo sin redirección, y `/downloads/<artifact>` como un artefacto estático de publicación. Los archivos ausentes devuelven `404`. Un operador autorizado debe verificar la disponibilidad dentro de un plazo acotado, la salud, el catálogo y la suma de comprobación del artefacto esperado frente al registro de publicación aprobado antes de declarar el resultado satisfactorio. La comprobación local anterior reintenta la salud como máximo 15 veces; **no** acredita la salud del servicio en producción ni la publicación de un artefacto. La [guía de reversión](rollback.es.md) describe la verificación del digest anterior y la recuperación; no acredita que se haya ejecutado una reversión.

Solo tras confirmar que el proyecto le pertenece y que ya no atiende tráfico, un operador autorizado puede detener este proyecto Compose. `down --remove-orphans` afecta a los contenedores del proyecto, no a servicios ajenos del host; no utilice una limpieza general del host ni elimine volúmenes persistentes sin aprobación independiente.

```bash
docker compose -f deploy/compose.yaml down --remove-orphans
```
