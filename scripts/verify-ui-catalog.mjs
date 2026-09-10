import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const catalog = resolve(import.meta.dirname, '../apps/catalog');
const dist = resolve(catalog, 'dist');
const packageVersion = JSON.parse(await readFile(resolve(catalog, '../../packages/ui-web/package.json'), 'utf8')).version;
const [source, css, script, en, es, distHtml, distCss, distJs, webJs, tokenCss, outputs] = await Promise.all([
  readFile(resolve(catalog, 'framework-preview.html'), 'utf8'), readFile(resolve(catalog, 'catalog.css'), 'utf8'),
  readFile(resolve(catalog, 'catalog.js'), 'utf8'), readFile(resolve(catalog, 'assets/i18n/en.json'), 'utf8'),
  readFile(resolve(catalog, 'assets/i18n/es.json'), 'utf8'), readFile(resolve(dist, 'framework-preview.html'), 'utf8'),
  readFile(resolve(dist, 'catalog.css'), 'utf8'), readFile(resolve(dist, 'catalog.js'), 'utf8'),
  readFile(resolve(dist, 'ui-web.js'), 'utf8'), readFile(resolve(dist, 'ui-web-tokens.css'), 'utf8'), readdir(dist),
]);

function paths(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => child && typeof child === 'object' && !Array.isArray(child)
    ? paths(child, `${prefix}${key}.`) : [`${prefix}${key}`]);
}

assert.deepEqual(paths(JSON.parse(en)).sort(), paths(JSON.parse(es)).sort(), 'Locale key paths diverge.');
assert.ok(source.includes(`href="./catalog.css?v=${packageVersion}"`), 'Catalog CSS cache key must match the package version.');
assert.ok(source.includes(`href="./ui-web-tokens.css?v=${packageVersion}"`), 'Token CSS cache key must match the package version.');
assert.ok(source.includes(`src="./ui-web.js?v=${packageVersion}" defer`), 'Web SDK cache key must match the package version.');
assert.ok(source.includes(`src="./catalog.js?v=${packageVersion}" defer`), 'Catalog JavaScript cache key must match the package version.');
assert.doesNotMatch(source, /<style\b|<script\b(?![^>]*\bsrc=)/i);
assert.doesNotMatch(source, /\sstyle=/i, 'The static shell must not carry inline CSS.');
assert.match(source, /<base href="\/">/, 'Nested public routes must resolve catalog assets from the public root.');
assert.match(source, /id="download" href="\/downloads\/"/, 'The catalog must expose a first-class download action.');
assert.match(source, /id="guestText"/, 'The catalog must identify anonymous visitors as guests.');
assert.doesNotMatch(source, /id="profile"|>MD<|:8080/, 'The public shell must not expose a personal profile, owner initials, or an internal port.');
assert.ok(css.length > 0 && script.length > 0, 'Separated source files must not be empty.');
assert.ok(outputs.includes('assets'), 'Build must copy local assets.');
  assert.match(distHtml, /catalog\.css/);
  assert.match(distHtml, /ui-web-tokens\.css/);
assert.match(distHtml, /ui-web\.js/);
assert.match(distHtml, /catalog\.js/);
  assert.ok(distCss.length > 0 && distJs.length > 0 && webJs.length > 0 && tokenCss.length > 0, 'Distribution bundles must not be empty.');
  assert.match(tokenCss, /--tc-switch-checked/, 'The generated catalog must load public SDK tokens.');
assert.doesNotMatch(distJs, /sourceMappingURL/);
console.log('UI catalog static verification passed.');
