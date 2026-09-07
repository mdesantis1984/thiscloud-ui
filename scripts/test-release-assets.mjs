import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(resolve(root, 'packages/ui-web/package.json'), 'utf8'));
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
assert.deepEqual(downloadArchive, archive, 'Catalog and release package bytes must match.');
assert.equal(downloadChecksum, checksum, 'Catalog and release checksums must match.');
console.log('Release asset verification passed.');
