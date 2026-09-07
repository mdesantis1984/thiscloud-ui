import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const [dockerfile, nginx, compose] = await Promise.all([
  readFile(resolve(root, 'Dockerfile'), 'utf8'),
  readFile(resolve(root, 'deploy/nginx.conf'), 'utf8'),
  readFile(resolve(root, 'deploy/compose.yaml'), 'utf8'),
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

await exec('docker', ['compose', '-f', 'deploy/compose.yaml', 'config', '--quiet'], {
  cwd: root,
  env: { ...process.env, UI_IMAGE_TAG: 'verification' },
});
console.log('Deployment configuration verification passed.');
