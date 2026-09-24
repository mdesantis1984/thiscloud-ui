# Catalog deployment

[Español](deployment.es.md) · [Documentation index](README.en.md)

This repository builds a non-root Nginx image containing the catalog and the web package/checksum pair from the same revision. These instructions describe checked-in behavior; they do not establish that an image was published, a site was deployed, or a rollback was tested. Run commands from the repository root only with separate authorization for Docker workloads or deployment.

## Build and verify

This optional **local** image check requires installed dependencies, Docker, an available loopback port `18080`, and authorization to build and start a disposable container. `pnpm check:release` prepares and verifies local artifacts; `docker build` may fetch build dependencies. Neither publishes an image nor makes it safe for production. The trap attempts to remove only the disposable container created here and its anonymous volumes; `|| true` hides removal errors, so process success does not prove cleanup. Do not use this cleanup for existing containers or persistent data.

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

After an authorized local run, verify that the created container ID no longer exists before declaring cleanup complete. If removal failed or its status is unknown, report cleanup as incomplete and resolve only that identified, owned container; do not prune the host or remove existing volumes.

## Digest-pinned runtime

Before any authorized deployment, obtain the **verified image manifest digest** from the intended release and retain the previous verified digest for recovery. Set `UI_IMAGE_DIGEST` to its 64 hexadecimal characters, without `sha256:`. A string of 64 zeroes is a **nonpullable syntax fixture**, never a release reference. The manual guard below rejects that fixture and malformed values; it does not verify image provenance or availability. A release tag can move. Compose accepts tags and digests and does **not** enforce digest pinning; the operator must do so.

The checked-in Compose file binds the catalog to `127.0.0.1` (default host port `8080`). The existing guide describes an edge proxy handling TLS; its live configuration and routing have not been verified here. Registry credentials belong in an authorized runtime credential store, not in this repository or Compose. The commands below are an **operator procedure**, not commands run for this documentation change:

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

For a **syntax-only** check, this full-length reference is deliberately nonpullable; never use it with `pull` or `up`:

```bash
UI_IMAGE_REF='ghcr.io/mdesantis1984/thiscloud-ui@sha256:0000000000000000000000000000000000000000000000000000000000000000' docker compose -f deploy/compose.yaml config --quiet
```

`config --quiet` checks the local Compose definition without printing rendered configuration; it cannot resolve or verify a registry digest. Do not use the local build, a mutable tag (including `latest`), or the zero-digest fixture as a deployment image. `pull` and `up` require separate authorization and access to the target environment; neither is exercised here. `timeout 120s` bounds the readiness wait, but a timeout or failed health check is **not** a successful deployment: stop and diagnose before further action.

The **checked-in** service sets half a CPU, 128 MiB hard memory, 32 MiB reservation, memory+swap limited to 128 MiB (no additional swap), 64 PIDs, 10-second stop grace, and local logs capped at `10m` × `3`. It also uses a read-only root, drops all capabilities, sets `no-new-privileges`, has bounded `/tmp`, `/var/cache/nginx` and `/var/run` tmpfs, and runs as UID/GID `101` in the image. `restart: unless-stopped` is the existing always-on policy, not an approval to start it here. An authorized operator must inspect effective limits, health, and disk use in the target environment; static checks do not prove runtime state.

## Health and selective stop

The image defines `/healthz`; Nginx serves `/`, `/downloads` and `/downloads/` as the catalog shell without a redirect, and `/downloads/<artifact>` as a static release asset. Missing files return `404`. An authorized operator should verify bounded readiness, health, catalog and expected artifact checksum against the approved release record before declaring success. The local loopback check above retries health at most 15 times; it is **not** evidence of live service health or a published artifact. The [rollback runbook](rollback.md) describes previous-digest verification and recovery; it does not establish that a rollback was executed.

Only after confirming project ownership and that it is not serving traffic may an authorized operator stop this Compose project. `down --remove-orphans` affects project containers, not unrelated host services; do not use host-wide prune or remove persistent volumes without separate approval.

```bash
docker compose -f deploy/compose.yaml down --remove-orphans
```
