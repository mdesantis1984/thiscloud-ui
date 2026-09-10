# Catalog deployment

The production artifact is a non-root Nginx image containing the catalog and the exact web package/checksum pair generated from the same revision.

## Build and verify

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

## CT100 runtime

The checked-in Compose file binds only to loopback. The existing edge proxy owns TLS and forwards `ui.thiscloud.com.ar` to the origin without exposing port `8080` in public URLs.

```bash
export UI_IMAGE_REF='ghcr.io/mdesantis1984/thiscloud-ui:ui-web-vX.Y.Z'
docker compose -f deploy/compose.yaml pull
docker compose -f deploy/compose.yaml up -d --wait --remove-orphans
docker compose -f deploy/compose.yaml ps
```

Use a complete release image reference in `UI_IMAGE_REF`, either an immutable release tag or `ghcr.io/mdesantis1984/thiscloud-ui@sha256:<digest>`. Never deploy an unverified local build or mutable `latest` tag. Keep the previous image digest available for rollback. Registry credentials belong in the CT100 runtime credential store, not in this repository or Compose file.

The catalog runtime is capped at half a CPU, 128 MiB of memory with no additional swap, 64 processes, and 30 MiB of rotated local logs. Inspect actual usage and configured limits after each deployment:

```bash
docker compose -f deploy/compose.yaml stats --no-stream
docker compose -f deploy/compose.yaml config
docker system df
```

Stop the project when it is not serving traffic. Do not use host-wide prune commands on a shared Docker host; remove only resources owned by this Compose project.

```bash
docker compose -f deploy/compose.yaml down --remove-orphans
```

## Runtime contract

- `/`, `/downloads`, and `/downloads/` serve the catalog shell without redirects.
- `/downloads/<artifact>` serves immutable release bytes.
- `/healthz` is the container health endpoint.
- Missing files return `404`; path traversal never escapes the static root.
- The container runs as UID/GID `101`, drops Linux capabilities, and supports a read-only root filesystem.
- CPU, memory, swap, process count, temporary filesystems, and local logs are explicitly bounded.
