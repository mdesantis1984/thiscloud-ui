# Catalog rollback runbook

[Español](rollback.es.md) · [Documentation index](README.en.md) · [Deployment guide](deployment.md)

Repository-only procedure for an **authorized operator** to restore a previously verified catalog image. No rollback has been executed for this documentation. Run from the repository root in the same authorized host, shell, and environment as the existing deployment. Do not use a new Compose project name to test a live rollback.

## Stop before mutation

1. Identify the actual host, `deploy/compose.yaml`, existing Compose project, service `catalog`, effective env/port and responsible operator from an approved deployment record. Confirm the target service is owned and serving the expected traffic. The file's default name `thiscloud-ui` does **not** establish live identity. If any identity, authorization, session or configuration is unknown, stop. Do not print rendered Compose configuration or secrets.
2. Record **current and previous** verified full GHCR image references (`ghcr.io/mdesantis1984/thiscloud-ui@sha256:` plus 64 hexadecimal characters, not an all-zero digest), package versions and matching tarball SHA-256 values **before** mutation. Verify the previous image is available and compatible with the retained configuration, proxy and environment. Image manifest digests are **not** tarball checksums. A shape check cannot prove provenance, access or availability; tags move and Compose accepts tags. The current repository checksum entry does not prove a previously deployed artifact.
3. Obtain separate authorization for an interruption and a responsible operator to handle aborts. If the previous verified image or artifact record is unavailable, stop without mutation. Preserve current project identity, configuration, volumes and traffic boundary. No `down`, host-wide prune or volume deletion is part of this runbook.

Set these six values from the **approved deployment record**, plus the **existing** project name and host loopback port, in the same shell before running these blocks. Never use placeholders or guessed digests. These are future operator commands, **not** commands executed for this documentation.

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

**Human gate:** compare the existing service/container identity, effective port and actual current image against the record using authorized readback. `ps` and `config --quiet` do not prove image bytes or ownership. If `catalog` is absent or anything differs, stop. Preserve the existing project directory, env files, Compose overrides and flags; these snippets use only `deploy/compose.yaml` and **must not be used** where the real deployment needs unreproduced files/options. The checked-in binding is `127.0.0.1:${UI_CATALOG_PORT:-8080}:8080`; check the external proxy/TLS separately.

## Restore the recorded image

Only after the human gate: pull the previous image **before** touching the running service, then request a bounded health-gated update of `catalog` in the **same** project. `pull` can contact GHCR and `up` can recreate the service; both require separate authorization. `--no-build` prevents a local-build fallback. Do not use `--remove-orphans` or start a second stack.

```bash
export UI_IMAGE_REF="$PREVIOUS_IMAGE_REF"
docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml config --quiet
docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml pull catalog
timeout 120s docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml up -d --wait --no-build --no-deps catalog
docker compose -p "$COMPOSE_PROJECT_NAME" -f deploy/compose.yaml ps catalog
```

If `pull` fails, **do not run `up`**. If `up` times out, fails or leaves the service unhealthy, **stop and escalate**: the running service may have changed. Do not blindly retry, run `down` or declare the old service restored. The checked-in image health check probes `/healthz` (Nginx returns `ok`); `up --wait` alone does not verify the artifact or external route.

## Verify, abort and clean selectively

In the **same shell**, check loopback health, catalog response and the **previous** tarball bytes against the approved previous SHA-256 and version. These bounded requests do **not** test the public proxy. The temporary directory is owned by this verification only; its trap removes just the downloaded file and directory, never project containers, images or volumes.

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

Success requires authorized runtime confirmation of the **recorded image**, healthy `catalog`, the expected catalog response, matching previous version/bytes and separate external routing checks if applicable. A checksum match does not prove image provenance or public availability. On mismatch, missing artifact, wrong service or failed readiness/health, stop, preserve evidence without exposing secrets and have the responsible operator diagnose actual state; failed rollback may leave a changed runtime. Do not declare recovery or mutate again automatically. If the trap fails, resolve only its owned temporary directory after checking its path. Remove old **stopped, disposable** project resources only under separate approval; keep live containers and persistent data intact.
