# Catalog deployment

The production artifact is a non-root Nginx image containing the catalog and the exact web package/checksum pair generated from the same revision.

## Build and verify

```bash
pnpm check:release
docker build --tag thiscloud-ui:local .
docker run --rm --detach --name thiscloud-ui-local --publish 127.0.0.1:18080:8080 thiscloud-ui:local
curl --fail http://127.0.0.1:18080/healthz
curl --fail http://127.0.0.1:18080/downloads
docker stop thiscloud-ui-local
```

## CT100 runtime

The checked-in Compose file binds only to loopback. The existing edge proxy owns TLS and forwards `ui.thiscloud.com.ar` to the origin without exposing port `8080` in public URLs.

```bash
UI_IMAGE_TAG=<immutable-tag> docker compose -f deploy/compose.yaml pull
UI_IMAGE_TAG=<immutable-tag> docker compose -f deploy/compose.yaml up -d
```

Use a release tag or image digest in production, never an unverified local build or mutable `latest` tag. Keep the previous image digest available for rollback. Registry credentials belong in the CT100 runtime credential store, not in this repository or Compose file.

## Runtime contract

- `/`, `/downloads`, and `/downloads/` serve the catalog shell without redirects.
- `/downloads/<artifact>` serves immutable release bytes.
- `/healthz` is the container health endpoint.
- Missing files return `404`; path traversal never escapes the static root.
- The container runs as UID/GID `101`, drops Linux capabilities, and supports a read-only root filesystem.
