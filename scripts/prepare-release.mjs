import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { gunzipSync } from 'node:zlib';
import { createDeterministicGzip, validateReleaseRegistry } from './release-registry.mjs';

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const packageDir = resolve(root, 'packages/ui-web');
const releaseDir = resolve(root, 'tmp/release');
const downloadsDir = resolve(root, 'apps/catalog/dist/downloads');
const manifest = JSON.parse(await readFile(resolve(packageDir, 'package.json'), 'utf8'));
const registryRelative = 'packages/ui-web/release-checksums.json';
const releaseChecksums = JSON.parse(await readFile(resolve(root, registryRelative), 'utf8'));

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version)) {
  throw new Error(`Refusing to package invalid version: ${manifest.version}`);
}

const registryBase = process.env.RELEASE_REGISTRY_BASE;
let baselineChecksums;
if (registryBase) {
  await exec('git', ['cat-file', '-e', `${registryBase}^{commit}`], { cwd: root });
  let baselineExists = true;
  try {
    await exec('git', ['cat-file', '-e', `${registryBase}:${registryRelative}`], { cwd: root });
  } catch (error) {
    if (error.code === 128) baselineExists = false;
    else throw error;
  }
  if (baselineExists) {
    const { stdout } = await exec('git', ['show', `${registryBase}:${registryRelative}`], { cwd: root });
    baselineChecksums = JSON.parse(stdout);
  }
}

validateReleaseRegistry(releaseChecksums, { version: manifest.version, baselineChecksums });

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
const archive = createDeterministicGzip(gunzipSync(await readFile(archivePath)));
await writeFile(archivePath, archive);
const digest = createHash('sha256').update(archive).digest('hex');
validateReleaseRegistry(releaseChecksums, { version: manifest.version, digest });
await writeFile(resolve(releaseDir, checksumName), `${digest}  ${expectedArchive}\n`);

await mkdir(downloadsDir, { recursive: true });
await Promise.all([
  copyFile(archivePath, resolve(downloadsDir, expectedArchive)),
  copyFile(resolve(releaseDir, checksumName), resolve(downloadsDir, checksumName)),
]);

console.log(`Prepared @thiscloud/ui-web ${manifest.version} release assets.`);
