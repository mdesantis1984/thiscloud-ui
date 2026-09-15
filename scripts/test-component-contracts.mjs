import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { validateComponentManifest } from './validate-component-contracts.mjs';

const root = resolve(import.meta.dirname, '..');
const [manifestSource, declarations, catalogSource] = await Promise.all([
  readFile(resolve(root, 'contracts/components.json'), 'utf8'),
  readFile(resolve(root, 'packages/ui-web/index.d.ts'), 'utf8'),
  readFile(resolve(root, 'apps/catalog/catalog.js'), 'utf8'),
]);
const manifest = JSON.parse(manifestSource);

function changed(update) {
  const value = structuredClone(manifest);
  update(value.families[0].components);
  return value;
}

test('accepts the current portable component manifest', () => {
  const family = validateComponentManifest(manifest, { declarations, catalogSource });
  assert.equal(family.components.length, 17);
});

test('rejects duplicate component and Web identities', () => {
  assert.throws(() => validateComponentManifest(changed((components) => {
    components[1].id = components[0].id;
  })), /Duplicate component id/);
  assert.throws(() => validateComponentManifest(changed((components) => {
    components.find(({ name }) => name === 'TextField').web.identity = 'TcSwitch';
  })), /Duplicate Web identity/);
});

test('rejects invalid and incomplete target status', () => {
  assert.throws(() => validateComponentManifest(changed((components) => {
    components[0].support.web = 'experimental';
  })), /Invalid web status/);
  assert.throws(() => validateComponentManifest(changed((components) => {
    delete components[0].support.go;
  })), /support targets must contain exactly/);
});

test('rejects target combinations that violate runtime inheritance', () => {
  assert.throws(() => validateComponentManifest(changed((components) => {
    components[0].support.go = 'not-applicable';
  })), /Go support must match Web support/);
});

test('rejects public identities missing from TypeScript declarations', () => {
  assert.throws(() => validateComponentManifest(changed((components) => {
    const component = components.find(({ name }) => name === 'Switch');
    component.web.export = 'MissingSwitch';
    component.web.identity = 'MissingSwitch';
  }), { declarations }), /Missing TypeScript class MissingSwitch/);
});

test('rejects catalog code that does not consume the manifest', () => {
  assert.throws(() => validateComponentManifest(manifest, { declarations, catalogSource: 'const categories = {};' }), /Catalog must consume/);
});
