import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import { createDeterministicGzip, validateReleaseRegistry } from './release-registry.mjs';

const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(resolve(root, 'packages/ui-web/package.json'), 'utf8'));
const releaseChecksums = JSON.parse(await readFile(resolve(root, 'packages/ui-web/release-checksums.json'), 'utf8'));
const archiveName = `thiscloud-ui-web-${manifest.version}.tgz`;
const checksumName = `${archiveName}.sha256`;
const releaseDir = resolve(root, 'tmp/release');
const downloadsDir = resolve(root, 'apps/catalog/dist/downloads');
const [archive, checksum, downloadArchive, downloadChecksum] = await Promise.all([
  readFile(resolve(releaseDir, archiveName)),
  readFile(resolve(releaseDir, checksumName), 'utf8'),
  readFile(resolve(downloadsDir, archiveName)),
  readFile(resolve(downloadsDir, checksumName), 'utf8'),
]);
const digest = createHash('sha256').update(archive).digest('hex');

assert.equal(checksum, `${digest}  ${archiveName}\n`, 'Release checksum must describe the packaged bytes.');
assert.equal(validateReleaseRegistry(releaseChecksums, { version: manifest.version, digest }), digest, 'Release bytes must match the immutable checksum registry.');
assert.deepEqual(archive, createDeterministicGzip(gunzipSync(archive)), 'Release gzip bytes must use the deterministic encoding.');
assert.deepEqual(createDeterministicGzip(gunzipSync(gzipSync(gunzipSync(archive), { level: 1 }))), archive, 'Different source compression must normalize to identical release bytes.');
assert.deepEqual(gunzipSync(createDeterministicGzip(Buffer.alloc(0))), Buffer.alloc(0), 'Deterministic gzip must support an empty payload.');
assert.throws(
  () => validateReleaseRegistry(releaseChecksums, { version: manifest.version, digest: '0'.repeat(64) }),
  /bump the package version/,
  'A registered version must reject different package bytes.',
);
assert.throws(
  () => validateReleaseRegistry(
    { ...releaseChecksums, '0.1.0-rc.1': '0'.repeat(64) },
    { version: manifest.version, baselineChecksums: releaseChecksums },
  ),
  /append-only/,
  'A historical checksum must not change.',
);
assert.deepEqual(downloadArchive, archive, 'Catalog and release package bytes must match.');
assert.equal(downloadChecksum, checksum, 'Catalog and release checksums must match.');
console.log('Release asset verification passed.');
