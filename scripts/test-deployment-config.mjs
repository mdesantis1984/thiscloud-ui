import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const [dockerfile, nginx, compose, deployment] = await Promise.all([
  readFile(resolve(root, 'Dockerfile'), 'utf8'),
  readFile(resolve(root, 'deploy/nginx.conf'), 'utf8'),
  readFile(resolve(root, 'deploy/compose.yaml'), 'utf8'),
  readFile(resolve(root, 'docs/deployment.md'), 'utf8'),
]);

assert.match(dockerfile, /FROM node:\d+\.\d+\.\d+-bookworm-slim AS build/);
assert.match(dockerfile, /FROM nginxinc\/nginx-unprivileged:\d+\.\d+\.\d+-alpine/);
assert.match(dockerfile, /USER 101:101/);
assert.match(nginx, /absolute_redirect off;/);
assert.match(nginx, /port_in_redirect off;/);
assert.match(nginx, /location = \/downloads/);
assert.match(nginx, /location = \/downloads\//);
assert.match(compose, /read_only: true/);
assert.match(compose, /no-new-privileges:true/);
assert.doesNotMatch(compose, /:-latest|:latest/);
assert.match(deployment, /set -euo pipefail/);
assert.match(deployment, /container_id="\$\(docker run --rm --detach/);
assert.match(deployment, /docker rm --force --volumes "\$container_id"/);
assert.doesNotMatch(deployment, /--name thiscloud-ui-local/);
assert.match(deployment, /--cpus 0\.50 --memory 128m --memory-swap 128m --pids-limit 64/);
assert.match(deployment, /--log-driver local --log-opt max-size=10m --log-opt max-file=3/);
assert.match(deployment, /for attempt in \{1\.\.15\}/);
assert.match(deployment, /if \[ "\$attempt" -eq 15 \]/);
assert.match(deployment, /docker compose -f deploy\/compose\.yaml pull/);
assert.match(deployment, /docker compose -f deploy\/compose\.yaml up -d --wait --remove-orphans/);
assert.match(deployment, /docker compose -f deploy\/compose\.yaml down --remove-orphans/);

const image = 'ghcr.io/mdesantis1984/thiscloud-ui:verification';
const { stdout } = await exec('docker', ['compose', '-f', 'deploy/compose.yaml', 'config', '--format', 'json'], {
  cwd: root,
  env: { ...process.env, UI_IMAGE_REF: image },
});
const catalog = JSON.parse(stdout).services.catalog;
assert.equal(catalog.image, image);
const digestImage = `ghcr.io/mdesantis1984/thiscloud-ui@sha256:${'0'.repeat(64)}`;
const { stdout: digestStdout } = await exec('docker', ['compose', '-f', 'deploy/compose.yaml', 'config', '--format', 'json'], {
  cwd: root,
  env: { ...process.env, UI_IMAGE_REF: digestImage },
});
assert.equal(JSON.parse(digestStdout).services.catalog.image, digestImage);
assert.equal(catalog.cpus, 0.5);
assert.equal(Number(catalog.mem_limit), 128 * 1024 * 1024);
assert.equal(Number(catalog.mem_reservation), 32 * 1024 * 1024);
assert.equal(Number(catalog.memswap_limit), 128 * 1024 * 1024);
assert.equal(catalog.pids_limit, 64);
assert.equal(catalog.stop_grace_period, '10s');
assert.deepEqual(catalog.logging, {
  driver: 'local',
  options: { 'max-file': '3', 'max-size': '10m' },
});
console.log('Deployment configuration verification passed.');
