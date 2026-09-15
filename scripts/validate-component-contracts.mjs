import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const expectedTargets = {
  web: { runtime: 'web-component' },
  html: { runtime: 'web-component', inherits: 'web' },
  go: { runtime: 'server-rendered-web-component', inherits: 'web' },
  blazor: { runtime: 'razor-web-component-wrapper', inherits: 'web' },
  flutter: { runtime: 'native-widget' },
};
const allowedKinds = new Set(['component', 'contract', 'helper']);
const allowedStatuses = new Set(['release-candidate', 'planned', 'not-applicable']);

function requireContract(condition, message) {
  if (!condition) throw new Error(message);
}

function exactKeys(value, expected, label) {
  requireContract(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object.`);
  requireContract(
    isDeepStrictEqual(Object.keys(value).sort(), [...expected].sort()),
    `${label} must contain exactly: ${[...expected].join(', ')}.`,
  );
}

function unique(values, label) {
  const seen = new Set();
  for (const value of values) {
    requireContract(!seen.has(value), `Duplicate ${label}: ${value}.`);
    seen.add(value);
  }
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slug(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function verifyDeclaration(component, declarations) {
  const exported = escapePattern(component.web.export);
  if (component.kind === 'component') {
    requireContract(new RegExp(`export class ${exported}\\b`).test(declarations), `Missing TypeScript class ${component.web.export}.`);
    const element = escapePattern(component.web.element);
    requireContract(new RegExp(`['\"]${element}['\"]:\\s*${exported};`).test(declarations), `Missing HTMLElementTagNameMap entry for ${component.web.element}.`);
    return;
  }
  if (component.kind === 'contract') {
    requireContract(new RegExp(`export (?:interface|type) ${exported}\\b`).test(declarations), `Missing TypeScript contract ${component.web.export}.`);
    return;
  }
  requireContract(new RegExp(`export function ${exported}\\b`).test(declarations), `Missing TypeScript helper ${component.web.export}.`);
}

export function validateComponentManifest(manifest, { declarations = '', catalogSource = '' } = {}) {
  requireContract(manifest && typeof manifest === 'object' && !Array.isArray(manifest), 'Component manifest must be an object.');
  requireContract(manifest.schemaVersion === 1, 'Component manifest schemaVersion must be 1.');
  requireContract(isDeepStrictEqual(manifest.targets, expectedTargets), 'Component manifest target runtimes do not match the portable architecture.');
  requireContract(Array.isArray(manifest.families), 'Component manifest families must be an array.');

  const family = manifest.families.find(({ id }) => id === 'inputs-forms');
  requireContract(family?.catalogName === 'Inputs/Forms', 'Inputs/Forms family is missing or incorrectly named.');
  requireContract(Array.isArray(family.components), 'Inputs/Forms components must be an array.');
  requireContract(family.components.length === 17, `Inputs/Forms must contain exactly 17 entries; found ${family.components.length}.`);

  unique(family.components.map(({ id }) => id), 'component id');
  unique(family.components.map(({ name }) => name), 'component name');
  const publicComponents = family.components.filter(({ support }) => support?.web === 'release-candidate');
  unique(publicComponents.map(({ web }) => web?.export), 'Web export');
  unique(publicComponents.map(({ web }) => web?.identity), 'Web identity');
  unique(publicComponents.flatMap(({ web }) => web?.element ? [web.element] : []), 'custom element');

  for (const component of family.components) {
    requireContract(component.id === slug(component.name), `Component ${component.name} must use stable id ${slug(component.name)}.`);
    requireContract(allowedKinds.has(component.kind), `Invalid component kind for ${component.name}: ${component.kind}.`);
    exactKeys(component.support, Object.keys(expectedTargets), `${component.name} support targets`);
    for (const [target, status] of Object.entries(component.support)) {
      requireContract(allowedStatuses.has(status), `Invalid ${target} status for ${component.name}: ${status}.`);
    }

    if (component.kind === 'contract') {
      requireContract(component.support.html === 'not-applicable' && component.support.go === 'not-applicable', `${component.name} contracts cannot claim HTML or Go runtime support.`);
    } else {
      requireContract(component.support.html === component.support.web, `${component.name} HTML support must match Web support.`);
      requireContract(component.support.go === component.support.web, `${component.name} Go support must match Web support.`);
    }
    requireContract(component.support.flutter !== 'not-applicable', `${component.name} must retain a native Flutter target.`);
    if (component.support.blazor === 'release-candidate') {
      requireContract(component.support.web === 'release-candidate', `${component.name} cannot ship a Blazor wrapper before its Web contract.`);
    }

    if (component.support.web !== 'release-candidate') {
      requireContract(component.web === undefined, `${component.name} cannot declare a public Web identity while Web support is planned.`);
      continue;
    }

    const web = component.web;
    requireContract(web && typeof web === 'object', `${component.name} must define its public Web identity.`);
    for (const field of ['export', 'identity', 'boundary', 'example']) {
      requireContract(typeof web[field] === 'string' && web[field].trim(), `${component.name} Web ${field} must be non-empty.`);
    }
    if (component.kind === 'component') {
      requireContract(/^tc-[a-z0-9-]+$/.test(web.element), `${component.name} must define a tc-* custom element.`);
      requireContract(web.boundary === `<${web.element}>`, `${component.name} boundary must match its custom element.`);
    } else {
      requireContract(web.element === undefined, `${component.name} ${component.kind} cannot define a custom element.`);
    }
    if (declarations) verifyDeclaration(component, declarations);
  }

  requireContract(publicComponents.length > 0, 'Expected at least one current RC Web contract.');
  if (catalogSource) {
    requireContract(/const componentManifest = __TC_COMPONENT_MANIFEST__/.test(catalogSource), 'Catalog must consume the injected neutral component manifest.');
    requireContract(/formFamily\.components\.map/.test(catalogSource), 'Catalog Inputs/Forms inventory must derive from the neutral manifest.');
    requireContract(/Object\.fromEntries\([\s\S]*formFamily\.components/.test(catalogSource), 'Catalog public Web API map must derive from the neutral manifest.');
    requireContract(!catalogSource.includes("'Inputs/Forms':['"), 'Catalog must not retain a duplicate literal Inputs/Forms inventory.');
  }

  return family;
}

async function main() {
  const root = resolve(import.meta.dirname, '..');
  const [manifestSource, declarations, catalogSource] = await Promise.all([
    readFile(resolve(root, 'contracts/components.json'), 'utf8'),
    readFile(resolve(root, 'packages/ui-web/index.d.ts'), 'utf8'),
    readFile(resolve(root, 'apps/catalog/catalog.js'), 'utf8'),
  ]);
  const family = validateComponentManifest(JSON.parse(manifestSource), { declarations, catalogSource });
  console.log(`Component contract verification passed (${family.components.length} Inputs/Forms entries).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
