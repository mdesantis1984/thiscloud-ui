import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const packageDir = resolve(root, 'packages/ui-web');
const releaseDir = resolve(root, 'tmp/release');
const downloadsDir = resolve(root, 'apps/catalog/dist/downloads');
const manifest = JSON.parse(await readFile(resolve(packageDir, 'package.json'), 'utf8'));

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version)) {
  throw new Error(`Refusing to package invalid version: ${manifest.version}`);
}

await rm(releaseDir, { recursive: true, force: true });
await mkdir(releaseDir, { recursive: true });
await exec('pnpm', ['--dir', packageDir, 'pack', '--pack-destination', releaseDir], { cwd: root });

const archives = (await readdir(releaseDir)).filter((name) => name.endsWith('.tgz'));
const expectedArchive = `thiscloud-ui-web-${manifest.version}.tgz`;
if (archives.length !== 1 || archives[0] !== expectedArchive) {
  throw new Error(`Expected only ${expectedArchive}, found: ${archives.join(', ') || 'nothing'}`);
}

const archivePath = resolve(releaseDir, expectedArchive);
const checksumName = `${expectedArchive}.sha256`;
const digest = createHash('sha256').update(await readFile(archivePath)).digest('hex');
await writeFile(resolve(releaseDir, checksumName), `${digest}  ${expectedArchive}\n`);

await mkdir(downloadsDir, { recursive: true });
await Promise.all([
  copyFile(archivePath, resolve(downloadsDir, expectedArchive)),
  copyFile(resolve(releaseDir, checksumName), resolve(downloadsDir, checksumName)),
]);

console.log(`Prepared @thiscloud/ui-web ${manifest.version} release assets.`);
